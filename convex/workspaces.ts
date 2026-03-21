import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    recoveryKeyHash: v.string(),
  },
  handler: async (ctx, args) => {
    const workspaceId = await ctx.db.insert("workspaces", {
      createdAt: Date.now(),
      recoveryKeyHash: args.recoveryKeyHash,
    });
    return { workspaceId };
  },
});

export const recover = mutation({
  args: {
    recoveryKeyHash: v.string(),
  },
  handler: async (ctx, args) => {
    // Scan workspaces for matching recovery key hash.
    // Small table — full scan is acceptable.
    const workspaces = await ctx.db.query("workspaces").take(1000);
    const match = workspaces.find(
      (ws) => ws.recoveryKeyHash === args.recoveryKeyHash
    );
    if (!match) {
      return { workspaceId: null };
    }
    return { workspaceId: match._id };
  },
});

export const get = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.workspaceId);
  },
});
