"use client";

import { useMemo, useState } from "react";
import { generatedChangelogData } from "../changelog/generatedChangelogData";
import { MarketingFooter, MarketingInnerNav } from "./MarketingChrome";
import { MarketingCursor } from "./MarketingEffects";

type SurfaceRecord = (typeof generatedChangelogData.surfaces)[number];
type SurfaceId = SurfaceRecord["id"];
type ReleaseSection = {
  label: "New" | "Improvements" | "Fixes";
  items: string[];
};

const SURFACE_LABELS: Record<SurfaceId, string> = {
  mac: "macOS",
  windows: "Windows",
  web: "Web",
  mcp: "MCP",
};

const SURFACE_ICONS: Record<SurfaceId, string> = {
  mac: "◉",
  windows: "◫",
  web: "◎",
  mcp: "◈",
};

const REPO_URLS: Record<SurfaceId, string> = {
  web: "https://github.com/irachrist1/daylens-web",
  mac: "https://github.com/irachrist1/daylens",
  windows: "https://github.com/irachrist1/daylens-windows",
  mcp: "https://github.com/irachrist1/daylens-mcp",
};

const PLATFORM_ORDER: SurfaceId[] = ["mac", "windows", "web", "mcp"];

function cleanSubject(subject: string) {
  return subject.replace(/^(feat|fix|docs|chore):\s*/i, "").trim();
}

function isOperationalCommit(subject: string) {
  return /^(prepare|release|sync|trim|rebuild|refresh)\b/i.test(cleanSubject(subject));
}

function pickHeadlineCommit(surface: SurfaceRecord) {
  return (
    surface.recentCommits.find((commit) => !isOperationalCommit(commit.subject)) ??
    surface.recentCommits[0]
  );
}

function sentenceCase(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function headlineFromSurface(surface: SurfaceRecord) {
  const subject = cleanSubject(pickHeadlineCommit(surface)?.subject ?? surface.name);

  if (surface.id === "windows" && /multi-provider/i.test(subject)) {
    return "Multi-provider AI on Windows";
  }

  if (surface.id === "mac" && /reports, widgets/i.test(subject)) {
    return "Reports, widgets, and focus review";
  }

  if (surface.id === "web" && /roadmap\/changelog/i.test(subject)) {
    return "Roadmap, changelog, and web polish";
  }

  if (surface.id === "mcp") {
    return "Ask your AI what you were working on";
  }

  return sentenceCase(
    subject
      .replace(/^add\s+/i, "")
      .replace(/^improve\s+/i, "")
      .replace(/^support\s+/i, "")
      .replace(/^prepare\s+/i, "")
      .replace(/^release\s+/i, "")
  );
}

function introFromSurface(surface: SurfaceRecord) {
  if (surface.id === "mcp") {
    return [
      "Daylens now has an MCP server. Connect Claude Code, Cursor, Windsurf, or Claude Desktop to your local activity history and ask anything.",
      "\"Write my performance review for last quarter.\" \"When am I most focused?\" \"Why did that feature take three weeks?\" Answered from your own machine — zero cloud, zero API keys.",
    ];
  }
  return [
    `${surface.name} v${surface.version} centers on ${headlineFromSurface(surface).toLowerCase()}.`,
    surface.description,
  ];
}

function sectionForSubject(subject: string): ReleaseSection["label"] {
  const normalized = cleanSubject(subject).toLowerCase();

  if (
    /^fix\b/.test(normalized) ||
    normalized.includes(" guard ") ||
    normalized.includes("prevent ") ||
    normalized.includes("cleanup") ||
    normalized.includes("preserve ")
  ) {
    return "Fixes";
  }

  if (
    /^add\b/.test(normalized) ||
    normalized.includes("support") ||
    normalized.includes("reports") ||
    normalized.includes("widgets") ||
    normalized.includes("launch") ||
    normalized.includes("roadmap") ||
    normalized.includes("changelog")
  ) {
    return "New";
  }

  return "Improvements";
}

function sectionsFromSurface(surface: SurfaceRecord) {
  const relevantCommits = surface.recentCommits
    .filter((commit) => !isOperationalCommit(commit.subject))
    .slice(0, 8);

  const grouped = relevantCommits.reduce(
    (acc, commit) => {
      const label = sectionForSubject(commit.subject);
      acc[label].push(cleanSubject(commit.subject));
      return acc;
    },
    {
      New: [] as string[],
      Improvements: [] as string[],
      Fixes: [] as string[],
    }
  );

  return (["New", "Improvements", "Fixes"] as const)
    .map((label) => ({ label, items: grouped[label] }))
    .filter((section) => section.items.length > 0);
}

function formatDate(isoDate: string | null) {
  if (!isoDate) return "Unknown date";
  return new Date(`${isoDate}T12:00:00Z`).toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function commitUrl(surface: SurfaceRecord) {
  return `${REPO_URLS[surface.id]}/commit/${surface.latestCommitHash ?? ""}`;
}

export function ChangelogPageClient() {
  const [activeSurface, setActiveSurface] = useState<SurfaceId>("mac");

  const surface = useMemo(
    () =>
      generatedChangelogData.surfaces.find((item) => item.id === activeSurface) ??
      generatedChangelogData.surfaces[0],
    [activeSurface]
  );

  const headline = headlineFromSurface(surface);
  const intro = introFromSurface(surface);
  const sections = sectionsFromSurface(surface);
  const highlights = surface.recentCommits
    .filter((commit) => !isOperationalCommit(commit.subject))
    .slice(0, 3)
    .map((commit) => cleanSubject(commit.subject));

  return (
    <div className="lp lp-ray-changelog-page">
      <MarketingCursor />
      <MarketingInnerNav current="changelog" theme="dark" variant="capsule" />

      <main className="lp-ray-changelog-main">
        <section className="lp-container lp-ray-changelog-shell" aria-labelledby="changelog-title">
          <header className="lp-ray-changelog-header">
            <h1 id="changelog-title" className="lp-ray-changelog-title">
              Changelog
            </h1>

            <div
              className="lp-ray-platform-switch"
              role="tablist"
              aria-label="Select product surface"
            >
              {PLATFORM_ORDER.map((surfaceId) => {
                const item = generatedChangelogData.surfaces.find(
                  (candidate) => candidate.id === surfaceId
                );
                if (!item) return null;

                return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={activeSurface === item.id}
                  className={`lp-ray-platform-pill${
                    activeSurface === item.id ? " is-active" : ""
                  }`}
                  onClick={() => setActiveSurface(item.id)}
                >
                  <span className="lp-ray-platform-icon">{SURFACE_ICONS[item.id]}</span>
                  <span>{SURFACE_LABELS[item.id]}</span>
                </button>
                );
              })}
            </div>
          </header>

          <article className="lp-ray-release-entry">
            <aside className="lp-ray-release-meta">
              <a
                href={`#${surface.id}`}
                className="lp-ray-release-version"
                id={surface.id}
              >
                v{surface.version}
              </a>
              <time
                className="lp-ray-release-date"
                dateTime={surface.latestCommitDate ?? undefined}
              >
                {formatDate(surface.latestCommitDate)}
              </time>
            </aside>

            <div className="lp-ray-release-body">
              <h2 className="lp-ray-release-title">
                {headline}
              </h2>

              <div className={`lp-ray-release-media is-${surface.id}`}>
                <div className="lp-ray-release-glow" />
                <div className="lp-ray-release-panel">
                  <span className="lp-ray-release-panel-kicker">
                    {SURFACE_LABELS[surface.id]}
                  </span>
                  <strong className="lp-ray-release-panel-title">{headline}</strong>
                  <span className="lp-ray-release-panel-version">v{surface.version}</span>
                </div>
                <div className="lp-ray-release-strips" aria-hidden="true">
                  <span />
                  <span />
                </div>
              </div>

              <div className="lp-ray-release-copy">
                {intro.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              {sections.map((section) => (
                <section key={section.label} className="lp-ray-release-section">
                  <h3 className="lp-ray-release-section-title">{section.label}</h3>
                  <ul className="lp-ray-release-list">
                    {section.items.map((item) => (
                      <li key={`${section.label}-${item}`}>
                        {item.includes(":") ? (
                          <>
                            <strong>{item.split(":")[0]}</strong>
                            {`:${item.slice(item.indexOf(":") + 1)}`}
                          </>
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}

              <div className="lp-ray-release-footer">
                <div className="lp-ray-release-mini-list">
                  {highlights.map((item) => (
                    <span key={item} className="lp-ray-release-mini-pill">
                      {item}
                    </span>
                  ))}
                </div>

                <a
                  href={commitUrl(surface)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-ray-release-link"
                >
                  View latest commit
                </a>
              </div>
            </div>
          </article>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
