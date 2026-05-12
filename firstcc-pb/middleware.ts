import PocketBase from "pocketbase";
import { NextResponse, type NextRequest } from "next/server";

const authPrefixes = ["/me", "/admin"];
const authExact = ["/products/new"];

function needsAuth(pathname: string) {
  if (authExact.some((p) => pathname === p)) return true;
  if (authPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`)))
    return true;
  if (pathname.startsWith("/products/edit/")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const pbUrl = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";
  const pb = new PocketBase(pbUrl);

  // Load auth from request cookies
  const allCookies = request.cookies.getAll();
  const cookieStr = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");
  pb.authStore.loadFromCookie(cookieStr);

  let isAuthed = false;
  if (pb.authStore.isValid) {
    try {
      await pb.collection("users").authRefresh();
      isAuthed = true;
    } catch {
      pb.authStore.clear();
    }
  }

  if (!needsAuth(request.nextUrl.pathname)) {
    return NextResponse.next({ request });
  }

  if (!isAuthed) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
