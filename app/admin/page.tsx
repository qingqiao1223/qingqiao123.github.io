import Link from "next/link";
import { requireAdmin } from "@/lib/admin";
import { createServerClient } from "@/lib/pocketbase/server";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAdmin();
  const pb = await createServerClient();

  const [productResult, userResult, pendingResult, activeResult] =
    await Promise.all([
      pb.collection("products").getList(1, 1, { requestKey: "admin-count-p" }),
      pb.collection("users").getList(1, 1, { requestKey: "admin-count-u" }),
      pb
        .collection("reports")
        .getList(1, 1, {
          filter: 'status = "pending"',
          requestKey: "admin-count-r",
        }),
      pb
        .collection("products")
        .getList(1, 1, {
          filter: 'status = "在售"',
          requestKey: "admin-count-a",
        }),
    ]);

  const productCount = productResult.totalItems;
  const userCount = userResult.totalItems;
  const pendingReports = pendingResult.totalItems;
  const activeProducts = activeResult.totalItems;

  return (
    <main>
      <h1 className="text-2xl font-semibold text-slate-900">管理后台</h1>
      <p className="mt-2 text-sm text-slate-600">平台运营数据概览</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">商品总量</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {productCount}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-200 bg-white p-5">
          <p className="text-sm text-slate-500">在售商品</p>
          <p className="mt-1 text-3xl font-semibold text-emerald-700">
            {activeProducts}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">注册用户</p>
          <p className="mt-1 text-3xl font-semibold text-slate-900">
            {userCount}
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-white p-5">
          <p className="text-sm text-slate-500">待处理举报</p>
          <p className="mt-1 text-3xl font-semibold text-amber-800">
            {pendingReports}
          </p>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">管理入口</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <Link
            href="/admin/products"
            className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/40"
          >
            <h3 className="font-medium text-slate-900">商品管理</h3>
            <p className="mt-1 text-sm text-slate-600">
              查看、下架或删除商品
            </p>
          </Link>
          <Link
            href="/admin/users"
            className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-primary/40"
          >
            <h3 className="font-medium text-slate-900">用户管理</h3>
            <p className="mt-1 text-sm text-slate-600">
              封禁或解禁用户账号
            </p>
          </Link>
          <Link
            href="/admin/reports"
            className="block rounded-xl border border-amber-200 bg-white p-5 hover:border-amber-400"
          >
            <h3 className="font-medium text-slate-900">举报管理</h3>
            <p className="mt-1 text-sm text-slate-600">
              处理用户举报{" "}
              {pendingReports ? `（${pendingReports} 条待处理）` : ""}
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
