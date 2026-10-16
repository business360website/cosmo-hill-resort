// All content and image paths live here. To use real photos, drop files into
// public/assets/images/ using the same file names (or edit the paths below).
const img = (name) => `/assets/images/${name}`

export const brand = {
  name: 'The Cosmo Hill Resort',
  short: 'Cosmo Hill Resort',
  tagline: 'Relax, Refresh, Rejuvenate',
  logo: '/assets/logo.png',
  heroVideo: '/assets/cosmo-hill-hero.webm',
  phone: '+91-6230353090',
  phone2: '+91-7018950367',
  email: 'thecosmohillresort@gmail.com',
  address: 'The Cosmo Hill Resort, Village Kog, near Hydro Engineering College, Bandla, Himachal Pradesh 174001',
  lat: 31.3174823,
  lng: 76.7884019,
  mapsUrl: 'https://www.google.com/maps/dir/?api=1&destination=The+Cosmo+Hill+Resort,+Village+Kog,+near+Hydro+Engineering+College,+Bandla,+Himachal+Pradesh+174001',
  mapEmbed: 'https://www.google.com/maps?q=The+Cosmo+Hill+Resort,+Village+Kog,+near+Hydro+Engineering+College,+Bandla,+Himachal+Pradesh+174001&z=16&output=embed',
}

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Rooms & Suites', href: '/rooms' },
  { label: 'Experiences', href: '/experiences' },
  { label: 'Dining', href: '/dining' },
  { label: 'Places', href: '/places' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Contact', href: '/contact' },
]

export const about = {
  image: img('about-resort.jpg'),
  eyebrow: 'About the resort',
  title: 'Where Nature Meets Luxury',
  text: 'Perched on a quiet ridge, Cosmo Hill is a retreat built around the view. Wake to mist in the valley, spend the day on slow walks and long meals, and end it by a fire under open sky. Every detail is designed to help you slow down.',
  highlights: [
    { icon: 'Mountain', title: 'Mountain Views', text: 'Ridge-line vistas from every terrace' },
    { icon: 'Sparkles', title: 'Premium Hospitality', text: 'Warm, attentive, never intrusive' },
    { icon: 'Leaf', title: 'Peaceful Atmosphere', text: 'Quiet grounds, clean mountain air' },
    { icon: 'Compass', title: 'Curated Experiences', text: 'Guided trails, bonfires, sunrise points' },
  ],
}

const roomImg = (slug, n) => Array.from({ length: n }, (_, i) => `/assets/images/rooms/${slug}-${i + 1}.jpg`)

// Max guests in one room is 2 for every category. Rooms with `image: null` show a placeholder until photos are added.
export const rooms = [
  { id: 'deluxe-double', name: 'Deluxe Double Room', image: roomImg('deluxe-double', 4)[0], gallery: roomImg('deluxe-double', 4), price: '₹2,500', span: 'lg:col-span-2', size: '13 m²', bed: '1 double bed',
    text: 'A comfortable double room with a pool view, a terrace and a private bathroom.',
    amenities: [{ icon: 'Waves', label: 'Pool View' }, { icon: 'Bath', label: 'Private Bathroom' }, { icon: 'Wifi', label: 'Free WiFi' }, { icon: 'Armchair', label: 'Seating Area' }],
    details: ['This double room has a pool view. The private bathroom has a bath, a shower, free toiletries and a bathrobe, and the room also has a seating area, a desk, a terrace and a tea and coffee maker.', 'The room has 1 double bed and comfortable beds throughout.'],
    bathroom: ['Bath', 'Free toiletries', 'Shower', 'Bathrobe', 'Toilet', 'Slippers', 'Toilet paper'],
    facilities: ['Terrace with pool view', 'Free WiFi', 'Desk', 'Safe deposit box', 'Dining table', 'Dining area', 'Wake-up service', 'Fan', 'Towels', 'Seating area', 'Socket near the bed', 'Tea / coffee maker', 'Electric kettle', 'Hypoallergenic', 'Telephone', 'Wardrobe or closet', 'Clothes rack', 'Non-smoking'] },

  { id: 'superior-double', name: 'Superior Double Room', image: roomImg('superior-double', 4)[0], gallery: roomImg('superior-double', 4), price: '₹3,000', span: 'lg:col-span-2', size: '12 m²', bed: '1 double bed',
    text: 'A relaxing double room with a private terrace and a beautiful pool-facing view.',
    amenities: [{ icon: 'Waves', label: 'Pool View' }, { icon: 'Bath', label: 'Private Bathroom' }, { icon: 'Tv', label: 'Flat-screen TV' }, { icon: 'Wifi', label: 'Free WiFi' }],
    details: ['The pool view is the highlight of this double room. It has a private bathroom with a bath, a shower, free toiletries, a bathrobe and slippers, plus a terrace that looks out over the pool.', 'You also get a tea and coffee maker, a flat-screen TV, a desk, a seating area, a safe and a fan. The room has 1 double bed and takes up to 2 guests.'],
    bathroom: ['Bath', 'Shower', 'Free toiletries', 'Bathrobe', 'Slippers', 'Toilet paper'],
    facilities: ['Terrace with pool view', 'Free WiFi', 'Flat-screen TV', 'Tea / coffee maker', 'Electric kettle', 'Desk', 'Safe deposit box', 'Dining area & table', 'Seating area', 'Fan', 'Wardrobe or closet', 'Clothes rack', 'Towels', 'Telephone', 'Wake-up service', 'Socket near the bed', 'Hypoallergenic', 'Non-smoking'] },

  { id: 'queen-room', name: 'Queen Room', image: roomImg('queen-room', 4)[0], gallery: roomImg('queen-room', 4), price: '₹3,500', span: 'lg:col-span-2', size: '13 m²', bed: '1 double bed',
    text: 'A pool-view double room with air conditioning, a private kitchen and a terrace.',
    amenities: [{ icon: 'Waves', label: 'Pool View' }, { icon: 'Snowflake', label: 'Hot & Cold AC' }, { icon: 'Coffee', label: 'Private Kitchen' }, { icon: 'Bath', label: 'Private Bathroom' }],
    details: ['The pool view is the standout feature of this double room. Its private kitchen is there for cooking and storing food, and the room also has air conditioning, a tea and coffee maker and a terrace overlooking the pool.', 'The private bathroom has a bath, shower, bathrobe, slippers and free toiletries. The room has 1 double bed and takes up to 2 guests.'],
    bathroom: ['Bath', 'Shower', 'Free toiletries', 'Bathrobe', 'Slippers', 'Toilet paper'],
    facilities: ['Terrace with pool view', 'Free WiFi', 'Air conditioning & heating', 'Flat-screen TV', 'Private kitchen', 'Tea / coffee maker', 'Electric kettle', 'Dining area & table', 'Desk', 'Safe deposit box', 'Seating area', 'Fan', 'Wardrobe or closet', 'Clothes rack', 'Towels', 'Telephone', 'Wake-up service', 'Socket near the bed', 'Hypoallergenic', 'Non-smoking'] },

  { id: 'executive', name: 'Executive Room', image: roomImg('executive', 4)[0], gallery: roomImg('executive', 4), price: '₹4,000', span: 'lg:col-span-3', size: '12 m²', bed: '1 double bed',
    text: 'A double room with mountain views from its terrace, air conditioning and a private bathroom.',
    amenities: [{ icon: 'Mountain', label: 'Mountain View' }, { icon: 'Snowflake', label: 'Hot & Cold AC' }, { icon: 'Bath', label: 'Private Bathroom' }, { icon: 'Tv', label: 'Flat-screen TV' }],
    details: ['This double room has air conditioning, a tea and coffee maker and a terrace with mountain views, so you wake up to the hills every morning.', 'The private bathroom comes with a bath, shower, bathrobe, slippers and free toiletries. The room has 1 double bed and takes up to 2 guests.'],
    bathroom: ['Bath', 'Shower', 'Free toiletries', 'Bathrobe', 'Slippers', 'Toilet paper'],
    facilities: ['Terrace with mountain view', 'Free WiFi', 'Air conditioning & heating', 'Flat-screen TV', 'Tea / coffee maker', 'Electric kettle', 'Dining area & table', 'Desk', 'Safe deposit box', 'Seating area', 'Fan', 'Wardrobe or closet', 'Clothes rack', 'Towels', 'Telephone', 'Wake-up service', 'Socket near the bed', 'Hypoallergenic', 'Non-smoking'] },

  { id: 'king-suite', name: 'King Suite', image: roomImg('king-suite', 5)[0], gallery: roomImg('king-suite', 5), price: '₹4,500', span: 'lg:col-span-3', size: '15 m²', bed: '1 double bed',
    text: 'Our largest room: mountain views from the terrace, air conditioning and a minibar.',
    amenities: [{ icon: 'Mountain', label: 'Mountain View' }, { icon: 'Snowflake', label: 'Hot & Cold AC' }, { icon: 'Wine', label: 'Minibar' }, { icon: 'Tv', label: 'Flat-screen TV' }],
    details: ['This double room has air conditioning, a minibar and a terrace with mountain views, along with a private bathroom with a bath. Free WiFi and a flat-screen TV come with the room.', 'The room has 1 double bed, a seating area, a desk and a tea and coffee maker, with comfortable beds throughout.'],
    bathroom: ['Bath', 'Free toiletries', 'Shower', 'Bathrobe', 'Toilet', 'Slippers', 'Toilet paper'],
    facilities: ['Terrace with mountain view', 'Free WiFi', 'Air conditioning & heating', 'Flat-screen TV', 'Minibar', 'Desk', 'Safe deposit box', 'Dining table', 'Dining area', 'Wake-up service', 'Fan', 'Towels', 'Seating area', 'Socket near the bed', 'Tea / coffee maker', 'Electric kettle', 'Hypoallergenic', 'Telephone', 'Wardrobe or closet', 'Clothes rack', 'Non-smoking'] },
]

export const experiences = [
  { title: 'Swimming Pool', text: 'Cool off in our pool, lit up beautifully by night.', icon: 'Waves', image: img('exp-pool.jpg'), span: 'lg:row-span-2' },
  { title: 'Valley Above the Clouds', text: 'Watch mist drift through the valley below.', icon: 'Cloud', image: img('exp-valley.jpg'), span: 'lg:col-span-2' },
  { title: 'Dusk on the Terrace', text: 'Golden hour from the open terrace.', icon: 'Sunset', image: img('exp-dusk.jpg'), span: '' },
  { title: 'Mountain-View Seating', text: 'Sit back with the ridge in front of you.', icon: 'Mountain', image: img('exp-viewpoint.jpg'), span: '' },
  { title: 'Live Tandoor Grills', text: 'Kebabs straight from the tandoor.', icon: 'Flame', image: img('exp-tandoor.jpg'), span: '' },
  { title: 'Terrace Dining', text: 'Meals in the open air.', icon: 'Utensils', image: img('exp-outdoor-dining.jpg'), span: '' },
]

// Party hall: what the hall can be booked for, and what comes with it
export const partyHall = {
  eyebrow: 'Party Hall',
  title: 'A Hall for Every Celebration',
  text: 'Host your function in our party hall, with the sound, screen, food and decor all taken care of.',
  image: img('party-hall-1.jpg'),
  events: [
    { icon: 'Gem', title: 'Ring Ceremony' },
    { icon: 'PartyPopper', title: 'Kitty Party' },
    { icon: 'Briefcase', title: 'Office Meetings' },
    { icon: 'Cake', title: 'Birthday Parties' },
    { icon: 'Heart', title: 'Anniversary Parties' },
  ],
  facilities: [
    { icon: 'Mic', title: "Speakers with Mic's" },
    { icon: 'UtensilsCrossed', title: 'Buffet' },
    { icon: 'Projector', title: 'Projector' },
    { icon: 'Sparkles', title: 'Decoration' },
  ],
}

// Drop real photos in public/assets/images/places/ with these file names
// (or change `image`). Until then a placeholder is shown.
const place = (slug) => `/assets/images/places/${slug}.jpg`
const gmaps = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
export const places = [
  { slug: 'gobind-sagar-lake', name: 'Gobind Sagar Lake', tag: 'Lake', icon: 'Waves', image: place('gobind-sagar-lake'), map: gmaps('Gobind Sagar Lake Bilaspur Himachal Pradesh'),
    text: 'A vast reservoir on the Sutlej, ringed by hills. Calm blue water, sunset views and a favourite for a slow day out.' },
  { slug: 'gobind-sagar-activities', name: 'Gobind Sagar Lake Activities', tag: 'Activity', icon: 'Sailboat', image: place('gobind-sagar-activities'), map: gmaps('Gobind Sagar Lake water sports Bilaspur Himachal Pradesh'),
    text: 'Boating, jet skiing, speed boats and other water sports on the lake, popular with families and groups.' },
  { slug: 'bandla-hill-top', name: 'Bandla Hill Top', tag: 'Viewpoint', icon: 'Mountain', image: place('bandla-hill-top'), map: gmaps('Bandla Hill Top Bilaspur Himachal Pradesh'),
    text: 'A panoramic viewpoint above the resort with wide views of the valley, Bilaspur town and the lake.' },
  { slug: 'paragliding-bandla', name: 'Paragliding at Bandla Hills', tag: 'Adventure', icon: 'Wind', image: place('paragliding-bandla'), map: gmaps('Paragliding Bandla Hills Bilaspur Himachal Pradesh'),
    text: 'Fly tandem with certified pilots over the Bandla hills and Gobind Sagar, an unforgettable bird\u2019s-eye view.' },
  { slug: 'laxmi-narayan-temple', name: 'Laxmi Narayan Temple', tag: 'Temple', icon: 'Landmark', image: place('laxmi-narayan-temple'), map: gmaps('Laxmi Narayan Temple Bilaspur Himachal Pradesh'),
    text: 'A historic temple dedicated to Lord Vishnu and Goddess Lakshmi, known for its old-world architecture.' },
  { slug: 'markandeya-rishi-temple', name: 'Markandeya Rishi Temple', tag: 'Temple', icon: 'Landmark', image: place('markandeya-rishi-temple'), map: gmaps('Markandeya Rishi Temple Bilaspur Himachal Pradesh'),
    text: 'A peaceful temple dedicated to Rishi Markandeya, set in a quiet, scenic spot and visited for its calm.' },
  { slug: 'naina-devi-temple', name: 'Naina Devi Temple', tag: 'Shakti Peeth', icon: 'Landmark', image: place('naina-devi-temple'), map: gmaps('Naina Devi Temple Himachal Pradesh'),
    text: 'One of the 51 Shakti Peeths, on a hilltop with sweeping views of Gobind Sagar. Drawn by pilgrims all year.' },
  { slug: 'baba-nahar-singh-temple', name: 'Baba Nahar Singh Bajiya Ji Temple', tag: 'Temple', icon: 'Landmark', image: place('baba-nahar-singh-temple'), map: gmaps('Baba Nahar Singh Bajiya ji Temple Himachal Pradesh'),
    text: 'A much-loved local shrine, revered by villagers and visitors for its devotion and peaceful setting.' },
]

export const dining = {
  title: 'Flavours Worth Travelling For',
  text: 'From a slow mountain-view breakfast to candle-lit dinners, our kitchen cooks with local produce and a patient hand.',
  imageMain: img('dining-main.jpg'),
  imageSmall: img('dining-small.jpg'),
  items: [
    { title: 'The Restaurant', text: 'An all-day table with warm interiors and a seasonal menu.' },
    { title: 'Mountain-View Dining', text: 'Window tables and terrace seating facing the ridge.' },
    { title: 'Breakfast', text: 'Fresh breads, hot parathas and fruit, served unhurried.' },
    { title: 'Local Cuisine', text: 'Regional recipes made with ingredients from nearby farms.' },
    { title: 'International Cuisine', text: 'Familiar favourites, from pasta to grills.' },
    { title: 'Evening Dining', text: 'Lantern-lit dinners and bonfire-side specials.' },
  ],
}

// The 7 menu pages, in reading order. `w`/`h` are the image's natural size and
// `bg` its edge colour, so each page keeps its own aspect ratio inside the book.
export const menuPages = [
  { src: '/assets/menu/page-1.webp', w: 1074, h: 1464, bg: '#ecebe6', bgTop: '#edece8', bgBottom: '#ebeae5', alt: 'Menu page 1: breakfast, hot and cold beverages, vegetarian snacks' },
  { src: '/assets/menu/page-2.webp', w: 1052, h: 1495, bg: '#e7e4df', bgTop: '#e5e2dd', bgBottom: '#e9e6e2', alt: 'Menu page 2' },
  { src: '/assets/menu/page-3.webp', w: 1024, h: 1536, bg: '#e9e7e0', bgTop: '#eae8e2', bgBottom: '#e8e6df', alt: 'Menu page 3' },
  { src: '/assets/menu/page-4.webp', w: 1024, h: 1536, bg: '#e6e3dd', bgTop: '#e7e4de', bgBottom: '#e5e2dc', alt: 'Menu page 4' },
  { src: '/assets/menu/page-5.webp', w: 1024, h: 1536, bg: '#e8e4db', bgTop: '#e9e6dd', bgBottom: '#e7e3da', alt: 'Menu page 5' },
  { src: '/assets/menu/page-6.webp', w: 1024, h: 1536, bg: '#e6e2d8', bgTop: '#e5e2d8', bgBottom: '#e7e3d9', alt: 'Menu page 6' },
  { src: '/assets/menu/page-7.webp', w: 1024, h: 1536, bg: '#eae7e0', bgTop: '#ebe8e1', bgBottom: '#e9e6df', alt: 'Menu page 7: breads, curd, desserts, room service and contact details' },
]

export const stats = [
  { value: 6, suffix: '+', label: 'Luxury Rooms' },
  { value: 360, suffix: '°', label: 'Mountain Views' },
  { value: 24, suffix: '/7', label: 'Hospitality' },
  { value: 100, suffix: '%', label: 'Nature Experience' },
]

export const galleryCategories = ['All', 'Resort', 'Rooms', 'Dining', 'Food', 'Nature', 'Swimming Pool', 'Party Hall']
// Alt text names what the photo shows (by category) plus its number, so no two photos share the same alt.
const altNoun = { Resort: 'Resort building and grounds', Rooms: 'Guest room', Dining: 'Restaurant dining area', Food: 'Food served at the restaurant', Nature: 'Hill and mountain scenery near the resort', 'Swimming Pool': 'Swimming pool', 'Party Hall': 'Party hall' }
const altCount = {}
const g = (n, category, w, h, file = `gallery-${n}.jpg`) => ({ id: n, category, w, h, src: img(file), alt: `${altNoun[category] || category} at Cosmo Hill Resort, Bandla, Bilaspur (photo ${(altCount[category] = (altCount[category] || 0) + 1)})` })
export const gallery = [
  g(1, 'Resort', 1024, 682),
  g(2, 'Resort', 853, 1280),
  g(3, 'Nature', 1024, 682),
  g(4, 'Rooms', 853, 1280),
  g(5, 'Dining', 853, 1280),
  g(6, 'Swimming Pool', 853, 1280),
  g(7, 'Resort', 1024, 682),
  g(8, 'Rooms', 960, 1280),
  g(9, 'Dining', 1024, 682),
  g(10, 'Swimming Pool', 1024, 683),
  g(11, 'Rooms', 960, 1280),
  g(12, 'Swimming Pool', 853, 1280),
  g(13, 'Dining', 853, 1280),
  g(14, 'Swimming Pool', 853, 1280),
  g(15, 'Rooms', 1024, 595),
  g(16, 'Dining', 1024, 682),
  g(17, 'Rooms', 1024, 683),
  g(18, 'Resort', 853, 1280),
  g(19, 'Rooms', 853, 1280),
  g(20, 'Dining', 1024, 683),
  g(21, 'Rooms', 1024, 683),
  g(22, 'Rooms', 1280, 744),
  g(23, 'Resort', 679, 1020),
  g(24, 'Food', 1360, 1020),
  g(25, 'Resort', 777, 1020),
  g(26, 'Nature', 1080, 682),
  g(27, 'Food', 1360, 1020),
  g(28, 'Food', 1360, 1020),
  g(29, 'Food', 765, 1020),
  g(30, 'Nature', 1080, 856),
  g(31, 'Food', 1080, 640),
  g(32, 'Food', 1360, 1020),
  // Party Hall: more photos can be added as party-hall-2.jpg, 3, 4... in public/assets/images/ (then add a g(...) line here)
  g(33, 'Party Hall', 1600, 1200, 'party-hall-1.jpg'),
  g(34, 'Food', 1600, 1200),
  g(35, 'Food', 1080, 1307),
  g(36, 'Party Hall', 1080, 805, 'party-hall-2.jpg'),
  g(37, 'Party Hall', 1080, 819, 'party-hall-3.jpg'),
  g(38, 'Party Hall', 1080, 611, 'party-hall-4.jpg'),
  g(39, 'Party Hall', 1080, 610, 'party-hall-5.jpg'),
]

export const testimonials = [
  { name: 'Aarav & Meera Sharma', location: 'Chandigarh', rating: 5, text: 'An unforgettable escape surrounded by nature. The views, hospitality and peaceful atmosphere were absolutely incredible.' },
  { name: 'Priya Malhotra', location: 'New Delhi', rating: 5, text: 'We woke up above the clouds every morning. The staff remembered our tea preferences by day two. We are already planning our return.' },
  { name: 'The Kapoor Family', location: 'Ludhiana', rating: 5, text: 'The family suite was spacious, the kids loved the bonfire evening, and the food tasted like home, only better.' },
  { name: 'Rohan Verma', location: 'Jaipur', rating: 4, text: 'Quiet, clean and beautifully kept. The sunrise point alone was worth the trip. Dinner on the terrace was a highlight.' },
]

export const location = {
  title: 'Find Your Way to the Hills',
  text: 'Easy to reach by road, far enough to feel a world away.',
  nearby: [
    { name: 'Hydro Engineering College, Bandla' },
  ],
}

export const footer = {
  explore: [{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Rooms', href: '/rooms' }, { label: 'Experiences', href: '/experiences' }, { label: 'Dining', href: '/dining' }, { label: 'Places to Visit', href: '/places' }, { label: 'Gallery', href: '/gallery' }],
  services: [
    { label: 'Rooms & Suites', href: '/rooms' },
    { label: 'Restaurant & Dining', href: '/dining' },
    { label: 'Food Menu', href: '/dining' },
    { label: 'Terrace Dining', href: '/dining' },
    { label: 'Live Tandoor Grills', href: '/experiences' },
    { label: 'Swimming Pool', href: '/experiences' },
    { label: 'Events & Celebrations', href: '/contact' },
    { label: 'Contact', href: '/contact' },
  ],
  legal: [
    { label: 'Refund & Cancellation Policy', href: '/refund-cancellation-policy' },
    { label: 'Disclaimer', href: '/disclaimer' },
    { label: 'Terms and Conditions', href: '/terms-and-conditions' },
    { label: 'Privacy Policy', href: '/privacy-policy' },
  ],
}

// ---- Extra content for the Experiences and About pages ----
export const dayAtResort = [
  { time: 'Morning', icon: 'Sunrise', title: 'Mist, Tea & Slow Starts', text: 'Wake up to clouds drifting through the valley. Have your first cup of tea on the terrace, then a relaxed breakfast of fresh breads, hot parathas and fruit.' },
  { time: 'Afternoon', icon: 'Waves', title: 'Pool, Views & Lazy Lunches', text: 'Spend the warm hours by the pool, settle into a mountain-view seat with a book, or head out to the lake and viewpoints nearby. Lunch is unhurried, indoors or out.' },
  { time: 'Evening', icon: 'Sunset', title: 'Golden Hour on the Terrace', text: 'Watch the light turn gold over the ridge. Snacks come hot from the live tandoor while the hills change colour around you.' },
  { time: 'Night', icon: 'Flame', title: 'Lanterns, Bonfire & Dinner', text: 'End the day with a lantern-lit dinner, bonfire-side evenings and a sky full of stars, far from the city lights.' },
]

export const experienceDetails = [
  { icon: 'Waves', title: 'Swimming Pool', text: 'A pool that looks as good at night as it does by day. Many of our rooms face it, so the water is always in view.', points: ['Pool-facing rooms', 'Lit beautifully after dark', 'Perfect for families and groups'] },
  { icon: 'Cloud', title: 'Valley Above the Clouds', text: 'On clear mornings the mist settles into the valley below and the resort sits above it. It is the view guests remember most.', points: ['Best at sunrise', 'Visible from terraces and hill-facing rooms', 'Great for photographs'] },
  { icon: 'Sunset', title: 'Dusk on the Terrace', text: 'Our open terrace is made for the hour just before sunset. Bring a drink, bring company and let the sky do the rest.', points: ['Open-air seating', 'Warm evening light', 'Snacks and beverages on request'] },
  { icon: 'Mountain', title: 'Mountain-View Seating', text: 'Window tables, terrace chairs and quiet corners all face the ridge, so a good view is never far away.', points: ['Quiet corners to read or relax', 'Unobstructed ridge views', 'Ideal for slow conversations'] },
  { icon: 'Flame', title: 'Live Tandoor Grills', text: 'Kebabs, tikkas and breads straight from the tandoor, served hot while you sit outside.', points: ['Vegetarian and non-vegetarian options', 'Cooked fresh to order', 'Best enjoyed in the evening'] },
  { icon: 'Utensils', title: 'Terrace Dining', text: 'Meals taste better in the open air. Choose a table on the terrace for breakfast, lunch or a candle-lit dinner.', points: ['Local and international dishes', 'Lantern-lit evenings', 'Perfect for celebrations'] },
]

export const aboutStory = {
  eyebrow: 'Our story',
  title: 'A Retreat Built Around the View',
  paragraphs: [
    'The Cosmo Hill Resort stands in Village Kog, near Bandla in Himachal Pradesh. The idea was simple: build a place where the hills are the main attraction, and everything else exists to help guests enjoy them.',
    'From the pool-facing Deluxe Double Rooms to the hill-facing Executive rooms and the King Suite, every stay is planned for comfort. Plush king-size beds, soft lighting and quiet interiors let you rest properly, whether you are here for a weekend or a longer break.',
    'Our kitchen cooks with fresh, local ingredients and a patient hand, from slow mountain-view breakfasts to tandoor evenings and candle-lit dinners. Staff are warm and attentive without ever being intrusive, and we are always happy to help you plan your days around nearby lakes, temples and viewpoints.',
  ],
}

export const aboutOfferings = [
  { icon: 'BedDouble', title: 'Comfortable Rooms', text: 'Six room categories with king-size beds, work areas, seating space and views of the pool or the hills.' },
  { icon: 'Utensils', title: 'Restaurant & Terrace', text: 'An all-day restaurant, terrace dining and a menu that covers Indian, Chinese and continental favourites.' },
  { icon: 'Waves', title: 'Swimming Pool', text: 'A pool at the heart of the resort, visible from many of our rooms.' },
  { icon: 'Flame', title: 'Tandoor & Bonfire', text: 'Live tandoor grills and bonfire evenings once the sun goes down.' },
  { icon: 'Users', title: 'Events & Celebrations', text: 'A welcoming setting for family gatherings, birthdays and small celebrations.' },
  { icon: 'Compass', title: 'Local Guidance', text: 'Tips and directions for Gobind Sagar Lake, Bandla Hill Top, paragliding and nearby temples.' },
]

export const aboutPromise = [
  { icon: 'Sparkles', title: 'Warm Hospitality', text: 'We treat every guest like family, with care that is attentive but never intrusive.' },
  { icon: 'Leaf', title: 'Respect for Nature', text: 'Quiet grounds, clean mountain air and a setting we work hard to keep peaceful.' },
  { icon: 'Eye', title: 'Honest Comfort', text: 'Clean rooms, good food and fair prices, with no surprises when you arrive.' },
]
