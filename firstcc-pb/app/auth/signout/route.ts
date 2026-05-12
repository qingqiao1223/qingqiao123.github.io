import { createServerClient } from "@/lib/pocketbase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const pb = await createServerClient();
  pb.authStore.clear();
  return NextResponse.redirect(new URL("/", request.url));
}
