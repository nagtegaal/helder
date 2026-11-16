// Fixed colour palette. Each entry has a light-mode and a dark-mode value; the dark value is tuned to stay
// readable on the dark base. Groups: saturated colours, light (pastel) colours, greys.

export type PaletteGroup = 'color' | 'light' | 'grey';

export interface PaletteColor {
  id: string;
  name: string;
  light: string;
  dark: string;
  group: PaletteGroup;
}

const c = (id: string, name: string, light: string, dark: string, group: PaletteGroup): PaletteColor => ({
  id,
  name,
  light,
  dark,
  group,
});

export const PALETTE: readonly PaletteColor[] = [
  c('orange', 'Oranje', '#ff6d00', '#ff7a1a', 'color'),
  c('blue', 'Blauw', '#2563eb', '#5b8cff', 'color'),
  c('teal', 'Groenblauw', '#0d8a8a', '#2cc4c0', 'color'),
  c('indigo', 'Indigo', '#4f46e5', '#8f88ff', 'color'),
  c('red', 'Rood', '#dc2626', '#f87171', 'color'),
  c('coral', 'Koraal', '#e8474f', '#ff7a7f', 'color'),
  c('raspberry', 'Framboos', '#db2777', '#f472b6', 'color'),
  c('pink', 'Roze', '#d6517f', '#f59ab8', 'color'),
  c('purple', 'Paars', '#9333ea', '#c084fc', 'color'),
  c('violet', 'Violet', '#7c3aed', '#a78bfa', 'color'),
  c('sky', 'Hemelsblauw', '#0284c7', '#38bdf8', 'color'),
  c('cyan', 'Cyaan', '#0891b2', '#22d3ee', 'color'),
  c('petrol', 'Petrol', '#0f6e7a', '#3fb0bd', 'color'),
  c('emerald', 'Smaragd', '#059669', '#34d399', 'color'),
  c('green', 'Groen', '#16a34a', '#4ade80', 'color'),
  c('lime', 'Limoen', '#65a30d', '#a3e635', 'color'),
  c('olive', 'Olijf', '#6b7f1a', '#a3b84a', 'color'),
  c('mustard', 'Mosterd', '#b98a05', '#facc15', 'color'),
  c('amber', 'Amber', '#d97706', '#fbbf24', 'color'),
  c('terracotta', 'Terracotta', '#c2410c', '#f0835a', 'color'),
  c('cognac', 'Cognac', '#9a5b2e', '#d0905a', 'color'),
  c('peach', 'Perzik', '#ffb58a', '#ffc3a0', 'light'),
  c('apricot', 'Abrikoos', '#ffc976', '#ffd591', 'light'),
  c('salmon', 'Zalm', '#ff9e8f', '#ffb0a3', 'light'),
  c('blush', 'Poederroze', '#f7b2c4', '#f9c3d1', 'light'),
  c('lavender', 'Lavendel', '#b9a8f0', '#c7b9f5', 'light'),
  c('lilac', 'Lila', '#d3a6e8', '#dcb7ee', 'light'),
  c('babyblue', 'Babyblauw', '#9cc7f5', '#b0d3f7', 'light'),
  c('iceblue', 'IJsblauw', '#a6e1ef', '#b8e8f3', 'light'),
  c('mint', 'Mint', '#9fe0c0', '#b2e7cd', 'light'),
  c('sage', 'Salie', '#b5c9a1', '#c4d4b3', 'light'),
  c('lemon', 'Citroen', '#f3e27a', '#f6e992', 'light'),
  c('sand', 'Zand', '#e3cfaa', '#e9d9bb', 'light'),
  c('graphite', 'Grafiet', '#3f3f46', '#d4d4d8', 'grey'),
  c('anthracite', 'Antraciet', '#27272a', '#e4e4e7', 'grey'),
  c('slate', 'Leisteen', '#475569', '#a8b6c9', 'grey'),
  c('warmgrey', 'Warm grijs', '#78716c', '#c4bcb4', 'grey'),
  c('silver', 'Zilver', '#7d838c', '#c9ced6', 'grey'),
];

export const paletteById = (id: string): PaletteColor | undefined => PALETTE.find((p) => p.id === id);
