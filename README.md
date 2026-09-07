# Skip Wait — Bypass Timers & Countdowns

A **free, unlimited, open-source** browser extension (Manifest V3) that automatically skips
countdown timers and waiting pages on URL shorteners and file hosts, and clicks **Continue**
for you when a real confirmation is needed.

**No license key. No account. No daily cap.** Everything is free and unlimited.

## Features

- ⚡ Skips wait / countdown pages on supported URL shorteners and file hosts
- 🔁 Auto-clicks **Continue / Download** when a genuine step requires it
- 📚 Bundled host list with automatic refresh, so new domains arrive without a store update
- 🕶 Runs quietly in the background — open supported links and it just works

## Install (for testing / development)

1. Unpack this folder (or clone the repo).
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top-right).
4. Click **Load unpacked** and select the
   `Skip_Wait_-_Bypass_Timers_&_Countdowns` folder.
5. Done — find the extension on the extensions page and pin it for quick access.

## How it works

The extension only acts on the **exact hostnames listed in `hosts.json`** (300+ hostnames
across 170 flow types). When you land on a supported delay/wait page it either skips straight
to the destination or automates the remaining wait + Continue steps. If a site isn't matched,
nothing runs — so coverage is by hostname list, not a blanket rule.

- Bypass logic lives in **`background.js`** (service worker) and **`content.js`** (page scripts).
- The toolbar **popup** (`popup.html`) is a clean, minimal freeware UI with a version + license
  footer. Its bypass settings/status are cosmetic only.
- New domains are added to **`hosts.json`** and matched in `background.js` / `content.js`.

## Repository layout

```
Skip_Wait_-_Bypass_Timers_-_Countdowns/   the loadable extension
HANDOFF.md       internal maintainer log + review checklist + work list
CHANGELOG.md     release history
LICENSE          Apache-2.0
```

## License

Licensed under the **Apache License, Version 2.0**. See [LICENSE](LICENSE).

---

*Freeware edition. For maintainers: read [HANDOFF.md](HANDOFF.md) before modifying the
minified bypass code — it records the exact paywall-neutralizing edits and how to sync newer
code from the paid build without re-adding paid features.*
