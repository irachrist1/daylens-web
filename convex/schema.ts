import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  workspaces: defineTable({
    createdAt: v.number(),
    recoveryKeyHash: v.string(),
  }),
  devices: defineTable({
    workspaceId: v.id("workspaces"),
    deviceId: v.string(),
    platform: v.union(v.literal("macos"), v.literal("windows")),
    displayName: v.string(),
    lastSyncAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),
  link_codes: defineTable({
    workspaceId: v.id("workspaces"),
    code: v.string(),
    expiresAt: v.number(),
  }).index("by_code", ["code"]),
  day_snapshots: defineTable({
    workspaceId: v.id("workspaces"),
    deviceId: v.string(),
    localDate: v.string(),
    snapshot: v.any(),
    syncedAt: v.number(),
  }).index("by_workspace_date", ["workspaceId", "localDate"]),
  encrypted_keys: defineTable({
    workspaceId: v.id("workspaces"),
    encryptedAnthropicKey: v.string(),
  }).index("by_workspace", ["workspaceId"]),
  web_chats: defineTable({
    workspaceId: v.id("workspaces"),
    messages: v.any(),
    updatedAt: v.number(),
  }).index("by_workspace", ["workspaceId"]),
});
