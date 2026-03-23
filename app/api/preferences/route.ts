import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/app/lib/convex";
import { getSession } from "@/app/lib/session";
import { api } from "../../../convex/_generated/api";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const client = getConvexClient(session.token);
  const prefs = await client.query(api.preferences.get, {});
  return NextResponse.json(prefs);
}

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json() as { action?: string; appKey?: string; domain?: string };
  const { action, appKey, domain } = body;
  const client = getConvexClient(session.token);

  const { pinHash } = body as { pinHash?: string };

  if (action === "hideApp" && appKey) {
    await client.mutation(api.preferences.hideApp, { appKey });
  } else if (action === "showApp" && appKey) {
    await client.mutation(api.preferences.showApp, { appKey });
  } else if (action === "hideDomain" && domain) {
    await client.mutation(api.preferences.hideDomain, { domain });
  } else if (action === "showDomain" && domain) {
    await client.mutation(api.preferences.showDomain, { domain });
  } else if (action === "setPin" && pinHash) {
    await client.mutation(api.preferences.setPrivacyPin, { pinHash });
  } else if (action === "clearPin") {
    await client.mutation(api.preferences.clearPrivacyPin, {});
  } else {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
