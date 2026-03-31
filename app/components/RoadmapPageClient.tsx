"use client";

import Link from "next/link";
import { MarketingFooter, MarketingInnerNav } from "./MarketingChrome";
import { MarketingCursor, useReveal } from "./MarketingEffects";

const ROADMAP_TICKER = [
  "Desktop accuracy",
  "Windows parity",
  "Web companion depth",
  "Report grounding",
  "Browser fidelity",
  "Saved reports",
  "Firefox support",
  "Pairing and recovery",
  "Auto-update",
  "ARM64 Windows",
  "Weekly review",
  "Shared intelligence",
];

const DELIVERY_LANES = [
  {
    label: "Now",
    title: "Tighter desktop truth",
    body: "The first job is making the evidence harder to doubt: cleaner browser capture, stabler labels, and fewer edge-case gaps so the timeline keeps feeling like an honest record of the day.",
  },
  {
    label: "Next",
    title: "Understanding gets deeper",
    body: "Once the tracking is solid, the next layer is better explanation: clearer reports, stronger weekly review, and block-level analysis that feels closer to understanding than summarization.",
  },
  {
    label: "Queued",
    title: "The companion becomes useful",
    body: "Dashboard, history, chat, and recovery are in place. The next step is making the web companion feel less like a mirror of the desktop app and more like the place you can actually revisit, review, and ask.",
  },
  {
    label: "Exploring",
    title: "Help starts with context",
    body: "The longer arc is an assistant that does not begin from zero. It already knows what you have been doing, where attention has been leaking, and what context is missing before you ask for help.",
  },
];

const PROCESS_STEPS = [
  {
    n: "01",
    title: "Watch real behavior",
    body: "We start from how the product is actually used across macOS, Windows, and the web companion, not from abstract feature wishlists.",
  },
  {
    n: "02",
    title: "Fix the evidence chain",
    body: "Tracking fidelity comes first. If app names, browser history, or context switches are wrong, every downstream insight gets weaker.",
  },
  {
    n: "03",
    title: "Sharpen the explanation",
    body: "New surfaces only ship when they tell a cleaner story than the raw timeline already does.",
  },
  {
    n: "04",
    title: "Ship across surfaces",
    body: "The goal is one Daylens feeling carried through native desktop apps and the companion web app, not disconnected feature islands.",
  },
];

export function RoadmapPageClient() {
  useReveal();
  const marqueeItems = [...ROADMAP_TICKER, ...ROADMAP_TICKER];

  return (
    <div className="lp">
      <MarketingCursor />
      <MarketingInnerNav current="roadmap" />

      <section className="lp-story-hero">
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
              Product Roadmap
            </p>
            <h1
              className="text-display-xl lp-story-hero-title"
              style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.4s both" }}
            >
              Tracking first.
              <br />
              Understanding next.
            </h1>
            <p
              className="lp-story-hero-sub"
              style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.65s both" }}
            >
              Daylens already captures what happened. The roadmap is about making
              that history more trustworthy, more explainable, and eventually
              useful enough that an assistant no longer needs to be caught up.
            </p>
            <div
              className="lp-hero-ctas"
              style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.85s both" }}
            >
              <Link href="/changelog" className="lp-btn-primary">
                Read the changelog <span>→</span>
              </Link>
              <a href="/daylens/api/download/mac" className="lp-btn-ghost-light">
                Download Daylens <span>→</span>
              </a>
            </div>
            <p
              className="lp-fine"
              style={{ animation: "lp-fadeIn 0.8s var(--ease-out-expo) 1.05s both" }}
            >
              Directional, not date-locked. Built in the open.
            </p>
          </div>

          <div className="lp-story-floating-card lp-story-floating-card--stack reveal-scale">
            <div className="lp-story-stack-card">
              <span className="text-label lp-story-floating-label">Active tracks</span>
              <div className="lp-stat-num">3</div>
              <p className="lp-story-floating-copy">
                macOS, Windows, and the web companion are being shaped as one
                quiet product, not three unrelated surfaces.
              </p>
            </div>
            <div className="lp-story-mini-grid">
              <div className="lp-story-mini-cell">
                <span className="text-label lp-story-mini-label">macOS</span>
                <p className="lp-story-mini-copy">Reports, recall, weekly review</p>
              </div>
              <div className="lp-story-mini-cell">
                <span className="text-label lp-story-mini-label">Windows</span>
                <p className="lp-story-mini-copy">Parity, browser fidelity, polish</p>
              </div>
              <div className="lp-story-mini-cell">
                <span className="text-label lp-story-mini-label">Web</span>
                <p className="lp-story-mini-copy">Access, pairing, mobile reading</p>
              </div>
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
            <span className="text-label lp-overline-dark">What&apos;s next</span>
            <p className="lp-section-desc">
              The roadmap is not feature-count theatre. It follows the actual
              product arc: track the day faithfully, understand it well, then use
              that understanding to offer better help across every surface.
            </p>
          </div>

          <div className="lp-split">
            <div className="lp-split-visual reveal">
              <div className="lp-story-note-panel img-reveal">
                <span className="text-label lp-story-note-kicker">Accuracy work</span>
                <div className="lp-story-note-lines">
                  <div className="lp-story-note-line lp-story-note-line--strong" />
                  <div className="lp-story-note-line" />
                  <div className="lp-story-note-line lp-story-note-line--short" />
                </div>
                <div className="lp-story-note-list">
                  <div className="lp-story-note-item">
                    <span className="lp-story-note-dot" />
                    Browser path verification
                  </div>
                  <div className="lp-story-note-item">
                    <span className="lp-story-note-dot" />
                    Firefox profile discovery
                  </div>
                  <div className="lp-story-note-item">
                    <span className="lp-story-note-dot" />
                    Calmer session grouping
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-split-content reveal delay-200">
              <div className="lp-accent-rule" />
              <h2 className="text-display-md lp-feature-title">
                Desktop capture.
                <br />
                You trust.
              </h2>
              <p className="lp-feature-body">
                The immediate priority is accuracy. That means verifying browser
                paths in production on Windows, tightening app and site evidence,
                and keeping labels stable enough that the timeline reads like a
                memory instead of a log dump. If the evidence is weak, every later
                insight gets weaker too.
              </p>
              <ul className="lp-bullets">
                <li>— Verify Windows Chromium history paths with real-user installs</li>
                <li>— Add Firefox support where profile discovery is required</li>
                <li>— Reduce edge-case carryover and icon recovery misses</li>
                <li>— Keep context-switch counts and session grouping calmer</li>
              </ul>
              <Link href="/docs#timeline" className="lp-btn-ghost-dark">
                Read how tracking works <span>→</span>
              </Link>
            </div>
          </div>

          <div className="lp-split lp-split--reversed">
            <div className="lp-split-content reveal delay-200">
              <div className="lp-accent-rule" />
              <h2 className="text-display-md lp-feature-title">
                Reviews that
                <br />
                explain the week.
              </h2>
              <p className="lp-feature-body">
                Daylens is moving from recall toward explanation. The best recent
                work already points there: richer reports, better timeframe
                grounding, and follow-up continuity inside Insights so the system
                can hold onto the thread of what your week is showing you.
              </p>
              <ul className="lp-bullets">
                <li>— Saved reports that stay tied to the day or week you chose</li>
                <li>— Week in Review that stays useful mid-week, not just after</li>
                <li>— Better continuity across follow-up questions in Insights</li>
                <li>— More evidence-led summaries before the raw table appears</li>
              </ul>
              <Link href="/changelog" className="lp-btn-ghost-dark">
                See what already shipped <span>→</span>
              </Link>
            </div>

            <div className="lp-split-visual reveal">
              <div className="lp-story-chat-panel img-reveal">
                <span className="text-label lp-story-note-kicker">Review system</span>
                <div className="lp-story-chat-bubble lp-story-chat-bubble--user">
                  What changed this week?
                </div>
                <div className="lp-story-chat-bubble lp-story-chat-bubble--ai">
                  Your strongest days stayed clustered in the morning, but the
                  week picked up more fragmented browser research after lunch.
                </div>
                <div className="lp-story-chat-bubble lp-story-chat-bubble--ai">
                  Saved reports and better follow-ups are making this layer much
                  easier to revisit without rebuilding the context by hand.
                </div>
              </div>
            </div>
          </div>

          <div className="lp-feature-wide reveal">
            <div className="lp-story-wide-panel img-reveal">
              <div className="lp-feature-wide-content">
                <div className="lp-accent-rule" />
                <h2
                  className="text-display-md"
                  style={{
                    color: "rgba(252,249,248,0.97)",
                    marginBottom: "0.75rem",
                  }}
                >
                  The web companion
                  <br />
                  becomes a real review surface.
                </h2>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "rgba(252,249,248,0.6)",
                    fontWeight: 300,
                    maxWidth: "40ch",
                    lineHeight: 1.7,
                  }}
                >
                  Pairing, recovery, dashboard, history, and chat are already in
                  place. The next web work is about moving beyond access and
                  toward real day review, calmer mobile reading, and reports you
                  can return to without losing the thread.
                </p>
                <div className="lp-story-wide-stats">
                  <div className="lp-story-wide-stat">
                    <span className="text-label lp-story-mini-label">Shipped</span>
                    <p className="lp-story-mini-copy">Dashboard, history, chat, pairing</p>
                  </div>
                  <div className="lp-story-wide-stat">
                    <span className="text-label lp-story-mini-label">Next</span>
                    <p className="lp-story-mini-copy">Reports, mobile review, stronger continuity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--dark lp-section--gridded">
        <div className="lp-container">
          <div className="lp-signature">
            <div className="lp-signature-text reveal-left">
              <span className="text-label lp-overline">Platform shape</span>
              <h2 className="text-display-lg lp-sig-title">
                One product.
                <br />
                Three surfaces.
              </h2>
              <p className="lp-sig-body">
                The macOS app sets the pace, Windows is closing the gap fast, and
                the web companion is becoming the place you can revisit from
                anywhere. The goal is not three disconnected tools. It is one
                product that sees your work clearly wherever you open it.
              </p>
              <ul className="lp-sig-bullets">
                <li>
                  <span className="lp-bullet-dot" />
                  macOS keeps pushing reports, recall, and calmer daily review
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  Windows focuses on parity, browser fidelity, and install polish
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  The web companion keeps mobile access and pairing friction low
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  Shared intelligence should read like one story everywhere
                </li>
              </ul>
              <Link href="/docs#web-companion" className="lp-btn-ghost-light">
                Explore the companion flow <span>→</span>
              </Link>
            </div>

            <div className="lp-story-signature-visual reveal">
              <div className="lp-story-surface-grid">
                <div className="lp-story-surface-card">
                  <span className="text-label lp-story-mini-label">macOS</span>
                  <p className="lp-story-surface-title">Sets the pace.</p>
                  <p className="lp-story-surface-copy">
                    Reports, recall, and the clearest articulation of the Daylens
                    product idea.
                  </p>
                </div>
                <div className="lp-story-surface-card">
                  <span className="text-label lp-story-mini-label">Windows</span>
                  <p className="lp-story-surface-title">Closes the gap.</p>
                  <p className="lp-story-surface-copy">
                    Parity work with sharper browser support and better release polish.
                  </p>
                </div>
                <div className="lp-story-surface-card lp-story-surface-card--wide">
                  <span className="text-label lp-story-mini-label">Web companion</span>
                  <p className="lp-story-surface-title">Shows up everywhere else.</p>
                  <p className="lp-story-surface-copy">
                    Pair once, recover when needed, and revisit your day from any device.
                  </p>
                </div>
              </div>
              <div className="lp-stat-card">
                <div className="lp-stat-num">1</div>
                <div className="lp-stat-label">Shared product story</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--light">
        <div className="lp-container">
          <div className="reveal">
            <span className="text-label lp-overline-dark">Roadmap in numbers</span>
            <h2 className="text-display-md lp-metrics-title">
              Built around
              <br />
              one useful picture.
            </h2>
          </div>
          <div className="lp-metrics-grid reveal delay-200">
              {[
                { num: "3", label: "Active product surfaces moving in parallel" },
                { num: "2", label: "Core phases: tracking first, understanding next" },
                { num: "0", label: "Accounts required for the core desktop experience" },
                { num: "1", label: "North star: an assistant that starts with context" },
              ].map((metric) => (
              <div key={metric.label} className="lp-metric-cell">
                <div className="text-display-md lp-metric-num">{metric.num}</div>
                <p className="lp-metric-desc">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--dark">
        <div className="lp-container">
          <div className="reveal">
            <span className="text-label lp-overline">Delivery lanes</span>
            <h2 className="text-display-md lp-story-dark-title">
              What is solid,
              <br />
              what comes next.
            </h2>
          </div>
          <div className="lp-roadmap-grid">
            {DELIVERY_LANES.map((lane, index) => (
              <article
                key={lane.label}
                className={`lp-roadmap-card reveal delay-${(index + 1) * 100}`}
              >
                <span className="text-label lp-roadmap-card-label">{lane.label}</span>
                <h3 className="text-headline lp-roadmap-card-title">{lane.title}</h3>
                <p className="lp-roadmap-card-body">{lane.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--stone">
        <div className="lp-container">
          <div className="reveal">
            <span className="text-label lp-overline-dark">How we ship</span>
            <h2 className="text-display-md lp-how-title">
              Build the picture.
              <br />
              Then build on it.
            </h2>
          </div>
          <div className="lp-steps-grid">
            {PROCESS_STEPS.map((step, index) => (
              <div
                key={step.n}
                className={`lp-step-cell reveal delay-${(index + 1) * 100}`}
              >
                <span className="text-label lp-step-num">{step.n}</span>
                <h3 className="text-headline lp-step-title">{step.title}</h3>
                <p className="lp-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-section lp-section--dark">
        <div className="lp-container">
          <div className="lp-cta-block reveal">
            <div className="lp-accent-rule" />
            <h2 className="text-display-lg lp-cta-title">
              Follow the shift
              <br />
              from tracking to help.
            </h2>
            <p className="lp-cta-sub">
              The roadmap sets the direction. The changelog shows the exact repo
              work when it is real.
            </p>
            <div className="lp-cta-actions">
              <Link href="/changelog" className="lp-btn-primary">
                Open the changelog <span>→</span>
              </Link>
              <Link href="/docs" className="lp-btn-ghost-light">
                Read the docs <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
