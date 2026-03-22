"use client";

import { useEffect, useState } from "react";
import { ScoreRing } from "@/app/components/ScoreRing";
import { CategoryBar } from "@/app/components/CategoryBar";
import {
  formatDate,
  formatDuration,
  formatRelativeTime,
  CATEGORY_LABELS,
} from "@/app/lib/format";
import { AppIcon } from "@/app/components/AppIcon";
import { TopSitesList, type TopDomainItem } from "@/app/components/TopSitesList";
import Link from "next/link";

interface AppSummary {
  appKey: string;
  bundleID?: string;
  displayName: string;
  category: string;
  totalSeconds: number;
  sessionCount: number;
  iconBase64?: string | null;
}

interface Snapshot {
  focusScore: number;
  focusSeconds: number;
  isPartialDay?: boolean;
  appSummaries: AppSummary[];
  categoryTotals: { category: string; totalSeconds: number }[];
  topDomains: TopDomainItem[];
  focusSessions?: { sourceId: string }[];
}

interface SnapshotDoc {
  snapshot: Snapshot;
  syncedAt?: number;
  localDate: string;
}

function getLocalDate(): string {
  return new Date().toLocaleDateString("en-CA");
}

function shiftDate(date: string, deltaDays: number) {
  const nextDate = new Date(`${date}T12:00:00`);
  nextDate.setDate(nextDate.getDate() + deltaDays);
  return nextDate.toLocaleDateString("en-CA");
}

export function DashboardClient() {
  const [today] = useState(getLocalDate);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [data, setData] = useState<SnapshotDoc | null | undefined>(undefined);
  const [isInitialLatestFallback, setIsInitialLatestFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void fetch("/api/snapshots")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;

        const snapshots = Array.isArray(json?.snapshots)
          ? [...json.snapshots].sort((a, b) => b.localDate.localeCompare(a.localDate))
          : [];

        setAvailableDates(snapshots.map((snapshot) => snapshot.localDate));

        if (snapshots.length === 0) {
          setSelectedDate(today);
          setData(null);
          setIsInitialLatestFallback(false);
          return;
        }

        const todaySnapshot = snapshots.find((snapshot) => snapshot.localDate === today);
        const initialDate = todaySnapshot?.localDate ?? snapshots[0]!.localDate;
        setSelectedDate(initialDate);
        setIsInitialLatestFallback(initialDate !== today);
      })
      .catch(() => {
        if (cancelled) return;
        setAvailableDates([]);
        setSelectedDate(today);
        setData(null);
        setIsInitialLatestFallback(false);
      });

    return () => {
      cancelled = true;
    };
  }, [today]);

  useEffect(() => {
    if (!selectedDate) {
      return;
    }

    let cancelled = false;
    setData(undefined);

    void fetch(`/api/snapshots?date=${selectedDate}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (cancelled) return;
        setData(json?.snapshot ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setData(null);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  if (!selectedDate || data === undefined) {
    return (
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="rounded-2xl bg-surface-low p-4 sm:p-6 animate-pulse h-40" />
      </div>
    );
  }

  const snapshot = data?.snapshot;
  const isToday = selectedDate === today;
  const topApps = (snapshot?.appSummaries || []).slice(0, 8);
  const categoryTotals = snapshot?.categoryTotals || [];
  const topDomains = (snapshot?.topDomains || []).slice(0, 5);
  const earliestDate =
    availableDates.length > 0 ? availableDates[availableDates.length - 1]! : today;
  const canGoPrev = selectedDate > earliestDate;
  const canGoNext = selectedDate < today;

  function selectDate(nextDate: string) {
    setIsInitialLatestFallback(false);
    setSelectedDate(nextDate);
  }

  if (!snapshot) {
    return (
      <div className="px-4 sm:px-6 py-6 sm:py-8 max-w-2xl mx-auto space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              {isToday ? "Today" : formatDate(selectedDate)}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              No activity data for {selectedDate}.
            </p>
          </div>
          <Link
            href={`/chat?date=${selectedDate}`}
            className="rounded-full border border-outline-variant/20 px-3 py-1.5 text-sm text-on-surface hover:bg-surface-low"
          >
            Ask AI
          </Link>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-surface-low p-3">
          <button
            type="button"
            onClick={() => selectDate(shiftDate(selectedDate, -1))}
            disabled={!canGoPrev}
            className="rounded-full px-3 py-1.5 text-sm text-on-surface hover:bg-surface-high disabled:opacity-40"
          >
            Previous day
          </button>
          <span className="text-sm font-medium text-on-surface">
            {isToday ? "Today" : formatDate(selectedDate)}
          </span>
          <button
            type="button"
            onClick={() => selectDate(shiftDate(selectedDate, 1))}
            disabled={!canGoNext}
            className="rounded-full px-3 py-1.5 text-sm text-on-surface hover:bg-surface-high disabled:opacity-40"
          >
            Next day
          </button>
        </div>

        <div className="rounded-2xl bg-surface-low p-4 sm:p-6 text-center space-y-2">
          <p className="text-on-surface-variant">
            Daylens only synced {availableDates.length} day
            {availableDates.length === 1 ? "" : "s"} so far.
          </p>
          <p className="text-sm text-on-surface-variant/60">
            Keep the desktop app running and linked to continue syncing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {isToday ? "Today" : formatDate(selectedDate)}
          </h1>
          {isInitialLatestFallback ? (
            <p className="text-xs text-on-surface-variant mt-0.5">
              No data for {today}. Showing the latest synced day instead.
            </p>
          ) : null}
        </div>
        <div className="flex flex-col items-end gap-2">
          <Link
            href={`/chat?date=${selectedDate}`}
            className="rounded-full border border-outline-variant/20 px-3 py-1.5 text-sm text-on-surface hover:bg-surface-low"
          >
            Ask AI
          </Link>
          {data.syncedAt ? (
            <span className="text-xs text-on-surface-variant">
              Synced {formatRelativeTime(data.syncedAt)}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between rounded-2xl bg-surface-low p-3">
        <button
          type="button"
          onClick={() => selectDate(shiftDate(selectedDate, -1))}
          disabled={!canGoPrev}
          className="rounded-full px-3 py-1.5 text-sm text-on-surface hover:bg-surface-high disabled:opacity-40"
        >
          Previous day
        </button>
        <span className="text-sm font-medium text-on-surface">
          {isToday ? "Today" : formatDate(selectedDate)}
        </span>
        <button
          type="button"
          onClick={() => selectDate(shiftDate(selectedDate, 1))}
          disabled={!canGoNext}
          className="rounded-full px-3 py-1.5 text-sm text-on-surface hover:bg-surface-high disabled:opacity-40"
        >
          Next day
        </button>
      </div>

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
            <p className="text-xl font-bold">{snapshot.appSummaries.length}</p>
          </div>
          {snapshot.isPartialDay && (
            <span className="inline-block rounded bg-primary-container/20 px-2 py-0.5 text-[0.6875rem] font-medium text-primary">
              In progress
            </span>
          )}
        </div>
      </div>

      {categoryTotals.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <CategoryBar totals={categoryTotals} />
        </section>
      )}

      {topApps.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Apps</h2>
            <Link
              href={`/apps/${selectedDate}`}
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {topApps.map((app) => (
              <div key={app.appKey} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AppIcon
                    bundleID={app.bundleID || app.appKey}
                    displayName={app.displayName}
                    category={app.category}
                    iconBase64={app.iconBase64}
                  />
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

      {topDomains.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-4 sm:p-6 space-y-3">
          <h2 className="text-lg font-semibold">Top Sites</h2>
          <TopSitesList domains={topDomains} />
        </section>
      )}

      {(snapshot.focusSessions?.length || 0) > 0 && (
        <Link
          href={`/focus/${selectedDate}`}
          className="block rounded-2xl bg-surface-low p-4 sm:p-6 card-hover"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Focus Sessions</h2>
            <span className="text-sm text-primary">{snapshot.focusSessions!.length} sessions</span>
          </div>
        </Link>
      )}
    </div>
  );
}
