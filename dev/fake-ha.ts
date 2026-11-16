// Fake Home Assistant for the dev harness: a <home-assistant> root with a hass object, entity states taken from
// Stefan's HA, a websocket connection that implements frontend system data, and the helder theme applied to
// <html> the way HA applies themes (inline custom properties).
import type { HassEntity, HomeAssistant } from '../src/core/types';
import { computeTokens, haVariables } from '../src/tokens/tokens';
import { DEFAULT_SETTINGS, type Mode } from '../src/tokens/settings';

const params = new URLSearchParams(location.search);
export const mode: Mode = params.get('mode') === 'dark' ? 'dark' : 'light';
const now = () => new Date().toISOString();

const light = (id: string, name: string, state: string, attrs: Record<string, unknown> = {}): HassEntity => ({
  entity_id: id,
  state,
  attributes: { friendly_name: name, supported_color_modes: ['brightness'], ...attrs },
  last_changed: now(),
  last_updated: now(),
});

const states: Record<string, HassEntity> = {};
for (const e of [
  light('light.vloerlamp', 'Vloerlamp', 'on', { brightness: 178, rgb_color: [255, 137, 14] }),
  light('light.eettafel', 'Eettafel', 'on', { brightness: 49 }),
  light('light.garage', 'Garage', 'off', { brightness: null }),
  light('light.voordeur', 'Voordeur', 'unavailable', { restored: true }),
  light('light.tuin', 'Tuin', 'unknown'),
]) states[e.entity_id] = e;

// system data store (frontend/*_system_data), persisted per browser for convenience
const store: Record<string, unknown> = JSON.parse(sessionStorage.getItem('fake-system-data') ?? '{}');
const subs = new Map<string, Set<(m: unknown) => void>>();

export const control = { failNext: false, delay: 900, storageUnsupported: params.has('nostorage') };

const connection = {
  async sendMessagePromise<T>(msg: Record<string, unknown>): Promise<T> {
    if (control.storageUnsupported) throw { code: 'unknown_command', message: 'Unknown command.' };
    const key = String(msg.key);
    if (msg.type === 'frontend/get_system_data') return { value: store[key] ?? null } as T;
    if (msg.type === 'frontend/set_system_data') {
      if (!hass.user?.is_admin) throw { code: 'unauthorized', message: 'Unauthorized' };
      store[key] = msg.value;
      sessionStorage.setItem('fake-system-data', JSON.stringify(store));
      subs.get(key)?.forEach((cb) => cb({ value: msg.value }));
      return null as T;
    }
    throw { code: 'unknown_command', message: `Unknown command ${msg.type}` };
  },
  async subscribeMessage<T>(cb: (m: T) => void, msg: Record<string, unknown>) {
    if (control.storageUnsupported) throw { code: 'unknown_command', message: 'Unknown command.' };
    const key = String(msg.key);
    if (!subs.has(key)) subs.set(key, new Set());
    subs.get(key)!.add(cb as (m: unknown) => void);
    return async () => void subs.get(key)?.delete(cb as (m: unknown) => void);
  },
};

function update(id: string, patch: Partial<HassEntity> & { attributes?: Record<string, unknown> }) {
  const old = states[id];
  states[id] = { ...old, ...patch, attributes: { ...old.attributes, ...patch.attributes }, last_updated: now() };
  publish();
}

const hass: HomeAssistant = {
  states,
  connection,
  user: { id: 'stefan', name: 'Stefan', is_admin: !params.has('user') },
  language: 'nl',
  locale: { language: 'nl' },
  themes: { darkMode: mode === 'dark', theme: 'helder' },
  async callService(domain, service, data) {
    await new Promise((r) => setTimeout(r, control.delay));
    if (control.failNext) {
      control.failNext = false;
      throw new Error('Simulated failure');
    }
    const id = String(data?.entity_id);
    if (domain === 'light' && service === 'turn_on')
      update(id, { state: 'on', attributes: { brightness: data?.brightness ?? states[id].attributes.brightness ?? 255 } });
    if (domain === 'light' && service === 'turn_off') update(id, { state: 'off', attributes: { brightness: null } });
    return undefined;
  },
  formatEntityState(s) {
    return ({ on: 'Aan', off: 'Uit', unavailable: 'Niet beschikbaar', unknown: 'Onbekend' } as Record<string, string>)[s.state] ?? s.state;
  },
};

const root = document.createElement('home-assistant') as HTMLElement & { hass?: HomeAssistant };
document.body.prepend(root);
function publish() {
  // HA hands out a new hass object on every change
  Object.assign(hass, { states: { ...states } });
  root.hass = { ...hass };
  document.querySelectorAll<HTMLElement & { hass?: HomeAssistant }>('[data-hass]').forEach((el) => (el.hass = root.hass));
}
publish();

// Apply the helder theme like HA does: inline variables on <html> (defaults from the yaml generator).
const t = computeTokens(DEFAULT_SETTINGS, mode);
const vars: Record<string, string> = { 'helder-theme-active': '1', 'helder-mode': mode };
for (const [k, v] of Object.entries(t)) vars[`helder-${k}`] = v;
Object.assign(vars, haVariables(t, mode));
for (const [k, v] of Object.entries(vars)) document.documentElement.style.setProperty(`--${k}`, v);

// Stubs for HA elements used by cards
const BULB = 'M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9z';
class StubIcon extends HTMLElement {
  connectedCallback() {
    this.style.display = 'inline-flex';
    this.innerHTML = `<svg viewBox="0 0 24 24" style="width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)"><path fill="currentColor" d="${BULB}"/></svg>`;
  }
}
customElements.define('ha-state-icon', StubIcon);
customElements.define('ha-icon', class extends StubIcon {});

Object.assign(window, { __fake: { control, hass: () => root.hass, update } });
