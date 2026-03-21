import { cookies } from "next/headers";
import { decodeJwt } from "jose";

const SESSION_COOKIE = "daylens_session";

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
    const decoded = decodeJwt(raw);
    const exp = typeof decoded.exp === "number" ? decoded.exp * 1000 : undefined;
    if (exp && exp <= Date.now()) {
      return null;
    }
    return {
      token: raw,
      workspaceId:
        typeof decoded.workspaceId === "string" ? decoded.workspaceId : undefined,
      deviceId: typeof decoded.deviceId === "string" ? decoded.deviceId : undefined,
      sessionKind:
        decoded.sessionKind === "desktop" || decoded.sessionKind === "web"
          ? decoded.sessionKind
          : undefined,
      expiresAt: exp,
    };
  } catch {
    return null;
  }
}

export function setSessionCookie(token: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 30}${secure}`;
}
