// Applies the current settings to the page as CSS variables.
//
// HA writes theme variables as inline styles on <html>. A stylesheet rule with `!important` beats those, so the
// settings win over the static defaults in themes/helder.yaml without touching HA's own theme handling.
// - `--helder-*` tokens are always applied, so Helder cards look right under any HA theme.
// - HA's own variables (primary colour, card background, page background, font) are only overridden while the
//   `helder` theme is active; the theme sets `--helder-theme-active: 1` as a marker.

import { getHass, onHass } from '../core/hass';
import { computeTokens, haVariables, type TokenMap } from '../tokens/tokens';
import type { HelderSettings, Mode } from '../tokens/settings';
import { getSettings, startSettingsStore, subscribeSettings } from './store';

const STYLE_ID = 'helder-runtime';

export function currentMode(): Mode {
  const dark = getHass()?.themes?.darkMode;
  if (typeof dark === 'boolean') return dark ? 'dark' : 'light';
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function helderThemeActive(): boolean {
  return getComputedStyle(document.documentElement).getPropertyValue('--helder-theme-active').trim() === '1';
}

export const declarations = (vars: TokenMap, prefix = '', important = true): string =>
  Object.entries(vars)
    .map(([k, v]) => `--${prefix}${k}: ${v}${important ? ' !important' : ''};`)
    .join('\n  ');

export function runtimeCss(s: HelderSettings, mode: Mode, themeActive: boolean): string {
  const t = computeTokens(s, mode);
  let css = `html {\n  ${declarations(t, 'helder-')}\n  --helder-mode: ${mode} !important;\n}\n`;
  if (themeActive) {
    css += `html {\n  ${declarations(haVariables(t, mode))}\n}\n`;
    css += `html, body { font-family: var(--helder-font-family); }\n`;
  }
  return css;
}

let last = '';
function apply() {
  const css = runtimeCss(getSettings(), currentMode(), helderThemeActive());
  if (css === last) return;
  last = css;
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement('style');
    el.id = STYLE_ID;
    document.head.append(el);
  }
  el.textContent = css;
}

let started = false;
export function startThemeRuntime() {
  if (started) return;
  started = true;
  startSettingsStore();
  apply();
  subscribeSettings(apply);
  onHass(apply);
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', apply);
}
