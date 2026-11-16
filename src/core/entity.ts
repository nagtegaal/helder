// Entity resolution and availability.

import type { HassEntity, HomeAssistant } from './types';

export type Availability = 'ok' | 'unavailable' | 'unknown' | 'missing';

export const domainOf = (entityId: string): string => entityId.split('.', 1)[0] ?? '';

export function availability(stateObj: HassEntity | undefined): Availability {
  if (!stateObj) return 'missing';
  if (stateObj.state === 'unavailable') return 'unavailable';
  if (stateObj.state === 'unknown') return 'unknown';
  return 'ok';
}

/** Display name: card config > entity registry name > friendly_name > entity id. */
export function entityName(hass: HomeAssistant | undefined, entityId: string | undefined, override?: unknown): string {
  if (typeof override === 'string' && override.trim()) return override;
  if (!entityId) return '';
  const stateObj = hass?.states[entityId];
  const fromState = stateObj?.attributes.friendly_name;
  if (typeof fromState === 'string' && fromState) return fromState;
  const fromRegistry = hass?.entities?.[entityId]?.name;
  if (fromRegistry) return fromRegistry;
  return entityId;
}

/** Numeric attribute or null when absent / not a number. */
export function numAttr(stateObj: HassEntity | undefined, attr: string): number | null {
  const v = stateObj?.attributes?.[attr];
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

/** Bit test on `supported_features`. */
export const supports = (stateObj: HassEntity | undefined, feature: number): boolean =>
  ((stateObj?.attributes?.supported_features ?? 0) & feature) !== 0;
