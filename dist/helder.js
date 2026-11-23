// Helder 0.1.0: stable entry for frontend.extra_module_url and panel_custom.module_url.
// Browsers cache this file heuristically, so it asks the server for the current bundle (VERSION, never cached)
// and only falls back to the bundle it was built with.
const base = new URL('./', import.meta.url);
let hash = '8c8bcef167';
try {
  const r = await fetch(new URL('VERSION', base), { cache: 'no-store' });
  if (r.ok) hash = (await r.text()).trim().split(/\s+/)[1] || hash;
} catch {}
await import(new URL(`helder.${hash}.js`, base).href);
