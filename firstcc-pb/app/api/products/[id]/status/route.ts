import { createServerClient } from "@/lib/pocketbase/server";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(request: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const pb = await createServerClient();
  if (!pb.authStore.isValid) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const form = await request.formData();
  const status = String(form.get("status") || "");
  const allowed = ["已下架", "在售", "已预订", "已售出"];
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "无效状态" }, { status: 400 });
  }

  try {
    await pb.collection("products").update(id, { status });
  } catch {
    return NextResponse.json({ error: "更新失败" }, { status: 400 });
  }

  return NextResponse.redirect(new URL("/me/products", request.url));
}
