export const runtime = "edge";
export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-sm leading-relaxed text-slate-700">
      <h1 className="text-2xl font-semibold text-slate-900">隐私政策</h1>
      <p className="mt-4">
        我们重视您的个人信息保护。本政策说明在您使用校园二手信息平台时，我们如何收集、使用与存储相关信息。
      </p>
      <h2 className="mt-8 text-lg font-medium text-slate-900">1. 收集的信息</h2>
      <p className="mt-2">
        为提供账号与发布功能，我们可能收集邮箱、昵称、头像链接，以及您主动填写的联系方式（如微信、QQ、手机等）。此外会记录与商品发布、收藏、举报相关的必要数据。
      </p>
      <h2 className="mt-8 text-lg font-medium text-slate-900">2. 使用方式</h2>
      <p className="mt-2">
        信息用于账号登录、展示商品与联系卖家、风控与违规处理、以及改善服务体验。不会在未征得同意的情况下向无关第三方出售您的个人信息。
      </p>
      <h2 className="mt-8 text-lg font-medium text-slate-900">3. 存储与安全</h2>
      <p className="mt-2">
        数据存储在安全的服务器中，并采取访问控制等措施。请妥善保管密码，避免在公开场合泄露联系方式。
      </p>
      <h2 className="mt-8 text-lg font-medium text-slate-900">4. 您的权利</h2>
      <p className="mt-2">
        您可以在「个人资料设置」中更新或删除部分信息。如需注销账号或进一步协助，请联系学校管理员或平台维护者。
      </p>
    </main>
  );
}
