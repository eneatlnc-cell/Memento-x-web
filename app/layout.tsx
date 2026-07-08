import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthGuard } from "@/components/auth/AuthGuard";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Memento-X — AI 视频编辑工作台",
  description: "Memento-X Web 前端 — 选素材 → 选目标 → 点执行",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="dark">
      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        <AuthGuard>{children}</AuthGuard>
      </body>
    </html>
  );
}