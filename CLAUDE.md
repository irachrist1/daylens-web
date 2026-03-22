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

## Do NOT

- Expose raw Convex error messages to users
- Use server components for pages that depend on the user's local date/timezone
- Modify the session JWT signing/verification logic without understanding the full auth flow
- Change `CONVEX_DEPLOYMENT` or `NEXT_PUBLIC_CONVEX_URL` without coordinating with all three repos
