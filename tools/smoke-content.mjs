#!/usr/bin/env node
/*
 * Skip Wait — content.js smoke test.
 *
 * Loads content.js (an MV3 content script) inside a mocked `chrome.*` +
 * minimal-DOM environment and verifies that it:
 *   1. evaluates without throwing and runs its flow table,
 *   2. the wp-safelink query engine decodes ?safelink_redirect= payloads
 *      and navigates (regression for the shipped Uy engine),
 *   3. the new wpsafelink-button engine extracts a window.open()
 *      destination from #wpsafe-link and navigates after its settle delay,
 *   4. VexoLink sends its resolve/open handshake, Movies4u follows its
 *      Latest Releases handoff, and Molyn displays a fetched key locally,
 *   5. the bitcotasks flow presses Validate once the firewall captcha is
 *      verified and asks the background to call page-world continueClicked.
 *
 * Usage:
 *   node tools/smoke-content.mjs [path/to/content.js]
 */

import { readFileSync } from "node:fs";
import { promises as fsp } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import vm from "node:vm";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const extDir = path.join(root, "Skip_Wait_-_Bypass_Timers_&_Countdowns");
const ctPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(extDir, "content.js");

let failures = 0;
const check = (cond, label) => {
  console.log(`${cond ? "PASS" : "FAIL"}  ${label}`);
  if (!cond) failures += 1;
};

/* ------------------------------------------------------------------ *
 *  Minimal DOM                                                        *
 * ------------------------------------------------------------------ */

class FakeClassList {
  constructor() { this.set = new Set(); }
  add(...c) { c.forEach((x) => this.set.add(x)); }
  remove(...c) { c.forEach((x) => this.set.delete(x)); }
  toggle(c, force) {
    const on = force === undefined ? !this.set.has(c) : !!force;
    on ? this.set.add(c) : this.set.delete(c);
    return on;
  }
  contains(c) { return this.set.has(c); }
}

class FakeElement {
  constructor(tag = "div") {
    this.tagName = String(tag).toUpperCase();
    this.nodeType = 1;
    this.children = [];
    this.parentElement = null;
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.style = {};
    this.dataset = {};
    this.textContent = "";
    this.innerHTML = "";
    this.className = "";
    this.id = "";
    this.href = "";
    this.value = "";
    this.disabled = false;
    this.hidden = false;
    this.offsetParent = {}; // truthy => "visible"
    this.listeners = {};
    this.clicked = 0;
    this.submitted = 0;
    this.replacedChildren = 0;
  }
  appendChild(el) {
    if (el?.nodeType === 1) {
      this.children.push(el);
      el.parentElement = this;
    }
    return el;
  }
  append(...els) { els.forEach((e) => this.appendChild(e)); }
  before(el) { this.parentElement?.appendChild(el); }
  after(el) { this.parentElement?.appendChild(el); }
  replaceChildren(...els) {
    this.replacedChildren += 1;
    this.children = els.filter((e) => e?.nodeType === 1);
    return undefined;
  }
  setAttribute(k, v) { this.attributes.set(k, String(v)); if (k === "id") this.id = String(v); }
  getAttribute(k) { return this.attributes.has(k) ? this.attributes.get(k) : null; }
  removeAttribute(k) { this.attributes.delete(k); }
  addEventListener(type, fn) { (this.listeners[type] ??= []).push(fn); }
  removeEventListener() {}
  click() {
    this.clicked += 1;
    for (const fn of this.listeners.click ?? [])
      try {
        fn({
          preventDefault() {},
          stopPropagation() {},
          composedPath: () => [this],
        });
      } catch {}
  }
  scrollIntoView() {}
  querySelector() { return null; }
  querySelectorAll() { return []; }
  closest() { return null; }
  remove() { this.parentElement = null; }
  requestSubmit() { this.submitted += 1; }
  submit() { this.submitted += 1; }
}

class FakeMutationObserver {
  constructor(cb) { this.cb = cb; }
  observe() {}
  disconnect() {}
  static fires = 0;
}

function makeDocument() {
  const doc = new FakeElement("#document");
  doc.documentElement = new FakeElement("html");
  doc.head = new FakeElement("head");
  doc.body = new FakeElement("body");
  doc.readyState = "complete";
  doc.children = [doc.documentElement];
  doc.addEventListener = () => {};
  doc.removeEventListener = () => {};
  doc.documentElement.appendChild(doc.head);
  doc.documentElement.appendChild(doc.body);
  doc.createElement = (tag) => new FakeElement(tag);
  doc.createElementNS = (_ns, tag) => new FakeElement(tag);
  doc.createTextNode = (text) => ({ nodeType: 3, textContent: text });
  doc.getElementById = () => null;
  doc.querySelector = () => null;
  doc.querySelectorAll = () => [];
  doc.scripts = [];
  return doc;
}

/* ------------------------------------------------------------------ *
 *  Chrome mock                                                        *
 * ------------------------------------------------------------------ */

const storageData = { local: {}, session: {} };
const messages = [];
const listeners = { message: [] };
function storageArea(area) {
  return {
    async get(keys) {
      const out = {};
      if (keys == null) return { ...storageData[area] };
      const list = Array.isArray(keys) ? keys : typeof keys === "string" ? [keys] : Object.keys(keys);
      for (const k of list) {
        if (k in storageData[area]) out[k] = storageData[area][k];
        else if (!Array.isArray(keys) && typeof keys === "object") out[k] = keys[k];
      }
      return out;
    },
    async set(items) {
      Object.assign(storageData[area], items);
      for (const l of listeners.storageChanged ?? []) l(items, area);
    },
    async remove(keys) {
      for (const k of Array.isArray(keys) ? keys : [keys]) delete storageData[area][k];
    },
  };
}

const realChrome = {
  runtime: {
    id: "smoketestcontentid",
    getURL: (p) => pathToFileURL(path.join(extDir, p)).href,
    getManifest: () => JSON.parse(readFileSync(path.join(extDir, "manifest.json"), "utf8")),
    onMessage: {
      addListener: (fn) => listeners.message.push(fn),
      removeListener: (fn) => {
        const index = listeners.message.indexOf(fn);
        if (index >= 0) listeners.message.splice(index, 1);
      },
    },
    sendMessage: async (msg) => {
      messages.push(msg);
      return {};
    },
  },
  storage: {
    local: storageArea("local"),
    session: storageArea("session"),
    onChanged: { addListener: (fn) => (listeners.storageChanged ??= []).push(fn) },
  },
};

const fileFetch = async (input) => {
  const url = typeof input === "string" ? input : input.url;
  if (url.startsWith("file://")) {
    const text = await fsp.readFile(fileURLToPath(url), "utf8");
    return { ok: true, status: 200, url, text: async () => text, json: async () => JSON.parse(text) };
  }
  return { ok: false, status: 503, url, text: async () => "", json: async () => ({}) };
};

/* ------------------------------------------------------------------ *
 *  Sandbox factory                                                    *
 * ------------------------------------------------------------------ */

function makeSandbox({ hostname, pathname = "/", search = "", href, onRuntimeMessage } = {}) {
  const doc = makeDocument();
  const navigations = [];
  const loc = {
    hostname,
    pathname,
    search,
    hash: "",
    origin: `https://${hostname}`,
    href: href ?? `https://${hostname}${pathname}${search}`,
    protocol: "https:",
    host: hostname,
    assign: (u) => navigations.push(u),
    replace: (u) => navigations.push(u),
  };
  const sandbox = {
    document: doc,
    location: loc,
    addEventListener: () => {},
    removeEventListener: () => {},
    console,
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame: (fn) => setTimeout(() => fn(Date.now()), 0),
    cancelAnimationFrame: clearTimeout,
    MutationObserver: FakeMutationObserver,
    getComputedStyle: () => ({ position: "static", display: "block" }),
    Element: FakeElement,
    HTMLElement: FakeElement,
    HTMLFormElement: FakeElement,
    HTMLButtonElement: FakeElement,
    HTMLInputElement: FakeElement,
    HTMLAnchorElement: FakeElement,
    atob: (s) => Buffer.from(s, "base64").toString("binary"),
    btoa: (s) => Buffer.from(s, "binary").toString("base64"),
    TextDecoder,
    TextEncoder,
    crypto,
    URL,
    URLSearchParams,
    AbortController,
    Promise,
    Date,
    JSON,
    Math,
    Object,
    Array,
    Set,
    Map,
    WeakSet,
    WeakMap,
    RegExp,
    String,
    Number,
    Boolean,
    Error,
    TypeError,
    Uint8Array,
    fetch: fileFetch,
    chrome: {
      ...realChrome,
      runtime: {
        ...realChrome.runtime,
        sendMessage: (msg, callback) => {
          messages.push(msg);
          const response = onRuntimeMessage?.(msg) ?? {};
          if (typeof callback === "function") queueMicrotask(() => callback(response));
          return Promise.resolve(response);
        },
      },
    },
    __navigations: navigations,
    __doc: doc,
  };
  sandbox.window = sandbox;
  sandbox.self = sandbox;
  sandbox.top = sandbox;
  sandbox.parent = sandbox;
  sandbox.frameElement = null;
  sandbox.addEventListener = () => {};
  sandbox.removeEventListener = () => {};
  sandbox.globalThis = sandbox;
  return sandbox;
}

/* Selector stubs: map exact selector strings to elements per scenario. */
function installSelectors(sandbox, map) {
  sandbox.__doc.querySelector = (sel) => {
    const v = map.get(sel);
    return Array.isArray(v) ? (v[0] ?? null) : (v ?? null);
  };
  sandbox.__doc.querySelectorAll = (sel) => {
    const v = map.get(sel);
    return Array.isArray(v) ? v : v ? [v] : [];
  };
}

const tick = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ *
 *  Load content.js into a sandbox                                     *
 * ------------------------------------------------------------------ */

async function loadContent(sandbox) {
  const src = await fsp.readFile(ctPath, "utf8");
  const ctx = vm.createContext(sandbox);
  vm.runInContext(src, ctx, { filename: "content.js" });
}

/* ------------------------------------------------------------------ *
 *  Scenario 1: evaluates cleanly on an unrelated page                 *
 * ------------------------------------------------------------------ */

{
  const sb = makeSandbox({ hostname: "unrelated.example" });
  let threw = null;
  try {
    await loadContent(sb);
    await tick(300);
  } catch (e) {
    threw = e;
  }
  check(threw === null, `content.js evaluates and runs its flow table${threw ? ` — ${threw.message}` : ""}`);
}

/* ------------------------------------------------------------------ *
 *  Scenario 2: VexoLink — content-side resolve/open handshake          *
 * ------------------------------------------------------------------ */

{
  messages.length = 0;
  const sb = makeSandbox({
    hostname: "vexo-link.com",
    pathname: "/Abcd123",
    onRuntimeMessage: (msg) => {
      if (msg?.type === "VEXOLINK_RESOLVE") return { ok: true, dest: "https://dest.example/vexo-final" };
      if (msg?.type === "VEXOLINK_OPEN_DEST") return true;
      return {};
    },
  });
  await loadContent(sb);
  await tick(500);
  check(
    messages.some((m) => m?.type === "VEXOLINK_RESOLVE" && m.pageUrl === "https://vexo-link.com/Abcd123") &&
      messages.some((m) => m?.type === "VEXOLINK_OPEN_DEST" && m.url === "https://dest.example/vexo-final"),
    "VexoLink: alias page asks the background to resolve and open the destination",
  );
}

/* ------------------------------------------------------------------ *
 *  Scenario 3: Movies4u — Latest Releases landing handoff             *
 * ------------------------------------------------------------------ */

{
  const sb = makeSandbox({ hostname: "1movies4u.cc", pathname: "/" });
  const defaultFetch = sb.fetch;
  sb.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.startsWith("file:")) return defaultFetch(input, init);
    return {
      ok: true,
      status: 200,
      url,
      text: async () => '<a class="cta-btn btn-1" href="https://latest.example/releases">Latest Releases</a>',
      json: async () => ({}),
    };
  };
  await loadContent(sb);
  await tick(500);
  check(
    sb.__navigations.includes("https://latest.example/releases"),
    `Movies4u: reads and opens the external Latest Releases link (nav: ${JSON.stringify(sb.__navigations)})`,
  );
}

/* ------------------------------------------------------------------ *
 *  Scenario 4: Molyn — key endpoint result is shown locally           *
 * ------------------------------------------------------------------ */

{
  const sb = makeSandbox({ hostname: "molyn.top", pathname: "/fl" });
  const defaultFetch = sb.fetch;
  sb.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input.url;
    if (url.startsWith("file:")) return defaultFetch(input, init);
    return {
      ok: url === "https://molyn.top/api/keys/fetch-key",
      status: 200,
      url,
      text: async () => "",
      json: async () => ({ key: "MOLYN-KEY-123" }),
    };
  };
  const findCode = (el) => {
    if (!el || el.nodeType !== 1) return null;
    if (el.tagName === "CODE" && el.textContent === "MOLYN-KEY-123") return el;
    for (const child of el.children ?? []) {
      const found = findCode(child);
      if (found) return found;
    }
    return null;
  };
  await loadContent(sb);
  await tick(500);
  check(
    !!findCode(sb.__doc.documentElement) && sb.__navigations.length === 0,
    "Molyn: displays the fetched key in the page instead of navigating away",
  );
}

/* ------------------------------------------------------------------ *
 *  Scenario 5: wp-safelink query engine (?safelink_redirect=JSON)     *
 * ------------------------------------------------------------------ */

{
  const payload = Buffer.from(JSON.stringify({ safelink: "https://dest.example/query-final" })).toString("base64");
  const sb = makeSandbox({
    hostname: "techedubyte.com",
    pathname: "/out",
    search: `?safelink_redirect=${encodeURIComponent(payload)}`,
  });
  await loadContent(sb);
  await tick(1200);
  check(
    sb.__navigations.includes("https://dest.example/query-final"),
    `wp-safelink query engine decodes safelink_redirect and navigates (nav: ${JSON.stringify(sb.__navigations)})`,
  );
}

/* ------------------------------------------------------------------ *
 *  Scenario 3: wpsafelink-button — #wpsafe-link onclick window.open   *
 * ------------------------------------------------------------------ */

{
  const sb = makeSandbox({ hostname: "cryptosparatodos.com", pathname: "/go" });
  const anchor = new FakeElement("a");
  anchor.setAttribute("href", "#");
  anchor.setAttribute(
    "onclick",
    "window.open('https://dest.example/button-final', '_self')",
  );
  installSelectors(sb, new Map([
    ["#wpsafe-link a[href]", anchor],
    ["#wpsafe-link a[onclick*=window]", anchor],
    ["#wpsafe-link, #wpsafegenerate, #wpsafelinkhuman, .wpsafelink-button, form[name=dsb], a#btn7, #topButton, #bottomButton, #open-link, input[name=newwpsafelink]", anchor],
  ]));
  await loadContent(sb);
  // settle gate (2s) + click-dest gate (5s) + polling headroom
  await tick(8500);
  check(
    sb.__navigations.includes("https://dest.example/button-final"),
    `wpsafelink-button engine extracts window.open destination and navigates (nav: ${JSON.stringify(sb.__navigations)})`,
  );
}

/* ------------------------------------------------------------------ *
 *  Scenario 4: wpsafelink-button — newwpsafelink base64 {linkr} form  *
 * ------------------------------------------------------------------ */

{
  const sb = makeSandbox({ hostname: "wellness4live.com", pathname: "/landing" });
  const input = new FakeElement("input");
  input.value = Buffer.from(JSON.stringify({ linkr: "https://dest.example/linkr-final" })).toString("base64");
  const marker = new FakeElement("div");
  installSelectors(sb, new Map([
    ["input[name=newwpsafelink]", input],
    ["#wpsafe-link a[href]", null],
    ["#wpsafe-link, #wpsafegenerate, #wpsafelinkhuman, .wpsafelink-button, form[name=dsb], a#btn7, #topButton, #bottomButton, #open-link, input[name=newwpsafelink]", marker],
  ]));
  await loadContent(sb);
  await tick(8500);
  check(
    sb.__navigations.includes("https://dest.example/linkr-final"),
    `wpsafelink-button engine decodes newwpsafelink {linkr} payloads (nav: ${JSON.stringify(sb.__navigations)})`,
  );
}

/* ------------------------------------------------------------------ *
 *  Scenario 5: bitcotasks firewall — Validate press + page call       *
 * ------------------------------------------------------------------ */

{
  const sb = makeSandbox({ hostname: "bitcotasks.com", pathname: "/firewall" });
  const container = new FakeElement("div");
  container.setAttribute("id", "captcha-container");
  const badge = new FakeElement("p");
  badge.className = "mb-2";
  badge.textContent = "Verified";
  const validateBtn = new FakeElement("button");
  validateBtn.textContent = "Validate";
  installSelectors(sb, new Map([
    ["#captcha-container", container],
    ["button, input[type=button], input[type=submit]", [validateBtn]],
  ]));
  // .mb-2 badges are looked up via querySelectorAll
  const withBadges = (fn) => (sel) => (sel === ".mb-2" ? [badge] : fn(sel));
  const qsa = sb.__doc.querySelectorAll;
  sb.__doc.querySelectorAll = withBadges(qsa);
  await loadContent(sb);
  await tick(4000);
  check(validateBtn.clicked >= 1, "bitcotasks: Validate button pressed after captcha verified");
  check(
    messages.some((m) => m?.type === "SKIP_WAIT_PAGE_CALL" && m.name === "continueClicked"),
    "bitcotasks: page-world continueClicked requested via background",
  );
}

/* ------------------------------------------------------------------ *
 *  Scenario 6: audio-assist button is manual-first and wired          *
 * ------------------------------------------------------------------ */

{
  const sb = makeSandbox({ hostname: "cryptosparatodos.com", pathname: "/go" });
  const anchor = new FakeElement("a");
  anchor.setAttribute("href", "#");
  anchor.setAttribute("onclick", "window.open('https://dest.example/late', '_self')");
  const captchaBox = new FakeElement("div");
  captchaBox.className = "g-recaptcha";
  const captchaInput = new FakeElement("textarea");
  captchaInput.setAttribute("id", "g-recaptcha-response");
  captchaInput.value = ""; // unsolved
  installSelectors(sb, new Map([
    ["#wpsafe-link a[href]", anchor],
    ["#wpsafe-link a[onclick*=window]", anchor],
    [".g-recaptcha", captchaBox],
    [".g-recaptcha, .h-captcha, .cf-turnstile, #captcha-container", captchaBox],
    ['#g-recaptcha-response, textarea[name="g-recaptcha-response"], [name="h-captcha-response"], [name="cf-turnstile-response"]', captchaInput],
  ]));
  const findBtn = (el, out = []) => {
    if (!el || el.nodeType !== 1) return out;
    if (el.textContent === "Try audio assist") out.push(el);
    (el.children ?? []).forEach((c) => findBtn(c, out));
    return out;
  };
  await loadContent(sb);
  await tick(2500);
  const before = messages.filter((m) => m?.type === "SKIP_WAIT_AUDIO_ASSIST_START").length;
  check(before === 0, "audio assist: nothing is attempted automatically (manual-first)");
  const btns = findBtn(sb.__doc.documentElement);
  check(btns.length === 1, `audio assist: "Try audio assist" button appears on captcha step (found ${btns.length})`);
  if (btns.length) btns[0].click();
  await tick(200);
  const after = messages.filter((m) => m?.type === "SKIP_WAIT_AUDIO_ASSIST_START").length;
  check(after === 1, "audio assist: pressing the button requests one assisted attempt");
  // Frame-side listener must ignore the relay outside recaptcha frames.
  const frameListeners = listeners.message;
  let responded = null;
  for (const l of frameListeners) {
    try {
      const keepOpen = l({ type: "SKIP_WAIT_AUDIO_ASSIST_FRAME" }, {}, (r) => {
        responded = r;
      });
      if (keepOpen) await tick(300); // async responders
    } catch {}
  }
  check(responded === null, "audio assist: relay outside a recaptcha frame is a no-op");
}

/* ------------------------------------------------------------------ *
 *  Scenario 7: wpsafelink-button hosttbuzz skin (#getmylnk form)      *
 * ------------------------------------------------------------------ */

{
  messages.length = 0; // isolate this scenario's message assertions
  const sb = makeSandbox({ hostname: "hosttbuzz.com", pathname: "/get" });
  const form = new FakeElement("form");
  form.setAttribute("id", "getmylnk");
  const marker = new FakeElement("div");
  installSelectors(sb, new Map([
    ["form[name=dsb], #nextpage, #getmylnk", [form]],
    ["#wpsafe-link, #wpsafegenerate, #wpsafelinkhuman, .wpsafelink-button, form[name=dsb], #nextpage, #getmylnk, .btn-captcha, a#btn7, #topButton, #bottomButton, #open-link, input[name=newwpsafelink]", marker],
  ]));
  await loadContent(sb);
  await tick(4500);
  check(
    form.submitted >= 1,
    `wpsafelink-button hosttbuzz skin: #getmylnk form submitted (submit count: ${form.submitted})`,
  );
  // ...and the captcha-less page must NOT have asked for audio assist.
  check(
    messages.filter((m) => m?.type === "SKIP_WAIT_AUDIO_ASSIST_START").length === 0,
    "hosttbuzz skin: no audio-assist attempt without a captcha widget",
  );
}

console.log(
  failures === 0
    ? "\nsmoke-content: OK — content.js evaluates and synced page flows behave."
    : `\nsmoke-content: ${failures} FAILURE(S)`,
);
process.exit(failures === 0 ? 0 : 1);
