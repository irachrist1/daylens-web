"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/app/lib/chat";

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
    <div className="flex h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] min-h-[24rem] flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <p className="text-sm text-on-surface-variant/60">
              Ask anything about your activity
            </p>
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
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                message.role === "user"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-high text-on-surface"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </p>
              {message.role === "assistant" && message.toolsUsed?.length ? (
                <details className="mt-2 rounded-xl bg-surface-lowest/60 px-3 py-2 text-xs text-on-surface-variant">
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
            <div className="rounded-2xl bg-surface-high px-4 py-2.5">
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
        className="mt-3 flex items-end gap-2 border-t border-outline-variant/10 pt-3"
      >
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void sendMessage(input);
            }
          }}
          placeholder="Ask about your day..."
          className="min-h-[2.75rem] flex-1 resize-none rounded-xl bg-surface-low px-3 py-2.5 text-sm text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
          disabled={loading}
          rows={1}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-on-primary transition-opacity disabled:opacity-40"
        >
          Send
        </button>
      </form>
    </div>
  );
}
