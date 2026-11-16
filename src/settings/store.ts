// Central settings store. Settings live in HA's frontend system storage (one value for all users and devices):
//   frontend/get_system_data       { key }          → { value }      (any user)
//   frontend/subscribe_system_data { key }          → events { value } (any user)
//   frontend/set_system_data       { key, value }                    (admin only)
// A copy is cached in localStorage so the theme is right on the first paint, before the websocket is ready.

import { onHass } from '../core/hass';
import type { HassConnection, HomeAssistant } from '../core/types';
import { normalizeSettings, type HelderSettings } from '../tokens/settings';

export const STORAGE_KEY = 'helder';
const CACHE_KEY = 'helder-settings';

type Listener = (s: HelderSettings) => void;

let settings: HelderSettings = readCache();
let connection: HassConnection | undefined;
let unsubscribe: (() => Promise<void>) | undefined;
const listeners = new Set<Listener>();

export type StoreStatus = 'connecting' | 'ready' | 'unsupported';
let status: StoreStatus = 'connecting';

function readCache(): HelderSettings {
  try {
    return normalizeSettings(JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null'));
  } catch {
    return normalizeSettings(null);
  }
}

function writeCache(s: HelderSettings) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(s));
  } catch {
    /* private mode or blocked storage: the cache is only an optimisation */
  }
}

function set(raw: unknown) {
  const next = normalizeSettings(raw);
  if (JSON.stringify(next) === JSON.stringify(settings)) return;
  settings = next;
  writeCache(next);
  listeners.forEach((l) => l(next));
}

export const getSettings = (): HelderSettings => settings;
export const getStoreStatus = (): StoreStatus => status;

export function subscribeSettings(cb: Listener): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

async function connect(conn: HassConnection) {
  if (conn === connection) return;
  connection = conn;
  if (unsubscribe) unsubscribe().catch(() => undefined);
  unsubscribe = undefined;
  try {
    const res = await conn.sendMessagePromise<{ value: unknown }>({ type: 'frontend/get_system_data', key: STORAGE_KEY });
    set(res?.value ?? null);
    unsubscribe = await conn.subscribeMessage<{ value: unknown }>((ev) => set(ev?.value ?? null), {
      type: 'frontend/subscribe_system_data',
      key: STORAGE_KEY,
    });
    status = 'ready';
  } catch (err) {
    // Older HA without system data: keep cached/default settings.
    status = 'unsupported';
    console.warn('[helder] settings storage unavailable, using defaults', err);
  }
  listeners.forEach((l) => l(settings));
}

/** Saves settings for everyone. Rejects for non-admins (HA enforces this server side). */
export async function saveSettings(next: HelderSettings): Promise<void> {
  if (!connection) throw new Error('Geen verbinding met Home Assistant');
  const value = normalizeSettings(next);
  await connection.sendMessagePromise({ type: 'frontend/set_system_data', key: STORAGE_KEY, value });
  set(value);
}

let started = false;
export function startSettingsStore() {
  if (started) return;
  started = true;
  onHass((hass: HomeAssistant) => {
    if (hass.connection) void connect(hass.connection);
  });
}
