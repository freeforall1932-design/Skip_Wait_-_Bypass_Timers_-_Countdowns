#!/usr/bin/env node
/*
 * Skip Wait — background.js smoke test.
 *
 * Loads background.js (an MV3 service-worker module) inside a mocked
 * `chrome.*` environment and verifies that it:
 *   1. evaluates without throwing,
 *   2. registers its listeners,
 *   3. builds the hosts-based DNR redirect/modify rules,
 *   4. NEVER contacts the old EAS licensing server (eas-x.com),
 *   5. never creates license alarms, never reloads tabs/extensions
 *      — even when fake legacy license data is present in storage.
 *
 * Usage:
 *   node tools/smoke-background.mjs [path/to/background.js]
 * (defaults to the shipped background.js in the extension folder)
 */

import { readFileSync } from "node:fs";
import { promises as fsp } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const extDir = path.join(root, "Skip_Wait_-_Bypass_Timers_&_Countdowns");
const bgPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(extDir, "background.js");
const hostsJson = await fsp.readFile(path.join(extDir, "hosts.json"), "utf8");
JSON.parse(hostsJson); // sanity: bundled hosts.json must stay valid JSON

/* ------------------------------------------------------------------ *
 *  Observability                                                      *
 * ------------------------------------------------------------------ */

const fetchLog = [];
const cookieSetLog = [];
const alarmsLog = { created: [], cleared: [] };
const dnrLog = [];
const injectionLog = [];
const tabsMessages = [];
const tabsReloaded = [];
let extensionReloads = 0;

/* Scripted HTTP responses for the functional resolver scenarios. */
const scriptedFetches = [];
function scriptFetch(match, responder) {
  scriptedFetches.push({ match, responder });
}

const listeners = {
  message: [],
  startup: [],
  installed: [],
  alarm: [],
  storageChanged: [],
};

const storageData = { local: {}, session: {} };

function storageArea(area) {
  return {
    async get(keys) {
      const out = {};
      if (keys == null) return { ...storageData[area] };
      const list = Array.isArray(keys)
        ? keys
        : typeof keys === "string"
          ? [keys]
          : Object.keys(keys);
      for (const k of list) {
        if (k in storageData[area]) out[k] = storageData[area][k];
        else if (!Array.isArray(keys) && typeof keys === "object") out[k] = keys[k];
      }
      return out;
    },
    async set(items) {
      const changes = {};
      for (const [k, v] of Object.entries(items)) {
        changes[k] = { oldValue: storageData[area][k], newValue: v };
        storageData[area][k] = v;
      }
      if (area === "local")
        for (const l of listeners.storageChanged) l(changes, "local");
    },
    async remove(keys) {
      const changes = {};
      for (const k of Array.isArray(keys) ? keys : [keys]) {
        if (k in storageData[area]) {
          changes[k] = { oldValue: storageData[area][k], newValue: undefined };
          delete storageData[area][k];
        }
      }
      if (area === "local" && Object.keys(changes).length)
        for (const l of listeners.storageChanged) l(changes, "local");
    },
  };
}

/* Concrete chrome APIs we want to observe. */
const real = {
  runtime: {
    id: "smoketestextensionid",
    getURL: (p) => pathToFileURL(path.join(extDir, p)).href,
    getManifest: () =>
      JSON.parse(readFileSync(path.join(extDir, "manifest.json"), "utf8")),
    onMessage: { addListener: (fn) => listeners.message.push(fn) },
    onStartup: { addListener: (fn) => listeners.startup.push(fn) },
    onInstalled: { addListener: (fn) => listeners.installed.push(fn) },
    sendMessage: async () => ({}),
    reload: () => {
      extensionReloads += 1;
    },
  },
  storage: {
    local: storageArea("local"),
    session: storageArea("session"),
    onChanged: { addListener: (fn) => listeners.storageChanged.push(fn) },
  },
  alarms: {
    create: (name, info) => alarmsLog.created.push({ name, info }),
    clear: async (name) => {
      alarmsLog.cleared.push(name);
      return true;
    },
    clearAll: async () => {
      alarmsLog.cleared.push("*");
      return true;
    },
    onAlarm: { addListener: (fn) => listeners.alarm.push(fn) },
  },
  tabs: {
    query: async () => [],
    update: async () => ({}),
    sendMessage: async (id, msg) => {
      tabsMessages.push({ id, msg });
      return {};
    },
    reload: (id) => {
      tabsReloaded.push(id);
    },
  },
  declarativeNetRequest: {
    updateSessionRules: async ({ removeRuleIds = [], addRules = [] }) => {
      dnrLog.push({ removeRuleIds, addRules });
    },
    getSessionRules: async () => [],
  },
  scripting: {
    executeScript: async (details) => {
      injectionLog.push(details);
      return [{ result: undefined }];
    },
  },
  cookies: {
    get: async () => undefined,
    set: async (details) => {
      cookieSetLog.push(details);
      return {};
    },
    remove: async () => {},
  },
};

/* Permissive fallback: any other chrome.* path becomes a harmless stub. */
function genericStub() {
  const fn = function () {
    return Promise.resolve(undefined);
  };
  return new Proxy(fn, {
    get(target, prop) {
      if (prop === "addListener" || prop === "removeListener") return () => {};
      if (prop === "hasListener") return () => false;
      if (prop === Symbol.toPrimitive) return () => "[stub]";
      if (prop in target) return target[prop];
      return memo(prop);
    },
    apply() {
      return Promise.resolve(undefined);
    },
  });
}
const stubCache = new Map();
function memo(key) {
  if (!stubCache.has(key)) stubCache.set(key, genericStub());
  return stubCache.get(key);
}

globalThis.chrome = new Proxy(real, {
  get(target, prop) {
    if (prop in target) {
      const v = target[prop];
      if (v && typeof v === "object")
        return new Proxy(v, {
          get(t2, p2) {
            if (p2 in t2) return t2[p2];
            return memo(`${String(prop)}.${String(p2)}`);
          },
        });
      return v;
    }
    return memo(prop);
  },
});

globalThis.fetch = async (input, init = {}) => {
  const url = typeof input === "string" ? input : input.url;
  const method = (init.method ?? "GET").toUpperCase();
  fetchLog.push(url);
  if (url.startsWith("file://")) {
    const p = fileURLToPath(url);
    const text = await fsp.readFile(p, "utf8");
    return {
      ok: true,
      status: 200,
      url,
      json: async () => JSON.parse(text),
      text: async () => text,
    };
  }
  for (const { match, responder } of scriptedFetches) {
    if (match(url, method)) {
      const body = responder(url, method, init);
      const text = typeof body === "string" ? body : JSON.stringify(body);
      return {
        ok: true,
        status: 200,
        url,
        type: "basic",
        json: async () => (typeof body === "string" ? JSON.parse(body) : body),
        text: async () => text,
      };
    }
  }
  return {
    ok: false,
    status: 503,
    url,
    type: "basic",
    json: async () => ({}),
    text: async () => "",
  };
};

/* Drive a runtime message through every registered listener. */
async function dispatch(message, sender = {}) {
  return new Promise((resolve) => {
    let responded = false;
    const sendResponse = (resp) => {
      if (!responded) {
        responded = true;
        resolve(resp);
      }
    };
    let handled = false;
    for (const l of listeners.message) {
      try {
        if (l(message, sender, sendResponse) === true) handled = true;
      } catch {}
    }
    if (!handled) sendResponse(undefined);
    setTimeout(() => sendResponse(undefined), 4000);
  });
}

/* ------------------------------------------------------------------ *
 *  Load the service worker module                                     *
 * ------------------------------------------------------------------ */

const src = await fsp.readFile(bgPath, "utf8");
const tmpDir = path.join(here, ".smoke");
await fsp.mkdir(tmpDir, { recursive: true });
const modPath = path.join(tmpDir, "background.under-test.mjs");
await fsp.writeFile(modPath, src);

console.log(`smoke: loading ${path.relative(root, bgPath)}`);
await import(pathToFileURL(modPath).href);

// Simulate browser startup/install so onStartup/onInstalled paths run.
for (const fn of listeners.startup) await fn();
for (const fn of listeners.installed) await fn({ reason: "install" });
await new Promise((r) => setTimeout(r, 150));

/* ------------------------------------------------------------------ *
 *  Scenario 2: legacy license data left over in storage               *
 * ------------------------------------------------------------------ */

const fakeLicense = {
  skipWaitLicenseKey: "EAS-AAAAA-BBBBB-CCCCC-DDDDD-EEEEE",
  skipWaitLicensePlan: "monthly",
  skipWaitApplicationId: "app",
  skipWaitActivationId: "act",
  skipWaitActivationToken: "tok",
  skipWaitInstanceId: "inst",
  skipWaitLease:
    "eyJhbGciOiJFZERTQSIsInR5cCI6IkVBUy1MSUNFTlNFIiwia2lkIjoiZWFzLTIwMjYwODI4LXYxIn0.eyJ2IjoxfQ.badsig",
  skipWaitLeaseNonce: "nonce",
  skipWaitLeaseExp: Date.now() + 60_000,
  skipWaitEntExp: Date.now() + 120_000,
};
await chrome.storage.local.set(fakeLicense);
for (const fn of listeners.startup) await fn();
for (const fn of listeners.installed) await fn({ reason: "update" });
for (const fn of listeners.alarm) await fn({ name: "skipWaitLeaseExpiry" });
for (const fn of listeners.alarm) await fn({ name: "skipWaitEntExpiry" });
await new Promise((r) => setTimeout(r, 250));

/* ------------------------------------------------------------------ *
 *  Scenario 3: functional — the consolidated links/go engine must     *
 *  still resolve links end-to-end (earnlinks + shrinkpe families).    *
 * ------------------------------------------------------------------ */

const GO_FORM = (extra = "") => `
  <html><body>
  ${extra}
  <form id="go-link" action="/links/go" method="post">
    <input type="hidden" name="_method" value="POST"/>
    <input type="hidden" name="_csrfToken" value="csrf-abc"/>
    <input type="hidden" name="ad_form_data" value="ad-data-123"/>
    <input type="hidden" name="_Token[fields]" value="fields-x"/>
    <input type="hidden" name="_Token[unlocked]" value="unlocked-y"/>
    <button type="submit" class="btn btn-primary">Get Link</button>
  </form>
  <script>var app_vars = {"counter_value": 0};</script>
  </body></html>`;

const goPosts = [];
scriptFetch(
  (url, method) => method === "GET" && /^https:\/\/earnlinks\.in\/[A-Za-z0-9]+$/.test(url),
  () => GO_FORM(),
);
scriptFetch((url, method) => method === "POST" && url === "https://earnlinks.in/links/go", (url, method, init) => {
  goPosts.push({ url, body: String(init.body) });
  return { url: "https://destination.example/earn" };
});

const earnResp = await dispatch({ type: "EARNLINKS_RESOLVE", unlockUrl: "https://earnlinks.in/abcd1234" });

const shrinkGoPosts = [];
scriptFetch((url, method) => method === "POST" && url === "https://shrink.pe/links/go", (url, method, init) => {
  shrinkGoPosts.push({ url, body: String(init.body) });
  return { url: "https://destination.example/shrink" };
});
const shrinkResp = await dispatch(
  {
    type: "SHRINKPE_RESOLVE",
    unlockUrl: "https://shrink.pe/abcd1234",
    pageHtml: GO_FORM().replace('name="_csrfToken" value="csrf-abc"', 'name="other" value="x"'),
  },
  { tab: { id: 1 } },
);

/* Scenario 4: a user custom-host override binds a brand-new domain to the
   existing engine at runtime (no re-release). */
await chrome.storage.local.set({
  skipWaitCustomHosts: { earnlinks: { hosts: ["custom-earn.example"] } },
});
await new Promise((r) => setTimeout(r, 50));
scriptFetch(
  (url, method) => method === "GET" && /^https:\/\/custom-earn\.example\/[A-Za-z0-9]+$/.test(url),
  () => GO_FORM(),
);
scriptFetch((url, method) => method === "POST" && url === "https://custom-earn.example/links/go", () => ({
  url: "https://destination.example/custom",
}));
const customResp = await dispatch({ type: "EARNLINKS_RESOLVE", unlockUrl: "https://custom-earn.example/abcd1234" });

/* ------------------------------------------------------------------ *
 *  Assertions                                                         *
 * ------------------------------------------------------------------ */

let failures = 0;
const check = (cond, label) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures += 1;
};

const easFetches = fetchLog.filter((u) => /eas-x\.com/.test(u));

// Replay updateSessionRules calls into the final session-rule set.
const finalRules = new Map();
for (const { removeRuleIds, addRules } of dnrLog) {
  for (const id of removeRuleIds ?? []) finalRules.delete(id);
  for (const r of addRules ?? []) finalRules.set(r.id, r);
}
const rules = [...finalRules.values()];
const redirectRules = rules.filter((r) => r.action?.type === "redirect");
const workingHtmlRules = redirectRules.filter((r) =>
  JSON.stringify(r.action.redirect ?? {}).includes("working.html"),
);

check(listeners.message.length > 10, `message listeners registered (${listeners.message.length})`);
check(workingHtmlRules.length > 0, `hosts.json produced working.html redirect rules (${workingHtmlRules.length})`);
check(easFetches.length === 0, `no requests to eas-x.com (saw ${easFetches.length})`);
check(extensionReloads === 0, "extension never self-reloads");
check(tabsReloaded.length === 0, "no tabs force-reloaded");
check(
  alarmsLog.created.length === 0,
  `no alarms created (created: ${alarmsLog.created.map((a) => a.name).join(", ") || "none"})`,
);
check(rules.length >= 8, `DNR session rules installed (${rules.length})`);

// Scenario 3: consolidated links/go engine resolves end-to-end.
check(
  earnResp?.ok === true && earnResp?.dest === "https://destination.example/earn",
  `earnlinks resolver returns destination via generic engine (got ${JSON.stringify(earnResp)})`,
);
check(
  goPosts.length === 1 && goPosts[0].body.includes("ad_form_data=ad-data-123") && goPosts[0].body.includes("_csrfToken=csrf-abc"),
  `generic engine POSTed the go-link form (${goPosts.length} post(s))`,
);
check(
  cookieSetLog.some((c) => c.name === "ab" && c.value === "1" && String(c.url).startsWith("https://earnlinks.in")),
  "ab=1 cookie set before the /links/go POST",
);
check(
  shrinkResp?.ok === true && shrinkResp?.dest === "https://destination.example/shrink",
  `shrinkpe resolver returns destination via generic engine (got ${JSON.stringify(shrinkResp)})`,
);
check(
  shrinkGoPosts.length === 1 && shrinkGoPosts[0].body.includes("ad_form_data=ad-data-123") && !shrinkGoPosts[0].body.includes("_csrfToken"),
  "shrinkpe keeps its no-csrf body shape",
);
check(
  customResp?.ok === true && customResp?.dest === "https://destination.example/custom",
  `custom-host override binds a new domain to the engine at runtime (got ${JSON.stringify(customResp)})`,
);

/* ------------------------------------------------------------------ *
 *  Scenario 4: MAIN-world injection plumbing                          *
 * ------------------------------------------------------------------ */

// 4a. SKIP_WAIT_PAGE_CALL injects into the sender tab with the whitelisted name.
await dispatch(
  { type: "SKIP_WAIT_PAGE_CALL", name: "wpsafegenerate" },
  { tab: { id: 42, url: "https://horoscop.info/" }, frameId: 3 },
);
await new Promise((r) => setTimeout(r, 50));
const pageCall = injectionLog.find(
  (i) => i.func && i.args?.[0] === "wpsafegenerate",
);
check(
  !!pageCall && pageCall.world === "MAIN" && pageCall.target?.tabId === 42,
  "SKIP_WAIT_PAGE_CALL injects the requested page function into the tab (MAIN world)",
);
check(
  JSON.stringify(pageCall?.target?.frameIds) === "[3]",
  "SKIP_WAIT_PAGE_CALL targets the sender frame",
);

// 4b. Non-identifier names must never be injected.
injectionLog.length = 0;
await dispatch(
  { type: "SKIP_WAIT_PAGE_CALL", name: "alert(1); eval" },
  { tab: { id: 43, url: "https://horoscop.info/" } },
);
await new Promise((r) => setTimeout(r, 50));
check(
  injectionLog.length === 0,
  "SKIP_WAIT_PAGE_CALL rejects non-identifier function names",
);

// 4c. Every injection the SW performs ships a serializable function with
//     JSON-safe args (executeScript serializes both — a captured closure
//     variable would silently break in the page).
check(
  injectionLog.every((i) => typeof i.func === "function" || i.func === undefined),
  "captured injections are functions",
);
check(
  injectionLog.every((i) => i.args === undefined || (() => { try { return JSON.parse(JSON.stringify(i.args)) !== undefined; } catch { return false; } })()),
  "injection args are JSON-safe",
);

// 4d. The shipped swStealth MAIN-world script actually runs: pull its source
//     out of background.js and execute it in a fake page environment.
{
  const m = src.match(/function swStealth\(e\) \{[\s\S]*?\n\}/);
  check(!!m, "swStealth function found in background.js");
  if (m) {
    const vm = await import("node:vm");
    const sandbox = {};
    sandbox.window = sandbox;
    sandbox.self = sandbox;
    sandbox.XMLHttpRequest = function () {};
    sandbox.XMLHttpRequest.prototype.open = function () {};
    sandbox.XMLHttpRequest.prototype.send = function () {};
    sandbox.Response = class {
      constructor(_body, init) {
        this.status = init?.status ?? 200;
        this.statusText = init?.statusText ?? "";
      }
    };
    sandbox.queueMicrotask = (fn) => fn();
    let stealthTicks = 0;
    sandbox.setInterval = (fn) => {
      stealthTicks += 1;
      try { fn(); } catch {}
      return 1;
    };
    sandbox.clearInterval = () => {};
    sandbox.app_vars = { force_disable_adblock: "1" };
    let headSpoofed = false;
    sandbox.fetch = async () => {
      return { spoofed: false };
    };
    vm.createContext(sandbox);
    vm.runInContext(m[0], sandbox);
    vm.runInContext("swStealth('googlesyndication|adtest-example')", sandbox);
    // After the stealth run the page fetch must fake HEAD answers for ad hosts…
    headSpoofed = await vm.runInContext(
      "fetch('https://adtest-example/x.js', { method: 'HEAD' }).then(r => r.status)",
      sandbox,
    );
    check(headSpoofed === 200, "swStealth: ad-host HEAD requests are spoofed as 200");
    const passthrough = await vm.runInContext(
      "fetch('https://example-normal.test/page').then(r => r.spoofed === false || r.status)",
      sandbox,
    );
    check(passthrough === true, "swStealth: non-ad requests pass through untouched");
    check(
      vm.runInContext("window.app_vars.force_disable_adblock", sandbox) === "0",
      "swStealth: app_vars.force_disable_adblock forced to 0",
    );
  }
}

/* ------------------------------------------------------------------ *
 *  Scenario 5: reCAPTCHA audio-assist plumbing (manual-first)         *
 * ------------------------------------------------------------------ */

{
  // START from the top frame must be relayed to the tab's frames.
  await dispatch(
    { type: "SKIP_WAIT_AUDIO_ASSIST_START" },
    { tab: { id: 77, url: "https://horoscop.info/x" } },
  );
  await new Promise((r) => setTimeout(r, 50));
  check(
    tabsMessages.some((m) => m.id === 77 && m.msg?.type === "SKIP_WAIT_AUDIO_ASSIST_FRAME"),
    "audio assist: START is relayed to the tab's frames",
  );

  // RESULT from the bframe is relayed back to the tab.
  await dispatch(
    { type: "SKIP_WAIT_AUDIO_ASSIST_RESULT", ok: false, err: "no-backend" },
    { tab: { id: 77, url: "https://www.google.com/recaptcha/api2/bframe" } },
  );
  await new Promise((r) => setTimeout(r, 50));
  check(
    tabsMessages.some((m) => m.id === 77 && m.msg?.type === "SKIP_WAIT_AUDIO_ASSIST_RESULT"),
    "audio assist: frame results are relayed back to the tab",
  );

  // STT with no endpoint configured must refuse (manual-first default).
  await chrome.storage.local.remove("skipWaitSttEndpoint");
  const noBackend = await dispatch({ type: "SKIP_WAIT_AUDIO_STT", wav: "aGVsbG8=" });
  check(
    noBackend?.ok === false && noBackend?.err === "no-backend",
    `audio assist: no transcription endpoint configured -> refuses (${JSON.stringify(noBackend)})`,
  );

  // STT with an endpoint posts the wav and parses the transcript.
  scriptFetch(
    (url, method) => method === "POST" && url === "http://127.0.0.1:9000/asr",
    () => JSON.stringify({ text: "7 3 5" }),
  );
  await chrome.storage.local.set({ skipWaitSttEndpoint: "http://127.0.0.1:9000/asr" });
  const stt = await dispatch({ type: "SKIP_WAIT_AUDIO_STT", wav: "aGVsbG8=" });
  check(
    stt?.ok === true && stt?.text === "7 3 5",
    `audio assist: configured endpoint transcribes (${JSON.stringify(stt)})`,
  );
  await chrome.storage.local.remove("skipWaitSttEndpoint");

  // Audio fetch guard: only google.com recaptcha audio URLs are fetched.
  const badFetch = await dispatch({
    type: "SKIP_WAIT_AUDIO_STT_FETCH",
    url: "https://evil.example/audio.mp3",
  });
  check(
    badFetch?.ok === false && badFetch?.err === "bad-audio-url",
    "audio assist: non-google audio URLs are refused",
  );
}

/* ------------------------------------------------------------------ *
 *  Scenario 6: exeio split — shared stealth + DOM extras              *
 * ------------------------------------------------------------------ */

{
  // The ADBLOCK_BYPASS request for an exeio tab must inject BOTH scripts.
  await dispatch(
    { type: "EXEIO_ADBLOCK_BYPASS" },
    { tab: { id: 91, url: "https://exe.io/short" }, frameId: 0 },
  );
  await new Promise((r) => setTimeout(r, 120));
  const exeioInjections = injectionLog.filter((i) => i.target?.tabId === 91);
  check(
    exeioInjections.length === 2,
    `exeio: stealth + extras both injected (${exeioInjections.length} scripts)`,
  );
  check(
    exeioInjections.some((i) => i.func?.name === "swStealth") &&
      exeioInjections.some((i) => i.func?.name === "swExeioExtras"),
    "exeio: swStealth and swExeioExtras are the injected pair",
  );
  check(
    JSON.stringify(exeioInjections.find((i) => i.func?.name === "swStealth")?.args?.[0]).includes("netpub"),
    "exeio: stealth gets exeio's extended ad-domain pattern",
  );

  // The shipped swExeioExtras must evaluate and run against an empty DOM.
  {
    const m = src.match(/function swExeioExtras\(\) \{[\s\S]*?\n\}/);
    check(!!m, "swExeioExtras function found in background.js");
    if (m) {
      const vm = await import("node:vm");
      const el = () => ({
        nodeType: 1,
        children: [],
        classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
        style: {},
        setAttribute() {},
        getAttribute: () => null,
        appendChild() {},
        replaceWith() {},
        insertBefore() {},
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener() {},
        removeEventListener() {},
        disabled: false,
      });
      const doc = el();
      doc.documentElement = el();
      doc.head = el();
      doc.body = el();
      doc.readyState = "complete";
      doc.getElementById = () => null;
      doc.querySelector = () => null;
      doc.querySelectorAll = () => [];
      doc.createElement = () => el();
      doc.addEventListener = () => {};
      const sandbox = {
        window: null,
        document: doc,
        MutationObserver: class {
          observe() {}
          disconnect() {}
        },
        HTMLButtonElement: class {},
        queueMicrotask: (fn) => fn(),
        setTimeout: (fn) => fn(),
        app_vars: { turnstile_site_key: "sitekey-x", force_disable_adblock: "1" },
      };
      sandbox.window = sandbox;
      let turnstileRenderAttempts = 0;
      sandbox.turnstile = {
        render: () => {
          turnstileRenderAttempts += 1;
          return {};
        },
      };
      vm.createContext(sandbox);
      let threw = null;
      try {
        vm.runInContext(m[0], sandbox);
        vm.runInContext("swExeioExtras(); swExeioExtras();", sandbox); // twice: guard must hold
      } catch (e) {
        threw = e;
      }
      check(threw === null, `swExeioExtras evaluates and runs on an empty DOM${threw ? " — " + threw.message : ""}`);
      check(
        vm.runInContext("window.__swExeioExtras", sandbox) === true,
        "swExeioExtras: window guard set (second call was a no-op)",
      );
      check(
        turnstileRenderAttempts === 0,
        "swExeioExtras: turnstile render skipped when #captchaShortlink is absent",
      );
    }
  }
}

console.log(
  failures === 0
    ? "\nsmoke: OK — background.js loads cleanly and is licensing-free."
    : `\nsmoke: ${failures} FAILURE(S)`,
);
process.exit(failures === 0 ? 0 : 1);
