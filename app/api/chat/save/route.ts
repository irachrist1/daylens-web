import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/app/lib/session";

export async function POST(_request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  // Chat history persistence is handled server-side via the AI action.
  return NextResponse.json({ ok: true });
}
