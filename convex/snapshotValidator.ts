import { v } from "convex/values";

export const categoryValidator = v.union(
  v.literal("development"),
  v.literal("communication"),
  v.literal("research"),
  v.literal("writing"),
  v.literal("aiTools"),
  v.literal("design"),
  v.literal("browsing"),
  v.literal("meetings"),
  v.literal("entertainment"),
  v.literal("email"),
  v.literal("productivity"),
  v.literal("social"),
  v.literal("system"),
  v.literal("uncategorized")
);

export const topPageValidator = v.object({
  url: v.string(),
  title: v.optional(v.union(v.string(), v.null())),
  seconds: v.number(),
});

export const daySnapshotValidator = v.object({
  schemaVersion: v.literal(1),
  deviceId: v.string(),
  platform: v.union(v.literal("macos"), v.literal("windows")),
  date: v.string(),
  generatedAt: v.string(),
  isPartialDay: v.boolean(),
  focusScore: v.number(),
  focusSeconds: v.number(),
  appSummaries: v.array(
    v.object({
      appKey: v.string(),
      bundleID: v.optional(v.string()),
      displayName: v.string(),
      category: categoryValidator,
      totalSeconds: v.number(),
      sessionCount: v.number(),
      iconBase64: v.optional(v.string()),
    })
  ),
  categoryTotals: v.array(
    v.object({
      category: categoryValidator,
      totalSeconds: v.number(),
    })
  ),
  timeline: v.array(
    v.object({
      appKey: v.string(),
      startAt: v.string(),
      endAt: v.string(),
    })
  ),
  topDomains: v.array(
    v.object({
      domain: v.string(),
      seconds: v.number(),
      category: categoryValidator,
      topPages: v.optional(v.array(topPageValidator)),
    })
  ),
  categoryOverrides: v.record(v.string(), categoryValidator),
  aiSummary: v.union(v.string(), v.null()),
  focusSessions: v.array(
    v.object({
      sourceId: v.string(),
      startAt: v.string(),
      endAt: v.string(),
      actualDurationSec: v.number(),
      targetMinutes: v.number(),
      status: v.union(
        v.literal("completed"),
        v.literal("cancelled"),
        v.literal("active")
      ),
    })
  ),
});
