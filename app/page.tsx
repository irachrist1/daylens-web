import Image from "next/image";

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
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 20,
          }}
        >
          <a
            href="/api/download/mac"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 24px",
              borderRadius: 10,
              background: "linear-gradient(180deg, #68AEFF 0%, #003EB7 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              transition: "opacity 200ms",
            }}
          >
            <AppleIcon />
            Download for Mac
          </a>
          <a
            href="/api/download/windows"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 24px",
              borderRadius: 10,
              background: "linear-gradient(180deg, #68AEFF 0%, #003EB7 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "none",
              transition: "opacity 200ms",
            }}
          >
            <WindowsIcon />
            Download for Windows
          </a>
        </div>

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

function AppleIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M11.182 3.236c.615-.74 1.03-1.77.916-2.8-.885.036-1.956.59-2.59 1.33-.57.66-1.07 1.72-.935 2.73.985.076 1.994-.5 2.61-1.26zM11.9 4.85c-1.44-.083-2.665.817-3.35.817-.685 0-1.73-.78-2.862-.76-1.47.022-2.835.854-3.588 2.176-1.535 2.65-.4 6.58 1.088 8.734.734 1.067 1.606 2.256 2.758 2.213 1.1-.044 1.516-.71 2.842-.71 1.326 0 1.698.71 2.853.688 1.196-.022 1.946-1.088 2.68-2.155.842-1.23 1.187-2.427 1.208-2.49-.022-.022-2.32-.897-2.342-3.542-.022-2.21 1.803-3.278 1.887-3.322-1.033-1.523-2.635-1.693-3.174-1.65z" />
    </svg>
  );
}

function WindowsIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
    >
      <path d="M0 2.357L6.545 1.5v6H0V2.357zM7.273 1.393L16 0v7.5H7.273V1.393zM0 8.5h6.545v6L0 13.643V8.5zM7.273 8.5H16V16l-8.727-1.393V8.5z" />
    </svg>
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
