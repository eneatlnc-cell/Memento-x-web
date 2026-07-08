// 本地工具状态管理 — Zustand
"use client";

import { create } from "zustand";

type LocalStatus = "unknown" | "online" | "offline" | "running";

interface LocalState {
  status: LocalStatus;
  activeTasks: number;
  port: number;
  setStatus: (status: LocalStatus) => void;
  checkHealth: () => Promise<void>;
  startTool: () => void;
  stopTool: () => void;
}

const LOCAL_API_URL = "http://127.0.0.1:8000";

export const useLocalStore = create<LocalState>((set, get) => ({
  status: "unknown",
  activeTasks: 0,
  port: 8000,

  setStatus: (status) => set({ status }),

  checkHealth: async () => {
    try {
      // 1. 健康检查
      const healthRes = await fetch(`${LOCAL_API_URL}/health`, {
        signal: AbortSignal.timeout(2000),
      });
      if (!healthRes.ok) {
        set({ status: "offline", activeTasks: 0 });
        return;
      }

      // 2. 查询活跃任务数
      try {
        const statusRes = await fetch(`${LOCAL_API_URL}/status`, {
          signal: AbortSignal.timeout(1000),
        });
        if (statusRes.ok) {
          const data = await statusRes.json();
          const active = data.active_tasks || 0;
          set({ status: active > 0 ? "running" : "online", activeTasks: active });
          return;
        }
      } catch {
        // /status 端点可能不可用，回退到 online
      }

      set({ status: "online", activeTasks: 0 });
    } catch {
      set({ status: "offline", activeTasks: 0 });
    }
  },

  startTool: () => {
    try {
      window.open("memento://start", "_blank");
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        await get().checkHealth();
        if (get().status === "online" || get().status === "running" || attempts >= 20) {
          clearInterval(interval);
        }
      }, 1000);
    } catch {
      // 协议未注册时静默失败
    }
  },

  stopTool: () => {
    try {
      window.open("memento://stop", "_blank");
      set({ status: "offline", activeTasks: 0 });
    } catch {
      // 静默失败
    }
  },
}));