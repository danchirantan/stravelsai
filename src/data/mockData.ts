import { Trip, Destination, Hotel, Restaurant, Expense, Booking, TravelDocument, TravelCompanion, NotificationItem, TripMemory, SuggestedItineraryItem } from '../types/travel';
import { RAJASTHAN_DEMO_TRIP } from './rajasthanTrip';
import { RAJASTHAN_SUGGESTED_ITEMS } from './rajasthanSuggestions';

// Default Demo Trip is the authentic Royal Rajasthan Journey
export const DEMO_TRIP: Trip = RAJASTHAN_DEMO_TRIP;

export const MOCK_DESTINATIONS: Destination[] = [
  {
    id: 'dest-rajasthan',
    name: 'Rajasthan — The Royal Circuit',
    country: 'India',
    tagline: 'Vast golden Thar dunes, hilltop Rajput fortresses, and shimmering palace lakes.',
    bestTime: 'October–March',
    typicalBudget: '₹95,000 – ₹1,60,000 / couple',
    flightDuration: '1h direct flight from Delhi / Mumbai',
    weather: '22°C – 28°C · Crisp desert winter sun',
    description: 'From the honeycombed pink sandstone of Hawa Mahal to the blue cubical rooftops beneath Mehrangarh and candlelit palace boat rides across Lake Pichola, Rajasthan is India’s greatest imperial voyage.',
    neighborhoods: ['Pink City Heritage, Jaipur', 'Amer Foothills', 'Blue City, Jodhpur', 'Golden Fort Living Bastions, Jaisalmer', 'Lake Pichola, Udaipur'],
    experiences: ['Sunrise Overlook from Nahargarh Ramparts', 'Mehrangarh Fort Private Curator Walk', 'Sunset Camel Safari in Thar Desert', 'Candlelit Lake Pichola Boat Cruise'],
    highlights: ['UNESCO World Heritage Hill Forts', 'Rich Shekhawati hand-painted havelis', 'Centuries-old royal culinary heritage'],
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=900&auto=format&fit=crop',
    coordinates: { lat: 26.9124, lng: 75.7873 }
  },
  {
    id: 'dest-kerala',
    name: 'Kerala Backwaters & Munnar Hills',
    country: 'India',
    tagline: 'Emerald tea plantations, tranquil backwater houseboats, and Ayurvedic spice groves.',
    bestTime: 'September–March',
    typicalBudget: '₹85,000 – ₹1,40,000 / couple',
    flightDuration: '2h 45m from Delhi / Mumbai',
    weather: '23°C – 28°C · Tropical gentle breeze',
    description: 'Cruise aboard a private cedar Kettuvallam houseboat through palm-fringed canals in Alleppey, then ascend into misty tea-carpeted elevations in Munnar.',
    neighborhoods: ['Fort Kochi Heritage', 'Munnar Tea Valleys', 'Vembanad Lake, Kumarakom', 'Marari Beach'],
    experiences: ['Overnight Private Houseboat Cruise', 'Kathakali classical drama & martial Kalaripayattu', 'High-altitude organic spice plantation trek'],
    highlights: ['Serene interconnected inland waterways', 'World-renowned traditional Ayurveda', 'Coastal Malabar culinary feasts'],
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=900&auto=format&fit=crop',
    coordinates: { lat: 9.4981, lng: 76.3388 }
  },
  {
    id: 'dest-ladakh',
    name: 'Leh & Ladakh — High Mountain Passes',
    country: 'India',
    tagline: 'Crystalline high-altitude glacial lakes, ancient gompas, and trans-Himalayan passes.',
    bestTime: 'May–September',
    typicalBudget: '₹1,10,000 – ₹1,80,000 / couple',
    flightDuration: '1h 15m scenic flight from Delhi',
    weather: '14°C – 20°C · Alpine sunshine',
    description: 'Dramatic snowcapped ridges reflected across the azure expanse of Pangong Tso, centuries-old Buddhist monasteries perched on rocky cliffs, and camel trails across high-altitude cold deserts.',
    neighborhoods: ['Old Leh Bazaar', 'Shey & Thiksey', 'Nubra Valley Dunes', 'Pangong Tso Basin'],
    experiences: ['Dawn prayers at Thiksey Monastery', 'Crossing Khardung La at 5,359 meters', 'Stargazing in Nubra cold desert'],
    highlights: ['Pristine trans-Himalayan scenery', 'Rich Tibetan Buddhist monastic culture', 'Thrilling alpine mountain passes'],
    imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=900&auto=format&fit=crop',
    coordinates: { lat: 34.1526, lng: 77.5771 }
  },
  {
    id: 'dest-varanasi',
    name: 'Varanasi & Khajuraho Heritage',
    country: 'India',
    tagline: 'Timeless spiritual ghats of the sacred Ganges and intricately carved medieval stone temples.',
    bestTime: 'October–March',
    typicalBudget: '₹70,000 – ₹1,20,000 / couple',
    flightDuration: '1h 20m from Delhi',
    weather: '20°C – 26°C · Pleasant winter',
    description: 'Witness the incandescent evening Ganga Aarti from wooden boats along Dashashwamedh Ghat, explore ancient alleyways fragrant with sandalwood and brass, and visit Sarnath where the Buddha first preached.',
    neighborhoods: ['Dashashwamedh Ghat', 'Assi Ghat', 'Kashi Vishwanath Corridor', 'Western Temple Complex, Khajuraho'],
    experiences: ['Dawn wooden boat ride along the river ghats', 'Evening Grand Ganga Aarti ceremony', 'Guided exploration of Sarnath archaeological park'],
    highlights: ['One of the world’s oldest continuously inhabited cities', 'Sublime classical music & Banarasi silk weaving', 'Profound spiritual heritage'],
    imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=900&auto=format&fit=crop',
    coordinates: { lat: 25.3176, lng: 82.9739 }
  },
  {
    id: 'dest-goa',
    name: 'Goa & Konkan Coastal Haven',
    country: 'India',
    tagline: 'Portuguese colonial villas, golden Arabian Sea beaches, and spice-infused seafood.',
    bestTime: 'November–March',
    typicalBudget: '₹75,000 – ₹1,30,000 / couple',
    flightDuration: '2h 15m from Delhi / Mumbai',
    weather: '26°C – 31°C · Coastal tropical sun',
    description: 'Lush coconut groves lining azure Arabian Sea bays, pastel 18th-century mansions in Fontainhas Latin Quarter, and vibrant beachfront sunsets.',
    neighborhoods: ['Fontainhas Latin Quarter, Panaji', 'Assagao & Vagator', 'Mandrem & Ashwem', 'Palolem & Agonda'],
    experiences: ['Heritage Latin Quarter architecture walking tour', 'Sunset sailing along the Mandovi river', 'Organic spice plantation lunch & Feni tasting'],
    highlights: ['Idyllic Arabian Sea coastlines', 'Unique Indo-Portuguese architectural fusion', 'Celebrated coastal seafood culinary identity'],
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=900&auto=format&fit=crop',
    coordinates: { lat: 15.2993, lng: 74.1240 }
  }
];

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
  }
];

export const MOCK_EXPENSES: Expense[] = [
  { id: 'exp-1', category: 'Flights', title: 'Air India Express Flight (DEL ↔ JAI)', amount: 14500, currency: 'INR', paidBy: 'Chirantan', date: '2026-11-01', status: 'Actual' },
  { id: 'exp-2', category: 'Hotels', title: 'Samode Haveli Jaipur (2 Nights)', amount: 39000, currency: 'INR', paidBy: 'Chirantan', date: '2026-11-08', status: 'Actual' },
  { id: 'exp-3', category: 'Hotels', title: 'RAAS Jodhpur Heritage Suite (1 Night)', amount: 24800, currency: 'INR', paidBy: 'Elena', date: '2026-11-10', status: 'Actual' },
  { id: 'exp-4', category: 'Hotels', title: 'Suryagarh Thar Desert Camp (1 Night)', amount: 21000, currency: 'INR', paidBy: 'Elena', date: '2026-11-11', status: 'Actual' },
  { id: 'exp-5', category: 'Transport', title: 'Vande Bharat Express Rail Passes (Jaipur to Jodhpur)', amount: 4800, currency: 'INR', paidBy: 'Chirantan', date: '2026-11-10', status: 'Actual' },
  { id: 'exp-6', category: 'Activities', title: 'Thar Desert Private Camel Sunset Safari & Campfire', amount: 4200, currency: 'INR', paidBy: 'Elena', date: '2026-11-11', status: 'Actual' },
  { id: 'exp-7', category: 'Food', title: 'Estimated Royal Thali & Palace Dining Budget', amount: 16200, currency: 'INR', paidBy: 'Split', date: '2026-11-08', status: 'Estimated' },
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
