"use client";

import { generatedChangelogData } from "../changelog/generatedChangelogData";
import { MarketingFooter, MarketingInnerNav } from "./MarketingChrome";
import { MarketingCursor } from "./MarketingEffects";

type SurfaceId = (typeof generatedChangelogData.surfaces)[number]["id"];
type SurfaceRecord = {
  id: SurfaceId;
  name: string;
  description: string;
  version: string;
  latestCommitDate: string | null;
  latestCommitDateTime: string | null;
  latestCommitHash: string | null;
  recentCommits: ReadonlyArray<{
    date: string;
    dateTime: string;
    shortHash: string;
    subject: string;
  }>;
};

type ReleaseEntry = {
  id: string;
  surfaceId: SurfaceId;
  surfaceName: string;
  version: string;
  isoDate: string;
  isoDateTime: string;
  title: string;
  intro: string;
  sections: Array<{ title?: string; body?: string; bullets?: string[] }>;
  moreUpdates: string[];
  commitHash: string;
  commitUrl: string;
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

function formatDateTime(isoDateTime: string) {
  return new Date(isoDateTime).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function monthAnchor(isoDate: string) {
  const [year, month] = isoDate.split("-");
  return `${month}-${year}`;
}

function createEntry(
  surface: SurfaceRecord
): ReleaseEntry {
  const latestCommit = surface.recentCommits[0];
  const shippedCommits = surface.recentCommits.slice(0, 4);
  const followUpCommits = surface.recentCommits.slice(4, 7);
  const extraCommits = surface.recentCommits.slice(7, 11);
  const cleanedLatest = latestCommit
    ? latestCommit.subject.replace(/^(feat|fix|docs|chore):\s*/i, "")
    : `Latest work in ${surface.name}`;
  const cleanedTitle =
    cleanedLatest.length > 52
      ? `${surface.name} update`
      : cleanedLatest.charAt(0).toUpperCase() + cleanedLatest.slice(1);
  const intro = latestCommit
    ? `Latest work in the ${surface.name.toLowerCase()} is centered on “${cleanedLatest}.” ${surface.description}`
    : surface.description;
  const sections: ReleaseEntry["sections"] = [
    {
      title: "Latest shipped",
      bullets: shippedCommits.map((commit) => commit.subject),
    },
  ];

  if (followUpCommits.length) {
    sections.push({
      title: "Supporting work",
      bullets: followUpCommits.map((commit) => commit.subject),
    });
  }

  return {
    id: `${surface.id}-${surface.version.replaceAll(".", "-")}`,
    surfaceId: surface.id,
    surfaceName: surface.name,
    version: surface.version,
    isoDate: surface.latestCommitDate ?? generatedChangelogData.generatedAt.slice(0, 10),
    isoDateTime:
      surface.latestCommitDateTime ??
      `${surface.latestCommitDate ?? generatedChangelogData.generatedAt.slice(0, 10)}T12:00:00Z`,
    title: cleanedTitle,
    intro,
    sections,
    moreUpdates: extraCommits.map((commit) => commit.subject),
    commitHash: surface.latestCommitHash ?? "unknown",
    commitUrl: `${REPO_URLS[surface.id]}/commit/${surface.latestCommitHash ?? ""}`,
  };
}

function buildReleaseEntries(): ReleaseEntry[] {
  return (generatedChangelogData.surfaces as readonly SurfaceRecord[])
    .map((surface) => createEntry(surface))
    .sort((a, b) => b.isoDateTime.localeCompare(a.isoDateTime));
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
                          <span className="lp-dia-surface-label">{entry.surfaceName}</span>
                          <time dateTime={entry.isoDateTime} className="lp-dia-entry-date">
                            {formatDateTime(entry.isoDateTime)}
                          </time>
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
