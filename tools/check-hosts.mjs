#!/usr/bin/env node
/*
 * Skip Wait — live reachability check for every host in hosts.json.
 *
 * NOTE: run this on a machine with normal internet egress (the dev
 * sandbox has no outbound web access, so results there are meaningless).
 * It complements the in-Chrome §3.1 checklist: before loading unpacked,
 * run this to prune hosts whose domains died or were parked.
 *
 * Resolves DNS and issues a HEAD (fallback GET) request for each bundled
 * hostname and reports:
 *   DEAD      — DNS/connection/TLS failure
 *   PARKED    — responds, but looks like a registrar parking / sell page
 *   SLOW?     — timed out at probe level (may still work; inconclusive)
 *
 * The probe is passive: one request per host, no bypass attempts, no
 * cookies, a desktop UA, and a short timeout. Results are printed as a
 * grouped report and written to tools/host-check-report.json.
 *
 * Usage:
 *   node tools/check-hosts.mjs [--flow <name>] [--timeout <ms>] [--json]
 */

import { readFileSync, writeFileSync } from "node:fs";
import dns from "node:dns/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const extDir = path.join(root, "Skip_Wait_-_Bypass_Timers_&_Countdowns");

const args = process.argv.slice(2);
const argOf = (flag, def) => {
  const i = args.indexOf(flag);
  return i >= 0 && args[i + 1] ? args[i + 1] : def;
};
const onlyFlow = argOf("--flow", null);
const timeoutMs = Number(argOf("--timeout", "9000"));
const asJson = args.includes("--json");

const hosts = JSON.parse(
  readFileSync(path.join(extDir, "hosts.json"), "utf8")
);

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36";

const PARKED_RE =
  /(this domain is for sale|domain (is )?parked|buy this domain|godaddy.*parked|sedoparking|dan\.com|afternic|hugedomains|domain may be for sale)/i;

function fetchWithTimeout(url, ms, method = "HEAD") {
  const ctl = new AbortController();
  const timer = setTimeout(() => ctl.abort(), ms);
  return fetch(url, {
    method,
    redirect: "follow",
    signal: ctl.signal,
    headers: { "user-agent": UA, accept: "text/html,*/*" },
  }).finally(() => clearTimeout(timer));
}

async function probe(host) {
  const out = { host, status: "OK", detail: "" };
  let addrs = null;
  try {
    addrs = await dns.resolve4(host);
  } catch (e) {
    try {
      addrs = await dns.resolve6(host);
    } catch {
      out.status = "DEAD";
      out.detail = `dns: ${e.code ?? e.message}`;
      return out;
    }
  }
  out.ip = addrs?.[0];

  for (const scheme of ["https", "http"]) {
    const url = `${scheme}://${host}/`;
    for (const method of ["HEAD", "GET"]) {
      try {
        const res = await fetchWithTimeout(url, timeoutMs, method);
        out.httpStatus = res.status;
        out.finalUrl = res.url;
        // Parking pages often survive as 200s — sniff body on GET.
        if (method === "GET") {
          try {
            const text = (await res.text()).slice(0, 20000);
            if (PARKED_RE.test(text)) {
              out.status = "PARKED";
              out.detail = "registrar parking page";
            }
          } catch {}
        }
        if (out.status === "OK" && res.status >= 400 && res.status < 500) {
          out.status = "HTTP_" + res.status;
          out.detail = "client error on root (may still serve deep links)";
        }
        return out;
      } catch (e) {
        const msg = String(e?.cause?.code ?? e?.name ?? e);
        if (msg === "AbortError") {
          out.status = "SLOW?";
          out.detail = `timeout after ${timeoutMs}ms (${method} ${scheme})`;
        } else {
          out.status = "DEAD";
          out.detail = `${msg} (${method} ${scheme})`;
        }
        // try next combination; remember last error
      }
    }
  }
  return out;
}

const flowFor = {};
for (const [flow, { hosts: hs }] of Object.entries(hosts))
  for (const h of hs ?? []) (flowFor[h] ??= []).push(flow);

const allHosts = onlyFlow
  ? (hosts[onlyFlow]?.hosts ?? [])
  : Object.keys(flowFor).sort();

console.error(
  `Probing ${allHosts.length} hosts (timeout ${timeoutMs}ms)…\n`
);

const results = [];
const CONC = 12;
let idx = 0;
async function worker() {
  while (idx < allHosts.length) {
    const h = allHosts[idx++];
    const r = await probe(h);
    results.push(r);
    process.stderr.write(
      `${r.status.padEnd(8)} ${h}${r.detail ? `  — ${r.detail}` : ""}\n`
    );
  }
}
await Promise.all(Array.from({ length: CONC }, worker));

const dead = results.filter((r) => r.status === "DEAD");
const parked = results.filter((r) => r.status === "PARKED");
const slow = results.filter((r) => r.status === "SLOW?");
const other = results.filter((r) => /^HTTP_/.test(r.status));

const report = { generatedAt: new Date().toISOString(), results };
writeFileSync(
  path.join(here, "host-check-report.json"),
  JSON.stringify(report, null, 2)
);

if (!asJson) {
  console.error(`\n=== SUMMARY ===`);
  console.error(`probed: ${results.length}`);
  console.error(`ok:     ${results.length - dead.length - parked.length - slow.length - other.length}`);
  console.error(`dead:   ${dead.length}${dead.length ? " -> " + dead.map((r) => r.host).join(", ") : ""}`);
  console.error(`parked: ${parked.length}${parked.length ? " -> " + parked.map((r) => r.host).join(", ") : ""}`);
  console.error(`slow:   ${slow.length}${slow.length ? " -> " + slow.map((r) => r.host).join(", ") : ""}`);
  console.error(`http4x: ${other.length}${other.length ? " -> " + other.map((r) => r.host).join(", ") : ""}`);
  console.error(`\nreport: tools/host-check-report.json`);
}
