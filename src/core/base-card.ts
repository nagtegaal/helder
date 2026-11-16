// Base class for every Helder card.
//
// A card implements `renderCard()` (the content inside the glass surface) and, when needed, `validateConfig()`.
// The base class provides: hass/config handling, entity resolution and availability, measured width, tap/hold
// actions (default more-info), the busy state for service calls (optimistic value, pulse until HA confirms,
// roll back + shake on failure), colour usage (global default from the settings page, per-card override), and
// sizing hooks for the sections and masonry views.

import { html, LitElement, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import { getSettings, subscribeSettings } from '../settings/store';
import type { ColorMode } from '../tokens/settings';
import { actionHandler, type ActionKind, type ActionsConfig, handleAction, hasAction, haptic } from './actions';
import { availability, type Availability, domainOf, entityName } from './entity';
import { provideHass } from './hass';
import type { GridOptions, HassEntity, HomeAssistant, LovelaceCardConfig } from './types';
import { cardStyles } from '../ui/styles';

export interface BaseCardConfig extends LovelaceCardConfig, ActionsConfig {
  entity?: string;
  name?: string;
  icon?: string;
  /** Colour usage for this card; absent = the default from the settings page. */
  color_mode?: ColorMode;
}

interface Pending {
  value: unknown;
  /** last_updated of the entity when the call was made; a newer one confirms the change. */
  since: string | undefined;
  entityId: string | undefined;
  resolved: boolean;
  timer: number;
}

export const FAILED_TEXT = 'Mislukt, teruggezet';
const PENDING_TIMEOUT_MS = 15000;
const FAILED_SHOW_MS = 2500;

export abstract class HelderBaseCard<C extends BaseCardConfig = BaseCardConfig> extends LitElement {
  static override styles = cardStyles;

  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _width: { state: true },
    _pending: { state: true },
    _failed: { state: true },
  };

  hass?: HomeAssistant;
  protected _config?: C;
  /** Measured content width in px (0 until measured). Prefer container queries in CSS for layout. */
  protected _width = 0;
  protected _pending = new Map<string, Pending>();
  protected _failed = false;

  private _resize?: ResizeObserver;
  private _unsubSettings?: () => void;
  private _failedTimer?: number;

  // ---------- configuration ----------

  setConfig(config: C) {
    if (!config || typeof config !== 'object') throw new Error('Ongeldige configuratie');
    this._config = this.validateConfig({ ...config });
  }

  /** Override to validate and normalise; throw an Error with a readable message to show HA's error card. */
  protected validateConfig(config: C): C {
    return config;
  }

  protected get config(): C {
    if (!this._config) throw new Error('Kaart heeft nog geen configuratie');
    return this._config;
  }

  // ---------- entity ----------

  protected get entityId(): string | undefined {
    return this._config?.entity;
  }

  protected get stateObj(): HassEntity | undefined {
    const id = this.entityId;
    return id ? this.hass?.states[id] : undefined;
  }

  protected get availability(): Availability {
    return availability(this.stateObj);
  }

  protected get available(): boolean {
    return this.availability === 'ok';
  }

  protected get name(): string {
    return entityName(this.hass, this.entityId, this._config?.name);
  }

  protected get domain(): string {
    return this.entityId ? domainOf(this.entityId) : '';
  }

  // ---------- colour usage ----------

  protected get colorMode(): ColorMode {
    return this._config?.color_mode ?? getSettings().colorMode;
  }

  /** Local overrides of the state colours when this card deviates from the global default. */
  private colorModeStyle(): Record<string, string> {
    const mode = this._config?.color_mode;
    if (!mode) return {};
    const pick = (domainToken: string) => (mode === 'accent' ? 'var(--helder-color-accent)' : `var(${domainToken})`);
    return {
      '--helder-state-light': pick('--helder-color-light'),
      '--helder-state-heat': pick('--helder-color-heat'),
      '--helder-state-cool': pick('--helder-color-cool'),
    };
  }

  // ---------- busy state ----------

  /**
   * Runs a service call with an optimistic value: `pendingValue(key, actual)` returns `value` until HA confirms
   * (the entity updates after the call) or 15 s pass. On error the value rolls back and the card shakes.
   */
  protected async perform(key: string, value: unknown, call: () => Promise<unknown>, entityId = this.entityId) {
    const prev = this._pending.get(key);
    if (prev) clearTimeout(prev.timer);
    const entry: Pending = {
      value,
      since: entityId ? this.hass?.states[entityId]?.last_updated : undefined,
      entityId,
      resolved: false,
      timer: window.setTimeout(() => this.clearPending(key, entry), PENDING_TIMEOUT_MS),
    };
    this._pending = new Map(this._pending).set(key, entry);
    haptic(this);
    try {
      await call();
      entry.resolved = true;
      this.confirmPending();
    } catch (err) {
      console.warn('[helder] service call failed', err);
      this.clearPending(key, entry);
      haptic(this, 'failure');
      this.showFailed();
    }
  }

  protected pendingValue<T>(key: string, actual: T): T {
    const p = this._pending.get(key);
    return p ? (p.value as T) : actual;
  }

  protected isPending(key?: string): boolean {
    return key ? this._pending.has(key) : this._pending.size > 0;
  }

  /** Secondary text, replaced by the failure message for a moment after a failed call. */
  protected statusText(normal: string): string {
    return this._failed ? FAILED_TEXT : normal;
  }

  private clearPending(key: string, entry: Pending) {
    clearTimeout(entry.timer);
    if (this._pending.get(key) !== entry) return;
    const next = new Map(this._pending);
    next.delete(key);
    this._pending = next;
  }

  private confirmPending() {
    for (const [key, p] of this._pending) {
      if (!p.resolved) continue;
      const now = p.entityId ? this.hass?.states[p.entityId]?.last_updated : undefined;
      if (!p.entityId || now !== p.since) this.clearPending(key, p);
    }
  }

  private showFailed() {
    this._failed = false;
    clearTimeout(this._failedTimer);
    // restart the shake animation
    requestAnimationFrame(() => {
      this._failed = true;
      this._failedTimer = window.setTimeout(() => (this._failed = false), FAILED_SHOW_MS);
    });
  }

  // ---------- actions ----------

  protected get actionsConfig(): ActionsConfig {
    return this._config ?? {};
  }

  private onAction(ev: CustomEvent<{ action: ActionKind }>) {
    if (this.hass) void handleAction(this, this.hass, this.actionsConfig, ev.detail.action);
  }

  // ---------- rendering ----------

  /** The card content. */
  protected abstract renderCard(): TemplateResult | typeof nothing;

  /** Extra classes on the surface (e.g. `active`, `heating`, `lit`). */
  protected cardClasses(): Record<string, boolean> {
    return {};
  }

  /** Extra inline custom properties on the surface (e.g. `--state`, `--lamp`). */
  protected cardStyle(): Record<string, string> {
    return {};
  }

  protected override render() {
    if (!this._config) return nothing;
    const cfg = this.actionsConfig;
    const tap = hasAction(cfg, 'tap');
    const hold = hasAction(cfg, 'hold');
    const doubleTap = hasAction(cfg, 'double_tap');
    const clickable = tap || hold || doubleTap;
    return html`<div
      class=${classMap({
        card: true,
        clickable,
        na: !this.available,
        pending: this.isPending(),
        failed: this._failed,
        ...this.cardClasses(),
      })}
      style=${styleMap({ ...this.colorModeStyle(), ...this.cardStyle() })}
      role=${clickable ? 'button' : 'group'}
      tabindex=${clickable ? '0' : '-1'}
      aria-label=${this.name}
      ${actionHandler({ hold, doubleTap })}
      @action=${this.onAction}
    >
      ${this.renderCard()}
    </div>`;
  }

  // ---------- lifecycle ----------

  protected override willUpdate(changed: PropertyValues) {
    if (changed.has('hass') && this.hass) {
      provideHass(this.hass);
      if (this._pending.size) this.confirmPending();
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this._unsubSettings = subscribeSettings(() => this.requestUpdate());
    this._resize = new ResizeObserver((entries) => {
      const w = Math.round(entries[0]?.contentRect.width ?? 0);
      if (w !== this._width) this._width = w;
    });
    this._resize.observe(this);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._unsubSettings?.();
    this._resize?.disconnect();
    for (const p of this._pending.values()) clearTimeout(p.timer);
    this._pending = new Map();
  }

  // ---------- sizing (HA card API) ----------

  /** Masonry view height in units of 50 px. */
  getCardSize(): number | Promise<number> {
    return 2;
  }

  /** Sections view: 12 columns per section; 6 = half width (about 152-211 px on a phone). */
  getGridOptions(): GridOptions {
    return { columns: 6, rows: 'auto', min_columns: 3 };
  }
}
