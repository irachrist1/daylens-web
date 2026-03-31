"use client";

import Link from "next/link";
import { MarketingFooter, MarketingInnerNav } from "./MarketingChrome";
import { MarketingCursor, useReveal } from "./MarketingEffects";

const CHANGELOG_TICKER = [
  "Issue 004 · Web companion 0.2.2",
  "Issue 003 · macOS 1.0.23",
  "Issue 002 · Windows 1.2.0",
  "Premium docs and recovery",
  "Reports grounded to the right timeframe",
  "Windows Intelligent Monolith redesign",
];

const RELEASES = [
  {
    issue: "004",
    anchor: "issue-004",
    date: "March 31, 2026",
    surface: "Web companion",
    version: "0.2.2 current build",
    title: "The web companion stopped feeling secondary.",
    intro:
      "The latest web work focused on presentation and trust. Landing, docs, pairing, and recovery all moved into the same calmer design language so the companion finally feels like part of Daylens instead of a utility around it.",
    groups: [
      {
        label: "New",
        items: [
          "Premium documentation, pairing, and recovery surfaces",
          "Footer paths for docs, roadmap, and changelog as first-class pages",
          "A cleaner marketing shell shared across the public site",
        ],
      },
      {
        label: "Changed",
        items: [
          "The landing experience now speaks in the same restrained system as the rest of the site",
          "Marketing copy was rewritten around outcomes instead of raw feature lists",
        ],
      },
      {
        label: "Fixed",
        items: [
          "Next Image paths now honor the `/daylens` basePath in production",
          "Download and route assets stay aligned with the proxy deployment setup",
        ],
      },
    ],
  },
  {
    issue: "003",
    anchor: "issue-003",
    date: "March 30, 2026",
    surface: "macOS",
    version: "1.0.23",
    title: "Reports learned the right timeframe.",
    intro:
      "The latest macOS release tightened the most important thing in Daylens: whether the explanation matches the day you asked about. Reports, week review, and Insights all got more grounded and more direct.",
    groups: [
      {
        label: "Added",
        items: [
          "Richer daily and weekly reports with saved report controls",
          "A cleaner open-source repo surface for launch contributors",
          "Standard community and release files for public readiness",
        ],
      },
      {
        label: "Changed",
        items: [
          "Insights answers are more direct about exact-time questions",
          "Week in Review is more useful while the week is still in progress",
          "Reports UI is cleaner and easier to scan",
        ],
      },
      {
        label: "Fixed",
        items: [
          "Live website carryover no longer leaks into a new day",
          "Conversation continuity in Insights is more reliable",
          "Timeline popovers recover app icons more consistently",
        ],
      },
    ],
  },
  {
    issue: "002",
    anchor: "issue-002",
    date: "March 24, 2026",
    surface: "Windows",
    version: "1.2.0",
    title: "Windows found its own language.",
    intro:
      "The Windows app moved into the Intelligent Monolith system: more editorial, more structured, and less like a generic dashboard. Every major view was restyled around meaning-first reading.",
    groups: [
      {
        label: "Design system",
        items: [
          "Surface tokens replaced hardcoded dark values so light mode behaves correctly",
          "The sidebar, cards, chips, and glass panels were rebuilt around the new hierarchy",
          "DESIGN.md now documents the full Windows language and view-by-view layouts",
        ],
      },
      {
        label: "Views",
        items: [
          "Dashboard, Timeline, Apps, Focus, Settings, and Insights were all redesigned",
          "The Timeline gained filter pills, a vertical story structure, and sticky summary footer",
          "Apps and Focus now read as intentional product surfaces instead of utility pages",
        ],
      },
      {
        label: "Effect",
        items: [
          "Information density increased without turning the UI noisy",
          "Interpretation-first layouts now lead the eye before raw tables appear",
          "Windows feels materially closer to the Daylens product vision",
        ],
      },
    ],
  },
];

export function ChangelogPageClient() {
  useReveal();
  const marqueeItems = [...CHANGELOG_TICKER, ...CHANGELOG_TICKER];

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
              Every release.
              <br />
              Written down.
            </h1>
            <p
              className="lp-story-hero-sub"
              style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.65s both" }}
            >
              Daylens ships across native desktop apps and a companion web
              experience. This page keeps the record concise, factual, and close
              to what actually changed.
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
              One product journal across macOS, Windows, and the web.
            </p>
          </div>

          <div className="lp-issue-card reveal-scale">
            <div className="lp-issue-card-row">
              <span className="text-label lp-issue-card-label">Issue No.</span>
              <span className="lp-issue-card-value">004</span>
            </div>
            <div className="lp-issue-card-row">
              <span className="text-label lp-issue-card-label">Surface</span>
              <span className="lp-issue-card-value">Web companion</span>
            </div>
            <div className="lp-issue-card-row">
              <span className="text-label lp-issue-card-label">App version</span>
              <span className="lp-issue-card-value">0.2.2 current build</span>
            </div>
            <div className="lp-issue-card-row">
              <span className="text-label lp-issue-card-label">Published</span>
              <span className="lp-issue-card-value">March 31, 2026</span>
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
          {marqueeItems.map((item, index) => (
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
            <span className="text-label lp-overline-dark">Latest issue</span>
            <p className="lp-section-desc">
              The current web companion build is mostly about feel: sharper copy,
              calmer navigation, and better trust signals around pairing,
              recovery, and documentation.
            </p>
          </div>

          <div className="lp-split">
            <div className="lp-split-visual reveal">
              <div className="lp-story-note-panel img-reveal">
                <span className="text-label lp-story-note-kicker">Web companion</span>
                <div className="lp-story-note-lines">
                  <div className="lp-story-note-line lp-story-note-line--strong" />
                  <div className="lp-story-note-line" />
                  <div className="lp-story-note-line lp-story-note-line--short" />
                </div>
                <div className="lp-story-note-list">
                  <div className="lp-story-note-item">
                    <span className="lp-story-note-dot" />
                    Premium docs and recovery
                  </div>
                  <div className="lp-story-note-item">
                    <span className="lp-story-note-dot" />
                    Shared marketing chrome
                  </div>
                  <div className="lp-story-note-item">
                    <span className="lp-story-note-dot" />
                    BasePath-safe route fixes
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-split-content reveal delay-200">
              <div className="lp-accent-rule" />
              <h2 className="text-display-md lp-feature-title">
                The companion now
                <br />
                feels deliberate.
              </h2>
              <p className="lp-feature-body">
                The web surface stopped behaving like a utility shell. Docs,
                recovery, landing, and pairing now share the same tone and
                spacing discipline as the rest of the Daylens brand.
              </p>
              <ul className="lp-bullets">
                <li>— Premium docs, recovery, and connect flows</li>
                <li>— Route and asset fixes for the `/daylens` basePath</li>
                <li>— Footer navigation that treats product pages like a system</li>
                <li>— A calmer release surface for roadmap and changelog notes</li>
              </ul>
              <Link href="/docs" className="lp-btn-ghost-dark">
                Read the docs <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--dark lp-section--gridded">
        <div className="lp-container">
          <div className="lp-signature">
            <div className="lp-signature-text reveal-left">
              <span className="text-label lp-overline">Release rhythm</span>
              <h2 className="text-display-lg lp-sig-title">
                One changelog.
                <br />
                Three surfaces.
              </h2>
              <p className="lp-sig-body">
                The product is native-first, but the story is shared. This page
                keeps macOS, Windows, and the web companion in one release journal
                so the product direction stays easy to follow.
              </p>
              <ul className="lp-sig-bullets">
                <li>
                  <span className="lp-bullet-dot" />
                  macOS notes stay focused on grounded reports and better recall
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  Windows notes track parity work and interface maturity
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  Web notes cover access, pairing, docs, and mobile visibility
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  Everything here is sourced from repo changelogs or shipped commits
                </li>
              </ul>
              <Link href="/roadmap" className="lp-btn-ghost-light">
                Compare with the roadmap <span>→</span>
              </Link>
            </div>

            <div className="lp-story-signature-visual reveal">
              <div className="lp-story-surface-grid">
                <div className="lp-story-surface-card">
                  <span className="text-label lp-story-mini-label">macOS</span>
                  <p className="lp-story-surface-title">Grounds the analysis.</p>
                  <p className="lp-story-surface-copy">
                    Reports, exact-time answers, and a steadier week review.
                  </p>
                </div>
                <div className="lp-story-surface-card">
                  <span className="text-label lp-story-mini-label">Windows</span>
                  <p className="lp-story-surface-title">Refines the language.</p>
                  <p className="lp-story-surface-copy">
                    Intelligent Monolith design work and parity-focused upgrades.
                  </p>
                </div>
                <div className="lp-story-surface-card lp-story-surface-card--wide">
                  <span className="text-label lp-story-mini-label">Web companion</span>
                  <p className="lp-story-surface-title">Carries the public face.</p>
                  <p className="lp-story-surface-copy">
                    Docs, pairing, recovery, and route polish now feel like a single system.
                  </p>
                </div>
              </div>

              <div className="lp-stat-card">
                <div className="lp-stat-num">3</div>
                <div className="lp-stat-label">Release surfaces tracked here</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--light">
        <div className="lp-container">
          <div className="reveal">
            <span className="text-label lp-overline-dark">Release issues</span>
            <h2 className="text-display-md lp-metrics-title">
              The recent record,
              <br />
              in order.
            </h2>
          </div>

          <div className="lp-release-list">
            {RELEASES.map((release, index) => (
              <article
                id={release.anchor}
                key={release.issue}
                className={`lp-release-entry reveal delay-${(index + 1) * 100}`}
              >
                <aside className="lp-release-meta">
                  <span className="text-label lp-release-kicker">
                    Issue {release.issue}
                  </span>
                  <div className="lp-release-meta-block">
                    <span className="lp-release-meta-label">Published</span>
                    <span className="lp-release-meta-value">{release.date}</span>
                  </div>
                  <div className="lp-release-meta-block">
                    <span className="lp-release-meta-label">Surface</span>
                    <span className="lp-release-meta-value">{release.surface}</span>
                  </div>
                  <div className="lp-release-meta-block">
                    <span className="lp-release-meta-label">App version</span>
                    <span className="lp-release-meta-value">{release.version}</span>
                  </div>
                </aside>

                <div className="lp-release-body">
                  <h3 className="text-display-md lp-release-title">{release.title}</h3>
                  <p className="lp-release-intro">{release.intro}</p>

                  <div className="lp-release-groups">
                    {release.groups.map((group) => (
                      <section key={group.label} className="lp-release-group">
                        <span className="text-label lp-release-group-label">
                          {group.label}
                        </span>
                        <ul className="lp-release-bullets">
                          {group.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      </section>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="lp-release-rail reveal">
            <span className="text-label lp-overline-dark">Jump to issue</span>
            <div className="lp-release-rail-links">
              {RELEASES.map((release) => (
                <a
                  key={release.issue}
                  href={`#${release.anchor}`}
                  className="lp-docs-toc-link"
                >
                  Issue {release.issue} · {release.surface}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--dark">
        <div className="lp-container">
          <div className="lp-cta-block reveal">
            <div className="lp-accent-rule" />
            <h2 className="text-display-lg lp-cta-title">
              See what shipped.
              <br />
              Then see what&apos;s next.
            </h2>
            <p className="lp-cta-sub">
              The changelog keeps the record. The roadmap keeps the direction.
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
