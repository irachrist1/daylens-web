import { redirect } from "next/navigation";
import { LandingClient } from "./components/LandingClient";
import { EasterEggs } from "./components/EasterEggs";

export const metadata = {
  title: "Daylens — You have no idea where your day went. We do.",
  description:
    "Daylens watches the apps and websites you use, keeps the raw history on your device, and turns it into timeline recall, focus coaching, and grounded AI help. Free for Mac and Windows.",
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  // If a ?token= param arrives on the root (from old QR codes), forward to /link
  if (params.token && /^[0-9a-f]{32}$/i.test(params.token)) {
    redirect(`/link?token=${params.token}`);
  }
  return (
    <>
      {/* hey, you're looking at the source. we respect that. here's a secret: the app is even more interesting. → daylens.app */}
      <LandingClient />
      <EasterEggs />
    </>
  );
}
