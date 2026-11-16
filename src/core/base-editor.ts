// Base class for card editors, built on HA's own <ha-form> (same look as HA's built-in editors).
// A card editor returns its schema; the colour usage field is added for every card.

import { html, LitElement, nothing } from 'lit';
import { getSettings } from '../settings/store';
import { fireEvent } from './actions';
import type { HomeAssistant, LovelaceCardConfig } from './types';

export type FormSchema = Record<string, unknown>;

const COLOR_MODE_LABEL = { domain: 'statuskleur per domein', accent: 'accentkleur' } as const;

export function colorModeSchema(): FormSchema {
  const current = COLOR_MODE_LABEL[getSettings().colorMode];
  return {
    name: 'color_mode',
    selector: {
      select: {
        mode: 'dropdown',
        options: [
          { value: '', label: `Volgt de instellingen (nu: ${current})` },
          { value: 'domain', label: 'Statuskleur per domein' },
          { value: 'accent', label: 'Eén accentkleur' },
        ],
      },
    },
  };
}

export const COMMON_LABELS: Record<string, string> = {
  entity: 'Entiteit',
  name: 'Naam',
  icon: 'Icoon',
  color_mode: 'Kleurgebruik',
  tap_action: 'Actie bij tikken',
  hold_action: 'Actie bij vasthouden',
};

export abstract class HelderBaseEditor<C extends LovelaceCardConfig = LovelaceCardConfig> extends LitElement {
  static override properties = { hass: { attribute: false }, _config: { state: true } };

  hass?: HomeAssistant;
  protected _config?: C;

  setConfig(config: C) {
    this._config = config;
  }

  /** The card's own fields; the colour usage field is appended automatically. */
  protected abstract schema(): FormSchema[];

  protected labels(): Record<string, string> {
    return {};
  }

  protected override render() {
    if (!this.hass || !this._config) return nothing;
    const labels = { ...COMMON_LABELS, ...this.labels() };
    const data = { color_mode: '', ...this._config };
    return html`<ha-form
      .hass=${this.hass}
      .data=${data}
      .schema=${[...this.schema(), colorModeSchema()]}
      .computeLabel=${(s: { name: string }) => labels[s.name] ?? s.name}
      @value-changed=${this.changed}
    ></ha-form>`;
  }

  private changed(ev: CustomEvent<{ value: C }>) {
    ev.stopPropagation();
    const config = { ...ev.detail.value } as Record<string, unknown>;
    if (!config.color_mode) delete config.color_mode;
    this._config = config as C;
    fireEvent(this, 'config-changed', { config });
  }
}
