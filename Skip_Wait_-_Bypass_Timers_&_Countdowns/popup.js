// Skip Wait — freeware popup.
// Purely cosmetic: appends the manifest version to the footer label.
// All bypass logic lives in background.js / content.js.

(function () {
  var el = document.getElementById("ver");
  if (!el) return;
  var label = "Skip Wait";
  try {
    if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.getManifest) {
      var v = chrome.runtime.getManifest().version;
      if (v) label += " v" + v;
    }
  } catch (e) {
    /* outside extension context — label stays plain */
  }
  el.textContent = label;
})();
