"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/utils";
import type { Task } from "@/lib/store/taskStore";
import { CheckCircleIcon, XCircleIcon, ClockIcon, Loader2 } from "lucide-react";

interface TaskHistoryProps {
  tasks: Task[];
  onSelect: (task: Task) => void;
}

export function TaskHistory({ tasks, onSelect }: TaskHistoryProps) {
  if (tasks.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-primary font-mono">历史任务</span>
        <span className="text-xs text-muted-foreground">({tasks.length})</span>
      </div>

      <ScrollArea className="max-h-64">
        <div className="space-y-2">
          {tasks.map((task) => (
            <button
              key={task.id}
              onClick={() => onSelect(task)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary transition-colors text-left"
            >
              {task.status === "completed" ? (
                <CheckCircleIcon className="w-4 h-4 text-success flex-shrink-0" />
              ) : task.status === "failed" ? (
                <XCircleIcon className="w-4 h-4 text-error flex-shrink-0" />
              ) : task.status === "running" ? (
                <Loader2 className="w-4 h-4 text-primary animate-spin flex-shrink-0" />
              ) : (
                <ClockIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">
                  任务 {task.id.slice(-6)} · {task.userInput.slice(0, 30)}...
                </p>
              </div>

              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] flex-shrink-0",
                  task.status === "completed" && "border-success text-success",
                  task.status === "failed" && "border-error text-error",
                  task.status === "running" && "border-primary text-primary",
                )}
              >
                {task.status === "completed" ? "已完成" : task.status === "failed" ? "失败" : task.status === "running" ? "运行中" : "等待中"}
              </Badge>

              <span className="text-xs text-muted-foreground flex-shrink-0 w-16 text-right">
                {formatRelativeTime(task.createdAt)}
              </span>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}