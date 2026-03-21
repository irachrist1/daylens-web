import { action, internalMutation, internalQuery, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";

export const create = internalMutation({
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

export const recover = internalQuery({
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

export const recoverAndIssueSession = action({
  args: {
    recoveryKeyHash: v.string(),
    deviceId: v.string(),
    displayName: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<
    | { success: true; token: string; expiresAt: number }
    | { success: false; error: string }
  > => {
    const recovered: { workspaceId: Id<"workspaces"> | null } = await ctx.runQuery(
      internal.workspaces.recover,
      {
        recoveryKeyHash: args.recoveryKeyHash,
      }
    );

    if (!recovered.workspaceId) {
      return { success: false as const, error: "Workspace not found" };
    }

    await ctx.runMutation(internal.devices.upsertForWorkspace, {
      workspaceId: recovered.workspaceId,
      deviceId: args.deviceId,
      platform: "web",
      displayName: args.displayName,
    });

    const session: { token: string; expiresAt: number } = await ctx.runAction(
      internal.sessionTokens.issue,
      {
        workspaceId: recovered.workspaceId,
        deviceId: args.deviceId,
        sessionKind: "web",
      }
    );

    return {
      success: true as const,
      token: session.token,
      expiresAt: session.expiresAt,
    };
  },
});
