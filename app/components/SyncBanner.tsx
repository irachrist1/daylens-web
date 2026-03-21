"use client";

import { formatRelativeTime } from "@/app/lib/format";

export function SyncBanner({ syncedAt }: { syncedAt?: number }) {
  if (!syncedAt) {
    return (
      <div className="rounded-lg bg-warning/10 px-4 py-2 text-sm text-warning">
        No data synced yet. Open Daylens on your Mac and link it.
      </div>
    );
  }

  const diffMs = Date.now() - syncedAt;
  const isStale = diffMs > 2 * 60 * 60 * 1000; // 2 hours

  return (
    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
      <span>Last synced {formatRelativeTime(syncedAt)}</span>
      {isStale && (
        <span className="rounded bg-warning/15 px-2 py-0.5 text-warning">
          Your Mac hasn&apos;t synced recently — open Daylens to refresh.
        </span>
      )}
    </div>
  );
}
