"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { useWebSocket } from "@/lib/websocket/useWebSocket";
import { useAuthStore } from "@/lib/store/authStore";
import { AssetSelector } from "@/components/task/AssetSelector";
import { TargetSelector } from "@/components/task/TargetSelector";
import { ExecutionProgress } from "@/components/task/ExecutionProgress";
import { TaskHistory } from "@/components/task/TaskHistory";
import { useTaskStore, type Task } from "@/lib/store/taskStore";

interface Asset {
  asset_id: string;
  name: string;
  type: string;
  duration: number | null;
  thumbnail_url: string | null;
}

interface TaskStep { id: string; action: string; status: string; }

export default function TaskCenterPage() {
  const userId = useAuthStore((s) => s.userId) || "web_user";
  const { tasks, addTask } = useTaskStore();

  // ── 三步流程状态 ──
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<"person" | "background" | "object" | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);

  // ── 任务执行状态 ──
  const [currentTaskId, setCurrentTaskId] = useState<string | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>("idle");
  const [taskSteps, setTaskSteps] = useState<TaskStep[]>([]);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  // ── 加载素材列表 ──
  useEffect(() => {
    apiClient.getAssetList().then(setAssets).catch(() => {});
  }, []);

  // ── WebSocket 实时进度 ──
  const onTaskUpdate = useCallback((data: { task_id: string; status: string; steps: TaskStep[]; progress: number; result_url?: string }) => {
    if (data.task_id === currentTaskId) {
      setTaskStatus(data.status);
      setTaskSteps(data.steps);
      setProgress(data.progress);
      if (data.result_url) setResultUrl(data.result_url);
    }
  }, [currentTaskId]);

  useWebSocket(userId, onTaskUpdate);

  // ── 执行任务 ──
  const handleExecute = async () => {
    if (!selectedAsset || !selectedTarget) return;
    setStep(3);
    setTaskStatus("submitting");
    try {
      const userInput = `${selectedTarget === "person" ? "替换人物" : selectedTarget === "background" ? "替换背景" : "替换物体"}`;
      const res = await apiClient.dispatchWorkflow(userInput, [
        { id: selectedAsset.asset_id, name: selectedAsset.name, type: selectedAsset.type },
      ]);
      setCurrentTaskId(res.task_id);
      setTaskStatus("running");
    } catch (err) {
      setTaskStatus("error");
    }
  };

  // ── 重置流程 ──
  const handleReset = () => {
    setStep(1);
    setSelectedAsset(null);
    setSelectedTarget(null);
    setCurrentTaskId(null);
    setTaskStatus("idle");
    setTaskSteps([]);
    setProgress(0);
    setResultUrl(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── 进度指示器 ── */}
      <div className="flex items-center gap-3 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              step >= s ? "bg-[#6C5CE7] text-white" : "bg-[#1E1E3A] text-[#888]"
            }`}>{s}</div>
            <span className={`text-sm ${step >= s ? "text-white" : "text-[#888]"}`}>
              {s === 1 ? "选择素材" : s === 2 ? "选择目标" : "执行"}
            </span>
            {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-[#6C5CE7]" : "bg-[#1E1E3A]"}`} />}
          </div>
        ))}
      </div>

      {/* ── 步骤 1：选择素材 ── */}
      {step === 1 && (
        <AssetSelector
          assets={assets}
          selected={selectedAsset}
          onSelect={(asset) => { setSelectedAsset(asset); setStep(2); }}
        />
      )}

      {/* ── 步骤 2：选择目标 ── */}
      {step === 2 && selectedAsset && (
        <TargetSelector
          asset={selectedAsset}
          selected={selectedTarget}
          onSelect={(target) => setSelectedTarget(target)}
          onBack={() => setStep(1)}
          onExecute={handleExecute}
        />
      )}

      {/* ── 步骤 3：执行进度 ── */}
      {step === 3 && (
        <div className="space-y-6">
          <ExecutionProgress
            taskId={currentTaskId}
            status={taskStatus}
            steps={taskSteps}
            progress={progress}
            resultUrl={resultUrl}
          />
          {taskStatus === "completed" || taskStatus === "error" ? (
            <button onClick={handleReset}
              className="w-full py-3 border border-[#1E1E3A] text-[#888] hover:text-white hover:border-[#6C5CE7] rounded-lg transition-colors">
              开始新任务
            </button>
          ) : null}
        </div>
      )}

      {/* ── 任务历史 ── */}
      <div className="pt-8 border-t border-[#1E1E3A]">
        <TaskHistory
          tasks={tasks}
          onSelect={(task) => {
            setCurrentTaskId(task.id);
            setTaskStatus(task.status);
            setTaskSteps(task.steps);
            setProgress(task.progress);
            if (task.resultUrl) setResultUrl(task.resultUrl);
            setStep(3);
          }}
        />
      </div>
    </div>
  );
}