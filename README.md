# Skip Wait — Bypass Timers & Countdowns

A **free, unlimited, open-source** browser extension (Manifest V3) that automatically skips
countdown timers and waiting pages on URL shorteners and file hosts, and clicks **Continue**
for you when a real confirmation is needed.

**No license key. No account. No daily cap.** Everything is free and unlimited.

## Features

- ⚡ Skips wait / countdown pages on supported URL shorteners and file hosts
- 🔁 Auto-clicks **Continue / Download** when a genuine step requires it
- 📚 Bundled host list with automatic refresh, so new domains arrive without a store update
- 🧩 Popup override to bind an unlisted domain to an existing skip engine — no update needed
- 🕶 Runs quietly in the background — open supported links and it just works

## Install (for testing / development)

1. Unpack this folder (or clone the repo).
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the
   `Skip_Wait_-_Bypass_Timers_&_Countdowns` folder.
5. Done — find the extension on the extensions page and pin it for quick access.

## How it works

The extension only acts on the **exact hostnames listed in `hosts.json`** (460+ hostnames
across 171 flow types). When you land on a supported delay/wait page it either skips straight
to the destination or automates the remaining wait + Continue steps. If a site isn't matched,
nothing runs — so coverage is by hostname list, not a blanket rule.

**Why an unlisted site does nothing:** every flow is bound to specific hostnames. Domains
rotate often, so if a site stopped working its hostname most likely changed — the fix is
adding/refreshing the hostname in `hosts.json` (or via the popup override below), not a
code change.

### Site not covered? Add it yourself

The popup's **"Site not covered? Add it here"** panel binds an unlisted domain to an existing
skip engine (e.g. the generic AdLinkFly `/links/go` engine) — stored locally as
`skipWaitCustomHosts`, merged over the bundled/remote host list, effective on new page loads.
No update or re-release needed. It works when the unlisted site uses the same page layout as
the chosen engine; it can't invent support for a brand-new layout.

## Architecture notes

- Bypass logic lives in **`background.js`** (service worker) and **`content.js`** (page
  scripts). Both ship as readable, beautified source (no build/minify step).
- The AdLinkFly-style shorteners (shrinkpe, earnlinks, liteshort, nitrolink and friends) all
  finish with the same `#go-link` form POST (`ad_form_data` [+ `_csrfToken` + `_Token` fields],
  `ab=1` cookie, spoofed Referer). That shared tail is implemented **once** as `glEngine` in
  `background.js`; each family keeps only its own entry/hop logic.
- The toolbar **popup** (`popup.html`) is a clean, minimal freeware UI with a version + license
  footer plus the custom-site override panel.
- New domains are added to **`hosts.json`** and matched in `background.js` / `content.js`.
- `tools/smoke-background.mjs` loads `background.js` in a mocked Chrome and asserts it is
  licensing-free and that the generic engine still resolves links end-to-end:
  `node tools/smoke-background.mjs`

## Repository layout

```
Skip_Wait_-_Bypass_Timers_-_Countdowns/   the loadable extension
tools/           maintainer tooling (smoke test for background.js)
HANDOFF.md       internal maintainer log + review checklist + work list
CHANGELOG.md     release history
LICENSE          Apache-2.0
```

## License

Licensed under the **Apache License, Version 2.0**. See [LICENSE](LICENSE).

---

*Freeware edition. For maintainers: read [HANDOFF.md](HANDOFF.md) before modifying the
bypass code — it records the exact paywall-neutralizing edits, the readable-source policy,
and how to sync newer code from the paid build without re-adding paid features.*
