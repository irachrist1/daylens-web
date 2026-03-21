"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RecoverPage() {
  const [mnemonic, setMnemonic] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const wordCount = mnemonic.trim().split(/\s+/).filter(Boolean).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (wordCount !== 12) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mnemonic: mnemonic.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Recovery failed");
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
            Recover
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Enter your 12-word recovery phrase to restore access
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <textarea
              value={mnemonic}
              onChange={(e) => setMnemonic(e.target.value.toLowerCase())}
              placeholder="Enter your 12-word recovery phrase..."
              rows={4}
              className="w-full rounded-lg bg-surface-low px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container resize-none"
              autoFocus
            />
            <p className="mt-1 text-xs text-on-surface-variant/60 text-right">
              {wordCount}/12 words
            </p>
          </div>

          {error && (
            <p className="text-center text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || wordCount !== 12}
            className="w-full rounded-lg bg-gradient-to-br from-primary-container to-primary px-4 py-3 font-semibold text-on-primary transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {loading ? "Recovering..." : "Restore Workspace"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-on-surface-variant hover:text-primary transition-colors"
          >
            Have a link code instead? Go back
          </Link>
        </div>
      </div>
    </div>
  );
}
