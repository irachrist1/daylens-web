import { NextRequest, NextResponse } from "next/server";
import { getConvexClient } from "@/app/lib/convex";
import { getSession } from "@/app/lib/session";
import { api } from "../../../convex/_generated/api";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();

  // Support both formats: { messages: [...] } from GlobalChat, or { question, date }
  let question: string | undefined;
  let date: string | undefined;

  if (Array.isArray(body.messages)) {
    const lastUserMsg = [...body.messages]
      .reverse()
      .find((m: { role: string }) => m.role === "user");
    question = lastUserMsg?.content;
    date = lastUserMsg?.date || body.date;
  } else {
    question = body.question;
    date = body.date;
  }

  // Default to today in local timezone
  if (!date) {
    date = new Date().toLocaleDateString("en-CA");
  }

  if (!question) {
    return NextResponse.json(
      { error: "Please type a question." },
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
    // Classify the error without leaking internals
    const raw =
      error instanceof Error ? error.message : "";

    // Log full error server-side for debugging
    console.error("[chat] AI action failed:", raw);

    // Only surface safe, user-actionable messages
    const isKeyError =
      raw.includes("API key") ||
      raw.includes("authentication") ||
      raw.includes("401") ||
      raw.includes("invalid_api_key") ||
      raw.includes("CONVEX_ENCRYPTION_SECRET");

    const isNotDeployed =
      raw.includes("Could not find") ||
      raw.includes("is not a function") ||
      raw.includes("npx");

    const isNoData =
      raw.includes("No activity data");

    let userMessage: string;
    if (isKeyError) {
      userMessage =
        "Your API key isn't set up yet. Open Daylens on your computer, go to Settings, and save your Anthropic API key.";
    } else if (isNotDeployed) {
      userMessage =
        "The AI service is being updated. Please try again in a few minutes.";
    } else if (isNoData) {
      userMessage =
        "No activity data found for today. Make sure Daylens is running on your computer.";
    } else {
      userMessage =
        "Something went wrong. Please try again.";
    }

    return NextResponse.json({ error: userMessage }, { status: 500 });
  }
}
