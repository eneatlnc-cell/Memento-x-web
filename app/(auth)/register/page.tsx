"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/authStore";

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("两次密码不一致"); return; }
    if (password.length < 6) { setError("密码至少 6 位"); return; }
    setLoading(true);
    try {
      const res = await apiClient.register(email, password);
      login(res.access_token, email);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#6C5CE7]/20 mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6C5CE7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <line x1="19" y1="8" x2="19" y2="14" />
              <line x1="22" y1="11" x2="16" y2="11" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">创建账户</h1>
          <p className="text-sm text-[#888888] mt-2">注册 Memento 账户，开始创作</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#888888] mb-1.5">邮箱</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              placeholder="your@email.com"
              className="w-full px-4 py-3 bg-[#12121F] border border-[#1E1E3A] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-[#6C5CE7] transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1.5">密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              placeholder="至少 6 位"
              className="w-full px-4 py-3 bg-[#12121F] border border-[#1E1E3A] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-[#6C5CE7] transition-colors" />
          </div>
          <div>
            <label className="block text-sm text-[#888888] mb-1.5">确认密码</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required
              placeholder="再次输入密码"
              className="w-full px-4 py-3 bg-[#12121F] border border-[#1E1E3A] rounded-lg text-white placeholder-[#555] focus:outline-none focus:border-[#6C5CE7] transition-colors" />
          </div>

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full py-3 bg-[#6C5CE7] hover:bg-[#5A4BD1] disabled:opacity-50 text-white font-medium rounded-lg transition-colors">
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="text-center text-sm text-[#888888] mt-6">
          已有账户？{" "}
          <Link href="/login" className="text-[#6C5CE7] hover:underline">登录</Link>
        </p>
      </div>
    </div>
  );
}