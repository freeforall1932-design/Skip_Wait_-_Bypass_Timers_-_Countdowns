# Changelog

All notable changes to the **freeware edition** of Skip Wait.

## [2.4.0] — 2026-09-09
Upstream flow sync, retained as a free and unlimited freeware release.

### Added
- **VexoLink** (`vexo-link.com`) — holds the initial redirect, follows the
  ViewArticleGate referer handoff, resolves the Get Link form, then opens the
  verified HTTP(S) destination in the originating tab.
- **Movies4u** (`1movies4u.cc`) — reads the landing page’s external “Latest
  Releases” handoff and opens it with an in-page progress overlay.
- **Molyn** (`molyn.top`) — fetches the local key endpoint on supported key
  paths and displays a copyable key in the overlay, with the upstream manual
  fallback when the endpoint is unavailable.
- Targeted smoke coverage for VexoLink’s redirect guard, referer hop and
  signed form POST, plus page-level coverage for VexoLink, Movies4u and Molyn.

### Fixed
- **Freedlink** file pages now match any single filename leaf rather than only
  names ending in `.html`, matching the current upstream route behavior.

### Compatibility / licensing
- Ported from the developer-maintained active source at commit `7602a26`
  (version 1.4.82) and re-applied this project’s always-allow freeware gate:
  no account, license key, daily counter, EAS request or alarm was introduced.
- Reviewed `murtaza460786/skip-wait-extension` as a comparable project only.
  Its CC BY-NC-SA 4.0 license is incompatible with this Apache-2.0 project, so
  no code or host data was copied from it. Its public host map was also a
  subset of the curated coverage already shipped here.

## [2.3.0] — 2026-09-07
Coverage ports, UI-review fixes, and the D3c centralization pass.

### Added
- **15 more hostnames** across existing flows, all data-only ports verified against the
  bound engine's logic: `tii.la`, `oei.la`, `iir.la`, `tvi.la` → `shrinkearn` (same plugin
  family per the bypass-shortlinks include rules); `exeo.app`, `exe-links.com` → `exeio`
  (adsbypasser lists both with exeygo.com as one engine); 9 hosttbuzz-cluster domains
  (`hosttbuzz.com`, `policiesreview.com`, `blogmystt.com`, `wp2hostt.com`,
  `advertisingcamps.com`, `healthylifez.com`, `insurancemyst.com`, `clk.kim`,
  `dekhe.click`) → `wpsafelink-button`.
- wpsafelink-button engine: the **hosttbuzz plugin skin** — `.btn-captcha` submit (only
  after the captcha resolves), `#nextpage` / `#getmylnk` form submits, and a last-resort
  plain click on `#wpsafe-link > a` for skins that wire the destination into the anchor's
  own click handler.
- Popup override panel: the engine list now offers the **WordPress SafeLink (button /
  generate pages)** engine (previously stale at 3 options after the new engine shipped).

### Fixed
- wpsafelink-button form submits (`form[name=dsb]`, `#nextpage`, `#getmylnk`) could
  **resubmit on every poll tick** once the settle deadline passed; they now submit exactly
  once (same guard now also covers the pre-existing `dsb` path).
- Popup `.custom-title` was an unstyled class (matched rule added in 2.2.0 work).

### Changed (D3c — centralized, pre-existing code only)
- exeio's extended MAIN-world stealth script split: the network/app_vars half is gone
  (shared `swStealth` now injected with exeio's longer `exeioAdBlockRe`), the DOM half
  (Turnstile auto-render + disabled-shape repair) is the new `swExeioExtras`, injected as
  a pair. The lazy `app_vars` trap was dropped from extras because `swStealth` installs
  it eagerly (same effect).
- content.js constants deduped with **initializer-only swaps** (zero call-site changes):
  `swDelay` (replaced 30 per-flow delay helpers), `swTnFrames` (9 Turnstile iframe
  selector arrays), `swTnToken` (5 token-input selector consts), `swTnNote` (8
  "Confirm you're human" note objects) — 52 duplicated copies removed.
- Review finding recorded: the "per-site math/digit-order captcha solver copies" from the
  original D3 note never existed in this codebase — nothing to dedupe there.
- Smoke coverage extended: exeio double-injection assertions, `swExeioExtras` executed in
  a fake DOM, and the hosttbuzz `#getmylnk` submit-once behavior.

## [2.2.0] — 2026-09-07
The WordPress SafeLink button engine, §3.1 verification suite, and manual-first audio assist.

### Added
- **`wpsafelink-button` engine** — one generic content.js engine for the WP SafeLink
  button/generate family (~126 hosts at release): horoscop `.wpsafelink-button` cluster,
  indobo `div[id^=wpsafe]` cluster, jobinmeghalaya/tejtime/marketrook button chains,
  generic `#wpsafe-link` (href / window.open / handleClick), `newwpsafelink` `{linkr}`
  form payloads, script-content variants, kingshort choreography. Chained
  `safelink_redirect`/AES payloads resolve through the existing decoders.
- **`bitcotasks` flow** — the hosts.json key existed in both editions but no engine ever
  referenced it (inert); the firewall flow is now implemented (Validate press +
  page-world `continueClicked`).
- **Manual-first reCAPTCHA audio assist** (opt-in): a "Try audio assist" button appears in
  the Skip Wait overlay only while an unsolved captcha blocks the page; the attempt runs
  only on press, transcribes against a **user-configured STT endpoint**
  (`skipWaitSttEndpoint`, popup panel; empty = disabled, zero network calls). Background
  relays `SKIP_WAIT_AUDIO_ASSIST_START/RESULT`, guarded `SKIP_WAIT_AUDIO_STT_FETCH`
  (google.com audio URLs only) and `SKIP_WAIT_AUDIO_STT` (refuses with `no-backend`
  without an endpoint). bframe driver switches the widget to audio, WAV-encodes both
  channels, fills and verifies, up to 3 retries.
- `SKIP_WAIT_PAGE_CALL` background listener: whitelisted identifier-only MAIN-world page
  function calls (`wpsafehuman`, `wpsafegenerate`, `continueClicked`).
- **`tools/verify-release.mjs`** — 28 automated §3.1 checks (syntax, smoke harnesses,
  manifest, paywall neutrality incl. EAS-validator *absence*, popup assets, hosts
  wiring); **`tools/check-hosts.mjs`** — live DNS/HTTP probe of every bundled hostname
  (developer-side; needs normal network egress); **`tools/smoke-content.mjs`** —
  content.js's first harness (mocked chrome + minimal DOM): flow-table run, query-engine
  decode, wpsafelink-button variants, bitcotasks, audio-assist manual-first semantics.
- `mobiend.com`, `mrproblogger.com` → `adlinkfly-links-go` (data-only).

### Changed
- Manifest version → 2.2.0; README coverage numbers refreshed.
- Background injector consolidation: `It`/`xt` wrappers deleted (generic `St` handles
  optional frameIds + serialized args); lksfy's adblock-stealth script deduplicated into
  the shared parameterized `swStealth`.
- Remote hosts URL (A1) verified live; paid-remote diff shows only `molyn` + `movies4u`
  as unbundled flows (their code ships via a future §7 elevate, not data rows).

### Fixed
- Popup `.custom-title` class had no matching CSS rule (unstyled heading).

### Decisions
- **D3a (resolution-API fallback) permanently dropped** after developer review: a third
  party would see every submitted link and its destination, the dependency/ToS trade is
  not worth it for a browser extension. Server-locked sites are out of scope; the C1
  answer for them is the honest "this gate can't be bypassed locally".

## [2.1.0] — 2026-09-07
Coverage expansion + the "one generic engine" consolidation.

### Removed
- **Dead EAS/license code deleted for real** (HANDOFF A3): the JWS verifier, lease/activation
  storage machinery, the "5 free per day" counter, license alarms and the license storage
  watcher are gone from `background.js` and `content.js`. No `eas-x.com` string remains and
  zero network calls are possible even with leftover license data in storage.
- `alarms` permission dropped from `manifest.json` (only the removed license scheduler used it).

### Changed
- **Consolidated the duplicated AdLinkFly "links/go" resolvers.** The ~5 copy-pasted
  `ad_form_data` + `_csrfToken` + `ab=1` cookie + `/links/go` POST blocks (earnlinks,
  shrinkpe, liteshort, nitrolink) plus their Referer-spoof DNR wrappers and counter parsers
  are now ONE shared `glEngine` in `background.js`. New sites of this family are a
  `hosts.json` row + thin dispatch, not new resolver code. Behavior preserved per-family
  (shrinkpe keeps its no-csrf body; nitrolink keeps its Origin header / no ab cookie).
- `background.js` and `content.js` now ship as **readable, beautified source** (no minify
  step), per HANDOFF A3's recommendation to work from readable source.
- Host matching now merges a third source, `skipWaitCustomHosts`, for user overrides.

### Added
- **35 new shortener domains** ported from the active `bypass-shortlinks` and `adsbypasser`
  userscripts into the `adlinkfly-links-go` flow (data-only additions; they run on the
  existing generic engine).
- **Custom-site override UI** in the popup: bind an unlisted domain to an existing engine
  (stored as `skipWaitCustomHosts`, applied on new page loads, survives remote host refresh).
- `tools/smoke-background.mjs`: loads `background.js` in a mocked Chrome and asserts it is
  licensing-free and that the generic engine + custom override resolve links end-to-end.
- README: explains hostname-based coverage and the popup override.

## [2.0.0] — 2026-09-07
Paywall/licensing fully removed. This is the first freeware release.

### Removed
- EAS licensing system (third-party `eas-x.com`) — no more license keys, activation, or account.
- **"5 free per day"** usage cap — every bypass is now unlimited.
- Auto-opening survey tab on install/startup.
- Paywall / "unlock bypass" / plan / key-entry UI in the popup.

### Changed
- `manifest.json` version → **2.0.0**; description no longer mentions a daily limit.
- Popup rebuilt as a refined, minimal freeware UI (soft background, brand header, gradient
  feature card, Apache-2.0 footer). No store/contact/paid-edition links; no donate button yet.
- Popup styling rewritten in a small, readable `popup.css` (bundled Poppins 400/600/700/800).

### Added
- Apache-2.0 `LICENSE` shipped inside the extension bundle.
- `HANDOFF.md` (internal maintainer log + prior-session review + work list).
- `CHANGELOG.md` (this file).

### Fixed
- Removed unused assets (`icons/` folder, an unreferenced 500-weight font).

### Notes
- The live host list still refreshes from the developer's existing host-data URL (fallback to
  the bundled `hosts.json` keeps it working offline).
- Dead (unreachable, non-networking) license code remains in the minified `background.js` /
  `content.js`; see `HANDOFF.md` A3 before attempting removal.

[Unreleased]: internal changes are logged in `HANDOFF.md` §6.
