import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { DownloadButtons } from "./components/DownloadButtons";
import { MobileNav } from "./components/MobileNav";

export const metadata = {
  title: "Daylens — Understand how you spend your time",
  description:
    "Daylens watches the apps and websites you use — privately, locally — and turns that data into insight you can actually act on. View your data anywhere with the web companion.",
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  // If a ?token= param arrives on the root (from old QR codes), forward to /link
  if (params.token && /^[0-9a-f]{32}$/i.test(params.token)) {
    redirect(`/link?token=${params.token}`);
  }
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="landing-header">
        <Link href="/" className="landing-logo">
          <Image
            src="/app-icon.png"
            alt="Daylens"
            width={36}
            height={36}
            className="landing-logo-img"
          />
          <span className="landing-logo-text">Daylens</span>
        </Link>

        {/* Desktop nav — hidden on mobile */}
        <nav className="landing-nav-desktop">
          <a href="#web-companion" className="landing-nav-link">
            Web Companion
          </a>
          <Link href="/link" className="landing-nav-link landing-nav-link-accent">
            Connect Device
          </Link>
          <Link href="/dashboard" className="landing-nav-btn">
            Open Dashboard
          </Link>
        </nav>

        {/* Mobile nav — hidden on desktop */}
        <MobileNav />
      </header>

      {/* Hero */}
      <main className="landing-main">
        <h1 className="landing-hero-title">
          Understand how you spend your time.
        </h1>

        <p className="landing-hero-subtitle">
          Daylens tracks the apps and websites you use — privately, on your device — then
          lets you view insights from anywhere with the web companion.
        </p>

        {/* Download buttons */}
        <DownloadButtons />

        <p className="landing-fine-print" style={{ marginBottom: 72 }}>
          Both apps are free. No subscription, no cloud storage, no telemetry.
        </p>

        {/* Desktop app features */}
        <div className="landing-features-grid" style={{ marginBottom: 120 }}>
          <Feature
            icon={<ShieldIcon />}
            title="Private by design"
            body="All data stays on your device. Nothing leaves unless you connect the web companion."
          />
          <Feature
            icon={<SparkIcon />}
            title="AI-powered insights"
            body="Ask Claude about your day, your habits, or your focus patterns. Powered by your local data."
          />
          <Feature
            icon={<GridIcon />}
            title="Every app, every website"
            body="Nothing slips through. Daylens tracks every app and browser visit from the moment you start it."
          />
        </div>

        {/* ── Web Companion Section ── */}
        <div id="web-companion" style={{ scrollMarginTop: 80 }}>
          <div className="landing-pill">
            <GlobeIcon />
            <span>Web Companion</span>
          </div>

          <h2 className="landing-section-title">
            Your activity data,<br />anywhere you are.
          </h2>

          <p className="landing-section-subtitle">
            Connect your desktop app once, then check focus scores, browse history, and
            chat with AI about your habits — from any device.
          </p>

          {/* Web companion features */}
          <div className="landing-features-grid landing-features-grid-wide" style={{ marginBottom: 48 }}>
            <Feature
              icon={<DashboardIcon />}
              title="Live dashboard"
              body="Today's focus score, top apps, categories, and timeline — updated every 5 minutes."
            />
            <Feature
              icon={<ChatIcon />}
              title="AI chat"
              body={`"How productive was I this week?" Get answers grounded in your real activity data.`}
            />
            <Feature
              icon={<HistoryIcon />}
              title="Full history"
              body="Browse any past day with focus scores, app usage, websites, and AI summaries."
            />
            <Feature
              icon={<DevicesIcon />}
              title="Cross-platform"
              body="Mac and Windows sync to one workspace. See everything in one place."
            />
            <Feature
              icon={<LockIcon />}
              title="Zero-account auth"
              body="No email, no password. Connect with a QR code. Your identity is a 12-word phrase only you hold."
            />
            <Feature
              icon={<PhoneIcon />}
              title="Mobile-ready"
              body="Designed for phones first. Check your day from the couch or the commute."
            />
          </div>

          {/* CTA */}
          <div className="landing-cta-group">
            <Link href="/link" className="landing-cta-primary">
              <LinkIcon />
              Connect Your Device
            </Link>
            <Link href="/dashboard" className="landing-cta-secondary">
              Already connected? Open your dashboard &rarr;
            </Link>
          </div>

          {/* How it works mini-steps */}
          <div className="landing-how-it-works">
            <p className="landing-how-label">How it works</p>
            <div className="landing-steps">
              <MiniStep number={1} text="Download Daylens on your Mac or PC" />
              <MiniStep number={2} text="Open Settings and tap Connect to Web" />
              <MiniStep number={3} text="Scan the QR code from your phone — done" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="landing-footer-links">
          <Link href="/link">Connect Device</Link>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/recover">Recover Account</Link>
        </div>
        <p className="landing-fine-print">
          Made with care by Christian Tonny
        </p>
      </footer>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="landing-feature-card">
      <div className="landing-feature-icon">{icon}</div>
      <p className="landing-feature-title">{title}</p>
      <p className="landing-feature-body">{body}</p>
    </div>
  );
}

function MiniStep({ number, text }: { number: number; text: string }) {
  return (
    <div className="landing-step">
      <div className="landing-step-number">
        <span>{number}</span>
      </div>
      <p>{text}</p>
    </div>
  );
}

/* ── Icons ── */

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2L3 5v5c0 4.5 3.5 7.5 7 8.5 3.5-1 7-4 7-8.5V5L10 2z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2 L11.8 7.2 L17 7.2 L12.9 10.3 L14.4 15.5 L10 12.5 L5.6 15.5 L7.1 10.3 L3 7.2 L8.2 7.2 Z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="6" height="6" rx="1" />
      <rect x="12" y="2" width="6" height="6" rx="1" />
      <rect x="2" y="12" width="6" height="6" rx="1" />
      <rect x="12" y="12" width="6" height="6" rx="1" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M2 10h16" />
      <path d="M10 2a14.5 14.5 0 014 8 14.5 14.5 0 01-4 8 14.5 14.5 0 01-4-8 14.5 14.5 0 014-8z" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="7" height="9" rx="1.5" />
      <rect x="11" y="2" width="7" height="5" rx="1.5" />
      <rect x="2" y="13" width="7" height="5" rx="1.5" />
      <rect x="11" y="9" width="7" height="9" rx="1.5" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H8l-4 3v-3H3a1 1 0 01-1-1V4z" />
      <path d="M7 7h6M7 10h4" />
    </svg>
  );
}

function HistoryIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="8" />
      <path d="M10 5v5l3 3" />
    </svg>
  );
}

function DevicesIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="12" height="9" rx="1.5" />
      <path d="M5 15h4" />
      <rect x="13" y="6" width="6" height="10" rx="1" />
      <path d="M15 14h2" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="9" width="12" height="9" rx="2" />
      <path d="M7 9V6a3 3 0 016 0v3" />
      <circle cx="10" cy="13.5" r="1" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="1" width="10" height="18" rx="2" />
      <path d="M9 16h2" />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12l4-4" />
      <path d="M11.5 14.5l1.5-1.5a4 4 0 000-5.66l-.34-.34a4 4 0 00-5.66 0L5.5 8.5" />
      <path d="M8.5 5.5L7 7a4 4 0 000 5.66l.34.34a4 4 0 005.66 0L14.5 11.5" />
    </svg>
  );
}
