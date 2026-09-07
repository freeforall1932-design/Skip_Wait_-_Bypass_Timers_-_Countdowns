# Skip Wait — Session Handoff, Review & Work List

> Purpose of this file: give the **next session / developer** the full context of what was
> done, what must be double-checked after the rewrite + deletions, open decisions, and the
> outstanding work list. If you are starting a new session on this repo, **read this first**
> and run the **Prior-Session Review checklist** below before touching bypass code.

- Repo branch in use: `arena/01a07b0a-skip-wait-bypass-timers-countd`
- Last session date: **2026-09-07**
- Extension folder: `Skip_Wait_-_Bypass_Timers_&_Countdowns/` (Manifest V3)

### Distribution model (read before writing marketing/popup copy)
This codebase is the developer's **own** software (the same project also ships as a paid
"Skip Wait" edition on the Chrome Web Store under a different release account). This repo is
published under `freeforall1932-design` as the **freeware / community edition** — free,
unlimited, Apache-2.0. Because the developer owns both, shipping a freeware edition alongside
a paid store edition is legitimate (Apache-2.0 does **not** require anyone to give away code
they author; they may dual-distribute).

Keep this in mind:
- Do **not** write copy that calls this repo a "fork" of someone else's project — it isn't.
  If "fork" appears in README / popup / docs, treat it as an error and replace with
  "freeware edition", "open-source edition", etc.
- The paid store edition and this freeware edition are intentionally **separate accounts**
  so the free release stays low-key. Be careful that contact/branding links don't tie the two
  accounts together in a way the developer does not want exposed (see A2).

---

## 1. What this session was about

User request: **remove the paywall / licensing** so the extension is genuinely **free,
unlimited, open source (Apache-2.0)** — no EAS license key, no auth, no "5 free per day"
cap. Replace the store/paywall popup with a clean "freeware" UI. **Do not add a donate
button yet** (user wants to decide the method/platform later and is not pushy about it).

## 2. What was changed

### 2.1 Gating removed — `background.js`
The extension previously had 3 licensing hooks. All are now **no-ops / always-allow**:
| Original | Replacement | Effect |
| --- | --- | --- |
| `de=async()=>!!(...license||5-free-daily...)` | `de=async()=>!0` | Bypass gate always allows → **no daily cap** |
| `Y=async()=>{...validate against eas-x...}` | `Y=async()=>({ok:!0})` | Top-level license validation returns OK without network |
| `le=()=>{...increment free-used counter...}` | `le=()=>{}` | "Claim a free slot" no longer counts anything |
| Auto-open survey Google Form on install/startup (`forms.gle/...`) | **IIFE removed** | No more surprise survey tab |

Because `de()` is always true, `ue()`/`pe()` (used by every host action) always run.

### 2.2 Gating removed — `content.js`
| Original | Replacement | Effect |
| --- | --- | --- |
| `et=async()=>!!(...license||5-free-daily...)` | `et=async()=>!0` | Content-script gate always allows |
| `tt=async()=>{...eas-x validate...}` | `tt=async()=>({ok:!0})` | Validator returns OK with no network |

### 2.3 UI / packaging
- **`manifest.json`** → version bumped to `2.0.0`; description no longer says "5 free a day".
- **`popup.html` + `popup.css`** → a **refined, minimal freeware popup** (rich-but-neutral,
  VLC-like): soft blue-tinted gradient background (not white), brand header (round watch logo
  with shadow, "Skip Wait" in Poppins 700, subtitle, small green "Free & Unlimited" pill with
  status dot), one **colorful blue→indigo gradient hero card** with checkmark feature bullets,
  and a thin minimal footer (version + "Free & open source · Apache-2.0"). Ships only Poppins
  weights 400/600/700/800 (`poppins-latin-*.woff2`). **No contact row, no support chips, no
  store link** (keeps the two release accounts separate) and **no donate button** yet.
- **`popup.js`** → tiny cosmetic script; appends the manifest version to the footer label.
  All bypass logic stays in `background.js` / `content.js`.
- **`LICENSE`** (Apache-2.0) present at repo root and copied into the extension folder.
- Bundled fonts trimmed to exactly the weights `popup.css` loads (removed unused 500 weight).
- Removed the unused `icons/` folder (github/telegram/email PNGs — no longer referenced).
- Root **`README.md`** rewritten — clean/minimal freeware wording, **no contact/email/store
  links** that would tie this account to the paid release identity.

All edited JS passes `node --check` (syntax-verified); `manifest.json` is valid JSON.

### 2.4 Final code review (2026-09-07, before unpacked testing)
- **JS validity:** `background.js`, `content.js`, `popup.js` all pass `node --check`.
- **manifest.json:** valid; references only existing files (`icon.png`, `hosts.json`,
  `popup.html`, `background.js`, `content.js`). Version `2.0.0`.
- **Paywall neutralization:** confirmed only the §2.1/§2.2 swaps were changed in
  `background.js` / `content.js`; no re-introduced EAS/alarm/survey code.
- **Popup assets:** every font weight shipped is loaded by `popup.css`; every CSS class used by
  `popup.html` is defined; no dangling image/font references.
- **Known remaining (intentional):** dead EAS/license code still present in minified
  `background.js`/`content.js` but unreachable + makes zero network calls (see §3.2/A3).

## 3. ⚠️ PRIOR-SESSION REVIEW (run before continuing work)

Because this session was mostly **deletions + a gated-function swap**, the next session must
verify nothing is missing, misaligned, or broken. Go through these one by one.

### 3.1 Missing / broken logic
> **2026-09-07 (7th pass) status:** everything below that can be checked without a browser is
> now **automated** — run `node tools/verify-release.mjs` (28 checks: syntax, both smoke
> harnesses, manifest, paywall-swap neutrality, popup assets, hosts wiring). The dev sandbox
> has no outbound web access, so the *live-site* items still need the developer's Chrome;
> `tools/check-hosts.mjs` (run on a normal network) probes all bundled hostnames for
> dead/parked domains before that pass. Also verified this session: the remote hosts URL
> (§3.2/A1) is live and serving valid JSON. NOTE: the `Y`/`tt` validator no-ops from §2 no
> longer exist — the whole EAS validator module was deleted in the 6th pass (A3), so the
> correct check is their *absence* (the verifier asserts that).

- [ ] **Load the extension unpacked** (`chrome://extensions` → Developer mode → Load unpacked →
      select `Skip_Wait_-_Bypass_Timers_&_Countdowns`).
- [ ] Open a **supported shortener / wait page** from `hosts.json` and confirm the timer is
      skipped with **no eas-x network call** (DevTools → background service worker → Network).
      *Good first targets for the new `wpsafelink-button` engine: any horoscop-cluster or
      indobo.com flow.*
- [ ] Confirm there is **no daily cap**: do several bypasses in a row on one day.
- [ ] Confirm the **survey tab no longer auto-opens** on install / browser start.
- [ ] Popup opens and renders the freeware UI; version shows **v2.2.0** (bumped from 2.1.0
      in the 7th pass for the wpsafelink-button release).
- [x] Paywall neutrality re-verified (7th pass): `node tools/verify-release.mjs` → 28/28
      (`de`/`et` gates still `!0`, `le` still `{}`, EAS validator modules absent, zero
      eas-x/forms.gle/alarms references, hosts.json fully wired).
- [x] `node --check` + `tools/smoke-background.mjs` + `tools/smoke-content.mjs` all green
      after this session's edits. **Keep running `node tools/verify-release.mjs` after ANY
      edit to background.js / content.js / popup.js / hosts.json.**

### 3.2 Config notes (some resolved, some still open)
- [x] **Remote hosts-update URL (RESOLVED — keep reusing).** In `background.js`, `i()` fetches
      hosts from `https://raw.githubusercontent.com/sharoon7171/.../main/extension/public/hosts.json`.
      Decision: **keep reusing this paid-edition host-data URL** (same developer; simplest — one
      host update benefits both editions). The bundled `hosts.json` is still used as fallback, so
      a failed fetch does **not** break bypassing. Do **not** repoint unless the developer later
      wants this repo fully self-contained.
- [x] **Popup footer/branding (RESOLVED — minimal).** Popup surfaces **no** contact, **no** store
      link, **no** paid-edition identity — just a clean footer (version + Apache-2.0). README also
      carries no contact/email/store links. This keeps the two release accounts separate.
- [x] **Dead license code REMOVED (2026-09-07).** The EAS key parser, `skipWaitLicense*`
      storage constants, `eas-x.com` strings, license alarms and watchers are deleted from
      `background.js` and `content.js` (done from beautified readable source, which is now the
      shipped format — see A3). `tools/smoke-background.mjs` proves zero licensing side-effects
      even when legacy license data is seeded into storage.

### 3.3 Permissions / manifest hygiene (cleanup candidates — safe, low priority)
- [x] `alarms` permission **dropped (2026-09-07)** — its only consumer was the removed license
      scheduler; grep confirms zero `chrome.alarms` references remain.
- [ ] `host_permissions: ["<all_urls>"]` is broad. Likely needed because bypass code runs across
      many domains via dynamic content scripts, so keep unless a scoped alternative is chosen.

---

## 4. Work list / backlog (priority order)

**A. Decisions (mostly resolved this session)**
- A1. **RESOLVED:** keep reusing the paid edition's host-data URL. (See 3.2.)
- A2. **RESOLVED:** popup + README are minimal — no contact / store / paid identity. (See 3.2.)
- A3. **RESOLVED (2026-09-07):** dead EAS/license code fully removed from `background.js` +
      `content.js` (worked from beautified readable source, then shipped that readable source —
      no re-minify). No `eas-x.com` references remain; `tools/smoke-background.mjs` asserts
      zero licensing side-effects even with leftover license data in storage. The `alarms`
      permission was dropped at the same time.

**B. Feature / product (user has NOT decided; do not add without asking)**
- B1. **Donate / Support** — the developer plans to add a donate option later (method/platform
      still open: Ko‑fi, GitHub Sponsors, PayPal, or a README-only link). Do not add a button or
      section yet.
- B2. When ready, add a non-pushy donate section to the popup and/or README (this freeware
      edition doubles as a goodwill/community release — keep tone optional and gentle).

**C. Robustness / maintenance**
- C1. **"Doesn't work on some website"** — see Section 5. Capture the exact failing URLs the
      user reports, check the hostname is listed in `hosts.json`, and add/update flows.
- C2. **RESOLVED (2026-09-07):** end-user overrides shipped. The popup's "Site not covered?"
      panel writes `skipWaitCustomHosts` to `chrome.storage.local`; `background.js` and
      `content.js` merge it as a third host source (after bundled + remote), so a new domain
      binds to an existing engine at runtime without a re-release. Effective on new page loads.
- C3. Re-baseline on the developer's paid store edition from time to time to pick up new host
      flows, but keep this edition's paywall code stripped.

**D. Coverage expansion (next, from the 2026-09-07 roadmap session)**
- D1. **Consolidate the next engine families by DOM pattern** (same treatment as `glEngine`):
      filecrypt pow-captcha, the reCAPTCHA/Turnstile-assisted unlockers (dlsurf, freedlink
      hcaptcha, cuty, exeio, loot), WordPress-safelink blogs, and the download-timer sites.
      Reuse the anygame/apkteal/ankergames React-fiber direct-download hack as the model of
      "one generic engine, many hosts".
      → **7th pass progress (2026-09-07):** (a) the whole **WordPress-safelink button family**
      is now ONE generic `wpsafelink-button` engine in content.js (~126 hosts — see D2), the
      exact "one engine, many hosts" treatment; (b) background.js support layer deduplicated:
      `It`/`xt` injector wrappers deleted in favor of the generic `St` (now supports optional
      frameIds + serialized args), and lksfy's adblock-stealth MAIN-world script replaced by a
      shared parameterized `swStealth` (regex passed as executeScript arg); exeio keeps its
      extended variant (turnstile auto-render) — merging it is possible but left for after a
      live-site test. **Still open:** cuty/exeio/dlsurf/loot captcha-assisted unlockers,
      filecrypt POW family, download-timer MAIN-world functions (shareable
      once/guard + DOM-ready + brand-note helpers).
- D2. **Port more flows** from the active userscripts — `nOneCode4u/bypass-shortlinks` (best
      source of current recipes) and `adsbypasser`. Done so far: 35 AdLinkFly-style domains
      added to `adlinkfly-links-go` (data-only).
      → **7th pass progress (2026-09-07):** dedicated **`wpsafelink-button` engine shipped**
      (content.js + generic `SKIP_WAIT_PAGE_CALL` MAIN-world call listener in background.js)
      covering the horoscop `.wpsafelink-button` cluster, indobo `div[id^=wpsafe]` cluster,
      jobinmeghalaya/tejtime/marketrook button chains, generic `#wpsafe-link a` (href /
      window.open / handleClick), `newwpsafelink` form payloads, script-content variants and
      the kingshort choreography — **126 hostnames** curated from the current
      bypass-shortlinks source (political/ambiguous domains excluded: bjp.org.in,
      myscheme.org.in, mtc1-5, oreoauto). Also: **bitcotasks** flow implemented (was an inert
      hosts.json key in both editions), `mobiend.com` + `mrproblogger.com` added to
      `adlinkfly-links-go` (data-only). NOT done yet: more adsbypasser ports; FastForward's
      `script.js` remains a reference library only (do not switch base — it is unmaintained).
      Host provenance caveat: the dev sandbox cannot reach arbitrary sites, so the 126 new
      hostnames are curated from the userscript source of record (fetched 2026-09-07), not
      probed — run `node tools/check-hosts.mjs` on a normal network to prune dead domains.
- D3. **Optional upgrades (decide with the developer first):** resolution-API fallback for
      hard server-side unlockers (bypass.city / adbypass.org pattern — weigh privacy/ToS);
      reCAPTCHA audio-assist (dessant/buster style); centralize anti-adblock stealth +
      math/digit-order captcha solvers instead of per-site copies.
      → **Developer decided (2026-09-07, 7th pass):**
      - **D3b audio-assist — APPROVED, SHIPPED (manual-first + button).** Implemented in this
        pass: when a gated page (wpsafelink-button engine) is blocked by a visible unsolved
        reCAPTCHA, the Skip Wait overlay shows a **"Try audio assist" button** — nothing runs
        on its own. Pressing it relays to the recaptcha bframe content script, which switches
        the widget to its audio challenge, downloads the clip (background-side, google.com
        URLs only), WAV-encodes both channels, and transcribes them against
        **`skipWaitSttEndpoint`** (user-configured in the popup, e.g. a local Whisper server;
        OpenAI-style `{text}` or plain-text responses). Result digits are filled + verified,
        with up to 3 retries while the challenge reloads; failures fall back to manual with a
        clear message. **No bundled speech backend and zero network calls by default** —
        modern Buster solves on-device with a bundled ONNX model (transformers.js +
        onnxruntime + offscreen document), which is the natural v2 if we ever want
        automatic-by-default without an external service (big bundle, later decision).
      - **D3c centralize stealth/captcha solvers — APPROVED as the next refactor**, but if it
        hits a blocker, switch to porting more hosts first (developer's fallback order).
        swStealth (background) already landed; remaining: merge exeio's extended stealth
        variant into it (two-injection split: swStealth + exeio-extras) and dedupe the
        per-site math/digit-order captcha snippets in content.js.
      - **D3a resolution-API fallback — still undecided; the developer asked for detail
        before choosing.** Summary given in chat 2026-09-07: a resolver API takes the
        shortlink URL/ID, solves the server-side gate on someone else's infrastructure, and
        returns the destination — the only realistic way to cover fully server-locked sites,
        but it discloses the destination to a third party, adds an availability/trust
        dependency, and is the most ToS-fragile pattern. If adopted, mirror the audio-assist
        model: **off by default, user-supplied endpoint, zero calls unless opted in.**
        (Decision pending — do not implement without an explicit go.)
- D4. B1 (donate) stays on hold until coverage is visibly larger. *(Coverage grew ~38% this
      pass; still holding per instruction.)*

---

## 7. "Elevate this repo" workflow (sync newer code from the paid build, drop the paywall)

The developer maintains the **paid store edition** as the "latest" source and wants THIS
freeware repo updated from it **without** re-introducing any paid/licensing function. Do NOT
do this by hand-writing or dual-maintaining flows — instead port from the paid build, then
re-apply the freeware edits below.

**Steps to elevate (when asked):**
1. Pull the latest bypass code (`background.js`, `content.js`, `hosts.json`) from the paid
   build (same developer — not third-party code).
2. Re-apply the **exact** gating neutralizations from §2 so the paid function stays out:
   - `background.js`: `de=async()=>!0` (was: license || 5-free-daily),
     `Y=async()=>({ok:!0})` (was: EAS validate), `le=()=>{}` (was: count free uses).
     Also remove any re-added auto-survey tab IIFE (`forms.gle`).
   - `content.js`: `et=async()=>!0` and `tt=async()=>({ok:!0})`.
   - `manifest.json`: description must not say "5 free a day" / mention a license; keep version
     fresh; do not add `storage` keys the paywall needs if removable.
   - Do NOT restore the EAS activation UI / key field / plans in the popup.
3. Run `node --check background.js content.js popup.js` and re-run the §3 review checklist.
4. Note in §6 what was elevated and from which version/build.

Timing the developer described: push fixes to the **paid** edition first (users there paid and
expect the latest), then elevate this freeware repo to the same code minus paywall. The free
repo is allowed to lag slightly behind.

---

## 5. Research notes — comparable projects & "site doesn't work"

### Why some sites may not work
- Skip Wait only activates on the **exact hostnames listed in `hosts.json`**
  (300 unique hostnames across 170 flows; the extension website advertises ~285 sites / 116
  bypasses). If a host's domain **changed**, the page is **not listed**, or the site moved its
  wait to a **server-side gate**, the extension has nothing to match and nothing happens.
- This is normal for all such tools — coverage is by flow/hostname, not a blanket rule.
  Fixing "site X" = confirm the current URL hostname and add/refresh a flow in `hosts.json`
  + the matching logic in `background.js`/`content.js`.

### Comparable open-source projects (for reference / borrowable flows)
| Project | Status | Notes |
| --- | --- | --- |
| **FastForward** (`FastForwardTeam/FastForward`) | Not actively maintained (still accepts some PRs) | Successor of Universal Bypass; large library of shortlink-skip JS flows — good reference for flow patterns. Removed from Chrome Web Store; installed manually. |
| **Universal Bypass** | Unmaintained | FastForward is its maintained fork; largely superseded. |
| **bypass-all-shortlinks-debloated** (userscript) | Active | Recommended by FastForward; aggregates 400+ domains incl. many Indian shortlinks/file hosters. Great source of **new host flows** to port. |
| **ads-bypasser** (userscript) | Active | Another recommended active alternative. |
| **Skip Wait (paid store edition)** | Active (developer's own) | Same developer as this freeware edition. The store edition keeps its licensing/paywall. For new host flows this repo can re-baseline its own logic from the developer's store build (C3), keeping this edition paywall-free. |

### Up-to-date / not-to-do
- Manifest **V3**, service worker, `declarativeNetRequest`, `chrome.scripting` are all current.
- FastForward/Universal Bypass are **not** good extension bases to switch to — both are
  effectively unmaintained. The most useful cross-pollination is **host/flow coverage**, not
  architecture.

---

## 6. Session log (append here each session)

- **2026-09-07** — Removed all EAS licensing + 5/day cap (background + content gate no-ops),
  removed auto-survey tab, bumped to v2.0.0, rewrote popup as clean freeware (no donate yet),
  added Apache-2.0 LICENSE to bundle, removed unreferenced poppins fonts, rewrote README.
  Created this HANDOFF.md. Syntax checks pass. **Next:** run §3 Prior-Session Review, then §4.
- **2026-09-07 (2nd pass)** — Confirmed distribution model: developer's own code, freeware
  edition on a separate low-key account alongside a paid Chrome-store edition. Reframed
  HANDOFF so it no longer calls the repo a "fork"; corrected contact/branding + hosts-source
  notes and work list to the dual-edition model. **Next session:** decide A1 (hosts source) +
  A2 (popup footer/branding copy), then run §3 review.
- **2026-09-07 (3rd pass)** — A1 RESOLVED (keep reusing paid host-data URL). A2 RESOLVED
  (popup + README minimal: no contact/store/paid identity — keeps accounts separate). Rebuilt
  popup as clean VLC-style freeware (header pill + one tagline + Apache-2.0/version footer).
  Rewrote README minimal, removed fork/contact ties. Added §7 "elevate this repo" workflow
  (sync newer code from the paid build, then re-apply the paywall-neutralizing edits from §2).
- **2026-09-07 (4th pass)** — Popup branding fix: restored the original **`popup.css`**
  (Tailwind v4 brand theme + Poppins `@font-face`) and the 5 `poppins-*.woff2` fonts from
  `main`, then rewrote `popup.html` to reuse the original build's exact utility classes
  (brand header: 48px rounded icon with white ring + shadow, Poppins extrabold title, subtitle,
  colored "Free & Unlimited" success pill; a "No limits. No key. No account." feature card;
  minimal muted footer). This keeps the freeware edition looking like the real, polished
  product (not a flat/bare "naked" UI) while containing **no** paywall/plan/key/store/contact
  elements. `popup.js` is a tiny script that appends the manifest version to the footer label.
  All classes verified present in `popup.css`; `popup.js` passes `node --check`.
- **2026-09-07 (5th pass — finalize for unpacked testing)** — Dropped the local file/preview
  server (the bare "directory listing" + flat-white preview confused things) and removed the
  preview-only `index.html`. Finalized the **refined minimal freeware popup** (custom
  `popup.css`, soft gradient bg, gradient hero card, Poppins 400/600/700/800 only) and cleaned
  unused assets (`icons/` folder, unused 500-weight woff2). Ran final code review (§2.4):
  all JS valid, manifest valid + references existing files only, popup classes/fonts match.
  **Next: load unpacked in `chrome://extensions` and run §3.1 checklist on real sites.**

- **2026-09-07 (6th pass — coverage + consolidation roadmap)** — (1) **A3 done:** deleted all
  dead EAS/license code from `background.js` + `content.js` (JWS verifier, lease/activation
  storage, free-daily counter, license alarms/watchers) by working from beautified readable
  source, then **shipped that readable source** (no re-minify). `alarms` permission dropped.
  (2) **BIG WIN:** consolidated the ~5 duplicated AdLinkFly `links/go` resolver tails
  (earnlinks, shrinkpe, liteshort, nitrolink) into ONE shared `glEngine` in `background.js`
  (`field`/`goAction`/`counterSeconds`/`withReferer`/`postGo`); sfl's API client reuses
  `withReferer`. Per-family quirks preserved. (3) **Ported 35 new shortener domains** from the
  active `bypass-shortlinks` + `adsbypasser` userscripts into `adlinkfly-links-go` (data-only).
  (4) **Custom-host override:** new `skipWaitCustomHosts` storage key merged as a third host
  source (survives the remote refresh that clobbers `skipWaitHosts`) + a popup "Site not
  covered?" panel — binds an unlisted domain to an existing engine at runtime, no re-release.
  (5) Added **`tools/smoke-background.mjs`** — loads `background.js` in a mocked Chrome, asserts
  it is licensing-free (even with seeded legacy license data) and functionally resolves links
  through the consolidated engine + override. **All checks pass; run it after any
  `background.js` edit.** **Next:** §3.1 live-site checklist; backlog D1–D4 (more engine
  consolidation + flow ports).

- **2026-09-07 (7th pass — §3.1 verification automation + wpsafelink-button engine)** —
  (1) **§3.1 automated:** new `tools/verify-release.mjs` (28 checks — syntax, smoke
  harnesses, manifest refs, paywall neutrality incl. validator *absence*, popup
  font/class/id wiring, hosts.json schema + engine wiring) and `tools/check-hosts.mjs`
  (live DNS/HTTP probe of every bundled hostname — run on a normal network; the dev sandbox
  has no outbound web access, which is why it can't run here). Fixed two findings it caught:
  popup `.custom-title` class was unstyled (added a matching rule), and the `bitcotasks`
  hosts.json key was **inert in both editions** (no engine referenced it). Verified the
  remote hosts URL (A1) is live; diffed it against the bundled list — the paid edition
  currently adds only `molyn` + `movies4u` flows whose *code* we don't have (needs a §7
  elevate, data rows alone would be inert); our bundled `adlinkfly-links-go` (39) is far
  ahead of the paid remote (4). (2) **D2:** shipped the dedicated **`wpsafelink-button`
  engine** — one generic content.js engine (~126 hosts: horoscop cluster, indobo cluster,
  jobinmeghalaya/tejtime/marketrook chains, generic `#wpsafe-link` onclick/href variants,
  `newwpsafelink` form payloads, script-content variants, kingshort choreography) reusing
  the existing `qy`/`Ay`/`Iy` payload decoders for chained safelink_redirect hops, plus a
  whitelisted `SKIP_WAIT_PAGE_CALL` background listener for page-world
  `wpsafehuman`/`wpsafegenerate`/`continueClicked` calls. **bitcotasks** flow implemented
  (firewall Validate press + page call). `mobiend.com` + `mrproblogger.com` added to
  `adlinkfly-links-go`. (3) **D1:** deleted the `It`/`xt` injector wrappers (generic `St`
  now handles optional frameIds + serialized args with catch); lksfy's adblock-stealth
  MAIN-world script deduplicated into a shared parameterized `swStealth` (ad-regex passed
  as executeScript arg; exeio's extended variant left intact pending a live test).
  (4) **First content.js test coverage ever:** new `tools/smoke-content.mjs` (mocked
  chrome + minimal DOM in a vm) — proves content.js evaluates + runs its flow table, the
  wp-safelink query engine decodes `?safelink_redirect=` payloads, the new
  wpsafelink-button engine handles the `window.open` and `newwpsafelink {linkr}` variants,
  and bitcotasks presses Validate + requests the page call. Both smoke harnesses now run
  inside `verify-release.mjs` — **28/28 green**. (5) Version bumped to **2.2.0**; README
  coverage numbers updated (460+ hostnames / 171 flow types). **Still manual (needs the
  developer's Chrome):** the live-site half of §3.1 — unpacked load, real-site skips
  (try a horoscop-cluster flow + indobo.com for the new engine), DevTools network check,
  popup render at v2.2.0. **D3 question put to the developer.**
- **2026-09-07 (7th pass, part 2 — D3b audio assist shipped, D3 decisions logged)** —
  Implemented the developer-approved **manual-first reCAPTCHA audio assist**: overlay
  "Try audio assist" button (wpsafelink-button engine, only while an unsolved captcha is
  visible), bframe-side audio-challenge driver (switch to audio → download clip via
  background (google.com-only guard) → decode → per-channel WAV → transcribe → fill +
  verify → up to 3 retries), `SKIP_WAIT_AUDIO_STT(_FETCH)` background listeners with
  `no-backend` refusal when no endpoint is set, and a popup "Audio captcha assist
  (optional)" panel storing `skipWaitSttEndpoint`. Smoke coverage extended (relay routing,
  no-backend refusal, endpoint transcription, audio-URL guard, button manual-first
  semantics + click wiring); `verify-release.mjs` 28/28 green. D3a explanation delivered,
  decision pending; D3c approved as the next refactor. **Still manual:** live reCAPTCHA
  audio run in Chrome (needs a real challenge + a configured STT endpoint).

### UI/UX review notes (final freeware popup)
- Layout: one column, ~408px wide, `flex` gap 14px; header → hero card → footer.
- Visual: soft **non-white** gradient background + a single **blue→indigo gradient hero card**
  give a colored, product-like feel while staying small/low-key (VLC-style restraint).
- Content: exactly what the user approved — no store/contact/paid identity, no donate.
- Watch-outs:
  - Popup is designed as a ~408px toolbar popup; opening `popup.html` in a full browser tab
    will look sparse/empty — that is expected, **not** a CSS bug. Judge it loaded unpacked.
  - Only Poppins 400/600/700/800 are bundled; if future text needs a 500/other weight, add the
    matching woff2 + `@font-face` rather than relying on faux-bold synthesis.
