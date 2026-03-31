"use client";

import Link from "next/link";
import { useState } from "react";
import { MarketingFooter, MarketingInnerNav } from "./MarketingChrome";
import { MarketingCursor } from "./MarketingEffects";

type RoadmapFilter =
  | "All"
  | "Tracking"
  | "Understanding"
  | "Companion"
  | "Windows"
  | "macOS";

type RoadmapItem = {
  title: string;
  status: "Now" | "Next" | "Queued" | "Exploring";
  category: Exclude<RoadmapFilter, "All">;
  surface: "Cross-platform" | "Windows" | "macOS" | "Web companion";
  summary: string;
  whyItMatters: string;
  bullets: string[];
};

const FILTERS: RoadmapFilter[] = [
  "All",
  "Tracking",
  "Understanding",
  "Companion",
  "Windows",
  "macOS",
];

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    title: "Desktop evidence you can trust",
    status: "Now",
    category: "Tracking",
    surface: "Cross-platform",
    summary:
      "Tighten browser evidence, calmer session grouping, and fewer edge-case gaps so the timeline keeps feeling like a faithful record instead of a raw log.",
    whyItMatters:
      "If tracking is noisy, every report, score, and AI explanation built on top of it gets weaker too.",
    bullets: [
      "Stabilize session boundaries and reduce carryover errors.",
      "Improve app and site evidence so labels stay grounded.",
      "Keep context-switch counts reliable enough to compare over time.",
    ],
  },
  {
    title: "Windows browser fidelity",
    status: "Now",
    category: "Windows",
    surface: "Windows",
    summary:
      "Verify real production browser paths, improve history discovery, and keep Windows parity moving with fewer install and updater rough edges.",
    whyItMatters:
      "Windows should feel like the same Daylens product, not a partial port with tracking caveats.",
    bullets: [
      "Verify Chromium history paths on real installs.",
      "Add Firefox support where profile discovery is required.",
      "Keep installer, updater, and trust flows smooth.",
    ],
  },
  {
    title: "Reports that explain the week",
    status: "Next",
    category: "Understanding",
    surface: "macOS",
    summary:
      "Move from recall toward explanation with better saved reports, stronger Week in Review, and more evidence-led summaries before raw tables appear.",
    whyItMatters:
      "People do not just want to look back at activity. They want the product to tell the story of the week clearly.",
    bullets: [
      "Saved reports tied to the exact day or week selected.",
      "Week review that stays useful before the week is over.",
      "Cleaner summaries that surface the signal before the detail.",
    ],
  },
  {
    title: "A web companion worth revisiting",
    status: "Next",
    category: "Companion",
    surface: "Web companion",
    summary:
      "Push the web companion past access and recovery into a true review surface for dashboard, history, reports, and mobile reading.",
    whyItMatters:
      "The web layer should be somewhere you actually revisit your work, not just a utility for linking devices.",
    bullets: [
      "Stronger mobile reading for day and week review.",
      "Reports and history that keep context intact across sessions.",
      "A calmer companion flow from pairing through recovery.",
    ],
  },
  {
    title: "Insight continuity that holds the thread",
    status: "Queued",
    category: "Understanding",
    surface: "Cross-platform",
    summary:
      "Improve follow-up continuity so Insights can hold onto what the user is asking across a session instead of making them rebuild the thread.",
    whyItMatters:
      "The product direction is help that starts with context. That falls apart if the conversation resets every time.",
    bullets: [
      "Better multi-turn continuity in Insights.",
      "Stronger timeframe grounding across follow-up questions.",
      "More natural transitions from block detail to higher-level review.",
    ],
  },
  {
    title: "Shared product language across surfaces",
    status: "Queued",
    category: "Companion",
    surface: "Cross-platform",
    summary:
      "Keep macOS, Windows, and the web companion reading like the same product through shared patterns, calmer copy, and tighter navigation between surfaces.",
    whyItMatters:
      "Three separate surfaces are fine. Three separate personalities are not.",
    bullets: [
      "Shared patterns for onboarding, recovery, and settings.",
      "Consistent copy around focus, history, and insights.",
      "A more obvious handoff between desktop and web surfaces.",
    ],
  },
  {
    title: "The assistant stops starting from zero",
    status: "Exploring",
    category: "Understanding",
    surface: "Cross-platform",
    summary:
      "Build toward an assistant that already knows the day’s context, where attention leaked, and which threads matter before the user types the first prompt.",
    whyItMatters:
      "That is the actual long-term Daylens idea: not just tracking work, but carrying enough context forward that help begins from the picture already in view.",
    bullets: [
      "Use tracked context as the starting point for assistance.",
      "Surface the right documents, pages, and sessions automatically.",
      "Turn history into the next useful move instead of another dashboard.",
    ],
  },
  {
    title: "macOS as the clearest expression of the product",
    status: "Now",
    category: "macOS",
    surface: "macOS",
    summary:
      "Keep the native app pushing the strongest version of Daylens through reports, widgets, timeline understanding, and better daily review.",
    whyItMatters:
      "macOS is still where the product idea feels most complete, so it sets the standard for the others.",
    bullets: [
      "Continue improving reports and widgets.",
      "Sharpen timeline understanding and focus review.",
      "Keep native polish high while the product expands.",
    ],
  },
];

function itemMatchesFilter(item: RoadmapItem, filter: RoadmapFilter) {
  if (filter === "All") return true;
  return item.category === filter;
}

export function RoadmapPageClient() {
  const [activeFilter, setActiveFilter] = useState<RoadmapFilter>("All");
  const visibleItems = ROADMAP_ITEMS.filter((item) =>
    itemMatchesFilter(item, activeFilter)
  );

  return (
    <div className="lp lp-hub-page">
      <MarketingCursor />
      <MarketingInnerNav current="roadmap" theme="light" />

      <main className="lp-hub-main">
        <section className="lp-container lp-hub-shell" aria-labelledby="roadmap-title">
          <div className="lp-hub-header">
            <div className="lp-hub-breadcrumb">
              <span>Product</span>
              <span>/</span>
              <span>Roadmap</span>
            </div>
            <h1 id="roadmap-title" className="lp-hub-title">
              Explore where
              <br />
              Daylens is going
            </h1>
            <p className="lp-hub-intro">
              The roadmap is a working map of what we are building next across
              tracking, understanding, and the companion surfaces. This is not a
              feature dump. It is the product direction, organized.
            </p>
          </div>

          <div className="lp-hub-filter-row" role="tablist" aria-label="Roadmap filters">
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                className={`lp-hub-filter${
                  activeFilter === filter ? " is-active" : ""
                }`}
                onClick={() => setActiveFilter(filter)}
                aria-pressed={activeFilter === filter}
              >
                {filter}
              </button>
            ))}
          </div>

          <div className="lp-hub-grid">
            {visibleItems.map((item) => (
              <article key={`${item.title}-${item.surface}`} className="lp-hub-card">
                <div className="lp-hub-card-top">
                  <div className="lp-hub-card-meta">
                    <span className="lp-hub-status">{item.status}</span>
                    <span className="lp-hub-surface">{item.surface}</span>
                  </div>
                  <h2 className="lp-hub-card-title">{item.title}</h2>
                  <p className="lp-hub-card-summary">{item.summary}</p>
                </div>

                <div className="lp-hub-card-section">
                  <p className="lp-hub-card-label">Why this matters</p>
                  <p className="lp-hub-card-copy">{item.whyItMatters}</p>
                </div>

                <div className="lp-hub-card-section">
                  <p className="lp-hub-card-label">Current focus</p>
                  <ul className="lp-hub-card-list">
                    {item.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>

          <div className="lp-hub-footer-note">
            <p className="lp-hub-note-copy">
              Looking for what is already real instead of what is planned?
            </p>
            <Link href="/changelog" className="lp-hub-note-link">
              Open the changelog →
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
