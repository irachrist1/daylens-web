"use node";

import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";
import { decrypt } from "./keys";
import {
  SYSTEM_PROMPT,
  buildDayContext,
  questionPrompt,
} from "../packages/prompt-builder/index";
import { requireSessionIdentity } from "./authHelpers";

export const askQuestion = action({
  args: {
    question: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireSessionIdentity(ctx);
    const snapshotDoc = await ctx.runQuery(internal.snapshots.getByWorkspaceAndDate, {
      workspaceId: identity.workspaceId,
      localDate: args.date,
    });

    if (!snapshotDoc?.snapshot) {
      return { response: "No activity data found for this date." };
    }

    // Load encrypted API key
    const keyDocs = await ctx.runQuery(internal.encryptedKeys.getByWorkspace, {
      workspaceId: identity.workspaceId,
    });

    if (!keyDocs) {
      return {
        response:
          "No API key configured. Add your Anthropic API key in Daylens settings in your desktop app.",
      };
    }

    // Decrypt key
    const anthropicKey = decrypt(keyDocs.encryptedAnthropicKey);

    // Build prompt using the shared prompt builder
    const activityContext = buildDayContext(snapshotDoc.snapshot);
    const userPrompt = questionPrompt(args.question, activityContext);

    // Call Anthropic API
    const client = new Anthropic({ apiKey: anthropicKey });
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Append to web_chats
    const existingChats = await ctx.runQuery(internal.webChats.getByWorkspace, {
      workspaceId: identity.workspaceId,
    });

    const messages = existingChats?.messages || [];
    messages.push(
      { role: "user", content: args.question, date: args.date },
      { role: "assistant", content: responseText, date: args.date }
    );

    await ctx.runMutation(internal.webChats.upsert, {
      workspaceId: identity.workspaceId,
      messages,
    });

    return { response: responseText };
  },
});
