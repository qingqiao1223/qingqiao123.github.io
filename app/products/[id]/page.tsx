import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportDialog } from "@/components/ReportDialog";
import { FavoriteToggle } from "@/components/FavoriteToggle";
import { createServerClient } from "@/lib/pocketbase/server";
import { getAuthUser, getProfile } from "@/lib/auth";
import { formatPriceYuan } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

export default async function ProductDetailPage({ params }: { params: Params }) {
  const { id } = await params;
  const pb = await createServerClient();
  const user = await getAuthUser();
  const viewerProfile = user ? await getProfile() : null;

  let product;
  try {
    product = await pb.collection("products").getOne(id);
  } catch {
    notFound();
  }

  const isAdmin = Boolean(viewerProfile?.is_admin);
  const isOwner = user?.id === product.seller_id;

  // Check if favorited (only for 已下架 by non-owner/admin)
  let favorited = false;
  if (user && product.status === "已下架") {
    try {
      const favRecords = await pb.collection("favorites").getList(1, 1, {
        filter: `user_id = "${user.id}" && product_id = "${id}"`,
      });
      favorited = favRecords.totalItems > 0;
    } catch {
      // ignore
    }
  }

  if (product.status === "已下架" && !isOwner && !isAdmin && !favorited) {
    notFound();
  }

  // Increment view count
  await pb.collection("products").update(id, {
    view_count: (product.view_count || 0) + 1,
  });
  product.view_count = (product.view_count || 0) + 1;

  // Build image URLs from PocketBase files
  const images: { id: string; image_url: string }[] = (
    product.images || []
  ).map((filename: string) => ({
    id: filename,
    image_url: pb.files.getUrl(product, filename),
  }));

  // Fetch seller profile (PocketBase user record has custom fields)
  let sellerRow: Record<string, string | null> | null = null;
  try {
    const raw = await pb.collection("users").getOne(product.seller_id);
    sellerRow = {
      nickname: String(raw.nickname ?? "未设置"),
      wechat: raw.wechat ? String(raw.wechat) : null,
      qq: raw.qq ? String(raw.qq) : null,
      phone: raw.phone ? String(raw.phone) : null,
      contact_note: raw.contact_note ? String(raw.contact_note) : null,
    };
  } catch {
    // seller may be deleted
  }

  let isFavorite = false;
  if (user && !viewerProfile?.is_banned) {
    try {
      const favRecords = await pb.collection("favorites").getList(1, 1, {
        filter: `user_id = "${user.id}" && product_id = "${id}"`,
      });
      isFavorite = favRecords.totalItems > 0;
    } catch {
      // ignore
    }
  }

  const canContact = Boolean(user && !viewerProfile?.is_banned);
  const canInteract = Boolean(user && !viewerProfile?.is_banned);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <Link href="/products" className="text-sm text-primary hover:underline">
        ← 返回列表
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            {product.title}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {product.category} · {product.condition} · 浏览 {product.view_count}
          </p>
        </div>
        {canInteract && (
          <div className="flex flex-wrap gap-2">
            <FavoriteToggle
              productId={id}
              initialFavorite={isFavorite}
              disabled={viewerProfile?.is_banned}
            />
            <ReportDialog
              productId={id}
              disabled={viewerProfile?.is_banned}
            />
          </div>
        )}
      </div>

      <p className="mt-4 text-2xl font-semibold text-primary">
        {formatPriceYuan(Number(product.price))}
      </p>
      <span className="mt-2 inline-block rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">
        {product.status}
      </span>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {images.map((img) => (
          <div
            key={img.id}
            className="relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
          >
            <Image
              src={img.image_url}
              alt=""
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
        <p className="font-medium">交易安全提示</p>
        <p className="mt-2 leading-relaxed">
          请优先选择校内公共场所当面交易，当面验货；不要提前转账，谨防诈骗。平台不参与交易、不收款、不担保。
        </p>
        <Link
          href="/safety"
          className="mt-2 inline-block text-primary hover:underline"
        >
          查看更多安全提示
        </Link>
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-medium text-slate-900">商品描述</h2>
        <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {product.description || "暂无描述"}
        </p>
        {product.contact_note && (
          <p className="mt-4 text-sm text-slate-600">
            <span className="font-medium text-slate-800">本商品联系说明：</span>
            {product.contact_note}
          </p>
        )}
      </section>

      <section className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-medium text-slate-900">联系卖家</h2>
        {!user && (
          <p className="mt-2 text-sm text-slate-600">
            请
            <Link href="/login" className="mx-1 text-primary hover:underline">
              登录
            </Link>
            后查看联系方式。
          </p>
        )}
        {user && viewerProfile?.is_banned && (
          <p className="mt-2 text-sm text-red-600">
            您的账号已被限制，无法查看卖家联系方式。
          </p>
        )}
        {canContact && sellerRow && (
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li>
              <span className="text-slate-500">昵称：</span>
              {sellerRow.nickname || "未设置"}
            </li>
            {sellerRow.wechat && (
              <li>
                <span className="text-slate-500">微信：</span>
                {sellerRow.wechat}
              </li>
            )}
            {sellerRow.qq && (
              <li>
                <span className="text-slate-500">QQ：</span>
                {sellerRow.qq}
              </li>
            )}
            {sellerRow.phone && (
              <li>
                <span className="text-slate-500">手机：</span>
                {sellerRow.phone}
              </li>
            )}
            {sellerRow.contact_note && (
              <li>
                <span className="text-slate-500">卖家备注：</span>
                {sellerRow.contact_note}
              </li>
            )}
          </ul>
        )}
        {canContact && sellerRow && !sellerRow.wechat && !sellerRow.qq && !sellerRow.phone && (
          <p className="mt-2 text-sm text-slate-600">卖家未填写联系方式。</p>
        )}
      </section>
    </main>
  );
}
