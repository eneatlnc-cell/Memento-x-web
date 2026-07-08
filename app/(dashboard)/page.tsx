"use client";

import { useState, useCallback } from "react";
import { InputPanel } from "@/components/task/InputPanel";
import { WorkflowPreview } from "@/components/task/WorkflowPreview";
import { ExecutionProgress } from "@/components/task/ExecutionProgress";
import { TaskHistory } from "@/components/task/TaskHistory";
import { useTaskStore, type Task, type TaskStep } from "@/lib/store/taskStore";
import { apiClient } from "@/lib/api/client";
import { useWebSocket } from "@/lib/websocket/useWebSocket";

export default function TaskCenterPage() {
  const { tasks, currentTask, addTask, updateTask, setCurrentTask, updateTaskProgress } = useTaskStore();
  const [isLoading, setIsLoading] = useState(false);
  const [workflow, setWorkflow] = useState<{
    version: string;
    workflow_id: string;
    steps: Array<{ id: string; action: string; params: Record<string, unknown> }>;
  } | null>(null);

  // WebSocket 实时更新
  useWebSocket({
    onMessage: (data) => {
      if (data.type === "task_update" && data.task_id) {
        updateTaskProgress(
          data.task_id,
          data.progress,
          data.step_name,
          // Keep existing steps, update the current one
          currentTask?.steps.map((s) =>
            s.id === data.step_id ? { ...s, status: "running" as const } : s,
          ) || [],
        );
      }
    },
  });

  const handleSubmit = useCallback(async (input: string) => {
    setIsLoading(true);

    const taskId = `task_${Date.now().toString(36)}`;
    const newTask: Task = {
      id: taskId,
      userInput: input,
      status: "understanding",
      progress: 0,
      currentStep: "理解意图...",
      steps: [],
      resultUrl: null,
      createdAt: new Date(),
    };
    addTask(newTask);

    try {
      // 1. 意图理解
      const result = await apiClient.understandIntent(input);
      if (!result.success) throw new Error("意图理解失败");

      setWorkflow(result.workflow);
      updateTask(taskId, {
        status: "preview",
        currentStep: "工作流已生成",
        steps: result.workflow.steps.map((s) => ({
          id: s.id,
          action: s.action,
          status: "pending" as const,
        })),
      });

      // 2. 任务派发
      updateTask(taskId, { status: "dispatched", currentStep: "派发任务..." });
      const dispatchResult = await apiClient.dispatchWorkflow(result.workflow);
      if (!dispatchResult.success) throw new Error("任务派发失败");

      updateTask(taskId, { status: "running", currentStep: "执行中..." });

      // 3. 轮询任务状态
      const pollInterval = setInterval(async () => {
        try {
          const statusResult = await apiClient.getTaskStatus(taskId);
          updateTaskProgress(taskId, statusResult.progress, statusResult.current_step, statusResult.steps as TaskStep[]);

          if (statusResult.status === "completed") {
            clearInterval(pollInterval);
            updateTask(taskId, { status: "completed", resultUrl: statusResult.result_url });
          } else if (statusResult.status === "failed") {
            clearInterval(pollInterval);
            updateTask(taskId, { status: "failed" });
          }
        } catch {
          // 轮询失败不中断
        }
      }, 2000);

      // 清理
      setTimeout(() => clearInterval(pollInterval), 600000); // 10 分钟超时
    } catch (error) {
      updateTask(taskId, {
        status: "failed",
        currentStep: error instanceof Error ? error.message : "执行失败",
      });
    } finally {
      setIsLoading(false);
    }
  }, [addTask, updateTask, updateTaskProgress]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <InputPanel onSubmit={handleSubmit} isLoading={isLoading} />

      <WorkflowPreview workflow={workflow} />

      {currentTask && (
        <ExecutionProgress
          progress={currentTask.progress}
          currentStep={currentTask.currentStep}
          steps={currentTask.steps}
          status={currentTask.status}
          resultUrl={currentTask.resultUrl}
        />
      )}

      <TaskHistory
        tasks={tasks}
        onSelect={(task) => {
          setCurrentTask(task);
          if (task.steps.length > 0) {
            setWorkflow(null);
          }
        }}
      />
    </div>
  );
}