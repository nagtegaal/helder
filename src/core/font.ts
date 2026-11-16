// Loads Open Sans (variable, Latin subset) from the fonts folder next to the bundle, under its own family name so
// it does not clash with fonts that other themes load.

const FAMILY = 'Helder Open Sans';

export function loadFont() {
  if (document.getElementById('helder-font')) return;
  // Directory of this module (string manipulation, so the bundler leaves it alone).
  const base = import.meta.url.replace(/[^/]*$/, '');
  const style = document.createElement('style');
  style.id = 'helder-font';
  style.textContent = `@font-face {
  font-family: "${FAMILY}";
  src: url("${base}fonts/open-sans-latin-wght-normal.woff2") format("woff2-variations"),
       url("${base}fonts/open-sans-latin-wght-normal.woff2") format("woff2");
  font-weight: 300 800;
  font-style: normal;
  font-display: swap;
}`;
  document.head.append(style);
}
