# Deploying to Cloudflare Pages

## What was fixed
The original project used `@lovable.dev/vite-tanstack-config` — a private Lovable wrapper
that Cloudflare's tooling can't parse (it has no standard `plugins: []` array).

This version replaces it with a standard Vite + TanStack Start config targeting Cloudflare Pages.

## Prerequisites
- Node.js 18+ or Bun
- Wrangler CLI: `npm install -g wrangler`
- A Cloudflare account

## Local Development

```bash
# Install dependencies
bun install   # or: npm install

# Start dev server
bun run dev   # or: npm run dev
```

## Deploy to Cloudflare Pages

### Option A: Git-connected (recommended)
1. Push this project to GitHub/GitLab
2. In Cloudflare Dashboard → Pages → Create application → Connect to Git
3. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `.output/public`
4. Set environment variables (see below)
5. Deploy

### Option B: CLI deploy
```bash
bun run build
wrangler pages deploy .output/public --project-name run-it-simply
```

## Environment Variables

Set these in Cloudflare Pages → Settings → Environment Variables:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase → Project Settings → API |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API → anon/public key |
| `SUPABASE_URL` | Same as above (used server-side) |
| `SUPABASE_PUBLISHABLE_KEY` | Same as above (used server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → service_role key (**secret!**) |

> ⚠️ Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client. It is only used in server functions.

## Project Structure

```
src/
  routes/          # TanStack Start file-based routes
  components/      # UI components (shadcn/ui)
  integrations/
    supabase/      # Supabase client (browser + server)
  lib/             # Utilities
  server.ts        # Cloudflare Worker entry point
  start.ts         # TanStack Start instance
vite.config.ts     # Standard Vite config (Cloudflare Pages target)
wrangler.toml      # Cloudflare deployment config
```
