// Shared restaurant data that's language-agnostic
export const sharedRestaurantData = {
  'lokal-dlouha': {
    address: 'Dlouhá 33, Prague 1',
    location: {
      lat: 50.09075157991991,
      lng: 14.425778854941957
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
      lat: 50.080953481355955,
      lng: 14.41986325243982
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
      lat: 50.088397770752806,
      lng: 14.391864583778151
    },
    hours: 'Daily 10:00-24:00',
    website: 'https://www.facebook.com/hostinecucernehovola/',
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
      lat: 50.085742362729945,
      lng: 14.40802336213921
    },
    hours: 'Daily 10:00-22:00',
    website: 'https://ivetafabesova.cz/category/2',
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