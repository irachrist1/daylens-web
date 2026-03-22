import Image from "next/image";
import Link from "next/link";
import { DownloadButtons } from "./components/DownloadButtons";

export const metadata = {
  title: "Daylens — Understand how you spend your time",
  description:
    "Daylens watches the apps and websites you use — privately, locally — and turns that data into insight you can actually act on. View your data anywhere with the web companion.",
};

export default function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#051425",
        color: "#c8dcf4",
        fontFamily:
          '-apple-system, "SF Pro Display", "SF Pro Text", "Segoe UI", system-ui, sans-serif',
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Header */}
      <header
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "32px 24px 0",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <Image
          src="/icon-192.svg"
          alt="Daylens"
          width={36}
          height={36}
          style={{ borderRadius: 9 }}
        />
        <span
          style={{
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.3px",
            color: "#c8dcf4",
          }}
        >
          Daylens
        </span>
        <nav style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 24 }}>
          <a
            href="#web-companion"
            style={{
              fontSize: 13,
              color: "#5e7a92",
              textDecoration: "none",
              transition: "color 200ms",
            }}
          >
            Web Companion
          </a>
          <Link
            href="/link"
            style={{
              fontSize: 13,
              color: "#68AEFF",
              textDecoration: "none",
              fontWeight: 500,
              transition: "color 200ms",
            }}
          >
            Connect Device
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
              padding: "7px 16px",
              borderRadius: 8,
              background: "linear-gradient(180deg, #68AEFF 0%, #003EB7 100%)",
              transition: "opacity 200ms",
            }}
          >
            Open Dashboard
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 24px 64px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            letterSpacing: "-1.5px",
            lineHeight: 1.1,
            color: "#ffffff",
            margin: "0 0 24px",
          }}
        >
          Understand how you spend your time.
        </h1>

        <p
          style={{
            fontSize: 18,
            color: "#5e7a92",
            lineHeight: 1.6,
            maxWidth: 560,
            margin: "0 auto 48px",
          }}
        >
          Daylens watches the apps and websites you use — privately, locally —
          and turns that data into insight you can actually act on.
        </p>

        {/* Download buttons */}
        <DownloadButtons />

        <p style={{ fontSize: 12, color: "#3d5568", marginBottom: 72 }}>
          Both apps are free. No subscription, no cloud storage, no telemetry.
        </p>

        {/* Desktop app features */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
            textAlign: "left",
            marginBottom: 120,
          }}
        >
          <Feature
            icon={<ShieldIcon />}
            title="Private by design"
            body="All data stays on your device. Nothing is sent to any server unless you choose to connect the web companion."
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
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 100,
              background: "rgba(104, 174, 255, 0.1)",
              border: "1px solid rgba(104, 174, 255, 0.2)",
              marginBottom: 24,
            }}
          >
            <GlobeIcon />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#68AEFF", letterSpacing: "0.5px", textTransform: "uppercase" }}>
              Web Companion
            </span>
          </div>

          <h2
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-1px",
              lineHeight: 1.15,
              color: "#ffffff",
              margin: "0 0 20px",
            }}
          >
            Your activity data,<br />anywhere you are.
          </h2>

          <p
            style={{
              fontSize: 17,
              color: "#5e7a92",
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "0 auto 48px",
            }}
          >
            Connect your desktop app once, then check your focus scores, browse your history, and chat with AI about your habits — from your phone, tablet, or any browser.
          </p>

          {/* Web companion features */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 20,
              textAlign: "left",
              marginBottom: 48,
            }}
          >
            <Feature
              icon={<DashboardIcon />}
              title="Live dashboard"
              body="See today's focus score, top apps, category breakdown, and timeline — updated every 5 minutes as you work."
            />
            <Feature
              icon={<ChatIcon />}
              title="AI chat"
              body={`Ask questions like "How productive was I this week?" or "What did I spend the most time on today?" and get answers grounded in your real data.`}
            />
            <Feature
              icon={<HistoryIcon />}
              title="Full history"
              body="Browse any past day — focus scores, app usage, website visits, and AI-generated summaries. Your personal work diary."
            />
            <Feature
              icon={<DevicesIcon />}
              title="Cross-platform"
              body="Works with both the macOS and Windows apps. Multiple devices sync to the same workspace — see everything in one place."
            />
            <Feature
              icon={<LockIcon />}
              title="Zero-account auth"
              body="No email, no password, no sign-up. Connect with a QR code or recovery phrase. Your identity is a 12-word mnemonic that only you hold."
            />
            <Feature
              icon={<PhoneIcon />}
              title="Mobile-ready"
              body="Designed for phones first. Check your day from the couch, the commute, or anywhere away from your desk."
            />
          </div>

          {/* CTA */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <Link
              href="/link"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "15px 32px",
                borderRadius: 12,
                background: "linear-gradient(180deg, #68AEFF 0%, #003EB7 100%)",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                textDecoration: "none",
                transition: "transform 200ms, opacity 200ms",
              }}
            >
              <LinkIcon />
              Connect Your Device
            </Link>
            <Link
              href="/dashboard"
              style={{
                fontSize: 14,
                color: "#68AEFF",
                textDecoration: "none",
                fontWeight: 500,
                transition: "opacity 200ms",
              }}
            >
              Already connected? Open your dashboard &rarr;
            </Link>
          </div>

          {/* How it works mini-steps */}
          <div
            style={{
              maxWidth: 480,
              margin: "0 auto",
              padding: 24,
              borderRadius: 16,
              background: "#0d1c2e",
              border: "1px solid #1c2d3e",
              textAlign: "left",
            }}
          >
            <p style={{ fontSize: 11, fontWeight: 600, color: "#5e7a92", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 16 }}>
              How it works
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <MiniStep number={1} text="Download Daylens on your Mac or PC" />
              <MiniStep number={2} text="Open Settings and tap Connect to Web" />
              <MiniStep number={3} text="Scan the QR code from your phone — done" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "48px 24px 40px",
          textAlign: "center",
          borderTop: "1px solid #1c2d3e",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 20, flexWrap: "wrap" }}>
          <Link href="/link" style={{ fontSize: 13, color: "#5e7a92", textDecoration: "none" }}>Connect Device</Link>
          <Link href="/dashboard" style={{ fontSize: 13, color: "#5e7a92", textDecoration: "none" }}>Dashboard</Link>
          <Link href="/recover" style={{ fontSize: 13, color: "#5e7a92", textDecoration: "none" }}>Recover Account</Link>
        </div>
        <p style={{ fontSize: 12, color: "#3d5568" }}>
          Made with care by Daylens
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
    <div
      style={{
        padding: 20,
        borderRadius: 12,
        border: "1px solid #1c2d3e",
        background: "#0d1c2e",
      }}
    >
      <div
        style={{
          color: "#68AEFF",
          marginBottom: 12,
          opacity: 0.85,
        }}
      >
        {icon}
      </div>
      <p
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: "#c8dcf4",
          marginBottom: 6,
        }}
      >
        {title}
      </p>
      <p style={{ fontSize: 13, color: "#5e7a92", lineHeight: 1.5 }}>{body}</p>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2L3 5v5c0 4.5 3.5 7.5 7 8.5 3.5-1 7-4 7-8.5V5L10 2z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 2 L11.8 7.2 L17 7.2 L12.9 10.3 L14.4 15.5 L10 12.5 L5.6 15.5 L7.1 10.3 L3 7.2 L8.2 7.2 Z" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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

function MiniStep({ number, text }: { number: number; text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "rgba(104, 174, 255, 0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: "#68AEFF" }}>{number}</span>
      </div>
      <p style={{ fontSize: 13, color: "#c8dcf4", margin: 0 }}>{text}</p>
    </div>
  );
}
