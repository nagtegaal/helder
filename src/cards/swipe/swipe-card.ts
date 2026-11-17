// helder-swipe-card: a container that shows one card at a time. Swiping (or tapping a dot) flips the card over
// around its vertical axis to reveal the next or previous one; the dots below show the active card and the count.
//
// The flip runs in two halves (0° → ±90°, swap, ∓90° → 0°) on one flat element; the perspective comes from its
// parent. No `preserve-3d` and no `backface-visibility`: WebKit drops or flattens `backdrop-filter` in those
// cases, and the child cards are glass. During a drag the card follows the finger; on release it completes the flip
// or springs back. With `prefers-reduced-motion: reduce` there is no rotation, only a short cross-fade.
//
// All children are stacked in one grid cell, so the container is as tall as its tallest child and never changes
// size when flipping or when a child turns unavailable.

import { css, html, LitElement, nothing, type PropertyValues } from 'lit';
import { registerCard } from '../../core/register';
import type { GridOptions, HomeAssistant, LovelaceCardConfig } from '../../core/types';

export interface SwipeCardConfig extends LovelaceCardConfig {
  cards: LovelaceCardConfig[];
}

type ChildCard = HTMLElement & {
  hass?: HomeAssistant;
  setConfig?(config: LovelaceCardConfig): void;
  getCardSize?(): number | Promise<number>;
  getGridOptions?(): GridOptions;
};

interface CardHelpers {
  createCardElement(config: LovelaceCardConfig): ChildCard;
}

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<CardHelpers>;
  }
}

// Timing (not sizes or colours, so not tokens). One half of the flip; a full flip takes twice this.
const HALF_FLIP_MS = 190;
const FADE_MS = 90;
const FLIP_EASE_OUT = 'cubic-bezier(.2, .7, .3, 1)';
const FLIP_EASE_IN = 'cubic-bezier(.5, 0, .75, .4)';
/** Drag distance (fraction of the card width) for a half flip (90°). */
const DRAG_FOR_HALF_FLIP = 0.5;
/** Release past this angle, or flick faster than this, to complete the flip. */
const COMMIT_ANGLE = 30;
const COMMIT_VELOCITY = 0.35; // px/ms
/** Resistance at the first and last card. */
const EDGE_MAX_ANGLE = 10;
/** Movement before a gesture counts as a horizontal swipe or a vertical scroll. */
const SLOP_PX = 8;
/** Slight shrink at 90° for depth. */
const EDGE_SCALE = 0.94;

/** Gestures that start on these belong to the child card (sliders, buttons, dropdowns), not to the swipe. */
const INTERACTIVE = 'input, select, textarea, button, a[href], [role="slider"], [role="switch"], ha-slider, ha-control-slider, ha-select, mwc-list-item, md-select';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

class HelderSwipeCard extends LitElement {
  static override properties = {
    _config: { state: true },
    _index: { state: true },
    _cards: { state: true },
  };

  static override styles = css`
    :host {
      display: block;
      font-family: var(--helder-font-family);
    }
    .swipe {
      display: grid;
      gap: var(--helder-space-s);
      min-width: 0;
    }
    .stage {
      display: grid;
      min-width: 0;
      /* depth for the flip; the flipper itself stays flat (no preserve-3d), see the note at the top */
      perspective: calc(var(--helder-space) * 50);
      /* vertical page scroll stays with the browser; horizontal drags are ours */
      touch-action: pan-y;
      -webkit-user-select: none;
      user-select: none;
    }
    .flipper {
      display: grid;
      min-width: 0;
      transform-origin: 50% 50%;
    }
    .flipper.moving {
      will-change: transform;
    }
    .slide {
      grid-area: 1 / 1;
      min-width: 0;
      display: grid;
    }
    .slide[aria-hidden='true'] {
      visibility: hidden;
    }
    .slide > * {
      min-width: 0;
      height: 100%;
    }
    .dots {
      display: flex;
      justify-content: center;
      gap: var(--helder-space-xs);
    }
    .dot {
      width: calc(var(--helder-space) / 2);
      height: calc(var(--helder-space) / 2);
      padding: 0;
      border: 0;
      border-radius: var(--helder-radius-pill);
      cursor: pointer;
      background: var(--helder-color-text-muted);
      opacity: 0.4;
      transition:
        width var(--helder-transition),
        opacity var(--helder-transition),
        background var(--helder-transition);
    }
    .dot[aria-current='true'] {
      width: calc(var(--helder-space) * 1.4);
      opacity: 1;
      background: var(--helder-color-accent);
    }
    .dot:focus-visible {
      outline: var(--helder-focus-ring) solid var(--helder-color-accent);
      outline-offset: var(--helder-focus-ring);
    }
    .error {
      padding: var(--helder-space);
      color: var(--helder-color-text-muted);
    }
    @media (prefers-reduced-motion: reduce) {
      .dot {
        transition: none;
      }
    }
  `;

  private _hass?: HomeAssistant;
  protected _config?: SwipeCardConfig;
  protected _index = 0;
  protected _cards: ChildCard[] = [];

  private _build = 0;
  private _anim?: Animation;
  private _angle = 0;
  private _busy = false;
  private _drag?: {
    id: number;
    x0: number;
    y0: number;
    t0: number;
    lastX: number;
    lastT: number;
    v: number;
    width: number;
    swiping: boolean;
  };
  private _swallowClick = false;

  // ---------- HA card API ----------

  set hass(hass: HomeAssistant | undefined) {
    this._hass = hass;
    for (const card of this._cards) card.hass = hass;
  }

  get hass() {
    return this._hass;
  }

  setConfig(config: SwipeCardConfig) {
    if (!config || !Array.isArray(config.cards) || config.cards.length === 0) {
      throw new Error('Voeg minstens één kaart toe (cards)');
    }
    for (const c of config.cards) {
      if (!c || typeof c !== 'object' || typeof c.type !== 'string') throw new Error('Elke kaart heeft een type nodig');
    }
    this._config = { ...config, cards: config.cards.map((c) => ({ ...c })) };
    this._index = Math.min(this._index, config.cards.length - 1);
    void this.buildCards();
  }

  async getCardSize(): Promise<number> {
    const sizes = await Promise.all(this._cards.map(async (c) => (await c.getCardSize?.()) ?? 1));
    // + the dots row
    return Math.max(1, ...sizes) + 1;
  }

  getGridOptions(): GridOptions {
    const first = this._cards[0]?.getGridOptions?.();
    return { columns: first?.columns ?? 6, min_columns: first?.min_columns ?? 3, rows: 'auto' };
  }

  static async getConfigElement() {
    // Reuse HA's own stack editor (tabs per card, visual editor per child); our config has the same shape.
    const helpers = await window.loadCardHelpers?.();
    helpers?.createCardElement({ type: 'vertical-stack', cards: [] });
    await customElements.whenDefined('hui-vertical-stack-card');
    const stack = customElements.get('hui-vertical-stack-card') as unknown as { getConfigElement(): Promise<HTMLElement> };
    return stack.getConfigElement();
  }

  static getStubConfig(hass?: HomeAssistant): SwipeCardConfig {
    const ids = Object.keys(hass?.states ?? {});
    const pick = ids.filter((id) => id.startsWith('cover.')).slice(0, 3);
    const entities = pick.length >= 2 ? pick : ids.filter((id) => id.startsWith('light.')).slice(0, 3);
    return {
      type: 'custom:helder-swipe-card',
      cards: (entities.length ? entities : ['sun.sun']).map((entity) => ({ type: 'tile', entity })),
    };
  }

  // ---------- children ----------

  private async buildCards() {
    const build = ++this._build;
    const configs = this._config!.cards;
    const helpers = window.loadCardHelpers ? await window.loadCardHelpers().catch(() => undefined) : undefined;
    if (build !== this._build) return;
    this._cards = configs.map((c) => this.createCard(c, helpers));
  }

  private createCard(config: LovelaceCardConfig, helpers?: CardHelpers): ChildCard {
    let card: ChildCard;
    if (helpers) {
      card = helpers.createCardElement(config);
    } else {
      // Without HA's helpers (dev harness) only custom cards can be created.
      try {
        card = document.createElement(config.type.replace(/^custom:/, '')) as ChildCard;
        card.setConfig?.(config);
      } catch (err) {
        card = document.createElement('div') as ChildCard;
        card.className = 'error';
        card.textContent = String((err as Error)?.message ?? err);
      }
    }
    card.hass = this._hass;
    // HA asks the parent to rebuild a card that was upgraded after creation.
    card.addEventListener('ll-rebuild', (ev) => {
      ev.stopPropagation();
      const i = this._cards.indexOf(card);
      if (i < 0) return;
      void (window.loadCardHelpers?.() ?? Promise.resolve(undefined)).then((h) => {
        const next = [...this._cards];
        next[i] = this.createCard(config, h);
        this._cards = next;
      });
    });
    return card;
  }

  // ---------- navigation ----------

  private get count() {
    return this._cards.length;
  }

  /** Flip to `target`; `dir` -1 = towards the next card (swipe left), +1 = towards the previous. */
  private async flipTo(target: number, dir: -1 | 1, fromAngle = this._angle, velocity = 0) {
    if (target === this._index || target < 0 || target >= this.count || this._busy) return;
    this._busy = true;
    const flipper = this.flipper;
    try {
      if (reducedMotion() || !flipper) {
        if (flipper) await this.runAnim(flipper, [{ opacity: 1 }, { opacity: 0 }], FADE_MS, 'ease-out');
        this._index = target;
        await this.updateComplete;
        if (flipper) await this.runAnim(flipper, [{ opacity: 0 }, { opacity: 1 }], FADE_MS, 'ease-in');
      } else {
        const end = 90 * dir;
        // a fast flick finishes faster
        const rest = Math.abs(end - fromAngle) / 90;
        const speedUp = Math.min(1, 0.35 / Math.max(Math.abs(velocity), 0.35));
        await this.runAnim(flipper, [frame(fromAngle), frame(end)], HALF_FLIP_MS * rest * speedUp + 40, FLIP_EASE_IN);
        this._index = target;
        await this.updateComplete;
        await this.runAnim(flipper, [frame(-end), frame(0)], HALF_FLIP_MS * 1.3, FLIP_EASE_OUT);
      }
    } finally {
      this._angle = 0;
      this._busy = false;
      this.setAngle(0);
    }
  }

  private async springBack(fromAngle: number) {
    const flipper = this.flipper;
    if (!flipper || fromAngle === 0) return this.setAngle(0);
    this._busy = true;
    await this.runAnim(flipper, [frame(fromAngle), frame(0)], 120 + Math.abs(fromAngle) * 3, FLIP_EASE_OUT);
    this._angle = 0;
    this._busy = false;
    this.setAngle(0);
  }

  private runAnim(el: HTMLElement, keyframes: Keyframe[], duration: number, easing: string) {
    this._anim?.cancel();
    el.classList.add('moving');
    const anim = el.animate(keyframes, { duration, easing, fill: 'forwards' });
    this._anim = anim;
    return anim.finished
      .catch(() => undefined)
      .then(() => {
        // keep the end state until the next frame is applied, then hand back to the inline style
        const last = keyframes[keyframes.length - 1];
        Object.assign(el.style, last);
        anim.cancel();
        el.classList.remove('moving');
      });
  }

  private setAngle(angle: number) {
    this._angle = angle;
    const flipper = this.flipper;
    if (!flipper) return;
    Object.assign(flipper.style, frame(angle));
    if (angle === 0) {
      flipper.style.transform = '';
      flipper.style.opacity = '';
      flipper.classList.remove('moving');
    }
  }

  private get flipper() {
    return this.renderRoot.querySelector<HTMLElement>('.flipper');
  }

  private go(target: number) {
    if (target === this._index) return;
    void this.flipTo(target, target > this._index ? -1 : 1, 0);
  }

  // ---------- gestures ----------

  private onPointerDown(ev: PointerEvent) {
    if (this._busy || this.count < 2 || (ev.pointerType === 'mouse' && ev.button !== 0)) return;
    const fromControl = ev.composedPath().some((n) => n instanceof Element && n.matches(INTERACTIVE));
    if (fromControl) return;
    const width = (ev.currentTarget as HTMLElement).getBoundingClientRect().width || 1;
    this._drag = { id: ev.pointerId, x0: ev.clientX, y0: ev.clientY, t0: ev.timeStamp, lastX: ev.clientX, lastT: ev.timeStamp, v: 0, width, swiping: false };
  }

  private onPointerMove(ev: PointerEvent) {
    const d = this._drag;
    if (!d || ev.pointerId !== d.id) return;
    const dx = ev.clientX - d.x0;
    const dy = ev.clientY - d.y0;
    if (!d.swiping) {
      if (Math.abs(dy) > SLOP_PX && Math.abs(dy) > Math.abs(dx)) return void (this._drag = undefined);
      if (Math.abs(dx) < SLOP_PX) return;
      d.swiping = true;
      (ev.currentTarget as HTMLElement).setPointerCapture(ev.pointerId);
      this.flipper?.classList.add('moving');
    }
    ev.preventDefault();
    const dt = ev.timeStamp - d.lastT;
    if (dt > 0) d.v = 0.7 * ((ev.clientX - d.lastX) / dt) + 0.3 * d.v;
    d.lastX = ev.clientX;
    d.lastT = ev.timeStamp;
    this.setAngle(this.dragAngle(dx, d.width));
  }

  private dragAngle(dx: number, width: number) {
    const angle = (dx / (width * DRAG_FOR_HALF_FLIP)) * 90;
    const towardsNext = dx < 0;
    const hasNeighbour = towardsNext ? this._index < this.count - 1 : this._index > 0;
    if (!hasNeighbour || reducedMotion()) {
      // resistance at the ends (and no rotation at all with reduced motion)
      if (reducedMotion()) return 0;
      return Math.sign(angle) * EDGE_MAX_ANGLE * (1 - Math.exp(-Math.abs(angle) / 40));
    }
    return Math.max(-89, Math.min(89, angle));
  }

  private onPointerUp(ev: PointerEvent) {
    const d = this._drag;
    if (!d || ev.pointerId !== d.id) return;
    this._drag = undefined;
    if (!d.swiping) return;
    this._swallowClick = true;
    setTimeout(() => (this._swallowClick = false), 0);
    const dx = ev.clientX - d.x0;
    const dir: -1 | 1 = dx < 0 ? -1 : 1;
    const target = this._index - dir;
    const fast = Math.abs(d.v) > COMMIT_VELOCITY && Math.sign(d.v) === Math.sign(dx);
    const far = reducedMotion() ? Math.abs(dx) > d.width * 0.25 : Math.abs(this._angle) > COMMIT_ANGLE;
    if (target >= 0 && target < this.count && (fast || far)) void this.flipTo(target, dir, this._angle, d.v);
    else void this.springBack(this._angle);
  }

  private onPointerCancel(ev: PointerEvent) {
    const d = this._drag;
    if (!d || ev.pointerId !== d.id) return;
    this._drag = undefined;
    if (d.swiping) void this.springBack(this._angle);
  }

  private onClickCapture(ev: Event) {
    // a swipe that ends on a child card must not also tap it
    if (this._swallowClick) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  }

  private onDotsKey(ev: KeyboardEvent) {
    const step = ev.key === 'ArrowRight' ? 1 : ev.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    ev.preventDefault();
    const target = this._index + step;
    if (target < 0 || target >= this.count) return;
    this.go(target);
    void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLElement>(`.dot[data-i="${target}"]`)?.focus());
  }

  // ---------- rendering ----------

  protected override updated(changed: PropertyValues) {
    if (changed.has('_cards')) this.dispatchEvent(new Event('card-size-changed', { bubbles: true, composed: true }));
  }

  protected override render() {
    if (!this._config) return nothing;
    const n = this.count;
    return html`<div class="swipe" role="region" aria-roledescription="carrousel">
      <div
        class="stage"
        @pointerdown=${this.onPointerDown}
        @pointermove=${this.onPointerMove}
        @pointerup=${this.onPointerUp}
        @pointercancel=${this.onPointerCancel}
        @click=${{ handleEvent: (e: Event) => this.onClickCapture(e), capture: true }}
      >
        <div class="flipper">
          ${this._cards.map(
            (card, i) =>
              html`<div
                class="slide"
                role="group"
                aria-roledescription="kaart"
                aria-label=${`${i + 1} van ${n}`}
                aria-hidden=${i === this._index ? 'false' : 'true'}
                ?inert=${i !== this._index}
              >
                ${card}
              </div>`,
          )}
        </div>
      </div>
      ${n > 1
        ? html`<div class="dots" role="tablist" @keydown=${this.onDotsKey}>
            ${this._cards.map(
              (_, i) =>
                html`<button
                  class="dot"
                  role="tab"
                  data-i=${i}
                  aria-label=${`Kaart ${i + 1} van ${n}`}
                  aria-current=${i === this._index ? 'true' : 'false'}
                  aria-selected=${i === this._index ? 'true' : 'false'}
                  tabindex=${i === this._index ? '0' : '-1'}
                  @click=${() => this.go(i)}
                ></button>`,
            )}
          </div>`
        : nothing}
    </div>`;
  }
}

/** Transform for a flip angle (perspective comes from the stage). */
function frame(angle: number): Keyframe & { transform: string } {
  const t = Math.min(1, Math.abs(angle) / 90);
  const scale = 1 - (1 - EDGE_SCALE) * Math.sin((t * Math.PI) / 2);
  return { transform: `rotateY(${angle}deg) scale(${scale})` };
}

registerCard(
  {
    type: 'helder-swipe-card',
    name: 'Helder swipe',
    description: 'Meerdere kaarten op één plek; veeg om de kaart om te draaien naar de volgende of vorige.',
  },
  HelderSwipeCard,
);
