import { getSession } from "@/app/lib/session";
import { getConvexClient } from "@/app/lib/convex";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { redirect } from "next/navigation";
import { ScoreRing } from "@/app/components/ScoreRing";
import { CategoryBar } from "@/app/components/CategoryBar";
import { SyncBanner } from "@/app/components/SyncBanner";
import { formatDuration, CATEGORY_LABELS } from "@/app/lib/format";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const client = getConvexClient();
  const today = new Date().toISOString().slice(0, 10);

  const snapshotDoc = await client.query(api.snapshots.getByDate, {
    workspaceId: session.workspaceId as Id<"workspaces">,
    localDate: today,
  });

  const snapshot = snapshotDoc?.snapshot;

  if (!snapshot) {
    return (
      <div className="px-6 py-8 max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <SyncBanner />
        <div className="rounded-2xl bg-surface-low p-8 text-center">
          <p className="text-on-surface-variant">No data for today yet.</p>
          <p className="mt-2 text-sm text-on-surface-variant/60">
            Open Daylens on your Mac and it will sync automatically.
          </p>
        </div>
      </div>
    );
  }

  const topApps = (snapshot.appSummaries || []).slice(0, 8);
  const categoryTotals = snapshot.categoryTotals || [];
  const topDomains = (snapshot.topDomains || []).slice(0, 5);

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Today</h1>
        <SyncBanner syncedAt={snapshotDoc?.syncedAt} />
      </div>

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
        <section className="rounded-2xl bg-surface-low p-6 space-y-4">
          <h2 className="text-lg font-semibold">Categories</h2>
          <CategoryBar totals={categoryTotals} />
        </section>
      )}

      {/* Top Apps */}
      {topApps.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-6 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top Apps</h2>
            <Link
              href={`/apps/${today}`}
              className="text-xs text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {topApps.map((app: { appKey: string; displayName: string; category: string; totalSeconds: number; sessionCount: number }) => (
              <div key={app.appKey} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-surface-high flex items-center justify-center text-xs font-bold text-primary">
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

      {/* Top Domains */}
      {topDomains.length > 0 && (
        <section className="rounded-2xl bg-surface-low p-6 space-y-3">
          <h2 className="text-lg font-semibold">Top Sites</h2>
          <div className="space-y-3">
            {topDomains.map((d: { domain: string; seconds: number; category: string }) => (
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
          href={`/focus/${today}`}
          className="block rounded-2xl bg-surface-low p-6 card-hover"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Focus Sessions</h2>
            <span className="text-sm text-primary">{snapshot.focusSessions.length} sessions</span>
          </div>
        </Link>
      )}

      {/* Timeline summary */}
      {(snapshot.timeline?.length || 0) > 0 && (
        <section className="rounded-2xl bg-surface-low p-6 space-y-3">
          <h2 className="text-lg font-semibold">Timeline</h2>
          <div className="flex h-8 overflow-hidden rounded-full">
            {snapshot.timeline.map((entry: { appKey: string; startAt: string; endAt: string }, i: number) => {
              const start = new Date(entry.startAt).getTime();
              const end = new Date(entry.endAt).getTime();
              const duration = end - start;
              const totalDuration = snapshot.timeline.reduce((sum: number, e: { startAt: string; endAt: string }) => {
                return sum + (new Date(e.endAt).getTime() - new Date(e.startAt).getTime());
              }, 0);
              const appInfo = topApps.find((a: { appKey: string }) => a.appKey === entry.appKey);
              const category = appInfo?.category || "uncategorized";
              const { CATEGORY_COLORS } = require("@/app/lib/format");
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
