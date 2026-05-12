"use server";

import { getProfile } from "@/lib/auth";
import { createServerClient } from "@/lib/pocketbase/server";
import { revalidatePath } from "next/cache";

async function guardAdmin() {
  const p = await getProfile();
  if (!p?.is_admin) throw new Error("无权限");
}

export async function adminSetProductStatus(formData: FormData) {
  await guardAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const allowed = ["在售", "已预订", "已售出", "已下架"];
  if (!id || !allowed.includes(status)) return;
  const pb = await createServerClient();
  try {
    await pb.collection("products").update(id, { status });
  } catch {
    // ignore
  }
  revalidatePath("/admin/products");
}

export async function adminDeleteProduct(formData: FormData) {
  await guardAdmin();
  const id = String(formData.get("id") || "");
  if (!id) return;
  const pb = await createServerClient();
  try {
    await pb.collection("products").delete(id);
  } catch {
    // ignore
  }
  revalidatePath("/admin/products");
}

export async function adminSetUserBanned(formData: FormData) {
  await guardAdmin();
  const id = String(formData.get("id") || "");
  const banned = String(formData.get("banned") || "") === "true";
  if (!id) return;
  const me = await getProfile();
  if (me?.id === id) return;
  const pb = await createServerClient();
  try {
    await pb.collection("users").update(id, { is_banned: banned });
  } catch {
    // ignore
  }
  revalidatePath("/admin/users");
}

export async function adminUpdateReport(formData: FormData) {
  await guardAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "");
  const adminNote = String(formData.get("admin_note") || "");
  if (!id || !["resolved", "rejected"].includes(status)) return;
  const pb = await createServerClient();
  try {
    await pb.collection("reports").update(id, {
      status,
      admin_note: adminNote.trim() || null,
      handled_at: new Date().toISOString(),
    });
  } catch {
    // ignore
  }
  revalidatePath("/admin/reports");
}
