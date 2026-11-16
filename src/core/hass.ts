// Access to HA's global `hass` object outside of cards (settings store, theme application).
// Cards get `hass` as a property from HA; non-card code reads it from the <home-assistant> root element.

import type { HomeAssistant } from './types';

type Listener = (hass: HomeAssistant) => void;

let current: HomeAssistant | undefined;
const listeners = new Set<Listener>();
let started = false;

function root(): (HTMLElement & { hass?: HomeAssistant }) | null {
  return document.querySelector('home-assistant');
}

function check() {
  const hass = root()?.hass;
  if (hass && hass !== current) {
    current = hass;
    listeners.forEach((l) => l(hass));
  }
}

/**
 * Calls `cb` with the current hass object and again when HA has replaced it (checked on theme changes and every
 * 2 s). HA creates a new hass object on every state change, so listeners must be cheap and idempotent.
 */
export function onHass(cb: Listener): () => void {
  listeners.add(cb);
  if (current) cb(current);
  start();
  return () => listeners.delete(cb);
}

export const getHass = (): HomeAssistant | undefined => current ?? root()?.hass;

/** Lets code that already has `hass` (cards, the settings panel) share it, so we do not wait for polling. */
export function provideHass(hass: HomeAssistant | undefined) {
  if (!hass || hass === current) return;
  current = hass;
  listeners.forEach((l) => l(hass));
}

function start() {
  if (started) return;
  started = true;
  // Poll until hass exists, then watch the root element's style attribute (HA re-applies theme variables when the
  // theme or dark mode changes) and fall back to a slow poll for other changes.
  let frame = 0;
  const schedule = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      check();
    });
  };
  const boot = setInterval(() => {
    check();
    if (current) clearInterval(boot);
  }, 150);
  new MutationObserver(schedule).observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
  setInterval(schedule, 2000);
}
