import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/app/lib/convex";
import { getSession } from "@/app/lib/session";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { question, date } = await request.json();
  if (!question || !date) {
    return NextResponse.json(
      { error: "Question and date required" },
      { status: 400 }
    );
  }

  const client = getConvexClient();

  try {
    const result = await client.action(api.ai.askQuestion, {
      workspaceId: session.workspaceId as Id<"workspaces">,
      question,
      date,
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: "AI request failed. Check your API key." },
      { status: 500 }
    );
  }
}
