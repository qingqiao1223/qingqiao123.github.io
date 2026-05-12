import Link from "next/link";
import { getAuthUser, getProfile } from "@/lib/auth";
import { createServerClient } from "@/lib/pocketbase/server";
import { formatPriceYuan } from "@/lib/utils";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function MyProductsPage() {
  const user = await getAuthUser();
  const profile = await getProfile();
  if (!user || !profile) redirect("/login?next=/me/products");

  const pb = await createServerClient();
  const result = await pb.collection("products").getList(1, 200, {
    filter: `seller_id = "${user.id}"`,
    sort: "-created",
    fields: "id,title,price,status,created",
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">我的发布</h1>
        <Link
          href="/products/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          发布商品
        </Link>
      </div>

      {profile.is_banned && (
        <p className="mt-4 text-sm text-red-600">
          账号受限期间无法发布或编辑商品。
        </p>
      )}

      {!result.items.length && (
        <p className="mt-10 text-center text-slate-600">暂无发布记录。</p>
      )}

      <ul className="mt-6 space-y-3">
        {result.items.map((p) => (
          <li
            key={p.id}
            className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <Link
                href={`/products/${p.id}`}
                className="font-medium text-slate-900 hover:text-primary"
              >
                {p.title}
              </Link>
              <p className="mt-1 text-sm text-slate-500">
                {formatPriceYuan(Number(p.price))} · {p.status}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/products/edit/${p.id}`}
                className={`rounded-lg border border-slate-300 px-3 py-1.5 text-sm ${
                  profile.is_banned
                    ? "pointer-events-none opacity-40"
                    : "hover:bg-slate-50"
                }`}
              >
                编辑
              </Link>
              <form action={`/api/products/${p.id}/status`} method="post">
                <input type="hidden" name="status" value="已下架" />
                <button
                  type="submit"
                  disabled={profile.is_banned}
                  className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-50 disabled:opacity-40"
                >
                  下架
                </button>
              </form>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
