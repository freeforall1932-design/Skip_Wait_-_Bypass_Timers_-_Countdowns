# Changelog

All notable changes to the **freeware edition** of Skip Wait.

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
