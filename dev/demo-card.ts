// Test card for the foundation (dev only, not shipped): exercises the base class and shared UI parts with a light
// entity — head, toggle, brightness slider, glow, busy state and the unavailable / unknown / missing states.
import { html } from 'lit';
import { HelderBaseCard, type BaseCardConfig } from '../src/core/base-card';
import { numAttr } from '../src/core/entity';
import { availabilityText } from '../src/core/format';
import { registerCard } from '../src/core/register';
import { head, icon, slider, toggle } from '../src/ui/parts';

class HelderDemoCard extends HelderBaseCard<BaseCardConfig> {
  protected override validateConfig(config: BaseCardConfig) {
    if (!config.entity) throw new Error('Kies een entiteit');
    return config;
  }

  private get on() {
    return this.pendingValue('on', this.stateObj?.state === 'on');
  }

  private get pct() {
    const bri = this.pendingValue('bri', numAttr(this.stateObj, 'brightness'));
    return this.on && bri !== null ? Math.round((bri / 255) * 100) : 0;
  }

  protected override cardClasses() {
    return { active: this.available && this.on, lit: this.available && this.on };
  }

  protected override cardStyle(): Record<string, string> {
    const rgb = this.stateObj?.attributes.rgb_color as number[] | undefined;
    return {
      '--state': 'var(--helder-state-light)',
      ...(rgb ? { '--lamp': `rgb(${rgb.join(', ')})` } : {}),
      '--bri-f': String(this.pct / 100),
    };
  }

  private setOn(on: boolean) {
    const id = this.entityId!;
    void this.perform('on', on, () => this.hass!.callService('light', on ? 'turn_on' : 'turn_off', { entity_id: id }));
  }

  private setPct(p: number) {
    const id = this.entityId!;
    const bri = Math.round((p / 100) * 255);
    if (p === 0) return this.setOn(false);
    void this.perform('on', true, async () => undefined);
    void this.perform('bri', bri, () => this.hass!.callService('light', 'turn_on', { entity_id: id, brightness: bri }));
  }

  protected override renderCard() {
    const ok = this.available;
    const sub = ok ? (this.on ? `Aan · ${this.pct} %` : 'Uit') : availabilityText(this.availability);
    return html`${head({
        icon: icon(this.hass, this.stateObj),
        name: this.name,
        sub: this.statusText(sub),
        value: toggle(this.on, 'Aan/uit', () => this.setOn(!this.on), !ok),
      })}
      ${slider({ value: ok ? this.pct : null, label: 'Helderheid', disabled: !ok, onChange: (v) => this.setPct(v) })}`;
  }
}

registerCard({ type: 'helder-demo-card', name: 'Helder demo (dev)' }, HelderDemoCard);
