"use client";

import { useEffect, useRef, useCallback } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000/ws";

type TaskUpdateCallback = (data: {
  task_id: string;
  status: string;
  steps: Array<{ id: string; action: string; status: string }>;
  progress: number;
  result_url?: string;
}) => void;

export function useWebSocket(userId: string, onTaskUpdate: TaskUpdateCallback) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout>>();
  const onUpdateRef = useRef(onTaskUpdate);

  // 保持回调最新
  onUpdateRef.current = onTaskUpdate;

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(`${WS_URL}?token=${encodeURIComponent(userId)}`);
    wsRef.current = ws;

    ws.onopen = () => console.log("[WS] 已连接");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "task_update") onUpdateRef.current(data);
      } catch { /* ignore */ }
    };
    ws.onclose = () => {
      console.log("[WS] 断开，3s 后重连...");
      reconnectTimer.current = setTimeout(connect, 3000);
    };
    ws.onerror = () => ws.close();
  }, [userId]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      wsRef.current?.close();
    };
  }, [connect]);
}