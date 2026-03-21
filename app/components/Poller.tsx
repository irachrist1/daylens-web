"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Client component that polls for fresh data every 30 seconds. */
export function Poller() {
  const router = useRouter();

  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    };

    const interval = setInterval(() => {
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, 30_000);

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [router]);

  return null;
}
