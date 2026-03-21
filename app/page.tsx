"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LinkPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to link");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Connection failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-primary">
            Daylens
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter the link code from your Mac to connect
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-character code"
              maxLength={6}
              className="w-full rounded-lg bg-surface-low px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.3em] text-on-surface placeholder:text-on-surface-variant/30 placeholder:text-base placeholder:tracking-normal placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary-container"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-center text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || code.length < 6}
            className="w-full rounded-lg bg-gradient-to-br from-primary-container to-primary px-4 py-3 font-semibold text-on-primary transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {loading ? "Connecting..." : "Connect"}
          </button>
        </form>

        <div className="text-center">
          <a
            href="/recover"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            Have a recovery phrase? Restore workspace
          </a>
        </div>
      </div>
    </div>
  );
}
