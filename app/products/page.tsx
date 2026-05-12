import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { PRODUCT_CATEGORIES } from "@/lib/constants";
import { createServerClient } from "@/lib/pocketbase/server";
import type { ProductWithCover } from "@/types/product";
import type { ProductCategory } from "@/lib/constants";


const PAGE_SIZE = 12;

type SearchParams = Promise<{ q?: string; category?: string; page?: string }>;

function getCoverUrl(
  pb: Awaited<ReturnType<typeof createServerClient>>,
  record: { id: string; images?: string[] | null },
): string | null {
  if (!record.images?.length) return null;
  return pb.files.getUrl(record, record.images[0]);
}

type RawProduct = Record<string, unknown>;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const q = (sp.q || "").trim();
  const category = sp.category as ProductCategory | undefined;
  const page = Math.max(1, Number(sp.page) || 1);
  const offset = (page - 1) * PAGE_SIZE;

  const pb = await createServerClient();

  // Build filter
  const filters: string[] = ['status != "已下架"'];
  if (category && PRODUCT_CATEGORIES.includes(category)) {
    filters.push(`category = "${category}"`);
  }
  if (q) {
    const safe = q.replace(/"/g, '\\"');
    filters.push(
      `(title ~ "${safe}" || description ~ "${safe}")`,
    );
  }
  const filter = filters.join(" && ");

  let result: { items: Record<string, unknown>[]; totalItems: number };
  try {
    const r = await pb.collection("products").getList(offset + 1, PAGE_SIZE, {
      filter,
      sort: "-created",
      fields:
        "id,title,price,category,condition,status,view_count,created,images",
    });
    result = { items: r.items as Record<string, unknown>[], totalItems: r.totalItems };
  } catch {
    result = { items: [], totalItems: 0 };
  }

  const totalPages = Math.max(1, Math.ceil(result.totalItems / PAGE_SIZE));

  const products: ProductWithCover[] = result.items.map((row) => ({
    id: row.id as string,
    title: row.title as string,
    price: Number(row.price),
    category: row.category as ProductCategory,
    condition: row.condition as ProductWithCover["condition"],
    status: row.status as ProductWithCover["status"],
    view_count: (row.view_count as number) || 0,
    created_at: row.created as string,
    cover_url: getCoverUrl(pb, row as { id: string; images?: string[] }),
  }));

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">商品列表</h1>
          <p className="mt-1 text-sm text-slate-600">
            校内二手信息展示，线下自行联系交易。
          </p>
        </div>
        <Link
          href="/products/new"
          className="inline-flex justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          发布商品
        </Link>
      </div>

      <form
        className="mt-6 flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-end"
        method="get"
      >
        <div className="min-w-[200px] flex-1">
          <label className="text-xs font-medium text-slate-600">搜索</label>
          <input
            name="q"
            defaultValue={q}
            placeholder="标题或描述"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          />
        </div>
        <div className="w-full sm:w-48">
          <label className="text-xs font-medium text-slate-600">分类</label>
          <select
            name="category"
            defaultValue={category || ""}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          >
            <option value="">全部分类</option>
            {PRODUCT_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          筛选
        </button>
      </form>

      {result.items.length === 0 && !filter && (
        <p className="mt-10 text-center text-slate-600">
          暂无商品。
        </p>
      )}

      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={pageUrl(page - 1)}
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
              href={pageUrl(page + 1)}
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
