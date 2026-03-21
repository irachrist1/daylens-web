import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/app/lib/convex";
import { getSession } from "@/app/lib/session";
import { api } from "../../../convex/_generated/api";

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const client = getConvexClient(session.token);

  if (date) {
    const snapshot = await client.query(api.snapshots.getByDate, {
      localDate: date,
    });
    return NextResponse.json({ snapshot });
  }

  const snapshots = await client.query(api.snapshots.list, {});
  return NextResponse.json({ snapshots });
}
