// 认证状态管理 — Zustand + localStorage
"use client";

import { create } from "zustand";

interface AuthState {
  token: string | null;
  userId: string | null;
  isLoggedIn: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
  getToken: () => string | null;
}

export const useAuthStore = create<AuthState>((set, get) => {
  // 从 localStorage 恢复登录状态
  const storedToken =
    typeof window !== "undefined" ? localStorage.getItem("memento_token") : null;
  const storedUserId =
    typeof window !== "undefined" ? localStorage.getItem("memento_user_id") : null;

  return {
    token: storedToken,
    userId: storedUserId,
    isLoggedIn: !!storedToken,

    login: (token: string, userId: string) => {
      localStorage.setItem("memento_token", token);
      localStorage.setItem("memento_user_id", userId);
      set({ token, userId, isLoggedIn: true });
    },

    logout: () => {
      localStorage.removeItem("memento_token");
      localStorage.removeItem("memento_user_id");
      set({ token: null, userId: null, isLoggedIn: false });
    },

    getToken: () => get().token,
  };
});