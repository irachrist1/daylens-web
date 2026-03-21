import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

const PUBLIC_PATHS = ["/", "/recover", "/api/link", "/api/recover"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Allow static files and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check session cookie
  const session = request.cookies.get("daylens_session")?.value;
  if (!session) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    const decoded = decodeJwt(session);
    if (
      typeof decoded.workspaceId !== "string" ||
      typeof decoded.exp !== "number" ||
      decoded.exp * 1000 <= Date.now()
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon-.*|manifest.json|sw.js|workbox-.*).*)"],
};
