export const MATCHUP_TYPES = [
  'teamup',
  'negative',
  'positive',
  'map'
];

export const TIP_TYPES = [
  'for',
  'against'
];

export const HERO_TYPES = [
  {
    'key':0,
    'title':'all heroes',
    'link': '/heroes/all',
    'name': 'all'
  },
  {
    'key':1,
    'title':'offense',
    'link': '/heroes/offense',
    'name': 'offense'
  },
  {
    'key':2,
    'title':'defense',
    'link': '/heroes/defense',
    'name': 'defense'
  },
  {
    'key':3,
    'title':'tank',
    'link': '/heroes/tank',
    'name': 'tank'
  },
  {
    'key':4,
    'title':'support',
    'link': '/heroes/support',
    'name': 'support'
  }
];

export const MAPS_HASH = [
  'ALL', 'Assault', 'Escort', 'Hybrid', 'Control'
]

export const MAP_TYPES = [
  {
    'key':0,
    'title':'all maps',
    'link': '/maps/all',
    'name': 'all'
  },
  {
    'key': 1,
    'title':'assault',
    'link': '/maps/assault',
    'name': 'assault'
  },
  {
    'key': 2,
    'title':'escort',
    'link': '/maps/escort',
    'name': 'escort'
  },
  {
    'key': 3,
    'title':'hybrid',
    'link': '/maps/hybrid',
    'name': 'hybrid'
  },
  {
    'key': 4,
    'title':'control',
    'link': '/maps/control',
    'name': 'control'
  }
];

export const FORUM_TYPES = [
  'discussion',
  'announcement',
  'guide',
  'bugreport'
];

export const FORUM_STRINGS = {
  discussion: {
    title: "General Discussion",
    itemText: "Discussion",
    text: "Post your general discussion topics here.",
    modalTitle: "NEW DISCUSSION TOPIC",
    modalText: "Start a new topic in General Discussion.",
    link: "discussion"
  },
  announcement: {
    title: "Announcements",
    itemText: "Announcement",
    text: "Post your announcement topics here.",
    modalTitle: "NEW ANNOUNCEMENT TOPIC",
    modalText: "Start a new topic in Announcement.",
    link: "announcement"
  },
  guide: {
    title: "Guides",
    itemText: "Guide",
    text: "Post your guide topics here.",
    modalTitle: "NEW GUIDE TOPIC",
    modalText: "Start a new topic in Guides.",
    link: "guide"
  },
  bugreport: {
    title: "Bug Report",
    itemText: "Bug Report",
    text: "Post your bug report topics here.",
    modalTitle: "NEW BUG REPORT TOPIC",
    modalText: "Start a new topic in Bug Reports.",
    link: "bugreport"
  }
};
