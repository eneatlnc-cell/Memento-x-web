// WebSocket 连接 Hook
"use client";

import { useEffect, useRef, useCallback, useState } from "react";

interface WebSocketMessage {
  type: string;
  task_id: string;
  status: string;
  step_id: string;
  step_name: string;
  progress: number;
  message: string;
  timestamp: string;
}

interface UseWebSocketOptions {
  onMessage: (data: WebSocketMessage) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
}

export function useWebSocket({
  onMessage,
  onOpen,
  onClose,
  onError,
  reconnectAttempts = 3,
  reconnectInterval = 2000,
}: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectCountRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const connect = useCallback(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_BASE_URL || "ws://localhost:8000/ws";
    const userId = "web_user";
    const ws = new WebSocket(`${wsUrl}?user_id=${userId}`);

    ws.onopen = () => {
      setIsConnected(true);
      reconnectCountRef.current = 0;
      onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      onClose?.();

      // 自动重连
      if (reconnectCountRef.current < reconnectAttempts) {
        timerRef.current = setTimeout(() => {
          reconnectCountRef.current += 1;
          connect();
        }, reconnectInterval);
      }
    };

    ws.onerror = (error) => {
      onError?.(error);
    };

    wsRef.current = ws;
  }, [onMessage, onOpen, onClose, onError, reconnectAttempts, reconnectInterval]);

  useEffect(() => {
    connect();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  return { isConnected, reconnect: connect };
}