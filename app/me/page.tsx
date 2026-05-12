import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function MePage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/me");

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">我的</h1>
      {profile.is_banned && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          您的账号已被限制：可浏览商品，但不可发布、编辑、收藏或举报。如有疑问请联系管理员。
        </p>
      )}
      <ul className="mt-6 space-y-2">
        <li>
          <Link
            href="/me/products"
            className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 hover:border-primary/40"
          >
            我的发布
          </Link>
        </li>
        <li>
          <Link
            href="/me/favorites"
            className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 hover:border-primary/40"
          >
            我的收藏
          </Link>
        </li>
        <li>
          <Link
            href="/me/settings"
            className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-800 hover:border-primary/40"
          >
            个人资料设置
          </Link>
        </li>
      </ul>
    </main>
  );
}
