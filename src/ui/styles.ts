// Shared card styles. Every value comes from a `--helder-*` token; cards add only layout.

import { css } from 'lit';

/** Glass card surface + all shared parts (head, slider, buttons, chips, switch, dropdown, states). */
export const cardStyles = css`
  :host {
    display: block;
    font-family: var(--helder-font-family);
    font-weight: var(--helder-font-weight);
    -webkit-font-smoothing: antialiased;
  }
  * {
    box-sizing: border-box;
  }

  /* ---------- surface ---------- */
  .card {
    container-type: inline-size;
    position: relative;
    height: 100%;
    display: grid;
    align-content: start;
    gap: 0.85rem;
    padding: var(--helder-space);
    color: var(--helder-color-text);
    background:
      var(--card-glow, linear-gradient(transparent, transparent)),
      var(--helder-gloss-layer),
      linear-gradient(var(--helder-glass-fill), var(--helder-glass-fill));
    -webkit-backdrop-filter: var(--helder-glass-filter);
    backdrop-filter: var(--helder-glass-filter);
    border: 1px solid var(--helder-card-border);
    border-radius: var(--helder-radius-card);
    box-shadow: var(--card-shadow-override, var(--helder-card-shadow));
    transition: background var(--helder-transition);
    --state: var(--helder-color-text-muted);
  }
  @media (prefers-reduced-transparency: reduce) {
    .card {
      background:
        var(--card-glow, linear-gradient(transparent, transparent)),
        linear-gradient(var(--helder-glass-fill-reduced), var(--helder-glass-fill-reduced));
      -webkit-backdrop-filter: none;
      backdrop-filter: none;
    }
  }
  .card.clickable {
    cursor: pointer;
  }
  .card:focus-visible {
    outline: var(--helder-focus-ring) solid var(--helder-color-accent);
    outline-offset: 2px;
  }

  /* glow from the top edge: heating (red) or a lit lamp (in the lamp colour, scaled by brightness) */
  .card.heating {
    --card-glow: radial-gradient(ellipse 130% 75% at 50% 0%, var(--helder-heat-glow) 0%, transparent 70%);
  }
  .card.lit {
    --card-glow: radial-gradient(
      ellipse 130% 80% at 50% 0%,
      color-mix(
          in srgb,
          var(--lamp, var(--state)) calc(var(--helder-light-glow-strength) * (0.35 + 0.65 * var(--bri-f, 1))),
          transparent
        )
        0%,
      transparent 72%
    );
  }

  /* ---------- head: icon, name + secondary line, value ---------- */
  .head {
    display: grid;
    grid-template-columns: auto 1fr auto;
    grid-template-areas: 'icon text value';
    align-items: center;
    gap: var(--helder-space-s);
    min-width: 0;
  }
  .icon {
    grid-area: icon;
    width: var(--helder-control-size);
    height: var(--helder-control-size);
    border-radius: var(--helder-radius-control);
    display: grid;
    place-items: center;
    background: var(--helder-control-bg);
    color: var(--helder-color-text-muted);
    --mdc-icon-size: var(--helder-icon-size);
    transition:
      background var(--helder-transition),
      color var(--helder-transition);
  }
  .icon svg {
    width: var(--helder-icon-size);
    height: var(--helder-icon-size);
  }
  .card.active .icon {
    background: color-mix(in srgb, var(--state) 18%, transparent);
    color: var(--state);
  }
  .text {
    grid-area: text;
    min-width: 0;
  }
  .name {
    font-size: var(--helder-font-size-m);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sub {
    font-size: var(--helder-font-size-s);
    color: var(--helder-color-text-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .value {
    grid-area: value;
    font-size: var(--helder-font-size-l);
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
  }
  .unit {
    font-size: var(--helder-font-size-s);
    color: var(--helder-color-text-muted);
    margin-left: 0.1rem;
  }
  .readout {
    font-size: var(--helder-font-size-3xl);
    font-weight: var(--helder-font-weight-readout);
    line-height: 1;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  @container (max-width: 190px) {
    .head {
      grid-template-columns: auto 1fr;
      grid-template-areas: 'icon value' 'text text';
    }
    .value {
      justify-self: end;
    }
  }

  /* ---------- slider ---------- */
  .slider {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 2.3rem;
    margin: 0;
    background: transparent;
    cursor: pointer;
    touch-action: pan-y;
    --p: 50%;
  }
  .slider::-webkit-slider-runnable-track {
    height: var(--helder-slider-height);
    border-radius: var(--helder-radius-pill);
    background: linear-gradient(to right, var(--state) 0 var(--p), var(--helder-control-bg) var(--p) 100%);
  }
  .slider::-moz-range-track {
    height: var(--helder-slider-height);
    border-radius: var(--helder-radius-pill);
    background: var(--helder-control-bg);
  }
  .slider::-moz-range-progress {
    height: var(--helder-slider-height);
    border-radius: var(--helder-radius-pill);
    background: var(--state);
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: var(--helder-thumb-size);
    height: var(--helder-thumb-size);
    margin-top: calc((var(--helder-slider-height) - var(--helder-thumb-size)) / 2);
    border-radius: 50%;
    background: var(--helder-thumb);
    box-shadow: var(--helder-thumb-shadow);
  }
  .slider::-moz-range-thumb {
    width: var(--helder-thumb-size);
    height: var(--helder-thumb-size);
    border: 0;
    border-radius: 50%;
    background: var(--helder-thumb);
    box-shadow: var(--helder-thumb-shadow);
  }
  .slider:disabled {
    cursor: default;
  }
  .slider:disabled::-webkit-slider-thumb {
    background: var(--helder-control-bg);
    box-shadow: none;
  }
  .slider:disabled::-moz-range-thumb {
    background: var(--helder-control-bg);
    box-shadow: none;
  }
  .slider:focus-visible {
    outline: var(--helder-focus-ring) solid var(--helder-color-accent);
    outline-offset: 2px;
    border-radius: var(--helder-radius-pill);
  }

  /* ---------- buttons and chips ---------- */
  .row {
    display: flex;
    gap: var(--helder-space-xs);
  }
  .btn {
    flex: 1 1 0;
    min-width: 0;
    height: var(--helder-control-size);
    border: 0;
    border-radius: var(--helder-radius-control);
    background: var(--helder-control-bg);
    color: var(--helder-color-text);
    cursor: pointer;
    display: grid;
    place-items: center;
    font: inherit;
    --mdc-icon-size: 1.2rem;
    transition: background var(--helder-transition-fast);
  }
  .btn svg {
    width: 1.2rem;
    height: 1.2rem;
  }
  .btn:hover:not(:disabled) {
    background: var(--helder-control-bg-hover);
  }
  .btn:disabled {
    color: var(--helder-color-disabled);
    cursor: default;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: var(--helder-space-xs);
  }
  .chip {
    flex: 1 1 auto;
    border: 0;
    border-radius: var(--helder-radius-control);
    padding: 0.4rem 0.6rem;
    font: inherit;
    font-size: var(--helder-font-size-s);
    white-space: nowrap;
    background: var(--helder-control-bg);
    color: var(--helder-color-text);
    cursor: pointer;
    transition: background var(--helder-transition-fast);
  }
  .chip:hover:not(:disabled):not([aria-pressed='true']) {
    background: var(--helder-control-bg-hover);
  }
  .chip[aria-pressed='true'] {
    background: var(--helder-color-accent);
    color: var(--helder-color-on-accent);
  }
  .chip:disabled {
    color: var(--helder-color-disabled);
    cursor: default;
  }
  .btn:focus-visible,
  .chip:focus-visible,
  .switch:focus-visible {
    outline: var(--helder-focus-ring) solid var(--helder-color-accent);
    outline-offset: 2px;
  }

  /* ---------- switch ---------- */
  .switch {
    grid-area: value;
    width: 2.9rem;
    height: 1.75rem;
    border-radius: var(--helder-radius-pill);
    border: 0;
    padding: 0.175rem;
    background: var(--helder-control-bg-hover);
    cursor: pointer;
    display: flex;
  }
  .switch::after {
    content: '';
    width: 1.4rem;
    height: 1.4rem;
    border-radius: 50%;
    background: var(--helder-thumb);
    box-shadow: var(--helder-thumb-shadow);
    transition: transform 0.18s ease;
  }
  .switch[aria-checked='true'] {
    background: var(--state);
  }
  .switch[aria-checked='true']::after {
    transform: translateX(1.15rem);
  }
  .switch:disabled {
    cursor: default;
  }
  .switch:disabled::after {
    background: var(--helder-control-bg);
    box-shadow: none;
  }

  /* ---------- dropdown (button with menu; clearly a dropdown: border + chevron) ---------- */
  .dd {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--helder-space-xs);
    height: var(--helder-control-size);
    padding: 0 0.7rem;
    border-radius: var(--helder-radius-control);
    background: var(--helder-control-bg);
    border: 1px solid var(--helder-control-border);
    color: var(--helder-color-text);
    font-size: var(--helder-font-size-s);
  }
  .dd-label {
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .dd-label.empty {
    color: var(--helder-color-text-muted);
  }
  .dd svg {
    width: 1.1rem;
    height: 1.1rem;
    flex: none;
    color: var(--helder-color-text-muted);
  }
  .dd select {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    font-size: 16px; /* prevents iOS zoom on focus */
  }
  .dd select:disabled {
    cursor: default;
  }
  .dd:focus-within {
    outline: var(--helder-focus-ring) solid var(--helder-color-accent);
    outline-offset: 2px;
  }

  /* ---------- states ---------- */
  /* unavailable / unknown / missing: only colours change, never size or layout */
  .card.na .name,
  .card.na .value,
  .card.na .readout {
    color: var(--helder-color-disabled);
  }
  .card.na .dd {
    color: var(--helder-color-disabled);
    border-color: color-mix(in srgb, var(--helder-color-disabled) 30%, transparent);
  }
  /* busy: value pulses until HA confirms; on failure the card shakes and rolls back */
  .card.pending .value,
  .card.pending .sub,
  .card.pending .icon,
  .card.pending .readout {
    animation: helder-pulse 1s ease-in-out infinite;
  }
  .card.failed {
    animation: helder-shake 0.38s ease-in-out;
  }
  .card.failed .sub {
    color: var(--helder-color-error);
  }
  @keyframes helder-pulse {
    50% {
      opacity: 0.4;
    }
  }
  @keyframes helder-shake {
    20% {
      transform: translateX(-4px);
    }
    40% {
      transform: translateX(4px);
    }
    60% {
      transform: translateX(-3px);
    }
    80% {
      transform: translateX(2px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .card.pending .value,
    .card.pending .sub,
    .card.pending .icon,
    .card.pending .readout {
      animation: none;
      opacity: 0.55;
    }
    .card.failed {
      animation: none;
    }
    .switch::after {
      transition: none;
    }
  }
`;
