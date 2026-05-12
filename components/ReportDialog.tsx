"use client";

import { createClient } from "@/lib/pocketbase/client";
import { REPORT_REASONS, type ReportReason } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReportDialog({
  productId,
  disabled,
}: {
  productId: string;
  disabled?: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>(REPORT_REASONS[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (disabled || loading) return;
    setError(null);
    setLoading(true);
    const pb = createClient();
    if (!pb.authStore.isValid) {
      setLoading(false);
      setError("请先登录");
      return;
    }
    try {
      await pb.collection("reports").create({
        reporter_id: pb.authStore.model!.id,
        product_id: productId,
        reason,
        description: description.trim() || null,
        status: "pending",
      });
      setOpen(false);
      setDescription("");
      router.refresh();
      alert("举报已提交，管理员会尽快处理。");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "提交失败";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
      >
        举报
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[90vh] w-full max-w-md overflow-auto rounded-xl bg-white p-4 shadow-lg">
            <h3 className="text-lg font-semibold text-slate-900">举报商品</h3>
            <p className="mt-1 text-sm text-slate-600">
              请如实填写，恶意举报可能被限制使用。
            </p>
            <label className="mt-4 block text-sm font-medium text-slate-700">
              原因
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            >
              {REPORT_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <label className="mt-3 block text-sm font-medium text-slate-700">
              说明（可选）
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                取消
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={submit}
                className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? "提交中…" : "提交"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
