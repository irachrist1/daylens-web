"use client";

import { useEffect, useState } from "react";
import { formatDate, formatDuration } from "@/app/lib/format";
import Link from "next/link";

interface SnapshotDoc {
  _id: string;
  localDate: string;
  snapshot: {
    focusScore: number;
    focusSeconds: number;
    appSummaries: { appKey: string }[];
  } | null;
}

function getLocalDate(): string {
  return new Date().toLocaleDateString("en-CA");
}

function getYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

function dateLabel(localDate: string, today: string, yesterday: string): string {
  if (localDate === today) return "Today";
  if (localDate === yesterday) return "Yesterday";
  return formatDate(localDate);
}

export function HistoryClient() {
  const [today] = useState(getLocalDate);
  const [yesterday] = useState(getYesterday);
  const [snapshots, setSnapshots] = useState<SnapshotDoc[] | undefined>(undefined);

  useEffect(() => {
    fetch("/api/snapshots")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        const list = json?.snapshots;
        if (Array.isArray(list)) {
          // Sort descending by date
          list.sort((a: SnapshotDoc, b: SnapshotDoc) =>
            b.localDate.localeCompare(a.localDate)
          );
          setSnapshots(list);
        } else {
          setSnapshots([]);
        }
      })
      .catch(() => setSnapshots([]));
  }, []);

  if (snapshots === undefined) {
    return (
      <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">History</h1>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-surface-low p-4 animate-pulse h-16" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 py-4 sm:py-8 max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <h1 className="text-2xl font-bold">History</h1>

      {snapshots.length === 0 ? (
        <div className="rounded-2xl bg-surface-low p-4 sm:p-6 text-center">
          <p className="text-on-surface-variant">No synced days yet.</p>
          <p className="mt-2 text-sm text-on-surface-variant/60">
            Daylens will sync automatically when it&apos;s running on your computer.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {snapshots.map((doc) => {
            const snap = doc.snapshot;
            const focusScore = snap?.focusScore ?? 0;
            const focusSeconds = snap?.focusSeconds ?? 0;
            const appCount = snap?.appSummaries?.length ?? 0;
            const scoreColor =
              focusScore >= 70
                ? "text-success"
                : focusScore >= 40
                  ? "text-warning"
                  : "text-error";
            const isToday = doc.localDate === today;

            return (
              <Link
                key={doc._id}
                href={`/apps/${doc.localDate}`}
                className="flex items-center justify-between rounded-2xl bg-surface-low p-4 card-hover"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`text-2xl font-bold w-12 text-center ${scoreColor}`}
                  >
                    {focusScore}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {dateLabel(doc.localDate, today, yesterday)}
                      {isToday && snap?.focusScore !== undefined && (
                        <span className="ml-2 text-[0.625rem] font-medium text-primary bg-primary/10 rounded px-1.5 py-0.5">
                          Live
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {formatDuration(focusSeconds)} focused · {appCount} apps
                    </p>
                  </div>
                </div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="text-on-surface-variant"
                >
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
