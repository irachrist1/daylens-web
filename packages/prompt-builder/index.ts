/**
 * Prompt builder for Daylens AI — mirrors AIPromptBuilder.swift exactly.
 * Same system prompt, same section headers, same semantic labels.
 */

import type { DaySnapshot } from "../snapshot-schema/snapshot";

// ─── System prompt (identical to macOS) ──────────────────────────────

export const SYSTEM_PROMPT = `You are Daylens, a personal activity analyst for macOS. You analyze the user's \
computer usage data and provide helpful, grounded insights.

Rules:
- Only reference data that is explicitly provided in the context
- Never invent or hallucinate usage data
- If you don't have enough data to answer a question, say so clearly
- Be concise and helpful — write like a thoughtful personal analyst, not a chatbot
- Use specific numbers (durations, counts) when available
- When describing patterns, cite the evidence
- Format durations as "Xh Ym" (e.g., "2h 15m")
- Be honest about data confidence levels when mentioned
- Prefer supported category-level patterns (Development, AI Tools, Writing, Productivity) over repeating raw app names
- Treat semantic labels as deterministic app-purpose hints, not proof of the exact task the user performed
- Never turn estimated browser timing into exact unsupported claims
- When website timing is estimated, use wording like "about", "roughly", or "estimated"
- You may compare across days only when those comparison days are explicitly present in the context
- Browser time on focused domains (AI tools, development sites, research, writing tools) counts as productive focused work — treat it accordingly
- Apps or sites marked "user override" have been explicitly categorized by the user and should be treated as authoritative
- When the user asks what information would help you, tell them: app category overrides for uncategorized apps, their goals for the day, and what specific apps like terminals or custom tools mean in their workflow`;

// ─── Category labels (matching macOS AppCategory raw values) ─────────

const CATEGORY_LABELS: Record<string, string> = {
  development: "Development",
  communication: "Communication",
  research: "Research",
  writing: "Writing",
  aiTools: "AI Tools",
  design: "Design",
  browsing: "Browsing",
  meetings: "Meetings",
  entertainment: "Entertainment",
  email: "Email",
  productivity: "Productivity",
  social: "Social",
  system: "System",
  uncategorized: "Uncategorized",
};

const FOCUSED_CATEGORIES = new Set([
  "development",
  "writing",
  "design",
  "research",
  "aiTools",
]);

// ─── Context builder ────────────────────────────────────────────────

export function buildDayContext(snapshot: DaySnapshot): string {
  const dateParts = snapshot.date.split("-");
  const dateObj = new Date(
    parseInt(dateParts[0]),
    parseInt(dateParts[1]) - 1,
    parseInt(dateParts[2])
  );
  const dateStr = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let context = `## Activity Data for ${dateStr}\n\n`;

  // Data notes
  context += "### Data Notes\n";
  context +=
    "- Main summaries exclude known system/session noise such as loginwindow, lock/unlock artifacts, and near-zero session-management churn.\n";
  context +=
    "- Website durations marked [estimated] are grounded in browser evidence but may be approximate when active-tab timing is incomplete.\n\n";

  // Overview
  const totalSeconds = snapshot.categoryTotals.reduce(
    (sum, c) => sum + c.totalSeconds,
    0
  );
  context += "### Overview\n";
  context += `- Total active time: ${formatDuration(totalSeconds)}\n`;
  context += `- Apps used: ${snapshot.appSummaries.length}\n`;
  context += `- Websites visited: ${snapshot.topDomains.length}\n`;
  context += `- Focus score: ${snapshot.focusScore}%\n`;
  context += `- Focus time: ${formatDuration(snapshot.focusSeconds)}\n\n`;

  // Category breakdown
  if (snapshot.categoryTotals.length > 0) {
    context += "### Category Breakdown\n";
    snapshot.categoryTotals.forEach((cat, i) => {
      const label = CATEGORY_LABELS[cat.category] || cat.category;
      const apps = snapshot.appSummaries
        .filter((a) => a.category === cat.category)
        .slice(0, 3)
        .map((a) => a.displayName);
      const topApps = apps.length > 0 ? ` | top apps: ${apps.join(", ")}` : "";
      context += `${i + 1}. ${label} — ${formatDuration(cat.totalSeconds)}${topApps}\n`;
    });
    context += "\n";
  }

  // Top apps
  if (snapshot.appSummaries.length > 0) {
    context += "### Top Apps\n";
    snapshot.appSummaries.slice(0, 10).forEach((app, i) => {
      const overrideNote =
        snapshot.categoryOverrides[app.appKey] !== undefined
          ? " [user override]"
          : "";
      const label = CATEGORY_LABELS[app.category] || app.category;
      context += `${i + 1}. ${app.displayName} — ${formatDuration(app.totalSeconds)} | category: ${label}${overrideNote} | sessions: ${app.sessionCount}\n`;
    });
    context += "\n";
  }

  // Focused browser time
  const focusedDomains = snapshot.topDomains.filter((d) =>
    FOCUSED_CATEGORIES.has(d.category)
  );
  if (focusedDomains.length > 0) {
    const focusedWebTime = focusedDomains.reduce(
      (sum, d) => sum + d.seconds,
      0
    );
    context += "### Focused Browser Time\n";
    context += `- Productive websites (research, AI tools, development, writing): ${formatDuration(focusedWebTime)}\n`;
    context += `- Top focused sites: ${focusedDomains
      .slice(0, 5)
      .map((d) => d.domain)
      .join(", ")}\n\n`;
  }

  // Top websites
  if (snapshot.topDomains.length > 0) {
    context += "### Top Websites\n";
    snapshot.topDomains.slice(0, 10).forEach((site, i) => {
      const label = CATEGORY_LABELS[site.category] || site.category;
      context += `${i + 1}. ${site.domain} — ${formatDuration(site.seconds)} | type: ${label}\n`;
    });
    context += "\n";
  }

  // Focus sessions
  if (snapshot.focusSessions.length > 0) {
    context += "### Focus Sessions\n";
    snapshot.focusSessions.forEach((session) => {
      const start = new Date(session.startAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const end = new Date(session.endAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
      context += `- ${start}–${end}: ${formatDuration(session.actualDurationSec)} (target: ${session.targetMinutes}m, ${session.status})\n`;
    });
    context += "\n";
  }

  return context;
}

// ─── Prompt templates (matching macOS exactly) ──────────────────────

export function dailySummaryPrompt(activityContext: string): string {
  return `Based on the following activity data, write a concise daily summary. \
Highlight key patterns, the most-used categories, apps, and websites, and whether \
the day was focused or fragmented. Keep it under 200 words. \
Write plain flowing prose — short paragraphs only. \
Do not use markdown headings, bold markers, bullet lists, or tables.

${activityContext}`;
}

export function questionPrompt(
  question: string,
  activityContext: string
): string {
  return `The user is asking about their activity. Answer based on the data below. \
If the data doesn't contain enough information to answer, say so. \
When supported by the evidence, synthesize across categories before listing apps.

${activityContext}

User question: ${question}`;
}

// ─── Helpers ────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}
