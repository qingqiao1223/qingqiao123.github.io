import Link from "next/link";
import { createServerClient } from "@/lib/pocketbase/server";

export async function Navbar() {
  const pb = await createServerClient();
  let user = null;
  let isAdmin = false;

  if (pb.authStore.isValid) {
    try {
      const authData = await pb.collection("users").authRefresh();
      user = authData.record;
      isAdmin = Boolean(authData.record.is_admin);
    } catch {
      pb.authStore.clear();
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link href="/" className="text-lg font-semibold text-primary">
          校园二手
        </Link>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href="/products"
            className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100"
          >
            商品
          </Link>
          {user ? (
            <>
              <Link
                href="/products/new"
                className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100"
              >
                发布
              </Link>
              <Link
                href="/me"
                className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100"
              >
                我的
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-md px-2 py-1 text-amber-800 hover:bg-amber-50"
                >
                  管理
                </Link>
              )}
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-md px-2 py-1 text-slate-600 hover:bg-slate-100"
                >
                  退出
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-2 py-1 text-slate-700 hover:bg-slate-100"
              >
                登录
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-primary px-3 py-1.5 font-medium text-primary-foreground hover:opacity-90"
              >
                注册
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
