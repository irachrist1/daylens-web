import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { HistoryClient } from "./HistoryClient";

export default async function HistoryPage() {
  const session = await getSession();
  if (!session) redirect("/");

  return <HistoryClient />;
}
