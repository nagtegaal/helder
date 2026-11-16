// Minimal typings for the parts of Home Assistant's frontend objects that Helder uses.
// HA does not publish these as a package; keep this list small and check against the current HA frontend source.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
  last_updated: string;
  context?: { id: string };
}

export interface HassConnection {
  sendMessagePromise<T = unknown>(msg: Record<string, unknown>): Promise<T>;
  subscribeMessage<T = unknown>(cb: (msg: T) => void, msg: Record<string, unknown>): Promise<() => Promise<void>>;
}

export interface HassUser {
  id: string;
  name: string;
  is_admin: boolean;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  connection: HassConnection;
  user?: HassUser;
  language: string;
  locale?: { language: string; number_format?: string; time_format?: string };
  themes?: { darkMode?: boolean; theme?: string; default_theme?: string };
  selectedTheme?: { theme?: string; dark?: boolean } | null;
  entities?: Record<string, { name?: string | null; icon?: string | null; device_id?: string; area_id?: string }>;
  config?: { unit_system?: { temperature?: string } };
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
  ): Promise<unknown>;
  formatEntityState?(stateObj: HassEntity, state?: string): string;
  formatEntityAttributeValue?(stateObj: HassEntity, attribute: string, value?: unknown): string;
  formatEntityName?(stateObj: HassEntity, type: unknown): string;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface GridOptions {
  columns?: number | 'full';
  rows?: number | 'auto';
  min_columns?: number;
  max_columns?: number;
  min_rows?: number;
  max_rows?: number;
}

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description?: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
