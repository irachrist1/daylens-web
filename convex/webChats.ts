import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getByWorkspace = internalQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("web_chats")
      .withIndex("by_workspace", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .first();
  },
});

export const upsert = internalMutation({
  args: {
    workspaceId: v.id("workspaces"),
    messages: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("web_chats")
      .withIndex("by_workspace", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        messages: args.messages,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("web_chats", {
      workspaceId: args.workspaceId,
      messages: args.messages,
      updatedAt: Date.now(),
    });
  },
});
