import { ScoreRing } from "@/app/components/ScoreRing";
import { CategoryBar } from "@/app/components/CategoryBar";
import { formatDuration, CATEGORY_LABELS, CATEGORY_COLORS } from "@/app/lib/format";
import Link from "next/link";

interface AppSummary {
  appKey: string;
  displayName: string;
  category: string;
  totalSeconds: number;
  sessionCount: number;
}

interface CategoryTotal {
  category: string;
  totalSeconds: number;
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SnapshotShape = Record<string, any>;

interface SnapshotContentProps {
  snapshot: SnapshotShape;
  date: string;
  /** Show all apps or just top 8 */
  showAllApps?: boolean;
}

/**
 * Pure rendering of a DaySnapshot payload.
 * Used in both the single-device dashboard and inside DeviceTabs.
 * No data fetching — caller provides the snapshot.
 */
export function SnapshotContent({ snapshot, date, showAllApps = false }: SnapshotContentProps) {
  const allApps: AppSummary[] = snapshot.appSummaries || [];
  const topApps = showAllApps ? allApps : allApps.slice(0, 8);
  const categoryTotals: CategoryTotal[] = snapshot.categoryTotals || [];
  const topDomains: TopDomain[] = (snapshot.topDomains || []).slice(0, showAllApps ? 10 : 5);
  const timeline: TimelineEntry[] = snapshot.timeline || [];
  const focusSessions = snapshot.focusSessions || [];

  const totalTimelineDuration = timeline.reduce((sum, e) => {
    return sum + (new Date(e.endAt).getTime() - new Date(e.startAt).getTime());
  }, 0);

  return (
    <div className="space-y-6">
      {/* Focus Score + Quick Stats */}
      <div className="flex items-center gap-6 rounded-2xl bg-surface-low p-6">
        <ScoreRing score={snapshot.focusScore || 0} />
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
            <p className="text-xl font-bold">{allApps.length}</p>
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
        <section className="rounded-2xl bg-surface-low p-6 space-y-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <CategoryBar totals={categoryTotals} />
        </section>
      )}

      {/* Apps */}
      {topApps.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {showAllApps ? "All Apps" : "Top Apps"}
            </h2>
            {!showAllApps && (
              <Link href={`/apps/${date}`} className="text-xs text-primary hover:underline">
                View all
              </Link>
            )}
          </div>
          <div className="space-y-3">
            {topApps.map((app) => (
              <div key={app.appKey} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold"
                    style={{
                      backgroundColor: (CATEGORY_COLORS[app.category] || "#475569") + "20",
                      color: CATEGORY_COLORS[app.category] || "#475569",
                    }}
                  >
                    {app.displayName.charAt(0)}
                  </div>
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

      {/* Top Sites */}
      {topDomains.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-6 space-y-3">
          <h2 className="text-lg font-semibold">Top Sites</h2>
          <div className="space-y-3">
            {topDomains.map((d) => (
              <div key={d.domain} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{d.domain}</span>
                  {showAllApps && (
                    <span className="text-[0.6875rem] text-on-surface-variant">
                      {CATEGORY_LABELS[d.category] || d.category}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium">{formatDuration(d.seconds)}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Focus Sessions */}
      {focusSessions.length > 0 && (
        <Link
          href={`/focus/${date}`}
          className="block rounded-2xl bg-surface-low p-6 card-hover"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Focus Sessions</h2>
            <span className="text-sm text-primary">{focusSessions.length} sessions</span>
          </div>
        </Link>
      )}

      {/* Timeline bar */}
      {timeline.length > 0 && totalTimelineDuration > 0 && (
        <section className="rounded-2xl bg-surface-low p-6 space-y-3">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <div className="flex h-8 overflow-hidden rounded-full">
            {timeline.map((entry, i) => {
              const duration =
                new Date(entry.endAt).getTime() - new Date(entry.startAt).getTime();
              const appInfo = allApps.find((a) => a.appKey === entry.appKey);
              const category = appInfo?.category || "uncategorized";
              return (
                <div
                  key={`${entry.appKey}-${i}`}
                  className="h-full"
                  style={{
                    width: `${(duration / totalTimelineDuration) * 100}%`,
                    backgroundColor:
                      CATEGORY_COLORS[category] || CATEGORY_COLORS.uncategorized,
                  }}
                  title={`${entry.appKey}: ${new Date(entry.startAt).toLocaleTimeString()} – ${new Date(entry.endAt).toLocaleTimeString()}`}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* AI Summary (historical days) */}
      {snapshot.aiSummary && (
        <section className="rounded-2xl bg-surface-low p-6 space-y-3">
          <h2 className="text-lg font-semibold">AI Summary</h2>
          <p className="text-sm leading-relaxed text-on-surface/90">{snapshot.aiSummary}</p>
        </section>
      )}
    </div>
  );
}
