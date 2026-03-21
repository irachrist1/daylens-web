"use node";

import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { v } from "convex/values";
import Anthropic from "@anthropic-ai/sdk";
import { decrypt } from "./keys";
import {
  SYSTEM_PROMPT,
  buildDayContext,
  questionPrompt,
} from "../packages/prompt-builder/index";

export const askQuestion = action({
  args: {
    workspaceId: v.id("workspaces"),
    question: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    // Load snapshot for the date
    const snapshotDoc = await ctx.runQuery(api.snapshots.getByDate, {
      workspaceId: args.workspaceId,
      localDate: args.date,
    });

    if (!snapshotDoc?.snapshot) {
      return { response: "No activity data found for this date." };
    }

    // Load encrypted API key
    const keyDocs = await ctx.runQuery(api.encryptedKeys.getByWorkspace, {
      workspaceId: args.workspaceId,
    });

    if (!keyDocs) {
      return {
        response:
          "No API key configured. Add your Anthropic API key in Daylens settings on your Mac.",
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
    const existingChats = await ctx.runQuery(api.webChats.getByWorkspace, {
      workspaceId: args.workspaceId,
    });

    const messages = existingChats?.messages || [];
    messages.push(
      { role: "user", content: args.question, date: args.date },
      { role: "assistant", content: responseText, date: args.date }
    );

    await ctx.runMutation(api.webChats.upsert, {
      workspaceId: args.workspaceId,
      messages,
    });

    return { response: responseText };
  },
});
