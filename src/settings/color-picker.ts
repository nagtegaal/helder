// Colour picker dialog: special options, the fixed palette (colours, light, grey) and a custom colour via an
// HSV colour wheel with brightness, hex input and a preview in light and dark.

import { css, html, LitElement, nothing, type PropertyValues } from 'lit';
import { hexToHsv, hexToRgb, hsvToHex, isHex, onColor } from '../tokens/color';
import { PALETTE, type PaletteGroup } from '../tokens/palette';
import type { Mode } from '../tokens/settings';
import { resolveColor, WARM_BASE } from '../tokens/tokens';
import { defineElement } from '../core/register';

export interface SpecialOption {
  value: string;
  label: string;
  swatch: string;
}

export type SlotKind = 'accent' | 'gradient' | 'base';

const GROUPS: [PaletteGroup, string][] = [
  ['color', 'Kleuren'],
  ['light', 'Licht'],
  ['grey', 'Grijs'],
];

export class HelderColorPicker extends LitElement {
  static override properties = {
    heading: {},
    value: {},
    mode: {},
    kind: {},
    specials: { attribute: false },
    fallback: {},
    _h: { state: true },
    _s: { state: true },
    _v: { state: true },
    _hex: { state: true },
  };

  heading = '';
  value = '';
  mode: Mode = 'light';
  kind: SlotKind = 'accent';
  specials: SpecialOption[] = [];
  /** Colour to start the wheel from when the current value is not a colour (e.g. "follow"). */
  fallback = '#ff6d00';

  private _h = 0;
  private _s = 1;
  private _v = 1;
  private _hex = '';
  private _drawnV = -1;

  protected override willUpdate(changed: PropertyValues) {
    if (changed.has('value')) {
      const start = isHex(this.value)
        ? this.value
        : PALETTE.some((p) => p.id === this.value)
          ? resolveColor(this.value, 'light')
          : this.fallback;
      [this._h, this._s, this._v] = hexToHsv(start);
      this._hex = hsvToHex(this._h, this._s, this._v);
    }
  }

  protected override firstUpdated() {
    this.shadowRoot?.querySelector<HTMLElement>('button')?.focus();
  }

  protected override updated() {
    if (this._drawnV !== this._v) this.drawWheel();
  }

  private get current() {
    return hsvToHex(this._h, this._s, this._v);
  }

  private drawWheel() {
    const cv = this.shadowRoot?.querySelector('canvas');
    const ctx = cv?.getContext('2d');
    if (!cv || !ctx) return;
    this._drawnV = this._v;
    const n = cv.width;
    const r = n / 2;
    const img = ctx.createImageData(n, n);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const dx = x - r;
        const dy = y - r;
        const d = Math.sqrt(dx * dx + dy * dy);
        const i = (y * n + x) * 4;
        if (d > r) continue;
        const [cr, cg, cb] = hexToRgb(hsvToHex(((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360, d / r, this._v));
        img.data[i] = cr;
        img.data[i + 1] = cg;
        img.data[i + 2] = cb;
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  private pickAt(ev: PointerEvent) {
    const rc = (ev.currentTarget as HTMLElement).getBoundingClientRect();
    const dx = ev.clientX - rc.left - rc.width / 2;
    const dy = ev.clientY - rc.top - rc.height / 2;
    this._h = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
    this._s = Math.min(1, Math.sqrt(dx * dx + dy * dy) / (rc.width / 2));
    this._hex = this.current;
  }

  private emit(value: string) {
    this.dispatchEvent(new CustomEvent('pick', { detail: { value } }));
  }

  private close() {
    this.dispatchEvent(new CustomEvent('close'));
  }

  private preview(mode: Mode) {
    const hex = this.current;
    const c = this.kind === 'accent' ? resolveColor(hex, mode) : hex;
    const base = mode === 'dark' ? WARM_BASE.dark : '#f8f4f0';
    const track = mode === 'dark' ? 'rgba(255,255,255,.12)' : 'rgba(90,60,30,.12)';
    return html`<div
      class="pvbox"
      style="background: radial-gradient(circle at 25% 15%, ${c}${this.kind === 'accent' ? '33' : '99'} 0, transparent 65%), ${base}"
    >
      <span class="pchip" style="background:${c};color:${onColor(c)}">${mode === 'dark' ? 'Donker' : 'Licht'}</span>
      <span class="pbar" style="background: linear-gradient(to right, ${c} 0 60%, ${track} 60%)"></span>
    </div>`;
  }

  protected override render() {
    const a = (this._h * Math.PI) / 180;
    return html`<div class="scrim" @click=${(e: Event) => e.target === e.currentTarget && this.close()}>
      <div
        class="sheet"
        role="dialog"
        aria-modal="true"
        aria-label=${this.heading}
        @keydown=${(e: KeyboardEvent) => e.key === 'Escape' && this.close()}
      >
        <h3>${this.heading}</h3>
        ${this.specials.length
          ? html`<div class="specials">
              ${this.specials.map(
                (s) => html`<button
                  class="special"
                  aria-pressed=${String(this.value === s.value)}
                  @click=${() => this.emit(s.value)}
                >
                  <i class="sw" style="background:${s.swatch}"></i>${s.label}
                </button>`,
              )}
            </div>`
          : nothing}
        ${GROUPS.map(
          ([g, label]) => html`<div class="grp">
            <span class="lbl">${label}</span>
            <div class="swgrid">
              ${PALETTE.filter((p) => p.group === g).map(
                (p) => html`<button
                  class="swatch"
                  title=${p.name}
                  aria-label=${p.name}
                  aria-pressed=${String(this.value === p.id)}
                  style="background:${this.mode === 'dark' ? p.dark : p.light}"
                  @click=${() => this.emit(p.id)}
                ></button>`,
              )}
            </div>
          </div>`,
        )}
        <div class="grp">
          <span class="lbl">Eigen kleur</span>
          <div class="wheelrow">
            <div
              class="wheel"
              aria-label="Kleurenwiel"
              @pointerdown=${(e: PointerEvent) => {
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
                this.pickAt(e);
              }}
              @pointermove=${(e: PointerEvent) => {
                if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) this.pickAt(e);
              }}
            >
              <canvas width="336" height="336"></canvas>
              <span
                class="mark"
                style="left:${50 + Math.cos(a) * this._s * 50}%;top:${50 + Math.sin(a) * this._s * 50}%;background:${this
                  .current}"
              ></span>
            </div>
            <div class="side">
              <label
                >Helderheid
                <input
                  class="rng"
                  type="range"
                  min="10"
                  max="100"
                  .value=${String(Math.round(this._v * 100))}
                  @input=${(e: Event) => {
                    this._v = +(e.target as HTMLInputElement).value / 100;
                    this._hex = this.current;
                  }}
              /></label>
              <label
                >Hex
                <input
                  class="hexin"
                  type="text"
                  maxlength="7"
                  spellcheck="false"
                  .value=${this._hex}
                  @input=${(e: Event) => {
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (isHex(v)) [this._h, this._s, this._v] = hexToHsv(v);
                  }}
              /></label>
              <div class="pv">${this.preview('light')}${this.preview('dark')}</div>
            </div>
          </div>
        </div>
        <div class="btns">
          <button class="pill" @click=${this.close}>Sluiten</button>
          <button class="pill primary" @click=${() => this.emit(this.current)}>Eigen kleur toepassen</button>
        </div>
      </div>
    </div>`;
  }

  static override styles = css`
    :host {
      position: fixed;
      inset: 0;
      z-index: 10;
      font-family: var(--helder-font-family);
    }
    * {
      box-sizing: border-box;
    }
    .scrim {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      padding: 16px;
      background: var(--helder-scrim);
    }
    .sheet {
      width: min(30rem, 100%);
      max-height: calc(100vh - 32px);
      overflow: auto;
      display: grid;
      gap: 0.9rem;
      padding: 1rem 1.1rem 1.1rem;
      color: var(--helder-color-text);
      background: var(--helder-popover-bg);
      -webkit-backdrop-filter: blur(24px) saturate(170%);
      backdrop-filter: blur(24px) saturate(170%);
      border: 1px solid var(--helder-glass-border);
      border-radius: var(--helder-radius-card);
      box-shadow: var(--helder-shadow-card);
    }
    h3 {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 600;
    }
    .grp {
      display: grid;
      gap: 0.35rem;
    }
    .lbl {
      font-size: var(--helder-font-size-s);
      color: var(--helder-color-text-muted);
    }
    .specials {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .special,
    .pill {
      font: inherit;
      font-size: 0.9rem;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.4rem 0.8rem;
      border-radius: var(--helder-radius-pill);
      border: 1px solid var(--helder-control-border);
      background: transparent;
      color: var(--helder-color-text);
      cursor: pointer;
    }
    .special[aria-pressed='true'],
    .pill.primary {
      background: var(--helder-color-accent);
      border-color: var(--helder-color-accent);
      color: var(--helder-color-on-accent);
    }
    .sw {
      width: 1.1rem;
      height: 1.1rem;
      border-radius: 50%;
      flex: none;
      border: 1px solid var(--helder-control-border);
    }
    .swgrid {
      display: grid;
      grid-template-columns: repeat(auto-fill, 1.9rem);
      gap: 0.45rem;
    }
    .swatch {
      width: 1.9rem;
      height: 1.9rem;
      border-radius: 50%;
      border: 1px solid var(--helder-control-border);
      cursor: pointer;
      padding: 0;
    }
    .swatch[aria-pressed='true'],
    button:focus-visible {
      outline: 2px solid var(--helder-color-text);
      outline-offset: 2px;
    }
    .wheelrow {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-start;
    }
    .wheel {
      width: 10.5rem;
      height: 10.5rem;
      position: relative;
      flex: none;
      touch-action: none;
      cursor: crosshair;
    }
    .wheel canvas {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      display: block;
    }
    .mark {
      position: absolute;
      width: 1rem;
      height: 1rem;
      margin: -0.5rem 0 0 -0.5rem;
      border-radius: 50%;
      border: 2px solid var(--helder-thumb);
      box-shadow: var(--helder-thumb-shadow);
      pointer-events: none;
    }
    .side {
      display: grid;
      gap: 0.55rem;
      flex: 1 1 11rem;
      min-width: 0;
    }
    .side label {
      display: grid;
      gap: 0.2rem;
      font-size: var(--helder-font-size-s);
      color: var(--helder-color-text-muted);
    }
    .rng {
      width: 100%;
      accent-color: var(--helder-color-accent);
    }
    .hexin {
      font: inherit;
      font-size: 16px;
      padding: 0.35rem 0.5rem;
      border-radius: var(--helder-radius-control);
      border: 1px solid var(--helder-control-border);
      background: var(--helder-control-bg);
      color: var(--helder-color-text);
      width: 100%;
    }
    .pv {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.4rem;
    }
    .pvbox {
      border-radius: var(--helder-radius-control);
      padding: 0.6rem;
      display: grid;
      gap: 0.45rem;
      min-height: 4.6rem;
      align-content: end;
      border: 1px solid var(--helder-control-border);
    }
    .pchip {
      justify-self: start;
      font-size: 0.8rem;
      padding: 0.25rem 0.6rem;
      border-radius: 8px;
    }
    .pbar {
      height: 0.4rem;
      border-radius: 999px;
    }
    .btns {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
  `;
}

defineElement('helder-color-picker', HelderColorPicker);
