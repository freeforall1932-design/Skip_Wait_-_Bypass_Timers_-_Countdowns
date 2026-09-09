#!/usr/bin/env node
/*
 * Skip Wait — automated part of the HANDOFF §3.1 prior-session review.
 *
 * Verifies, without a browser, everything the §3.1 checklist asks for that
 * can be checked statically:
 *   1. JS syntax      — node --check on background.js / content.js / popup.js
 *   2. Smoke test     — runs tools/smoke-background.mjs (licensing-free +
 *                       functional resolver assertions)
 *   3. manifest.json  — valid JSON, MV3, references only existing files,
 *                       no paywall wording, no removed permissions
 *   4. Paywall swap   — the exact §2 freeware no-ops are present and no
 *                       eas-x / forms.gle / alarms code exists
 *   5. Popup assets   — every font/class/id used by popup.html resolves in
 *                       popup.css / popup.js / bundled files
 *   6. hosts.json     — valid, schema-clean, and every flow key is wired
 *                       to an engine in background.js or content.js
 *
 * The remaining §3.1 items need a real Chrome (load unpacked, live-site
 * timer skip, DevTools network check, popup render) — see HANDOFF §3.1.
 *
 * Usage:
 *   node tools/verify-release.mjs
 * Exits non-zero if any automated check fails.
 */

import { readFileSync, existsSync } from "node:fs";
import { execFileSync, spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const extDir = path.join(root, "Skip_Wait_-_Bypass_Timers_&_Countdowns");

const read = (f) => readFileSync(path.join(extDir, f), "utf8");
const results = [];
const check = (name, ok, detail = "") =>
  results.push({ name, ok, detail }) && console.error(
    `${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`
  );

/* 1 ─ JS syntax -------------------------------------------------------- */
for (const f of ["background.js", "content.js", "popup.js"]) {
  const r = spawnSync(process.execPath, ["--check", path.join(extDir, f)], {
    encoding: "utf8",
  });
  check(
    `node --check ${f}`,
    r.status === 0,
    r.status === 0 ? "" : (r.stderr || "").trim().split("\n")[0]
  );
}

/* 2 ─ smoke tests ------------------------------------------------------ */
for (const smoke of ["smoke-background.mjs", "smoke-content.mjs"]) {
  const r = spawnSync(process.execPath, [path.join(root, "tools", smoke)], {
    encoding: "utf8",
    timeout: 120_000,
  });
  const tail = (r.stdout + r.stderr).trim().split("\n").filter(Boolean);
  check(
    `tools/${smoke}`,
    r.status === 0,
    r.status === 0 ? tail[tail.length - 1] ?? "" : tail.slice(-3).join(" | ")
  );
}

/* 3 ─ manifest --------------------------------------------------------- */
const manifest = JSON.parse(read("manifest.json"));
check("manifest: valid JSON + MV3", manifest.manifest_version === 3);
const versionOk = /^\d+\.\d+\.\d+$/.test(manifest.version);
check(`manifest: semver version (${manifest.version})`, versionOk);
check(
  "manifest: no paywall wording in description",
  !/5 free|per day|license key required|activation/i.test(manifest.description ?? "")
);
{
  const refs = [];
  const walk = (v) => {
    if (typeof v === "string") refs.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(manifest);
  const fileFields = [
    ...(Object.values(manifest.icons ?? {})),
    ...Object.values(manifest.action?.default_icon ?? {}),
    manifest.action?.default_popup,
    manifest.background?.service_worker,
    ...((manifest.content_scripts ?? []).flatMap((cs) => cs.js ?? [])),
    ...((manifest.web_accessible_resources ?? []).flatMap((r) => r.resources ?? [])),
  ].filter(Boolean);
  const missing = fileFields.filter(
    (f) => !existsSync(path.join(extDir, f))
  );
  check(
    "manifest: all referenced files exist",
    missing.length === 0,
    missing.length ? missing.join(", ") : `${fileFields.length} refs ok`
  );
}
check(
  "manifest: alarms permission stays removed",
  !(manifest.permissions ?? []).includes("alarms")
);

/* 4 ─ paywall neutrality ----------------------------------------------- */
const bg = read("background.js");
const ct = read("content.js");
for (const [name, src] of [["background.js", bg], ["content.js", ct]]) {
  check(`${name}: no eas-x.com references`, !src.includes("eas-x"));
  check(`${name}: no forms.gle survey`, !src.includes("forms.gle"));
  check(`${name}: no chrome.alarms usage`, !src.includes("chrome.alarms"));
  check(
    `${name}: no license-key validation strings`,
    !/skipWaitLicense|licenseKey|activation/i.test(src)
  );
}
check(
  "background.js: gate de = async () => !0",
  /de\s*=\s*async\s*\(\)\s*=>\s*!0/.test(bg)
);
check(
  "background.js: EAS validator module fully deleted (no Y= validate remnant)",
  !/\bY\s*=\s*async\s*\(\)\s*=>/.test(bg)
);
check("background.js: counter le = () => {}", /le\s*=\s*\(\)\s*=>\s*\{\}/.test(bg));
check("content.js: gate et = async () => !0", /et\s*=\s*async\s*\(\)\s*=>\s*!0/.test(ct));
check(
  "content.js: EAS validator module fully deleted (no tt= validate remnant)",
  !/\btt\s*=\s*async\s*\(\)\s*=>/.test(ct)
);
check(
  "upstream sync: Freedlink accepts every one-leaf file route",
  ct.includes("Ib = /^\\/([A-Za-z0-9]+)\\/[^/]+$/i,")
);
check(
  "upstream sync: VexoLink resolver and all three page-flow initializers ship",
  bg.includes('const vexolinkSite = "vexolink";') &&
    ct.includes("function initVexolink()") &&
    ct.includes("function initMovies4u()") &&
    ct.includes("function initMolyn()")
);

/* 5 ─ popup assets ----------------------------------------------------- */
{
  const html = read("popup.html");
  const css = read("popup.css");
  const js = read("popup.js");
  const fonts = new Set(
    [...css.matchAll(/url\(["']?([^"')]+\.woff2)["']?\)/g)].map((m) => m[1])
  );
  const missingFonts = [...fonts].filter(
    (f) => !existsSync(path.join(extDir, f))
  );
  check(
    "popup: every @font-face file bundled",
    missingFonts.length === 0,
    missingFonts.length ? missingFonts.join(", ") : `${fonts.size} ok`
  );
  const classes = new Set(
    [...html.matchAll(/class="([^"]+)"/g)].flatMap((m) => m[1].split(/\s+/))
  );
  const cssText = css.replace(/\/\*[\s\S]*?\*\//g, " ");
  const undefinedCls = [...classes].filter(
    (c) => !new RegExp(`\\.${c.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w-])`).test(cssText)
  );
  check(
    "popup: every html class defined in css (or a JS-added dynamic class)",
    undefinedCls.length === 0,
    undefinedCls.length ? undefinedCls.join(", ") : `${classes.size} ok`
  );
  const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
  const missingIds = ids.filter((id) => !js.includes(`"${id}"`) && !js.includes(`'${id}'`) && !html.includes(`#${id}`));
  check(
    "popup: ids referenced by popup.js exist",
    missingIds.length === 0,
    missingIds.length ? missingIds.join(", ") : `${ids.length} ok`
  );
}

/* 6 ─ hosts.json wiring ------------------------------------------------ */
{
  const hosts = JSON.parse(read("hosts.json"));
  const keyRe = /^[a-z][a-z0-9-]{0,63}$/;
  const hostRe = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;
  const badKeys = Object.keys(hosts).filter((k) => !keyRe.test(k));
  const badHosts = Object.entries(hosts).flatMap(([k, v]) =>
    (v?.hosts ?? []).filter((h) => !hostRe.test(String(h).toLowerCase())).map((h) => `${k}:${h}`)
  );
  check(
    "hosts.json: schema clean",
    badKeys.length === 0 && badHosts.length === 0,
    [...badKeys, ...badHosts].join(", ")
  );
  const nHosts = new Set(Object.values(hosts).flatMap((v) => v.hosts ?? [])).size;
  console.error(
    `info  hosts.json: ${Object.keys(hosts).length} flows, ${nHosts} unique hosts`
  );
  const orphan = Object.keys(hosts).filter(
    (k) => !bg.includes(`"${k}"`) && !ct.includes(`"${k}"`)
  );
  check(
    "hosts.json: every flow key is wired to an engine",
    orphan.length === 0,
    orphan.length
      ? `unwired (inert) keys: ${orphan.join(", ")}`
      : "all keys referenced"
  );
}

/* summary -------------------------------------------------------------- */
const failed = results.filter((r) => !r.ok);
console.error(
  `\n${results.length - failed.length}/${results.length} checks passed.` +
    (failed.length ? " FAILURES above must be fixed." : " All automated §3.1 checks green.")
);
process.exit(failed.length ? 1 : 0);
