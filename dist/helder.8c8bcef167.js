// src/core/font.ts
var e = [
	300,
	400,
	500,
	600,
	700
];
function t() {
	if (document.getElementById("helder-font")) return;
	let t = import.meta.url.replace(/[^/]*$/, ""), n = document.createElement("style");
	n.id = "helder-font", n.textContent = e.map((e) => `@font-face {
  font-family: "Helder Hind";
  src: url("${t}fonts/hind-latin-${e}-normal.woff2") format("woff2");
  font-weight: ${e};
  font-style: normal;
  font-display: swap;
}`).join("\n"), document.head.append(n);
}
// src/core/hass.ts
var n, r = /* @__PURE__ */ new Set(), i = !1;
function a() {
	return document.querySelector("home-assistant");
}
function o() {
	let e = a()?.hass;
	e && e !== n && (n = e, r.forEach((t) => t(e)));
}
function s(e) {
	return r.add(e), n && e(n), u(), () => r.delete(e);
}
var c = () => n ?? a()?.hass;
function l(e) {
	e && e !== n && (n = e, r.forEach((t) => t(e)));
}
function u() {
	if (i) return;
	i = !0;
	let e = 0, t = () => {
		e ||= requestAnimationFrame(() => {
			e = 0, o();
		});
	}, r = setInterval(() => {
		o(), n && clearInterval(r);
	}, 150);
	new MutationObserver(t).observe(document.documentElement, {
		attributes: !0,
		attributeFilter: ["style", "class"]
	}), setInterval(t, 2e3);
}
// src/tokens/color.ts
var d = (e) => typeof e == "string" && /^#[0-9a-f]{6}$/i.test(e), f = (e) => [
	1,
	3,
	5
].map((t) => parseInt(e.slice(t, t + 2), 16)), ee = (e) => "#" + e.map((e) => Math.round(Math.max(0, Math.min(255, e))).toString(16).padStart(2, "0")).join("");
function p(e) {
	let [t, n, r] = f(e).map((e) => e / 255).map((e) => e <= .03928 ? e / 12.92 : ((e + .055) / 1.055) ** 2.4);
	return .2126 * t + .7152 * n + .0722 * r;
}
function m(e, t, n) {
	let r = f(e), i = f(t);
	return ee(r.map((e, t) => e * n + i[t] * (1 - n)));
}
function te(e, t) {
	let [n, r, i] = f(e);
	return `rgba(${n}, ${r}, ${i}, ${ie(t)})`;
}
var ne = (e) => f(e).join(", "), re = (e) => p(e) > .4 ? "#1c1814" : "#ffffff";
function h(e, t, n) {
	let r = (r) => {
		let i = (r + e / 60) % 6;
		return n - n * t * Math.max(0, Math.min(i, 4 - i, 1));
	};
	return ee([
		r(5),
		r(3),
		r(1)
	].map((e) => e * 255));
}
function g(e) {
	let [t, n, r] = f(e).map((e) => e / 255), i = Math.max(t, n, r), a = i - Math.min(t, n, r), o = 0;
	return a && (o = i === t ? (n - r) / a % 6 : i === n ? (r - t) / a + 2 : (t - n) / a + 4), [
		(o * 60 + 360) % 360,
		i ? a / i : 0,
		i
	];
}
var ie = (e, t = 3) => {
	let n = 10 ** t;
	return Math.round(e * n) / n;
}, _ = (e, t, n, r, i) => ({
	id: e,
	name: t,
	light: n,
	dark: r,
	group: i
}), v = [
	_("orange", "Oranje", "#ff6d00", "#ff7a1a", "color"),
	_("blue", "Blauw", "#2563eb", "#5b8cff", "color"),
	_("teal", "Groenblauw", "#0d8a8a", "#2cc4c0", "color"),
	_("indigo", "Indigo", "#4f46e5", "#8f88ff", "color"),
	_("red", "Rood", "#dc2626", "#f87171", "color"),
	_("coral", "Koraal", "#e8474f", "#ff7a7f", "color"),
	_("raspberry", "Framboos", "#db2777", "#f472b6", "color"),
	_("pink", "Roze", "#d6517f", "#f59ab8", "color"),
	_("purple", "Paars", "#9333ea", "#c084fc", "color"),
	_("violet", "Violet", "#7c3aed", "#a78bfa", "color"),
	_("sky", "Hemelsblauw", "#0284c7", "#38bdf8", "color"),
	_("cyan", "Cyaan", "#0891b2", "#22d3ee", "color"),
	_("petrol", "Petrol", "#0f6e7a", "#3fb0bd", "color"),
	_("emerald", "Smaragd", "#059669", "#34d399", "color"),
	_("green", "Groen", "#16a34a", "#4ade80", "color"),
	_("lime", "Limoen", "#65a30d", "#a3e635", "color"),
	_("olive", "Olijf", "#6b7f1a", "#a3b84a", "color"),
	_("mustard", "Mosterd", "#b98a05", "#facc15", "color"),
	_("amber", "Amber", "#d97706", "#fbbf24", "color"),
	_("terracotta", "Terracotta", "#c2410c", "#f0835a", "color"),
	_("cognac", "Cognac", "#9a5b2e", "#d0905a", "color"),
	_("peach", "Perzik", "#ffb58a", "#ffc3a0", "light"),
	_("apricot", "Abrikoos", "#ffc976", "#ffd591", "light"),
	_("salmon", "Zalm", "#ff9e8f", "#ffb0a3", "light"),
	_("blush", "Poederroze", "#f7b2c4", "#f9c3d1", "light"),
	_("lavender", "Lavendel", "#b9a8f0", "#c7b9f5", "light"),
	_("lilac", "Lila", "#d3a6e8", "#dcb7ee", "light"),
	_("babyblue", "Babyblauw", "#9cc7f5", "#b0d3f7", "light"),
	_("iceblue", "IJsblauw", "#a6e1ef", "#b8e8f3", "light"),
	_("mint", "Mint", "#9fe0c0", "#b2e7cd", "light"),
	_("sage", "Salie", "#b5c9a1", "#c4d4b3", "light"),
	_("lemon", "Citroen", "#f3e27a", "#f6e992", "light"),
	_("sand", "Zand", "#e3cfaa", "#e9d9bb", "light"),
	_("graphite", "Grafiet", "#3f3f46", "#d4d4d8", "grey"),
	_("anthracite", "Antraciet", "#27272a", "#e4e4e7", "grey"),
	_("slate", "Leisteen", "#475569", "#a8b6c9", "grey"),
	_("warmgrey", "Warm grijs", "#78716c", "#c4bcb4", "grey"),
	_("silver", "Zilver", "#7d838c", "#c9ced6", "grey")
], ae = (e) => v.find((t) => t.id === e), oe = {
	light: "#f8efe5",
	dark: "#16110d"
}, se = {
	light: "#f8f4f0",
	dark: "#141210"
}, ce = {
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
}, le = {
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
}, ue = [
	"12% 18%, 34%",
	"88% 12%, 30%",
	"72% 82%, 36%",
	"30% 92%, 30%",
	"50% 45%, 26%"
], de = {
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
}, fe = {
	"font-family": "\"Helder Hind\", \"Hind\", system-ui, -apple-system, \"Segoe UI\", sans-serif",
	"font-weight": "400",
	"font-weight-readout": "300",
	"font-size-xs": "var(--ha-font-size-xs, 0.714rem)",
	"font-size-s": "var(--ha-font-size-s, 0.857rem)",
	"font-size-m": "var(--ha-font-size-m, 1rem)",
	"font-size-l": "var(--ha-font-size-l, 1.143rem)",
	"font-size-xl": "var(--ha-font-size-xl, 1.429rem)",
	"font-size-2xl": "var(--ha-font-size-2xl, 1.714rem)",
	"font-size-3xl": "var(--ha-font-size-3xl, 2rem)",
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
function y(e, t) {
	if (d(e)) {
		let n = e.toLowerCase();
		return t === "dark" && p(n) < .18 ? m("#ffffff", n, .22) : n;
	}
	let n = ae(e) ?? v[0];
	return t === "dark" ? n.dark : n.light;
}
var b = (e) => `${Math.round(e * 10) / 10}px`;
function pe(e, t) {
	let n = {
		...fe,
		...de[t]
	}, r = t === "dark", i = y(e.accent, t);
	n["color-accent"] = i, n["color-accent-rgb"] = ne(i), n["color-on-accent"] = re(i);
	let a = r ? e.gradientDark : e.gradientLight, o = r ? e.baseDark : e.baseLight, s = a === "warm", c = a === "accent" ? i : s ? oe[t] : y(a, t), l = s ? ce[t] : le[t].map((e) => te(c, e));
	l.forEach((e, t) => n[`bg-blob-${t + 1}`] = e);
	let u;
	u = o === "warm" || o === "follow" && s ? oe[t] : o === "follow" ? m(c, se[t], r ? .08 : .07) : m(y(o, t), se[t], r ? .14 : .18), n["color-bg"] = u, n["bg-image"] = ue.map((e, t) => {
		let [n, r] = e.split(", ");
		return `radial-gradient(circle at ${n}, ${l[t]} 0, transparent ${r})`;
	}).join(", "), n.background = `${n["bg-image"]}, ${u}`;
	let d = e.reducedTransparency;
	n["glass-fill"] = `rgba(${de[t]["glass-rgb"]}, ${d ? .94 : e.fill / 100})`, n["glass-blur"] = b(d ? 0 : e.blur), n["glass-filter"] = d ? "none" : `blur(${b(e.blur)}) saturate(170%)`, n["glass-fill-reduced"] = `rgba(${de[t]["glass-rgb"]}, 0.94)`;
	let f = r ? e.gloss * .28 : e.gloss, ee = Math.min(1, r ? e.gloss * .45 : e.gloss * 1.6);
	n.gloss = String(Math.round(f * 1e3) / 1e3), n["gloss-edge"] = `rgba(255, 255, 255, ${Math.round(ee * 1e3) / 1e3})`, n["gloss-layer"] = `linear-gradient(160deg, rgba(255, 255, 255, ${me(f)}) 0%, rgba(255, 255, 255, ${me(f * .25)}) 30%, rgba(255, 255, 255, 0) 55%)`, n["radius-card"] = b(e.radius), n["radius-control"] = b(e.radius * .5 + 2), n["radius-pill"] = "999px";
	let p = `inset 0 1px 0 ${n["glass-highlight"]}, inset 1px 0 0 ${n["gloss-edge"]}`, h = "0 0 0 transparent", g = e.depth !== "shadow", ie = e.depth !== "border";
	n["card-inset"] = g ? p : `inset ${h}`, n["card-drop"] = ie ? n["shadow-card"] : h, n["card-border"] = g ? n["glass-border"] : "transparent", n["card-shadow"] = `${n["card-inset"]}, ${n["card-drop"]}`;
	let _ = e.colorMode === "accent";
	return n["state-light"] = _ ? i : n["color-light"], n["state-heat"] = _ ? i : n["color-heat"], n["state-cool"] = _ ? i : n["color-cool"], n["state-cover"] = i, n["state-on"] = i, n;
}
var me = (e) => Math.round(e * 1e3) / 1e3;
function he(e, t) {
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
var x = Object.freeze({
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
}), ge = {
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
}, _e = {
	none: 0,
	soft: .45,
	strong: .75
}, ve = [
	6,
	10,
	14,
	18,
	22,
	28
], S = {
	blur: [0, 40],
	fill: [10, 95],
	gloss: [0, 1],
	radius: [0, 32]
}, C = (e, [t, n], r) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : r, ye = (e, t, n) => t.includes(e) ? e : n, w = (e, t) => typeof e == "string" && e.length < 40 ? e : t;
function T(e) {
	let t = e && typeof e == "object" ? e : {}, n = x;
	return {
		version: 1,
		accent: w(t.accent, n.accent),
		gradientLight: w(t.gradientLight, n.gradientLight),
		gradientDark: w(t.gradientDark, n.gradientDark),
		baseLight: w(t.baseLight, n.baseLight),
		baseDark: w(t.baseDark, n.baseDark),
		blur: C(t.blur, S.blur, n.blur),
		fill: C(t.fill, S.fill, n.fill),
		gloss: C(t.gloss, S.gloss, n.gloss),
		radius: C(t.radius, S.radius, n.radius),
		depth: ye(t.depth, [
			"border",
			"shadow",
			"both"
		], n.depth),
		colorMode: ye(t.colorMode, ["domain", "accent"], n.colorMode),
		reducedTransparency: typeof t.reducedTransparency == "boolean" ? t.reducedTransparency : n.reducedTransparency
	};
}
// src/settings/store.ts
var be = "helder", xe = "helder-settings", E = Ce(), D, O, k = /* @__PURE__ */ new Set(), Se = "connecting";
function Ce() {
	try {
		return T(JSON.parse(localStorage.getItem(xe) ?? "null"));
	} catch {
		return T(null);
	}
}
function we(e) {
	try {
		localStorage.setItem(xe, JSON.stringify(e));
	} catch {}
}
function Te(e) {
	let t = T(e);
	JSON.stringify(t) !== JSON.stringify(E) && (E = t, we(t), k.forEach((e) => e(t)));
}
var A = () => E, Ee = () => Se;
function De(e) {
	return k.add(e), () => k.delete(e);
}
async function Oe(e) {
	if (e !== D) {
		D = e, O && O().catch(() => void 0), O = void 0;
		try {
			Te((await e.sendMessagePromise({
				type: "frontend/get_system_data",
				key: "helder"
			}))?.value ?? null), O = await e.subscribeMessage((e) => Te(e?.value ?? null), {
				type: "frontend/subscribe_system_data",
				key: be
			}), Se = "ready";
		} catch (e) {
			Se = "unsupported", console.warn("[helder] settings storage unavailable, using defaults", e);
		}
		k.forEach((e) => e(E));
	}
}
async function ke(e) {
	if (!D) throw Error("Geen verbinding met Home Assistant");
	let t = T(e);
	await D.sendMessagePromise({
		type: "frontend/set_system_data",
		key: be,
		value: t
	}), Te(t);
}
var Ae = !1;
function je() {
	Ae || (Ae = !0, s((e) => {
		e.connection && Oe(e.connection);
	}));
}
// src/settings/apply.ts
var Me = "helder-runtime";
function Ne() {
	let e = c()?.themes?.darkMode;
	return typeof e == "boolean" ? e ? "dark" : "light" : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}
function Pe() {
	return getComputedStyle(document.documentElement).getPropertyValue("--helder-theme-active").trim() === "1";
}
var j = (e, t = "", n = !0) => Object.entries(e).map(([e, r]) => `--${t}${e}: ${r}${n ? " !important" : ""};`).join("\n  ");
function Fe(e, t, n) {
	let r = pe(e, t), i = `html {\n  ${j(r, "helder-")}\n  --helder-mode: ${t} !important;\n}\n`;
	return n && (i += `html {\n  ${j(he(r, t))}\n}\n`, i += "html, body { font-family: var(--helder-font-family); }\n"), i;
}
var Ie = "";
function M() {
	let e = Fe(A(), Ne(), Pe());
	if (e === Ie) return;
	Ie = e;
	let t = document.getElementById(Me);
	t || (t = document.createElement("style"), t.id = Me, document.head.append(t)), t.textContent = e;
}
var Le = !1;
function Re() {
	Le || (Le = !0, je(), M(), De(M), s(M), matchMedia("(prefers-color-scheme: dark)").addEventListener("change", M));
}
// node_modules/.pnpm/@lit+reactive-element@2.1.2/node_modules/@lit/reactive-element/css-tag.js
var N = globalThis, P = N.ShadowRoot && (N.ShadyCSS === void 0 || N.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = Symbol(), ze = /* @__PURE__ */ new WeakMap(), Be = class {
	constructor(e, t, n) {
		if (this._$cssResult$ = !0, n !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, t = this.t;
		if (P && e === void 0) {
			let n = t !== void 0 && t.length === 1;
			n && (e = ze.get(t)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), n && ze.set(t, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, Ve = (e) => new Be(typeof e == "string" ? e : e + "", void 0, F), He = (e, ...t) => new Be(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, F), Ue = (e, t) => {
	if (P) e.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let n of t) {
		let t = document.createElement("style"), r = N.litNonce;
		r !== void 0 && t.setAttribute("nonce", r), t.textContent = n.cssText, e.appendChild(t);
	}
}, We = P ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return Ve(t);
})(e) : e, { is: Ge, defineProperty: Ke, getOwnPropertyDescriptor: qe, getOwnPropertyNames: Je, getOwnPropertySymbols: Ye, getPrototypeOf: Xe } = Object, I = globalThis, Ze = I.trustedTypes, Qe = Ze ? Ze.emptyScript : "", $e = I.reactiveElementPolyfillSupport, L = (e, t) => e, et = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? Qe : null;
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
}, tt = (e, t) => !Ge(e, t), nt = {
	attribute: !0,
	type: String,
	converter: et,
	reflect: !1,
	useDefault: !1,
	hasChanged: tt
};
Symbol.metadata ??= Symbol("metadata"), I.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var R = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = nt) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && Ke(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = qe(this.prototype, e) ?? {
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
		return this.elementProperties.get(e) ?? nt;
	}
	static _$Ei() {
		if (this.hasOwnProperty(L("elementProperties"))) return;
		let e = Xe(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(L("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
			let e = this.properties, t = [...Je(e), ...Ye(e)];
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
			for (let e of n) t.unshift(We(e));
		} else e !== void 0 && t.push(We(e));
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
		return Ue(e, this.constructor.elementStyles), e;
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
			let i = (n.converter?.toAttribute === void 0 ? et : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? et : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? tt)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
R.elementStyles = [], R.shadowRootOptions = { mode: "open" }, R[L("elementProperties")] = /* @__PURE__ */ new Map(), R[L("finalized")] = /* @__PURE__ */ new Map(), $e?.({ ReactiveElement: R }), (I.reactiveElementVersions ??= []).push("2.1.2");
// node_modules/.pnpm/lit-html@3.3.3/node_modules/lit-html/lit-html.js
var rt = globalThis, it = (e) => e, z = rt.trustedTypes, at = z ? z.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ot = "$lit$", B = `lit$${Math.random().toFixed(9).slice(2)}$`, st = "?" + B, ct = `<${st}>`, V = document, H = () => V.createComment(""), U = (e) => e === null || typeof e != "object" && typeof e != "function", lt = Array.isArray, ut = (e) => lt(e) || typeof e?.[Symbol.iterator] == "function", dt = "[ 	\n\f\r]", W = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ft = /-->/g, pt = />/g, G = RegExp(`>|${dt}(?:([^\\s"'>=/]+)(${dt}*=${dt}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), mt = /'/g, ht = /"/g, gt = /^(?:script|style|textarea|title)$/i, _t = (e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}), K = _t(1), vt = _t(2), q = Symbol.for("lit-noChange"), J = Symbol.for("lit-nothing"), yt = /* @__PURE__ */ new WeakMap(), Y = V.createTreeWalker(V, 129);
function bt(e, t) {
	if (!lt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return at === void 0 ? t : at.createHTML(t);
}
var xt = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = W;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === W ? c[1] === "!--" ? o = ft : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = G) : (gt.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = G) : o = pt : o === G ? c[0] === ">" ? (o = i ?? W, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? G : c[3] === "\"" ? ht : mt) : o === ht || o === mt ? o = G : o === ft || o === pt ? o = W : (o = G, i = void 0);
		let d = o === G && e[t + 1].startsWith("/>") ? " " : "";
		a += o === W ? n + ct : l >= 0 ? (r.push(s), n.slice(0, l) + ot + n.slice(l) + B + d) : n + B + (l === -2 ? t : d);
	}
	return [bt(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, St = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = xt(t, n);
		if (this.el = e.createElement(l, r), Y.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = Y.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(ot)) {
					let t = u[o++], n = i.getAttribute(e).split(B), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? Tt : r[1] === "?" ? Et : r[1] === "@" ? Dt : Z
					}), i.removeAttribute(e);
				} else e.startsWith(B) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (gt.test(i.tagName)) {
					let e = i.textContent.split(B), t = e.length - 1;
					if (t > 0) {
						i.textContent = z ? z.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], H()), Y.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], H());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === st) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(B, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += B.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = V.createElement("template");
		return n.innerHTML = e, n;
	}
};
function X(e, t, n = e, r) {
	if (t === q) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = U(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = X(e, i._$AS(e, t.values), i, r)), t;
}
var Ct = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? V).importNode(t, !0);
		Y.currentNode = r;
		let i = Y.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new wt(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new Ot(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = Y.nextNode(), a++);
		}
		return Y.currentNode = V, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, wt = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = J, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = X(this, e, t), U(e) ? e === J || e == null || e === "" ? (this._$AH !== J && this._$AR(), this._$AH = J) : e !== this._$AH && e !== q && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? ut(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== J && U(this._$AH) ? this._$AA.nextSibling.data = e : this.T(V.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = St.createElement(bt(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new Ct(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = yt.get(e.strings);
		return t === void 0 && yt.set(e.strings, t = new St(e)), t;
	}
	k(t) {
		lt(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(H()), this.O(H()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = it(e).nextSibling;
			it(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, Z = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = J, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = J;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = X(this, e, t, 0), a = !U(e) || e !== this._$AH && e !== q, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = X(this, r[n + o], t, o), s === q && (s = this._$AH[o]), a ||= !U(s) || s !== this._$AH[o], s === J ? e = J : e !== J && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === J ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, Tt = class extends Z {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === J ? void 0 : e;
	}
}, Et = class extends Z {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== J);
	}
}, Dt = class extends Z {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = X(this, e, t, 0) ?? J) === q) return;
		let n = this._$AH, r = e === J && n !== J || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== J && (n === J || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, Ot = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		X(this, e);
	}
}, kt = rt.litHtmlPolyfillSupport;
kt?.(St, wt), (rt.litHtmlVersions ??= []).push("3.3.3");
var At = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new wt(t.insertBefore(H(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, jt = globalThis, Q = class extends R {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = At(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return q;
	}
};
Q._$litElement$ = !0, Q.finalized = !0, jt.litElementHydrateSupport?.({ LitElement: Q });
var Mt = jt.litElementPolyfillSupport;
Mt?.({ LitElement: Q }), (jt.litElementVersions ??= []).push("4.2.2");
// src/core/register.ts
function Nt(e, t) {
	customElements.get(e) || customElements.define(e, t);
}
// src/ui/styles.ts
var Pt = He`
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
    font-size: var(--helder-font-size-l);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .unit {
    font-size: var(--helder-font-size-s);
    color: var(--helder-color-text-muted);
    margin-left: 0.1rem;
  }
  .readout {
    font-size: var(--helder-font-size-3xl);
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
`, Ft = (e) => e ?? J;
vt`<path fill="currentColor" d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z"/>`;
var $ = (e) => K`
  <div class="head">
    <div class="icon">${e.icon}</div>
    <div class="text">
      <div class="name">${e.name}</div>
      ${e.sub === void 0 ? J : K`<div class="sub">${e.sub}</div>`}
    </div>
    ${e.value === void 0 || e.value === J ? J : K`<div class="value">${e.value}${e.unit ? K`<span class="unit">${e.unit}</span>` : J}</div>`}
  </div>
`, It = (e, t, n) => n > t ? (e - t) / (n - t) * 100 : 0;
function Lt(e) {
	let t = e.min ?? 0, n = e.max ?? 100, r = e.value ?? t;
	return K`<input
    class="slider"
    type="range"
    min=${t}
    max=${n}
    step=${e.step ?? 1}
    .value=${String(r)}
    style="--p:${It(r, t, n)}%"
    aria-label=${e.label}
    ?disabled=${e.disabled}
    @input=${(r) => {
		let i = r.target;
		i.style.setProperty("--p", `${It(+i.value, t, n)}%`), e.onInput?.(+i.value);
	}}
    @change=${(t) => e.onChange(+t.target.value)}
    @click=${(e) => e.stopPropagation()}
  />`;
}
var Rt = (e, t, n, r = !1) => K`<button
  class="switch"
  role="switch"
  aria-checked=${String(e)}
  aria-label=${Ft(t)}
  ?disabled=${r}
  @click=${(e) => {
	e.stopPropagation(), n();
}}
></button>`, zt = [
	["color", "Kleuren"],
	["light", "Licht"],
	["grey", "Grijs"]
];
Nt("helder-color-picker", class extends Q {
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
			let e = d(this.value) ? this.value : v.some((e) => e.id === this.value) ? y(this.value, "light") : this.fallback;
			[this._h, this._s, this._v] = g(e), this._hex = h(this._h, this._s, this._v);
		}
	}
	firstUpdated() {
		this.shadowRoot?.querySelector("button")?.focus();
	}
	updated() {
		this._drawnV !== this._v && this.drawWheel();
	}
	get current() {
		return h(this._h, this._s, this._v);
	}
	drawWheel() {
		let e = this.shadowRoot?.querySelector("canvas"), t = e?.getContext("2d");
		if (!e || !t) return;
		this._drawnV = this._v;
		let n = e.width, r = n / 2, i = t.createImageData(n, n);
		for (let e = 0; e < n; e++) for (let t = 0; t < n; t++) {
			let a = t - r, o = e - r, s = Math.sqrt(a * a + o * o), c = (e * n + t) * 4;
			if (s > r) continue;
			let [l, u, d] = f(h((Math.atan2(o, a) * 180 / Math.PI + 360) % 360, s / r, this._v));
			i.data[c] = l, i.data[c + 1] = u, i.data[c + 2] = d, i.data[c + 3] = 255;
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
		let t = this.current, n = this.kind === "accent" ? y(t, e) : t, r = e === "dark" ? oe.dark : "#f8f4f0", i = e === "dark" ? "rgba(255,255,255,.12)" : "rgba(90,60,30,.12)";
		return K`<div
      class="pvbox"
      style="background: radial-gradient(circle at 25% 15%, ${n}${this.kind === "accent" ? "33" : "99"} 0, transparent 65%), ${r}"
    >
      <span class="pchip" style="background:${n};color:${re(n)}">${e === "dark" ? "Donker" : "Licht"}</span>
      <span class="pbar" style="background: linear-gradient(to right, ${n} 0 60%, ${i} 60%)"></span>
    </div>`;
	}
	render() {
		let e = this._h * Math.PI / 180;
		return K`<div class="scrim" @click=${(e) => e.target === e.currentTarget && this.close()}>
      <div
        class="sheet"
        role="dialog"
        aria-modal="true"
        aria-label=${this.heading}
        @keydown=${(e) => e.key === "Escape" && this.close()}
      >
        <h3>${this.heading}</h3>
        ${this.specials.length ? K`<div class="specials">
              ${this.specials.map((e) => K`<button
                  class="special"
                  aria-pressed=${String(this.value === e.value)}
                  @click=${() => this.emit(e.value)}
                >
                  <i class="sw" style="background:${e.swatch}"></i>${e.label}
                </button>`)}
            </div>` : J}
        ${zt.map(([e, t]) => K`<div class="grp">
            <span class="lbl">${t}</span>
            <div class="swgrid">
              ${v.filter((t) => t.group === e).map((e) => K`<button
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
			d(t) && ([this._h, this._s, this._v] = g(t));
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
		this.styles = He`
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
var Bt = [
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
], Vt = "linear-gradient(135deg, #ffb078, #f8efe5)", Ht = {
	accent: [],
	gradient: [{
		value: "accent",
		label: "Zelfde als accent",
		swatch: "conic-gradient(#ff6d00, #2563eb, #16a34a, #ff6d00)"
	}, {
		value: "warm",
		label: "Warm (oorspronkelijk)",
		swatch: Vt
	}],
	base: [{
		value: "follow",
		label: "Volgt de verlopen",
		swatch: "linear-gradient(135deg, #ddd, #fff)"
	}, {
		value: "warm",
		label: "Warm (oorspronkelijk)",
		swatch: Vt
	}]
}, Ut = [
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
], Wt = [{
	value: "domain",
	label: "Statuskleur per domein"
}, {
	value: "accent",
	label: "Eén accentkleur"
}], Gt = (e, t) => JSON.stringify(e) === JSON.stringify(t), Kt = class extends Q {
	constructor(...e) {
		super(...e), this.narrow = !1, this._saved = A(), this._draft = A(), this._busy = !1;
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
		super.connectedCallback(), this._unsub = De((e) => {
			let t = !Gt(this._draft, this._saved);
			this._saved = e, t || (this._draft = e);
		});
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._unsub?.();
	}
	willUpdate(e) {
		e.has("hass") && l(this.hass);
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
			await ke(this._draft), this._saved = A(), this._draft = this._saved, this._message = {
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
		let n = Ht[e.kind].find((e) => e.value === t);
		return n ? {
			name: n.label,
			swatch: n.swatch
		} : d(t) ? {
			name: `Eigen kleur ${t.toLowerCase()}`,
			swatch: t
		} : {
			name: ae(t)?.name ?? t,
			swatch: y(t, e.mode)
		};
	}
	seg(e, t, n) {
		return K`<div class="seg">
      ${e.map((e) => K`<button aria-pressed=${String(e.value === t)} @click=${() => n(e.value)}>${e.label}</button>`)}
    </div>`;
	}
	range(e, t, [n, r], i, a, o) {
		return K`<label class="range">
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
		return K`<div class="slots">
      ${Bt.map((e) => {
			let t = this.describe(e, this._draft[e.key]);
			return K`<div class="slot">
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
		let e = Bt.find((e) => e.key === this._picker);
		return e ? K`<helder-color-picker
      .heading=${e.label}
      .value=${this._draft[e.key]}
      .mode=${e.mode}
      .kind=${e.kind}
      .specials=${Ht[e.kind]}
      .fallback=${y(this._draft.accent, "light")}
      @pick=${(t) => {
			this.set({ [e.key]: t.detail.value }), this._picker = void 0;
		}}
      @close=${() => this._picker = void 0}
    ></helder-color-picker>` : J;
	}
	glassPreset() {
		return Object.entries(ge).find(([, e]) => e.blur === this._draft.blur && e.fill === this._draft.fill)?.[0];
	}
	renderPreviewStage(e) {
		let t = pe(this._draft, e);
		return K`<div class="stage" style=${j(t, "helder-", !1) + `background: ${t.background};`}>
      <div class="stage-title">${e === "dark" ? "Donker" : "Licht"}</div>
      <div class="cards">
        <div class="card active lit" style="--state: var(--helder-state-light); --lamp: ${e === "dark" ? "#ffb15e" : "#ff9a3c"}; --bri-f: .7">
          ${$({
			icon: Jt,
			name: "Vloerlamp",
			sub: "Aan · 70 %",
			value: J
		})}
          ${Lt({
			value: 70,
			label: "Helderheid",
			onChange: () => void 0
		})}
        </div>
        <div class="card active heating" style="--state: var(--helder-state-heat)">
          ${$({
			icon: Yt,
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
          ${$({
			icon: Xt,
			name: "Rolluik voor",
			sub: "Open",
			value: "60",
			unit: "%"
		})}
          ${Lt({
			value: 60,
			label: "Positie",
			onChange: () => void 0
		})}
        </div>
        <div class="card na">
          ${$({
			icon: Jt,
			name: "Voordeur",
			sub: "Niet beschikbaar",
			value: K`${Rt(!1, "Aan/uit", () => void 0, !0)}`
		})}
        </div>
      </div>
    </div>`;
	}
	render() {
		let e = this._draft, t = !Gt(e, this._saved), n = Gt(e, { ...x }), r = Ee();
		return K`
      <div class="toolbar">
        ${this.narrow ? K`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : J}
        <h1>Helder</h1>
      </div>
      <div class="layout">
        <div class="form">
          ${r === "unsupported" ? K`<p class="note error">
                Deze Home Assistant-versie kan de instellingen niet centraal opslaan. Helder gebruikt de standaardwaarden.
              </p>` : J}
          ${this.hass?.user && !this.hass.user.is_admin ? K`<p class="note">Alleen beheerders kunnen deze instellingen wijzigen.</p>` : J}

          <section>
            <h2>Kleuren</h2>
            <p class="hint">Accent en achtergrond kies je los van elkaar. De achtergrond stel je apart in voor licht en donker.</p>
            ${this.renderColors()}
          </section>

          <section>
            <h2>Kleurgebruik</h2>
            <p class="hint">Standaard voor alle kaarten; per kaart aan te passen in de kaarteditor.</p>
            ${this.seg(Wt, e.colorMode, (e) => this.set({ colorMode: e }))}
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
		], this.glassPreset(), (e) => this.set({ ...ge[e] }))}
            ${this.range("Blur", e.blur, S.blur, 1, "px", (e) => this.set({ blur: e }))}
            ${this.range("Vulling", e.fill, S.fill, 1, "%", (e) => this.set({ fill: e }))}
            <label class="switchrow">
              <span>Verminderde transparantie voor iedereen<small>De systeeminstelling van een apparaat geldt altijd.</small></span>
              ${Rt(e.reducedTransparency, "Verminderde transparantie", () => this.set({ reducedTransparency: !e.reducedTransparency }))}
            </label>
          </section>

          <section>
            <h2>Glans</h2>
            ${this.seg([
			{
				value: _e.none,
				label: "Geen"
			},
			{
				value: _e.soft,
				label: "Zacht"
			},
			{
				value: _e.strong,
				label: "Sterk"
			}
		], e.gloss, (e) => this.set({ gloss: e }))}
            ${this.range("Glans", e.gloss, S.gloss, .05, "", (e) => this.set({ gloss: e }))}
          </section>

          <section>
            <h2>Vorm en diepte</h2>
            ${this.seg(ve.map((e) => ({
			value: e,
			label: `${e} px`
		})), e.radius, (e) => this.set({ radius: e }))}
            ${this.seg(Ut, e.depth, (e) => this.set({ depth: e }))}
          </section>
        </div>

        <aside class="preview" aria-label="Voorbeeld">
          ${this.renderPreviewStage("light")} ${this.renderPreviewStage("dark")}
        </aside>
      </div>

      <div class="actions">
        ${this._message ? K`<span class="msg ${this._message.kind}">${this._message.text}</span>` : K`<span class="msg">${t ? "Niet opgeslagen wijzigingen" : ""}</span>`}
        <button class="pill" ?disabled=${n || this._busy} @click=${() => this.set({ ...x })}>
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
		this.styles = [Pt, He`
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
}, qt = (e) => K`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d=${e} /></svg>`, Jt = qt("M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9z"), Yt = qt("M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-9a1 1 0 0 1 1 1v3h-2V5a1 1 0 0 1 1-1"), Xt = qt("M3 4h18v2h-1v10h-2V6H6v10H4V6H3zm4 3h10v2H7zm0 3h10v2H7zm0 3h10v2H7zm4 4h2v3h-2z");
Nt("helder-settings-panel", Kt), t(), Re(), console.info("%c HELDER %c 0.1.0 ", "background:#ff6d00;color:#fff;border-radius:3px 0 0 3px", "background:#2a221c;color:#fff;border-radius:0 3px 3px 0");
