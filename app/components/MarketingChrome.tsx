import Link from "next/link";

type MarketingNavKey = "docs" | "roadmap" | "changelog";

const NAV_LINKS: Array<{ href: string; label: string; key: MarketingNavKey }> =
  [
    { href: "/docs", label: "Docs", key: "docs" },
    { href: "/roadmap", label: "Roadmap", key: "roadmap" },
    { href: "/changelog", label: "Changelog", key: "changelog" },
  ];

export function MarketingInnerNav({ current }: { current: MarketingNavKey }) {
  return (
    <header className="lp-docs-nav">
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          textDecoration: "none",
          color: "var(--lp-bone)",
          fontSize: "0.9375rem",
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/daylens/app-icon.png"
          alt="Daylens"
          width={26}
          height={26}
          style={{ borderRadius: 7 }}
        />
        Daylens
      </Link>

      <nav className="lp-docs-nav-links">
        <Link href="/" className="lp-footer-link">
          Home
        </Link>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="lp-footer-link"
            style={
              current === link.key
                ? { color: "var(--lp-bone)" }
                : undefined
            }
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/link"
          className="lp-btn-primary"
          style={{ padding: "0.5rem 1.25rem", fontSize: "0.8125rem" }}
        >
          Connect Device
        </Link>
      </nav>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="lp-footer">
      <div className="lp-container">
        <div className="lp-footer-grid">
          <div className="lp-footer-brand">
            <div className="lp-footer-logo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/daylens/app-icon.png"
                alt="Daylens"
                width={22}
                height={22}
                style={{ borderRadius: 5 }}
              />
              <span>Daylens</span>
            </div>
            <p className="lp-footer-desc">
              The quiet layer over your workday. Private activity history for
              macOS, Windows, and the web companion.
            </p>
            <p className="lp-footer-credit">Made by Christian Tonny</p>
          </div>

          <div className="lp-footer-col">
            <span className="text-label lp-footer-heading">Explore</span>
            <Link href="/" className="lp-footer-link">
              Home
            </Link>
            <Link href="/docs" className="lp-footer-link">
              Documentation
            </Link>
            <Link href="/roadmap" className="lp-footer-link">
              Roadmap
            </Link>
            <Link href="/changelog" className="lp-footer-link">
              Changelog
            </Link>
          </div>

          <div className="lp-footer-col">
            <span className="text-label lp-footer-heading">Companion</span>
            <Link href="/link" className="lp-footer-link">
              Connect Device
            </Link>
            <Link href="/dashboard" className="lp-footer-link">
              Dashboard
            </Link>
            <Link href="/history" className="lp-footer-link">
              History
            </Link>
            <Link href="/chat" className="lp-footer-link">
              AI Chat
            </Link>
          </div>

          <div className="lp-footer-col">
            <span className="text-label lp-footer-heading">Access</span>
            <Link href="/recover" className="lp-footer-link">
              Recover Account
            </Link>
            <a href="/daylens/api/download/mac" className="lp-footer-link">
              Download for Mac
            </a>
            <a href="/daylens/api/download/windows" className="lp-footer-link">
              Download for Windows
            </a>
            <a
              href="https://github.com/irachrist1/daylens"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-footer-link"
            >
              GitHub
            </a>
          </div>
        </div>

        <div className="lp-footer-bar">
          <p className="lp-footer-copy">© 2026 Daylens. Free and open source.</p>
          <p className="lp-footer-copy">Private first. Cross-platform. Always.</p>
        </div>
      </div>
    </footer>
  );
}
