import { createServerClient } from "@/lib/pocketbase/server";
import type { Profile } from "@/types/database";

export async function getAuthUser() {
  const pb = await createServerClient();
  if (!pb.authStore.isValid) return null;

  try {
    const authData = await pb.collection("users").authRefresh();
    return authData.record;
  } catch {
    return null;
  }
}

export async function getProfile(): Promise<Profile | null> {
  const pb = await createServerClient();
  if (!pb.authStore.isValid) return null;

  try {
    const authData = await pb.collection("users").authRefresh();
    const user = authData.record;
    return {
      id: user.id,
      nickname: user.nickname || "",
      avatar_url: user.avatar
        ? pb.files.getUrl(user, user.avatar)
        : null,
      wechat: user.wechat || null,
      qq: user.qq || null,
      phone: user.phone || null,
      contact_note: user.contact_note || null,
      is_admin: user.is_admin || false,
      is_banned: user.is_banned || false,
      created_at: user.created,
      updated_at: user.updated,
    };
  } catch {
    return null;
  }
}
