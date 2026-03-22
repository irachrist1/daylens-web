"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/app/lib/chat";

const SUGGESTED_QUERIES = [
  "How many hours did I work this week?",
  "What YouTube videos did I watch today?",
  "What websites did I visit most this month?",
  "Compare my focus score this week vs last week",
  "What apps did I use for more than 2 hours today?",
];

export function GlobalChat({
  initialMessages,
}: {
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);
  const didHydrateRef = useRef(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    if (!didHydrateRef.current) {
      didHydrateRef.current = true;
      return;
    }

    const timeout = window.setTimeout(() => {
      void fetch("/api/chat/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
    }, 5000);

    return () => window.clearTimeout(timeout);
  }, [messages]);

  async function sendMessage(content: string) {
    if (!content.trim() || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      content: content.trim(),
      timestamp: new Date().toISOString(),
    };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const data = await response.json();

      if (!response.ok || typeof data.response !== "string") {
        throw new Error(data.error || "Something went wrong.");
      }

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
          toolsUsed: Array.isArray(data.toolsUsed)
            ? data.toolsUsed.filter(
                (tool: unknown): tool is string => typeof tool === "string"
              )
            : undefined,
        },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Failed to reach Daylens AI. Try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl bg-surface-low p-4 md:p-6 shadow-sm">
      <div className="flex h-[calc(100vh-14rem)] min-h-[32rem] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto pr-1">
          {messages.length === 0 ? (
            <div className="space-y-5 rounded-2xl border border-outline-variant/15 bg-surface-lowest/50 p-5">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-on-surface">
                  Ask across any day
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Daylens AI can pull a specific day, compare date ranges, search
                  your visit history, and look up unfamiliar apps or sites.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_QUERIES.map((query) => (
                  <button
                    key={query}
                    type="button"
                    onClick={() => void sendMessage(query)}
                    className="rounded-full bg-primary/10 px-4 py-2 text-sm text-primary transition-colors hover:bg-primary/15"
                    disabled={loading}
                  >
                    {query}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${message.timestamp ?? index}-${index}`}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[90%] rounded-3xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-on-primary"
                    : "bg-surface-high text-on-surface"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </p>
                <div className="mt-2 flex items-center justify-between gap-3 text-[0.6875rem]">
                  <span
                    className={
                      message.role === "user"
                        ? "text-on-primary/70"
                        : "text-on-surface-variant"
                    }
                  >
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
                {message.role === "assistant" && message.toolsUsed?.length ? (
                  <details className="mt-3 rounded-2xl bg-surface-lowest/60 px-3 py-2 text-xs text-on-surface-variant">
                    <summary className="cursor-pointer select-none">
                      Tools used
                    </summary>
                    <div className="mt-2 space-y-1">
                      {message.toolsUsed.map((tool) => (
                        <p key={tool}>{tool}</p>
                      ))}
                    </div>
                  </details>
                ) : null}
              </div>
            </div>
          ))}

          {loading ? (
            <div className="flex justify-start">
              <div className="rounded-3xl bg-surface-high px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.15s]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:0.3s]" />
                </div>
              </div>
            </div>
          ) : null}

          <div ref={endRef} />
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            void sendMessage(input);
          }}
          className="mt-4 flex items-end gap-3 border-t border-outline-variant/10 pt-4"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about any date, website, or pattern in your history..."
            className="min-h-[3.25rem] flex-1 resize-none rounded-2xl bg-surface-lowest px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={loading}
            rows={2}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-2xl bg-primary px-5 py-3 text-sm font-medium text-on-primary transition-opacity disabled:opacity-40"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

function formatTimestamp(timestamp?: string) {
  if (!timestamp) {
    return "Saved message";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "Saved message";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
