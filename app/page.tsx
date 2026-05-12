import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { createServerClient } from "@/lib/pocketbase/server";
import type { ProductCategory } from "@/lib/constants";
import type { ProductWithCover } from "@/types/product";

export const dynamic = "force-dynamic";

function getCoverUrl(
  pb: Awaited<ReturnType<typeof createServerClient>>,
  record: { id: string; images?: string[] },
): string | null {
  if (!record.images?.length) return null;
  return pb.files.getUrl(record, record.images[0]);
}

export default async function HomePage() {
  const pb = await createServerClient();
  let items: Record<string, unknown>[] = [];
  try {
    const result = await pb.collection("products").getList(1, 6, {
      filter: 'status = "在售"',
      sort: "-created",
      fields:
        "id,title,price,category,condition,status,view_count,created,images",
    });
    items = result.items as Record<string, unknown>[];
  } catch {
    // Database not available - show empty state
  }

  const products: ProductWithCover[] = items.map((row) => ({
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

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      {/* Hero */}
      <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
          校园二手信息
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          发布闲置、浏览校内商品。平台不参与付款与物流，请优先选择校内公共场所当面交易，谨防诈骗。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            浏览全部商品
          </Link>
          <Link
            href="/safety"
            className="inline-flex rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            交易安全提示
          </Link>
        </div>
      </section>

      {/* Recent products */}
      <section className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            最新在售商品
          </h2>
          <Link
            href="/products"
            className="text-sm text-primary hover:underline"
          >
            查看全部 →
          </Link>
        </div>

        {products.length === 0 && (
          <p className="mt-8 text-center text-slate-500">
            暂无商品。{" "}
            <Link href="/products/new" className="text-primary hover:underline">
              发布第一个商品
            </Link>
          </p>
        )}

        {products.length > 0 && (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {products.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Quick links */}
      <section className="mt-10 grid gap-4 sm:grid-cols-3">
        <Link
          href="/products"
          className="rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/40"
        >
          <h3 className="font-medium text-slate-900">浏览商品</h3>
          <p className="mt-1 text-sm text-slate-600">按分类筛选，找到需要的东西</p>
        </Link>
        <Link
          href="/products/new"
          className="rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/40"
        >
          <h3 className="font-medium text-slate-900">发布闲置</h3>
          <p className="mt-1 text-sm text-slate-600">快速拍照上架，让闲置流动起来</p>
        </Link>
        <Link
          href="/safety"
          className="rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/40"
        >
          <h3 className="font-medium text-slate-900">交易安全</h3>
          <p className="mt-1 text-sm text-slate-600">当面交易，谨防诈骗</p>
        </Link>
      </section>
    </main>
  );
}
