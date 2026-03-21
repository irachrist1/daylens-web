import {
  internalMutation,
  internalQuery,
  query,
} from "./_generated/server";
import { v } from "convex/values";
import { requireSessionIdentity } from "./authHelpers";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireSessionIdentity(ctx);
    return await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) =>
        q.eq("workspaceId", identity.workspaceId)
      )
      .take(365);
  },
});

export const getByDate = query({
  args: {
    localDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireSessionIdentity(ctx);
    return await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) =>
        q
          .eq("workspaceId", identity.workspaceId)
          .eq("localDate", args.localDate)
      )
      .first();
  },
});

export const getDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireSessionIdentity(ctx);
    const all = await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) =>
        q.eq("workspaceId", identity.workspaceId)
      )
      .take(365);

    return all.filter(
      (s) => s.localDate >= args.startDate && s.localDate <= args.endDate
    );
  },
});

export const getByWorkspaceAndDate = internalQuery({
  args: {
    workspaceId: v.id("workspaces"),
    localDate: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) =>
        q
          .eq("workspaceId", args.workspaceId)
          .eq("localDate", args.localDate)
      )
      .first();
  },
});

/** Upsert snapshot — last write wins by generatedAt. */
export const upload = internalMutation({
  args: {
    workspaceId: v.id("workspaces"),
    deviceId: v.string(),
    localDate: v.string(),
    snapshot: v.any(),
  },
  handler: async (ctx, args): Promise<string> => {
    const existing = await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) =>
        q
          .eq("workspaceId", args.workspaceId)
          .eq("localDate", args.localDate)
      )
      .first();

    if (existing) {
      const existingGeneratedAt = existing.snapshot?.generatedAt ?? "";
      const newGeneratedAt = args.snapshot?.generatedAt ?? "";
      if (newGeneratedAt >= existingGeneratedAt) {
        await ctx.db.patch(existing._id, {
          snapshot: args.snapshot,
          deviceId: args.deviceId,
          syncedAt: Date.now(),
        });
      }
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

export const recordSync = internalMutation({
  args: {
    workspaceId: v.id("workspaces"),
    deviceId: v.string(),
  },
  handler: async (ctx, args) => {
    const devices = await ctx.db
      .query("devices")
      .withIndex("by_workspace", (q) =>
        q.eq("workspaceId", args.workspaceId)
      )
      .take(100);

    const device = devices.find((d) => d.deviceId === args.deviceId);
    if (device) {
      await ctx.db.patch(device._id, { lastSyncAt: Date.now() });
    }
  },
});
