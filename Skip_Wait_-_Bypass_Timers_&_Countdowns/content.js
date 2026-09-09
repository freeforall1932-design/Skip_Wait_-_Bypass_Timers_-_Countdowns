! function() {
    /*
     * EAS licensing + "5 free per day" machinery removed (freeware edition,
     * HANDOFF A3). D/N/B used to count paid/free uses; live handlers still
     * call them, so they stay as no-ops.
     */
    var D = () => {}, N = () => {}, B = () => {}, U = "skipWaitHosts", W = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/, H = /^[a-z][a-z0-9-]{0,63}$/, F = t => {
            if (!t || "object" != typeof t || Array.isArray(t)) return null;
            const e = {};
            for (const [n, o] of Object.entries(t)) {
                if (!H.test(n) || !o || "object" != typeof o || Array.isArray(o)) return null;
                const t = o.hosts;
                if (!Array.isArray(t) || !t.every(t => "string" == typeof t && W.test(t.toLowerCase()))) return null;
                e[n] = {
                    hosts: t.map(t => t.toLowerCase())
                }
            }
            return e
        }, z = async () => ((...t) => {
            const e = {};
            for (const n of t)
                if (n)
                    for (const [t, {
                            hosts: o
                        }] of Object.entries(n)) {
                        const n = new Set(e[t]?.hosts ?? []);
                        for (const t of o) n.add(t);
                        e[t] = {
                            hosts: [...n]
                        }
                    }
            return e
        })(await (async () => {
            try {
                const t = await fetch(chrome.runtime.getURL("hosts.json"));
                return t.ok ? F(await t.json()) : null
            } catch {
                return null
            }
        })(), await (async () => {
            const t = await chrome.storage.local.get(U);
            return F(t[U])
        })(), await (async () => {
            // User-defined overrides (popup -> "Add a site"); survive remote host refreshes.
            const t = await chrome.storage.local.get("skipWaitCustomHosts");
            return F(t.skipWaitCustomHosts)
        })()), j = async (t, e) => ((t, e) => {
            const n = t.toLowerCase();
            return e.some(t => n === t || n.endsWith(`.${t}`))
        })(t, await (async t => {
            try {
                return (await z())[t]?.hosts ?? []
            } catch {
                return []
            }
        })(e)), et = async () => !0, nt = async (t, e) => !!(await j(t, e)) && et(), ot = t => nt(location.hostname, t);

    function rt(t, e) {
        const n = t.toLowerCase();
        return e.some(t => n === t || n.endsWith("." + t))
    }

    function it(t) {
        "loading" === document.readyState ? document.addEventListener("readystatechange", function e() {
            "loading" !== document.readyState && (document.removeEventListener("readystatechange", e), t())
        }) : t()
    }

    function at(t) {
        return t() ? Promise.resolve() : new Promise(e => {
            const n = new MutationObserver(() => {
                t() && (n.disconnect(), e())
            });
            n.observe(document.documentElement, {
                childList: !0,
                subtree: !0,
                attributes: !0,
                attributeFilter: ["class", "style", "hidden"]
            })
        })
    }
    /*
     * Shared per-family constants (deduped from dozens of per-flow copies —
     * D3c): the promise delay helper, the Turnstile iframe selectors, the
     * Turnstile token input selector, and the "Confirm you're human" note.
     */
    var swDelay = swDelay,
        swTnFrames = swTnFrames,
        swTnToken = swTnToken,
        swTnNote = {
            lead: "Confirm you\u2019re human.",
            detail: "Complete the Turnstile check below. We\u2019ll continue automatically when it\u2019s done."
        };
    var st = ["gdrive", "mediafire", "dropbox", "onedrive", "pixeldrain", "gofile", "usersdrive", "torrent", "cloud", "box", "vikingfile"],
        ct = "oke-link",
        lt = "downloadButtons",
        ut = /<a\b[^>]*\bid=["']oke-link["'][^>]*\bhref=["']([^"']+)["'][^>]*>|<a\b[^>]*\bhref=["']([^"']+)["'][^>]*\bid=["']oke-link["'][^>]*>/i;

    function dt(t) {
        return !!t && /^https?:\/\//i.test(t)
    }

    function mt(t) {
        return !!t && (/^https?:\/\//i.test(t) || t.startsWith("/"))
    }

    function pt() {
        let t = !1;
        const e = () => {
                (function() {
                    let t = !1;
                    for (const e of st) {
                        const n = document.getElementById(e);
                        if (!n) continue;
                        const o = n.getAttribute("data-link");
                        dt(o) && (n.getAttribute("href") !== o && (n.href = o), n.target = "_blank", n.rel = "noreferrer noopener", n.onclick && (n.onclick = null), t = !0)
                    }
                    return t
                })() && !t && (! function() {
                    document.getElementById(lt)?.classList.add("show");
                    const t = document.getElementById("loadingText");
                    t && (t.style.display = "none"), document.querySelector(".circle")?.style.setProperty("display", "none"), document.querySelector(".progress")?.style.setProperty("display", "none")
                }(), t = !0, D())
            },
            n = new MutationObserver(e);
        n.observe(document.body ?? document.documentElement, {
            childList: !0,
            subtree: !0,
            attributes: !0,
            attributeFilter: ["data-link", "style", "class", "href"]
        }), e(), setTimeout(e, 1500), setTimeout(() => {
            e(), t && n.disconnect()
        }, 4500)
    }

    function ht(t) {
        const e = document.getElementById(ct);
        e && e.getAttribute("href") !== t && (e.setAttribute("href", t), e.style.cursor = "pointer")
    }

    function ft() {
        const t = document.getElementById(ct);
        if (!t) return;
        const e = t.getAttribute("href");
        mt(e) ? ht(e) : fetch(window.location.href, {
            cache: "no-store",
            credentials: "same-origin"
        }).then(t => t.text()).then(t => {
            const e = function(t) {
                const e = t.match(ut),
                    n = e?.[1] ?? e?.[2] ?? null;
                if (!n) return null;
                const o = n.replace(/&amp;/g, "&");
                return mt(o) ? o : null
            }(t);
            e && ht(e)
        }).catch(() => {})
    }
    var wt = '"Segoe UI Variable","Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,Roboto,"Helvetica Neue",Arial,sans-serif',
        gt = {
            textPrimary: "#f1f5f9",
            textSecondary: "#f8fafc",
            textMuted: "#94a3b8",
            textDetail: "#cbd5e1",
            accent: "#38bdf8",
            error: "#fca5a5",
            backdrop: "rgba(15,23,42,.94)",
            cardGradient: "linear-gradient(145deg,#1e293b 0%,#0f172a 100%)",
            cardBorder: "rgba(148,163,184,.25)",
            cardShadow: "0 25px 50px -12px rgba(0,0,0,.5)"
        },
        yt = {
            card: "sw-card",
            brand: "sw-brand",
            note: "sw-note",
            noteLead: "sw-note-lead",
            noteDetail: "sw-note-detail",
            status: "sw-status",
            count: "sw-count",
            countLabel: "sw-count-label",
            countHint: "sw-count-hint",
            err: "sw-err",
            hidden: "sw-hidden",
            turnstile: "sw-turnstile",
            action: "sw-action"
        };

    function kt(t) {
        return `${t}-active`
    }

    function bt(t, e) {
        return `html.${e},html.${e} body{overflow:hidden!important;touch-action:none!important;user-select:none!important;-webkit-user-select:none!important}html.${e}>*:not(head):not(body):not(#${t}){display:none!important;visibility:hidden!important;pointer-events:none!important}html.${e} body{pointer-events:none!important}html.${e} body *{visibility:hidden!important;pointer-events:none!important}html.${e} #${t},html.${e} #${t} *{visibility:visible!important}html.${e} #${t}{pointer-events:auto!important}`
    }

    function vt(t) {
        return `#${t}{position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;padding:20px;box-sizing:border-box;background:${gt.backdrop};backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);font-family:${wt};font-size:16px;line-height:1.5;color:${gt.textSecondary};pointer-events:auto;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;cursor:default;overscroll-behavior:contain;touch-action:none}`
    }

    function St(t) {
        return `#${t} .${yt.card}{max-width:440px;width:100%;border-radius:16px;padding:clamp(22px,4vw,28px);background:${gt.cardGradient};border:1px solid ${gt.cardBorder};box-shadow:${gt.cardShadow};pointer-events:none;font-family:${wt}}#${t} .${yt.brand}{font-family:${wt};font-size:clamp(1em,2.5vw,1.25em);font-weight:700;letter-spacing:-.02em;color:${gt.accent};margin-bottom:8px}#${t} .${yt.note}{font-family:${wt};margin-bottom:14px}#${t} .${yt.noteLead}{display:block;font-size:clamp(1em,2.8vw,1.15em);font-weight:700;line-height:1.35;color:${gt.textPrimary};word-break:break-word;overflow-wrap:anywhere}#${t} .${yt.noteDetail}{display:block;margin-top:8px;font-size:.875em;font-weight:500;line-height:1.4;color:${gt.textMuted}}#${t} .${yt.status}{font-family:${wt};font-size:.9em;color:${gt.textPrimary};min-height:1.4em;margin-bottom:10px}#${t} .${yt.hidden}{display:none!important}`
    }

    function Et(t) {
        return `#${t} .${yt.count}{font-family:${wt};font-size:2.5em;font-weight:700;font-variant-numeric:tabular-nums;color:${gt.textPrimary};text-align:center;margin:6px 0 4px;line-height:1.15}#${t} .${yt.countLabel}{font-family:${wt};font-size:.7em;text-transform:uppercase;letter-spacing:.08em;color:${gt.textMuted};text-align:center;margin-top:4px}#${t} .${yt.countHint}{font-family:${wt};font-size:.78em;color:${gt.textMuted};text-align:center;margin-top:4px}#${t} .${yt.err}{font-family:${wt};font-size:.85em;color:${gt.error};margin-top:10px;line-height:1.45}#${t} .${yt.err}:empty{display:none}`
    }

    function xt(t) {
        return `#${t} .${yt.turnstile}{display:flex;align-items:stretch;justify-content:center;flex-direction:column;min-height:72px;margin-top:16px;pointer-events:auto!important;isolation:isolate;width:100%;overflow:hidden;border-radius:8px}#${t} .${yt.turnstile} iframe{width:100%;min-height:380px;border:0;border-radius:8px;background:transparent;pointer-events:auto!important}#${t} .${yt.turnstile} input{pointer-events:auto!important}#${t} .${yt.action}{display:block;width:100%;box-sizing:border-box;margin-top:16px;padding:14px 18px;border-radius:10px;background:${gt.accent};color:#0f172a;font-family:${wt};font-size:1em;font-weight:800;line-height:1.3;text-align:center;text-decoration:none;pointer-events:auto!important;cursor:pointer}#${t} .${yt.action}.${yt.hidden}{display:none!important}`
    }

    function Lt(t, e) {
        return bt(t, e) + vt(t) + St(t) + Et(t) + xt(t)
    }
    var Ct = ["click", "mousedown", "mouseup", "touchstart", "touchend", "wheel", "keydown"];

    function It(t, e) {
        t.replaceChildren();
        const n = document.createElement("div");
        if (n.className = yt.noteLead, n.textContent = e.lead, t.appendChild(n), e.detail) {
            const n = document.createElement("div");
            n.className = yt.noteDetail, n.textContent = e.detail, t.appendChild(n)
        }
    }

    function Tt(t, e) {
        return e.composedPath().some(t => t instanceof Element && (null != t.closest(`.${yt.turnstile}`) || null != t.closest(`.${yt.action}`)))
    }

    function $t(t) {
        const {
            id: e,
            brand: n = "",
            note: o,
            status: r = "",
            countdownLabel: i = "",
            countdownHint: a
        } = t, s = yt, c = kt(e), l = function(t, e) {
            const n = document.createElement("div");
            n.id = t;
            const o = document.createElement("style");
            return o.textContent = e, n.appendChild(o), n
        }(e, Lt(e, c));
        document.documentElement.classList.add(c),
            function(t) {
                for (const e of Ct) t.addEventListener(e, t => {
                    Tt(0, t) || (t.preventDefault(), t.stopPropagation())
                }, !0)
            }(l);
        const u = document.createElement("div");
        u.className = s.card;
        const d = document.createElement("div");
        d.className = s.brand, d.textContent = n;
        const m = document.createElement("div");
        m.className = s.note, It(m, o);
        const p = document.createElement("div");
        p.className = s.status, p.textContent = r;
        const h = document.createElement("div");
        h.className = `${s.count} ${s.hidden}`;
        const f = document.createElement("div");
        f.className = `${s.countLabel} ${s.hidden}`, f.textContent = i;
        const w = document.createElement("div");
        w.className = s.turnstile, w.id = `${e}-turnstile`;
        const g = document.createElement("a");
        g.className = `${s.action} ${s.hidden}`, g.rel = "noopener", u.append(d, m, p, h, f);
        let y = null;
        a && (y = document.createElement("div"), y.className = `${s.countHint} ${s.hidden}`, y.textContent = a, u.appendChild(y));
        const k = document.createElement("div");
        k.className = s.err, u.append(k, g, w), l.appendChild(u), document.documentElement.appendChild(l);
        const b = new MutationObserver(() => {
            l.parentElement === document.documentElement ? document.documentElement.lastElementChild !== l && document.documentElement.appendChild(l) : document.documentElement.appendChild(l)
        });
        b.observe(document.documentElement, {
            childList: !0
        });
        let v = 0;
        const S = t => {
                h.classList.toggle(s.hidden, !t), f.classList.toggle(s.hidden, !t), y?.classList.toggle(s.hidden, !t)
            },
            E = t => {
                cancelAnimationFrame(v), v = 0, t && S(!1)
            };
        return {
            turnstileMount: w,
            setStatus(t) {
                E(!0), p.textContent = t
            },
            setNote(t) {
                It(m, t)
            },
            setError(t) {
                k.textContent = t ?? ""
            },
            setAction(t, e = "Direct Download · Skip Wait") {
                if (!t) return g.removeAttribute("href"), g.classList.add(s.hidden), g.textContent = "", void w.classList.remove(s.hidden);
                g.href = t, g.textContent = e, g.classList.remove(s.hidden), w.classList.add(s.hidden)
            },
            startCountdown(t) {
                S(!0);
                const e = () => {
                    const n = t - Date.now();
                    h.textContent = `${(Math.max(0,n)/1e3).toFixed(2)} s`, v = n <= 0 ? 0 : requestAnimationFrame(e)
                };
                cancelAnimationFrame(v), v = requestAnimationFrame(e)
            },
            stopCountdown: () => E(!1),
            hideCountdown: () => E(!0),
            remove() {
                E(!0), b.disconnect(), l.remove(), document.documentElement.classList.remove(c)
            }
        }
    }
    var At = "skip-wait-xdmovies-landing-overlay",
        qt = "skip-wait-xdmovies-landing-boot",
        _t = /href="(https:\/\/[^"]+)"[^>]*>[\s\S]{0,400}?Open\s+(?:Main\s+Site|XDMovies)/i,
        Mt = {
            lead: "Opening the main site.",
            detail: "Skip Wait is taking you to the live XDMovies destination."
        },
        Ot = null;

    function Rt() {
        const t = kt(At);
        if (document.documentElement.classList.add(t), document.getElementById(qt)) return;
        const e = document.createElement("style");
        e.id = qt, e.textContent = Lt(At, t), (document.head || document.documentElement).appendChild(e)
    }

    function Pt() {
        const t = document.documentElement.innerHTML.match(_t)?.[1];
        if (!t) return null;
        try {
            const e = new URL(t);
            return "http:" !== e.protocol && "https:" !== e.protocol ? null : (e.hash = "", e.toString())
        } catch {
            return null
        }
    }

    function Dt() {
        const t = (e = "Opening destination…", Rt(), Ot ? (Ot.setNote(Mt), Ot.setStatus(e), Ot.setError(null), Ot) : Ot = $t({
            id: At,
            brand: "Skip Wait",
            note: Mt,
            status: e
        }));
        var e;
        const n = Pt();
        n ? (t.setStatus("Opening destination…"), D(), location.replace(n)) : t.setError("Could not find the main site link on this page.")
    }

    function Nt(t) {
        const {
            overlayId: e,
            mount: n,
            widgetId: o,
            styleId: r,
            alsoVisibleSelectors: i = []
        } = t, a = kt(e);
        let s = document.getElementById(r);
        s || (s = document.createElement("style"), s.id = r, document.documentElement.appendChild(s));
        const c = i.map(t => `html.${a} ${t},html.${a} ${t} *{visibility:visible!important;pointer-events:auto!important}`).join("");
        let l = "",
            u = 0;
        const d = () => {
            const t = document.getElementById(o);
            if (!t) return u || (u = Date.now()), void(Date.now() - u > 3e3 && (s.textContent = ""));
            u = 0, t.classList.remove("hidden");
            const e = n.getBoundingClientRect(),
                r = Math.round(Math.max(8, e.top)),
                i = Math.round(Math.max(8, e.left)),
                d = Math.round(Math.max(300, e.width || 300)),
                m = `${r}|${i}|${d}`;
            m === l && s.textContent || (l = m, s.textContent = c + `html.${a} #${o},html.${a} #${o} *{visibility:visible!important;pointer-events:auto!important}html.${a} #${o}{position:fixed!important;left:${i}px!important;top:${r}px!important;width:${d}px!important;min-height:70px!important;z-index:2147483647!important;display:block!important;margin:0!important;transform:none!important;opacity:1!important;height:auto!important}`)
        };
        d();
        const m = new ResizeObserver(d);
        m.observe(n), window.addEventListener("resize", d);
        const p = window.setInterval(d, 500);
        return () => {
            m.disconnect(), window.removeEventListener("resize", d), window.clearInterval(p), s?.remove()
        }
    }
    var Bt = "skip-wait-xdmovies",
        Ut = "skip-wait-xdmovies-overlay",
        Wt = /^\/(?:r|download)\/([^/]+)/,
        Ht = "turnstileContainer";
    var Ft = "__skipWaitCoomeetTimers";

    function zt() {
        const t = window;
        t[Ft] || (t[Ft] = !0, function() {
            const t = window.setTimeout.bind(window),
                e = window.setInterval.bind(window),
                n = t => "number" != typeof t || t < 400 || t > 6e5 ? t : Math.max(0, Math.floor(t / 30));
            window.setTimeout = function(e, o, ...r) {
                return t(e, n(o), ...r)
            }, window.setInterval = function(t, o, ...r) {
                const i = n(o);
                return e(t, "number" == typeof i ? Math.max(1, i) : i, ...r)
            }
        }(), window.postMessage({
            source: "skip-wait-coomeet",
            type: "on"
        }, location.origin))
    }
    var jt = () => ot("coomeet-iframe");
    var Yt = /^\/ll\/([^/]+)\/?$/i,
        Gt = /^\/l\/([^/]+)\/?$/i,
        Vt = /^\/link-encrypted\/(.+)$/i;

    function Zt(t = location.pathname) {
        const e = t.match(Yt)?.[1];
        if (e) return {
            kind: "short_link",
            id: decodeURIComponent(e)
        };
        const n = t.match(Vt)?.[1];
        if (n) return {
            kind: "encrypted_link",
            id: decodeURIComponent(n)
        };
        const o = t.match(Gt)?.[1];
        return o ? {
            kind: "short_link",
            id: decodeURIComponent(o)
        } : null
    }

    function Jt(t = document) {
        const e = t.querySelector("script[data-csrf]")?.getAttribute("data-csrf")?.trim();
        if (e) return e;
        const n = t.querySelector('meta[name="csrf-token"]')?.content?.trim();
        return n || (t.querySelector('input[name="_token"]')?.value?.trim() || null)
    }
    var Xt = "skip-wait-1shortlink-overlay",
        Kt = "skip-wait-1shortlink-boot",
        Qt = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        te = null,
        ee = !1,
        ne = () => {
            const t = kt(Xt);
            if (document.documentElement.classList.add(t), document.getElementById(Kt)) return;
            const e = document.createElement("style");
            e.id = Kt, e.textContent = Lt(Xt, t), (document.head || document.documentElement).appendChild(e)
        },
        oe = (t = "Getting things ready…") => (ne(), te ? (te.setNote(Qt), te.setStatus(t), te.setError(null), te) : te = $t({
            id: Xt,
            brand: "Skip Wait",
            note: Qt,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        re = async () => {
            const t = Zt();
            if (!t) throw new Error("1shortlink job");
            const e = oe("Unlocking your link…"),
                n = await (async () => {
                    const t = Date.now() + 8e3;
                    for (; Date.now() < t;) {
                        const t = Jt();
                        if (t) return t;
                        await new Promise(t => setTimeout(t, 50))
                    }
                    throw new Error("1shortlink csrf")
                })(),
                o = await async function(t, e) {
                    const n = new URLSearchParams({
                            url: t.id,
                            type: t.kind,
                            _token: e
                        }),
                        o = await fetch("/get-link-download", {
                            method: "POST",
                            credentials: "same-origin",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "X-Requested-With": "XMLHttpRequest"
                            },
                            body: n
                        });
                    if (!o.ok) throw new Error(`get-link-download ${o.status}`);
                    const r = await o.json(),
                        i = r.redirect_url?.trim();
                    if ("success" !== r.status || !i || !/^https?:\/\//i.test(i)) throw new Error("get-link-download empty");
                    return i
                }(t, n);
            e.setStatus("Opening your link…"), D(), location.replace(o)
        }, ie = () => {
            if (ee || !Zt()) return;
            const t = document.getElementById("password-area");
            !t || t.hasAttribute("hidden") ? (ee = !0, re().catch(() => {
                oe().setError("Unlock failed. Reload and try again.")
            })) : oe().setError("This link needs a password.")
        };
    var ae = /^[A-Za-z0-9]+$/;

    function se(t = location.pathname) {
        const e = t.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
        if (1 !== e.length) return null;
        const n = e[0];
        return ae.test(n) ? n : null
    }
    var ce = "skip-wait-adfocus-overlay",
        le = "skip-wait-adfocus-boot",
        ue = /var\s+click_url\s*=\s*"([^"]+)"/,
        de = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to wait or watch ads."
        },
        me = null,
        pe = !1;

    function he() {
        const t = ue.exec(document.documentElement.innerHTML)?.[1] ?? document.querySelector("#showSkip a.skip, #showSkip a")?.getAttribute("href");
        if (!t) return null;
        const e = function(t) {
            const e = document.createElement("textarea");
            return e.innerHTML = t, e.value
        }(t).trim();
        if (!/^https?:\/\//i.test(e)) return null;
        try {
            const t = new URL(e);
            return rt(t.hostname, ["adfoc.us"]) ? null : t.href
        } catch {
            return null
        }
    }

    function fe(t = "Getting things ready…") {
        return function() {
            const t = kt(ce);
            if (document.documentElement.classList.add(t), document.getElementById(le)) return;
            const e = document.createElement("style");
            e.id = le, e.textContent = Lt(ce, t), (document.head || document.documentElement).appendChild(e)
        }(), me ? (me.setNote(de), me.setStatus(t), me.setError(null), me) : me = $t({
            id: ce,
            brand: "Skip Wait",
            note: de,
            status: t
        })
    }

    function we() {
        !pe && se() && (Boolean(document.getElementById("showSkip")) || ue.test(document.documentElement.innerHTML)) && (pe = !0, function() {
            const t = fe("Unlocking your link…"),
                e = he();
            e ? (t.setStatus("Opening your link…"), D(), location.replace(e)) : t.setError("Adfoc.us destination not found on this page.")
        }())
    }
    var ge = () => !!document.querySelector('script[src*="aes.js"]') && /slowAES\.decrypt/.test(document.documentElement.innerHTML),
        ye = () => document.querySelector(".keybox")?.textContent?.trim() || null,
        ke = {
            lead: "Hang tight — clearing Adsterra checkpoint steps.",
            detail: "You don't need to tap Verify, Continue, or smart links."
        },
        be = null,
        ve = !1,
        Se = t => be ? (be.setStatus(t), be.setError(null), be) : be = $t({
            id: "skip-wait-adsterra-overlay",
            brand: "Skip Wait",
            note: ke,
            status: t
        }),
        Ee = (t, e) => {
            ve || (ve = !0, Se(e), location.replace(t))
        },
        xe = () => {
            const t = ye();
            if (t) return void(t => {
                ve = !0, D();
                const e = Se("Copy this key.");
                e.setNote({
                    lead: "This is your reward key — not a download link.",
                    detail: t
                }), navigator.clipboard.writeText(t).then(() => e.setStatus("Copied — paste it where the game asks."), () => e.setStatus("Select the key above and copy it."))
            })(t);
            const e = (() => {
                    const t = new URL(location.href).searchParams.get("token")?.trim();
                    return t && /^[a-f0-9]{16,}$/i.test(t) ? t : null
                })(),
                n = (() => {
                    const t = document.querySelectorAll(".row");
                    for (const e of t) {
                        const t = e.querySelector("span:first-child")?.textContent?.trim(),
                            n = e.querySelector("span:last-child")?.textContent?.trim();
                        if ("Current Step" === t && n && /^\d+$/.test(n)) return parseInt(n, 10)
                    }
                    return null
                })();
            e && null !== n && Ee(((t, e) => `${location.origin}/step_complete.php?token=${encodeURIComponent(t)}&step=${e}`)(e, n + 1), "Completing checkpoint step…")
        },
        Le = () => {
            const t = (() => {
                const t = new URL(location.href).searchParams.get("url")?.trim();
                if (t && /^https?:\/\//i.test(t)) return t;
                const e = document.documentElement.innerHTML.match(/var\s+finalDestinationUrl\s*=\s*['"]([^'"]+)['"]/)?.[1];
                if (!e) return null;
                const n = e.replace(/\\\//g, "/");
                return /^https?:\/\//i.test(n) ? n : null
            })();
            t && (D(), Ee(t, "Skipping ad timer…"))
        },
        Ce = () => !ge() && (/\/checkpoint\.php$/i.test(location.pathname) && !ge() ? (xe(), !!ye() || ve) : !!(/\/ad-page\.php$/i.test(location.pathname) || /\/final-page\.php$/i.test(location.pathname) || document.getElementById("download") && /finalDestinationUrl/.test(document.documentElement.innerHTML)) && (Le(), ve)),
        Ie = t => /^https?:\/\//i.test(t) && !/^javascript:/i.test(t);

    function Te(t, e) {
        const n = (new DOMParser).parseFromString(t, "text/html"),
            o = n.querySelector("#go-link") ?? n.querySelector('form[action*="/links/go"]');
        if (!o) return null;
        let r = o.getAttribute("action") || "/links/go";
        Ie(r) || (r = new URL(r, e).href);
        const i = {};
        return o.querySelectorAll("input[name]").forEach(t => {
            t.name && (i[t.name] = t.value ?? "")
        }), {
            action: r,
            fields: i
        }
    }
    async function $e(t, e) {
        try {
            const n = await fetch(t.action, {
                    method: "POST",
                    body: new URLSearchParams(t.fields),
                    credentials: "include",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest",
                        Referer: e
                    }
                }),
                o = JSON.parse(await n.text()),
                r = "string" == typeof o.url ? o.url.trim() : "";
            return r && Ie(r) ? r : null
        } catch {
            return null
        }
    }

    function Ae(t = document) {
        for (const n of ["#gt-link", "#link1s", "a.get-link"]) {
            const e = t.querySelector(n);
            e && (e.style.setProperty("display", "inline-block", "important"), e.style.setProperty("visibility", "visible", "important"), e.style.setProperty("opacity", "1", "important"), e.removeAttribute("hidden"), e.classList.remove("hidden", "disabled"))
        }
        const e = t.querySelector("#btn-unlock, #btn-wait");
        e && !e.dataset.swClicked && (e.dataset.swClicked = "1", e.click())
    }
    var qe = "skip-wait-adlinkfly-overlay",
        _e = "skip-wait-adlinkfly-boot",
        Me = "skip-wait-adlinkfly-captcha-pin",
        Oe = "captchaShortlink",
        Re = '[name="g-recaptcha-response"], [name="h-captcha-response"]',
        Pe = ['iframe[src*="hcaptcha.com"]', 'iframe[src*="newassets.hcaptcha.com"]'],
        De = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        Ne = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Be = {
            lead: "Confirm you’re human.",
            detail: "Tap the checkbox below. We’ll continue automatically when it’s done."
        },
        Ue = null,
        We = !1,
        He = !1,
        Fe = !1,
        ze = !1,
        je = !1,
        Ye = !1,
        Ge = !1,
        Ve = !1,
        Ze = swDelay,
        Je = t => /^https?:\/\//i.test(t),
        Xe = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        Ke = () => {
            try {
                document.cookie = "ab=1; path=/"
            } catch {}
            try {
                const t = window;
                t.blurred = !1, t.onblur = null, t.onfocus = null
            } catch {}
            try {
                const t = window.app_vars;
                t && (t.force_disable_adblock = "0")
            } catch {}
        },
        Qe = (t = Ne, e = "Getting things ready…") => ((() => {
            const t = kt(qe);
            if (document.documentElement.classList.add(t), document.getElementById(_e)) return;
            const e = document.createElement("style");
            e.id = _e, e.textContent = Lt(qe, t), (document.head || document.documentElement).appendChild(e)
        })(), Ue ? (Ue.setNote(t), Ue.setStatus(e), Ue.setError(null), Ue) : Ue = $t({
            id: qe,
            brand: "Skip Wait",
            note: t,
            status: e,
            countdownLabel: "Your link opens in"
        })),
        tn = () => {
            const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
            return 1 === t.length && De.test(t[0])
        },
        en = () => {
            const t = document.querySelector("#form-continue");
            if (t) return t;
            const e = document.querySelector('form input[name="action"][value="continue"]')?.form ?? null;
            return e ? "link-view" === e.id || e.querySelector(`#${Oe}, ${Re}`) ? null : e : null
        },
        nn = t => {
            const e = (new DOMParser).parseFromString(t, "text/html"),
                n = e.querySelector("#form-continue");
            if (n) return n;
            const o = e.querySelector('form input[name="action"][value="continue"]')?.form ?? null;
            return o ? "link-view" === o.id || o.querySelector(`#${Oe}, ${Re}`) ? null : o : null
        },
        on = () => {
            const t = document.querySelector("#link-view");
            return t && (t.querySelector(`#${Oe}`) || t.querySelector(Re)) ? t : null
        },
        rn = () => Boolean(document.querySelector('#go-link, form[action*="/links/go"]') && document.querySelector('input[name="ad_form_data"]')),
        an = (t = document) => !!t.querySelector('#link-view,#go-link,form[action*="/links/go"],a.get-link'),
        sn = (t = document.documentElement.innerHTML) => {
            const e = t.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
            if (e?.[1]) return Math.max(0, parseInt(e[1], 10));
            const n = document.querySelector("#timer, #countdown, .timer, #counter"),
                o = parseInt(n?.textContent?.trim() ?? "", 10);
            return Number.isFinite(o) && o > 0 ? o : 0
        },
        cn = t => {
            for (const e of [t, document])
                for (const t of e.querySelectorAll(Re)) {
                    const e = t.value?.trim();
                    if (e && e.length > 20) return !0
                }
            return !1
        },
        ln = async (t, e) => {
            const n = new URLSearchParams;
            for (const o of t.querySelectorAll("input[name], textarea[name]")) n.append(o.name, o.value);
            try {
                const t = await fetch(e, {
                    method: "POST",
                    body: n,
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                });
                return t.ok ? await t.text() : null
            } catch {
                return null
            }
        }, un = async (t, e, n) => {
            const o = Te(t, e);
            if (!o) return null;
            n.setStatus("Unlocking your link…");
            let r = await $e(o, e);
            if (r) return r;
            const i = sn(t);
            if (i <= 0) return null;
            if (Xe(), n.setStatus("Waiting for the short timer…"), n.startCountdown(Date.now() + 1e3 * i), await Ze(1e3 * i + 500), n.hideCountdown(), n.setStatus("Unlocking your link…"), r = await $e(o, e), r) return r;
            const a = Date.now() + 3e3;
            for (; !r && Date.now() < a && (r = await $e(o, e), !r);) await Ze(200);
            return r
        }, dn = (t, e) => {
            We = !0, ze = !0, e.setStatus("Opening your link…"), D(), location.replace(t)
        }, mn = () => {
            if (Ye || We) return Ye;
            const t = on();
            if (!t) return !1;
            Ye = !0, Xe(), Ke();
            const e = Qe(Be, "Waiting for captcha…");
            let n = null,
                o = !1,
                r = 0;
            const i = () => {
                    o || n || document.getElementById(Oe) && (n = Nt({
                        overlayId: qe,
                        mount: e.turnstileMount,
                        widgetId: Oe,
                        styleId: Me,
                        alsoVisibleSelectors: Pe
                    }))
                },
                a = () => {
                    o || (o = !0, cancelAnimationFrame(r), c.disconnect(), n?.(), n = null, e.setNote(Ne), e.setStatus("Continuing…"), (() => {
                        const e = t.querySelector('#invisibleCaptchaShortlink, button.btn-captcha, button[type="submit"]');
                        if (e) return e.disabled = !1, e.removeAttribute("disabled"), void e.click();
                        t.submit()
                    })())
                },
                s = () => {
                    if (!o) {
                        if (!document.contains(t)) return o = !0, cancelAnimationFrame(r), c.disconnect(), void n?.();
                        i(), cn(t) ? a() : r = requestAnimationFrame(s)
                    }
                },
                c = new MutationObserver(() => {
                    o || s()
                });
            return c.observe(t, {
                attributeFilter: ["value", "disabled"],
                attributes: !0,
                childList: !0,
                subtree: !0
            }), i(), r = requestAnimationFrame(s), !0
        }, pn = () => {
            (() => {
                if (je || We) return je;
                const t = en();
                if (!t) return !1;
                je = !0, Xe(), Ke();
                const e = t.querySelector('input[name="page"]')?.value?.trim();
                return Qe(Ne, e ? `Skipping step ${e}…` : "Skipping continue page…"), requestAnimationFrame(() => {
                    requestAnimationFrame(() => t.submit())
                }), !0
            })() || mn() || rn() && (async () => {
                if (Ge || We || !rn()) return;
                Ge = !0, Xe(), Ke();
                const t = Qe(Ne, "Getting things ready…"),
                    e = await un(document.documentElement.outerHTML, location.href, t);
                if (!e) {
                    Ae();
                    const e = document.querySelector("a.get-link, #gt-link");
                    return e?.href && Je(e.href) ? void dn(e.href, t) : (t.setStatus("Couldn’t unlock this link. Reload and try again."), void(Ge = !1))
                }
                dn(e, t)
            })()
        }, hn = () => {
            if (!We && !Ve) {
                if (Ke(), !He) {
                    const t = rn(),
                        e = en();
                    if (t || e) return He = !0, Fe = !0, void(async () => {
                        const t = rn(),
                            e = en();
                        if (!t && !e) return !1;
                        Xe(), Ke();
                        const n = Qe(Ne, "Getting things ready…");
                        let o = document.documentElement.outerHTML;
                        if (e) {
                            const t = e.querySelector('input[name="page"]')?.value?.trim();
                            n.setStatus(t ? `Skipping step ${t}…` : "Skipping continue page…");
                            const r = await ln(e, location.href);
                            if (!r) return !1;
                            o = r;
                            let i = nn(o);
                            for (; i;) {
                                const t = i.querySelector('input[name="page"]')?.value?.trim();
                                n.setStatus(t ? `Skipping step ${t}…` : "Skipping continue page…");
                                const e = await ln(i, location.href);
                                if (!e) break;
                                o = e, i = nn(o)
                            }
                        }
                        const r = await un(o, location.href, n);
                        return r ? (dn(r, n), !0) : (n.setStatus("Couldn’t unlock this link. Reload and try again."), !1)
                    })().then(t => {
                        Fe = !1, t || pn()
                    });
                    if (on()) return He = !0, void pn()
                }
                Fe || He && !ze && pn()
            }
        }, fn = t => {
            t.stopPin?.(), t.stopPin = null, Ue?.remove(), Ue = null, t.done = !0
        }, wn = async t => {
            if (t.done || t.inFlight || We) return t.done;
            const e = document.querySelector("a.get-link");
            if (e?.href && Je(e.href)) return t.done = !0, We = !0, Qe().setStatus("Redirecting now…"), D(), location.href = e.href, !0;
            if (!document.querySelector('#go-link, form[action*="/links/go"]')) return !1;
            t.inFlight = !0;
            try {
                const e = Qe();
                e.setNote(Ne);
                const n = await (async t => {
                    Ae();
                    const e = document.querySelector("a.get-link");
                    if (e?.href && Je(e.href)) return e.href;
                    const n = Te(document.documentElement.innerHTML, location.href);
                    if (!n) return null;
                    let o = await $e(n, location.href);
                    if (o) return o;
                    const r = sn();
                    if (r > 0) {
                        Xe(), t.setStatus("Waiting for timer…"), t.startCountdown(Date.now() + 1e3 * r);
                        const e = Date.now() + 1e3 * (r + 2);
                        for (; Date.now() < e;) {
                            if (Ae(), o = await $e(n, location.href), o) return o;
                            await Ze(200)
                        }
                    }
                    return Ae(), $e(n, location.href)
                })(e);
                return !!n && (t.done = !0, We = !0, e.setStatus("Redirecting now…"), D(), location.href = n, !0)
            } finally {
                t.inFlight = !1
            }
        }, gn = () => {
            if (Ve || We || Fe) return;
            Ve = !0, Xe();
            const t = {
                    started: !1,
                    done: !1,
                    stopPin: null
                },
                e = {
                    done: !1,
                    inFlight: !1
                },
                n = () => {
                    if (We) return;
                    const n = (() => {
                        const t = document.getElementById("link-view");
                        return t?.querySelector(Re) ? t : null
                    })();
                    n ? ((t, e) => {
                        if (e.started || e.done || We) return;
                        e.started = !0;
                        const n = Qe();
                        n.setNote(Be), n.setStatus("Waiting for captcha…"), document.getElementById(Oe) && (e.stopPin = Nt({
                            overlayId: qe,
                            mount: n.turnstileMount,
                            widgetId: Oe,
                            styleId: Me,
                            alsoVisibleSelectors: Pe
                        }));
                        const o = () => {
                            e.done || We || (document.contains(t) ? cn(t) ? (fn(e), t.submit()) : requestAnimationFrame(o) : fn(e))
                        };
                        requestAnimationFrame(o)
                    })(n, t) : wn(e).then(t => {
                        t && (We = !0)
                    })
                };
            n(), new MutationObserver(n).observe(document.documentElement, {
                attributeFilter: ["href", "value"],
                attributes: !0,
                childList: !0,
                subtree: !0
            })
        }, yn = () => {
            We || (tn() ? hn() : Ve || Fe || ze || an() && gn())
        };
    var kn = /^(?=.*[A-Za-z])[A-Za-z0-9]{3,}$/,
        bn = /^key-[A-Za-z0-9]+$/,
        vn = ["arolinks.com", "vplink.in"],
        Sn = t => {
            const [e, ...n] = t.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
            return !e || n.length > 0 || !bn.test(e) && !kn.test(e) ? null : e
        },
        En = (t, e) => new Promise(n => {
            chrome.runtime.sendMessage({
                type: "AROLINKS_MEDIATOR_REFERER",
                shortUrl: t,
                assigned: e
            }, t => {
                n(chrome.runtime.lastError || "string" != typeof t ? null : t)
            })
        }),
        xn = t => {
            const e = (t || "").trim();
            if (!/^https?:\/\//i.test(e)) return null;
            try {
                const t = new URL(e, location.href);
                return t.origin === location.origin ? null : t.href
            } catch {
                return null
            }
        },
        Ln = ["gt-link", "link1s", "get-link"],
        Cn = "skip-wait-arolinks-unlock",
        In = {
            lead: "Hang tight — unlocking your link.",
            detail: "Skip Wait is handling the waiting pages for you."
        },
        Tn = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        $n = async (t, e) => {
            t.startCountdown(Date.now() + e), await new Promise(t => setTimeout(t, e)), t.hideCountdown()
        }, An = (() => {
            let t = null;
            return e => (document.documentElement.classList.add(kt(Cn)), t ? (t.setStatus(e), t) : (t = $t({
                id: Cn,
                brand: "Skip Wait",
                note: In,
                status: e,
                countdownLabel: "Your link opens in"
            }), t))
        })(), qn = !1, _n = async t => {
            if (await (async t => {
                    try {
                        return j(new URL(t).hostname, "arolinks-wait")
                    } catch {
                        return !1
                    }
                })(t)) {
                const t = An("Waiting for access window…");
                await $n(t, 6e4)
            }
            const e = An("Opening your link…");
            var n;
            await (n = t, new Promise(t => {
                chrome.runtime.sendMessage({
                    type: "AROLINKS_OPEN_DEST",
                    url: n
                }, e => {
                    t(!chrome.runtime.lastError && !0 === e)
                })
            })) ? D(): e.setStatus("Could not open link")
        }, Mn = async (t, e) => {
            const n = An("Getting things ready…"),
                [, o] = await Promise.all([$n(n, 25e3), En(location.href, e)]);
            n.setStatus("Opening unlock page…");
            const r = `${location.origin}/${t}`;
            o && await ((t, e) => new Promise(n => {
                chrome.runtime.sendMessage({
                    type: "AROLINKS_ARM_REFERER",
                    url: t,
                    referer: e
                }, t => {
                    n(!chrome.runtime.lastError && !0 === t)
                })
            }))(r, o) ? location.replace(r) : n.setStatus("Could not open link")
        }, On = async t => {
            if (qn || /vpn detected|disable vpn|using a vpn or proxy|turn off\/?\s*disable vpn/i.test(document.body?.innerText ?? document.documentElement.innerHTML)) return;
            const e = (() => {
                for (const e of Ln) {
                    const t = document.getElementById(e);
                    if (t instanceof HTMLAnchorElement) {
                        const e = xn(t.getAttribute("href")) ?? xn(t.href);
                        if (e) return e
                    }
                }
                const t = document.documentElement.innerHTML;
                for (const e of Ln) {
                    const n = xn(t.match(new RegExp(`id=["']${e}["'][^>]*href=["'](https?:[^"']+)["']`, "i"))?.[1]) ?? xn(t.match(new RegExp(`href=["'](https?:[^"']+)["'][^>]*id=["']${e}["']`, "i"))?.[1]);
                    if (n) return n
                }
                return null
            })();
            if (e) return qn = !0, Tn(), void(await _n(e));
            const n = ((t, e) => {
                const n = t.match(/(?:document|window)\.location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/)?.[1] ?? t.match(/<a\s[^>]*href=["'](https?:[^"']+)["']/i)?.[1];
                if (!n) return null;
                try {
                    const t = new URL(n, e);
                    return t.origin === new URL(e).origin ? null : t.href
                } catch {
                    return null
                }
            })(document.documentElement.innerHTML, location.href);
            n && !(t => {
                try {
                    const e = new URL(t);
                    return ((t, e) => {
                        const n = t.toLowerCase();
                        return e.some(t => n === t || n.endsWith(`.${t}`))
                    })(e.hostname, vn) && !!Sn(e.pathname)
                } catch {
                    return !1
                }
            })(n) && (qn = !0, Tn(), await Mn(t, n))
        }, Rn = "https://link4sub.com", Pn = /^[A-Za-z0-9_-]{3,}$/, Dn = t => /^https?:\/\//i.test(t), Nn = "skip-wait-link4sub", Bn = t => {
            const e = t.data?.data,
                n = e?.lnk ? Object.values(e.lnk) : [],
                o = "string" == typeof n[0]?.url ? n[0].url.trim() : "";
            if (!o) return null;
            const r = Dn(o) ? o : (t => {
                try {
                    return decodeURIComponent(atob(t))
                } catch {
                    return t
                }
            })(o);
            if (!Dn(r)) return null;
            const i = Number(e?.info?.userId),
                a = Array.isArray(e?.aApi?.userId) ? e.aApi.userId : [],
                s = (e?.aApi?.lAPI ?? []).filter(t => "string" == typeof t && t.length > 0);
            return Number.isFinite(i) && a.includes(i) && s.length ? `${s[Math.floor(Math.random()*s.length)]}${r}` : r
        }, Un = async (t, e) => {
            e?.({
                lead: "Hang tight — unlocking your link.",
                detail: "Skip Wait is skipping Link4Sub waits for you.",
                status: "Fetching link data"
            });
            const n = (navigator.language || "en").split("-")[0] || "en",
                o = (() => {
                    const t = document.documentElement.innerHTML.match(/window\.SLB_api_url\s*=\s*["'](https?:\/\/[^"']+)["']/)?.[1];
                    if (!t) return Rn;
                    try {
                        return new URL(t).origin
                    } catch {
                        return Rn
                    }
                })() || "https://link4sub.com",
                r = await fetch(`${o}/api/${encodeURIComponent(t)}/fetch-data?lang=${encodeURIComponent(n)}`, {
                    credentials: "omit",
                    cache: "no-store",
                    headers: {
                        Accept: "application/json"
                    }
                });
            if (!r.ok) throw new Error("http");
            const i = await r.json();
            if ("success" !== i.status) throw new Error("status");
            const a = Bn(i);
            if (!a) throw new Error("dest");
            return e?.({
                lead: "Almost there.",
                detail: "Opening your destination now.",
                status: "Opening your link"
            }), a
        }, Wn = (() => {
            let t = null,
                e = null,
                n = 0,
                o = "",
                r = "",
                i = "";
            const a = () => `${o}${".".repeat(n+1)}`,
                s = () => (document.documentElement.classList.add(kt(Nn)), t || (t = $t({
                    id: Nn,
                    brand: "Skip Wait",
                    note: {
                        lead: r,
                        detail: i
                    },
                    status: a(),
                    countdownLabel: "Your link opens in"
                }), t));
            return {
                progress: c => {
                    var l;
                    l = c.status, o = l.replace(/\.+$/, ""), r = c.lead, i = c.detail, (() => {
                        n = 0;
                        const o = s();
                        o.setNote({
                            lead: r,
                            detail: i
                        }), o.setStatus(a()), o.setError(null), null == e && (e = window.setInterval(() => {
                            n = (n + 1) % 3, t?.setStatus(a())
                        }, 450))
                    })()
                },
                setError: t => {
                    null != e && (clearInterval(e), e = null), o = t, r = "Something went wrong.", i = "Reload the short link and try again.";
                    const n = s();
                    n.setNote({
                        lead: r,
                        detail: i
                    }), n.setStatus(t), n.setError(t)
                }
            }
        })(), Hn = !1, Fn = async t => {
            if (!Hn) {
                Hn = !0, chrome.runtime.sendMessage({
                    type: "INJECT_VISIBILITY_SPOOF"
                }).catch(() => {});
                try {
                    const e = await Un(t, Wn.progress);
                    D(), location.replace(e)
                } catch {
                    Hn = !1, Wn.setError("Could not unlock.")
                }
            }
        }, zn = "vuotnhanh", jn = /^[A-Za-z0-9]{3,12}$/, Yn = new Set(["auth", "go", "go-to", "go_to", "api", "images", "frontend", "cdn-cgi"]), Gn = t => /^https?:\/\//i.test(t), Vn = t => {
            try {
                const e = new URL(t),
                    n = e.hostname.toLowerCase();
                if ("gtraffic.io" !== n && !n.endsWith(".gtraffic.io")) return null;
                const o = e.searchParams.get("url")?.trim() ?? "";
                return Gn(o) ? o : null
            } catch {
                return null
            }
        }, Zn = () => document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")?.trim() || null, Jn = "skip-wait-vuotnhanh", Xn = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        }, Kn = (() => {
            let t = null,
                e = null,
                n = 0,
                o = "",
                r = "",
                i = "";
            const a = () => `${o}${".".repeat(n+1)}`,
                s = () => (document.documentElement.classList.add(kt(Jn)), t || (t = $t({
                    id: Jn,
                    brand: "Skip Wait",
                    note: {
                        lead: r,
                        detail: i
                    },
                    status: a(),
                    countdownLabel: "Your link opens in"
                }), t));
            return {
                progress: c => {
                    var l;
                    l = c.status, o = l.replace(/\.+$/, ""), r = c.lead, i = c.detail, (() => {
                        n = 0;
                        const o = s();
                        o.setNote({
                            lead: r,
                            detail: i
                        }), o.setStatus(a()), o.setError(null), null == e && (e = window.setInterval(() => {
                            n = (n + 1) % 3, t?.setStatus(a())
                        }, 450))
                    })()
                },
                setError: t => {
                    null != e && (clearInterval(e), e = null), o = t, r = "Something went wrong.", i = "Reload the short link and try again.";
                    const n = s();
                    n.setNote({
                        lead: r,
                        detail: i
                    }), n.setStatus(t), n.setError(t)
                }
            }
        })(), Qn = !1, to = async t => {
            if (!Qn) {
                Qn = !0, Xn();
                try {
                    const e = await (async (t, e) => {
                        const n = Vn(location.href);
                        if (n) return e?.({
                            lead: "Almost there.",
                            detail: "Opening your destination now.",
                            status: "Opening your link"
                        }), n;
                        e?.({
                            lead: "Hang tight — unlocking your link.",
                            detail: "Skip Wait is skipping VuotNhanh waits for you.",
                            status: "Requesting unlock"
                        });
                        const o = Zn();
                        if (!o) throw new Error("csrf");
                        const r = await fetch(`${location.origin}/go/sf`, {
                            method: "POST",
                            credentials: "include",
                            cache: "no-store",
                            headers: {
                                Accept: "application/json",
                                "Content-Type": "application/x-www-form-urlencoded",
                                "X-CSRF-TOKEN": o
                            },
                            body: new URLSearchParams({
                                alias: t
                            })
                        });
                        if (!r.ok) throw new Error("http");
                        const i = await r.json(),
                            a = "string" == typeof i.url_redirect ? i.url_redirect.trim() : "";
                        if ("success" !== i.status || !Gn(a)) throw new Error("sf");
                        return e?.({
                            lead: "Almost there.",
                            detail: "Opening your destination now.",
                            status: "Opening your link"
                        }), a
                    })(t ?? "", Kn.progress);
                    D(), location.replace(e)
                } catch {
                    Qn = !1, Kn.setError("Could not unlock.")
                }
            }
        }, eo = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/;

    function no(t = location.pathname) {
        const e = t.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
        return 1 === e.length && eo.test(e[0])
    }
    var oo = "skip-wait-bblink-overlay",
        ro = "skip-wait-bblink-boot",
        io = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        ao = null,
        so = !1,
        co = swDelay,
        lo = (t = "Getting things ready…") => {
            const e = kt(oo);
            if (document.documentElement.classList.add(e), !document.getElementById(ro)) {
                const t = document.createElement("style");
                t.id = ro, t.textContent = Lt(oo, e), (document.head || document.documentElement).appendChild(t)
            }
            return ao ? (ao.setNote(io), ao.setStatus(t), ao.setError(null), ao) : ao = $t({
                id: oo,
                brand: "Skip Wait",
                note: io,
                status: t,
                countdownLabel: "Your link opens in"
            })
        },
        uo = t => (new DOMParser).parseFromString(t, "text/html").querySelector("#form-continue"),
        mo = async t => {
            const e = new URLSearchParams;
            for (const n of t.querySelectorAll("input[name], textarea[name]")) e.append(n.name, n.value);
            try {
                const n = new URL(t.getAttribute("action")?.trim() || location.href, location.href).href,
                    o = await fetch(n, {
                        method: "POST",
                        body: e,
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                        }
                    });
                return o.ok ? await o.text() : null
            } catch {
                return null
            }
        }, po = async (t, e) => {
            const n = Te(t, location.href);
            if (!n) return null;
            const o = (t => {
                const e = t.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                return e?.[1] ? Math.max(0, parseInt(e[1], 10)) : 0
            })(t);
            o > 0 && (e.setStatus("Waiting for the short timer…"), e.startCountdown(Date.now() + 1e3 * o), await co(1e3 * o + 500), e.hideCountdown()), e.setStatus("Unlocking your link…");
            let r = await $e(n, location.href);
            const i = Date.now() + 3e3;
            for (; !r && Date.now() < i;) await co(200), r = await $e(n, location.href);
            return r
        }, ho = async () => {
            (() => {
                chrome.runtime.sendMessage({
                    type: "INJECT_VISIBILITY_SPOOF"
                }).catch(() => {});
                try {
                    document.cookie = "ab=1; path=/"
                } catch {}
            })();
            const t = lo("Getting things ready…");
            let e = document.documentElement.outerHTML,
                n = uo(e);
            for (; n;) {
                const o = n.querySelector('input[name="page"]')?.value?.trim();
                t.setStatus(o ? `Skipping step ${o}…` : "Skipping continue page…");
                const r = await mo(n);
                if (!r) return void t.setError("Couldn’t skip this continue step. Reload and try again.");
                e = r, n = uo(e)
            }
            const o = await po(e, t);
            o ? (t.setStatus("Opening your link…"), D(), location.replace(o)) : t.setError("Couldn’t unlock this link. Reload and try again.")
        }, fo = () => {
            !so && no() && document.querySelector('#form-continue, #go-link input[name="ad_form_data"]') && (so = !0, ho().catch(() => lo().setError("Unlock failed. Reload and try again.")))
        };

    function wo(t = location.href) {
        try {
            const e = new URL(t);
            return /^\/subtounlock\/(api|get)\/?$/i.test(e.pathname) && e.searchParams.get("id")?.trim() || null
        } catch {
            return null
        }
    }
    var go = "skip-wait-bbmkts-subtounlock-overlay",
        yo = "skip-wait-bbmkts-subtounlock-boot",
        ko = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to complete the subscribe steps."
        },
        bo = null,
        vo = !1,
        So = (t = "Getting things ready…") => {
            const e = kt(go);
            if (document.documentElement.classList.add(e), !document.getElementById(yo)) {
                const t = document.createElement("style");
                t.id = yo, t.textContent = Lt(go, e), (document.head || document.documentElement).appendChild(t)
            }
            return bo ? (bo.setNote(ko), bo.setStatus(t), bo.setError(null), bo) : bo = $t({
                id: go,
                brand: "Skip Wait",
                note: ko,
                status: t
            })
        },
        Eo = async () => {
            const t = wo();
            if (!t) return;
            const e = So("Unlocking your link…"),
                n = await (async t => {
                    const e = await fetch(`https://game.binhbun.com/getlink?id=${encodeURIComponent(t)}`, {
                        credentials: "omit",
                        headers: {
                            Accept: "application/json"
                        }
                    });
                    if (!e.ok) return null;
                    const n = (await e.json()).data?.linkfile;
                    return "string" == typeof n && /^https?:\/\//i.test(n.trim()) ? n.trim() : null
                })(t);
            n ? (e.setStatus("Opening your link…"), D(), location.replace(n)) : e.setError("Destination not found. Reload and try again.")
        }, xo = () => {
            !vo && wo() && (vo = !0, Eo().catch(() => {
                So("Unlocking your link…").setError("Unlock failed. Reload and try again.")
            }))
        };
    var Lo = /^(?=.*[A-Za-z])[A-Za-z0-9]{3,16}$/;

    function Co() {
        const t = document.cookie.match(/(?:^|;\s*)tp1=([^;]+)/)?.[1]?.trim();
        return t && Lo.test(t) ? t : null
    }

    function Io(t) {
        const [e, ...n] = t.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
        return !e || n.length > 0 || !Lo.test(e) ? null : e
    }
    var To = {
            lead: "Hang tight — unlocking your link.",
            detail: "Skip Wait is handling JobSheel for you."
        },
        $o = swTnNote;

    function Ao() {
        chrome.runtime.sendMessage({
            type: "INJECT_VISIBILITY_SPOOF"
        }).catch(() => {})
    }

    function qo(t, e) {
        let n = null;
        return (o, r = To) => {
            const i = kt(t);
            if (document.documentElement.classList.add(i), !document.getElementById(e)) {
                const n = document.createElement("style");
                n.id = e, n.textContent = Lt(t, i), (document.head ?? document.documentElement).appendChild(n)
            }
            return n ? (n.setNote(r), n.setStatus(o), n.setError(null), n) : (n = $t({
                id: t,
                brand: "Skip Wait",
                note: r,
                status: o
            }), n)
        }
    }
    var _o = "skip-wait-jobsheel-baby",
        Mo = "skip-wait-jobsheel-baby-gate",
        Oo = "data-sw-jobsheel-pin",
        Ro = swTnFrames,
        Po = qo(_o, "skip-wait-jobsheel-baby-boot"),
        Do = swDelay;

    function No() {
        for (const t of document.querySelectorAll('[name="cf-turnstile-response"]')) {
            const e = t.value?.trim();
            if (e && e.length > 20) return e
        }
        return null
    }
    async function Bo() {
        const t = Po("Complete the captcha below.", $o);
        let e = null,
            n = 0;
        const o = () => {
                e?.(), e = null, document.getElementById(Mo)?.remove()
            },
            r = () => {
                const o = document.querySelector(".captcha-wrap") ?? document.querySelector(".cf-turnstile");
                o && (o.id || (o.id = "skip-wait-jobsheel-turnstile"), function(t) {
                    const e = kt(_o),
                        n = [];
                    for (let r = t.parentElement, i = 0; r && r !== document.body && r !== document.documentElement; r = r.parentElement, i++) r.setAttribute(Oo, String(i)), n.push(`[${Oo}="${i}"]`);
                    let o = document.getElementById(Mo);
                    o || (o = document.createElement("style"), o.id = Mo, (document.head ?? document.documentElement).appendChild(o)), o.textContent = n.map(t => `html.${e} ${t}{transform:none!important}`).join("")
                }(o), e && document.getElementById(o.id) || (e?.(), e = Nt({
                    overlayId: _o,
                    mount: t.turnstileMount,
                    widgetId: o.id,
                    styleId: "skip-wait-jobsheel-baby-turnstile-pin",
                    alsoVisibleSelectors: Ro
                }), n || (n = Date.now())))
            };
        for (;;) {
            r();
            const t = No();
            if (t && n && Date.now() - n >= 400) return o(), t;
            await Do(200)
        }
    }
    var Uo = qo("skip-wait-jobsheel-mediator", "skip-wait-jobsheel-mediator-boot"),
        Wo = !1;

    function Ho() {
        const t = document.querySelector("a#btn6[href]")?.href?.trim() ?? "";
        if (!/^https?:\/\//i.test(t)) return null;
        try {
            const e = new URL(t).hostname.toLowerCase();
            return "go.babylinks.in" === e || e.endsWith(".babylinks.in") ? t : null
        } catch {
            return null
        }
    }

    function Fo() {
        if (Wo) return;
        const t = Ho();
        if (t) return Wo = !0, Uo("Opening Babylinks…"), void location.replace(t);
        const e = Co();
        if (!e) return;
        const n = function(t) {
            for (const e of document.querySelectorAll('form[name="tp1"], form[name="tp"]'))
                for (const n of e.elements)
                    if (n instanceof HTMLInputElement && !n.disabled && /^newwpsafelink\d*$/i.test(n.name) && n.value === t) return e;
            return null
        }(e);
        n && (Wo = !0, Uo("Skipping JobSheel gate…"), HTMLFormElement.prototype.submit.call(n))
    }
    var zo = qo("skip-wait-jobsheel-babylinks", "skip-wait-jobsheel-babylinks-boot"),
        jo = swDelay,
        Yo = !1;

    function Go() {
        const t = document.querySelector("#form-continue");
        if (t) return t;
        const e = document.querySelector('form input[name="action"][value="continue"]')?.form ?? null;
        return e && "link-view" !== e.id ? e : null
    }
    async function Vo(t, e) {
        const n = Te(t, location.href);
        if (!n) return null;
        e.setStatus("Unlocking…");
        let o = await $e(n, location.href);
        if (o) return o;
        const r = function(t) {
            const e = t.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
            if (e?.[1]) return Math.max(0, parseInt(e[1], 10));
            const n = parseInt(document.querySelector("#timer, #countdown, .timer, #counter")?.textContent?.trim() ?? "", 10);
            return Number.isFinite(n) && n > 0 ? n : 0
        }(t);
        if (r <= 0) {
            Ae();
            const t = document.querySelector("a.get-link, #gt-link");
            return t?.href?.startsWith("http") ? t.href : null
        }
        if (Ao(), e.setStatus("Waiting…"), e.startCountdown(Date.now() + 1e3 * r), await jo(1e3 * r + 500), e.hideCountdown(), e.setStatus("Unlocking…"), o = await $e(n, location.href), o) return o;
        const i = Date.now() + 3e3;
        for (; !o && Date.now() < i && (Ae(), o = await $e(n, location.href), !o);) await jo(200);
        if (o) return o;
        const a = document.querySelector("a.get-link, #gt-link");
        return a?.href?.startsWith("http") ? a.href : null
    }
    async function Zo() {
        if (Yo) return;
        Yo = !0, Ao(), document.cookie = "ab=1; path=/";
        const t = zo("Unlocking…");
        let e = document.documentElement.outerHTML;
        const n = Go();
        if (n) {
            t.setStatus("Skipping continue…");
            const o = await async function(t) {
                const e = new URLSearchParams;
                for (const n of t.querySelectorAll("input[name], textarea[name]")) e.append(n.name, n.value);
                try {
                    const t = await fetch(location.href, {
                        method: "POST",
                        body: e,
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded"
                        }
                    });
                    return t.ok ? await t.text() : null
                } catch {
                    return null
                }
            }(n);
            if (!o) return void t.setError("Could not unlock.");
            e = o
        }
        const o = await Vo(e, t);
        o ? (t.setStatus("Opening…"), D(), location.replace(o)) : t.setError("Could not unlock.")
    }

    function Jo() {
        Yo || Io(location.pathname) && (document.querySelector('#go-link input[name="ad_form_data"], form[action*="/links/go"]') || Go() ? Zo() : "loading" !== document.readyState && zo("Waiting for unlock…"))
    }
    var Xo = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,12}$/,
        Ko = t => {
            const [e, ...n] = t.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
            return e && 0 === n.length && Xo.test(e) ? e : null
        },
        Qo = "skip-wait-unlocktoearn",
        tr = ["Starting UnlockToEarn", "Clearing unlock steps", "Resolving your destination", "Opening your destination"],
        er = "UnlockToEarn is finishing.",
        nr = "Skip Wait stays on UnlockToEarn and opens your destination when ready.",
        or = "recaptchadiv",
        rr = ['iframe[src*="recaptcha"]', 'iframe[src*="recaptcha.net"]', 'iframe[src*="google.com/recaptcha"]', 'iframe[title*="reCAPTCHA"]'],
        ir = (() => {
            let t = null,
                e = null,
                n = null,
                o = 0,
                r = 0,
                i = !1,
                a = "";
            const s = () => {
                    null != e && (clearInterval(e), e = null), null != n && (clearInterval(n), n = null)
                },
                c = () => `${tr[r]}${".".repeat(o+1)}`,
                l = (e, n) => {
                    document.documentElement.classList.add(kt(Qo));
                    const o = {
                            lead: e ?? er,
                            detail: n ?? nr
                        },
                        r = i ? a : c();
                    return t ? (t.setNote(o), t.setStatus(r), t.setError(null), t) : (t = $t({
                        id: Qo,
                        brand: "Skip Wait",
                        note: o,
                        status: r,
                        countdownLabel: "Ready in"
                    }), t)
                };
            return {
                id: Qo,
                progress: () => {
                    i = !1, a = "", r = 0, o = 0;
                    const s = l();
                    return i || (null == e && (e = window.setInterval(() => {
                        !i && t && (o = (o + 1) % 3, t.setStatus(c()))
                    }, 450)), null == n && (n = window.setInterval(() => {
                        !i && t && (r >= tr.length - 1 ? null != n && (clearInterval(n), n = null) : (r += 1, o = 0, t.setStatus(c())))
                    }, 1800))), s
                },
                captcha: (t = "Waiting for verification") => (i = !0, s(), a = t, l("UnlockToEarn needs a quick check.", "Complete the box below. Skip Wait continues on UnlockToEarn when it’s done.")),
                setError: t => {
                    i = !0, s(), a = t;
                    const e = l("UnlockToEarn hit a snag.", "Reload this UnlockToEarn link and try again.");
                    return e.setStatus(t), e.setError(t), e
                }
            }
        })(),
        ar = !1,
        sr = async t => {
            if (!ar) {
                ar = !0;
                try {
                    ir.progress();
                    const n = await (t => new Promise((e, n) => {
                        chrome.runtime.sendMessage({
                            type: "UNLOCKTOEARN_RESOLVE",
                            alias: t
                        }, t => {
                            !chrome.runtime.lastError && t?.ok && t.dest ? e(t.dest) : n(new Error("resolve"))
                        })
                    }))(t);
                    if (!(await (e = n, new Promise(t => {
                            chrome.runtime.sendMessage({
                                type: "UNLOCKTOEARN_OPEN_DEST",
                                url: e
                            }, e => {
                                t(!chrome.runtime.lastError && !0 === e)
                            })
                        })))) return ar = !1, void ir.setError("Couldn’t open your UnlockToEarn destination. Reload and try again.");
                    D()
                } catch {
                    ar = !1, ir.setError("Couldn’t finish UnlockToEarn. Reload this link and try again.")
                }
                var e
            }
        }, cr = t => {
            const e = ir.captcha();
            let n = null;
            const o = () => {
                (t => {
                    const e = document.querySelector("#lsrecaptcha-form");
                    if (!e || "1" === e.dataset.swArmed) return;
                    e.dataset.swArmed = "1";
                    const n = () => {
                        (async () => {
                            try {
                                await fetch(e.action || location.href, {
                                    method: "POST",
                                    body: new FormData(e),
                                    credentials: "include",
                                    redirect: "manual"
                                })
                            } catch {}
                            await sr(t)
                        })()
                    };
                    e.addEventListener("submit", t => {
                        t.preventDefault(), t.stopImmediatePropagation(), n()
                    }, !0), e.submit = () => {
                        n()
                    }
                })(t), !n && document.getElementById(or) && (n = Nt({
                    overlayId: ir.id,
                    mount: e.turnstileMount,
                    widgetId: or,
                    styleId: "skip-wait-unlocktoearn-captcha-pin",
                    alsoVisibleSelectors: rr
                }))
            };
            o(), new MutationObserver(o).observe(document.documentElement, {
                childList: !0,
                subtree: !0
            })
        }, lr = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/, ur = () => {
            if (/[?&](?:pid|vid|skip_sub)=/.test(location.search) || document.querySelector('#go-link, form[action*="/links/go"], a.get-link') || !document.querySelector('a.gate-btn-skip[href*="skip_sub"]') && !document.querySelector(".gate-btn-skip, .gate-hero, #gatePayBtn")) return;
            const t = document.querySelector('a.gate-btn-skip[href*="skip_sub"]');
            if (t?.href) return void location.replace(t.href);
            const e = new URL(location.href);
            e.searchParams.set("skip_sub", "1"), location.replace(e.href)
        };
    var dr = "skip-wait-gplinks-mediator",
        mr = "skip-wait-gplinks-mediator-boot",
        pr = "skip-wait-gplinks-mediator-run",
        hr = "sw_waited",
        fr = {
            lead: "Unlocking your link",
            detail: "Skip Wait is completing the required wait, then opening your unlock page."
        },
        wr = swDelay,
        gr = t => {
            const e = document.cookie.match(new RegExp(`(?:^|;\\s*)${t}=([^;]*)`));
            return e?.[1] ? decodeURIComponent(e[1]) : null
        },
        yr = (t, e) => {
            document.cookie = `${t}=${encodeURIComponent(e)}; path=/; Max-Age=600; Secure`
        },
        kr = () => {
            const t = gr("lid"),
                e = gr("pid"),
                n = gr("vid"),
                o = Number(gr("pages") || 0),
                r = Number(gr("step_count") || 0);
            return t && e && n && Number.isFinite(o) && !(o < 1) ? {
                lid: t,
                pid: e,
                vid: n,
                pages: o,
                step: Number.isFinite(r) && r > 0 ? r : 0
            } : null
        },
        br = () => !!document.querySelector('#adsForm, form[name="ads-track-data"]') || !!(gr("lid") && gr("pid") && gr("vid")),
        vr = async (t, e, n) => {
            yr("step_count", String(e)), yr("imps", "1"), await fetch(location.href, {
                method: "POST",
                credentials: "include",
                redirect: "manual",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    form_name: "ads-track-data",
                    step_id: String(e),
                    ad_impressions: "1",
                    visitor_id: t.vid,
                    next_target: n
                })
            })
        }, Sr = null, Er = (t = "Getting ready…") => ((() => {
            const t = kt(dr);
            if (document.documentElement.classList.add(t), document.getElementById(mr)) return;
            const e = document.createElement("style");
            e.id = mr, e.textContent = Lt(dr, t), (document.head || document.documentElement).appendChild(e)
        })(), Sr ? (Sr.setNote(fr), Sr.setStatus(t), Sr) : Sr = $t({
            id: dr,
            brand: "Skip Wait",
            note: fr,
            status: t,
            countdownLabel: "Ready in"
        })), xr = async t => {
            t.setStatus("Starting session…");
            const e = await (async () => {
                const t = Date.now() + 2e3;
                for (;;) {
                    const e = kr();
                    if (e) return e;
                    if (Date.now() >= t) return null;
                    await wr(200)
                }
            })();
            if (!e) return sessionStorage.removeItem(pr), void t.setStatus("No active session. Open the short link again.");
            const n = Math.max(0, e.pages - e.step);
            t.setNote({
                lead: fr.lead,
                detail: `${e.pages} step${1===e.pages?"":"s"} after the server wait.`
            });
            const o = n * (() => {
                const t = parseInt(document.getElementById("myTimer")?.textContent?.trim() ?? "", 10);
                return Number.isFinite(t) && t > 0 ? 1e3 * t : 15e3
            })() * 2;
            if (o > 0 && gr(hr) !== e.vid) {
                const n = Date.now() + o;
                t.setStatus("Server wait required…"), t.startCountdown(n), await (async t => {
                    for (;;) {
                        const e = t - Date.now();
                        if (e <= 0) return;
                        await wr(Math.min(250, e))
                    }
                })(n), t.hideCountdown(), yr(hr, e.vid)
            }
            const r = (t => `https://gplinks.co/${encodeURIComponent(t.lid)}?pid=${encodeURIComponent(t.pid)}&vid=${encodeURIComponent(t.vid)}`)(e);
            for (let i = e.step; i < e.pages;) {
                const n = i + 1;
                t.setStatus(`Completing step ${n} of ${e.pages}…`), await vr(e, n, n >= e.pages ? r : location.href), i = n
            }
            t.setStatus("Opening unlock page…"), sessionStorage.removeItem(pr), location.assign(r)
        };
    var Lr = "skip-wait-gplinks-links-go",
        Cr = "skip-wait-gplinks-links-go-boot",
        Ir = "captchaLinksGo",
        Tr = swTnToken,
        $r = swTnFrames,
        Ar = "drive.olamovies.download",
        qr = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        _r = swTnNote,
        Mr = swDelay,
        Or = t => t.startsWith("http://") || t.startsWith("https://"),
        Rr = (t = document) => !!t.querySelector('#go-link,form[action*="/links/go"],a.get-link'),
        Pr = () => /[?&](?:pid|vid)=/.test(location.search) || Rr(),
        Dr = () => document.querySelector('#go-link, form[action*="/links/go"]'),
        Nr = t => !!t.querySelector(`#${Ir}, .cf-turnstile, ${Tr}`),
        Br = t => {
            for (const e of t.querySelectorAll(Tr)) {
                const t = e.value?.trim();
                if (t && t.length > 20) return !0
            }
            return !1
        },
        Ur = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        Wr = null,
        Hr = () => {
            const t = kt(Lr);
            if (document.documentElement.classList.add(t), document.getElementById(Cr)) return;
            const e = document.createElement("style");
            e.id = Cr, e.textContent = Lt(Lr, t), (document.head || document.documentElement).appendChild(e)
        },
        Fr = (t = qr, e = "Getting things ready…") => (Hr(), Wr ? (Wr.setNote(t), Wr.setStatus(e), Wr) : Wr = $t({
            id: Lr,
            brand: "Skip Wait",
            note: t,
            status: e,
            countdownLabel: "Your link opens in"
        })),
        zr = async t => {
            const e = (() => {
                const t = document.documentElement.innerHTML.match(/"counter_value"\s*:\s*"?(\d+)/);
                if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                const e = document.querySelector("#timer, #countdown, .timer, #counter"),
                    n = parseInt(e?.textContent?.trim() ?? "", 10);
                return Number.isFinite(n) && n > 0 ? n : 0
            })();
            e > 0 && (Ur(), t.setStatus("Waiting for timer…"), t.startCountdown(Date.now() + 1e3 * e), await Mr(1e3 * e), t.hideCountdown()), Ae();
            const n = Date.now() + 2500;
            for (; Date.now() < n;) {
                const t = document.querySelector("a.get-link");
                if (t?.href && Or(t.href)) return t.href;
                await Mr(250)
            }
            return (() => {
                const t = Te(document.documentElement.innerHTML, location.href);
                return t ? $e(t, location.href) : Promise.resolve(null)
            })()
        }, jr = async t => {
            const e = Fr();
            (t => {
                try {
                    const e = new URL(t).hostname.toLowerCase();
                    return e === Ar || e.endsWith(`.${Ar}`)
                } catch {
                    return !1
                }
            })(t) && (e.setStatus("Opening soon…"), e.startCountdown(Date.now() + 5e3), await Mr(5e3), e.hideCountdown()), e.setStatus("Redirecting now…"), D(), location.assign(t)
        }, Yr = t => {
            t.stopPin?.(), t.stopPin = null, t.done = !0
        }, Gr = () => {
            Ur(), Fr(qr, "Getting things ready…");
            const t = {
                    started: !1,
                    done: !1,
                    stopPin: null
                },
                e = {
                    done: !1,
                    inFlight: !1
                };
            let n = !1;
            const o = () => {
                    if (n) return;
                    const o = Dr();
                    o && Nr(o) && !Br(o) ? ((t, e) => {
                        if (e.started || e.done) return;
                        e.started = !0;
                        const n = Fr(_r, "Waiting for Turnstile…"),
                            o = () => {
                                e.done || e.stopPin || document.getElementById(Ir) && (e.stopPin = Nt({
                                    overlayId: Lr,
                                    mount: n.turnstileMount,
                                    widgetId: Ir,
                                    styleId: "skip-wait-gplinks-turnstile-pin",
                                    alsoVisibleSelectors: $r
                                }))
                            };
                        o();
                        const r = () => {
                            e.done || (document.contains(t) ? (o(), Br(t) ? (Yr(e), Fr(qr, "Getting things ready…")) : requestAnimationFrame(r)) : Yr(e))
                        };
                        requestAnimationFrame(r)
                    })(o, t) : (async t => {
                        if (t.done || t.inFlight) return t.done;
                        const e = Dr();
                        if (!e) return !1;
                        if (Nr(e) && !Br(e)) return !1;
                        t.inFlight = !0;
                        try {
                            const n = Fr(qr, "Getting things ready…"),
                                o = await zr(n);
                            return t.done = !0, o ? (await jr(o), !0) : (n.setStatus("Opening destination…"), D(), e.submit(), !0)
                        } finally {
                            t.inFlight = !1
                        }
                    })(e).then(t => {
                        t && (n = !0)
                    })
                },
                r = new MutationObserver(o);
            o(), r.observe(document.documentElement, {
                attributeFilter: ["href", "value"],
                attributes: !0,
                childList: !0,
                subtree: !0
            });
            let i = 0;
            const a = () => {
                n || (o(), ++i < 48 && queueMicrotask(a))
            };
            queueMicrotask(a);
            let s = 0;
            const c = () => {
                n || (o(), ++s < 960 && requestAnimationFrame(c))
            };
            requestAnimationFrame(c)
        };
    var Vr = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        Zr = "skip-wait-nitrolink",
        Jr = (() => {
            let t = null,
                e = null,
                n = 0,
                o = "",
                r = "",
                i = "",
                a = !1;
            const s = () => {
                    null != e && (clearInterval(e), e = null)
                },
                c = () => `${o}${".".repeat(n+1)}`,
                l = () => (document.documentElement.classList.add(kt(Zr)), t || (t = $t({
                    id: Zr,
                    brand: "Skip Wait",
                    note: {
                        lead: r,
                        detail: i
                    },
                    status: c(),
                    countdownLabel: "Your link opens in"
                }), t)),
                u = () => {
                    const t = l();
                    return t.setNote({
                        lead: r,
                        detail: i
                    }), t.setStatus(a ? o : c()), t
                };
            return {
                progress: l => {
                    var d;
                    if (r = l.lead, i = l.detail, d = l.status, o = d.replace(/\.+$/, ""), "number" == typeof l.waitEndTs && l.waitEndTs > Date.now()) {
                        a = !0, s();
                        const t = u();
                        return t.startCountdown(l.waitEndTs), t
                    }
                    return a = !1, t?.hideCountdown(), a || (n = 0, u(), null == e && (e = window.setInterval(() => {
                        !a && t && (n = (n + 1) % 3, t.setStatus(c()))
                    }, 450))), t
                },
                setError: e => {
                    a = !0, s(), t?.hideCountdown();
                    const n = l();
                    return n.setNote({
                        lead: "Something went wrong.",
                        detail: "Reload this page and try again."
                    }), n.setStatus(e), n
                }
            }
        })(),
        Xr = !1,
        Kr = async () => {
            if (Xr) return;
            Xr = !0;
            const t = (() => {
                const t = t => {
                    "NITROLINK_PROGRESS" === t.type && "string" == typeof t.lead && "string" == typeof t.detail && "string" == typeof t.status && Jr.progress({
                        lead: t.lead,
                        detail: t.detail,
                        status: t.status,
                        ..."number" == typeof t.waitEndTs ? {
                            waitEndTs: t.waitEndTs
                        } : {}
                    })
                };
                return chrome.runtime.onMessage.addListener(t), () => chrome.runtime.onMessage.removeListener(t)
            })();
            try {
                Jr.progress({
                    lead: "Hang tight — unlocking your link.",
                    detail: "Skip Wait is working. You don’t need to tap anything.",
                    status: "Opening Nitro Link"
                });
                const t = await (n = location.href, new Promise((t, e) => {
                    chrome.runtime.sendMessage({
                        type: "NITROLINK_RESOLVE",
                        pageUrl: n
                    }, n => {
                        !chrome.runtime.lastError && n?.ok && n.dest ? t(n.dest) : e(new Error("resolve"))
                    })
                }));
                if (!(await (e = t, new Promise(t => {
                        chrome.runtime.sendMessage({
                            type: "NITROLINK_OPEN_DEST",
                            url: e
                        }, e => {
                            t(!chrome.runtime.lastError && !0 === e)
                        })
                    })))) return Xr = !1, void Jr.setError("Couldn’t open the destination. Reload and try again.");
                D()
            } catch {
                Xr = !1, Jr.setError("Couldn’t finish this short link. Reload and try again.")
            } finally {
                t()
            }
            var e, n
        }, Qr = ["adurl.io", "cut4money.com", "shr2.link"], ti = "sw-cut4money-chain", ei = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/, ni = () => {
            try {
                return Boolean(chrome?.runtime?.id && chrome.storage?.local)
            } catch {
                return !1
            }
        };

    function oi(t) {
        const e = t.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
        if (1 !== e.length) return null;
        const n = e[0];
        return ei.test(n) ? n : null
    }

    function ri(t) {
        try {
            const e = new URL(t),
                n = e.hostname.toLowerCase();
            return Qr.some(t => n === t || n.endsWith(`.${t}`)) ? oi(e.pathname) : null
        } catch {
            return null
        }
    }

    function ii(t) {
        try {
            const e = new URL(t),
                n = e.hostname.toLowerCase();
            return Qr.some(t => n === t || n.endsWith(`.${t}`)) ? e.origin : null
        } catch {
            return null
        }
    }
    async function ai() {
        if (!ni()) return null;
        try {
            const t = (await chrome.storage.local.get(ti))[ti];
            return t && "object" == typeof t && ("string" == typeof t.alias && ei.test(t.alias) && "string" == typeof t.origin && /^https?:\/\//i.test(t.origin)) ? "number" != typeof t.startedAt || t.startedAt <= 0 ? null : {
                alias: t.alias,
                origin: t.origin.replace(/\/$/, ""),
                startedAt: t.startedAt
            } : null
        } catch {
            return null
        }
    }
    async function si(t, e) {
        const n = e.replace(/\/$/, ""),
            o = await ai();
        if (o && o.alias === t && o.origin === n) return o;
        const r = {
            alias: t,
            origin: n,
            startedAt: Date.now()
        };
        if (!ni()) return r;
        try {
            await chrome.storage.local.set({
                [ti]: r
            })
        } catch {}
        return r
    }
    async function ci() {
        if (ni()) try {
            await chrome.storage.local.remove(ti)
        } catch {}
    }
    var li = "skip-wait-cut4money-unlock",
        ui = "skip-wait-cut4money-unlock-boot",
        di = {
            lead: "Hang tight — unlocking your link.",
            detail: "Skip Wait is working. You don’t need to tap anything."
        },
        mi = null,
        pi = !1,
        hi = swDelay,
        fi = () => {
            const t = kt(li);
            if (document.documentElement.classList.add(t), document.getElementById(ui)) return;
            const e = document.createElement("style");
            e.id = ui, e.textContent = Lt(li, t), (document.head || document.documentElement).appendChild(e)
        },
        wi = (t = "Getting things ready…") => (fi(), mi ? (mi.setStatus(t), mi) : mi = $t({
            id: li,
            brand: "Skip Wait",
            note: di,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        gi = () => !!document.querySelector('#go-link, form[action*="/links/go"]') && Boolean(document.querySelector('input[name="ad_form_data"]')),
        yi = () => /["']counter_value["']\s*:\s*["']?\d+/.test(document.documentElement.innerHTML) || Boolean(document.querySelector("#timer, #countdown, .timer, #counter")?.textContent?.trim()),
        ki = () => {
            const t = Te(document.documentElement.innerHTML, location.href);
            return t ? $e(t, location.href) : Promise.resolve(null)
        },
        bi = async () => {
            if (pi || !gi()) return;
            pi = !0, chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {}), (() => {
                const t = oi(location.pathname);
                t && si(t, location.origin)
            })();
            const t = wi("Getting things ready…");
            for (let i = 0; i < 50 && !yi(); i++) await hi(100);
            const e = (() => {
                const t = document.documentElement.innerHTML.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                const e = document.querySelector("#timer, #countdown, .timer, #counter"),
                    n = parseInt(e?.textContent?.trim() ?? "", 10);
                return Number.isFinite(n) && n > 0 ? n : 0
            })();
            if (e > 0 && (t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * e), await hi(1e3 * e), t.hideCountdown()), !gi()) return void(pi = !1);
            Ae();
            const n = document.querySelector("a.get-link, #gt-link");
            if (n?.href && (o = n.href, /^https?:\/\//i.test(o))) return t.setStatus("Opening your link…"), await ci(), D(), void location.replace(n.href);
            var o;
            t.setStatus("Unlocking your link…");
            let r = await ki();
            if (!r && e > 0) {
                t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * (e + 2));
                const n = Date.now() + 1e3 * (e + 2);
                for (; !r && Date.now() < n && (Ae(), r = await ki(), !r);) await hi(200);
                t.hideCountdown()
            }
            if (!r) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(pi = !1);
            t.setStatus("Opening your link…"), await ci(), D(), location.replace(r)
        };
    var vi = "skip-wait-cut4money-mediator",
        Si = "skip-wait-cut4money-mediator-boot",
        Ei = "#go_d",
        xi = /^page_skip\d+(?:_(\d+))?$/i,
        Li = null,
        Ci = !1,
        Ii = !1,
        Ti = null,
        $i = !1,
        Ai = !1,
        qi = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        _i = t => {
            try {
                const e = decodeURIComponent(t),
                    n = "=".repeat((4 - e.length % 4) % 4);
                return JSON.parse(atob(e + n))
            } catch {
                return null
            }
        },
        Mi = t => {
            try {
                const e = new URL(t).searchParams.get("token");
                if (!e) return null;
                const n = _i(e);
                if (!Array.isArray(n) || "string" != typeof n[0]) return null;
                const o = xi.exec(n[0]);
                if (!o) return null;
                const r = o[1] ? parseInt(o[1], 10) : 1;
                let i = 1,
                    a = n;
                for (; Array.isArray(a) && "string" == typeof a[2];) a = _i(a[2]), i += 1;
                const s = r + i - 1;
                return !Number.isFinite(r) || r < 1 || s < r ? null : {
                    step: r,
                    total: s
                }
            } catch {
                return null
            }
        },
        Oi = (t = "Getting things ready…", e = null) => {
            (() => {
                const t = kt(vi);
                if (document.documentElement.classList.add(t), document.getElementById(Si)) return;
                const e = document.createElement("style");
                e.id = Si, e.textContent = Lt(vi, t), (document.head || document.documentElement).appendChild(e)
            })();
            const n = e ? Mi(e) : null,
                o = (r = n?.step ?? null, i = n?.total ?? null, r && i ? {
                    lead: "Hang tight — unlocking your link.",
                    detail: `Step ${r} of ${i}. Skip Wait is skipping these waiting pages for you.`
                } : {
                    lead: "Hang tight — unlocking your link.",
                    detail: "Skip Wait is skipping these waiting pages for you."
                });
            var r, i;
            return Li ? (Li.setNote(o), Li.setStatus(t), Li) : Li = $t({
                id: vi,
                brand: "Skip Wait",
                note: o,
                status: t,
                countdownLabel: "Your link opens in"
            })
        },
        Ri = () => {
            const t = document.querySelector(Ei);
            return t ? (t => {
                const e = t.replace(/&amp;/g, "&").replace(/&#0*38;/g, "&").replace(/&#x0*26;/gi, "&").trim();
                if (!e || "#" === e || /^javascript:/i.test(e)) return null;
                try {
                    return new URL(e, location.href).href
                } catch {
                    return null
                }
            })(t.getAttribute("href") || t.href || "") : null
        },
        Pi = t => {
            const e = t ? (t => {
                const e = ri(t),
                    n = ii(t);
                if (e && n) return {
                    alias: e,
                    origin: n
                };
                try {
                    let e = new URL(t).searchParams.get("token");
                    for (; e;) {
                        const t = _i(e);
                        if (!Array.isArray(t)) break;
                        if ("string" == typeof t[1]) {
                            const e = ri(t[1]),
                                n = ii(t[1]);
                            if (e && n) return {
                                alias: e,
                                origin: n
                            }
                        }
                        e = "string" == typeof t[2] ? t[2] : null
                    }
                } catch {}
                return null
            })(t) : null;
            if (e) {
                if (Ti === e.alias) return;
                return Ti = e.alias, void si(e.alias, e.origin)
            }
            const n = function() {
                try {
                    for (const t of document.cookie.split(";")) {
                        const e = t.trim().split("=")[0] ?? "",
                            n = /^ref([A-Za-z0-9]{4,})$/.exec(e);
                        if (n?.[1] && ei.test(n[1])) return n[1]
                    }
                } catch {}
                return null
            }();
            n && Ti !== n && (Ti = n, si(n, "https://adurl.io"))
        },
        Di = t => {
            if (Ci) return;
            Ci = !0, qi(), Pi(t);
            const e = Mi(t);
            Oi(null != e ? `Skipping step ${e.step} of ${e.total}…` : "Moving to the next page…", t).setStatus(null !== ri(t) ? "Opening your link…" : "Moving to the next page…"), location.replace(t)
        },
        Ni = () => {
            if (Ci) return;
            const t = Ri();
            t ? Di(t) : (async () => {
                if (!Ai || Ci || Ii) return;
                if (Ri() || document.querySelector(Ei)) return;
                Ii = !0;
                const t = await ai();
                t ? (Oi("Returning to your short link…").setStatus("Returning to your short link…"), Ci = !0, qi(), location.replace(function(t) {
                    return `${t.origin}/${t.alias}`
                }(t))) : Ii = !1
            })()
        };
    var Bi = "skip-wait-tfly-overlay",
        Ui = "skip-wait-tfly-boot",
        Wi = "captchaShortlink",
        Hi = '[name="h-captcha-response"], [name="g-recaptcha-response"]',
        Fi = ['iframe[src*="hcaptcha.com"]', 'iframe[src*="newassets.hcaptcha.com"]'],
        zi = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        ji = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Yi = {
            lead: "Confirm you’re human.",
            detail: "Tap the checkbox below. We’ll continue automatically when it’s done."
        },
        Gi = null,
        Vi = !1,
        Zi = !1,
        Ji = !1,
        Xi = swDelay,
        Ki = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        Qi = (t = ji, e = "Getting things ready…") => ((() => {
            const t = kt(Bi);
            if (document.documentElement.classList.add(t), document.getElementById(Ui)) return;
            const e = document.createElement("style");
            e.id = Ui, e.textContent = Lt(Bi, t), (document.head || document.documentElement).appendChild(e)
        })(), Gi ? (Gi.setNote(t), Gi.setStatus(e), Gi.setError(null), Gi) : Gi = $t({
            id: Bi,
            brand: "Skip Wait",
            note: t,
            status: e,
            countdownLabel: "Your link opens in"
        })),
        ta = () => Boolean(document.querySelector('#go-link, form[action*="/links/go"]') && document.querySelector('input[name="ad_form_data"]')),
        ea = () => {
            if (Vi) return !0;
            const t = document.querySelector("#form-continue");
            if (!t) return !1;
            Vi = !0, Ki();
            const e = t.querySelector('input[name="page"]')?.value?.trim();
            return Qi(ji, e ? `Skipping step ${e}…` : "Skipping continue page…"), requestAnimationFrame(() => {
                requestAnimationFrame(() => t.submit())
            }), !0
        },
        na = () => {
            if (Zi) return !0;
            const t = (() => {
                const t = document.querySelector("#link-view");
                return t && (t.querySelector(`#${Wi}`) || t.querySelector(Hi)) ? t : null
            })();
            if (!t) return !1;
            Zi = !0, Ki();
            const e = Qi(Yi, "Waiting for captcha…");
            let n = null,
                o = !1,
                r = 0;
            const i = () => {
                    o || n || document.getElementById(Wi) && (n = Nt({
                        overlayId: Bi,
                        mount: e.turnstileMount,
                        widgetId: Wi,
                        styleId: "skip-wait-tfly-captcha-pin",
                        alsoVisibleSelectors: Fi
                    }))
                },
                a = () => {
                    o || (o = !0, cancelAnimationFrame(r), c.disconnect(), n?.(), n = null, e.setNote(ji), e.setStatus("Continuing…"), (() => {
                        const e = t.querySelector('#invisibleCaptchaShortlink, button.btn-captcha, button[type="submit"]');
                        if (e) return e.disabled = !1, e.removeAttribute("disabled"), void e.click();
                        t.submit()
                    })())
                },
                s = () => {
                    if (!o) {
                        if (!document.contains(t)) return o = !0, cancelAnimationFrame(r), c.disconnect(), void n?.();
                        i(), (t => {
                            for (const e of [t, document])
                                for (const t of e.querySelectorAll(Hi)) {
                                    const e = t.value?.trim();
                                    if (e && e.length > 20) return !0
                                }
                            return !1
                        })(t) ? a() : r = requestAnimationFrame(s)
                    }
                },
                c = new MutationObserver(() => {
                    o || s()
                });
            return c.observe(t, {
                attributeFilter: ["value", "disabled"],
                attributes: !0,
                childList: !0,
                subtree: !0
            }), i(), r = requestAnimationFrame(s), !0
        },
        oa = async () => {
            if (Ji || !ta()) return;
            Ji = !0, Ki();
            const t = Qi(ji, "Getting things ready…"),
                e = (() => {
                    const t = document.documentElement.innerHTML.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                    if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                    const e = document.querySelector("#timer, #countdown, .timer, #counter"),
                        n = parseInt(e?.textContent?.trim() ?? "", 10);
                    return Number.isFinite(n) && n > 0 ? n : 0
                })();
            if (e > 0 && (t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * e), await Xi(1e3 * e), t.hideCountdown()), !ta()) return void(Ji = !1);
            Ae();
            const n = document.querySelector("a.get-link, #gt-link");
            if (n?.href && (o = n.href, /^https?:\/\//i.test(o))) return t.setStatus("Opening your link…"), D(), void location.replace(n.href);
            var o;
            t.setStatus("Unlocking your link…");
            const r = Te(document.documentElement.innerHTML, location.href);
            if (!r) return t.setStatus("This page isn’t ready yet. Reload and try again."), void(Ji = !1);
            let i = await $e(r, location.href);
            if (!i && e > 0) {
                t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * (e + 2));
                const n = Date.now() + 1e3 * (e + 2);
                for (; !i && Date.now() < n && (Ae(), i = await $e(r, location.href), !i);) await Xi(200);
                t.hideCountdown()
            }
            if (!i) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(Ji = !1);
            t.setStatus("Opening your link…"), D(), location.replace(i)
        }, ra = () => {
            ea() || na() || ta() && oa()
        };
    var ia = "skip-wait-mitly-overlay",
        aa = "skip-wait-mitly-boot",
        sa = "captchaShortlink",
        ca = '[name="h-captcha-response"], [name="g-recaptcha-response"]',
        la = ['iframe[src*="hcaptcha.com"]', 'iframe[src*="newassets.hcaptcha.com"]'],
        ua = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        da = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        ma = {
            lead: "Confirm you’re human.",
            detail: "Tap the checkbox below. We’ll continue automatically when it’s done."
        },
        pa = null,
        ha = !1,
        fa = !1,
        wa = !1,
        ga = swDelay,
        ya = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        ka = (t = da, e = "Getting things ready…") => ((() => {
            const t = kt(ia);
            if (document.documentElement.classList.add(t), document.getElementById(aa)) return;
            const e = document.createElement("style");
            e.id = aa, e.textContent = Lt(ia, t), (document.head || document.documentElement).appendChild(e)
        })(), pa ? (pa.setNote(t), pa.setStatus(e), pa.setError(null), pa) : pa = $t({
            id: ia,
            brand: "Skip Wait",
            note: t,
            status: e,
            countdownLabel: "Your link opens in"
        })),
        ba = () => Boolean(document.querySelector('#go-link, form[action*="/links/go"]') && document.querySelector('input[name="ad_form_data"]')),
        va = () => {
            if (ha) return !0;
            const t = (() => {
                const t = document.querySelector("#form-continue");
                if (t) return t;
                const e = document.querySelector('form input[name="action"][value="continue"]')?.form ?? null;
                return e ? "link-view" === e.id || e.querySelector(`#${sa}, ${ca}`) ? null : e : null
            })();
            if (!t) return !1;
            ha = !0, ya();
            const e = t.querySelector('input[name="page"]')?.value?.trim();
            return ka(da, e ? `Skipping step ${e}…` : "Skipping continue page…"), requestAnimationFrame(() => {
                requestAnimationFrame(() => t.submit())
            }), !0
        },
        Sa = () => {
            if (fa) return !0;
            const t = (() => {
                const t = document.querySelector("#link-view");
                return t && (t.querySelector(`#${sa}`) || t.querySelector(ca)) ? t : null
            })();
            if (!t) return !1;
            fa = !0, ya();
            const e = ka(ma, "Waiting for captcha…");
            let n = null,
                o = !1,
                r = 0;
            const i = () => {
                    o || n || document.getElementById(sa) && (n = Nt({
                        overlayId: ia,
                        mount: e.turnstileMount,
                        widgetId: sa,
                        styleId: "skip-wait-mitly-captcha-pin",
                        alsoVisibleSelectors: la
                    }))
                },
                a = () => {
                    o || (o = !0, cancelAnimationFrame(r), c.disconnect(), n?.(), n = null, e.setNote(da), e.setStatus("Continuing…"), (() => {
                        const e = t.querySelector('#invisibleCaptchaShortlink, button.btn-captcha, button[type="submit"]');
                        if (e) return e.disabled = !1, e.removeAttribute("disabled"), void e.click();
                        t.submit()
                    })())
                },
                s = () => {
                    if (!o) {
                        if (!document.contains(t)) return o = !0, cancelAnimationFrame(r), c.disconnect(), void n?.();
                        i(), (t => {
                            for (const e of [t, document])
                                for (const t of e.querySelectorAll(ca)) {
                                    const e = t.value?.trim();
                                    if (e && e.length > 20) return !0
                                }
                            return !1
                        })(t) ? a() : r = requestAnimationFrame(s)
                    }
                },
                c = new MutationObserver(() => {
                    o || s()
                });
            return c.observe(t, {
                attributeFilter: ["value", "disabled"],
                attributes: !0,
                childList: !0,
                subtree: !0
            }), i(), r = requestAnimationFrame(s), !0
        },
        Ea = async () => {
            if (wa || !ba()) return;
            wa = !0, ya();
            const t = ka(da, "Getting things ready…"),
                e = (() => {
                    const t = document.documentElement.innerHTML.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                    if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                    const e = document.querySelector("#timer, #countdown, .timer, #counter"),
                        n = parseInt(e?.textContent?.trim() ?? "", 10);
                    return Number.isFinite(n) && n > 0 ? n : 0
                })();
            if (e > 0 && (t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * e), await ga(1e3 * e), t.hideCountdown()), !ba()) return void(wa = !1);
            Ae();
            const n = document.querySelector("a.get-link, #gt-link");
            if (n?.href && (o = n.href, /^https?:\/\//i.test(o))) return t.setStatus("Opening your link…"), D(), void location.replace(n.href);
            var o;
            t.setStatus("Unlocking your link…");
            const r = Te(document.documentElement.innerHTML, location.href);
            if (!r) return t.setStatus("This page isn’t ready yet. Reload and try again."), void(wa = !1);
            let i = await $e(r, location.href);
            if (!i && e > 0) {
                t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * (e + 2));
                const n = Date.now() + 1e3 * (e + 2);
                for (; !i && Date.now() < n && (Ae(), i = await $e(r, location.href), !i);) await ga(200);
                t.hideCountdown()
            }
            if (!i) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(wa = !1);
            t.setStatus("Opening your link…"), D(), location.replace(i)
        }, xa = () => {
            va() || Sa() || ba() && Ea()
        };
    var La = "skip-wait-linclik-overlay",
        Ca = "skip-wait-linclik-boot",
        Ia = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        Ta = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        $a = null,
        Aa = !1,
        qa = !1,
        _a = swDelay,
        Ma = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        Oa = (t = "Getting things ready…") => ((() => {
            const t = kt(La);
            if (document.documentElement.classList.add(t), document.getElementById(Ca)) return;
            const e = document.createElement("style");
            e.id = Ca, e.textContent = Lt(La, t), (document.head || document.documentElement).appendChild(e)
        })(), $a ? ($a.setStatus(t), $a.setError(null), $a) : $a = $t({
            id: La,
            brand: "Skip Wait",
            note: Ta,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        Ra = () => Boolean(document.querySelector('#go-link, form[action*="/links/go"]') && document.querySelector('input[name="ad_form_data"]')),
        Pa = () => {
            if (Aa) return !0;
            const t = document.querySelector("#form-continue");
            if (!t) return !1;
            Aa = !0, Ma();
            const e = t.querySelector('input[name="page"]')?.value?.trim();
            Oa(e ? `Skipping step ${e}…` : "Skipping continue page…");
            const n = t.querySelector('#btnHuman, button[type="submit"]');
            return n && (n.disabled = !1, n.removeAttribute("disabled")), requestAnimationFrame(() => {
                requestAnimationFrame(() => t.submit())
            }), !0
        },
        Da = async () => {
            if (qa || !Ra()) return;
            qa = !0, Ma();
            const t = Oa("Getting things ready…"),
                e = (() => {
                    const t = document.documentElement.innerHTML.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                    if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                    const e = document.querySelector("#timer, #countdown, .timer, #counter"),
                        n = parseInt(e?.textContent?.trim() ?? "", 10);
                    return Number.isFinite(n) && n > 0 ? n : 0
                })();
            if (e > 0 && (t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * e), await _a(1e3 * e), t.hideCountdown()), !Ra()) return void(qa = !1);
            Ae();
            const n = document.querySelector("a.get-link, #gt-link");
            if (n?.href && (o = n.href, /^https?:\/\//i.test(o))) return t.setStatus("Opening your link…"), D(), void location.replace(n.href);
            var o;
            t.setStatus("Unlocking your link…");
            const r = Te(document.documentElement.innerHTML, location.href);
            if (!r) return t.setStatus("This page isn’t ready yet. Reload and try again."), void(qa = !1);
            let i = await $e(r, location.href);
            if (!i && e > 0) {
                t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * (e + 2));
                const n = Date.now() + 1e3 * (e + 2);
                for (; !i && Date.now() < n && (Ae(), i = await $e(r, location.href), !i);) await _a(200);
                t.hideCountdown()
            }
            if (!i) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(qa = !1);
            t.setStatus("Opening your link…"), D(), location.replace(i)
        }, Na = () => {
            Pa() || Ra() && Da()
        };
    var Ba = "skip-wait-cpmlink-hop",
        Ua = "skip-wait-cpmlink-hop-boot",
        Wa = /\burl\s*=\s*['"](https?:\/\/[^'"]+)['"]/,
        Ha = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Fa = null,
        za = !1,
        ja = (t = "Opening your link…") => ((() => {
            const t = kt(Ba);
            if (document.documentElement.classList.add(t), document.getElementById(Ua)) return;
            const e = document.createElement("style");
            e.id = Ua, e.textContent = Lt(Ba, t), (document.head || document.documentElement).appendChild(e)
        })(), Fa ? (Fa.setStatus(t), Fa) : Fa = $t({
            id: Ba,
            brand: "Skip Wait",
            note: Ha,
            status: t
        })),
        Ya = () => {
            if (za) return;
            const t = (t => {
                const e = Wa.exec(t)?.[1]?.trim();
                return e && /^https?:\/\//i.test(e) ? /ppcnt\./i.test(e) ? null : e : null
            })(document.documentElement.innerHTML);
            t && (za = !0, ja("Opening your link…"), D(), location.replace(t))
        };
    var Ga = "skip-wait-cpmlink-overlay",
        Va = "skip-wait-cpmlink-boot",
        Za = /^[A-Za-z0-9]{3,}$/,
        Ja = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Xa = null,
        Ka = !1,
        Qa = (t = "Getting things ready…") => ((() => {
            const t = kt(Ga);
            if (document.documentElement.classList.add(t), document.getElementById(Va)) return;
            const e = document.createElement("style");
            e.id = Va, e.textContent = Lt(Ga, t), (document.head || document.documentElement).appendChild(e)
        })(), Xa ? (Xa.setStatus(t), Xa.setError(null), Xa) : Xa = $t({
            id: Ga,
            brand: "Skip Wait",
            note: Ja,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        ts = t => document.documentElement.innerHTML.match(new RegExp(`(?:var|let|const)?\\s*${t}\\s*=\\s*['"]([^'"]*)['"]`))?.[1] ?? null,
        es = () => document.querySelector('#go-link[action*="/links/go2"], form#go-link'),
        ns = () => document.getElementById("continueButton")?.getAttribute("data-token")?.trim() || null,
        os = () => Boolean(es() && ns() && ts("_a") && ts("_t")),
        rs = async (t, e) => {
            try {
                const n = await fetch(t, {
                    method: "POST",
                    body: new URLSearchParams(e),
                    credentials: "include",
                    headers: {
                        Accept: "application/json, text/javascript, */*; q=0.01",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                });
                return JSON.parse(await n.text())
            } catch {
                return null
            }
        }, is = async () => {
            if (Ka || !os()) return;
            Ka = !0, chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {});
            const t = Qa("Unlocking your link…"),
                e = es(),
                n = ts("_a"),
                o = ts("_t"),
                r = ts("_d") ?? "",
                i = ns();
            if (!(e && n && o && i)) return t.setStatus("This page isn’t ready yet. Reload and try again."), void(Ka = !1);
            const a = e.querySelector('input[name="alias"]')?.value?.trim() || location.pathname.replace(/^\/+|\/+$/g, ""),
                s = e.querySelector('input[name="csrf"]')?.value?.trim() ?? "",
                c = e.getAttribute("action") || `${location.origin}/links/go2`;
            t.setStatus("Requesting unlock token…");
            let l = await rs(`${location.origin}/get/tk`, {
                _a: n,
                _t: o,
                _d: r
            });
            var u;
            if (l?.status && "string" == typeof l.th || (await (u = 500, new Promise(t => setTimeout(t, u))), l = await rs(`${location.origin}/get/tk`, {
                    _a: n,
                    _t: o,
                    _d: r
                })), !l?.status || "string" != typeof l.th) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(Ka = !1);
            t.setStatus("Unlocking your link…");
            const d = await rs(c, {
                    alias: a,
                    csrf: s,
                    tkn: l.th,
                    visitor_token: i,
                    signal: JSON.stringify({
                        t: Math.floor(Date.now() / 1e3),
                        d: 1.5,
                        m: {
                            move: 8,
                            click: 1,
                            scroll: 0,
                            key: 0,
                            touch: 0,
                            focus: 1
                        },
                        f: {
                            webdriver: !1,
                            headless: !1,
                            noPlugins: !1,
                            mobile: !1
                        }
                    })
                }),
                m = "string" == typeof d?.url ? d.url.trim() : "";
            if (!d || "success" !== d.status || !/^https?:\/\//i.test(m)) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(Ka = !1);
            t.setStatus("Opening your link…"), location.replace(m)
        }, as = () => {
            os() && is()
        };
    var ss = /^[A-Za-z0-9]{3,}$/,
        cs = "skip-wait-cpmlink-net-gate",
        ls = "skip-wait-cpmlink-net-gate-boot",
        us = "skip-wait-cpmlink-net-bframe",
        ds = "captcha",
        ms = ['iframe[src*="api2/anchor"]', 'iframe[title="reCAPTCHA"]'],
        ps = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        hs = {
            lead: "Confirm you’re human.",
            detail: "Tap the checkbox below. We’ll continue automatically when it’s done."
        },
        fs = null,
        ws = !1,
        gs = !1,
        ys = (t = ps, e = "Getting things ready…") => ((() => {
            const t = kt(cs);
            if (document.documentElement.classList.add(t), document.getElementById(ls)) return;
            const e = document.createElement("style");
            e.id = ls, e.textContent = Lt(cs, t), (document.head || document.documentElement).appendChild(e)
        })(), fs ? (fs.setNote(t), fs.setStatus(e), fs.setError(null), fs) : fs = $t({
            id: cs,
            brand: "Skip Wait",
            note: t,
            status: e
        })),
        ks = t => (t.querySelector('[name="g-recaptcha-response"]')?.value.trim().length ?? 0) > 20,
        bs = () => {
            if (gs) return !0;
            const t = (() => {
                const t = document.querySelector("#btn-main[href]")?.href.trim() ?? "";
                if (!/^https?:\/\//i.test(t)) return null;
                try {
                    const e = new URL(t);
                    return e.hostname === location.hostname ? null : e.href
                } catch {
                    return null
                }
            })();
            return !!t && (gs = !0, ys(ps, "Opening your link…"), D(), location.replace(t), !0)
        },
        vs = () => {
            if (ws) return !0;
            const t = (() => {
                const t = document.querySelector("form#skip");
                return t?.querySelector("#captcha, .g-recaptcha") && (t.getAttribute("action") || "").toLowerCase().includes("/go/") ? t : null
            })();
            if (!t) return !1;
            const e = (t => {
                const e = t.querySelector("#captcha, .g-recaptcha");
                return e ? (e.id || (e.id = ds), t.closest("#continue") && (document.body || document.documentElement).appendChild(t), document.getElementById("disable")?.remove(), e) : null
            })(t);
            if (!e) return !1;
            ws = !0;
            const n = ys(hs, "Waiting for captcha…");
            let o = null,
                r = !1,
                i = 0,
                a = !1;
            const s = () => {
                    r = !0, cancelAnimationFrame(i), o?.(), o = null, document.getElementById(us)?.remove()
                },
                c = () => {
                    r || (s(), n.setNote(ps), n.setStatus("Continuing…"), (t => {
                        const e = t.querySelector('input[name="s_width"]'),
                            n = t.querySelector('input[name="s_height"]');
                        e && !e.value && (e.value = String(window.innerWidth || 1920)), n && !n.value && (n.value = String(window.innerHeight || 1080))
                    })(t), HTMLFormElement.prototype.submit.call(t))
                },
                l = () => {
                    if (r) return;
                    if (!document.contains(t) || !document.contains(e)) return s(), void(ws = !1);
                    r || o || !document.getElementById(e.id) || (o = Nt({
                        overlayId: cs,
                        mount: n.turnstileMount,
                        widgetId: e.id,
                        styleId: "skip-wait-cpmlink-net-captcha-pin",
                        alsoVisibleSelectors: ms
                    }), n.setStatus("Complete the captcha below."));
                    const u = (() => {
                        const t = document.querySelector('body > div > div > iframe[src*="api2/bframe"]')?.parentElement?.parentElement;
                        return t instanceof HTMLElement && t.parentElement === document.body && "visible" === t.style.visibility && "1" === t.style.opacity
                    })();
                    (t => {
                        const e = kt(cs);
                        let n = document.getElementById(us);
                        if (n || (n = document.createElement("style"), n.id = us, document.documentElement.appendChild(n)), !t) return void(n.textContent = "");
                        const o = `html.${e} body>div:has(>div>iframe[src*="api2/bframe"])`;
                        n.textContent = `html.${e} #${cs},html.${e} #${cs} *{visibility:visible!important}html.${e} #${cs}{z-index:2147483646!important}html.${e} #${ds}{z-index:2147483646!important;pointer-events:none!important}html.${e} #${ds} *{pointer-events:none!important}${o}{z-index:2147483647!important;visibility:visible!important;pointer-events:auto!important}${o}>div[style*="position: fixed"]{pointer-events:none!important}${o}>div[style*="position: relative"]{z-index:2147483647!important;pointer-events:auto!important;visibility:visible!important}${o} iframe[src*="api2/bframe"]{visibility:visible!important;pointer-events:auto!important;position:relative!important;z-index:2147483647!important}html.${e} grammarly-extension,html.${e} grammarly-desktop-integration,html.${e} [data-grammarly-shadow-root],html.${e} #grammarly-desktop-integration{pointer-events:none!important;visibility:hidden!important}`
                    })(u), u ? (a = !0, n.setStatus("Solve the image challenge.")) : a && !ks(t) && (a = !1, chrome.runtime.sendMessage({
                        type: "CPMLINK_NET_RESET_CAPTCHA"
                    }).catch(() => {}), n.setStatus("Complete the captcha below.")), ks(t) ? c() : i = requestAnimationFrame(l)
                };
            return i = requestAnimationFrame(l), !0
        },
        Ss = () => {
            bs() || vs()
        };
    var Es = "skip-wait-genlink-entry",
        xs = "skip-wait-genlink-entry-boot",
        Ls = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        Cs = /https:\/\/jazbaat\.in\/[A-Za-z0-9\-]+\/?/gi,
        Is = /url=(https?:\/\/jazbaat\.in\/[^&"'\\]+)/gi,
        Ts = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        $s = null,
        As = !1,
        qs = t => ((() => {
            const t = kt(Es);
            if (document.documentElement.classList.add(t), document.getElementById(xs)) return;
            const e = document.createElement("style");
            e.id = xs, e.textContent = Lt(Es, t), (document.head || document.documentElement).appendChild(e)
        })(), $s ? ($s.setStatus(t), $s.setError(null), $s) : $s = $t({
            id: Es,
            brand: "Skip Wait",
            note: Ts,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        _s = () => {
            if (As) return;
            const t = (t => {
                const e = t.replace(/&amp;/g, "&").replace(/\\\//g, "/");
                for (const n of [Is, Cs]) {
                    n.lastIndex = 0;
                    const t = n.exec(e);
                    if (!t) continue;
                    const o = t[1] ?? t[0];
                    try {
                        const t = new URL(decodeURIComponent(o));
                        if ("jazbaat.in" === t.hostname || t.hostname.endsWith(".jazbaat.in")) return t.href
                    } catch {}
                }
                return null
            })(document.documentElement.innerHTML);
            t && (As = !0, qs("Skipping browser check…"), location.replace(t))
        };
    var Ms = "skip-wait-genlink-mediator",
        Os = "skip-wait-genlink-mediator-boot",
        Rs = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        Ps = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Ds = null,
        Ns = !1,
        Bs = t => ((() => {
            const t = kt(Ms);
            if (document.documentElement.classList.add(t), document.getElementById(Os)) return;
            const e = document.createElement("style");
            e.id = Os, e.textContent = Lt(Ms, t), (document.head || document.documentElement).appendChild(e)
        })(), Ds ? (Ds.setStatus(t), Ds.setError(null), Ds) : Ds = $t({
            id: Ms,
            brand: "Skip Wait",
            note: Ps,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        Us = () => {
            const t = document.querySelector('input[name="tp2"]')?.value?.trim();
            if (t && Rs.test(t)) return t;
            const e = (t => {
                const e = document.cookie.match(new RegExp(`(?:^|;\\s*)${t}=([^;]*)`));
                return e?.[1] ? decodeURIComponent(e[1]) : null
            })("tp")?.trim();
            if (e && Rs.test(e)) return e;
            const n = document.documentElement.innerHTML,
                o = n.match(/https?:\/\/crazymindhub\.xyz\/([A-Za-z0-9]+)/i);
            if (o?.[1] && Rs.test(o[1])) return o[1];
            const r = n.match(/document\.cookie\s*=\s*['"]tp=([^;'"]+)/i);
            return r?.[1] && Rs.test(r[1]) ? r[1] : null
        },
        Ws = () => {
            if (Ns || !(() => {
                    if (document.querySelector('form[name="tp"], #conti, #btn6, button#link[onclick*="verify"]')) return !0;
                    const t = document.documentElement.innerHTML;
                    return /function\s+verify\s*\(/.test(t) || /function\s+getlink\s*\(/.test(t) || /document\.cookie\s*=\s*['"]tp=/.test(t)
                })()) return;
            const t = Us();
            t && (Ns = !0, Bs("Skipping mediator…"), location.replace(`https://crazymindhub.xyz/${encodeURIComponent(t)}`))
        };
    var Hs = "skip-wait-genlink-unlock",
        Fs = "skip-wait-genlink-unlock-boot",
        zs = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        js = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Ys = null,
        Gs = !1,
        Vs = swDelay,
        Zs = (t = "Getting things ready…") => ((() => {
            const t = kt(Hs);
            if (document.documentElement.classList.add(t), document.getElementById(Fs)) return;
            const e = document.createElement("style");
            e.id = Fs, e.textContent = Lt(Hs, t), (document.head || document.documentElement).appendChild(e)
        })(), Ys ? (Ys.setStatus(t), Ys.setError(null), Ys) : Ys = $t({
            id: Hs,
            brand: "Skip Wait",
            note: js,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        Js = () => Boolean(document.querySelector('#go-link, form[action*="/links/go"]') && document.querySelector('input[name="ad_form_data"]')),
        Xs = async () => {
            if (Gs || !Js()) return;
            Gs = !0, chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {});
            const t = Zs("Getting things ready…"),
                e = (() => {
                    const t = document.documentElement.innerHTML.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                    if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                    const e = document.querySelector("#timer, #countdown, .timer, #counter"),
                        n = parseInt(e?.textContent?.trim() ?? "", 10);
                    return Number.isFinite(n) && n > 0 ? n : 0
                })();
            if (e > 0 && (t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * e), await Vs(1e3 * e), t.hideCountdown()), !Js()) return void(Gs = !1);
            Ae();
            const n = document.querySelector("a.get-link, #gt-link");
            if (n?.href && (o = n.href, /^https?:\/\//i.test(o))) return t.setStatus("Opening your link…"), D(), void location.replace(n.href);
            var o;
            t.setStatus("Unlocking your link…");
            const r = Te(document.documentElement.innerHTML, location.href);
            if (!r) return t.setStatus("This page isn’t ready yet. Reload and try again."), void(Gs = !1);
            let i = await $e(r, location.href);
            if (!i && e > 0) {
                t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * (e + 2));
                const n = Date.now() + 1e3 * (e + 2);
                for (; !i && Date.now() < n && (Ae(), i = await $e(r, location.href), !i);) await Vs(200);
                t.hideCountdown()
            }
            if (!i) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(Gs = !1);
            t.setStatus("Opening your link…"), D(), location.replace(i)
        }, Ks = () => {
            Js() && Xs()
        };
    var Qs = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        tc = "skip-wait-sfl",
        ec = ["Binding session…", "Skipping gate waits…", "Verifying unlock…", "Fetching destination…"],
        nc = (() => {
            let t = null,
                e = null,
                n = 0,
                o = !1;
            const r = (e, n, o) => {
                document.documentElement.classList.add(kt(tc));
                const r = {
                    lead: n ?? "Hang tight — unlocking your link.",
                    detail: o ?? "Skip Wait skips the mediator pages in the background."
                };
                return t ? (t.setNote(r), t.setStatus(e), t) : (t = $t({
                    id: tc,
                    brand: "Skip Wait",
                    note: r,
                    status: e,
                    countdownLabel: "Your link opens in"
                }), t)
            };
            return {
                progress: i => (o = !1, null == e && (e = window.setInterval(() => {
                    o || (n = (n + 1) % ec.length, t?.setStatus(ec[n]))
                }, 1600)), r(i.status, i.lead, i.detail)),
                setError: t => {
                    o = !0, null != e && (clearInterval(e), e = null);
                    const n = r(t, "Something went wrong.", "Reload the short link and try again.");
                    return n.setError(t), n
                }
            }
        })(),
        oc = async t => {
            let e;
            nc.progress({
                lead: "Hang tight — unlocking your link.",
                detail: "Skip Wait skips the mediator pages in the background.",
                status: "Opening your short link…"
            });
            try {
                e = new URL(t).hostname
            } catch {
                return void nc.setError("Invalid unlock link.")
            }
            if (!(await nt(e, "sfl"))) return void nc.setError("SFL is not available.");
            const n = t => {
                "SFL_PROGRESS" === t.type && t.status && t.lead && t.detail && nc.progress({
                    lead: t.lead,
                    detail: t.detail,
                    status: t.status
                })
            };
            chrome.runtime.onMessage.addListener(n);
            try {
                const e = await (t => new Promise((e, n) => {
                    chrome.runtime.sendMessage({
                        type: "SFL_RESOLVE",
                        unlockUrl: t
                    }, t => {
                        !chrome.runtime.lastError && t?.ok && t.dest ? e(t.dest) : n(new Error("resolve"))
                    })
                }))(t);
                D(), location.replace(e)
            } catch {
                nc.setError("Couldn’t unlock this link. Reload and try again.")
            } finally {
                chrome.runtime.onMessage.removeListener(n)
            }
        }, rc = /var\s+longUrl\s*=\s*["']([^"']+)["']/;

    function ic() {
        const t = rc.exec(document.documentElement.innerHTML);
        if (!t?.[1]) return;
        const e = t[1].replace(/\\\//g, "/");
        D(), location.replace(/^https?:\/\//i.test(e) ? e : `http://${e}`)
    }
    var ac = "skipwait-cookiesceo-actions",
        sc = /session_paste\s+([A-Za-z0-9+/=]+)/,
        cc = /["']([^"']*-download)\/?"?["']/;
    async function lc() {
        const t = document.getElementById("download-btn");
        if (!t?.parentElement || document.getElementById(ac)) return;
        const e = document.createElement("div");
        e.id = ac;
        const n = document.createElement("button");
        n.type = "button", n.id = "skipwait-copy", n.textContent = "Copy cookie", n.style.display = "none", e.appendChild(n), t.parentElement.appendChild(e);
        let o = null;
        n.onclick = async () => {
            if (o) try {
                await navigator.clipboard.writeText(o), n.textContent = "Copied", setTimeout(() => {
                    n.textContent = "Copy cookie"
                }, 2e3)
            } catch {
                n.textContent = "Copy failed"
            }
        };
        const r = function() {
            const {
                origin: t
            } = window.location;
            for (const e of document.scripts) {
                const n = e.textContent ?? "";
                if (!/location\.(replace|href)|window\.location/.test(n)) continue;
                const o = n.match(cc);
                if (!o?.[1]) continue;
                let r = o[1].trim();
                if (/^https?:/i.test(r) || (r = t + (r.startsWith("/") ? r : "/" + r)), r.startsWith(t) && !/buy|product|notify/i.test(r)) return r.endsWith("/") ? r : r + "/"
            }
            return null
        }();
        if (r) try {
            if (o = function(t) {
                    const e = t.match(sc);
                    return e ? `session_paste ${e[1]}` : null
                }(await (await fetch(r, {
                    cache: "no-store",
                    credentials: "same-origin"
                })).text()), o) {
                n.style.display = "inline-block", D();
                try {
                    await navigator.clipboard.writeText(o)
                } catch {}
            }
        } catch {}
    }
    var uc = "FCLC_ALERT_SUPPRESS",
        dc = ['iframe[src*="hcaptcha.com"]', 'iframe[src*="newassets.hcaptcha.com"]'],
        mc = {
            lead: "Confirm you’re human.",
            detail: "Tap the checkbox below. We’ll continue automatically when it’s done."
        },
        pc = "skip-wait-fclc-overlay",
        hc = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        fc = swTnFrames,
        wc = swTnNote,
        gc = swTnToken,
        yc = ["#verificationForm", "#verificationFormm"],
        kc = null;

    function bc(t, e) {
        for (const n of t.querySelectorAll(e))
            if ((n.value?.trim())?.length) return !0;
        return !1
    }

    function vc() {
        return /\bcf_clearance=/.test(document.cookie)
    }

    function Sc(t, e) {
        return t.id || (t.id = e), t.id
    }

    function Ec(t, e) {
        return kc ? (kc.setNote(t), kc.setStatus(e), kc) : kc = $t({
            id: pc,
            brand: "Skip Wait",
            note: t,
            status: e
        })
    }

    function xc(t) {
        t.stopPin?.(), t.stopPin = null
    }

    function Lc(t) {
        const e = {
                stopPin: null
            },
            n = Ec(wc, "Waiting for Turnstile…"),
            o = function(t) {
                let e = 0,
                    n = 0;
                const o = () => {
                    n && clearInterval(n), n = 0
                };
                return n = window.setInterval(() => {
                    if (!document.contains(t) || e >= 600) return void o();
                    e++;
                    const n = 80 + e % 120,
                        r = 80 + 7 * e % 120;
                    t.dispatchEvent(new MouseEvent("mousemove", {
                        bubbles: !0,
                        clientX: n,
                        clientY: r
                    })), e % 5 == 0 && (window.scrollBy(0, 1), window.scrollBy(0, -1))
                }, 100), o
            }(t);
        let r = !1,
            i = null;
        const a = () => {
                if (r || e.stopPin) return;
                const o = function(t) {
                    const e = t.querySelector(".cf-turnstile");
                    if (e) return e;
                    const n = t.querySelector("#captchaShortlink");
                    return n?.querySelector(`${gc}, iframe, .cf-turnstile`) ? n : t.querySelector(gc)?.parentElement ?? null
                }(t);
                if (!o) return;
                const i = Sc(o, "skip-wait-fclc-turnstile");
                e.stopPin = Nt({
                    overlayId: pc,
                    mount: n.turnstileMount,
                    widgetId: i,
                    styleId: "skip-wait-fclc-turnstile-pin",
                    alsoVisibleSelectors: fc
                })
            },
            s = () => {
                if (r) return;
                a();
                const l = document.querySelector("#submitBtn");
                l && (i || (i = new MutationObserver(s), i.observe(l, {
                    attributes: !0,
                    attributeFilter: ["disabled"]
                })), function(t) {
                    return bc(t, gc) || vc()
                }(t) && !l.disabled && (r = !0, o(), c.disconnect(), i?.disconnect(), xc(e), n.setNote(hc), n.setStatus("Continuing…"), requestAnimationFrame(() => l.click())))
            },
            c = new MutationObserver(s);
        c.observe(t, {
            childList: !0,
            subtree: !0,
            attributes: !0,
            attributeFilter: ["disabled"]
        }), a(), s()
    }

    function Cc(t) {
        const e = {
                stopPin: null
            },
            n = Ec(mc, "Waiting for captcha…");
        let o = !1;
        const r = () => {
                if (o || e.stopPin) return;
                const r = function(t) {
                    return t.querySelector(".h-captcha")
                }(t);
                if (!r) return;
                const i = Sc(r, "skip-wait-fclc-hcaptcha");
                e.stopPin = Nt({
                    overlayId: pc,
                    mount: n.turnstileMount,
                    widgetId: i,
                    styleId: "skip-wait-fclc-hcaptcha-pin",
                    alsoVisibleSelectors: dc
                })
            },
            i = () => {
                o || (r(), function(t) {
                    return bc(t, '[name="h-captcha-response"], [name="g-recaptcha-response"]') || vc()
                }(t) && (o = !0, a.disconnect(), xc(e), n.setNote(hc), n.setStatus("Continuing…"), t.submit()))
            },
            a = new MutationObserver(i);
        a.observe(t, {
            childList: !0,
            subtree: !0,
            attributes: !0
        }), r(), i()
    }
    var Ic = "skip-wait-fclc-mediator-overlay",
        Tc = 'input[name="fdata"]',
        $c = "#form12",
        Ac = swTnFrames,
        qc = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        _c = swTnNote,
        Mc = null,
        Oc = null,
        Rc = null,
        Pc = !1,
        Dc = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        Nc = (t = qc, e = "Getting things ready…") => Mc ? (Mc.setNote(t), Mc.setStatus(e), Mc) : Mc = $t({
            id: Ic,
            brand: "Skip Wait",
            note: t,
            status: e,
            countdownLabel: "Continue in"
        }),
        Bc = () => {
            const t = document.querySelector("form.text-center");
            return t?.querySelector(Tc) ? t : null
        },
        Uc = () => !!Bc(),
        Wc = () => {
            for (const t of document.scripts) {
                const e = (t.textContent ?? "").match(/domainUrl\s*=\s*["'](https?:\/\/[^"']+)["']/);
                if (e?.[1]) return e[1]
            }
            return "https://fc.lc/links/go"
        },
        Hc = () => {
            const t = document.querySelector($c);
            if (!t) return;
            const e = {};
            for (const n of t.elements)(n instanceof HTMLInputElement || n instanceof HTMLTextAreaElement) && n.name && (e[n.name] = n.value ?? "");
            e.ad_form_data && e.visitor && (Oc = e, Rc = Wc())
        },
        Fc = () => {
            if (Oc) return !0;
            if (document.querySelector($c)) return !0;
            for (const t of document.scripts)
                if ((t.textContent ?? "").includes("domainUrl") && (t.textContent ?? "").includes("startTimeout")) return !0;
            return !1
        },
        zc = async (t, e, n) => {
            t.setNote(qc), t.setStatus(n), t.startCountdown(Date.now() + e), await (t => new Promise(e => setTimeout(e, t)))(e), t.hideCountdown()
        }, jc = async (t, e) => {
            const n = Oc,
                o = Rc || Wc();
            if (!n) return t.setStatus("Unlock form missing — reload from the short link."), null;
            t.setNote(qc), t.setStatus("Unlocking…");
            const {
                url: r,
                message: i
            } = await
            function(t, e, n) {
                return new Promise(o => {
                    try {
                        chrome.runtime.sendMessage({
                            type: "FCLC_LINKS_GO",
                            action: t,
                            fields: e,
                            referer: n
                        }, t => {
                            chrome.runtime.lastError ? o({
                                url: null,
                                message: chrome.runtime.lastError.message || "network error"
                            }) : o(t ?? {
                                url: null,
                                message: "network error"
                            })
                        })
                    } catch {
                        o({
                            url: null,
                            message: "network error"
                        })
                    }
                })
            }(o, {
                ...n,
                token: e
            }, location.href);
            return r || (t.setStatus(i || "Unlock failed — reload from the short link."), null)
        }, Yc = t => new Promise(e => {
            t.setNote(_c), t.setStatus("Waiting for Turnstile…");
            let n = null,
                o = !1;
            const r = () => {
                    if (o || n) return;
                    const e = (() => {
                        const t = document.querySelector("#cf-section");
                        if (t) {
                            t.style.setProperty("display", "block", "important");
                            return t.querySelector(".cf-turnstile") || t
                        }
                        return document.querySelector(".cf-turnstile")
                    })();
                    if (!e) return;
                    const r = (t => (t.id || (t.id = "skip-wait-fclc-mediator-turnstile"), t.id))(e);
                    n = Nt({
                        overlayId: Ic,
                        mount: t.turnstileMount,
                        widgetId: r,
                        styleId: "skip-wait-fclc-mediator-turnstile-pin",
                        alsoVisibleSelectors: Ac
                    })
                },
                i = () => {
                    if (o) return;
                    r();
                    const t = (() => {
                        for (const t of document.querySelectorAll('[name="cf-turnstile-response"]')) {
                            const e = t.value?.trim();
                            if (e && e.length > 20) return e
                        }
                        return null
                    })();
                    if (t) return o = !0, n?.(), n = null, void e(t);
                    requestAnimationFrame(i)
                };
            r(), requestAnimationFrame(i)
        }), Gc = () => {
            if (Pc) return;
            if (Hc(), !Uc() && !Fc()) return;
            Pc = !0;
            const t = Nc();
            Uc() ? (async t => {
                const e = Bc();
                if (!e) return void t.setStatus("Mediator form missing — open the short link again.");
                Dc(), t.setStatus("Preparing step 1 of 2…");
                const n = await (await fetch("?start_countdown=1", {
                    credentials: "include"
                })).json();
                if (!n.rand) return void t.setStatus("Countdown token missing — reload from the short link.");
                const o = e.querySelector(Tc);
                o ? (o.value = n.rand, await zc(t, 15e3, "Step 1 of 2 — waiting…"), t.setStatus("Continuing to step 2…"), e.submit()) : t.setStatus("fdata field missing — reload from the short link.")
            })(t).catch(() => {
                t.setStatus("Something went wrong — open the short link again.")
            }) : (t => {
                Hc(), Oc ? (Dc(), Rc = Rc || Wc(), (async () => {
                    await zc(t, 15e3, "Step 2 of 2 — waiting…");
                    const e = await Yc(t),
                        n = await jc(Nc(qc, "Unlocking…"), e);
                    n && (Nc().setStatus("Redirecting now…"), D(), location.replace(n))
                })().catch(() => {
                    t.setStatus("Something went wrong — open the short link again.")
                })) : t.setStatus("Unlock form missing — open the short link again.")
            })(t)
        };
    var Vc = "skip-wait-icutlink-links-go",
        Zc = "skip-wait-icutlink-links-go-boot",
        Jc = "a.get-link",
        Xc = {
            lead: "Opening destination…",
            detail: "Skip Wait posts /links/go now — no client timer wait."
        },
        Kc = null,
        Qc = !1,
        tl = !1,
        el = () => {
            const t = document.documentElement.innerHTML,
                e = t.match(/app_vars\[['\"]counter_value['\"]\]\s*=\s*['\"](\d+)['\"]/);
            if (e?.[1]) return Math.max(0, parseInt(e[1], 10));
            const n = t.match(/"counter_value"\s*:\s*(\d+)/);
            if (n?.[1]) return Math.max(0, parseInt(n[1], 10));
            const o = document.querySelector("#timer, #countdown, .timer, #counter"),
                r = parseInt(o?.textContent?.trim() ?? "", 10);
            return Number.isFinite(r) && r > 0 ? r : 3
        },
        nl = (t = "Unlocking…") => ((() => {
            const t = kt(Vc);
            if (document.documentElement.classList.add(t), document.getElementById(Zc)) return;
            const e = document.createElement("style");
            e.id = Zc, e.textContent = Lt(Vc, t), (document.head || document.documentElement).appendChild(e)
        })(), tl = !0, Kc ? (Kc.setNote(Xc), Kc.setStatus(t), Kc) : Kc = $t({
            id: Vc,
            brand: "Skip Wait",
            note: Xc,
            status: t,
            countdownLabel: "Site timer"
        })),
        ol = () => {
            if (document.querySelector(".captcha-buttons, #captcha-buttons")) return !0;
            const t = document.body?.innerText ?? "";
            return /Select number\s+\d+/i.test(t) || /Loading challenge/i.test(t)
        },
        rl = () => !!document.querySelector('#go-link, form[action*="/links/go"]') || !!document.querySelector(Jc),
        il = () => {
            if (Qc || ol() || !rl()) return;
            Qc = !0, chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {});
            const t = nl("Posting /links/go…"),
                e = el();
            e > 0 && t.startCountdown(Date.now() + 1e3 * e), (async () => {
                Ae();
                const t = document.querySelector(Jc);
                if (t?.href && (e = t.href, /^https?:\/\//i.test(e))) return t.href;
                var e;
                const n = Te(document.documentElement.innerHTML, location.href);
                return n ? $e(n, location.href) : null
            })().then(e => {
                if (!e) return t.hideCountdown(), t.setStatus("Unlock failed — reload and try again."), void(Qc = !1);
                t.hideCountdown(), t.setStatus("Redirecting…"), D(), location.replace(e)
            }).catch(() => {
                t.hideCountdown(), t.setStatus("Something went wrong — reload and try again."), Qc = !1
            })
        };
    var al = "skip-wait-icutlink-mediator",
        sl = "skip-wait-icutlink-mediator-boot",
        cl = "#afterBtn",
        ll = "#progressBar",
        ul = {
            lead: "Unlocking ToolsKit…",
            detail: "Page 1 waits for the server timer. Pages 2–3 continue right away."
        },
        dl = null,
        ml = !1,
        pl = !1,
        hl = swDelay,
        fl = (t, e) => `Page ${t}/3 — ${e}`,
        wl = (t = "Getting ready…") => ((() => {
            const t = kt(al);
            if (document.documentElement.classList.add(t), document.getElementById(sl)) return;
            const e = document.createElement("style");
            e.id = sl, e.textContent = Lt(al, t), (document.head || document.documentElement).appendChild(e)
        })(), pl = !0, dl ? (dl.setNote(ul), dl.setStatus(t), dl) : dl = $t({
            id: al,
            brand: "Skip Wait",
            note: ul,
            status: t,
            countdownLabel: "Continue in"
        })),
        gl = () => {
            const t = document.querySelector('form input[name="step"]');
            return t ? t.closest("form") : null
        },
        yl = () => gl()?.querySelector('input[name="step"]')?.value?.trim() || "",
        kl = () => {
            const t = document.querySelector("#getl")?.href?.trim() ?? "";
            return /^https?:\/\//i.test(t) ? t : null
        },
        bl = () => /Respect the timer/i.test(document.body?.innerText ?? ""),
        vl = () => !!gl() || !!kl() || !!document.querySelector(ll) || bl(),
        Sl = t => {
            if (!t) return null;
            const e = t.trim().match(/^([\d.]+)\s*(s|ms)?$/i);
            if (!e?.[1]) return null;
            const n = Number(e[1]);
            return !Number.isFinite(n) || n < 0 ? null : "ms" === (e[2] || "s").toLowerCase() ? Math.round(n) : Math.round(1e3 * n)
        },
        El = () => {
            if (kl()) return !0;
            const t = document.querySelector("#buttonSection");
            if (t?.classList.contains("show") && "0" !== getComputedStyle(t).opacity) return !0;
            const e = document.querySelector("#progressSection");
            return e ? !(!e.classList.contains("hidden") && "none" !== getComputedStyle(e).display) && !!document.querySelector(cl) : !!document.querySelector(cl)
        },
        xl = async t => {
            const e = (() => {
                    const t = document.querySelector(ll);
                    if (t) {
                        const e = Sl(t.style.getPropertyValue("--duration") || null);
                        if (e && e > 0) return e;
                        const n = Sl(getComputedStyle(t).transitionDuration.split(",")[0]?.trim());
                        if (n && n > 0) return n
                    }
                    return 26e3
                })(),
                n = Date.now() + e;
            for (t.setStatus(fl(1, "waiting…")), t.startCountdown(n); Date.now() < n && !El();) await hl(150);
            t.hideCountdown()
        }, Ll = () => {
            if (ml || !vl()) return;
            ml = !0, chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {});
            const t = wl();
            (async () => {
                if (bl()) return void t.setStatus("Timer rejected — reload the short link and try again.");
                const e = kl();
                if (e) return t.setStatus(fl(3, "opening short link…")), void location.replace(e);
                const n = gl();
                if (!n) return t.setStatus("Mediator form missing — open the short link again."), void(ml = !1);
                const o = yl() || "?";
                "1" !== o || El() || await xl(t), t.setStatus(fl(o, "continuing…")), n.submit()
            })().catch(() => {
                t.setStatus("Something went wrong — open the short link again."), ml = !1
            })
        };
    var Cl = "skipwait-an1",
        Il = "skipwait-an1-css",
        Tl = !1;

    function $l() {
        const t = document.querySelector("a#pre_download[href]");
        if (!t) return !1;
        if (document.getElementById("timer")?.remove(), t.style.display = "inline", t.removeAttribute("onclick"), document.getElementById(Cl) || Tl) return !0;
        Tl = !0, D();
        const e = document.querySelector(".box-file > .foot");
        if (!e) return !0;
        const n = Object.assign(document.createElement("div"), {
            id: Cl,
            className: "dopinfo",
            innerHTML: "<h2>Skip Wait</h2><h3>Countdown skipped — APK download is ready.</h3>"
        });
        return n.setAttribute("role", "status"), e.before(n), !0
    }
    var Al = ["gapkmod.net"],
        ql = "skipwait-gapkmod",
        _l = "data-skipwait-gapkmod",
        Ml = "data-skipwait-gapkmod-wait",
        Ol = "data-sw-token",
        Rl = "data-sw-name",
        Pl = new Map,
        Dl = null,
        Nl = !1;

    function Bl() {
        Nl || (Nl = !0, D())
    }

    function Ul(t) {
        if (!URL.canParse(t, location.href)) return null;
        const e = new URL(t, location.href);
        return rt(e.hostname, Al) ? e : null
    }

    function Wl(t) {
        return Boolean(Ul(t)?.searchParams.get("download_link"))
    }

    function Hl(t) {
        return t.textContent.replace(/\s+/g, " ").trim()
    }

    function Fl(t) {
        if (!t.hasAttribute(_l) && !t.hasAttribute(Ml) && t.classList.contains("downloadAPK")) {
            if (Wl(t.href)) t.setAttribute(Ol, t.href);
            else if (e = t.href, "links" !== Ul(e)?.searchParams.get("download")) return;
            var e;
            t.setAttribute(Rl, Hl(t)), t.setAttribute(Ml, "1"), t.removeAttribute("href"), t.removeAttribute("target"), t.setAttribute("aria-disabled", "true"), t.tabIndex = -1,
                function(t, e) {
                    const n = t.querySelector("i");
                    t.replaceChildren(...n ? [n, document.createTextNode(` ${e}`)] : [e])
                }(t, "Unlocking · Skip Wait")
        }
    }

    function zl(t, e, n = t.getAttribute(Rl) ?? Hl(t)) {
        const o = document.createElement("a");
        o.className = t.className, o.href = e, o.target = "_blank", o.rel = "noopener noreferrer nofollow", o.setAttribute(_l, "1");
        const r = t.querySelector("i") ?? Object.assign(document.createElement("i"), {
            className: "fa fa-download"
        });
        o.replaceChildren(r.cloneNode(!0), document.createTextNode(` ${n}`)), t.replaceWith(o), Bl()
    }

    function jl(t) {
        const e = Pl.get(t);
        if (e) return e;
        const n = function(t) {
            return new Promise((e, n) => {
                chrome.runtime.sendMessage({
                    type: "GAPKMOD_RESOLVE_DOWNLOAD_LINK",
                    href: t
                }, t => {
                    chrome.runtime.lastError || !t?.url ? n(new Error("download_link resolve failed")) : e(t.url)
                })
            })
        }(t);
        return Pl.set(t, n), n
    }
    async function Yl() {
        if (Dl) return Dl;
        const t = function() {
                const t = new URL(location.href);
                return t.hash = "", t.search = "download=links", t.href
            }(),
            e = await fetch(t, {
                credentials: "include",
                cache: "no-store"
            });
        if (!e.ok) throw new Error(`links hop ${e.status}`);
        const n = function(t, e) {
            const n = [];
            for (const o of (new DOMParser).parseFromString(t, "text/html").querySelectorAll("a[href]")) {
                if (!(o instanceof HTMLAnchorElement)) continue;
                const t = o.getAttribute("href");
                t && Wl(t) && n.push({
                    token: new URL(t, e).href,
                    name: Hl(o)
                })
            }
            return n
        }(await e.text(), t);
        if (!n.length) throw new Error("no download_link");
        return Dl = await Promise.all(n.map(async ({
            token: t,
            name: e
        }) => ({
            url: await jl(t),
            name: e
        })))
    }

    function Gl(t) {
        const e = document.querySelector("#list-downloadlinks");
        if (!e) throw new Error("list-downloadlinks");
        e.replaceChildren(...t.map(({
            url: t,
            name: e
        }) => {
            const n = document.createElement("li"),
                o = Object.assign(document.createElement("a"), {
                    className: "buttond downloadAPK dapk_b",
                    href: t,
                    target: "_blank",
                    rel: "noopener noreferrer nofollow"
                });
            return o.setAttribute(_l, "1"), o.append(Object.assign(document.createElement("i"), {
                className: "fa fa-download"
            }), ` ${e}`), n.append(o), n
        })), Bl()
    }
    var Vl = "Download · Skip Wait",
        Zl = "data-skipwait-playmods",
        Jl = "data-skipwait-playmods-wait",
        Xl = "skipwait-playmods",
        Kl = new Map,
        Ql = new WeakMap;

    function tu(t) {
        return `${location.origin}/download/version/${t}?scheme=${location.protocol.slice(0,-1)}`
    }

    function eu(t) {
        return t.match(/\/(\d+)-download\/?$/i)?.[1] ?? null
    }

    function nu(t) {
        return /\/all-download\/?$/i.test(t)
    }

    function ou(t) {
        return /\/download\/?$/i.test(t) && !nu(t) && !eu(t)
    }

    function ru(t) {
        const e = t.querySelector("#downloadStatejs_id")?.getAttribute("versionId")?.trim();
        if (!e) throw new Error("versionId");
        return e
    }

    function iu(t, e) {
        const n = t.querySelector(".detail-downloadBtn > div");
        if (n) return void(n.textContent = e);
        const o = t.querySelector(".historyV-exhibition-detail-dn");
        if (o) return void(o.textContent = e);
        if (!t.classList.contains("btn-download1")) return;
        const r = t.querySelector("span");
        t.replaceChildren(e, ...r ? [" ", r] : [])
    }

    function au(t, e) {
        Ql.set(t, e), t.href = e, t.removeAttribute("target"), t.removeAttribute(Jl), t.setAttribute(Zl, "1"), iu(t, function(t) {
            return t.classList.contains("btn-download1") ? Vl : "Skip Wait"
        }(t))
    }

    function su(t) {
        if (Ql.has(t) || t.hasAttribute(Jl) || t.hasAttribute(Zl) || !URL.canParse(t.href)) return;
        const e = new URL(t.href);
        if (e.hostname !== location.hostname) return;
        const n = eu(e.pathname);
        if (n) return t.setAttribute(Jl, "1"), iu(t, "…"), void au(t, tu(n));
        if (nu(e.pathname) || (o = e.pathname, /\/all-versions\/?$/i.test(o))) return void(t.classList.contains("btn-download1") && (t.setAttribute(Zl, "1"), iu(t, Vl)));
        var o;
        if (!ou(e.pathname)) return;
        if (!t.classList.contains("btn-download1") && !t.querySelector(".detail-downloadBtn")) return;
        const r = e.href;
        t.setAttribute(Jl, "1"), t.removeAttribute("href"), iu(t, "…"),
            function(t) {
                const e = Kl.get(t);
                if (e) return e;
                const n = fetch(t, {
                    credentials: "include",
                    cache: "no-store"
                }).then(async t => {
                    if (!t.ok) throw new Error(`mediator ${t.status}`);
                    return tu(ru((new DOMParser).parseFromString(await t.text(), "text/html")))
                });
                return Kl.set(t, n), n
            }(r).then(e => {
                t.isConnected && au(t, e)
            })
    }

    function cu() {
        for (const t of document.querySelectorAll("a[href]")) su(t)
    }
    var lu = "Download · Skip Wait",
        uu = /^\/download\/[^/]+\/?$/i,
        du = /^\/download\/[^/]+\/\d+\/?$/i,
        mu = t => {
            const e = new URL(t);
            return e.searchParams.set("token", btoa(btoa(String(Math.floor(Date.now() / 1e3) + 10800)))), e.href
        },
        pu = t => {
            const e = t.querySelector(".font-semibold");
            e && e.textContent?.trim() !== lu && (e.textContent = lu)
        },
        hu = t => {
            if (!URL.canParse(t.href)) return null;
            const e = new URL(t.href);
            return e.hostname === location.hostname && du.test(e.pathname) ? e.href : null
        };
    var fu = /^\/download\/?$/i,
        wu = "skipwait-latestmodapks",
        gu = (t, e, n) => {
            t.classList.remove("faded-disabled-btn", "hidden"), n && (n.textContent = "Direct Instant · Skip Wait"), e.then(e => {
                t.href = e, t.removeAttribute("target")
            }), t.addEventListener("click", t => {
                t.preventDefault(), t.stopImmediatePropagation(), e.then(t => {
                    D(), location.assign(t)
                })
            }, !0)
        };

    function yu(t) {
        return new Promise(e => {
            try {
                chrome.runtime.sendMessage({
                    type: "FILECR_EXTRACT_LINK",
                    url: t
                }, t => {
                    chrome.runtime.lastError ? e(null) : e("string" == typeof t?.url && t.url ? t.url : null)
                })
            } catch {
                e(null)
            }
        })
    }
    var ku = new Map,
        bu = new Map,
        vu = new Map,
        Su = new Map,
        Eu = new Map,
        xu = new Map;

    function Lu(t) {
        if (!t?.slug) return !1;
        const e = location.pathname.toLowerCase();
        return e.includes(`/${t.slug.toLowerCase()}`) || e.endsWith(`/${t.slug.toLowerCase()}/`)
    }
    async function Cu(t) {
        const e = await fetch(function(t) {
            return `/_next/data/${t}${location.pathname.replace(/\/$/,"")||"/"}.json${location.search}`
        }(t), {
            credentials: "include",
            cache: "no-store",
            headers: {
                Accept: "application/json"
            }
        });
        return e.ok ? (await e.json()).pageProps?.post ?? null : null
    }

    function Iu() {
        const t = location.pathname.endsWith("/") ? location.pathname : `${location.pathname}/`;
        let e = xu.get(t);
        return e || (e = (async () => {
            const t = function() {
                    const t = document.getElementById("__NEXT_DATA__")?.textContent;
                    if (!t) return null;
                    try {
                        return JSON.parse(t)
                    } catch {
                        return null
                    }
                }(),
                e = t?.props?.pageProps?.post;
            if (Lu(e)) return e;
            const n = t?.buildId;
            if (!n) return null;
            try {
                const t = await Cu(n);
                if (Lu(t)) return t
            } catch {
                return null
            }
            return null
        })(), xu.set(t, e)), e
    }

    function Tu(t, e) {
        return t.links.filter(t => t.type === e)
    }

    function $u(t, e, n) {
        let o = t.get(e);
        return o || (o = n().then(n => (n || t.delete(e), n)), t.set(e, o)), o
    }

    function Au(t) {
        return $u(ku, t, () => fetch(`/api/actions/downloadlink/?id=${t}`, {
            credentials: "include"
        }).then(t => t.json()).then(t => t.success && "string" == typeof t.url && t.url ? t.url : null).catch(() => null))
    }

    function qu(t) {
        return $u(vu, t, () => async function(t) {
            const e = await yu(t);
            return e || (await new Promise(t => setTimeout(t, 150)), yu(t))
        }(t))
    }

    function _u(t) {
        return t.map(t => t.id).join(",")
    }

    function Mu(t) {
        const e = _u(t);
        return $u(Su, e, () => Promise.all(t.map(async t => {
            const e = await Au(t.id);
            return e ? qu(e) : null
        })).then(t => t.find(t => !!t) ?? null))
    }

    function Ou(t) {
        const e = _u(t);
        return $u(Eu, e, () => Promise.all(t.map(t => function(t) {
            return $u(bu, t, () => fetch(`/api/actions/worker/?link_id=${t}`, {
                credentials: "include"
            }).then(t => t.json()).then(t => t.success && "string" == typeof t.url && t.url ? t.url : null).catch(() => null))
        }(t.id))).then(t => t.find(t => !!t) ?? null))
    }
    async function Ru(t) {
        if (t.instant_links?.length) return Mu(t.instant_links);
        if (t.worker_links?.length) return Ou(t.worker_links);
        const e = Number(t.link_id);
        if (!Number.isFinite(e) || e <= 0) return null;
        const n = t.link_type;
        if ("Instant" === n || "Worker" === n) return null;
        const o = await Au(e);
        return o ? "Torrent" === n ? o.startsWith("magnet:") ? o : null : o : null
    }

    function Pu(t) {
        for (const o of t.links) "Torrent" !== o.type && "Internal" !== o.type && "External" !== o.type || Au(o.id);
        const e = Tu(t, "Instant");
        e.length && Mu(e);
        const n = Tu(t, "Worker");
        n.length && Ou(n)
    }

    function Du(t) {
        if (D(), t.startsWith("magnet:")) {
            const e = document.createElement("a");
            return e.href = t, e.rel = "noreferrer", document.body.append(e), e.click(), void e.remove()
        }
        location.replace(t)
    }
    var Nu = /^\/[^/]+\/[^/]+\/?$/i,
        Bu = /^\/file-download\/?$/i;

    function Uu() {
        return function() {
            const t = location.pathname;
            return t.endsWith("/") ? t : `${t}/`
        }()
    }
    var Wu = !1,
        Hu = new Set,
        Fu = "";

    function zu() {
        return `${location.pathname}${location.search}${location.hash}`
    }

    function ju() {
        const t = zu();
        t !== Fu && (Fu = t, function() {
            for (const t of Hu) t()
        }())
    }

    function Yu(t) {
        Hu.add(t),
            function() {
                if (Wu) return;
                Wu = !0, Fu = zu();
                const t = t => function(...e) {
                    const n = t.apply(this, e);
                    return queueMicrotask(ju), n
                };
                history.pushState = t(history.pushState.bind(history)), history.replaceState = t(history.replaceState.bind(history)), window.addEventListener("popstate", ju), window.setInterval(ju, 250);
                try {
                    chrome.runtime.onMessage.addListener(t => {
                        "FILECR_ROUTE" === t?.type && ju()
                    })
                } catch {}
            }(), t()
    }
    var Gu = "skipwait-filecr-brand",
        Vu = null,
        Zu = 0,
        Ju = null,
        Xu = !1,
        Ku = new Map;

    function Qu() {
        Vu = null, td(), document.getElementById(Gu)?.remove()
    }

    function td() {
        Ju?.disconnect(), Ju = null
    }

    function ed(t) {
        return Au(t).then(e => e?.startsWith("magnet:") ? (Ku.set(t, e), e) : (Ku.delete(t), null))
    }

    function nd(t) {
        return t.replace(/\s+/g, " ").trim().toLowerCase()
    }

    function od(t) {
        return t.size ? `${t.size.value} ${t.size.unit}`.replace(/\s+/g, " ").trim().toLowerCase() : ""
    }

    function rd(t, e) {
        for (const n of t)
            if (n.links.some(t => t.id === e)) return n;
        return null
    }

    function id(t, e, n) {
        const o = nd(e.dataset.tooltipContent ?? ""),
            r = nd(e.textContent ?? "");
        for (const i of t.links) {
            if (!n.includes(i.type)) continue;
            const t = od(i);
            if (!r || !t || r === t) {
                if (i.title) {
                    const t = nd(i.title);
                    if (o && o !== t) continue
                }
                return i
            }
        }
        return null
    }

    function ad(t, e) {
        const n = (t.dataset.tooltipId ?? "").match(/^(?:Instant|Worker)-(\d+)$/i)?.[1];
        if (n) return rd(e, Number(n));
        const o = function(t) {
            const e = t.closest('#version-history [class*="version_wrap"]');
            return e instanceof HTMLElement ? /version_header/i.test(e.className) ? null : e : null
        }(t);
        return o ? function(t, e) {
            for (const o of t.querySelectorAll("button[data-tooltip-id]")) {
                const t = (o.dataset.tooltipId ?? "").match(/^(?:Instant|Worker)-(\d+)$/i)?.[1];
                if (!t) continue;
                const n = rd(e, Number(t));
                if (n) return n
            }
            const n = [...t.querySelectorAll('[class*="version_data"]')].map(t => (t.textContent ?? "").replace(/\s+/g, " ").trim()).filter(Boolean);
            for (const o of e)
                if (o.filename && n.includes(o.filename)) return o;
            for (const o of e)
                if (o.version && n.includes(o.version)) return o;
            return null
        }(o, e) : null
    }

    function sd(t, e) {
        const n = t.dataset.tooltipId ?? "",
            o = ad(t, e);
        if (!o) return null;
        const r = n.match(/^Instant-(\d+)$/i)?.[1];
        if (r) {
            const t = Number(r);
            return o.links.find(e => e.id === t && "Instant" === e.type) ?? null
        }
        const i = n.match(/^Worker-(\d+)$/i)?.[1];
        if (i) {
            const t = Number(i);
            return o.links.find(e => e.id === t && "Worker" === e.type) ?? null
        }
        return /^Torrent-/i.test(n) ? id(o, t, ["Torrent"]) : /^Internal-/i.test(n) ? id(o, t, ["Internal", "External"]) : null
    }

    function cd(t) {
        if (t.querySelector(`#${Gu}`)) return;
        const e = document.createElement("div");
        e.id = Gu, e.setAttribute("role", "status"), e.style.cssText = "display:flex;align-items:flex-start;gap:12px;margin:0 0 16px;padding:12px 14px;border:1px solid #ebebeb;border-radius:8px;background:#fff8ef;color:#2b373a;font:600 13px/1.45 -apple-system,system-ui,Segoe UI,Roboto,sans-serif", e.innerHTML = '<span style="flex:0 0 auto;width:22px;height:22px;border-radius:50%;background:#fca120;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:13px;line-height:1">✓</span><span><span style="display:block;font-size:14px;letter-spacing:-.01em">Skip Wait — timers bypassed</span><span style="display:block;margin-top:2px;font-weight:500;opacity:.78">Direct, torrent, and Fast Download are ready without the wait page or Assistant extension.</span></span>';
        const n = t.querySelector(".filter-options") ?? t.firstElementChild;
        n ? n.before(e) : t.prepend(e)
    }

    function ld(t) {
        for (const n of document.querySelectorAll(".download-info")) cd(n);
        const e = Tu(t.latest, "Torrent")[0];
        e && ed(e.id).then(e => {
            if (e && Vu === t)
                for (const t of document.querySelectorAll(".torrent-btn .torrent-link")) t instanceof HTMLAnchorElement && (t.href = e)
        });
        for (const n of document.querySelectorAll('#version-history [data-tooltip-id^="Torrent-"]')) {
            const e = sd(n, t.downloads);
            e && ed(e.id)
        }
    }

    function ud(t, e, n) {
        if ("direct" === n) {
            const e = function(t) {
                const e = Tu(t, "Internal"),
                    n = e[0];
                if (!n) return Tu(t, "External")[0] ?? null;
                const o = document.querySelector('input[name="download-option"]:checked');
                if (!o) return n;
                const r = (document.querySelector(`label[for="${CSS.escape(o.id)}"]`)?.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase();
                return e.find(t => (t.title ?? "").replace(/\s+/g, " ").trim().toLowerCase() === r) ?? n
            }(t.latest);
            return e ? Ru({
                link_id: e.id,
                link_type: e.type
            }) : null
        }
        if ("fast" === n) {
            const e = Tu(t.latest, "Instant"),
                n = Tu(t.latest, "Worker");
            return e.length ? Ru({
                instant_links: e
            }) : n.length ? Ru({
                worker_links: n
            }) : null
        }
        const o = e.dataset.tooltipId ?? "";
        if (!/^(Instant-\d+|Worker-\d+|Internal-|Torrent-)/i.test(o)) return null;
        const r = ad(e, t.downloads);
        if (!r) return null;
        if (/^Instant-\d+/i.test(o)) {
            const t = Tu(r, "Instant");
            return t.length ? Ru({
                instant_links: t
            }) : null
        }
        if (/^Worker-\d+/i.test(o)) {
            const t = Tu(r, "Worker");
            return t.length ? Ru({
                worker_links: t
            }) : null
        }
        const i = sd(e, t.downloads);
        return i ? Ru({
            link_id: i.id,
            link_type: i.type
        }) : null
    }

    function dd() {
        Xu || (Xu = !0, document.addEventListener("click", t => {
            const e = t.target?.closest?.("button, a");
            if (!(e instanceof HTMLElement)) return;
            const n = e.classList.contains("copy-to-clipboard") ? e : e.closest(".copy-to-clipboard"),
                o = e.closest(".torrent-btn"),
                r = /^Torrent-/i.test(e.dataset.tooltipId ?? "");
            if (o || r) {
                const o = function() {
                    const t = Uu();
                    return Vu?.key === t ? Vu : null
                }();
                if (!o) return void pd();
                let i = null;
                i = r ? sd(e, o.downloads)?.id ?? null : Tu(o.latest, "Torrent")[0]?.id ?? null;
                const a = null != i ? Ku.get(i) : void 0;
                return a ? (t.preventDefault(), t.stopImmediatePropagation(), n instanceof HTMLElement ? void navigator.clipboard.writeText(a).then(() => {
                    n.setAttribute("data-tooltip-content", "Copied"), setTimeout(() => n.setAttribute("data-tooltip-content", "Click to copy!"), 2e3)
                }) : void Du(a)) : (null != i && ed(i), void pd())
            }
            const i = function(t) {
                    const e = (t.textContent ?? "").replace(/\s+/g, " ").trim().toLowerCase();
                    return e.includes("fast download") ? "fast" : "direct download" === e ? "direct" : null
                }(e),
                a = e.dataset.tooltipId ?? "";
            if (!i && !/^(Instant-\d+|Worker-\d+|Internal-)/i.test(a)) return;
            t.preventDefault(), t.stopImmediatePropagation();
            const s = Uu();
            (async () => {
                const t = await async function() {
                    const t = Uu();
                    return Vu?.key === t ? Vu : (await pd(), Vu?.key === t ? Vu : null)
                }();
                if (!t || t.key !== s || Uu() !== s) return;
                const n = ud(t, e, i);
                if (!n) return;
                const o = await n;
                o && Uu() === s && Du(o)
            })()
        }, !0))
    }

    function md(t, e) {
        const n = (t.downloads ?? []).filter(t => t.links?.length),
            o = function(t) {
                return (t.downloads ?? []).find(t => t.links?.length) ?? null
            }(t);
        if (!o) return void Qu();
        const r = {
            key: e,
            downloads: n,
            latest: o
        };
        Vu = r,
            function(t) {
                for (const e of t) Pu(e)
            }(n);
        for (const s of n)
            for (const t of Tu(s, "Torrent")) ed(t.id);
        dd();
        const i = () => {
            Vu === r && (Uu() === r.key ? ld(r) : pd())
        };
        i(), td();
        const a = document.body ?? document.documentElement;
        (Ju = new MutationObserver(i)).observe(a, {
            childList: !0,
            subtree: !0
        })
    }
    async function pd() {
        const t = ++Zu;
        if (!Nu.test(location.pathname)) return void(t === Zu && Qu());
        const e = Uu();
        if (Vu?.key === e) return void ld(Vu);
        t === Zu && Qu(), xu.clear();
        const n = await Iu();
        t === Zu && Uu() === e && n && md(n, e)
    }
    var hd = null;

    function fd() {
        if (!Bu.test(location.pathname)) return void(hd = null);
        const t = Uu();
        if (hd === t) return;
        const e = function() {
            const t = sessionStorage.getItem("downloadData") ?? sessionStorage.getItem("info") ?? localStorage.getItem("info");
            if (!t) return null;
            try {
                return JSON.parse(t)
            } catch {
                return null
            }
        }();
        e && (hd = t, Ru(e).then(e => {
            Uu() === t && (e ? Du(e) : hd = null)
        }))
    }
    var wd = {
            lead: "Unlocking downloads.",
            detail: "Skipping the Filecrypt security check for you."
        },
        gd = !1,
        yd = !1,
        kd = null,
        bd = (t = "Unlocking downloads…") => kd ? (kd.setStatus(t), kd) : kd = $t({
            id: "skip-wait-filecrypt-overlay",
            brand: "Skip Wait",
            note: wd,
            status: t
        }),
        vd = () => {
            kd?.remove(), kd = null
        },
        Sd = () => {
            yd || (yd = !0, D())
        };

    function Ed(t) {
        return t.startsWith("obs:") ? atob([...t.slice(4)].reverse().join("")) : t
    }
    var xd = new Set(["buyDownload", "affiliateDownload", "offerDownload", "paidDownload"]);

    function Ld(t, e) {
        if (!t || "#" === t) return null;
        try {
            return new URL(t, e).href
        } catch {
            return null
        }
    }
    async function Cd(t) {
        const e = await fetch(t, {
            credentials: "include"
        });
        if (!e.ok) throw new Error(`filehippo fetch ${e.status}`);
        return function(t) {
            return (new DOMParser).parseFromString(t, "text/html")
        }(await e.text())
    }

    function Id(t, e) {
        const n = t.querySelector("a.js-download-btn-file");
        if (!(n instanceof HTMLAnchorElement)) return null;
        const o = Ld(n.getAttribute("href"), e);
        return o && function(t) {
            const e = new URL(t).pathname;
            return /\/download\/?$/i.test(e) || /\/post_download\/?$/i.test(e)
        }(o) ? o : null
    }
    async function Td(t = document, e = location.href, n = 2) {
        const o = function(t, e) {
            const n = t.getElementById("iframe-download");
            if (n instanceof HTMLIFrameElement) {
                const t = n.getAttribute("data-dw-url");
                return t ? Ld(Ed(t), e) : null
            }
            const o = t.querySelector("a.js-download-btn");
            if (o instanceof HTMLAnchorElement) {
                const t = o.getAttribute("data-dw-type") ?? "";
                if (xd.has(t)) return Ld(o.getAttribute("href"), e);
                const n = o.getAttribute("data-dw-url");
                return n ? Ld(Ed(n), e) : null
            }
            return null
        }(t, e);
        if (o) return o;
        if (n <= 0) throw new Error("filehippo mediator hop exhausted");
        const r = Id(t, e);
        if (!r) throw new Error("filehippo launch url missing");
        return Td(await Cd(r), r, n - 1)
    }
    var $d = "skipwait-filehippo-brand",
        Ad = "data-skipwait-launch",
        qd = new Set(["program", "programVersion", "programDownload", "programPostDownload"]),
        _d = "a.js-download-btn, a.js-download-btn-file, a.js-button-lag";

    function Md(t, e) {
        const n = document.createElement("a");
        n.className = [...t.classList].filter(t => !t.startsWith("js-")).join(" "), n.href = e, n.target = "_blank", n.rel = "noopener noreferrer", n.setAttribute(Ad, "1"), n.setAttribute("aria-disabled", "false"), n.innerHTML = t.innerHTML, n.querySelector(".js-button-spinner")?.remove(), n.querySelector(".js-button-lag-icon")?.classList.remove("is-hidden"), n.querySelector(".js-button-lag-text")?.classList.remove("not-visible"), t.replaceWith(n)
    }

    function Od(t) {
        for (const e of [...document.querySelectorAll(_d)].filter(t => !t.hasAttribute(Ad))) Md(e, t)
    }

    function Rd() {
        if (document.getElementById($d)) return;
        const t = document.querySelector(".U3SftL") ?? document.querySelector(".js-relaunch-action-wrapper") ?? document.querySelector(`a[${Ad}]`)?.parentElement ?? null;
        if (!t) return;
        const e = document.createElement("div");
        e.id = $d, e.className = "_6lscF LNn8Rh QT5VME", e.setAttribute("role", "status");
        const n = document.createElement("div");
        n.className = "BXBtHj kC4eqY", n.innerHTML = '<svg class="JWiJTm _tkCZE BXBtHj" viewBox="0 0 1024 1024" aria-label="circle-info icon" role="img"><use class="BKi9Ew" href="/statics/beren/icons.svg#i-circle-info"></use></svg>';
        const o = document.createElement("div");
        o.className = "qOdQu8";
        const r = document.createElement("div");
        r.className = "UgR1WJ", r.textContent = "Skip Wait — timers bypassed. Click download to open the file in a new tab.", o.append(r), e.append(n, o), t.before(e)
    }

    function Pd() {
        const t = function() {
            for (const t of document.querySelectorAll("script:not([src])")) {
                const e = t.textContent?.trim();
                if (e?.startsWith("{") && e.includes('"routeId"')) try {
                    const t = JSON.parse(e).routeId;
                    if ("program" === t || "programDownload" === t || "programPostDownload" === t || "programVersion" === t) return t
                } catch {
                    continue
                }
            }
            return null
        }();
        t && qd.has(t) && (document.querySelector(_d) || document.getElementById("iframe-download")) && Td().then(e => {
            "programPostDownload" === t && function() {
                const t = document.getElementById("iframe-download");
                t instanceof HTMLIFrameElement && (t.removeAttribute("src"), t.removeAttribute("data-dw-url"), t.remove())
            }(), Od(e), Rd(), D()
        })
    }
    var Dd = "/api/file",
        Nd = /^\/file\/([^/]+)\/?$/i,
        Bd = /btoa\('([A-F0-9]+)'\)/,
        Ud = {
            "Instant Download": "dotFlixDownlaod",
            "Direct Download": "indexDownlaod"
        },
        Wd = (t, e) => fetch(`${Dd}${t}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                captchaValue: "",
                ...e
            })
        }).then(t => t.json()).then(t => t.status ? t.data : null),
        Hd = (t, e) => {
            const n = new Map;
            return e.indexDownlaod && n.set("Direct Download", (async t => {
                const e = await Wd("/downlaod/", {
                    id: t,
                    method: "indexDownlaod"
                });
                if ("string" != typeof e) return null;
                const n = (await Wd("/downlaod2/", {
                    id: e,
                    method: "indexDownlaod"
                }))?.[0];
                return "string" == typeof n ? n : null
            })(t)), e.dotFlixDownlaod && n.set("Instant Download", (async t => {
                const e = await Wd("/downlaod/", {
                    id: t,
                    method: "dotFlixDownlaod"
                });
                if ("string" != typeof e) return null;
                const n = (await fetch(e).then(t => t.text())).match(Bd)?.[1];
                if (!n) return null;
                const o = crypto.randomUUID(),
                    r = Date.now(),
                    i = await fetch("https://dotflix.lol/api/extract-download", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "X-Request-ID": o,
                            "X-Timestamp": String(r)
                        },
                        body: JSON.stringify({
                            requestId: o,
                            timestamp: r,
                            data: btoa(n).split("").reverse().join("")
                        })
                    }).then(t => t.json());
                return i.success && "string" == typeof i.downloadUrl ? i.downloadUrl : null
            })(t)), n
        };

    function Fd(t, e = location.href) {
        const n = t.match(/url\s*=\s*(.+)/i)?.[1]?.trim().replace(/^['"]|['"]$/g, "");
        if (!n) throw new Error("softpedia refresh url missing");
        return new URL(n, e).href
    }
    async function zd(t) {
        const e = await fetch(t, {
            credentials: "include"
        });
        if (!e.ok) throw new Error(`softpedia wait fetch ${e.status}`);
        return function(t, e = location.href) {
            const n = t.match(/http-equiv\s*=\s*["']?refresh["']?[^>]*content\s*=\s*["']([^"']+)["']/i) || t.match(/content\s*=\s*["']([^"']+)["'][^>]*http-equiv\s*=\s*["']?refresh/i);
            if (!n?.[1]) throw new Error("softpedia refresh meta missing");
            return Fd(n[1], e)
        }(await e.text(), t)
    }
    var jd = "data-skipwait-softpedia",
        Yd = "skipwait-softpedia-bypass",
        Gd = /\/dyn-postdownload\.php(?:\/|$)/i,
        Vd = new Map,
        Zd = new Map;

    function Jd(t = location.pathname) {
        return Gd.test(t)
    }

    function Xd(t) {
        try {
            const e = new URL(t, location.href);
            return e.hostname.toLowerCase() === location.hostname.toLowerCase() && Jd(e.pathname)
        } catch {
            return !1
        }
    }

    function Kd(t) {
        return new URL(t, location.href).href
    }

    function Qd(t) {
        if (!t) return null;
        const e = t.match(/(?:location(?:\.href)?\s*=\s*|window\.location(?:\.href)?\s*=\s*)['"]([^'"]*dyn-postdownload\.php[^'"]*)['"]/i);
        return e?.[1] ? Kd(e[1]) : null
    }

    function tm(t, e) {
        t.hasAttribute(jd) || (t.setAttribute(jd, "pending"), function(t) {
            const e = Zd.get(t);
            if (e) return Promise.resolve(e);
            let n = Vd.get(t);
            return n || (n = zd(t).then(e => (Zd.set(t, e), e)).finally(() => {
                Vd.delete(t)
            }), Vd.set(t, n)), n
        }(e).then(e => function(t, e) {
            if (t instanceof HTMLAnchorElement) return t.href = e, t.removeAttribute("onclick"), void t.setAttribute(jd, "1");
            t.removeAttribute("onclick"), t.setAttribute(jd, "1"), t.addEventListener("click", t => {
                t.preventDefault(), t.stopImmediatePropagation(), D(), location.assign(e)
            }, !0)
        }(t, e), () => t.setAttribute(jd, "fail")))
    }

    function em() {
        const t = document.querySelectorAll('a[href*="dyn-postdownload.php"]');
        for (const n of t) Xd(n.href) && tm(n, Kd(n.href));
        for (const n of document.querySelectorAll('[onclick*="dyn-postdownload.php"]')) {
            if (n instanceof HTMLAnchorElement) continue;
            const t = Qd(n.getAttribute("onclick"));
            t && tm(n, t)
        }
        const e = document.getElementById("dllinks");
        e && t.length && function(t) {
            if (document.getElementById(Yd)) return;
            const e = document.createElement("p");
            e.id = Yd, e.className = "dldiscl1", e.style.margin = "12px 0 0 30px", e.textContent = "Skip Wait — mirror clicks open the file directly, skipping the Softpedia wait page.", t.prepend(e)
        }(e)
    }

    function nm() {
        try {
            D(), location.replace(function(t, e = location.href) {
                const n = [...t.querySelectorAll("meta")].find(t => "refresh" === t.httpEquiv.toLowerCase())?.content;
                if (!n) throw new Error("softpedia refresh meta missing");
                return Fd(n, e)
            }(document))
        } catch {
            return
        }
    }

    function om(t, e, n) {
        let o = null;
        return r => {
            const i = kt(t);
            if (document.documentElement.classList.add(i), !document.getElementById(e)) {
                const n = document.createElement("style");
                n.id = e, n.textContent = Lt(t, i), (document.head ?? document.documentElement).appendChild(n)
            }
            return o ? (o.setStatus(r), o) : (o = $t({
                id: t,
                brand: "Skip Wait",
                note: n,
                status: r
            }), o)
        }
    }
    var rm = ["https://h4.suncdn.org/host/", "https://points.topapii.com/host/", "https://ml.theapii.org/host/", "https://dns.pingora.fyi/v2/host", "https://cdn.hub4u.cloud/host/"],
        im = om("skip-wait-hdhub4u-landing", "skip-wait-hdhub4u-landing-boot", {
            lead: "Hang tight — opening the main site.",
            detail: "You don't need to tap anything on the page."
        });
    var am = /^\/homelander\/?$/i,
        sm = om("skip-wait-hdhub4u-mediator", "skip-wait-hdhub4u-mediator-boot", {
            lead: "Hang tight — opening the next page.",
            detail: "You don't need to tap anything on the page."
        });

    function cm() {
        const t = localStorage.getItem("o");
        if (!t) return null;
        try {
            const {
                value: e,
                expiry: n
            } = JSON.parse(t);
            if ("string" != typeof e || "number" != typeof n) return null;
            if (Date.now() > n) return localStorage.removeItem("o"), null;
            const {
                o: o
            } = JSON.parse(atob(atob(atob(e)).replace(/[a-zA-Z]/g, t => {
                const e = t.charCodeAt(0);
                return String.fromCharCode(e >= 97 ? (e - 84) % 26 + 97 : (e - 52) % 26 + 65)
            })));
            if ("string" != typeof o) return null;
            const {
                protocol: r,
                href: i
            } = new URL(atob(o));
            return "https:" === r || "http:" === r ? i : null
        } catch {
            return null
        }
    }
    var lm = /^\/dl\/?$/i;
    var um = ["vcloud.zip", "vcloud.fit"],
        dm = /https?:\/\/[^'"\s]+\/hubcloud\.php\?[^'"\s]+/i,
        mm = /var\s+url\s*=\s*atob\s*\(\s*atob\s*\(\s*['"]([A-Za-z0-9+/=]+)['"]\s*\)\s*\)/,
        pm = /^\/drive\/(?!admin(?:\/|$))[\w-]+\/?$/i,
        hm = /^\/(?!admin(?:\/|$))[\w-]+\/?$/i,
        fm = "skip-wait-hubcloud-overlay",
        wm = "skip-wait-hubcloud-boot",
        gm = {
            lead: "Hang tight — opening the next page.",
            detail: "You don't need to tap anything on the page."
        },
        ym = null,
        km = !1,
        bm = () => {
            const {
                pathname: t
            } = location;
            return rt(location.hostname, um) ? !new URLSearchParams(location.search).has("token") && ("/" !== t && hm.test(t)) : pm.test(t)
        },
        vm = () => {
            const t = document.getElementById("download");
            if (t instanceof HTMLAnchorElement && dm.test(t.href)) return t.href;
            for (const e of document.scripts) {
                const t = e.textContent ?? "",
                    n = t.match(dm);
                if (n) return n[0];
                const o = t.match(mm);
                if (o?.[1]) try {
                    return atob(atob(o[1]))
                } catch {
                    continue
                }
            }
            return null
        },
        Sm = () => ((() => {
            const t = kt(fm);
            if (document.documentElement.classList.add(t), document.getElementById(wm)) return;
            const e = document.createElement("style");
            e.id = wm, e.textContent = Lt(fm, t), (document.head ?? document.documentElement).appendChild(e)
        })(), ym || (ym = $t({
            id: fm,
            brand: "Skip Wait",
            note: gm,
            status: "Opening the next page…"
        })));
    var Em = /^\/go\/?$/i,
        xm = /decodeURIComponent\s*\(\s*atob\s*\(\s*['"]([A-Za-z0-9+/=]+)['"]\s*\)\s*\)/,
        Lm = "skipwait-haxpc-brand",
        Cm = !1;

    function Im() {
        const t = document.querySelectorAll("a.haxpc-intercept");
        t.forEach(t => t.classList.remove("haxpc-intercept")),
            function() {
                if (document.getElementById(Lm)) return;
                const t = document.getElementById("wps-tabs"),
                    e = document.querySelector(".app-box-label svg");
                if (!t || !e || !document.querySelector(".entry-content a.cp-download")) return;
                const n = Object.assign(document.createElement("div"), {
                    id: Lm,
                    className: "app-box"
                });
                n.setAttribute("role", "status"), n.innerHTML = `<div class="app-box-head"><span class="app-box-label">${e.outerHTML}Skip Wait</span><span class="share-label">Waiting page skipped — download buttons open the host directly.</span></div>`, t.before(n)
            }(), Cm || (t.length || document.getElementById(Lm)) && (Cm = !0, D())
    }
    var Tm = ["mi-active", "mi-dl", "mi-start", "mi-total"];
    var $m = "skipwait-kotakanimeid-brand",
        Am = /^\/out\//i,
        qm = ["1080p", "HD", "720p", "480p", "360p"],
        _m = "rounded-xl border p-4 text-sm border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-300";

    function Mm() {
        for (const t of document.querySelectorAll("script:not([src])")) {
            const e = t.textContent ?? "";
            if (!/window\.DL\s*=/.test(e)) continue;
            const n = e.match(/encrypted\s*:\s*["']([^"']+)["']/)?.[1] ?? "";
            return n ? {
                encrypted: n,
                title: e.match(/title\s*:\s*["']([^"']*)["']/)?.[1] ?? "",
                isBlogger: /isBlogger\s*:\s*true/.test(e)
            } : null
        }
        return null
    }

    function Om(t) {
        const e = document.getElementById("loading");
        e && (e.classList.toggle("hidden", !t), e.classList.toggle("flex", t))
    }
    async function Rm(t, e, n = {}) {
        const o = await fetch(t, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "X-Fingerprint": "dummy-fingerprint",
                ...n
            },
            body: JSON.stringify(e)
        });
        if (!o.ok) throw new Error(`HTTP ${o.status}`);
        return await o.json()
    }
    async function Pm(t, e, n) {
        const o = await Rm("/video/get-token.php", {
            url: t
        });
        if (!o.success || !o.token || !o.challenge || null == o.timestamp) throw new Error(o.message || "Token request failed");
        return Rm(e, {
            url: n,
            challenge: o.challenge
        }, {
            "X-Security-Token": o.token,
            "X-Timestamp": String(o.timestamp),
            "X-Challenge": o.challenge
        })
    }

    function Dm(t) {
        return t.startsWith("http") ? t : new URL(t, location.origin).href
    }

    function Nm(t, e, n) {
        const o = document.createElement(t);
        return e && (o.className = e), null != n && (o.textContent = n), o
    }

    function Bm(t) {
        const e = document.getElementById("result-section");
        if (!e) return;
        e.replaceChildren(), e.classList.remove("hidden"), e.classList.add("w-full", "text-left"),
            function(t) {
                if (document.getElementById($m)) return;
                const e = Nm("div", _m);
                e.id = $m, e.setAttribute("role", "status");
                const n = Nm("strong", void 0, "Skip Wait"),
                    o = Nm("span", void 0, " Wait skipped. Choose a resolution below — each link opens that file.");
                e.append(n, o), t.prepend(e), t.append(Nm("div", "h-4"))
            }(e), e.append(Nm("h3", "mb-4 text-center text-base font-semibold", "Unduhan Siap"));
        const n = function(t) {
            const e = new Map;
            for (const n of t) {
                const t = e.get(n.group) ?? [];
                t.push(n), e.set(n.group, t)
            }
            return e
        }(t);
        if ([...n.values()].some(t => t.length > 1)) {
            const t = Nm("div", "rounded-xl border p-4 text-sm border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-400/40 dark:bg-amber-400/10 dark:text-amber-300"),
                n = Nm("strong", void 0, "File Terbagi.");
            t.append(n, document.createTextNode(" Pastikan mengunduh semua bagian (part).")), e.append(t, Nm("div", "h-4"))
        }
        const o = Nm("div", "mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2"),
            r = [...qm.filter(t => n.has(t)), ...[...n.keys()].filter(t => !qm.includes(t))];
        for (const l of r) {
            const t = n.get(l);
            if (!t?.length) continue;
            const e = Nm("div", "rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50"),
                r = Nm("div", "mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 dark:border-slate-700"),
                i = Nm("i", "fa-solid fa-film text-violet-500");
            r.append(i, Nm("h4", "text-sm font-semibold", "download" === l ? "Download" : l));
            const a = Nm("div", "flex flex-wrap gap-2");
            for (const n of t) {
                const t = Nm("a", "inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-violet-500 hover:text-violet-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-violet-400 dark:hover:text-violet-400");
                t.href = n.url, t.rel = "noopener nofollow", t.append(Nm("i", "fa-solid fa-download text-xs"), document.createTextNode(" " + n.text)), a.append(t)
            }
            e.append(r, a), o.append(e)
        }
        e.append(o);
        const i = Nm("div", _m),
            a = Nm("strong", void 0, "Info Server Lokal."),
            s = Nm("ul", "mt-1 list-disc space-y-0.5 pl-4 text-xs opacity-90");
        s.append(Nm("li", void 0, "Kualitas video mungkin lebih rendah untuk adegan aksi cepat."), Nm("li", void 0, "Ukuran file bisa lebih besar karena diproses ulang server."));
        const c = Nm("div");
        c.append(a, s), i.append(c), e.append(i), document.getElementById("generate-btn")?.remove()
    }
    async function Um() {
        const t = Mm();
        if (t) {
            ! function() {
                document.getElementById("countdown")?.classList.add("hidden");
                const t = document.getElementById("generate-btn");
                t && (t.classList.add("hidden"), t.classList.remove("inline-flex"))
            }(), Om(!0);
            try {
                const n = await async function(t) {
                    if (t.isBlogger) {
                        const e = new URL("/video/get-download.php", location.origin);
                        e.searchParams.set("mode", "lokal"), e.searchParams.set("vid", encodeURIComponent(t.encrypted)), t.title && e.searchParams.set("title", encodeURIComponent(t.title)), e.searchParams.set("dl", "yes"), e.searchParams.set("json", "true");
                        const n = e.toString();
                        return Pm(n, n, n)
                    }
                    return Pm(t.encrypted, "/video/get-download.php", t.encrypted)
                }(t);
                if ("success" !== n.status) throw new Error(n.message || "Download link failed");
                const o = function(t) {
                    if (!t) return [];
                    const e = [],
                        n = new Set,
                        o = (t, o) => {
                            for (const r of o ?? []) {
                                const o = r.url?.trim();
                                if (!o) continue;
                                const i = Dm(o);
                                n.has(i) || (n.add(i), e.push({
                                    url: i,
                                    text: r.text?.trim() || t,
                                    group: t
                                }))
                            }
                        };
                    for (const r of qm) o(r, t[r]);
                    o("download", t.download);
                    for (const [r, i] of Object.entries(t)) "download" === r || qm.includes(r) || o(r, i);
                    return e
                }(n.links);
                if (0 === o.length) throw new Error(n.message || "No download links returned");
                const r = 1 === o.length ? o[0] : null;
                if (r) return e = r.url, $t({
                    id: "skip-wait-kotakanimeid-out",
                    brand: "Skip Wait",
                    note: {
                        lead: "Skipping KotakAnimeID wait…",
                        detail: "No countdown. Opening the real download destination."
                    },
                    status: "Opening destination…"
                }), D(), void location.replace(e);
                Bm(o)
            } catch (n) {
                ! function(t) {
                    const e = document.getElementById("result-section");
                    if (!e) return;
                    e.replaceChildren(), e.classList.remove("hidden");
                    const n = Nm("div", "rounded-xl border p-4 text-sm border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/40 dark:bg-rose-500/10 dark:text-rose-300", t);
                    e.append(n)
                }("Terjadi kesalahan: " + (n instanceof Error ? n.message : "Unexpected error"))
            } finally {
                Om(!1), document.getElementById("result-section")?.classList.remove("hidden")
            }
            var e
        }
    }
    var Wm = /^[A-Za-z0-9]+$/,
        Hm = 'a[id$="-final-link-wrapper"][href*="linkjust.com"], a#next-link-wrapper[href*="linkjust.com"]',
        Fm = /https?:\/\/(?:www\.)?linkjust\.com\/([A-Za-z0-9]+)/i,
        zm = !1,
        jm = t => `https://linkjust.com/${t}`,
        Ym = () => {
            const t = new URLSearchParams(location.search).get("GetArticle")?.trim() ?? "";
            return Wm.test(t) ? t : null
        },
        Gm = async t => {
            try {
                const e = new URL(t);
                if (!(await nt(e.hostname, "linkjust"))) return null;
                const n = e.pathname.replace(/^\/+|\/+$/g, "");
                return Wm.test(n) ? n : null
            } catch {
                return null
            }
        }, Vm = async () => {
            const t = Ym();
            if (t) return jm(t);
            const e = await (async () => {
                for (const n of document.querySelectorAll(Hm)) {
                    const t = await Gm(n.href);
                    if (t) return t
                }
                const t = document.documentElement?.innerHTML ?? "";
                if (!t.includes("linkjust")) return null;
                const e = t.match(Fm);
                return e?.[1] && Wm.test(e[1]) ? e[1] : null
            })();
            return e ? jm(e) : null
        }, Zm = async () => {
            if (zm) return !0;
            const t = await Vm();
            return !!t && (zm = !0, D(), location.replace(t), !0)
        };
    var Jm = /[a-f0-9]{32}/,
        Xm = /^\/(?:pages|auth|payout-rates|sitemap|api|links|blue_theme|js|img|cdn-cgi)(?:\/|$)/i,
        Km = /^\/[A-Za-z0-9_-]{2,}\/?$/,
        Qm = /^\/(?:api|cdn-cgi)(?:\/|$)/i,
        tp = t => {
            try {
                return new URL(t)
            } catch {
                return null
            }
        };
    async function ep(t = location.href) {
        const e = tp(t);
        return e ? await nt(e.hostname, "linknext") ? e.searchParams.has("tk") ? "tk" : (n = e.pathname, !Xm.test(n) && Km.test(n) ? "alias" : null) : await async function(t = location.href) {
            const e = tp(t);
            if (!e || !(await nt(e.hostname, "linknext-blog"))) return !1;
            const n = e.hostname.toLowerCase();
            return !n.startsWith("www.") && !!n.split(".").slice(0, -2).join(".") && !Qm.test(e.pathname)
        }(t) ? "blog" : await async function(t = location.href) {
            const e = tp(t);
            if (!e || !(await nt(e.hostname, "linknext-mediator"))) return !1;
            const n = e.searchParams.get("ssid");
            return !!n && Jm.test(n)
        }(t) ? "mediator" : null: null;
        var n
    }
    var np = /[a-f0-9]{32}/,
        op = t => {
            const e = document.cookie.match(new RegExp(`(?:^|;\\s*)${t}=([^;]*)`));
            return e ? decodeURIComponent(e[1]) : null
        };

    function rp(t = document) {
        const e = t.documentElement.innerHTML;
        return /&quot;id&quot;:\[0,&quot;([a-f0-9]{32})&quot;\]/.exec(e)?.[1] ?? /"id"\s*:\s*"([a-f0-9]{32})"/.exec(e)?.[1] ?? null
    }

    function ip() {
        return op("__csrf")?.trim() ?? null
    }
    var ap = () => {
        const t = ip();
        if (!t) throw new Error("mediator csrf missing");
        return {
            "Content-Type": "application/json",
            "X-CSRF-Token": t
        }
    };
    async function sp(t, e) {
        const n = await fetch(`/api/session/${t}/step/increment`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": e
                },
                body: "{}"
            }),
            o = await n.text();
        let r = {};
        try {
            r = JSON.parse(o)
        } catch {}
        return {
            ok: n.ok && !!r.success,
            completed: !!r.session?.completed,
            finalDestination: r.session?.finalDestination ?? null,
            rateLimited: /429/.test(o)
        }
    }
    var cp = "skip-wait-linknext-overlay",
        lp = "skip-wait-linknext-boot",
        up = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        dp = null,
        mp = !1,
        pp = swDelay,
        hp = () => new Promise(t => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }, () => t())
        }),
        fp = () => {
            const t = kt(cp);
            if (document.documentElement.classList.add(t), document.getElementById(lp)) return;
            const e = document.createElement("style");
            e.id = lp, e.textContent = Lt(cp, t), (document.head || document.documentElement).appendChild(e)
        },
        wp = (t = "Getting things ready…") => (fp(), dp ? (dp.setNote(up), dp.setStatus(t), dp) : dp = $t({
            id: cp,
            brand: "Skip Wait",
            note: up,
            status: t,
            countdownLabel: "Continue in"
        })),
        gp = async (t, e) => {
            const n = Date.now() + e;
            for (; Date.now() < n;) {
                const e = t();
                if (e) return e;
                await pp(100)
            }
            throw new Error("wait timeout")
        }, yp = async (t, e, n) => {
            t.setStatus(n), t.startCountdown(Date.now() + e), await pp(e), t.hideCountdown()
        }, kp = (t, e, n) => `Step ${t} of ${e} — ${n}`;
    async function bp(t) {
        await hp(), t.setStatus("Opening gate…"), location.replace(await async function(t = location.href) {
            const e = await fetch(t, {
                    method: "GET",
                    redirect: "manual",
                    credentials: "include"
                }),
                n = e.headers.get("Location") ?? e.headers.get("location");
            if (!n) throw new Error("alias location missing");
            return new URL(n, t).href
        }())
    }
    async function vp(t) {
        await hp();
        const e = await gp(() => function(t = location.href) {
            try {
                const e = new URL(t).searchParams.get("ssid");
                return e && np.test(e) ? e : null
            } catch {
                return null
            }
        }(), 2e4);
        await gp(() => ip(), 15e3), t.setStatus(kp(1, 1, "Starting session…"));
        const n = await async function(t, e) {
            const n = {
                ssid: t,
                currentIp: e,
                ipType: "IPv4",
                ipv4: e,
                ipv6: null,
                hcaptchaToken: null
            };
            let o = await fetch(`/api/session/${t}`, {
                    method: "PATCH",
                    headers: ap(),
                    body: JSON.stringify(n)
                }),
                r = await o.text();
            if (409 === o.status) {
                const e = JSON.parse(r).existingSession?.id?.trim();
                if (!e || !np.test(e)) throw new Error("conflict id missing");
                const i = await fetch(`/api/session/${e}`, {
                    method: "DELETE",
                    headers: ap()
                });
                if (!i.ok) throw new Error(`delete ${i.status}`);
                o = await fetch(`/api/session/${t}`, {
                    method: "PATCH",
                    headers: ap(),
                    body: JSON.stringify(n)
                }), r = await o.text()
            }
            if (!o.ok) throw new Error(`patch ${o.status}`);
            const i = JSON.parse(r).redirect?.trim() ?? "";
            if (!i.startsWith("http")) throw new Error("redirect missing");
            return i
        }(e, await async function() {
            const t = (await (await fetch("https://ipv4.icanhazip.com/")).text()).trim();
            if (!t) throw new Error("ipv4 empty");
            return t
        }());
        t.setStatus(kp(1, 1, "Continuing…")), location.replace(n)
    }
    var Sp = async (t, e, n, o) => {
        for (;;) {
            const r = await sp(e, n);
            if (r.ok) return r;
            if (!r.rateLimited) throw new Error("increment failed");
            await yp(t, 1e4, kp(o, 3, "Waiting for server timer…"))
        }
    };
    async function Ep(t) {
        await hp();
        const e = await gp(() => rp(), 25e3),
            n = await gp(() => function(t = document) {
                return t.querySelector('meta[name="csrf-token"]')?.content?.trim() ?? op("__csrf") ?? null
            }(), 15e3);
        for (let o = 0; o < 3; o++) {
            const r = o + 1;
            o > 0 ? await yp(t, 1e4, kp(r, 3, "Waiting for server timer…")) : t.setStatus(kp(r, 3, "Advancing unlock…"));
            const i = await Sp(t, e, n, r);
            if (i.completed && i.finalDestination) return t.setStatus(kp(r, 3, "Opening destination gate…")), D(), void location.replace(i.finalDestination)
        }
        throw new Error("blog incomplete")
    }
    async function xp(t) {
        await hp();
        const e = await gp(() => function(t = document) {
            const e = t.documentElement.innerHTML,
                n = (new DOMParser).parseFromString(e, "text/html");
            for (const o of [t, n]) {
                const t = o.querySelector("#go-link");
                if (!t?.querySelector('[name="ad_form_data"]')) continue;
                const e = new URL(t.getAttribute("action") || "/links/go", location.origin).href,
                    n = {};
                return t.querySelectorAll("input[name]").forEach(t => {
                    t.name && (n[t.name] = t.value ?? "")
                }), {
                    action: e,
                    fields: n
                }
            }
            return null
        }(), 2e4);
        await yp(t, 1e3 * function(t = document) {
            const e = t.documentElement.innerHTML.match(/"counter_value"\s*:\s*"?(\d+)/);
            return e?.[1] ? Math.max(0, parseInt(e[1], 10)) : 0
        }(), "Waiting for unlock timer…"), t.setStatus("Opening destination…");
        const n = await async function(t, e) {
            const n = await fetch(t.action, {
                    method: "POST",
                    body: new URLSearchParams(t.fields),
                    credentials: "include",
                    headers: {
                        Accept: "application/json, text/javascript, */*; q=0.01",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest",
                        Referer: e
                    }
                }),
                o = (JSON.parse(await n.text()).url ?? "").trim();
            if (!o || !/^https?:\/\//i.test(r = o) || /^javascript:/i.test(r)) throw new Error("links/go url missing");
            var r;
            try {
                if (await nt(new URL(o).hostname, "linknext")) throw new Error("links/go url missing")
            } catch {
                throw new Error("links/go url missing")
            }
            return o
        }(e, location.href);
        D(), location.replace(n)
    }
    var Lp = t => {
        mp || (mp = !0, async function(t) {
            const e = wp();
            try {
                switch (t) {
                    case "alias":
                        return void(await bp(e));
                    case "mediator":
                        return void(await vp(e));
                    case "tk":
                        return void(await xp(e));
                    case "blog":
                        return void(await Ep(e));
                    default:
                        throw new Error("unknown phase")
                }
            } catch {
                (t => {
                    t.setError("Unlock failed. Reload and try again.")
                })(e)
            }
        }(t))
    };
    var Cp = /^\/r\/[^/]+\/?$/i,
        Ip = /\bdata-destination=["'](https?:\/\/[^"']+)["']/i;
    var Tp = swDelay,
        $p = () => {
            let t = "";
            for (let e = 0; e < 3; e++) t += crypto.randomUUID();
            return t.slice(0, 100)
        },
        Ap = () => {
            const t = document.cookie.match(/(?:^|; )euconsent-v2=([^;]*)/);
            return t?.[1] ? decodeURIComponent(t[1]) : ""
        };
    async function qp(t, e, n) {
        const o = await fetch("https://publisher.linkvertise.com/graphql", {
            method: "POST",
            credentials: "include",
            headers: {
                "content-type": "application/json",
                accept: "application/json"
            },
            body: JSON.stringify({
                operationName: t,
                query: e,
                variables: n
            })
        });
        if (!o.ok) throw new Error(`graphql ${o.status}`);
        const r = await o.json();
        if (r.errors?.length) throw new Error(r.errors[0]?.message || "graphql error");
        if (!r.data) throw new Error("graphql empty");
        return r.data
    }
    var _p = t => /^https?:\/\//i.test(t);
    var Mp = t => t.find(t => "AdTask" === t.__typename && "DONE" !== t.status) ?? null,
        Op = t => t.find(t => "WaitTask" === t.__typename && "DONE" !== t.status) ?? null,
        Rp = (t = location.pathname) => /^\/your-target\/?$/i.test(t),
        Pp = t => {
            const e = t.url?.trim() ?? "";
            if (e && _p(e)) return {
                kind: "url",
                url: e
            };
            const n = t.paste?.trim() ?? "";
            if (n) {
                const t = n.match(/https?:\/\/[^\s<>"']+/i)?.[0]?.trim() ?? "";
                return t && _p(t) ? {
                    kind: "url",
                    url: t
                } : {
                    kind: "paste",
                    text: n
                }
            }
            throw new Error("target")
        };

    function Dp(t = history.state) {
        const e = t;
        if (!e?.target || "object" != typeof e.target) return null;
        if (!(Rp() || e.targetType && e.linkId)) return null;
        try {
            return Pp(e.target)
        } catch {
            return null
        }
    }
    async function Np(t, e = {}) {
        const {
            onStatus: n,
            onWait: o,
            onWaitDone: r
        } = e, i = function(t = location.href) {
            let e;
            try {
                e = new URL(t)
            } catch {
                return null
            }
            if (!/\/dynamic\/?$/i.test(e.pathname)) return null;
            const n = e.searchParams.get("r")?.trim() ?? "";
            if (!n) return null;
            let o;
            try {
                o = atob(n).trim()
            } catch {
                return null
            }
            if (!_p(o)) return null;
            try {
                return new URL(o).href
            } catch {
                return null
            }
        }();
        if (i) return n?.("Opening your link…"), {
            kind: "url",
            url: i
        };
        const a = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(t => t.toString(16).padStart(2, "0")).join(""),
            s = t => {
                const e = {
                    request_id: a,
                    action_id: $p(),
                    additional_data: {
                        taboola: {
                            user_id: "fallbackUserId",
                            consent_string: Ap(),
                            url: location.href,
                            external_referrer: document.referrer || "",
                            session_id: null
                        }
                    }
                };
                return t && (e.completion_token = t), e
            },
            c = () => qp("getContent", "query getContent($identifier: PublicLinkIdentificationInput!, $task_args: TaskArgument) {\n  getContent(input: $identifier, task_args: $task_args) {\n    ... on ContentAccessTaskSet {\n      __typename\n      tasks {\n        __typename\n        id\n        ... on WaitTask { remainingWaitingTime status adsTotal }\n        ... on AdTask { status adIndex adsTotal ads { completion_token } }\n        ... on PremiumTask { status }\n      }\n    }\n    ... on DetailPageTargetData { __typename type url paste }\n    __typename\n  }\n}", {
                identifier: t,
                task_args: s()
            }),
            l = (e, n) => qp("completeTask", "mutation completeTask($identifier: PublicLinkIdentificationInput!, $task_id: String!, $task_args: TaskArgument) {\n  completeTask(input: $identifier, task_id: $task_id, task_args: $task_args) {\n    id\n    __typename\n    ... on WaitTask { status remainingWaitingTime adsTotal }\n    ... on AdTask { status adIndex adsTotal }\n    ... on PremiumTask { status }\n  }\n}", {
                identifier: t,
                task_id: e,
                task_args: s(n)
            });
        for (let d = 0; d < 24; d++) {
            const t = Dp();
            if (t) return t;
            if (Rp()) {
                n?.("Almost there…"), await Tp(300);
                const t = Dp();
                if (t) return t
            }
            n?.("Unlocking your link…");
            const e = (await c()).getContent;
            if ("DetailPageTargetData" === e.__typename) return Pp(e);
            if ("ContentAccessTaskSet" !== e.__typename) throw new Error("content");
            const i = Dp();
            if (i) return i;
            const a = Op(e.tasks);
            if (a) {
                const t = Math.max(0, Math.floor(Number(a.remainingWaitingTime) || 0));
                if (t > 0) {
                    n?.("Waiting a moment…");
                    const e = Date.now() + 1e3 * t;
                    o?.(e), await Tp(1e3 * t), r?.()
                }
                const e = Dp();
                if (e) return e;
                if (Rp()) continue;
                n?.("Continuing…"), await l(a.id);
                continue
            }
            const s = Mp(e.tasks);
            if (s) {
                const t = Dp();
                if (t) return t;
                if (Rp()) continue;
                const e = s.ads?.[0]?.completion_token?.trim() || void 0;
                n?.(s.adsTotal && s.adIndex ? `Step ${s.adIndex} of ${s.adsTotal}…` : "Continuing…"), await l(s.id, e);
                continue
            }
            n?.("Almost there…"), await Tp(500)
        }
        const u = Dp();
        if (u) return u;
        throw new Error("steps")
    }
    var Bp = "skip-wait-linkvertise-access",
        Up = "skip-wait-linkvertise-access-boot",
        Wp = {
            lead: "Hang tight — unlocking your link.",
            detail: "Skip Wait is working. You don’t need to tap anything."
        },
        Hp = null,
        Fp = !1,
        zp = !1,
        jp = (t = "Getting ready…") => ((() => {
            const t = kt(Bp);
            if (document.documentElement.classList.add(t), document.getElementById(Up)) return;
            const e = document.createElement("style");
            e.id = Up, e.textContent = Lt(Bp, t), (document.head || document.documentElement).appendChild(e)
        })(), Hp ? (Hp.setNote(Wp), Hp.setStatus(t), Hp) : Hp = $t({
            id: Bp,
            brand: "Skip Wait",
            note: Wp,
            status: t,
            countdownLabel: "Continue in"
        })),
        Yp = () => /^\/(?:access\/)?[^/]+\/[^/]+(?:\/dynamic)?\/?$/i.test(location.pathname),
        Gp = async (t, e) => {
            e.hideCountdown();
            try {
                await navigator.clipboard.writeText(t), e.setStatus("Content copied — you can paste it anywhere.")
            } catch {
                e.setStatus("Your content is ready on the page.")
            }
            document.documentElement.classList.remove(kt(Bp)), document.getElementById(Up)?.remove(), document.getElementById(Bp)?.remove(), Hp = null
        }, Vp = (t, e) => {
            zp = !0, "url" !== t.kind ? Gp(t.text, e) : ((t, e) => {
                e.hideCountdown(), e.setStatus("Opening your link…"), D(), location.replace(t)
            })(t.url, e)
        }, Zp = () => {
            if (Fp || zp || !Yp()) return;
            const t = function(t = location.href) {
                let e;
                try {
                    e = new URL(t)
                } catch {
                    return null
                }
                const n = e.pathname,
                    o = n.match(/^\/access\/([^/]+)\/([^/]+)\/dynamic\/?$/i) || n.match(/^\/([^/]+)\/([^/]+)\/dynamic\/?$/i);
                if (o?.[1]) {
                    const t = e.searchParams.get("r")?.trim() ?? "";
                    if (!t) return null;
                    const n = {
                            user_id: o[1],
                            hash: t,
                            originates_from_adfly: "adfly" === e.searchParams.get("link_origin")
                        },
                        r = e.searchParams.get("v")?.trim();
                    return r && (n.version = r), {
                        userIdAndHash: n
                    }
                }
                const r = n.match(/^\/access\/([^/]+)\/([^/]+)\/?$/i) || n.match(/^\/([^/]+)\/([^/]+)\/?$/i);
                return r?.[1] && r[2] ? /^(access|your-target|for-you|explore|login|account)$/i.test(r[1]) ? null : {
                    userIdAndUrl: {
                        user_id: r[1],
                        url: decodeURIComponent(r[2])
                    }
                } : null
            }();
            if (!t) return;
            Fp = !0, chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {});
            const e = jp("Unlocking your link…");
            Np(t, {
                onStatus: t => {
                    zp || e.setStatus(t)
                },
                onWait: t => {
                    zp || e.startCountdown(t)
                },
                onWaitDone: () => e.hideCountdown()
            }).then(t => {
                zp || Vp(t, e)
            }).catch(() => {
                if (zp) return;
                const t = Dp();
                t ? Vp(t, e) : (e.hideCountdown(), e.setStatus("Something went wrong — reload and try again."))
            })
        }, Jp = () => {
            zp || ((() => {
                if (zp || !Rp()) return;
                const t = Dp();
                if (!t) return;
                Fp = !0;
                const e = jp("url" === t.kind ? "Opening your link…" : "Copying your content…");
                Vp(t, e)
            })(), Zp())
        };
    var Xp = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        Kp = "skip-wait-liteshort",
        Qp = ["Opening LiteShort", "Skipping Continue to Destination", "Waiting on Get Link", "Opening your destination"],
        th = "LiteShort is unlocking.",
        eh = "Skip Wait clears Continue pages and waits only for the real Get Link timer.",
        nh = (() => {
            let t = null,
                e = null,
                n = null,
                o = 0,
                r = 0,
                i = !1,
                a = "";
            const s = () => {
                    null != e && (clearInterval(e), e = null), null != n && (clearInterval(n), n = null)
                },
                c = () => `${Qp[r]}${".".repeat(o+1)}`,
                l = (e, n) => {
                    document.documentElement.classList.add(kt(Kp));
                    const o = {
                            lead: e ?? th,
                            detail: n ?? eh
                        },
                        r = i ? a : c();
                    return t ? (t.setNote(o), t.setStatus(r), t.setError(null), t) : (t = $t({
                        id: Kp,
                        brand: "Skip Wait",
                        note: o,
                        status: r,
                        countdownLabel: "Get Link ready in"
                    }), t)
                },
                u = () => {
                    i || (null == e && (e = window.setInterval(() => {
                        !i && t && (o = (o + 1) % 3, t.setStatus(c()))
                    }, 450)), null == n && (n = window.setInterval(() => {
                        !i && t && (r >= Qp.length - 1 ? null != n && (clearInterval(n), n = null) : (r += 1, o = 0, t.setStatus(c())))
                    }, 1800)))
                };
            return {
                progress: () => {
                    i = !1, a = "", r = 0, o = 0;
                    const t = l();
                    return u(), t
                },
                startCountdown: e => {
                    i = !0, s(), a = "Get Link timer", l(), t?.startCountdown(e)
                },
                hideCountdown: () => {
                    t?.hideCountdown(), i = !1, a = "", o = 0, l(), u()
                },
                setError: e => {
                    i = !0, s(), t?.hideCountdown(), a = e;
                    const n = l("LiteShort hit a snag.", "Reload this LiteShort link and try again.");
                    return n.setStatus(e), n.setError(e), n
                }
            }
        })(),
        oh = !1,
        rh = async () => {
            if (oh) return;
            oh = !0;
            const t = (() => {
                const t = t => {
                    "LITESHORT_PROGRESS" === t.type && "number" == typeof t.waitEndTs && (t.waitEndTs <= Date.now() || nh.startCountdown(t.waitEndTs))
                };
                return chrome.runtime.onMessage.addListener(t), () => chrome.runtime.onMessage.removeListener(t)
            })();
            try {
                nh.progress();
                const t = await (n = location.href, new Promise((t, e) => {
                    chrome.runtime.sendMessage({
                        type: "LITESHORT_RESOLVE",
                        pageUrl: n
                    }, n => {
                        !chrome.runtime.lastError && n?.ok && n.dest ? t(n.dest) : e(new Error("resolve"))
                    })
                }));
                if (!(await (e = t, new Promise(t => {
                        chrome.runtime.sendMessage({
                            type: "LITESHORT_OPEN_DEST",
                            url: e
                        }, e => {
                            t(!chrome.runtime.lastError && !0 === e)
                        })
                    })))) return oh = !1, void nh.setError("Couldn’t open your LiteShort destination. Reload and try again.");
                D()
            } catch {
                oh = !1, nh.setError("Couldn’t finish this LiteShort link. Reload and try again.")
            } finally {
                t()
            }
            var e, n
        };

    function ih(t) {
        return /href=["'](https?:\/\/[^"']+)["'][^>]*id=["']xxc["']|id=["']xxc["'][^>]*href=["'](https?:\/\/[^"']+)["']/i.exec(t)?.slice(1).find(Boolean) ?? null
    }
    var ah = t => /name=['"]hq['"][^>]*value=['"]([^'"]+)['"]|value=['"]([^'"]+)['"][^>]*name=['"]hq['"]/i.exec(t)?.slice(1).find(Boolean) ?? null,
        sh = (t, e) => fetch(t, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(e)
        }).then(t => t.text());
    async function ch(t) {
        const e = await sh(`${location.origin}/`, {
                hw: t
            }),
            n = (o = e, /action=['"](https?:\/\/[^'"]+)['"]/i.exec(o)?.[1] ?? null);
        var o;
        const r = ah(e);
        return n && r ? (await sh(n, {
            hq: r
        }), ih(await sh(n, {
            hw: r
        }))) : null
    }
    var lh = "CLOVER_LOOT_DONE",
        uh = async t => await t.json(), dh = async () => {
            const t = await fetch("/api/claims/current", {
                cache: "no-store"
            });
            if (404 === t.status) return null;
            if (!t.ok) throw new Error("claim status");
            return uh(t)
        }, mh = async () => {
            if (!(await fetch("/api/claims/current", {
                    method: "DELETE",
                    headers: {
                        "x-cloverhub-claim-action": "1"
                    }
                })).ok) throw new Error("claim reset")
        }, ph = {
            check: {
                lead: "Checking claim",
                detail: "Looking for an active CloverHub key request"
            },
            create: {
                lead: "Creating claim",
                detail: "Starting a LootLabs-backed key request"
            },
            bypass: {
                lead: "Bypassing LootLabs",
                detail: "Confirming the checkpoint and fetching your key"
            },
            reset: {
                lead: "Starting fresh",
                detail: "Your last key was already used"
            },
            switch: {
                lead: "Switching to LootLabs",
                detail: "This provider is not supported for auto-bypass"
            }
        }, hh = {
            lead: "Your key is ready",
            detail: "Copy it below and paste into CloverHub Access."
        }, fh = {
            lead: "Could not generate key",
            detail: "Refresh the page and try again."
        }, wh = swDelay, gh = (t, e) => {
            t.setNote(hh), t.setStatus(""), t.setError(null);
            const n = t.turnstileMount;
            n.replaceChildren();
            const o = document.createElement("code");
            o.textContent = e, o.style.cssText = "display:block;margin-top:4px;padding:14px 16px;border-radius:10px;background:rgba(0,0,0,.35);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.85em;line-height:1.45;color:#e2e8f0;word-break:break-all;user-select:text;-webkit-user-select:text";
            const r = document.createElement("button");
            r.type = "button", r.className = yt.action, r.textContent = "Copy key", r.style.border = "0", r.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(e), r.textContent = "Copied!", window.setTimeout(() => {
                        r.textContent = "Copy key"
                    }, 2e3)
                } catch {
                    r.textContent = "Copy failed", window.setTimeout(() => {
                        r.textContent = "Copy key"
                    }, 2e3)
                }
            }, n.append(o, r), D()
        }, yh = () => {
            chrome.runtime.sendMessage({
                type: "CLOVER_LOOT_SCAN"
            })
        }, kh = async t => {
            await new Promise((t, e) => {
                chrome.runtime.sendMessage({
                    type: "CLOVER_LOOT_PENDING"
                }, n => {
                    chrome.runtime.lastError ? e(new Error("arm")) : t()
                })
            });
            const e = (t => {
                const e = document.createElement("iframe");
                return e.hidden = !0, e.addEventListener("load", yh, {
                    capture: !0
                }), document.documentElement.appendChild(e), e.src = t, e
            })(t);
            try {
                return await (async () => {
                    for (let t = 0; t < 60; t++) {
                        const t = await dh();
                        if ("completed" === t?.status && t.key) return t.key;
                        if ("expired" === t?.status) throw new Error("expired");
                        await wh(1500)
                    }
                    return null
                })()
            } finally {
                e.remove(), chrome.runtime.sendMessage({
                    type: lh
                })
            }
        }, bh = async (t, e, n) => {
            if ("completed" === e?.status && e.key) return e.key;
            let o = 1;
            const r = () => {
                o += 1, t.begin(o, n.length, n[o - 1])
            };
            if ("completed" === e?.status && e.keyAlreadyDelivered && (r(), await mh().catch(() => {}), e = null), "pending" === e?.status && "lootlabs" !== e.provider && (r(), await mh().catch(() => {}), e = null), "pending" !== e?.status || "lootlabs" !== e.provider) {
                r();
                const t = await (async () => {
                    const t = await fetch("/api/claims", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                provider: "lootlabs"
                            })
                        }),
                        e = await uh(t);
                    if (!t.ok) throw new Error(e.error ?? "claim create");
                    return e
                })();
                if ("lootlabs" !== t.provider) throw new Error("provider");
                const e = t.verificationUrl?.trim();
                if (!e) throw new Error("no verification url");
                return r(), kh(e)
            }
            const i = e?.verificationUrl?.trim();
            if (!i) throw new Error("no verification url");
            return r(), kh(i)
        };
    var vh = (t, e) => "/s" === t && e.length > 1,
        Sh = "skip-wait-loot",
        Eh = "INJECT_LOOT_CAPTCHA",
        xh = {
            loading: {
                lead: "Preparing bypass",
                detail: "Connecting to the locker…"
            },
            wait: {
                lead: "Bypassing wait",
                detail: "The timer is counting down automatically — no survey needed."
            },
            captcha: {
                lead: "Bypassing wait",
                detail: "Complete the human check below while the timer runs."
            },
            opening: {
                lead: "Opening your link",
                detail: ""
            }
        },
        Lh = t => "ws timeout" === t || "ws error" === t ? "Unlock timed out. Refresh and try again." : "ws base" === t ? "Still loading locker. Refresh and try again." : t.startsWith("tc ") ? "Could not load tasks. Refresh and try again." : "captcha verify" === t ? "Verification failed. Try the check again." : "dest" === t || "tc empty" === t || "no auto-complete task" === t ? "Unlock failed. Refresh and try again." : "Something went wrong. Refresh and try again.";

    function Ch() {
        if (window === window.top || !/\/captcha(?:\?|$)/i.test(`${location.pathname}${location.search}`)) return;
        const t = () => {
            chrome.runtime.sendMessage({
                type: Eh
            })
        };
        t(), document.addEventListener("DOMContentLoaded", t, {
            once: !0
        }), window.addEventListener("load", t, {
            once: !0
        })
    }
    var Ih = "skipwait-movies-mod-timed-content";
    var Th = /<xmp>\[\s*([\s\S]*?)<\/xmp>/,
        $h = /session_paste\s+([A-Za-z0-9+/=]+)/,
        Ah = t => {
            const e = document.createElement("div");
            e.className = "elementor-element elementor-align-center elementor-widget elementor-widget-button", e.style.cssText = "width:100%;max-width:360px;margin-inline:auto";
            const n = document.createElement("div");
            n.className = "elementor-widget-container";
            const o = document.createElement("div");
            o.className = "elementor-button-wrapper";
            const r = document.createElement("button");
            r.type = "button", r.className = "elementor-button elementor-size-sm", r.disabled = !0;
            const i = document.createElement("span");
            i.className = "elementor-button-content-wrapper";
            const a = document.createElement("span");
            a.className = "elementor-button-icon elementor-align-icon-left", a.append((() => {
                const t = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                t.setAttribute("viewBox", "0 0 24 24"), t.setAttribute("width", "16"), t.setAttribute("height", "16"), t.setAttribute("fill", "none"), t.setAttribute("stroke", "currentColor"), t.setAttribute("stroke-width", "2"), t.setAttribute("stroke-linecap", "round"), t.setAttribute("stroke-linejoin", "round"), t.setAttribute("aria-hidden", "true");
                const e = document.createElementNS("http://www.w3.org/2000/svg", "path");
                e.setAttribute("d", "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2");
                const n = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                return n.setAttribute("width", "8"), n.setAttribute("height", "4"), n.setAttribute("x", "8"), n.setAttribute("y", "2"), n.setAttribute("rx", "1"), t.append(n, e), t
            })());
            const s = document.createElement("span");
            return s.className = "elementor-button-text", s.textContent = t, i.append(a, s), r.append(i), o.append(r), n.append(o), e.append(n), {
                root: e,
                button: r,
                text: s
            }
        },
        qh = (t, e, n) => {
            const o = t.closest("button");
            e && o && (o.disabled = !1, o.onclick = async () => {
                try {
                    await navigator.clipboard.writeText(e), t.textContent = "Copied!", setTimeout(() => {
                        t.textContent = n
                    }, 2e3)
                } catch {
                    t.textContent = "Copy failed"
                }
            })
        },
        _h = !1,
        Mh = !1;

    function Oh() {
        if (_h) return;
        const t = document.querySelector(".elementor-widget-uael-countdown")?.closest(".elementor-widget-wrap");
        if (!t) return;
        _h = !0, document.querySelector(".elementor-widget-uael-countdown")?.closest(".elementor-element")?.remove(), document.querySelector(".elementor-widget-animated-headline")?.closest(".elementor-element")?.remove(), document.querySelectorAll(".elementor-invisible").forEach(t => t.classList.remove("elementor-invisible"));
        const e = document.createElement("div");
        e.id = "skipwait-onhaxpk", e.style.cssText = "width:100%;display:flex;flex-direction:column;align-items:center;text-align:center";
        const n = Ah("Session share"),
            o = Ah("Cookie Editor");
        e.append((() => {
            const t = document.createElement("div");
            t.className = "elementor-element elementor-align-center elementor-widget elementor-widget-heading", t.style.cssText = "width:100%;margin-bottom:8px";
            const e = document.createElement("div");
            e.className = "elementor-widget-container";
            const n = document.createElement("div");
            n.style.cssText = "max-width:520px;margin:0 auto 16px;padding:16px 20px;border-radius:12px;background:#f7f7f8;border:1px solid #dfdee3;text-align:center";
            const o = document.createElement("h4");
            o.className = "elementor-heading-title", o.style.cssText = "margin:0 0 8px;color:#26222f;font-size:20px;font-weight:700", o.textContent = "Countdown bypassed";
            const r = document.createElement("p");
            return r.style.cssText = "margin:0;color:#4c455f;font-size:16px;line-height:1.5", r.textContent = "Skip Wait skipped the wait timer. Copy your cookie data below.", n.append(o, r), e.append(n), t.append(e), t
        })(), n.root, o.root), t.prepend(e);
        const r = t => {
            const e = (t => {
                const e = $h.exec(t),
                    n = Th.exec(t);
                return {
                    session: e?.[1] ? `session_paste ${e[1]}` : null,
                    editor: n?.[1] ? `[${n[1].trim()}]` : null
                }
            })(t);
            qh(n.text, e.session, "Session share"), qh(o.text, e.editor, "Cookie Editor"), Mh || !e.session && !e.editor || (Mh = !0, D())
        };
        r(document.documentElement.innerHTML), n.button.disabled && o.button.disabled && fetch(location.href, {
            cache: "no-store",
            credentials: "same-origin"
        }).then(t => t.text()).then(r).catch(() => {})
    }
    var Rh = "skipwait-onlinetools-bypass",
        Ph = "data-skipwait-hijacked",
        Dh = "#tool-output .side-box",
        Nh = "canvas.data",
        Bh = "canvas.preview",
        Uh = "#tour-copy-clipboard",
        Wh = '.widget[data-bs-target*="downloadModal"]',
        Hh = "#tool-output textarea.data",
        Fh = "#tool-output",
        zh = !1;

    function jh() {
        const t = document.querySelector(Dh);
        return t ? t.querySelector(Nh) ?? t.querySelector(Bh) : null
    }

    function Yh() {
        const t = document.querySelector(Hh);
        return t instanceof HTMLTextAreaElement && t.value.trim() ? t.value : null
    }

    function Gh(t) {
        if (!document.getElementById("skipwait-onlinetools-style")) {
            const t = document.createElement("style");
            t.id = "skipwait-onlinetools-style", t.textContent = "@keyframes skipwait-fadein{from{opacity:0;transform:translateX(-50%) translateY(8px)}to{opacity:1;transform:translateX(-50%) translateY(0)}}", document.head.appendChild(t)
        }
        document.getElementById("skipwait-onlinetools-toast")?.remove();
        const e = document.createElement("div");
        e.id = "skipwait-onlinetools-toast", e.textContent = t, e.style.cssText = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:10px 16px;border-radius:8px;font-family:Poppins;font-size:14px;z-index:999999;box-shadow:0 4px 12px rgba(0,0,0,.3);animation:skipwait-fadein .2s ease;", document.body.appendChild(e), setTimeout(() => e.remove(), 2200)
    }

    function Vh(t, e, n = !1) {
        const o = document.createElement("a");
        o.download = t, o.href = e, o.style.display = "none", document.body.appendChild(o), o.click(), o.remove(), n && URL.revokeObjectURL(e)
    }

    function Zh(t, e) {
        t.hasAttribute(Ph) || (t.setAttribute(Ph, "1"), t.removeAttribute("data-bs-target"), t.removeAttribute("data-bs-toggle"), t.addEventListener("click", t => {
            t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), e()
        }, !0))
    }

    function Jh() {
        const t = document.querySelector(Fh),
            e = document.querySelector(Uh),
            n = t?.querySelector(Wh);
        if (!t || !e) return;
        const o = window.location.host,
            r = /^local/.test(o) ? o.split(".")[1] : o.split(".")[0];
        Zh(e, () => {
                const t = jh();
                if (t?.width) return void t.toBlob(t => {
                    t && navigator.clipboard.write([new ClipboardItem({
                        "image/png": t
                    })]).then(() => Gh("Copied to clipboard"), () => Gh("Copy failed"))
                }, "image/png");
                const e = Yh();
                e ? navigator.clipboard.writeText(e).then(() => Gh("Copied to clipboard"), () => Gh("Copy failed")) : Gh("No output to copy")
            }), n && Zh(n, () => {
                const t = jh();
                if (t?.width) return Vh(`output-${r}.png`, t.toDataURL("image/png")), void Gh("Download started");
                const e = Yh();
                if (e) {
                    const t = URL.createObjectURL(new Blob([e], {
                        type: "application/octet-stream"
                    }));
                    return Vh(`output-${r}${function(){const t=window.location.pathname.toLowerCase();return t.includes("json")?".json":t.includes("csv")?".csv":".txt"}()}`, t, !0), void Gh("Download started")
                }
                Gh("No output to download")
            }),
            function() {
                document.getElementById(Rh)?.remove(), document.querySelector(`#tool-output #${Rh}`)?.remove();
                const t = document.querySelector(".sides-wrapper");
                if (!t) return;
                const e = document.createElement("div");
                e.id = Rh, e.className = "row pt-3";
                const n = document.createElement("div");
                n.className = "col-12";
                const o = document.createElement("div");
                o.className = "alert border border-secondary rounded mb-0", o.innerHTML = '<div class="d-flex flex-row"><div class="d-flex flex-column justify-content-center align-items-center"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-check-circle text-primary" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.08 1.037l2.5 2.5a.75.75 0 0 0 1.079-.02l4-5.5a.75.75 0 0 0-1.196-.92"/></svg></div><div class="ps-3"><div class="text-primary fw-bold">Wait timer bypassed</div><small>Skip Wait skipped the download wait timer. Copy and download are instant.</small></div></div>', n.append(o), e.append(n), t.after(e)
            }(), zh || (zh = !0, D())
    }

    function Xh(t = location.pathname) {
        return /^\/st\/?$/i.test(t)
    }
    var Kh = "skip-wait-ontops-overlay",
        Qh = "skip-wait-ontops-boot",
        tf = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to wait on this hop."
        },
        ef = null,
        nf = !1;

    function of() {
        const t = kt(Kh);
        if (document.documentElement.classList.add(t), document.getElementById(Qh)) return;
        const e = document.createElement("style");
        e.id = Qh, e.textContent = Lt(Kh, t), (document.head || document.documentElement).appendChild(e)
    }

    function rf(t = "Getting things ready…") {
        return of(), ef ? (ef.setNote(tf), ef.setStatus(t), ef.setError(null), ef) : ef = $t({
            id: Kh,
            brand: "Skip Wait",
            note: tf,
            status: t
        })
    }

    function af() {
        const t = rf("Unlocking your link…"),
            e = function(t = location.href) {
                try {
                    const e = new URL(t).searchParams.get("url")?.trim();
                    if (!e || e.toLowerCase().startsWith("javascript:")) return null;
                    const n = new URL(e);
                    return /^https?:$/i.test(n.protocol) ? n.href : null
                } catch {
                    return null
                }
            }();
        e ? (t.setStatus("Opening your link…"), D(), location.replace(e)) : t.setError("Ontops destination not found on this link.")
    }

    function sf() {
        !nf && Xh() && (nf = !0, af())
    }
    var cf = () => {
            try {
                document.cookie = "ab=1; path=/"
            } catch {}
            try {
                const t = window;
                t.blurred = !1, t.onblur = null, t.onfocus = null
            } catch {}
            try {
                const t = window.app_vars;
                t && (t.force_disable_adblock = "0")
            } catch {}
        },
        lf = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        uf = "skip-wait-shrinkearn-mediator",
        df = ["go_d2", "getmylink", "nextpage"],
        mf = ["token", "alias", "c_d", "c_t", "url"],
        pf = {
            lead: "Skipping the wait pages.",
            detail: "You don't need to tap anything on the page."
        },
        hf = null,
        ff = !1,
        wf = () => {
            if (ff || /taboola\.com/i.test(location.href)) return;
            const t = (() => {
                for (const t of df) {
                    const e = document.querySelector(`form#${t}`);
                    if (e && mf.every(t => e.querySelector(`input[name="${t}"]`)?.value?.trim())) return e
                }
                return null
            })();
            t && (ff = !0, (t => {
                const e = kt(uf);
                document.documentElement.classList.add(e);
                const n = `${uf}-boot`;
                if (!document.getElementById(n)) {
                    const t = document.createElement("style");
                    t.id = n, t.textContent = Lt(uf, e), (document.head || document.documentElement).appendChild(t)
                }
                hf ? hf.setStatus(t) : hf = $t({
                    id: uf,
                    brand: "Skip Wait",
                    note: pf,
                    status: t
                })
            })("Skipping wait pages…"), (t => {
                cf(), lf(), t.style.setProperty("display", "block", "important");
                const e = t.querySelector('#getnewlink, button[type="submit"], input[type="submit"]');
                if (e) return e.removeAttribute("disabled"), void e.click();
                t.submit()
            })(t))
        },
        gf = "skip-wait-shrinkearn",
        yf = "captchaShortlink",
        kf = "Couldn’t finish this link. Reload and try again.",
        bf = 15e3,
        vf = /^(?=.*[A-Za-z])[A-Za-z0-9]{3,}$/,
        Sf = yt,
        Ef = vt(gf) + St(gf) + Et(gf) + xt(gf),
        xf = null,
        Lf = null,
        Cf = null,
        If = null,
        Tf = null,
        $f = null,
        Af = !1,
        qf = 0,
        _f = () => {
            if (xf?.isConnected) return;
            document.documentElement.classList.add(kt(gf)), (xf = document.createElement("div")).id = gf;
            const t = document.createElement("style");
            t.textContent = Ef, xf.appendChild(t);
            const e = document.createElement("div");
            e.className = Sf.card;
            const n = document.createElement("div");
            n.className = Sf.brand, n.textContent = "Skip Wait", (If = document.createElement("div")).className = Sf.note, (Cf = document.createElement("div")).className = Sf.status, (Tf = document.createElement("div")).className = `${Sf.count} ${Sf.hidden}`, ($f = document.createElement("div")).className = `${Sf.countLabel} ${Sf.hidden}`, $f.textContent = "Your link opens in", (Lf = document.createElement("div")).className = Sf.turnstile, e.append(n, If, Cf, Tf, $f, Lf), xf.appendChild(e), document.documentElement.appendChild(xf)
        },
        Mf = t => {
            if (!If) return;
            If.replaceChildren();
            const e = document.createElement("div");
            if (e.className = Sf.noteLead, e.textContent = t.lead, If.appendChild(e), t.detail) {
                const e = document.createElement("div");
                e.className = Sf.noteDetail, e.textContent = t.detail, If.appendChild(e)
            }
        },
        Of = () => {
            if (Af) return;
            Af = !0;
            const t = document.createElement("style");
            t.id = `${gf}-lock`, t.textContent = bt(gf, kt(gf)), document.head.appendChild(t)
        },
        Rf = () => {
            cancelAnimationFrame(qf), qf = 0
        },
        Pf = () => (_f(), Lf),
        Df = (t, e) => {
            _f(), Mf(t), Cf.textContent = e
        },
        Nf = (t, e) => {
            _f(), Of(), Mf(t), Cf.textContent = e
        },
        Bf = t => {
            _f(), Of(), Tf.classList.remove(Sf.hidden), $f.classList.remove(Sf.hidden), Rf();
            const e = () => {
                const n = t - Date.now();
                Tf.textContent = `${(Math.max(0,n)/1e3).toFixed(2)} s`, qf = n <= 0 ? 0 : requestAnimationFrame(e)
            };
            e()
        },
        Uf = () => {
            Rf(), Tf?.classList.add(Sf.hidden), $f?.classList.add(Sf.hidden)
        },
        Wf = t => {
            _f(), Of(), Rf(), Mf({
                lead: "Something went wrong.",
                detail: t
            }), Cf.textContent = ""
        },
        Hf = /advertisingcamps\.com/i,
        Ff = () => document.querySelector(`#${yf} [name="cf-turnstile-response"]`),
        zf = () => document.querySelector("#link-view .btn-captcha"),
        jf = () => {
            const t = (() => {
                    for (const t of document.querySelectorAll("form")) {
                        const e = t.getAttribute("action") ?? t.action;
                        if (e && Hf.test(e) && t.querySelector('input[name="token"], input[name="alias"]')) return t
                    }
                    return null
                })(),
                e = Ff();
            t && e && (t.id || (t.id = "skip-wait-shrinkearn-camps"), e.getAttribute("form") !== t.id && e.setAttribute("form", t.id))
        },
        Yf = () => !!document.querySelector('input[name="ad_form_data"]'),
        Gf = () => {
            Ae();
            const t = document.querySelector("#btn-getlink, #btn-wait, #btn-unlock");
            t && !t.dataset.swClicked && (t.dataset.swClicked = "1", t.click())
        },
        Vf = t => {
            const e = document.getElementById(yf);
            e && !t.contains(e) && (t.appendChild(e), jf());
            const n = (() => {
                for (const t of document.querySelectorAll(".notranslate")) {
                    const e = t.querySelector("iframe");
                    if (e && e.offsetWidth * e.offsetHeight > 0) return t
                }
                return null
            })();
            if (!n) return !1;
            if (!t.contains(n)) {
                t.appendChild(n), n.style.width = "100%", n.style.maxWidth = "300px", n.style.height = "70px", n.style.overflow = "hidden", n.style.margin = "0 auto";
                const e = n.querySelector("iframe");
                e instanceof HTMLElement && (e.style.width = "300px", e.style.height = "70px")
            }
            return jf(), !0
        },
        Zf = () => {
            if ((Ff()?.value?.trim() ?? "").length < 500) return !1;
            const t = zf();
            return !!t && !t.disabled && !t.hasAttribute("disabled")
        },
        Jf = {
            lead: "Confirm you’re human.",
            detail: "Complete the check below. Skip Wait continues when you’re done."
        },
        Xf = {
            lead: "Unlocking your link.",
            detail: "Skip Wait is finishing the Get Link step for you. You don't need to tap anything."
        },
        Kf = {
            lead: "Skipping the wait pages.",
            detail: "You don't need to tap anything on the page."
        },
        Qf = swDelay,
        tw = null,
        ew = !1,
        nw = !1,
        ow = 0,
        rw = () => {
            tw?.disconnect(), tw = null
        },
        iw = () => {
            if (ew) return;
            ew = !0, rw();
            const t = () => {
                if (!ew) return;
                const t = Vf(Pf());
                Df(Jf, t ? "Complete the check below." : "Loading check…"), Zf() && (window.clearInterval(ow), ow = 0, ew = !1, Nf(Kf, "Continuing"), (() => {
                    jf();
                    const t = zf();
                    Zf() && t && (t.disabled = !1, t.removeAttribute("disabled"), t.click())
                })())
            };
            t(), ow = window.setInterval(t, 200)
        },
        aw = (t, e) => {
            Nf(Xf, e), D(), location.replace(t)
        },
        sw = async () => {
            if (nw || !Yf()) return;
            if (nw = !0, rw(), lf(), cf(), Nf(Xf, "Getting things ready"), await (async () => {
                    Gf(), Nf(Xf, "Waiting for the short timer…"), Bf(Date.now() + bf), await Qf(bf), Uf()
                })(), !Yf()) return void(nw = !1);
            Gf();
            const t = document.querySelector("a.get-link, #gt-link");
            if (t?.href && /^https?:\/\//i.test(t.href)) return void aw(t.href, "Opening your destination");
            const e = Te(document.documentElement.innerHTML, location.href);
            if (!e) return Wf(kf), void(nw = !1);
            Nf(Xf, "Getting your destination");
            let n = await $e(e, location.href);
            for (let o = 0; null === n && o < 20; o++) Gf(), await Qf(200), n = await $e(e, location.href);
            if (!n) {
                const t = 17e3;
                Nf(Xf, "Waiting for the short timer…"), Bf(Date.now() + t);
                const o = Date.now() + t;
                for (; !n && Date.now() < o && (Gf(), n = await $e(e, location.href), !n);) await Qf(200);
                Uf()
            }
            if (!n) return Wf(kf), void(nw = !1);
            aw(n, "Opening your destination")
        }, cw = () => {
            Yf() ? sw() : document.getElementById("captchaShortlink") && !Yf() && iw()
        }, lw = () => {
            const t = document.querySelector("#form-captcha");
            if (!t) return null;
            const e = t.getAttribute("action") || t.action || "";
            return /\/go\//i.test(e) ? t : null
        }, uw = () => {
            const t = document.querySelector("#form-go");
            if (!t) return null;
            const e = t.getAttribute("action") || t.action || "";
            return /xreallcygo/i.test(e) ? t : null
        }, dw = "skip-wait-ouo-overlay", mw = "skip-wait-ouo-boot", pw = "data-skip-wait-submitted", hw = "Opening your link…", fw = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        }, ww = null, gw = !1, yw = !1, kw = () => {
            const t = kt(dw);
            if (document.documentElement.classList.add(t), document.getElementById(mw)) return;
            const e = document.createElement("style");
            e.id = mw, e.textContent = Lt(dw, t), (document.head || document.documentElement).appendChild(e)
        }, bw = () => (kw(), ww ? (ww.setStatus(hw), ww.setError(null), ww) : ww = $t({
            id: dw,
            brand: "Skip Wait",
            note: fw,
            status: hw,
            countdownLabel: "Your link opens in"
        })), vw = t => {
            "1" !== t.getAttribute(pw) && (t.setAttribute(pw, "1"), (() => {
                const t = window.setTimeout(() => {}, 0);
                for (let e = 0; e <= t; e++) window.clearTimeout(e), window.clearInterval(e)
            })(), HTMLFormElement.prototype.submit.call(t))
        }, Sw = () => {
            if (yw) return;
            const t = uw();
            t && (yw = !0, bw(), (() => {
                const t = document.getElementById("timer");
                t && (t.textContent = "0");
                const e = document.getElementById("countdown");
                e && (e.className = "countdown end");
                const n = document.getElementById("btn-main");
                n && (n.className = "btn btn-main")
            })(), D(), vw(t))
        }, Ew = () => {
            if (Boolean(uw())) return kw(), void Sw();
            Boolean(lw()) && (kw(), (() => {
                if (gw) return;
                const t = lw();
                t && (gw = !0, bw(), vw(t))
            })())
        };
    var xw = "skip-wait-olamovies-landing-overlay",
        Lw = "skip-wait-olamovies-landing-boot",
        Cw = {
            lead: "Opening the main site.",
            detail: "Skip Wait is taking you to the live OlaMovies catalog."
        },
        Iw = null;

    function Tw() {
        const t = kt(xw);
        if (document.documentElement.classList.add(t), document.getElementById(Lw)) return;
        const e = document.createElement("style");
        e.id = Lw, e.textContent = Lt(xw, t), (document.head || document.documentElement).appendChild(e)
    }

    function $w(t) {
        return Tw(), Iw ? (Iw.setNote(Cw), Iw.setStatus(t), Iw.setError(null), Iw) : Iw = $t({
            id: xw,
            brand: "Skip Wait",
            note: Cw,
            status: t
        })
    }
    async function Aw() {
        const t = $w("Resolving main site…"),
            e = await async function() {
                const t = await fetch(`${location.origin}/current.php`, {
                    cache: "no-store",
                    credentials: "same-origin"
                });
                if (!t.ok) throw new Error("olamovies current.php");
                const e = (await t.text()).trim();
                if (!/^https?:\/\//i.test(e)) throw new Error("olamovies current.php body");
                const n = new URL(e),
                    o = new URLSearchParams(location.search).get("s");
                return o && n.searchParams.set("s", o), n.href
            }();
        t.setStatus("Opening destination…"), D(), location.replace(e)
    }
    var qw = "skip-wait-olamovies-link-banner",
        _w = "sw-om-link-lock",
        Mw = "sw-om-link-lock-cta",
        Ow = swDelay;

    function Rw(t, e) {
        const n = function() {
                const t = navigator,
                    e = screen;
                let n = null,
                    o = null;
                try {
                    const t = document.createElement("canvas");
                    t.width = 200, t.height = 50;
                    const e = t.getContext("2d");
                    if (e) {
                        e.textBaseline = "top", e.font = "14px 'Arial'", e.fillStyle = "#f60", e.fillRect(0, 0, 200, 50), e.fillStyle = "#069", e.fillText("OmLinks captcha 👾", 2, 2), e.strokeStyle = "rgba(102, 200, 0, 0.7)", e.beginPath(), e.arc(50, 25, 18, 0, 2 * Math.PI), e.stroke();
                        const o = t.toDataURL();
                        let r = 14695981039346656037n;
                        for (let t = 0; t < o.length; t++) r ^= BigInt(o.charCodeAt(t)), r = 1099511628211n * r & 18446744073709551615n;
                        n = r.toString(16).padStart(16, "0")
                    }
                } catch {}
                try {
                    const t = document.createElement("canvas"),
                        e = t.getContext("webgl") || t.getContext("experimental-webgl"),
                        n = e && e.getExtension("WEBGL_debug_renderer_info");
                    e && n && (o = {
                        vendor: e.getParameter(n.UNMASKED_VENDOR_WEBGL) || "",
                        renderer: e.getParameter(n.UNMASKED_RENDERER_WEBGL) || ""
                    })
                } catch {}
                return {
                    ua: t.userAgent || "",
                    webdriver: !!t.webdriver,
                    hc: t.hardwareConcurrency ?? 0,
                    dm: t.deviceMemory ?? 0,
                    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "",
                    tzOffset: (new Date).getTimezoneOffset(),
                    lang: t.language || "",
                    langs: [...t.languages || []].slice(0, 5),
                    platform: t.platform || "",
                    touch: t.maxTouchPoints ?? 0,
                    screen: {
                        w: e.width || 0,
                        h: e.height || 0,
                        dpr: devicePixelRatio || 1
                    },
                    plugins: t.plugins?.length ?? 0,
                    cookieEnabled: !!t.cookieEnabled,
                    canvas: n,
                    webgl: o
                }
            }(),
            o = "hold" === t;
        return {
            fingerprint: n,
            trajectory: o ? [
                [0, 512, 611],
                [1820, 0, 0]
            ] : [
                [0, 0, 40],
                [900, Math.round(300 * e), 40]
            ],
            pointerType: "mouse",
            buttons: 1,
            pressureSamples: [],
            pointerDownCount: 1,
            pointerUpCount: 1,
            inputEventCount: o ? 0 : 2,
            startT: o ? 650 : 400,
            endT: o ? 2470 : 1300,
            keyEvents: [],
            visibilityChanges: [],
            focusEvents: 1,
            blurEvents: 0,
            mountToDragStartMs: o ? 650 : 400,
            submitLatencyMs: o ? 8 : 10
        }
    }
    async function Pw(t, e) {
        const n = await fetch(t, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "same-origin",
                cache: "no-store",
                body: JSON.stringify(e)
            }),
            o = await n.json().catch(() => null);
        if (!n.ok || !o) throw new Error(`olamovies ${t}`);
        return o
    }
    async function Dw(t, e) {
        const n = await fetch("/api/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(e ? {
                id: t,
                vt: e
            } : {
                id: t
            })
        });
        return {
            status: n.status,
            body: await n.json().catch(() => ({}))
        }
    }

    function Nw() {
        document.documentElement.classList.add(Mw);
        for (const t of document.querySelectorAll(".visit-btn")) t.setAttribute("aria-disabled", "true"), t.setAttribute("tabindex", "-1"), t instanceof HTMLButtonElement && (t.disabled = !0)
    }

    function Bw() {
        let t = document.getElementById(qw);
        if (!document.getElementById(`${qw}-css`)) {
            const t = document.createElement("style");
            t.id = `${qw}-css`, t.textContent = `html.${_w} .cc-card,html.${_w} .cc-hold-target,html.${_w} [data-cc],html.${_w} [role="slider"][data-cc-d]{pointer-events:none!important;opacity:.38!important;filter:grayscale(.35);user-select:none!important;cursor:not-allowed!important}html.${Mw} .visit-btn{pointer-events:none!important;opacity:.38!important;filter:grayscale(.35);user-select:none!important;cursor:not-allowed!important;box-shadow:none!important}#${qw}{display:flex;gap:12px;align-items:flex-start;box-sizing:border-box;width:100%;margin:0 0 24px;padding:14px 16px;text-align:left;border-radius:14px;border:1px solid var(--om-border,rgba(255,255,255,.12));background:var(--om-bg-card,rgba(255,255,255,.04));color:var(--om-text,#e8eaed);font:inherit;position:relative;z-index:5}#${qw} .m{flex:0 0 auto;width:34px;height:34px;border-radius:10px;display:grid;place-items:center;background:color-mix(in srgb,var(--om-accent,#6ea8fe) 18%,transparent);color:var(--om-accent,#6ea8fe)}#${qw}[data-phase=busy] .m svg{animation:sw-spin .85s linear infinite}#${qw} .b{min-width:0;flex:1}#${qw} .k{margin:0 0 4px;font:700 12px/1.2 inherit;letter-spacing:.04em;text-transform:uppercase;color:var(--om-accent,#6ea8fe)}#${qw} .s{margin:0;font:650 14.5px/1.35 inherit;letter-spacing:-.01em}#${qw} .d{margin:5px 0 0;font:12.5px/1.45 inherit;color:var(--om-text-subtle,var(--om-text-muted,rgba(232,234,237,.68)));word-break:break-word}#${qw} .d a.go{display:inline-block;margin-top:2px;color:var(--om-accent,#6ea8fe);font-weight:650;text-decoration:underline;text-underline-offset:3px;word-break:break-all}#${qw} .bar{margin-top:10px;height:3px;border-radius:99px;background:color-mix(in srgb,var(--om-border,rgba(255,255,255,.12)) 80%,transparent);overflow:hidden}#${qw} .bar>i{display:block;height:100%;width:var(--sw-p,8%);border-radius:inherit;background:var(--om-accent,#6ea8fe);transition:width .35s ease}#${qw}[data-phase=err]{border-color:color-mix(in srgb,#f87171 40%,var(--om-border,transparent))}#${qw}[data-phase=err] .m,#${qw}[data-phase=err] .k{color:#f87171;background:rgba(248,113,113,.1)}#${qw}[data-phase=err] .bar>i{background:#f87171}#${qw}[data-phase=ok] .m,#${qw}[data-phase=ok] .k{color:#34d399;background:rgba(52,211,153,.12)}#${qw}[data-phase=ok] .bar>i{background:#34d399}#${qw}[data-phase=ok] .bar{opacity:.55}@keyframes sw-spin{to{transform:rotate(360deg)}}@media(max-width:520px){#${qw}{margin-bottom:20px;padding:12px 14px;gap:10px;border-radius:12px}#${qw} .m{width:30px;height:30px;border-radius:9px}#${qw} .s{font-size:14px}}`, (document.head || document.documentElement).append(t)
        }
        t || (t = document.createElement("aside"), t.id = qw, t.setAttribute("role", "status"), t.setAttribute("aria-live", "polite"), t.innerHTML = '<div class="m" aria-hidden="true"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg></div><div class="b"><p class="k">Skip Wait</p><p class="s"></p><p class="d"></p><div class="bar" aria-hidden="true"><i></i></div></div>');
        const e = t.querySelector(".m"),
            n = t.querySelector(".s"),
            o = t.querySelector(".d"),
            r = t.querySelector(".bar > i"),
            i = () => {
                ! function() {
                    document.documentElement.classList.add(_w);
                    for (const t of document.querySelectorAll('.cc-card, .cc-hold-target, .cc-hold-core, [data-cc], [role="slider"][data-cc-d]')) t.setAttribute("aria-disabled", "true"), t.setAttribute("tabindex", "-1")
                }(), document.documentElement.classList.contains(Mw) && Nw();
                const e = document.querySelector("main .relative.z-2");
                if (!e) return;
                const n = [...e.children].find(t => t.querySelector(".cc-card")),
                    o = e.querySelector(":scope > h1");
                n ? t.nextElementSibling !== n && n.before(t) : o ? t.previousElementSibling !== o && o.after(t) : t.parentElement !== e && e.prepend(t)
            };
        return i(), new MutationObserver(i).observe(document.documentElement, {
            childList: !0,
            subtree: !0
        }), (a, s, c = "busy", l = 12, u) => {
            if (i(), n.textContent = a, t.dataset.phase = c, r.style.setProperty("--sw-p", `${Math.max(4,Math.min(100,l))}%`), e.innerHTML = "busy" === c ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>', o.replaceChildren(), u) {
                const t = document.createElement("a");
                t.className = "go", t.href = u, t.target = "_blank", t.rel = "noopener noreferrer", t.textContent = u.replace(/^https?:\/\//, ""), o.append(t)
            } else o.textContent = s
        }
    }

    function Uw(t, e) {
        Nw(), t("Your link is ready", "Tap the link below to continue.", "ok", 100, e), D()
    }
    async function Ww(t) {
        const e = function() {
            const t = location.pathname.replace(/^\/+|\/+$/g, "");
            return !t || t.includes("/") || t.startsWith("api") || t.startsWith("_next") ? null : t
        }();
        if (!e) return void t("Nothing to unlock here", "Open a movie download link from OlaMovies first.", "err", 100);
        t("Checking if you’re signed in…", "Skip Wait only works after you log in on this page.", "busy", 18);
        const n = await Dw(e);
        if (401 === n.status || "Unauthorized" === n.body.error) return void t("Please sign in first", "Tap Login to Continue below, finish sign-in, then come back to this page.", "err", 100);
        if (Nw(), n.body.isFound && n.body.shortener) return void Uw(t, n.body.shortener);
        if (n.body.error && "captcha_required" !== n.body.error) return void t("Couldn’t create your link", "Something went wrong. Refresh and try again.", "err", 100);
        const o = await async function(t) {
            t("Preparing security check…", "Skip Wait is getting a fresh check from the site.", 32);
            const e = await Pw("/api/captcha/challenge", {});
            if (!e.ct) throw new Error("olamovies captcha challenge");
            const n = e.kind || "hold";
            for (let i = 1; i <= 4; i++) t("hold" === n ? "Skipping hold check…" : "Skipping slide check…", "Almost there — finishing the human check for you.", 32 + 6 * i), await Ow(500);
            t("Confirming you’re verified…", "Skip Wait is unlocking the download button path.", 58);
            const o = e.targetPos ?? .5,
                r = await Pw("/api/captcha/verify", {
                    ct: e.ct,
                    signals: Rw(n, o),
                    finalPos: "hold" === n ? 0 : o,
                    honeypot: ""
                });
            if (!r.ok || !r.vt) throw new Error("olamovies captcha verify");
            return r.vt
        }((e, n, o) => t(e, n, "busy", o));
        t("Creating your download link…", "Skip Wait is fetching the shortener destination.", "busy", 78);
        const r = await Dw(e, o);
        r.body.isFound && r.body.shortener ? Uw(t, r.body.shortener) : t("Couldn’t create your link", "Refresh the page and try again in a moment.", "err", 100)
    }
    var Hw = /^https?:\/\//i,
        Fw = /http-equiv\s*=\s*["']?refresh["']?[^>]*content\s*=\s*["']([^"']+)["']/i,
        zw = /content\s*=\s*["']([^"']+)["'][^>]*http-equiv\s*=\s*["']?refresh/i,
        jw = async t => (t => btoa(String.fromCharCode(...new Uint8Array(t))))(await new Response(new Blob([t]).stream().pipeThrough(new CompressionStream("deflate"))).arrayBuffer()), Yw = (t, e) => {
            const n = t.match(Fw)?.[1] ?? t.match(zw)?.[1];
            return n ? ((t, e) => {
                const n = /url\s*=\s*(.+)/i.exec(t)?.[1]?.trim().replace(/^['"]|['"]$/g, "");
                if (!n) return null;
                try {
                    const t = new URL(n, e).href;
                    return Hw.test(t) ? t : null
                } catch {
                    return null
                }
            })(n, e) : null
        };
    async function Gw(t) {
        const e = `pepe-${[...crypto.getRandomValues(new Uint8Array(6))].map(t=>t.toString(16).padStart(2,"0")).join("")}`;
        document.cookie = `${e}=${await jw(t)};path=/;max-age=3600;samesite=lax`;
        const n = `${location.origin}/?go=${encodeURIComponent(e)}`,
            o = await fetch(n, {
                credentials: "include",
                cache: "no-store",
                redirect: "follow"
            });
        if (!o.ok) throw new Error(`decrypt ${o.status}`);
        const r = Yw(await o.text(), o.url || n);
        if (!r) throw new Error("decrypt empty");
        return r
    }
    var Vw = "skip-wait-sid-mediator-overlay",
        Zw = "skip-wait-sid-mediator-boot",
        Jw = {
            lead: "Hang tight — decoding your link.",
            detail: "Skip Wait is decrypting the destination for you."
        },
        Xw = {
            lead: "Destination unlocked.",
            detail: "Opening your link now — no timers or continue taps."
        },
        Kw = null,
        Qw = (t, e = Jw) => ((() => {
            const t = kt(Vw);
            if (document.documentElement.classList.add(t), document.getElementById(Zw)) return;
            const e = document.createElement("style");
            e.id = Zw, e.textContent = Lt(Vw, t), (document.head || document.documentElement).appendChild(e)
        })(), Kw ? (Kw.setNote(e), Kw.setStatus(t), Kw.setError(null), Kw) : Kw = $t({
            id: Vw,
            brand: "Skip Wait",
            note: e,
            status: t
        })),
        tg = !1;
    var eg = "skipwait-romsfun-bypass";

    function ng() {
        return document.getElementById("download-container")
    }

    function og(t, e) {
        let n = document.getElementById(eg);
        if (!n) {
            n = document.createElement("div"), n.id = eg, n.className = "help-block flex items-center justify-center px-4 py-3 bg-romfun-pink/10 mb-4 rounded-lg";
            const e = document.createElement("span");
            e.className = "text-sm text-romfun-pink flex items-center font-semibold", n.append(e), t.before(n)
        }
        const o = n.querySelector("span");
        o && (o.textContent = e)
    }
    async function rg() {
        const t = ng();
        if (!t) return;
        og(t, "Skip Wait skipped the wait timer. Preparing your download…"), document.getElementById("download-loading")?.classList.add("hidden");
        const e = t.getAttribute("data-ajax-url") || `${location.origin}/wp-admin/admin-ajax.php`;
        try {
            const t = await fetch(e, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: new URLSearchParams({
                    action: "k_get_download"
                })
            });
            if (!t.ok) throw new Error("ajax");
            const n = await t.json();
            if (n.success && n.data?.html && function(t) {
                    const e = ng();
                    return !!e && (e.innerHTML = t, og(e, "Skip Wait skipped the wait timer. Your download is ready."), !0)
                }(n.data.html)) return void D()
        } catch {}(function() {
            const t = document.getElementById("download-button");
            return !!t && (t.classList.remove("hidden"), document.getElementById("download-loading")?.classList.add("hidden"), !0)
        })() && (D(), og(t, "Skip Wait skipped the wait timer. Your download is ready."))
    }
    var ig = /^\/([A-Za-z0-9_-]+)\/?$/i;
    var ag = "skip-wait-shortxlinks-unlock",
        sg = "skip-wait-shortxlinks-unlock-boot",
        cg = "sw-shortx-issued",
        lg = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        ug = null,
        dg = !1,
        mg = () => {
            chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {})
        },
        pg = t => {
            const e = kt(ag);
            if (document.documentElement.classList.add(e), !document.getElementById(sg)) {
                const t = document.createElement("style");
                t.id = sg, t.textContent = Lt(ag, e), (document.head || document.documentElement).appendChild(t)
            }
            return ug ? (ug.setStatus(t), ug.setError(null), ug) : ug = $t({
                id: ag,
                brand: "Skip Wait",
                note: lg,
                status: t,
                countdownLabel: "Your link opens in"
            })
        },
        hg = () => {
            return document.title.includes("Too Early") && (t = location.pathname, !!ig.exec(t)?.[1]) && location.search.length > 1;
            var t
        },
        fg = async (t, e, n) => {
            (() => {
                try {
                    document.cookie = "ab=1; path=/"
                } catch {}
                try {
                    const t = window;
                    t.blurred = !1, t.onblur = null, t.onfocus = null
                } catch {}
                try {
                    const t = window.app_vars;
                    t && (t.force_disable_adblock = "0")
                } catch {}
            })(), n.setStatus("Unlocking your link…");
            const o = Te(t, e),
                r = o ? await $e(o, e) : null;
            if (!r) return n.setError("Couldn’t unlock this link. Reload and try again."), void(dg = !1);
            n.setStatus("Opening your link…"), D(), location.replace(r)
        }, wg = async () => {
            if (dg) return;
            if (document.querySelector('#go-link input[name="ad_form_data"]')) return dg = !0, mg(), void(await fg(document.documentElement.innerHTML, location.href, pg("Unlocking your link…")));
            if (!hg()) return;
            dg = !0, mg();
            const t = pg("Waiting for timer…"),
                e = location.href.split("#")[0] ?? location.href,
                n = (() => {
                    const t = Number(sessionStorage.getItem(cg));
                    if (Number.isFinite(t) && t > 0) return t;
                    const e = Date.now();
                    return sessionStorage.setItem(cg, String(e)), e
                })() + 29e3,
                o = n - Date.now();
            var r;
            o > 0 && (t.startCountdown(n), await (r = o, new Promise(t => setTimeout(t, r))), t.hideCountdown());
            const i = await (await fetch(e, {
                credentials: "include",
                cache: "no-store"
            })).text();
            if (i.includes("Too Early")) return t.setError("Still locked. Open the short link again."), void(dg = !1);
            await fg(i, e, t)
        };
    var gg = /^(?=.*[A-Za-z])[A-Za-z0-9]{3,}$/,
        yg = () => (t => {
            try {
                const e = new URL(t);
                if (!/^https?:\/\//i.test(e.href)) return !1;
                const [n, ...o] = e.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return !!n && 0 === o.length && gg.test(n)
            } catch {
                return !1
            }
        })(location.href),
        kg = "skip-wait-shrinkpe",
        bg = t => t.replace(/\.+$/, ""),
        vg = (() => {
            let t = null,
                e = null,
                n = 0,
                o = "",
                r = "Hang tight — unlocking your link.",
                i = "You don't need to tap anything on the page.",
                a = !1;
            const s = () => {
                    null != e && (clearInterval(e), e = null)
                },
                c = () => `${o}${".".repeat(n+1)}`,
                l = () => {
                    t?.setNote({
                        lead: r,
                        detail: i
                    })
                },
                u = () => {
                    t && !a && (n = (n + 1) % 3, t.setStatus(c()))
                },
                d = () => (document.documentElement.classList.add(kt(kg)), t || (t = $t({
                    id: kg,
                    brand: "Skip Wait",
                    note: {
                        lead: r,
                        detail: i
                    },
                    status: c(),
                    countdownLabel: "Get Link ready in"
                }), t));
            return {
                progress: s => (a = !1, t?.hideCountdown(), o = bg(s.status), r = s.lead, i = s.detail, d(), n = 0, t && !a && (l(), t.setStatus(c()), null == e && (e = window.setInterval(u, 450))), t),
                waitCountdown: (t, e) => {
                    a = !0, s(), o = bg(t.status), r = t.lead, i = t.detail;
                    const n = d();
                    return l(), n.setStatus(o), n.startCountdown(Date.now() + 1e3 * e), n
                },
                finishWait: () => {
                    a = !1, t?.hideCountdown()
                },
                setError: e => {
                    a = !1, s(), t?.hideCountdown(), o = e, r = "Something went wrong.", i = "Reload the short link and try again.";
                    const n = d();
                    return n.setStatus(e), n.setNote({
                        lead: r,
                        detail: i
                    }), n.setError(e), n
                }
            }
        })(),
        Sg = !1,
        Eg = async () => {
            if (Sg || !(() => {
                    const t = document.documentElement.innerHTML;
                    return t.includes("ad_form_data") || t.includes('name="token"') && t.includes('name="alias"') && t.includes('name="visit_token"')
                })()) return;
            Sg = !0;
            const t = location.href;
            vg.progress({
                lead: "Hang tight — unlocking your link.",
                detail: "You don't need to tap anything on the page.",
                status: "Starting unlock"
            });
            const e = e => {
                "SHRINKPE_PROGRESS" === e.type && e.unlockUrl === t && e.lead && e.detail && e.status && (e.countdownSec && e.countdownSec > 0 ? vg.waitCountdown({
                    lead: e.lead,
                    detail: e.detail,
                    status: e.status
                }, e.countdownSec) : vg.progress({
                    lead: e.lead,
                    detail: e.detail,
                    status: e.status
                }))
            };
            chrome.runtime.onMessage.addListener(e);
            try {
                const e = await ((t, e) => new Promise((n, o) => {
                    chrome.runtime.sendMessage({
                        type: "SHRINKPE_RESOLVE",
                        unlockUrl: t,
                        pageHtml: e
                    }, t => {
                        !chrome.runtime.lastError && t?.ok && t.dest ? n(t.dest) : o(new Error("resolve"))
                    })
                }))(t, document.documentElement.innerHTML);
                vg.finishWait(), vg.progress({
                    lead: "Almost there.",
                    detail: "Opening your destination now.",
                    status: "Opening your destination"
                }), D(), location.replace(e)
            } catch {
                vg.setError("Couldn’t finish this link. Reload and try again.")
            } finally {
                chrome.runtime.onMessage.removeListener(e)
            }
        }, xg = () => document.querySelector('form[action*="api-endpoint/verify"]'), Lg = t => t.querySelector('input[name="action"]')?.value?.trim() ?? "", Cg = async t => {
            const e = t.getAttribute("action") || `${location.origin}/api-endpoint/verify`,
                n = new URLSearchParams;
            return new FormData(t).forEach((t, e) => n.append(e, String(t))), await (await fetch(e, {
                method: "POST",
                body: n,
                credentials: "same-origin",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "X-Requested-With": "XMLHttpRequest"
                }
            })).json()
        }, Ig = (t, e) => {
            const n = e.final?.trim() ?? "";
            if (n) return t.setStatus("Opening your link…"), D(), void location.replace(n);
            const o = e.next_page?.trim() ?? "",
                r = e.speed_token?.trim() ?? "";
            if (!o || !r) throw new Error("empty next hop");
            t.setStatus("Continuing…"), ((t, e) => {
                const n = document.createElement("form");
                n.method = "POST", n.action = t;
                const o = document.createElement("input");
                o.type = "hidden", o.name = "speed_token", o.value = e, n.appendChild(o), document.body.appendChild(n), n.submit()
            })(o, r)
        }, Tg = "skip-wait-shrtfly-overlay", $g = "skip-wait-shrtfly-boot", Ag = "human-verification", qg = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        }, _g = null, Mg = !1, Og = !1, Rg = (t = "Getting things ready…") => {
            const e = kt(Tg);
            if (document.documentElement.classList.add(e), !document.getElementById($g)) {
                const t = document.createElement("style");
                t.id = $g, t.textContent = Lt(Tg, e), (document.head || document.documentElement).appendChild(t)
            }
            return _g ? (_g.setNote(qg), _g.setStatus(t), _g.setError(null), _g) : _g = $t({
                id: Tg,
                brand: "Skip Wait",
                note: qg,
                status: t,
                countdownLabel: "Your link opens in"
            })
        };
    var Pg = "skip-wait-shrtfly-mediator-overlay",
        Dg = "skip-wait-shrtfly-mediator-boot",
        Ng = "skip-wait-shrtfly-mediator-turnstile",
        Bg = swTnFrames,
        Ug = new Set(["captcha", "progressbar", "countdown"]),
        Wg = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Hg = swTnNote,
        Fg = null,
        zg = !1,
        jg = swDelay,
        Yg = (t = Wg, e = "Getting things ready…") => {
            const n = kt(Pg);
            if (document.documentElement.classList.add(n), !document.getElementById(Dg)) {
                const t = document.createElement("style");
                t.id = Dg, t.textContent = Lt(Pg, n), (document.head || document.documentElement).appendChild(t)
            }
            return Fg ? (Fg.setNote(t), Fg.setStatus(e), Fg.setError(null), Fg) : Fg = $t({
                id: Pg,
                brand: "Skip Wait",
                note: t,
                status: e,
                countdownLabel: "Your link opens in"
            })
        },
        Gg = () => {
            for (const t of document.querySelectorAll('[name="cf-turnstile-response"]')) {
                const e = t.value?.trim();
                if (e && e.length > 20) return e
            }
            return null
        },
        Vg = () => {
            const t = window;
            for (const e of Object.keys(t)) {
                if (!e.startsWith("_page_load_time_")) continue;
                const n = t[e];
                if ("number" == typeof n) return n
            }
            return performance.timeOrigin
        },
        Zg = async (t, e) => {
            const n = Vg(),
                o = 1e3 * ((t => {
                    for (const e of document.scripts) {
                        const n = e.textContent ?? "",
                            o = /progress_original\s*=\s*(\d+)/.exec(n);
                        if ("progressbar" === t && o) return Number(o[1]);
                        const r = /var total = (\d+);/.exec(n);
                        if ("countdown" === t && r) return Number(r[1])
                    }
                    return 10
                })(e) + 2);
            for (t.setStatus("Waiting for unlock timer…"), t.startCountdown(n + o); Date.now() - n < o;) await jg(100);
            t.hideCountdown()
        }, Jg = async () => {
            const t = xg();
            if (!t) throw new Error("missing form");
            const e = Lg(t);
            if (!Ug.has(e)) throw new Error("not mediator");
            const n = Yg(Wg, "Unlocking your link…");
            (() => {
                for (const t of document.querySelectorAll('[id$="_start_area"]')) t.classList.add("hidden");
                for (const t of document.querySelectorAll('[id$="_area"]')) t.id.includes("_start_") || t.id.endsWith("_final") || t.classList.remove("hidden")
            })(), "captcha" === e ? Gg() || await (async t => {
                t.setNote(Hg), t.setStatus("Waiting for captcha…");
                let e = null,
                    n = 0;
                const o = () => {
                        e?.(), e = null
                    },
                    r = () => {
                        const r = document.querySelector(".cf-turnstile") ?? document.getElementById(Ng);
                        r && (r.id || (r.id = Ng), e && document.getElementById(r.id) || (o(), e = Nt({
                            overlayId: Pg,
                            mount: t.turnstileMount,
                            widgetId: r.id,
                            styleId: "skip-wait-shrtfly-mediator-turnstile-pin",
                            alsoVisibleSelectors: Bg
                        }), n || (n = Date.now()), t.setStatus("Complete the captcha below.")))
                    },
                    i = Date.now() + 18e4;
                for (; Date.now() < i;) {
                    if (r(), Gg() && Date.now() - n >= 400) return o(), void t.setNote(Wg);
                    await jg(200)
                }
                if (o(), !Gg()) throw new Error("turnstile");
                t.setNote(Wg)
            })(n) : await Zg(n, e), (t => {
                const e = t.querySelector('input[name="time_spent"]');
                e && (e.value = String(Math.max(0, Math.round((Date.now() - Vg()) / 1e3))))
            })(t), n.setStatus("Unlocking…");
            const o = await Cg(t);
            if ("success" !== o.status || !o.data || "string" == typeof o.data) throw new Error("string" == typeof o.data ? o.data : "unlock failed");
            Ig(n, o.data)
        };
    var Xg = "skip-wait-shrinkme-entry",
        Kg = "skip-wait-shrinkme-entry-boot",
        Qg = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        ty = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        ey = null,
        ny = !1,
        oy = t => ((() => {
            const t = kt(Xg);
            if (document.documentElement.classList.add(t), document.getElementById(Kg)) return;
            const e = document.createElement("style");
            e.id = Kg, e.textContent = Lt(Xg, t), (document.head || document.documentElement).appendChild(e)
        })(), ey ? (ey.setStatus(t), ey.setError(null), ey) : ey = $t({
            id: Xg,
            brand: "Skip Wait",
            note: ty,
            status: t,
            countdownLabel: "Your link opens in"
        }));
    var ry = "skip-wait-shrinkme-mediator",
        iy = "skip-wait-shrinkme-mediator-boot",
        ay = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        sy = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        cy = null,
        ly = !1,
        uy = t => ((() => {
            const t = kt(ry);
            if (document.documentElement.classList.add(t), document.getElementById(iy)) return;
            const e = document.createElement("style");
            e.id = iy, e.textContent = Lt(ry, t), (document.head || document.documentElement).appendChild(e)
        })(), cy ? (cy.setStatus(t), cy.setError(null), cy) : cy = $t({
            id: ry,
            brand: "Skip Wait",
            note: sy,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        dy = t => {
            const e = document.cookie.match(new RegExp(`(?:^|;\\s*)${t}=([^;]*)`));
            return e?.[1] ? decodeURIComponent(e[1]) : null
        },
        my = () => {
            if (ly || !(/\/link\.php$/i.test(location.pathname) || document.querySelector('form[name="tp"], input[name="newwpsafelink"]') || dy("tp") || /en\.mrproblogger\.com\//i.test(document.documentElement.innerHTML))) return;
            const t = (() => {
                const t = new URLSearchParams(location.search).get("link")?.trim();
                if (t && ay.test(t)) return t;
                const e = document.querySelector('input[name="newwpsafelink"]')?.value?.trim();
                if (e && ay.test(e)) return e;
                const n = dy("tp")?.trim();
                if (n && ay.test(n)) return n;
                const o = document.documentElement.innerHTML.match(/https?:\/\/en\.mrproblogger\.com\/([A-Za-z0-9]+)/i);
                return o?.[1] && ay.test(o[1]) ? o[1] : null
            })();
            t && (ly = !0, uy("Skipping mediator…"), location.replace(`https://en.mrproblogger.com/${encodeURIComponent(t)}`))
        };
    var py = "skip-wait-shrinkme-unlock",
        hy = "skip-wait-shrinkme-unlock-boot",
        fy = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        wy = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        gy = null,
        yy = !1,
        ky = swDelay,
        by = (t = "Getting things ready…") => ((() => {
            const t = kt(py);
            if (document.documentElement.classList.add(t), document.getElementById(hy)) return;
            const e = document.createElement("style");
            e.id = hy, e.textContent = Lt(py, t), (document.head || document.documentElement).appendChild(e)
        })(), gy ? (gy.setStatus(t), gy.setError(null), gy) : gy = $t({
            id: py,
            brand: "Skip Wait",
            note: wy,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        vy = () => Boolean(document.querySelector('#go-link, form[action*="/links/go"]') && document.querySelector('input[name="ad_form_data"]')),
        Sy = async () => {
            if (yy || !vy()) return;
            yy = !0, chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {});
            const t = by("Getting things ready…"),
                e = (() => {
                    const t = document.documentElement.innerHTML.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                    if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                    const e = document.querySelector("#timer, #countdown, .timer, #counter"),
                        n = parseInt(e?.textContent?.trim() ?? "", 10);
                    return Number.isFinite(n) && n > 0 ? n : 0
                })();
            if (e > 0 && (t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * e), await ky(1e3 * e), t.hideCountdown()), !vy()) return void(yy = !1);
            Ae();
            const n = document.querySelector("a.get-link, #gt-link");
            if (n?.href && (o = n.href, /^https?:\/\//i.test(o))) return t.setStatus("Opening your link…"), D(), void location.replace(n.href);
            var o;
            t.setStatus("Unlocking your link…");
            const r = Te(document.documentElement.innerHTML, location.href);
            if (!r) return t.setStatus("This page isn’t ready yet. Reload and try again."), void(yy = !1);
            let i = await $e(r, location.href);
            if (!i && e > 0) {
                t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * (e + 2));
                const n = Date.now() + 1e3 * (e + 2);
                for (; !i && Date.now() < n && (Ae(), i = await $e(r, location.href), !i);) await ky(200);
                t.hideCountdown()
            }
            if (!i) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(yy = !1);
            t.setStatus("Opening your link…"), D(), location.replace(i)
        }, Ey = () => {
            vy() && Sy()
        };
    var xy = /^https?:\/\//i,
        Ly = ["safelink_redirect", "wpsafelink", "safelink"],
        Cy = t => {
            const e = atob((t => {
                    const e = t.replace(/-/g, "=");
                    return e + "=".repeat((4 - e.length % 4) % 4)
                })(t)),
                n = new Uint8Array(e.length);
            for (let o = 0; o < e.length; o++) n[o] = e.charCodeAt(o);
            return n
        },
        Iy = async t => {
            const e = t.indexOf("wApbsCadfEeFlgiHnik");
            if (e < 1) return null;
            const n = (new TextDecoder).decode(Cy(t.slice(e + 19)));
            return (async (t, e) => {
                if (0 === e.length || e.length % 16 != 0) return null;
                const n = (new TextEncoder).encode(t),
                    o = new Uint8Array(32);
                o.set(n.subarray(0, 32));
                const r = await crypto.subtle.importKey("raw", o, "AES-CBC", !1, ["encrypt", "decrypt"]),
                    i = new Uint8Array(16),
                    a = new Uint8Array(e.length);
                for (let c = 0; c < e.length; c += 16) {
                    const t = new Uint8Array(e.slice(c, c + 16)),
                        n = new Uint8Array(await crypto.subtle.encrypt({
                            name: "AES-CBC",
                            iv: t
                        }, r, new Uint8Array)),
                        o = new Uint8Array(t.length + n.length);
                    o.set(t), o.set(n, t.length), a.set(new Uint8Array(await crypto.subtle.decrypt({
                        name: "AES-CBC",
                        iv: i
                    }, r, o)), c)
                }
                const s = (t => {
                    if (!t.length) return null;
                    const e = t[t.length - 1];
                    if (e < 1 || e > 16 || e > t.length) return null;
                    for (let n = t.length - e; n < t.length; n++)
                        if (t[n] !== e) return null;
                    return t.subarray(0, t.length - e)
                })(a);
                return s ? (new TextDecoder).decode(s) : null
            })(t.slice(0, e), Cy(n))
        }, Ty = t => {
            try {
                return (new TextDecoder).decode(Cy(t)) || null
            } catch {
                return null
            }
        }, $y = t => {
            try {
                const e = JSON.parse(t),
                    n = e.second_safelink_url || e.safelink;
                if (!n) return null;
                const o = decodeURIComponent(n);
                return xy.test(o) ? o : null
            } catch {
                return null
            }
        }, Ay = async (t, e) => {
            if (e > 8) return null;
            const n = t.trim();
            if (!n) return null;
            if (xy.test(n)) return await qy(n, e + 1) ?? n;
            const o = $y(n);
            if (o) return Ay(o, e + 1);
            const r = await Iy(n);
            if (r) return Ay(r, e + 1);
            const i = Ty(n);
            return i && i !== n ? Ay(i, e + 1) : null
        }, qy = async (t, e = 0) => {
            if (e > 8) return null;
            let n;
            try {
                n = new URL(t)
            } catch {
                return null
            }
            for (const o of Ly) {
                const r = n.searchParams.get(o);
                if (!r) continue;
                const i = "safelink" === o ? Ty(r) : await Iy(r);
                if (!i) {
                    const t = $y(Ty(r) ?? "");
                    if (t) return Ay(t, e + 1);
                    continue
                }
                const a = await Ay(i, e + 1);
                if (a && a !== t) return a
            }
            return null
        }, _y = "skip-wait-wp-safelink-query-overlay", My = "skip-wait-wp-safelink-query-boot", Oy = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to wait or tap anything on the page."
        }, Ry = null, Py = 0, Dy = () => kt(_y), Ny = () => {
            Ry?.remove(), Ry = null, Py = 0, document.documentElement.classList.remove(Dy()), document.getElementById(My)?.remove()
        }, By = (t = "Getting things ready…") => ((() => {
            if (document.documentElement.classList.add(Dy()), document.getElementById(My)) return;
            const t = document.createElement("style");
            t.id = My, t.textContent = Lt(_y, Dy()), (document.head || document.documentElement).appendChild(t)
        })(), Py || (Py = Date.now()), Ry ? (Ry.setNote(Oy), Ry.setStatus(t), Ry.setError(null), Ry) : Ry = $t({
            id: _y,
            brand: "Skip Wait",
            note: Oy,
            status: t
        }));

    function Uy(t) {
        (t => {
            try {
                const e = new URL(t);
                return Ly.some(t => Boolean(e.searchParams.get(t)))
            } catch {
                return !1
            }
        })(location.href) && (By("Opening your link…"), Promise.all([ot(t), qy(location.href)]).then(([t, e]) => {
            t && e ? (t => {
                if (t === location.href) return void Ny();
                By("Opening your link…");
                const e = () => {
                        D(), location.replace(t)
                    },
                    n = Math.max(0, 200 - (Date.now() - Py));
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        n > 0 ? window.setTimeout(e, n) : e()
                    })
                })
            })(e) : Ny()
        }))
    }

    /*
     * wpsafelink-button engine — the WordPress "WP SafeLink" plugin in
     * button/generate mode (NOT the ?safelink_redirect query gate, which
     * Uy handles). One generic engine for the whole family, keyed by the
     * hosts.json flow "wpsafelink-button"; recipes follow the actively
     * maintained bypass-shortlinks userscript (nOneCode4u), clusters:
     *   horoscop  — .wpsafelink-button steps + wpsafehuman/wpsafegenerate
     *   indobo    — div[id^=wpsafe] anchors, #wpsafegenerate scripts
     *   jobinmeghalaya / tejtime / marketrook — #topButton/#bottomButton/
     *               a#btn7/#open-link button chains, form[name=dsb]
     *   generic   — #wpsafe-link a (href | window.open | handleClick)
     *   form      — input[name=newwpsafelink] (base64 JSON {linkr})
     * Destination payloads (safelink_redirect base64 / AES) are decoded by
     * the shared qy/Ay/Iy helpers, so multi-hop chains land on the target.
     */
    var wpbId = "skip-wait-wpsafelink-button",
        wpbNote = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        wpbUi = null,
        wpbT0 = 0,
        wpbTimer = null,
        wpbDone = !1,
        wpbClicked = new WeakSet,
        wpbCalled = {},
        wpbReady = new WeakMap,
        wpbSay = t => {
            wpbUi || (wpbT0 = Date.now(), wpbUi = $t({
                id: wpbId,
                brand: "Skip Wait",
                note: wpbNote,
                status: t
            })), wpbUi.setStatus(t)
        },
        wpbClose = () => {
            wpbTimer && (clearInterval(wpbTimer), wpbTimer = null), wpbUi && (wpbUi.remove(), wpbUi = null)
        },
        wpbVis = t => t instanceof Element && (null !== t.offsetParent || "fixed" === getComputedStyle(t).position),
        wpbText = t => (t.textContent ?? "").trim(),
        wpbB64 = t => {
            try {
                return atob(t.replace(/-/g, "+").replace(/_/g, "/").replace(/\s+/g, ""))
            } catch {
                return null
            }
        },
        wpbPayload = async t => {
            const e = wpbB64(t);
            if (!e) return null;
            const n = $y(e) ?? (t => {
                try {
                    const e = JSON.parse(t).linkr;
                    return "string" == typeof e && xy.test(e) ? e : null
                } catch {
                    return null
                }
            })(e);
            if (n) return n;
            const o = Ty(e);
            if (o && xy.test(o.trim())) return o.trim();
            try {
                return await Iy(e)
            } catch {
                return null
            }
        },
        wpbInOnclick = t => {
            const e = t.getAttribute("onclick") ?? "";
            return e.match(/window\.open\(\s*['"]([^'"]+)['"]/i)?.[1] ?? e.match(/handleClick\(\s*['"]([^'"]+)['"]/i)?.[1] ?? null
        },
        wpbScriptDest = t => {
            const e = t?.textContent ?? "";
            return e.match(/window\.location(?:\.href)?\s*=\s*["']([^"']+)["']/i)?.[1] ?? e.match(/window\.location\.replace\(\s*["']([^"']+)["']/i)?.[1] ?? e.match(/\bredirect\(\s*["'](https?:[^"']+)["']/i)?.[1] ?? null
        },
        wpbGo = (t, e = "Opening your link…") => {
            wpbSay(e), qy(t).then(n => {
                const o = n && n !== location.href ? n : t;
                if (o === location.href || !xy.test(o)) return void wpbClose();
                D(), wpbClose(), location.replace(o)
            })
        },
        wpbPageFn = t => {
            chrome.runtime.sendMessage({
                type: "SKIP_WAIT_PAGE_CALL",
                name: t
            }).catch(() => {})
        },
        wpbCaptchaDone = () => {
            const e = document.querySelectorAll(".g-recaptcha, .h-captcha, .cf-turnstile, #captcha-container");
            if (!e.length) return !0;
            return ["#g-recaptcha-response", 'textarea[name="g-recaptcha-response"]', '[name="h-captcha-response"]', '[name="cf-turnstile-response"]'].some(e => (document.querySelector(e)?.value ?? "").length > 4)
        },
        wpbWhen = (t, e) => {
            const n = wpbReady.get(t);
            return void 0 === n ? (wpbReady.set(t, Date.now() + e), !1) : Date.now() >= n
        },
        wpbPress = (t, e = 1200) => !(!wpbVis(t) || wpbClicked.has(t) || !wpbWhen(t, e)) && (wpbClicked.add(t), t.scrollIntoView({
            block: "center"
        }), t.click(), !0),
        wpbFinishing = e => (wpbSay("Finishing up…"), !1);

    async function wpbTick() {
        if (wpbDone) return;
        const d = Date.now() - wpbT0;
        if (d > 75e3) return wpbDone = !0, wpbSay("Couldn't finish automatically — try the page manually."), void wpbUi?.setError("This page took too long. Reload once; if it keeps failing, the site may have changed.");
        const captchaBox = document.querySelector(".g-recaptcha, .h-captcha, .cf-turnstile, #captcha-container");
        const captchaInput = document.querySelector('#g-recaptcha-response, textarea[name="g-recaptcha-response"], [name="h-captcha-response"], [name="cf-turnstile-response"]');
        if (captchaBox && wpbVis(captchaBox) && captchaInput && !(captchaInput.value ?? "").length)
            return wpbUi && swaAssistButton(wpbUi.turnstileMount), void wpbSay("Waiting for the captcha — solve it, or press Try audio assist.");
        /* 1. Destination extraction — ends the flow. */
        const anchor = document.querySelector("#wpsafe-link a[href]");
        if (anchor && wpbVis(anchor) && wpbWhen(anchor, 2e3)) {
            const href = anchor.getAttribute("href")?.trim() ?? "";
            if (xy.test(href) && "#" !== href) return void wpbGo(href);
            const inOnclick = wpbInOnclick(anchor);
            if (inOnclick) {
                if (xy.test(inOnclick)) return wpbWhen(anchor, 5e3) ? void wpbGo(inOnclick) : void wpbFinishing();
                const payload = await wpbPayload(inOnclick);
                if (payload) return wpbWhen(anchor, 5e3) ? void wpbGo(payload) : void wpbFinishing()
            }
        }
        const onclickAnchor = [...document.querySelectorAll("div[id^=wpsafe] > a[rel=nofollow], #wpsafe-link a[onclick*=window], #wpsafe-link a[onclick*=handleClick]")].map(t => [t, wpbInOnclick(t)]).find(([, t]) => t);
        if (onclickAnchor) {
            const [t, e] = onclickAnchor;
            if (xy.test(e)) return wpbWhen(t, 5e3) ? void wpbGo(e) : void wpbFinishing();
            const n = await wpbPayload(e);
            if (n) return wpbWhen(t, 5e3) ? void wpbGo(n) : void wpbFinishing()
        }
        const nlInput = document.querySelector("input[name=newwpsafelink]");
        if (nlInput?.value) {
            const t = await wpbPayload(nlInput.value);
            if (t) return wpbWhen(nlInput, 5e3) ? void wpbGo(t) : void wpbFinishing()
        }
        for (const script of document.querySelectorAll("#wpsafegenerate script, .wpsafe-top script, #wpsafe-link script")) {
            const t = wpbScriptDest(script);
            if (t && xy.test(t)) return wpbWhen(script, 3e3) ? void wpbGo(t) : void wpbFinishing()
        }
        for (const t of document.querySelectorAll('a[onclick*="safelink_redirect"]')) {
            const e = (t.getAttribute("onclick") ?? "").match(/'([A-Za-z0-9+/=_-]{12,})'/)?.[1];
            if (!e) continue;
            const n = await wpbPayload(e);
            if (n) return void wpbGo(n)
        }
        /* 2. Choreography — at most one action per tick. */
const human = document.querySelector(".wpsafelink-button, #wpsafelinkhuman, #wpsafe-generate");
        if (human && !wpbCalled.human && wpbCaptchaDone()) return wpbCalled.human = !0, wpbSay("Verifying…"), void wpbPageFn("wpsafehuman");
        if (wpbCalled.human && !wpbCalled.generate) {
            const t = document.querySelector(".base-timer");
            if (!t || "0:00" === wpbText(t)) return wpbCalled.generate = !0, void wpbPageFn("wpsafegenerate")
        }
        const steps = [
            ["center > .wpsafelink-button", 1500],
            ["#wpsafelink-landing > .wpsafelink-button, #wpsafelink-landing2 > .wpsafelink-button", 1500],
            ["#wpsafegenerate > a > img", 2e3],
            ["#wpsafelinkhuman", 1500],
            ["#topButton.pro_btn, #topButton", 2e3],
            ["#bottomButton", 2500],
            ["#open-link > .pro_btn", 2500],
            ["a#btn7", 3e3]
        ];
        for (const [selector, delay] of steps) {
            const t = document.querySelector(selector);
            if (t && wpbPress(t, delay)) return wpbSay("Unlocking your link…")
        }
        /* hosttbuzz-cluster skin: the .btn-captcha submit only after the captcha. */
        if (wpbCaptchaDone()) {
            const t = document.querySelector(".btn-captcha.btn-primary, .btn-captcha");
            if (t && wpbPress(t, 2e3)) return wpbSay("Unlocking your link…")
        }
        const forms = [...document.querySelectorAll("form[name=dsb], #nextpage, #getmylnk")];
        for (const form of forms) {
            if (!(wpbVis(form) && !wpbClicked.has(form) && wpbWhen(form, 3e3))) continue;
            wpbClicked.add(form);
            if (form.requestSubmit) wpbSay("Unlocking your link…"), form.requestSubmit();
            else {
                const t = form.querySelector("button[type=submit], input[type=submit]");
                t ? (wpbSay("Unlocking your link…"), wpbPress(t, 0)) : (wpbSay("Unlocking your link…"), HTMLFormElement.prototype.submit.call(form))
            }
            return
        }
        if (!forms.length) wpbSay("Unlocking your link…");
        /* Last resort: some skins wire the destination into the anchor's own
         * click handler rather than an extractable attribute — press it and
         * let the page navigate (recipes: sastainsurance / amanguides). */
        {
            const t = document.querySelector("#wpsafe-link > a");
            if (t && wpbPress(t, 6e3)) return wpbSay("Unlocking your link…")
        }
        /* 3. Nothing recognised — don't fight an unrelated page. */
        const seen = document.querySelector("#wpsafe-link, #wpsafegenerate, #wpsafelinkhuman, .wpsafelink-button, form[name=dsb], #nextpage, #getmylnk, .btn-captcha, a#btn7, #topButton, #bottomButton, #open-link, input[name=newwpsafelink]");
        d > 12e3 && !seen && (wpbSay("This page doesn't look like a supported SafeLink step."), wpbUi?.setError("Leaving it untouched — the flow may have moved to another domain."), wpbDone = !0)
    }

    var wpbStart = t => {
        window === window.top && ot(t).then(t => {
            t && it(() => {
                wpbT0 = Date.now(), wpbDone = !1, wpbCalled = {}, wpbTick(), wpbTimer = setInterval(() => {
                    wpbTick().catch(() => {})
                }, 700)
            })
        })
    };

    /*
     * reCAPTCHA audio assist (manual-first, opt-in). Shared by flows that can
     * get stuck on a reCAPTCHA step (wpsafelink-button engine today): while an
     * unsolved widget is visible, the overlay offers a "Try audio assist"
     * button. Pressing it relays to the recaptcha bframe content script, which
     * switches the widget to its audio challenge, downloads the clip, WAV-
     * encodes each channel and asks the background to transcribe it against
     * the user-configured endpoint (skipWaitSttEndpoint — e.g. a local Whisper
     * server). Without an endpoint nothing is ever sent anywhere and the user
     * keeps solving manually.
     */
    var swaWav = (t, e) => {
            const n = t.length,
                r = new DataView(new ArrayBuffer(44 + 2 * n));
                let i = 0;
            const a = (t, e) => {
                    r.setUint8(i, t.charCodeAt(e)), i++
                },
                s = t => {
                    for (let e = 0; e < t.length; e++) a(t, e)
                };
            s("RIFF"), r.setUint32(i, 36 + 2 * n, !0), i += 4, s("WAVE"), s("fmt "), r.setUint32(i, 16, !0), i += 4, r.setUint16(i, 1, !0), i += 2, r.setUint16(i, 1, !0), i += 2, r.setUint32(i, t.sampleRate, !0), i += 4, r.setUint32(i, 2 * t.sampleRate, !0), i += 4, r.setUint16(i, 2, !0), i += 2, r.setUint16(i, 16, !0), i += 2, s("data"), r.setUint32(i, 2 * n, !0), i += 4;
            for (let c = 0; c < n; c++) {
                const n = Math.max(-1, Math.min(1, e[c]));
                r.setInt16(i, n < 0 ? 32768 * n : 32767 * n, !0), i += 2
            }
            return r.buffer
        },
        swaB64 = t => {
            const e = new Uint8Array(t);
            let n = "";
            for (let r = 0; r < e.length; r += 32768) n += String.fromCharCode.apply(null, e.subarray(r, r + 32768));
            return btoa(n)
        },
        swaDigits = t => {
            const e = String(t ?? "").toLowerCase().replace(/[^a-z0-9]/g, "");
            return /\d/.test(e) ? e.replace(/\D/g, "") : (e.replace(/zero|oh|one|two|three|four|five|six|seven|eight|nine/g, t => ({
                zero: "0",
                oh: "0",
                one: "1",
                two: "2",
                three: "3",
                four: "4",
                five: "5",
                six: "6",
                seven: "7",
                eight: "8",
                nine: "9"
            })[t] ?? ""));
        },
        swaWait = (t, e, n = 15e3) => new Promise(r => {
            const o = Date.now(),
                i = setInterval(() => {
                    const a = t();
                    (a || Date.now() - o > n) && (clearInterval(i), r(a || null))
                }, e ?? 250)
        }),
        swaInBframe = () => /(^|\.)google\.com$/.test(location.hostname) && /\/recaptcha\/(api2|enterprise)\/bframe/.test(location.pathname),
        swaSolveOnce = async () => {
            const t = document.querySelector("#recaptcha-audio-button, .button-holder.audio-button button, button[title*='audio' i]");
            if (!t) return {
                ok: !1,
                err: "no-audio-button"
            };
            t.click();
            const e = await swaWait(() => document.querySelector("#audio-source[src]") ?? null, 250, 15e3),
                n = e?.getAttribute("src") ?? "";
            if (!n) return {
                ok: !1,
                err: "no-audio-track"
            };
            const r = await chrome.runtime.sendMessage({
                type: "SKIP_WAIT_AUDIO_STT_FETCH",
                url: n
            }).catch(t => ({
                ok: !1,
                err: String(t)
            }));
            if (!r?.ok) return {
                ok: !1,
                err: "fetch:" + (r?.err ?? "?")
            };
            const o = Uint8Array.from(atob(r.b64), t => t.charCodeAt(0)),
                a = new AudioContext;
            let i;
            try {
                i = await a.decodeAudioData(o.buffer.slice(0))
            } catch {
                return {
                    ok: !1,
                    err: "decode"
                }
            }
            const channels = [];
            for (let t = 0; t < Math.min(2, i.numberOfChannels); t++) channels.push(i.getChannelData(t));
            for (const o of channels) {
                const t = swaWav(i, o),
                    n = await chrome.runtime.sendMessage({
                        type: "SKIP_WAIT_AUDIO_STT",
                        wav: swaB64(t)
                    }).catch(t => ({
                        ok: !1,
                        err: String(t)
                    }));
                if (n?.ok) {
                    const t = swaDigits(n.text);
                    if (t.length >= 2) {
                        const e = document.querySelector("#audio-response");
                        if (!e) return {
                            ok: !1,
                            err: "no-input"
                        };
                        e.value = t, e.dispatchEvent(new Event("input", {
                            bubbles: !0
                        })), e.dispatchEvent(new Event("change", {
                            bubbles: !0
                        }));
                        const n = document.querySelector("#recaptcha-verify-button");
                        return n ? (n.click(), {
                            ok: !0,
                            digits: t
                        }) : {
                            ok: !1,
                            err: "no-verify"
                        }
                    }
                } else if ("no-backend" === n?.err) return {
                    ok: !1,
                    err: "no-backend"
                }
            }
            return {
                ok: !1,
                err: "no-digits"
            }
        },
        swaRunFrame = async () => {
            if (!swaInBframe()) return {
                ok: !1,
                err: "not-bframe"
            };
            let t = null,
                e = null;
            for (let n = 0; n < 3; n++) {
                const r = document.querySelector("audio#audio-source")?.getAttribute("src") ?? null;
                if (t = await swaSolveOnce(), !t.ok) return t;
                if (e = await swaWait(() => {
                        const t = document.querySelector("audio#audio-source")?.getAttribute("src") ?? null;
                        return t && t !== r ? "reloaded" : document.querySelector("#recaptcha-audio-button") && !document.querySelector("audio#audio-source[src]") ? "solved" : null
                    }, 400, 12e3), "reloaded" !== e) break
            }
            return "reloaded" === e ? {
                ok: !1,
                err: "still-challenged"
            } : {
                ok: !0
            }
        };
    window === window.top && chrome.runtime?.onMessage?.addListener((t, e, n) => "SKIP_WAIT_AUDIO_ASSIST_RESULT" === t?.type ? (wpbUi && (t.ok ? (wpbSay("Captcha solved — continuing…"), wpbCalled.human = !0) : (wpbUi.setError("no-backend" === t.err ? "No speech backend configured — set one in the popup, or solve the captcha manually." : "Audio assist couldn't solve it (" + (t.err || "unknown") + "). Solve it manually instead."), wpbSay("Waiting for the captcha…"))), !1) : void 0), chrome.runtime?.onMessage?.addListener((t, e, n) => {
        if ("SKIP_WAIT_AUDIO_ASSIST_FRAME" !== t?.type) return !1;
        return swaRunFrame().then(t => {
            window !== window.top && chrome.runtime.sendMessage({
                type: "SKIP_WAIT_AUDIO_ASSIST_RESULT",
                ok: !!t.ok,
                err: t.err ?? ""
            }).catch(() => {})
        }).catch(() => {}), !1
    });
    var swaAssistButton = t => {
        if (!t || t.dataset.swAssist) return;
        t.dataset.swAssist = "1", t.replaceChildren();
        const e = document.createElement("button");
        e.type = "button", e.textContent = "Try audio assist", e.style.cssText = "display:block;margin:8px auto 0;padding:9px 16px;border:0;border-radius:8px;background:#38bdf8;color:#0f172a;font:700 13px/1.2 system-ui,sans-serif;cursor:pointer", e.addEventListener("click", () => {
            e.disabled = !0, e.textContent = "Trying audio challenge…", chrome.runtime.sendMessage({
                type: "SKIP_WAIT_AUDIO_ASSIST_START"
            }).catch(() => {}), setTimeout(() => {
                e.disabled = !1, e.textContent = "Try audio assist"
            }, 25e3)
        }), t.appendChild(e)
    };

    function Wy() {
        const t = document.querySelector("#butunlock a")?.href;
        t && (D(), location.replace(t))
    }
    var Hy = "skip-wait-sub2unlock-overlay",
        Fy = "skip-wait-sub2unlock-boot",
        zy = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        jy = null,
        Yy = () => {
            const t = kt(Hy);
            if (document.documentElement.classList.add(t), document.getElementById(Fy)) return;
            const e = document.createElement("style");
            e.id = Fy, e.textContent = Lt(Hy, t), (document.head || document.documentElement).appendChild(e)
        },
        Gy = (t = "Getting things ready…") => (Yy(), jy ? (jy.setNote(zy), jy.setStatus(t), jy.setError(null), jy) : jy = $t({
            id: Hy,
            brand: "Skip Wait",
            note: zy,
            status: t
        })),
        Vy = () => {
            const t = document.getElementById("__NEXT_DATA__")?.textContent?.trim();
            if (!t) return null;
            try {
                const e = JSON.parse(t).props?.pageProps?.sink?.data?.unlocked_link;
                return "string" == typeof e && /^https?:\/\//i.test(e.trim()) ? e.trim() : null
            } catch {
                return null
            }
        };
    var Zy = /^[A-Za-z0-9_-]+$/,
        Jy = /^\/S\/([A-Za-z0-9_-]+)\/?$/i,
        Xy = /^\/LinkShortner\/sub4unlock\/LP\/LP\.php$/i,
        Ky = /^\/LP\/LP\.php$/i,
        Qy = /^\/LP\/LPD\.php$/i,
        tk = () => {
            const t = location.pathname.match(Jy)?.[1];
            return t || (Xy.test(location.pathname) || Ky.test(location.pathname) || Qy.test(location.pathname) ? (() => {
                const t = new URLSearchParams(location.search).get("id");
                return t && Zy.test(t) ? t : null
            })() : null)
        },
        ek = () => tk() ? Jy.test(location.pathname) ? "landing" : Xy.test(location.pathname) ? "loader" : Ky.test(location.pathname) ? "lp" : Qy.test(location.pathname) ? "lpd" : null : null,
        nk = "skip-wait-sub4unlock-com-overlay",
        ok = "skip-wait-sub4unlock-com-boot",
        rk = /\bvar\s+file\s*=\s*"([^"]+)"/,
        ik = /function\s+fileunlock\s*\(\)\s*\{[\s\S]*?window\.open\(\s*"([^"]+)"/,
        ak = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        sk = null,
        ck = t => t && /^https?:\/\//i.test(t) ? t : null,
        lk = () => {
            const t = kt(nk);
            if (document.documentElement.classList.add(t), document.getElementById(ok)) return;
            const e = document.createElement("style");
            e.id = ok, e.textContent = Lt(nk, t), (document.head || document.documentElement).appendChild(e)
        },
        uk = (t = "Getting things ready…") => (lk(), sk ? (sk.setNote(ak), sk.setStatus(t), sk.setError(null), sk) : sk = $t({
            id: nk,
            brand: "Skip Wait",
            note: ak,
            status: t
        })),
        dk = () => {
            const t = ek(),
                e = tk();
            if (!t || !e) return;
            const n = uk("Unlocking your link…");
            if ("landing" === t || "loader" === t) return n.setStatus("Opening your link…"), void location.replace(`${location.origin}/LP/LP.php?id=${encodeURIComponent(e)}`);
            const o = ((t, e) => ck("lp" === e ? t.match(rk)?.[1]?.trim() : t.match(ik)?.[1]?.trim()))(document.documentElement.innerHTML, t);
            o ? (n.setStatus("Opening your link…"), D(), location.replace(o)) : n.setError("Destination not found on this page.")
        };
    var mk = "skip-wait-sub4unlock-io-overlay",
        pk = "skip-wait-sub4unlock-io-boot",
        hk = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        fk = null,
        wk = () => {
            const t = kt(mk);
            if (document.documentElement.classList.add(t), document.getElementById(pk)) return;
            const e = document.createElement("style");
            e.id = pk, e.textContent = Lt(mk, t), (document.head || document.documentElement).appendChild(e)
        },
        gk = (t = "Getting things ready…") => (wk(), fk ? (fk.setNote(hk), fk.setStatus(t), fk.setError(null), fk) : fk = $t({
            id: mk,
            brand: "Skip Wait",
            note: hk,
            status: t
        })),
        yk = () => {
            const t = document.querySelector("a.get-link[href]")?.href?.trim() ?? "";
            return /^https?:\/\//i.test(t) ? t : null
        };
    var kk = "skip-wait-sub4unlock-me-overlay",
        bk = "skip-wait-sub4unlock-me-boot",
        vk = "#link-view",
        Sk = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Ek = null,
        xk = !1,
        Lk = () => {
            const t = kt(kk);
            if (document.documentElement.classList.add(t), document.getElementById(bk)) return;
            const e = document.createElement("style");
            e.id = bk, e.textContent = Lt(kk, t), (document.head || document.documentElement).appendChild(e)
        },
        Ck = (t = "Getting things ready…") => (Lk(), Ek ? (Ek.setNote(Sk), Ek.setStatus(t), Ek.setError(null), Ek) : Ek = $t({
            id: kk,
            brand: "Skip Wait",
            note: Sk,
            status: t
        })),
        Ik = async (t, e, n) => fetch(t.action, {
            method: "POST",
            body: new URLSearchParams(t.fields),
            credentials: "include",
            headers: {
                Accept: n ? "application/json, text/javascript, */*; q=0.01" : "text/html",
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                Referer: e,
                ...n ? {
                    "X-Requested-With": "XMLHttpRequest"
                } : {}
            }
        }), Tk = async (t, e) => {
            const n = await Ik(t, e, !0),
                o = JSON.parse(await n.text());
            return "success" !== o.status || "string" != typeof o.url ? null : (t => {
                const e = t.trim(),
                    n = e.startsWith("?") ? e.slice(1) : e.includes("?") ? e.slice(e.indexOf("?") + 1) : e,
                    o = new URLSearchParams(n).get("lnk1");
                if (o) try {
                    const t = decodeURIComponent(atob(o)).trim();
                    return /^https?:\/\//i.test(t) ? t : null
                } catch {
                    return null
                }
                return /^https?:\/\//i.test(e) ? e : null
            })(o.url.trim())
        }, $k = async () => {
            if (xk) return;
            xk = !0;
            const t = Ck("Unlocking your link…");
            let e = Te(document.documentElement.innerHTML, location.href);
            if (!e?.fields.ad_form_data) {
                const n = document.querySelector(vk);
                if (!n) return t.setError("Unlock form not found on this page."), void(xk = !1);
                const o = await (await Ik((t => {
                    const e = t.getAttribute("action") || location.pathname,
                        n = /^https?:\/\//i.test(e) ? e : new URL(e, location.href).href,
                        o = {};
                    return t.querySelectorAll("input[name]").forEach(t => {
                        t.name && (o[t.name] = t.value ?? "")
                    }), {
                        action: n,
                        fields: o
                    }
                })(n), location.href, !1)).text();
                e = Te(o, location.href)
            }
            if (!e?.fields.ad_form_data) return t.setError("Couldn’t unlock this link. Reload and try again."), void(xk = !1);
            const n = await Tk(e, location.href);
            if (!n) return t.setError("Couldn’t unlock this link. Reload and try again."), void(xk = !1);
            t.setStatus("Opening your link…"), D(), location.replace(n)
        };
    var Ak = "skip-wait-droplink-unlock",
        qk = "skip-wait-droplink-unlock-boot",
        _k = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        Mk = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Ok = null,
        Rk = !1,
        Pk = swDelay,
        Dk = (t = "Getting things ready…") => ((() => {
            const t = kt(Ak);
            if (document.documentElement.classList.add(t), document.getElementById(qk)) return;
            const e = document.createElement("style");
            e.id = qk, e.textContent = Lt(Ak, t), (document.head || document.documentElement).appendChild(e)
        })(), Ok ? (Ok.setStatus(t), Ok.setError(null), Ok) : Ok = $t({
            id: Ak,
            brand: "Skip Wait",
            note: Mk,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        Nk = () => Boolean(document.querySelector('#go-link, form[action*="/links/go"]') && document.querySelector('input[name="ad_form_data"]')),
        Bk = async () => {
            if (Rk || !Nk()) return;
            Rk = !0, chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {});
            const t = Dk("Getting things ready…");
            Ae();
            const e = document.querySelector("a.get-link, #gt-link");
            if (e?.href && (n = e.href, /^https?:\/\//i.test(n))) return t.setStatus("Opening your link…"), D(), void location.replace(e.href);
            var n;
            t.setStatus("Unlocking your link…");
            const o = Te(document.documentElement.innerHTML, location.href);
            if (!o) return t.setStatus("This page isn’t ready yet. Reload and try again."), void(Rk = !1);
            let r = await $e(o, location.href);
            const i = (() => {
                const t = document.documentElement.innerHTML.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                const e = document.querySelector("#timer, #countdown, .timer, #counter"),
                    n = parseInt(e?.textContent?.trim() ?? "", 10);
                return Number.isFinite(n) && n > 0 ? n : 0
            })();
            if (!r && i > 0) {
                t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * (i + 2));
                const e = Date.now() + 1e3 * (i + 2);
                for (; !r && Date.now() < e && (Ae(), r = await $e(o, location.href), !r);) await Pk(200);
                t.hideCountdown()
            }
            if (!r) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(Rk = !1);
            t.setStatus("Opening your link…"), D(), location.replace(r)
        }, Uk = () => {
            Nk() && Bk()
        };
    var Wk = /^\/f\/([A-Za-z0-9]+)\/?$/i,
        Hk = "skip-wait-dlsurf-panel",
        Fk = "skip-wait-dlsurf-turnstile",
        zk = "skip-wait-dlsurf-panel-css",
        jk = t => {
            t && chrome.runtime.sendMessage({
                type: "skip-wait-dlsurf-turnstile-remove",
                widgetId: t
            }).catch(() => {})
        },
        Yk = () => {
            const t = document.getElementById(Hk);
            if (!t) return;
            const e = t.querySelector("#skip-wait-dlsurf-turnstile")?.getAttribute("data-sw-ts-id") ?? "";
            t.remove(), jk(e)
        },
        Gk = t => {
            (() => {
                if (document.getElementById(zk)) return;
                const t = document.createElement("style");
                t.id = zk, t.textContent = `#${Hk}{box-sizing:border-box;width:100%;margin:0 0 12px;padding:14px 16px;border:1px solid rgba(0,0,0,.08);border-radius:10px;background:rgba(255,255,255,.92);color:#111;font:500 14px/1.45 system-ui,-apple-system,sans-serif}@media(prefers-color-scheme:dark){#${Hk}{border-color:rgba(255,255,255,.12);background:rgba(24,24,27,.92);color:#f4f4f5}}#${Hk} *{box-sizing:border-box}#${Hk} .sw-brand{font-size:12px;font-weight:700;letter-spacing:.02em;opacity:.7;margin:0 0 6px}#${Hk} .sw-title{font-size:16px;font-weight:700;margin:0 0 4px}#${Hk} .sw-detail{font-size:13px;font-weight:500;opacity:.75;margin:0 0 12px}#${Hk} .sw-status{font-size:13px;font-weight:600;margin:0 0 10px}#${Hk} .sw-err{font-size:13px;font-weight:600;color:#dc2626;margin:0 0 10px}#${Hk} .sw-turnstile{display:flex;justify-content:center;min-height:72px;margin:0 0 10px}#${Hk} .sw-btn{display:inline-flex;align-items:center;justify-content:center;width:100%;min-height:40px;padding:0 16px;border:0;border-radius:8px;background:#111;color:#fff;font:600 14px/1 system-ui,-apple-system,sans-serif;text-decoration:none;cursor:pointer}@media(prefers-color-scheme:dark){#${Hk} .sw-btn{background:#fafafa;color:#111}}#${Hk} .sw-btn[hidden],#${Hk} .sw-turnstile[hidden]{display:none!important}`, (document.head || document.documentElement).appendChild(t)
            })(), Yk();
            const e = document.createElement("div");
            e.id = Hk, e.innerHTML = `<div class="sw-brand">Skip Wait</div><p class="sw-title">Skip Ads &amp; Timers</p><p class="sw-detail">Unlocks this file with a signed-in dl.surf account — no ad waits, no countdown clicks.</p><p class="sw-status"></p><p class="sw-err"></p><div class="sw-turnstile" id="${Fk}" hidden></div><a class="sw-btn" hidden rel="noopener"></a>`, t.before(e);
            const n = e.querySelector(".sw-status"),
                o = e.querySelector(".sw-err"),
                r = e.querySelector(".sw-turnstile"),
                i = e.querySelector(".sw-btn");
            let a = null;
            const s = () => {
                    i.onclick = null
                },
                c = (t, e, n) => {
                    a?.(), a = null, s(), (() => {
                        const t = r.getAttribute("data-sw-ts-id") ?? "";
                        r.hidden = !0, r.removeAttribute("data-sw-ts-id"), r.replaceChildren(), jk(t)
                    })(), i.hidden = !1, i.textContent = t, e ? i.href = e : (i.removeAttribute("href"), n && (i.onclick = t => {
                        t.preventDefault(), n()
                    }))
                };
            return {
                setStatus(t) {
                    n.textContent = t
                },
                setError(t) {
                    o.textContent = t ?? ""
                },
                showLogin(t) {
                    c("Sign In · dl.surf", t)
                },
                showDownload(t) {
                    c("Download File · Skip Wait", t)
                },
                showRetry(t, e) {
                    c(t, void 0, e)
                },
                mountTurnstile: t => (a?.(), a = null, s(), i.hidden = !0, i.removeAttribute("href"), r.hidden = !1, new Promise((e, n) => {
                    const o = t => {
                            window.removeEventListener("message", r), a = null, n(t instanceof Error ? t : new Error("inject"))
                        },
                        r = n => {
                            if (n.origin !== location.origin) return;
                            const r = n.data;
                            r && "skip-wait-dlsurf" === r.source && ("ready" !== r.type ? "token" !== r.type || "string" != typeof r.token ? "err" === r.type && o(new Error(r.err || "turnstile")) : t(r.token) : e())
                        };
                    window.addEventListener("message", r), a = () => window.removeEventListener("message", r), chrome.runtime.sendMessage({
                        type: "skip-wait-dlsurf-turnstile",
                        mountId: Fk
                    }).then(t => {
                        t?.ok || o(new Error("inject"))
                    }).catch(o)
                }))
            }
        },
        Vk = null,
        Zk = 0,
        Jk = "",
        Xk = !1,
        Kk = !1,
        Qk = !1,
        tb = null,
        eb = () => Wk.exec(location.pathname)?.[1] ?? null,
        nb = () => {
            tb?.isConnected && (tb.hidden = !1), tb = null
        },
        ob = () => document.getElementById(Hk),
        rb = () => {
            Zk += 1, Vk = null, Yk(), nb()
        },
        ib = (t, e) => t === Zk && eb() === e,
        ab = async () => {
            if (window !== window.top) return;
            if (Kk) return void(Qk = !0);
            const t = eb();
            if (!t) return void(Vk && rb());
            if (Vk === t && ob()) return;
            const e = (() => {
                for (const t of document.querySelectorAll("div.mt-4.flex.flex-col.gap-4.md\\:flex-row")) {
                    const e = [...t.querySelectorAll(':scope > button[data-slot="button"]')];
                    if (2 !== e.length) continue;
                    const n = e[0],
                        o = e[1];
                    if (n.classList.contains("md:flex-1") && o.classList.contains("md:flex-1") && [...o.classList].some(t => t.includes("amber")) && (n.classList.contains("bg-primary") || [...n.classList].some(t => t.includes("success") || t.includes("green")))) return t
                }
                return null
            })();
            if (!e) return;
            Kk = !0;
            const n = ++Zk;
            nb(), tb = e, e.hidden = !0;
            const o = () => {
                Yk(), nb(), Vk === t && (Vk = null)
            };
            try {
                if (Yk(), !ib(n, t) || !e.isConnected) return void o();
                const r = Gk(e);
                if (!ib(n, t) || !ob()) return void o();
                if (Vk = t, r.setStatus("Checking dl.surf account…"), !(await chrome.runtime.sendMessage({
                        type: "skip-wait-dlsurf-auth"
                    }).then(t => !0 === t?.ok).catch(() => !1))) return ib(n, t) && ob() ? (r.setStatus("Sign In required"), r.setError("Skip Wait needs a live dl.surf session (not just the profile name in the header). Sign in, then open the file again."), void r.showLogin(`/accounts/login?redirect=${encodeURIComponent(location.pathname)}`)) : void o();
                if (!ib(n, t) || !ob()) return void o();
                const i = async () => {
                    if (!ib(n, t) || !ob()) return;
                    r.setStatus("Complete the quick check below — then the file unlocks."), r.setError(null);
                    const e = (t => chrome.runtime.sendMessage({
                        type: "skip-wait-dlsurf-prefetch",
                        slug: t
                    }).then(t => "string" == typeof t?.token ? t.token : "").catch(() => ""))(t);
                    await r.mountTurnstile(o => {
                        ib(n, t) && ob() && (r.setStatus("Unlocking file…"), e.then(e => (async (t, e, n) => {
                            const o = await chrome.runtime.sendMessage({
                                type: "skip-wait-dlsurf-unlock",
                                slug: t,
                                captchaToken: e,
                                jwt: n
                            });
                            if (!0 === o?.ok) return o.url;
                            throw new Error(o && !1 === o.ok ? o.err : "unlock")
                        })(t, o, e)).then(e => {
                            ib(n, t) && ob() && (r.setStatus("Ready — tap Download File · Skip Wait when needed."), r.setError(null), r.showDownload(e), D())
                        }).catch(e => {
                            ib(n, t) && ob() && (r.setError((t => {
                                const e = t instanceof Error ? t.message : "";
                                return e && "unlock" !== e && "token" !== e && "download" !== e && "args" !== e && "empty" !== e ? e.startsWith("auth ") || e.includes("Refresh token") || /unauthor/i.test(e) ? "Session expired. Sign in on dl.surf, then open this file again." : e : "Could not unlock this file. Complete the check again, or sign in again if the session expired."
                            })(e)), r.setStatus("Unlock Failed"), r.showRetry("Try again", () => {
                                i()
                            }))
                        }))
                    })
                };
                await i()
            } catch {
                if (!ib(n, t)) return;
                o()
            } finally {
                Kk = !1, Qk && (Qk = !1, queueMicrotask(() => {
                    ab()
                }))
            }
        }, sb = () => {
            const t = location.pathname;
            if (t !== Jk) {
                Jk = t;
                const e = eb();
                Vk && e !== Vk && rb()
            }
            ab()
        }, cb = () => {
            if (Xk) return;
            Xk = !0, Jk = location.pathname;
            const t = t => function(...e) {
                const n = t.apply(this, e);
                return queueMicrotask(sb), n
            };
            history.pushState = t(history.pushState.bind(history)), history.replaceState = t(history.replaceState.bind(history)), window.addEventListener("popstate", sb)
        };
    var lb = "skip-wait-devuploads-overlay",
        ub = "skip-wait-devuploads-boot",
        db = /(\d+(?:\.\d+)?\s*[KMGT]?B)/i,
        mb = null,
        pb = !1,
        hb = (t, e) => e ? {
            lead: t || "Hang tight — unlocking your file.",
            detail: e
        } : {
            lead: t || "Hang tight — unlocking your file."
        },
        fb = () => {
            const t = kt(lb);
            if (document.documentElement.classList.add(t), document.getElementById(ub)) return;
            const e = document.createElement("style");
            e.id = ub, e.textContent = Lt(lb, t), (document.head || document.documentElement).appendChild(e)
        },
        wb = (t, e, n) => (fb(), mb ? (mb.setNote(hb(e, n)), mb.setStatus(t), mb.setError(null), mb) : mb = $t({
            id: lb,
            brand: "Skip Wait",
            note: hb(e, n),
            status: t
        })),
        gb = async (t, e, n) => {
            const o = wb("Resolving direct CDN…", e, n);
            try {
                const e = await (t => new Promise((e, n) => {
                    chrome.runtime.sendMessage({
                        type: "DEVUPLOADS_DOWNLOAD2",
                        id: t
                    }, t => {
                        chrome.runtime.lastError || !t?.url ? n(new Error("cdn")) : e(t.url)
                    })
                }))(t);
                o.setStatus("Ready — tap Direct Download when you want the file."), o.setAction(e, "Direct Download · Skip Wait — No Timer, No Mediator"), D()
            } catch {
                pb = !1, o.setAction(null), o.setError("Could not unlock this file. Reload and try again.")
            }
        }, yb = /^[a-z0-9]{8,16}$/i, kb = "skip-wait-dupload", bb = t => t.replace(/\.+$/, "").replace(/…+$/, ""), vb = (t, e = "") => e ? {
            lead: t || "Hang tight — unlocking your file.",
            detail: e
        } : {
            lead: t || "Hang tight — unlocking your file."
        }, Sb = () => {
            let t = null,
                e = null,
                n = 0,
                o = "",
                r = "",
                i = "";
            const a = () => {
                    null != e && (clearInterval(e), e = null)
                },
                s = () => `${o}${".".repeat(n+1)}`,
                c = () => {
                    t && (n = (n + 1) % 3, t.setStatus(s()))
                },
                l = () => {
                    n = 0, t && (t?.setNote(vb(r, i)), t.setStatus(s()), t.setError(null), null == e && (e = window.setInterval(c, 450)))
                },
                u = () => (document.documentElement.classList.add(kt(kb)), t || (t = $t({
                    id: kb,
                    brand: "Skip Wait",
                    note: vb(r, i),
                    status: s()
                }), t));
            return {
                progress: e => (o = bb(e.status), void 0 !== e.name && (r = e.name), void 0 !== e.size && (i = e.size), u(), l(), t),
                setReady: t => {
                    a(), o = bb(t.status), void 0 !== t.name && (r = t.name), void 0 !== t.size && (i = t.size);
                    const e = u();
                    return e.setNote(vb(r, i)), e.setStatus(o), e.setError(null), e.setAction(t.url, t.action), e
                },
                setError: (t, e, n) => {
                    a(), o = t;
                    const s = u();
                    return s.setAction(null), s.setNote(n ? {
                        lead: n
                    } : vb(r, i)), s.setStatus(t), s.setError(e), s
                }
            }
        }, Eb = "This file was deleted or is no longer available.", xb = null, Lb = !1, Cb = () => ({
            name: document.querySelector('form#my_form input[name="filename"]')?.value.trim() ?? "",
            size: document.querySelector('form#my_form input[name="size"]')?.value.trim() ?? ""
        }), Ib = /^\/([A-Za-z0-9]+)\/[^/]+$/i, Tb = "#free-captcha", $b = '[name="h-captcha-response"], [name="g-recaptcha-response"]', Ab = ['iframe[src*="hcaptcha.com"]', 'iframe[src*="newassets.hcaptcha.com"]'], qb = "skip-wait-freedlink-overlay", _b = "skip-wait-freedlink-boot", Mb = (t, e = "") => e ? {
            lead: t || "Unlocking your file.",
            detail: e
        } : {
            lead: t || "Unlocking your file."
        }, Ob = () => {
            let t = null,
                e = null,
                n = 0,
                o = "",
                r = "",
                i = "",
                a = "",
                s = "";
            const c = () => {
                    null != e && (clearInterval(e), e = null)
                },
                l = () => `${o}${".".repeat(n+1)}`,
                u = () => a ? s ? {
                    lead: a,
                    detail: s
                } : {
                    lead: a
                } : Mb(r, i),
                d = () => {
                    t?.setNote(u())
                },
                m = () => {
                    t && (n = (n + 1) % 3, t.setStatus(l()))
                },
                p = t => {
                    var e;
                    e = t.status, o = e.replace(/\.+$/, "").replace(/…+$/, ""), void 0 !== t.name && (r = t.name), void 0 !== t.size && (i = t.size), void 0 !== t.lead && (a = t.lead), void 0 !== t.detail && (s = t.detail)
                },
                h = () => ((() => {
                    const t = kt(qb);
                    if (document.documentElement.classList.add(t), document.getElementById(_b)) return;
                    const e = document.createElement("style");
                    e.id = _b, e.textContent = Lt(qb, t), (document.head || document.documentElement).appendChild(e)
                })(), t || (t = $t({
                    id: qb,
                    brand: "Skip Wait",
                    note: u(),
                    status: l(),
                    countdownLabel: "Available in"
                }), t));
            return {
                progress: o => (a = "", s = "", p(o), h(), n = 0, t && (d(), t.setStatus(l()), t.setError(null), null == e && (e = window.setInterval(m, 450))), t),
                hold: t => {
                    c(), p(t);
                    const e = h();
                    return d(), e.setStatus(o), e.setError(void 0 === t.error ? null : t.error), e.setAction(null), e.hideCountdown(), e
                },
                setReady: t => {
                    c(), a = "", s = "", p(t);
                    const e = h();
                    return e.setNote(Mb(r, i)), e.setStatus(o), e.setError(null), e.hideCountdown(), e.setAction(t.url, t.action), e
                },
                setError: (t, e, n) => {
                    c(), o = t, void 0 !== n && (a = n, s = "");
                    const r = h();
                    return r.setAction(null), r.hideCountdown(), r.setNote(u()), r.setStatus(t), r.setError(e), r
                },
                startCountdown: t => {
                    h().startCountdown(t)
                }
            }
        }, Rb = /<div class='alert alert-danger'>([\s\S]*?)<\/div>/i, Pb = /you have to wait\s+(?:(\d+)\s*minutes?\s*,?\s*)?(?:(\d+)\s*seconds?)?\s*till next download/i, Db = /frdl\.|freedl\.ink|fonts\.|googleapis|gstatic|cdnjs|cdn\.|jsdelivr|bootstrap|hcaptcha|googletagmanager/i, Nb = /\.(rar|zip|7z|tar|gz|apk|mp4|mkv|pdf|exe|iso|dmg)(\?|$)/i, Bb = t => t.replace(/&amp;/g, "&"), Ub = t => !(!/^https?:\/\//i.test(t) || Db.test(t)) && (!!/^https:\/\/fs\d+\./i.test(t) || (!!Nb.test(t) || !/\.html?(\?|$)/i.test(t))), Wb = () => document.querySelector('form[name="FREE1"]'), Hb = () => {
            const t = document.querySelector("h2.titlepage")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
            return /^file not found$/i.test(t) ? {
                title: t,
                detail: document.querySelector(".alert.alert-warning")?.textContent?.replace(/\s+/g, " ").trim() || "The file you were looking for could not be found, sorry for any inconvenience"
            } : null
        }, Fb = () => {
            for (const t of document.querySelectorAll(".alert.alert-danger")) {
                if ("failed" === t.id || t.closest("#adb-disable")) continue;
                const e = t.getAttribute("style") ?? "";
                if (/display\s*:\s*none/i.test(e)) continue;
                const n = t.textContent?.replace(/\s+/g, " ").trim() ?? "",
                    o = Pb.exec(n);
                if (!o) continue;
                const r = 60 * Number(o[1] ?? 0) + Number(o[2] ?? 0);
                if (!(r <= 0)) return {
                    message: n,
                    seconds: r
                }
            }
            return null
        }, zb = () => Hb() ? "missing" : Fb() ? "cooldown" : (() => {
            const t = Wb();
            return !!t?.querySelector("#downloadbtnfree") && !!t.querySelector("#free-captcha .h-captcha")
        })() ? "ready" : "unknown", jb = t => {
            for (const o of t.querySelectorAll($b)) {
                const t = o.value.trim();
                if (t.length > 20) return t
            }
            const e = t.querySelector(".h-captcha")?.getAttribute("data-hcaptcha-widget-id") ?? void 0,
                n = window.hcaptcha?.getResponse(e)?.trim() ?? "";
            return n.length > 20 ? n : ""
        }, Yb = (t, e) => {
            const n = new URLSearchParams;
            for (const o of t.elements)(o instanceof HTMLInputElement || o instanceof HTMLTextAreaElement) && o.name && !o.disabled && "button" !== o.type && "submit" !== o.type && n.set(o.name, o.value);
            for (const [o, r] of Object.entries(e)) n.set(o, r);
            return n
        }, Gb = (t, e, n) => {
            if (Ub(e)) return {
                url: e
            };
            if (/octet-stream|x-rar|x-zip|x-7z-compressed|force-download/i.test(n)) return {
                url: e
            };
            const o = t.match(/http-equiv="refresh"[^>]*content="[^;]*;\s*url=([^"]+)"/i)?.[1];
            if (o && Ub(Bb(o))) return {
                url: Bb(o)
            };
            const r = t.match(/window\.location(?:\.href)?\s*=\s*['"](https?:\/\/[^'"]+)['"]/i)?.[1];
            if (r && Ub(Bb(r))) return {
                url: Bb(r)
            };
            const i = (t => {
                for (const e of t.matchAll(/href="(https?:\/\/[^"]+)"/gi)) {
                    const t = Bb(e[1] ?? "");
                    if (Ub(t)) return t
                }
                return null
            })(t);
            if (i) return {
                url: i
            };
            const a = t.match(Rb)?.[1],
                s = a ? a.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() : void 0;
            if (s) {
                const t = Pb.exec(s);
                if (t) {
                    const e = 60 * Number(t[1] ?? 0) + Number(t[2] ?? 0);
                    if (e > 0) return {
                        serverError: s,
                        cooldownSeconds: e
                    }
                }
                return {
                    serverError: s
                }
            }
            return {}
        }, Vb = class extends Error {
            code;
            cooldownSeconds;
            constructor(t, e, n) {
                super(e ?? t), this.code = t, this.cooldownSeconds = n, this.name = "FreedlinkError"
            }
        };
    var Zb = "Checking this file",
        Jb = "Reading your file",
        Xb = "File not found",
        Kb = "Download cooldown",
        Qb = "This site requires a wait before the next free download.",
        tv = "Waiting for the cooldown to end",
        ev = "Confirm you're human.",
        nv = "Complete the check below. Download unlocks automatically when it succeeds.",
        ov = "Waiting for captcha",
        rv = "Captcha rejected",
        iv = "Getting your download",
        av = "Ready — tap Direct Download when you want the file",
        sv = "Download unlock failed",
        cv = "Could not identify this page",
        lv = "No file page, free download form, or cooldown message was found.",
        uv = null,
        dv = !1,
        mv = () => {
            const t = location.pathname.split("/").pop() ?? "";
            try {
                return decodeURIComponent(t.replace(/\.html?$/i, ""))
            } catch {
                return t.replace(/\.html?$/i, "")
            }
        },
        pv = () => ({
            name: mv(),
            size: document.querySelector(".download-page .badge")?.textContent?.replace(/\s+/g, " ").trim() ?? ""
        }),
        hv = (t, e) => {
            uv.hold({
                status: tv,
                ...pv(),
                lead: Kb,
                detail: Qb,
                error: e
            }), uv.startCountdown(Date.now() + 1e3 * t), window.setTimeout(() => location.reload(), 1e3 * t + 500)
        },
        fv = async () => {
            const t = Wb(),
                e = pv();
            if (uv.progress({
                    status: Jb,
                    ...e
                }), !t) return void uv.setError(sv, "Free download form (FREE1) was not found.");
            const n = (t => {
                const e = t.querySelector(Tb);
                e && (e.style.display = "block");
                const n = t.querySelector("#download_free");
                return n && (n.value = "1"), t.querySelector(`${Tb} .h-captcha`)
            })(t);
            if (!n) return void uv.setError(sv, "Free hCaptcha widget was not found.");
            const o = uv.hold({
                status: ov,
                ...e,
                lead: ev,
                detail: nv
            });
            let r = null,
                i = !1,
                a = !1;
            const s = () => {
                    r || (n.id || (n.id = "skip-wait-freedlink-hcaptcha"), r = Nt({
                        overlayId: "skip-wait-freedlink-overlay",
                        mount: o.turnstileMount,
                        widgetId: n.id,
                        styleId: "skip-wait-freedlink-hcaptcha-pin",
                        alsoVisibleSelectors: Ab
                    }))
                },
                c = async () => {
                    if (!a && !i) {
                        a = !0, r?.(), r = null, uv.progress({
                            status: iv,
                            ...pv()
                        });
                        try {
                            const e = await async function(t) {
                                const e = jb(t);
                                if (!e) throw new Vb("captcha", "Captcha token missing");
                                const n = await fetch(t.action || location.href, {
                                        method: "POST",
                                        credentials: "include",
                                        redirect: "follow",
                                        headers: {
                                            Accept: "text/html,*/*",
                                            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                                        },
                                        body: Yb(t, {
                                            download_free: "1",
                                            adblock_detected: "0",
                                            "h-captcha-response": e,
                                            "g-recaptcha-response": e
                                        }).toString()
                                    }),
                                    o = Gb(await n.text(), n.url, n.headers.get("content-type") ?? "");
                                if (o.url) return o.url;
                                if (o.cooldownSeconds) throw new Vb("cooldown", o.serverError ?? "Cooldown required", o.cooldownSeconds);
                                const r = o.serverError ?? "";
                                if (/wrong captcha/i.test(r)) throw new Vb("captcha", r);
                                if (r) throw new Vb("unlock", r);
                                throw new Vb("unlock", "Download link not found in response")
                            }(t);
                            i = !0, uv.setReady({
                                status: av,
                                ...pv(),
                                url: e,
                                action: "Direct Download · Skip Wait — No Timer"
                            }), D()
                        } catch (e) {
                            if (a = !1, e instanceof Vb && "cooldown" === e.code && e.cooldownSeconds) return i = !0, void hv(e.cooldownSeconds, e.message);
                            if (e instanceof Vb && "captcha" === e.code) return (t => {
                                const e = t.querySelector(".h-captcha")?.getAttribute("data-hcaptcha-widget-id") ?? void 0;
                                window.hcaptcha?.reset(e);
                                for (const n of t.querySelectorAll($b)) n.value = ""
                            })(t), uv.hold({
                                status: rv,
                                ...pv(),
                                lead: ev,
                                detail: nv,
                                error: e.message
                            }), r = null, s(), void requestAnimationFrame(l);
                            i = !0, uv.setError(sv, e instanceof Vb ? e.message : "Could not get a download link.")
                        }
                    }
                }, l = () => {
                    i || a || (s(), jb(t) ? c() : requestAnimationFrame(l))
                };
            requestAnimationFrame(l)
        };
    var wv = "skip-wait-earn4link-med",
        gv = "skip-wait-earn4link-med-boot",
        yv = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        kv = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        bv = !1,
        vv = t => {
            const e = document.cookie.match(new RegExp(`(?:^|;\\s*)${t}=([^;]*)`));
            return e?.[1] ? decodeURIComponent(e[1]) : null
        },
        Sv = () => {
            for (const e of [vv("url"), new URLSearchParams(location.search).get("id")]) {
                const t = e?.trim();
                if (t && yv.test(t)) return t
            }
            const t = location.pathname.replace(/^\/+|\/+$/g, "");
            return t && !t.includes("/") && yv.test(t) ? t : null
        },
        Ev = t => {
            const e = kt(wv);
            if (document.documentElement.classList.add(e), !document.getElementById(gv)) {
                const t = document.createElement("style");
                t.id = gv, t.textContent = Lt(wv, e), (document.head || document.documentElement).appendChild(t)
            }
            document.getElementById(wv) || $t({
                id: wv,
                brand: "Skip Wait",
                note: kv,
                status: t
            })
        },
        xv = () => {
            if (bv) return;
            const t = Sv();
            if (!t) return;
            const e = location.hostname.toLowerCase();
            /\/myphp\.php$/i.test(location.pathname) ? Ev("Skipping mediator…") : (bv = !0, Ev("Skipping mediator…"), rt(e, ["open2get.in"]) ? location.replace(`https://best-hosting.ffindia.in/myphp.php?id=${encodeURIComponent(t)}&site=e4l`) : rt(e, ["hosting.ffindia.in"]) ? location.replace("https://best-hosting.ffindia.in/") : location.replace(`https://m.earn4link.in/${encodeURIComponent(t)}`))
        };
    var Lv = "skip-wait-earn4link-overlay",
        Cv = "skip-wait-earn4link-boot",
        Iv = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        Tv = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        $v = null,
        Av = !1,
        qv = !1,
        _v = swDelay,
        Mv = t => {
            const e = kt(Lv);
            if (document.documentElement.classList.add(e), !document.getElementById(Cv)) {
                const t = document.createElement("style");
                t.id = Cv, t.textContent = Lt(Lv, e), (document.head || document.documentElement).appendChild(t)
            }
            return $v ? ($v.setStatus(t), $v) : $v = $t({
                id: Lv,
                brand: "Skip Wait",
                note: Tv,
                status: t,
                countdownLabel: "Your link opens in"
            })
        },
        Ov = () => {
            const t = location.pathname.replace(/^\/+|\/+$/g, "");
            return !!t && !t.includes("/") && Iv.test(t)
        },
        Rv = () => !!document.querySelector('#go-link input[name="ad_form_data"]'),
        Pv = async () => {
            if (Av || !Rv()) return;
            Av = !0, (() => {
                chrome.runtime.sendMessage({
                    type: "INJECT_VISIBILITY_SPOOF"
                }).catch(() => {});
                try {
                    document.cookie = "ab=1; path=/"
                } catch {}
                try {
                    const t = window;
                    t.blurred = !1, t.onblur = null, t.onfocus = null
                } catch {}
                try {
                    const t = window.app_vars;
                    t && (t.force_disable_adblock = "0")
                } catch {}
            })();
            const t = Mv("Unlocking…"),
                e = Te(document.documentElement.outerHTML, location.href);
            if (!e) return void(Av = !1);
            let n = await $e(e, location.href);
            if (!n) {
                const o = (() => {
                    const t = document.documentElement.innerHTML.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                    if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                    const e = parseInt(document.querySelector("#timer")?.textContent?.trim() ?? "", 10);
                    return Number.isFinite(e) && e > 0 ? e : 1
                })();
                t.setStatus("Waiting for timer…"), t.startCountdown(Date.now() + 1e3 * o), await _v(1e3 * o + 400), t.hideCountdown(), t.setStatus("Unlocking…"), n = await $e(e, location.href);
                for (let t = 0; !n && t < 8; t++) await _v(250), n = await $e(e, location.href)
            }
            if (!n) return Av = !1, void t.setError("Could not unlock. Refresh and try again.");
            t.setStatus("Opening…"), D(), location.replace(n)
        }, Dv = () => {
            if (!Ov()) return;
            if (Mv("Getting things ready…"), Rv()) return void Pv();
            if (qv) return;
            const t = (() => {
                const t = document.documentElement.innerHTML;
                return t.match(/http-equiv=["']?refresh[^>]*url=([^"'\s>]+)/i)?.[1] || t.match(/window\.location(?:\.href)?\s*=\s*['"](https?:\/\/[^'"]+)['"]/i)?.[1] || null
            })();
            t && /^https?:\/\//i.test(t) && (qv = !0, location.replace(t))
        };
    var Nv = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/,
        Bv = "skip-wait-earnlinks",
        Uv = (() => {
            let t = null,
                e = null,
                n = 0,
                o = "",
                r = "",
                i = "";
            const a = () => `${o}${".".repeat(n+1)}`,
                s = () => {
                    t && (n = (n + 1) % 3, t.setStatus(a()))
                },
                c = () => {
                    n = 0, t && (t?.setNote({
                        lead: r,
                        detail: i
                    }), t.setStatus(a()), null == e && (e = window.setInterval(s, 450)))
                },
                l = () => (document.documentElement.classList.add(kt(Bv)), t || (t = $t({
                    id: Bv,
                    brand: "Skip Wait",
                    note: {
                        lead: r,
                        detail: i
                    },
                    status: a(),
                    countdownLabel: "Your link opens in"
                }), t));
            return {
                progress: e => {
                    var n;
                    return n = e.status, o = n.replace(/\.+$/, ""), r = e.lead, i = e.detail, l(), c(), t
                },
                setError: t => {
                    null != e && (clearInterval(e), e = null), o = t, r = "Something went wrong.", i = "Reload the short link and try again.";
                    const n = l();
                    return n.setStatus(t), n.setNote({
                        lead: r,
                        detail: i
                    }), n.setError(t), n
                }
            }
        })(),
        Wv = async t => {
            const e = t => {
                "EARNLINKS_PROGRESS" === t.type && t.status && t.lead && t.detail && Uv.progress({
                    lead: t.lead,
                    detail: t.detail,
                    status: t.status
                })
            };
            chrome.runtime.onMessage.addListener(e);
            try {
                let e;
                Uv.progress({
                    lead: "Hang tight — unlocking your link.",
                    detail: "Skip Wait is working. You don't need to tap anything.",
                    status: "Opening your short link"
                });
                try {
                    e = new URL(t).hostname
                } catch {
                    return void Uv.setError("Invalid unlock link.")
                }
                if (!(await nt(e, "earnlinks"))) return void Uv.setError("Earnlinks is not available.");
                const n = await (t => new Promise((e, n) => {
                    chrome.runtime.sendMessage({
                        type: "EARNLINKS_RESOLVE",
                        unlockUrl: t
                    }, t => {
                        !chrome.runtime.lastError && t?.ok && t.dest ? e(t.dest) : n(new Error("resolve"))
                    })
                }))(t);
                D(), location.replace(n)
            } catch {
                Uv.setError("Could not unlock.")
            } finally {
                chrome.runtime.onMessage.removeListener(e)
            }
        }, Hv = "skip-wait-reshortfly", Fv = "skip-wait-reshortfly-boot", zv = /^(?=.*[A-Za-z])[A-Za-z0-9]{3,}$/, jv = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        }, Yv = null, Gv = !1, Vv = swDelay, Zv = (t = "Getting things ready…") => ((() => {
            const t = kt(Hv);
            if (document.documentElement.classList.add(t), document.getElementById(Fv)) return;
            const e = document.createElement("style");
            e.id = Fv, e.textContent = Lt(Hv, t), (document.head || document.documentElement).appendChild(e)
        })(), Yv ? (Yv.setStatus(t), Yv.setError(null), Yv) : Yv = $t({
            id: Hv,
            brand: "Skip Wait",
            note: jv,
            status: t,
            countdownLabel: "Your link opens in"
        })), Jv = () => Boolean(document.querySelector('#go-link, form[action*="/links/go"]') && document.querySelector('input[name="ad_form_data"]')), Xv = () => {
            const t = Te(document.documentElement.innerHTML, location.href);
            return t ? $e(t, location.href) : Promise.resolve(null)
        }, Kv = async () => {
            if (Gv || !Jv()) return;
            Gv = !0, chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {}), (() => {
                try {
                    document.cookie = "ab=1; path=/"
                } catch {}
                try {
                    const t = window;
                    t.blurred = !1, t.onblur = null, t.onfocus = null
                } catch {}
                try {
                    const t = window.app_vars;
                    t && (t.force_disable_adblock = "0")
                } catch {}
            })();
            const t = Zv("Getting things ready…"),
                e = (() => {
                    const t = document.documentElement.innerHTML.match(/["']counter_value["']\s*:\s*["']?(\d+)/);
                    if (t?.[1]) return Math.max(0, parseInt(t[1], 10));
                    const e = parseInt(document.querySelector("#timer")?.textContent?.trim() ?? "", 10);
                    return Number.isFinite(e) && e > 0 ? e : 0
                })();
            e > 0 && (t.setStatus("Waiting for the short timer…"), t.startCountdown(Date.now() + 1e3 * e), await Vv(1e3 * e), t.hideCountdown()), t.setStatus("Unlocking your link…");
            let n = await Xv();
            if (!n) {
                const t = Date.now() + 3e3;
                for (; !n && Date.now() < t;) await Vv(250), n = await Xv()
            }
            if (!n) return t.setStatus("Couldn’t unlock this link. Reload and try again."), void(Gv = !1);
            t.setStatus("Opening your link…"), D(), location.replace(n)
        }, Qv = () => {
            !Gv && Jv() && (Zv("Getting things ready…"), Kv())
        }, tS = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{8,}$/, eS = "skip-wait-alpharede", nS = (() => {
            let t = null,
                e = null,
                n = 0,
                o = "",
                r = "",
                i = "";
            const a = () => `${o}${".".repeat(n+1)}`,
                s = () => {
                    t && (n = (n + 1) % 3, t.setStatus(a()))
                },
                c = () => {
                    n = 0, t && (t?.setNote({
                        lead: r,
                        detail: i
                    }), t.setStatus(a()), null == e && (e = window.setInterval(s, 450)))
                },
                l = () => (document.documentElement.classList.add(kt(eS)), t || (t = $t({
                    id: eS,
                    brand: "Skip Wait",
                    note: {
                        lead: r,
                        detail: i
                    },
                    status: a(),
                    countdownLabel: "Your link opens in"
                }), t));
            return {
                progress: e => {
                    var n;
                    return n = e.status, o = n.replace(/\.+$/, ""), r = e.lead, i = e.detail, l(), c(), t
                },
                setError: t => {
                    null != e && (clearInterval(e), e = null), o = t, r = "Something went wrong.", i = "Reload the short link and try again.";
                    const n = l();
                    return n.setStatus(t), n.setNote({
                        lead: r,
                        detail: i
                    }), n.setError(t), n
                }
            }
        })(), oS = async t => {
            const e = t => {
                "ALPHAREDE_PROGRESS" === t.type && t.status && t.lead && t.detail && nS.progress({
                    lead: t.lead,
                    detail: t.detail,
                    status: t.status
                })
            };
            chrome.runtime.onMessage.addListener(e);
            try {
                let e;
                nS.progress({
                    lead: "Hang tight — unlocking your link.",
                    detail: "Skip Wait is working. You don't need to tap anything.",
                    status: "Opening your short link"
                });
                try {
                    e = new URL(t).hostname
                } catch {
                    return void nS.setError("Invalid unlock link.")
                }
                if (!(await nt(e, "alpharede"))) return void nS.setError("Alpharede is not available.");
                const n = await (t => new Promise((e, n) => {
                    chrome.runtime.sendMessage({
                        type: "ALPHAREDE_RESOLVE",
                        unlockUrl: t
                    }, t => {
                        !chrome.runtime.lastError && t?.ok && t.dest ? e(t.dest) : n(new Error("resolve"))
                    })
                }))(t);
                D(), location.replace(n)
            } catch {
                nS.setError("Could not unlock.")
            } finally {
                chrome.runtime.onMessage.removeListener(e)
            }
        }, rS = /^[a-z0-9]{4,16}$/i, iS = "skip-wait-finityrede-overlay", aS = "skip-wait-finityrede-boot", sS = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        }, cS = null, lS = !1, uS = t => ((() => {
            const t = kt(iS);
            if (document.documentElement.classList.add(t), document.getElementById(aS)) return;
            const e = document.createElement("style");
            e.id = aS, e.textContent = Lt(iS, t), (document.head ?? document.documentElement).appendChild(e)
        })(), cS ? (cS.setStatus(t), cS.setError(null), cS) : cS = $t({
            id: iS,
            brand: "Skip Wait",
            note: sS,
            status: t
        })), dS = "skip-wait-10drives-overlay", mS = "skip-wait-10drives-boot", pS = /https:\/\/10drives\.com\/op\/dl\/[^"'\s<>]+/i, hS = /window\.open\("(https:\/\/gamesmain\.xyz\/[^"]+)"/i, fS = /<strong[^>]*>([^<]+)<\/strong>\s*<span[^>]*>File Size:\s*([^<]+)<\/span>/i, wS = null, gS = !1, yS = (t, e = "") => e ? {
            lead: t || "Hang tight — unlocking your file.",
            detail: e
        } : {
            lead: t || "Hang tight — unlocking your file."
        }, kS = t => {
            const e = t.match(fS);
            return {
                name: e?.[1]?.replace(/\s+/g, " ").trim() ?? "",
                size: e?.[2]?.trim() ?? ""
            }
        }, bS = t => {
            const e = t.match(/\/op\/dl\/\d+\/[^/]+\/([^/]+)/);
            if (!e?.[1]) return "";
            try {
                const t = e[1] + "=".repeat((4 - e[1].length % 4) % 4);
                return atob(t).split("|")[0]?.trim() ?? ""
            } catch {
                return ""
            }
        }, vS = (t, e, n = "") => ((() => {
            const t = kt(dS);
            if (document.documentElement.classList.add(t), document.getElementById(mS)) return;
            const e = document.createElement("style");
            e.id = mS, e.textContent = Lt(dS, t), (document.head ?? document.documentElement).appendChild(e)
        })(), wS ? (wS.setNote(yS(e, n)), wS.setStatus(t), wS.setError(null), wS) : wS = $t({
            id: dS,
            brand: "Skip Wait",
            note: yS(e, n),
            status: t
        })), SS = async t => {
            const e = await fetch(t, {
                credentials: "include",
                cache: "no-store"
            });
            if (!e.ok) throw new Error("fetch");
            return e.text()
        }, ES = "skip-wait-tech8s-gate", xS = "skip-wait-tech8s-gate-boot", LS = /^\/safe2?\.php$/i, CS = /^\/st$/i, IS = /^tp\d+$/i, TS = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        }, $S = null, AS = !1, qS = !1, _S = () => {
            const t = kt(ES);
            if (document.documentElement.classList.add(t), document.getElementById(xS)) return;
            const e = document.createElement("style");
            e.id = xS, e.textContent = Lt(ES, t), (document.head ?? document.documentElement).appendChild(e)
        }, MS = (t = "Getting things ready…") => (_S(), $S ? ($S.setNote(TS), $S.setStatus(t), $S.setError(null), $S) : $S = $t({
            id: ES,
            brand: "Skip Wait",
            note: TS,
            status: t
        })), OS = (t, e) => {
            const n = (t => {
                const e = t?.trim();
                return e && /^https?:\/\//i.test(e) ? e : null
            })(new URL(t.trim(), e).href);
            if (!n) throw new Error("tech8s href");
            return n
        }, RS = (t, e) => {
            if (qS) {
                const n = t.querySelector('a[href*="/includes/open.php?"]')?.getAttribute("href");
                return n ? OS(n, e) : null
            }
            const n = t.querySelector("a#go_d2[href]")?.getAttribute("href");
            return n ? OS(n, e) : null
        }, PS = (t, e) => {
            const n = t.querySelector('form[name="tp"]');
            if (!n) return null;
            const o = {};
            for (const i of n.querySelectorAll("input[name]")) IS.test(i.name) && (o[i.name] = i.value ?? "");
            if (!Object.keys(o).length) return null;
            const r = n.getAttribute("action")?.trim() || e;
            return {
                action: new URL(r, e).href,
                fields: o
            }
        }, DS = () => !!PS(document, location.href) || !!RS(document, location.href), NS = async t => {
            const e = await fetch(t.action, {
                method: "POST",
                body: new URLSearchParams(t.fields),
                credentials: "include",
                headers: {
                    Accept: "text/html,application/xhtml+xml",
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                }
            });
            if (!e.ok) throw new Error("tech8s post");
            return {
                html: await e.text(),
                base: e.url || t.action
            }
        }, BS = () => {
            !AS && DS() && (AS = !0, (async () => {
                const t = MS("Skipping blog steps…"),
                    e = RS(document, location.href),
                    n = PS(document, location.href);
                if (e && !n) return t.setStatus("Opening next step…"), void location.replace(e);
                if (!n) throw new Error("tech8s gate");
                let o = document.documentElement.outerHTML,
                    r = location.href;
                for (let i = 0; i < 8; i++) {
                    const e = (new DOMParser).parseFromString(o, "text/html"),
                        n = PS(e, r);
                    if (!n) {
                        const n = RS(e, r);
                        if (!n) throw new Error("tech8s terminal");
                        return t.setStatus("Opening next step…"), void location.replace(n)
                    }
                    t.setStatus(0 === i ? "Unlocking blog gate…" : `Skipping step ${i+1}…`), ({
                        html: o,
                        base: r
                    } = await NS(n))
                }
                throw new Error("tech8s hops")
            })().catch(() => {
                MS().setError("Unlock failed. Reload and try again.")
            }))
        }, US = "skip-wait-tech8s-adrinolinks", WS = "skip-wait-tech8s-adrinolinks-boot", HS = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/, FS = /https:\/\/[^\s"'<>]+\/safe\.php\?link=[A-Za-z0-9]+/i, zS = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        }, jS = !1, YS = () => {
            if (jS || !(() => {
                    const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                    if (1 !== t.length) return null;
                    const e = t[0];
                    return HS.test(e) ? e : null
                })()) return;
            const t = (() => {
                const t = document.documentElement.innerHTML;
                return FS.exec(t)?.[0]?.trim() ?? null
            })();
            t && (jS = !0, (t => {
                const e = kt(US);
                if (document.documentElement.classList.add(e), !document.getElementById(WS)) {
                    const t = document.createElement("style");
                    t.id = WS, t.textContent = Lt(US, e), (document.head ?? document.documentElement).appendChild(t)
                }
                document.getElementById(US) || $t({
                    id: US,
                    brand: "Skip Wait",
                    note: zS,
                    status: t
                })
            })("Skipping AdrinoLinks gate…"), location.replace(t))
        }, GS = "skip-wait-tech8s-redirect", VS = "skip-wait-tech8s-redirect-boot", ZS = /^\/safe2?\.php$/i, JS = /^\/st$/i, XS = /window\.location\.href\s*=\s*["']([^"']+)["']/, KS = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        }, QS = t => {
            const e = kt(GS);
            if (document.documentElement.classList.add(e), !document.getElementById(VS)) {
                const t = document.createElement("style");
                t.id = VS, t.textContent = Lt(GS, e), (document.head ?? document.documentElement).appendChild(t)
            }
            document.getElementById(GS) || $t({
                id: GS,
                brand: "Skip Wait",
                note: KS,
                status: t
            })
        }, tE = t => {
            const e = t?.trim();
            return e && /^https?:\/\//i.test(e) ? e : null
        };
    var eE = /var\s+data\s*=\s*(\{[\s\S]*?\});/,
        nE = /var\s+link\s*=\s*'([^']+)'/,
        oE = /const\s+secureLink\s*=\s*"([^"]+)"/,
        rE = /location\.pathname\s*\+\s*['"]\?secure_dl=1['"]/,
        iE = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        aE = null,
        sE = !1,
        cE = t => aE ? (aE.setStatus(t), aE) : aE = $t({
            id: "skip-wait-shycloud-overlay",
            brand: "Skip Wait",
            note: iE,
            status: t,
            countdownLabel: "Your link opens in"
        }),
        lE = () => {
            for (const t of document.scripts) {
                const e = eE.exec(t.textContent ?? "")?.[1];
                if (e) try {
                    return JSON.parse(e)
                } catch {}
            }
            return null
        },
        uE = t => {
            const e = t?.trim();
            return e && /^https?:\/\//i.test(e) ? e : null
        },
        dE = () => uE(nE.exec(document.documentElement.innerHTML)?.[1]),
        mE = () => uE(oE.exec(document.documentElement.innerHTML)?.[1]),
        pE = () => new URLSearchParams(location.search).has("secure_dl"),
        hE = async (t, e = !1) => {
            const n = cE("Starting download…");
            e && await fetch(new URL("iii/index.php?action=flush_session", location.href).href, {
                credentials: "include"
            }), /^https?:\/\//i.test(t) && D(), (t => {
                const e = Object.assign(document.createElement("a"), {
                    href: t,
                    rel: "noopener"
                });
                e.style.display = "none", document.body.append(e), e.click(), e.remove()
            })(t), n.remove(), aE = null
        }, fE = () => {
            if (sE || pE()) return;
            if (!pE() && rE.test(document.documentElement.innerHTML)) return sE = !0, (() => {
                const t = window.setTimeout(() => {}, 0);
                for (let e = 0; e <= t; e++) window.clearTimeout(e), window.clearInterval(e)
            })(), void hE(`${location.pathname}?secure_dl=1`);
            if (document.getElementById("dlBtn") && mE()) {
                const t = mE();
                if (!t) return;
                return sE = !0, void hE(t, !0)
            }
            if (document.getElementById("finalDlBtn") && dE()) {
                const t = dE();
                if (!t) return;
                return sE = !0, void(t => {
                    cE("Opening your link…"), D(), location.replace(t)
                })(t)
            }
            if (!(() => {
                    const t = document.getElementById("continueBtn");
                    if (!(t instanceof HTMLButtonElement) || /expired/i.test(t.textContent ?? "")) return !1;
                    const e = lE();
                    return !!e?.canPost && !!e.basename
                })()) return;
            const t = lE();
            t?.canPost && t.basename && (sE = !0, cE("Decoding your link…"), (t => {
                const e = document.createElement("form");
                e.method = "POST", e.action = t.actionUrl ?? `${location.origin}/`;
                const n = {
                    cf_cache_buster: String(Date.now()),
                    system_route: "ii",
                    basename: t.basename ?? ""
                };
                t.post_title && (n.post_title = t.post_title), t.post_link && (n.post_link = t.post_link);
                for (const [o, r] of Object.entries(n)) e.appendChild(Object.assign(document.createElement("input"), {
                    type: "hidden",
                    name: o,
                    value: r
                }));
                document.body.append(e), e.submit()
            })(t))
        };
    var wE = "Free Download · Skip Wait — Direct CDN, No Mediator",
        gE = "Skip Wait — Resolving CDN…",
        yE = "Skip Wait — Complete check & retry",
        kE = /href=["']\s*(https?:\/\/[^"'\s]*userdrive\.org[^"'\s]*)/i,
        bE = /alveridium\.xyz|downstack\.space|quickfetchy\.site|distributionmorning\.cfd/i;
    async function vE(t) {
        await
        function(t) {
            return t.querySelector('.cf-turnstile, [name="cf-turnstile-response"]') ? new Promise((e, n) => {
                const o = Date.now(),
                    r = () => {
                        const i = t.querySelector('[name="cf-turnstile-response"]')?.value.trim();
                        return i && i.length > 20 ? e() : Date.now() - o > 9e4 ? n(new Error("turnstile")) : void setTimeout(r, 200)
                    };
                r()
            }) : Promise.resolve()
        }(t);
        const e = new URLSearchParams;
        for (const r of t.querySelectorAll("input[name], textarea[name]")) e.append(r.name, r.value);
        const n = await fetch(location.href, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: e
            }),
            o = kE.exec(await n.text())?.[1]?.trim();
        if (!o) throw new Error("cdn");
        return o
    }
    var SE = /^\/download\/([A-Za-z0-9]+)(?:\/|$)/i,
        EE = "skip-wait-vexfile-overlay",
        xE = "skip-wait-vexfile-boot",
        LE = "skip-wait-vexfile-turnstile-gate",
        CE = "data-sw-vex-pin",
        IE = /\/d_bucket\/[A-Za-z0-9]+/,
        TE = /(\d+(?:\.\d+)?\s*[KMGT]?B)/i,
        $E = "Direct Download · Skip Wait — No Timer, No Mediator",
        AE = ["#captcha-form", ".cf-turnstile", 'iframe[src*="challenges.cloudflare.com"]', 'iframe[src*="turnstile"]', 'div[id^="cf-chl-widget"]'],
        qE = null,
        _E = !1,
        ME = swDelay,
        OE = (t, e) => e ? {
            lead: t,
            detail: e
        } : {
            lead: t
        },
        RE = () => "1" === document.documentElement.getAttribute("data-sw-vex-verified"),
        PE = (t, e, n) => ((() => {
            if (document.getElementById(xE)) return;
            const t = document.createElement("style");
            t.id = xE, t.textContent = Lt(EE, kt(EE)), (document.head ?? document.documentElement).appendChild(t)
        })(), document.documentElement.classList.add(kt(EE)), qE ? (qE.setNote(OE(e, n)), qE.setStatus(t), qE.setError(null), qE) : qE = $t({
            id: EE,
            brand: "Skip Wait",
            note: OE(e, n),
            status: t
        })),
        DE = async t => {
            t.setStatus("Complete the Turnstile check below.");
            let e = null,
                n = "";
            const o = () => {
                    e?.(), e = null, n = ""
                },
                r = () => {
                    const r = document.querySelector(".cf-turnstile");
                    r && (r.id || (r.id = "skip-wait-vexfile-turnstile"), (t => {
                        const e = kt(EE),
                            n = [];
                        for (let r = t.parentElement, i = 0; r && r !== document.body && r !== document.documentElement; r = r.parentElement, i++) r.setAttribute(CE, String(i)), n.push(`[${CE}="${i}"]`);
                        let o = document.getElementById(LE);
                        o || (o = document.createElement("style"), o.id = LE, (document.head ?? document.documentElement).appendChild(o)), o.textContent = n.map(t => `html.${e} ${t}{z-index:auto!important;transform:none!important;filter:none!important;perspective:none!important;isolation:auto!important;contain:none!important;overflow:visible!important;opacity:1!important}`).join("") + AE.map(t => `html.${e} ${t},html.${e} ${t} *{visibility:visible!important;pointer-events:auto!important;opacity:1!important}`).join("") + `html.${e}>iframe[src*="challenges.cloudflare.com"],html.${e}>iframe[src*="turnstile"],html.${e} iframe[src*="challenges.cloudflare.com"],html.${e} iframe[src*="turnstile"]{display:block!important;visibility:visible!important;pointer-events:auto!important;opacity:1!important;z-index:2147483647!important}`
                    })(r), e && n === r.id && document.getElementById(r.id) || (o(), n = r.id, e = Nt({
                        overlayId: EE,
                        mount: t.turnstileMount,
                        widgetId: r.id,
                        styleId: "skip-wait-vexfile-captcha-pin",
                        alsoVisibleSelectors: AE
                    })))
                },
                i = Date.now();
            for (; Date.now() - i < 18e4;) {
                if (r(), RE()) return o;
                await ME(200)
            }
            throw o(), new Error("turnstile")
        }, NE = async () => {
            const t = {
                    name: document.querySelector(".download-block h4")?.textContent?.replace(/\s+/g, " ").trim() ?? "",
                    size: document.querySelector(".file-size")?.textContent?.match(TE)?.[1]?.replace(/\s+/g, " ").trim() ?? ""
                },
                e = PE("Getting things ready…", t.name, t.size);
            let n = null;
            try {
                const t = document.querySelector('a.generate-link[href*="d_bucket"]')?.href;
                if (t) return e.setStatus("Ready — tap Direct Download when you want the file."), e.setAction(t, $E), void D();
                n = await DE(e), e.setStatus("Resolving direct CDN…");
                const o = await (async () => {
                    const t = document.querySelector("a.generate-link")?.href;
                    if (!t) throw new Error("step2");
                    const e = await fetch(t, {
                        credentials: "include",
                        cache: "no-store"
                    });
                    if (!e.ok) throw new Error("step2");
                    const n = (await e.text()).match(IE)?.[0];
                    if (!n) throw new Error("bucket");
                    return new URL(n, location.origin).href
                })();
                n(), e.setStatus("Ready — tap Direct Download when you want the file."), e.setAction(o, $E), D()
            } catch {
                n?.(), _E = !1, e.setAction(null), e.setError("Could not unlock this file. Complete Turnstile if shown, then reload.")
            }
        }, BE = /^\/([a-z0-9]+)\/?$/i, UE = new Set(["admin", "banners", "change_lang", "contact", "dashboard", "login", "make_money", "mass_dmca", "monitor", "payment_proof", "premium", "register", "report_files"]), WE = "skipwait-mega4upload";
    async function HE(t) {
        const e = await fetch(`https://mega4upload.net/cgi-bin/tracker.cgi?file_code=${encodeURIComponent(t)}`, {
            credentials: "include"
        });
        return e.ok ? function(t) {
            const e = new TextDecoder("latin1").decode(new Uint8Array(t)),
                n = e.indexOf("8:url-list"),
                o = -1 === n ? null : e.slice(n + 10).match(/^(\d+):/);
            if (!o?.[1]) return null;
            const r = n + 10 + o[0].length,
                i = e.slice(r, r + Number(o[1]));
            return i.startsWith("https://") ? i : null
        }(await e.arrayBuffer()) : null
    }

    function FE(t, e) {
        if (!t || document.getElementById(WE)) return;
        const n = Object.assign(document.createElement("div"), {
            id: WE,
            innerHTML: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex:0 0 auto"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><div><div style="font-weight:700;font-size:15px;letter-spacing:-.01em">Skip Wait — timer bypassed</div><div style="font-size:12.5px;opacity:.92;margin-top:2px">${e}</div></div>`
        });
        n.style.cssText = "display:flex;align-items:center;gap:12px;margin:0 0 16px;padding:12px 16px;border-radius:12px;background:linear-gradient(135deg,#10b981,#059669);color:#fff;box-shadow:0 6px 18px rgba(16,185,129,.35);font-family:Inter,Manrope,system-ui,-apple-system,sans-serif", t.before(n)
    }

    function zE(t) {
        document.querySelector('input[name="op"][value="download2"]') ? (! function() {
            document.getElementById("countdown")?.remove();
            const t = document.querySelector("#downloadbtn");
            t && (t.disabled = !1, t.classList.add("is-ready"))
        }(), FE(document.querySelector(".dl-captcha") ?? document.querySelector(".dl-cta"), "Direct CDN link resolved — no countdown or captcha needed.")) : FE(document.querySelector(".dl-cta-row"), "Direct download is ready — click either button to skip the wait and ads.");
        const e = e => {
            e.preventDefault(), e.stopImmediatePropagation(), t.then(t => {
                t && (D(), location.assign(t))
            })
        };
        document.addEventListener("click", t => {
            t.target.closest('button.dl-btn--free[name="method_free"], #downloadbtn') && e(t)
        }, !0), document.querySelector('form[name="F1"], form.dl-form')?.addEventListener("submit", e, !0)
    }
    var jE = "skipwait-mirrored-brand",
        YE = /^\/files\/([A-Za-z0-9]+)\/?$/i,
        GE = /^\/getlink\/[A-Za-z0-9]+\/\d+\/?$/i,
        VE = /^[a-f0-9]{32}$/i,
        ZE = /\/out_url\/?$/i,
        JE = 'form[action*="/out_url"], form[action*="/getlink/"]',
        XE = new WeakMap,
        KE = !1;

    function QE() {
        KE || (KE = !0, D())
    }

    function tx() {
        const t = new URLSearchParams(location.search).get("hash");
        return t && VE.test(t) ? t : null
    }

    function ex() {
        for (const t of document.querySelectorAll('a[href*="hash="]')) try {
            const e = new URL(t.href, location.origin);
            if (!YE.test(e.pathname)) continue;
            const n = e.searchParams.get("hash");
            if (!n || !VE.test(n) || !e.searchParams.has("dl")) continue;
            if (!t.querySelector("button.get_btn")) continue;
            return e.href
        } catch {
            continue
        }
        return null
    }

    function nx(t) {
        try {
            const e = new URL(t, location.origin);
            return ("http:" === e.protocol || "https:" === e.protocol) && (!/mirrored\.to$/i.test(e.hostname) && !e.hostname.endsWith(".mirrored.to") && (!/cuty\.io$/i.test(e.hostname) && !e.hostname.endsWith(".cuty.io") && !/^(www\.)?(x|twitter|facebook|google)\./i.test(e.hostname)))
        } catch {
            return !1
        }
    }

    function ox(t) {
        const e = t.match(/URL=(https:\/\/cuty\.io\/quick\?[^"'\s>]+)/i)?.[1] ?? t.match(/href="(https:\/\/cuty\.io\/quick\?[^"]+)"/i)?.[1];
        if (!e) return null;
        try {
            const t = new URL(e.replaceAll("&amp;", "&")).searchParams.get("url");
            return t && nx(t) ? t : null
        } catch {
            return null
        }
    }

    function rx(t) {
        for (const o of t.querySelectorAll('a[href^="http"]'))
            if (nx(o.href) && o.querySelector("button.get_btn") && /Download from/i.test(o.textContent ?? "")) return o.href;
        const e = t.querySelector('[data-clipboard-text^="http"]')?.getAttribute("data-clipboard-text");
        if (e && nx(e)) return e;
        const n = t.querySelector("code")?.textContent?.trim();
        return n && nx(n) ? n : null
    }
    async function ix(t) {
        const e = t.getAttribute("action");
        if (!e) return null;
        const n = await fetch(new URL(e, location.origin).href, {
            method: "POST",
            body: new FormData(t),
            credentials: "include",
            cache: "no-store"
        });
        return n.ok ? n.text() : null
    }
    async function ax(t) {
        const e = await ix(t);
        if (!e) return null;
        const n = (new DOMParser).parseFromString(e, "text/html").querySelector("form[action]");
        if (!n) return null;
        try {
            const t = new URL(n.getAttribute("action") ?? "", location.origin);
            return nx(t.href) ? {
                href: t.href,
                post: new FormData(n)
            } : null
        } catch {
            return null
        }
    }

    function sx(t) {
        const e = XE.get(t);
        if (e) return e;
        const n = async function(t) {
            const e = new URL(t.getAttribute("action") ?? "", location.origin),
                n = await ix(t);
            if (!n) return null;
            if (ZE.test(e.pathname)) {
                const t = ox(n);
                return t ? {
                    href: t
                } : null
            }
            const o = (new DOMParser).parseFromString(n, "text/html"),
                r = rx(o) ?? ox(n);
            if (r) return {
                href: r
            };
            const i = o.querySelector('form[action*="dl_out.php"]');
            return i ? ax(i) : null
        }(t).catch(() => null);
        return XE.set(t, n), n
    }

    function cx(t, e, n) {
        if (e.post) {
            t.setAttribute("action", e.href), t.method = "POST", t.target = n;
            for (const e of t.querySelectorAll('input[type="hidden"]')) e.remove();
            for (const [n, o] of e.post.entries()) {
                if ("string" != typeof o) continue;
                const e = document.createElement("input");
                e.type = "hidden", e.name = n, e.value = o, t.append(e)
            }
        }
    }

    function lx(t, e) {
        if (e.post) return void cx(t, e, "_blank");
        const n = t.querySelector("button.get_btn");
        if (!n) return;
        const o = document.createElement("a");
        o.href = e.href, o.target = "_blank", o.rel = "noopener noreferrer", o.append(n), t.replaceWith(o)
    }

    function ux(t, e) {
        if (e.post) return cx(t, e, "_self"), void t.submit();
        location.assign(e.href)
    }

    function dx(t) {
        for (const e of t.querySelectorAll(JE)) XE.has(e) || sx(e).then(t => {
            t && e.isConnected && (QE(), lx(e, t))
        })
    }

    function mx() {
        const t = document.getElementById("result");
        t && (! function() {
            if (document.getElementById(jE)) return;
            const t = document.querySelector(".col-sm.centered .bg.double-padded");
            if (!t) return;
            const e = document.createElement("span");
            e.id = jE, e.setAttribute("role", "status");
            const n = document.createElement("div");
            n.className = "icon baseline2", n.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 17.292l-4.5-4.364 1.857-1.858 2.643 2.506 5.643-5.784 1.857 1.857-7.5 7.643z"/></svg>';
            const o = document.createElement("span");
            o.className = "id_Success", o.textContent = "Short URLs skipped — Download opens the host directly.", e.append(n, "  Skip Wait : ", o), t.append(document.createElement("br"), e)
        }(), function(t) {
            t.addEventListener("click", t => {
                const e = t.target;
                if (!e?.closest("button.get_btn")) return;
                const n = e.closest(JE);
                n && (t.preventDefault(), t.stopImmediatePropagation(), sx(n).then(t => {
                    t && (QE(), ux(n, t))
                }))
            }, !0)
        }(t), dx(t), new MutationObserver(() => dx(t)).observe(t, {
            childList: !0,
            subtree: !0
        }))
    }

    function px() {
        if (YE.test(location.pathname) && !tx() && document.querySelector("h3.hdark") && /You have requested the file/i.test(document.body?.innerText ?? "") && ex()) {
            const t = ex();
            return void(t && location.replace(t))
        }
        YE.test(location.pathname) && tx() ? mx() : GE.test(location.pathname) && /^Your .+ Link/i.test(document.title) && /Awesome!\s*You have chosen the hosting site/i.test(document.body?.innerText ?? "") && function() {
            const t = rx(document) ?? ox(document.documentElement.innerHTML);
            if (t) return QE(), void location.replace(t);
            const e = document.querySelector('form[action*="dl_out.php"]');
            e && ax(e).then(t => {
                t && (QE(), ux(e, t))
            })
        }()
    }
    var hx = /^eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/,
        fx = t => {
            const e = t?.trim() ?? "";
            return hx.test(e) ? e : null
        };

    function wx(t = location.href) {
        try {
            const e = fx(new URL(t).searchParams.get("token"));
            if (e) return e
        } catch {}
        return fx((t => {
            const e = document.cookie.match(new RegExp(`(?:^|;\\s*)${t}=([^;]*)`));
            return e?.[1] ? decodeURIComponent(e[1]) : null
        })("SESSION"))
    }

    function gx(t) {
        try {
            const e = t.split(".")[1];
            if (!e) return null;
            const n = atob(e.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - e.length % 4) % 4)),
                o = JSON.parse(n),
                r = Number(o.step),
                i = Number(o.max_step);
            return !Number.isFinite(r) || !Number.isFinite(i) || i < 1 ? null : {
                step: r,
                maxStep: i
            }
        } catch {
            return null
        }
    }
    var yx = async (t, e, n) => {
        const o = await fetch(`https://api.move2link.com/api/v1${t}`, {
                method: e,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    token: n,
                    csrf_token: "x",
                    imps: []
                })
            }),
            r = await o.text();
        let i = {};
        try {
            i = JSON.parse(r)
        } catch {}
        if (!o.ok) throw new Error(`${t} ${o.status}`);
        return i.data ?? {}
    };
    var kx = "skip-wait-move2link-overlay",
        bx = "skip-wait-move2link-boot",
        vx = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        Sx = null,
        Ex = !1,
        xx = () => {
            const t = kt(kx);
            if (document.documentElement.classList.add(t), document.getElementById(bx)) return;
            const e = document.createElement("style");
            e.id = bx, e.textContent = Lt(kx, t), (document.head || document.documentElement).appendChild(e)
        },
        Lx = (t = "Getting things ready…") => (xx(), Sx ? (Sx.setNote(vx), Sx.setStatus(t), Sx) : Sx = $t({
            id: kx,
            brand: "Skip Wait",
            note: vx,
            status: t,
            countdownLabel: "Continue in"
        })),
        Cx = async () => {
            const t = wx();
            if (!t) throw new Error("token");
            Lx("Opening destination…"), chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {});
            const e = await async function(t) {
                let e = t;
                for (;;) {
                    const t = gx(e);
                    if (!t) throw new Error("jwt");
                    if (t.step >= t.maxStep - 1) break;
                    const n = (await yx("/views/track", "PUT", e)).token?.trim();
                    if (!n || !hx.test(n)) throw new Error("track");
                    e = n
                }
                const n = (await yx("/views/finalize", "POST", e)).redirect_url?.trim() ?? "";
                if (!/^https?:\/\//i.test(n)) throw new Error("finalize");
                return n
            }(t);
            D(), location.replace(e)
        }, Ix = () => {
            ot("move2link-blog").then(t => {
                if (!t) return;
                const e = () => {
                    wx() && (xx(), Lx(), !Ex && wx() && (Ex = !0, Cx().catch(() => {
                        Lx().setError("Unlock failed. Reload and try again."), Ex = !1
                    })))
                };
                if (e(), Ex) return;
                const n = new MutationObserver(() => {
                    e(), Ex && n.disconnect()
                });
                n.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", e, !0)
            })
        }, Tx = () => {
            ot("move2link-go").then(t => {
                if (t) try {
                    const t = new URL(location.href).searchParams.get("to"),
                        e = t ? function(t) {
                            try {
                                const e = atob(t.trim());
                                let n = "";
                                for (let t = 0; t < e.length; t++) n += `%${e.charCodeAt(t).toString(16).padStart(2,"0")}`;
                                const o = decodeURIComponent(n).trim();
                                return /^https?:\/\//i.test(o) ? o : null
                            } catch {
                                return null
                            }
                        }(t) : null;
                    e && (D(), location.replace(e))
                } catch {}
            })
        };
    var $x = "skipwait-mp4upload-brand";

    function Ax() {
        document.getElementById("countdown")?.remove();
        const t = document.querySelector('input[name="op"][value="download1"]')?.form ?? null,
            e = t?.querySelector('#method_free, input[name="method_free"]');
        t && e && (e.disabled = !1, e.removeAttribute("disabled"), D(), e.click())
    }

    function qx() {
        ! function() {
            const t = document.querySelector('input[name="op"][value="download1"]')?.form,
                e = t?.querySelector('#method_free, input[name="method_free"]');
            return !!(t && e && document.getElementById("countdown"))
        }() ? document.querySelector('input[name="op"][value="download2"]')?.form && document.getElementById("downloadbtn") && document.querySelector(".dl1-rail") && function() {
            if (document.getElementById($x)) return;
            const t = document.getElementById("downloadbtn");
            if (!t?.parentElement) return;
            const e = document.createElement("div");
            e.id = $x, e.className = "info-card", e.setAttribute("role", "status");
            const n = document.createElement("div");
            n.className = "info-label", n.textContent = "Skip Wait";
            const o = document.createElement("ul"),
                r = document.createElement("li"),
                i = document.createElement("span");
            i.className = "infoname", i.textContent = "Status";
            const a = document.createElement("span");
            a.textContent = "Timer skipped — use Download Now", r.append(i, a), o.append(r), e.append(n, o), t.before(e)
        }(): Ax()
    }
    var _x = "data-skipwait-hijacked",
        Mx = "skipwait-pling-bypass",
        Ox = /\/p\/(\d+)/,
        Rx = /-link-filename(\d+)$/;

    function Px() {
        const t = location.pathname.match(Ox)?.[1];
        t && document.getElementById("product-view-container") && fetch(`${location.origin}/p/${t}/loadFiles`, {
            credentials: "same-origin"
        }).then(t => t.ok ? t.json() : null).then(t => {
            const e = new Map((t?.files ?? []).map(t => [t.id, t.url]));
            if (!e.size) return;
            for (const o of document.querySelectorAll("a.opendownloadfile")) {
                if (o.hasAttribute(_x)) continue;
                const t = o.querySelector('[id*="-link-filename"]')?.id.match(Rx)?.[1],
                    n = t && e.get(t);
                n && (o.setAttribute(_x, "1"), o.addEventListener("click", t => {
                    t.preventDefault(), t.stopImmediatePropagation(), D(), location.assign(decodeURIComponent(n))
                }, !0))
            }
            const n = document.querySelector("#project_btn_download")?.closest(".prod-widget-box");
            if (n && !n.querySelector(`#${Mx}`)) {
                const t = Object.assign(document.createElement("p"), {
                    id: Mx,
                    className: "text-small mt2",
                    textContent: "Skip Wait bypassed the download wait screen. Pick a file above to start."
                });
                n.append(t)
            }
        })
    }
    var Dx = "skipwait-muhammadniaz-countdown";

    function Nx(t) {
        try {
            const e = t.replace(/-/g, "+").replace(/_/g, "/"),
                n = e + "=".repeat((4 - e.length % 4) % 4),
                o = atob(n).trim();
            return /^https?:\/\//i.test(o) ? o : null
        } catch {
            return null
        }
    }
    async function Bx(t) {
        try {
            return nt(new URL(t).hostname, "tipsguru-wait")
        } catch {
            return !1
        }
    }
    var Ux = "skip-wait-tipsguru-overlay",
        Wx = "skip-wait-tipsguru-wait",
        Hx = /"finalUrl"\s*:\s*"([^"]+)"/,
        Fx = /(?:^|;\s*)(?:tipsguru|vidyays|mineverse360|mineverse)=([^;]+)/i,
        zx = !1;

    function jx(t) {
        try {
            return decodeURIComponent(t)
        } catch {
            return t
        }
    }

    function Yx() {
        const t = window.setInterval(() => {}, 1e9);
        for (let e = 0; e <= t; e++) window.clearInterval(e)
    }

    function Gx() {
        if (!/\/prolink\.php\/?$/i.test(location.pathname)) return null;
        const t = new URLSearchParams(location.search).get("id");
        return t ? Nx(jx(t)) : null
    }

    function Vx() {
        const t = Hx.exec(document.documentElement.innerHTML);
        if (!t?.[1]) return null;
        const e = function(t) {
            try {
                return JSON.parse(`"${t}"`)
            } catch {
                return t.replace(/\\\//g, "/")
            }
        }(t[1]).trim();
        return /^https?:\/\//i.test(e) ? e : null
    }

    function Zx() {
        const t = Fx.exec(document.cookie);
        return t?.[1] ? Nx(jx(t[1])) : null
    }

    function Jx() {
        return new Promise(t => {
            try {
                chrome.runtime.sendMessage({
                    type: "TIPSGURU_GET_DEST"
                }, e => {
                    chrome.runtime.lastError ? t(null) : t(("string" == typeof e?.url ? e.url.trim() : "") || null)
                })
            } catch {
                t(null)
            }
        })
    }

    function Xx(t) {
        Yx();
        const e = t.endAt - Date.now();
        if (e <= 0) return sessionStorage.removeItem(Wx), D(), void location.replace(t.dest);
        const n = $t({
            id: Ux,
            brand: "Skip Wait",
            note: {
                lead: "Skip Wait is generating your access.",
                detail: "Leave this tab open — no TipsGuru steps needed."
            },
            status: "Waiting for access window…",
            countdownLabel: "Seconds left"
        });
        n.startCountdown(t.endAt), window.setTimeout(() => {
            sessionStorage.removeItem(Wx), n.setStatus("Opening access…"), D(), location.replace(t.dest)
        }, e)
    }
    async function Kx() {
        if (zx) return;
        const t = await async function() {
            for (let t = 0; t < 20; t++) {
                const t = Gx() ?? Vx() ?? Zx();
                if (t) return t;
                const e = await Jx();
                if (e) return e;
                await new Promise(t => setTimeout(t, 50))
            }
            return null
        }();
        t && function(t) {
            try {
                return new URL(t).hostname.toLowerCase() !== location.hostname.toLowerCase()
            } catch {
                return !1
            }
        }(t) && (await Bx(t) ? function(t) {
            if (zx) return;
            zx = !0, Yx();
            const e = {
                dest: t,
                endAt: Date.now() + 252e3
            };
            sessionStorage.setItem(Wx, JSON.stringify(e)), $t({
                id: Ux,
                brand: "Skip Wait",
                note: {
                    lead: "Skip Wait is generating your access.",
                    detail: "Starting wait…"
                },
                status: "Starting wait…"
            }), "/" !== location.pathname ? location.replace(`${location.origin}/`) : Xx(e)
        }(t) : (zx = !0, Yx(), $t({
            id: Ux,
            brand: "Skip Wait",
            note: {
                lead: "Skip Wait found your destination.",
                detail: "Opening now…"
            },
            status: "Redirecting…"
        }), D(), location.replace(t)))
    }

    function Qx(t = location.pathname) {
        return /^\/([A-Za-z0-9_-]+)\.html$/i.exec(t)?.[1] ?? null
    }
    var tL = "skip-wait-tumadam-overlay",
        eL = "skip-wait-tumadam-boot",
        nL = /\bDEST\s*=\s*"([^"]*)"/,
        oL = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to wait on the countdown."
        },
        rL = null,
        iL = !1;

    function aL() {
        const t = nL.exec(document.documentElement.innerHTML)?.[1]?.trim();
        if (!t || t.toLowerCase().startsWith("javascript:")) return null;
        try {
            return new URL(t, location.href).href
        } catch {
            return null
        }
    }

    function sL() {
        const t = kt(tL);
        if (document.documentElement.classList.add(t), document.getElementById(eL)) return;
        const e = document.createElement("style");
        e.id = eL, e.textContent = Lt(tL, t), (document.head || document.documentElement).appendChild(e)
    }

    function cL(t = "Getting things ready…") {
        return sL(), rL ? (rL.setNote(oL), rL.setStatus(t), rL.setError(null), rL) : rL = $t({
            id: tL,
            brand: "Skip Wait",
            note: oL,
            status: t
        })
    }

    function lL() {
        !iL && Qx() && (aL() || "loading" !== document.readyState) && (iL = !0, function() {
            const t = cL("Unlocking your link…"),
                e = aL();
            e ? (t.setStatus("Opening your link…"), D(), location.replace(e)) : t.setError("Tumadam destination not found on this page.")
        }())
    }
    var uL = /^\/([^/]+)\/file\/?$/i,
        dL = "skipwait-wahmi-bypass";
    async function mL() {
        const t = location.pathname.match(uL)?.[1],
            e = document.querySelector(".filebox-download");
        if (!t || !e || !document.querySelector(".download-counter")) return;
        document.querySelector(".download-counter")?.remove(),
            function() {
                const t = document.querySelector(".filebox");
                if (!t || document.getElementById(dL)) return;
                const e = Object.assign(document.createElement("div"), {
                    id: dL,
                    textContent: "Skip Wait bypassed the download timer."
                });
                e.style.cssText = "display:block;width:100%;box-sizing:border-box;padding:12px 20px;border-bottom:1px solid rgba(16,185,129,.25);background:#ecfdf5;color:#047857;font-size:13px;", t.prepend(e)
            }();
        const n = await async function(t) {
            const e = document.querySelector('meta[name="csrf-token"]')?.content;
            if (!e) return null;
            const n = await fetch(`${location.origin}/${encodeURIComponent(t)}/download/create`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "X-CSRF-TOKEN": e,
                    Accept: "application/json"
                }
            });
            if (!n.ok) return null;
            const o = await n.json();
            return o.error || "string" != typeof o.download_link ? null : o.download_link
        }(t);
        n && (D(), e.innerHTML = `<a class="download-link" href="${n}">Download</a>`)
    }
    var pL = "skip-wait-weadown-overlay",
        hL = "skip-wait-weadown-boot",
        fL = /^\/files\/(?!go\/)([^/]+)\/?$/i,
        wL = null,
        gL = null,
        yL = null,
        kL = "",
        bL = swDelay,
        vL = () => {
            const t = new Uint8Array(16);
            return crypto.getRandomValues(t), Array.from(t, t => t.toString(16).padStart(2, "0")).join("")
        },
        SL = (t, e) => "start" === e ? {
            lead: t.startLabel,
            detail: t.pageHint
        } : "wait" === e ? {
            lead: t.waitingLabel,
            detail: t.readyLabel
        } : {
            lead: t.readyLabel,
            detail: t.pageHint
        },
        EL = () => {
            null != yL && (clearInterval(yL), yL = null)
        },
        xL = t => {
            EL(), kL = t;
            let e = 0;
            wL.setStatus(`${t}.`), yL = window.setInterval(() => {
                e = (e + 1) % 3, wL.setStatus(`${kL}${".".repeat(e+1)}`)
            }, 450)
        },
        LL = (t, e) => {
            if (e === gL) return;
            gL = e;
            const {
                lead: n,
                detail: o
            } = SL(t, e);
            wL.setNote({
                lead: n,
                detail: o
            }), xL(n)
        },
        CL = (t, e) => {
            if ((() => {
                    const t = kt(pL);
                    if (document.documentElement.classList.add(t), document.getElementById(hL)) return;
                    const e = document.createElement("style");
                    e.id = hL, e.textContent = Lt(pL, t) + ".fc-message-root,.fc-dialog-overlay{display:none!important;visibility:hidden!important}", (document.head || document.documentElement).appendChild(e)
                })(), wL) return LL(t, e), wL.setError(null), wL;
            const {
                lead: n,
                detail: o
            } = SL(t, e);
            return gL = e, kL = n, wL = $t({
                id: pL,
                brand: "Skip Wait",
                note: {
                    lead: n,
                    detail: o
                },
                status: `${n}.`
            }), xL(n), wL
        },
        IL = async (t, e) => {
            const n = await fetch(t, {
                    method: "POST",
                    credentials: "same-origin",
                    cache: "no-store",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    body: new URLSearchParams(e).toString()
                }),
                o = await n.json();
            if (!n.ok) throw new Error(o.message);
            return o
        }, TL = async t => {
            CL(t, "start");
            const e = await (async t => {
                const e = (await IL(t.startUrl, {
                    request_id: vL(),
                    slugs: t.slug
                })).items?.[0];
                if (!e?.ok || !e.token) throw new Error(e?.message);
                return e.token
            })(t);
            LL(t, "wait"), await bL(2e3);
            const n = await (async (t, e) => {
                for (let n = 0; n < 120; n++) {
                    const n = (await IL(t.completeUrl, {
                        tokens: e
                    })).items?.[0];
                    if (n?.ok && n.go_url) return n.go_url;
                    if ("zmk_too_early" !== n?.code) throw new Error(n?.message);
                    LL(t, "wait"), await bL(400)
                }
                throw new Error("Secure link generation timed out")
            })(t, e);
            LL(t, "ready"), (t => {
                const e = document.createElement("form");
                e.method = "post", e.action = t, e.hidden = !0, e.setAttribute("rel", "nofollow noopener noreferrer");
                const n = document.createElement("input");
                n.type = "hidden", n.name = "zmk_navigation", n.value = "1", e.append(n), document.body.append(e), D(), e.submit(), e.remove()
            })(n)
        };
    var $L = "skip-wait-zifury-overlay",
        AL = "skip-wait-zifury-boot",
        qL = /^\/[^/]+\/[^/]+\.[a-z0-9]+$/i,
        _L = null,
        ML = null,
        OL = null,
        RL = "",
        PL = !1,
        DL = swDelay,
        NL = () => {
            for (const t of document.querySelectorAll(".card-body p.fs-16.fw-semibold")) {
                const e = t.textContent?.trim();
                if (e && !/BOOST|QUANTUM/i.test(e)) return e
            }
            return ""
        },
        BL = (t, e) => t.match(e)?.[0] ?? "",
        UL = t => {
            const e = t.match(/payload:\s*'([^']+)'/)?.[1]?.trim(),
                n = t.match(/filename:\s*'((?:\\u002D|[^'])+)'/)?.[1]?.replace(/\\u002D/g, "-") ?? document.querySelector(".flex-grow-1.text-truncate p.text-info")?.textContent?.trim() ?? "",
                o = "true" === t.match(/isFinalStep:\s*(true|false)/)?.[1],
                r = t.match(/nextDownloadLink:\s*'((?:\\u003A|\\u002F|\\u00253D|[^'])+)'/)?.[1];
            return e && n ? {
                payload: e,
                filename: n,
                final: o,
                nextUrl: r ? (i = r, i.replace(/\\u003A/gi, ":").replace(/\\u002F/gi, "/").replace(/\\u00253D/gi, "=")) : null
            } : null;
            var i
        },
        WL = () => {
            const t = document.documentElement.outerHTML,
                e = UL(t);
            if (!e) return null;
            const n = (document.querySelector(".free-element")?.textContent ?? "").replace(/\s+/g, " ").trim();
            return n ? {
                ...e,
                guestLabel: n,
                fetchLabel: BL(t, /Fetching download link\.\.\./) || "Fetching download link...",
                readyLabel: `Download (${e.filename})`,
                nextLabel: BL(t, /NEXT STEP/) || "NEXT STEP",
                tier: NL()
            } : null
        },
        HL = (t, e) => {
            const n = t.tier ? `${t.tier} · ${t.filename}` : t.filename;
            return "start" === e ? {
                lead: t.guestLabel,
                detail: n
            } : "fetch" === e ? {
                lead: t.fetchLabel,
                detail: t.readyLabel
            } : "next" === e ? {
                lead: t.nextLabel,
                detail: t.filename
            } : {
                lead: t.readyLabel,
                detail: t.filename
            }
        },
        FL = () => {
            null != OL && (clearInterval(OL), OL = null)
        },
        zL = t => {
            FL(), RL = t;
            let e = 0;
            _L.setStatus(`${t}.`), OL = window.setInterval(() => {
                e = (e + 1) % 3, _L.setStatus(`${RL}${".".repeat(e+1)}`)
            }, 450)
        },
        jL = (t, e) => {
            if (e === ML) return;
            ML = e;
            const {
                lead: n,
                detail: o
            } = HL(t, e);
            _L.setNote({
                lead: n,
                detail: o
            }), zL(n)
        },
        YL = (t, e) => {
            (() => {
                if (document.documentElement.classList.add(kt($L)), document.getElementById(AL)) return;
                const t = document.createElement("style");
                t.id = AL, t.textContent = Lt($L, kt($L)) + ".free-element,.download-now{display:none!important}", (document.head || document.documentElement).appendChild(t)
            })();
            const {
                lead: n,
                detail: o
            } = HL(t, e);
            return _L ? (jL(t, e), _L.setError(null), _L) : (ML = e, RL = n, _L = $t({
                id: $L,
                brand: "Skip Wait",
                note: {
                    lead: n,
                    detail: o
                },
                status: `${n}.`
            }), zL(n), _L)
        },
        GL = (t, e) => {
            const n = UL(e);
            return n ? {
                ...t,
                ...n,
                fetchLabel: BL(e, /Fetching download link\.\.\./) || t.fetchLabel,
                nextLabel: BL(e, /NEXT STEP/) || t.nextLabel,
                readyLabel: `Download (${n.filename})`
            } : null
        },
        VL = async t => await (await fetch(`${location.origin}/oydir-link`, {
            method: "POST",
            credentials: "same-origin",
            cache: "no-store",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: new URLSearchParams({
                payload: t
            }).toString()
        })).json(), ZL = async t => {
            jL(t, "fetch");
            for (let e = 0; e < 120; e++) {
                const e = await VL(t.payload);
                if (e.success && e.url) return e.url;
                await DL(250)
            }
            throw new Error("Secure link generation timed out")
        }, JL = async t => {
            YL(t, "start");
            const e = await (async t => {
                let e = t;
                for (;;) {
                    if (e.final) return ZL(e);
                    if (!e.nextUrl) throw new Error("Missing next download step");
                    jL(e, "next");
                    const t = await fetch(e.nextUrl, {
                            credentials: "same-origin",
                            cache: "no-store"
                        }).then(t => {
                            if (!t.ok) throw new Error("Next step unavailable");
                            return t.text()
                        }),
                        n = GL(e, t);
                    if (!n) throw new Error("Could not read next download gate");
                    e = n
                }
            })(t);
            jL(t, "ready"), D(), location.assign(e)
        };
    var XL = /^\/([A-Za-z0-9_-]{4,16})\/?$/,
        KL = /^\/go\/([A-Za-z0-9_-]+)\/?$/i,
        QL = /^\/quick\/?$/i;
    var tC = ["cuttty.com", "cuty.io"];

    function eC(t = location.search) {
        const e = new URLSearchParams(t).get("url");
        if (!e) return null;
        try {
            const t = new URL(e);
            return "http:" !== t.protocol && "https:" !== t.protocol || (t => {
                const e = t.toLowerCase();
                return tC.some(t => e === t || e.endsWith(`.${t}`))
            })(t.hostname) ? null : t.href
        } catch {
            return null
        }
    }

    function nC(t) {
        const e = /countdownValue\s*=\s*(\d+)/.exec(t);
        return e?.[1] ? Math.max(0, parseInt(e[1], 10)) : 0
    }
    var oC = "skip-wait-cuty-overlay",
        rC = "skip-wait-cuty-boot",
        iC = "turnstile-container",
        aC = swTnToken,
        sC = swTnFrames,
        cC = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        lC = swTnNote,
        uC = "cuty blocked this visit because it detected your adblocker. Pause it for this site, then reload.",
        dC = null,
        mC = !1,
        pC = swDelay,
        hC = (t = cC, e = "Getting things ready…") => ((() => {
            const t = kt(oC);
            if (document.documentElement.classList.add(t), document.getElementById(rC)) return;
            const e = document.createElement("style");
            e.id = rC, e.textContent = Lt(oC, t), (document.head || document.documentElement).appendChild(e)
        })(), dC ? (dC.setNote(t), dC.setStatus(e), dC) : dC = $t({
            id: oC,
            brand: "Skip Wait",
            note: t,
            status: e,
            countdownLabel: "Continue in"
        })),
        fC = async (t, e, n = 100) => {
            const o = Date.now() + e;
            for (; Date.now() < o;) {
                const e = t();
                if (e) return e;
                await pC(n)
            }
            return t() || null
        }, wC = () => document.querySelector("#free-submit-form"), gC = () => document.querySelector("[data-ref]")?.getAttribute("data-ref") ?? null, yC = () => {
            const t = document.querySelector("#submit-form");
            return t?.querySelector('[name="data"]') && t.querySelector('[name="_token"]') ? t : null
        }, kC = t => !!t.querySelector(`[data-ref="captcha"], #${iC}, .cf-turnstile, ${aC}`), bC = () => !!document.querySelector("button.ab"), vC = (t = document) => {
            for (const e of [aC, 'input[id^="cf-chl-widget"][id$="_response"]'])
                for (const n of t.querySelectorAll(e)) {
                    const t = n.value.trim();
                    if (t && t.length > 20) return t
                }
            return null
        }, SC = () => {
            const t = document.documentElement.innerHTML;
            return yC() && /countdownValue\s*=\s*\d+/.test(t) ? {
                sec: nC(t)
            } : null
        }, EC = t => {
            t.stopPin?.(), t.stopPin = null
        };
    async function xC(t) {
        return t.setNote(lC), t.setStatus("Complete the captcha below."), new Promise(e => {
            const n = {
                stopPin: null
            };
            let o = !1,
                r = !1,
                i = 0;
            const a = t => {
                    o || (o = !0, window.clearInterval(u), l.disconnect(), EC(n), e(t))
                },
                s = () => {
                    if (o) return;
                    const e = wC();
                    if (!e) return;
                    const r = (t => {
                        const e = t.querySelector(`#${iC}`) || t.querySelector(".cf-turnstile");
                        if (e) return e.id || (e.id = iC), e;
                        const n = t.querySelector(aC)?.parentElement;
                        return n && !n.id && (n.id = iC), n ?? null
                    })(e);
                    if (!r) return;
                    const a = r.id || iC;
                    r.id || (r.id = a), n.stopPin && document.getElementById(a) || (EC(n), n.stopPin = Nt({
                        overlayId: oC,
                        mount: t.turnstileMount,
                        widgetId: a,
                        styleId: "skip-wait-cuty-captcha-pin",
                        alsoVisibleSelectors: sC
                    }), i || (i = Date.now()))
                },
                c = () => {
                    if (o || r) return;
                    s();
                    const e = wC(),
                        n = (e ? vC(e) : null) || vC(document);
                    !n || !i || Date.now() - i < 400 || (r = !0, t.setStatus("Captcha verified…"), window.setTimeout(() => a(n), 300))
                };
            s();
            const l = new MutationObserver(c);
            l.observe(document.documentElement, {
                childList: !0,
                subtree: !0
            });
            const u = window.setInterval(c, 250);
            window.setTimeout(() => {
                if (o) return;
                const t = wC();
                a((t ? vC(t) : null) || vC(document))
            }, 18e4)
        })
    }
    async function LC(t) {
        t.setNote(cC), t.setStatus("Getting things ready…");
        const e = await (async () => fC(SC, 3e4, 100))();
        if (!e) return void t.setError("Unlock payload missing. Reload and try again.");
        if (e.sec > 0) {
            t.setStatus("Unlock timer");
            const n = Date.now() + 1e3 * e.sec;
            t.startCountdown(n), await pC(Math.max(0, n - Date.now())), t.hideCountdown()
        }
        t.setStatus("Opening destination…");
        const n = await new Promise(t => {
            chrome.runtime.sendMessage({
                type: "CUTY_GO_UNLOCK"
            }, e => {
                if (chrome.runtime.lastError) return void t({
                    ok: !1,
                    err: chrome.runtime.lastError.message ?? "runtime error"
                });
                const n = e;
                t(n?.ok ? {
                    ok: !0
                } : {
                    ok: !1,
                    err: n?.err ?? "no response"
                })
            })
        });
        n.ok ? D() : t.setError(n.err ?? "Unlock failed.")
    }
    async function CC(t) {
        if (t.setNote(lC), t.setStatus("Complete the captcha below."), !(await fC(() => wC()?.querySelector(`#${iC}, .cf-turnstile, ${aC}`), 6e4, 250))) return void t.setError(bC() ? uC : "Captcha never loaded. Reload and try again.");
        const e = await xC(t);
        if (!e) return void t.setError("Turnstile was not completed. Finish the check above.");
        const n = wC();
        n ? (((t, e) => {
            let n = t.querySelector(aC);
            n || (n = document.createElement("input"), n.type = "hidden", n.name = "cf-turnstile-response", t.appendChild(n)), n.value = e
        })(n, e), t.setNote(cC), t.setStatus("Submitting captcha…"), n.submit()) : t.setError("Captcha form missing. Reload and try again.")
    }
    async function IC() {
        const t = hC(cC, "Getting things ready…");
        chrome.runtime.sendMessage({
            type: "INJECT_VISIBILITY_SPOOF"
        }).catch(() => {});
        const e = gC();
        if (yC()) return void(await LC(t));
        const n = wC();
        if (!bC() || n) {
            if (!n || !kC(n)) return !n || "first" !== e && e ? void t.setError("cuty gate not found on this page.") : n.querySelector('[name="_token"]') ? (t.setStatus("Skipping continue gate…"), void n.submit()) : void t.setError("CSRF token missing. Reload and try again.");
            await CC(t)
        } else t.setError(uC)
    }

    function TC(t = document) {
        const e = t.querySelector("#_csrfToken")?.value?.trim() ?? "",
            n = t.querySelector('input[name="flow"]')?.value?.trim() ?? new URL(location.href).searchParams.get("flow")?.trim() ?? "";
        return e && n && t.querySelector("#lview") ? {
            csrf: e,
            flow: n
        } : null
    }

    function $C(t = document) {
        try {
            if (!new URL(location.href).searchParams.get("flow")) return !1
        } catch {
            return !1
        }
        return null !== TC(t)
    }
    var AC = "skip-wait-cutwin-overlay",
        qC = "skip-wait-cutwin-boot",
        _C = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        MC = null,
        OC = !1,
        RC = () => {
            const t = kt(AC);
            if (document.documentElement.classList.add(t), document.getElementById(qC)) return;
            const e = document.createElement("style");
            e.id = qC, e.textContent = Lt(AC, t), (document.head || document.documentElement).appendChild(e)
        },
        PC = (t = "Getting things ready…") => (RC(), MC ? (MC.setNote(_C), MC.setStatus(t), MC.setError(null), MC) : MC = $t({
            id: AC,
            brand: "Skip Wait",
            note: _C,
            status: t
        })),
        DC = async () => {
            const t = TC();
            if (!t) throw new Error("cutwin gate");
            const e = PC("Unlocking your link…"),
                n = await async function(t, e, n) {
                    const o = new URLSearchParams({
                            _method: "POST",
                            ajax: "get_link",
                            _csrfToken: e,
                            flow: n
                        }),
                        r = (await (await fetch(t, {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                Accept: "*/*",
                                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                                "X-Requested-With": "XMLHttpRequest"
                            },
                            body: o
                        })).text()).replace(/^\uFEFF/, "").trim();
                    let i;
                    try {
                        i = JSON.parse(r)
                    } catch {
                        throw new Error("get_link bad json")
                    }
                    const a = i.url?.trim() ?? "";
                    if ("success" !== i.status || !/^https?:\/\//i.test(a)) throw new Error(i.message?.trim() || "get_link");
                    return a
                }(location.href, t.csrf, t.flow);
            e.setStatus("Opening your link…"), D(), location.replace(n)
        };
    var NC = "EXEIO_ADBLOCK_BYPASS",
        BC = "skip-wait-exeio-overlay",
        UC = "captchaShortlink",
        WC = swTnToken,
        HC = swTnFrames,
        FC = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        zC = swTnNote,
        jC = null,
        YC = !1,
        GC = t => {
            chrome.runtime.sendMessage({
                type: t
            }).catch(() => {})
        },
        VC = t => {
            t.getAttribute("action") || (t.action = location.pathname), t.method = "post", HTMLFormElement.prototype.submit.call(t)
        },
        ZC = (t = document) => {
            for (const e of t.querySelectorAll(WC)) {
                const t = e.value.trim();
                if (t.length > 20) return t
            }
            return null
        },
        JC = () => document.getElementById("before-captcha") ? "before" : document.getElementById("link-view") || document.querySelector(".link-container .button.disabled.danger") ? "link" : document.getElementById("go-link")?.querySelector("[name=ad_form_data]") ? "go" : null;

    function XC(t) {
        const e = ZC(document);
        return e && document.getElementById("link-view") ? Promise.resolve(e) : new Promise(e => {
            const n = {
                stopPin: null
            };
            let o = !1;
            const r = t => {
                    o || (o = !0, a.disconnect(), clearTimeout(s), n.stopPin?.(), e(t))
                },
                i = () => {
                    if (o) return;
                    const e = ZC(document);
                    if (e && document.getElementById("link-view")) return t.setStatus("Captcha verified…"), void r(e);
                    const i = document.getElementById("link-view");
                    if (!i && document.querySelector(".button.disabled.danger")) return t.setStatus("Bypassing adblock gate…"), void GC(NC);
                    if (!(i instanceof HTMLFormElement)) return;
                    const a = (t => t.querySelector(`#${UC}`) ?? t.querySelector(".cf-turnstile") ?? t.querySelector(WC)?.parentElement ?? null)(i);
                    a && (a.id || (a.id = UC), n.stopPin || (n.stopPin = Nt({
                        overlayId: BC,
                        mount: t.turnstileMount,
                        widgetId: a.id,
                        styleId: "skip-wait-exeio-captcha-pin",
                        alsoVisibleSelectors: HC
                    }), t.setStatus(HC.some(t => i.querySelector(t)) ? "Complete the captcha below." : "Loading captcha…")))
                },
                a = new MutationObserver(i);
            a.observe(document.documentElement, {
                childList: !0,
                subtree: !0,
                attributes: !0
            }), i();
            const s = setTimeout(() => r(ZC(document)), 18e4)
        })
    }
    async function KC(t) {
        const e = document.getElementById("go-link");
        if (!(e instanceof HTMLFormElement && e.querySelector("[name=ad_form_data]"))) return;
        if (t.setNote(FC), GC("INJECT_VISIBILITY_SPOOF"), GC(NC), t.setStatus("Waiting for unlock…"), t.startCountdown((() => {
                const t = document.getElementById("timer")?.textContent?.trim(),
                    e = t ? parseFloat(t) : NaN;
                if (Number.isFinite(e) && e > 0) return Date.now() + 1e3 * e;
                const n = window.app_vars,
                    o = parseInt(String(n?.counter_value ?? ""), 10);
                return Date.now() + 1e3 * (Number.isFinite(o) ? o : 6) + 500
            })()), await (() => {
                const t = () => {
                    const t = document.getElementById("go-submit");
                    return t instanceof HTMLButtonElement && !t.disabled && !t.classList.contains("disabled")
                };
                return t() ? Promise.resolve() : new Promise(e => {
                    const n = new MutationObserver(() => {
                        t() && (n.disconnect(), e())
                    });
                    n.observe(document.documentElement, {
                        childList: !0,
                        subtree: !0,
                        attributes: !0,
                        attributeFilter: ["disabled", "class"]
                    })
                })
            })(), t.hideCountdown(), !document.getElementById("go-link")?.querySelector("[name=ad_form_data]")) return void t.setError("Unlock form was removed. Reload and try again.");
        t.setStatus("Posting /links/go…");
        const n = await new Promise(t => {
            chrome.runtime.sendMessage({
                type: "EXEIO_GO_UNLOCK"
            }, e => {
                if (chrome.runtime.lastError) return void t({
                    ok: !1,
                    err: chrome.runtime.lastError.message ?? "runtime error"
                });
                const n = e;
                t(n?.ok ? {
                    ok: !0
                } : {
                    ok: !1,
                    err: n?.err ?? "no response"
                })
            })
        });
        n.ok ? D() : t.setError(n.err ?? "Unlock failed.")
    }
    async function QC() {
        GC(NC), GC("INJECT_VISIBILITY_SPOOF");
        const t = ((t = FC, e = "Getting things ready…") => jC ? (jC.setNote(t), jC.setStatus(e), jC) : jC = $t({
            id: BC,
            brand: "Skip Wait",
            note: t,
            status: e,
            countdownLabel: "Continue in"
        }))();
        switch (JC() || await at(() => !!JC()), JC()) {
            case "before":
                await async function(t) {
                    let e = document.getElementById("before-captcha");
                    if (!(e instanceof HTMLFormElement)) return;
                    if (e.querySelector(".button.disabled.danger") && !e.querySelector("[name=f_n]") && (t.setStatus("Bypassing adblock gate…"), GC(NC), await at(() => {
                            const t = document.getElementById("before-captcha");
                            return t instanceof HTMLFormElement && !!t.querySelector("[name=f_n]")
                        }), e = document.getElementById("before-captcha"), !(e instanceof HTMLFormElement))) return void t.setError("Adblock gate still active. Reload and try again.");
                    if (!e.querySelector("[name=_csrfToken]")) return void t.setError("Continue gate not ready. Reload and try again.");
                    const n = e.querySelector("[name=f_n]");
                    n && (n.value = "sle"), t.setNote(FC), t.setStatus("Skipping continue gate…"), VC(e)
                }(t);
                break;
            case "link":
                await async function(t) {
                    if (!document.getElementById("link-view") && !document.querySelector(".link-container .button.disabled.danger")) return;
                    t.setNote(zC), t.setStatus("Waiting for captcha…"), GC(NC);
                    const e = await XC(t);
                    if (!e) return void t.setError("Turnstile was not completed. Finish the check above.");
                    const n = document.getElementById("link-view");
                    if (!(n instanceof HTMLFormElement)) return void t.setError("Captcha form was removed. Reload and try again.");
                    const o = n.querySelector("[name=f_n]");
                    o && (o.value = "slc");
                    let r = n.querySelector(WC);
                    r || (r = document.createElement("input"), r.type = "hidden", r.name = "cf-turnstile-response", n.appendChild(r)), r.value = e, t.setNote(FC), t.setStatus("Submitting captcha…"), VC(n)
                }(t);
                break;
            case "go":
                await KC(t);
                break;
            default:
                t.setError("exe.io gate not found on this page.")
        }
    }
    var tI = /^(?=.*[A-Za-z])[A-Za-z0-9]{4,}$/;

    function eI(t) {
        const e = t.replace(/\s+/g, "");
        return e + "=".repeat((4 - e.length % 4) % 4)
    }
    async function nI(t) {
        const e = await crypto.subtle.digest("SHA-256", (new TextEncoder).encode(t));
        return Array.from(new Uint8Array(e), t => t.toString(16).padStart(2, "0")).join("")
    }
    async function oI(t, e) {
        const n = t.trim();
        if (!n || !e) return null;
        try {
            const t = (await nI("sDye71jNq5" + e)).slice(0, 32),
                o = (await nI("7M9u8DG4X" + e)).slice(0, 16),
                r = await crypto.subtle.importKey("raw", (new TextEncoder).encode(t), {
                    name: "AES-CBC"
                }, !1, ["decrypt"]),
                i = atob(eI(n)),
                a = await crypto.subtle.decrypt({
                    name: "AES-CBC",
                    iv: (new TextEncoder).encode(o)
                }, r, new Uint8Array(function(t) {
                    const e = atob(eI(t)),
                        n = new Uint8Array(e.length);
                    for (let o = 0; o < e.length; o++) n[o] = e.charCodeAt(o);
                    return n
                }(i)));
            return new TextDecoder("utf-8").decode(a).trim() || null
        } catch {
            return null
        }
    }
    async function rI(t, e) {
        const n = t.trim();
        if (!n) return null;
        if (/^https?:\/\//i.test(n)) return n;
        const o = await oI(n, e);
        return o && /^https?:\/\//i.test(o) ? o : null
    }
    var iI = "skip-wait-lksfy-overlay",
        aI = "captchaLinksGo",
        sI = swTnFrames,
        cI = '#go-link, form[action*="/links/go"]',
        lI = /var\s+base64\s*=\s*['"]([^'"]+)['"]/,
        uI = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        dI = swTnNote,
        mI = swDelay,
        pI = null,
        hI = !1,
        fI = () => {
            chrome.runtime.sendMessage({
                type: "LKSFY_ADBLOCK_BYPASS"
            }).catch(() => {})
        },
        wI = (t = uI, e = "Getting things ready…") => pI ? (pI.setNote(t), pI.setStatus(e), pI.setError(null), pI) : pI = $t({
            id: iI,
            brand: "Skip Wait",
            note: t,
            status: e,
            countdownLabel: "Your link opens in"
        }),
        gI = () => {
            const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean),
                e = t[0] ?? "";
            return 1 === t.length && tI.test(e) ? e : null
        },
        yI = async t => {
            try {
                return nt(new URL(t).hostname, "lksfy")
            } catch {
                return !0
            }
        }, kI = () => {
            for (const t of document.querySelectorAll('[name="cf-turnstile-response"]')) {
                const e = t.value?.trim();
                if (e && e.length > 20) return e
            }
            return null
        }, bI = () => lI.exec(document.documentElement.innerHTML)?.[1] ?? null, vI = async t => {
            const e = document.querySelector(cI);
            if (e?.querySelector('[name="ad_form_data"]')) return e;
            const n = await (async t => {
                const e = bI();
                if (e) return e;
                const n = Date.now() + t;
                for (; Date.now() < n;) {
                    const t = bI();
                    if (t) return t;
                    await mI(50)
                }
                return bI()
            })(15e3);
            if (!n) return null;
            const o = await oI(n, t);
            if (!o?.includes("ad_form_data")) return null;
            let r = document.getElementById("form-show");
            return r || (r = document.createElement("div"), r.id = "form-show", (document.body || document.documentElement).appendChild(r)), r.innerHTML = o, document.querySelector(cI)
        }, SI = async (t, e, n) => {
            const o = (t => {
                const e = {};
                for (const n of t.elements)(n instanceof HTMLInputElement || n instanceof HTMLTextAreaElement) && n.name && !n.disabled && (n instanceof HTMLInputElement && ("checkbox" === n.type || "radio" === n.type) && !n.checked || (e[n.name] = n.value ?? ""));
                return e
            })(t);
            o["cf-turnstile-response"] = e;
            try {
                const e = await (await fetch(new URL(t.getAttribute("action") || "/links/go", location.href).href, {
                    method: "POST",
                    body: new URLSearchParams(o),
                    credentials: "include",
                    headers: {
                        Accept: "application/json, text/javascript, */*; q=0.01",
                        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "X-Requested-With": "XMLHttpRequest"
                    }
                })).text();
                let r = "";
                try {
                    const t = JSON.parse(e);
                    r = "string" == typeof t.url ? t.url.trim() : ""
                } catch {
                    r = e.match(/https?:\/\/[^"'\\\s<>]+/)?.[0] ?? ""
                }
                return r ? rI(r, n) : null
            } catch {
                return null
            }
        }, EI = async () => {
            const t = gI();
            if (!t) return wI().setError("Missing link alias on this page."), void(hI = !1);
            fI(), chrome.runtime.sendMessage({
                type: "INJECT_VISIBILITY_SPOOF"
            }).catch(() => {});
            const e = wI(uI, "Getting things ready…"),
                n = document.querySelector("a.get-link:not(.disabled)")?.getAttribute("href")?.trim() ?? "";
            if (n && !n.startsWith("javascript:")) {
                const o = await rI(n, t);
                if (o && !(await yI(o))) return e.setStatus("Opening your link…"), D(), void location.replace(o)
            }
            e.setStatus("Preparing unlock form…");
            const o = await vI(t);
            if (!o?.querySelector('[name="ad_form_data"]')) return e.setError("Unlock form was not ready. Reload and try again."), void(hI = !1);
            const r = await (async t => {
                t.setNote(dI), t.setStatus("Waiting for captcha…");
                let e = null,
                    n = 0;
                const o = () => {
                        e?.(), e = null
                    },
                    r = () => {
                        const r = document.getElementById(aI) ?? document.querySelector(".cf-turnstile");
                        r && (r.id || (r.id = aI), e && document.getElementById(r.id) || (o(), e = Nt({
                            overlayId: iI,
                            mount: t.turnstileMount,
                            widgetId: r.id,
                            styleId: "skip-wait-lksfy-captcha-pin",
                            alsoVisibleSelectors: sI
                        }), n || (n = Date.now()), t.setStatus("Complete the captcha below.")))
                    },
                    i = Date.now() + 18e4;
                for (; Date.now() < i;) {
                    r();
                    const t = kI();
                    if (t && Date.now() - n >= 400) return o(), t;
                    await mI(200)
                }
                return o(), kI()
            })(e);
            if (!r) return e.setError("Turnstile was not completed. Finish the check above."), void(hI = !1);
            e.setNote(uI), e.setStatus("Unlocking your link…");
            let i = await SI(o, r, t);
            if (!i) {
                const e = Date.now() + 8e3;
                for (; !i && Date.now() < e && (i = await SI(o, r, t), !i);) await mI(300)
            }
            if (!i || await yI(i)) return e.setError("Couldn’t unlock this link. Reload and try again."), void(hI = !1);
            e.setStatus("Opening your link…"), D(), location.replace(i)
        };
    var xI = !1;

    function LI(t) {
        const e = t?.trim() ?? "";
        return tI.test(e) ? e : null
    }

    function CI() {
        if (xI) return;
        const t = function() {
            const t = LI(new URLSearchParams(location.search).get("id"));
            if (t) return t;
            const e = /var\s+alias\s*=\s*['"]([^'"]+)['"]/.exec(document.documentElement.innerHTML)?.[1],
                n = LI(e);
            if (n) return n;
            if (!(document.querySelector("#topButton, #bottomButton, .pro_btn") || /tagrget_url\s*=/.test(document.documentElement.innerHTML) || /You Are On\s*<span>\s*Step\s*\d+\s*\/\s*\d+/i.test(document.documentElement.innerHTML))) return null;
            const o = /(?:^|;\s*)alias=([^;]+)/i.exec(document.cookie)?.[1];
            try {
                return LI(o ? decodeURIComponent(o) : null)
            } catch {
                return LI(o)
            }
        }();
        t && (xI = !0, location.replace(function(t) {
            return `https://lksfy.com/${t}`
        }(t)))
    }
    var II = /^[a-f0-9]{32}$/i,
        TI = t => {
            for (const e of t.elements)
                if (e instanceof HTMLInputElement && "hidden" === e.type && II.test(e.name) && II.test(e.value)) return !0;
            return !1
        },
        $I = "skip-wait-rinku-overlay",
        AI = "data-skip-wait-submitted",
        qI = "data-skip-wait-paced",
        _I = ['iframe[src*="turnstile"]'],
        MI = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        OI = {
            lead: "Confirm you’re human.",
            detail: "Complete the check below. We’ll continue automatically when it’s done."
        },
        RI = null,
        PI = !1,
        DI = t => {
            "1" !== t.getAttribute(AI) && (t.setAttribute(AI, "1"), HTMLFormElement.prototype.submit.call(t))
        },
        NI = (t, e = MI) => RI ? (RI.setNote(e), RI.setStatus(t), RI.setError(null), RI) : RI = $t({
            id: $I,
            brand: "Skip Wait",
            note: e,
            status: t,
            countdownLabel: "Your link opens in"
        }),
        BI = (t, e) => {
            if (PI) return;
            PI = !0;
            const n = NI("Complete the captcha below.", OI);
            e.id || (e.id = "skip-wait-rinku-captcha"), document.getElementById("delulu-overlay")?.style.setProperty("display", "none", "important"), (t => {
                document.getElementById("overlay")?.remove();
                for (let e = t.parentElement; e && e !== document.body; e = e.parentElement) {
                    const t = getComputedStyle(e);
                    "none" === t.display && e.style.setProperty("display", "block", "important"), "hidden" === t.visibility && e.style.setProperty("visibility", "visible", "important"), "none" === t.pointerEvents && e.style.setProperty("pointer-events", "auto", "important")
                }
            })(e);
            const o = Nt({
                    overlayId: $I,
                    mount: n.turnstileMount,
                    widgetId: e.id,
                    styleId: "skip-wait-rinku-captcha-pin",
                    alsoVisibleSelectors: _I
                }),
                r = window.setInterval(() => {
                    if (!document.contains(t)) return window.clearInterval(r), o(), void(PI = !1);
                    (document.querySelector('[name="cf-turnstile-response"]')?.value.trim().length ?? 0) > 20 && (window.clearInterval(r), o(), document.getElementById("sf-lock")?.style.setProperty("display", "none", "important"), document.getElementById("sf-go-btn")?.style.setProperty("display", "none", "important"), n.setNote(MI), n.setStatus("Continuing…"), DI(t))
                }, 100)
        },
        UI = () => {
            if (/just a moment/i.test(document.title) || Boolean(document.querySelector("#challenge-error-text, #cf-challenge-running, .cf-challenge"))) return !1;
            const t = (() => {
                for (const t of document.forms)
                    if (TI(t)) return t;
                return null
            })();
            if (!t) return !1;
            const e = Boolean(document.getElementById("redirect-link") || document.getElementById("sf-frm2-t") || document.getElementById("sf-go-btn2-t") || document.getElementById("count")),
                n = document.getElementById("captcha-container") ?? document.querySelector('.cf-turnstile, [name="cf-turnstile-response"]');
            return n && !e ? (BI(t, n), !0) : !!e && ("1" !== t.getAttribute(qI) && ((t, e) => {
                t.setAttribute(qI, "1");
                const n = 21e3 - performance.now();
                if (n <= 0) return D(), void DI(t);
                e.startCountdown(Date.now() + n), window.setTimeout(() => {
                    D(), DI(t)
                }, n)
            })(t, NI("Opening destination…")), !0)
        },
        WI = /^\/u\/([^/]+)\/?$/i,
        HI = /^\/([^/]+)\/([^/]+)\/?$/i;

    function FI(t = location.pathname) {
        const e = HI.exec(t);
        return e?.[1] && e[2] ? `${decodeURIComponent(e[1])}/${decodeURIComponent(e[2])}` : null
    }
    var zI = () => !!/just a moment|performing security verification|attention required|um momento|un momento/i.test(document.title) || Boolean(document.querySelector(["#challenge-error-text", "#cf-challenge-running", "#challenge-form", ".cf-challenge", ".cf-browser-verification", 'script[src*="challenges.cloudflare.com"]'].join(", "))),
        jI = !1,
        YI = () => jI,
        GI = () => [...document.querySelectorAll("script")].map(t => t.textContent || "").join("\n").replace(/\\"/g, '"').replace(/\\n/g, "\n"),
        VI = (t, e) => {
            const n = new RegExp(`"${e}":"((?:\\\\.|[^"\\\\])*)"`).exec(t);
            if (!n?.[1]) return null;
            try {
                return JSON.parse(`"${n[1]}"`)
            } catch {
                return n[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\")
            }
        },
        ZI = (t, e) => new RegExp(`"${e}":true\\b`).test(t);

    function JI() {
        const t = function(t = location.pathname) {
                const e = WI.exec(t);
                return e?.[1] ? decodeURIComponent(e[1]) : null
            }(),
            e = GI(),
            n = VI(e, "finalUrl")?.trim() ?? "";
        if (!/^https?:\/\//i.test(n)) return null;
        const o = VI(e, "slug")?.trim() || t;
        return o ? {
            slug: o,
            finalUrl: n,
            rewardsEnabled: ZI(e, "rewardsEnabled"),
            fromDb: ZI(e, "fromDb")
        } : null
    }
    var XI = () => {
            if (JI()) return !0;
            if (document.querySelector("[data-bst-lv], [data-locker-continue-javascript-injector]")) return !0;
            const t = GI();
            return /"finalUrl"\s*:/.test(t) && (/\/api\/u\//.test(t) || /locker-session/.test(t) || /"Content Locked"/.test(t))
        },
        KI = () => {
            const t = document.getElementById("link_action_id");
            return t instanceof HTMLInputElement && t.value.trim() || null
        },
        QI = () => YI() && !zI() && XI(),
        tT = () => {
            if (!YI() || zI() || XI()) return !1;
            const t = location.hostname.toLowerCase();
            return "bstshrt.com" !== t && !t.endsWith(".bstshrt.com") && (Boolean(FI()) && !!KI() && (!![...document.scripts].some(t => /(?:bstlar|boostellar)\.com\/js\/(?:app\.js|chunks\/)/i.test(t.src)) || Boolean(document.querySelector(".unlock-wrapper, .link-card, .link-card-sub-title"))))
        },
        eT = (t, e) => `/api/u/${encodeURIComponent(t)}/${e}`;
    async function nT(t, e) {
        const n = {
            method: "POST",
            credentials: "include"
        };
        e && (n.headers = {
            "Content-Type": "application/json"
        }, n.body = JSON.stringify(e));
        const o = await fetch(t, n),
            r = await o.json().catch(() => ({}));
        return {
            ok: o.ok,
            status: o.status,
            data: r
        }
    }
    async function oT(t, e = {}) {
        return e.onStatus?.("Opening your link…"), async function(t) {
            const {
                slug: e
            } = t;
            if (fetch(eT(e, "view"), {
                    method: "POST",
                    keepalive: !0,
                    credentials: "include"
                }).catch(() => {}), !t.rewardsEnabled || !t.fromDb) return void(await nT(eT(e, "unlock"), {}));
            const n = await nT(eT(e, "locker-session"));
            if (!n.ok) return;
            const o = n.data,
                r = o.sessionToken;
            if ("string" == typeof r && r) {
                if (!o.skipRewardAdDueToCap) {
                    const t = "number" == typeof o.requiredAdViews && Number.isFinite(o.requiredAdViews) && o.requiredAdViews >= 1 ? Math.floor(o.requiredAdViews) : 2;
                    for (let n = 0; n < t; n++)
                        if (!(await nT(eT(e, "reward-ad-view"), {
                                sessionToken: r
                            })).ok) return;
                    await nT(eT(e, "reward-complete"), {
                        sessionToken: r
                    })
                }
                await nT(eT(e, "unlock"), {
                    sessionToken: r
                })
            }
        }(t).catch(() => {}), t.finalUrl
    }
    var rT = t => {
            const e = {
                Accept: "application/json, text/plain, */*",
                "X-Requested-With": "XMLHttpRequest"
            };
            t && (e["Content-Type"] = "application/json");
            const n = (() => {
                const t = document.cookie.split("; ").find(t => t.startsWith("XSRF-TOKEN="));
                return t ? decodeURIComponent(t.slice(11)) : null
            })();
            return n && (e["X-XSRF-TOKEN"] = n), e
        },
        iT = t => {
            if ("string" != typeof t) return null;
            const e = t.trim();
            return /^https?:\/\//i.test(e) ? e : null
        };
    var aT = "skip-wait-bstshrt-overlay",
        sT = "skip-wait-bstshrt-boot",
        cT = {
            lead: "Hang tight — unlocking your link.",
            detail: "Skip Wait is working. You don’t need to tap anything."
        },
        lT = null,
        uT = !1,
        dT = (t = "Getting ready…") => ((() => {
            const t = kt(aT);
            if (document.documentElement.classList.add(t), document.getElementById(sT)) return;
            const e = document.createElement("style");
            e.id = sT, e.textContent = Lt(aT, t), (document.head || document.documentElement).appendChild(e)
        })(), lT ? (lT.setNote(cT), lT.setStatus(t), lT.setError(null), lT) : lT = $t({
            id: aT,
            brand: "Skip Wait",
            note: cT,
            status: t
        })),
        mT = (t, e) => {
            e.setStatus("Opening your link…"), D(), location.replace(t)
        },
        pT = async () => {
            if (uT || zI() || !tT()) return;
            uT = !0;
            const t = dT("Reading shortlink…");
            try {
                const e = await async function(t = {}) {
                    const e = FI(),
                        n = KI();
                    if (!e) throw new Error("Legacy shortlink path not found.");
                    if (!n) throw new Error("link_action_id missing on page.");
                    t.onStatus?.("Reading shortlink…");
                    const o = await fetch(`/api/link?url=${encodeURIComponent(e)}&link_action_id=${encodeURIComponent(n)}`, {
                            credentials: "include",
                            headers: rT(!1)
                        }),
                        r = await o.json().catch(() => ({}));
                    if (412 === o.status) throw new Error(r.message || "Please refresh page and try again.");
                    if (429 === o.status) throw new Error("Too many requests. Wait a minute, then refresh.");
                    if (!o.ok) throw new Error(r.message || `Legacy link API failed (${o.status}).`);
                    const i = iT(r.redirect_url) || iT(r.destination_url);
                    if (r.completed && i) return i;
                    const a = r.id;
                    if ("number" != typeof a) throw new Error("Legacy link id missing.");
                    t.onStatus?.("Completing tasks…");
                    for (const u of r.interactive_tasks ?? []) {
                        if (u.completed) continue;
                        if ("number" != typeof u.link_task_id || "number" != typeof u.link_id || "number" != typeof u.task_id) continue;
                        const t = await fetch("/api/link-task-completed", {
                            method: "POST",
                            credentials: "include",
                            headers: rT(!0),
                            body: JSON.stringify({
                                link_task_id: u.link_task_id,
                                link_id: u.link_id,
                                task_id: u.task_id,
                                link_action_id: Number(n)
                            })
                        });
                        if (429 === t.status) throw new Error("Too many requests. Wait a minute, then refresh.");
                        if (!t.ok) {
                            const e = await t.json().catch(() => ({}));
                            throw new Error(e.message || `Task complete failed (${t.status}).`)
                        }
                    }
                    t.onStatus?.("Unlocking destination…");
                    const s = await fetch("/api/link-completed", {
                            method: "POST",
                            credentials: "include",
                            headers: rT(!0),
                            body: JSON.stringify({
                                link_id: a,
                                link_action_id: Number(n)
                            })
                        }),
                        c = await s.json().catch(() => ({}));
                    if (429 === s.status) throw new Error("Too many requests. Wait a minute, then refresh.");
                    if (!s.ok) throw new Error(c.message || `Link complete failed (${s.status}).`);
                    const l = iT(c.destination_url) || iT(c.redirect_url) || i;
                    if (!l) throw new Error("Legacy destination missing.");
                    return l
                }({
                    onStatus: e => t.setStatus(e)
                });
                mT(e, t)
            } catch (e) {
                t.setStatus("Something went wrong."), t.setError(e instanceof Error ? e.message : String(e))
            }
        }, hT = () => {
            !YI() || zI() || uT || (QI() ? (async () => {
                if (uT || zI() || !QI()) return;
                const t = JI();
                if (!t) return;
                uT = !0;
                const e = dT("Opening your link…");
                try {
                    const n = await oT(t, {
                        onStatus: t => e.setStatus(t)
                    });
                    mT(n, e)
                } catch (n) {
                    e.setStatus("Something went wrong."), e.setError(n instanceof Error ? n.message : String(n))
                }
            })() : tT() && pT())
        };
    var fT = "skip-wait-boostylink-overlay",
        wT = "skip-wait-boostylink-boot",
        gT = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        yT = null,
        kT = !1,
        bT = swDelay,
        vT = (t = "Getting things ready…") => ((() => {
            const t = kt(fT);
            if (document.documentElement.classList.add(t), document.getElementById(wT)) return;
            const e = document.createElement("style");
            e.id = wT, e.textContent = Lt(fT, t), (document.head || document.documentElement).appendChild(e)
        })(), yT ? (yT.setStatus(t), yT.setError(null), yT) : yT = $t({
            id: fT,
            brand: "Skip Wait",
            note: gT,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        ST = () => Boolean(document.querySelector(".unlock-btn[data-link]")?.dataset.link && document.querySelector(".action-btn[data-linkactionid]")),
        ET = async (t, e) => await (await fetch(t, {
            method: "POST",
            credentials: "same-origin",
            body: new URLSearchParams(e)
        })).json().catch(() => ({})), xT = async t => {
            const e = document.querySelector(".unlock-btn")?.dataset.link?.trim(),
                n = [...document.querySelectorAll(".action-btn[data-linkactionid]")].map(t => t.dataset.linkactionid?.trim() || "").filter(Boolean);
            if (!e || 0 === n.length) throw new Error("Locker actions not found.");
            if (t.setStatus("Starting unlock…"), (await Promise.all(n.map(t => ET("/api/locker_action_start.php", {
                    link_action_id: t
                })))).some(t => "ok" !== t.status)) throw new Error("Action start failed.");
            t.setStatus("Waiting for unlock timer…"), t.startCountdown(Date.now() + 2e4), await bT(2e4), t.hideCountdown(), t.setStatus("Completing actions…"), await Promise.all(n.map(t => (async t => {
                for (;;) {
                    const e = await ET("/api/locker_action_complete.php", {
                        link_action_id: t
                    });
                    if ("ok" === e.status) return;
                    if ("too_early" !== e.status && "too_fast" !== e.status) throw new Error("string" == typeof e.message ? e.message : "Action complete failed");
                    await bT(1e3 * (Number(e.wait_left) || 1))
                }
            })(t))), t.setStatus("Unlocking destination…");
            const o = await ET("", {
                    link_id: e
                }),
                r = o.data?.destination_url?.trim() || "";
            if ("ok" !== o.status || !/^https?:\/\//i.test(r)) throw new Error("string" == typeof o.message ? o.message : "Destination missing.");
            return r
        };
    var LT = /^\/a\/([^/]+)\/?$/i,
        CT = "skipwait-keyforge-tip",
        IT = () => {
            const t = LT.exec(location.pathname);
            return (t?.[1] ? decodeURIComponent(t[1]).trim() : "") || null
        },
        TT = () => {
            if (document.getElementById(CT) || !document.body) return;
            const t = document.querySelector(".ad-gate-card") || document.querySelector(".ad-provider-choice")?.parentElement || null;
            if (!t) return;
            const e = document.createElement("div");
            e.id = CT, e.setAttribute("role", "status"), e.style.cssText = ["box-sizing:border-box", "width:100%", "max-width:100%", "margin:0 0 12px", "padding:10px 12px", "border-radius:12px", "border:1px solid rgba(167,139,250,.35)", "background:rgba(167,139,250,.12)", "color:#f5f3ff", "font:13px/1.45 Nunito,system-ui,sans-serif"].join(";"), e.innerHTML = '<strong style="display:block;margin:0 0 4px;color:#c4b5fd">Skip Wait</strong>Linkvertise can take up to <strong>1 hour</strong> on some IPs — use <strong>BoostyLink</strong> instead, finish their steps, then return here and press Verify.', t.prepend(e)
        },
        $T = () => {
            IT() && (TT(), (() => {
                const t = [...document.querySelectorAll(".ad-provider-choice")].find(t => /boostylink/i.test(t.textContent || ""));
                t && (t.classList.contains("is-active") || "true" === t.getAttribute("aria-pressed") || t.click())
            })())
        },
        AT = () => {
            try {
                $T()
            } catch {}
        };

    function qT(t = location.pathname) {
        const e = t.replace(/^\/+|\/+$/g, "").split("/")[0]?.trim() ?? "";
        if (!e) return null;
        try {
            return decodeURIComponent(e)
        } catch {
            return e
        }
    }
    var _T = () => !!/just a moment|performing security verification|attention required|um momento|un momento/i.test(document.title) || Boolean(document.querySelector(["#challenge-error-text", "#cf-challenge-running", "#challenge-form", ".cf-challenge", ".cf-browser-verification", 'script[src*="challenges.cloudflare.com"]'].join(", "))),
        MT = (t, e) => {
            const n = new RegExp(`"${e}":"((?:\\\\.|[^"\\\\])*)"`).exec(t);
            if (!n?.[1]) return null;
            try {
                return JSON.parse(`"${n[1]}"`)
            } catch {
                return n[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\")
            }
        },
        OT = (t, e) => new RegExp(`"${e}":true\\b`).test(t);

    function RT() {
        const t = qT();
        if (!t) return null;
        const e = [...document.querySelectorAll("script")].map(t => t.textContent || "").join("\n").replace(/\\"/g, '"').replace(/\\n/g, "\n"),
            n = MT(e, "destinationDomain")?.trim() || "";
        return n ? {
            slug: MT(e, "slug")?.trim() || t,
            destinationDomain: n,
            hasSnippet: OT(e, "hasSnippet")
        } : null
    }
    var PT = () => {
            const t = document.body?.innerText ?? "";
            return !!/Unlock link/i.test(t) && (/Clear every step below/i.test(t) || /\d+\s*\/\s*\d+\s*done/i.test(t))
        },
        DT = () => !_T() && (!(!PT() && !RT()) && Boolean(qT()));

    function NT(t = location.href) {
        let e;
        try {
            e = new URL(t)
        } catch {
            return null
        }
        if (!((t = location.pathname) => /^\/verify\/?$/i.test(t))(e.pathname)) return null;
        const n = e.searchParams.get("hash")?.trim() ?? "",
            o = e.searchParams.get("target")?.trim() ?? "",
            r = e.searchParams.get("profileId")?.trim() ?? "";
        return n && o && r ? {
            hash: n,
            target: o,
            profileId: r
        } : null
    }
    var BT = () => !_T() && Boolean(NT()),
        UT = swDelay;
    async function WT(t = {}) {
        const e = await async function(t) {
            for (let e = 0; e < 40; e++) {
                const n = RT();
                if (n) return n;
                0 === e && t.onStatus?.("Reading locker…"), await UT(100)
            }
            throw new Error("Locker destination not found on page.")
        }(t);
        if (e.hasSnippet) {
            t.onStatus?.("Unlocking your link…");
            const n = await fetch(`/api/unlock/${encodeURIComponent(e.slug)}`, {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }),
                o = await n.json().catch(() => ({}));
            if (!n.ok) throw new Error(o.error || `Unlock failed (${n.status}).`);
            const r = "string" == typeof o.snippet ? o.snippet.trim() : "";
            if (r) return {
                kind: "snippet",
                text: r
            }
        }
        const n = (t => {
            const e = t.trim().replace(/^https?:\/\//i, "").replace(/\/+$/, "");
            if (!e || /\s/.test(e)) return null;
            try {
                return new URL(`https://${e}/`).href
            } catch {
                return null
            }
        })(e.destinationDomain);
        if (!n) throw new Error("Locker destination domain invalid.");
        return t.onStatus?.("Opening your link…"), {
            kind: "redirect",
            url: n
        }
    }
    var HT = "skip-wait-linkunlocker-overlay",
        FT = "skip-wait-linkunlocker-boot",
        zT = {
            lead: "Hang tight — unlocking your link.",
            detail: "Skip Wait is working. You don’t need to tap anything."
        },
        jT = null,
        YT = !1,
        GT = (t = "Getting ready…") => ((() => {
            const t = kt(HT);
            if (document.documentElement.classList.add(t), document.getElementById(FT)) return;
            const e = document.createElement("style");
            e.id = FT, e.textContent = Lt(HT, t), (document.head || document.documentElement).appendChild(e)
        })(), jT ? (jT.setNote(zT), jT.setStatus(t), jT.setError(null), jT) : jT = $t({
            id: HT,
            brand: "Skip Wait",
            note: zT,
            status: t
        })),
        VT = (t, e) => {
            e.setStatus("Opening your link…"), D(), location.replace(t)
        },
        ZT = async () => {
            if (YT || _T() || !DT()) return;
            if (!RT()) return;
            YT = !0;
            const t = GT("Opening your link…");
            try {
                const e = await WT({
                    onStatus: e => t.setStatus(e)
                });
                if ("snippet" === e.kind) return void(await (async (t, e) => {
                    D();
                    try {
                        await navigator.clipboard.writeText(t), e.setStatus("Content copied — you can paste it anywhere.")
                    } catch {
                        e.setStatus("Unlocked — your content is ready."), e.setError(t)
                    }
                })(e.text, t));
                VT(e.url, t)
            } catch (e) {
                t.setStatus("Something went wrong."), t.setError(e instanceof Error ? e.message : String(e))
            }
        }, JT = async () => {
            if (YT || _T() || !BT()) return;
            const t = NT();
            if (!t) return;
            YT = !0;
            const e = GT("Verifying destination…");
            try {
                const n = await async function(t, e = {}) {
                    e.onStatus?.("Verifying destination…");
                    const n = await fetch("/api/verify-linkvertise", {
                            method: "POST",
                            credentials: "include",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                hash: t.hash,
                                target: t.target,
                                profileId: t.profileId
                            })
                        }),
                        o = await n.json().catch(() => ({}));
                    if (!n.ok || !o.success) throw new Error(o.error || `Verify failed (${n.status}).`);
                    const r = (t => {
                        if ("string" != typeof t) return null;
                        const e = t.trim();
                        return /^https?:\/\//i.test(e) ? e : null
                    })(o.target);
                    if (!r) throw new Error("Verify target missing.");
                    return r
                }(t, {
                    onStatus: t => e.setStatus(t)
                });
                VT(n, e)
            } catch (n) {
                e.setStatus("Something went wrong."), e.setError(n instanceof Error ? n.message : String(n))
            }
        }, XT = () => {
            _T() || YT || (DT() ? ZT() : BT() && JT())
        };
    var KT = "skip-wait-gaea-operations-lockr-overlay",
        QT = "skip-wait-gaea-operations-lockr-boot",
        t$ = /^(auth|browse|dashboard|subscriptions|api-keys|terms-of-service|privacy-policy|discord|premium-auth)$/i,
        e$ = {
            lead: "Hang tight — unlocking your link.",
            detail: "Skip Wait is working. You don't need to tap anything."
        },
        n$ = !1,
        o$ = async t => {
            const e = await fetch(t);
            if (!e.ok) throw new Error(`Request failed (${e.status})`);
            return e.json()
        }, r$ = async (t, e) => {
            const {
                data: n
            } = await o$(`/api/v1/lockers/${t}/view`);
            if (!n.token) throw new Error("Unlock token missing.");
            var o;
            e.setStatus("Unlocking destination…"), e.startCountdown(Date.now() + 32e3), await (o = 32e3, new Promise(t => setTimeout(t, o))), e.hideCountdown();
            const r = (await o$(`/api/v1/lockers/${t}/unlock?token=${encodeURIComponent(n.token)}`)).data?.target;
            if (!r || !/^https?:\/\//i.test(r)) throw new Error("Unlock not ready.");
            return r
        };
    var i$ = /^\/[0-9][A-Za-z0-9]{2,11}(?:\/[^/]+)?\/?$/;
    var a$ = "skip-wait-workink-overlay",
        s$ = "skip-wait-workink-boot",
        c$ = "skip-wait-workink-gate",
        l$ = ["wk-hcaptcha-container", "wk-hcaptcha-overlay"],
        u$ = ["#wk-hcaptcha-container", "#wk-hcaptcha-overlay", ".cf-turnstile", 'iframe[src*="hcaptcha.com"]', 'iframe[src*="newassets.hcaptcha.com"]', 'iframe[src*="challenges.cloudflare.com"]', 'iframe[src*="turnstile"]'],
        d$ = {
            lead: "Hang tight — unlocking your link.",
            detail: "Skip Wait is working. You don't need to tap anything."
        },
        m$ = {
            lead: "Hang tight — unlocking your link.",
            detail: "Captcha can take a few seconds to load. Stay on this page."
        },
        p$ = {
            lead: "Confirm you’re human.",
            detail: "Complete the check below. We’ll continue automatically when it’s done."
        },
        h$ = ["Getting ready", "Preparing verification", "Loading captcha", "Waiting for challenge"],
        f$ = null,
        w$ = null,
        g$ = null,
        y$ = !1,
        k$ = !1,
        b$ = 0,
        v$ = 0,
        S$ = 0,
        E$ = (t, e = d$) => {
            const n = kt(a$);
            if (document.documentElement.classList.add(n), !document.getElementById(s$)) {
                const t = document.createElement("style");
                t.id = s$, t.textContent = Lt(a$, n), (document.head || document.documentElement).appendChild(t)
            }
            if (!document.getElementById(c$)) {
                const t = document.createElement("style");
                t.id = c$, t.textContent = u$.map(t => `html.${n} ${t},html.${n} ${t} *{visibility:visible!important;pointer-events:auto!important;opacity:1!important}`).join("") + `html.${n} iframe[src*="hcaptcha.com"],html.${n} iframe[src*="newassets.hcaptcha.com"],html.${n} iframe[src*="challenges.cloudflare.com"]{z-index:2147483647!important}`, (document.head || document.documentElement).appendChild(t)
            }
            return f$ ? (f$.setStatus(t), f$.setNote(e), f$) : f$ = $t({
                id: a$,
                brand: "Skip Wait",
                note: e,
                status: t
            })
        },
        x$ = () => {
            b$ && (window.clearInterval(b$), b$ = 0)
        },
        L$ = () => {
            b$ || k$ || y$ || w$ || (E$(`${h$[0]}.`, m$), b$ = window.setInterval(() => {
                k$ || y$ || w$ ? x$() : (0 === (S$ = (S$ + 1) % 3) && v$ < h$.length - 1 && (v$ += 1), E$(`${h$[v$]}${".".repeat(S$+1)}`, m$))
            }, 450))
        },
        C$ = () => {
            if (k$ || y$) return;
            const t = (() => {
                for (const t of l$) {
                    const e = document.getElementById(t);
                    if (e?.querySelector("iframe")) return e
                }
                for (const t of document.querySelectorAll(".cf-turnstile"))
                    if (t.querySelector("iframe")) return t;
                return null
            })();
            if (!t) return void L$();
            if (t === g$ && document.getElementById(t.id)) return;
            const e = E$("Complete the captcha below.", p$);
            t.id || (t.id = "skip-wait-workink-turnstile"), w$?.(), x$(), g$ = t, w$ = Nt({
                overlayId: a$,
                mount: e.turnstileMount,
                widgetId: t.id,
                styleId: "skip-wait-workink-pin",
                alsoVisibleSelectors: u$
            })
        };
    var I$ = "skipwait-storyline-brand";

    function T$() {
        return document.querySelector('.video-box.videoplay iframe[src*="mrtzn.com"], .videoplay-new-scome-bar iframe[src*="index_lms"]')?.closest(".video-box, .videoplay-new-scome-bar") ?? null
    }
    async function $$() {
        if (!document.body.classList.contains("course-play")) return;
        await at(() => !!T$());
        const t = T$();
        t && function(t) {
            if (document.getElementById(I$)) return;
            const e = document.createElement("div");
            e.id = I$, e.className = "card-panel green lighten-4", e.setAttribute("role", "status");
            const n = document.createElement("strong");
            n.className = "black-text", n.textContent = "Skip Wait";
            const o = document.createElement("span");
            o.className = "black-text", o.textContent = " — No more waiting on slides. Move on whenever you like.", e.append(n, o), t.after(e), D()
        }(t)
    }
    var A$ = /^\/([^/]+)\/file\/?$/i,
        q$ = ".custom-download-button, .custom-download-section, #customDownloadBtn, #customDownloadBtn2, .custom-download-btn",
        _$ = ".download-type.original-button button, #downloadSubmitBtn, #originalDownloadBtn, .original-download-btn",
        M$ = "skipwait-swiftuploads-brand";

    function O$() {
        return document.querySelector('meta[name="csrf-token"]')?.content?.trim() ?? null
    }
    async function R$(t, e, n) {
        await ((await fetch(t, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: new URLSearchParams({
                _token: n,
                p: e,
                method: "free"
            }).toString()
        })).body?.cancel?.())
    }
    async function P$(t, e) {
        ! function(t) {
            const e = new Date(Date.now() + 864e5).toUTCString();
            document.cookie = `rqf=${t}; expires=${e}; path=/`
        }(t);
        const n = await (await fetch(`${location.origin}/${t}/file/generate`, {
            method: "POST",
            credentials: "include",
            headers: {
                "X-CSRF-TOKEN": e,
                Accept: "application/json",
                "X-Requested-With": "XMLHttpRequest"
            }
        })).json().catch(() => null);
        return "string" == typeof n?.download_link ? n.download_link : null
    }
    async function D$(t) {
        const e = O$();
        return e ? (await async function(t) {
            const e = O$();
            if (!e) return;
            const n = `${location.origin}/${t}/file`;
            await R$(n, "down_1", e), await R$(n, "down_2", e)
        }(t), P$(t, e)) : null
    }

    function N$() {
        ! function() {
            const t = document.querySelector(".download-section-box");
            if (!t || document.getElementById(M$)) return;
            const e = document.createElement("div");
            e.id = M$, e.className = "alert alert-secondary text-center mb-4", e.setAttribute("role", "status");
            const n = document.createElement("div");
            n.className = "text-primary fw-bold mb-2";
            const o = document.createElement("i");
            o.className = "fa fa-bolt me-1", n.append(o, document.createTextNode("Skip Wait"));
            const r = document.createElement("p");
            r.className = "mb-0 text-break", r.textContent = "Extra download steps bypassed — click Free Download for a direct link.", e.append(n, r);
            const i = t.querySelector("h5");
            i ? t.insertBefore(e, i) : t.prepend(e)
        }(),
        function() {
            for (const t of document.querySelectorAll(q$)) t.style.display = "none"
        }();
        const t = document.getElementById("originalDownloadBtn") ? "download" : document.getElementById("down_2Form") ? "create" : "pick";
        if ("pick" === t) {
            const t = document.querySelector(".download-type.original-button");
            return void(t && (t.style.display = "block"))
        }
        if ("create" === t) {
            const t = document.getElementById("down_2Form");
            t && (t.style.display = "block");
            const e = document.querySelector("#downloadSubmitBtn");
            return void(e && (e.disabled = !1, e.classList.remove("disabled")))
        }
        const e = document.getElementById("originalDownloadBtn");
        e && (e.style.display = "inline-block", e.classList.remove("disabled"))
    }

    function B$(t, e) {
        if (e) return t.dataset.skipwaitHtml || (t.dataset.skipwaitHtml = t.innerHTML), t.innerHTML = '<div class="spinner-border spinner-border-sm me-2"></div><span>Generating...</span>', void(t instanceof HTMLButtonElement ? t.disabled = !0 : t.classList.add("disabled"));
        t.dataset.skipwaitHtml && (t.innerHTML = t.dataset.skipwaitHtml), t instanceof HTMLButtonElement ? t.disabled = !1 : t.classList.remove("disabled")
    }

    function U$(t) {
        N$();
        let e = !1;
        const n = n => {
            if (n.target.closest(q$)) return n.preventDefault(), void n.stopImmediatePropagation();
            const o = n.target.closest(_$);
            if (!o || e) return;
            n.preventDefault(), n.stopImmediatePropagation();
            const r = function(t) {
                return t.matches(_$) ? t : t.querySelector(_$)
            }(o);
            r && B$(r, !0), e = !0, D$(t).then(t => {
                t && (D(), location.assign(t))
            }).finally(() => {
                e = !1, r && B$(r, !1)
            })
        };
        document.addEventListener("click", n, !0), document.addEventListener("submit", t => {
            const e = t.target;
            e instanceof HTMLFormElement && e.querySelector('input[name="p"][value="down_1"], input[name="p"][value="down_2"]') && n(t)
        }, !0);
        const o = document.querySelector(".download-section-box");
        o && new MutationObserver(N$).observe(o, {
            childList: !0,
            subtree: !0,
            attributes: !0,
            attributeFilter: ["style", "class"]
        })
    }
    var W$ = /href="(https:\/\/fs\d+\.uploadrar\.com(?::\d+)?\/d\/[^"]+)"/i,
        H$ = "Free Download · Skip Wait — No Timer, No Mediator Pages";
    var F$ = "Free Download · Skip Wait — No Timer, No Mediator Pages";
    var z$ = "skipwait-theuser-cloud",
        j$ = "#downloadbtn",
        Y$ = /href=["'](https?:\/\/[^"']+\/d\/[^"']+)["']/i;
    async function G$(t) {
        const e = function(t) {
            const e = t.querySelector('input[name="code"]')?.closest("table");
            if (!e) throw new Error("captcha");
            return [...e.querySelectorAll("span")].map(t => {
                const e = t;
                return {
                    pl: parseInt(e.style.paddingLeft, 10),
                    ch: (e.textContent ?? "").trim()
                }
            }).filter(t => 1 === t.ch.length && Number.isFinite(t.pl)).sort((t, e) => t.pl - e.pl).map(t => t.ch).join("")
        }(t);
        if (!e) throw new Error("captcha");
        const n = new URLSearchParams;
        for (const [a, s] of new FormData(t)) "string" == typeof s && n.append(a, s);
        n.set("code", e);
        const o = await fetch(location.href, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: n
        });
        if (!o.ok) throw new Error("post");
        const r = await o.text();
        if (/You have to wait\s+\d+\s+seconds/i.test(r)) throw new Error("wait");
        const i = r.match(Y$)?.[1];
        if (!i) throw new Error("link");
        return i
    }

    function V$(t, e) {
        const n = t.querySelector('input[name="code"]');
        if (!n) return;
        n.disabled = !0, n.style.pointerEvents = "none";
        const o = e.closest(".col-lg-4");
        if (!o) return;
        let r;
        ! function(t) {
            if (document.getElementById(z$)) return;
            const e = Object.assign(document.createElement("div"), {
                id: z$,
                innerHTML: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="flex:0 0 auto"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg><div><div style="font-weight:700;font-size:15px;letter-spacing:-.01em">Skip Wait</div><div style="font-size:12.5px;opacity:.92;margin-top:2px;line-height:1.4">Captcha is handled for you — click Create download link to start your file.</div></div>'
            });
            e.setAttribute("role", "status"), e.style.cssText = "display:flex;align-items:center;gap:12px;margin:0 auto 16px;padding:14px 16px;border-radius:12px;max-width:28rem;background:linear-gradient(135deg,#153fb9,#0f2e79);color:#fff;box-shadow:0 6px 18px rgba(15,46,121,.28);font-family:Manrope,system-ui,-apple-system,sans-serif", t.before(e)
        }(o);
        let i = !1;
        const a = () => {
            if (r) return D(), void location.assign(r);
            i || (i = !0, G$(t).then(t => {
                r = t, i = !1, D(), location.assign(t)
            }).catch(() => {
                i = !1
            }))
        };
        document.addEventListener("click", t => {
            t.target.closest(j$) && (t.preventDefault(), t.stopImmediatePropagation(), a())
        }, !0), t.addEventListener("submit", t => {
            t.preventDefault(), t.stopImmediatePropagation(), a()
        }, !0)
    }
    var Z$ = "skipwait-oceanofdmg",
        J$ = /http-equiv=["']Refresh["'][^>]*content=["']\d+\s*;\s*url=([^"']+)["']/i;

    function X$(t) {
        const e = t.match(J$)?.[1];
        if (!e?.startsWith("http")) throw new Error("cdn");
        return e
    }

    function K$(t) {
        ! function(t) {
            if (document.getElementById(Z$)) return;
            const e = Object.assign(document.createElement("div"), {
                id: Z$,
                innerHTML: '<strong style="display:block;font-size:15px;margin-bottom:2px">Skip Wait</strong><span style="font-size:12.5px;opacity:.92">Waiting page skipped — download opens the file directly.</span>'
            });
            e.setAttribute("role", "status"), e.style.cssText = 'text-align:center;margin:14px auto 0;padding:12px 14px;max-width:28rem;box-sizing:border-box;border-radius:10px;background:linear-gradient(135deg,#c3251d,#8b1a14);color:#fff;font:14px/1.4 "Source Sans Pro",system-ui,sans-serif', t.querySelector('div[align="center"]').after(e)
        }(t);
        const e = async function(t) {
            const e = new URLSearchParams;
            for (const [o, r] of new FormData(t)) "string" == typeof r && o && e.set(o, r);
            const n = await fetch(`${location.origin}/download/`, {
                method: "POST",
                credentials: "include",
                cache: "no-store",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
                },
                body: e
            });
            if (!n.ok) throw new Error("post");
            return X$(await n.text())
        }(t);
        t.addEventListener("submit", t => {
            t.preventDefault(), t.stopImmediatePropagation(), e.then(t => {
                D(), window.open(t, "_blank", "noopener,noreferrer")
            })
        }, !0)
    }
    var Q$ = /window\.location\.href\s*=\s*["'](https?:\/\/[^"']+)["']/;

    function tA(t) {
        return fetch(t.action, {
            method: "POST",
            credentials: "include",
            cache: "no-store",
            body: new FormData(t)
        }).then(t => t.text()).then(t => Q$.exec(t)[1])
    }
    var eA = /^[A-Za-z0-9]{4,}$/;

    function nA(t = location.pathname) {
        const e = t.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
        if (1 !== e.length) return null;
        const n = e[0];
        return eA.test(n) ? n : null
    }
    var oA = "skip-wait-goost-overlay",
        rA = "skip-wait-goost-boot",
        iA = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        aA = null,
        sA = !1,
        cA = (t = "Getting things ready…") => ((() => {
            const t = kt(oA);
            if (document.documentElement.classList.add(t), document.getElementById(rA)) return;
            const e = document.createElement("style");
            e.id = rA, e.textContent = Lt(oA, t), (document.head || document.documentElement).appendChild(e)
        })(), aA ? (aA.setStatus(t), aA.setError(null), aA) : aA = $t({
            id: oA,
            brand: "Skip Wait",
            note: iA,
            status: t,
            countdownLabel: "Your link opens in"
        })),
        lA = () => {
            if (sA || !nA()) return sA;
            const t = document.querySelector("#nextstepform");
            return !!t && (sA = !0, cA("Skipping continue page…"), window.adblockstatus = !1, document.getElementById("alertalert")?.remove(), t.style.display = "inline-block", t.submit(), !0)
        };
    var uA = "skip-wait-goost-mediator",
        dA = "skip-wait-goost-mediator-boot",
        mA = "skip-wait-goost-recaptcha",
        pA = ['iframe[src*="google.com/recaptcha"]', 'iframe[src*="recaptcha.net"]', 'iframe[src*="api2/bframe"]', 'iframe[src*="enterprise/bframe"]'],
        hA = /https?:\/\/(?:www\.)?goo\.st\/links\/statistics\/([A-Za-z0-9]+)/i,
        fA = {
            lead: "Hang tight — unlocking your link.",
            detail: "You don't need to tap anything on the page."
        },
        wA = {
            lead: "Confirm you’re human.",
            detail: "Tap the checkbox below. We’ll continue automatically when it’s done."
        },
        gA = null,
        yA = !1,
        kA = !1,
        bA = (t = fA, e = "Getting things ready…") => ((() => {
            const t = kt(uA);
            if (document.documentElement.classList.add(t), document.getElementById(dA)) return;
            const e = document.createElement("style");
            e.id = dA, e.textContent = Lt(uA, t), (document.head || document.documentElement).appendChild(e)
        })(), gA ? (gA.setNote(t), gA.setStatus(e), gA.setError(null), gA) : gA = $t({
            id: uA,
            brand: "Skip Wait",
            note: t,
            status: e,
            countdownLabel: "Your link opens in"
        })),
        vA = t => {
            window.adblockstatus = !1, window.blurred = !1, document.getElementById("alertalert")?.remove();
            for (const e of t.querySelectorAll("[onclick]")) /window\.open|tierande/i.test(e.getAttribute("onclick") || "") && (e.removeAttribute("onclick"), e.onclick = null);
            for (const e of t.querySelectorAll("button, a.get-link")) e.removeAttribute("disabled"), e instanceof HTMLButtonElement && (e.disabled = !1)
        },
        SA = t => {
            if (kA) return !0;
            const e = (t => {
                if (t.querySelector('form .g-recaptcha, form input[name="alias"]')) return null;
                const e = document.documentElement.innerHTML.match(hA);
                return e?.[0] && eA.test(e[1]) ? e[0] : null
            })(t);
            return !!e && (kA = !0, vA(t), D(), location.replace(e), !0)
        },
        EA = t => {
            if (yA) return !0;
            const e = (t => {
                const e = t.querySelector("form");
                if (!e?.querySelector(".g-recaptcha")) return null;
                const n = e.querySelector('input[name="alias"]')?.value.trim() ?? "";
                return eA.test(n) ? e : null
            })(t);
            if (!e) return !1;
            yA = !0, vA(e);
            const n = bA(wA, "Waiting for captcha…"),
                o = e.querySelector(".g-recaptcha");
            o.id || (o.id = mA);
            let r = null,
                i = !1,
                a = 0;
            const s = () => {
                if (!i) {
                    if (!document.contains(e)) return i = !0, cancelAnimationFrame(a), void r?.();
                    i || r || document.getElementById(mA) && (r = Nt({
                        overlayId: uA,
                        mount: n.turnstileMount,
                        widgetId: mA,
                        styleId: "skip-wait-goost-captcha-pin",
                        alsoVisibleSelectors: pA
                    })), (t => (t.querySelector('[name="g-recaptcha-response"]')?.value.trim() ?? "").length > 20)(e) ? i || (i = !0, cancelAnimationFrame(a), r?.(), r = null, n.setNote(fA), n.setStatus("Continuing…"), vA(e), e.querySelector('button[type="submit"]').click()) : a = requestAnimationFrame(s)
                }
            };
            return a = requestAnimationFrame(s), !0
        },
        xA = () => {
            const t = document.getElementById("secretsecret");
            t && (SA(t) || EA(t))
        };
    var LA = /^\/download\//i,
        CA = "skipwait-ankergames-banner";

    function IA() {
        if (document.getElementById(CA)) return !0;
        const t = document.querySelector('[x-ref="animatedText"]')?.closest("div");
        if (!t?.parentElement) return !1;
        const e = Object.assign(document.createElement("div"), {
            id: CA,
            className: "py-3 px-4 mb-6 rounded-lg bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-700/30",
            innerHTML: '<div class="flex items-start"><div class="shrink-0 mr-3"><svg aria-hidden="true" class="w-5 h-5 text-sky-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-3.03-2.72a1 1 0 00-1.44-1.38l-4.1 4.28-1.96-1.96a1 1 0 10-1.42 1.42l2.69 2.68a1 1 0 001.43-.02l4.8-5.02z" clip-rule="evenodd"></path></svg></div><div><p class="text-sm text-sky-800 dark:text-sky-200"><span class="font-medium">Skip Wait</span> removed the wait timer. Your download buttons unlock the moment the check is solved — no countdown.</p></div></div>'
        });
        return e.setAttribute("role", "status"), t.parentElement.insertBefore(e, t), D(), !0
    }
    var TA = "skipwait-apunkagames-brand";

    function $A() {
        const t = [...document.querySelectorAll('form[action*="download-process.php"]')],
            e = t[0];
        if (!e) return;
        let n = !1;
        for (const o of t) {
            const t = o.querySelector('input[name="file"]')?.value.trim();
            t && /^https?:\/\//i.test(t) && (n = !0, o.addEventListener("submit", e => {
                e.preventDefault(), e.stopImmediatePropagation(), window.open(t, "_blank", "noopener,noreferrer")
            }, !0))
        }
        n && D(),
            function(t) {
                if (document.getElementById(TA)) return;
                const e = Object.assign(document.createElement("div"), {
                    id: TA,
                    innerHTML: '<strong style="display:block;font-size:16px;color:#42a8e7;margin-bottom:4px">Skip Wait</strong><span style="display:block;font-size:14px;font-weight:700;color:#333">Download timer bypassed — each part opens the file host directly.</span>'
                });
                e.setAttribute("role", "status"), e.style.cssText = "text-align:center;margin:18px auto 22px;padding:14px 18px;max-width:480px;box-sizing:border-box;border-radius:18px;background:#e8f5fc;border:2px solid #42a8e7;font:15px/1.45 Arial,Helvetica,sans-serif;color:#1a5f8a", t.before(e)
            }(e)
    }
    var AA = /\?g=(\d+)&f=(\d+)&gpath=([^&"']+)&lang=([^&"']+)/,
        qA = /href=['"](https:\/\/cdn\.gamesnostalgia\.com[^'"]+)/i,
        _A = "skipwait-gamesnostalgia-brand";

    function MA(t, e) {
        let n = document.getElementById(_A);
        n || (n = Object.assign(document.createElement("p"), {
            id: _A,
            className: "small text-success mt-2 mb-0"
        }), n.setAttribute("role", "status"), t.after(n)), n.textContent = e
    }

    function OA(t, e, n, o, r) {
        const i = "it" === r,
            a = t.innerHTML;
        t.removeAttribute("data-bs-toggle"), t.removeAttribute("data-bs-target"), t.disabled = !0, t.innerHTML = '<img src="//t.gamesnostalgia.com/img/loading3.gif" alt=""> ' + (i ? "Generazione…" : "Generating…"), MA(t, i ? "Skip Wait — generazione del link CDN…" : "Skip Wait — generating CDN link…");
        const s = function(t, e, n, o) {
            return fetch(`/download_post_call.php?g=${t}&f=${e}&gpath=${n}&lang=${o}&rnd=${Math.random()}`, {
                credentials: "same-origin",
                cache: "no-store"
            }).then(t => t.ok ? t.text() : "").then(t => t.match(qA)?.[1] ?? null)
        }(e, n, o, r).then(e => (t.disabled = !1, t.innerHTML = a, MA(t, e ? i ? "Skip Wait — link CDN pronto, clicca per scaricare" : "Skip Wait — CDN link ready, click to download" : i ? "Skip Wait — generazione non riuscita, riprova" : "Skip Wait — could not generate link, try again"), e));
        t.addEventListener("click", t => {
            t.preventDefault(), t.stopImmediatePropagation(), s.then(t => {
                t && (D(), location.assign(t))
            })
        }, !0)
    }
    var RA = "Free Download · Skip Wait — No Timer, No Please-Wait Pages",
        PA = {
            ok: "#4caf50",
            busy: "#2196f3",
            err: "#e53935"
        },
        DA = "display:block;width:100%;max-width:271px;margin:0 auto;padding:14px 12px;border:0;border-radius:5px;font:700 13px/1.35 Verdana,Arial,Helvetica,sans-serif;color:#fff;cursor:pointer";

    function NA(t, e, n = "ok") {
        t.disabled = "busy" === n, t.textContent = e, t.style.background = PA[n]
    }

    function BA(t) {
        const e = new FormData(t),
            n = String(e.get("id") ?? "").trim(),
            o = String(e.get("filename") ?? "").trim();
        if (!n || !o) return;
        const r = String(e.get("filesize") ?? "").trim(),
            i = function(t) {
                const e = t.querySelector('input[type="image"]');
                if (e) {
                    const t = e.width || Number(e.getAttribute("width")) || 271,
                        n = document.createElement("button");
                    return n.type = "button", n.style.cssText = `${DA};max-width:${t}px`, e.replaceWith(n), n
                }
                const n = t.querySelector("button");
                return n ? (n.type = "button", n.removeAttribute("title"), n.className = "", n.style.cssText = DA, n) : null
            }(t);
        if (!i) return;
        NA(i, RA);
        let a = !1;
        i.addEventListener("click", () => {
            a || (a = !0, NA(i, "Generating…", "busy"), function(t, e, n) {
                return new Promise(o => {
                    try {
                        chrome.runtime.sendMessage({
                            type: "OCEANOFGAMES_RESOLVE_CDN",
                            id: t,
                            filename: e,
                            filesize: n
                        }, t => {
                            o(chrome.runtime.lastError ? null : t?.url ?? null)
                        })
                    } catch {
                        o(null)
                    }
                })
            }(n, o, r).then(t => {
                if (!t) throw new Error("cdn");
                NA(i, RA), D(), window.open(t, "_blank", "noopener,noreferrer")
            }).catch(() => NA(i, "Failed", "err")).finally(() => {
                a = !1
            }))
        })
    }
    var UA = /encodeSecret\s*=\s*"([^"]+)"/,
        WA = /^https?:\/\//i;

    function HA(t) {
        if (!t) return null;
        const e = t.trim();
        if (WA.test(e)) return e;
        const n = function() {
            for (const t of document.querySelectorAll("script")) {
                const e = UA.exec(t.textContent ?? "");
                if (e?.[1]) return e[1]
            }
            return "yasir252_encode_2025_x7k3m9w2"
        }();
        try {
            const t = atob(e);
            let o = "";
            for (let e = 0; e < t.length; e++) o += String.fromCharCode(t.charCodeAt(e) ^ n.charCodeAt(e % n.length));
            return WA.test(o) ? o : null
        } catch {
            return null
        }
    }

    function FA(t) {
        return t.getAttribute("data-og-url") ?? t.getAttribute("data-elink")
    }
    var zA = "#downloadForm [data-og-url], #downloadForm [data-elink]",
        jA = "skipwait-yasir252-brand",
        YA = !1,
        GA = !1;

    function VA(t, e) {
        if (t instanceof HTMLAnchorElement) return t.href = e, t.target = "_blank", t.rel = "noopener noreferrer", t.removeAttribute("data-og-url"), void t.removeAttribute("data-elink");
        const n = document.createElement("a");
        n.href = e, n.target = "_blank", n.rel = "noopener noreferrer", n.className = t.className, n.textContent = t.textContent?.trim() ?? "", t.replaceWith(n)
    }

    function ZA() {
        let t = !1;
        for (const e of document.querySelectorAll(zA)) {
            const n = HA(FA(e));
            n && (VA(e, n), t = !0)
        }
        t && (GA || (GA = !0, D()), function() {
            if (document.getElementById(jA)) return;
            const t = document.querySelector("#downloadBox .dl-header");
            if (!t) return;
            const e = document.createElement("p");
            e.id = jA, e.className = "dl-subtitle", e.setAttribute("role", "status"), e.textContent = "Skip Wait unlocked direct download links", t.append(e)
        }(), YA || (YA = !0, document.getElementById("downloadForm")?.addEventListener("submit", t => {
            t.preventDefault(), t.stopImmediatePropagation()
        }, !0)))
    }
    var JA = !1;

    function XA() {
        document.getElementById("noticeModalOverlay")?.remove();
        let t = !1;
        for (const e of document.querySelectorAll("[data-elink], [data-og-url]")) {
            if (!(e instanceof HTMLAnchorElement)) continue;
            const n = HA(FA(e));
            n && (e.href = n, e.target = "_blank", e.rel = "noopener noreferrer", e.textContent = "DOWNLOAD", e.style.pointerEvents = "auto", e.removeAttribute("data-og-url"), e.removeAttribute("data-elink"), e.replaceWith(e.cloneNode(!0)), t = !0)
        }
        t && (JA || (JA = !0, D()), function() {
            for (const t of document.querySelectorAll(".download div, .download p")) {
                const e = t.textContent?.trim() ?? "";
                "Resource Is Being Prepared!" === e && (t.textContent = "Download Ready"), e.startsWith("Your download is almost ready") && (t.textContent = "Skip Wait unlocked the direct download link.")
            }
        }())
    }
    var KA = "skip-wait-vegamovies-entry-overlay",
        QA = "skip-wait-vegamovies-entry-boot",
        tq = /\bhref\s*=\s*["'](\/\?re=[^"']+)["']/,
        eq = {
            lead: "Opening the VegaMovies catalog.",
            detail: "Skip Wait is bypassing the landing page."
        },
        nq = null;
    var oq = "skipwait-vegamovies-brand",
        rq = /http-equiv=["']refresh["'][^>]*content=["']\d+\s*;\s*url=([^"']+)["']/i,
        iq = new Map;

    function aq(t) {
        const e = t.match(rq)?.[1]?.trim();
        return e && /^https?:\/\//i.test(e) ? e : null
    }

    function sq(t) {
        try {
            const e = new URL(t, location.href);
            return e.searchParams.has("re") ? "http:" !== e.protocol && "https:" !== e.protocol ? null : e.href : null
        } catch {
            return null
        }
    }
    async function cq(t) {
        const e = iq.get(t);
        if (e) return e;
        const n = await fetch(t, {
            cache: "no-store",
            credentials: "same-origin"
        });
        if (!n.ok) return null;
        const o = aq(await n.text());
        return o && iq.set(t, o), o
    }

    function lq() {
        document.addEventListener("click", t => {
            if (t.defaultPrevented || 0 !== t.button || t.metaKey || t.ctrlKey || t.shiftKey || t.altKey) return;
            const e = t.target?.closest?.("a[href]");
            if (!(e instanceof HTMLAnchorElement)) return;
            const n = sq(e.getAttribute("href") || e.href);
            if (!n) return;
            t.preventDefault(), t.stopImmediatePropagation();
            const o = "_blank" === e.target;
            cq(n).then(t => {
                t ? function(t, e) {
                    D(), e ? window.open(t, "_blank", "noopener,noreferrer") : location.replace(t)
                }(t, o) : o ? window.open(n, "_blank", "noopener,noreferrer") : location.assign(n)
            }).catch(() => {
                o ? window.open(n, "_blank", "noopener,noreferrer") : location.assign(n)
            })
        }, !0)
    }
    var uq = /\/generate\.php$/i,
        dq = "skip-wait-cinefreak-mediator",
        mq = "skip-wait-cinefreak-mediator-boot",
        pq = /window\.location\.href\s*=\s*"(https?:\/\/[^"]+)"/,
        hq = {
            lead: "Hang tight — opening your download.",
            detail: "You don't need to tap anything on the page."
        },
        fq = null,
        wq = 0,
        gq = !1,
        yq = t => ((() => {
            const t = kt(dq);
            if (document.documentElement.classList.add(t), document.getElementById(mq)) return;
            const e = document.createElement("style");
            e.id = mq, e.textContent = Lt(dq, t), (document.head || document.documentElement).appendChild(e)
        })(), fq ? (fq.setStatus(t), fq.setError(null), fq) : (wq = Date.now(), fq = $t({
            id: dq,
            brand: "Skip Wait",
            note: hq,
            status: t
        })));

    function kq() {
        return function() {
            const t = new URLSearchParams(location.search).get("id");
            if (!t) return null;
            try {
                const e = t.replace(/-/g, "+").replace(/_/g, "/"),
                    n = atob(e + "=".repeat((4 - e.length % 4) % 4)),
                    o = n.match(/^(https:\/\/[^/]+\/f\/[a-f0-9]+)/i);
                return o?.[1] ? o[1] : n.match(/^(https:\/\/[^\s"']+)/i)?.[1] ?? null
            } catch {
                return null
            }
        }() ?? function(t) {
            return t.match(pq)?.[1] ?? null
        }(document.documentElement.innerHTML)
    }

    function bq() {
        if (gq || !uq.test(location.pathname)) return;
        const t = kq();
        t && (gq = !0, function(t) {
            yq("Opening your download…"), D();
            const e = () => location.replace(t),
                n = Math.max(0, 200 - (Date.now() - wq));
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    n > 0 ? window.setTimeout(e, n) : e()
                })
            })
        }(t))
    }


    /*
     * Upstream sync (Skip Wait source v1.4.82, 7602a26): three local-only
     * flows.  `ot()` is this freeware edition's always-allow hostname gate;
     * these ports deliberately have no daily limit, key, or account check.
     */
    const vexolinkSite = "vexolink";
    const vexolinkAliasRe = /^(?=.*[A-Za-z])[A-Za-z0-9]{3,}$/;
    const vexolinkOverlayId = "skip-wait-vexolink-overlay";
    let vexolinkUi = null;
    let vexolinkPulseTimer = null;
    let vexolinkPulseDots = 0;
    let vexolinkBaseStatus = "";
    let vexolinkCounting = !1;
    let vexolinkDone = !1;

    function vexolinkAliasFromPath(pathname) {
        const [segment, ...rest] = pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
        return segment && 0 === rest.length && vexolinkAliasRe.test(segment) ? segment : null;
    }

    function vexolinkEnsureUi() {
        return vexolinkUi || (vexolinkUi = $t({
            id: vexolinkOverlayId,
            brand: "Skip Wait",
            note: {
                lead: "Hang tight — unlocking your link.",
                detail: "Skip Wait is working. You don’t need to tap anything."
            },
            status: "Opening VexoLink",
            countdownLabel: "Your link opens in"
        }));
    }

    function vexolinkStopPulse() {
        null != vexolinkPulseTimer && (clearInterval(vexolinkPulseTimer), vexolinkPulseTimer = null);
    }

    function vexolinkPaintProgress(progress) {
        const ui = vexolinkEnsureUi();
        vexolinkBaseStatus = progress.status.replace(/\.+$/, "");
        ui.setNote({
            lead: progress.lead,
            detail: progress.detail
        });
        if ("number" === typeof progress.waitEndTs && progress.waitEndTs > Date.now()) return vexolinkCounting = !0, vexolinkStopPulse(), ui.setStatus(vexolinkBaseStatus), ui.startCountdown(progress.waitEndTs), ui;
        vexolinkCounting = !1, ui.hideCountdown(), vexolinkPulseDots = 0, ui.setStatus(`${vexolinkBaseStatus}.`), null == vexolinkPulseTimer && (vexolinkPulseTimer = window.setInterval(() => {
            vexolinkCounting || !vexolinkUi || (vexolinkPulseDots = (vexolinkPulseDots + 1) % 3, vexolinkUi.setStatus(`${vexolinkBaseStatus}${".".repeat(vexolinkPulseDots + 1)}`));
        }, 450)), ui;
    }

    function vexolinkShowError(status) {
        vexolinkCounting = !0, vexolinkStopPulse();
        const ui = vexolinkEnsureUi();
        return ui.hideCountdown(), ui.setNote({
            lead: "Something went wrong.",
            detail: "Reload this page and try again."
        }), ui.setStatus(status), ui;
    }

    function vexolinkRequestResolve(pageUrl) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({
                type: "VEXOLINK_RESOLVE",
                pageUrl
            }, response => {
                chrome.runtime.lastError || !response?.ok || !response.dest ? reject(new Error("resolve")) : resolve(response.dest);
            });
        });
    }

    function vexolinkOpenDestination(url) {
        return new Promise(resolve => {
            chrome.runtime.sendMessage({
                type: "VEXOLINK_OPEN_DEST",
                url
            }, ok => {
                resolve(!chrome.runtime.lastError && !0 === ok);
            });
        });
    }

    function vexolinkBindProgress() {
        const onProgress = message => {
            if ("VEXOLINK_PROGRESS" !== message?.type || "string" !== typeof message.lead || "string" !== typeof message.detail || "string" !== typeof message.status) return;
            vexolinkPaintProgress({
                lead: message.lead,
                detail: message.detail,
                status: message.status,
                ..."number" === typeof message.waitEndTs ? {
                    waitEndTs: message.waitEndTs
                } : {}
            });
        };
        return chrome.runtime.onMessage.addListener(onProgress), () => chrome.runtime.onMessage.removeListener(onProgress);
    }

    async function vexolinkRun() {
        if (vexolinkDone) return;
        vexolinkDone = !0;
        const unbind = vexolinkBindProgress();
        try {
            vexolinkPaintProgress({
                lead: "Hang tight — unlocking your link.",
                detail: "Skip Wait is working. You don’t need to tap anything.",
                status: "Opening VexoLink"
            });
            const destination = await vexolinkRequestResolve(location.href);
            if (!(await vexolinkOpenDestination(destination))) return vexolinkDone = !1, void vexolinkShowError("Couldn’t open the destination. Reload and try again.");
        } catch {
            vexolinkDone = !1, vexolinkShowError("Couldn’t finish this short link. Reload and try again.");
        } finally {
            unbind();
        }
    }

    function initVexolink() {
        window === window.top && vexolinkAliasFromPath(location.pathname) && ot(vexolinkSite).then(allowed => {
            allowed && vexolinkRun();
        });
    }

    const movies4uSite = "movies4u";
    const movies4uOverlayId = "skip-wait-movies4u-overlay";
    let movies4uUi = null;
    let movies4uPulse = null;

    function movies4uLatestReleasesFromHtml(html, pageHost) {
        for (const match of html.matchAll(/<a\b[^>]*>/gi)) {
            const tag = match[0];
            if (!/\bcta-btn\b/i.test(tag) || !/\bbtn-1\b/i.test(tag)) continue;
            const href = tag.match(/\bhref\s*=\s*["'](https?:\/\/[^"'>\s]+)["']/i)?.[1]?.trim();
            if (!href) continue;
            try {
                const url = new URL(href);
                if (url.hostname !== pageHost) return url.href;
            } catch {}
        }
        return null;
    }

    async function movies4uResolveLatestReleases() {
        const pageHost = location.hostname;
        const response = await fetch(`${location.origin}/`, {
            cache: "no-store",
            credentials: "same-origin"
        }).catch(() => null);
        if (response?.ok) {
            const destination = movies4uLatestReleasesFromHtml(await response.text(), pageHost);
            if (destination) return destination;
        }
        return movies4uLatestReleasesFromHtml(document.documentElement.innerHTML, pageHost);
    }

    function movies4uEnsureUi(status) {
        return movies4uUi ? (movies4uUi.setNote({
            lead: "Opening Latest Releases",
            detail: "Skip Wait is reading the landing source."
        }), movies4uUi.setStatus(status), movies4uUi.setError(null), movies4uUi) : movies4uUi = $t({
            id: movies4uOverlayId,
            brand: "Skip Wait",
            note: {
                lead: "Opening Latest Releases",
                detail: "Skip Wait is reading the landing source."
            },
            status
        });
    }

    async function movies4uRun() {
        const ui = movies4uEnsureUi("Reading landing source");
        let dots = 0;
        const paint = () => ui.setNote({
            lead: `Opening Latest Releases${".".repeat(dots + 1)}`,
            detail: "Skip Wait is reading the landing source."
        });
        paint(), null == movies4uPulse && (movies4uPulse = window.setInterval(() => {
            dots = (dots + 1) % 3, paint();
        }, 450));
        const destination = await movies4uResolveLatestReleases().catch(() => null);
        null != movies4uPulse && (clearInterval(movies4uPulse), movies4uPulse = null);
        destination ? (ui.setNote({
            lead: "Opening Latest Releases",
            detail: "Skip Wait is reading the landing source."
        }), ui.setStatus("Opening Latest Releases"), location.replace(destination)) : (ui.setNote({
            lead: "Could not open Latest Releases",
            detail: "Reload and try again."
        }), ui.setStatus(""), ui.setError("Latest Releases link missing from landing source."));
    }

    function initMovies4u() {
        window === window.top && ot(movies4uSite).then(allowed => {
            allowed && it(() => {
                movies4uEnsureUi("Reading landing source"), movies4uRun();
            });
        });
    }

    const molynSite = "molyn";
    const molynOverlayId = "skip-wait-molyn-overlay";
    const molynPathRe = /^\/(keysystem|finishline|fl|cp\d+)$/;
    const molynPastebinFallback = "https://pastebin.com/raw/SfhHjBQ1";

    async function molynFetchKey() {
        const response = await fetch(`${location.origin}/api/keys/fetch-key`, {
            credentials: "include",
            cache: "no-store",
            headers: {
                Accept: "application/json"
            }
        });
        if (!response.ok) return null;
        const key = (await response.json()).key;
        return "string" === typeof key && key.trim() ? key.trim() : null;
    }

    function molynShowKey(ui, key) {
        ui.setNote({
            lead: "Your key is ready",
            detail: "Copy it below and paste into the MOLYN hub."
        }), ui.setStatus(""), ui.setError(null), ui.turnstileMount.replaceChildren();
        const code = document.createElement("code");
        code.textContent = key, code.style.cssText = "display:block;margin-top:4px;padding:14px 16px;border-radius:10px;background:rgba(0,0,0,.35);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:.85em;line-height:1.45;color:#e2e8f0;word-break:break-all;user-select:text;-webkit-user-select:text";
        const button = document.createElement("button");
        button.type = "button", button.className = yt.action, button.textContent = "Copy key", button.style.border = "0", button.onclick = async () => {
            try {
                await navigator.clipboard.writeText(key), button.textContent = "Copied!";
            } catch {
                button.textContent = "Copy failed";
            }
            window.setTimeout(() => {
                button.textContent = "Copy key";
            }, 2e3);
        }, ui.turnstileMount.append(code, button);
    }

    async function molynRun(ui) {
        ui.setNote({
            lead: "Skipping Linkvertise…",
            detail: "Skip Wait is fetching your MOLYN key."
        }), ui.setStatus("Fetching key");
        const key = await molynFetchKey().catch(() => null);
        key ? molynShowKey(ui, key) : (ui.setNote({
            lead: "Key unavailable",
            detail: "Opening the manual Pastebin fallback."
        }), ui.setStatus("Redirecting…"), location.replace(molynPastebinFallback));
    }

    function initMolyn() {
        if (window !== window.top) return;
        const path = location.pathname.replace(/\/+$/, "") || "/";
        molynPathRe.test(path) && ot(molynSite).then(allowed => {
            if (!allowed) return;
            const ui = $t({
                id: molynOverlayId,
                brand: "Skip Wait",
                note: {
                    lead: "Skipping Linkvertise…",
                    detail: "Skip Wait is fetching your MOLYN key."
                },
                status: "Fetching key"
            });
            molynRun(ui);
        });
    }

    var vq = [function() {
            ot("storyline-lms").then(t => {
                t && it(() => {
                    $$()
                })
            })
        }, function() {
            location.pathname.includes("/trial/trial.php") && ot("streamerviewerbot").then(t => {
                t && N("#skipwait-svb-brand")
            })
        }, function() {
            ep().then(t => {
                if (!t) return;
                const e = () => {
                    fp(), wp(), Lp(t)
                };
                if ("alias" === t || "mediator" === t) return void e();
                if ("blog" === t) {
                    const t = () => {
                        mp || (document.body || "loading" !== document.readyState) && rp() && e()
                    };
                    if (t(), mp) return;
                    const n = new MutationObserver(() => {
                        t(), mp && n.disconnect()
                    });
                    return n.observe(document.documentElement, {
                        childList: !0,
                        subtree: !0
                    }), void document.addEventListener("DOMContentLoaded", () => {
                        t(), n.disconnect()
                    }, {
                        once: !0
                    })
                }
                const n = () => {
                    (document.body || "loading" !== document.readyState) && e()
                };
                if (fp(), wp(), n(), mp) return;
                const o = new MutationObserver(() => {
                    n(), mp && o.disconnect()
                });
                o.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), document.addEventListener("DOMContentLoaded", () => {
                    n(), o.disconnect()
                }, {
                    once: !0
                })
            })
        }, function() {
            (Yp() || Rp()) && ot("linkvertise").then(t => {
                if (!t) return;
                const e = () => {
                    zp || (Fp || jp(Rp() ? "Almost there…" : "Getting ready…"), Jp())
                };
                if (e(), zp) return;
                const n = new MutationObserver(() => {
                    e(), zp && n.disconnect()
                });
                n.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                });
                let o = 0;
                const r = window.setInterval(() => {
                    o += 1, e(), (zp || o >= 80) && window.clearInterval(r)
                }, 250);
                "loading" === document.readyState && document.addEventListener("DOMContentLoaded", e, !0)
            })
        }, function() {
            ot("cuty").then(t => {
                if (!t) return;
                if (function(t = location.pathname) {
                        return QL.test(t)
                    }()) {
                    const t = eC();
                    if (t) return D(), void location.replace(t)
                }
                if (! function(t = location.pathname) {
                        const e = KL.exec(t);
                        return e?.[1] ? e[1] : XL.exec(t)?.[1] ?? null
                    }()) return;
                const e = () => {
                    !mC && (() => {
                        if (yC() || bC()) return !0;
                        const t = wC();
                        return !!t && ("first" === gC() || kC(t))
                    })() && (mC = !0, IC())
                };
                if (e(), mC) return;
                const n = new MutationObserver(() => {
                    e(), mC && n.disconnect()
                });
                n.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), document.addEventListener("DOMContentLoaded", e, {
                    once: !0
                })
            })
        }, function() {
            window === window.top && ot("cutwin").then(t => {
                if (!t) return;
                const e = () => {
                    $C() && (RC(), PC(), !OC && $C() && (OC = !0, DC().catch(() => {
                        PC().setError("Unlock failed. Reload and try again."), OC = !1
                    })))
                };
                if (e(), OC) return;
                const n = new MutationObserver(() => {
                    e(), OC && n.disconnect()
                });
                n.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", e, !0)
            })
        }, function() {
            window !== window.top || YC || ot("exeio").then(t => {
                t && !YC && (YC = !0, QC())
            })
        }, function() {
            window === window.top && ot("lksfy-mediator").then(t => {
                if (!t) return;
                CI(), it(CI);
                const e = new MutationObserver(() => {
                    CI(), xI && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, function() {
            window === window.top && gI() && ot("lksfy").then(t => {
                if (!t) return;
                fI();
                const e = () => {
                    hI || !document.querySelector("#timer, #get-link, #form-show, .cf-turnstile, #captchaLinksGo") && !lI.test(document.documentElement.innerHTML) || (hI = !0, wI(uI, "Getting things ready…"), EI().catch(() => {
                        wI().setError("Unlock failed. Reload and try again."), hI = !1
                    }))
                };
                e(), it(e);
                const n = new MutationObserver(() => {
                    e(), hI && n.disconnect()
                });
                n.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, () => {
            window === window.top && (async () => !0 === await chrome.runtime.sendMessage({
                type: "RINKU_FLOW_TAB"
            }))().then(t => {
                t && (() => {
                    let t = !1;
                    const e = new MutationObserver(() => {
                        t || (t = !0, requestAnimationFrame(() => {
                            t = !1, UI() && e.disconnect()
                        }))
                    });
                    e.observe(document.documentElement, {
                        childList: !0,
                        subtree: !0
                    }), UI() && e.disconnect()
                })()
            })
        }, function() {
            window === window.top && ot("bstshrt").then(t => {
                if (!t) return;
                (t => {
                    jI = t
                })(!0), hT(), new MutationObserver(hT).observe(document.documentElement, {
                    attributeFilter: ["class", "style", "hidden", "id", "value"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                });
                const e = document.querySelector("title");
                e && new MutationObserver(hT).observe(e, {
                    childList: !0,
                    characterData: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", hT, !0), window.addEventListener("load", hT, !0)
            })
        }, function() {
            window === window.top && ot("boostylink").then(t => {
                if (!t) return;
                const e = () => {
                    ST() && (async () => {
                        if (kT || !ST()) return;
                        kT = !0;
                        const t = vT("Getting things ready…");
                        try {
                            const e = await xT(t);
                            t.setStatus("Opening your link…"), D(), location.replace(e)
                        } catch (e) {
                            kT = !1, t.setStatus("Something went wrong."), t.setError(e instanceof Error ? e.message : String(e))
                        }
                    })()
                };
                e(), new MutationObserver(e).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", e, !0), window.addEventListener("load", e, !0)
            })
        }, function() {
            window === window.top && IT() && ot("keyforge").then(t => {
                t && (new MutationObserver(AT).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), AT(), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", AT, !0), window.addEventListener("load", AT, !0))
            })
        }, function() {
            window === window.top && ot("linkunlocker").then(t => {
                if (!t) return;
                XT(), new MutationObserver(XT).observe(document.documentElement, {
                    attributeFilter: ["class", "style", "hidden", "id"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0,
                    characterData: !0
                });
                const e = document.querySelector("title");
                e && new MutationObserver(XT).observe(e, {
                    childList: !0,
                    characterData: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", XT, !0), window.addEventListener("load", XT, !0), window.setInterval(() => {
                    YT || XT()
                }, 400)
            })
        }, function() {
            if (window !== window.top || n$) return;
            const t = location.pathname.replace(/^\/+|\/+$/g, "");
            !t || t.includes("/") || t$.test(t) || ot("gaea-operations-lockr").then(e => {
                if (!e || n$) return;
                n$ = !0;
                const n = (t => {
                    const e = kt(KT);
                    if (document.documentElement.classList.add(e), !document.getElementById(QT)) {
                        const t = document.createElement("style");
                        t.id = QT, t.textContent = Lt(KT, e), document.documentElement.appendChild(t)
                    }
                    return $t({
                        id: KT,
                        brand: "Skip Wait",
                        note: e$,
                        status: t,
                        countdownLabel: "Your link opens in"
                    })
                })("Unlocking your link…");
                r$(t, n).then(t => {
                    n.setStatus("Opening your link…"), D(), location.replace(t)
                }).catch(t => {
                    n$ = !1, n.hideCountdown(), n.setStatus("Something went wrong."), n.setError(t instanceof Error ? t.message : String(t))
                })
            })
        }, function() {
            window === window.top && async function(t) {
                try {
                    const e = new URL(t);
                    return !!(await nt(e.hostname, "workink")) && i$.test(e.pathname)
                } catch {
                    return !1
                }
            }(location.href).then(t => {
                t && (chrome.runtime.sendMessage({
                    type: "WORKINK_HOOKS"
                }).catch(() => {}), L$(), C$(), window.addEventListener("message", t => {
                    if (t.origin === location.origin && "skip-wait-workink" === t.data?.source && !k$) switch (t.data?.type) {
                        case "gate-start":
                            C$();
                            break;
                        case "gate-done":
                            if ("s_hcok" !== t.data.gate) break;
                            y$ = !0, x$(), E$("Captcha verified…");
                            break;
                        case "forged":
                            E$("Unlocking your link…");
                            break;
                        case "unlock":
                            if ("string" != typeof t.data.url) break;
                            k$ = !0, x$(), w$?.(), w$ = null, E$("Opening your link…"), D(), location.replace(t.data.url)
                    }
                }), new MutationObserver(() => {
                    k$ || y$ || C$()
                }).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }))
            })
        }, function() {
            if (window !== window.top || "cloverhub.app" !== location.hostname || "/getkey" !== location.pathname.replace(/\/+$/, "")) return;
            let t = null;
            const e = async () => {
                if (!t) return;
                const e = (t => {
                    let e = null,
                        n = 0,
                        o = "",
                        r = "",
                        i = 1,
                        a = 1;
                    const s = () => {
                        t.setNote({
                            lead: `${o}${".".repeat(n+1)}`,
                            detail: r
                        }), t.setStatus(`Step ${i} of ${a}`)
                    };
                    return {
                        begin(t, c, l) {
                            i = t, a = c, o = l.lead, r = l.detail, n = 0, s(), null == e && (e = window.setInterval(() => {
                                n = (n + 1) % 3, s()
                            }, 450))
                        },
                        stop() {
                            null != e && clearInterval(e), e = null
                        }
                    }
                })(t);
                try {
                    "failed" === new URLSearchParams(location.search).get("verification") && (history.replaceState({}, "", "/getkey"), await mh().catch(() => {})), t.setError(null), e.begin(1, 1, ph.check);
                    const n = await dh();
                    if ("completed" === n?.status && n.key) return e.stop(), void gh(t, n.key);
                    const o = (t => {
                        const e = [ph.check];
                        let n = t;
                        return "completed" === n?.status && n.keyAlreadyDelivered ? (e.push(ph.reset), n = null) : "pending" === n?.status && "lootlabs" !== n.provider && (e.push(ph.switch), n = null), "pending" === n?.status && "lootlabs" === n.provider || e.push(ph.create), e.push(ph.bypass), e
                    })(n);
                    e.begin(1, o.length, ph.check);
                    const r = await bh(e, n, o);
                    if (e.stop(), !r) throw new Error("timeout");
                    gh(t, r)
                } catch {
                    e.stop(), t.setNote(fh), t.setStatus(""), t.setError("Refresh and try again."), chrome.runtime.sendMessage({
                        type: lh
                    })
                }
            };
            ot("cloverhub").then(n => {
                n && (t = $t({
                    id: "skip-wait-cloverhub-overlay",
                    brand: "Skip Wait",
                    note: ph.check,
                    status: ""
                }), e())
            })
        }, function() {
            if (window !== window.top) return;
            if (!vh(location.pathname, location.search)) return;
            let t = null,
                e = 0,
                n = 0,
                o = "";
            const r = [],
                i = (e, n = "") => {
                    t && (n ? t.setNote({
                        lead: e,
                        detail: n
                    }) : t.setNote({
                        lead: e
                    }))
                },
                a = () => {
                    !t || e <= Date.now() || t.startCountdown(e)
                },
                s = () => {
                    t?.turnstileMount.replaceChildren()
                },
                c = o => {
                    t && (e = o, i(xh.wait.lead, xh.wait.detail), t.startCountdown(o), (() => {
                        clearTimeout(n);
                        const o = e - Date.now();
                        o <= 0 ? t?.setStatus("Unlocking…") : n = window.setTimeout(() => t?.setStatus("Unlocking…"), o)
                    })())
                },
                l = e => {
                    t && (o = e, i(xh.captcha.lead, xh.captcha.detail), (e => {
                        if (!t) return;
                        const n = t.turnstileMount;
                        n.replaceChildren(), n.classList.remove(yt.hidden);
                        const o = document.createElement("iframe");
                        o.src = e, o.title = "Verification", n.appendChild(o)
                    })(e), a(), t.turnstileMount.querySelector("iframe")?.addEventListener("load", () => {
                        chrome.runtime.sendMessage({
                            type: Eh
                        })
                    }, {
                        once: !0
                    }))
                },
                u = e => {
                    if ("wait" !== e.type) return "captcha" === e.type ? (l(e.url), void a()) : "dest" === e.type ? (clearTimeout(n), s(), t?.hideCountdown(), i(xh.opening.lead, xh.opening.detail), t?.setStatus(""), void location.replace(e.dest)) : void("err" === e.type && (clearTimeout(n), s(), t?.hideCountdown(), t?.setStatus(""), t?.setError(Lh(e.message))));
                    c(e.endTs)
                };
            window.addEventListener("message", e => {
                const n = e.data;
                if ("skip-wait-loot" === n?.source && n.type)
                    if ("captcha-token" !== n.type) e.source === window && e.origin === location.origin && (t ? u(n) : r.push(n));
                    else {
                        if (!o) return;
                        chrome.runtime.sendMessage({
                            type: "LOOT_CAPTCHA_VERIFY",
                            url: o,
                            token: n.token
                        }, e => {
                            if (!e?.ok) return t?.setError(Lh("captcha verify")), void a();
                            t?.setError(null), a(), window.postMessage({
                                source: Sh,
                                type: "captcha-ok"
                            }, location.origin)
                        })
                    }
            }), t = $t({
                id: "skip-wait-loot-overlay",
                brand: "Skip Wait",
                note: xh.loading,
                status: "",
                countdownLabel: "Remaining"
            });
            for (const d of r) u(d);
            chrome.runtime.sendMessage({
                type: "INJECT_LOOT"
            }), ot("lootlabs").then(e => {
                if (!e) return t?.remove(), void(t = null);
                B(Sh, "dest")
            })
        }, function() {
            ot("ll-safelink").then(t => {
                if (!t) return;
                const e = new URLSearchParams(location.search).has("ht"),
                    n = e ? function() {
                        const t = HTMLFormElement.prototype,
                            e = t.submit;
                        return t.submit = function() {
                            if (!this.querySelector('[name="hq"]')) return e.call(this)
                        }, () => {
                            t.submit = e
                        }
                    }() : null,
                    o = () => {
                        const t = $t({
                            id: "skip-wait-ll-safelink-overlay",
                            brand: "Skip Wait",
                            note: {
                                lead: "Unlocking your link.",
                                detail: "You don't need to tap anything on the page."
                            },
                            status: "Getting things ready…"
                        });
                        (async function() {
                            let t = ah(document.documentElement.innerHTML);
                            if (!t && new URLSearchParams(location.search).has("ht") && (t = ah(await fetch(location.href, {
                                    credentials: "include"
                                }).then(t => t.text()))), t) return await sh(`${location.origin}/`, {
                                hq: t
                            }), ch(t);
                            const e = (n = document.documentElement.innerHTML, /var LLPayload = '([^']+)'/.exec(n)?.[1] ?? null);
                            var n;
                            return e ? "/" === (location.pathname.replace(/\/+$/, "") || "/") ? ch(e) : ih(await sh(location.href, {
                                hw: e
                            })) : null
                        })().then(e => {
                            if (e) return t.setStatus("Redirecting now…"), D(), void location.replace(e);
                            t.remove()
                        }).catch(() => t.remove()).finally(() => n?.())
                    };
                e ? o() : it(o)
            })
        }, function() {
            window === window.top && ot("ll-safelink-llac").then(t => {
                t && it(() => {
                    const t = function() {
                        for (const t of document.scripts) {
                            const e = /atob\('([^']+)'\)/.exec(t.textContent ?? "");
                            if (e?.[1]) try {
                                const t = atob(e[1]);
                                if (t.startsWith("?ddx=")) return t
                            } catch {}
                        }
                        return null
                    }();
                    if (!t) return;
                    const e = $t({
                        id: "skip-wait-llac-ddx-overlay",
                        brand: "Skip Wait",
                        note: {
                            lead: "Unlocking your link.",
                            detail: "You don't need to tap anything on the page."
                        },
                        status: "Decoding destination…"
                    });
                    (async function(t) {
                        for (;;) {
                            const e = ih(await fetch(t, {
                                credentials: "include"
                            }).then(t => t.text()));
                            if (e) return e;
                            await new Promise(t => setTimeout(t, 300))
                        }
                    })(`${location.pathname}${t}`).then(t => {
                        e.setStatus("Redirecting now…"), D(), location.replace(t)
                    }).catch(() => e.remove())
                })
            })
        }, function() {
            ot("linkjust").then(async t => {
                if (t) return;
                if (Ym()) return void(await Zm());
                const e = () => {
                    (() => {
                        if (Ym()) return !0;
                        if (document.querySelector('#linkjust-timer, #next-timer-btn, [id^="linkjust-"][id$="-final-link-wrapper"]')) return !0;
                        for (const t of document.scripts)
                            if (t.textContent?.includes("linkjustRenderThreeButtonProgress")) return !0;
                        return !!document.querySelector(Hm)
                    })() && Zm()
                };
                if (it(e), zm) return;
                const n = new MutationObserver(() => {
                    e(), zm && n.disconnect()
                });
                n.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, () => {
            window === window.top && (t => {
                const [e, ...n] = t.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return e && 0 === n.length && Xp.test(e) ? e : null
            })(location.pathname) && ot("liteshort").then(t => {
                t && rh()
            })
        }, function() {
            Cp.test(location.pathname) && ot("linksterr").then(t => {
                if (!t) return;
                let e = !1,
                    n = !1;
                const o = new MutationObserver(s),
                    r = window.setInterval(s, 500);

                function i() {
                    o.disconnect(), window.clearInterval(r)
                }

                function a(t) {
                    e || (e = !0, i(), function(t) {
                        try {
                            $t({
                                id: "skip-wait-linksterr-gateway",
                                brand: "Skip Wait",
                                note: {
                                    lead: "Bypassing Link$terr…",
                                    detail: "You don't need to wait or watch ads."
                                },
                                status: "Opening your link…"
                            })
                        } catch {}
                        try {
                            window.stop()
                        } catch {}
                        D(), location.replace(t)
                    }(t))
                }

                function s() {
                    if (e || !document.getElementById("js-data") && (/just a moment/i.test(document.title) || document.querySelector("#challenge-form, #cf-challenge-running, .cf-browser-verification") || (document.documentElement?.innerHTML ?? "").includes("cdn-cgi/challenge-platform"))) return;
                    const t = function() {
                        const t = document.getElementById("js-data")?.getAttribute("data-destination")?.trim() ?? "";
                        return /^https?:\/\//i.test(t) ? t : null
                    }();
                    if (t) return a(t);
                    n || (n = !0, fetch(location.href, {
                        credentials: "include",
                        cache: "no-store"
                    }).then(t => t.ok ? t.text() : Promise.reject()).then(t => {
                        const e = function(t) {
                            return /just a moment|cdn-cgi\/challenge-platform/i.test(t) ? null : t.match(Ip)?.[1] ?? null
                        }(t);
                        e && a(e)
                    }).catch(() => {}).finally(() => {
                        n = !1
                    }))
                }
                document.documentElement && o.observe(document.documentElement, {
                    attributeFilter: ["data-destination"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), s(), window.setTimeout(i, 6e4), document.addEventListener("DOMContentLoaded", s, {
                    once: !0
                }), window.addEventListener("load", s, {
                    once: !0
                })
            })
        }, function() {
            window === window.top && ot("shortxlinks").then(t => {
                if (!t) return;
                const e = () => {
                    wg()
                };
                e(), new MutationObserver(e).observe(document.documentElement, {
                    attributeFilter: ["href", "value"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", e, !0)
            })
        }, function() {
            window === window.top && Zt() && ot("oneshortlink").then(t => {
                if (!t) return;
                ne(), oe("Getting things ready…"), it(ie);
                const e = new MutationObserver(() => {
                    ie(), ee && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, function() {
            window === window.top && se() && ot("adfocus").then(t => {
                if (!t) return;
                it(we);
                const e = new MutationObserver(() => {
                    we(), pe && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, () => {
            if (window !== window.top) return;
            const t = ot("adsterra");
            it(() => {
                t.then(t => {
                    t && (() => {
                        let t = !1;
                        const e = new MutationObserver(() => {
                            t || (t = !0, requestAnimationFrame(() => {
                                t = !1, Ce() && e.disconnect()
                            }))
                        });
                        e.observe(document.documentElement, {
                            childList: !0,
                            subtree: !0
                        }), Ce() && e.disconnect()
                    })()
                })
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && lr.test(t[0])
            })() && ot("gplinks").then(t => {
                t && it(ur)
            })
        }, function() {
            Promise.all([ot("gplinks-mediator"), ot("gplinks")]).then(([t, e]) => {
                if (!t || e) return;
                let n = !1,
                    o = !1;
                const r = () => {
                    if (sessionStorage.getItem(pr) === location.href) return;
                    if (!o && br() && sessionStorage.getItem(pr) !== location.href && (o = !0, Er()), n || !br()) return;
                    n = !0, sessionStorage.setItem(pr, location.href);
                    const t = Er();
                    xr(t).catch(() => {
                        sessionStorage.removeItem(pr), t.setStatus("Something went wrong. Reload and try again.")
                    })
                };
                if (r(), n) return;
                const i = new MutationObserver(() => {
                    r(), n && i.disconnect()
                });
                i.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                });
                const a = () => {
                    r(), (n || "complete" === document.readyState) && (document.removeEventListener("readystatechange", a), n && i.disconnect())
                };
                document.addEventListener("readystatechange", a)
            })
        }, function() {
            window === window.top && ot("gplinks").then(t => {
                if (!t) return;
                Pr() && (Ur(), Hr());
                let e = !1;
                const n = () => {
                    !e && Rr() && (e = !0, Gr())
                };
                if (n(), e) return;
                if ("complete" === document.readyState) return;
                if ("interactive" === document.readyState && !Pr()) return;
                const o = document.documentElement;
                if (!o) return void(t => {
                    if ("loading" !== document.readyState) return void t();
                    const e = () => {
                        "loading" !== document.readyState && (document.removeEventListener("readystatechange", e), t())
                    };
                    document.addEventListener("readystatechange", e)
                })(n);
                let r = null;
                const i = () => {
                        r?.disconnect(), r = null, document.removeEventListener("readystatechange", a)
                    },
                    a = () => {
                        if ("loading" !== document.readyState) {
                            if (n(), e) return i();
                            "interactive" !== document.readyState || Pr() ? "complete" === document.readyState && i() : i()
                        }
                    };
                r = new MutationObserver(() => {
                    n(), e && i()
                }), r.observe(o, {
                    childList: !0,
                    subtree: !0
                }), document.addEventListener("readystatechange", a), a()
            })
        }, () => {
            if (window !== window.top) return;
            const t = Sn(location.pathname);
            t && ot("arolinks").then(e => {
                if (!e) return;
                const n = () => {
                    On(t)
                };
                if (n(), qn) return;
                const o = new MutationObserver(() => {
                    n(), qn && o.disconnect()
                });
                o.observe(document.documentElement, {
                    attributeFilter: ["href"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                });
                const r = window.setInterval(() => {
                    n(), qn && window.clearInterval(r)
                }, 200);
                it(n)
            })
        }, () => {
            window === window.top && ot("link4sub").then(t => {
                if (!t) return;
                const e = () => {
                    const t = (() => {
                        const t = new URLSearchParams(location.search);
                        for (const o of ["alias", "a"]) {
                            const e = t.get(o)?.trim();
                            if (e && Pn.test(e)) return e
                        }
                        const e = document.documentElement.innerHTML.match(/window\.SLB_alias\s*=\s*["']([^"']+)["']/)?.[1];
                        if (e && Pn.test(e)) return e;
                        const n = document.cookie.match(/(?:^|;\s*)SLB_alias=([^;]+)/)?.[1];
                        if (!n) return null;
                        try {
                            const t = decodeURIComponent(n).trim();
                            return Pn.test(t) ? t : null
                        } catch {
                            return null
                        }
                    })();
                    t && Fn(t)
                };
                if (e(), Hn) return;
                const n = new MutationObserver(() => {
                    e(), Hn && n.disconnect()
                });
                n.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", e, !0)
            })
        }, () => {
            if (window !== window.top) return;
            if (Vn(location.href)) return void ot(zn).then(t => {
                t && to(null)
            });
            const t = (() => {
                const [t, ...e] = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return !t || e.length || Yn.has(t.toLowerCase()) || t.startsWith("@") ? null : jn.test(t) ? t : null
            })();
            t && ot(zn).then(e => {
                if (!e) return;
                Xn(), Kn.progress({
                    lead: "Hang tight — unlocking your link.",
                    detail: "Skip Wait is skipping VuotNhanh waits for you.",
                    status: "Getting things ready"
                });
                const n = () => {
                    Zn() && to(t)
                };
                if (n(), Qn) return;
                const o = new MutationObserver(() => {
                    n(), Qn && o.disconnect()
                });
                o.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", n, !0)
            })
        }, function() {
            window === window.top && no() && ot("bblink").then(t => {
                if (!t) return;
                lo(), fo();
                const e = new MutationObserver(() => {
                    fo(), so && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, function() {
            window === window.top && wo() && ot("bbmkts-subtounlock").then(t => {
                t && (So(), it(xo))
            })
        }, () => {
            window === window.top && Ko(location.pathname) && ot("unlocktoearn").then(t => {
                if (!t) return;
                const e = Ko(location.pathname);
                e && (ir.progress(), document.getElementById("lsrecaptcha-form") || document.getElementById(or) || /^bot verification$/i.test(document.title.trim()) ? cr(e) : sr(e))
            })
        }, function() {
            window === window.top && (/\/baby\.php$/i.test(location.pathname) || ot("jobsheel").then(t => {
                if (!t) return;
                if ((Co() || Ho()) && Uo("Unlocking…"), it(Fo), Fo(), Wo) return;
                const e = new MutationObserver(() => {
                    Fo(), Wo && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            }))
        }, function() {
            if (window !== window.top) return;
            const t = function(t, e) {
                if (!/\/baby\.php$/i.test(t)) return null;
                const n = new URLSearchParams(e).get("links")?.trim();
                return n && Lo.test(n) ? n : null
            }(location.pathname, location.search);
            t && ot("jobsheel").then(e => {
                e && (async () => {
                    const e = function() {
                        const t = () => {
                            for (const t of document.querySelectorAll(".cf-turnstile[data-callback]")) t.removeAttribute("data-callback")
                        };
                        t();
                        const e = new MutationObserver(t);
                        return e.observe(document.documentElement, {
                            attributes: !0,
                            attributeFilter: ["data-callback"],
                            childList: !0,
                            subtree: !0
                        }), () => e.disconnect()
                    }();
                    Po("Starting JobSheel…"), document.querySelector("form")?.addEventListener("submit", t => {
                        t.preventDefault(), t.stopPropagation()
                    }, !0);
                    const n = await Bo();
                    Po("Creating JobSheel session…"), await async function(t, e) {
                        const n = document.querySelector("form"),
                            o = new URL(n?.getAttribute("action") || location.href, location.href).href,
                            r = new URLSearchParams;
                        if (n)
                            for (const i of n.elements)(i instanceof HTMLInputElement || i instanceof HTMLTextAreaElement) && i.name && !i.disabled && r.set(i.name, i.value ?? "");
                        r.set("links", t), r.set("cf-turnstile-response", e), await fetch(o, {
                            method: "POST",
                            body: r,
                            credentials: "include",
                            redirect: "manual",
                            headers: {
                                "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                            }
                        })
                    }(t, n), e(), Co() === t ? (Po("Opening JobSheel…"), location.replace("https://jobsheel.com/")) : Po("JobSheel session was not created.").setError("Complete the captcha again.")
                })()
            })
        }, function() {
            window === window.top && Io(location.pathname) && ot("jobsheel-babylinks").then(t => {
                if (!t) return;
                if (zo("Unlocking…"), Jo(), Yo) return;
                const e = new MutationObserver(() => {
                    Jo(), Yo && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Jo, !0)
            })
        }, () => {
            window === window.top && (t => {
                const [e, ...n] = t.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return e && 0 === n.length && Vr.test(e) ? e : null
            })(location.pathname) && ot("nitrolink").then(t => {
                t && Kr()
            })
        }, function() {
            Promise.all([ot("cut4money-mediator"), ot("cut4money")]).then(([t, e]) => {
                if (!t || e) return;
                if (Ni(), Ci) return;
                const n = new MutationObserver(() => {
                    Ci || $i || ($i = !0, queueMicrotask(() => {
                        $i = !1, Ni()
                    })), Ci && n.disconnect()
                });
                n.observe(document.documentElement, {
                    attributeFilter: ["href"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                });
                let o = 0;
                const r = window.setInterval(() => {
                    o >= 10 && (Ai = !0), Ni(), (Ci || ++o >= 120) && window.clearInterval(r)
                }, 200);
                "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Ni, !0), window.addEventListener("load", Ni, !0)
            })
        }, function() {
            null !== oi(location.pathname) && ot("cut4money").then(t => {
                if (!t) return;
                const e = () => {
                    if (!pi && gi()) {
                        if (!yi() && "loading" === document.readyState) return fi(), void wi("Getting things ready…");
                        wi("Getting things ready…"), bi()
                    }
                };
                if (e(), pi) return;
                const n = new MutationObserver(() => {
                    e(), pi && n.disconnect()
                });
                n.observe(document.documentElement, {
                    attributeFilter: ["href", "value"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", e, !0)
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && zi.test(t[0])
            })() && ot("tfly").then(t => {
                t && (ra(), new MutationObserver(ra).observe(document.documentElement, {
                    attributeFilter: ["href", "value", "disabled"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", ra, !0), window.addEventListener("load", ra, !0))
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && ua.test(t[0])
            })() && ot("mitly").then(t => {
                t && (xa(), new MutationObserver(xa).observe(document.documentElement, {
                    attributeFilter: ["href", "value", "disabled"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", xa, !0), window.addEventListener("load", xa, !0))
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && Ia.test(t[0])
            })() && ot("linclik").then(t => {
                t && (Na(), new MutationObserver(Na).observe(document.documentElement, {
                    attributeFilter: ["href", "value", "disabled"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Na, !0), window.addEventListener("load", Na, !0))
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && Za.test(t[0])
            })() && ot("cpmlink").then(t => {
                t && (as(), new MutationObserver(as).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", as, !0), window.addEventListener("load", as, !0))
            })
        }, function() {
            window === window.top && /^\/ph\//i.test(location.pathname) && ot("cpmlink-hop").then(t => {
                t && (Ya(), new MutationObserver(Ya).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Ya, !0))
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length ? ss.test(t[0]) : 2 === t.length && "go" === t[0].toLowerCase() && ss.test(t[1])
            })() && ot("cpmlink-net").then(t => {
                t && (Ss(), new MutationObserver(Ss).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Ss, !0), window.addEventListener("load", Ss, !0))
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && Ls.test(t[0])
            })() && ot("genlink").then(t => {
                t && (_s(), new MutationObserver(_s).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", _s, !0))
            })
        }, function() {
            window === window.top && ot("genlink-mediator").then(t => {
                t && (Ws(), new MutationObserver(Ws).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Ws, !0), window.addEventListener("load", Ws, !0))
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && zs.test(t[0])
            })() && ot("genlink-unlock").then(t => {
                t && (Ks(), new MutationObserver(Ks).observe(document.documentElement, {
                    attributeFilter: ["href", "value", "disabled"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Ks, !0), window.addEventListener("load", Ks, !0))
            })
        }, function() {
            window === window.top && nA() && ot("goost").then(t => {
                if (!t) return;
                cA(), lA();
                const e = new MutationObserver(() => {
                    lA() && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, function() {
            window === window.top && ot("goost-mediator").then(t => {
                t && (xA(), new MutationObserver(xA).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }))
            })
        }, () => {
            if (window !== window.top || !location.href.startsWith(chrome.runtime.getURL("working.html"))) return;
            const t = new URLSearchParams(location.search);
            if ("sfl" !== t.get("site")?.trim()) return;
            const e = t.get("u")?.trim() ?? "";
            (t => {
                try {
                    const e = new URL(t);
                    if (!(t => /^https?:\/\//i.test(t))(e.href)) return !1;
                    const [n, ...o] = e.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                    return !!n && 0 === o.length && Qs.test(n)
                } catch {
                    return !1
                }
            })(e) ? oc(e): nc.setError("Missing unlock details.")
        }, function() {
            window === window.top && ot("adlinkfly-links-go").then(t => {
                t && (((() => {
                    if (an()) return !0;
                    for (const t of document.scripts)
                        if (t.textContent?.includes("/links/go")) return !0;
                    return !1
                })() || tn()) && Xe(), yn(), new MutationObserver(yn).observe(document.documentElement, {
                    attributeFilter: ["href", "value", "disabled"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", yn, !0), window.addEventListener("load", yn, !0))
            })
        }, function() {
            ot("fourdownload").then(t => {
                t && it(() => {
                    (function() {
                        if (document.getElementById(lt)) return !0;
                        for (const t of st)
                            if (document.getElementById(t)) return !0;
                        return !1
                    })() && pt(), document.getElementById(ct) && ft()
                })
            })
        }, function() {
            LA.test(location.pathname) && ot("ankergames").then(t => {
                if (!t) return;
                if (IA()) return;
                const e = new MutationObserver(() => {
                    IA() && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), it(() => {
                    IA(), e.disconnect()
                })
            })
        }, function() {
            ot("apkaward").then(t => {
                t && N("#skipwait-apkaward-brand")
            })
        }, function() {
            ot("apkvision").then(t => {
                t && N("#skipwait-apkvision-brand")
            })
        }, function() {
            location.pathname.startsWith("/vlink/") && ot("apunkagames").then(t => {
                t && it($A)
            })
        }, function() {
            /download-process\.php/i.test(location.pathname) && ot("apunkagames").then(t => {
                t && it(() => {
                    const t = function() {
                        const t = document.querySelector("#dlink")?.href.trim();
                        if (t && /^https?:\/\//i.test(t)) return t;
                        const e = document.querySelector("#tokensubmit")?.action.trim();
                        return e && /^https?:\/\//i.test(e) && !/download-process\.php/i.test(e) ? e : null
                    }();
                    t && (D(), location.replace(t))
                })
            })
        }, function() {
            /\/download\//i.test(location.pathname) && ot("gamesnostalgia").then(t => {
                t && it(() => {
                    const t = document.getElementById("download-button"),
                        e = document.documentElement.innerHTML.match(AA);
                    t instanceof HTMLButtonElement && e?.[1] && e[2] && e[3] && e[4] && OA(t, e[1], e[2], e[3], e[4])
                })
            })
        }, function() {
            ot("oceanofgames").then(t => {
                t && it(() => {
                    for (const e of document.querySelectorAll('form[action*="getsoft.php"], form[action*="Please-Wait.php"], form[action*="wait-for-resource"]')) e instanceof HTMLFormElement && e.querySelector('input[name="filename"]') && BA(e);
                    const t = document.getElementById("delayedText");
                    t && (t.style.visibility = "visible")
                })
            })
        }, function() {
            const t = ot("yasir252");
            it(() => {
                document.querySelector(zA) && t.then(t => {
                    t && function() {
                        const t = () => {
                                ZA()
                            },
                            e = new MutationObserver(t);
                        e.observe(document.body ?? document.documentElement, {
                            childList: !0,
                            subtree: !0,
                            attributes: !0,
                            attributeFilter: ["data-og-url", "data-elink"]
                        }), t(), setTimeout(t, 1500), setTimeout(() => {
                            t(), e.disconnect()
                        }, 4500)
                    }()
                })
            })
        }, function() {
            if (!location.pathname.startsWith("/go")) return;
            const t = ot("yasir252");
            it(() => {
                document.querySelector("[data-elink], [data-og-url]") && t.then(t => {
                    t && (XA(), setTimeout(XA, 1e3))
                })
            })
        }, function() {
            const t = ot("xdmovies");
            it(() => {
                Pt() && t.then(t => {
                    t && (Rt(), Dt())
                })
            })
        }, function() {
            if (window !== window.top) return;
            const t = location.pathname.match(Wt)?.[1];
            if (!t) return;
            const e = ot("xdmovies-mediator");
            (async () => {
                await at(() => !(() => {
                    const t = document.title.toLowerCase();
                    return !(!t.includes("just a moment") && !t.includes("attention required") && !document.querySelector("#challenge-running, #cf-challenge-running, #challenge-stage"))
                })() && null !== document.getElementById("card") && null !== document.getElementById(Ht)), await e && (chrome.runtime.sendMessage({
                    type: "INJECT_VISIBILITY_SPOOF"
                }), await async function(t, e) {
                    const n = $t({
                            id: Ut,
                            brand: "Skip Wait",
                            note: {
                                lead: "Hang tight — getting your download ready.",
                                detail: "You don't need to tap anything on the page. We'll open your link automatically when it's done."
                            },
                            status: "Getting things ready…",
                            countdownLabel: "Your link opens in",
                            countdownHint: "If a checkbox appears below, tap it to confirm you’re human"
                        }),
                        o = Nt({
                            overlayId: Ut,
                            mount: n.turnstileMount,
                            widgetId: Ht,
                            styleId: "skip-wait-xdmovies-site-style"
                        });
                    window.addEventListener("message", t => {
                        if (t.source !== window || t.origin !== location.origin) return;
                        const e = t.data;
                        return e?.source === Bt && e.phase ? "parallel" === e.phase ? (n.setNote({
                            lead: "Almost there.",
                            detail: "If a checkbox appears below, tap it to confirm you're human. Otherwise, just wait — your link opens here automatically."
                        }), n.setStatus("Waiting for your link to open…"), void n.startCountdown(e.waitEndTs)) : "complete" === e.phase ? (n.stopCountdown(), void n.setStatus("Almost ready…")) : "redirect" === e.phase ? (o(), n.setStatus("Opening your download…"), void D()) : void("error" === e.phase && (n.hideCountdown(), n.setStatus("Something went wrong."), n.setError(e.message))) : void 0
                    }), n.setStatus("Almost there…"), chrome.runtime.sendMessage({
                        type: "XDMOVIES_MAIN_WORLD_RUN",
                        payload: {
                            code: t,
                            fingerprint: e,
                            waitMs: 12e3,
                            msgSource: Bt
                        }
                    })
                }(t, await async function() {
                    const t = document.createElement("canvas"),
                        e = t.getContext("2d");
                    e.textBaseline = "top", e.font = "14px Arial", e.fillStyle = "#f60", e.fillRect(125, 1, 62, 20), e.fillStyle = "#069", e.fillText("XDMovies,🎬", 2, 15), e.fillStyle = "rgba(102, 204, 0, 0.7)", e.fillText("XDMovies,🎬", 4, 17);
                    const n = document.createElement("canvas").getContext("webgl"),
                        o = n?.getExtension("WEBGL_debug_renderer_info"),
                        r = navigator,
                        i = [`${screen.width}x${screen.height}x${screen.colorDepth}`, Intl.DateTimeFormat().resolvedOptions().timeZone, r.language, r.platform, r.hardwareConcurrency, r.deviceMemory ?? "", t.toDataURL().slice(-50), o && n ? n.getParameter(o.UNMASKED_RENDERER_WEBGL) : "", "ontouchstart" in window ? "touch" : "no_touch", r.plugins.length, r.cookieEnabled, r.doNotTrack ?? ""].join("|||"),
                        a = await crypto.subtle.digest("SHA-256", (new TextEncoder).encode(i));
                    return Array.from(new Uint8Array(a), t => t.toString(16).padStart(2, "0")).join("").slice(0, 32)
                }()))
            })()
        }, function() {
            ot("movies-mod").then(t => {
                t && (! function() {
                    if (document.getElementById(Ih)) return;
                    const t = document.createElement("style");
                    t.id = Ih, t.textContent = '[class*="timed-content-client_show"]{display:block!important}[class*="timed-content-client_hide"]{display:none!important}', document.documentElement.appendChild(t)
                }(), it(() => {
                    document.querySelector('[class*="timed-content-client_show"], [class*="timed-content-client_hide"]') && D()
                }))
            })
        }, function() {
            if (window !== window.top) return;
            const t = new URLSearchParams(location.search).get("sid")?.trim();
            t && ot("sid-mediator").then(e => {
                e && (async t => {
                    if (tg) return;
                    tg = !0;
                    const e = Qw("Decoding your link…", Jw);
                    try {
                        e.setStatus("Decrypting destination…");
                        const n = await Gw(t);
                        e.setNote(Xw), e.setStatus("Opening your link…"), D(), location.replace(n)
                    } catch (n) {
                        e.setNote(Jw), e.setStatus("Couldn’t decode this link. Reload and try again."), n instanceof Error && n.message && e.setError(n.message), tg = !1
                    }
                })(t)
            })
        }, function() {
            ot("clipi").then(t => {
                t && it(ic)
            })
        }, function() {
            ot("cookiesceo").then(t => {
                if (!t) return;
                const e = () => {
                    lc()
                };
                "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", e) : e()
            })
        }, function() {
            ot("fastdl").then(t => {
                if (!t) return;
                if (!window.location.pathname.toLowerCase().endsWith("/dl.php")) return;
                let e, n = null;
                try {
                    n = new URL(window.location.href).searchParams.get("link")
                } catch {
                    return
                }
                if (n) {
                    try {
                        e = decodeURIComponent(n)
                    } catch {
                        return
                    }(e.startsWith("http://") || e.startsWith("https://")) && (D(), window.location.href = e)
                }
            })
        }, function() {
            ot("anygame").then(t => {
                t && (B("skip-wait-anygame", "cdn"), chrome.runtime.sendMessage({
                    type: "ANYGAME_MAIN_DIRECT"
                }).catch(() => {}))
            })
        }, function() {
            ot("apkteal").then(t => {
                t && (B("skip-wait-apkteal", "cdn"), chrome.runtime.sendMessage({
                    type: "APKTEAL_MAIN_DIRECT"
                }).catch(() => {}))
            })
        }, function() {
            ot("an1").then(t => {
                if (!t) return;
                ! function() {
                    if (document.getElementById(Il)) return;
                    const t = document.createElement("style");
                    t.id = Il, t.textContent = "#timer,#after_download{display:none!important}#pre_download{display:inline!important}", document.documentElement.append(t)
                }();
                it(() => {
                    $l() || new MutationObserver((t, e) => {
                        $l() && e.disconnect()
                    }).observe(document.documentElement, {
                        childList: !0,
                        subtree: !0
                    })
                })
            })
        }, function() {
            ot("gapkmod").then(t => {
                t && (! function() {
                    if (document.getElementById(ql)) return;
                    const t = document.createElement("style");
                    t.id = ql, t.textContent = `.spinvt,.sdl-bar{display:none!important}.show_download_links{display:block!important}a.downloadAPK[${Ml}]{pointer-events:none!important;opacity:.55;cursor:wait!important}`, document.documentElement.append(t)
                }(), it(() => {
                    document.querySelectorAll(".spinvt, .sdl-bar").forEach(t => t.remove()), document.querySelectorAll(".show_download_links").forEach(t => {
                        t.style.display = "", t.removeAttribute("hidden")
                    });
                    for (const e of document.querySelectorAll("a.downloadAPK")) Fl(e);
                    const t = [...document.querySelectorAll(`a.downloadAPK[${Ml}]`)];
                    if (t.length) {
                        for (const e of t) {
                            const t = e.getAttribute(Ol);
                            t && jl(t).then(t => zl(e, t))
                        }
                        t.some(t => !t.hasAttribute(Ol)) && Yl().then(Gl)
                    }
                }))
            })
        }, function() {
            ot("getmodsapk").then(t => {
                t && N("#skipwait-getmodsapk-brand")
            })
        }, function() {
            ot("fuzyapk").then(t => {
                t && N("#skipwait-fuzyapk-brand")
            })
        }, function() {
            ot("flightsim").then(t => {
                t && B("skip-wait-flightsim", "skip")
            })
        }, function() {
            ot("playmods").then(t => {
                if (!t) return;
                const e = eu(location.pathname);
                if (e) return D(), void location.replace(tu(e));
                ou(location.pathname) ? it(() => {
                    const t = tu(ru(document));
                    D(), location.replace(t)
                }) : (! function() {
                    if (document.getElementById(Xl)) return;
                    const t = document.createElement("style");
                    t.id = Xl, t.textContent = `a[${Jl}],a[${Jl}] .detail-downloadBtn{pointer-events:none!important;opacity:.55;cursor:wait!important}a[${Zl}] .detail-downloadBtn,a[${Jl}] .detail-downloadBtn{width:auto!important;min-width:99px;padding:0 14px!important;flex:0 0 auto!important;box-sizing:border-box!important}a[${Zl}] .detail-downloadBtn>div,a[${Jl}] .detail-downloadBtn>div{white-space:nowrap!important;overflow:visible!important}.detail-version-card-content .detail-version-desp{width:auto!important;flex:1 1 auto!important;min-width:0!important}a[${Zl}] .historyV-exhibition-detail-dn,a[${Zl}]:hover .historyV-exhibition-detail-dn,a[${Jl}] .historyV-exhibition-detail-dn{color:#fff!important}`, document.documentElement.append(t), document.addEventListener("click", t => {
                        const e = t.target?.closest("a");
                        if (!(e instanceof HTMLAnchorElement && URL.canParse(e.href))) return;
                        const n = Ql.get(e);
                        if (n) return t.preventDefault(), t.stopImmediatePropagation(), D(), void location.assign(n);
                        const o = new URL(e.href);
                        if (o.hostname !== location.hostname) return;
                        const r = eu(o.pathname);
                        r && (t.preventDefault(), t.stopImmediatePropagation(), au(e, tu(r)), location.assign(tu(r)))
                    }, !0)
                }(), it(() => {
                    cu(), new MutationObserver(cu).observe(document.documentElement, {
                        childList: !0,
                        subtree: !0
                    })
                }))
            })
        }, function() {
            ot("liteapks").then(t => {
                if (!t) return;
                if (du.test(location.pathname)) return void it(() => {
                    const t = document.getElementById("download")?.dataset.link;
                    t && (D(), location.replace(mu(atob(t))))
                });
                if (!uu.test(location.pathname)) return;
                const e = new WeakMap,
                    n = new WeakSet,
                    o = new Map,
                    r = t => {
                        const e = o.get(t);
                        if (e) return e;
                        const n = (async () => {
                            const e = await fetch(t, {
                                credentials: "include",
                                cache: "no-store"
                            });
                            if (!e.ok) throw new Error(`mediator ${e.status}`);
                            return (t => {
                                const e = (new DOMParser).parseFromString(t, "text/html").getElementById("download")?.dataset.link;
                                if (!e) throw new Error("missing data-link");
                                return atob(e)
                            })(await e.text())
                        })().catch(e => {
                            throw o.delete(t), e
                        });
                        return o.set(t, n), n
                    },
                    i = (t, n) => {
                        e.set(t, n), t.href = mu(n), t.removeAttribute("target"), pu(t)
                    },
                    a = t => {
                        if (e.has(t) || n.has(t)) return void pu(t);
                        const o = hu(t);
                        o && (n.add(t), pu(t), r(o).then(e => {
                            n.delete(t), t.isConnected && i(t, e)
                        }))
                    },
                    s = () => {
                        for (const t of document.querySelectorAll("a.dl-item[href]")) a(t)
                    };
                document.addEventListener("click", t => {
                    const n = t.target?.closest("a.dl-item");
                    if (!(n instanceof HTMLAnchorElement)) return;
                    const o = e.get(n);
                    if (o) return t.preventDefault(), t.stopImmediatePropagation(), D(), void location.assign(mu(o));
                    const a = hu(n);
                    a && (t.preventDefault(), t.stopImmediatePropagation(), r(a).then(t => {
                        i(n, t), D(), location.assign(mu(t))
                    }))
                }, !0), it(() => {
                    s(), new MutationObserver(s).observe(document.documentElement, {
                        childList: !0,
                        subtree: !0
                    })
                })
            })
        }, function() {
            ot("latestmodapks").then(t => {
                if (!t) return;
                (() => {
                    if (document.getElementById(wu)) return;
                    const t = document.createElement("style");
                    t.id = wu, t.textContent = "a.download-btn-main.faded-disabled-btn{opacity:1!important;pointer-events:auto!important;filter:none!important}a.download-btn-main .spinner-wait{display:none!important}a.download-btn-main .icon-download{display:block!important}a.download-btn-main .dld-btn-text p{color:#f1f5f9!important}a.download-btn-main .dld-btn-text p:last-child{color:#38bdf8!important;font-weight:800!important}#download-loading{display:none!important}a.download-page-download-btn.hidden{display:flex!important}a.download-page-download-btn span{color:#38bdf8!important;font-weight:800!important}", (document.head ?? document.documentElement).appendChild(t)
                })();
                let e = !1;
                const n = () => {
                    if (e) return !0;
                    if (fu.test(location.pathname)) {
                        const t = document.querySelector("a.download-page-download-btn");
                        return !!t?.href && (e = !0, gu(t, Promise.resolve(t.href), t.querySelector("span")), !0)
                    }
                    const t = document.querySelector("a.download-btn-main[href]");
                    return !!(t && URL.canParse(t.href) && fu.test(new URL(t.href).pathname)) && (e = !0, gu(t, (async t => {
                        const e = await fetch(t, {
                            credentials: "include",
                            cache: "no-store"
                        });
                        if (!e.ok) throw new Error("download page");
                        const n = (new DOMParser).parseFromString(await e.text(), "text/html").querySelector("a.download-page-download-btn")?.getAttribute("href");
                        if (!n) throw new Error("download hop");
                        return new URL(n, t).href
                    })(t.href), t.querySelector(".dld-btn-text p:last-child")), !0)
                };
                if (n()) return;
                const o = new MutationObserver(() => {
                    n() && o.disconnect()
                });
                o.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), it(() => {
                    n() && o.disconnect()
                })
            })
        }, function() {
            ot("filecr").then(t => {
                t && Yu(() => {
                    it(() => {
                        pd()
                    })
                })
            })
        }, function() {
            ot("filecr").then(t => {
                t && Yu(() => {
                    it(fd)
                })
            })
        }, function() {
            gd || /\/Container\//i.test(location.pathname) && ot("filecrypt").then(t => {
                t && !gd && (gd = !0, bd("Unlocking downloads…"), chrome.runtime.sendMessage({
                    type: "FILECRYPT_POW"
                }).catch(() => {}), window.addEventListener("message", t => {
                    if (t.origin !== location.origin) return;
                    const e = t.data;
                    return e && "skip-wait-filecrypt" === e.source ? "done" === e.type ? (Sd(), void vd()) : void("status" === e.type && e.text ? kd && kd.setStatus(e.text) : "err" === e.type && (bd("Couldn’t unlock this page."), kd?.setError("Try refreshing the page."))) : void 0
                }), it(() => {
                    !document.getElementById("pow-captcha") && document.querySelector('a.button.download, a[href*="/Link/"], .window.container, .dlcdownload, .cnl') && (Sd(), vd())
                }))
            })
        }, function() {
            ot("filehippo").then(t => {
                t && it(Pd)
            })
        }, function() {
            const t = location.pathname.match(Nd)?.[1];
            t && ot("filepress").then(e => {
                if (!e) return;
                let n = new Map;
                fetch(`${Dd}/get/${t}`, {
                    credentials: "include"
                }).then(t => t.json()).then(t => t.data?.downloadOptions).then(e => {
                    e && (n = Hd(t, e))
                }), document.addEventListener("click", t => {
                    const e = t.target.closest("button")?.textContent?.replace(/\s+/g, " ").trim();
                    if (!e || !(e in Ud)) return;
                    const o = n.get(e);
                    o && (t.preventDefault(), t.stopImmediatePropagation(), o.then(t => {
                        t && (D(), location.replace(t))
                    }))
                }, !0)
            })
        }, function() {
            const t = ot("softpedia");
            it(() => {
                t.then(t => {
                    t && (Jd() ? nm() : (em(), new MutationObserver(em).observe(document.documentElement, {
                        childList: !0,
                        subtree: !0
                    })))
                })
            })
        }, function() {
            ot("fclc").then(t => {
                if (!t) return;
                let e = !1,
                    n = null;
                const o = () => {
                        n?.disconnect(), n = null
                    },
                    r = () => {
                        if (e) return;
                        const t = document.querySelector("#link-view");
                        if (t) return e = !0, o(), chrome.runtime.sendMessage({
                            type: uc
                        }).catch(() => {}), Ec(hc, "Getting things ready…"), void Cc(t);
                        const n = function() {
                            for (const t of yc) {
                                const e = document.querySelector(t);
                                if (e) return e
                            }
                            return null
                        }();
                        n && (e = !0, o(), chrome.runtime.sendMessage({
                            type: uc
                        }).catch(() => {}), Ec(hc, "Getting things ready…"), Lc(n))
                    };
                if (r(), e) return;
                const i = document.documentElement;
                n = new MutationObserver(r), n.observe(i, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => {
                    r(), e || o()
                }, {
                    once: !0
                }) : "complete" === document.readyState && o()
            })
        }, function() {
            ot("fclc-mediator").then(t => {
                t && (document.addEventListener("DOMContentLoaded", () => {
                    Hc()
                }, !0), it(() => {
                    if (Gc(), Uc() || Fc() || Oc) return;
                    const t = new MutationObserver(() => {
                        Hc(), (Uc() || Fc() || Oc) && (t.disconnect(), Gc())
                    });
                    t.observe(document.documentElement, {
                        childList: !0,
                        subtree: !0
                    })
                }))
            })
        }, function() {
            /\/tools\/?$/i.test(location.pathname) && ot("icutlink-mediator").then(t => {
                if (!t) return;
                const e = () => {
                    (() => {
                        if (pl || !vl()) return;
                        const t = yl() || "1";
                        wl(fl(t, "starting…"))
                    })(), Ll()
                };
                if (e(), ml) return;
                const n = new MutationObserver(() => {
                    e(), ml && n.disconnect()
                });
                n.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", e, !0)
            })
        }, function() {
            ot("icutlink").then(t => {
                if (!t) return;
                const e = () => {
                    ol() || ((() => {
                        if (tl || ol() || !rl()) return;
                        const t = nl("Posting /links/go…"),
                            e = el();
                        e > 0 && t.startCountdown(Date.now() + 1e3 * e)
                    })(), rl() && il())
                };
                if (e(), Qc) return;
                const n = new MutationObserver(() => {
                    e(), Qc && n.disconnect()
                });
                n.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", e, !0)
            })
        }, function() {
            ot("hdhub4u").then(t => {
                if (!t) return;
                const e = im("Opening the main site…"),
                    n = 1e6 * (o = new Date).getFullYear() + 1e4 * (o.getMonth() + 1) + 100 * o.getDate() + o.getHours() + 1;
                var o;
                Promise.any(rm.map(t => async function(t, e) {
                    const n = await fetch(`${t}?v=${e}`, {
                        cache: "no-store",
                        signal: AbortSignal.timeout(5e3)
                    });
                    if (!n.ok) throw new Error(`host lookup ${n.status}`);
                    const {
                        c: o
                    } = await n.json();
                    if ("string" != typeof o) throw new Error("host lookup payload missing mirror");
                    const r = atob(o),
                        i = r.indexOf("?");
                    return -1 === i ? r : r.slice(0, i)
                }(t, n))).then(t => {
                    D(), location.replace(t)
                }).catch(() => e.setError("Could not find the main site. Reload and try again."))
            })
        }, function() {
            if (window !== window.top) return;
            const t = new URLSearchParams(location.search).has("id");
            (t || am.test(location.pathname)) && ot("hdhub4u-mediator").then(e => {
                if (!e) return;
                const n = sm("Opening the next page…");
                let o = !1;
                const r = () => {
                    const t = cm();
                    return !!t && (o || (o = !0, D()), location.replace(t), !0)
                };
                !t && r() || it(() => {
                    r() || n.setError("Could not open the next page. Reload and try again.")
                })
            })
        }, function() {
            lm.test(location.pathname) && ot("hdhub4u-hubcdn").then(t => {
                if (!t) return;
                let e;
                try {
                    const t = new URL(location.href).searchParams.get("link");
                    if (!t) return;
                    const n = new URL(t);
                    if ("http:" !== n.protocol && "https:" !== n.protocol) return;
                    if (n.origin === location.origin) return;
                    e = n.href
                } catch {
                    return
                }
                D(), location.replace(e)
            })
        }, function() {
            window === window.top && bm() && !km && ot("hdhub4u-hubcloud").then(t => {
                t && it(() => {
                    if (km || (() => {
                            const t = document.title.toLowerCase();
                            return !(!t.includes("just a moment") && !t.includes("attention required")) || null != document.querySelector("#challenge-form, #challenge-running, #cf-challenge-running, #challenge-stage, .cf-browser-verification")
                        })()) return;
                    km = !0, Sm();
                    const t = vm();
                    if (t && /^https?:\/\//i.test(t)) return D(), void location.replace(t);
                    const e = window.setInterval(() => {
                        const t = vm();
                        t && /^https?:\/\//i.test(t) && (clearInterval(e), D(), location.replace(t))
                    }, 50)
                })
            })
        }, function() {
            Em.test(location.pathname) || ot("haxpc").then(t => {
                t && it(() => {
                    document.addEventListener("DOMContentLoaded", () => setTimeout(Im), {
                        once: !0
                    })
                })
            })
        }, function() {
            Em.test(location.pathname) && ot("haxpc").then(t => {
                if (!t) return;
                const e = () => {
                    const t = xm.exec(document.documentElement.innerHTML)?.[1];
                    t && (D(), location.replace(decodeURIComponent(atob(t))))
                };
                e(), it(e)
            })
        }, function() {
            ot("kitokola").then(t => {
                if (!t) return;
                const e = function() {
                    try {
                        const t = new URL(window.location.href).searchParams;
                        return t.get("dl") ?? t.get("get")
                    } catch {
                        return null
                    }
                }() ?? function() {
                    try {
                        return localStorage.getItem("mi-dl")
                    } catch {
                        return null
                    }
                }();
                if (!e) return;
                const n = function(t) {
                    try {
                        const e = decodeURIComponent(t);
                        return /^https?:\/\//i.test(e) ? e : null
                    } catch {
                        return null
                    }
                }(e);
                n && (! function() {
                    try {
                        for (const t of Tm) localStorage.removeItem(t)
                    } catch {}
                }(), D(), window.location.replace(n))
            })
        }, function() {
            ot("kotakanimeid").then(t => {
                t && it(() => {
                    Am.test(location.pathname) && Mm() && (document.getElementById("download-section") && document.getElementById("result-section") && (document.getElementById("generate-btn") || document.getElementById("countdown")) && document.querySelector('script[src*="/video/download/download.js"]')) && Um()
                })
            })
        }, function() {
            const t = ot("onhaxpk");
            it(() => {
                t.then(t => {
                    t && (Oh(), setTimeout(Oh, 0))
                })
            })
        }, function() {
            ot("onlinetools").then(t => {
                if (!t) return;
                const e = () => {
                        const t = document.querySelector(Fh);
                        if (!t) return;
                        Jh();
                        const e = document.querySelector(Uh),
                            o = t.querySelector(Wh);
                        !e?.hasAttribute(Ph) || o && !o.hasAttribute(Ph) || n.disconnect()
                    },
                    n = new MutationObserver(e),
                    o = () => {
                        e(), n.observe(document.body, {
                            childList: !0,
                            subtree: !0
                        })
                    };
                "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", o) : o()
            })
        }, function() {
            window === window.top && Xh() && ot("ontops").then(t => {
                if (!t) return;
                of(), rf("Getting things ready…"), it(sf);
                const e = new MutationObserver(() => {
                    sf(), nf && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, () => {
            window === window.top && (() => {
                try {
                    const [t, ...e] = new URL(location.href).pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                    return !!t && 0 === e.length && vf.test(t)
                } catch {
                    return !1
                }
            })() && ot("shrinkearn").then(t => {
                t && (cw(), (tw = new MutationObserver(cw)).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", cw, {
                    once: !0
                }))
            })
        }, () => {
            window === window.top && ot("shrinkearn-mediator").then(t => {
                t && (wf(), new MutationObserver(wf).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", wf, {
                    once: !0
                }))
            })
        }, function() {
            ot("ouo").then(t => {
                t && (chrome.runtime.sendMessage({
                    type: "INJECT_VISIBILITY_SPOOF"
                }).catch(() => {}), Ew(), new MutationObserver(Ew).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }))
            })
        }, function() {
            ot("olamovies-landing").then(t => {
                t && (Tw(), $w("Getting things ready…"), Aw().catch(() => {
                    $w("Resolving main site…").setError("Could not resolve the OlaMovies main site. Reload and try again.")
                }))
            })
        }, function() {
            ot("olamovies-link").then(t => {
                t && it(() => {
                    const t = Bw();
                    t("Working on your link…", "Skip Wait is bypassing the wait on this page.", "busy", 8), Ww(t).catch(() => t("Something went wrong", "Sign in if needed, then refresh and try again.", "err", 100))
                })
            })
        }, function() {
            ot("prmovies").then(t => {
                t && fetch(`https://rep.prmovies3.online/api/get?v=${Date.now()}`, {
                    cache: "no-store"
                }).then(t => t.json()).then(t => {
                    t.response && (D(), location.replace(atob(t.response)))
                })
            })
        }, function() {
            if (window !== window.top) return;
            const t = ot("vegamovies");
            it(() => {
                const e = function() {
                    for (const t of document.querySelectorAll("script:not([src])")) {
                        const e = t.textContent?.match(tq)?.[1];
                        if (!e) continue;
                        const n = new URL(e, location.href);
                        if (n.origin === location.origin) return n.href
                    }
                    return null
                }();
                e && t.then(t => {
                    t && (! function(t) {
                        const e = kt(KA);
                        if (document.documentElement.classList.add(e), !document.getElementById(QA)) {
                            const t = document.createElement("style");
                            t.id = QA, t.textContent = Lt(KA, e), (document.head ?? document.documentElement).appendChild(t)
                        }
                        nq ? nq.setStatus(t) : nq = $t({
                            id: KA,
                            brand: "Skip Wait",
                            note: eq,
                            status: t
                        })
                    }("Opening the live catalog…"), D(), location.replace(e))
                })
            })
        }, function() {
            const t = ot("vegamovies-landing");
            it(() => {
                const e = aq(document.documentElement.innerHTML);
                (e || document.querySelector("nav.link-grid")) && t.then(t => {
                    if (t) {
                        if (e) return D(), void location.replace(e);
                        lq(),
                            function() {
                                if (document.getElementById(oq)) return;
                                if (aq(document.documentElement.innerHTML)) return;
                                const t = document.querySelector("nav.link-grid");
                                if (!t) return;
                                const e = document.createElement("aside");
                                e.id = oq, e.className = "reveal in", e.setAttribute("role", "status"), e.style.cssText = 'display:flex;align-items:center;gap:14px;width:100%;box-sizing:border-box;margin:0 0 18px;padding:20px 22px;border-radius:var(--radius-xl,24px);border:1px solid rgba(0,255,170,.28);background:linear-gradient(135deg,rgba(0,255,170,.1),rgba(14,165,233,.06)),var(--surface,#08080f);box-shadow:0 0 32px rgba(0,255,170,.14);color:var(--text,#e4e6f0);font:500 13px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif', e.innerHTML = '<span style="flex:0 0 auto;width:44px;height:44px;border-radius:14px;display:inline-flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--mint,#00ffaa),var(--blue,#0ea5e9));box-shadow:0 0 20px var(--mint-dim,#00cc8840);color:#020205"><svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg></span><span style="flex:1;min-width:0"><span style="display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-bottom:5px"><strong style="font-size:15px;font-weight:800;letter-spacing:.02em;background:linear-gradient(90deg,var(--mint,#00ffaa),var(--blue,#0ea5e9));-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:var(--mint,#00ffaa)">Skip Wait</strong><span style="font-size:10px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 9px;border-radius:999px;border:1px solid rgba(0,255,170,.45);color:var(--mint,#00ffaa);background:rgba(0,255,170,.08)">Instant Unlock</span></span><span style="display:block;color:var(--muted,#55607a);font-weight:500">Connecting delay skipped — VegaMovies, RogMovies, Anime &amp; Xprime open the live server immediately.</span></span>', t.before(e)
                            }(),
                            function() {
                                for (const t of document.querySelectorAll("a[href]")) {
                                    if (!(t instanceof HTMLAnchorElement)) continue;
                                    const e = sq(t.getAttribute("href") || "");
                                    e && cq(e).then(e => {
                                        e && (t.href = e)
                                    })
                                }
                            }()
                    }
                })
            })
        }, function() {
            window === window.top && ot("cinefreak").then(t => {
                if (!t) return;
                uq.test(location.pathname) && yq("Getting your download ready…"), bq(), it(bq);
                const e = new MutationObserver(() => {
                    bq(), gq && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, function() {
            const t = ot("romsfun");
            it(() => {
                ng() && document.getElementById("countdown") && t.then(t => {
                    t && rg()
                })
            })
        }, () => {
            window === window.top && yg() && ot("shrinkpe").then(t => {
                t && (Eg(), new MutationObserver(() => {
                    Eg()
                }).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", () => {
                    Eg()
                }, !0), window.addEventListener("load", () => {
                    Eg()
                }, !0))
            })
        }, function() {
            window === window.top && 1 === location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean).length && ot("shrtfly").then(t => {
                if (!t) return;
                const e = new MutationObserver(() => n()),
                    n = () => {
                        if (Og) return;
                        Mg || (Mg = !0, Rg());
                        const t = xg();
                        t && Lg(t) === Ag && (Og = !0, e.disconnect(), window.removeEventListener("load", n, !0), (async () => {
                            const t = xg();
                            if (!t || Lg(t) !== Ag) throw new Error("missing entry form");
                            const e = Rg("Unlocking your link…"),
                                n = await Cg(t);
                            if ("success" !== n.status || !n.data || "string" == typeof n.data) throw new Error("string" == typeof n.data ? n.data : "unlock failed");
                            Ig(e, n.data)
                        })().catch(t => {
                            const e = Rg();
                            e.setStatus("Something went wrong."), e.setError(t instanceof Error ? t.message : String(t))
                        }))
                    };
                it(n), e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), window.addEventListener("load", n, !0)
            })
        }, function() {
            window === window.top && ot("shrtfly-mediator").then(t => {
                const e = new MutationObserver(() => n()),
                    n = () => {
                        !zg && (t => {
                            const e = xg();
                            return !(!e || !Ug.has(Lg(e))) && !!e.querySelector('input[name="payload"]') && (t || !!document.querySelector('a[href*="shrtfly.com/account/premium-access"]'))
                        })(t) && (zg = !0, e.disconnect(), window.removeEventListener("load", n, !0), Jg().catch(t => {
                            const e = Yg();
                            e.setStatus("Something went wrong."), e.setError(t instanceof Error ? t.message : String(t))
                        }))
                    };
                it(n), e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), window.addEventListener("load", n, !0)
            })
        }, function() {
            if (window !== window.top || ny) return;
            const t = (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                if (1 !== t.length) return null;
                const e = t[0];
                return Qg.test(e) ? e : null
            })();
            t && ot("shrinkme").then(e => {
                e && (ny = !0, oy("Skipping captcha gate…"), location.replace("https://themezon.net/link.php?link=" + encodeURIComponent(t)))
            })
        }, function() {
            window === window.top && ot("shrinkme-mediator").then(t => {
                t && (my(), new MutationObserver(my).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", my, !0), window.addEventListener("load", my, !0))
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && fy.test(t[0])
            })() && ot("shrinkme-unlock").then(t => {
                t && (Ey(), new MutationObserver(Ey).observe(document.documentElement, {
                    attributeFilter: ["href", "value", "disabled"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Ey, !0), window.addEventListener("load", Ey, !0))
            })
        }, function() {
            /[?&]l=/.test(location.search) && ot("sub2get").then(t => {
                t && it(Wy)
            })
        }, function() {
            if (window !== window.top) return;
            const t = ot("sub2unlock");
            it(() => {
                Vy() && t.then(t => {
                    t && (Yy(), Gy("Getting things ready…"), (() => {
                        const t = Vy();
                        t && (Gy("Unlocking your link…").setStatus("Opening your link…"), D(), location.replace(t))
                    })())
                })
            })
        }, function() {
            window === window.top && ek() && ot("sub4unlock-com").then(t => {
                t && (lk(), uk("Getting things ready…"), it(dk))
            })
        }, function() {
            if (window !== window.top) return;
            const t = ot("sub4unlock-io");
            it(() => {
                yk() && t.then(t => {
                    t && (wk(), gk("Getting things ready…"), (() => {
                        const t = yk();
                        t && (gk("Unlocking your link…").setStatus("Opening your link…"), D(), location.replace(t))
                    })())
                })
            })
        }, function() {
            if (window !== window.top) return;
            const t = ot("sub4unlock-me");
            it(() => {
                Boolean(document.querySelector(`${vk}, #go-link input[name="ad_form_data"]`)) && t.then(t => {
                    t && (Lk(), Ck("Getting things ready…"), $k().catch(() => {
                        xk = !1, Ck().setError("Couldn’t unlock this link. Reload and try again.")
                    }))
                })
            })
        }, function() {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && _k.test(t[0])
            })() && ot("droplink").then(t => {
                t && (Uk(), new MutationObserver(Uk).observe(document.documentElement, {
                    attributeFilter: ["href", "value", "disabled"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Uk, !0), window.addEventListener("load", Uk, !0))
            })
        }, function() {
            window === window.top && ot("dlsurf").then(t => {
                t && (cb(), it(sb), new MutationObserver(t => {
                    (t => {
                        const e = ob();
                        return !!e && t.every(t => {
                            const n = t.target;
                            return n instanceof Node && (n === e || e.contains(n))
                        })
                    })(t) || sb()
                }).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }))
            })
        }, () => {
            window === window.top && ot("devuploads-mediator").then(t => {
                t && it(() => {
                    const t = (() => {
                            const t = document.querySelector("#dlform");
                            return t?.querySelector('input[name="op"][value="download2"]') && /devuploads\.com/i.test(t.getAttribute("action") || t.action) ? t : null
                        })(),
                        e = t?.querySelector('input[name="id"]')?.value.trim();
                    if (!t || !e || pb) return;
                    pb = !0;
                    const {
                        name: n,
                        size: o
                    } = {
                        name: document.querySelector(".file-info .name h4")?.textContent?.replace(/\s+/g, " ").trim() ?? "",
                        size: [...document.querySelectorAll(".file-info .name span")].map(t => t.textContent?.replace(/\s+/g, " ").trim() ?? "").map(t => t.match(db)?.[1]?.replace(/\s+/g, " ").trim() ?? "").find(Boolean) ?? ""
                    };
                    fb(), wb("Getting things ready…", n, o), gb(e, n, o)
                })
            })
        }, () => {
            if (window !== window.top || Lb) return;
            const t = (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "");
                return t && !t.includes("/") && yb.test(t) ? t : null
            })();
            t && ot("dupload").then(e => {
                e && !Lb && (Lb = !0, (xb = Sb()).progress({
                    status: "Getting things ready"
                }), it(() => {
                    const e = Cb();
                    if ((() => {
                            const t = document.querySelector(".dfilename")?.textContent?.replace(/\s+/g, " ").trim() ?? "";
                            return !!/^file not found$/i.test(t) || /the file you were looking for could not be found/i.test(document.body?.innerText ?? "")
                        })()) return Lb = !1, void xb.setError("File unavailable", Eb, "Nothing to download here.");
                    xb.progress({
                        status: "Reading your file",
                        ...e
                    }), xb.progress({
                        status: "Resolving direct CDN",
                        ...e
                    }), (t => new Promise((e, n) => {
                        chrome.runtime.sendMessage({
                            type: "DUPLOAD_DOWNLOAD2",
                            id: t
                        }, t => {
                            chrome.runtime.lastError ? n(new Error("cdn")) : t?.url ? e(t.url) : n(t?.missing ? new Error("missing") : new Error("cdn"))
                        })
                    }))(t).then(t => {
                        const e = Cb();
                        xb.setReady({
                            status: "Ready — tap Direct Download when you want the file",
                            ...e,
                            url: t,
                            action: "Direct Download · Skip Wait — No Timer, No Mediator"
                        }), D()
                    }).catch(t => {
                        Lb = !1;
                        const e = t instanceof Error && "missing" === t.message;
                        xb.setError(e ? "File unavailable" : "Unlock failed", e ? Eb : "Could not unlock this file. Reload and try again.", e ? "Nothing to download here." : void 0)
                    })
                }))
            })
        }, function() {
            window === window.top && !dv && Ib.exec(location.pathname) && ot("freedlink").then(t => {
                t && !dv && (dv = !0, (uv = Ob()).progress({
                    status: Zb
                }), it(() => {
                    uv.progress({
                        status: Jb,
                        ...pv()
                    }), new Promise(t => {
                        const e = zb();
                        if ("unknown" !== e) return void t(e);
                        const n = new MutationObserver(() => {
                            const e = zb();
                            "unknown" !== e && (n.disconnect(), clearTimeout(o), t(e))
                        });
                        n.observe(document.documentElement, {
                            childList: !0,
                            subtree: !0
                        });
                        const o = window.setTimeout(() => {
                            n.disconnect(), t(zb())
                        }, 12e3)
                    }).then(t => {
                        if ("missing" !== t) {
                            if ("cooldown" === t) {
                                const t = Fb();
                                if (t) return void hv(t.seconds, t.message)
                            }
                            "ready" !== t ? uv.setError(cv, lv, cv) : fv()
                        } else(() => {
                            const t = Hb();
                            uv.setError(t?.title || Xb, t?.detail || "The file you were looking for could not be found, sorry for any inconvenience", t?.title || Xb)
                        })()
                    })
                }))
            })
        }, function() {
            window === window.top && ot("earn4link-mediator").then(t => {
                t && (Sv() || "e4l" === vv("site") || document.querySelector("#wpsafelink-landing") ? xv() : it(() => {
                    xv()
                }))
            })
        }, function() {
            window === window.top && Ov() && ot("earn4link").then(t => {
                t && (Dv(), new MutationObserver(Dv).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Dv, !0))
            })
        }, () => {
            if (window !== window.top || !location.href.startsWith(chrome.runtime.getURL("working.html"))) return;
            const t = new URLSearchParams(location.search);
            if ("earnlinks" !== t.get("site")?.trim()) return;
            const e = t.get("u")?.trim() ?? "";
            (t => {
                try {
                    const e = new URL(t);
                    if (!(t => /^https?:\/\//i.test(t))(e.href)) return !1;
                    const [n, ...o] = e.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                    return !!n && 0 === o.length && Nv.test(n)
                } catch {
                    return !1
                }
            })(e) ? Wv(e): Uv.setError("Missing unlock details.")
        }, () => {
            window === window.top && (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                return 1 === t.length && zv.test(t[0])
            })() && ot("reshortfly").then(t => {
                if (!t) return;
                Qv();
                const e = new MutationObserver(() => {
                    Qv(), Gv && e.disconnect()
                });
                e.observe(document.documentElement, {
                    attributeFilter: ["value"],
                    attributes: !0,
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", Qv, !0), window.addEventListener("load", Qv, !0)
            })
        }, () => {
            if (window !== window.top || !location.href.startsWith(chrome.runtime.getURL("working.html"))) return;
            const t = new URLSearchParams(location.search);
            if ("alpharede" !== t.get("site")?.trim()) return;
            const e = t.get("u")?.trim() ?? "";
            (t => {
                try {
                    const e = new URL(t);
                    if (!(t => /^https?:\/\//i.test(t))(e.href)) return !1;
                    const [n, ...o] = e.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                    return !!n && 0 === o.length && tS.test(n)
                } catch {
                    return !1
                }
            })(e) ? oS(e): nS.setError("Missing unlock details.")
        }, () => {
            if (window !== window.top || lS) return;
            const t = (() => {
                const t = location.pathname.replace(/^\/+|\/+$/g, "").split("/").filter(Boolean);
                if ("r" === t[0] && 2 === t.length && rS.test(t[1])) return t[1];
                if ("captcha" === t[0] && 1 === t.length) {
                    const t = new URLSearchParams(location.search).get("dest")?.trim() ?? "";
                    return rS.test(t) ? t : null
                }
                return null
            })();
            t && ot("finityrede").then(e => {
                if (!e || lS) return;
                lS = !0;
                const n = uS("Unlocking destination…");
                (async t => {
                    const e = await (await fetch(`${location.origin}/config.json`, {
                            cache: "no-store"
                        })).json(),
                        n = e.supabaseUrl.replace(/\/+$/, ""),
                        o = {
                            Accept: "application/json",
                            "Content-Type": "application/json",
                            apikey: e.supabaseAnonKey,
                            Authorization: `Bearer ${e.supabaseAnonKey}`
                        },
                        r = await (await fetch(`${n}/functions/v1/get-final-link?dest=${encodeURIComponent(t)}`, {
                            headers: o
                        })).json();
                    if (!r.success) throw new Error("final");
                    const i = await (await fetch(`${n}/functions/v1/register-click`, {
                        method: "POST",
                        headers: o,
                        body: JSON.stringify({
                            link_id: r.link.id,
                            captcha_token: r.captcha.token,
                            captcha_timestamp: r.captcha.timestamp,
                            captcha_answer: "correct",
                            expected_answer: "correct",
                            fingerprint: {
                                has_js: !0,
                                screen_resolution: `${screen.width}x${screen.height}`,
                                has_interaction: !0,
                                webdriver: !1,
                                canvas_hash: "sw",
                                solve_time_ms: 2800,
                                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                                languages: [...navigator.languages],
                                touch_support: navigator.maxTouchPoints > 0
                            }
                        })
                    })).json();
                    if (!i.success || !i.url_destino) throw new Error("destino");
                    return new URL(i.url_destino).href
                })(t).then(t => {
                    n.setStatus("Redirecting now…"), D(), location.replace(t)
                }).catch(() => {
                    lS = !1, n.setError("Could not unlock this link. Reload and try again.")
                })
            })
        }, () => {
            window !== window.top || gS || document.cookie.split("; ").some(t => t.startsWith("fid=")) && ot("tendrives").then(t => {
                if (!t || gS) return;
                gS = !0;
                const e = kS(document.documentElement.innerHTML),
                    n = vS("Resolving direct CDN…", e.name, e.size);
                (async () => {
                    const t = document.documentElement.innerHTML;
                    let {
                        name: e,
                        size: n
                    } = kS(t);
                    const o = t.match(pS)?.[0];
                    if (o) return {
                        url: o,
                        name: e || bS(o),
                        size: n
                    };
                    let r = /\/20\d{2}\/\d{2}\//.test(location.pathname) ? location.href : t.match(hS)?.[1];
                    if (!r) {
                        document.cookie = "page=2; path=/";
                        const t = await SS(`${location.origin}/`);
                        e || ({
                            name: e,
                            size: n
                        } = kS(t)), r = t.match(hS)?.[1]
                    }
                    if (!r) throw new Error("article");
                    document.cookie = "page=3; path=/";
                    const i = await SS(r);
                    e || ({
                        name: e,
                        size: n
                    } = kS(i));
                    const a = i.match(pS)?.[0];
                    if (!a) throw new Error("dl");
                    return {
                        url: a,
                        name: e || bS(a),
                        size: n
                    }
                })().then(({
                    url: t,
                    name: e,
                    size: o
                }) => {
                    n.setNote(yS(e, o)), n.setStatus("Ready — tap Direct Download when you want the file."), n.setAction(t, "Direct Download · Skip Wait — No Timer, No Mediator"), D()
                }).catch(() => {
                    gS = !1, n.setAction(null), n.setError("Could not unlock this file. Reload and try again.")
                })
            })
        }, () => {
            ot("tech8s").then(t => {
                if (!t) return;
                if (JS.test(location.pathname)) {
                    QS("Opening destination…");
                    const t = tE(new URLSearchParams(location.search).get("url"));
                    if (!t) throw new Error("tech8s st");
                    return D(), void location.replace(t)
                }
                if (!ZS.test(location.pathname)) return;
                QS("Skipping safe redirect…");
                let e, n = !1;
                const o = () => {
                    if (n) return;
                    const t = (() => {
                        for (const t of document.scripts) {
                            const e = t.textContent ?? "";
                            if (!e.includes("window.location.href")) continue;
                            const n = tE(XS.exec(e)?.[1]);
                            if (n) return n
                        }
                        return null
                    })();
                    t && (n = !0, e.disconnect(), D(), location.replace(t))
                };
                e = new MutationObserver(o), it(o), e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), window.setTimeout(() => {
                    if (!n) throw e.disconnect(), new Error("tech8s safe")
                }, 5e3)
            })
        }, () => {
            window === window.top && ot("tech8s-adrinolinks").then(t => {
                t && (YS(), new MutationObserver(YS).observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", YS, !0))
            })
        }, () => {
            window === window.top && (LS.test(location.pathname) || CS.test(location.pathname) || Promise.all([ot("tech8s"), ot("tech8s-open-php")]).then(([t, e]) => {
                if (!t) return;
                qS = e;
                const n = () => {
                    DS() && (_S(), MS(), BS())
                };
                if (n(), AS) return;
                const o = new MutationObserver(() => {
                    n(), AS && o.disconnect()
                });
                o.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                }), "loading" === document.readyState && document.addEventListener("DOMContentLoaded", n, !0)
            }))
        }, function() {
            const t = window.location.hash.slice(1);
            t && ot("tinurlz-softinfo").then(e => {
                if (!e) return;
                const n = function(t) {
                    try {
                        return t.startsWith("aHR0") ? atob(t) : decodeURIComponent(t)
                    } catch {
                        return null
                    }
                }(t);
                if (!n || !/^https?:\/\//i.test(n)) return;
                const o = function(t) {
                    try {
                        const e = new URL(t);
                        if ("kitokola.id" !== e.hostname.toLowerCase()) return null;
                        const n = e.searchParams.get("dl") ?? e.searchParams.get("get");
                        if (!n) return null;
                        const o = decodeURIComponent(n);
                        return /^https?:\/\//i.test(o) ? o : null
                    } catch {
                        return null
                    }
                }(n) ?? n;
                D(), window.location.replace(o)
            })
        }, function() {
            window === window.top && ot("shycloud").then(t => {
                t && it(fE)
            })
        }, function() {
            const t = ot("usersdrive");
            it(() => {
                const e = function() {
                        for (const t of document.querySelectorAll("a.btn.btn-download[href]")) {
                            const e = t.getAttribute("href")?.trim() ?? "";
                            if (/userdrive\.org/i.test(e)) return e
                        }
                        return null
                    }(),
                    n = document.querySelector('input[name="op"][value="download2"]')?.form,
                    o = document.querySelector("a.btn.btn-download[href]") ?? document.querySelector("#downloadbtn");
                o && (e || n) && t.then(t => {
                    if (!t) return;
                    document.querySelector(".countdown")?.remove(), document.getElementById("skipwait-usersdrive-bypass")?.remove(),
                        function() {
                            const t = window.open.bind(window);
                            window.open = (e, n, o) => null != e && bE.test(String(e)) ? null : t(e, n, o)
                        }();
                    let r, i = e ?? void 0;
                    const a = () => i ? Promise.resolve(i) : n ? (r ??= vE(n).then(t => (i = t, t)).finally(() => {
                            r = void 0
                        }), r) : Promise.reject(new Error("form")),
                        s = t => {
                            o instanceof HTMLButtonElement && (o.disabled = !1, o.classList.remove("disabled")), o.textContent = t
                        };
                    e && o instanceof HTMLAnchorElement && (o.href = e, o.removeAttribute("target")), s(wE), document.addEventListener("click", t => {
                        t.target.closest("#downloadbtn, a.btn.btn-download") && (t.preventDefault(), t.stopImmediatePropagation(), s(gE), a().then(t => {
                            D(), Object.assign(document.createElement("a"), {
                                href: t
                            }).click(), s(wE)
                        }).catch(() => s(yE)))
                    }, !0), n?.addEventListener("submit", t => {
                        t.preventDefault(), t.stopImmediatePropagation()
                    }, !0), !i && n && (s(gE), a().then(() => s(wE)).catch(() => s(yE)))
                })
            })
        }, () => {
            if (window !== window.top || _E) return;
            if (!SE.test(location.pathname)) return;
            const t = ot("vexfile");
            it(() => {
                document.querySelector(".download-block, a.generate-link, #captcha-form, .cf-turnstile") && t.then(t => {
                    t && !_E && (_E = !0, chrome.runtime.sendMessage({
                        type: "skip-wait-vexfile-verify-hook"
                    }), NE())
                })
            })
        }, function() {
            const t = ot("mega4upload");
            it(() => {
                t.then(t => {
                    if (!t) return;
                    const e = function() {
                        const t = document.querySelector('input[name="id"]')?.value.trim();
                        if (t) return t;
                        const e = location.pathname.match(BE)?.[1]?.toLowerCase();
                        return e && !UE.has(e) ? e : null
                    }();
                    e && zE(HE(e))
                })
            })
        }, function() {
            if (!YE.test(location.pathname) && !GE.test(location.pathname)) return;
            const t = ot("mirrored");
            it(() => {
                t.then(t => {
                    t && px()
                })
            })
        }, function() {
            ot("modded-1").then(t => {
                t && N("#skipwait-modded1-brand")
            })
        }, function() {
            ot("moddroid").then(t => {
                t && N("#skipwait-moddroid-brand")
            })
        }, function() {
            ot("modsmaniac").then(t => {
                t && N("#skipwait-modsmaniac-brand")
            })
        }, function() {
            Tx(), Ix()
        }, function() {
            const t = ot("mp4upload");
            it(() => {
                t.then(t => {
                    t && qx()
                })
            })
        }, function() {
            const t = ot("muhammadniaz");
            it(() => {
                t.then(t => {
                    t && function() {
                        const t = document.getElementById("downloadbtn");
                        t && document.getElementById("countdown") && (document.querySelectorAll("#countdown").forEach(t => t.remove()), t.querySelectorAll('[data-status="disabled"]').forEach(t => t.remove()), document.getElementById(Dx) || (D(), t.insertAdjacentHTML("beforebegin", `<div id="${Dx}" class="info-card" role="status"><div class="info-label">Skip Wait</div><ul><li><span class="infoname">Status</span><span>Timer skipped. Click Create download link.</span></li></ul></div>`)))
                    }()
                })
            })
        }, function() {
            ot("tipsguru").then(async t => {
                if (!t) return;
                const e = await async function() {
                    try {
                        const t = sessionStorage.getItem(Wx);
                        if (!t) return null;
                        const e = JSON.parse(t);
                        return e?.dest && "number" == typeof e.endAt && await Bx(e.dest) ? e : (sessionStorage.removeItem(Wx), null)
                    } catch {
                        return sessionStorage.removeItem(Wx), null
                    }
                }();
                if (e && "/" === location.pathname) return zx = !0, void Xx(e);
                Kx(), it(() => {
                    Kx()
                })
            })
        }, function() {
            window === window.top && Qx() && ot("tumadam").then(t => {
                if (!t) return;
                sL(), cL("Getting things ready…"), it(lL);
                const e = new MutationObserver(() => {
                    lL(), iL && e.disconnect()
                });
                e.observe(document.documentElement, {
                    childList: !0,
                    subtree: !0
                })
            })
        }, function() {
            if (!Ox.test(location.pathname)) return;
            const t = ot("pling");
            it(() => {
                t.then(t => {
                    t && (Px(), new MutationObserver(Px).observe(document.body, {
                        childList: !0,
                        subtree: !0
                    }))
                })
            })
        }, function() {
            if (!uL.test(location.pathname)) return;
            const t = ot("wahmi");
            it(() => {
                document.querySelector(".filebox-download") && document.querySelector(".download-counter") && t.then(t => {
                    t && mL()
                })
            })
        }, function() {
            fL.test(location.pathname) && it(() => {
                const t = (() => {
                    const t = document.querySelector(".zmk-file-link[data-slug][data-start-url][data-complete-url][data-waiting-text][data-ready-text]");
                    if (!t) return null;
                    const e = t.dataset.slug?.trim(),
                        n = t.dataset.startUrl?.trim(),
                        o = t.dataset.completeUrl?.trim(),
                        r = t.dataset.waitingText?.trim(),
                        i = t.dataset.readyText?.trim(),
                        a = t.querySelector(".zmk-file-button")?.textContent?.trim(),
                        s = (t => {
                            let e = t.closest(".td_block_wrap")?.previousElementSibling ?? null;
                            for (; e;) {
                                const t = e.querySelector(".td-block-title span")?.textContent?.trim();
                                if (t) return t;
                                e = e.previousElementSibling
                            }
                            return null
                        })(t);
                    return e && n && o && r && i && a && s ? {
                        slug: e,
                        startUrl: n,
                        completeUrl: o,
                        startLabel: a,
                        waitingLabel: (c = r, c.replace(/\{loader\}|\{seconds\}/gi, "").replace(/\s+/g, " ").trim()),
                        readyLabel: i,
                        pageHint: s
                    } : null;
                    var c
                })();
                t && ot("weadown").then(e => {
                    e && TL(t).catch(e => {
                        EL(), CL(t, "wait"), wL.setError(e instanceof Error ? e.message : String(e))
                    })
                })
            })
        }, function() {
            window === window.top && !PL && qL.test(location.pathname) && ot("zifury").then(t => {
                t && !PL && it(() => {
                    if (!document.querySelector(".download-container .free-element")) return;
                    const t = WL();
                    t && (PL = !0, JL(t).catch(e => {
                        PL = !1, FL(), YL(t, "fetch"), _L.setError(e instanceof Error ? e.message : String(e))
                    }))
                })
            })
        }, function() {
            Uy("wp-safelink-query")
        }, function() {
            Uy("wp-safelink")
        }, function() {
            wpbStart("wpsafelink-button")
        }, function() {
            /*
             * bitcotasks.com — FaucetFly "firewall" interstitial (recipe from
             * bypass-shortlinks): once the on-page captcha reports Verified,
             * press the Validate button and the page-world continueClicked().
             */
            ot("bitcotasks").then(t => {
                if (!t) return;
                const e = () => {
                        const t = document.querySelector("#captcha-container");
                        if (!t || !wpbVis(t)) return;
                        const e = [...document.querySelectorAll(".mb-2")].some(t => "Verified" === wpbText(t));
                        if (!e) return;
                        if (/\/firewall/i.test(location.pathname) || location.href.includes("/firewall")) {
                            const t = [...document.querySelectorAll("button, input[type=button], input[type=submit]")].find(t => /validate/i.test(wpbText(t) || (t.value ?? "")));
                            t && !t.disabled && (t.click(), clearInterval(n))
                        }
                        chrome.runtime.sendMessage({
                            type: "SKIP_WAIT_PAGE_CALL",
                            name: "continueClicked"
                        }).catch(() => {})
                    },
                    n = setInterval(e, 1500);
                setTimeout(() => clearInterval(n), 3e5), it(e)
            })
        }, function() {
            const t = ot("swiftuploads");
            it(() => {
                const e = location.pathname.match(A$)?.[1] ?? null;
                e && document.querySelector(".download-section") && t.then(t => {
                    t && U$(e)
                })
            })
        }, function() {
            const t = ot("uploadrar");
            it(() => {
                const e = document.querySelector('button[name="method_free"]'),
                    n = e?.form,
                    o = n?.querySelector('input[name="id"]')?.value.trim();
                e && n && o && n.querySelector('input[name="op"][value="download1"]') && t.then(t => {
                    if (!t) return;
                    e.classList.replace("btn-outline-primary", "btn-success"), e.textContent = H$;
                    let n = !1;
                    e.addEventListener("click", t => {
                        t.preventDefault(), t.stopImmediatePropagation(), n || (n = !0, e.disabled = !0, e.textContent = "Starting…", async function(t) {
                            const e = await fetch(location.href, {
                                    method: "POST",
                                    credentials: "include",
                                    headers: {
                                        "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    body: new URLSearchParams({
                                        op: "download2",
                                        id: t,
                                        rand: "",
                                        referer: "",
                                        method_free: "Free Download",
                                        method_premium: "",
                                        adblock_detected: "0"
                                    })
                                }),
                                n = W$.exec(await e.text())?.[1];
                            if (!n) throw new Error("cdn");
                            return n
                        }(o).then(t => {
                            D(), Object.assign(document.createElement("a"), {
                                href: t
                            }).click(), e.textContent = H$
                        }).catch(() => {
                            e.classList.replace("btn-success", "btn-danger"), e.textContent = "Failed"
                        }).finally(() => {
                            e.disabled = !1, n = !1
                        }))
                    }, !0)
                })
            })
        }, function() {
            ot("filespayouts").then(t => {
                t && it(() => {
                    const t = document.querySelector("#method_free"),
                        e = t?.form,
                        n = e?.querySelector('input[name="id"]')?.value.trim();
                    t && e && n && e.querySelector('input[name="op"][value="download1"]') && (t.classList.add("btn-success"), t.value = F$, t.addEventListener("click", e => {
                        e.preventDefault(), e.stopImmediatePropagation(), t.value = "Starting…",
                            function(t) {
                                const e = document.createElement("form");
                                e.method = "POST", e.action = location.href;
                                for (const [n, o] of Object.entries({
                                        op: "download2",
                                        id: t,
                                        rand: "",
                                        referer: location.href,
                                        method_free: "Free Download >>",
                                        method_premium: "",
                                        adblock_detected: "0"
                                    })) {
                                    const t = document.createElement("input");
                                    t.type = "hidden", t.name = n, t.value = o, e.append(t)
                                }
                                document.body.append(e), D(), e.submit()
                            }(n), t.value = F$
                    }, !0))
                })
            })
        }, function() {
            const t = ot("theuser-cloud");
            it(() => {
                const e = document.querySelector('#direct_link a[href*="/d/"]')?.href,
                    n = document.querySelector('input[name="op"][value="download2"]')?.form,
                    o = document.querySelector(j$);
                (e || n && o) && t.then(t => {
                    if (t) return e ? (D(), void location.assign(e)) : void(n && o && V$(n, o))
                })
            })
        }, function() {
            const t = ot("oceanofdmg");
            it(() => {
                t.then(t => {
                    if (t) return /^\/download\/?$/i.test(location.pathname) ? (D(), void location.replace(X$(document.documentElement.innerHTML))) : void document.querySelectorAll('form[action*="/download/"]').forEach(K$)
                })
            })
        }, function() {
            const t = ot("pesktop");
            it(() => {
                const e = document.querySelector('form[name="myForm"][action*="/downloads"]');
                e && t.then(t => {
                    if (!t) return;
                    const n = Object.assign(document.createElement("div"), {
                        id: "skipwait-pesktop",
                        innerHTML: '<strong style="display:block;font-size:14px;margin-bottom:2px">Skip Wait</strong><span style="font-size:12px;opacity:.9">Waiting page skipped — download opens the file directly.</span>'
                    });
                    n.setAttribute("role", "status"), n.style.cssText = "width:100%;box-sizing:border-box;margin:0 0 10px;padding:10px 12px;border-radius:8px;background:linear-gradient(135deg,#0b6bcb,#084a8a);color:#fff;font:13px/1.4 system-ui,sans-serif;text-align:center", e.before(n);
                    let o = tA(e);
                    const r = e.querySelector('input[name="path"]');
                    for (const i of document.querySelectorAll(".download_links[data-link]")) i.addEventListener("click", () => {
                        r.value = i.dataset.link, o = tA(e)
                    });
                    e.addEventListener("click", t => {
                        t.target instanceof Element && t.target.closest(".download_link") && (t.preventDefault(), t.stopImmediatePropagation(), o.then(t => {
                            D(), location.replace(t)
                        }))
                    }, !0)
                })
            })
        }, function() {
            initVexolink();
        }, function() {
            initMovies4u();
        }, function() {
            initMolyn();
        }],
        Sq = "undefined" != typeof chrome && !!chrome.runtime?.id;
    !async function() {
        if (Sq) {
            if (window !== window.top) return await jt() && jt().then(t => {
                t && (B("skip-wait-coomeet", "on"), "undefined" != typeof chrome && chrome.runtime?.id ? chrome.runtime.sendMessage({
                    type: "SKIP_WAIT_COOMEET_MAIN"
                }).catch(() => {}) : zt())
            }), void Ch();
                        for (const t of vq) try {
                t()
            } catch {}
        } else zt()
    }()
}();
