import Image from "next/image";
import { DownloadButtons } from "./components/DownloadButtons";

export const metadata = {
  title: "Daylens — Understand how you spend your time",
  description:
    "Daylens watches the apps and websites you use — privately, locally — and turns that data into insight you can actually act on.",
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
          maxWidth: 800,
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
      </header>

      {/* Hero */}
      <main
        style={{
          maxWidth: 800,
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

        {/* Feature strip */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 24,
            textAlign: "left",
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
      </main>

      {/* Footer */}
      <footer
        style={{
          maxWidth: 800,
          margin: "0 auto",
          padding: "0 24px 40px",
          textAlign: "center",
          borderTop: "1px solid #1c2d3e",
          paddingTop: 32,
        }}
      >
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
