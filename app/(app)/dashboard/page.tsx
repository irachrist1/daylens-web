import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/");

  return <DashboardClient />;
}
