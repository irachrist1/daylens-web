import { NextResponse } from "next/server";

const REPO = "irachrist1/daylens-windows";
const FALLBACK_URL = `https://github.com/${REPO}/releases/latest`;

export async function GET() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO}/releases/latest`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "User-Agent": "daylens-web",
        },
        // Cache the GitHub API response for 5 minutes so we don't hammer the rate limit
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      return NextResponse.redirect(FALLBACK_URL);
    }

    const release = await res.json() as {
      assets: Array<{ name: string; browser_download_url: string }>;
    };

    // Find the Setup installer (.exe but not a checksum)
    const asset =
      release.assets.find((a) => a.name.match(/Setup\.exe$/i)) ??
      release.assets.find((a) => a.name.endsWith(".exe"));

    if (!asset) {
      return NextResponse.redirect(FALLBACK_URL);
    }

    return NextResponse.redirect(asset.browser_download_url);
  } catch {
    return NextResponse.redirect(FALLBACK_URL);
  }
}
