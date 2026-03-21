import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Placeholder — implementation agents will fill this out
export const list = query({
  args: { workspaceId: v.id("workspaces") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();
  },
});

export const upsert = mutation({
  args: {
    workspaceId: v.id("workspaces"),
    deviceId: v.string(),
    localDate: v.string(),
    snapshot: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("localDate", args.localDate)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        snapshot: args.snapshot,
        syncedAt: Date.now(),
      });
      return existing._id;
    }

    return await ctx.db.insert("day_snapshots", {
      workspaceId: args.workspaceId,
      deviceId: args.deviceId,
      localDate: args.localDate,
      snapshot: args.snapshot,
      syncedAt: Date.now(),
    });
  },
});
