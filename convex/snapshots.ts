import {
  internalMutation,
  internalQuery,
  query,
  type QueryCtx,
} from "./_generated/server";
import { v } from "convex/values";
import { requireSessionIdentity } from "./authHelpers";
import type { Doc, Id } from "./_generated/dataModel";
import {
  computeFocusScore,
  type DaySnapshot,
  type Platform,
} from "../packages/snapshot-schema/snapshot";
import { daySnapshotValidator } from "./snapshotValidator";

const MAX_SNAPSHOT_DOCS = 3650;
const FOCUSED_CATEGORIES = new Set([
  "development",
  "research",
  "writing",
  "aiTools",
  "design",
  "productivity",
]);

type SnapshotDoc = Doc<"day_snapshots">;
type DeviceDoc = Doc<"devices">;
type LegacyFocusSession = {
  appKey: string;
  startAt: string;
  endAt: string;
  durationSeconds: number;
};
type StoredFocusSession = DaySnapshot["focusSessions"][number] | LegacyFocusSession;

function parseGeneratedAtMs(snapshot: unknown): number {
  if (
    !snapshot ||
    typeof snapshot !== "object" ||
    typeof (snapshot as { generatedAt?: unknown }).generatedAt !== "string"
  ) {
    return 0;
  }

  const parsed = Date.parse((snapshot as { generatedAt: string }).generatedAt);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeFocusSession(
  session: StoredFocusSession
): DaySnapshot["focusSessions"][number] {
  if ("sourceId" in session) {
    return session;
  }

  return {
    sourceId: `${session.appKey}:${session.startAt}`,
    startAt: session.startAt,
    endAt: session.endAt,
    actualDurationSec: session.durationSeconds,
    targetMinutes: 0,
    status: "completed",
  };
}

function normalizeSnapshot(snapshot: unknown): DaySnapshot | null {
  if (!snapshot || typeof snapshot !== "object") {
    return null;
  }

  const candidate = snapshot as Record<string, unknown>;
  if (
    candidate.schemaVersion !== 1 ||
    typeof candidate.deviceId !== "string" ||
    (candidate.platform !== "macos" && candidate.platform !== "windows") ||
    typeof candidate.date !== "string" ||
    typeof candidate.generatedAt !== "string"
  ) {
    return null;
  }

  return {
    schemaVersion: 1,
    deviceId: candidate.deviceId,
    platform: candidate.platform,
    date: candidate.date,
    generatedAt: candidate.generatedAt,
    isPartialDay: candidate.isPartialDay === true,
    focusScore:
      typeof candidate.focusScore === "number" ? candidate.focusScore : 0,
    focusSeconds:
      typeof candidate.focusSeconds === "number" ? candidate.focusSeconds : 0,
    appSummaries: Array.isArray(candidate.appSummaries)
      ? (candidate.appSummaries as DaySnapshot["appSummaries"]).map((app) => ({
          ...app,
          iconBase64:
            typeof app.iconBase64 === "string" ? app.iconBase64 : undefined,
        }))
      : [],
    categoryTotals: Array.isArray(candidate.categoryTotals)
      ? (candidate.categoryTotals as DaySnapshot["categoryTotals"])
      : [],
    timeline: Array.isArray(candidate.timeline)
      ? (candidate.timeline as DaySnapshot["timeline"])
      : [],
    topDomains: Array.isArray(candidate.topDomains)
      ? (candidate.topDomains as DaySnapshot["topDomains"]).map((topDomain) => ({
          ...topDomain,
          topPages: Array.isArray(topDomain.topPages) ? topDomain.topPages : [],
        }))
      : [],
    categoryOverrides:
      candidate.categoryOverrides &&
      typeof candidate.categoryOverrides === "object" &&
      !Array.isArray(candidate.categoryOverrides)
        ? (candidate.categoryOverrides as DaySnapshot["categoryOverrides"])
        : {},
    aiSummary: typeof candidate.aiSummary === "string" ? candidate.aiSummary : null,
    focusSessions: Array.isArray(candidate.focusSessions)
      ? (candidate.focusSessions as StoredFocusSession[]).map(normalizeFocusSession)
      : [],
  };
}

function mergeTopPages(
  existingPages: NonNullable<DaySnapshot["topDomains"][number]["topPages"]>,
  nextPages: NonNullable<DaySnapshot["topDomains"][number]["topPages"]>
) {
  const pageMap = new Map<string, (typeof existingPages)[number]>();

  for (const page of [...existingPages, ...nextPages]) {
    const existing = pageMap.get(page.url);
    if (existing) {
      existing.seconds += page.seconds;
      existing.title = existing.title || page.title || undefined;
    } else {
      pageMap.set(page.url, { ...page });
    }
  }

  return [...pageMap.values()]
    .sort((a, b) => b.seconds - a.seconds)
    .slice(0, 5);
}

async function loadWorkspaceDevices(
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">
) {
  const devices = await ctx.db
    .query("devices")
    .withIndex("by_workspace", (q) => q.eq("workspaceId", workspaceId))
    .take(100);

  return new Map(devices.map((device) => [device.deviceId, device]));
}

function mergeSnapshots(
  docs: SnapshotDoc[],
  deviceMap: Map<string, DeviceDoc>
) {
  if (docs.length === 0) {
    return null;
  }

  const normalizedDocs = docs
    .map((doc) => ({ doc, snapshot: normalizeSnapshot(doc.snapshot) }))
    .filter(
      (entry): entry is { doc: SnapshotDoc; snapshot: DaySnapshot } =>
        entry.snapshot !== null
    )
    .sort(
      (a, b) =>
        parseGeneratedAtMs(a.snapshot) - parseGeneratedAtMs(b.snapshot)
    );

  if (normalizedDocs.length === 0) {
    return null;
  }

  const latest = normalizedDocs[normalizedDocs.length - 1];
  const appMap = new Map<string, DaySnapshot["appSummaries"][number]>();
  const topDomainMap = new Map<string, DaySnapshot["topDomains"][number]>();
  const categoryOverrides: DaySnapshot["categoryOverrides"] = {};
  const timeline = normalizedDocs
    .flatMap(({ snapshot }) => snapshot.timeline)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
  const focusSessions = normalizedDocs
    .flatMap(({ doc, snapshot }) =>
      snapshot.focusSessions.map((session) => ({
        ...session,
        sourceId: `${doc.deviceId}:${session.sourceId}`,
      }))
    )
    .sort((a, b) => a.startAt.localeCompare(b.startAt));

  for (const { snapshot } of normalizedDocs) {
    for (const app of snapshot.appSummaries) {
      const existing = appMap.get(app.appKey);
      if (existing) {
        existing.totalSeconds += app.totalSeconds;
        existing.sessionCount += app.sessionCount;
        existing.iconBase64 = existing.iconBase64 || app.iconBase64;
      } else {
        appMap.set(app.appKey, { ...app });
      }
    }

    for (const topDomain of snapshot.topDomains) {
      const key = `${topDomain.domain}:${topDomain.category}`;
      const existing = topDomainMap.get(key);
      if (existing) {
        existing.seconds += topDomain.seconds;
        existing.topPages = mergeTopPages(
          existing.topPages ?? [],
          topDomain.topPages ?? []
        );
      } else {
        topDomainMap.set(key, {
          ...topDomain,
          topPages: [...(topDomain.topPages ?? [])],
        });
      }
    }

    Object.assign(categoryOverrides, snapshot.categoryOverrides);
  }

  const appSummaries = [...appMap.values()].sort(
    (a, b) => b.totalSeconds - a.totalSeconds
  );
  const categoryTotalsMap = new Map<
    DaySnapshot["categoryTotals"][number]["category"],
    number
  >();
  for (const app of appSummaries) {
    categoryTotalsMap.set(
      app.category,
      (categoryTotalsMap.get(app.category) ?? 0) + app.totalSeconds
    );
  }
  const categoryTotals = [...categoryTotalsMap.entries()]
    .map(([category, totalSeconds]) => ({ category, totalSeconds }))
    .sort((a, b) => b.totalSeconds - a.totalSeconds);
  const topDomains = [...topDomainMap.values()]
    .map((topDomain) => ({
      ...topDomain,
      topPages: [...(topDomain.topPages ?? [])]
        .sort((a, b) => b.seconds - a.seconds)
        .slice(0, 5),
    }))
    .sort((a, b) => b.seconds - a.seconds)
    .slice(0, 20);

  const focusSeconds = appSummaries
    .filter((app) => FOCUSED_CATEGORIES.has(app.category))
    .reduce((sum, app) => sum + app.totalSeconds, 0);
  const totalTrackedSeconds = appSummaries.reduce(
    (sum, app) => sum + app.totalSeconds,
    0
  );

  let switches = 0;
  for (let index = 1; index < timeline.length; index += 1) {
    if (timeline[index]?.appKey !== timeline[index - 1]?.appKey) {
      switches += 1;
    }
  }
  const hours = totalTrackedSeconds / 3600;
  const switchesPerHour = hours > 0 ? switches / hours : 0;
  const focusScore = computeFocusScore(
    focusSeconds,
    totalTrackedSeconds,
    switchesPerHour
  );

  const devices = normalizedDocs
    .map(({ doc, snapshot }) => {
      const device = deviceMap.get(doc.deviceId);
      return {
        deviceId: doc.deviceId,
        platform: (device?.platform ?? snapshot.platform) as Platform,
        displayName: device?.displayName ?? doc.deviceId,
        syncedAt: doc.syncedAt,
        generatedAt: snapshot.generatedAt,
      };
    })
    .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt));

  const mergedSnapshot: DaySnapshot = {
    schemaVersion: 1,
    deviceId: latest.snapshot.deviceId,
    platform: latest.snapshot.platform,
    date: latest.snapshot.date,
    generatedAt: latest.snapshot.generatedAt,
    isPartialDay: normalizedDocs.some(({ snapshot }) => snapshot.isPartialDay),
    focusScore,
    focusSeconds,
    appSummaries,
    categoryTotals,
    timeline,
    topDomains,
    categoryOverrides,
    aiSummary:
      [...normalizedDocs]
        .reverse()
        .find(({ snapshot }) => snapshot.aiSummary)?.snapshot.aiSummary ?? null,
    focusSessions,
  };

  return {
    _id: latest.doc._id,
    _creationTime: latest.doc._creationTime,
    workspaceId: latest.doc.workspaceId,
    localDate: latest.doc.localDate,
    syncedAt: Math.max(...normalizedDocs.map(({ doc }) => doc.syncedAt)),
    devices,
    snapshot: mergedSnapshot,
  };
}

async function loadMergedSnapshotsForWorkspace(
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">
) {
  const [docs, deviceMap] = await Promise.all([
    ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) => q.eq("workspaceId", workspaceId))
      .take(MAX_SNAPSHOT_DOCS),
    loadWorkspaceDevices(ctx, workspaceId),
  ]);

  const grouped = new Map<string, SnapshotDoc[]>();
  for (const doc of docs) {
    const bucket = grouped.get(doc.localDate) ?? [];
    bucket.push(doc);
    grouped.set(doc.localDate, bucket);
  }

  return [...grouped.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([, dayDocs]) => mergeSnapshots(dayDocs, deviceMap))
    .filter((doc): doc is NonNullable<typeof doc> => doc !== null);
}

export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireSessionIdentity(ctx);
    return await loadMergedSnapshotsForWorkspace(ctx, identity.workspaceId);
  },
});

export const getByDate = query({
  args: {
    localDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireSessionIdentity(ctx);
    const [docs, deviceMap] = await Promise.all([
      ctx.db
        .query("day_snapshots")
        .withIndex("by_workspace_date", (q) =>
          q.eq("workspaceId", identity.workspaceId).eq("localDate", args.localDate)
        )
        .take(50),
      loadWorkspaceDevices(ctx, identity.workspaceId),
    ]);

    return mergeSnapshots(docs, deviceMap);
  },
});

export const latestDate = query({
  args: {},
  handler: async (ctx) => {
    const identity = await requireSessionIdentity(ctx);
    const latest = await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) =>
        q.eq("workspaceId", identity.workspaceId)
      )
      .order("desc")
      .take(1);

    return latest[0]?.localDate ?? null;
  },
});

export const getAllByDate = query({
  args: {
    localDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireSessionIdentity(ctx);
    return await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_date", (q) =>
        q.eq("workspaceId", identity.workspaceId).eq("localDate", args.localDate)
      )
      .take(50);
  },
});

export const getDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await requireSessionIdentity(ctx);
    const all = await loadMergedSnapshotsForWorkspace(ctx, identity.workspaceId);

    return all.filter(
      (snapshotDoc) =>
        snapshotDoc.localDate >= args.startDate &&
        snapshotDoc.localDate <= args.endDate
    );
  },
});

export const getByWorkspaceAndDate = internalQuery({
  args: {
    workspaceId: v.id("workspaces"),
    localDate: v.string(),
  },
  handler: async (ctx, args) => {
    const [docs, deviceMap] = await Promise.all([
      ctx.db
        .query("day_snapshots")
        .withIndex("by_workspace_date", (q) =>
          q.eq("workspaceId", args.workspaceId).eq("localDate", args.localDate)
        )
        .take(50),
      loadWorkspaceDevices(ctx, args.workspaceId),
    ]);

    return mergeSnapshots(docs, deviceMap);
  },
});

export const upload = internalMutation({
  args: {
    workspaceId: v.id("workspaces"),
    deviceId: v.string(),
    localDate: v.string(),
    snapshot: daySnapshotValidator,
  },
  handler: async (ctx, args): Promise<string> => {
    const existing = await ctx.db
      .query("day_snapshots")
      .withIndex("by_workspace_device_date", (q) =>
        q
          .eq("workspaceId", args.workspaceId)
          .eq("deviceId", args.deviceId)
          .eq("localDate", args.localDate)
      )
      .unique();

    if (existing) {
      const existingTs = parseGeneratedAtMs(existing.snapshot);
      const newTs = parseGeneratedAtMs(args.snapshot);
      if (newTs >= existingTs) {
        await ctx.db.patch(existing._id, {
          snapshot: args.snapshot,
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
    const device = await ctx.db
      .query("devices")
      .withIndex("by_workspace_and_device", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("deviceId", args.deviceId)
      )
      .unique();

    if (device) {
      await ctx.db.patch(device._id, { lastSyncAt: Date.now() });
    }
  },
});
