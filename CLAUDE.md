@AGENTS.md

# Daylens Web — AI Working Notes

This is the web companion for Daylens. It is a **read-only dashboard** — it never collects or writes activity data. All data comes from the desktop apps via Convex.

## Quick orientation

- **Stack**: Next.js 16, React 19, Tailwind CSS, Convex backend
- **Deploy**: Vercel (push to `main` auto-deploys)
- **Convex**: `decisive-aardvark-847.convex.cloud` — shared with macOS and Windows apps
- **All development happens on `main`** — no long-lived feature branches

## Key architecture decisions

- **Client components for date-sensitive pages**: Dashboard and History are client components that compute local dates with `new Date().toLocaleDateString("en-CA")`. Server components would use UTC and show the wrong day.
- **Chat API dual format**: `/api/chat` accepts both `{ messages: [...] }` (from GlobalChat) and `{ question, date }` (legacy). The route extracts the last user message from the messages array.
- **Error sanitization**: Chat errors are classified and mapped to safe user-facing messages. Technical details (Convex internals, API key errors) are never exposed to the client.
- **AppIcon component**: Maps macOS bundle IDs to icon URLs for ~25 common apps, with category-colored letter fallback.
- **Session auth**: ES256 JWT in `daylens_session` HttpOnly cookie. Middleware verifies signature on all `/app/*` routes.

## Design tokens

Uses Material Design 3 semantic color tokens via CSS custom properties:
- `bg-surface`, `bg-surface-low`, `bg-surface-high`
- `text-on-surface`, `text-on-surface-variant`
- `bg-primary`, `text-on-primary`
- `text-success`, `text-warning`, `text-error`
- Cards use `rounded-2xl bg-surface-low`
- Responsive padding: `p-4 sm:p-6` on cards, `px-4 sm:px-6` on containers

## Convex backend

See `convex/_generated/ai/guidelines.md` for Convex-specific patterns.

Key files:
- `convex/schema.ts` — full database schema
- `convex/http.ts` — HTTP endpoints (uploadSnapshot, createWorkspace, etc.)
- `convex/ai.ts` — AI chat action (decrypts API key, calls Claude, saves to web_chats)
- `convex/keys.ts` — AES-256-GCM encryption for API keys with HKDF key derivation
- `convex/snapshots.ts` — snapshot storage with multi-device merging

## Deployment — READ BEFORE TOUCHING ROUTING

The app is served at `christian-tonny.dev/daylens` via a proxy chain. Do NOT change routing without understanding this.

**Chain:** `christian-tonny.dev/daylens` → portfolio `vercel.json` rewrite → `daylens-web-irachrist1s-projects.vercel.app/daylens` → Next.js serves the page.

**Rules:**
- `basePath: "/daylens"` is set in `next.config.ts` — all routes are prefixed. Raw `<a href="/api/...">` tags must use `/daylens/api/...`, NOT `/api/...` (browser resolves from domain root, bypassing basePath). Use Next.js `<Link>` or hardcode the prefix.
- The portfolio `vercel.json` (at `/Users/christiantonny/Dev/portfolio/vercel.json`) owns the proxy rewrites. Both repos must be deployed for routing changes to take effect.
- `daylens-web.vercel.app` is a manually added alias that redirects to `christian-tonny.dev/daylens`.
- **Vercel Deployment Protection (SSO) must stay OFF** on the daylens-web project (`prj_14YMHN8dwFx2J1SUNTmA77wzbbYW`). If it gets re-enabled, every visitor sees a Vercel sign-in page. Disable via: Vercel dashboard → daylens-web → Settings → Deployment Protection → off. Or via API: `PATCH https://api.vercel.com/v9/projects/prj_14YMHN8dwFx2J1SUNTmA77wzbbYW?teamId=irachrist1s-projects` with `{"ssoProtection": null}`.

## Do NOT

- Expose raw Convex error messages to users
- Use server components for pages that depend on the user's local date/timezone
- Modify the session JWT signing/verification logic without understanding the full auth flow
- Change `CONVEX_DEPLOYMENT` or `NEXT_PUBLIC_CONVEX_URL` without coordinating with all three repos
- Use `<a href="/api/...">` without the `/daylens` prefix — downloads and API links will 404
