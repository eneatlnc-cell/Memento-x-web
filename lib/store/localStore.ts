// 本地工具状态管理 — Zustand
"use client";

import { create } from "zustand";

type LocalStatus = "unknown" | "online" | "offline" | "running";

interface LocalState {
  status: LocalStatus;
  port: number;
  setStatus: (status: LocalStatus) => void;
  checkHealth: () => Promise<void>;
  startTool: () => void;
  stopTool: () => void;
}

const LOCAL_API_URL = "http://127.0.0.1:8000";

export const useLocalStore = create<LocalState>((set, get) => ({
  status: "unknown",
  port: 8000,

  setStatus: (status) => set({ status }),

  checkHealth: async () => {
    try {
      const res = await fetch(`${LOCAL_API_URL}/health`, { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        set({ status: "online" });
      } else {
        set({ status: "offline" });
      }
    } catch {
      set({ status: "offline" });
    }
  },

  startTool: () => {
    // 触发 memento:// 协议 → 启动本地服务
    try {
      window.open("memento://start", "_blank");
      // 等待服务启动后轮询健康检查
      let attempts = 0;
      const interval = setInterval(async () => {
        attempts++;
        await get().checkHealth();
        if (get().status === "online" || attempts >= 20) {
          clearInterval(interval);
        }
      }, 1000);
    } catch {
      // 协议未注册时静默失败，UI 会显示离线状态
    }
  },

  stopTool: () => {
    try {
      window.open("memento://stop", "_blank");
      set({ status: "offline" });
    } catch {
      // 静默失败
    }
  },
}));