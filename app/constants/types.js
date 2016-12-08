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
  'all heroes',
  'offense',
  'defense',
  'tank',
  'support'
];

export const MAP_TYPES = [
  {
    'key':'all',
    'title':'all maps',
  },
  {
    'key':'assault',
    'title':'assault',
  },
  {
    'key':'escort',
    'title':'escort',
  },
  {
    'key':'hybrid',
    'title':'hybrid',
  },
  {
    'key':'control',
    'title':'control',
  }
];

export const TIP_TYPES = [
  'genenral tips',
  'hero matchups',
  'map rankings'
];

// Temporary until API is updated.
export const HEROES_COUNT = 133;

export const MATCHUPS_COUNT = (HEROES_COUNT - 1) * (LANES.length - 1);
