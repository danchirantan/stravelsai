import { Trip, Destination, Hotel, Restaurant, Expense, Booking, TravelDocument, TravelCompanion, NotificationItem, TripMemory, SuggestedItineraryItem } from '../types/travel';
import { RAJASTHAN_DEMO_TRIP } from './rajasthanTrip';
import { RAJASTHAN_SUGGESTED_ITEMS } from './rajasthanSuggestions';
import { ALL_EXPANDED_DESTINATIONS } from './destinationPlaces';

// Default Demo Trip is the authentic Royal Rajasthan Journey
export const DEMO_TRIP: Trip = RAJASTHAN_DEMO_TRIP;

export const MOCK_DESTINATIONS: Destination[] = ALL_EXPANDED_DESTINATIONS;

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Samode Haveli Heritage Estate',
    city: 'Jaipur',
    rating: 4.96,
    reviewsCount: 384,
    pricePerNight: 19500,
    currency: 'INR',
    style: 'Royal Haveli',
    amenities: ['Mughal Style Courtyard Pool', 'Shekhawati Hand-Painted Suites', 'Ayurvedic Spa Sanctuary', '24/7 Royal Butler Service'],
    aiReason: '12 minutes from your Day 1 sunset stop at Hawa Mahal; preserves 175-year Rajput aristocratic provenance without compromising modern luxury.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
    distanceToKeySpot: '8 min walk to Old City Bazaars'
  },
  {
    id: 'hotel-2',
    name: 'RAAS Jodhpur Beneath Mehrangarh',
    city: 'Jodhpur',
    rating: 4.94,
    reviewsCount: 412,
    pricePerNight: 24800,
    currency: 'INR',
    style: 'Heritage Palace',
    amenities: ['Direct Mehrangarh Fort View Heated Pool', 'Rose-Pink Sandstone Architecture', 'Stepwell Courtyard Bar', 'Bespoke Blue City Tuk-Tuk Tours'],
    aiReason: 'Directly at the foot of Mehrangarh Fort ramparts. Evening lighting illuminates the sheer stone battlements right from your private terrace.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    distanceToKeySpot: '4 min walk to Stepwell Square'
  },
  {
    id: 'hotel-3',
    name: 'Suryagarh Thar Desert Sanctuary',
    city: 'Jaisalmer',
    rating: 4.92,
    reviewsCount: 295,
    pricePerNight: 21000,
    currency: 'INR',
    style: 'Desert Luxury Camp',
    amenities: ['Golden Sandstone Courtyards', 'Sunset Dune Camel Rides', 'Rait Desert Spa', 'Manganiyar Folk Courtyard Soirees'],
    aiReason: 'Architectural marvel built from golden Jaisalmer sandstone. Positioned at the gateway to the Thar Desert dunes for sublime stargazing.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
    distanceToKeySpot: '15 min drive to Sam Sand Dunes'
  },
  {
    id: 'hotel-4',
    name: 'Taj Lake Palace on Lake Pichola',
    city: 'Udaipur',
    rating: 4.98,
    reviewsCount: 520,
    pricePerNight: 32000,
    currency: 'INR',
    style: 'Lakeside Sanctuary',
    amenities: ['Private Lake Pichola Boat Transfers', 'Marble Courtyard Lily Ponds', 'Jiva Royal Spa Boat', 'Rooftop Mewar Fine Dining'],
    aiReason: '18th-century white marble royal summer palace floating in the middle of Lake Pichola. Unsurpassed romantic vistas of City Palace and Aravalli hills.',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    distanceToKeySpot: '5 min private boat to City Palace Jetty'
  },
  {
    id: 'hotel-5',
    name: 'Brunton Boatyard Heritage Retreat',
    city: 'Kochi',
    rating: 4.95,
    reviewsCount: 340,
    pricePerNight: 21000,
    currency: 'INR',
    style: 'Colonial Harbour Villa',
    amenities: ['Harbour Sea-view Verandahs', 'Private Pier Sunset Cruises', 'Ayurvedic Treatment Suites', 'Cochin Spice Waterfront Dining'],
    aiReason: 'Restored Victorian shipyard architecture looking out over Chinese fishing nets and historic Cochin channel waters.',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop',
    distanceToKeySpot: '4 min walk to Vasco da Gama Square'
  },
  {
    id: 'hotel-6',
    name: 'The Grand Dragon Ladakh',
    city: 'Leh',
    rating: 4.93,
    reviewsCount: 460,
    pricePerNight: 18500,
    currency: 'INR',
    style: 'High-Altitude Luxury Sanctuary',
    amenities: ['Oxygen-Enriched Executive Suites', 'Stok Kangri Mountain Glacier Vistas', 'Underfloor Heating', 'Zasgyath Ladakhi Specialty Dining'],
    aiReason: 'Premier luxury retreat in Leh offering medical-grade oxygen support and traditional Ladakhi carved cedar woodwork.',
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop',
    distanceToKeySpot: '10 min walk to Old Leh Bazaar'
  },
  {
    id: 'hotel-7',
    name: 'Ahilya by the Sea',
    city: 'Panaji',
    rating: 4.97,
    reviewsCount: 310,
    pricePerNight: 26000,
    currency: 'INR',
    style: 'Seaside Portuguese Estate',
    amenities: ['Two Seawater Infinity Pools', 'Banyan Tree Frangipani Gardens', 'Private Al Fresco Dining', 'Direct Dolphin Bay Oceanfront'],
    aiReason: 'Private family haven tucked away at Dolphin Bay in Nerul, surrounded by curated Indian and Portuguese antiquities.',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop',
    distanceToKeySpot: '12 min drive to Fontainhas Latin Quarter'
  },
  {
    id: 'hotel-8',
    name: 'BrijRama Palace on Darbhanga Ghat',
    city: 'Varanasi',
    rating: 4.98,
    reviewsCount: 580,
    pricePerNight: 28000,
    currency: 'INR',
    style: 'Sacred Riverfront Palace',
    amenities: ['Private Bajra Riverboat Arrivals', 'Darbhanga Ghat Private Terrace', 'Live Classical Morning Sitar Recitals', 'Pure Vegetarian Royal Sattvic Dining'],
    aiReason: '1812 Maratha dynasty stone fortress standing directly over the sacred Ganges steps, with hand-carved stone balconies.',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format&fit=crop',
    distanceToKeySpot: 'Steps from Dashashwamedh Ganga Aarti'
  }
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-1',
    name: 'Laxmi Mishthan Bhandar (LMB 1954)',
    city: 'Jaipur',
    cuisine: 'Royal Rajasthani Thali',
    rating: 4.92,
    priceTier: '₹₹',
    avgPrice: 2800,
    atmosphere: 'Historic Johari Bazaar institution since 1954',
    distance: '3 min walk from Johari Bazaar walk',
    dietary: ['Pure Vegetarian', 'Jain options available'],
    aiContext: 'You are concluding your Day 1 Johari Bazaar heritage walk at 19:45; reserved table ready for the legendary 16-dish Rajasthani royal thali.',
    imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800&auto=format&fit=crop',
    recommendedDish: 'Royal Rajasthani Thali with Ker Sangri, Gatte ki Sabzi, and hot Malpua'
  },
  {
    id: 'rest-2',
    name: '1135 AD at Amer Fort',
    city: 'Jaipur',
    cuisine: 'Royal Rajput Fine Dining',
    rating: 4.95,
    priceTier: '₹₹₹₹',
    avgPrice: 4200,
    atmosphere: 'Imperial courtyard with gold-leaf walls and live sitar',
    distance: 'Directly inside Amer Fort ramparts',
    dietary: ['Vegetarian & Meat specialties', 'Halal certified'],
    aiContext: 'Directly follows your Day 2 morning exploration of Sheesh Mahal (Mirror Palace) before afternoon crowds peak.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    recommendedDish: 'Jungli Maas slow-cooked in pure desi ghee with whole red chilies'
  },
  {
    id: 'rest-3',
    name: 'Indique Rooftop at Pal Haveli',
    city: 'Jodhpur',
    cuisine: 'Mewari & Tandoori Heritage',
    rating: 4.88,
    priceTier: '₹₹₹',
    avgPrice: 3400,
    atmosphere: 'Panoramic candlelit rooftop gazing up at the glowing Mehrangarh Fort',
    distance: '5 min walk from Clock Tower Square',
    dietary: ['Gluten-conscious', 'North Indian specialties'],
    aiContext: 'Sunset dining table reserved at 19:30, aligning perfectly with Mehrangarh Fort evening floodlighting.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    recommendedDish: 'Laal Maas with Bajra Roti and cooling smoked Boondi Raita'
  },
  {
    id: 'rest-4',
    name: 'Ambrai at Amet Haveli Waterfront',
    city: 'Udaipur',
    cuisine: 'Mewari Royal Dining',
    rating: 4.96,
    priceTier: '₹₹₹',
    avgPrice: 3800,
    atmosphere: 'Waterfront terrace directly bordering Lake Pichola with City Palace reflections',
    distance: 'Steps from Hanuman Ghat',
    dietary: ['Extensive vegetarian menu', 'Fresh lake breezes'],
    aiContext: 'Reserved frontline waterside table for your Day 7 farewell dinner as twilight settles over Lake Pichola.',
    imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=800&auto=format&fit=crop',
    recommendedDish: 'Mewari Khargosh or Paneer Tikka Lababdar with Saffron Pulao'
  },
  {
    id: 'rest-5',
    name: 'Malabar Junction at The Malabar House',
    city: 'Kochi',
    cuisine: 'Kerala Seafood & Coastal Fusion',
    rating: 4.94,
    priceTier: '₹₹₹',
    avgPrice: 3100,
    atmosphere: 'Lush open courtyard with mango trees and classical Karnatic instrumentals',
    distance: 'Parade Ground, Fort Kochi',
    dietary: ['Fresh Wild Catch', 'Gluten-Free coconut curries'],
    aiContext: 'Waterfront dinner after sunset at the Chinese fishing nets; features fresh jumbo prawns simmered in raw mango gravy.',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800&auto=format&fit=crop',
    recommendedDish: 'Meen Pollichathu wrapped in charred banana leaf with red Kerala Matta rice'
  },
  {
    id: 'rest-6',
    name: 'The Tibetan Kitchen',
    city: 'Leh',
    cuisine: 'Himalayan & Ladakhi Heritage',
    rating: 4.91,
    priceTier: '₹₹',
    avgPrice: 2200,
    atmosphere: 'Warm wooden pine dining room with yak-wool rugs and mountain vistas',
    distance: 'Fort Road, Leh',
    dietary: ['Comforting warming broths', 'Vegetarian momos'],
    aiContext: 'Steaming bowl of hand-pulled Skyu stew to nourish after crossing Khardung La pass.',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800&auto=format&fit=crop',
    recommendedDish: 'Traditional Skyu Root Stew and Tingmo steamed lotus buns'
  },
  {
    id: 'rest-7',
    name: 'Viva Panjim Heritage Tavern',
    city: 'Panaji',
    cuisine: 'Goan-Portuguese Ancestral',
    rating: 4.93,
    priceTier: '₹₹',
    avgPrice: 2400,
    atmosphere: 'Cozy 18th-century heritage house courtyard on 31st January Road',
    distance: 'Fontainhas Latin Quarter',
    dietary: ['Seafood specialties', 'Ancestral recipes'],
    aiContext: 'Authentic dinner following your heritage walk through the pastel alleys of Fontainhas.',
    imageUrl: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=800&auto=format&fit=crop',
    recommendedDish: 'Pork Vindaloo slow-braised with palm vinegar & warm Bebinca with vanilla ice cream'
  },
  {
    id: 'rest-8',
    name: 'Kashi Chaat Bhandar & Godowlia Sweets',
    city: 'Varanasi',
    cuisine: 'Kashi Sacred Street Gastronomy',
    rating: 4.96,
    priceTier: '₹',
    avgPrice: 900,
    atmosphere: 'Vibrant timeless street-side hearth serving earthenware clay bowls',
    distance: 'Godowlia Chowk, Varanasi',
    dietary: ['Pure Vegetarian', 'Sattvic preparation'],
    aiContext: 'Unmissable culinary stop right after evening Ganga Aarti at Dashashwamedh Ghat.',
    imageUrl: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?q=80&w=800&auto=format&fit=crop',
    recommendedDish: 'Tamatar Chaat sizzled with desi ghee, topped with cumin syrup and crisp sev'
  }
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'exp-1', category: 'Flights', title: 'Air India Express Flight (DEL ↔ JAI)', amount: 14500, currency: 'INR', paidBy: 'Chirantan', date: '2026-11-01', status: 'Actual', city: 'Jaipur' },
  { id: 'exp-2', category: 'Hotels', title: 'Samode Haveli Jaipur (2 Nights)', amount: 39000, currency: 'INR', paidBy: 'Chirantan', date: '2026-11-08', status: 'Actual', city: 'Jaipur' },
  { id: 'exp-3', category: 'Hotels', title: 'RAAS Jodhpur Heritage Suite (1 Night)', amount: 24800, currency: 'INR', paidBy: 'Elena', date: '2026-11-10', status: 'Actual', city: 'Jodhpur' },
  { id: 'exp-4', category: 'Hotels', title: 'Suryagarh Thar Desert Camp (1 Night)', amount: 21000, currency: 'INR', paidBy: 'Elena', date: '2026-11-11', status: 'Actual', city: 'Jaisalmer' },
  { id: 'exp-5', category: 'Transport', title: 'Vande Bharat Express Rail Passes (Jaipur to Jodhpur)', amount: 4800, currency: 'INR', paidBy: 'Chirantan', date: '2026-11-10', status: 'Actual', city: 'Jodhpur' },
  { id: 'exp-6', category: 'Activities', title: 'Thar Desert Private Camel Sunset Safari & Campfire', amount: 4200, currency: 'INR', paidBy: 'Elena', date: '2026-11-11', status: 'Actual', city: 'Jaisalmer' },
  { id: 'exp-7', category: 'Food', title: 'Estimated Royal Thali & Palace Dining Budget', amount: 16200, currency: 'INR', paidBy: 'Split', date: '2026-11-08', status: 'Estimated', city: 'Udaipur' },
  { id: 'exp-8', category: 'Hotels', title: 'Taj Lake Pichola Sanctuary Suite (2 Nights)', amount: 46000, currency: 'INR', paidBy: 'Chirantan', date: '2026-11-13', status: 'Actual', city: 'Udaipur' },
  { id: 'exp-9', category: 'Activities', title: 'City Palace Private Boat & Jagmandir Access', amount: 5500, currency: 'INR', paidBy: 'Elena', date: '2026-11-13', status: 'Actual', city: 'Udaipur' },
  { id: 'exp-10', category: 'Shopping', title: 'Johari Bazaar Handcrafted Silver & Textiles', amount: 7800, currency: 'INR', paidBy: 'Elena', date: '2026-11-09', status: 'Actual', city: 'Jaipur' },
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'bk-1',
    type: 'Flight',
    title: 'Air India AI 481 (Delhi to Jaipur)',
    provider: 'Air India Star Alliance',
    reference: 'AI-48179K',
    date: 'Nov 08, 2026',
    time: '08:45 AM Departure · 09:40 AM Arrival',
    location: 'DEL (T3) → Jaipur International (JAI T2)',
    status: 'Confirmed',
    cost: 14500,
    currency: 'INR',
    cancellationPolicy: 'Refundable up to 48h before departure.'
  },
  {
    id: 'bk-2',
    type: 'Hotel',
    title: 'Samode Haveli Heritage Suite',
    provider: 'Samode Hotels Heritage Collection',
    reference: 'SMD-2026-881',
    date: 'Nov 08 – Nov 10, 2026',
    time: 'Check-in 12:00 · Check-out 11:00',
    location: 'Gangapole, Old Pink City, Jaipur',
    status: 'Confirmed',
    cost: 39000,
    currency: 'INR',
    cancellationPolicy: 'Free cancellation until Nov 01, 2026.'
  },
  {
    id: 'bk-3',
    type: 'Train',
    title: 'Vande Bharat Express 20978 (Executive Class)',
    provider: 'Indian Railways (IRCTC)',
    reference: 'PNR-249018442',
    date: 'Nov 10, 2026',
    time: '06:00 AM Jaipur Junction → 10:45 AM Jodhpur Junction',
    location: 'Jaipur Jn Track 1, Coach E1, Seats 14A/14B',
    status: 'Confirmed',
    cost: 4800,
    currency: 'INR',
    cancellationPolicy: 'Full refund upon cancellation 24h prior.'
  },
  {
    id: 'bk-4',
    type: 'Activity',
    title: 'Thar Desert Private Camel Sunset Safari & Kalbelia Campfire',
    provider: 'Suryagarh Desert Expeditions',
    reference: 'SRY-EXP-440',
    date: 'Nov 11, 2026',
    time: '16:30 – 21:00',
    location: 'Sam Sand Dunes Sector 4, Jaisalmer',
    status: 'Confirmed',
    cost: 4200,
    currency: 'INR',
    cancellationPolicy: '100% refund if cancelled 24 hours prior.'
  }
];

export const MOCK_DOCUMENTS: TravelDocument[] = [
  {
    id: 'doc-1',
    type: 'Passport',
    holder: 'Chirantan Dan',
    identifier: 'Z847••••',
    expiryDate: '2031-08-14',
    status: 'Valid',
    issuingAuthority: 'Republic of India',
    secureSnippet: 'Valid for 5+ years · 24 blank pages remaining'
  },
  {
    id: 'doc-2',
    type: 'Visa',
    holder: 'Chirantan Dan & Elena Vance',
    identifier: 'RAJ-COMPOSITE-PASS-992',
    expiryDate: '2026-11-30',
    status: 'Valid',
    issuingAuthority: 'Rajasthan Department of Archaeology & Museums',
    secureSnippet: 'All-Monument Composite Pass (Amer, Hawa Mahal, Jantar Mantar, Nahargarh)'
  },
  {
    id: 'doc-3',
    type: 'Insurance',
    holder: 'Elena Vance & Chirantan Dan',
    identifier: 'HDFC-TRV-88204',
    expiryDate: '2026-11-20',
    status: 'Valid',
    issuingAuthority: 'HDFC ERGO Travel Shield',
    secureSnippet: '₹25,00,000 Comprehensive Medical & Trip Interruption Protection'
  },
  {
    id: 'doc-4',
    type: 'Rail Pass',
    holder: 'Trip Companion Group',
    identifier: 'IRCTC-VB-EXEC-20978',
    expiryDate: '2026-11-15',
    status: 'Valid',
    issuingAuthority: 'Indian Railway Catering and Tourism Corporation',
    secureSnippet: 'Vande Bharat Executive Class e-Ticket with verified QR onboard validation'
  }
];

export const MOCK_COMPANIONS: TravelCompanion[] = [
  {
    id: 'comp-1',
    name: 'Chirantan Dan',
    email: 'danchirantan@gmail.com',
    role: 'Organizer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    votedActivities: ['raj-1-2', 'raj-1-4', 'raj-2-3'],
    expensesOwed: 0,
  },
  {
    id: 'comp-2',
    name: 'Elena Vance',
    email: 'elena.vance@studio.design',
    role: 'Co-Planner',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop',
    votedActivities: ['raj-1-2', 'raj-2-4', 'raj-3-3'],
    expensesOwed: 8400,
  },
  {
    id: 'comp-3',
    name: 'Marcus Sterling',
    email: 'marcus.s@arch.travel',
    role: 'Viewer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    votedActivities: ['raj-1-4', 'raj-2-3'],
    expensesOwed: 0,
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    category: 'Weather',
    title: 'TripMind Desert Climate Intelligence',
    message: 'Jaipur midday forecast indicates peak desert sun (31°C). Amber Fort exploration is sequenced for 08:30 AM to bypass the heat, followed by shaded courtyard dining at 1135 AD.',
    timestamp: '14 min ago',
    read: false,
    actionLabel: 'Review Itinerary Schedule',
    actionType: 'itinerary'
  },
  {
    id: 'notif-2',
    category: 'Bookings',
    title: 'Vande Bharat Executive Class Confirmed',
    message: 'Seats 14A & 14B confirmed on Express 20978 from Jaipur to Jodhpur. Panoramic Aravalli views on right window side.',
    timestamp: '2 hours ago',
    read: false,
    actionLabel: 'View Ticket Voucher',
    actionType: 'bookings'
  },
  {
    id: 'notif-3',
    category: 'Budget',
    title: 'Budget Intelligence Tracking',
    message: 'You are currently ₹26,500 under your target ceiling of ₹1,25,000 for this 7-day Rajasthan royal journey.',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: 'notif-4',
    category: 'Travel',
    title: 'Sam Sand Dunes Camel Safari Check-in',
    message: 'Private camel caravan departs at 16:45 PM from Suryagarh Desert Outpost for sunset photography across the ripples.',
    timestamp: '2 days ago',
    read: true
  }
];

export const MOCK_MEMORIES: TripMemory[] = [
  {
    id: 'mem-1',
    dayNumber: 1,
    date: 'Nov 08, 2026',
    location: 'Jaipur — Hawa Mahal & Johari Bazaar',
    title: 'The Honeycombed Windows & Saffron Twilight',
    story: 'Watching the afternoon sun light up the 953 pink sandstone jharokhas of Hawa Mahal, followed by the intoxicating aroma of roasting spices and fresh ghevar in Johari Bazaar.',
    photoCount: 18,
    locationsCount: 3,
    highlights: ['953 pink sandstone jharokhas', 'Warm LMB Dal Baati Churma', 'Kundan gemstone artisans'],
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'mem-2',
    dayNumber: 4,
    date: 'Nov 11, 2026',
    location: 'Jaisalmer — Sam Sand Dunes & Thar Desert',
    title: 'Golden Silences, Desert Dunes & Campfire Melodies',
    story: 'Riding camels across endless golden sand ridges as the sunset melted from gold to violet, followed by haunting Manganiyar folk ballads beside a roaring desert campfire under the Milky Way.',
    photoCount: 26,
    locationsCount: 4,
    highlights: ['Golden hour dunes caravan', 'Manganiyar folk kamaicha music', 'Stargazing in Thar wilderness'],
    imageUrl: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=800&auto=format&fit=crop'
  }
];

export const MOCK_SUGGESTED_ITEMS: SuggestedItineraryItem[] = RAJASTHAN_SUGGESTED_ITEMS;
