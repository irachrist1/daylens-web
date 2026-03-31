import Link from "next/link";

export const metadata = {
  title: "Docs — Daylens",
  description:
    "Everything you need to know about Daylens: getting started, features, the web companion, privacy, and FAQ.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      {/* Header */}
      <header className="border-b border-outline-variant/15 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-semibold text-on-surface no-underline">
            <img src="/app-icon.png" alt="Daylens" width={28} height={28} style={{ borderRadius: 7 }} />
            Daylens
          </Link>
          <nav className="flex items-center gap-5 text-sm text-on-surface-variant">
            <Link href="/" className="hover:text-on-surface transition-colors">Home</Link>
            <Link href="/link" className="hover:text-on-surface transition-colors">Connect</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Title */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-on-surface mb-3">Documentation</h1>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Everything you need to know about Daylens — from first install to asking questions about your week.
          </p>
        </div>

        {/* Quick nav */}
        <nav className="rounded-xl bg-surface-low border border-outline-variant/15 p-5 mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant/60 mb-3">On this page</p>
          <div className="grid grid-cols-2 gap-1.5 text-sm">
            {[
              ["#getting-started", "Getting Started"],
              ["#timeline", "The Timeline"],
              ["#session-detail", "Session Detail"],
              ["#stats", "Stats and Focus Score"],
              ["#ai-analysis", "AI Analysis"],
              ["#insights", "Insights Chat"],
              ["#web-companion", "Web Companion"],
              ["#privacy", "Privacy and Data"],
              ["#faq", "FAQ"],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-primary hover:text-primary/80 transition-colors py-0.5">
                {label}
              </a>
            ))}
          </div>
        </nav>

        <div className="space-y-16">

          {/* Getting Started */}
          <section id="getting-started" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Getting Started</SectionTitle>
            <p className="text-on-surface-variant leading-relaxed mb-6">
              Daylens requires no configuration to get value from it. Download, open, and let it run. By the end of your first day you will have a labeled timeline with focus scores and session breakdowns.
            </p>
            <Steps>
              <Step number={1} title="Download Daylens">
                Get the macOS or Windows app from{" "}
                <ExternalLink href="https://christian-tonny.dev/daylens">christian-tonny.dev/daylens</ExternalLink>.
                The app is free and open source.
              </Step>
              <Step number={2} title="Open and let it run">
                Daylens runs in the background from the menu bar. No setup screens, no categories to configure. It starts watching your activity immediately.
              </Step>
              <Step number={3} title="Check your timeline">
                Open Daylens at the end of the day. Your activity will already be grouped into labeled sessions with AI analysis on each block.
              </Step>
              <Step number={4} title="Connect the web companion (optional)">
                To view your data from your phone or any browser, go to Settings, tap <strong className="text-on-surface">Connect to Web</strong>, and scan the QR code. No account or email needed.
              </Step>
            </Steps>
          </section>

          <Divider />

          {/* Timeline */}
          <section id="timeline" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>The Timeline</SectionTitle>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              The timeline shows your day as a sequence of labeled work sessions. These are not categories you configure — Daylens watches your apps and browser tabs, detects when the work shifts, and names each block based on what actually happened.
            </p>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              A session called "Tax Filing and Email" or "Mixed Development and Research Work" came from analyzing your activity, not from a predefined label.
            </p>
            <InfoBox>
              You can navigate to any past day using the date picker at the top of the timeline view. The full history is stored locally on your device.
            </InfoBox>
          </section>

          <Divider />

          {/* Session Detail */}
          <section id="session-detail" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Session Detail</SectionTitle>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Click any block on the timeline to see the full breakdown of what happened inside it.
            </p>
            <ul className="space-y-2 mb-4">
              {[
                "Every website or page that was open, with time spent on each",
                "Which apps were running and for how long",
                "Context switch count for the session",
                "The AI-generated description of what the work was",
              ].map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-on-surface-variant">
                  <span className="text-primary mt-0.5 shrink-0">•</span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-on-surface-variant leading-relaxed">
              Context switches are counted each time your active window or tab changes. A high switch count in a session often signals fragmented work or heavy research across multiple sources.
            </p>
          </section>

          <Divider />

          {/* Stats */}
          <section id="stats" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Stats and Focus Score</SectionTitle>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              The stats view translates your day into numbers: total active time, time across categories, and your focus score.
            </p>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              The <strong className="text-on-surface">focus score</strong> is calculated from your own switching behavior relative to your own history. It is not a universal benchmark. It moves based on how fragmented your attention was compared to your own average, so it improves as Daylens learns more about your patterns.
            </p>
            <p className="text-on-surface-variant leading-relaxed">
              The <strong className="text-on-surface">intelligence insight</strong> at the bottom of the stats view reads your actual data and surfaces one thing worth knowing that day. It is not a generic tip — it is specific to what happened.
            </p>
          </section>

          <Divider />

          {/* AI Analysis */}
          <section id="ai-analysis" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>AI Analysis</SectionTitle>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Every session in the timeline is analyzed by AI automatically. You do not need to prompt it or enable it — it runs on each session as it completes.
            </p>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              The analysis understands which apps and sites were primary versus supporting, distinguishes research from active work, and generates the session name and description from what actually happened.
            </p>
            <InfoBox>
              The AI analysis requires an internet connection to run. The data sent is your session metadata (app names, site titles, durations) — not screenshots, keystrokes, or file contents.
            </InfoBox>
          </section>

          <Divider />

          {/* Insights */}
          <section id="insights" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Insights Chat</SectionTitle>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              The Insights tab is a chat interface that already has all your data. Ask questions in plain language across any timeframe.
            </p>
            <div className="rounded-xl bg-surface-low border border-outline-variant/15 p-4 mb-4 space-y-2">
              {[
                "What was I doing Thursday afternoon?",
                "Where did my focus go this week?",
                "Which days did I have the most context switches?",
                "How much time did I spend in the browser vs. my editor this week?",
              ].map((q) => (
                <p key={q} className="text-sm text-on-surface-variant font-mono">
                  <span className="text-primary mr-2">Q</span>{q}
                </p>
              ))}
            </div>
            <p className="text-on-surface-variant leading-relaxed">
              Answers are grounded in your actual activity data. Follow-up questions work — the conversation builds on itself within a session.
            </p>
          </section>

          <Divider />

          {/* Web Companion */}
          <section id="web-companion" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Web Companion</SectionTitle>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              The web companion lets you view your Daylens data from any device — your phone, a tablet, another computer.
            </p>
            <Steps>
              <Step number={1} title="Open Settings in the desktop app">
                Go to the Settings tab and tap <strong className="text-on-surface">Connect to Web</strong>. A QR code and link token will appear.
              </Step>
              <Step number={2} title="Scan or paste the token">
                On your phone or browser, go to{" "}
                <ExternalLink href="/link">christian-tonny.dev/daylens/link</ExternalLink>.
                Scan the QR code or paste the token manually.
              </Step>
              <Step number={3} title="You're connected">
                Your dashboard, history, and AI chat are now accessible from that device. The desktop app syncs data in the background.
              </Step>
            </Steps>
            <InfoBox>
              Your recovery phrase is shown once during setup. Save it somewhere safe — it is the only way to restore access to your web companion account if you disconnect.
            </InfoBox>
          </section>

          <Divider />

          {/* Privacy */}
          <section id="privacy" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>Privacy and Data</SectionTitle>
            <p className="text-on-surface-variant leading-relaxed mb-4">
              Daylens is built around a simple principle: your data stays on your device unless you choose otherwise.
            </p>
            <ul className="space-y-3 mb-4">
              {[
                ["No screenshots", "Daylens reads window titles and browser tab titles. It never captures what is on screen."],
                ["No keylogging", "Daylens does not record what you type."],
                ["No cloud storage by default", "All data is stored locally. The web companion sync only activates when you explicitly connect it."],
                ["No account required", "The web companion uses a QR code pairing. No email, no password, no profile."],
                ["Open source", "The entire codebase is public. You can read exactly what Daylens does."],
              ].map(([title, body]) => (
                <li key={title as string} className="flex gap-3 text-sm">
                  <span className="text-success mt-0.5 shrink-0">✓</span>
                  <span>
                    <strong className="text-on-surface">{title}. </strong>
                    <span className="text-on-surface-variant">{body}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              AI analysis and the Insights chat send session metadata to process queries. This data is your activity summary (app names, site titles, durations) — not the content of pages or files.
            </p>
          </section>

          <Divider />

          {/* FAQ */}
          <section id="faq" style={{ scrollMarginTop: 80 }}>
            <SectionTitle>FAQ</SectionTitle>
            <div className="space-y-6">
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
                <div key={q}>
                  <p className="font-medium text-on-surface mb-1.5">{q}</p>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <Divider />

          {/* Footer CTA */}
          <div className="text-center py-4">
            <p className="text-on-surface-variant text-sm mb-4">Something not covered here?</p>
            <a
              href="https://github.com/irachrist1/daylens/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Open an issue on GitHub
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-on-surface mb-4 tracking-tight">{children}</h2>
  );
}

function Divider() {
  return <div className="border-t border-outline-variant/15" />;
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-primary/8 border border-primary/20 px-4 py-3 text-sm text-on-surface-variant leading-relaxed">
      <span className="text-primary font-medium mr-1.5">Note:</span>
      {children}
    </div>
  );
}

function Steps({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4">{children}</div>;
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center mt-0.5">
        <span className="text-xs font-bold text-primary">{number}</span>
      </div>
      <div>
        <p className="text-sm font-medium text-on-surface mb-1">{title}</p>
        <p className="text-sm text-on-surface-variant leading-relaxed">{children}</p>
      </div>
    </div>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors">
      {children}
    </a>
  );
}
