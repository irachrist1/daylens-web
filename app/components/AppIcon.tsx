"use client";

import { useEffect, useState } from "react";

import { CATEGORY_COLORS } from "@/app/lib/format";

/** Static icon URLs for well-known macOS/Windows apps (bundle ID → icon URL) */
const KNOWN_APP_ICONS: Record<string, string> = {
  // Browsers
  "com.google.Chrome": "https://www.google.com/chrome/static/images/chrome-logo-m100.svg",
  "com.apple.Safari": "https://help.apple.com/assets/6723A7E02FD4045D040756DE/6723A7E12FD4045D040756E6/en_US/7f4c7670a0c9daa73e3d3266a7ff2a5c.png",
  "company.thebrowser.Browser": "https://arc.net/favicon.png",
  "org.mozilla.firefox": "https://www.mozilla.org/media/protocol/img/logos/firefox/browser/logo.eb1324e44442.svg",
  "com.brave.Browser": "https://brave.com/static-assets/images/brave-logo-sans-text.svg",
  "com.microsoft.edgemac": "https://edgestatic.azureedge.net/shared/cms/lrs1c69a1j/section-images/bbc579d07fc74a1a8aab02e47a1ca303.png",

  // Development
  "com.microsoft.VSCode": "https://code.visualstudio.com/favicon.ico",
  "com.apple.dt.Xcode": "https://developer.apple.com/assets/elements/icons/xcode/xcode-96x96_2x.png",
  "dev.warp.Warp-Stable": "https://avatars.githubusercontent.com/u/71840468?s=96",
  "com.todesktop.230313mzl4w4u92": "https://cursor.com/apple-touch-icon.png",
  "com.googlecode.iterm2": "https://iterm2.com/favicon.ico",

  // Communication
  "com.tinyspeck.slackmacgap": "https://a.slack-edge.com/80588/marketing/img/meta/favicon-32.png",
  "us.zoom.xos": "https://st1.zoom.us/zoom.ico",
  "com.microsoft.teams2": "https://statics.teams.cdn.office.net/hashedassets-new/favicon/teams-favicon-fluent-96x96.png",
  "ru.keepcoder.Telegram": "https://telegram.org/img/t_logo.png",
  "com.hnc.Discord": "https://discord.com/assets/f9bb9c4af2b9c32a2c5ee0014661546d.png",

  // Productivity
  "com.microsoft.Word": "https://res.cdn.office.net/assets/mail/illustrations/noConnection/v2/light.png",
  "com.microsoft.Excel": "https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg",
  "com.microsoft.Powerpoint": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Microsoft_Office_PowerPoint_%282019%E2%80%93present%29.svg",
  "com.microsoft.Outlook": "https://upload.wikimedia.org/wikipedia/commons/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg",
  "notion.id": "https://www.notion.so/images/favicon.ico",
  "com.figma.Desktop": "https://static.figma.com/app/icon/1/favicon.png",

  // Apple system apps
  "com.apple.finder": "https://help.apple.com/assets/6723A7E02FD4045D040756DE/6723A7E12FD4045D040756E6/en_US/058dff3bfc0d36e57c6f0c3e9e8e2c84.png",
  "com.apple.AppStore": "https://help.apple.com/assets/6723A7E02FD4045D040756DE/6723A7E12FD4045D040756E6/en_US/2622e392af498b6ea12efe0007595b9f.png",
  "com.apple.Terminal": "https://help.apple.com/assets/6723A7E02FD4045D040756DE/6723A7E12FD4045D040756E6/en_US/d94aa1f4cf6c2c05ca80ef699bebc14c.png",
  "com.apple.systempreferences": "https://help.apple.com/assets/6723A7E02FD4045D040756DE/6723A7E12FD4045D040756E6/en_US/c11a5948fc11bcc63c40e1e3eaca708c.png",
  "com.apple.Music": "https://music.apple.com/assets/favicon/favicon-180.png",
  "com.apple.mail": "https://help.apple.com/assets/6723A7E02FD4045D040756DE/6723A7E12FD4045D040756E6/en_US/0a9c43566e6dadcc52460d8e7e1cb73b.png",
  "com.apple.Notes": "https://help.apple.com/assets/6723A7E02FD4045D040756DE/6723A7E12FD4045D040756E6/en_US/91ff3a73b6aacc1ecf5ca1a7b4faab5d.png",

  // Media
  "com.spotify.client": "https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png",

  // AI tools
  "com.openai.chat": "https://cdn.oaistatic.com/assets/apple-touch-icon-mz9nytnj.webp",
};

/** Display-name based fallback for apps without bundle IDs */
const DISPLAY_NAME_ICONS: Record<string, string> = {
  "arc": KNOWN_APP_ICONS["company.thebrowser.Browser"]!,
  "google chrome": KNOWN_APP_ICONS["com.google.Chrome"]!,
  "chrome": KNOWN_APP_ICONS["com.google.Chrome"]!,
  "safari": KNOWN_APP_ICONS["com.apple.Safari"]!,
  "firefox": KNOWN_APP_ICONS["org.mozilla.firefox"]!,
  "vscode": KNOWN_APP_ICONS["com.microsoft.VSCode"]!,
  "visual studio code": KNOWN_APP_ICONS["com.microsoft.VSCode"]!,
  "code": KNOWN_APP_ICONS["com.microsoft.VSCode"]!,
  "xcode": KNOWN_APP_ICONS["com.apple.dt.Xcode"]!,
  "slack": KNOWN_APP_ICONS["com.tinyspeck.slackmacgap"]!,
  "discord": KNOWN_APP_ICONS["com.hnc.Discord"]!,
  "telegram": KNOWN_APP_ICONS["ru.keepcoder.Telegram"]!,
  "notion": KNOWN_APP_ICONS["notion.id"]!,
  "figma": KNOWN_APP_ICONS["com.figma.Desktop"]!,
  "spotify": KNOWN_APP_ICONS["com.spotify.client"]!,
  "finder": KNOWN_APP_ICONS["com.apple.finder"]!,
  "terminal": KNOWN_APP_ICONS["com.apple.Terminal"]!,
  "microsoft excel": KNOWN_APP_ICONS["com.microsoft.Excel"]!,
  "excel": KNOWN_APP_ICONS["com.microsoft.Excel"]!,
  "microsoft word": KNOWN_APP_ICONS["com.microsoft.Word"]!,
  "word": KNOWN_APP_ICONS["com.microsoft.Word"]!,
  "app store": KNOWN_APP_ICONS["com.apple.AppStore"]!,
  "cursor": KNOWN_APP_ICONS["com.todesktop.230313mzl4w4u92"]!,
  "warp": KNOWN_APP_ICONS["dev.warp.Warp-Stable"]!,
  "iterm2": KNOWN_APP_ICONS["com.googlecode.iterm2"]!,
  "chatgpt": KNOWN_APP_ICONS["com.openai.chat"]!,
  "system preferences": KNOWN_APP_ICONS["com.apple.systempreferences"]!,
  "system settings": KNOWN_APP_ICONS["com.apple.systempreferences"]!,
};

function resolveIconSrc(bundleID: string, displayName: string, iconBase64?: string | null) {
  // 1. Try iconBase64 from snapshot
  const trimmed = iconBase64?.trim();
  if (trimmed) {
    return trimmed.startsWith("data:image/")
      ? trimmed
      : `data:image/png;base64,${trimmed}`;
  }

  // 2. Try known bundle ID mapping
  if (KNOWN_APP_ICONS[bundleID]) {
    return KNOWN_APP_ICONS[bundleID];
  }

  // 3. Try display name match (case-insensitive)
  const nameLower = displayName.toLowerCase();
  if (DISPLAY_NAME_ICONS[nameLower]) {
    return DISPLAY_NAME_ICONS[nameLower];
  }

  return null;
}

export function AppIcon({
  bundleID,
  displayName,
  category,
  iconBase64,
  size = 32,
}: {
  bundleID: string;
  displayName: string;
  category: string;
  iconBase64?: string | null;
  size?: number;
}) {
  const px = `${size / 16}rem`;
  const iconSrc = resolveIconSrc(bundleID, displayName, iconBase64);
  const [didFail, setDidFail] = useState(false);

  useEffect(() => {
    setDidFail(false);
  }, [iconSrc]);

  if (iconSrc && !didFail) {
    return (
      <div
        className="shrink-0 overflow-hidden rounded-lg bg-surface-high/60 ring-1 ring-white/8"
        style={{ width: px, height: px }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconSrc}
          alt={displayName || bundleID}
          className="block h-full w-full object-contain"
          onLoad={(event) => {
            if (
              event.currentTarget.naturalWidth <= 1 ||
              event.currentTarget.naturalHeight <= 1
            ) {
              setDidFail(true);
            }
          }}
          onError={() => setDidFail(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-lg text-xs font-bold"
      style={{
        width: px,
        height: px,
        backgroundColor: (CATEGORY_COLORS[category] || "#475569") + "20",
        color: CATEGORY_COLORS[category] || "#475569",
      }}
    >
      {(displayName || bundleID).charAt(0)}
    </div>
  );
}
