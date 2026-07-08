"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/authStore";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 允许访问 auth 页面
    if (pathname.startsWith("/login") || pathname.startsWith("/register")) return;
    // 未登录 → 跳转登录页
    if (!isLoggedIn) {
      router.replace("/login");
    }
  }, [isLoggedIn, pathname, router]);

  // 已登录或者在 auth 页面 → 渲染
  if (isLoggedIn || pathname.startsWith("/login") || pathname.startsWith("/register")) {
    return <>{children}</>;
  }

  // 未登录且不在 auth 页面 → 显示空白（等待跳转）
  return null;
}