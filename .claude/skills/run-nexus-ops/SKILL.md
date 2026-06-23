---
name: run-nexus-ops
description: Build, run, and drive the nexus-ops React/Vite SPA (christopherrangelux-dev.github.io/nexus-ops). Use when asked to start the dev server, build the site, take a screenshot, or interact with its UI (lifecycle consoles, catalog, approvals).
---

nexus-ops is a Vite + React 18 SPA (GitHub Pages, project base path `/nexus-ops/`), no router — `App.tsx` switches views via component state. `chromium-cli` is not available in this environment, so a Playwright driver at `.claude/skills/run-nexus-ops/driver.mjs` is the agent-facing way to drive it — it starts the dev server itself and exposes a small REPL of commands over stdin. Modeled on Portfolio's `run-portfolio` skill, simplified (no Astro, no view-transitions to wait out, since there's no URL-based navigation here at all).

All paths below are relative to the repo root (`nexus-ops/`).

## Prerequisites

```bash
npm install   # includes playwright as a devDependency
npx playwright install chromium   # no-op if already cached
```

## Build

```bash
npm run build   # outputs to dist/
```

## Run (agent path)

The driver manages its own dev server (kills stray `vite` processes first, clears `node_modules/.vite`) and a headless Chromium page. Pipe commands to it via a heredoc:

```bash
node .claude/skills/run-nexus-ops/driver.mjs <<'EOF'
launch
click-text Catalog
ss catalog
quit
EOF
```

Screenshots land in `/tmp/shots/` (override: `SCREENSHOT_DIR`). Commands run strictly in the order given, even though the dev server takes a few seconds to come up on `launch`.

For interactive back-and-forth instead of a fixed script, run it without a heredoc and type commands at the `driver>` prompt (foreground only — there's no tmux on this machine).

### Commands

| command | what it does |
|---|---|
| `launch` | kill stray dev servers, start `vite`, open a headless page at the site root |
| `click <css-sel>` | click an element, then settle ~150ms (no URL to wait on — pure React state) |
| `click-text <text>` | click the first element containing `<text>`, same settle wait |
| `ss [name]` | screenshot → `/tmp/shots/<name>.png` |
| `hover <css-sel>` | hover an element |
| `type <text>` / `press <key>` | keyboard input (e.g. `press Enter`, `press Tab`) |
| `wait <css-sel>` | wait up to 10s for a selector to appear |
| `eval <js>` | evaluate an expression in the page, print JSON |
| `text [css-sel]` | print `innerText` of a selector (or `document.body`) |
| `console` | print and clear captured browser console/page errors since last call |
| `quit` | close the browser and kill the dev server |

## Run (human path)

```bash
npm run dev   # opens http://localhost:5173/nexus-ops/ — Ctrl-C to stop
```

## App map (for navigating without a router)

- Default view on load is **Approvals**. Left nav (icon sidebar, desktop; bottom bar, mobile) switches views: `Apps`, `Catalog`, `Approvals`, `Settings` — use `click-text` with the nav label.
- **Catalog** → each API card has `Request Access` and `Manage` buttons. `Manage` opens that API's `ApiLifecycleConsole` (sections: Dormancy & Evidence, Entitlements, Request Validation, Status & Retirement, History — sidebar nav, `click-text` the section label to switch).
- **Apps** → each application row/card has `Change Order` and `Manage` buttons. `Manage` opens `AppLifecycleConsole` (sections: Status & Policy, Custom Policy, API Scopes, Pending Requests, History).
- Console close button is an `X` icon button in the header (no accessible label — target it with a CSS selector, not `click-text`).
- The flagship dormant endpoint for screenshots is **Customer Data API** (`api-001`) → Dormancy & Evidence → the row with the `Dormant` badge (`DELETE /api/v2/customers/:id`) — `click-text Dormant` expands its evidence inline.

## Test

No test suite exists in this repo (`package.json` only has `dev`/`build`/`preview`). `npm run build` succeeding is the correctness gate.

---

## Gotchas

- **Two dev servers running at once on the same port** will make the second `vite` instance pick a different port — the driver parses the real port out of `vite`'s own "Local: http://localhost:PORT/nexus-ops/" line rather than hardcoding 5173, so this is handled, but if you started a manual `npm run dev` separately in another terminal, kill it first (`pkill -f 'node_modules/.bin/vite'`) to avoid two servers serving slightly different in-memory state.
- **No router means no URL to poll.** Unlike Portfolio's driver, `click`/`click-text` here don't wait for `location.href` to change — they just click and settle. If a future interaction here ever becomes async (e.g. a real API call), revisit this.
- **Scripted clicks need more settle time than you'd expect — 150ms isn't enough.** A real trusted mouse click flushes React's state update synchronously before paint; clicks dispatched via Playwright (or raw `element.click()` via `eval`) appear to commit measurably slower in this headless setup. Confirmed empirically: clicking a console sidebar item correctly switched the rendered content within 150ms, but the sidebar's own active-highlight style was still showing the *previous* section at 150ms and only reliably caught up by ~300ms. `click`/`click-text` settle for 350ms for this reason — if you bypass them with a raw `eval(...).click()`, add your own `await new Promise(r => setTimeout(r, 350))` (or equivalent) before reading computed styles or taking a screenshot, or you'll see stale/inconsistent-looking UI that isn't actually a real bug.
- **Piped/heredoc stdin races the REPL's own queue.** Same fix as Portfolio's driver: an explicit FIFO queue serializes commands, and `close` (EOF) waits for the queue to drain before tearing down the browser/dev server.

## Troubleshooting

- **`ERROR: launch first` on every command:** `launch` is still starting the dev server — use a heredoc with `launch` as line 1 so the queue handles the ordering correctly.
- **Click-text matches the wrong element:** `click-text` matches the *first* element containing the given text, including badges/labels nested inside larger clickable rows. If two rows share similar text (e.g. two endpoints with the same path but different HTTP methods), target unique text instead (a status badge label, not the shared path).
