# Changelog

All notable changes to the **freeware edition** of Skip Wait.

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
