import { ProfileSettingsForm } from "@/components/ProfileSettingsForm";
import { getProfile } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const profile = await getProfile();
  if (!profile) redirect("/login?next=/me/settings");

  return (
    <main className="mx-auto w-full max-w-lg px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">个人资料</h1>
      <p className="mt-2 text-sm text-slate-600">
        联系方式将展示在商品详情页，便于买家联系。请勿在描述中发布违规内容。
      </p>
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <ProfileSettingsForm profile={profile} />
      </div>
    </main>
  );
}
