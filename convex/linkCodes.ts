import { action, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc } from "./_generated/dataModel";

const LINK_CODE_TTL_MS = 5 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

function normalizeToken(token: string): string {
  return token.trim().toLowerCase();
}

async function hashToken(token: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(token)
  );
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function getDisplayCode(token: string): string {
  return normalizeToken(token).slice(0, 8).toUpperCase();
}

function isExpired(linkCode: Doc<"link_codes">): boolean {
  return linkCode.expiresAt <= Date.now();
}

export const create = internalMutation({
  args: {
    workspaceId: v.id("workspaces"),
    tokenHash: v.string(),
    displayCode: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("link_codes")
      .withIndex("by_workspace", (q) => q.eq("workspaceId", args.workspaceId))
      .take(20);

    for (const linkCode of existing) {
      await ctx.db.delete(linkCode._id);
    }

    const expiresAt = Date.now() + LINK_CODE_TTL_MS;
    await ctx.db.insert("link_codes", {
      workspaceId: args.workspaceId,
      tokenHash: args.tokenHash,
      displayCode: args.displayCode,
      expiresAt,
      failedAttempts: 0,
    });

    return { displayCode: args.displayCode, expiresAt };
  },
});

export const redeem = internalMutation({
  args: {
    token: v.string(),
    deviceId: v.string(),
    platform: v.literal("web"),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedToken = normalizeToken(args.token);
    if (!/^[0-9a-f]{32}$/.test(normalizedToken)) {
      return { success: false as const, error: "Invalid code" };
    }

    const displayCode = getDisplayCode(normalizedToken);
    const tokenHash = await hashToken(normalizedToken);
    const candidates = await ctx.db
      .query("link_codes")
      .withIndex("by_display_code", (q) => q.eq("displayCode", displayCode))
      .take(10);

    const activeCandidates = candidates.filter((candidate) => !isExpired(candidate));
    for (const expired of candidates.filter((candidate) => isExpired(candidate))) {
      await ctx.db.delete(expired._id);
    }

    const match = activeCandidates.find((candidate) => candidate.tokenHash === tokenHash);
    if (!match) {
      const target = activeCandidates[0];
      if (target) {
        const failedAttempts = target.failedAttempts + 1;
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
          await ctx.db.delete(target._id);
        } else {
          await ctx.db.patch(target._id, { failedAttempts });
        }
      }
      return { success: false as const, error: "Invalid or expired code" };
    }

    await ctx.runMutation(internal.devices.upsertForWorkspace, {
      workspaceId: match.workspaceId,
      deviceId: args.deviceId,
      platform: args.platform,
      displayName: args.displayName,
    });

    await ctx.db.delete(match._id);

    return {
      success: true as const,
      workspaceId: match.workspaceId,
      deviceId: args.deviceId,
    };
  },
});

export const redeemAndIssueSession = action({
  args: {
    token: v.string(),
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
    const redeemed: {
      success: boolean;
      error?: string;
      workspaceId?: Doc<"link_codes">["workspaceId"];
      deviceId?: string;
    } = await ctx.runMutation(internal.linkCodes.redeem, {
      token: args.token,
      deviceId: args.deviceId,
      platform: "web",
      displayName: args.displayName,
    });

    if (!redeemed.success || !redeemed.workspaceId || !redeemed.deviceId) {
      return { success: false as const, error: redeemed.error ?? "Invalid code" };
    }

    const session: { token: string; expiresAt: number } = await ctx.runAction(
      internal.sessionTokens.issue,
      {
      workspaceId: redeemed.workspaceId,
      deviceId: redeemed.deviceId,
      sessionKind: "web",
      }
    );

    return {
      success: true as const,
      token: session.token,
      expiresAt: session.expiresAt,
    };
  }
});
