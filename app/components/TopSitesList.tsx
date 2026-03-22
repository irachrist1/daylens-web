"use client";

import { useState } from "react";
import { CATEGORY_LABELS, formatDuration } from "@/app/lib/format";

export interface TopPageItem {
  url: string;
  title?: string | null;
  seconds: number;
}

export interface TopDomainItem {
  domain: string;
  seconds: number;
  category: string;
  topPages?: TopPageItem[];
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

function pageLabel(page: TopPageItem) {
  if (page.title?.trim()) {
    return page.title.trim();
  }

  try {
    const url = new URL(page.url);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return page.url;
  }
}

function pageMeta(page: TopPageItem) {
  try {
    const url = new URL(page.url);
    return `${url.hostname}${url.pathname === "/" ? "" : url.pathname}`;
  } catch {
    return page.url;
  }
}

export function TopSitesList({
  domains,
  showCategory = false,
}: {
  domains: TopDomainItem[];
  showCategory?: boolean;
}) {
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {domains.map((domain) => {
        const hasPages = (domain.topPages?.length ?? 0) > 0;
        const isExpanded = expandedDomain === domain.domain;
        const summaryContent = (
          <>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm">{domain.domain}</span>
                {showCategory ? (
                  <span className="text-[0.6875rem] text-on-surface-variant">
                    {CATEGORY_LABELS[domain.category] || domain.category}
                  </span>
                ) : null}
              </div>
              {hasPages ? (
                <p className="text-[0.6875rem] text-on-surface-variant">
                  {domain.topPages!.length} page
                  {domain.topPages!.length === 1 ? "" : "s"}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-on-surface-variant">
                {formatDuration(domain.seconds)}
              </span>
              {hasPages ? (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`text-on-surface-variant transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <path d="M7 10l5 5 5-5z" />
                </svg>
              ) : null}
            </div>
          </>
        );

        return (
          <div key={domain.domain} className="space-y-2">
            {hasPages ? (
              <button
                type="button"
                aria-expanded={isExpanded}
                onClick={() =>
                  setExpandedDomain(hasPages && !isExpanded ? domain.domain : null)
                }
                className="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
              >
                {summaryContent}
              </button>
            ) : (
              <div className="flex w-full items-center justify-between gap-3 text-left">
                {summaryContent}
              </div>
            )}

            {hasPages && isExpanded ? (
              <div className="space-y-2 rounded-xl bg-surface-high/40 p-3">
                {domain.topPages!.map((page) => (
                  isSafeUrl(page.url) ? (
                    <a
                      key={`${domain.domain}-${page.url}`}
                      href={page.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-start justify-between gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-high/60"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-on-surface">
                          {pageLabel(page)}
                        </p>
                        <p className="truncate text-[0.6875rem] text-on-surface-variant">
                          {pageMeta(page)}
                        </p>
                      </div>
                      <span className="shrink-0 text-[0.6875rem] font-medium text-on-surface-variant">
                        {formatDuration(page.seconds)}
                      </span>
                    </a>
                  ) : (
                    <div
                      key={`${domain.domain}-${page.url}`}
                      className="flex items-start justify-between gap-3 rounded-lg px-2 py-1.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-on-surface">
                          {pageLabel(page)}
                        </p>
                        <p className="truncate text-[0.6875rem] text-on-surface-variant">
                          {pageMeta(page)}
                        </p>
                      </div>
                      <span className="shrink-0 text-[0.6875rem] font-medium text-on-surface-variant">
                        {formatDuration(page.seconds)}
                      </span>
                    </div>
                  )
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
