"use client";

import { CATEGORY_COLORS } from "@/app/lib/format";

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

  if (iconBase64) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={`data:image/png;base64,${iconBase64}`}
        alt={displayName || bundleID}
        className="rounded-lg"
        style={{ width: px, height: px }}
      />
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
      {(displayName || bundleID).charAt(0)}
    </div>
  );
}
