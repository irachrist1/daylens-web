import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireSessionIdentity } from "./authHelpers";

export const get = query({
  args: {},
  handler: async (ctx, _args) => {
    const session = await requireSessionIdentity(ctx);
    const prefs = await ctx.db
      .query("workspace_preferences")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", session.workspaceId))
      .first();
    return {
      hiddenApps: prefs?.hiddenApps ?? [],
      hiddenDomains: prefs?.hiddenDomains ?? [],
    };
  },
});

export const hideApp = mutation({
  args: { appKey: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSessionIdentity(ctx);
    const prefs = await ctx.db
      .query("workspace_preferences")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", session.workspaceId))
      .first();
    if (prefs) {
      if (!prefs.hiddenApps.includes(args.appKey)) {
        await ctx.db.patch(prefs._id, {
          hiddenApps: [...prefs.hiddenApps, args.appKey],
        });
      }
    } else {
      await ctx.db.insert("workspace_preferences", {
        workspaceId: session.workspaceId,
        hiddenApps: [args.appKey],
        hiddenDomains: [],
      });
    }
  },
});

export const showApp = mutation({
  args: { appKey: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSessionIdentity(ctx);
    const prefs = await ctx.db
      .query("workspace_preferences")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", session.workspaceId))
      .first();
    if (!prefs) return;
    await ctx.db.patch(prefs._id, {
      hiddenApps: prefs.hiddenApps.filter((k) => k !== args.appKey),
    });
  },
});

export const hideDomain = mutation({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSessionIdentity(ctx);
    const prefs = await ctx.db
      .query("workspace_preferences")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", session.workspaceId))
      .first();
    if (prefs) {
      if (!prefs.hiddenDomains.includes(args.domain)) {
        await ctx.db.patch(prefs._id, {
          hiddenDomains: [...prefs.hiddenDomains, args.domain],
        });
      }
    } else {
      await ctx.db.insert("workspace_preferences", {
        workspaceId: session.workspaceId,
        hiddenApps: [],
        hiddenDomains: [args.domain],
      });
    }
  },
});

export const showDomain = mutation({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const session = await requireSessionIdentity(ctx);
    const prefs = await ctx.db
      .query("workspace_preferences")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", session.workspaceId))
      .first();
    if (!prefs) return;
    await ctx.db.patch(prefs._id, {
      hiddenDomains: prefs.hiddenDomains.filter((d) => d !== args.domain),
    });
  },
});
