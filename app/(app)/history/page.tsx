import { getSession } from "@/app/lib/session";
import { getConvexClient } from "@/app/lib/convex";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { redirect } from "next/navigation";
import { formatDate, formatDuration } from "@/app/lib/format";
import Link from "next/link";

export default async function HistoryPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const client = getConvexClient();
  const snapshots = await client.query(api.snapshots.list, {
    workspaceId: session.workspaceId as Id<"workspaces">,
  });

  // Sort by date descending
  const sorted = [...snapshots].sort((a, b) =>
    b.localDate.localeCompare(a.localDate)
  );

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">History</h1>

      {sorted.length === 0 ? (
        <div className="rounded-2xl bg-surface-low p-8 text-center">
          <p className="text-on-surface-variant">No synced days yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((doc) => {
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
                      {formatDate(doc.localDate)}
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
