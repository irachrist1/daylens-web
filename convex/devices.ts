import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listByWorkspace = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("devices")
      .withIndex("by_workspace", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .take(50);
  },
});

export const remove = mutation({
  args: {
    deviceId: v.id("devices"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.deviceId);
  },
});
