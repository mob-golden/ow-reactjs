export const LANES = [
  'all',
  'general',
  'top',
  'middle',
  'bottom',
  'jungle'
];

export const TYPES = [
  'counter',
  'strongpick',
  'synergy',
  'tie'
];

export const HERO_TYPES = [
  'all heros',
  'offense',
  'defense',
  'tank',
  'support'
];

export const MAP_TYPES = [
  'all maps',
  'assault',
  'escort',
  'hybrid',
  'control'
];

// Temporary until API is updated.
export const HEROS_COUNT = 133;

export const MATCHUPS_COUNT = (HEROS_COUNT - 1) * (LANES.length - 1);
