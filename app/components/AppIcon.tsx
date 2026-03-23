"use client";

import { useEffect, useState } from "react";

import { CATEGORY_COLORS } from "@/app/lib/format";

/** Static icon URLs for well-known macOS/Windows apps (bundle ID → icon URL) */
const KNOWN_APP_ICONS: Record<string, string> = {
  // Browsers
  "com.google.Chrome": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Google_Chrome_icon_%28February_2022%29.svg/120px-Google_Chrome_icon_%28February_2022%29.svg.png",
  "com.apple.Safari": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Safari_browser_logo.svg/120px-Safari_browser_logo.svg.png",
  "company.thebrowser.Browser": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Arc_%28browser%29_logo.svg/120px-Arc_%28browser%29_logo.svg.png",
  "org.mozilla.firefox": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Firefox_logo%2C_2019.svg/120px-Firefox_logo%2C_2019.svg.png",
  "com.brave.Browser": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Brave_icon_lionface.png/120px-Brave_icon_lionface.png",
  "com.microsoft.edgemac": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Microsoft_Edge_logo_%282019%29.svg/120px-Microsoft_Edge_logo_%282019%29.svg.png",
  "com.operasoftware.Opera": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Opera_2015_icon.svg/120px-Opera_2015_icon.svg.png",

  // Development
  "com.microsoft.VSCode": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/120px-Visual_Studio_Code_1.35_icon.svg.png",
  "com.apple.dt.Xcode": "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Xcode_14_icon.png/120px-Xcode_14_icon.png",
  "dev.warp.Warp-Stable": "https://avatars.githubusercontent.com/u/71840468?s=120",
  "com.todesktop.230313mzl4w4u92": "https://cursor.com/apple-touch-icon.png",
  "com.googlecode.iterm2": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/ITerm2_v3.4_icon.png/120px-ITerm2_v3.4_icon.png",

  // Communication
  "com.tinyspeck.slackmacgap": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Slack_icon_2019.svg/120px-Slack_icon_2019.svg.png",
  "us.zoom.xos": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Zoom_Communications_Logo.svg/120px-Zoom_Communications_Logo.svg.png",
  "com.microsoft.teams2": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Microsoft_Office_Teams_%282018%E2%80%93present%29.svg/120px-Microsoft_Office_Teams_%282018%E2%80%93present%29.svg.png",
  "ru.keepcoder.Telegram": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/120px-Telegram_logo.svg.png",
  "com.hnc.Discord": "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a69f118df70ad7828d4_icon_clyde_blurple_RGB.svg",

  // Productivity
  "com.microsoft.Word": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Microsoft_Office_Word_%282019%E2%80%93present%29.svg/120px-Microsoft_Office_Word_%282019%E2%80%93present%29.svg.png",
  "com.microsoft.Excel": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg/120px-Microsoft_Office_Excel_%282019%E2%80%93present%29.svg.png",
  "com.microsoft.Powerpoint": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Microsoft_Office_PowerPoint_%282019%E2%80%93present%29.svg/120px-Microsoft_Office_PowerPoint_%282019%E2%80%93present%29.svg.png",
  "com.microsoft.onenote.mac": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Microsoft_Office_OneNote_%282019%E2%80%93present%29.svg/120px-Microsoft_Office_OneNote_%282019%E2%80%93present%29.svg.png",
  "com.microsoft.Outlook": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg/120px-Microsoft_Office_Outlook_%282018%E2%80%93present%29.svg.png",
  "notion.id": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Notion-logo.svg/120px-Notion-logo.svg.png",
  "com.figma.Desktop": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/120px-Figma-logo.svg.png",

  // Apple system apps
  "com.apple.finder": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Finder_Icon_macOS_Big_Sur.png/120px-Finder_Icon_macOS_Big_Sur.png",
  "com.apple.mail": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Mail_%28iOS%29.svg/120px-Mail_%28iOS%29.svg.png",
  "com.apple.Notes": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Notes_%28iOS%29.svg/120px-Notes_%28iOS%29.svg.png",
  "com.apple.AppStore": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/App_Store_%28iOS%29.svg/120px-App_Store_%28iOS%29.svg.png",
  "com.apple.Terminal": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Terminalicon2.png/120px-Terminalicon2.png",
  "com.apple.MobileSMS": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/IMessage_logo.svg/120px-IMessage_logo.svg.png",
  "com.apple.Preview": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Preview_%28macOS%29.png/120px-Preview_%28macOS%29.png",
  "com.apple.systempreferences": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/System_Preferences_%28macOS_Ventura%29.png/120px-System_Preferences_%28macOS_Ventura%29.png",
  "com.apple.Music": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Apple_Music_logo.svg/120px-Apple_Music_logo.svg.png",

  // Media & entertainment
  "com.spotify.client": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/120px-Spotify_icon.svg.png",

  // AI tools
  "com.openai.chat": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/ChatGPT_logo.svg/120px-ChatGPT_logo.svg.png",
};

/** Try appKey as display-name match (e.g. "arc" → find by partial match) */
const DISPLAY_NAME_ICONS: Record<string, string> = {
  "arc": KNOWN_APP_ICONS["company.thebrowser.Browser"]!,
  "chrome": KNOWN_APP_ICONS["com.google.Chrome"]!,
  "safari": KNOWN_APP_ICONS["com.apple.Safari"]!,
  "firefox": KNOWN_APP_ICONS["org.mozilla.firefox"]!,
  "vscode": KNOWN_APP_ICONS["com.microsoft.VSCode"]!,
  "visual studio code": KNOWN_APP_ICONS["com.microsoft.VSCode"]!,
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
  "microsoft word": KNOWN_APP_ICONS["com.microsoft.Word"]!,
  "app store": KNOWN_APP_ICONS["com.apple.AppStore"]!,
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
