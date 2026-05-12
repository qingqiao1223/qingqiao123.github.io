"use client";

import { createClient } from "@/lib/pocketbase/client";
import type { Profile } from "@/types/database";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ProfileSettingsForm({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [nickname, setNickname] = useState(profile.nickname);
  const [wechat, setWechat] = useState(profile.wechat ?? "");
  const [qq, setQq] = useState(profile.qq ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [contactNote, setContactNote] = useState(profile.contact_note ?? "");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const pb = createClient();
    if (!pb.authStore.isValid) {
      setLoading(false);
      return;
    }
    try {
      await pb.collection("users").update(pb.authStore.model!.id, {
        nickname: nickname.trim() || "用户",
        wechat: wechat.trim() || null,
        qq: qq.trim() || null,
        phone: phone.trim() || null,
        contact_note: contactNote.trim() || null,
      });
      router.refresh();
      alert("已保存");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "保存失败";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium text-slate-700">昵称</label>
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">微信号</label>
        <input
          value={wechat}
          onChange={(e) => setWechat(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">QQ</label>
        <input
          value={qq}
          onChange={(e) => setQq(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">手机号</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-slate-700">联系说明</label>
        <textarea
          value={contactNote}
          onChange={(e) => setContactNote(e.target.value)}
          rows={3}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
      >
        {loading ? "保存中…" : "保存"}
      </button>
    </form>
  );
}
