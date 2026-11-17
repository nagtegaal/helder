function e() {
	if (document.getElementById("helder-font")) return;
	let e = import.meta.url.replace(/[^/]*$/, ""), t = document.createElement("style");
	t.id = "helder-font", t.textContent = `@font-face {
  font-family: "Helder Open Sans";
  src: url("${e}fonts/open-sans-latin-wght-normal.woff2") format("woff2-variations"),
       url("${e}fonts/open-sans-latin-wght-normal.woff2") format("woff2");
  font-weight: 300 800;
  font-style: normal;
  font-display: swap;
}`, document.head.append(t);
}
// src/core/hass.ts
var t, n = /* @__PURE__ */ new Set(), r = !1;
function i() {
	return document.querySelector("home-assistant");
}
function a() {
	let e = i()?.hass;
	e && e !== t && (t = e, n.forEach((t) => t(e)));
}
function o(e) {
	return n.add(e), t && e(t), l(), () => n.delete(e);
}
var s = () => t ?? i()?.hass;
function c(e) {
	e && e !== t && (t = e, n.forEach((t) => t(e)));
}
function l() {
	if (r) return;
	r = !0;
	let e = 0, n = () => {
		e ||= requestAnimationFrame(() => {
			e = 0, a();
		});
	}, i = setInterval(() => {
		a(), t && clearInterval(i);
	}, 150);
	new MutationObserver(n).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), setInterval(n, 2e3);
}
// src/tokens/color.ts
var u = (e) => typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e), d = (e) => [
	1,
	3,
	5
].map((t) => parseInt(e.slice(t, t + 2), 16)), f = (e) => "#" + e.map((e) => Math.round(Math.max(0, Math.min(255, e))).toString(16).padStart(2, "0")).join("");
function ee(e) {
	let [t, n, r] = d(e).map((e) => e / 255).map((e) => e <= .03928 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4);
	return .2126 * t + .7152 * n + .0722 * r;
}
function te(e, t, n) {
	let r = d(e), i = d(t);
	return f(r.map((e, t) => e * n + i[t] * (1 - n)));
}
function ne(e, t) {
	let [n, r, i] = d(e);
	return `rgba(${n}, ${r}, ${i}, ${ae(t)})`;
}
var re = (e) => d(e).join(", "), ie = (e) => ee(e) > .4 ? "#1c1814" : "#ffffff";
function p(e, t, n) {
	let r = (r) => {
		let i = (r + e / 60) % 6;
		return n - n * t * Math.max(0, Math.min(i, 4 - i, 1));
	};
	return f([
		r(5),
		r(3),
		r(1)
	].map((e) => e * 255));
}
function m(e) {
	let [t, n, r] = d(e).map((e) => e / 255), i = Math.max(t, n, r), a = i - Math.min(t, n, r), o = 0;
	return a && (o = i === t ? (n - r) / a % 6 : i === n ? (r - t) / a + 2 : (t - n) / a + 4), [
		(o * 60 + 360) % 360,
		i ? a / i : 0,
		i
	];
}
var ae = (e, t = 3) => {
	let n = 10 ** t;
	return Math.round(e * n) / n;
}, h = (e, t, n, r, i) => ({
	id: e,
	name: t,
	light: n,
	dark: r,
	group: i
}), g = [
	h("orange", "Oranje", "#ff6d00", "#ff7a1a", "color"),
	h("blue", "Blauw", "#2563eb", "#5b8cff", "color"),
	h("teal", "Groenblauw", "#0d8a8a", "#2cc4c0", "color"),
	h("indigo", "Indigo", "#4f46e5", "#8f88ff", "color"),
	h("red", "Rood", "#dc2626", "#f87171", "color"),
	h("coral", "Koraal", "#e8474f", "#ff7a7f", "color"),
	h("raspberry", "Framboos", "#db2777", "#f472b6", "color"),
	h("pink", "Roze", "#d6517f", "#f59ab8", "color"),
	h("purple", "Paars", "#9333ea", "#c084fc", "color"),
	h("violet", "Violet", "#7c3aed", "#a78bfa", "color"),
	h("sky", "Hemelsblauw", "#0284c7", "#38bdf8", "color"),
	h("cyan", "Cyaan", "#0891b2", "#22d3ee", "color"),
	h("petrol", "Petrol", "#0f6e7a", "#3fb0bd", "color"),
	h("emerald", "Smaragd", "#059669", "#34d399", "color"),
	h("green", "Groen", "#16a34a", "#4ade80", "color"),
	h("lime", "Limoen", "#65a30d", "#a3e635", "color"),
	h("olive", "Olijf", "#6b7f1a", "#a3b84a", "color"),
	h("mustard", "Mosterd", "#b98a05", "#facc15", "color"),
	h("amber", "Amber", "#d97706", "#fbbf24", "color"),
	h("terracotta", "Terracotta", "#c2410c", "#f0835a", "color"),
	h("cognac", "Cognac", "#9a5b2e", "#d0905a", "color"),
	h("peach", "Perzik", "#ffb58a", "#ffc3a0", "light"),
	h("apricot", "Abrikoos", "#ffc976", "#ffd591", "light"),
	h("salmon", "Zalm", "#ff9e8f", "#ffb0a3", "light"),
	h("blush", "Poederroze", "#f7b2c4", "#f9c3d1", "light"),
	h("lavender", "Lavendel", "#b9a8f0", "#c7b9f5", "light"),
	h("lilac", "Lila", "#d3a6e8", "#dcb7ee", "light"),
	h("babyblue", "Babyblauw", "#9cc7f5", "#b0d3f7", "light"),
	h("iceblue", "IJsblauw", "#a6e1ef", "#b8e8f3", "light"),
	h("mint", "Mint", "#9fe0c0", "#b2e7cd", "light"),
	h("sage", "Salie", "#b5c9a1", "#c4d4b3", "light"),
	h("lemon", "Citroen", "#f3e27a", "#f6e992", "light"),
	h("sand", "Zand", "#e3cfaa", "#e9d9bb", "light"),
	h("graphite", "Grafiet", "#3f3f46", "#d4d4d8", "grey"),
	h("anthracite", "Antraciet", "#27272a", "#e4e4e7", "grey"),
	h("slate", "Leisteen", "#475569", "#a8b6c9", "grey"),
	h("warmgrey", "Warm grijs", "#78716c", "#c4bcb4", "grey"),
	h("silver", "Zilver", "#7d838c", "#c9ced6", "grey")
], oe = (e) => g.find((t) => t.id === e), se = {
	light: "#f8efe5",
	dark: "#16110d"
}, ce = {
	light: "#f8f4f0",
	dark: "#141210"
}, le = {
	light: [
		"rgba(255, 176, 120, 0.55)",
		"rgba(255, 210, 160, 0.7)",
		"rgba(246, 160, 150, 0.45)",
		"rgba(255, 222, 180, 0.75)",
		"rgba(255, 196, 150, 0.35)"
	],
	dark: [
		"rgba(255, 120, 40, 0.22)",
		"rgba(150, 80, 170, 0.2)",
		"rgba(255, 160, 80, 0.16)",
		"rgba(200, 90, 70, 0.18)",
		"rgba(255, 140, 60, 0.1)"
	]
}, ue = {
	light: [
		.38,
		.26,
		.32,
		.2,
		.16
	],
	dark: [
		.26,
		.18,
		.22,
		.15,
		.1
	]
}, de = [
	"12% 18%, 34%",
	"88% 12%, 30%",
	"72% 82%, 36%",
	"30% 92%, 30%",
	"50% 45%, 26%"
], fe = {
	light: {
		"color-text": "#2a221c",
		"color-text-muted": "#7a6c60",
		"color-disabled": "#b3a79c",
		"glass-rgb": "255, 255, 255",
		"glass-border": "rgba(255, 255, 255, 0.65)",
		"glass-highlight": "rgba(255, 255, 255, 0.85)",
		"shadow-card": "0 0.7rem 2rem rgba(110, 70, 30, 0.13), 0 1px 3px rgba(110, 70, 30, 0.1)",
		"control-bg": "rgba(90, 60, 30, 0.09)",
		"control-bg-hover": "rgba(90, 60, 30, 0.14)",
		"control-border": "rgba(42, 34, 28, 0.22)",
		thumb: "#ffffff",
		"thumb-shadow": "0 1px 4px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)",
		"color-light": "#e89a00",
		"color-heat": "#e8590c",
		"color-cool": "#0284c7",
		"color-error": "#c62828",
		"heat-glow": "rgba(235, 45, 30, 0.26)",
		"light-glow-strength": "34%",
		"popover-bg": "rgba(255, 252, 248, 0.92)",
		scrim: "rgba(42, 34, 28, 0.25)"
	},
	dark: {
		"color-text": "#f3ebe3",
		"color-text-muted": "#ab9d90",
		"color-disabled": "#6a5f56",
		"glass-rgb": "52, 44, 38",
		"glass-border": "rgba(255, 255, 255, 0.14)",
		"glass-highlight": "rgba(255, 255, 255, 0.22)",
		"shadow-card": "0 0.8rem 2.4rem rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.35)",
		"control-bg": "rgba(255, 255, 255, 0.09)",
		"control-bg-hover": "rgba(255, 255, 255, 0.14)",
		"control-border": "rgba(243, 235, 227, 0.22)",
		thumb: "#f8f2ec",
		"thumb-shadow": "0 1px 4px rgba(0, 0, 0, 0.4)",
		"color-light": "#ffc23d",
		"color-heat": "#ff8a3d",
		"color-cool": "#38bdf8",
		"color-error": "#ff6b6b",
		"heat-glow": "rgba(255, 70, 50, 0.3)",
		"light-glow-strength": "30%",
		"popover-bg": "rgba(40, 33, 28, 0.94)",
		scrim: "rgba(0, 0, 0, 0.45)"
	}
}, pe = {
	"font-family": "\"Helder Open Sans\", \"Open Sans\", system-ui, -apple-system, \"Segoe UI\", sans-serif",
	"font-weight": "400",
	"font-weight-readout": "300",
	"font-size-xs": "0.75rem",
	"font-size-s": "0.857rem",
	"font-size-m": "1rem",
	"font-size-l": "1.25rem",
	"font-size-xl": "1.75rem",
	space: "1rem",
	"space-s": "0.6rem",
	"space-xs": "0.35rem",
	"control-size": "2.4rem",
	"icon-size": "1.35rem",
	"slider-height": "0.6rem",
	"thumb-size": "1.55rem",
	"focus-ring": "2px",
	"transition-fast": "0.15s ease",
	transition: "0.25s ease"
};
function _(e, t) {
	if (u(e)) {
		let n = e.toLowerCase();
		return t === "dark" && ee(n) < .18 ? te("#ffffff", n, .22) : n;
	}
	let n = oe(e) ?? g[0];
	return t === "dark" ? n.dark : n.light;
}
var v = (e) => `${Math.round(e * 10) / 10}px`;
function me(e, t) {
	let n = {
		...pe,
		...fe[t]
	}, r = t === "dark", i = _(e.accent, t);
	n["color-accent"] = i, n["color-accent-rgb"] = re(i), n["color-on-accent"] = ie(i);
	let a = r ? e.gradientDark : e.gradientLight, o = r ? e.baseDark : e.baseLight, s = a === "warm", c = a === "accent" ? i : s ? se[t] : _(a, t), l = s ? le[t] : ue[t].map((e) => ne(c, e));
	l.forEach((e, t) => n[`bg-blob-${t + 1}`] = e);
	let u;
	u = o === "warm" || o === "follow" && s ? se[t] : o === "follow" ? te(c, ce[t], r ? .08 : .07) : te(_(o, t), ce[t], r ? .14 : .18), n["color-bg"] = u, n["bg-image"] = de.map((e, t) => {
		let [n, r] = e.split(", ");
		return `radial-gradient(circle at ${n}, ${l[t]} 0, transparent ${r})`;
	}).join(", "), n.background = `${n["bg-image"]}, ${u}`;
	let d = e.reducedTransparency;
	n["glass-fill"] = `rgba(${fe[t]["glass-rgb"]}, ${d ? .94 : e.fill / 100})`, n["glass-blur"] = v(d ? 0 : e.blur), n["glass-filter"] = d ? "none" : `blur(${v(e.blur)}) saturate(170%)`, n["glass-fill-reduced"] = `rgba(${fe[t]["glass-rgb"]}, 0.94)`;
	let f = r ? e.gloss * .28 : e.gloss, ee = Math.min(1, r ? e.gloss * .45 : e.gloss * 1.6);
	n.gloss = String(Math.round(f * 1e3) / 1e3), n["gloss-edge"] = `rgba(255, 255, 255, ${Math.round(ee * 1e3) / 1e3})`, n["gloss-layer"] = `linear-gradient(160deg, rgba(255, 255, 255, ${he(f)}) 0%, rgba(255, 255, 255, ${he(f * .25)}) 30%, rgba(255, 255, 255, 0) 55%)`, n["radius-card"] = v(e.radius), n["radius-control"] = v(e.radius * .5 + 2), n["radius-pill"] = "999px";
	let p = `inset 0 1px 0 ${n["glass-highlight"]}, inset 1px 0 0 ${n["gloss-edge"]}`, m = "0 0 0 transparent", ae = e.depth !== "shadow", h = e.depth !== "border";
	n["card-inset"] = ae ? p : `inset ${m}`, n["card-drop"] = h ? n["shadow-card"] : m, n["card-border"] = ae ? n["glass-border"] : "transparent", n["card-shadow"] = `${n["card-inset"]}, ${n["card-drop"]}`;
	let g = e.colorMode === "accent";
	return n["state-light"] = g ? i : n["color-light"], n["state-heat"] = g ? i : n["color-heat"], n["state-cool"] = g ? i : n["color-cool"], n["state-cover"] = i, n["state-on"] = i, n;
}
var he = (e) => Math.round(e * 1e3) / 1e3;
function ge(e, t) {
	return {
		"primary-color": e["color-accent"],
		"rgb-primary-color": e["color-accent-rgb"],
		"accent-color": e["color-accent"],
		"rgb-accent-color": e["color-accent-rgb"],
		"text-primary-color": e["color-on-accent"],
		"text-accent-color": e["color-on-accent"],
		"primary-text-color": e["color-text"],
		"secondary-text-color": e["color-text-muted"],
		"disabled-text-color": e["color-disabled"],
		"primary-background-color": e["color-bg"],
		"secondary-background-color": t === "dark" ? "#1f1813" : "#f3e9de",
		"divider-color": t === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(90, 60, 30, 0.12)",
		"lovelace-background": e.background,
		"card-background-color": e["glass-fill"],
		"ha-card-background": `${e["gloss-layer"]}, linear-gradient(${e["glass-fill"]}, ${e["glass-fill"]})`,
		"ha-card-backdrop-filter": e["glass-filter"],
		"ha-card-border-radius": e["radius-card"],
		"ha-card-border-width": "1px",
		"ha-card-border-color": e["card-border"],
		"ha-card-box-shadow": e["card-shadow"],
		"primary-font-family": e["font-family"],
		"ha-font-family-body": e["font-family"],
		"ha-font-family-heading": e["font-family"],
		"state-icon-color": e["color-text-muted"],
		"state-light-on-color": e["state-light"],
		"state-climate-heat-color": e["state-heat"],
		"state-cover-open-color": e["state-cover"],
		"error-color": e["color-error"]
	};
}
// src/tokens/settings.ts
var _e = Object.freeze({
	version: 1,
	accent: "orange",
	gradientLight: "accent",
	gradientDark: "accent",
	baseLight: "follow",
	baseDark: "follow",
	blur: 20,
	fill: 40,
	gloss: .45,
	radius: 18,
	depth: "both",
	colorMode: "domain",
	reducedTransparency: !1
}), ve = {
	subtle: {
		blur: 12,
		fill: 55
	},
	medium: {
		blur: 20,
		fill: 40
	},
	strong: {
		blur: 32,
		fill: 25
	}
}, ye = {
	none: 0,
	soft: .45,
	strong: .75
}, be = [
	6,
	10,
	14,
	18,
	22,
	28
], y = {
	blur: [0, 40],
	fill: [10, 95],
	gloss: [0, 1],
	radius: [0, 32]
}, b = (e, [t, n], r) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : r, xe = (e, t, n) => t.includes(e) ? e : n, x = (e, t) => typeof e == "string" && e.length < 40 ? e : t;
function S(e) {
	let t = e && typeof e == "object" ? e : {}, n = _e;
	return {
		version: 1,
		accent: x(t.accent, n.accent),
		gradientLight: x(t.gradientLight, n.gradientLight),
		gradientDark: x(t.gradientDark, n.gradientDark),
		baseLight: x(t.baseLight, n.baseLight),
		baseDark: x(t.baseDark, n.baseDark),
		blur: b(t.blur, y.blur, n.blur),
		fill: b(t.fill, y.fill, n.fill),
		gloss: b(t.gloss, y.gloss, n.gloss),
		radius: b(t.radius, y.radius, n.radius),
		depth: xe(t.depth, [
			"border",
			"shadow",
			"both"
		], n.depth),
		colorMode: xe(t.colorMode, ["domain", "accent"], n.colorMode),
		reducedTransparency: typeof t.reducedTransparency == "boolean" ? t.reducedTransparency : n.reducedTransparency
	};
}
// src/settings/store.ts
var Se = "helder", Ce = "helder-settings", C = Te(), w, T, E = /* @__PURE__ */ new Set(), we = "connecting";
function Te() {
	try {
		return S(JSON.parse(localStorage.getItem(Ce) ?? "null"));
	} catch {
		return S(null);
	}
}
function Ee(e) {
	try {
		localStorage.setItem(Ce, JSON.stringify(e));
	} catch {}
}
function De(e) {
	let t = S(e);
	JSON.stringify(t) !== JSON.stringify(C) && (C = t, Ee(t), E.forEach((e) => e(t)));
}
var D = () => C, Oe = () => we;
function ke(e) {
	return E.add(e), () => E.delete(e);
}
async function Ae(e) {
	if (e !== w) {
		w = e, T && T().catch(() => void 0), T = void 0;
		try {
			De((await e.sendMessagePromise({
				type: "frontend/get_system_data",
				key: "helder"
			}))?.value ?? null), T = await e.subscribeMessage((e) => De(e?.value ?? null), {
				type: "frontend/subscribe_system_data",
				key: Se
			}), we = "ready";
		} catch (e) {
			we = "unsupported", console.warn("[helder] settings storage unavailable, using defaults", e);
		}
		E.forEach((e) => e(C));
	}
}
async function je(e) {
	if (!w) throw Error("Geen verbinding met Home Assistant");
	let t = S(e);
	await w.sendMessagePromise({
		type: "frontend/set_system_data",
		key: Se,
		value: t
	}), De(t);
}
var Me = !1;
function Ne() {
	Me || (Me = !0, o((e) => {
		e.connection && Ae(e.connection);
	}));
}
// src/settings/apply.ts
var Pe = "helder-runtime";
function Fe() {
	let e = s()?.themes?.darkMode;
	return typeof e == "boolean" ? e ? "dark" : "light" : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function Ie() {
	return getComputedStyle(document.documentElement).getPropertyValue("--helder-theme-active").trim() === "1";
}
var Le = (e, t = "", n = !0) => Object.entries(e).map(([e, r]) => `--${t}${e}: ${r}${n ? " !important" : ""};`).join("\n  ");
function Re(e, t, n) {
	let r = me(e, t), i = `html {\n  ${Le(r, "helder-")}\n  --helder-mode: ${t} !important;\n}\n`;
	return n && (i += `html {\n  ${Le(ge(r, t))}\n}\n`, i += "html, body { font-family: var(--helder-font-family); }\n"), i;
}
var ze = "";
function O() {
	let e = Re(D(), Fe(), Ie());
	if (e === ze) return;
	ze = e;
	let t = document.getElementById(Pe);
	t || (t = document.createElement("style"), t.id = Pe, document.head.append(t)), t.textContent = e;
}
var Be = !1;
function Ve() {
	Be || (Be = !0, Ne(), O(), ke(O), o(O), matchMedia("(prefers-color-scheme: dark)").addEventListener("change", O));
}
// node_modules/.pnpm/@lit+reactive-element@2.1.2/node_modules/@lit/reactive-element/css-tag.js
var k = globalThis, He = k.ShadowRoot && (k.ShadyCSS === void 0 || k.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Ue = Symbol(), We = /* @__PURE__ */ new WeakMap(), Ge = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== Ue) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (He && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = We.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && We.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, Ke = (e) => new Ge(typeof e == "string" ? e : e + "", void 0, Ue), A = (e, ...t) => new Ge(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, Ue), qe = (e, t) => {
	if (He) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = k.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, Je = He ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return Ke(t);
})(e) : e, { is: Ye, defineProperty: Xe, getOwnPropertyDescriptor: Ze, getOwnPropertyNames: Qe, getOwnPropertySymbols: $e, getPrototypeOf: et } = Object, j = globalThis, tt = j.trustedTypes, nt = tt ? tt.emptyScript : "", rt = j.reactiveElementPolyfillSupport, M = (e, t) => e, it = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? nt : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, at = (e, t) => !Ye(e, t), ot = {
	attribute: !0,
	type: String,
	converter: it,
	reflect: !1,
	useDefault: !1,
	hasChanged: at
};
Symbol.metadata ??= Symbol("metadata"), j.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var N = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ot) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && Xe(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = Ze(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? ot;
	}
	static _$Ei() {
		if (this.hasOwnProperty(M("elementProperties"))) return;
		let e = et(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(M("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
			let e = this.properties, t = [...Qe(e), ...$e(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(Je(e));
		} else e !== void 0 && t.push(Je(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return qe(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? it : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? it : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? at)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
N.elementStyles = [], N.shadowRootOptions = { mode: "open" }, N[M("elementProperties")] = /* @__PURE__ */ new Map(), N[M("finalized")] = /* @__PURE__ */ new Map(), rt?.({ ReactiveElement: N }), (j.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/lit-html.js
var st = globalThis, ct = (e) => e, P = st.trustedTypes, lt = P ? P.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ut = "$lit$", F = `lit$${Math.random().toFixed(9).slice(2)}$`, dt = "?" + F, ft = `<${dt}>`, I = document, L = () => I.createComment(""), R = (e) => e === null || typeof e != "object" && typeof e != "function", z = Array.isArray, pt = (e) => z(e) || typeof e?.[Symbol.iterator] == "function", B = "[ 	\n\f\r]", V = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, mt = /-->/g, ht = />/g, H = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), gt = /'/g, _t = /"/g, vt = /^(?:script|style|textarea|title)$/i, yt = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), U = yt(1), bt = yt(2), W = Symbol.for("lit-noChange"), G = Symbol.for("lit-nothing"), xt = /* @__PURE__ */ new WeakMap(), K = I.createTreeWalker(I, 129);
function St(e, t) {
	if (!z(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return lt === void 0 ? t : lt.createHTML(t);
}
var Ct = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = V;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === V ? c[1] === "!--" ? o = mt : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = H) : (vt.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = H) : o = ht : o === H ? c[0] === ">" ? (o = i ?? V, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? H : c[3] === "\"" ? _t : gt) : o === _t || o === gt ? o = H : o === mt || o === ht ? o = V : (o = H, i = void 0);
		let d = o === H && e[t + 1].startsWith("/>") ? " " : "";
		a += o === V ? n + ft : l >= 0 ? (r.push(s), n.slice(0, l) + ut + n.slice(l) + F + d) : n + F + (l === -2 ? t : d);
	}
	return [St(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, wt = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = Ct(t, n);
		if (this.el = e.createElement(l, r), K.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = K.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ut)) {
					let t = u[o++], n = i.getAttribute(e).split(F), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Et : r[1] === "?" ? Dt : r[1] === "@" ? Ot : Y
					}), i.removeAttribute(e);
				} else e.startsWith(F) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (vt.test(i.tagName)) {
					let e = i.textContent.split(F), t = e.length - 1;
					if (t > 0) {
						i.textContent = P ? P.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], L()), K.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], L());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === dt) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(F, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += F.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = I.createElement("template");
		return n.innerHTML = e, n;
	}
};
function q(e, t, n = e, r) {
	if (t === W) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = R(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = q(e, i._$AS(e, t.values), i, r)), t;
}
var Tt = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? I).importNode(t, !0);
		K.currentNode = r;
		let i = K.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new J(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new kt(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = K.nextNode(), a++);
		}
		return K.currentNode = I, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, J = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = G, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = q(this, e, t), R(e) ? e === G || e == null || e === "" ? (this._$AH !== G && this._$AR(), this._$AH = G) : e !== this._$AH && e !== W && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? pt(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== G && R(this._$AH) ? this._$AA.nextSibling.data = e : this.T(I.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = wt.createElement(St(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Tt(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = xt.get(e.strings);
		return t === void 0 && xt.set(e.strings, t = new wt(e)), t;
	}
	k(t) {
		z(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(L()), this.O(L()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = ct(e).nextSibling;
			ct(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Y = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = G, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = G;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = q(this, e, t, 0), a = !R(e) || e !== this._$AH && e !== W, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = q(this, r[n + o], t, o), s === W && (s = this._$AH[o]), a ||= !R(s) || s !== this._$AH[o], s === G ? e = G : e !== G && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === G ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Et = class extends Y {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === G ? void 0 : e;
	}
}, Dt = class extends Y {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== G);
	}
}, Ot = class extends Y {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = q(this, e, t, 0) ?? G) === W) return;
		let n = this._$AH, r = e === G && n !== G || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== G && (n === G || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, kt = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		q(this, e);
	}
}, At = st.litHtmlPolyfillSupport;
At?.(wt, J), (st.litHtmlVersions ??= []).push("3.3.3");
var jt = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new J(t.insertBefore(L(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, Mt = globalThis, X = class extends N {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = jt(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return W;
	}
};
X._$litElement$ = !0, X.finalized = !0, Mt.litElementHydrateSupport?.({ LitElement: X });
var Nt = Mt.litElementPolyfillSupport;
Nt?.({ LitElement: X }), (Mt.litElementVersions ??= []).push("4.2.2");
// src/core/register.ts
function Pt(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
function Ft(e, t) {
	Pt(e.type, t), window.customCards = window.customCards ?? [], window.customCards.some((t) => t.type === e.type) || window.customCards.push({
		type: e.type,
		name: e.name,
		description: e.description,
		preview: e.preview ?? !0,
		documentationURL: "https://github.com/nagtegaal/helder"
	});
}
// src/ui/styles.ts
var It = A`
  :host {
    display: block;
    font-family: var(--helder-font-family);
    font-weight: var(--helder-font-weight);
    -webkit-font-smoothing: antialiased;
  }
  * {
    box-sizing: border-box;
  }

  /* ---------- surface ---------- */
  .card {
    container-type: inline-size;
    position: relative;
    height: 100%;
    display: grid;
    align-content: start;
    gap: 0.85rem;
    padding: var(--helder-space);
    color: var(--helder-color-text);
    background:
      var(--card-glow, linear-gradient(transparent, transparent)),
      var(--helder-gloss-layer),
      linear-gradient(var(--helder-glass-fill), var(--helder-glass-fill));
    -webkit-backdrop-filter: var(--helder-glass-filter);
    backdrop-filter: var(--helder-glass-filter);
    border: 1px solid var(--helder-card-border);
    border-radius: var(--helder-radius-card);
    box-shadow: var(--card-shadow-override, var(--helder-card-shadow));
    transition: background var(--helder-transition);
    --state: var(--helder-color-text-muted);
  }
  @media (prefers-reduced-transparency: reduce) {
    .card {
      background:
        var(--card-glow, linear-gradient(transparent, transparent)),
        linear-gradient(var(--helder-glass-fill-reduced), var(--helder-glass-fill-reduced));
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
  }
  .card.clickable {
    cursor: pointer;
  }
  .card:focus-visible {
    outline: var(--helder-focus-ring) solid var(--helder-color-accent);
    outline-offset: 2px;
  }

  /* glow from the top edge: heating (red) or a lit lamp (in the lamp colour, scaled by brightness) */
  .card.heating {
    --card-glow: radial-gradient(ellipse 130% 75% at 50% 0%, var(--helder-heat-glow) 0%, transparent 70%);
  }
  .card.lit {
    --card-glow: radial-gradient(
      ellipse 130% 80% at 50% 0%,
      color-mix(
          in srgb,
          var(--lamp, var(--state)) calc(var(--helder-light-glow-strength) * (0.35 + 0.65 * var(--bri-f, 1))),
          transparent
        )
        0%,
      transparent 72%
    );
  }

  /* ---------- head: icon, name + secondary line, value ---------- */
  .head {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'icon text value';
    align-items: center;
    gap: var(--helder-space-s);
    min-width: 0;
  }
  .icon {
    grid-area: icon;
    width: var(--helder-control-size);
    height: var(--helder-control-size);
    border-radius: var(--helder-radius-control);
    display: grid;
    place-items: center;
    background: var(--helder-control-bg);
    color: var(--helder-color-text-muted);
    --mdc-icon-size: var(--helder-icon-size);
    transition:
      background var(--helder-transition),
      color var(--helder-transition);
  }
  .icon svg {
    width: var(--helder-icon-size);
    height: var(--helder-icon-size);
  }
  .card.active .icon {
    background: color-mix(in srgb, var(--state) 18%, transparent);
    color: var(--state);
  }
  .text {
    grid-area: text;
    min-width: 0;
  }
  .name {
    font-size: var(--helder-font-size-m);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sub {
    font-size: var(--helder-font-size-s);
    color: var(--helder-color-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .value {
    grid-area: value;
    font-size: 1.15rem;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .unit {
    font-size: var(--helder-font-size-s);
    color: var(--helder-color-text-muted);
    margin-left: 0.1rem;
  }
  .readout {
    font-size: 2.2rem;
    font-weight: var(--helder-font-weight-readout);
    line-height: 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  @container (max-width: 190px) {
    .head {
      grid-template-columns: auto 1fr;
      grid-template-areas: 'icon value' 'text text';
    }
    .value {
      justify-self: end;
    }
  }

  /* ---------- slider ---------- */
  .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 2.3rem;
    margin: 0;
    background: transparent;
    cursor: pointer;
    touch-action: pan-y;
    --p: 50%;
  }
  .slider::-webkit-slider-runnable-track {
    height: var(--helder-slider-height);
    border-radius: var(--helder-radius-pill);
    background: linear-gradient(to right, var(--state) 0 var(--p), var(--helder-control-bg) var(--p) 100%);
  }
  .slider::-moz-range-track {
    height: var(--helder-slider-height);
    border-radius: var(--helder-radius-pill);
    background: var(--helder-control-bg);
  }
  .slider::-moz-range-progress {
    height: var(--helder-slider-height);
    border-radius: var(--helder-radius-pill);
    background: var(--state);
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: var(--helder-thumb-size);
    height: var(--helder-thumb-size);
    margin-top: calc((var(--helder-slider-height) - var(--helder-thumb-size)) / 2);
    border-radius: 50%;
    background: var(--helder-thumb);
    box-shadow: var(--helder-thumb-shadow);
  }
  .slider::-moz-range-thumb {
    width: var(--helder-thumb-size);
    height: var(--helder-thumb-size);
    border: 0;
    border-radius: 50%;
    background: var(--helder-thumb);
    box-shadow: var(--helder-thumb-shadow);
  }
  .slider:disabled {
    cursor: default;
  }
  .slider:disabled::-webkit-slider-thumb {
    background: var(--helder-control-bg);
    box-shadow: none;
  }
  .slider:disabled::-moz-range-thumb {
    background: var(--helder-control-bg);
    box-shadow: none;
  }
  .slider:focus-visible {
    outline: var(--helder-focus-ring) solid var(--helder-color-accent);
    outline-offset: 2px;
    border-radius: var(--helder-radius-pill);
  }

  /* ---------- buttons and chips ---------- */
  .row {
    display: flex;
    gap: var(--helder-space-xs);
  }
  .btn {
    flex: 1 1 0;
    min-width: 0;
    height: var(--helder-control-size);
    border: 0;
    border-radius: var(--helder-radius-control);
    background: var(--helder-control-bg);
    color: var(--helder-color-text);
    cursor: pointer;
    display: grid;
    place-items: center;
    font: inherit;
    --mdc-icon-size: 1.2rem;
    transition: background var(--helder-transition-fast);
  }
  .btn svg {
    width: 1.2rem;
    height: 1.2rem;
  }
  .btn:hover:not(:disabled) {
    background: var(--helder-control-bg-hover);
  }
  .btn:disabled {
    color: var(--helder-color-disabled);
    cursor: default;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--helder-space-xs);
  }
  .chip {
    flex: 1 1 auto;
    border: 0;
    border-radius: var(--helder-radius-control);
    padding: 0.4rem 0.6rem;
    font: inherit;
    font-size: var(--helder-font-size-s);
    white-space: nowrap;
    background: var(--helder-control-bg);
    color: var(--helder-color-text);
    cursor: pointer;
    transition: background var(--helder-transition-fast);
  }
  .chip:hover:not(:disabled):not([aria-pressed='true']) {
    background: var(--helder-control-bg-hover);
  }
  .chip[aria-pressed='true'] {
    background: var(--helder-color-accent);
    color: var(--helder-color-on-accent);
  }
  .chip:disabled {
    color: var(--helder-color-disabled);
    cursor: default;
  }
  .btn:focus-visible,
  .chip:focus-visible,
  .switch:focus-visible {
    outline: var(--helder-focus-ring) solid var(--helder-color-accent);
    outline-offset: 2px;
  }

  /* ---------- switch ---------- */
  .switch {
    grid-area: value;
    width: 2.9rem;
    height: 1.75rem;
    border-radius: var(--helder-radius-pill);
    border: 0;
    padding: 0.175rem;
    background: var(--helder-control-bg-hover);
    cursor: pointer;
    display: flex;
  }
  .switch::after {
    content: '';
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    background: var(--helder-thumb);
    box-shadow: var(--helder-thumb-shadow);
    transition: transform 0.18s ease;
  }
  .switch[aria-checked='true'] {
    background: var(--state);
  }
  .switch[aria-checked='true']::after {
    transform: translateX(1.15rem);
  }
  .switch:disabled {
    cursor: default;
  }
  .switch:disabled::after {
    background: var(--helder-control-bg);
    box-shadow: none;
  }

  /* ---------- dropdown (button with menu; clearly a dropdown: border + chevron) ---------- */
  .dd {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--helder-space-xs);
    height: var(--helder-control-size);
    padding: 0 0.7rem;
    border-radius: var(--helder-radius-control);
    background: var(--helder-control-bg);
    border: 1px solid var(--helder-control-border);
    color: var(--helder-color-text);
    font-size: var(--helder-font-size-s);
  }
  .dd-label {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dd-label.empty {
    color: var(--helder-color-text-muted);
  }
  .dd svg {
    width: 1.1rem;
    height: 1.1rem;
    flex: none;
    color: var(--helder-color-text-muted);
  }
  .dd select {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    font-size: 16px; /* prevents iOS zoom on focus */
  }
  .dd select:disabled {
    cursor: default;
  }
  .dd:focus-within {
    outline: var(--helder-focus-ring) solid var(--helder-color-accent);
    outline-offset: 2px;
  }

  /* ---------- states ---------- */
  /* unavailable / unknown / missing: only colours change, never size or layout */
  .card.na .name,
  .card.na .value,
  .card.na .readout {
    color: var(--helder-color-disabled);
  }
  .card.na .dd {
    color: var(--helder-color-disabled);
    border-color: color-mix(in srgb, var(--helder-color-disabled) 30%, transparent);
  }
  /* busy: value pulses until HA confirms; on failure the card shakes and rolls back */
  .card.pending .value,
  .card.pending .sub,
  .card.pending .icon,
  .card.pending .readout {
    animation: helder-pulse 1s ease-in-out infinite;
  }
  .card.failed {
    animation: helder-shake 0.38s ease-in-out;
  }
  .card.failed .sub {
    color: var(--helder-color-error);
  }
  @keyframes helder-pulse {
    50% {
      opacity: 0.4;
    }
  }
  @keyframes helder-shake {
    20% {
      transform: translateX(-4px);
    }
    40% {
      transform: translateX(4px);
    }
    60% {
      transform: translateX(-3px);
    }
    80% {
      transform: translateX(2px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .card.pending .value,
    .card.pending .sub,
    .card.pending .icon,
    .card.pending .readout {
      animation: none;
      opacity: 0.55;
    }
    .card.failed {
      animation: none;
    }
    .switch::after {
      transition: none;
    }
  }
`, Lt = (e) => e ?? G;
bt`<path fill="currentColor" d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z"/>`;
var Z = (e) => U`
  <div class="head">
    <div class="icon">${e.icon}</div>
    <div class="text">
      <div class="name">${e.name}</div>
      ${e.sub === void 0 ? G : U`<div class="sub">${e.sub}</div>`}
    </div>
    ${e.value === void 0 || e.value === G ? G : U`<div class="value">${e.value}${e.unit ? U`<span class="unit">${e.unit}</span>` : G}</div>`}
  </div>
`, Rt = (e, t, n) => n > t ? (e - t) / (n - t) * 100 : 0;
function zt(e) {
	let t = e.min ?? 0, n = e.max ?? 100, r = e.value ?? t;
	return U`<input
    class="slider"
    type="range"
    min=${t}
    max=${n}
    step=${e.step ?? 1}
    .value=${String(r)}
    style="--p:${Rt(r, t, n)}%"
    aria-label=${e.label}
    ?disabled=${e.disabled}
    @input=${(r) => {
		let i = r.target;
		i.style.setProperty("--p", `${Rt(+i.value, t, n)}%`), e.onInput?.(+i.value);
	}}
    @change=${(t) => e.onChange(+t.target.value)}
    @click=${(e) => e.stopPropagation()}
  />`;
}
var Bt = (e, t, n, r = !1) => U`<button
  class="switch"
  role="switch"
  aria-checked=${String(e)}
  aria-label=${Lt(t)}
  ?disabled=${r}
  @click=${(e) => {
	e.stopPropagation(), n();
}}
></button>`, Vt = [
	["color", "Kleuren"],
	["light", "Licht"],
	["grey", "Grijs"]
];
Pt("helder-color-picker", class extends X {
	constructor(...e) {
		super(...e), this.heading = "", this.value = "", this.mode = "light", this.kind = "accent", this.specials = [], this.fallback = "#ff6d00", this._h = 0, this._s = 1, this._v = 1, this._hex = "", this._drawnV = -1;
	}
	static {
		this.properties = {
			heading: {},
			value: {},
			mode: {},
			kind: {},
			specials: { attribute: !1 },
			fallback: {},
			_h: { state: !0 },
			_s: { state: !0 },
			_v: { state: !0 },
			_hex: { state: !0 }
		};
	}
	willUpdate(e) {
		if (e.has("value")) {
			let e = u(this.value) ? this.value : g.some((e) => e.id === this.value) ? _(this.value, "light") : this.fallback;
			[this._h, this._s, this._v] = m(e), this._hex = p(this._h, this._s, this._v);
		}
	}
	firstUpdated() {
		this.shadowRoot?.querySelector("button")?.focus();
	}
	updated() {
		this._drawnV !== this._v && this.drawWheel();
	}
	get current() {
		return p(this._h, this._s, this._v);
	}
	drawWheel() {
		let e = this.shadowRoot?.querySelector("canvas"), t = e?.getContext("2d");
		if (!e || !t) return;
		this._drawnV = this._v;
		let n = e.width, r = n / 2, i = t.createImageData(n, n);
		for (let e = 0; e < n; e++) for (let t = 0; t < n; t++) {
			let a = t - r, o = e - r, s = Math.sqrt(a * a + o * o), c = (e * n + t) * 4;
			if (s > r) continue;
			let [l, u, f] = d(p((Math.atan2(o, a) * 180 / Math.PI + 360) % 360, s / r, this._v));
			i.data[c] = l, i.data[c + 1] = u, i.data[c + 2] = f, i.data[c + 3] = 255;
		}
		t.putImageData(i, 0, 0);
	}
	pickAt(e) {
		let t = e.currentTarget.getBoundingClientRect(), n = e.clientX - t.left - t.width / 2, r = e.clientY - t.top - t.height / 2;
		this._h = (Math.atan2(r, n) * 180 / Math.PI + 360) % 360, this._s = Math.min(1, Math.sqrt(n * n + r * r) / (t.width / 2)), this._hex = this.current;
	}
	emit(e) {
		this.dispatchEvent(new CustomEvent("pick", { detail: { value: e } }));
	}
	close() {
		this.dispatchEvent(new CustomEvent("close"));
	}
	preview(e) {
		let t = this.current, n = this.kind === "accent" ? _(t, e) : t, r = e === "dark" ? se.dark : "#f8f4f0", i = e === "dark" ? "rgba(255,255,255,.12)" : "rgba(90,60,30,.12)";
		return U`<div
      class="pvbox"
      style="background: radial-gradient(circle at 25% 15%, ${n}${this.kind === "accent" ? "33" : "99"} 0, transparent 65%), ${r}"
    >
      <span class="pchip" style="background:${n};color:${ie(n)}">${e === "dark" ? "Donker" : "Licht"}</span>
      <span class="pbar" style="background: linear-gradient(to right, ${n} 0 60%, ${i} 60%)"></span>
    </div>`;
	}
	render() {
		let e = this._h * Math.PI / 180;
		return U`<div class="scrim" @click=${(e) => e.target === e.currentTarget && this.close()}>
      <div
        class="sheet"
        role="dialog"
        aria-modal="true"
        aria-label=${this.heading}
        @keydown=${(e) => e.key === "Escape" && this.close()}
      >
        <h3>${this.heading}</h3>
        ${this.specials.length ? U`<div class="specials">
              ${this.specials.map((e) => U`<button
                  class="special"
                  aria-pressed=${String(this.value === e.value)}
                  @click=${() => this.emit(e.value)}
                >
                  <i class="sw" style="background:${e.swatch}"></i>${e.label}
                </button>`)}
            </div>` : G}
        ${Vt.map(([e, t]) => U`<div class="grp">
            <span class="lbl">${t}</span>
            <div class="swgrid">
              ${g.filter((t) => t.group === e).map((e) => U`<button
                  class="swatch"
                  title=${e.name}
                  aria-label=${e.name}
                  aria-pressed=${String(this.value === e.id)}
                  style="background:${this.mode === "dark" ? e.dark : e.light}"
                  @click=${() => this.emit(e.id)}
                ></button>`)}
            </div>
          </div>`)}
        <div class="grp">
          <span class="lbl">Eigen kleur</span>
          <div class="wheelrow">
            <div
              class="wheel"
              aria-label="Kleurenwiel"
              @pointerdown=${(e) => {
			e.currentTarget.setPointerCapture(e.pointerId), this.pickAt(e);
		}}
              @pointermove=${(e) => {
			e.currentTarget.hasPointerCapture(e.pointerId) && this.pickAt(e);
		}}
            >
              <canvas width="336" height="336"></canvas>
              <span
                class="mark"
                style="left:${50 + Math.cos(e) * this._s * 50}%;top:${50 + Math.sin(e) * this._s * 50}%;background:${this.current}"
              ></span>
            </div>
            <div class="side">
              <label
                >Helderheid
                <input
                  class="rng"
                  type="range"
                  min="10"
                  max="100"
                  .value=${String(Math.round(this._v * 100))}
                  @input=${(e) => {
			this._v = e.target.value / 100, this._hex = this.current;
		}}
              /></label>
              <label
                >Hex
                <input
                  class="hexin"
                  type="text"
                  maxlength="7"
                  spellcheck="false"
                  .value=${this._hex}
                  @input=${(e) => {
			let t = e.target.value.trim();
			u(t) && ([this._h, this._s, this._v] = m(t));
		}}
              /></label>
              <div class="pv">${this.preview("light")}${this.preview("dark")}</div>
            </div>
          </div>
        </div>
        <div class="btns">
          <button class="pill" @click=${this.close}>Sluiten</button>
          <button class="pill primary" @click=${() => this.emit(this.current)}>Eigen kleur toepassen</button>
        </div>
      </div>
    </div>`;
	}
	static {
		this.styles = A`
    :host {
      position: fixed;
      inset: 0;
      z-index: 10;
      font-family: var(--helder-font-family);
    }
    * {
      box-sizing: border-box;
    }
    .scrim {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 16px;
      background: var(--helder-scrim);
    }
    .sheet {
      width: min(30rem, 100%);
      max-height: calc(100vh - 32px);
      overflow: auto;
      display: grid;
      gap: 0.9rem;
      padding: 1rem 1.1rem 1.1rem;
      color: var(--helder-color-text);
      background: var(--helder-popover-bg);
      -webkit-backdrop-filter: blur(24px) saturate(170%);
      backdrop-filter: blur(24px) saturate(170%);
      border: 1px solid var(--helder-glass-border);
      border-radius: var(--helder-radius-card);
      box-shadow: var(--helder-shadow-card);
    }
    h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 600;
    }
    .grp {
      display: grid;
      gap: 0.35rem;
    }
    .lbl {
      font-size: var(--helder-font-size-s);
      color: var(--helder-color-text-muted);
    }
    .specials {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .special,
    .pill {
      font: inherit;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.4rem 0.8rem;
      border-radius: var(--helder-radius-pill);
      border: 1px solid var(--helder-control-border);
      background: transparent;
      color: var(--helder-color-text);
      cursor: pointer;
    }
    .special[aria-pressed='true'],
    .pill.primary {
      background: var(--helder-color-accent);
      border-color: var(--helder-color-accent);
      color: var(--helder-color-on-accent);
    }
    .sw {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      flex: none;
      border: 1px solid var(--helder-control-border);
    }
    .swgrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, 1.9rem);
      gap: 0.45rem;
    }
    .swatch {
      width: 1.9rem;
      height: 1.9rem;
      border-radius: 50%;
      border: 1px solid var(--helder-control-border);
      cursor: pointer;
      padding: 0;
    }
    .swatch[aria-pressed='true'],
    button:focus-visible {
      outline: 2px solid var(--helder-color-text);
      outline-offset: 2px;
    }
    .wheelrow {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-start;
    }
    .wheel {
      width: 10.5rem;
      height: 10.5rem;
      position: relative;
      flex: none;
      touch-action: none;
      cursor: crosshair;
    }
    .wheel canvas {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: block;
    }
    .mark {
      position: absolute;
      width: 1rem;
      height: 1rem;
      margin: -0.5rem 0 0 -0.5rem;
      border-radius: 50%;
      border: 2px solid var(--helder-thumb);
      box-shadow: var(--helder-thumb-shadow);
      pointer-events: none;
    }
    .side {
      display: grid;
      gap: 0.55rem;
      flex: 1 1 11rem;
      min-width: 0;
    }
    .side label {
      display: grid;
      gap: 0.2rem;
      font-size: var(--helder-font-size-s);
      color: var(--helder-color-text-muted);
    }
    .rng {
      width: 100%;
      accent-color: var(--helder-color-accent);
    }
    .hexin {
      font: inherit;
      font-size: 16px;
      padding: 0.35rem 0.5rem;
      border-radius: var(--helder-radius-control);
      border: 1px solid var(--helder-control-border);
      background: var(--helder-control-bg);
      color: var(--helder-color-text);
      width: 100%;
    }
    .pv {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem;
    }
    .pvbox {
      border-radius: var(--helder-radius-control);
      padding: 0.6rem;
      display: grid;
      gap: 0.45rem;
      min-height: 4.6rem;
      align-content: end;
      border: 1px solid var(--helder-control-border);
    }
    .pchip {
      justify-self: start;
      font-size: 0.8rem;
      padding: 0.25rem 0.6rem;
      border-radius: 8px;
    }
    .pbar {
      height: 0.4rem;
      border-radius: 999px;
    }
    .btns {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  `;
	}
});
// src/settings/panel.ts
var Ht = [
	{
		key: "accent",
		label: "Accentkleur",
		kind: "accent",
		mode: "light"
	},
	{
		key: "gradientLight",
		label: "Verlopen, licht",
		kind: "gradient",
		mode: "light"
	},
	{
		key: "baseLight",
		label: "Basiskleur, licht",
		kind: "base",
		mode: "light"
	},
	{
		key: "gradientDark",
		label: "Verlopen, donker",
		kind: "gradient",
		mode: "dark"
	},
	{
		key: "baseDark",
		label: "Basiskleur, donker",
		kind: "base",
		mode: "dark"
	}
], Ut = "linear-gradient(135deg, #ffb078, #f8efe5)", Wt = {
	accent: [],
	gradient: [{
		value: "accent",
		label: "Zelfde als accent",
		swatch: "conic-gradient(#ff6d00, #2563eb, #16a34a, #ff6d00)"
	}, {
		value: "warm",
		label: "Warm (oorspronkelijk)",
		swatch: Ut
	}],
	base: [{
		value: "follow",
		label: "Volgt de verlopen",
		swatch: "linear-gradient(135deg, #ddd, #fff)"
	}, {
		value: "warm",
		label: "Warm (oorspronkelijk)",
		swatch: Ut
	}]
}, Gt = [
	{
		value: "border",
		label: "Alleen rand"
	},
	{
		value: "shadow",
		label: "Alleen schaduw"
	},
	{
		value: "both",
		label: "Rand + schaduw"
	}
], Kt = [{
	value: "domain",
	label: "Statuskleur per domein"
}, {
	value: "accent",
	label: "Eén accentkleur"
}], qt = (e, t) => JSON.stringify(e) === JSON.stringify(t), Jt = class extends X {
	constructor(...e) {
		super(...e), this.narrow = !1, this._saved = D(), this._draft = D(), this._busy = !1;
	}
	static {
		this.properties = {
			hass: { attribute: !1 },
			narrow: { type: Boolean },
			panel: { attribute: !1 },
			_draft: { state: !0 },
			_saved: { state: !0 },
			_picker: { state: !0 },
			_busy: { state: !0 },
			_message: { state: !0 }
		};
	}
	connectedCallback() {
		super.connectedCallback(), this._unsub = ke((e) => {
			let t = !qt(this._draft, this._saved);
			this._saved = e, t || (this._draft = e);
		});
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._unsub?.();
	}
	willUpdate(e) {
		e.has("hass") && c(this.hass);
	}
	set(e) {
		this._draft = {
			...this._draft,
			...e
		}, this._message = void 0;
	}
	async save() {
		this._busy = !0;
		try {
			await je(this._draft), this._saved = D(), this._draft = this._saved, this._message = {
				kind: "ok",
				text: "Opgeslagen. Geldt nu voor alle gebruikers en apparaten."
			};
		} catch (e) {
			let t = e instanceof Error ? e.message : e?.message;
			this._message = {
				kind: "error",
				text: `Opslaan mislukt${t ? `: ${t}` : ""}`
			};
		} finally {
			this._busy = !1;
		}
	}
	describe(e, t) {
		let n = Wt[e.kind].find((e) => e.value === t);
		return n ? {
			name: n.label,
			swatch: n.swatch
		} : u(t) ? {
			name: `Eigen kleur ${t.toLowerCase()}`,
			swatch: t
		} : {
			name: oe(t)?.name ?? t,
			swatch: _(t, e.mode)
		};
	}
	seg(e, t, n) {
		return U`<div class="seg">
      ${e.map((e) => U`<button aria-pressed=${String(e.value === t)} @click=${() => n(e.value)}>${e.label}</button>`)}
    </div>`;
	}
	range(e, t, [n, r], i, a, o) {
		return U`<label class="range">
      <span>${e}</span>
      <input
        type="range"
        min=${n}
        max=${r}
        step=${i}
        .value=${String(t)}
        @input=${(e) => o(+e.target.value)}
      />
      <output>${a === "" ? t.toFixed(2) : `${t} ${a}`}</output>
    </label>`;
	}
	renderColors() {
		return U`<div class="slots">
      ${Ht.map((e) => {
			let t = this.describe(e, this._draft[e.key]);
			return U`<div class="slot">
          <span>${e.label}</span>
          <button class="swbtn" @click=${() => this._picker = e.key}>
            <i class="sw" style="background:${t.swatch}"></i>
            <span class="swname">${t.name}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z" /></svg>
          </button>
        </div>`;
		})}
    </div>`;
	}
	renderPicker() {
		let e = Ht.find((e) => e.key === this._picker);
		return e ? U`<helder-color-picker
      .heading=${e.label}
      .value=${this._draft[e.key]}
      .mode=${e.mode}
      .kind=${e.kind}
      .specials=${Wt[e.kind]}
      .fallback=${_(this._draft.accent, "light")}
      @pick=${(t) => {
			this.set({ [e.key]: t.detail.value }), this._picker = void 0;
		}}
      @close=${() => this._picker = void 0}
    ></helder-color-picker>` : G;
	}
	glassPreset() {
		return Object.entries(ve).find(([, e]) => e.blur === this._draft.blur && e.fill === this._draft.fill)?.[0];
	}
	renderPreviewStage(e) {
		let t = me(this._draft, e);
		return U`<div class="stage" style=${Le(t, "helder-", !1) + `background: ${t.background};`}>
      <div class="stage-title">${e === "dark" ? "Donker" : "Licht"}</div>
      <div class="cards">
        <div class="card active lit" style="--state: var(--helder-state-light); --lamp: ${e === "dark" ? "#ffb15e" : "#ff9a3c"}; --bri-f: .7">
          ${Z({
			icon: Xt,
			name: "Vloerlamp",
			sub: "Aan · 70 %",
			value: G
		})}
          ${zt({
			value: 70,
			label: "Helderheid",
			onChange: () => void 0
		})}
        </div>
        <div class="card active heating" style="--state: var(--helder-state-heat)">
          ${Z({
			icon: Zt,
			name: "Woonkamer",
			sub: "Verwarmen",
			value: "20,5",
			unit: "°C"
		})}
          <div class="chips">
            <button class="chip">Eco</button><button class="chip" aria-pressed="true">Comfort</button>
          </div>
        </div>
        <div class="card active" style="--state: var(--helder-state-cover)">
          ${Z({
			icon: Qt,
			name: "Rolluik voor",
			sub: "Open",
			value: "60",
			unit: "%"
		})}
          ${zt({
			value: 60,
			label: "Positie",
			onChange: () => void 0
		})}
        </div>
        <div class="card na">
          ${Z({
			icon: Xt,
			name: "Voordeur",
			sub: "Niet beschikbaar",
			value: U`${Bt(!1, "Aan/uit", () => void 0, !0)}`
		})}
        </div>
      </div>
    </div>`;
	}
	render() {
		let e = this._draft, t = !qt(e, this._saved), n = qt(e, { ..._e }), r = Oe();
		return U`
      <div class="toolbar">
        ${this.narrow ? U`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : G}
        <h1>Helder</h1>
      </div>
      <div class="layout">
        <div class="form">
          ${r === "unsupported" ? U`<p class="note error">
                Deze Home Assistant-versie kan de instellingen niet centraal opslaan. Helder gebruikt de standaardwaarden.
              </p>` : G}
          ${this.hass?.user && !this.hass.user.is_admin ? U`<p class="note">Alleen beheerders kunnen deze instellingen wijzigen.</p>` : G}

          <section>
            <h2>Kleuren</h2>
            <p class="hint">Accent en achtergrond kies je los van elkaar. De achtergrond stel je apart in voor licht en donker.</p>
            ${this.renderColors()}
          </section>

          <section>
            <h2>Kleurgebruik</h2>
            <p class="hint">Standaard voor alle kaarten; per kaart aan te passen in de kaarteditor.</p>
            ${this.seg(Kt, e.colorMode, (e) => this.set({ colorMode: e }))}
          </section>

          <section>
            <h2>Glas</h2>
            ${this.seg([
			{
				value: "subtle",
				label: "Subtiel"
			},
			{
				value: "medium",
				label: "Middel"
			},
			{
				value: "strong",
				label: "Sterk"
			}
		], this.glassPreset(), (e) => this.set({ ...ve[e] }))}
            ${this.range("Blur", e.blur, y.blur, 1, "px", (e) => this.set({ blur: e }))}
            ${this.range("Vulling", e.fill, y.fill, 1, "%", (e) => this.set({ fill: e }))}
            <label class="switchrow">
              <span>Verminderde transparantie voor iedereen<small>De systeeminstelling van een apparaat geldt altijd.</small></span>
              ${Bt(e.reducedTransparency, "Verminderde transparantie", () => this.set({ reducedTransparency: !e.reducedTransparency }))}
            </label>
          </section>

          <section>
            <h2>Glans</h2>
            ${this.seg([
			{
				value: ye.none,
				label: "Geen"
			},
			{
				value: ye.soft,
				label: "Zacht"
			},
			{
				value: ye.strong,
				label: "Sterk"
			}
		], e.gloss, (e) => this.set({ gloss: e }))}
            ${this.range("Glans", e.gloss, y.gloss, .05, "", (e) => this.set({ gloss: e }))}
          </section>

          <section>
            <h2>Vorm en diepte</h2>
            ${this.seg(be.map((e) => ({
			value: e,
			label: `${e} px`
		})), e.radius, (e) => this.set({ radius: e }))}
            ${this.seg(Gt, e.depth, (e) => this.set({ depth: e }))}
          </section>
        </div>

        <aside class="preview" aria-label="Voorbeeld">
          ${this.renderPreviewStage("light")} ${this.renderPreviewStage("dark")}
        </aside>
      </div>

      <div class="actions">
        ${this._message ? U`<span class="msg ${this._message.kind}">${this._message.text}</span>` : U`<span class="msg">${t ? "Niet opgeslagen wijzigingen" : ""}</span>`}
        <button class="pill" ?disabled=${n || this._busy} @click=${() => this.set({ ..._e })}>
          Standaardwaarden
        </button>
        <button class="pill" ?disabled=${!t || this._busy} @click=${() => this.set(this._saved)}>Annuleren</button>
        <button class="pill primary" ?disabled=${!t || this._busy} @click=${this.save}>
          ${this._busy ? "Opslaan…" : "Opslaan"}
        </button>
      </div>
      ${this.renderPicker()}
    `;
	}
	static {
		this.styles = [It, A`
      :host {
        display: block;
        min-height: 100vh;
        color: var(--helder-color-text);
        background: var(--helder-background);
        background-attachment: fixed;
        font-family: var(--helder-font-family);
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        height: var(--header-height, 56px);
        padding: 0 16px;
        padding-top: env(safe-area-inset-top);
      }
      h1 {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 400;
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 26rem);
        gap: 1.25rem;
        padding: 0 16px 8rem;
        max-width: 80rem;
        align-items: start;
      }
      @media (max-width: 860px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .form {
        display: grid;
        gap: 1rem;
      }
      section {
        display: grid;
        gap: 0.7rem;
        padding: 1rem 1.1rem 1.1rem;
        border-radius: var(--helder-radius-card);
        background: var(--helder-gloss-layer), linear-gradient(var(--helder-glass-fill), var(--helder-glass-fill));
        -webkit-backdrop-filter: var(--helder-glass-filter);
        backdrop-filter: var(--helder-glass-filter);
        border: 1px solid var(--helder-card-border);
        box-shadow: var(--helder-card-shadow);
      }
      h2 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
      }
      .hint,
      .note {
        margin: 0;
        font-size: var(--helder-font-size-s);
        color: var(--helder-color-text-muted);
      }
      .note {
        padding: 0.7rem 0.9rem;
        border-radius: var(--helder-radius-control);
        background: var(--helder-control-bg);
        color: var(--helder-color-text);
      }
      .note.error {
        color: var(--helder-color-error);
      }
      .seg {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }
      .seg button,
      .pill {
        font: inherit;
        font-size: 0.9rem;
        padding: 0.4rem 0.85rem;
        border-radius: var(--helder-radius-pill);
        border: 1px solid var(--helder-control-border);
        background: transparent;
        color: var(--helder-color-text);
        cursor: pointer;
      }
      .seg button[aria-pressed='true'],
      .pill.primary {
        background: var(--helder-color-accent);
        border-color: var(--helder-color-accent);
        color: var(--helder-color-on-accent);
      }
      .pill:disabled {
        opacity: 0.45;
        cursor: default;
      }
      button:focus-visible {
        outline: var(--helder-focus-ring) solid var(--helder-color-accent);
        outline-offset: 2px;
      }
      .range {
        display: grid;
        grid-template-columns: 5.5rem 1fr 3.5rem;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.9rem;
      }
      .range input {
        width: 100%;
        accent-color: var(--helder-color-accent);
      }
      .range output {
        text-align: right;
        font-variant-numeric: tabular-nums;
        color: var(--helder-color-text-muted);
      }
      .switchrow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        font-size: 0.9rem;
      }
      .switchrow small {
        display: block;
        color: var(--helder-color-text-muted);
        font-size: var(--helder-font-size-s);
      }
      .switchrow .switch {
        --state: var(--helder-color-accent);
        flex: none;
      }
      .slots {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
        gap: 0.6rem 1rem;
      }
      .slot {
        display: grid;
        gap: 0.25rem;
        min-width: 0;
      }
      .slot > span {
        font-size: var(--helder-font-size-s);
        color: var(--helder-color-text-muted);
      }
      .swbtn {
        font: inherit;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.55rem;
        min-width: 0;
        padding: 0.45rem 0.6rem;
        border-radius: var(--helder-radius-control);
        border: 1px solid var(--helder-control-border);
        background: var(--helder-control-bg);
        color: var(--helder-color-text);
        cursor: pointer;
        text-align: left;
      }
      .swbtn .sw {
        width: 1.4rem;
        height: 1.4rem;
        flex: none;
        border-radius: 50%;
        border: 1px solid var(--helder-control-border);
      }
      .swbtn .swname {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .swbtn svg {
        width: 1rem;
        height: 1rem;
        flex: none;
        color: var(--helder-color-text-muted);
      }
      .preview {
        position: sticky;
        top: 1rem;
        display: grid;
        gap: 0.8rem;
      }
      .stage {
        border-radius: var(--helder-radius-card);
        padding: 0.9rem;
        display: grid;
        gap: 0.6rem;
        color: var(--helder-color-text);
        border: 1px solid var(--helder-control-border);
      }
      .stage-title {
        font-size: var(--helder-font-size-s);
        color: var(--helder-color-text-muted);
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.7rem;
      }
      .actions {
        position: fixed;
        right: 0;
        bottom: 0;
        left: var(--mdc-drawer-width, 0px);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.7rem 16px calc(0.7rem + env(safe-area-inset-bottom));
        background: var(--helder-popover-bg);
        -webkit-backdrop-filter: blur(20px) saturate(170%);
        backdrop-filter: blur(20px) saturate(170%);
        border-top: 1px solid var(--helder-card-border);
      }
      .msg {
        margin-right: auto;
        font-size: var(--helder-font-size-s);
        color: var(--helder-color-text-muted);
      }
      @media (max-width: 600px) {
        .msg {
          flex-basis: 100%;
        }
      }
      .msg.error {
        color: var(--helder-color-error);
      }
    `];
	}
}, Yt = (e) => U`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d=${e} /></svg>`, Xt = Yt("M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9z"), Zt = Yt("M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-9a1 1 0 0 1 1 1v3h-2V5a1 1 0 0 1 1-1"), Qt = Yt("M3 4h18v2h-1v10h-2V6H6v10H4V6H3zm4 3h10v2H7zm0 3h10v2H7zm0 3h10v2H7zm4 4h2v3h-2z");
Pt("helder-settings-panel", Jt);
// src/cards/swipe/swipe-card.ts
var $t = 190, en = 90, tn = "cubic-bezier(.2, .7, .3, 1)", nn = "cubic-bezier(.5, 0, .75, .4)", rn = .5, an = 30, on = .35, sn = 10, cn = 8, ln = "input, select, textarea, button, a[href], [role=\"slider\"], [role=\"switch\"], ha-slider, ha-control-slider, ha-select, mwc-list-item, md-select", Q = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, un = class extends X {
	constructor(...e) {
		super(...e), this._index = 0, this._cards = [], this._build = 0, this._angle = 0, this._busy = !1, this._swallowClick = !1;
	}
	static {
		this.properties = {
			_config: { state: !0 },
			_index: { state: !0 },
			_cards: { state: !0 }
		};
	}
	static {
		this.styles = A`
    :host {
      display: block;
      font-family: var(--helder-font-family);
    }
    .swipe {
      display: grid;
      gap: var(--helder-space-s);
      min-width: 0;
    }
    .stage {
      display: grid;
      min-width: 0;
      /* depth for the flip; the flipper itself stays flat (no preserve-3d), see the note at the top */
      perspective: calc(var(--helder-space) * 50);
      /* vertical page scroll stays with the browser; horizontal drags are ours */
      touch-action: pan-y;
      -webkit-user-select: none;
      user-select: none;
    }
    .flipper {
      display: grid;
      min-width: 0;
      transform-origin: 50% 50%;
    }
    .flipper.moving {
      will-change: transform;
    }
    .slide {
      grid-area: 1 / 1;
      min-width: 0;
      display: grid;
    }
    .slide[aria-hidden='true'] {
      visibility: hidden;
    }
    .slide > * {
      min-width: 0;
      height: 100%;
    }
    .dots {
      display: flex;
      justify-content: center;
      gap: var(--helder-space-xs);
    }
    .dot {
      width: calc(var(--helder-space) / 2);
      height: calc(var(--helder-space) / 2);
      padding: 0;
      border: 0;
      border-radius: var(--helder-radius-pill);
      cursor: pointer;
      background: var(--helder-color-text-muted);
      opacity: 0.4;
      transition:
        width var(--helder-transition),
        opacity var(--helder-transition),
        background var(--helder-transition);
    }
    .dot[aria-current='true'] {
      width: calc(var(--helder-space) * 1.4);
      opacity: 1;
      background: var(--helder-color-accent);
    }
    .dot:focus-visible {
      outline: var(--helder-focus-ring) solid var(--helder-color-accent);
      outline-offset: var(--helder-focus-ring);
    }
    .error {
      padding: var(--helder-space);
      color: var(--helder-color-text-muted);
    }
    @media (prefers-reduced-motion: reduce) {
      .dot {
        transition: none;
      }
    }
  `;
	}
	set hass(e) {
		this._hass = e;
		for (let t of this._cards) t.hass = e;
	}
	get hass() {
		return this._hass;
	}
	setConfig(e) {
		if (!e || !Array.isArray(e.cards) || e.cards.length === 0) throw Error("Voeg minstens één kaart toe (cards)");
		for (let t of e.cards) if (!t || typeof t != "object" || typeof t.type != "string") throw Error("Elke kaart heeft een type nodig");
		this._config = {
			...e,
			cards: e.cards.map((e) => ({ ...e }))
		}, this._index = Math.min(this._index, e.cards.length - 1), this.buildCards();
	}
	async getCardSize() {
		let e = await Promise.all(this._cards.map(async (e) => await e.getCardSize?.() ?? 1));
		return Math.max(1, ...e) + 1;
	}
	getGridOptions() {
		let e = this._cards[0]?.getGridOptions?.();
		return {
			columns: e?.columns ?? 6,
			min_columns: e?.min_columns ?? 3,
			rows: "auto"
		};
	}
	static async getConfigElement() {
		return (await window.loadCardHelpers?.())?.createCardElement({
			type: "vertical-stack",
			cards: []
		}), await customElements.whenDefined("hui-vertical-stack-card"), customElements.get("hui-vertical-stack-card").getConfigElement();
	}
	static getStubConfig(e) {
		let t = Object.keys(e?.states ?? {}), n = t.filter((e) => e.startsWith("cover.")).slice(0, 3), r = n.length >= 2 ? n : t.filter((e) => e.startsWith("light.")).slice(0, 3);
		return {
			type: "custom:helder-swipe-card",
			cards: (r.length ? r : ["sun.sun"]).map((e) => ({
				type: "tile",
				entity: e
			}))
		};
	}
	async buildCards() {
		let e = ++this._build, t = this._config.cards, n = window.loadCardHelpers ? await window.loadCardHelpers().catch(() => void 0) : void 0;
		e === this._build && (this._cards = t.map((e) => this.createCard(e, n)));
	}
	createCard(e, t) {
		let n;
		if (t) n = t.createCardElement(e);
		else try {
			n = document.createElement(e.type.replace(/^custom:/, "")), n.setConfig?.(e);
		} catch (e) {
			n = document.createElement("div"), n.className = "error", n.textContent = String(e?.message ?? e);
		}
		return n.hass = this._hass, n.addEventListener("ll-rebuild", (t) => {
			t.stopPropagation();
			let r = this._cards.indexOf(n);
			r < 0 || (window.loadCardHelpers?.() ?? Promise.resolve(void 0)).then((t) => {
				let n = [...this._cards];
				n[r] = this.createCard(e, t), this._cards = n;
			});
		}), n;
	}
	get count() {
		return this._cards.length;
	}
	async flipTo(e, t, n = this._angle, r = 0) {
		if (e === this._index || e < 0 || e >= this.count || this._busy) return;
		this._busy = !0;
		let i = this.flipper;
		try {
			if (Q() || !i) i && await this.runAnim(i, [{ opacity: 1 }, { opacity: 0 }], en, "ease-out"), this._index = e, await this.updateComplete, i && await this.runAnim(i, [{ opacity: 0 }, { opacity: 1 }], en, "ease-in");
			else {
				let a = 90 * t, o = Math.abs(a - n) / 90, s = Math.min(1, .35 / Math.max(Math.abs(r), .35));
				await this.runAnim(i, [$(n), $(a)], $t * o * s + 40, nn), this._index = e, await this.updateComplete, await this.runAnim(i, [$(-a), $(0)], $t * 1.3, tn);
			}
		} finally {
			this._angle = 0, this._busy = !1, this.setAngle(0);
		}
	}
	async springBack(e) {
		let t = this.flipper;
		if (!t || e === 0) return this.setAngle(0);
		this._busy = !0, await this.runAnim(t, [$(e), $(0)], 120 + Math.abs(e) * 3, tn), this._angle = 0, this._busy = !1, this.setAngle(0);
	}
	runAnim(e, t, n, r) {
		this._anim?.cancel(), e.classList.add("moving");
		let i = e.animate(t, {
			duration: n,
			easing: r,
			fill: "forwards"
		});
		return this._anim = i, i.finished.catch(() => void 0).then(() => {
			let n = t[t.length - 1];
			Object.assign(e.style, n), i.cancel(), e.classList.remove("moving");
		});
	}
	setAngle(e) {
		this._angle = e;
		let t = this.flipper;
		t && (Object.assign(t.style, $(e)), e === 0 && (t.style.transform = "", t.style.opacity = "", t.classList.remove("moving")));
	}
	get flipper() {
		return this.renderRoot.querySelector(".flipper");
	}
	go(e) {
		e !== this._index && this.flipTo(e, e > this._index ? -1 : 1, 0);
	}
	onPointerDown(e) {
		if (this._busy || this.count < 2 || e.pointerType === "mouse" && e.button !== 0 || e.composedPath().some((e) => e instanceof Element && e.matches(ln))) return;
		let t = e.currentTarget.getBoundingClientRect().width || 1;
		this._drag = {
			id: e.pointerId,
			x0: e.clientX,
			y0: e.clientY,
			t0: e.timeStamp,
			lastX: e.clientX,
			lastT: e.timeStamp,
			v: 0,
			width: t,
			swiping: !1
		};
	}
	onPointerMove(e) {
		let t = this._drag;
		if (!t || e.pointerId !== t.id) return;
		let n = e.clientX - t.x0, r = e.clientY - t.y0;
		if (!t.swiping) {
			if (Math.abs(r) > cn && Math.abs(r) > Math.abs(n)) return void (this._drag = void 0);
			if (Math.abs(n) < cn) return;
			t.swiping = !0, e.currentTarget.setPointerCapture(e.pointerId), this.flipper?.classList.add("moving");
		}
		e.preventDefault();
		let i = e.timeStamp - t.lastT;
		i > 0 && (t.v = .7 * ((e.clientX - t.lastX) / i) + .3 * t.v), t.lastX = e.clientX, t.lastT = e.timeStamp, this.setAngle(this.dragAngle(n, t.width));
	}
	dragAngle(e, t) {
		let n = e / (t * rn) * 90;
		return !(e < 0 ? this._index < this.count - 1 : this._index > 0) || Q() ? Q() ? 0 : Math.sign(n) * sn * (1 - Math.exp(-Math.abs(n) / 40)) : Math.max(-89, Math.min(89, n));
	}
	onPointerUp(e) {
		let t = this._drag;
		if (!t || e.pointerId !== t.id || (this._drag = void 0, !t.swiping)) return;
		this._swallowClick = !0, setTimeout(() => this._swallowClick = !1, 0);
		let n = e.clientX - t.x0, r = n < 0 ? -1 : 1, i = this._index - r, a = Math.abs(t.v) > on && Math.sign(t.v) === Math.sign(n), o = Q() ? Math.abs(n) > t.width * .25 : Math.abs(this._angle) > an;
		i >= 0 && i < this.count && (a || o) ? this.flipTo(i, r, this._angle, t.v) : this.springBack(this._angle);
	}
	onPointerCancel(e) {
		let t = this._drag;
		t && e.pointerId === t.id && (this._drag = void 0, t.swiping && this.springBack(this._angle));
	}
	onClickCapture(e) {
		this._swallowClick && (e.stopPropagation(), e.preventDefault());
	}
	onDotsKey(e) {
		let t = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
		if (!t) return;
		e.preventDefault();
		let n = this._index + t;
		n < 0 || n >= this.count || (this.go(n), this.updateComplete.then(() => this.renderRoot.querySelector(`.dot[data-i="${n}"]`)?.focus()));
	}
	updated(e) {
		e.has("_cards") && this.dispatchEvent(new Event("card-size-changed", {
			bubbles: !0,
			composed: !0
		}));
	}
	render() {
		if (!this._config) return G;
		let e = this.count;
		return U`<div class="swipe" role="region" aria-roledescription="carrousel">
      <div
        class="stage"
        @pointerdown=${this.onPointerDown}
        @pointermove=${this.onPointerMove}
        @pointerup=${this.onPointerUp}
        @pointercancel=${this.onPointerCancel}
        @click=${{
			handleEvent: (e) => this.onClickCapture(e),
			capture: !0
		}}
      >
        <div class="flipper">
          ${this._cards.map((t, n) => U`<div
                class="slide"
                role="group"
                aria-roledescription="kaart"
                aria-label=${`${n + 1} van ${e}`}
                aria-hidden=${n === this._index ? "false" : "true"}
                ?inert=${n !== this._index}
              >
                ${t}
              </div>`)}
        </div>
      </div>
      ${e > 1 ? U`<div class="dots" role="tablist" @keydown=${this.onDotsKey}>
            ${this._cards.map((t, n) => U`<button
                  class="dot"
                  role="tab"
                  data-i=${n}
                  aria-label=${`Kaart ${n + 1} van ${e}`}
                  aria-current=${n === this._index ? "true" : "false"}
                  aria-selected=${n === this._index ? "true" : "false"}
                  tabindex=${n === this._index ? "0" : "-1"}
                  @click=${() => this.go(n)}
                ></button>`)}
          </div>` : G}
    </div>`;
	}
};
function $(e) {
	let t = Math.min(1, Math.abs(e) / 90);
	return { transform: `rotateY(${e}deg) scale(${1 - .06000000000000005 * Math.sin(t * Math.PI / 2)})` };
}
Ft({
	type: "helder-swipe-card",
	name: "Helder swipe",
	description: "Meerdere kaarten op één plek; veeg om de kaart om te draaien naar de volgende of vorige."
}, un), e(), Ve(), console.info("%c HELDER %c 0.1.0 ", "background:#ff6d00;color:#fff;border-radius:3px 0 0 3px", "background:#2a221c;color:#fff;border-radius:0 3px 3px 0");
