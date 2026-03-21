import { cookies } from "next/headers";

const SESSION_COOKIE = "daylens_session";

export interface Session {
  workspaceId: string;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function setSessionCookie(workspaceId: string): string {
  const value = JSON.stringify({ workspaceId });
  return `${SESSION_COOKIE}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}`;
}
