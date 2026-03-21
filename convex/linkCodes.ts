import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/** Generate a 6-character alphanumeric code. */
function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No I/O/0/1 to avoid confusion
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export const create = mutation({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    // Verify workspace exists
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) {
      throw new Error("Workspace not found");
    }

    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    await ctx.db.insert("link_codes", {
      workspaceId: args.workspaceId,
      code,
      expiresAt,
    });

    return { code, expiresAt };
  },
});

export const redeem = mutation({
  args: {
    code: v.string(),
    deviceId: v.string(),
    platform: v.union(v.literal("macos"), v.literal("windows")),
    displayName: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedCode = args.code.toUpperCase().trim();

    // Find the link code
    const linkCode = await ctx.db
      .query("link_codes")
      .withIndex("by_code", (q) => q.eq("code", normalizedCode))
      .first();

    if (!linkCode) {
      return { success: false, error: "Invalid code" };
    }

    if (linkCode.expiresAt < Date.now()) {
      await ctx.db.delete(linkCode._id);
      return { success: false, error: "Code expired" };
    }

    // Register device
    const existingDevice = await ctx.db
      .query("devices")
      .withIndex("by_workspace", (q) =>
        q.eq("workspaceId", linkCode.workspaceId)
      )
      .first();

    // Check if this device already exists
    const devices = await ctx.db
      .query("devices")
      .withIndex("by_workspace", (q) =>
        q.eq("workspaceId", linkCode.workspaceId)
      )
      .take(100);

    const existing = devices.find((d) => d.deviceId === args.deviceId);
    if (existing) {
      await ctx.db.patch(existing._id, {
        lastSyncAt: Date.now(),
        platform: args.platform,
        displayName: args.displayName,
      });
    } else {
      await ctx.db.insert("devices", {
        workspaceId: linkCode.workspaceId,
        deviceId: args.deviceId,
        platform: args.platform,
        displayName: args.displayName,
        lastSyncAt: Date.now(),
      });
    }

    // Consume the link code
    await ctx.db.delete(linkCode._id);

    return {
      success: true,
      workspaceId: linkCode.workspaceId,
    };
  },
});

export const verify = query({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const normalizedCode = args.code.toUpperCase().trim();
    const linkCode = await ctx.db
      .query("link_codes")
      .withIndex("by_code", (q) => q.eq("code", normalizedCode))
      .first();

    if (!linkCode || linkCode.expiresAt < Date.now()) {
      return { valid: false };
    }

    return { valid: true, workspaceId: linkCode.workspaceId };
  },
});
