# Ojha Agent — Cloudflare Pages starter

**Made by Shivam Ojha**

A responsive, installable PWA-style AI workspace with an animated avatar, Gemini chat backend, browser voice input, downloadable text/code files, quick web actions, and optional Cloudflare D1 memory.

## Important reality check
This is a working web app foundation, not an unrestricted operating-system agent. A normal website cannot create arbitrary folders on a phone/laptop, press system-wide shortcut keys, control desktop apps, place a permanent floating system button, make phone calls, or force Chrome to open instead of the device's configured browser. Browsers deliberately restrict those powers. The included “shortcut” is an in-page keyboard shortcut (`Ctrl/Cmd+Shift+O`) and the PWA install option adds an app icon where supported. YouTube opens in a new browser tab. Voice input depends on browser support. Video playback occurs on supported video websites, not inside a universal remote-control player.

To do full desktop automation, you would need a separately installed native companion app (with explicit OS permissions); mobile OS restrictions differ between Android and iOS. Do not enter sensitive information into an experimental agent.

## Deploy to Cloudflare Pages
1. Extract this ZIP.
2. In Cloudflare Dashboard, open **Workers & Pages → Create → Pages → Upload assets** (or connect a Git repository for the Functions backend).
3. **Important:** direct drag-and-drop static asset upload alone does not run Pages Functions. To enable `/api/chat` and `/api/memory`, deploy this project through a Git-connected Pages project or Wrangler Pages deployment so the `functions/` directory is included.
4. Set the environment variable/secret `GEMINI_API_KEY` in Pages project settings (Production and Preview as appropriate). Obtain the key from Google AI Studio. Never commit a real key into this ZIP or source repository.
5. Redeploy after adding the secret.
6. Optional persistent memory: create a Cloudflare D1 database, run `schema.sql` against it, then add a Pages binding named `DB` pointing at that database. Without D1, the memory screen explains that storage isn't configured.
7. Use the deployed HTTPS URL. For phone installation, open it in the browser and choose **Add to Home Screen / Install app**.

### D1 quick setup (Wrangler)
Install Node.js and Wrangler, log in with `npx wrangler login`, create a database with `npx wrangler d1 create ojha-agent-memory`, copy the returned database ID into `wrangler.toml`, then run:
`npx wrangler d1 execute ojha-agent-memory --remote --file=schema.sql`
Configure a Pages D1 binding called `DB` in the Cloudflare dashboard. This repository intentionally does not include an account ID or database ID.

## Local development
Use Node.js and Wrangler:
- `npm create cloudflare@latest` is not needed for this already scaffolded Pages project.
- Install Wrangler in your working environment: `npm install -D wrangler`
- Run `npx wrangler pages dev .` from the project root. If using a D1 database locally, configure it with Wrangler. Set a local `GEMINI_API_KEY` through your local `.dev.vars` file (never upload `.dev.vars`).
- `.dev.vars` example: `GEMINI_API_KEY=your_key_here`

## Features included
- Responsive dark sci-fi interface and custom animated avatar with blinking eyes and expressions.
- Gemini API call through Cloudflare Pages Function; server secret takes priority over browser-local fallback key.
- Chat context for recent turns and saved memories supplied as context.
- Optional persistent D1 memory CRUD.
- Voice dictation using browser SpeechRecognition where supported.
- Text/code file import (up to 12,000 characters into prompt) and text file download.
- Quick actions for Google search, YouTube, video URLs, research prompt, PWA installation, and keyboard focus shortcut.
- PWA manifest and service worker for basic app-shell caching.

## Security / production checklist
- This is a starter scaffold. Before public use, add authentication and per-user memory isolation. As currently written, D1 memories are shared by anyone who can access this deployed URL, so do not deploy the memory API publicly with personal data until authentication/authorization is implemented.
- Add rate limiting and quotas to prevent Gemini API abuse. Add a strict origin/CSRF policy and monitoring before production.
- Never put a real Gemini key into source files. Browser-local key mode is only for private testing and is less secure than a server secret.
- The chat endpoint currently forwards recent conversation context to Gemini; avoid sending private data.
- Gemini models and API availability can change. If a selected model is unavailable to your account, choose a currently supported model in the settings UI.
- Cloudflare Pages direct asset upload may not support server functions; use Git integration or Wrangler for full-stack deployment.
