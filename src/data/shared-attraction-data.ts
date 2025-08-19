// Shared attraction data that's language-agnostic
export const sharedAttractionData = {
  'charles-bridge': {
    address: 'Charles Bridge, Prague 1',
    location: {
      lat: 50.0865,
      lng: 14.4114
    },
    hours: 'Always open',
    website: 'https://www.prague.eu/en/object/places/93/charles-bridge-karluv-most',
    entryFee: 'Free',
    image: '/charles-bridge.jpg',
    category: 'bridge'
  },
  'prague-castle': {
    address: 'Prague Castle, Prague 1',
    location: {
      lat: 50.0910,
      lng: 14.4016
    },
    hours: 'Daily 6:00-22:00 (grounds), Buildings 9:00-17:00',
    website: 'https://www.hrad.cz/en',
    entryFee: 'Free (grounds), 250-350 CZK (buildings)',
    image: '/prague-castle.jpg',
    category: 'castle'
  },
  'astronomical-clock': {
    address: 'Old Town Square, Prague 1',
    location: {
      lat: 50.0870,
      lng: 14.4207
    },
    hours: 'Always visible, Tower 9:00-22:00',
    website: 'https://www.prague.eu/en/object/places/97/old-town-hall-with-astronomical-clock-staromestska-radnice-s-orlojem',
    entryFee: 'Free (viewing), 250 CZK (tower)',
    image: '/astronomical-clock.jpg',
    category: 'monument'
  },
  'petrin-hill': {
    address: 'Petřín Hill, Prague 1',
    location: {
      lat: 50.0838,
      lng: 14.3975
    },
    hours: 'Park always open, Tower 10:00-22:00 (summer)',
    website: 'https://www.prague.eu/en/object/places/92/petrin-hill-petrinské-sady',
    entryFee: 'Free (park), 150 CZK (tower)',
    image: '/petrin-hill.jpg',
    category: 'park'
  }
} as const;

export type AttractionId = keyof typeof sharedAttractionData;