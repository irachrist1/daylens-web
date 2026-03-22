import { redirect } from "next/navigation";
import { GlobalChat } from "@/app/components/GlobalChat";
import { getSession } from "@/app/lib/session";

export default async function ChatPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string | string[] }>;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const resolvedSearchParams = await searchParams;
  const dateParam = resolvedSearchParams?.date;
  const date =
    typeof dateParam === "string"
      ? dateParam
      : Array.isArray(dateParam)
        ? dateParam[0]
        : undefined;

  return (
    <div className="mx-auto flex max-w-2xl flex-col px-4 sm:px-6 py-4 sm:py-6">
      <GlobalChat initialMessages={[]} date={date} />
    </div>
  );
}
