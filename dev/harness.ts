// Dev harness entry: fake HA first, then the real Helder entry, then the test card.
import { mode } from './fake-ha';
import '../src/index';
import './demo-card';

const params = new URLSearchParams(location.search);
const view = params.get('view') ?? 'cards';
const app = document.getElementById('app')!;
document.documentElement.dataset.mode = mode;

if (view === 'panel') {
  const panel = document.createElement('helder-settings-panel') as HTMLElement & { hass?: unknown; narrow?: boolean };
  panel.dataset.hass = '';
  panel.narrow = params.has('narrow');
  panel.hass = (document.querySelector('home-assistant') as HTMLElement & { hass?: unknown }).hass;
  app.append(panel);
} else {
  const widths = [152, 211, 360, 520];
  const entities = ['light.vloerlamp', 'light.eettafel', 'light.garage', 'light.voordeur', 'light.tuin', 'light.bestaat_niet'];
  const hass = (document.querySelector('home-assistant') as HTMLElement & { hass?: unknown }).hass;
  app.innerHTML = `<h1>Helder fundament · ${mode === 'dark' ? 'donker' : 'licht'}</h1>`;
  for (const w of widths) {
    const row = document.createElement('section');
    row.innerHTML = `<h2>${w} px</h2>`;
    const grid = document.createElement('div');
    grid.className = 'grid';
    for (const entity of entities) {
      const fig = document.createElement('figure');
      fig.style.width = `${w}px`;
      const card = document.createElement('helder-demo-card') as HTMLElement & { hass?: unknown; setConfig(c: unknown): void };
      card.dataset.hass = '';
      card.setConfig({ type: 'custom:helder-demo-card', entity, ...(entity === 'light.eettafel' ? { color_mode: 'accent' } : {}) });
      card.hass = hass;
      card.dataset.entity = entity;
      fig.append(card);
      const cap = document.createElement('figcaption');
      cap.textContent = entity.replace('light.', '') + (entity === 'light.eettafel' ? ' (accent)' : '');
      fig.append(cap);
      grid.append(fig);
    }
    row.append(grid);
    app.append(row);
  }
}
