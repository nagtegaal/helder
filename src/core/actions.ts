// Tap / hold / double-tap actions, following HA's action config format:
//   tap_action: { action: more-info | toggle | navigate | url | perform-action | call-service | none, ... }
// Defaults: tap = more-info, hold = more-info, double tap = none.

import { noChange } from 'lit';
import { Directive, directive, type ElementPart, type PartInfo, PartType } from 'lit/directive.js';
import type { HomeAssistant } from './types';

export interface ActionConfig {
  action: 'more-info' | 'toggle' | 'navigate' | 'url' | 'perform-action' | 'call-service' | 'none';
  entity?: string;
  navigation_path?: string;
  navigation_replace?: boolean;
  url_path?: string;
  perform_action?: string;
  service?: string;
  data?: Record<string, unknown>;
  service_data?: Record<string, unknown>;
  target?: Record<string, unknown>;
  confirmation?: boolean | { text?: string };
}

export type ActionKind = 'tap' | 'hold' | 'double_tap';

export interface ActionsConfig {
  entity?: string;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

const DEFAULTS: Record<ActionKind, ActionConfig> = {
  tap: { action: 'more-info' },
  hold: { action: 'more-info' },
  double_tap: { action: 'none' },
};

export function fireEvent(node: EventTarget, type: string, detail?: unknown, options: EventInit = {}) {
  node.dispatchEvent(new CustomEvent(type, { bubbles: true, composed: true, cancelable: false, ...options, detail }));
}

export function hasAction(config: ActionsConfig, kind: ActionKind): boolean {
  const a = config[`${kind}_action`] ?? DEFAULTS[kind];
  return a.action !== 'none';
}

export async function handleAction(node: HTMLElement, hass: HomeAssistant, config: ActionsConfig, kind: ActionKind) {
  const a = config[`${kind}_action`] ?? DEFAULTS[kind];
  if (a.confirmation) {
    const text = typeof a.confirmation === 'object' && a.confirmation.text ? a.confirmation.text : 'Weet je het zeker?';
    if (!window.confirm(text)) return;
  }
  const entityId = a.entity ?? config.entity;
  switch (a.action) {
    case 'more-info':
      if (entityId) fireEvent(node, 'hass-more-info', { entityId });
      break;
    case 'toggle':
      if (entityId) await hass.callService('homeassistant', 'toggle', { entity_id: entityId });
      break;
    case 'navigate':
      if (a.navigation_path) {
        if (a.navigation_replace) history.replaceState(null, '', a.navigation_path);
        else history.pushState(null, '', a.navigation_path);
        fireEvent(window, 'location-changed', { replace: !!a.navigation_replace });
      }
      break;
    case 'url':
      if (a.url_path) window.open(a.url_path, '_blank', 'noopener');
      break;
    case 'perform-action':
    case 'call-service': {
      const svc = a.perform_action ?? a.service;
      if (!svc) break;
      const [domain, service] = svc.split('.', 2);
      await hass.callService(domain, service, a.data ?? a.service_data, a.target);
      break;
    }
    case 'none':
      break;
  }
}

/** Vibration feedback where the platform supports it (HA's companion apps listen for `haptic`). */
export const haptic = (node: EventTarget, kind: 'light' | 'selection' | 'success' | 'failure' = 'light') =>
  fireEvent(node, 'haptic', kind);

// ---------- actionHandler directive ----------
// Usage: <div ${actionHandler({ hold: true, doubleTap: false })} @action=${(e) => ...}>
// Emits an `action` event with detail { action: 'tap' | 'hold' | 'double_tap' }.

const HOLD_MS = 500;
const DOUBLE_TAP_MS = 250;

interface HandlerOptions {
  hold?: boolean;
  doubleTap?: boolean;
}

type Bound = HTMLElement & { __helderActions?: HandlerOptions };

class ActionHandlerDirective extends Directive {
  constructor(part: PartInfo) {
    super(part);
    if (part.type !== PartType.ELEMENT) throw new Error('actionHandler must be used on an element');
  }

  render(_options: HandlerOptions = {}) {
    return noChange;
  }

  override update(part: ElementPart, [options = {}]: [HandlerOptions?]) {
    const el = part.element as Bound;
    if (el.__helderActions) {
      el.__helderActions = options;
      return noChange;
    }
    el.__helderActions = options;
    let holdTimer: number | undefined;
    let held = false;
    let tapTimer: number | undefined;
    let startX = 0;
    let startY = 0;
    const emit = (action: ActionKind) => fireEvent(el, 'action', { action }, { bubbles: false, composed: false });

    el.addEventListener('pointerdown', (ev: PointerEvent) => {
      if (ev.button !== 0) return;
      held = false;
      startX = ev.clientX;
      startY = ev.clientY;
      if (el.__helderActions?.hold) {
        holdTimer = window.setTimeout(() => {
          held = true;
          haptic(el);
          emit('hold');
        }, HOLD_MS);
      }
    });
    const cancel = () => {
      clearTimeout(holdTimer);
      holdTimer = undefined;
    };
    el.addEventListener('pointermove', (ev: PointerEvent) => {
      if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > 10) cancel();
    });
    el.addEventListener('pointercancel', cancel);
    el.addEventListener('pointerleave', cancel);
    el.addEventListener('contextmenu', (ev) => {
      if (el.__helderActions?.hold) ev.preventDefault();
    });
    el.addEventListener('click', (ev) => {
      cancel();
      if (held) {
        held = false;
        ev.preventDefault();
        return;
      }
      if (el.__helderActions?.doubleTap) {
        if (tapTimer) {
          clearTimeout(tapTimer);
          tapTimer = undefined;
          emit('double_tap');
        } else {
          tapTimer = window.setTimeout(() => {
            tapTimer = undefined;
            emit('tap');
          }, DOUBLE_TAP_MS);
        }
      } else emit('tap');
    });
    el.addEventListener('keydown', (ev: KeyboardEvent) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        emit('tap');
      }
    });
    return noChange;
  }
}

export const actionHandler = directive(ActionHandlerDirective);
