"use client";

import Link from "next/link";
import { generatedChangelogData } from "../changelog/generatedChangelogData";
import { MarketingFooter, MarketingInnerNav } from "./MarketingChrome";
import { MarketingCursor, useReveal } from "./MarketingEffects";

const REPO_LABELS: Record<string, string> = {
  web: "daylens-web",
  mac: "daylens",
  windows: "daylens-windows",
};

export function ChangelogPageClient() {
  useReveal();
  const surfaceMap = Object.fromEntries(
    generatedChangelogData.surfaces.map((surface) => [surface.id, surface])
  );
  const webSurface = surfaceMap.web;
  const macSurface = surfaceMap.mac;
  const windowsSurface = surfaceMap.windows;

  const marqueeItems = generatedChangelogData.surfaces.flatMap((surface) => [
    `${surface.name} v${surface.version}`,
    `Latest ${surface.latestCommitDate ?? "unknown"}`,
    surface.recentCommits[0]?.subject ?? "No recent commits",
  ]);

  const ticker = [...marqueeItems, ...marqueeItems];
  const refreshedAt = new Date(generatedChangelogData.generatedAt).toLocaleString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }
  );

  return (
    <div className="lp">
      <MarketingCursor />
      <MarketingInnerNav current="changelog" />

      <section className="lp-story-hero lp-story-hero--issue">
        <div className="lp-story-hero-bg" aria-hidden="true" />

        <div className="lp-container lp-story-hero-shell">
          <div className="lp-story-hero-copy">
            <div
              className="lp-accent-rule"
              style={{ animation: "lp-fadeIn 0.6s var(--ease-out-expo) 0.2s both" }}
            />
            <p
              className="text-label lp-overline"
              style={{ animation: "lp-fadeIn 0.6s var(--ease-out-expo) 0.2s both" }}
            >
              Changelog
            </p>
            <h1
              className="text-display-xl lp-story-hero-title"
              style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.4s both" }}
            >
              Recent commits.
              <br />
              No guesswork.
            </h1>
            <p
              className="lp-story-hero-sub"
              style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.65s both" }}
            >
              This page now reads from the real local git history for the web
              companion, the macOS app, and the Windows app. If the repos moved,
              the page should move with them.
            </p>
            <div
              className="lp-hero-ctas"
              style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.85s both" }}
            >
              <Link href="/roadmap" className="lp-btn-primary">
                See what&apos;s next <span>→</span>
              </Link>
              <a href="/daylens/api/download/mac" className="lp-btn-ghost-light">
                Download Daylens <span>→</span>
              </a>
            </div>
            <p
              className="lp-fine"
              style={{ animation: "lp-fadeIn 0.8s var(--ease-out-expo) 1.05s both" }}
            >
              Refreshed from local repos on {refreshedAt}.
            </p>
          </div>

          <div className="lp-issue-card reveal-scale">
            <div className="lp-issue-card-row">
              <span className="text-label lp-issue-card-label">Surfaces tracked</span>
              <span className="lp-issue-card-value">
                {generatedChangelogData.surfaces.length}
              </span>
            </div>
            <div className="lp-issue-card-row">
              <span className="text-label lp-issue-card-label">Current web build</span>
              <span className="lp-issue-card-value">
                v{webSurface?.version ?? "unknown"}
              </span>
            </div>
            <div className="lp-issue-card-row">
              <span className="text-label lp-issue-card-label">Current mac build</span>
              <span className="lp-issue-card-value">
                v{macSurface?.version ?? "unknown"}
              </span>
            </div>
            <div className="lp-issue-card-row">
              <span className="text-label lp-issue-card-label">Current Windows build</span>
              <span className="lp-issue-card-value">
                v{windowsSurface?.version ?? "unknown"}
              </span>
            </div>
          </div>
        </div>

        <div
          className="lp-scroll-hint"
          style={{ animation: "lp-fadeIn 0.6s ease 1.4s both" }}
        >
          <div className="lp-scroll-line" />
          <span className="text-label">scroll</span>
        </div>
      </section>

      <div className="lp-proof-strip" aria-hidden="true">
        <div className="lp-marquee-track">
          {ticker.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="lp-marquee-item text-label"
              style={{
                color:
                  index % 3 === 2
                    ? "var(--lp-accent)"
                    : "rgba(252,249,248,0.2)",
              }}
            >
              {item}
              <span className="lp-marquee-sep">·</span>
            </span>
          ))}
        </div>
      </div>

      <section className="lp-section lp-section--light">
        <div className="lp-container">
          <div className="lp-section-intro reveal">
            <span className="text-label lp-overline-dark">Source of truth</span>
            <p className="lp-section-desc">
              The changelog is generated from three local repos. No fake release
              summaries, no guessed version numbers, and no assumptions about
              what made it into a release unless the git history says so.
            </p>
          </div>

          <div className="lp-split">
            <div className="lp-split-visual reveal">
              <div className="lp-story-note-panel img-reveal">
                <span className="text-label lp-story-note-kicker">Tracked repos</span>
                <div className="lp-story-note-list">
                  {generatedChangelogData.surfaces.map((surface) => (
                    <div key={surface.id} className="lp-story-note-item">
                      <span className="lp-story-note-dot" />
                      {REPO_LABELS[surface.id]} — v{surface.version}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lp-split-content reveal delay-200">
              <div className="lp-accent-rule" />
              <h2 className="text-display-md lp-feature-title">
                Generated from the
                <br />
                actual repos.
              </h2>
              <p className="lp-feature-body">
                The updater reads recent local commits from `daylens-web`,
                `daylens`, and `daylens-windows`, writes a generated data module,
                and the page renders directly from that file. The manual refresh
                path is `npm run sync:changelog-page`, and the reusable Codex
                skill is `daylens-changelog-sync`.
              </p>
              <ul className="lp-bullets">
                <li>— Web version comes from this repo&apos;s package.json</li>
                <li>— macOS version comes from the public changelog top entry</li>
                <li>— Windows version comes from the current package.json build</li>
                <li>— Recent commit subjects are shown exactly as written</li>
              </ul>
              <Link href="/roadmap" className="lp-btn-ghost-dark">
                Compare with the roadmap <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--dark lp-section--gridded">
        <div className="lp-container">
          <div className="lp-signature">
            <div className="lp-signature-text reveal-left">
              <span className="text-label lp-overline">Current builds</span>
              <h2 className="text-display-lg lp-sig-title">
                One product.
                <br />
                Three codebases.
              </h2>
              <p className="lp-sig-body">
                Daylens is shipping through three active repos right now. This
                section shows the current build version and latest commit date for
                each one, straight from the local checkout.
              </p>
              <ul className="lp-sig-bullets">
                <li>
                  <span className="lp-bullet-dot" />
                  The web companion is the public surface and the access layer
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  The macOS app is the native core and report-heavy product surface
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  The Windows app is its own build stream with separate packaging
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  The changelog now reflects that split instead of flattening it
                </li>
              </ul>
            </div>

            <div className="lp-story-signature-visual reveal">
              <div className="lp-story-surface-grid">
                {generatedChangelogData.surfaces.map((surface) => (
                  <div
                    key={surface.id}
                    className={`lp-story-surface-card${
                      surface.id === "windows" ? " lp-story-surface-card--wide" : ""
                    }`}
                  >
                    <span className="text-label lp-story-mini-label">{surface.name}</span>
                    <p className="lp-story-surface-title">v{surface.version}</p>
                    <p className="lp-story-surface-copy">{surface.description}</p>
                    <p className="lp-story-surface-meta">
                      Latest commit: {surface.latestCommitDate ?? "unknown"} ·{" "}
                      {surface.latestCommitHash ?? "n/a"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--light">
        <div className="lp-container">
          <div className="reveal">
            <span className="text-label lp-overline-dark">Recent commit streams</span>
            <h2 className="text-display-md lp-metrics-title">
              The latest repo history,
              <br />
              without interpretation.
            </h2>
          </div>

          <div className="lp-release-list">
            {generatedChangelogData.surfaces.map((surface, index) => (
              <article
                key={surface.id}
                className={`lp-release-entry reveal delay-${(index + 1) * 100}`}
              >
                <aside className="lp-release-meta">
                  <span className="text-label lp-release-kicker">{surface.name}</span>
                  <div className="lp-release-meta-block">
                    <span className="lp-release-meta-label">Current build</span>
                    <span className="lp-release-meta-value">v{surface.version}</span>
                  </div>
                  <div className="lp-release-meta-block">
                    <span className="lp-release-meta-label">Latest commit</span>
                    <span className="lp-release-meta-value">
                      {surface.latestCommitDate ?? "unknown"} ·{" "}
                      {surface.latestCommitHash ?? "n/a"}
                    </span>
                  </div>
                  <div className="lp-release-meta-block">
                    <span className="lp-release-meta-label">Repo</span>
                    <span className="lp-release-meta-value">
                      {REPO_LABELS[surface.id]}
                    </span>
                  </div>
                </aside>

                <div className="lp-release-body">
                  <h3 className="text-display-md lp-release-title">
                    {surface.name} · v{surface.version}
                  </h3>
                  <p className="lp-release-intro">{surface.description}</p>

                  <section className="lp-release-group">
                    <span className="text-label lp-release-group-label">
                      Recent commits
                    </span>
                    <ul className="lp-release-commit-list">
                      {surface.recentCommits.map((commit) => (
                        <li key={`${surface.id}-${commit.shortHash}`} className="lp-release-commit-item">
                          <span className="lp-release-commit-subject">{commit.subject}</span>
                          <span className="lp-release-commit-meta">
                            {commit.date} · {commit.shortHash}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--dark">
        <div className="lp-container">
          <div className="lp-cta-block reveal">
            <div className="lp-accent-rule" />
            <h2 className="text-display-lg lp-cta-title">
              Refresh the data.
              <br />
              Then ship again.
            </h2>
            <p className="lp-cta-sub">
              Run `npm run sync:changelog-page` whenever the repos move, or use
              the `daylens-changelog-sync` skill to refresh the generated data
              and rebuild the page.
            </p>
            <div className="lp-cta-actions">
              <Link href="/roadmap" className="lp-btn-primary">
                Open the roadmap <span>→</span>
              </Link>
              <Link href="/docs" className="lp-btn-ghost-light">
                Explore documentation <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
