import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getAuthUser, getProfile } from "@/lib/auth";
import { createServerClient } from "@/lib/pocketbase/server";
import type { ProductCategory } from "@/lib/constants";
import type { ProductWithCover } from "@/types/product";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MyFavoritesPage() {
  const user = await getAuthUser();
  const profile = await getProfile();
  if (!user || !profile) redirect("/login?next=/me/favorites");

  const pb = await createServerClient();

  // Get all favorites with product data
  const favResult = await pb.collection("favorites").getList(1, 200, {
    filter: `user_id = "${user.id}"`,
    sort: "-created",
    expand: "product_id",
    fields: "id,created,expand",
  });

  const products: ProductWithCover[] = favResult.items
    .map((row) => {
      const p = row.expand?.product_id as Record<string, unknown> | undefined;
      if (!p) return null;
      return {
        id: p.id as string,
        title: p.title as string,
        price: Number(p.price),
        category: p.category as ProductCategory,
        condition: p.condition as ProductWithCover["condition"],
        status: p.status as ProductWithCover["status"],
        view_count: (p.view_count as number) || 0,
        created_at: (p.created as string) || "",
        cover_url: (p.images as string[])?.length
          ? pb.files.getUrl(
              { id: p.id, collectionId: p.collectionId as string } as never,
              (p.images as string[])[0],
            )
          : null,
      };
    })
    .filter(Boolean) as ProductWithCover[];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-slate-900">我的收藏</h1>
      {profile.is_banned && (
        <p className="mt-4 text-sm text-red-600">
          账号受限期间无法新增收藏，已收藏的条目仍可查看。
        </p>
      )}
      {!products.length && (
        <p className="mt-10 text-center text-slate-600">
          暂无收藏。去{" "}
          <Link href="/products" className="text-primary hover:underline">
            商品列表
          </Link>{" "}
          看看。
        </p>
      )}
      <ul className="mt-6 grid gap-4 sm:grid-cols-2">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </main>
  );
}
