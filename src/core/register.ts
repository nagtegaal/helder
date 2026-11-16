// Card registration: defines the custom element and lists it in HA's card picker.

export interface CardInfo {
  /** Tag without `custom:`, e.g. `helder-cover-card`. */
  type: string;
  name: string;
  description?: string;
  preview?: boolean;
}

export function defineElement(tag: string, ctor: CustomElementConstructor) {
  if (!customElements.get(tag)) customElements.define(tag, ctor);
}

export function registerCard(info: CardInfo, ctor: CustomElementConstructor) {
  defineElement(info.type, ctor);
  window.customCards = window.customCards ?? [];
  if (!window.customCards.some((c) => c.type === info.type)) {
    window.customCards.push({
      type: info.type,
      name: info.name,
      description: info.description,
      preview: info.preview ?? true,
      documentationURL: 'https://github.com/nagtegaal/helder',
    });
  }
}
