import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/app/lib/convex";
import { setSessionCookie } from "@/app/lib/session";
import { api } from "../../../convex/_generated/api";
import { createHash } from "node:crypto";

function hashMnemonic(mnemonic: string): string {
  const normalized = mnemonic.trim().toLowerCase().replace(/\s+/g, " ");
  const input = "daylens-workspace-v1:" + normalized;
  return createHash("sha256").update(input).digest("hex");
}

export async function POST(request: NextRequest) {
  const { mnemonic } = await request.json();

  if (!mnemonic || typeof mnemonic !== "string") {
    return NextResponse.json(
      { error: "Recovery phrase is required" },
      { status: 400 }
    );
  }

  const words = mnemonic.trim().toLowerCase().split(/\s+/);
  if (words.length !== 12) {
    return NextResponse.json(
      { error: "Recovery phrase must be exactly 12 words" },
      { status: 400 }
    );
  }

  const recoveryKeyHash = hashMnemonic(mnemonic);
  const client = getConvexClient();

  const result = await client.mutation(api.workspaces.recover, {
    recoveryKeyHash,
  });

  if (!result.workspaceId) {
    return NextResponse.json(
      { error: "No workspace found for this recovery phrase" },
      { status: 404 }
    );
  }

  const response = NextResponse.json({ success: true });
  response.headers.set(
    "Set-Cookie",
    setSessionCookie(result.workspaceId as string)
  );

  return response;
}
