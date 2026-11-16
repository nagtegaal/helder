// The "Helder" settings page (registered as an HA panel via panel_custom, admins only).
// Edits a draft with a live preview in light and dark; "Opslaan" stores it centrally for all users and devices.

import { css, html, LitElement, nothing, type PropertyValues } from 'lit';
import { provideHass } from '../core/hass';
import { defineElement } from '../core/register';
import type { HomeAssistant } from '../core/types';
import { cardStyles } from '../ui/styles';
import { head, slider, toggle } from '../ui/parts';
import { isHex } from '../tokens/color';
import { paletteById } from '../tokens/palette';
import {
  DEFAULT_SETTINGS,
  GLASS_PRESETS,
  GLOSS_PRESETS,
  LIMITS,
  RADII,
  type HelderSettings,
  type Mode,
} from '../tokens/settings';
import { computeTokens, resolveColor } from '../tokens/tokens';
import { declarations } from './apply';
import './color-picker';
import type { SpecialOption, SlotKind } from './color-picker';
import { getSettings, getStoreStatus, saveSettings, subscribeSettings } from './store';

type SlotKey = 'accent' | 'gradientLight' | 'baseLight' | 'gradientDark' | 'baseDark';

const SLOTS: { key: SlotKey; label: string; kind: SlotKind; mode: Mode }[] = [
  { key: 'accent', label: 'Accentkleur', kind: 'accent', mode: 'light' },
  { key: 'gradientLight', label: 'Verlopen, licht', kind: 'gradient', mode: 'light' },
  { key: 'baseLight', label: 'Basiskleur, licht', kind: 'base', mode: 'light' },
  { key: 'gradientDark', label: 'Verlopen, donker', kind: 'gradient', mode: 'dark' },
  { key: 'baseDark', label: 'Basiskleur, donker', kind: 'base', mode: 'dark' },
];

const WARM_SWATCH = 'linear-gradient(135deg, #ffb078, #f8efe5)';
const SPECIALS: Record<SlotKind, SpecialOption[]> = {
  accent: [],
  gradient: [
    { value: 'accent', label: 'Zelfde als accent', swatch: 'conic-gradient(#ff6d00, #2563eb, #16a34a, #ff6d00)' },
    { value: 'warm', label: 'Warm (oorspronkelijk)', swatch: WARM_SWATCH },
  ],
  base: [
    { value: 'follow', label: 'Volgt de verlopen', swatch: 'linear-gradient(135deg, #ddd, #fff)' },
    { value: 'warm', label: 'Warm (oorspronkelijk)', swatch: WARM_SWATCH },
  ],
};

const DEPTHS = [
  { value: 'border', label: 'Alleen rand' },
  { value: 'shadow', label: 'Alleen schaduw' },
  { value: 'both', label: 'Rand + schaduw' },
] as const;

const COLOR_MODES = [
  { value: 'domain', label: 'Statuskleur per domein' },
  { value: 'accent', label: 'Eén accentkleur' },
] as const;

const same = (a: HelderSettings, b: HelderSettings) => JSON.stringify(a) === JSON.stringify(b);

export class HelderSettingsPanel extends LitElement {
  static override properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    panel: { attribute: false },
    _draft: { state: true },
    _saved: { state: true },
    _picker: { state: true },
    _busy: { state: true },
    _message: { state: true },
  };

  hass?: HomeAssistant;
  narrow = false;
  panel?: unknown;

  private _saved: HelderSettings = getSettings();
  private _draft: HelderSettings = getSettings();
  private _picker?: SlotKey;
  private _busy = false;
  private _message?: { kind: 'ok' | 'error'; text: string };
  private _unsub?: () => void;

  override connectedCallback() {
    super.connectedCallback();
    this._unsub = subscribeSettings((s) => {
      // Someone (or another device) saved: follow it unless there are unsaved local edits.
      const dirty = !same(this._draft, this._saved);
      this._saved = s;
      if (!dirty) this._draft = s;
    });
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._unsub?.();
  }

  protected override willUpdate(changed: PropertyValues) {
    if (changed.has('hass')) provideHass(this.hass);
  }

  private set(patch: Partial<HelderSettings>) {
    this._draft = { ...this._draft, ...patch };
    this._message = undefined;
  }

  private async save() {
    this._busy = true;
    try {
      await saveSettings(this._draft);
      this._saved = getSettings();
      this._draft = this._saved;
      this._message = { kind: 'ok', text: 'Opgeslagen. Geldt nu voor alle gebruikers en apparaten.' };
    } catch (err) {
      const text = err instanceof Error ? err.message : (err as { message?: string })?.message;
      this._message = { kind: 'error', text: `Opslaan mislukt${text ? `: ${text}` : ''}` };
    } finally {
      this._busy = false;
    }
  }

  // ---------- describing values ----------

  private describe(slot: (typeof SLOTS)[number], value: string): { name: string; swatch: string } {
    const special = SPECIALS[slot.kind].find((s) => s.value === value);
    if (special) return { name: special.label, swatch: special.swatch };
    if (isHex(value)) return { name: `Eigen kleur ${value.toLowerCase()}`, swatch: value };
    const p = paletteById(value);
    return { name: p?.name ?? value, swatch: resolveColor(value, slot.mode) };
  }

  // ---------- rendering ----------

  private seg<T extends string | number>(
    options: readonly { value: T; label: string }[],
    current: T | undefined,
    onPick: (v: T) => void,
  ) {
    return html`<div class="seg">
      ${options.map(
        (o) =>
          html`<button aria-pressed=${String(o.value === current)} @click=${() => onPick(o.value)}>${o.label}</button>`,
      )}
    </div>`;
  }

  private range(label: string, value: number, [min, max]: readonly [number, number], step: number, unit: string, onInput: (v: number) => void) {
    return html`<label class="range">
      <span>${label}</span>
      <input
        type="range"
        min=${min}
        max=${max}
        step=${step}
        .value=${String(value)}
        @input=${(e: Event) => onInput(+(e.target as HTMLInputElement).value)}
      />
      <output>${unit === '' ? value.toFixed(2) : `${value} ${unit}`}</output>
    </label>`;
  }

  private renderColors() {
    return html`<div class="slots">
      ${SLOTS.map((slot) => {
        const d = this.describe(slot, this._draft[slot.key]);
        return html`<div class="slot">
          <span>${slot.label}</span>
          <button class="swbtn" @click=${() => (this._picker = slot.key)}>
            <i class="sw" style="background:${d.swatch}"></i>
            <span class="swname">${d.name}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M7.41 8.58 12 13.17l4.59-4.59L18 10l-6 6-6-6z" /></svg>
          </button>
        </div>`;
      })}
    </div>`;
  }

  private renderPicker() {
    const slot = SLOTS.find((s) => s.key === this._picker);
    if (!slot) return nothing;
    return html`<helder-color-picker
      .heading=${slot.label}
      .value=${this._draft[slot.key]}
      .mode=${slot.mode}
      .kind=${slot.kind}
      .specials=${SPECIALS[slot.kind]}
      .fallback=${resolveColor(this._draft.accent, 'light')}
      @pick=${(e: CustomEvent<{ value: string }>) => {
        this.set({ [slot.key]: e.detail.value } as Partial<HelderSettings>);
        this._picker = undefined;
      }}
      @close=${() => (this._picker = undefined)}
    ></helder-color-picker>`;
  }

  private glassPreset(): string | undefined {
    return Object.entries(GLASS_PRESETS).find(([, p]) => p.blur === this._draft.blur && p.fill === this._draft.fill)?.[0];
  }

  private renderPreviewStage(mode: Mode) {
    const t = computeTokens(this._draft, mode);
    const style = declarations(t, 'helder-', false) + `background: ${t['background']};`;
    const lamp = mode === 'dark' ? '#ffb15e' : '#ff9a3c';
    return html`<div class="stage" style=${style}>
      <div class="stage-title">${mode === 'dark' ? 'Donker' : 'Licht'}</div>
      <div class="cards">
        <div class="card active lit" style="--state: var(--helder-state-light); --lamp: ${lamp}; --bri-f: .7">
          ${head({ icon: bulb, name: 'Vloerlamp', sub: 'Aan · 70 %', value: nothing })}
          ${slider({ value: 70, label: 'Helderheid', onChange: () => undefined })}
        </div>
        <div class="card active heating" style="--state: var(--helder-state-heat)">
          ${head({ icon: thermo, name: 'Woonkamer', sub: 'Verwarmen', value: '20,5', unit: '°C' })}
          <div class="chips">
            <button class="chip">Eco</button><button class="chip" aria-pressed="true">Comfort</button>
          </div>
        </div>
        <div class="card active" style="--state: var(--helder-state-cover)">
          ${head({ icon: blinds, name: 'Rolluik voor', sub: 'Open', value: '60', unit: '%' })}
          ${slider({ value: 60, label: 'Positie', onChange: () => undefined })}
        </div>
        <div class="card na">
          ${head({ icon: bulb, name: 'Voordeur', sub: 'Niet beschikbaar', value: html`${toggle(false, 'Aan/uit', () => undefined, true)}` })}
        </div>
      </div>
    </div>`;
  }

  protected override render() {
    const d = this._draft;
    const dirty = !same(d, this._saved);
    const isDefault = same(d, { ...DEFAULT_SETTINGS });
    const status = getStoreStatus();
    return html`
      <div class="toolbar">
        ${this.narrow ? html`<ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>` : nothing}
        <h1>Helder</h1>
      </div>
      <div class="layout">
        <div class="form">
          ${status === 'unsupported'
            ? html`<p class="note error">
                Deze Home Assistant-versie kan de instellingen niet centraal opslaan. Helder gebruikt de standaardwaarden.
              </p>`
            : nothing}
          ${this.hass?.user && !this.hass.user.is_admin
            ? html`<p class="note">Alleen beheerders kunnen deze instellingen wijzigen.</p>`
            : nothing}

          <section>
            <h2>Kleuren</h2>
            <p class="hint">Accent en achtergrond kies je los van elkaar. De achtergrond stel je apart in voor licht en donker.</p>
            ${this.renderColors()}
          </section>

          <section>
            <h2>Kleurgebruik</h2>
            <p class="hint">Standaard voor alle kaarten; per kaart aan te passen in de kaarteditor.</p>
            ${this.seg(COLOR_MODES, d.colorMode, (v) => this.set({ colorMode: v }))}
          </section>

          <section>
            <h2>Glas</h2>
            ${this.seg(
              [
                { value: 'subtle', label: 'Subtiel' },
                { value: 'medium', label: 'Middel' },
                { value: 'strong', label: 'Sterk' },
              ],
              this.glassPreset(),
              (v) => this.set({ ...GLASS_PRESETS[v as keyof typeof GLASS_PRESETS] }),
            )}
            ${this.range('Blur', d.blur, LIMITS.blur, 1, 'px', (v) => this.set({ blur: v }))}
            ${this.range('Vulling', d.fill, LIMITS.fill, 1, '%', (v) => this.set({ fill: v }))}
            <label class="switchrow">
              <span>Verminderde transparantie voor iedereen<small>De systeeminstelling van een apparaat geldt altijd.</small></span>
              ${toggle(d.reducedTransparency, 'Verminderde transparantie', () =>
                this.set({ reducedTransparency: !d.reducedTransparency }),
              )}
            </label>
          </section>

          <section>
            <h2>Glans</h2>
            ${this.seg(
              [
                { value: GLOSS_PRESETS.none, label: 'Geen' },
                { value: GLOSS_PRESETS.soft, label: 'Zacht' },
                { value: GLOSS_PRESETS.strong, label: 'Sterk' },
              ],
              d.gloss,
              (v) => this.set({ gloss: v }),
            )}
            ${this.range('Glans', d.gloss, LIMITS.gloss, 0.05, '', (v) => this.set({ gloss: v }))}
          </section>

          <section>
            <h2>Vorm en diepte</h2>
            ${this.seg(
              RADII.map((r) => ({ value: r as number, label: `${r} px` })),
              d.radius,
              (v) => this.set({ radius: v }),
            )}
            ${this.seg(DEPTHS, d.depth, (v) => this.set({ depth: v }))}
          </section>
        </div>

        <aside class="preview" aria-label="Voorbeeld">
          ${this.renderPreviewStage('light')} ${this.renderPreviewStage('dark')}
        </aside>
      </div>

      <div class="actions">
        ${this._message ? html`<span class="msg ${this._message.kind}">${this._message.text}</span>` : html`<span class="msg">${dirty ? 'Niet opgeslagen wijzigingen' : ''}</span>`}
        <button class="pill" ?disabled=${isDefault || this._busy} @click=${() => this.set({ ...DEFAULT_SETTINGS })}>
          Standaardwaarden
        </button>
        <button class="pill" ?disabled=${!dirty || this._busy} @click=${() => this.set(this._saved)}>Annuleren</button>
        <button class="pill primary" ?disabled=${!dirty || this._busy} @click=${this.save}>
          ${this._busy ? 'Opslaan…' : 'Opslaan'}
        </button>
      </div>
      ${this.renderPicker()}
    `;
  }

  static override styles = [
    cardStyles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        color: var(--helder-color-text);
        background: var(--helder-background);
        background-attachment: fixed;
        font-family: var(--helder-font-family);
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        height: var(--header-height, 56px);
        padding: 0 16px;
        padding-top: env(safe-area-inset-top);
      }
      h1 {
        margin: 0;
        font-size: 1.4rem;
        font-weight: 400;
      }
      .layout {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 26rem);
        gap: 1.25rem;
        padding: 0 16px 8rem;
        max-width: 80rem;
        align-items: start;
      }
      @media (max-width: 860px) {
        .layout {
          grid-template-columns: minmax(0, 1fr);
        }
      }
      .form {
        display: grid;
        gap: 1rem;
      }
      section {
        display: grid;
        gap: 0.7rem;
        padding: 1rem 1.1rem 1.1rem;
        border-radius: var(--helder-radius-card);
        background: var(--helder-gloss-layer), linear-gradient(var(--helder-glass-fill), var(--helder-glass-fill));
        -webkit-backdrop-filter: var(--helder-glass-filter);
        backdrop-filter: var(--helder-glass-filter);
        border: 1px solid var(--helder-card-border);
        box-shadow: var(--helder-card-shadow);
      }
      h2 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 600;
      }
      .hint,
      .note {
        margin: 0;
        font-size: var(--helder-font-size-s);
        color: var(--helder-color-text-muted);
      }
      .note {
        padding: 0.7rem 0.9rem;
        border-radius: var(--helder-radius-control);
        background: var(--helder-control-bg);
        color: var(--helder-color-text);
      }
      .note.error {
        color: var(--helder-color-error);
      }
      .seg {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }
      .seg button,
      .pill {
        font: inherit;
        font-size: 0.9rem;
        padding: 0.4rem 0.85rem;
        border-radius: var(--helder-radius-pill);
        border: 1px solid var(--helder-control-border);
        background: transparent;
        color: var(--helder-color-text);
        cursor: pointer;
      }
      .seg button[aria-pressed='true'],
      .pill.primary {
        background: var(--helder-color-accent);
        border-color: var(--helder-color-accent);
        color: var(--helder-color-on-accent);
      }
      .pill:disabled {
        opacity: 0.45;
        cursor: default;
      }
      button:focus-visible {
        outline: var(--helder-focus-ring) solid var(--helder-color-accent);
        outline-offset: 2px;
      }
      .range {
        display: grid;
        grid-template-columns: 5.5rem 1fr 3.5rem;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.9rem;
      }
      .range input {
        width: 100%;
        accent-color: var(--helder-color-accent);
      }
      .range output {
        text-align: right;
        font-variant-numeric: tabular-nums;
        color: var(--helder-color-text-muted);
      }
      .switchrow {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        font-size: 0.9rem;
      }
      .switchrow small {
        display: block;
        color: var(--helder-color-text-muted);
        font-size: var(--helder-font-size-s);
      }
      .switchrow .switch {
        --state: var(--helder-color-accent);
        flex: none;
      }
      .slots {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(100%, 14rem), 1fr));
        gap: 0.6rem 1rem;
      }
      .slot {
        display: grid;
        gap: 0.25rem;
        min-width: 0;
      }
      .slot > span {
        font-size: var(--helder-font-size-s);
        color: var(--helder-color-text-muted);
      }
      .swbtn {
        font: inherit;
        font-size: 0.9rem;
        display: flex;
        align-items: center;
        gap: 0.55rem;
        min-width: 0;
        padding: 0.45rem 0.6rem;
        border-radius: var(--helder-radius-control);
        border: 1px solid var(--helder-control-border);
        background: var(--helder-control-bg);
        color: var(--helder-color-text);
        cursor: pointer;
        text-align: left;
      }
      .swbtn .sw {
        width: 1.4rem;
        height: 1.4rem;
        flex: none;
        border-radius: 50%;
        border: 1px solid var(--helder-control-border);
      }
      .swbtn .swname {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .swbtn svg {
        width: 1rem;
        height: 1rem;
        flex: none;
        color: var(--helder-color-text-muted);
      }
      .preview {
        position: sticky;
        top: 1rem;
        display: grid;
        gap: 0.8rem;
      }
      .stage {
        border-radius: var(--helder-radius-card);
        padding: 0.9rem;
        display: grid;
        gap: 0.6rem;
        color: var(--helder-color-text);
        border: 1px solid var(--helder-control-border);
      }
      .stage-title {
        font-size: var(--helder-font-size-s);
        color: var(--helder-color-text-muted);
      }
      .cards {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.7rem;
      }
      .actions {
        position: fixed;
        right: 0;
        bottom: 0;
        left: var(--mdc-drawer-width, 0px);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding: 0.7rem 16px calc(0.7rem + env(safe-area-inset-bottom));
        background: var(--helder-popover-bg);
        -webkit-backdrop-filter: blur(20px) saturate(170%);
        backdrop-filter: blur(20px) saturate(170%);
        border-top: 1px solid var(--helder-card-border);
      }
      .msg {
        margin-right: auto;
        font-size: var(--helder-font-size-s);
        color: var(--helder-color-text-muted);
      }
      @media (max-width: 600px) {
        .msg {
          flex-basis: 100%;
        }
      }
      .msg.error {
        color: var(--helder-color-error);
      }
    `,
  ];
}

// Inline icons for the preview (Material Design Icons paths, Apache 2.0).
const svgIcon = (d: string) => html`<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d=${d} /></svg>`;
const bulb = svgIcon('M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7M9 21a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1H9z');
const thermo = svgIcon('M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0m-3-9a1 1 0 0 1 1 1v3h-2V5a1 1 0 0 1 1-1');
const blinds = svgIcon('M3 4h18v2h-1v10h-2V6H6v10H4V6H3zm4 3h10v2H7zm0 3h10v2H7zm0 3h10v2H7zm4 4h2v3h-2z');

defineElement('helder-settings-panel', HelderSettingsPanel);
