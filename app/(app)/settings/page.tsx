import { getSession } from "@/app/lib/session";
import { getConvexClient } from "@/app/lib/convex";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { redirect } from "next/navigation";
import { formatRelativeTime } from "@/app/lib/format";
import { DisconnectButton } from "./DisconnectButton";
import { DownloadButton } from "./DownloadButton";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const client = getConvexClient();

  const devices = await client.query(api.devices.listByWorkspace, {
    workspaceId: session.workspaceId as Id<"workspaces">,
  });

  const snapshots = await client.query(api.snapshots.list, {
    workspaceId: session.workspaceId as Id<"workspaces">,
  });

  return (
    <div className="px-6 py-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Linked Devices */}
      <section className="rounded-2xl bg-surface-low p-6 space-y-4">
        <h2 className="text-lg font-semibold">Linked Devices</h2>
        {devices.length === 0 ? (
          <p className="text-sm text-on-surface-variant">No devices linked.</p>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device._id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{device.displayName}</p>
                  <p className="text-xs text-on-surface-variant">
                    {device.platform} · Last sync{" "}
                    {formatRelativeTime(device.lastSyncAt)}
                  </p>
                </div>
                <DisconnectButton deviceId={device._id} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Data */}
      <section className="rounded-2xl bg-surface-low p-6 space-y-4">
        <h2 className="text-lg font-semibold">Your Data</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Download Data</p>
            <p className="text-xs text-on-surface-variant">
              Export all {snapshots.length} synced days as JSON
            </p>
          </div>
          <DownloadButton />
        </div>
      </section>

      {/* Recovery */}
      <section className="rounded-2xl bg-surface-low p-6 space-y-4">
        <h2 className="text-lg font-semibold">Account</h2>
        <div className="space-y-2">
          <p className="text-sm text-on-surface-variant">
            Workspace ID: {session.workspaceId}
          </p>
          <a
            href="/recover"
            className="text-sm text-primary hover:underline"
          >
            Recover a different workspace
          </a>
        </div>
      </section>

      {/* Disconnect */}
      <section className="rounded-2xl bg-surface-low p-6 space-y-4">
        <h2 className="text-lg font-semibold text-error">Danger Zone</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Disconnect Web Browser</p>
            <p className="text-xs text-on-surface-variant">
              Removes session cookie. Your Mac data remains.
            </p>
          </div>
          <form action="/api/logout" method="POST">
            <button
              type="submit"
              className="rounded-lg border border-error/30 px-3 py-1.5 text-sm text-error hover:bg-error/10 transition-colors"
            >
              Disconnect
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
