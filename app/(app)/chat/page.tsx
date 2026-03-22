import { redirect } from "next/navigation";
import { GlobalChat } from "@/app/components/GlobalChat";
import { getSession } from "@/app/lib/session";

export default async function ChatPage() {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5 sm:gap-6 px-4 sm:px-6 py-6 sm:py-8">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">
          Daylens AI
        </p>
        <h1 className="text-3xl font-bold text-on-surface">Global chat</h1>
        <p className="max-w-2xl text-sm text-on-surface-variant">
          Ask about a specific day, compare weeks, search what you watched or
          read, and keep the conversation going across follow-up questions.
        </p>
      </div>

      <GlobalChat initialMessages={[]} />
    </div>
  );
}
