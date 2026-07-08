"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BellIcon, PlayIcon, StopIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { useLocalStore } from "@/lib/store/localStore";
import { useEffect } from "react";

export function TopBar() {
  const status = useLocalStore((s) => s.status);
  const activeTasks = useLocalStore((s) => s.activeTasks);
  const checkHealth = useLocalStore((s) => s.checkHealth);
  const startTool = useLocalStore((s) => s.startTool);
  const stopTool = useLocalStore((s) => s.stopTool);

  // 定期健康检查
  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const statusColor =
    status === "online" ? "bg-[#00C48C]" :
    status === "running" ? "bg-[#FFB347]" :
    "bg-[#888]";

  const statusLabel =
    status === "running" ? `任务执行中 (${activeTasks})` :
    status === "online" ? "本地工具在线" :
    status === "offline" ? "本地工具离线" : "检测中...";

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">AI 视频编辑工作台</span>
      </div>

      <div className="flex items-center gap-3">
        {/* 本地工具状态 + 启动/停止按钮 */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColor} ${status === "running" ? "animate-pulse" : ""}`} />
          <span className="text-xs text-muted-foreground">{statusLabel}</span>
          {status === "offline" || status === "unknown" ? (
            <Button variant="outline" size="sm" onClick={startTool} className="h-7 gap-1 text-xs">
              <PlayIcon className="w-3 h-3" />
              启动本地工具
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={stopTool} className="h-7 w-7">
              <StopIcon className="w-3 h-3" />
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full" />
        </Button>

        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
            MX
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}