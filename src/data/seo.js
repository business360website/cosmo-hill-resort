// Single source of truth for SEO: site URL, per-page metadata and structured data.
// Used by the browser (to keep <head> right while navigating) and by the build (to pre-render every page).
import { brand, rooms } from './resortData'
import { legalPages } from './legalPages'
import { guides } from './guides'

// Set SITE_URL when building (see README). It is injected by vite.config.js.
export const SITE_URL = String(__SITE_URL__).replace(/\/+$/, '')
export const abs = (p = '/') => SITE_URL + (p === '/' ? '/' : p)
const OG_IMAGE = '/assets/og-cosmo-hill-resort.jpg'

const legalMeta = {
  '/refund-cancellation-policy': ['Refund & Cancellation Policy | Cosmo Hill Resort, HP', 'How cancellations, date changes and refunds work for stays booked with The Cosmo Hill Resort in Bandla, Bilaspur, Himachal Pradesh. Read it before you book.'],
  '/disclaimer': ['Website Disclaimer | The Cosmo Hill Resort, Bandla HP', 'Disclaimer for The Cosmo Hill Resort website: accuracy of information, photos, third-party links and details about local attractions near Bandla.'],
  '/terms-and-conditions': ['Terms and Conditions | The Cosmo Hill Resort, Bandla', 'Terms and conditions for booking and staying at The Cosmo Hill Resort, Bandla, Bilaspur, Himachal Pradesh: reservations, payments, check-in and guest rules.'],
  '/privacy-policy': ['Privacy Policy | The Cosmo Hill Resort, Bandla, Bilaspur', 'How The Cosmo Hill Resort in Bandla, Bilaspur collects, uses and protects your personal and booking information when you use our website or book a stay.'],
}

// h1 = visible page heading (keeps the same look; just more descriptive). index:false => noindex and left out of the sitemap.
export const routes = {
  '/': { title: 'Best Hotel in Bandla, Bilaspur HP | Cosmo Hill Resort', description: 'Stay at The Cosmo Hill Resort in Bandla, Bilaspur, Himachal Pradesh. Pool-view rooms, terrace dining and Gobind Sagar Lake nearby. Book your stay online.', crumb: 'Home', kind: 'home', priority: 1.0, changefreq: 'weekly', keyword: 'best hotel in Bandla Bilaspur HP' },
  '/rooms': { title: 'Rooms & Suites in Bandla, Bilaspur HP | Cosmo Hill Resort', description: 'Compare double, queen, executive and king rooms at Cosmo Hill Resort, Bandla, Bilaspur. Pool or mountain views, free WiFi, from ₹2,500. Book direct online.', h1: 'Rooms & Suites in Bandla, Bilaspur', lead: 'Five room categories with pool or mountain views, a private bathroom and free WiFi. All rooms take up to 2 guests.', crumb: 'Rooms & Suites', kind: 'rooms', priority: 0.9, changefreq: 'monthly', keyword: 'hotel in Bilaspur Himachal Pradesh' },
  '/about': { title: 'About Cosmo Hill Resort | Hotel in Bandla, Bilaspur', description: 'Learn about The Cosmo Hill Resort in Village Kog, Bandla, Bilaspur: our story, rooms, restaurant and local tips for Gobind Sagar Lake and nearby temples.', h1: 'About Cosmo Hill Resort, Bandla', crumb: 'About', kind: 'about', priority: 0.7, changefreq: 'monthly', keyword: 'resort in Bandla Bilaspur' },
  '/experiences': { title: 'Resort Experiences in Bandla, Bilaspur | Cosmo Hill', description: 'Swimming pool, terrace dining, live tandoor grills, mountain views and a party hall at Cosmo Hill Resort, Bandla, Bilaspur. See a day at the resort.', h1: 'Experiences at the Resort', lead: 'The pool, the terrace, the tandoor and the views: what you can enjoy without leaving the resort.', crumb: 'Experiences', kind: 'collection', priority: 0.7, changefreq: 'monthly', keyword: 'resort for family holidays in Himachal Pradesh' },
  '/dining': { title: 'Restaurant & Menu in Bandla, Bilaspur | Cosmo Hill', description: 'Browse the menu at Cosmo Hill Resort in Bandla, Bilaspur: breakfast, tandoor grills, Indian, Chinese and continental dishes, with mountain-view seating.', h1: 'Restaurant & Menu at Cosmo Hill Resort', crumb: 'Dining', kind: 'collection', priority: 0.7, changefreq: 'monthly', keyword: 'restaurant in Bandla Bilaspur' },
  '/places': { title: 'Places to Visit near Bandla & Bilaspur | Cosmo Hill', description: 'Gobind Sagar Lake, Bandla Hill Top, paragliding, Naina Devi and Bilaspur\u2019s temples: a local guide for guests staying at Cosmo Hill Resort, Bandla.', h1: 'Places to Visit near Bandla & Bilaspur', lead: 'Lakes, hilltops, temples and adventure around Bilaspur. Open a guide for facts, tips and directions.', crumb: 'Places', kind: 'collection', priority: 0.8, changefreq: 'monthly', keyword: 'hotels near tourist attractions in Bilaspur' },
  '/gallery': { title: 'Photo Gallery | Cosmo Hill Resort, Bandla Bilaspur', description: 'See photos of Cosmo Hill Resort in Bandla, Bilaspur: rooms, swimming pool, restaurant, terrace views, party hall and food. Then book your stay online.', h1: 'Resort Photo Gallery', crumb: 'Gallery', kind: 'collection', priority: 0.6, changefreq: 'monthly', keyword: 'Cosmo Hill Resort photos' },
  '/contact': { title: 'Contact & Directions | Cosmo Hill Resort, Bandla HP', description: 'Call, email or get directions to The Cosmo Hill Resort, Village Kog, near Hydro Engineering College, Bandla, Bilaspur. Book rooms or ask about events.', h1: 'Contact & Directions, Bandla, Bilaspur', crumb: 'Contact', kind: 'contact', priority: 0.8, changefreq: 'yearly', keyword: 'Cosmo Hill Resort contact' },
  '/book': { title: 'Book Your Stay | Cosmo Hill Resort, Bandla Bilaspur', description: 'Choose your dates and room at The Cosmo Hill Resort, Bandla, Bilaspur, and pay online to confirm your stay. Secure payment through Razorpay.', h1: 'Book Your Stay', lead: 'Pick your dates and room, enter your details and pay online to confirm.', crumb: 'Book', kind: 'page', index: false, keyword: 'book hotel Bandla Bilaspur' },
  '/gobind-sagar-lake': { title: 'Hotel near Gobind Sagar Lake, Bilaspur | Cosmo Hill', description: 'Planning a trip to Gobind Sagar Lake? Read our Bilaspur lake guide and stay at Cosmo Hill Resort, Bandla. Boating, views and tips for visitors.', crumb: 'Gobind Sagar Lake', kind: 'guide', priority: 0.8, changefreq: 'monthly', keyword: 'hotel near Gobind Sagar Lake' },
  '/bandla-hill-top-paragliding': { title: 'Bandla Hill Top & Paragliding Guide | Cosmo Hill Resort', description: 'Visitor guide to Bandla Hill Top views and paragliding over Gobind Sagar Lake, with a stay at Cosmo Hill Resort in Bandla, Bilaspur, Himachal Pradesh.', crumb: 'Bandla Hill Top and Paragliding', kind: 'guide', priority: 0.8, changefreq: 'monthly', keyword: 'hotel near Bandla Hill Top / paragliding at Bandla Hills' },
  '/naina-devi-temple': { title: 'Naina Devi Temple Guide & Stay in Bilaspur | Cosmo Hill', description: 'Visiting Naina Devi Temple? A short guide to the Shakti Peeth in Bilaspur district, and where to stay at Cosmo Hill Resort, Bandla. Plan your trip.', crumb: 'Naina Devi Temple', kind: 'guide', priority: 0.8, changefreq: 'monthly', keyword: 'hotel near Naina Devi Temple' },
  '/temples-near-bilaspur': { title: 'Temples near Bilaspur HP: Visitor Guide | Cosmo Hill', description: 'Laxmi Narayan, Markandeya Rishi and Baba Nahar Singh Bajiya Ji temples around Bilaspur, Himachal Pradesh, with stay tips from Cosmo Hill Resort, Bandla.', crumb: 'Temples Around Bilaspur', kind: 'guide', priority: 0.7, changefreq: 'monthly', keyword: 'hotel near Laxmi Narayan / Markandeya Rishi / Baba Nahar Singh temple' },
}
Object.entries(legalPages).forEach(([r, pg]) => {
  routes[r] = { title: legalMeta[r][0], description: legalMeta[r][1], crumb: pg.title, kind: 'page', priority: 0.3, changefreq: 'yearly', keyword: pg.title.toLowerCase() }
})
Object.entries(guides).forEach(([r, g]) => { routes[r].h1 = g.h1; routes[r].lead = g.intro })
// Not a real page: used for the 404 file only.
export const notFound = { title: 'Page Not Found | Cosmo Hill Resort', description: 'This page could not be found. Visit the Cosmo Hill Resort homepage to see rooms, dining and places to visit near Bandla, Bilaspur.', index: false }

export const isRoute = (p) => Object.prototype.hasOwnProperty.call(routes, p)
export const indexableRoutes = () => Object.keys(routes).filter((r) => routes[r].index !== false)

const hotelId = abs('/') + '#hotel'
const siteId = abs('/') + '#website'

const hotelNode = (withRooms = false) => ({
  '@type': 'Hotel', '@id': hotelId, name: brand.name, url: abs('/'),
  description: 'A resort in Village Kog, Bandla, Bilaspur, Himachal Pradesh with pool-view and mountain-view rooms, a restaurant with terrace dining, a swimming pool and a party hall.',
  image: [abs('/assets/images/gallery-1.jpg'), abs('/assets/images/about-resort.jpg'), abs('/assets/images/gallery-10.jpg')],
  logo: abs(brand.logo), telephone: brand.phone, email: brand.email,
  priceRange: '₹2,500 - ₹4,500',
  address: { '@type': 'PostalAddress', streetAddress: 'Village Kog, near Hydro Engineering College', addressLocality: 'Bandla', addressRegion: 'Himachal Pradesh', postalCode: '174001', addressCountry: 'IN' },
  geo: { '@type': 'GeoCoordinates', latitude: brand.lat, longitude: brand.lng },
  hasMap: brand.mapsUrl,
  amenityFeature: [{ '@type': 'LocationFeatureSpecification', name: 'Swimming pool', value: true }, { '@type': 'LocationFeatureSpecification', name: 'Free WiFi', value: true }, { '@type': 'LocationFeatureSpecification', name: 'Restaurant', value: true }],
  ...(withRooms ? { containsPlace: rooms.map((r) => ({ '@type': 'HotelRoom', name: r.name, description: r.text, image: abs(r.image), bed: { '@type': 'BedDetails', numberOfBeds: 1, typeOfBed: 'Double bed' }, occupancy: { '@type': 'QuantitativeValue', maxValue: 2 }, floorSize: { '@type': 'QuantitativeValue', value: Number(r.size.replace(/[^\d.]/g, '')), unitCode: 'MTK' } })) } : {}),
})

const webPageType = { about: 'AboutPage', contact: 'ContactPage', collection: 'CollectionPage' }

export function schemaFor(path) {
  const r = routes[path]
  if (!r) return null
  const url = abs(path)
  const page = { '@type': webPageType[r.kind] || 'WebPage', '@id': url + '#webpage', url, name: r.title, description: r.description, inLanguage: 'en-IN', isPartOf: { '@id': siteId }, primaryImageOfPage: { '@type': 'ImageObject', url: abs(OG_IMAGE), width: 1200, height: 630 } }
  const graph = []
  if (path === '/') {
    graph.push({ '@type': 'WebSite', '@id': siteId, url: abs('/'), name: brand.name, inLanguage: 'en-IN', publisher: { '@id': hotelId } })
    graph.push(hotelNode(false))
    graph.push({ ...page, about: { '@id': hotelId } })
  } else {
    graph.push({ '@type': 'WebSite', '@id': siteId, url: abs('/'), name: brand.name, publisher: { '@id': hotelId } })
    const withHotel = ['rooms', 'about', 'contact'].includes(r.kind) || path === '/rooms'
    if (withHotel) graph.push(hotelNode(path === '/rooms'))
    else graph.push({ '@type': 'Hotel', '@id': hotelId, name: brand.name, url: abs('/') })
    const g = guides[path]
    graph.push({ ...page, ...(withHotel ? { about: { '@id': hotelId } } : {}), ...(g ? { about: { '@type': g.about.type === 'LakeBodyOfWater' ? 'LakeBodyOfWater' : g.about.type, name: g.about.name, containedInPlace: { '@type': 'AdministrativeArea', name: 'Bilaspur district, Himachal Pradesh, India' } } } : {}) })
    graph.push({ '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: abs('/') }, ...(g ? [{ '@type': 'ListItem', position: 2, name: 'Places', item: abs('/places') }, { '@type': 'ListItem', position: 3, name: r.crumb, item: url }] : [{ '@type': 'ListItem', position: 2, name: r.crumb, item: url }])] })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

// All <head> tags that depend on the page. Marked data-seo so the browser can swap them when navigating.
export function headTags(path, { is404 = false } = {}) {
  const r = is404 ? notFound : routes[path]
  const url = abs(path)
  const robots = r.index === false ? 'noindex, follow' : 'index, follow, max-image-preview:large'
  const ogImg = abs(OG_IMAGE)
  const t = []
  t.push(`<title data-seo>${esc(r.title)}</title>`)
  t.push(`<meta data-seo name="description" content="${esc(r.description)}" />`)
  t.push(`<meta data-seo name="robots" content="${robots}" />`)
  if (!is404) t.push(`<link data-seo rel="canonical" href="${esc(url)}" />`)
  t.push(`<meta data-seo property="og:site_name" content="${esc(brand.name)}" />`)
  t.push(`<meta data-seo property="og:locale" content="en_IN" />`)
  t.push(`<meta data-seo property="og:type" content="${path === '/' ? 'website' : 'article'}" />`)
  t.push(`<meta data-seo property="og:title" content="${esc(r.title)}" />`)
  t.push(`<meta data-seo property="og:description" content="${esc(r.description)}" />`)
  if (!is404) t.push(`<meta data-seo property="og:url" content="${esc(url)}" />`)
  t.push(`<meta data-seo property="og:image" content="${esc(ogImg)}" />`)
  t.push(`<meta data-seo property="og:image:width" content="1200" />`)
  t.push(`<meta data-seo property="og:image:height" content="630" />`)
  t.push(`<meta data-seo property="og:image:alt" content="The Cosmo Hill Resort building in Bandla, Bilaspur, Himachal Pradesh" />`)
  t.push(`<meta data-seo name="twitter:card" content="summary_large_image" />`)
  t.push(`<meta data-seo name="twitter:title" content="${esc(r.title)}" />`)
  t.push(`<meta data-seo name="twitter:description" content="${esc(r.description)}" />`)
  t.push(`<meta data-seo name="twitter:image" content="${esc(ogImg)}" />`)
  const ld = is404 ? null : schemaFor(path)
  if (ld) t.push(`<script data-seo type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`)
  return t.join('\n    ')
}

export function sitemapXml() {
  const urls = indexableRoutes().map((r) => `  <url>\n    <loc>${abs(r)}</loc>\n    <changefreq>${routes[r].changefreq}</changefreq>\n    <priority>${routes[r].priority.toFixed(1)}</priority>\n  </url>`)
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}
export const robotsTxt = () => `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${abs('/sitemap.xml')}\n`
