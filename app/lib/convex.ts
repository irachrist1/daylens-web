import { ConvexHttpClient } from "convex/browser";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

/** Server-side Convex client for use in Server Components and API routes. */
export function getConvexClient() {
  return new ConvexHttpClient(CONVEX_URL);
}
