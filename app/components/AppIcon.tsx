"use client";

import { CATEGORY_COLORS } from "@/app/lib/format";

/** Known macOS bundle ID → icon URL mapping */
const KNOWN_ICONS: Record<string, string> = {
  // Browsers
  "com.apple.Safari": "https://upload.wikimedia.org/wikipedia/commons/5/52/Safari_browser_logo.svg",
  "com.google.Chrome": "https://www.google.com/chrome/static/images/chrome-logo-m100.svg",
  "company.thebrowser.Browser": "https://arc.net/favicon.ico",
  "com.brave.Browser": "https://brave.com/static-assets/images/brave-logo-sans-text.svg",
  "com.microsoft.edgemac": "https://edgestatic.azureedge.net/shared/cms/lrs1c69a1j/section-images/c41502c0a7e04b07b0e0e13acb26b176.png",
  "org.mozilla.firefox": "https://www.mozilla.org/media/protocol/img/logos/firefox/browser/logo.svg",
  // Dev tools
  "com.microsoft.VSCode": "https://code.visualstudio.com/favicon.ico",
  "dev.zed.Zed": "https://zed.dev/favicon.ico",
  "com.apple.dt.Xcode": "https://developer.apple.com/assets/elements/icons/xcode/xcode-96x96_2x.png",
  "com.sublimetext.4": "https://www.sublimetext.com/favicon.ico",
  // Communication
  "com.tinyspeck.slackmacgap": "https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png",
  "us.zoom.xos": "https://st1.zoom.us/zoom.ico",
  "com.microsoft.teams2": "https://statics.teams.cdn.office.net/hashedassets-launcher/favicon/favicon-32x32-v10c.png",
  "ru.keepcoder.Telegram": "https://telegram.org/favicon.ico",
  "com.hnc.Discord": "https://discord.com/assets/favicon.ico",
  // Productivity
  "com.spotify.client": "https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png",
  "com.openai.chat": "https://cdn.oaistatic.com/assets/favicon-o4mini-32x32.png",
  "md.obsidian": "https://obsidian.md/favicon.ico",
  "com.googlecode.iterm2": "https://iterm2.com/favicon.ico",
  "com.figma.Desktop": "https://static.figma.com/app/icon/1/favicon.ico",
  "com.linear": "https://linear.app/favicon.ico",
  "com.notion.Notion": "https://www.notion.so/images/favicon.ico",
  "com.apple.Terminal": "https://parsefiles.back4app.com/JPaQcFfEEQ1ePBxbf6wvnz8y2YgCKhEjYdMnJMPB/e2e03f27e3a6ecab1427be7100d403dc_low_res_Terminal.png",
};

export function getAppIconUrl(bundleID: string): string | null {
  return KNOWN_ICONS[bundleID] ?? null;
}

export function AppIcon({
  bundleID,
  displayName,
  category,
  size = 32,
}: {
  bundleID: string;
  displayName: string;
  category: string;
  size?: number;
}) {
  const iconUrl = getAppIconUrl(bundleID);
  const px = `${size / 16}rem`;

  if (iconUrl) {
    return (
      <div className="relative" style={{ width: px, height: px }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconUrl}
          alt={displayName}
          className="rounded-lg"
          style={{ width: px, height: px }}
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = "flex";
            }
          }}
        />
        <div
          className="rounded-lg items-center justify-center text-xs font-bold"
          style={{
            display: "none",
            width: px,
            height: px,
            backgroundColor: (CATEGORY_COLORS[category] || "#475569") + "20",
            color: CATEGORY_COLORS[category] || "#475569",
          }}
        >
          {displayName.charAt(0)}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg flex items-center justify-center text-xs font-bold"
      style={{
        width: px,
        height: px,
        backgroundColor: (CATEGORY_COLORS[category] || "#475569") + "20",
        color: CATEGORY_COLORS[category] || "#475569",
      }}
    >
      {displayName.charAt(0)}
    </div>
  );
}
