import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:justify-between sm:gap-4">
        <p className="text-slate-500">
          平台仅展示信息，不参与交易。请当面验货，谨防诈骗。
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2">
          <Link href="/safety" className="text-primary hover:underline">
            交易安全
          </Link>
          <Link href="/terms" className="hover:underline">
            用户协议
          </Link>
          <Link href="/privacy" className="hover:underline">
            隐私政策
          </Link>
        </div>
      </div>
    </footer>
  );
}
