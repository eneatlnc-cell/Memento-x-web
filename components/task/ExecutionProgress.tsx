"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CheckCircleIcon, Loader2, ClockIcon, XCircleIcon } from "lucide-react";
import type { TaskStep } from "@/lib/store/taskStore";

interface ExecutionProgressProps {
  progress: number;
  currentStep: string;
  steps: TaskStep[];
  status: string;
  resultUrl: string | null;
}

const statusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircleIcon className="w-4 h-4 text-success" />;
    case "running":
      return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    case "failed":
      return <XCircleIcon className="w-4 h-4 text-error" />;
    default:
      return <ClockIcon className="w-4 h-4 text-muted-foreground" />;
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "completed": return "完成";
    case "running": return "执行中...";
    case "failed": return "失败";
    default: return "等待中";
  }
};

const stepNameMap: Record<string, string> = {
  scene_edit: "SVG场景编辑",
  track: "遮罩追踪",
  replace: "主体替换",
  composite: "合成",
  export: "导出",
  analyze: "分析",
  generate: "生成",
  refine: "精修",
};

export function ExecutionProgress({ progress, currentStep, steps, status, resultUrl }: ExecutionProgressProps) {
  if (steps.length === 0 && status === "idle") return null;

  return (
    <div className="rounded-xl border border-border bg-card p-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-primary font-mono">执行进度</span>
        <Badge variant="outline" className={cn(
          "text-[10px]",
          status === "running" && "border-primary text-primary",
          status === "completed" && "border-success text-success",
          status === "failed" && "border-error text-error",
        )}>
          {status === "running" ? "运行中" : status === "completed" ? "已完成" : status === "failed" ? "失败" : "等待中"}
        </Badge>
      </div>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground">{currentStep || "准备中..."}</span>
          <span className="text-sm font-mono text-muted-foreground">{progress}%</span>
        </div>
        <Progress
          value={progress}
          className="h-2 bg-secondary [&>div]:bg-primary [&>div]:transition-all [&>div]:duration-700"
        />
      </div>

      {/* 步骤列表 */}
      <div className="space-y-1.5">
        {steps.map((step, i) => (
          <div
            key={step.id}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
              step.status === "running" && "bg-primary/5 border border-primary/20",
            )}
          >
            <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[10px] text-muted-foreground font-bold">
              {i + 1}
            </span>
            {statusIcon(step.status)}
            <span className={cn(
              "flex-1",
              step.status === "completed" && "text-foreground",
              step.status === "running" && "text-primary font-medium",
              step.status === "failed" && "text-error",
              step.status === "pending" && "text-muted-foreground",
            )}>
              {stepNameMap[step.action] || step.action}
            </span>
            <span className="text-xs text-muted-foreground">{statusLabel(step.status)}</span>
          </div>
        ))}
      </div>

      {/* 成片下载 */}
      {resultUrl && (
        <div className="mt-4 pt-4 border-t border-border">
          <a
            href={resultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <CheckCircleIcon className="w-4 h-4" />
            下载成片
          </a>
        </div>
      )}
    </div>
  );
}