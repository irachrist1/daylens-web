'use client'

import posthog from 'posthog-js'

export function DownloadButtons() {
  return (
    <div
      style={{
        display: "flex",
        gap: 12,
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: 20,
      }}
    >
      <a
        href="/api/download/mac"
        onClick={() => posthog.capture('download_clicked', { platform: 'mac' })}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "13px 24px",
          borderRadius: 10,
          background: "linear-gradient(180deg, #68AEFF 0%, #003EB7 100%)",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          transition: "opacity 200ms",
        }}
      >
        <AppleIcon />
        Download for Mac
      </a>
      <a
        href="/api/download/windows"
        onClick={() => posthog.capture('download_clicked', { platform: 'windows' })}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "13px 24px",
          borderRadius: 10,
          background: "linear-gradient(180deg, #68AEFF 0%, #003EB7 100%)",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          textDecoration: "none",
          transition: "opacity 200ms",
        }}
      >
        <WindowsIcon />
        Download for Windows
      </a>
    </div>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M11.182 3.236c.615-.74 1.03-1.77.916-2.8-.885.036-1.956.59-2.59 1.33-.57.66-1.07 1.72-.935 2.73.985.076 1.994-.5 2.61-1.26zM11.9 4.85c-1.44-.083-2.665.817-3.35.817-.685 0-1.73-.78-2.862-.76-1.47.022-2.835.854-3.588 2.176-1.535 2.65-.4 6.58 1.088 8.734.734 1.067 1.606 2.256 2.758 2.213 1.1-.044 1.516-.71 2.842-.71 1.326 0 1.698.71 2.853.688 1.196-.022 1.946-1.088 2.68-2.155.842-1.23 1.187-2.427 1.208-2.49-.022-.022-2.32-.897-2.342-3.542-.022-2.21 1.803-3.278 1.887-3.322-1.033-1.523-2.635-1.693-3.174-1.65z" />
    </svg>
  )
}

function WindowsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
      <path d="M0 2.357L6.545 1.5v6H0V2.357zM7.273 1.393L16 0v7.5H7.273V1.393zM0 8.5h6.545v6L0 13.643V8.5zM7.273 8.5H16V16l-8.727-1.393V8.5z" />
    </svg>
  )
}
