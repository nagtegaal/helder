// Loads Hind (static weights 300-700, Latin subset) from the fonts folder next to the bundle, under its own family
// name so it does not clash with fonts that other themes load. Helder's cards use 300 and 400 only; 500-700 are
// there so HA's own pages (buttons, headings) get real weights instead of synthesised bold.

const FAMILY = 'Helder Hind';
export const FONT_WEIGHTS = [300, 400, 500, 600, 700] as const;

export function loadFont() {
  if (document.getElementById('helder-font')) return;
  // Directory of this module (string manipulation, so the bundler leaves it alone).
  const base = import.meta.url.replace(/[^/]*$/, '');
  const style = document.createElement('style');
  style.id = 'helder-font';
  style.textContent = FONT_WEIGHTS.map(
    (w) => `@font-face {
  font-family: "${FAMILY}";
  src: url("${base}fonts/hind-latin-${w}-normal.woff2") format("woff2");
  font-weight: ${w};
  font-style: normal;
  font-display: swap;
}`,
  ).join('\n');
  document.head.append(style);
}
