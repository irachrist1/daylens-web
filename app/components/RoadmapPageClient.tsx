"use client";

import { MarketingFooter, MarketingInnerNav } from "./MarketingChrome";
import { MarketingCursor } from "./MarketingEffects";

type RoadmapStatus =
  | "Backlog"
  | "Next up"
  | "In progress"
  | "Ready to ship"
  | "Done";

type RoadmapItem = {
  title: string;
  status: RoadmapStatus;
  summary: string;
  tags: string[];
  surface: "Cross-platform" | "Windows" | "macOS" | "Web companion";
  deliverables: number;
};

const ROADMAP_ORDER: RoadmapStatus[] = [
  "Backlog",
  "Next up",
  "In progress",
  "Ready to ship",
  "Done",
];

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    title: "Timeline recall on mobile",
    status: "Backlog",
    summary:
      "Bring the day view and weekly review to the web companion in a format that still feels readable on a phone.",
    tags: ["History", "Companion", "Mobile"],
    surface: "Web companion",
    deliverables: 3,
  },
  {
    title: "Assistant that starts with context",
    status: "Backlog",
    summary:
      "Use real tracked context so follow-up help begins from the day already in view instead of another blank prompt.",
    tags: ["Insights", "Context", "AI"],
    surface: "Cross-platform",
    deliverables: 3,
  },
  {
    title: "Cross-device day stitching",
    status: "Backlog",
    summary:
      "Make sessions feel continuous when work starts on desktop and gets reviewed later from the web companion.",
    tags: ["Sync", "Timeline", "Companion"],
    surface: "Cross-platform",
    deliverables: 2,
  },
  {
    title: "Windows browser fidelity",
    status: "Next up",
    summary:
      "Push Windows closer to parity with stronger browser evidence, profile discovery, and fewer edge-case gaps in activity capture.",
    tags: ["Windows", "Tracking", "Parity"],
    surface: "Windows",
    deliverables: 3,
  },
  {
    title: "Weekly review that explains the week",
    status: "Next up",
    summary:
      "Shift reports from raw totals toward clearer explanations of where the week went and where focus kept breaking.",
    tags: ["Reports", "Review", "Understanding"],
    surface: "macOS",
    deliverables: 3,
  },
  {
    title: "Shared language across surfaces",
    status: "Next up",
    summary:
      "Align desktop and companion copy so history, focus, recovery, and Insights read like one product everywhere.",
    tags: ["Copy", "Navigation", "Companion"],
    surface: "Cross-platform",
    deliverables: 2,
  },
  {
    title: "Evidence you can trust",
    status: "In progress",
    summary:
      "Tighten session boundaries, cut noisy carryover, and keep switch counts grounded enough to compare over time.",
    tags: ["Tracking", "Sessions", "Accuracy"],
    surface: "Cross-platform",
    deliverables: 3,
  },
  {
    title: "Web companion review surface",
    status: "In progress",
    summary:
      "Move the web layer beyond pairing and recovery into a place you revisit for timeline review, reports, and clean reading.",
    tags: ["Dashboard", "Companion", "Reports"],
    surface: "Web companion",
    deliverables: 3,
  },
  {
    title: "Insights continuity",
    status: "In progress",
    summary:
      "Hold follow-up context better so Daylens can keep the thread between a block detail, a daily review, and a broader question.",
    tags: ["Insights", "AI", "Continuity"],
    surface: "Cross-platform",
    deliverables: 3,
  },
  {
    title: "Focus review polish",
    status: "Ready to ship",
    summary:
      "Sharpen the readout around focus score, context switches, and block summaries so the product tells a clearer story at a glance.",
    tags: ["Focus", "Review", "UI"],
    surface: "macOS",
    deliverables: 2,
  },
  {
    title: "Provider-aware Windows onboarding",
    status: "Ready to ship",
    summary:
      "Finish the surrounding onboarding and settings copy now that Windows supports multiple AI providers and model paths.",
    tags: ["Windows", "AI", "Onboarding"],
    surface: "Windows",
    deliverables: 2,
  },
  {
    title: "Public product pages",
    status: "Done",
    summary:
      "Docs, roadmap, and changelog now live as first-class public pages instead of feeling like leftover support screens.",
    tags: ["Web", "Docs", "Public pages"],
    surface: "Web companion",
    deliverables: 3,
  },
  {
    title: "Multi-provider AI on Windows",
    status: "Done",
    summary:
      "Windows now supports Anthropic, OpenAI, and Google with provider-aware model selection and stored credentials.",
    tags: ["Windows", "AI", "Providers"],
    surface: "Windows",
    deliverables: 4,
  },
  {
    title: "Reports and widgets on macOS",
    status: "Done",
    summary:
      "macOS keeps pushing the strongest expression of Daylens through reports, widgets, and stronger daily review.",
    tags: ["macOS", "Reports", "Widgets"],
    surface: "macOS",
    deliverables: 3,
  },
];

const STATUS_TONES: Record<RoadmapStatus, string> = {
  Backlog: "sand",
  "Next up": "violet",
  "In progress": "blue",
  "Ready to ship": "rose",
  Done: "green",
};

function groupedItems(status: RoadmapStatus) {
  return ROADMAP_ITEMS.filter((item) => item.status === status);
}

function IconButton({ type }: { type: "search" | "filter" | "share" }) {
  if (type === "search") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M8.75 3.5a5.25 5.25 0 1 0 3.302 9.333l3.207 3.208 1.06-1.06-3.208-3.207A5.25 5.25 0 0 0 8.75 3.5Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "filter") {
    return (
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path
          d="M3 5.25a.75.75 0 0 1 .75-.75h12.5a.75.75 0 0 1 .53 1.28l-4.53 4.53v3.44a.75.75 0 0 1-.332.624l-2.5 1.667A.75.75 0 0 1 8.25 15.4v-5.09L3.22 5.78A.75.75 0 0 1 3 5.25Z"
          fill="currentColor"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path
        d="M12.5 4.25h3.25v3.25h-1.5V6.81l-4.72 4.72-1.06-1.06 4.72-4.72h-.69Zm-8.25 1A1.75 1.75 0 0 1 6 3.5h3.25V5H6a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h8.5a.25.25 0 0 0 .25-.25V10.5h1.5v3.25A1.75 1.75 0 0 1 14.5 15.5H6a1.75 1.75 0 0 1-1.75-1.75v-8.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function RoadmapPageClient() {
  return (
    <div className="lp lp-ray-board-page">
      <MarketingCursor />
      <MarketingInnerNav current="roadmap" theme="dark" variant="capsule" />

      <main className="lp-ray-board-main">
        <section className="lp-container lp-ray-board-shell" aria-labelledby="roadmap-title">
          <div className="lp-ray-board-header">
            <div className="lp-ray-board-copy">
              <h1 id="roadmap-title" className="lp-ray-board-title">
                Roadmap
              </h1>
              <p className="lp-ray-board-intro">
                This is the clearest view of what Daylens is building now, what
                is lining up next, and what has already shipped across macOS,
                Windows, and the web companion.
              </p>
              <p className="lp-ray-board-note">
                Please note that these priorities are not guaranteed and will
                keep moving as the product learns from real use.
              </p>
            </div>

            <div className="lp-ray-board-actions" aria-hidden="true">
              <button type="button" className="lp-ray-board-action">
                <IconButton type="search" />
              </button>
              <button type="button" className="lp-ray-board-action">
                <IconButton type="filter" />
              </button>
              <button type="button" className="lp-ray-board-action">
                <IconButton type="share" />
              </button>
            </div>
          </div>

          <div className="lp-ray-board-scroll">
            <div className="lp-ray-board-columns">
              {ROADMAP_ORDER.map((status) => {
                const items = groupedItems(status);

                return (
                  <section key={status} className="lp-ray-board-column">
                    <header className="lp-ray-column-head">
                      <span
                        className={`lp-ray-column-pill is-${
                          STATUS_TONES[status]
                        }`}
                      >
                        {status}
                      </span>
                      <span className="lp-ray-column-count">{items.length}</span>
                    </header>

                    <div className="lp-ray-card-stack">
                      {items.map((item) => (
                        <article
                          key={`${item.status}-${item.title}`}
                          className="lp-ray-roadmap-card"
                        >
                          <h2 className="lp-ray-roadmap-card-title">{item.title}</h2>
                          <p className="lp-ray-roadmap-card-summary">
                            {item.summary}
                          </p>

                          <div className="lp-ray-roadmap-card-tags">
                            {item.tags.map((tag) => (
                              <span
                                key={`${item.title}-${tag}`}
                                className="lp-ray-roadmap-tag"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="lp-ray-roadmap-card-footer">
                            <span className="lp-ray-roadmap-surface">
                              {item.surface}
                            </span>
                            <span className="lp-ray-roadmap-card-count">
                              {item.deliverables}
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
