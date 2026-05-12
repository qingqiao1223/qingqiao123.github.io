"use client";

import { createClient } from "@/lib/pocketbase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agree) {
      setError("请先阅读并同意用户协议与隐私政策");
      return;
    }
    setLoading(true);
    try {
      const pb = createClient();
      await pb.collection("users").create({
        email: email.trim(),
        password,
        passwordConfirm: password,
        nickname: nickname.trim() || undefined,
      });
      await pb.collection("users").authWithPassword(email.trim(), password);
      document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
      router.refresh();
      router.push("/products");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "注册失败，请稍后重试";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 py-12">
      <h1 className="text-2xl font-semibold text-slate-900">注册</h1>
      <p className="mt-2 text-sm text-slate-600">
        已有账号？{" "}
        <Link href="/login" className="text-primary hover:underline">
          登录
        </Link>
      </p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">
            昵称（可选）
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            邮箱
          </label>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">
            密码（至少 6 位）
          </label>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          />
        </div>
        <label className="flex items-start gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="mt-1"
          />
          <span>
            我已阅读并同意
            <Link href="/terms" className="mx-1 text-primary hover:underline">
              用户协议
            </Link>
            与
            <Link href="/privacy" className="mx-1 text-primary hover:underline">
              隐私政策
            </Link>
          </span>
        </label>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "注册中…" : "注册"}
        </button>
      </form>
    </main>
  );
}
