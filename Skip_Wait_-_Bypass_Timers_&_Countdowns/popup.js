// Skip Wait — freeware popup.
//
// Mostly cosmetic (appends the manifest version to the footer), plus a small
// "Site not covered?" panel that lets the user bind an unlisted domain to an
// existing skip engine. Overrides are stored under `skipWaitCustomHosts` in
// chrome.storage.local, which background.js and content.js merge on top of the
// bundled/remote hosts.json — so they apply on new page loads without a
// re-release. All bypass logic itself lives in background.js / content.js.

(function () {
  "use strict";

  // --- Footer version label (unchanged behaviour) --------------------------
  var ver = document.getElementById("ver");
  if (ver) {
    var label = "Skip Wait";
    try {
      if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getManifest) {
        var v = chrome.runtime.getManifest().version;
        if (v) label += " v" + v;
      }
    } catch (e) {
      /* outside extension context — label stays plain */
    }
    ver.textContent = label;
  }

  // --- Custom-site override panel -----------------------------------------
  var CUSTOM_KEY = "skipWaitCustomHosts";
  // Same hostname grammar background.js / content.js enforce.
  var HOST_RE = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;

  var toggle = document.getElementById("custom-toggle");
  var body = document.getElementById("custom-body");
  var engineSel = document.getElementById("engine");
  var hostInput = document.getElementById("host");
  var addBtn = document.getElementById("add");
  var errEl = document.getElementById("custom-err");
  var chipsEl = document.getElementById("chips");

  // Only meaningful inside the extension with the storage permission.
  var hasStorage =
    typeof chrome !== "undefined" && chrome.storage && chrome.storage.local;
  if (!toggle || !body || !hasStorage) return;

  function storageGet() {
    return new Promise(function (resolve) {
      try {
        chrome.storage.local.get(CUSTOM_KEY, function (res) {
          resolve((res && res[CUSTOM_KEY]) || {});
        });
      } catch (e) {
        resolve({});
      }
    });
  }
  function storageSet(obj) {
    return new Promise(function (resolve) {
      try {
        var patch = {};
        patch[CUSTOM_KEY] = obj;
        chrome.storage.local.set(patch, resolve);
      } catch (e) {
        resolve();
      }
    });
  }

  function showErr(msg) {
    if (!errEl) return;
    if (msg) {
      errEl.textContent = msg;
      errEl.hidden = false;
    } else {
      errEl.hidden = true;
      errEl.textContent = "";
    }
  }

  function normalizeHost(raw) {
    var h = String(raw || "").trim().toLowerCase();
    // Accept a pasted URL and reduce it to its hostname.
    if (/^https?:\/\//.test(h)) {
      try {
        h = new URL(h).hostname;
      } catch (e) {
        /* fall through, validation will reject */
      }
    }
    h = h.replace(/^www\./, "").split("/")[0].split("?")[0].split("#")[0];
    return h;
  }

  function renderChips(data) {
    if (!chipsEl) return;
    chipsEl.textContent = "";
    var added = 0;
    Object.keys(data).forEach(function (flow) {
      var hosts = (data[flow] && data[flow].hosts) || [];
      hosts.forEach(function (host) {
        added++;
        var chip = document.createElement("span");
        chip.className = "chip";
        var txt = document.createElement("span");
        txt.className = "chip-host";
        txt.textContent = host;
        txt.title = flow;
        var rm = document.createElement("button");
        rm.className = "chip-x";
        rm.type = "button";
        rm.textContent = "\u00d7";
        rm.setAttribute("aria-label", "Remove " + host);
        rm.addEventListener("click", function () {
          removeHost(flow, host);
        });
        chip.appendChild(txt);
        chip.appendChild(rm);
        chipsEl.appendChild(chip);
      });
    });
    if (!added) {
      var empty = document.createElement("span");
      empty.className = "chip-empty";
      empty.textContent = "No custom sites yet.";
      chipsEl.appendChild(empty);
    }
  }

  function refresh() {
    storageGet().then(renderChips);
  }

  function addHost() {
    showErr("");
    var flow = engineSel ? engineSel.value : "";
    var host = normalizeHost(hostInput ? hostInput.value : "");
    if (!flow) return;
    if (!HOST_RE.test(host)) {
      showErr("Enter a valid domain, e.g. short.example.com");
      return;
    }
    storageGet().then(function (data) {
      var entry = data[flow] || (data[flow] = { hosts: [] });
      if (entry.hosts.indexOf(host) === -1) entry.hosts.push(host);
      storageSet(data).then(function () {
        if (hostInput) hostInput.value = "";
        renderChips(data);
      });
    });
  }

  function removeHost(flow, host) {
    storageGet().then(function (data) {
      var entry = data[flow];
      if (entry && Array.isArray(entry.hosts)) {
        entry.hosts = entry.hosts.filter(function (h) {
          return h !== host;
        });
        if (!entry.hosts.length) delete data[flow];
      }
      storageSet(data).then(function () {
        renderChips(data);
      });
    });
  }

  toggle.addEventListener("click", function () {
    var open = body.hasAttribute("hidden");
    if (open) body.removeAttribute("hidden");
    else body.setAttribute("hidden", "");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.classList.toggle("open", open);
    if (open) refresh();
  });
  if (addBtn) addBtn.addEventListener("click", addHost);
  if (hostInput)
    hostInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") addHost();
    });

  refresh();
})();
