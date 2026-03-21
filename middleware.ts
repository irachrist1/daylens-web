import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify, importSPKI, createRemoteJWKSet, importJWK } from "jose";

const PUBLIC_PATHS = ["/", "/recover", "/api/link", "/api/recover"];

// ES256 public key for JWT verification — must match the key in convex/sessionPublicJwks.ts
const SESSION_PUBLIC_JWK = {
  kid: "daylens-session-key",
  kty: "EC" as const,
  x: "hSGHdzrbcr0mB64HbyqXFjkYLZSTQU3EfrDAcWQxwy0",
  y: "uYGAgDdN_hAkLNvqf9FuJsLb6uASQzAnqMPlc5l8ZVI",
  crv: "P-256" as const,
  alg: "ES256",
  use: "sig",
};

// Cache the imported key so we only do it once
let cachedKey: CryptoKey | null = null;
async function getPublicKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = await importJWK(SESSION_PUBLIC_JWK, "ES256") as CryptoKey;
  }
  return cachedKey;
}

export async function middleware(request: NextRequest) {
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
    // Cryptographically verify the JWT signature using the ES256 public key
    const publicKey = await getPublicKey();
    const { payload } = await jwtVerify(session, publicKey, {
      algorithms: ["ES256"],
    });

    if (
      typeof payload.workspaceId !== "string" ||
      typeof payload.exp !== "number" ||
      payload.exp * 1000 <= Date.now()
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch {
    // Invalid signature, expired, or malformed token
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|icon-.*|manifest.json|sw.js|workbox-.*).*)"],
};
