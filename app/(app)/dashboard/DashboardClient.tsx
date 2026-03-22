"use client";

import { useEffect, useState } from "react";
import { ScoreRing } from "@/app/components/ScoreRing";
import { CategoryBar } from "@/app/components/CategoryBar";
import { formatDuration, formatDate, CATEGORY_LABELS, CATEGORY_COLORS } from "@/app/lib/format";
import { AppIcon } from "@/app/components/AppIcon";
import Link from "next/link";

interface AppSummary {
  appKey: string;
  bundleID?: string;
  displayName: string;
  category: string;
  totalSeconds: number;
  sessionCount: number;
}

interface TopDomain {
  domain: string;
  seconds: number;
  category: string;
}

interface TimelineEntry {
  appKey: string;
  startAt: string;
  endAt: string;
}

interface Snapshot {
  focusScore: number;
  focusSeconds: number;
  isPartialDay?: boolean;
  appSummaries: AppSummary[];
  categoryTotals: { category: string; totalSeconds: number }[];
  topDomains: TopDomain[];
  focusSessions?: { sourceId: string }[];
  timeline?: TimelineEntry[];
}

interface SnapshotDoc {
  snapshot: Snapshot;
  syncedAt?: number;
  localDate: string;
}

function getLocalDate(): string {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local tz
}

export function DashboardClient() {
  const [today] = useState(getLocalDate);
  const [data, setData] = useState<SnapshotDoc | null | undefined>(undefined);
  const [displayDate, setDisplayDate] = useState(today);

  useEffect(() => {
    // First try today's date
    fetch(`/api/snapshots?date=${today}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const doc = json?.snapshot;
        if (doc?.snapshot) {
          setData(doc);
          setDisplayDate(today);
        } else {
          // No data for today — fetch most recent snapshot
          return fetch("/api/snapshots")
            .then((res) => (res.ok ? res.json() : null))
            .then((listJson) => {
              const snapshots = listJson?.snapshots;
              if (Array.isArray(snapshots) && snapshots.length > 0) {
                // snapshots.list returns sorted by date descending
                const latest = snapshots[0];
                setData(latest);
                setDisplayDate(latest.localDate);
              } else {
                setData(null);
              }
            });
        }
      })
      .catch(() => setData(null));
  }, [today]);

  // Loading state
  if (data === undefined) {
    return (
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Today</h1>
        <div className="rounded-2xl bg-surface-low p-4 sm:p-6 animate-pulse h-40" />
      </div>
    );
  }

  const snapshot = data?.snapshot;

  if (!snapshot) {
    return (
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="rounded-2xl bg-surface-low p-4 sm:p-6 text-center space-y-2">
          <p className="text-on-surface-variant">No activity data yet.</p>
          <p className="text-sm text-on-surface-variant/60">
            Daylens will sync automatically when it&apos;s running on your computer.
          </p>
        </div>
      </div>
    );
  }

  const isToday = displayDate === today;
  const topApps = (snapshot.appSummaries || []).slice(0, 8);
  const categoryTotals = snapshot.categoryTotals || [];
  const topDomains = (snapshot.topDomains || []).slice(0, 5);

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {isToday ? "Today" : formatDate(displayDate)}
          </h1>
          {!isToday && (
            <p className="text-xs text-on-surface-variant mt-0.5">
              No data for today — showing most recent
            </p>
          )}
        </div>
        {data.syncedAt && (
          <span className="text-xs text-on-surface-variant">
            Synced {formatRelativeTime(data.syncedAt)}
          </span>
        )}
      </div>

      {/* Focus Score + Quick Stats */}
      <div className="flex items-center gap-4 sm:gap-6 rounded-2xl bg-surface-low p-4 sm:p-6">
        <ScoreRing score={snapshot.focusScore || 0} size={100} />
        <div className="flex-1 space-y-3">
          <div>
            <span className="text-[0.6875rem] font-semibold tracking-wide uppercase text-on-surface-variant">
              Focus Time
            </span>
            <p className="text-xl font-bold">{formatDuration(snapshot.focusSeconds || 0)}</p>
          </div>
          <div>
            <span className="text-[0.6875rem] font-semibold tracking-wide uppercase text-on-surface-variant">
              Apps Used
            </span>
            <p className="text-xl font-bold">{topApps.length}</p>
          </div>
          {snapshot.isPartialDay && (
            <span className="inline-block rounded bg-primary-container/20 px-2 py-0.5 text-[0.6875rem] font-medium text-primary">
              In progress
            </span>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      {categoryTotals.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <CategoryBar totals={categoryTotals} />
        </section>
      )}

      {/* Top Apps */}
      {topApps.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Apps</h2>
            <Link
              href={`/apps/${displayDate}`}
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {topApps.map((app) => (
              <div key={app.appKey} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AppIcon bundleID={app.bundleID || app.appKey} displayName={app.displayName} category={app.category} />
                  <div>
                    <p className="text-sm font-medium">{app.displayName}</p>
                    <p className="text-[0.6875rem] text-on-surface-variant">
                      {CATEGORY_LABELS[app.category] || app.category}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{formatDuration(app.totalSeconds)}</p>
                  <p className="text-[0.6875rem] text-on-surface-variant">
                    {app.sessionCount} sessions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Top Domains */}
      {topDomains.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-4 sm:p-6 space-y-3">
          <h2 className="text-lg font-semibold">Top Sites</h2>
          <div className="space-y-3">
            {topDomains.map((d) => (
              <div key={d.domain} className="flex items-center justify-between">
                <span className="text-sm">{d.domain}</span>
                <span className="text-sm font-medium text-on-surface-variant">
                  {formatDuration(d.seconds)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Focus Sessions Link */}
      {(snapshot.focusSessions?.length || 0) > 0 && (
        <Link
          href={`/focus/${displayDate}`}
          className="block rounded-2xl bg-surface-low p-4 sm:p-6 card-hover"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Focus Sessions</h2>
            <span className="text-sm text-primary">{snapshot.focusSessions!.length} sessions</span>
          </div>
        </Link>
      )}

      {/* Timeline summary */}
      {(snapshot.timeline?.length || 0) > 0 && (
        <section className="rounded-2xl bg-surface-low p-4 sm:p-6 space-y-3">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <div className="flex h-8 overflow-hidden rounded-full">
            {snapshot.timeline!.map((entry, i) => {
              const start = new Date(entry.startAt).getTime();
              const end = new Date(entry.endAt).getTime();
              const duration = end - start;
              const totalDuration = snapshot.timeline!.reduce((sum, e) => {
                return sum + (new Date(e.endAt).getTime() - new Date(e.startAt).getTime());
              }, 0);
              const appInfo = topApps.find((a) => a.appKey === entry.appKey);
              const category = appInfo?.category || "uncategorized";
              return (
                <div
                  key={`${entry.appKey}-${i}`}
                  className="h-full"
                  style={{
                    width: `${(duration / totalDuration) * 100}%`,
                    backgroundColor: CATEGORY_COLORS[category] || CATEGORY_COLORS.uncategorized,
                  }}
                  title={`${entry.appKey}: ${new Date(entry.startAt).toLocaleTimeString()} - ${new Date(entry.endAt).toLocaleTimeString()}`}
                />
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function formatRelativeTime(timestamp: number): string {
  const diffMs = Date.now() - timestamp;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${Math.floor(diffHours / 24)}d ago`;
}
