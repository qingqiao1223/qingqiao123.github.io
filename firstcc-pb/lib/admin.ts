import { getProfile } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const profile = await getProfile();
  if (!profile?.is_admin) {
    redirect("/");
  }
  return profile;
}
