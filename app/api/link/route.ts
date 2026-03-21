import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/app/lib/convex";
import { setSessionCookie } from "@/app/lib/session";
import { api } from "../../../convex/_generated/api";

export async function POST(request: NextRequest) {
  const { code } = await request.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Code is required" }, { status: 400 });
  }

  const client = getConvexClient();

  // Verify the code first
  const verification = await client.query(api.linkCodes.verify, { code });
  if (!verification.valid || !verification.workspaceId) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
  }

  // Redeem it — register a "web" device
  const result = await client.mutation(api.linkCodes.redeem, {
    code,
    deviceId: "web-browser",
    platform: "macos" as const, // Web is read-only, uses workspace's platform
    displayName: "Web Browser",
  });

  if (!result.success) {
    return NextResponse.json(
      { error: result.error || "Failed to redeem code" },
      { status: 400 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    setSessionCookie(result.workspaceId as string)
  );

  return response;
}
