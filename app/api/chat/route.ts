import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/app/lib/convex";
import { getSession } from "@/app/lib/session";
import { api } from "../../../convex/_generated/api";

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

  const client = getConvexClient(session.token);

  try {
    const result = await client.action(api.ai.askQuestion, {
      question,
      date,
    });

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "AI request failed";
    const isKeyError =
      message.includes("API key") ||
      message.includes("authentication") ||
      message.includes("401") ||
      message.includes("invalid_api_key");
    return NextResponse.json(
      {
        error: isKeyError
          ? "API key missing or invalid. Save your Anthropic API key in the desktop app's Settings, then try again."
          : `AI request failed: ${message}`,
      },
      { status: 500 }
    );
  }
}
