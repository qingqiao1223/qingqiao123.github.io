import Link from "next/link";
import { adminUpdateReport } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import { createServerClient } from "@/lib/pocketbase/server";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  await requireAdmin();
  const pb = await createServerClient();
  const result = await pb.collection("reports").getList(1, 200, {
    sort: "-created",
    expand: "product_id",
    fields: "id,reason,description,status,admin_note,created,handled_at,product_id,reporter_id,expand",
  });

  return (
    <main>
      <h1 className="text-2xl font-semibold text-slate-900">举报管理</h1>
      <p className="mt-2 text-sm text-slate-600">处理用户举报，记录处理说明。</p>

      <ul className="mt-6 space-y-4">
        {result.items.map((r) => {
          const product = r.expand?.product_id as
            | { title: string }
            | undefined;
          return (
            <li
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="font-medium text-slate-900">{r.reason}</p>
                  <p className="mt-1 text-sm text-slate-600">
                    商品：{" "}
                    <Link
                      href={`/products/${r.product_id}`}
                      className="text-primary hover:underline"
                    >
                      {product?.title || String(r.product_id)}
                    </Link>
                  </p>
                  {r.description && (
                    <p className="mt-2 text-sm text-slate-700">{r.description}</p>
                  )}
                  <p className="mt-2 text-xs text-slate-400">
                    举报人 {String(r.reporter_id).slice(0, 8)}… ·{" "}
                    {new Date(r.created).toLocaleString("zh-CN")} · 状态{" "}
                    {r.status}
                  </p>
                  {r.admin_note && (
                    <p className="mt-2 text-sm text-slate-600">
                      备注：{r.admin_note}
                    </p>
                  )}
                </div>
              </div>
              {r.status === "pending" && (
                <form action={adminUpdateReport} className="mt-4 space-y-2">
                  <input type="hidden" name="id" value={r.id} />
                  <label className="block text-xs font-medium text-slate-600">
                    处理说明
                  </label>
                  <textarea
                    name="admin_note"
                    rows={2}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    placeholder="可选"
                  />
                  <div className="flex flex-wrap gap-2">
                    <select
                      name="status"
                      required
                      className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
                      defaultValue="resolved"
                    >
                      <option value="resolved">已处理</option>
                      <option value="rejected">驳回</option>
                    </select>
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90"
                    >
                      提交
                    </button>
                  </div>
                </form>
              )}
            </li>
          );
        })}
      </ul>

      {!result.items.length && (
        <p className="mt-10 text-center text-slate-600">暂无举报。</p>
      )}
    </main>
  );
}
