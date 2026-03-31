"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import posthog from "posthog-js";
import { MarketingFooter } from "./MarketingChrome";
import { MarketingCursor, useReveal } from "./MarketingEffects";

// ── Marquee items ──────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  "Private by Design",
  "Local Processing",
  "AI-Powered Insights",
  "Mac & Windows",
  "Zero Cloud Storage",
  "Full App History",
  "Focus Scoring",
  "No Subscription",
  "Web Dashboard",
  "QR Code Pairing",
  "Cross-Device Sync",
  "Every App, Every Site",
];

// ── Main component ─────────────────────────────────────────────────────────────
export function LandingClient() {
  useReveal();
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const doubled = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="lp">
      <MarketingCursor />

      {/* ── Navigation ──────────────────────────────────────────────────────── */}
      <header className={`lp-nav${navScrolled ? " lp-nav--scrolled" : ""}`}>
        <Link href="/" className="lp-logo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/daylens/app-icon.png"
            alt="Daylens"
            width={26}
            height={26}
            style={{ borderRadius: 6 }}
          />
          <span>Daylens</span>
        </Link>

        <nav className="lp-nav-links">
          <a href="#features" className="lp-nav-link">Features</a>
          <a href="#how-it-works" className="lp-nav-link">How it works</a>
          <Link href="/docs" className="lp-nav-link">Docs</Link>
          <Link href="/dashboard" className="lp-nav-cta">
            Open Dashboard <span>→</span>
          </Link>
        </nav>

        <button
          className="lp-hamburger"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          )}
        </button>

        {mobileMenuOpen && (
          <div className="lp-mobile-menu" onClick={() => setMobileMenuOpen(false)}>
            <a href="#features" className="lp-mobile-link">Features</a>
            <a href="#how-it-works" className="lp-mobile-link">How it works</a>
            <Link href="/docs" className="lp-mobile-link">Docs</Link>
            <Link href="/dashboard" className="lp-mobile-link lp-mobile-link--cta">
              Open Dashboard →
            </Link>
          </div>
        )}
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-grid" aria-hidden="true" />
        <div className="lp-hero-content">
          <span
            className="text-label lp-overline"
            style={{ animation: "lp-fadeIn 0.6s var(--ease-out-expo) 0.2s both" }}
          >
            Time Intelligence
          </span>
          <h1
            className="text-display-xl lp-hero-title"
            style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.4s both" }}
          >
            Know where<br />your time goes.
          </h1>
          <p
            className="lp-hero-sub"
            style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.65s both" }}
          >
            Daylens watches every app and website — privately, on your device —
            and turns raw screen time into clarity you can act on.
          </p>
          <div
            className="lp-hero-ctas"
            style={{ animation: "lp-fadeUp 0.8s var(--ease-out-expo) 0.85s both" }}
          >
            <a
              href="/daylens/api/download/mac"
              className="lp-btn-primary"
              onClick={() => posthog.capture("download_clicked", { platform: "mac" })}
            >
              <AppleIcon /> Download for Mac <span>→</span>
            </a>
            <a
              href="/daylens/api/download/windows"
              className="lp-btn-ghost-light"
              onClick={() => posthog.capture("download_clicked", { platform: "windows" })}
            >
              <WindowsIcon /> Download for Windows <span>→</span>
            </a>
          </div>
          <p
            className="lp-fine"
            style={{ animation: "lp-fadeIn 0.8s var(--ease-out-expo) 1.05s both" }}
          >
            Free forever. No account. No subscription.
          </p>
        </div>

        <div
          className="lp-scroll-hint"
          style={{ animation: "lp-fadeIn 0.6s ease 1.4s both" }}
        >
          <div className="lp-scroll-line" />
          <span className="text-label">scroll</span>
        </div>
      </section>

      {/* ── Proof Strip ─────────────────────────────────────────────────────── */}
      <div className="lp-proof-strip" aria-hidden="true">
        <div className="lp-marquee-track">
          {doubled.map((item, i) => (
            <span
              key={i}
              className="lp-marquee-item text-label"
              style={{
                color:
                  i % 3 === 2
                    ? "var(--lp-accent)"
                    : "rgba(252,249,248,0.2)",
              }}
            >
              {item}
              <span className="lp-marquee-sep" aria-hidden="true">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="lp-section lp-section--light">
        <div className="lp-container">
          <div className="lp-section-intro reveal">
            <span className="text-label lp-overline-dark">Core features</span>
            <p className="lp-section-desc">
              Everything you need to understand your time. Nothing you don&apos;t.
            </p>
          </div>

          {/* Feature 1: Visibility */}
          <div className="lp-split">
            <div className="lp-split-visual reveal">
              <div className="img-container">
                <div className="img-reveal lp-visual-applist">
                  <div className="lp-visual-header">
                    <span className="text-label" style={{ color: "rgba(252,249,248,0.3)" }}>Today&apos;s usage</span>
                    <span className="lp-focus-badge">78% focus</span>
                  </div>
                  {[
                    { name: "Figma", time: "3h 22m", pct: 78, color: "#8B5CF6" },
                    { name: "VS Code", time: "2h 14m", pct: 52, color: "#3B82F6" },
                    { name: "Slack", time: "1h 08m", pct: 26, color: "#10B981" },
                    { name: "Safari", time: "0h 47m", pct: 18, color: "#F59E0B" },
                    { name: "Terminal", time: "0h 31m", pct: 12, color: "#6B7280" },
                  ].map((app) => (
                    <div key={app.name} className="lp-app-row">
                      <span className="lp-app-dot" style={{ background: app.color }} />
                      <span className="lp-app-name">{app.name}</span>
                      <div className="lp-app-bar-track">
                        <div
                          className="lp-app-bar"
                          style={{ width: `${app.pct}%`, background: app.color }}
                        />
                      </div>
                      <span className="lp-app-time">{app.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lp-split-content reveal delay-200">
              <div className="lp-accent-rule" />
              <h3 className="text-display-md lp-feature-title">
                What you were doing.
                <br />
                Not just open.
              </h3>
              <p className="lp-feature-body">
                Daylens watches your apps and browser activity natively and
                builds your day as a timeline of labeled work blocks. No
                extensions, no screenshots, and nothing leaves your machine
                unless you choose the web companion.
              </p>
              <ul className="lp-bullets">
                <li>— Navigate to any day and see named work blocks, not raw app totals</li>
                <li>— Click a block to inspect sites, supporting apps, and context switches</li>
                <li>— AI labels every session automatically from what actually happened</li>
                <li>— Focus score is based on your own switching behavior over time</li>
              </ul>
              <Link href="/link" className="lp-btn-ghost-dark">
                View your dashboard <span>→</span>
              </Link>
            </div>
          </div>

          {/* Feature 2: AI Chat */}
          <div className="lp-split lp-split--reversed">
            <div className="lp-split-content reveal delay-200">
              <div className="lp-accent-rule" />
              <h3 className="text-display-md lp-feature-title">
                Ask anything about<br />your day.
              </h3>
              <p className="lp-feature-body">
                An AI assistant powered by Claude that actually knows your data.
                Ask about your habits, your focus patterns, or why Tuesday felt so unproductive.
              </p>
              <ul className="lp-bullets">
                <li>— Natural language questions about your activity</li>
                <li>— Answers grounded in your real usage data</li>
                <li>— Trend analysis across days and weeks</li>
                <li>— Conversation history saved for context</li>
              </ul>
              <Link href="/chat" className="lp-btn-ghost-dark">
                Try AI chat <span>→</span>
              </Link>
            </div>

            <div className="lp-split-visual reveal">
              <div className="img-container">
                <div className="img-reveal lp-visual-chat">
                  <div className="lp-chat-msg lp-chat-msg--user">
                    How was my focus today?
                  </div>
                  <div className="lp-chat-msg lp-chat-msg--ai">
                    <span className="lp-chat-label">Daylens AI</span>
                    Strong morning — 78% focus score before noon. You spent 3h 22m in
                    Figma with minimal switching. Afternoon dropped after 2pm: 8 context
                    switches in 90 minutes, mostly Slack and email.
                  </div>
                  <div className="lp-chat-msg lp-chat-msg--user">
                    What should I change?
                  </div>
                  <div className="lp-chat-msg lp-chat-msg--ai">
                    <span className="lp-chat-label">Daylens AI</span>
                    <span className="lp-typing-dots">
                      <span /><span /><span />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Signature / Privacy ─────────────────────────────────────────────── */}
      <section className="lp-section lp-section--dark lp-section--gridded">
        <div className="lp-container">
          <div className="lp-signature">
            <div className="lp-signature-text reveal-left">
              <span className="text-label lp-overline">Privacy</span>
              <h2 className="text-display-lg lp-sig-title">
                Your data never<br />leaves your machine.
              </h2>
              <p className="lp-sig-body">
                Most productivity apps are surveillance tools in disguise. Daylens is
                different: all processing happens on-device. No syncing to our servers.
                No selling your habits to advertisers. Your activity is yours alone.
              </p>
              <ul className="lp-sig-bullets">
                <li>
                  <span className="lp-bullet-dot" />
                  100% local processing — no cloud backend
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  No account required, ever
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  Auth via a 12-word phrase only you hold
                </li>
                <li>
                  <span className="lp-bullet-dot" />
                  No telemetry, open to audit
                </li>
              </ul>
              <Link href="/docs" className="lp-btn-ghost-light">
                Read how it works <span>→</span>
              </Link>
            </div>

            <div className="lp-signature-visual reveal">
              <div className="lp-privacy-card">
                <span className="text-label" style={{ color: "rgba(252,249,248,0.3)" }}>
                  Your Mac or PC
                </span>
                <div className="lp-privacy-inner">
                  <div className="lp-privacy-row">
                    <span className="lp-dot-green" />
                    App tracking
                  </div>
                  <div className="lp-privacy-row">
                    <span className="lp-dot-green" />
                    AI processing
                  </div>
                  <div className="lp-privacy-row">
                    <span className="lp-dot-green" />
                    Data storage
                  </div>
                </div>
                <div className="lp-privacy-barrier">
                  <div className="lp-barrier-line" />
                  <span className="text-label" style={{ color: "rgba(252,249,248,0.25)" }}>
                    Nothing exits
                  </span>
                  <div className="lp-barrier-line" />
                </div>
              </div>

              {/* Floating glass stat card */}
              <div className="lp-stat-card">
                <div className="lp-stat-num">100%</div>
                <div className="lp-stat-label">Local. Always.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metrics ─────────────────────────────────────────────────────────── */}
      <section className="lp-section lp-section--light">
        <div className="lp-container">
          <div className="reveal">
            <span className="text-label lp-overline-dark">By the numbers</span>
            <h2 className="text-display-md lp-metrics-title">
              Designed to be trusted.
            </h2>
          </div>
          <div className="lp-metrics-grid reveal delay-200">
            {[
              { num: "100%", label: "Data stays on your device. Full stop." },
              { num: "12+", label: "Browsers supported natively. No extensions." },
              { num: "12", label: "Words. Your complete recovery phrase." },
              { num: "0", label: "Accounts, subscriptions, or paywalls." },
            ].map((m, i) => (
              <div key={i} className="lp-metric-cell">
                <div className="text-display-md lp-metric-num">{m.num}</div>
                <p className="lp-metric-desc">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="lp-section lp-section--stone">
        <div className="lp-container">
          <div className="reveal">
            <span className="text-label lp-overline-dark">Process</span>
            <h2 className="text-display-md lp-how-title">
              Up and running<br />in minutes.
            </h2>
          </div>
          <div className="lp-steps-grid">
            {[
              {
                n: "01",
                title: "Download the app",
                body: "Get Daylens for Mac or Windows. Installs in under a minute and starts tracking immediately.",
              },
              {
                n: "02",
                title: "Track automatically",
                body: "No setup, no tags, no timers. Daylens silently captures every app, window, and site as you work.",
              },
              {
                n: "03",
                title: "Connect the web",
                body: "Open Settings, click Connect to Web, and scan the QR code from your phone. Done.",
              },
              {
                n: "04",
                title: "Ask anything",
                body: "Use the AI assistant or browse your history. Your data is ready whenever you want to look.",
              },
            ].map((step, i) => (
              <div
                key={step.n}
                className={`lp-step-cell reveal delay-${i * 100 + 100}`}
              >
                <span className="text-label lp-step-num">{step.n}</span>
                <h3 className="text-headline lp-step-title">{step.title}</h3>
                <p className="lp-step-body">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────────────────── */}
      <section className="lp-section lp-section--dark">
        <div className="lp-container">
          <div className="lp-cta-block reveal">
            <div className="lp-accent-rule" />
            <h2 className="text-display-lg lp-cta-title">
              Start seeing your<br />time clearly.
            </h2>
            <p className="lp-cta-sub">
              Free to download. Works on Mac and Windows. No account needed.
            </p>
            <div className="lp-cta-actions">
              <a
                href="/daylens/api/download/mac"
                className="lp-btn-primary"
                onClick={() =>
                  posthog.capture("download_clicked", { platform: "mac", source: "cta" })
                }
              >
                <AppleIcon /> Download for Mac <span>→</span>
              </a>
              <a
                href="/daylens/api/download/windows"
                className="lp-btn-ghost-light"
                onClick={() =>
                  posthog.capture("download_clicked", { platform: "windows", source: "cta" })
                }
              >
                <WindowsIcon /> Download for Windows <span>→</span>
              </a>
            </div>
            <p className="lp-fine" style={{ marginTop: "1.5rem" }}>
              Already installed?{" "}
              <Link
                href="/link"
                style={{ color: "var(--lp-accent)", textDecoration: "none" }}
              >
                Connect your web companion →
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <MarketingFooter />
    </div>
  );
}

// ── Icons ──────────────────────────────────────────────────────────────────────
function AppleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M11.182 3.236c.615-.74 1.03-1.77.916-2.8-.885.036-1.956.59-2.59 1.33-.57.66-1.07 1.72-.935 2.73.985.076 1.994-.5 2.61-1.26zM11.9 4.85c-1.44-.083-2.665.817-3.35.817-.685 0-1.73-.78-2.862-.76-1.47.022-2.835.854-3.588 2.176-1.535 2.65-.4 6.58 1.088 8.734.734 1.067 1.606 2.256 2.758 2.213 1.1-.044 1.516-.71 2.842-.71 1.326 0 1.698.71 2.853.688 1.196-.022 1.946-1.088 2.68-2.155.842-1.23 1.187-2.427 1.208-2.49-.022-.022-2.32-.897-2.342-3.542-.022-2.21 1.803-3.278 1.887-3.322-1.033-1.523-2.635-1.693-3.174-1.65z" />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M0 2.357L6.545 1.5v6H0V2.357zM7.273 1.393L16 0v7.5H7.273V1.393zM0 8.5h6.545v6L0 13.643V8.5zM7.273 8.5H16V16l-8.727-1.393V8.5z" />
    </svg>
  );
}
