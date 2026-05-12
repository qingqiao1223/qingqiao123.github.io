import Link from "next/link";
import { adminDeleteProduct, adminSetProductStatus } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin";
import { createServerClient } from "@/lib/pocketbase/server";
import { formatPriceYuan } from "@/lib/utils";


type SearchParams = Promise<{ page?: string }>;
const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const pb = await createServerClient();
  const result = await pb.collection("products").getList(offset + 1, PAGE_SIZE, {
    sort: "-created",
    fields: "id,title,price,status,seller_id,created",
  });

  const totalPages = Math.max(1, Math.ceil(result.totalItems / PAGE_SIZE));

  return (
    <main>
      <h1 className="text-2xl font-semibold text-slate-900">商品管理</h1>
      <p className="mt-2 text-sm text-slate-600">
        查看、下架或删除商品（共 {result.totalItems} 条）
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-3 py-2">标题</th>
              <th className="px-3 py-2">价格</th>
              <th className="px-3 py-2">状态</th>
              <th className="px-3 py-2">卖家</th>
              <th className="px-3 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((p) => (
              <tr key={p.id} className="border-b border-slate-100">
                <td className="px-3 py-2">
                  <Link
                    href={`/products/${p.id}`}
                    className="text-primary hover:underline"
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="px-3 py-2">
                  {formatPriceYuan(Number(p.price))}
                </td>
                <td className="px-3 py-2">{p.status}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-500">
                  {String(p.seller_id).slice(0, 8)}…
                </td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    {p.status !== "已下架" && (
                      <form action={adminSetProductStatus}>
                        <input type="hidden" name="id" value={p.id} />
                        <input type="hidden" name="status" value="已下架" />
                        <button
                          type="submit"
                          className="rounded border border-amber-300 px-2 py-1 text-xs text-amber-900 hover:bg-amber-50"
                        >
                          下架
                        </button>
                      </form>
                    )}
                    <form action={adminDeleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <button
                        type="submit"
                        className="rounded border border-red-300 px-2 py-1 text-xs text-red-700 hover:bg-red-50"
                      >
                        删除
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/admin/products?page=${page - 1}`}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              上一页
            </Link>
          )}
          <span className="px-3 py-2 text-sm text-slate-600">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/admin/products?page=${page + 1}`}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50"
            >
              下一页
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}
