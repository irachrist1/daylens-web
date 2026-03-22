"use client";

import { useEffect, useState } from "react";

import { CATEGORY_COLORS } from "@/app/lib/format";

function resolveIconSrc(iconBase64?: string | null) {
  const trimmed = iconBase64?.trim();
  if (!trimmed) {
    return null;
  }

  return trimmed.startsWith("data:image/")
    ? trimmed
    : `data:image/png;base64,${trimmed}`;
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
  const iconSrc = resolveIconSrc(iconBase64);
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
