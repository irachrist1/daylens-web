import { redirect } from "next/navigation";
import { LandingClient } from "./components/LandingClient";

export const metadata = {
  title: "Daylens — Know where your time goes",
  description:
    "Daylens watches the apps and websites you use — privately, locally — and turns raw screen time into clarity you can act on. Free for Mac and Windows.",
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
  return <LandingClient />;
}
