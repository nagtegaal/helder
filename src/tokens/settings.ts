// Theme settings: what the settings page edits and what is stored centrally in HA (system data, key `helder`).

/** A palette id (see palette.ts) or a custom colour `#rrggbb`. */
export type ColorValue = string;

export type Mode = 'light' | 'dark';
export type Depth = 'border' | 'shadow' | 'both';
export type ColorMode = 'domain' | 'accent';

export interface HelderSettings {
  version: 1;
  accent: ColorValue;
  /** Background gradients: a colour, `accent` (same as accent) or `warm` (original fixed warm gradients). */
  gradientLight: ColorValue | 'accent' | 'warm';
  gradientDark: ColorValue | 'accent' | 'warm';
  /** Page base colour: a colour, `follow` (tinted by the gradients) or `warm` (original warm base). */
  baseLight: ColorValue | 'follow' | 'warm';
  baseDark: ColorValue | 'follow' | 'warm';
  /** Glass blur in px. */
  blur: number;
  /** Glass fill opacity in percent. */
  fill: number;
  /** Gloss strength 0..1. */
  gloss: number;
  /** Card radius in px. */
  radius: number;
  depth: Depth;
  /** Default colour usage of cards; a card can override it in its editor. */
  colorMode: ColorMode;
  /** Force reduced transparency for everyone (the system setting is always honoured as well). */
  reducedTransparency: boolean;
}

export const DEFAULT_SETTINGS: Readonly<HelderSettings> = Object.freeze({
  version: 1,
  accent: 'orange',
  gradientLight: 'accent',
  gradientDark: 'accent',
  baseLight: 'follow',
  baseDark: 'follow',
  blur: 20,
  fill: 40,
  gloss: 0.45,
  radius: 18,
  depth: 'both',
  colorMode: 'domain',
  reducedTransparency: false,
});

export const GLASS_PRESETS = {
  subtle: { blur: 12, fill: 55 },
  medium: { blur: 20, fill: 40 },
  strong: { blur: 32, fill: 25 },
} as const;

export const GLOSS_PRESETS = { none: 0, soft: 0.45, strong: 0.75 } as const;

export const RADII = [6, 10, 14, 18, 22, 28] as const;

export const LIMITS = {
  blur: [0, 40],
  fill: [10, 95],
  gloss: [0, 1],
  radius: [0, 32],
} as const;

const clamp = (v: unknown, [min, max]: readonly [number, number], fallback: number): number =>
  typeof v === 'number' && Number.isFinite(v) ? Math.min(max, Math.max(min, v)) : fallback;

const oneOf = <T extends string>(v: unknown, options: readonly T[], fallback: T): T =>
  options.includes(v as T) ? (v as T) : fallback;

const str = (v: unknown, fallback: string): string => (typeof v === 'string' && v.length < 40 ? v : fallback);

/** Accepts anything (stored data may be old, partial or hand-edited) and returns complete, valid settings. */
export function normalizeSettings(raw: unknown): HelderSettings {
  const r = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
  const d = DEFAULT_SETTINGS;
  return {
    version: 1,
    accent: str(r.accent, d.accent),
    gradientLight: str(r.gradientLight, d.gradientLight),
    gradientDark: str(r.gradientDark, d.gradientDark),
    baseLight: str(r.baseLight, d.baseLight),
    baseDark: str(r.baseDark, d.baseDark),
    blur: clamp(r.blur, LIMITS.blur, d.blur),
    fill: clamp(r.fill, LIMITS.fill, d.fill),
    gloss: clamp(r.gloss, LIMITS.gloss, d.gloss),
    radius: clamp(r.radius, LIMITS.radius, d.radius),
    depth: oneOf(r.depth, ['border', 'shadow', 'both'] as const, d.depth),
    colorMode: oneOf(r.colorMode, ['domain', 'accent'] as const, d.colorMode),
    reducedTransparency: typeof r.reducedTransparency === 'boolean' ? r.reducedTransparency : d.reducedTransparency,
  };
}
