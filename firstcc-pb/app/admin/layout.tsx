import Link from "next/link";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-[70vh] bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-wrap gap-2 px-4 py-3 text-sm">
          <span className="font-semibold text-amber-900">管理后台</span>
          <Link href="/admin" className="text-primary hover:underline">
            首页
          </Link>
          <Link href="/admin/products" className="text-primary hover:underline">
            商品
          </Link>
          <Link href="/admin/users" className="text-primary hover:underline">
            用户
          </Link>
          <Link href="/admin/reports" className="text-primary hover:underline">
            举报
          </Link>
          <Link href="/" className="ml-auto text-slate-600 hover:underline">
            返回站点
          </Link>
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
    </div>
  );
}
