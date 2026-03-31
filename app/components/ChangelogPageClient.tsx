"use client";

import { generatedChangelogData } from "../changelog/generatedChangelogData";
import { MarketingFooter, MarketingInnerNav } from "./MarketingChrome";
import { MarketingCursor } from "./MarketingEffects";

type SurfaceId = (typeof generatedChangelogData.surfaces)[number]["id"];

type ReleaseEntry = {
  id: string;
  surfaceId: SurfaceId;
  surfaceName: string;
  version: string;
  isoDate: string;
  title: string;
  intro: string;
  sections: Array<{ title?: string; body?: string; bullets?: string[] }>;
  moreUpdates: string[];
  commitHash: string;
  commitUrl: string;
};

const REPO_LABELS: Record<SurfaceId, string> = {
  web: "daylens-web",
  mac: "daylens",
  windows: "daylens-windows",
};

const REPO_URLS: Record<SurfaceId, string> = {
  web: "https://github.com/irachrist1/daylens-web",
  mac: "https://github.com/irachrist1/daylens",
  windows: "https://github.com/irachrist1/daylens-windows",
};

function formatMonthLabel(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatMonthShort(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
}

function formatFullDate(isoDate: string) {
  return new Date(`${isoDate}T12:00:00Z`).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function monthAnchor(isoDate: string) {
  const [year, month] = isoDate.split("-");
  return `${month}-${year}`;
}

function createEntry(
  surfaceId: SurfaceId,
  title: string,
  intro: string,
  sections: ReleaseEntry["sections"],
  moreUpdates: string[]
): ReleaseEntry {
  const surface = generatedChangelogData.surfaces.find((item) => item.id === surfaceId);
  if (!surface) {
    throw new Error(`Missing changelog surface for ${surfaceId}`);
  }

  return {
    id: `${surfaceId}-${surface.version.replaceAll(".", "-")}`,
    surfaceId,
    surfaceName: surface.name,
    version: surface.version,
    isoDate: surface.latestCommitDate ?? generatedChangelogData.generatedAt.slice(0, 10),
    title,
    intro,
    sections,
    moreUpdates,
    commitHash: surface.latestCommitHash ?? "unknown",
    commitUrl: `${REPO_URLS[surfaceId]}/commit/${surface.latestCommitHash ?? ""}`,
  };
}

function buildReleaseEntries(): ReleaseEntry[] {
  const windows = generatedChangelogData.surfaces.find((surface) => surface.id === "windows");
  const mac = generatedChangelogData.surfaces.find((surface) => surface.id === "mac");
  const web = generatedChangelogData.surfaces.find((surface) => surface.id === "web");

  if (!windows || !mac || !web) {
    return [];
  }

  return [
    createEntry(
      "windows",
      `What’s new in Daylens Windows ${windows.version}`,
      `Daylens for Windows just took a real step forward. Version ${windows.version} adds multi-provider AI support across Anthropic, OpenAI, and Google, so the app no longer assumes one backend or one model path when you open Insights.`,
      [
        {
          title: "Choose the model stack that fits your setup.",
          body:
            "Provider and model selection now live directly in onboarding and Settings, which means Windows users can choose how they want Daylens to think instead of being locked into a single provider decision.",
        },
        {
          title: "Credentials now follow the provider.",
          body:
            "API keys are stored per provider through the OS credential vault, and the app now resolves the active backend from your selected provider and configured key before sending a message.",
        },
        {
          title: "The surrounding product got tighter too.",
          bullets: [
            "Insights and onboarding copy now adapt to the selected provider.",
            "Updater IPC and install flow were tightened as part of the same push.",
            "This shipped as commit e3c64de across 16 files and more than a thousand added lines.",
          ],
        },
      ],
      windows.recentCommits.slice(1, 4).map((commit) => commit.subject)
    ),
    createEntry(
      "mac",
      `What’s new in Daylens for macOS ${mac.version}`,
      `The macOS app keeps pushing the core Daylens idea forward: cleaner recall, stronger reports, and a better explanation of what your day actually contained. The latest build keeps that native surface as the clearest expression of the product.`,
      [
        {
          title: "Reports and review keep getting more grounded.",
          body:
            "Recent macOS work added reports, widgets, stronger Insights routing, and focus improvements so the app does a better job turning tracked activity into something you can revisit and understand.",
        },
        {
          title: "Planning and timeline context keep getting sharper.",
          bullets: [
            "Focus planner work landed as part of the 1.0.21 release prep.",
            "Reports, profiles, and work context timeline improvements all moved in together.",
            "Fullscreen playback tracking and updater reliability kept getting patched underneath.",
          ],
        },
      ],
      mac.recentCommits.slice(1, 5).map((commit) => commit.subject)
    ),
    createEntry(
      "web",
      `What’s new in the Daylens web companion ${web.version}`,
      `The web companion has been catching up to the product itself. Instead of feeling like a utility wrapper around the desktop apps, it now reads more like a proper Daylens surface with docs, roadmap, changelog, recovery, and pairing all moving into one calmer system.`,
      [
        {
          title: "The public product pages now read like a real product journal.",
          body:
            "Docs, roadmap, and changelog were rebuilt as first-class pages, and the changelog now pulls directly from local repo history instead of hand-written summaries.",
        },
        {
          title: "The web shell got cleaner in the details.",
          bullets: [
            "Font handling and favicon paths were fixed for the /daylens basePath.",
            "Public route access and unauthenticated redirects were tightened.",
            "The landing copy now explains Daylens in the same terms as the app itself.",
          ],
        },
      ],
      web.recentCommits.slice(1, 5).map((commit) => commit.subject)
    ),
  ].sort((a, b) => b.isoDate.localeCompare(a.isoDate));
}

export function ChangelogPageClient() {
  const entries = buildReleaseEntries();
  const monthGroups = Array.from(
    entries.reduce((acc, entry) => {
      const key = monthAnchor(entry.isoDate);
      const existing = acc.get(key);
      if (existing) {
        existing.entries.push(entry);
        return acc;
      }

      acc.set(key, {
        key,
        label: formatMonthLabel(entry.isoDate),
        shortLabel: formatMonthShort(entry.isoDate),
        year: entry.isoDate.slice(0, 4),
        entries: [entry],
      });
      return acc;
    }, new Map<string, { key: string; label: string; shortLabel: string; year: string; entries: ReleaseEntry[] }>())
      .values()
  );

  const archiveYears = Array.from(
    monthGroups.reduce((acc, group) => {
      const existing = acc.get(group.year);
      if (existing) {
        existing.push(group);
      } else {
        acc.set(group.year, [group]);
      }
      return acc;
    }, new Map<string, typeof monthGroups>())
  );

  return (
    <div className="lp lp-dia-page">
      <MarketingCursor />
      <MarketingInnerNav current="changelog" theme="light" />

      <main className="lp-dia-main">
        <section className="lp-container lp-dia-shell" aria-labelledby="daylens-changelog-title">
          <aside className="lp-dia-archive" aria-label="Changelog archive">
            <h1 id="daylens-changelog-title" className="lp-dia-archive-title">
              Changelog
            </h1>
            <p className="lp-dia-archive-copy">
              Real shipped updates across Daylens for macOS, Windows, and the
              web companion.
            </p>

            <nav className="lp-dia-archive-nav" aria-label="Release notes by month">
              {archiveYears.map(([year, groups]) => (
                <div key={year} className="lp-dia-archive-year">
                  <p className="lp-dia-year-label">{year}</p>
                  <div className="lp-dia-month-links">
                    {groups.map((group) => (
                      <a key={group.key} href={`#${group.key}`} className="lp-dia-month-link">
                        <span className="lp-dia-month-dot" />
                        <span>{group.label.split(" ")[0]}</span>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>

          <div className="lp-dia-content">
            <div className="lp-dia-mobile-heading">
              <h1 className="lp-dia-mobile-title">Changelog</h1>
              <p className="lp-dia-mobile-copy">
                Real shipped updates across the Daylens product surfaces.
              </p>
            </div>

            {monthGroups.map((group) => (
              <section
                key={group.key}
                id={group.key}
                className="lp-dia-month-group"
                aria-labelledby={`${group.key}-heading`}
              >
                <div className="lp-dia-month-rail" aria-hidden="true">
                  <div className="lp-dia-month-rail-inner">
                    <span className="lp-dia-month-short">{group.shortLabel}</span>
                    <span className="lp-dia-month-rail-dot" />
                  </div>
                </div>

                <div className="lp-dia-month-content">
                  <h2 id={`${group.key}-heading`} className="sr-only">
                    {group.label}
                  </h2>

                  {group.entries.map((entry) => (
                    <article
                      key={entry.id}
                      id={entry.id}
                      className="lp-dia-entry"
                      aria-labelledby={`${entry.id}-title`}
                    >
                      <div className="lp-dia-entry-head">
                        <div className="lp-dia-entry-meta">
                          <span className="lp-dia-version-pill">v{entry.version}</span>
                          <time dateTime={entry.isoDate} className="lp-dia-entry-date">
                            {formatFullDate(entry.isoDate)}
                          </time>
                          <span className="lp-dia-surface-chip">{entry.surfaceName}</span>
                        </div>
                        <a
                          id={`${entry.id}-title`}
                          href={`#${entry.id}`}
                          className="lp-dia-entry-title"
                        >
                          {entry.title}
                        </a>
                      </div>

                      <div className="lp-dia-entry-body">
                        <p>{entry.intro}</p>

                        {entry.sections.map((section, index) => (
                          <section key={`${entry.id}-section-${index}`} className="lp-dia-section">
                            {section.title ? (
                              <h3 className="lp-dia-section-title">{section.title}</h3>
                            ) : null}
                            {section.body ? <p>{section.body}</p> : null}
                            {section.bullets?.length ? (
                              <ul className="lp-dia-bullet-list">
                                {section.bullets.map((bullet) => (
                                  <li key={bullet}>{bullet}</li>
                                ))}
                              </ul>
                            ) : null}
                          </section>
                        ))}

                        {entry.moreUpdates.length ? (
                          <section className="lp-dia-section">
                            <h3 className="lp-dia-section-title">
                              Plus more shipped work in this build:
                            </h3>
                            <ul className="lp-dia-bullet-list">
                              {entry.moreUpdates.map((update) => (
                                <li key={update}>{update}</li>
                              ))}
                            </ul>
                          </section>
                        ) : null}

                        <div className="lp-dia-entry-footer">
                          <a
                            href={entry.commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lp-dia-entry-link"
                          >
                            View commit {entry.commitHash} on GitHub
                          </a>
                          <span className="lp-dia-entry-repo">
                            {REPO_LABELS[entry.surfaceId]}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
