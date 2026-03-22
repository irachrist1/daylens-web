/**
 * DaySnapshot schema v1 — locked contract.
 * Do not change field names or types without updating all three apps.
 */

export type Platform = "macos" | "windows";

export type Category =
  | "development"
  | "communication"
  | "research"
  | "writing"
  | "aiTools"
  | "design"
  | "browsing"
  | "meetings"
  | "entertainment"
  | "email"
  | "productivity"
  | "social"
  | "system"
  | "uncategorized";

export type FocusSessionStatus = "completed" | "cancelled" | "active";

export interface AppSummary {
  appKey: string;
  bundleID?: string; // Full macOS bundle ID (e.g. "com.google.Chrome"), added in v1.0.7
  displayName: string;
  category: Category;
  totalSeconds: number;
  sessionCount: number;
}

export interface CategoryTotal {
  category: Category;
  totalSeconds: number;
}

export interface TimelineEntry {
  appKey: string;
  startAt: string; // ISO8601 with offset
  endAt: string;   // ISO8601 with offset
}

export interface TopDomain {
  domain: string;
  seconds: number;
  category: Category;
}

export interface FocusSession {
  sourceId: string;
  startAt: string;  // ISO8601 with offset
  endAt: string;    // ISO8601 with offset
  actualDurationSec: number;
  targetMinutes: number;
  status: FocusSessionStatus;
}

export interface DaySnapshot {
  schemaVersion: 1;
  deviceId: string;
  platform: Platform;
  date: string; // YYYY-MM-DD
  generatedAt: string; // ISO8601 with offset
  isPartialDay: boolean;
  focusScore: number; // 0–100 integer
  focusSeconds: number;
  appSummaries: AppSummary[];
  categoryTotals: CategoryTotal[];
  timeline: TimelineEntry[];
  topDomains: TopDomain[];
  categoryOverrides: Record<string, Category>;
  aiSummary: string | null;
  focusSessions: FocusSession[];
}

/** Focus score formula — identical on both platforms. */
export function computeFocusScore(
  focusedSeconds: number,
  totalTrackedSeconds: number,
  switchesPerHour: number,
): number {
  if (totalTrackedSeconds === 0) return 0;
  const focusedRatio = focusedSeconds / totalTrackedSeconds;
  const penalty = Math.min(switchesPerHour / 300, 0.15);
  return Math.round(100 * focusedRatio * (1 - penalty));
}

/** Categories considered "focused" for the focus score. */
export const FOCUSED_CATEGORIES: ReadonlySet<Category> = new Set([
  "development",
  "writing",
  "design",
  "research",
  "aiTools",
]);
