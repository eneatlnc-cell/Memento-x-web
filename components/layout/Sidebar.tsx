"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/authStore";

const items = [
  { href: "/", label: "任务中心", icon: "T" },
  { href: "/assets", label: "素材库", icon: "A" },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const userId = useAuthStore((s) => s.userId);

  return (
    <aside className="fixed left-0 top-0 h-full w-56 bg-[#0A0A0F] border-r border-[#1E1E3A] flex flex-col z-40">
      {/* 品牌 */}
      <div className="h-14 flex items-center px-5 border-b border-[#1E1E3A]">
        <span className="text-lg font-bold text-white tracking-tight">Memento</span>
      </div>

      {/* 导航 */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[#6C5CE7]/20 text-[#6C5CE7]"
                  : "text-[#888] hover:text-white hover:bg-[#12121F]"
              }`}
            >
              <span className="w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold bg-[#1E1E3A]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* 用户信息 */}
      <div className="px-5 py-4 border-t border-[#1E1E3A]">
        <p className="text-xs text-[#555] truncate">{userId || "未登录"}</p>
        <button onClick={logout} className="text-xs text-[#888] hover:text-white mt-1 transition-colors">
          退出登录
        </button>
      </div>
    </aside>
  );
}