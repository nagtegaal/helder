// Formatting. Prefers HA's own formatters (localised, unit-aware) and falls back to Intl.

import { availability } from './entity';
import type { HassEntity, HomeAssistant } from './types';

/** Placeholder for values that cannot be shown (unavailable / unknown / missing / null attribute). */
export const NO_VALUE = '—';

const locale = (hass?: HomeAssistant) => hass?.locale?.language ?? hass?.language ?? navigator.language ?? 'nl';

export function formatNumber(hass: HomeAssistant | undefined, value: number | null | undefined, digits?: number): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return NO_VALUE;
  const opts: Intl.NumberFormatOptions =
    digits === undefined ? { maximumFractionDigits: 1 } : { minimumFractionDigits: digits, maximumFractionDigits: digits };
  try {
    return new Intl.NumberFormat(locale(hass), opts).format(value);
  } catch {
    return String(value);
  }
}

export function formatState(hass: HomeAssistant | undefined, stateObj: HassEntity | undefined): string {
  if (availability(stateObj) !== 'ok' || !stateObj) return NO_VALUE;
  return hass?.formatEntityState?.(stateObj) ?? stateObj.state;
}

export function formatAttribute(hass: HomeAssistant | undefined, stateObj: HassEntity | undefined, attr: string): string {
  const v = stateObj?.attributes?.[attr];
  if (availability(stateObj) !== 'ok' || !stateObj || v === null || v === undefined) return NO_VALUE;
  return hass?.formatEntityAttributeValue?.(stateObj, attr) ?? String(v);
}

export const formatPercent = (hass: HomeAssistant | undefined, v: number | null | undefined) =>
  v === null || v === undefined ? NO_VALUE : `${formatNumber(hass, Math.round(v))} %`;

export function temperatureUnit(hass: HomeAssistant | undefined, stateObj?: HassEntity): string {
  return stateObj?.attributes?.unit_of_measurement ?? hass?.config?.unit_system?.temperature ?? '°C';
}

/** Secondary text for an entity that cannot be used. Layout never changes; only this text and the colours. */
export function availabilityText(a: 'ok' | 'unavailable' | 'unknown' | 'missing'): string {
  return { ok: '', unavailable: 'Niet beschikbaar', unknown: 'Onbekend', missing: 'Entiteit ontbreekt' }[a];
}
