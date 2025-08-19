// Shared restaurant data that's language-agnostic
export const sharedRestaurantData = {
  'lokal-dlouha': {
    address: 'Dlouhá 33, Prague 1',
    location: {
      lat: 50.0892,
      lng: 14.4251
    },
    hours: 'Mon-Sat 11:00-24:00, Sun 11:00-22:00',
    website: 'https://lokal-dlouha.ambi.cz/cz/',
    phone: '+420 734 283 874',
    googleMapsUrl: 'https://maps.google.com/?q=Lokál+Dlouhááá+Dlouhá+33+Prague',
    googleRating: 4.3,
    googleReviews: 2847,
    image: '/lokal-dlouha.jpg',
    category: 'restaurant',
    priceRange: '$$'
  },
  'sisters-bistro': {
    address: 'Spálená 104/54, Prague 1',
    location: {
      lat: 50.0796,
      lng: 14.4162
    },
    hours: 'Mon-Fri 8:00-18:00, Sat-Sun 9:00-17:00',
    website: 'https://www.sistersbistro.cz/',
    phone: '+420 776 834 681',
    googleMapsUrl: 'https://maps.google.com/?q=Sisters+Bistro+Spálená+104+Prague',
    googleRating: 4.6,
    googleReviews: 1205,
    image: '/sisters-bistro.jpg',
    category: 'bistro',
    priceRange: '$'
  },
  'u-cerneho-vola': {
    address: 'Loretánské náměstí 1, Prague 1',
    location: {
      lat: 50.0889,
      lng: 14.3903
    },
    hours: 'Daily 10:00-24:00',
    website: 'https://www.pivoucernyvol.cz/',
    phone: '+420 220 513 481',
    googleMapsUrl: 'https://maps.google.com/?q=U+Černého+Vola+Loretánské+náměstí+Prague',
    googleRating: 4.4,
    googleReviews: 2134,
    image: '/u-cerneho-vola.jpg',
    category: 'pub',
    priceRange: '$'
  },
  'werichova-vila': {
    address: 'Ostrovní 131/4, Prague 1',
    location: {
      lat: 50.0789,
      lng: 14.4098
    },
    hours: 'Daily 10:00-22:00',
    website: 'https://www.werichovavila.cz/',
    phone: '+420 257 320 188',
    googleMapsUrl: 'https://maps.google.com/?q=Werichova+Vila+Ostrovní+Prague',
    googleRating: 4.5,
    googleReviews: 856,
    image: '/werichova-vila.jpg',
    category: 'cafe',
    priceRange: '$$'
  }
} as const;

export type RestaurantId = keyof typeof sharedRestaurantData;