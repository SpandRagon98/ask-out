/**
 * The shortlist.
 *
 * Photos are the restaurants' own listing photos (ambience first), loaded from
 * the listing sites' image CDNs. If one fails to load, the card falls back to
 * the next photo, and finally to a drawn illustration.
 *
 * To use your own photos instead, put them in `public/images/` and replace a
 * URL with e.g. 'images/perimas-1.jpg'.
 */

export type RestaurantId = 'perimas' | 'mirabelle' | 'bonne-femme';
export type IllustrationKind = 'dosa' | 'pasta' | 'dessert';

export interface Photo {
  src: string;
  alt: string;
}

export interface Restaurant {
  id: RestaurantId;
  name: string;
  location: string;
  address: string;
  cuisine: string;
  tagline: string;
  /** One short line in Spandan's voice. */
  line: string;
  cta: string;
  photos: Photo[];
  photoCredit: string;
  photoSource: string;
  illustration: IllustrationKind;
  illustrationAlt: string;
}

const swiggy = (file: string) =>
  `https://dineout-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_900/DINEOUT_ALL_RESTAURANTS/IMAGES/RESTAURANT_IMAGE_SERVICE/2026/2/24/${file}`;

const zomato = (path: string) =>
  `https://b.zmtcdn.com/data/pictures/${path}?fit=around%7C900%3A900&output-format=webp`;

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'perimas',
    name: "Perima's",
    location: 'Ballygunge, Kolkata',
    address: 'Rowland Road, Ballygunge',
    cuisine: 'Modern South Indian',
    tagline: 'A little spicy. A little different.',
    line: "We'd definitely order more than we need. Not the worst problem.",
    cta: "Perima's sounds good",
    photos: [
      {
        src: swiggy('00a68488-a06b-4f79-a82e-b92bd2414d0b_image09c63cdfaf0504431b95475fab3052a5a.JPG'),
        alt: "Perima's dining room: warm cove lighting, curved ceiling and a checkered floor",
      },
      {
        src: swiggy('eff97e8a-9983-44a1-ae59-05d9707e684d_image3cbcc7fb2fa57425fb70b5d7e53a36f60.JPG'),
        alt: "Perima's seating area with round chairs and warm amber light",
      },
      {
        src: swiggy('6459dfc3-e699-4482-b27a-1002a730491a_image50df8f8a47788472997fccaa9ebc36d3f.JPG'),
        alt: "A table for two at Perima's under a framed artwork",
      },
    ],
    photoCredit: 'Swiggy Dineout',
    photoSource: 'https://www.swiggy.com/restaurants/kolkata/ballygunge/perima-s-1252130/dineout/photos',
    illustration: 'dosa',
    illustrationAlt: 'Illustration of a dosa and chutneys on a banana leaf',
  },
  {
    id: 'mirabelle',
    name: 'Mirabelle',
    location: 'Hindustan Park, Kolkata',
    address: 'Keyatala Road, Hindustan Park',
    cuisine: 'Italian',
    tagline: 'Because pasta is always a good idea.',
    line: "Ten minutes deciding what to order. Personally, I don't see a problem.",
    cta: 'Okay, Mirabelle',
    photos: [
      {
        src: zomato('6/21487366/1fa28b016d3c85c0a41ff425ef84faa5.jpg'),
        alt: 'Mirabelle interior: a flower wall, chandeliers and white cane chairs',
      },
      {
        src: zomato('6/21487366/f41e2da0010224eae9ec3a4f970a1a05.jpg'),
        alt: 'A small table by an arched mirror at Mirabelle',
      },
      {
        src: zomato('6/21487366/be0ee63a522e0686cad3e2051f393169.jpeg'),
        alt: 'Plates of food on a round table at Mirabelle',
      },
    ],
    photoCredit: 'District by Zomato',
    photoSource: 'https://www.district.in/dining/kolkata/mirabelle-hindustan-park',
    illustration: 'pasta',
    illustrationAlt: 'Illustration of a plate of spaghetti',
  },
  {
    id: 'bonne-femme',
    name: 'Bonne Femme',
    location: 'Ballygunge, Kolkata',
    address: 'Rash Behari Avenue, Ballygunge',
    cuisine: 'Fusion · Continental',
    tagline: 'Good food. Nice place. Sorted.',
    line: "Dessert even after claiming we're full. Calling it now.",
    cta: 'Bonne Femme it is',
    photos: [
      {
        src: zomato('8/21090818/82890881214739578b181bcc35832255.jpg'),
        alt: 'Bonne Femme: teal walls, big windows and hanging greenery',
      },
      {
        src: zomato('8/21090818/0a01f6f85e36fcacfd16b889e1ddc6a3.jpeg'),
        alt: 'Floral seating and framed art at Bonne Femme',
      },
      {
        src: zomato('8/21090818/467f3394c27c9beca373fccfc3cb26fd_featured_v3.jpg'),
        alt: 'A cosy corner of Bonne Femme in warm evening light',
      },
    ],
    photoCredit: 'District by Zomato',
    photoSource: 'https://www.district.in/dining/kolkata/bonne-femme-hindustan-park',
    illustration: 'dessert',
    illustrationAlt: 'Illustration of a slice of cake and a coffee',
  },
];

export function getRestaurant(id: string | null | undefined): Restaurant | undefined {
  return RESTAURANTS.find((r) => r.id === id);
}

/** Google Maps search link built from name + area. No invented place IDs. */
export function mapsUrl(r: Pick<Restaurant, 'name' | 'address'>): string {
  const query = `${r.name}, ${r.address}, Kolkata`;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const TIME_SLOTS = [
  { id: '17:00', label: '5:00', short: '5', note: 'Early bird. Very responsible.' },
  { id: '17:30', label: '5:30', short: '5:30', note: 'Solid. Very balanced.' },
  { id: '18:00', label: '6:00', short: '6', note: 'Peak chill hour. Love it.' },
  { id: '18:30', label: '6:30', short: '6:30', note: 'Nice. No rush at all.' },
  { id: '19:00', label: '7:00', short: '7', note: 'Fashionably late. Classic.' },
] as const;

export type TimeSlotId = (typeof TIME_SLOTS)[number]['id'];

export function getSlot(id: string | null | undefined) {
  return TIME_SLOTS.find((s) => s.id === id);
}

export const DATE_LABEL = 'Sunday, 15 November';
