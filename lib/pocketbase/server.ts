import PocketBase from "pocketbase";
import { cookies } from "next/headers";

export async function createServerClient() {
  const pb = new PocketBase(
    process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090",
  );

  try {
    const cookieStore = await cookies();
    const pbAuth = cookieStore.get("pb_auth");
    if (pbAuth?.value) {
      pb.authStore.loadFromCookie(`pb_auth=${pbAuth.value}`);
    }
  } catch {
    // cookies() may throw in edge cases
  }

  return pb;
}
