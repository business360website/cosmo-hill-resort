// Visitor guides for the places around Bandla and Bilaspur. Each page has its own facts and angle.
// Facts come from public sources (Wikipedia: Bilaspur HP, hpbilaspur.nic.in, Tribune India, Outlook Traveller,
// Tripoto, Indianetzone). We deliberately give NO driving distances or travel times: they were not verified for
// the resort's exact location. Guests are pointed to Google Maps / the front desk instead.
const img = (n) => `/assets/images/places/${n}.jpg`

export const guideNote = 'This guide is compiled from public sources. Timings, entry rules, prices and activities change, so please confirm locally before you travel. Distances and drive times from the resort vary, so use the Get Directions button on our contact page or ask our front desk.'

export const guides = {
  '/gobind-sagar-lake': {
    h1: 'Gobind Sagar Lake: Guide for Guests Staying in Bandla',
    intro: 'Gobind Sagar is the large reservoir that shapes Bilaspur. If you are planning a stay at Cosmo Hill Resort in Bandla, here is what to know about the lake before you go.',
    image: img('gobind-sagar-lake'), w: 402, h: 298, imageAlt: 'Gobind Sagar Lake near Bilaspur, Himachal Pradesh, with hills along the shore',
    breadcrumb: 'Gobind Sagar Lake',
    about: { name: 'Gobind Sagar Lake', type: 'LakeBodyOfWater' },
    facts: [['What it is', 'A man-made reservoir on the Sutlej, created by the Bhakra Dam'], ['Named after', 'Guru Gobind Singh'], ['Where', 'Bilaspur district, Himachal Pradesh'], ['Fullest', 'October to November, when the lake is completely full'], ['Good for', 'Lake views, sunset, boat rides and a slow day out']],
    sections: [
      { h: 'About the lake', p: ['Gobind Sagar was formed when the Sutlej was dammed at Bhakra. The old town of Bilaspur went under water and a new town was built on the slope above it, which is why Bilaspur now looks down on the lake. The lake is named after Guru Gobind Singh.', 'The hills around the shore, including the Bandla hills, make the lake especially scenic from above. Bandla Hill Top, covered in our Bandla guide, is one of the places people use to see it from height.'] },
      { h: 'Things to do around the lake', p: ['Boat rides and shikara trips are popular here, and the district administration has been working to build up water tourism, including trials of cruise boats and parasailing. Water activities change with season, water level and operator, so check what is running on the day you visit.', 'If you would rather watch than ride, the shoreline and viewpoints are good for photographs, especially in the evening light. Paragliders also land on the lake bank at Luhnu, which makes it a good place to watch flights come down.'] },
      { h: 'Staying at Cosmo Hill Resort', p: ['Cosmo Hill Resort is in Village Kog, near Hydro Engineering College, Bandla. Our rooms look out over the pool or the mountains, and the terrace restaurant is a good place to end a lake day. Our team can suggest a plan for the day and help with directions.'] },
    ],
    faqs: [
      { q: 'What can I do at Gobind Sagar Lake?', a: 'Visitors come for the views and for boat rides, including shikara and cruise-style boats. Other water activities have been trialled by the district administration. Availability changes, so confirm on the day.' },
      { q: 'When is the lake fullest?', a: 'The lake is at its fullest from October to November, according to public records for Bilaspur.' },
      { q: 'How far is the lake from the resort?', a: 'We do not quote a fixed travel time because it depends on the exact spot on the lake and the road. Use Get Directions on our contact page or ask our front desk.' },
    ],
    related: ['/bandla-hill-top-paragliding', '/naina-devi-temple'],
    placeAnchor: 'gobind-sagar-lake',
  },

  '/bandla-hill-top-paragliding': {
    h1: 'Bandla Hill Top and Paragliding: Visitor Guide',
    intro: 'Bandla is the hill range that gives this part of Bilaspur its name, and Cosmo Hill Resort is in Village Kog near Bandla. Here is a short guide to the view from the top and to paragliding from the Bandla hills.',
    image: img('paragliding-bandla'), w: 436, h: 290, imageAlt: 'Paraglider flying over the Bandla hills near Bilaspur, Himachal Pradesh',
    breadcrumb: 'Bandla Hill Top and Paragliding',
    about: { name: 'Bandla Hill Top', type: 'TouristAttraction' },
    facts: [['Bandla Hill Top', 'A viewpoint in Bandla Dhar, Bilaspur district, with views of the valley, Bilaspur town and Gobind Sagar'], ['Paragliding take-off', 'Bandla top'], ['Landing area', 'The bank of Gobind Sagar Lake at Luhnu'], ['Training', 'Paragliding courses run at Bandla Dhar by the Himachal Aero Adventure Institute']],
    sections: [
      { h: 'The view from Bandla Hill Top', p: ['The top of the Bandla hills looks over green slopes, the town of Bilaspur and the long blue arm of Gobind Sagar Lake. It is a popular picnic and sunset spot. Go early for clearer skies and cooler air, and carry water.'] },
      { h: 'Paragliding at Bandla', p: ['The district tourism pages describe Bandla top as an approved take-off site, with landing grounds on the shore of Gobind Sagar at Luhnu. A big lake next to the landing area is unusual, and it is one reason Bilaspur is used for paragliding training.', 'Tandem flights let you fly with an experienced pilot without any training. Flights depend on wind and weather and the operator decides on the day. Ask the operator about pilot certification, safety equipment and the full price before you book. We do not run paragliding ourselves.'] },
      { h: 'Plan your day from the resort', p: ['Cosmo Hill Resort is in Village Kog, near Bandla. Many guests do a morning at the hill top or a flight, then come back for lunch on the terrace and an afternoon by the pool. Our front desk can help you plan the timing.'] },
    ],
    faqs: [
      { q: 'Where do paragliders take off and land at Bandla?', a: 'Flights take off from Bandla top and land on the bank of Gobind Sagar Lake at Luhnu, according to the Bilaspur district website.' },
      { q: 'Can beginners try paragliding?', a: 'Tandem flights are designed for people with no experience. Ask the operator about safety, pilot qualifications and any health or weight limits.' },
      { q: 'Does the resort arrange paragliding?', a: 'No, we do not operate it. We can point you in the right direction and help you plan the day.' },
    ],
    related: ['/gobind-sagar-lake', '/naina-devi-temple'],
    placeAnchor: 'bandla-hill-top',
  },

  '/naina-devi-temple': {
    h1: 'Naina Devi Temple: Visitor Guide for Your Bilaspur Trip',
    intro: 'Shri Naina Devi Ji is the best known place of worship in Bilaspur district. Here is what visitors should know, and how to fit it into a stay at Cosmo Hill Resort.',
    image: img('naina-devi-temple'), w: 1530, h: 722, imageAlt: 'Naina Devi Temple on its hilltop in Bilaspur district, Himachal Pradesh',
    breadcrumb: 'Naina Devi Temple',
    about: { name: 'Naina Devi Temple', type: 'HinduTemple' },
    facts: [['What it is', 'A hilltop temple of Goddess Naina Devi, counted among the Shakti Peeths'], ['District', 'Bilaspur, Himachal Pradesh'], ['View', 'The hills here overlook Gobind Sagar Lake'], ['Getting up', 'By road to a point, then concrete steps; a cable car also runs from the base to the top']],
    sections: [
      { h: 'About the temple', p: ['Naina Devi sits on a hilltop in Bilaspur district. It is one of the Shakti Peeths, the sacred sites of the Goddess, and draws pilgrims through the year. From the hill you look out over Gobind Sagar Lake.'] },
      { h: 'Getting to the shrine', p: ['The road winds around the hill up to a certain point. From there it is a climb on concrete steps. A cable car takes pilgrims from the base of the hill to the top, which helps elders and young children. Operating hours and fares are set locally, so check before you go.'] },
      { h: 'Tips for visitors', p: ['Dress modestly and check locally what you can carry inside. Crowds are larger on festival days and weekends, so plan an early start. Combine the visit with Gobind Sagar Lake or the other Bilaspur temples in our temples guide.', 'We do not quote a drive time from the resort because it depends on the route and traffic. Use Get Directions on our contact page, or ask our front desk when you arrive.'] },
    ],
    faqs: [
      { q: 'Is Naina Devi Temple in Bilaspur district?', a: 'Yes. It stands on a hilltop in Bilaspur district, Himachal Pradesh, and the hill overlooks Gobind Sagar Lake.' },
      { q: 'Is there a cable car?', a: 'Yes, a cable car carries visitors from the base of the hill to the top. Confirm timings and tickets locally.' },
      { q: 'Can I stay at Cosmo Hill Resort and visit Naina Devi?', a: 'Many guests build a temple visit into a Bilaspur stay. We are in Village Kog, near Bandla; check the route in Google Maps and plan an early start.' },
    ],
    related: ['/temples-near-bilaspur', '/gobind-sagar-lake'],
    placeAnchor: 'naina-devi-temple',
  },

  '/temples-near-bilaspur': {
    h1: 'Temples Around Bilaspur: Laxmi Narayan, Markandeya and Baba Nahar Singh',
    intro: 'Old Bilaspur was known as a town of temples. Three that visitors often add to a stay are the Laxmi Narayan Temple, the Markandeya Rishi Temple and the Baba Nahar Singh Bajiya Ji Temple.',
    image: img('laxmi-narayan-temple'), w: 840, h: 737, imageAlt: 'Laxmi Narayan Temple in Bilaspur, Himachal Pradesh',
    breadcrumb: 'Temples Around Bilaspur',
    about: { name: 'Temples in Bilaspur, Himachal Pradesh', type: 'TouristDestination' },
    facts: [['Laxmi Narayan Temple', 'Bilaspur town, rebuilt after old Bilaspur went under Gobind Sagar'], ['Markandeya Rishi Temple', 'Named after Rishi Markandeya, with a spring nearby; listed about 20 km from Bilaspur'], ['Baba Nahar Singh Bajiya Ji Temple', 'At Dholra in Bilaspur town']],
    sections: [
      { h: 'Laxmi Narayan Temple', p: ['The original temple stood in old Bilaspur before the Bhakra dam drowned the town. After the new town came up, the temple was built again. It holds images of Laxmi Narayan, Shiva, Rangnath, Goddess Durga and Baba Bangali, some saved from the old town.'] },
      { h: 'Markandeya Rishi Temple', p: ['This peaceful shrine is named after Rishi Markandeya. Local accounts say he prayed here for a son. A spring near the temple is considered sacred, and many visitors come to sit quietly. Public sources list it about 20 km from Bilaspur town, so allow time for the drive.'] },
      { h: 'Baba Nahar Singh Bajiya Ji Temple', p: ['The temple at Dholra in Bilaspur town is worshipped by people across the district. Baba Nahar Singh is also called Bajia, Peepal Wala and Dalian Wala. The legend says he was worshipped at Naggar in Kullu and came with a princess who married Raja Deep Chand of Bilaspur, so a temple was built for him. His wooden sandals, the kharaun, represent him in the shrine.'] },
      { h: 'Planning the visit', p: ['The three temples are in different directions, so plan them separately rather than as a single loop. Dress modestly and check darshan timings locally. Naina Devi, the district\u2019s best-known temple, has its own page.'] },
    ],
    faqs: [
      { q: 'Which temples can I visit around Bilaspur?', a: 'Popular ones include Laxmi Narayan Temple, Markandeya Rishi Temple, Baba Nahar Singh Bajiya Ji Temple and Naina Devi Temple.' },
      { q: 'Where is the Baba Nahar Singh Bajiya Ji Temple?', a: 'At Dholra in Bilaspur town, according to district tourism information.' },
      { q: 'How far is each temple from the resort?', a: 'Distances vary by route and we have not verified fixed times. Use Get Directions on our contact page or ask our front desk.' },
    ],
    related: ['/naina-devi-temple', '/gobind-sagar-lake'],
    placeAnchor: 'laxmi-narayan-temple',
  },
}
