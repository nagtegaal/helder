// Shared render helpers for card parts. Pure templates; behaviour lives in the card.

import { html, nothing, svg, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { HassEntity, HomeAssistant } from '../core/types';

const CHEVRON = svg`<path fill="currentColor" d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z"/>`;

/** Entity icon via HA's own <ha-state-icon> (follows state and device class); a fixed mdi icon when given. */
export function icon(hass: HomeAssistant | undefined, stateObj: HassEntity | undefined, mdi?: string): TemplateResult {
  if (mdi) return html`<ha-icon .icon=${mdi}></ha-icon>`;
  return html`<ha-state-icon .hass=${hass} .stateObj=${stateObj}></ha-state-icon>`;
}

export interface HeadOptions {
  icon: TemplateResult | typeof nothing;
  name: string;
  sub?: string | TemplateResult;
  value?: string | TemplateResult | typeof nothing;
  unit?: string;
}

export const head = (o: HeadOptions) => html`
  <div class="head">
    <div class="icon">${o.icon}</div>
    <div class="text">
      <div class="name">${o.name}</div>
      ${o.sub !== undefined ? html`<div class="sub">${o.sub}</div>` : nothing}
    </div>
    ${o.value === undefined || o.value === nothing
      ? nothing
      : html`<div class="value">${o.value}${o.unit ? html`<span class="unit">${o.unit}</span>` : nothing}</div>`}
  </div>
`;

export interface SliderOptions {
  value: number | null;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  label: string;
  /** Called while dragging (for a live readout). */
  onInput?: (value: number) => void;
  /** Called on release: send the service call here. */
  onChange: (value: number) => void;
}

const fraction = (v: number, min: number, max: number) => (max > min ? ((v - min) / (max - min)) * 100 : 0);

/** Range slider with the filled part in the state colour. Sends on release, not while dragging. */
export function slider(o: SliderOptions) {
  const min = o.min ?? 0;
  const max = o.max ?? 100;
  const v = o.value ?? min;
  const update = (ev: Event) => {
    const el = ev.target as HTMLInputElement;
    el.style.setProperty('--p', `${fraction(+el.value, min, max)}%`);
    o.onInput?.(+el.value);
  };
  return html`<input
    class="slider"
    type="range"
    min=${min}
    max=${max}
    step=${o.step ?? 1}
    .value=${String(v)}
    style="--p:${fraction(v, min, max)}%"
    aria-label=${o.label}
    ?disabled=${o.disabled}
    @input=${update}
    @change=${(ev: Event) => o.onChange(+(ev.target as HTMLInputElement).value)}
    @click=${(ev: Event) => ev.stopPropagation()}
  />`;
}

export interface ButtonOptions {
  label: string;
  content: TemplateResult | string;
  disabled?: boolean;
  onClick: () => void;
}

export const button = (o: ButtonOptions) => html`<button
  class="btn"
  aria-label=${o.label}
  title=${o.label}
  ?disabled=${o.disabled}
  @click=${(ev: Event) => {
    ev.stopPropagation();
    o.onClick();
  }}
>
  ${o.content}
</button>`;

export interface ChipOption<T> {
  value: T;
  label: string;
  detail?: string;
}

export function chips<T>(options: ChipOption<T>[], selected: T | undefined, onSelect: (v: T) => void, disabled = false) {
  return html`<div class="chips">
    ${options.map(
      (c) => html`<button
        class="chip"
        aria-pressed=${String(c.value === selected)}
        ?disabled=${disabled}
        @click=${(ev: Event) => {
          ev.stopPropagation();
          onSelect(c.value);
        }}
      >
        ${c.label}${c.detail ? html`<small>${c.detail}</small>` : nothing}
      </button>`,
    )}
  </div>`;
}

/** Same choices as chips, as one button with a menu (for narrow cards). */
export function dropdown<T>(
  options: ChipOption<T>[],
  selected: T | undefined,
  onSelect: (v: T) => void,
  placeholder: string,
  disabled = false,
) {
  const current = options.find((o) => o.value === selected);
  return html`<label class="dd">
    <span class="dd-label ${current ? '' : 'empty'}">${current?.label ?? placeholder}</span>
    <svg viewBox="0 0 24 24" aria-hidden="true">${CHEVRON}</svg>
    <select
      aria-label=${placeholder}
      ?disabled=${disabled}
      @click=${(ev: Event) => ev.stopPropagation()}
      @change=${(ev: Event) => {
        const i = (ev.target as HTMLSelectElement).selectedIndex - 1;
        if (i >= 0) onSelect(options[i].value);
      }}
    >
      <option value="" ?selected=${!current} disabled>${placeholder}</option>
      ${options.map((o) => html`<option ?selected=${o === current}>${o.label}</option>`)}
    </select>
  </label>`;
}

export const toggle = (checked: boolean, label: string, onToggle: () => void, disabled = false) => html`<button
  class="switch"
  role="switch"
  aria-checked=${String(checked)}
  aria-label=${ifDefined(label)}
  ?disabled=${disabled}
  @click=${(ev: Event) => {
    ev.stopPropagation();
    onToggle();
  }}
></button>`;
