import { cookies } from "next/headers";
import { jwtVerify, importJWK } from "jose";

const SESSION_COOKIE = "daylens_session";

// ES256 public key — must match convex/sessionPublicJwks.ts
const SESSION_PUBLIC_JWK = {
  kid: "daylens-session-key",
  kty: "EC" as const,
  x: "hSGHdzrbcr0mB64HbyqXFjkYLZSTQU3EfrDAcWQxwy0",
  y: "uYGAgDdN_hAkLNvqf9FuJsLb6uASQzAnqMPlc5l8ZVI",
  crv: "P-256" as const,
  alg: "ES256",
  use: "sig",
};

let cachedKey: CryptoKey | null = null;
async function getPublicKey(): Promise<CryptoKey> {
  if (!cachedKey) {
    cachedKey = await importJWK(SESSION_PUBLIC_JWK, "ES256") as CryptoKey;
  }
  return cachedKey;
}

export interface Session {
  token: string;
  workspaceId?: string;
  deviceId?: string;
  sessionKind?: "desktop" | "web";
  expiresAt?: number;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  try {
    // Cryptographically verify the JWT signature — not just decode
    const publicKey = await getPublicKey();
    const { payload } = await jwtVerify(raw, publicKey, {
      algorithms: ["ES256"],
    });

    const exp = typeof payload.exp === "number" ? payload.exp * 1000 : undefined;
    if (exp && exp <= Date.now()) {
      return null;
    }
    return {
      token: raw,
      workspaceId:
        typeof payload.workspaceId === "string" ? payload.workspaceId : undefined,
      deviceId: typeof payload.deviceId === "string" ? payload.deviceId : undefined,
      sessionKind:
        payload.sessionKind === "desktop" || payload.sessionKind === "web"
          ? payload.sessionKind
          : undefined,
      expiresAt: exp,
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string): string {
  // Always set Secure flag — session cookies should never be sent over plain HTTP.
  // Local development on localhost is exempt by browsers even with Secure set.
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${60 * 60 * 24 * 30}`;
}
