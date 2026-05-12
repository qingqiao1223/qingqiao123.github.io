import Link from "next/link";

export default function SafetyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-semibold text-slate-900">交易安全提示</h1>
      <p className="mt-4">
        本平台不参与交易、不收款、不担保。为保障财产安全，请务必阅读并遵循以下建议。
      </p>
      <ul className="mt-6 list-disc space-y-3 pl-5">
        <li>优先选择校内公共场所当面交易，避免单独前往偏僻地点。</li>
        <li>当面验货，确认商品与描述一致后再付款。</li>
        <li>不要提前向陌生人转账或扫码付款；警惕「定金」「手续费」等话术。</li>
        <li>保护个人信息，谨慎添加陌生账号；涉及大额交易建议告知同学或辅导员。</li>
        <li>发现诈骗、违禁品或侵权内容，请使用商品页「举报」功能或联系管理员。</li>
      </ul>
      <p className="mt-8">
        更多规则见{" "}
        <Link href="/terms" className="text-primary hover:underline">
          用户协议
        </Link>
        。
      </p>
    </main>
  );
}
