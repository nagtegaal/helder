// Design tokens. `computeTokens(settings, mode)` is the single source of truth for every `--helder-*` variable:
// the build uses it to generate themes/helder.yaml (defaults) and the bundle uses it at runtime to apply the
// settings stored in HA. Names are returned without the leading `--`.

import { isHex, luminance, mix, onColor, rgba, rgbTriplet } from './color';
import { PALETTE, paletteById } from './palette';
import type { ColorValue, HelderSettings, Mode } from './settings';

export type TokenMap = Record<string, string>;

/** Original warm page base colours. */
export const WARM_BASE: Record<Mode, string> = { light: '#f8efe5', dark: '#16110d' };
/** Neutral bases that a chosen background colour is mixed into. */
const NEUTRAL_BASE: Record<Mode, string> = { light: '#f8f4f0', dark: '#141210' };

/** Original fixed warm gradients (five soft circles). */
const WARM_BLOBS: Record<Mode, string[]> = {
  light: [
    'rgba(255, 176, 120, 0.55)',
    'rgba(255, 210, 160, 0.7)',
    'rgba(246, 160, 150, 0.45)',
    'rgba(255, 222, 180, 0.75)',
    'rgba(255, 196, 150, 0.35)',
  ],
  dark: [
    'rgba(255, 120, 40, 0.22)',
    'rgba(150, 80, 170, 0.2)',
    'rgba(255, 160, 80, 0.16)',
    'rgba(200, 90, 70, 0.18)',
    'rgba(255, 140, 60, 0.1)',
  ],
};
/** Opacity of the five circles when they are tinted with a chosen colour. */
const TINT_ALPHA: Record<Mode, number[]> = { light: [0.38, 0.26, 0.32, 0.2, 0.16], dark: [0.26, 0.18, 0.22, 0.15, 0.1] };
/** Positions and sizes of the circles. */
const BLOB_GEOMETRY = ['12% 18%, 34%', '88% 12%, 30%', '72% 82%, 36%', '30% 92%, 30%', '50% 45%, 26%'];

/** Fixed per-mode tokens that do not depend on settings. */
const STATIC: Record<Mode, TokenMap> = {
  light: {
    'color-text': '#2a221c',
    'color-text-muted': '#7a6c60',
    'color-disabled': '#b3a79c',
    'glass-rgb': '255, 255, 255',
    'glass-border': 'rgba(255, 255, 255, 0.65)',
    'glass-highlight': 'rgba(255, 255, 255, 0.85)',
    'shadow-card': '0 0.7rem 2rem rgba(110, 70, 30, 0.13), 0 1px 3px rgba(110, 70, 30, 0.1)',
    'control-bg': 'rgba(90, 60, 30, 0.09)',
    'control-bg-hover': 'rgba(90, 60, 30, 0.14)',
    'control-border': 'rgba(42, 34, 28, 0.22)',
    thumb: '#ffffff',
    'thumb-shadow': '0 1px 4px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
    'color-light': '#e89a00',
    'color-heat': '#e8590c',
    'color-cool': '#0284c7',
    'color-error': '#c62828',
    'heat-glow': 'rgba(235, 45, 30, 0.26)',
    'light-glow-strength': '34%',
    'popover-bg': 'rgba(255, 252, 248, 0.92)',
    'scrim': 'rgba(42, 34, 28, 0.25)',
  },
  dark: {
    'color-text': '#f3ebe3',
    'color-text-muted': '#ab9d90',
    'color-disabled': '#6a5f56',
    'glass-rgb': '52, 44, 38',
    'glass-border': 'rgba(255, 255, 255, 0.14)',
    'glass-highlight': 'rgba(255, 255, 255, 0.22)',
    'shadow-card': '0 0.8rem 2.4rem rgba(0, 0, 0, 0.45), 0 1px 3px rgba(0, 0, 0, 0.35)',
    'control-bg': 'rgba(255, 255, 255, 0.09)',
    'control-bg-hover': 'rgba(255, 255, 255, 0.14)',
    'control-border': 'rgba(243, 235, 227, 0.22)',
    thumb: '#f8f2ec',
    'thumb-shadow': '0 1px 4px rgba(0, 0, 0, 0.4)',
    'color-light': '#ffc23d',
    'color-heat': '#ff8a3d',
    'color-cool': '#38bdf8',
    'color-error': '#ff6b6b',
    'heat-glow': 'rgba(255, 70, 50, 0.3)',
    'light-glow-strength': '30%',
    'popover-bg': 'rgba(40, 33, 28, 0.94)',
    'scrim': 'rgba(0, 0, 0, 0.45)',
  },
};

/** Mode-independent tokens. */
const COMMON: TokenMap = {
  'font-family': '"Helder Open Sans", "Open Sans", system-ui, -apple-system, "Segoe UI", sans-serif',
  'font-weight': '400',
  'font-weight-readout': '300',
  // Type scale = Home Assistant's own scale (what the bronxx theme uses: it sets no sizes of its own).
  // Follows HA's --ha-font-size-scale; the fallback is the same size in rem (14 px base).
  'font-size-xs': 'var(--ha-font-size-xs, 0.714rem)', // 10 px
  'font-size-s': 'var(--ha-font-size-s, 0.857rem)', // 12 px
  'font-size-m': 'var(--ha-font-size-m, 1rem)', // 14 px
  'font-size-l': 'var(--ha-font-size-l, 1.143rem)', // 16 px
  'font-size-xl': 'var(--ha-font-size-xl, 1.429rem)', // 20 px
  'font-size-2xl': 'var(--ha-font-size-2xl, 1.714rem)', // 24 px
  'font-size-3xl': 'var(--ha-font-size-3xl, 2rem)', // 28 px
  space: '1rem',
  'space-s': '0.6rem',
  'space-xs': '0.35rem',
  'control-size': '2.4rem',
  'icon-size': '1.35rem',
  'slider-height': '0.6rem',
  'thumb-size': '1.55rem',
  'focus-ring': '2px',
  'transition-fast': '0.15s ease',
  'transition': '0.25s ease',
};

/** Resolves a colour value (palette id or #hex) for a mode. Custom dark colours are lifted slightly in dark mode. */
export function resolveColor(value: ColorValue, mode: Mode): string {
  if (isHex(value)) {
    const v = value.toLowerCase();
    return mode === 'dark' && luminance(v) < 0.18 ? mix('#ffffff', v, 0.22) : v;
  }
  const p = paletteById(value) ?? PALETTE[0];
  return mode === 'dark' ? p.dark : p.light;
}

const px = (n: number) => `${Math.round(n * 10) / 10}px`;

export function computeTokens(s: HelderSettings, mode: Mode): TokenMap {
  const t: TokenMap = { ...COMMON, ...STATIC[mode] };
  const dark = mode === 'dark';

  // Accent
  const accent = resolveColor(s.accent, mode);
  t['color-accent'] = accent;
  t['color-accent-rgb'] = rgbTriplet(accent);
  t['color-on-accent'] = onColor(accent);

  // Background: gradients + base colour
  const gradient = dark ? s.gradientDark : s.gradientLight;
  const base = dark ? s.baseDark : s.baseLight;
  const warmGradient = gradient === 'warm';
  const tint = gradient === 'accent' ? accent : warmGradient ? WARM_BASE[mode] : resolveColor(gradient, mode);
  const blobs = warmGradient ? WARM_BLOBS[mode] : TINT_ALPHA[mode].map((a) => rgba(tint, a));
  blobs.forEach((b, i) => (t[`bg-blob-${i + 1}`] = b));
  let bg: string;
  if (base === 'warm' || (base === 'follow' && warmGradient)) bg = WARM_BASE[mode];
  else if (base === 'follow') bg = mix(tint, NEUTRAL_BASE[mode], dark ? 0.08 : 0.07);
  else bg = mix(resolveColor(base, mode), NEUTRAL_BASE[mode], dark ? 0.14 : 0.18);
  t['color-bg'] = bg;
  t['bg-image'] = BLOB_GEOMETRY.map((g, i) => {
    const [pos, size] = g.split(', ');
    return `radial-gradient(circle at ${pos}, ${blobs[i]} 0, transparent ${size})`;
  }).join(', ');
  t['background'] = `${t['bg-image']}, ${bg}`;

  // Glass
  const reduced = s.reducedTransparency;
  t['glass-fill'] = `rgba(${STATIC[mode]['glass-rgb']}, ${reduced ? 0.94 : s.fill / 100})`;
  t['glass-blur'] = px(reduced ? 0 : s.blur);
  t['glass-filter'] = reduced ? 'none' : `blur(${px(s.blur)}) saturate(170%)`;
  t['glass-fill-reduced'] = `rgba(${STATIC[mode]['glass-rgb']}, 0.94)`;

  // Gloss: diagonal light from the top-left, weaker in dark mode
  const gloss = dark ? s.gloss * 0.28 : s.gloss;
  const glossEdge = Math.min(1, dark ? s.gloss * 0.45 : s.gloss * 1.6);
  t['gloss'] = String(Math.round(gloss * 1000) / 1000);
  t['gloss-edge'] = `rgba(255, 255, 255, ${Math.round(glossEdge * 1000) / 1000})`;
  t['gloss-layer'] =
    `linear-gradient(160deg, rgba(255, 255, 255, ${round3(gloss)}) 0%, ` +
    `rgba(255, 255, 255, ${round3(gloss * 0.25)}) 30%, rgba(255, 255, 255, 0) 55%)`;

  // Shape
  t['radius-card'] = px(s.radius);
  t['radius-control'] = px(s.radius * 0.5 + 2);
  t['radius-pill'] = '999px';

  // Depth
  const inset = `inset 0 1px 0 ${t['glass-highlight']}, inset 1px 0 0 ${t['gloss-edge']}`;
  const none = '0 0 0 transparent';
  const hasBorder = s.depth !== 'shadow';
  const hasShadow = s.depth !== 'border';
  t['card-inset'] = hasBorder ? inset : `inset ${none}`;
  t['card-drop'] = hasShadow ? t['shadow-card'] : none;
  t['card-border'] = hasBorder ? t['glass-border'] : 'transparent';
  t['card-shadow'] = `${t['card-inset']}, ${t['card-drop']}`;

  // State colours (global default; a card can switch to the accent locally)
  const byAccent = s.colorMode === 'accent';
  t['state-light'] = byAccent ? accent : t['color-light'];
  t['state-heat'] = byAccent ? accent : t['color-heat'];
  t['state-cool'] = byAccent ? accent : t['color-cool'];
  t['state-cover'] = accent;
  t['state-on'] = accent;

  return t;
}

const round3 = (n: number) => Math.round(n * 1000) / 1000;

/** HA theme variables derived from the Helder tokens. Applied only while the `helder` theme is active. */
export function haVariables(t: TokenMap, mode: Mode): TokenMap {
  return {
    'primary-color': t['color-accent'],
    'rgb-primary-color': t['color-accent-rgb'],
    'accent-color': t['color-accent'],
    'rgb-accent-color': t['color-accent-rgb'],
    'text-primary-color': t['color-on-accent'],
    'text-accent-color': t['color-on-accent'],
    'primary-text-color': t['color-text'],
    'secondary-text-color': t['color-text-muted'],
    'disabled-text-color': t['color-disabled'],
    'primary-background-color': t['color-bg'],
    'secondary-background-color': mode === 'dark' ? '#1f1813' : '#f3e9de',
    'divider-color': mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(90, 60, 30, 0.12)',
    'lovelace-background': t['background'],
    'card-background-color': t['glass-fill'],
    'ha-card-background': `${t['gloss-layer']}, linear-gradient(${t['glass-fill']}, ${t['glass-fill']})`,
    'ha-card-backdrop-filter': t['glass-filter'],
    'ha-card-border-radius': t['radius-card'],
    'ha-card-border-width': '1px',
    'ha-card-border-color': t['card-border'],
    'ha-card-box-shadow': t['card-shadow'],
    'primary-font-family': t['font-family'],
    'ha-font-family-body': t['font-family'],
    'ha-font-family-heading': t['font-family'],
    'state-icon-color': t['color-text-muted'],
    'state-light-on-color': t['state-light'],
    'state-climate-heat-color': t['state-heat'],
    'state-cover-open-color': t['state-cover'],
    'error-color': t['color-error'],
  };
}
