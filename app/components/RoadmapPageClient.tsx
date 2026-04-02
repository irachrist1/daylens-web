"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MarketingFooter, MarketingInnerNav } from "./MarketingChrome";
import { MarketingCursor } from "./MarketingEffects";

type RoadmapStatus =
  | "Backlog"
  | "Next up"
  | "In progress"
  | "Ready to ship"
  | "Done";

type RoadmapSurface = "Cross-platform" | "Windows" | "macOS" | "Linux" | "Web companion";

type RoadmapItem = {
  title: string;
  status: RoadmapStatus;
  summary: string;
  whyItMatters: string;
  currentFocus: string[];
  tags: string[];
  surface: RoadmapSurface;
  deliverables: number;
  board: string;
  updated: string;
  owner: string;
};

const ROADMAP_ORDER: RoadmapStatus[] = [
  "Backlog",
  "Next up",
  "In progress",
  "Ready to ship",
  "Done",
];

const SURFACE_FILTERS: RoadmapSurface[] = [
  "Cross-platform",
  "Windows",
  "macOS",
  "Linux",
  "Web companion",
];

const ROADMAP_ITEMS: RoadmapItem[] = [
  {
    title: "App and website blocking during focus",
    status: "Backlog",
    summary:
      "Let users choose which apps and sites to block when a focus session starts, using the system-level Screen Time API for hard enforcement.",
    whyItMatters:
      "Distraction detection is only half the story. The product should be able to help users actually stay on task, not just report that they did not.",
    currentFocus: [
      "Apply for FamilyControls entitlement from Apple.",
      "Build a blocking picker using FamilyActivityPicker.",
      "Block on session start, unblock automatically on end.",
    ],
    tags: ["Focus", "Blocking", "Screen Time"],
    surface: "macOS",
    deliverables: 4,
    board: "Focus surfaces",
    updated: "Pending Apple entitlement approval",
    owner: "Christian",
  },
  {
    title: "Two-stage AI observation pipeline",
    status: "In progress",
    summary:
      "Separate the AI pipeline into a cheap observation pass per 15-minute window and a richer editorial synthesis pass that produces the final timeline cards.",
    whyItMatters:
      "The current single-shot approach asks the model to parse raw events and make editorial decisions at the same time. Splitting these two tasks produces dramatically more specific labels and better merge and split decisions.",
    currentFocus: [
      "Stage 1 observation windows now exist as a separate prompt path.",
      "Stage 2 synthesis is being validated as strict JSON with retry feedback.",
      "Keep stable prompt instructions cacheable while volatile activity payloads stay separate.",
    ],
    tags: ["AI", "Pipeline", "Quality"],
    surface: "Cross-platform",
    deliverables: 6,
    board: "Understanding",
    updated: "Active macOS implementation",
    owner: "Christian",
  },
  {
    title: "Focus session redesign with intent and ring timer",
    status: "In progress",
    summary:
      "Give the focus tab a stronger start: a prominent intent field, a full-screen ring timer during sessions, and a short reflection card when the session ends.",
    whyItMatters:
      "A session with a clear stated purpose is fundamentally different from one that just started. The ring timer makes the session feel real and present rather than a background count.",
    currentFocus: [
      "Intent-first session setup is now wired into the current macOS focus flow.",
      "A full-screen ring timer and break suggestions are implemented in the new focus surface.",
      "Post-session reflection is being polished before it is treated as shipped.",
    ],
    tags: ["Focus", "UI", "Sessions"],
    surface: "Cross-platform",
    deliverables: 5,
    board: "Focus surfaces",
    updated: "Active macOS implementation",
    owner: "Christian",
  },
  {
    title: "Distraction detection and interruption",
    status: "Ready to ship",
    summary:
      "Use existing category data to detect when a user switches to a distraction app during a focus session, log it, and optionally surface a gentle floating prompt.",
    whyItMatters:
      "Knowing you were distracted after the fact is useful. Knowing in the moment is more so — and the product already has all the data it needs to do this.",
    currentFocus: [
      "App activations are now wired into the running focus session.",
      "Distraction count feeds the new reflection and summary surfaces.",
      "The non-activating interruption banner is implemented and needs final launch polish.",
    ],
    tags: ["Focus", "Distractions", "Tracking"],
    surface: "Cross-platform",
    deliverables: 4,
    board: "Focus surfaces",
    updated: "Implemented, pending launch polish",
    owner: "Christian",
  },
  {
    title: "Notification suppression during focus",
    status: "In progress",
    summary:
      "Enable Do Not Disturb automatically when a focus session starts and restore the previous state when it ends.",
    whyItMatters:
      "Interruptions are the primary reason focus sessions fail. This is a one-toggle change with an outsized effect on session quality.",
    currentFocus: [
      "macOS focus-mode toggling is wired into the active session manager.",
      "Settings now expose the DND-on-focus preference directly.",
      "Cross-platform parity and safe restoration behavior still need verification.",
    ],
    tags: ["Focus", "DND", "Notifications"],
    surface: "Cross-platform",
    deliverables: 2,
    board: "Focus surfaces",
    updated: "Active macOS implementation",
    owner: "Christian",
  },
  {
    title: "Daily summary and morning nudge notifications",
    status: "Done",
    summary:
      "Send a summary notification at 6 PM with the day's highlights, plus a lightweight morning check-in that keeps the review loop visible from the start of the day. Notification taps route into the correct view across all platforms.",
    whyItMatters:
      "A notification that opens the app to the wrong screen is barely better than no notification. The tap must land exactly where the user expects — Today for the day recap, Focus for the morning nudge.",
    currentFocus: [
      "The 6 PM summary and 9 AM nudge schedule and fire correctly on macOS, Windows, and Linux.",
      "Notification taps route into Today or Focus on all three platforms instead of stopping at the window foreground.",
      "Onboarding and Settings both expose the digest flow so launch copy matches the product.",
    ],
    tags: ["Notifications", "Focus", "Cross-platform"],
    surface: "Cross-platform",
    deliverables: 3,
    board: "Focus surfaces",
    updated: "Shipped across macOS, Windows, and Linux — April 2",
    owner: "Christian",
  },
  {
    title: "Slack status and calendar automation",
    status: "Backlog",
    summary:
      "Let Daylens update Slack presence during focus sessions and eventually reserve focus time through calendar integrations.",
    whyItMatters:
      "Once the core focus loop is trustworthy, the next layer is reducing social interruption and making the session visible to the rest of the user's workday.",
    currentFocus: [
      "Keep the current Settings placeholders honest as 'coming soon' launch copy.",
      "Decide whether Slack status ships before or after calendar automation.",
      "Avoid promising automation until the core focus surfaces feel stable.",
    ],
    tags: ["Focus", "Slack", "Calendar"],
    surface: "Cross-platform",
    deliverables: 2,
    board: "Focus surfaces",
    updated: "Documented as coming soon",
    owner: "Christian",
  },
  {
    title: "Timeline recall on mobile",
    status: "Backlog",
    summary:
      "Bring the day view and weekly review to the web companion in a format that still feels readable on a phone.",
    whyItMatters:
      "The companion should be somewhere you can genuinely revisit your day, not just a place to link a device and leave.",
    currentFocus: [
      "Condense the day view for smaller screens without losing chronology.",
      "Keep weekly review readable when opened from the phone.",
      "Preserve session context and labels on narrow layouts.",
    ],
    tags: ["History", "Companion", "Mobile"],
    surface: "Web companion",
    deliverables: 3,
    board: "Companion surfaces",
    updated: "Planned next cycle",
    owner: "Christian",
  },
  {
    title: "Assistant that starts with context",
    status: "Backlog",
    summary:
      "Use real tracked context so follow-up help begins from the day already in view instead of another blank prompt.",
    whyItMatters:
      "The long-term Daylens direction is help that starts with the picture already in memory, not with the user re-explaining their work.",
    currentFocus: [
      "Carry the active day and review context into Insights.",
      "Surface likely relevant blocks before the user asks.",
      "Reduce how often the assistant starts from zero.",
    ],
    tags: ["Insights", "Context", "AI"],
    surface: "Cross-platform",
    deliverables: 3,
    board: "Understanding",
    updated: "Exploration",
    owner: "Christian",
  },
  {
    title: "Cross-device day stitching",
    status: "Backlog",
    summary:
      "Make sessions feel continuous when work starts on desktop and gets reviewed later from the web companion.",
    whyItMatters:
      "A day should still read like one day even when the user moves between surfaces to review it.",
    currentFocus: [
      "Keep linked device identity stable.",
      "Make review jumps between desktop and web feel seamless.",
      "Avoid duplicate or fragmented day summaries.",
    ],
    tags: ["Sync", "Timeline", "Companion"],
    surface: "Cross-platform",
    deliverables: 2,
    board: "Companion surfaces",
    updated: "Researching",
    owner: "Christian",
  },
  {
    title: "Windows browser fidelity",
    status: "Next up",
    summary:
      "Push Windows closer to parity with stronger browser evidence, profile discovery, and fewer edge-case gaps in activity capture.",
    whyItMatters:
      "Windows should feel like the same Daylens product, not the version with tracking caveats and missing proof.",
    currentFocus: [
      "Verify Chromium and Firefox evidence paths on real installs.",
      "Reduce silent misses around profiles and history access.",
      "Keep parity moving without introducing updater regressions.",
    ],
    tags: ["Windows", "Tracking", "Parity"],
    surface: "Windows",
    deliverables: 3,
    board: "Tracking quality",
    updated: "Queued after current Windows push",
    owner: "Christian",
  },
  {
    title: "Linux local-first Insights",
    status: "Done",
    summary:
      "Linux now answers exact-time, resume, and day-overview questions from local evidence before asking the user for an AI key.",
    whyItMatters:
      "Linux should feel useful on first launch, not like the version that needs cloud setup before it can explain your day.",
    currentFocus: [
      "Temporal routing now handles exact-time and resume-style questions locally.",
      "Work-evidence summaries now surface the clearest thread and strongest work surface.",
      "Final QA is about answer quality and wording, not missing plumbing.",
    ],
    tags: ["Linux", "Insights", "AI"],
    surface: "Linux",
    deliverables: 3,
    board: "Linux AI",
    updated: "Shipped April 2",
    owner: "Christian",
  },
  {
    title: "Weekly review that explains the week",
    status: "Next up",
    summary:
      "Shift reports from raw totals toward clearer explanations of where the week went and where focus kept breaking.",
    whyItMatters:
      "People do not just want a log. They want the product to tell the story of the week with evidence, not noise.",
    currentFocus: [
      "Make saved reports easier to revisit.",
      "Improve in-progress week summaries before the week ends.",
      "Surface key focus breaks before raw tables and charts.",
    ],
    tags: ["Reports", "Review", "Understanding"],
    surface: "macOS",
    deliverables: 3,
    board: "Review and reports",
    updated: "Lined up after current macOS polish",
    owner: "Christian",
  },
  {
    title: "Shared language across surfaces",
    status: "Next up",
    summary:
      "Align desktop and companion copy so history, focus, recovery, and Insights read like one product everywhere.",
    whyItMatters:
      "Three surfaces are fine. Three separate personalities are not.",
    currentFocus: [
      "Unify public page copy with app behavior.",
      "Keep onboarding, recovery, and settings language consistent.",
      "Make navigation feel like one product system.",
    ],
    tags: ["Copy", "Navigation", "Companion"],
    surface: "Cross-platform",
    deliverables: 2,
    board: "Product language",
    updated: "Next writing pass",
    owner: "Christian",
  },
  {
    title: "Evidence you can trust",
    status: "In progress",
    summary:
      "Tighten session boundaries, cut noisy carryover, and keep switch counts grounded enough to compare over time.",
    whyItMatters:
      "If the underlying tracking is noisy, every score, report, and explanation built on top of it gets weaker too.",
    currentFocus: [
      "Reduce carryover between adjacent sessions.",
      "Improve switch counting on long work blocks.",
      "Keep labels grounded in better evidence.",
    ],
    tags: ["Tracking", "Sessions", "Accuracy"],
    surface: "Cross-platform",
    deliverables: 3,
    board: "Tracking quality",
    updated: "Active work",
    owner: "Christian",
  },
  {
    title: "Web companion review surface",
    status: "In progress",
    summary:
      "Move the web layer beyond pairing and recovery into a place you revisit for timeline review, reports, and clean reading.",
    whyItMatters:
      "The web companion should be a real review surface, not a side utility wrapped around the desktop apps.",
    currentFocus: [
      "Build stronger history and changelog surfaces.",
      "Keep review pages clean on desktop and mobile.",
      "Preserve the calm companion tone across new pages.",
    ],
    tags: ["Dashboard", "Companion", "Reports"],
    surface: "Web companion",
    deliverables: 3,
    board: "Companion surfaces",
    updated: "Active work",
    owner: "Christian",
  },
  {
    title: "Insights continuity",
    status: "In progress",
    summary:
      "Hold follow-up context better so Daylens can keep the thread between a block detail, a daily review, and a broader question.",
    whyItMatters:
      "The assistant becomes much more useful when it remembers the thread instead of making the user rebuild it.",
    currentFocus: [
      "Keep timeframes stable across follow-up questions.",
      "Preserve block context when moving into broader review.",
      "Tighten prompt grounding around current context.",
    ],
    tags: ["Insights", "AI", "Continuity"],
    surface: "Cross-platform",
    deliverables: 3,
    board: "Understanding",
    updated: "Active work",
    owner: "Christian",
  },
  {
    title: "Focus review polish",
    status: "Done",
    summary:
      "The focus readout now speaks in concrete terms: focus time, uninterrupted stretches, and session rhythm instead of vague optimization language.",
    whyItMatters:
      "The focus surface is where the product has to prove it can explain the day quickly and credibly.",
    currentFocus: [
      "Focus time now sits alongside the score.",
      "Session rhythm cards call out longest uninterrupted stretch and switch rate.",
      "Reports mirror the same language so the product reads consistently.",
    ],
    tags: ["Focus", "Review", "UI"],
    surface: "macOS",
    deliverables: 2,
    board: "Focus surfaces",
    updated: "Shipped April 2",
    owner: "Christian",
  },
  {
    title: "Provider-aware Windows onboarding",
    status: "Done",
    summary:
      "Finish the surrounding onboarding and settings copy now that Windows supports multiple AI providers and model paths.",
    whyItMatters:
      "The model picker and provider flow should feel deliberate, not like a powerful feature bolted onto rough onboarding.",
    currentFocus: [
      "Clarify provider choice in setup.",
      "Mirror selected provider in settings and Insights copy.",
      "Keep key storage and defaults understandable.",
    ],
    tags: ["Windows", "AI", "Onboarding"],
    surface: "Windows",
    deliverables: 2,
    board: "Windows AI",
    updated: "Shipped in current release",
    owner: "Christian",
  },
  {
    title: "Linux packaging and updater foundation",
    status: "Done",
    summary:
      "Linux now has a real release path with update metadata, package sanity checks, and public artifacts instead of a one-off dev build story.",
    whyItMatters:
      "Shipping Linux as a first-class surface means users can trust the install and update path, not just the code running behind it.",
    currentFocus: [
      "AppImage, deb, rpm, and tar.gz packaging are wired into the release flow.",
      "Release metadata now supports Linux updater behavior where the package format allows it.",
      "Runtime verification moved from local guesswork into repeatable CI checks.",
    ],
    tags: ["Linux", "Packaging", "Releases"],
    surface: "Linux",
    deliverables: 4,
    board: "Linux platform",
    updated: "Shipped",
    owner: "Christian",
  },
  {
    title: "Public product pages",
    status: "Done",
    summary:
      "Docs, roadmap, and changelog now live as first-class public pages instead of feeling like leftover support screens.",
    whyItMatters:
      "The product finally has a public surface that explains what Daylens is and where it is going.",
    currentFocus: [
      "Keep the public pages aligned with the actual product.",
      "Tighten the shared navigation and footer shell.",
      "Make roadmap and changelog easier to revisit.",
    ],
    tags: ["Web", "Docs", "Public pages"],
    surface: "Web companion",
    deliverables: 3,
    board: "Public pages",
    updated: "Shipped",
    owner: "Christian",
  },
  {
    title: "Multi-provider AI on Windows",
    status: "Done",
    summary:
      "Windows now supports Anthropic, OpenAI, and Google with provider-aware model selection and stored credentials.",
    whyItMatters:
      "This turned the Windows app from one hardcoded AI path into a real user-controlled setup.",
    currentFocus: [
      "Provider-aware model selection.",
      "Stored credentials per provider.",
      "Cleaner updater and onboarding follow-through.",
    ],
    tags: ["Windows", "AI", "Providers"],
    surface: "Windows",
    deliverables: 4,
    board: "Windows AI",
    updated: "Shipped March 31",
    owner: "Christian",
  },
  {
    title: "Reports and widgets on macOS",
    status: "Done",
    summary:
      "macOS keeps pushing the strongest expression of Daylens through reports, widgets, and stronger daily review.",
    whyItMatters:
      "macOS is still the clearest expression of the product, so it sets the bar for everything else.",
    currentFocus: [
      "Saved reports and richer outputs.",
      "Cleaner review surfaces.",
      "Stronger daily and weekly readback.",
    ],
    tags: ["macOS", "Reports", "Widgets"],
    surface: "macOS",
    deliverables: 3,
    board: "Review and reports",
    updated: "Shipped March 30",
    owner: "Christian",
  },
];

const STATUS_TONES: Record<RoadmapStatus, string> = {
  Backlog: "sand",
  "Next up": "violet",
  "In progress": "blue",
  "Ready to ship": "rose",
  Done: "green",
};

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
  const [selectedItem, setSelectedItem] = useState<RoadmapItem | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [searchQuery, setSearchQuery] = useState("");
  const [surfaceFilters, setSurfaceFilters] = useState<RoadmapSurface[]>([]);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!selectedItem) return undefined;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedItem(null);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [selectedItem]);

  const visibleItems = useMemo(() => {
    return ROADMAP_ITEMS.filter((item) => {
      const matchesSurface =
        surfaceFilters.length === 0 || surfaceFilters.includes(item.surface);
      const search = searchQuery.trim().toLowerCase();
      const haystack = [
        item.title,
        item.summary,
        item.whyItMatters,
        item.surface,
        ...item.tags,
        ...item.currentFocus,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = search.length === 0 || haystack.includes(search);
      return matchesSurface && matchesSearch;
    });
  }, [searchQuery, surfaceFilters]);

  function toggleSurface(surface: RoadmapSurface) {
    setSurfaceFilters((current) =>
      current.includes(surface)
        ? current.filter((value) => value !== surface)
        : [...current, surface]
    );
  }

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareState("copied");
      window.setTimeout(() => setShareState("idle"), 1600);
    } catch {
      setShareState("idle");
    }
  }

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
                Windows, Linux, and the web companion.
              </p>
              <p className="lp-ray-board-note">
                Please note that these priorities are not guaranteed and will
                keep moving as the product learns from real use.
              </p>
            </div>

            <div className="lp-ray-board-actions">
              <button
                type="button"
                className={`lp-ray-board-action${searchOpen ? " is-active" : ""}`}
                aria-label="Search roadmap"
                onClick={() => {
                  setSearchOpen((current) => !current);
                  if (filterOpen) setFilterOpen(false);
                }}
              >
                <IconButton type="search" />
              </button>
              <button
                type="button"
                className={`lp-ray-board-action${filterOpen ? " is-active" : ""}`}
                aria-label="Filter roadmap"
                onClick={() => {
                  setFilterOpen((current) => !current);
                  if (searchOpen) setSearchOpen(false);
                }}
              >
                <IconButton type="filter" />
              </button>
              <button
                type="button"
                className={`lp-ray-board-action${
                  shareState === "copied" ? " is-active" : ""
                }`}
                aria-label="Copy roadmap link"
                onClick={handleShare}
              >
                <IconButton type="share" />
              </button>
            </div>
          </div>

          {(searchOpen || filterOpen) && (
            <div className="lp-ray-board-toolbar">
              {searchOpen ? (
                <label className="lp-ray-board-search">
                  <span className="sr-only">Search roadmap</span>
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search initiatives, tags, and focus areas"
                  />
                </label>
              ) : null}

              {filterOpen ? (
                <div className="lp-ray-board-filters">
                  {SURFACE_FILTERS.map((surface) => (
                    <button
                      key={surface}
                      type="button"
                      className={`lp-ray-board-filter-chip${
                        surfaceFilters.includes(surface) ? " is-active" : ""
                      }`}
                      onClick={() => toggleSurface(surface)}
                    >
                      {surface}
                    </button>
                  ))}
                  {surfaceFilters.length > 0 ? (
                    <button
                      type="button"
                      className="lp-ray-board-filter-reset"
                      onClick={() => setSurfaceFilters([])}
                    >
                      Clear filters
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          )}

          <div className="lp-ray-board-scroll">
            <div className="lp-ray-board-columns">
              {ROADMAP_ORDER.map((status) => {
                const items = visibleItems.filter((item) => item.status === status);

                return (
                  <section key={status} className="lp-ray-board-column">
                    <header className="lp-ray-column-head">
                      <span className={`lp-ray-column-pill is-${STATUS_TONES[status]}`}>
                        {status}
                      </span>
                      <span className="lp-ray-column-count">{items.length}</span>
                    </header>

                    <div className="lp-ray-card-stack">
                      {items.map((item) => (
                        <button
                          key={`${item.status}-${item.title}`}
                          type="button"
                          className="lp-ray-roadmap-card"
                          onClick={() => setSelectedItem(item)}
                        >
                          <h2 className="lp-ray-roadmap-card-title">{item.title}</h2>
                          <p className="lp-ray-roadmap-card-summary">{item.summary}</p>

                          <div className="lp-ray-roadmap-card-tags">
                            {item.tags.map((tag) => (
                              <span key={`${item.title}-${tag}`} className="lp-ray-roadmap-tag">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="lp-ray-roadmap-card-footer">
                            <span className="lp-ray-roadmap-surface">{item.surface}</span>
                            <span className="lp-ray-roadmap-card-count">{item.deliverables}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {selectedItem ? (
        <div
          className="lp-ray-roadmap-overlay"
          role="presentation"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="lp-ray-roadmap-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="roadmap-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="lp-ray-roadmap-close"
              aria-label="Close roadmap detail"
              onClick={() => setSelectedItem(null)}
            >
              ×
            </button>

            <div className="lp-ray-roadmap-modal-main">
              <div className="lp-ray-roadmap-modal-copy">
                <h2 id="roadmap-modal-title" className="lp-ray-roadmap-modal-title">
                  {selectedItem.title}
                </h2>
                <p className="lp-ray-roadmap-modal-summary">{selectedItem.summary}</p>

                <div className="lp-ray-roadmap-modal-tags">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={`${selectedItem.title}-${tag}-detail`}
                      className="lp-ray-roadmap-modal-tag"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <section className="lp-ray-roadmap-modal-section">
                  <h3 className="lp-ray-roadmap-modal-label">Why this matters</h3>
                  <p className="lp-ray-roadmap-modal-paragraph">
                    {selectedItem.whyItMatters}
                  </p>
                </section>

                <section className="lp-ray-roadmap-modal-section">
                  <h3 className="lp-ray-roadmap-modal-label">Current focus</h3>
                  <ul className="lp-ray-roadmap-modal-list">
                    {selectedItem.currentFocus.map((item) => (
                      <li key={`${selectedItem.title}-${item}`}>{item}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <aside className="lp-ray-roadmap-modal-side">
                <div className="lp-ray-roadmap-side-row">
                  <span>Deliverables</span>
                  <strong>{selectedItem.deliverables}</strong>
                </div>
                <div className="lp-ray-roadmap-side-row">
                  <span>Status</span>
                  <strong>{selectedItem.status}</strong>
                </div>
                <div className="lp-ray-roadmap-side-row">
                  <span>Board</span>
                  <strong>{selectedItem.board}</strong>
                </div>
                <div className="lp-ray-roadmap-side-row">
                  <span>Surface</span>
                  <strong>{selectedItem.surface}</strong>
                </div>
                <div className="lp-ray-roadmap-side-row">
                  <span>Updated</span>
                  <strong>{selectedItem.updated}</strong>
                </div>
                <div className="lp-ray-roadmap-side-row">
                  <span>Owner</span>
                  <strong>{selectedItem.owner}</strong>
                </div>
              </aside>
            </div>
          </div>
        </div>
      ) : null}

      <MarketingFooter />
    </div>
  );
}
