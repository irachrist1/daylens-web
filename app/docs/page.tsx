import Link from "next/link";
import { MarketingFooter, MarketingInnerNav } from "../components/MarketingChrome";
import { MarketingCursor } from "../components/MarketingEffects";

export const metadata = {
  title: "Docs — Daylens",
  description:
    "Everything you need to know about Daylens: getting started, features, the web companion, privacy, and FAQ.",
};

const TOC = [
  { href: "#getting-started", label: "Getting Started" },
  { href: "#timeline", label: "The Timeline" },
  { href: "#session-detail", label: "Session Detail" },
  { href: "#stats", label: "Stats and Focus Score" },
  { href: "#ai-analysis", label: "AI Analysis" },
  { href: "#insights", label: "Insights Chat" },
  { href: "#web-companion", label: "Web Companion" },
  { href: "#privacy", label: "Privacy and Data" },
  { href: "#faq", label: "FAQ" },
];

export default function DocsPage() {
  return (
    <div className="lp">
      <MarketingCursor />
      <MarketingInnerNav current="docs" />

      {/* ── Hero ── */}
      <section className="lp-docs-hero">
        <div className="lp-container" style={{ position: "relative", zIndex: 1 }}>
          <div className="lp-accent-rule" style={{ marginBottom: "1.5rem" }} />
          <p className="text-label" style={{ color: "var(--lp-accent)", marginBottom: "1rem" }}>Documentation</p>
          <h1 className="text-display-lg" style={{ color: "var(--lp-bone)", margin: "0 0 1rem", maxWidth: "18ch" }}>
            Everything about Daylens.
          </h1>
          <p style={{ fontSize: "1rem", fontWeight: 300, lineHeight: 1.65, color: "rgba(252,249,248,0.45)", margin: 0, maxWidth: "44ch" }}>
            From first install to asking questions about your week — all in one place.
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="lp-section lp-section--light">
        <div className="lp-container">
          <div className="lp-docs-layout">

            {/* Sidebar TOC */}
            <aside className="lp-docs-sidebar">
              <span className="text-label lp-docs-toc-heading">On this page</span>
              {TOC.map(({ href, label }) => (
                <a key={href} href={href} className="lp-docs-toc-link">{label}</a>
              ))}
            </aside>

            {/* Article */}
            <article className="lp-docs-content">

              {/* Getting Started */}
              <section id="getting-started" style={{ scrollMarginTop: 80 }} className="lp-docs-section">
                <h2 className="text-headline lp-docs-section-title">Getting Started</h2>
                <p className="lp-docs-body">
                  Daylens requires no configuration to get value from it. Download, open, and let it run. By the end of your first day you will have a labeled timeline with focus scores and session breakdowns.
                </p>
                <div className="lp-docs-steps">
                  <div className="lp-docs-step">
                    <span className="text-label lp-docs-step-num">01</span>
                    <div>
                      <p className="lp-docs-step-title">Download Daylens</p>
                      <p className="lp-docs-step-body">
                        Get the macOS or Windows app from{" "}
                        <a href="https://christian-tonny.dev/daylens" className="lp-docs-link">christian-tonny.dev/daylens</a>.
                        The app is free and open source.
                      </p>
                    </div>
                  </div>
                  <div className="lp-docs-step">
                    <span className="text-label lp-docs-step-num">02</span>
                    <div>
                      <p className="lp-docs-step-title">Open and let it run</p>
                      <p className="lp-docs-step-body">
                        Daylens runs in the background from the menu bar. No setup screens, no categories to configure. It starts watching your activity immediately.
                      </p>
                    </div>
                  </div>
                  <div className="lp-docs-step">
                    <span className="text-label lp-docs-step-num">03</span>
                    <div>
                      <p className="lp-docs-step-title">Check your timeline</p>
                      <p className="lp-docs-step-body">
                        Open Daylens at the end of the day. Your activity will already be grouped into labeled sessions with AI analysis on each block.
                      </p>
                    </div>
                  </div>
                  <div className="lp-docs-step">
                    <span className="text-label lp-docs-step-num">04</span>
                    <div>
                      <p className="lp-docs-step-title">Connect the web companion (optional)</p>
                      <p className="lp-docs-step-body">
                        To view your data from your phone or any browser, go to Settings, tap <strong style={{ fontWeight: 500, color: "var(--lp-ink)" }}>Connect to Web</strong>, and scan the QR code. No account or email needed.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Timeline */}
              <section id="timeline" style={{ scrollMarginTop: 80 }} className="lp-docs-section">
                <h2 className="text-headline lp-docs-section-title">The Timeline</h2>
                <p className="lp-docs-body">
                  The timeline shows your day as a sequence of labeled work sessions. These are not categories you configure — Daylens watches your apps and browser tabs, detects when the work shifts, and names each block based on what actually happened.
                </p>
                <p className="lp-docs-body">
                  A session called "Tax Filing and Email" or "Mixed Development and Research Work" came from analyzing your activity, not from a predefined label.
                </p>
                <div className="lp-docs-infobox">
                  <span className="lp-docs-infobox-label">Note:</span>
                  You can navigate to any past day using the date picker at the top of the timeline view. The full history is stored locally on your device.
                </div>
              </section>

              {/* Session Detail */}
              <section id="session-detail" style={{ scrollMarginTop: 80 }} className="lp-docs-section">
                <h2 className="text-headline lp-docs-section-title">Session Detail</h2>
                <p className="lp-docs-body">
                  Click any block on the timeline to see the full breakdown of what happened inside it.
                </p>
                <ul className="lp-docs-bullets">
                  {[
                    "Every website or page that was open, with time spent on each",
                    "Which apps were running and for how long",
                    "Context switch count for the session",
                    "The AI-generated description of what the work was",
                  ].map((item) => (
                    <li key={item}>
                      <span className="lp-docs-bullet-dot" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="lp-docs-body">
                  Context switches are counted each time your active window or tab changes. A high switch count in a session often signals fragmented work or heavy research across multiple sources.
                </p>
              </section>

              {/* Stats */}
              <section id="stats" style={{ scrollMarginTop: 80 }} className="lp-docs-section">
                <h2 className="text-headline lp-docs-section-title">Stats and Focus Score</h2>
                <p className="lp-docs-body">
                  The stats view translates your day into numbers: total active time, time across categories, and your focus score.
                </p>
                <p className="lp-docs-body">
                  The <strong style={{ fontWeight: 500, color: "var(--lp-ink)" }}>focus score</strong> is calculated from your own switching behavior relative to your own history. It is not a universal benchmark. It moves based on how fragmented your attention was compared to your own average, so it improves as Daylens learns more about your patterns.
                </p>
                <p className="lp-docs-body">
                  The <strong style={{ fontWeight: 500, color: "var(--lp-ink)" }}>intelligence insight</strong> at the bottom of the stats view reads your actual data and surfaces one thing worth knowing that day. It is not a generic tip — it is specific to what happened.
                </p>
              </section>

              {/* AI Analysis */}
              <section id="ai-analysis" style={{ scrollMarginTop: 80 }} className="lp-docs-section">
                <h2 className="text-headline lp-docs-section-title">AI Analysis</h2>
                <p className="lp-docs-body">
                  Every session in the timeline is analyzed by AI automatically. You do not need to prompt it or enable it — it runs on each session as it completes.
                </p>
                <p className="lp-docs-body">
                  The analysis understands which apps and sites were primary versus supporting, distinguishes research from active work, and generates the session name and description from what actually happened.
                </p>
                <div className="lp-docs-infobox">
                  <span className="lp-docs-infobox-label">Note:</span>
                  The AI analysis requires an internet connection to run. The data sent is your session metadata (app names, site titles, durations) — not screenshots, keystrokes, or file contents.
                </div>
              </section>

              {/* Insights Chat */}
              <section id="insights" style={{ scrollMarginTop: 80 }} className="lp-docs-section">
                <h2 className="text-headline lp-docs-section-title">Insights Chat</h2>
                <p className="lp-docs-body">
                  The Insights tab is a chat interface that already has all your data. Ask questions in plain language across any timeframe.
                </p>
                <div className="lp-docs-examples">
                  {[
                    "What was I doing Thursday afternoon?",
                    "Where did my focus go this week?",
                    "Which days did I have the most context switches?",
                    "How much time did I spend in the browser vs. my editor this week?",
                  ].map((q) => (
                    <div key={q} className="lp-docs-example">
                      <span className="lp-docs-example-q">Q</span>
                      {q}
                    </div>
                  ))}
                </div>
                <p className="lp-docs-body">
                  Answers are grounded in your actual activity data. Follow-up questions work — the conversation builds on itself within a session.
                </p>
              </section>

              {/* Web Companion */}
              <section id="web-companion" style={{ scrollMarginTop: 80 }} className="lp-docs-section">
                <h2 className="text-headline lp-docs-section-title">Web Companion</h2>
                <p className="lp-docs-body">
                  The web companion lets you view your Daylens data from any device — your phone, a tablet, another computer.
                </p>
                <div className="lp-docs-steps">
                  <div className="lp-docs-step">
                    <span className="text-label lp-docs-step-num">01</span>
                    <div>
                      <p className="lp-docs-step-title">Open Settings in the desktop app</p>
                      <p className="lp-docs-step-body">
                        Go to the Settings tab and tap <strong style={{ fontWeight: 500, color: "var(--lp-ink)" }}>Connect to Web</strong>. A QR code and link token will appear.
                      </p>
                    </div>
                  </div>
                  <div className="lp-docs-step">
                    <span className="text-label lp-docs-step-num">02</span>
                    <div>
                      <p className="lp-docs-step-title">Scan or paste the token</p>
                      <p className="lp-docs-step-body">
                        On your phone or browser, go to{" "}
                        <a href="https://christian-tonny.dev/daylens/link" className="lp-docs-link">christian-tonny.dev/daylens/link</a>.
                        Scan the QR code or paste the token manually.
                      </p>
                    </div>
                  </div>
                  <div className="lp-docs-step">
                    <span className="text-label lp-docs-step-num">03</span>
                    <div>
                      <p className="lp-docs-step-title">You&apos;re connected</p>
                      <p className="lp-docs-step-body">
                        Your dashboard, history, and AI chat are now accessible from that device. The desktop app syncs data in the background.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="lp-docs-infobox">
                  <span className="lp-docs-infobox-label">Note:</span>
                  Your recovery phrase is shown once during setup. Save it somewhere safe — it is the only way to restore access to your web companion account if you disconnect.
                </div>
              </section>

              {/* Privacy */}
              <section id="privacy" style={{ scrollMarginTop: 80 }} className="lp-docs-section">
                <h2 className="text-headline lp-docs-section-title">Privacy and Data</h2>
                <p className="lp-docs-body">
                  Daylens is built around a simple principle: your data stays on your device unless you choose otherwise.
                </p>
                <div className="lp-docs-privacy-list">
                  {[
                    ["No screenshots", "Daylens reads window titles and browser tab titles. It never captures what is on screen."],
                    ["No keylogging", "Daylens does not record what you type."],
                    ["No cloud storage by default", "All data is stored locally. The web companion sync only activates when you explicitly connect it."],
                    ["No account required", "The web companion uses a QR code pairing. No email, no password, no profile."],
                    ["Open source", "The entire codebase is public. You can read exactly what Daylens does."],
                  ].map(([title, body]) => (
                    <div key={title as string} className="lp-docs-privacy-item">
                      <span className="lp-docs-check">✓</span>
                      <div>
                        <p className="lp-docs-privacy-title">{title}.</p>
                        <p className="lp-docs-privacy-body">{body}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="lp-docs-body" style={{ marginTop: "1rem" }}>
                  AI analysis and the Insights chat send session metadata to process queries. This data is your activity summary (app names, site titles, durations) — not the content of pages or files.
                </p>
              </section>

              {/* FAQ */}
              <section id="faq" style={{ scrollMarginTop: 80 }} className="lp-docs-section">
                <h2 className="text-headline lp-docs-section-title">FAQ</h2>
                <div className="lp-docs-faq">
                  {[
                    {
                      q: "Does Daylens work on Windows?",
                      a: "Yes. Daylens is available for both macOS and Windows. Both platforms support all features including AI analysis and the web companion.",
                    },
                    {
                      q: "Does it work on Linux?",
                      a: "Not currently. macOS and Windows are the supported platforms.",
                    },
                    {
                      q: "What browser activity does Daylens track?",
                      a: "Daylens reads the active tab title from your browser natively — no extension required. It captures the page title and domain, not the full URL or page content.",
                    },
                    {
                      q: "How is the focus score calculated?",
                      a: "The focus score is based on your context switch rate relative to your own historical average. A lower switch rate than your average produces a higher score. It is personal, not a fixed benchmark.",
                    },
                    {
                      q: "Can I delete my data?",
                      a: "Yes. Your data is stored locally and you can clear it at any time from Settings. Disconnecting the web companion removes the synced copy from the server.",
                    },
                    {
                      q: "Is Daylens free?",
                      a: "Yes. Daylens is free and open source. There is no subscription, no premium tier, and no trial period.",
                    },
                    {
                      q: "Where is the source code?",
                      a: "GitHub: github.com/irachrist1/daylens",
                    },
                  ].map(({ q, a }) => (
                    <details key={q} className="lp-docs-faq-item">
                      <summary>
                        <span className="lp-docs-faq-q">{q}</span>
                        <svg className="lp-docs-faq-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </summary>
                      <p className="lp-docs-faq-a">{a}</p>
                    </details>
                  ))}
                </div>
              </section>

              {/* Footer CTA */}
              <div className="lp-docs-cta">
                <p className="lp-docs-body" style={{ marginBottom: "1.25rem" }}>Something not covered here?</p>
                <a
                  href="https://github.com/irachrist1/daylens/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lp-btn-ghost-dark"
                >
                  Open an issue on GitHub →
                </a>
              </div>

            </article>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
