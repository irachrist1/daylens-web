"use client";

import { useEffect, useState } from "react";

interface Prefs {
  hiddenApps: string[];
  hiddenDomains: string[];
}

export function PrivacySection() {
  const [prefs, setPrefs] = useState<Prefs | null>(null);

  useEffect(() => {
    void fetch("/api/preferences")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setPrefs(data))
      .catch(() => {});
  }, []);

  async function restore(action: "showApp" | "showDomain", key: string) {
    const body = action === "showApp" ? { action, appKey: key } : { action, domain: key };
    const res = await fetch("/api/preferences", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setPrefs((prev) => {
        if (!prev) return prev;
        return {
          hiddenApps:
            action === "showApp"
              ? prev.hiddenApps.filter((k) => k !== key)
              : prev.hiddenApps,
          hiddenDomains:
            action === "showDomain"
              ? prev.hiddenDomains.filter((d) => d !== key)
              : prev.hiddenDomains,
        };
      });
    }
  }

  const totalHidden = (prefs?.hiddenApps.length ?? 0) + (prefs?.hiddenDomains.length ?? 0);

  if (!prefs) return null;

  return (
    <section className="rounded-2xl glass-card p-4 sm:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Privacy</h2>
        {totalHidden > 0 && (
          <span className="text-xs text-on-surface-variant">
            {totalHidden} hidden
          </span>
        )}
      </div>

      {totalHidden === 0 ? (
        <p className="text-sm text-on-surface-variant">
          No apps or sites are hidden. Use the Hide button on the dashboard to hide
          items you don&apos;t want to see.
        </p>
      ) : (
        <div className="space-y-4">
          {prefs.hiddenApps.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Hidden Apps
              </p>
              {prefs.hiddenApps.map((appKey) => (
                <div key={appKey} className="flex items-center justify-between">
                  <span className="text-sm truncate text-on-surface">{appKey}</span>
                  <button
                    type="button"
                    onClick={() => restore("showApp", appKey)}
                    className="shrink-0 rounded-lg border border-outline-variant/20 px-3 py-1 text-xs text-primary hover:bg-primary/5 transition-colors"
                  >
                    Show
                  </button>
                </div>
              ))}
            </div>
          )}

          {prefs.hiddenDomains.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Hidden Sites
              </p>
              {prefs.hiddenDomains.map((domain) => (
                <div key={domain} className="flex items-center justify-between">
                  <span className="text-sm truncate text-on-surface">{domain}</span>
                  <button
                    type="button"
                    onClick={() => restore("showDomain", domain)}
                    className="shrink-0 rounded-lg border border-outline-variant/20 px-3 py-1 text-xs text-primary hover:bg-primary/5 transition-colors"
                  >
                    Show
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
