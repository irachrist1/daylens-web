import { ChangelogPageClient } from "../components/ChangelogPageClient";

export const metadata = {
  title: "Changelog — Daylens",
  description:
    "A product journal for what shipped across Daylens for macOS, Windows, and the web companion.",
};

export default function ChangelogPage() {
  return <ChangelogPageClient />;
}
