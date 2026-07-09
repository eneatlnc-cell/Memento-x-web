"use client";

import { useWebSocket } from "@/lib/websocket/useWebSocket";
import { useState } from "react";

export function StatusBar() {
  const [localStatus, setLocalStatus] = useState({ online: true, gpu: "RTX 4090", queue: 0 });

  // NOTE: useWebSocket 当前仅分发 task_update 类型消息，
  // local_status 消息需要扩展 hook 后才能接收。
  useWebSocket("status_bar", (data) => {
    if ((data as any).type === "local_status") {
      setLocalStatus({
        online: (data as any).status === "online",
        gpu: (data as any).gpu || "RTX 4090",
        queue: (data as any).queue || 0,
      });
    }
  });

  return (
    <footer className="fixed bottom-0 right-0 left-56 z-30 h-8 border-t border-border bg-card flex items-center justify-between px-6 text-xs text-muted-foreground">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${localStatus.online ? "bg-success" : "bg-error"}`} />
          本地服务: {localStatus.online ? "在线" : "离线"}
        </span>
        <span>|</span>
        <span>GPU: {localStatus.gpu}</span>
      </div>
      <div className="flex items-center gap-4">
        <span>任务队列: {localStatus.queue}</span>
        <span>|</span>
        <span>WebSocket 已连接</span>
      </div>
    </footer>
  );
}