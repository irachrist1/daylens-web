"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import posthog from "posthog-js";

type BarcodeDetectorCtor = new (options: {
  formats: string[];
}) => {
  detect(source: ImageBitmapSource): Promise<Array<{ rawValue?: string }>>;
};

function LinkPageContent() {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [showManualEntry, setShowManualEntry] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl && /^[0-9a-f]{32}$/i.test(tokenFromUrl)) {
      void submitToken(tokenFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!scanning) {
      stopScanner();
      return;
    }

    const Detector = (
      window as Window & { BarcodeDetector?: BarcodeDetectorCtor }
    ).BarcodeDetector;

    if (!Detector) {
      setScannerError("Camera QR scanning is not supported in this browser yet.");
      setScanning(false);
      setShowManualEntry(true);
      return;
    }

    let cancelled = false;
    const detector = new Detector({ formats: ["qr_code"] });

    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const tick = async () => {
          if (!videoRef.current) return;

          try {
            const barcodes = await detector.detect(videoRef.current);
            const match = barcodes.find((barcode) =>
              typeof barcode.rawValue === "string" &&
              /^[0-9a-f]{32}$/i.test(barcode.rawValue)
            );

            if (match?.rawValue) {
              stopScanner();
              setScanning(false);
              void submitToken(match.rawValue);
              return;
            }
          } catch {
            setScannerError("Unable to read the QR code. Try again in better light.");
          }

          animationRef.current = window.requestAnimationFrame(() => {
            void tick();
          });
        };

        await tick();
      } catch {
        setScannerError("Camera access was denied.");
        setScanning(false);
        setShowManualEntry(true);
      }
    }

    void start();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [scanning]);

  function stopScanner() {
    if (animationRef.current !== null) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;

    await submitToken(token);
  }

  async function submitToken(rawToken: string) {
    const normalizedToken = rawToken.trim().toLowerCase();
    if (!/^[0-9a-f]{32}$/.test(normalizedToken)) {
      setError("Invalid link token. Make sure you copied the full code from your desktop app.");
      return;
    }

    posthog.capture('link_pairing_started')
    setLoading(true);
    setError("");
    setScannerError("");

    try {
      const res = await fetch("/api/link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: normalizedToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to link");
        setLoading(false);
        return;
      }

      posthog.capture('link_pairing_completed')
      router.push("/dashboard");
    } catch {
      setError("Connection failed. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-container to-primary flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-on-primary">D</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-on-surface">
            Daylens Web
          </h1>
          <p className="text-on-surface-variant text-[0.9375rem] leading-relaxed max-w-xs mx-auto">
            View your activity data in the browser. Connect your desktop app to get started.
          </p>
          <a
            href="/api/download/windows"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-br from-primary-container to-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
            </svg>
            Download for Windows
          </a>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <h2 className="text-xs font-semibold tracking-widest uppercase text-on-surface-variant/60 px-1">
            How to connect
          </h2>
          <div className="rounded-2xl bg-surface-low p-5 space-y-5">
            <Step
              number={1}
              title="Open Daylens on your computer"
              description="Go to Settings and find the Web Companion section."
            />
            <div className="border-t border-outline-variant/10" />
            <Step
              number={2}
              title='Click "Connect to Web"'
              description="A QR code and link token will appear in the app."
            />
            <div className="border-t border-outline-variant/10" />
            <Step
              number={3}
              title="Scan or paste the code below"
              description="Point your phone camera at the QR code, or copy-paste the token."
            />
          </div>
        </div>

        {/* Connect Section */}
        <div className="space-y-4">
          {/* Primary: QR scan on mobile */}
          <button
            type="button"
            onClick={() => {
              setScannerError("");
              setScanning((current) => !current);
            }}
            className="w-full rounded-xl bg-gradient-to-br from-primary-container to-primary px-5 py-4 font-semibold text-on-primary transition-transform active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 7V5a2 2 0 012-2h2" />
              <path d="M17 3h2a2 2 0 012 2v2" />
              <path d="M21 17v2a2 2 0 01-2 2h-2" />
              <path d="M7 21H5a2 2 0 01-2-2v-2" />
              <line x1="7" y1="12" x2="17" y2="12" />
            </svg>
            {scanning ? "Stop Camera" : "Scan QR Code"}
          </button>

          {scanning && (
            <div className="rounded-xl overflow-hidden">
              <video
                ref={videoRef}
                className="w-full rounded-xl bg-black/60"
                muted
                playsInline
              />
            </div>
          )}

          {scannerError && (
            <p className="text-xs text-error text-center">{scannerError}</p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-outline-variant/15" />
            <span className="text-xs text-on-surface-variant/50 font-medium">or</span>
            <div className="flex-1 h-px bg-outline-variant/15" />
          </div>

          {/* Secondary: paste token */}
          {!showManualEntry ? (
            <button
              type="button"
              onClick={() => setShowManualEntry(true)}
              className="w-full rounded-xl border border-outline-variant/20 bg-surface-low px-5 py-3.5 text-sm text-on-surface-variant hover:text-on-surface hover:border-outline-variant/30 transition-colors text-center"
            >
              Paste link token manually
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="rounded-xl bg-surface-low p-4 space-y-3">
                <label className="block text-xs font-medium text-on-surface-variant">
                  Link token from your desktop app
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toLowerCase())}
                  placeholder="Paste the code here"
                  maxLength={32}
                  className="w-full rounded-lg bg-surface px-4 py-3 text-center text-base font-mono text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
                  autoFocus
                />
                <p className="text-[0.6875rem] text-on-surface-variant/50 text-center">
                  This is the long code shown in Settings &rarr; Web Companion
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || token.trim().length !== 32}
                className="w-full rounded-xl bg-gradient-to-br from-primary-container to-primary px-5 py-3.5 font-semibold text-on-primary transition-transform active:scale-[0.98] disabled:opacity-40"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Connecting...
                  </span>
                ) : (
                  "Connect"
                )}
              </button>
            </form>
          )}

          {error && (
            <p className="text-center text-sm text-error">{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <a
            href="/recover"
            className="text-xs text-on-surface-variant/60 hover:text-primary transition-colors"
          >
            Already linked before? Restore with recovery phrase
          </a>
        </div>
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center">
        <span className="text-xs font-bold text-primary">{number}</span>
      </div>
      <div className="pt-0.5">
        <p className="text-sm font-medium text-on-surface">{title}</p>
        <p className="text-xs text-on-surface-variant/70 mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function LinkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <LinkPageContent />
    </Suspense>
  );
}
