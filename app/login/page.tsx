import { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function Page() {
  return (
    <Suspense
      fallback={<div className="p-8 text-center text-slate-600">加载中…</div>}
    >
      <LoginClient />
    </Suspense>
  );
}
