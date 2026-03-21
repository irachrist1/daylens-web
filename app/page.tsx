"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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
      setError("A full 32-character link token is required.");
      return;
    }

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
            Scan the QR code from your Mac, or paste the full link token.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-2xl bg-surface-low p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-on-surface">
                QR Scanner
              </p>
              <button
                type="button"
                onClick={() => {
                  setScannerError("");
                  setScanning((current) => !current);
                }}
                className="rounded-lg border border-outline-variant/20 px-3 py-1.5 text-xs text-primary hover:bg-primary/5 transition-colors"
              >
                {scanning ? "Stop Camera" : "Use Camera"}
              </button>
            </div>

            {scanning && (
              <video
                ref={videoRef}
                className="w-full rounded-xl bg-black/60"
                muted
                playsInline
              />
            )}

            {scannerError && (
              <p className="text-xs text-error">{scannerError}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value.toLowerCase())}
              placeholder="Paste full 32-character token"
              maxLength={32}
              className="w-full rounded-lg bg-surface-low px-4 py-3 text-center text-lg font-mono text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:ring-2 focus:ring-primary-container"
              autoFocus
            />
            <p className="mt-2 text-xs text-on-surface-variant/70">
              The 8-character reference code on your Mac is only for confirmation.
            </p>
          </div>

          {error && (
            <p className="text-center text-sm text-error">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || token.trim().length !== 32}
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

export default function LinkPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface" />}>
      <LinkPageContent />
    </Suspense>
  );
}
