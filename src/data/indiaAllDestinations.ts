import { IndianDestination, IndianCircuit, IndiaTravelCategory } from '../types/travel';
import { INDIA_DESTINATIONS, INDIA_CIRCUITS } from './indiaDestinations';
import { INDIA_DESTINATIONS_PART2 } from './indiaDestinationsPart2';
import { INDIA_DESTINATIONS_PART3 } from './indiaDestinationsPart3';

export const ALL_INDIA_DESTINATIONS: IndianDestination[] = [
  ...INDIA_DESTINATIONS,
  ...INDIA_DESTINATIONS_PART2,
  ...INDIA_DESTINATIONS_PART3
];

export { INDIA_CIRCUITS };

export interface IndiaStateMeta {
  code: string;
  name: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Northeast' | 'Central' | 'Islands';
  capital: string;
  highlightTag: string;
  destinationsCount: number;
  sampleDestinations: string[];
  bestSeason: string;
  typicalBudget: string;
  travelStyle: string;
}

export const ALL_28_INDIAN_STATES: IndiaStateMeta[] = [
  { code: 'AP', name: 'Andhra Pradesh', region: 'South', capital: 'Amaravati', highlightTag: 'Spiritual · Coast · Canyons', destinationsCount: 4, sampleDestinations: ['Tirupati', 'Visakhapatnam', 'Araku Valley', 'Gandikota'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Heritage & Coast' },
  { code: 'AR', name: 'Arunachal Pradesh', region: 'Northeast', capital: 'Itanagar', highlightTag: 'Himalayan Passes · Monasteries', destinationsCount: 3, sampleDestinations: ['Tawang', 'Ziro Valley', 'Bomdila'], bestSeason: 'Oct–Apr', typicalBudget: '₹₹₹', travelStyle: 'Adventure & Mountains' },
  { code: 'AS', name: 'Assam', region: 'Northeast', capital: 'Dispur', highlightTag: 'Rhinos · Tea Gardens · Satras', destinationsCount: 3, sampleDestinations: ['Kaziranga', 'Majuli', 'Guwahati'], bestSeason: 'Nov–Apr', typicalBudget: '₹₹', travelStyle: 'Wildlife & Riverine' },
  { code: 'BR', name: 'Bihar', region: 'East', capital: 'Patna', highlightTag: 'Enlightenment · Universities', destinationsCount: 3, sampleDestinations: ['Bodh Gaya', 'Rajgir & Nalanda', 'Patna'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Spiritual & Archaeology' },
  { code: 'CG', name: 'Chhattisgarh', region: 'Central', capital: 'Raipur', highlightTag: 'Niagara of India · Tribal Art', destinationsCount: 3, sampleDestinations: ['Bastar & Chitrakote', 'Mainpat', 'Kanger Valley'], bestSeason: 'Jul–Feb', typicalBudget: '₹₹', travelStyle: 'Nature & Tribal' },
  { code: 'GA', name: 'Goa', region: 'West', capital: 'Panaji', highlightTag: 'Sands · Portuguese Villas · Food', destinationsCount: 3, sampleDestinations: ['North Goa', 'South Goa', 'Panaji & Old Goa'], bestSeason: 'Oct–May', typicalBudget: '₹₹₹', travelStyle: 'Beaches & Heritage' },
  { code: 'GJ', name: 'Gujarat', region: 'West', capital: 'Gandhinagar', highlightTag: 'White Desert · Lions · Heritage', destinationsCount: 3, sampleDestinations: ['Rann of Kutch', 'Gir National Park', 'Ahmedabad'], bestSeason: 'Nov–Mar', typicalBudget: '₹₹₹', travelStyle: 'Desert & Wildlife' },
  { code: 'HR', name: 'Haryana', region: 'North', capital: 'Chandigarh', highlightTag: 'Epic Battles · Birding · Modern Hub', destinationsCount: 3, sampleDestinations: ['Kurukshetra', 'Gurugram & Sultanpur', 'Pinjore'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'History & Nature' },
  { code: 'HP', name: 'Himachal Pradesh', region: 'North', capital: 'Shimla', highlightTag: 'Snow Peaks · Valleys · Pines', destinationsCount: 4, sampleDestinations: ['Shimla', 'Manali', 'Dharamshala', 'Spiti Valley'], bestSeason: 'Year Round', typicalBudget: '₹₹₹', travelStyle: 'Mountains & Treks' },
  { code: 'JH', name: 'Jharkhand', region: 'East', capital: 'Ranchi', highlightTag: 'Waterfalls · Jyotirlinga · Pines', destinationsCount: 3, sampleDestinations: ['Ranchi', 'Deoghar', 'Netarhat'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Waterfalls & Sacred' },
  { code: 'KA', name: 'Karnataka', region: 'South', capital: 'Bengaluru', highlightTag: 'Boulders · Coffee · Royal Palaces', destinationsCount: 4, sampleDestinations: ['Hampi', 'Coorg', 'Mysuru', 'Gokarna & Karwar'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹₹', travelStyle: 'Heritage & Highlands' },
  { code: 'KL', name: 'Kerala', region: 'South', capital: 'Thiruvananthapuram', highlightTag: 'God’s Own Country · Backwaters', destinationsCount: 4, sampleDestinations: ['Munnar', 'Alleppey', 'Kochi', 'Wayanad'], bestSeason: 'Sep–May', typicalBudget: '₹₹₹', travelStyle: 'Backwaters & Luxury' },
  { code: 'MP', name: 'Madhya Pradesh', region: 'Central', capital: 'Bhopal', highlightTag: 'Heart of India · Tigers · Temples', destinationsCount: 3, sampleDestinations: ['Khajuraho', 'Kanha National Park', 'Ujjain & Omkareshwar'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹₹', travelStyle: 'Wild Tigers & Sacred' },
  { code: 'MH', name: 'Maharashtra', region: 'West', capital: 'Mumbai', highlightTag: 'Rock Caves · Arabian Coast · Forts', destinationsCount: 3, sampleDestinations: ['Mumbai', 'Ajanta & Ellora', 'Mahabaleshwar & Panchgani'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹₹', travelStyle: 'Cosmopolitan & Hills' },
  { code: 'MN', name: 'Manipur', region: 'Northeast', capital: 'Imphal', highlightTag: 'Floating Lake · Sangai Deer', destinationsCount: 2, sampleDestinations: ['Loktak Lake & Imphal', 'Keibul Lamjao & Moirang'], bestSeason: 'Oct–Apr', typicalBudget: '₹₹', travelStyle: 'Eco-Islands & Culture' },
  { code: 'ML', name: 'Meghalaya', region: 'Northeast', capital: 'Shillong', highlightTag: 'Living Root Bridges · Clouds', destinationsCount: 2, sampleDestinations: ['Shillong', 'Cherrapunji & Dawki'], bestSeason: 'Oct–May', typicalBudget: '₹₹₹', travelStyle: 'Nature & Adventure' },
  { code: 'MZ', name: 'Mizoram', region: 'Northeast', capital: 'Aizawl', highlightTag: 'Ridge Peaks · Choirs · Bamboo', destinationsCount: 2, sampleDestinations: ['Aizawl', 'Champhai & Reiek Peak'], bestSeason: 'Oct–Apr', typicalBudget: '₹₹', travelStyle: 'Offbeat & Mountains' },
  { code: 'NL', name: 'Nagaland', region: 'Northeast', capital: 'Kohima', highlightTag: 'Hornbill Festival · Dzukou Valley', destinationsCount: 2, sampleDestinations: ['Kohima', 'Dzukou Valley & Kisama'], bestSeason: 'Oct–May', typicalBudget: '₹₹₹', travelStyle: 'Warrior Culture & Trails' },
  { code: 'OD', name: 'Odisha', region: 'East', capital: 'Bhubaneswar', highlightTag: 'Sun Temple · Jagannath Puri', destinationsCount: 2, sampleDestinations: ['Puri & Bhubaneswar', 'Konark & Chilika Lake'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Spiritual & Coastal' },
  { code: 'PB', name: 'Punjab', region: 'North', capital: 'Chandigarh', highlightTag: 'Golden Temple · Warm Hospitality', destinationsCount: 2, sampleDestinations: ['Amritsar', 'Patiala & Anandpur Sahib'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Sacred & Culinary' },
  { code: 'RJ', name: 'Rajasthan', region: 'North', capital: 'Jaipur', highlightTag: 'Land of Kings · Palaces · Sand Dunes', destinationsCount: 4, sampleDestinations: ['Jaipur', 'Udaipur', 'Jaisalmer', 'Jodhpur & Ranthambore'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹₹₹', travelStyle: 'Royal Luxury & Desert' },
  { code: 'SK', name: 'Sikkim', region: 'Northeast', capital: 'Gangtok', highlightTag: 'Kanchenjunga · Organic Kingdom', destinationsCount: 2, sampleDestinations: ['Gangtok', 'Pelling, Lachung & Yumthang'], bestSeason: 'Mar–May, Oct–Dec', typicalBudget: '₹₹₹', travelStyle: 'Himalayan Glaciers' },
  { code: 'TN', name: 'Tamil Nadu', region: 'South', capital: 'Chennai', highlightTag: 'Dravidian Gopurams · Blue Hills', destinationsCount: 3, sampleDestinations: ['Madurai & Chennai', 'Ooty & Nilgiris', 'Rameswaram & Kanyakumari'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Temples & Hill Stations' },
  { code: 'TS', name: 'Telangana', region: 'South', capital: 'Hyderabad', highlightTag: 'City of Pearls · Nizami Biryani', destinationsCount: 2, sampleDestinations: ['Hyderabad', 'Warangal & Ramappa Temple'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹₹', travelStyle: 'Nawabi & Heritage' },
  { code: 'TR', name: 'Tripura', region: 'Northeast', capital: 'Agartala', highlightTag: 'Water Palace · Giant Rock Carvings', destinationsCount: 2, sampleDestinations: ['Neermahal & Agartala', 'Unakoti & Tripura Sundari'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Lakes & Relics' },
  { code: 'UP', name: 'Uttar Pradesh', region: 'North', capital: 'Lucknow', highlightTag: 'Taj Mahal · Kashi Ghats · Awadh', destinationsCount: 4, sampleDestinations: ['Varanasi', 'Agra', 'Lucknow', 'Ayodhya & Prayagraj'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹₹', travelStyle: 'Ganga & Mughal' },
  { code: 'UK', name: 'Uttarakhand', region: 'North', capital: 'Dehradun', highlightTag: 'Land of Gods · Yoga · Glaciers', destinationsCount: 3, sampleDestinations: ['Rishikesh & Mussoorie', 'Jim Corbett', 'Auli & Badrinath'], bestSeason: 'Sep–Jun', typicalBudget: '₹₹₹', travelStyle: 'Yoga & Wilderness' },
  { code: 'WB', name: 'West Bengal', region: 'East', capital: 'Kolkata', highlightTag: 'City of Joy · Kanchenjunga Tea', destinationsCount: 3, sampleDestinations: ['Kolkata', 'Darjeeling', 'Sundarbans & Kalimpong'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Culture & Tea Highlands' }
];

export const ALL_UNION_TERRITORIES: IndiaStateMeta[] = [
  { code: 'DL', name: 'Delhi', region: 'North', capital: 'New Delhi', highlightTag: 'Historic Capital · Mughal Tombs', destinationsCount: 2, sampleDestinations: ['New Delhi & Old Delhi', 'India Gate & Central Vista'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹₹', travelStyle: 'Monumental Heritage' },
  { code: 'JK', name: 'Jammu & Kashmir', region: 'North', capital: 'Srinagar', highlightTag: 'Paradise on Earth · Houseboats · Powder Snow', destinationsCount: 2, sampleDestinations: ['Srinagar & Gulmarg', 'Pahalgam & Sonamarg'], bestSeason: 'Apr–Oct & Dec–Mar', typicalBudget: '₹₹₹', travelStyle: 'Alpine Valleys' },
  { code: 'LA', name: 'Ladakh', region: 'North', capital: 'Leh', highlightTag: 'Moonland · High Passes · Pangong Lake', destinationsCount: 2, sampleDestinations: ['Leh & Nubra Valley', 'Pangong Tso & Tso Moriri'], bestSeason: 'May–Sep', typicalBudget: '₹₹₹₹', travelStyle: 'Extreme Adventure' },
  { code: 'AN', name: 'Andaman & Nicobar', region: 'Islands', capital: 'Port Blair', highlightTag: 'Best Beaches · Coral Diving', destinationsCount: 2, sampleDestinations: ['Port Blair & Cellular Jail', 'Havelock & Neil Islands'], bestSeason: 'Oct–May', typicalBudget: '₹₹₹₹', travelStyle: 'Tropical Islands' },
  { code: 'PY', name: 'Puducherry', region: 'South', capital: 'Puducherry', highlightTag: 'French Quarter · Promenade · Auroville', destinationsCount: 1, sampleDestinations: ['Puducherry & Auroville'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'French Coastal' },
  { code: 'CH', name: 'Chandigarh', region: 'North', capital: 'Chandigarh', highlightTag: 'Modernist Architecture · Rock Garden', destinationsCount: 1, sampleDestinations: ['Chandigarh (The City Beautiful)'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Urban & Gardens' },
  { code: 'LD', name: 'Lakshadweep', region: 'Islands', capital: 'Kavaratti', highlightTag: 'Coral Atolls · Turquoise Lagoons', destinationsCount: 1, sampleDestinations: ['Agatti, Bangaram & Kavaratti'], bestSeason: 'Oct–May', typicalBudget: '₹₹₹₹', travelStyle: 'Island Paradise' },
  { code: 'DD', name: 'Dadra & Nagar Haveli and Daman & Diu', region: 'West', capital: 'Daman', highlightTag: 'Portuguese Forts · Caves · Coast', destinationsCount: 1, sampleDestinations: ['Daman, Diu & Silvassa'], bestSeason: 'Oct–Mar', typicalBudget: '₹₹', travelStyle: 'Coastal Heritage' }
];

export interface IndianFestival {
  id: string;
  name: string;
  destination: string;
  state: string;
  approxMonth: string;
  monthIndex: number; // 1 to 12
  approxDateRange: string;
  startDay?: number;
  endDay?: number;
  season: 'Spring' | 'Summer' | 'Monsoon' | 'Autumn' | 'Winter';
  category:
    | 'Sacred & Lights'
    | 'Colors & Spring'
    | 'Folk & Heritage'
    | 'Harvest & Boats'
    | 'Desert Fair'
    | 'Martial & Arts'
    | 'Dance & Classical'
    | 'Carnival & Fest';
  significance: string;
  culturalInsight: string;
  imageUrl: string;
  duration: string;
  tips: string[];
  linkedDestinationNames?: string[];
}

export const INDIAN_FESTIVALS: IndianFestival[] = [
  {
    id: 'fest-diwali',
    name: 'Diwali (Deepotsav & Festival of Lights)',
    destination: 'Ayodhya & Varanasi',
    state: 'Uttar Pradesh',
    approxMonth: 'October / November (Kartik Amavasya)',
    monthIndex: 11,
    approxDateRange: 'Nov 01 – Nov 05',
    season: 'Autumn',
    category: 'Sacred & Lights',
    significance: 'India’s most celebrated festival of lights commemorating Lord Rama’s return, marked by Guinness-record 2.5 million earthen lamps in Ayodhya.',
    culturalInsight: 'Ayodhya Saryu riverfront and Varanasi ghats transform into a shimmering sea of golden flame; fireworks illuminate night skies across Jaipur and Delhi.',
    imageUrl: 'https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?q=80&w=1200&auto=format&fit=crop',
    duration: '5 Days',
    tips: [
      'Book rooftop hotel access in Varanasi or riverbank seating at Saryu ghats 2 months ahead',
      'Wear traditional cotton silk kurtas or sarees for temple darshans and aartis',
      'Taste seasonal Motichoor Laddus, Kaju Katli, and Gulab Jamun freshly made with pure ghee'
    ]
  },
  {
    id: 'fest-holi',
    name: 'Holi & Lathmar Holi',
    destination: 'Mathura, Vrindavan & Barsana',
    state: 'Uttar Pradesh',
    approxMonth: 'March (Phalguna Purnima)',
    monthIndex: 3,
    approxDateRange: 'Mar 13 – Mar 16',
    season: 'Spring',
    category: 'Colors & Spring',
    significance: 'Ecstatic springtime celebration of love, divine romance of Radha-Krishna, and triumph of devotion with organic gulal powders and fragrant flower petals.',
    culturalInsight: 'In Barsana and Nandgaon, women playfully playfully tap men’s shields with wooden sticks (Lathmar); Banke Bihari temple witnesses Phoolon ki Holi (flower petal shower).',
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=1200&auto=format&fit=crop',
    duration: '4 Days',
    tips: [
      'Use natural herbal colors (Teshu flower gulal) and protect your camera/phone with waterproof zip cases',
      'Arrive at Banke Bihari Temple early at 08:30 AM for the sanctum flower shower',
      'Sample iced Thandai infused with saffron, rose petals, and pistachios'
    ]
  },
  {
    id: 'fest-pushkar',
    name: 'Pushkar Camel Fair',
    destination: 'Pushkar',
    state: 'Rajasthan',
    approxMonth: 'October / November (Karthik Purnima)',
    monthIndex: 11,
    approxDateRange: 'Nov 09 – Nov 17',
    season: 'Autumn',
    category: 'Desert Fair',
    significance: 'The world’s largest livestock gathering where over 50,000 decorated camels, horses, and cattle convene in the Thar Desert.',
    culturalInsight: 'Watch turbaned Rajasthani pastoralists trade camels while hot air balloons drift over sand dunes and pilgrims take sacred dips in Pushkar Lake.',
    imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
    duration: '8 Days',
    tips: [
      'Book desert luxury camp glamping early as standard hotels sell out nationwide',
      'Take sunrise hot-air balloon flights for cinematic aerial photographs of the tent city',
      'Visit Brahma Temple (the world’s rarest dedicated shrine) at dawn'
    ]
  },
  {
    id: 'fest-durga-puja',
    name: 'Durga Puja Kolkata',
    destination: 'Kolkata',
    state: 'West Bengal',
    approxMonth: 'September / October (UNESCO Heritage)',
    monthIndex: 10,
    approxDateRange: 'Oct 08 – Oct 13',
    season: 'Autumn',
    category: 'Sacred & Lights',
    significance: 'UNESCO Intangible Cultural Heritage of Humanity—the world’s largest open-air art installation and celebration of Goddess Durga.',
    culturalInsight: 'Over 3,000 temporary architectural theme pandals light up Kolkata with beats of the Dhak drums, Dhunuchi folk dance, and midnight street feasts.',
    imageUrl: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=1200&auto=format&fit=crop',
    duration: '6 Days',
    tips: [
      'Pandals are open 24/7; midnight to 04:00 AM walking tours beat the humid afternoon queues',
      'Download the Kolkata Police Puja Guide map for crowd-free walking routes',
      'Feast on Kolkata Biryani, Kosha Mangsho, and hot Mishti Doi at street stalls'
    ]
  },
  {
    id: 'fest-hornbill',
    name: 'Hornbill Festival',
    destination: 'Kohima (Kisama Heritage Village)',
    state: 'Nagaland',
    approxMonth: 'December 1 to 10 (Fixed annual dates)',
    monthIndex: 12,
    approxDateRange: 'Dec 01 – Dec 10',
    season: 'Winter',
    category: 'Folk & Heritage',
    significance: 'The "Festival of Festivals" uniting all 17 indigenous Naga warrior tribes in rich song, traditional morung huts, and crafts.',
    culturalInsight: 'Hear hair-raising tribal war chants, witness feather-headdress dances, and cheer on the infamous King Chilli (Bhut Jolokia) eating contest.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    duration: '10 Days',
    tips: [
      'Inner Line Permits (ILP) are required for domestic visitors, obtainable online in 24 hours',
      'Evenings get cold (down to 6°C); pack heavy woolen jackets and boots',
      'Taste traditional smoked pork with axone and local rice beer inside tribal morungs'
    ]
  },
  {
    id: 'fest-dev-deepawali',
    name: 'Dev Deepawali Varanasi',
    destination: 'Varanasi',
    state: 'Uttar Pradesh',
    approxMonth: 'November (Kartik Purnima)',
    monthIndex: 11,
    approxDateRange: 'Nov 15 – Nov 16',
    season: 'Autumn',
    category: 'Sacred & Lights',
    significance: 'The Diwali of the Gods when the heavenly devas descend to bathe in the holy Ganga; over 1 million earthen diyas ignite all 84 ghats.',
    culturalInsight: 'Hire a wooden boat in the center of the Ganga to watch the entire 6 km crescent riverbank illuminate like a river of liquid gold.',
    imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop',
    duration: '2 Days',
    tips: [
      'Pre-reserve motorized boat rides on the Ganga well in advance',
      'Dashashwamedh Ghat Maha Aarti features 21 young Vedic priests chanting simultaneously',
      'Try seasonal Malaiyo (saffron milk foam delicacy) available only on winter mornings'
    ]
  },
  {
    id: 'fest-rann-utsav',
    name: 'Rann Utsav (White Desert Festival)',
    destination: 'Dhordo, Kutch',
    state: 'Gujarat',
    approxMonth: 'November to February',
    monthIndex: 12,
    approxDateRange: 'Nov 15 – Feb 28',
    season: 'Winter',
    category: 'Desert Fair',
    significance: 'A three-month winter carnival celebrating the shimmering expanse of the Great White Salt Desert under starlit and moonlit skies.',
    culturalInsight: 'Full-moon nights over the crystal salt desert resemble an endless field of snow; artisan Kutchi embroidery, camel carts, and Rogan art.',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
    duration: '3 Months (Nov–Feb)',
    tips: [
      'Plan your trip to coincide precisely with the 3 days around the monthly Full Moon (Purnima)',
      'Stay in the Tent City in Dhordo for cultural concerts right outside your door',
      'Visit Nirona village nearby to witness ancient Rogan oil painting on cloth'
    ]
  },
  {
    id: 'fest-onam',
    name: 'Onam & Snake Boat Races',
    destination: 'Alleppey & Aranmula',
    state: 'Kerala',
    approxMonth: 'August / September (Chingam)',
    monthIndex: 9,
    approxDateRange: 'Sep 05 – Sep 15',
    season: 'Monsoon',
    category: 'Harvest & Boats',
    significance: 'Ancient harvest homecoming festival honoring egalitarian King Mahabali, celebrated with colossal snake boat regattas and flower carpets.',
    culturalInsight: 'One hundred oarsmen row in synchronized cadence to melodic Vanchipattu boat hymns aboard 100-foot curved Chundan Vallams.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
    duration: '10 Days',
    tips: [
      'Reserve grandstand stadium seats for the Nehru Trophy Boat Race on Punnamada Lake',
      'Order a traditional 26-dish vegetarian Onasadya feast served on fresh banana leaves',
      'Look for intricate Pookkalam floral mandala designs welcoming guests at every doorstep'
    ]
  },
  {
    id: 'fest-mysuru-dasara',
    name: 'Mysuru Dasara',
    destination: 'Mysuru',
    state: 'Karnataka',
    approxMonth: 'September / October (Navratri)',
    monthIndex: 10,
    approxDateRange: 'Oct 03 – Oct 12',
    season: 'Autumn',
    category: 'Folk & Heritage',
    significance: 'A 400-year-old royal state festival dating back to the Vijayanagara Empire celebrating Goddess Chamundeshwari’s victory over Mahishasura.',
    culturalInsight: 'The Mysore Palace glows with 100,000 golden bulbs while royal caparisoned tuskers lead the grand Jumboo Savari procession.',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop',
    duration: '10 Days',
    tips: [
      'Palace illumination takes place every evening during Navratri from 19:00 to 21:00 PM',
      'Gold cards issued by Karnataka Tourism offer premium seating along the procession route',
      'Taste authentic hot Mysore Pak made with generous pure ghee and chickpea flour'
    ]
  },
  {
    id: 'fest-ganesh-chaturthi',
    name: 'Ganesh Chaturthi',
    destination: 'Mumbai & Pune',
    state: 'Maharashtra',
    approxMonth: 'August / September (Bhadrapada)',
    monthIndex: 9,
    approxDateRange: 'Sep 07 – Sep 17',
    season: 'Monsoon',
    category: 'Sacred & Lights',
    significance: 'Grand 10-day celebration of the elephant-headed God of Wisdom and New Beginnings, uniting millions across public pandals.',
    culturalInsight: 'Hear the thunder of Puneri dhol-tasha drum troupes; on Anant Chaturdashi, millions gather at Girgaon Chowpatty beach for immersion in the Arabian Sea.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
    duration: '10 Days',
    tips: [
      'Visit Lalbaugcha Raja (King of Lalbaug) at dawn to avoid the 12-hour general darshan line',
      'Feast on steamed Ukadiche Modak stuffed with freshly grated coconut and melted jaggery',
      'Watch immersion processions from Chowpatty flyover or marine promenade safely'
    ]
  },
  {
    id: 'fest-hemis',
    name: 'Hemis Monastery Gompa Festival',
    destination: 'Hemis & Leh',
    state: 'Ladakh (UT)',
    approxMonth: 'June / July (Tsechu Month)',
    monthIndex: 7,
    approxDateRange: 'Jun 28 – Jun 30',
    season: 'Summer',
    category: 'Folk & Heritage',
    significance: 'Sacred Buddhist monastic festival celebrating the birth anniversary of Guru Padmasambhava (Guru Rinpoche).',
    culturalInsight: 'Lamas dressed in ornate silk brocades and mythical painted wooden masks perform the sacred Cham ritual dance to the roar of 10-foot alpine trumpets.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    duration: '3 Days',
    tips: [
      'Acclimatize in Leh for at least 48 hours before traveling to the higher altitude monastery',
      'Arrive inside Hemis Monastery courtyard by 08:00 AM to secure bench seating',
      'Every 12 years, the world’s largest two-story silk Thangka is unfurled over the walls'
    ]
  },
  {
    id: 'fest-kite-uttarayan',
    name: 'International Kite Festival (Uttarayan)',
    destination: 'Ahmedabad & Surat',
    state: 'Gujarat',
    approxMonth: 'January 14–15 (Makar Sankranti)',
    monthIndex: 1,
    approxDateRange: 'Jan 14 – Jan 15',
    season: 'Winter',
    category: 'Colors & Spring',
    significance: 'Marks the awakening of the gods as the sun transitions northward; skies across Gujarat fill with millions of colorful fighting kites.',
    culturalInsight: 'Rooftops roar with celebratory shouts of "Kai Po Che!" as dueling kites duel in the wind; illuminated tukkal paper lanterns glow into the midnight sky.',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop',
    duration: '2 Days',
    tips: [
      'Stay in the Old City Heritage Havelis to experience family rooftop kite battles directly',
      'Visit Patang Bazaar in the old quarter which stays open 24 hours in the week leading up',
      'Feast on Undhiyu (earthen pot winter vegetable casserole), Jalebi, and sesame Chikki'
    ]
  },
  {
    id: 'fest-hola-mohalla',
    name: 'Hola Mohalla Martial Festival',
    destination: 'Anandpur Sahib',
    state: 'Punjab',
    approxMonth: 'March (Day after Holi)',
    monthIndex: 3,
    approxDateRange: 'Mar 15 – Mar 17',
    season: 'Spring',
    category: 'Martial & Arts',
    significance: 'Founded by the tenth Sikh master Guru Gobind Singh in 1701 as a mock military drill and celebration of martial courage.',
    culturalInsight: 'Nihang warrior Sikhs in electric blue robes and tall dastar turbans perform galloping horseback tent-pegging, Gatka mock duels, and spear maneuvers.',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop',
    duration: '3 Days',
    tips: [
      'Wear a head covering and remove shoes at all gurudwara complexes and grounds',
      'Partake in the massive 24-hour Guru ka Langar serving fresh piping hot dal, roti, and kheer',
      'Position yourself near Charan Ganga stadium for the afternoon equestrian demonstrations'
    ]
  },
  {
    id: 'fest-bihu',
    name: 'Rongali Bihu (Bohag Bihu)',
    destination: 'Guwahati & Sivasagar',
    state: 'Assam',
    approxMonth: 'April (Mid-April New Year)',
    monthIndex: 4,
    approxDateRange: 'Apr 14 – Apr 20',
    season: 'Spring',
    category: 'Colors & Spring',
    significance: 'The Assamese Spring agricultural new year festival celebrating fertility, youthful spirit, and the onset of the seeding season.',
    culturalInsight: 'Dancers dressed in golden Muga silk sarees dance with brisk hip movements and rapid hand clapping to the beat of Dhol drums and Pepa buffalo horn flutes.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    duration: '7 Days',
    tips: [
      'Attend the grand community Bihu shows at Latasil playground in Guwahati',
      'Taste traditional Pitha rice snacks stuffed with black sesame and jaggery',
      'Gift or receive a handwoven red-and-white Gamosa cotton scarf as a token of respect'
    ]
  },
  {
    id: 'fest-kumbh-mela',
    name: 'Maha Kumbh & Magh Mela',
    destination: 'Prayagraj & Haridwar',
    state: 'Uttar Pradesh',
    approxMonth: 'January / February',
    monthIndex: 1,
    approxDateRange: 'Jan 13 – Feb 26',
    season: 'Winter',
    category: 'Sacred & Lights',
    significance: 'The largest peaceful spiritual congregation in human history, occurring on the holy confluence of the Ganga, Yamuna, and mystical Saraswati rivers.',
    culturalInsight: 'Naga sadhus with ash-smeared bodies lead the royal Shahi Snan dips amid Vedic chants, conch shells, and millions seeking spiritual purification.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    duration: '45 Days',
    tips: [
      'Book authorized Swiss luxury tents in the Kumbh Mela pop-up city months in advance',
      'The principal bathing days (Mauni Amavasya, Makar Sankranti) attract tens of millions of pilgrims',
      'Take dawn country boats out to the holy Sangam confluence for quiet morning prayers'
    ],
    linkedDestinationNames: ['Varanasi', 'Ayodhya', 'Rishikesh & Haridwar']
  },
  {
    id: 'fest-chhath',
    name: 'Chhath Puja (Maha Parv)',
    destination: 'Patna & Rajgir',
    state: 'Bihar',
    approxMonth: 'October / November (Kartik Shukla Shashthi)',
    monthIndex: 11,
    approxDateRange: 'Nov 07 – Nov 10',
    startDay: 7,
    endDay: 10,
    season: 'Autumn',
    category: 'Sacred & Lights',
    significance: 'Ancient 4-day Vedic celebration worshipping Surya (Sun God) and Chhathi Maiya for vitality and prosperity, observed with strict waterless fasts (Nirjala).',
    culturalInsight: 'Millions stand waist-deep in the holy Ganga and lotus ponds at sunset and dawn offering Arghya with bamboo soop baskets, singing timeless Bhojpuri hymns.',
    imageUrl: 'https://images.unsplash.com/photo-1609137144820-25255470d049?q=80&w=1200&auto=format&fit=crop',
    duration: '4 Days',
    tips: [
      'Ghats along the Ganges in Patna (Collectorate Ghat, Gandhi Ghat) offer the most breathtaking dawn view',
      'Taste traditional pure ghee Thekua prasad, a divine dry sweet baked over mango wood fires',
      'Combine with visits to the ancient ruins of Nalanda University and Rajgir hot springs'
    ],
    linkedDestinationNames: ['Rajgir & Nalanda', 'Patna & Vaishali', 'Varanasi', 'Bodh Gaya']
  },
  {
    id: 'fest-ratha-yatra',
    name: 'Puri Jagannath Ratha Yatra',
    destination: 'Puri',
    state: 'Odisha',
    approxMonth: 'June / July (Ashadha Shukla Dwitiya)',
    monthIndex: 7,
    approxDateRange: 'Jul 07 – Jul 16',
    startDay: 7,
    endDay: 16,
    season: 'Monsoon',
    category: 'Sacred & Lights',
    significance: 'The world-famous Chariot Festival where Lord Jagannath, brother Balabhadra, and sister Subhadra journey 3 km to Gundicha Temple atop 45-foot multi-wheeled wooden chariots.',
    culturalInsight: 'Over a million devotees jostle to pull the sacred coir ropes of the colossal Nandighosa chariot along Puri’s Grand Road (Bada Danda) in torrential monsoon rains.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    duration: '9 Days',
    tips: [
      'Reserve rooftop viewing tickets along Bada Danda Grand Road weeks ahead for safety and panoramic vistas',
      'Partake in the sacred Mahaprasad cooked in stacked earthen pots inside the world’s largest temple kitchen',
      'Pair the visit with the Sun Temple at Konark and the marine beaches of Puri'
    ],
    linkedDestinationNames: ['Puri & Konark', 'Bhubaneswar', 'Chilika Lake']
  },
  {
    id: 'fest-thrissur-pooram',
    name: 'Thrissur Pooram',
    destination: 'Thrissur',
    state: 'Kerala',
    approxMonth: 'April / May (Pooram Star in Medam)',
    monthIndex: 5,
    approxDateRange: 'May 09 – May 10',
    startDay: 9,
    endDay: 10,
    season: 'Summer',
    category: 'Folk & Heritage',
    significance: 'The "Mother of all Poorams" instituted by Sakthan Thampuran in 1798 at Vadakkunnathan Temple, featuring rival temple pageantry of caparisoned elephants and percussion ensembles.',
    culturalInsight: 'Two teams of 15 majestically decorated elephants face off in the mesmerizing Kudamattom (rapid synchronization of brilliant silk parasols) to the thunder of 250 Panchavadyam drummers.',
    imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
    duration: '36 Hours Non-Stop',
    tips: [
      'Ear protection is recommended if you stand close to the deafening Ilanjithara Melam percussion',
      'Watch the 3:00 AM grand finale fireworks display illuminating the Thekkinkadu Maidan',
      'Thrissur is just 1.5 hours north of Kochi airport; base yourself in Kochi or Thrissur heritage hotels'
    ],
    linkedDestinationNames: ['Kochi (Cochin)', 'Munnar', 'Alleppey (Alappuzha)', 'Wayanad']
  },
  {
    id: 'fest-khajuraho-dance',
    name: 'Khajuraho Dance Festival',
    destination: 'Khajuraho',
    state: 'Madhya Pradesh',
    approxMonth: 'February',
    monthIndex: 2,
    approxDateRange: 'Feb 20 – Feb 26',
    startDay: 20,
    endDay: 26,
    season: 'Winter',
    category: 'Dance & Classical',
    significance: 'A week-long celebration of classical Indian dance against the floodlit, thousand-year-old sandstone facades of the Western Group of UNESCO Temples.',
    culturalInsight: 'India’s greatest exponents of Kathak, Bharatanatyam, Odissi, and Kathakali perform under starlit winter skies beside the intricately carved Chitragupta and Vishwanatha temples.',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop',
    duration: '7 Days',
    tips: [
      'Entry to evening cultural performances is open to all visitors; arrive by 18:30 PM for front seating',
      'Spend sunny daytime hours cycling between the Eastern, Western, and Southern temple groups',
      'Take an afternoon wildlife safari into adjacent Panna National Park to spot Bengal tigers'
    ],
    linkedDestinationNames: ['Khajuraho & Orchha', 'Gwalior', 'Bandhavgarh National Park', 'Varanasi']
  },
  {
    id: 'fest-bastar-dussehra',
    name: 'Bastar Dussehra (75-Day Tribal Festival)',
    destination: 'Jagdalpur & Bastar',
    state: 'Chhattisgarh',
    approxMonth: 'August to October (Longest Festival)',
    monthIndex: 10,
    approxDateRange: 'Oct 02 – Oct 14',
    startDay: 2,
    endDay: 14,
    season: 'Autumn',
    category: 'Folk & Heritage',
    significance: 'The world’s longest celebration spanning 75 days, dedicated to Goddess Danteshwari and celebrated by Maria, Muria, Bhatra, and Halba indigenous tribes since the 13th century.',
    culturalInsight: 'A massive double-decker wooden chariot (Rath) handcrafted by tribal artisans using ancient Sal timber without a single iron nail is hauled through Jagdalpur by thousands of tribal youth.',
    imageUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200&auto=format&fit=crop',
    duration: '75 Days (Peak: 10 Days in Oct)',
    tips: [
      'The prime ritual to witness is the pulling of the eight-wheeled chariot (Bheetar Raini) on Vijayadashami',
      'Visit the roaring horseshoe Chitrakote Waterfalls (India’s Niagara) just 38 km from Jagdalpur',
      'Shop for authentic Dhokra bell-metal lost-wax sculptures and wrought iron art directly from tribal artisans'
    ],
    linkedDestinationNames: ['Jagdalpur & Bastar', 'Chitrakote Falls', 'Raipur & Sirpur']
  },
  {
    id: 'fest-goa-carnival',
    name: 'Goa Carnival & Shigmo',
    destination: 'Panaji, Old Goa & Margao',
    state: 'Goa',
    approxMonth: 'February / March (Pre-Lent)',
    monthIndex: 2,
    approxDateRange: 'Feb 14 – Feb 18',
    startDay: 14,
    endDay: 18,
    season: 'Winter',
    category: 'Carnival & Fest',
    significance: 'A 500-year-old Portuguese legacy celebration where King Momo decrees merriment and dance across the coastal towns, followed closely by the vibrant Hindu Shigmo festival.',
    culturalInsight: 'Street parades with flamboyant floats, brass trumpets, samba dancers, red-and-black masked dancers, and Konkani folk performances flood 18th June Road in Panaji.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
    duration: '4 Days',
    tips: [
      'Catch the opening parade in Panaji along the Mandovi Riverfront for the most theatrical floats',
      'Explore the Latin Quarter of Fontainhas in Panaji for lively sidewalk cafes, fado music, and port wine',
      'Extend your stay to relax on the pristine white sands of South Goa’s Palolem and Agonda'
    ],
    linkedDestinationNames: ['North Goa (Beaches & Forts)', 'South Goa (Heritage & Coast)', 'Hampi']
  },
  {
    id: 'fest-wangala',
    name: 'Wangala 100 Drums Festival',
    destination: 'Garo Hills & Tura',
    state: 'Meghalaya',
    approxMonth: 'November (Post-Harvest)',
    monthIndex: 11,
    approxDateRange: 'Nov 08 – Nov 10',
    startDay: 8,
    endDay: 10,
    season: 'Autumn',
    category: 'Folk & Heritage',
    significance: 'The most important post-harvest festival of the Garo tribe paying thanksgiving to Misi Saljong, the Great Giver of all crops and sunlight.',
    culturalInsight: 'One hundred long cylindrical Dama drums beat in synchronized thunder as men in feathered turbans and women in colorful Dokmanda wrap skirts dance in rhythm.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    duration: '3 Days',
    tips: [
      'Held at Asanang near Tura in the West Garo Hills; travel through Guwahati or Shillong',
      'Sample authentic Garo delicacies like bamboo shoot curries and steamed sticky rice in banana leaves',
      'Combine with caving expeditions in Meghalaya’s limestone caverns and living root bridges'
    ],
    linkedDestinationNames: ['Shillong', 'Cherrapunji & Mawlynnong', 'Kaziranga National Park']
  },
  {
    id: 'fest-losar',
    name: 'Losar Tibetan New Year',
    destination: 'Gangtok & Tawang',
    state: 'Sikkim',
    approxMonth: 'February / March (Tibetan Lunar Calendar)',
    monthIndex: 2,
    approxDateRange: 'Feb 10 – Feb 15',
    startDay: 10,
    endDay: 15,
    season: 'Winter',
    category: 'Folk & Heritage',
    significance: 'The Tibetan and Sikkimese Buddhist New Year marking purification, spiritual renewal, and the driving away of evil spirits across Himalayan monasteries.',
    culturalInsight: 'Monks in Rumtek and Pemayangtse perform the dramatic Gutor Cham mask dance with cymbals and long horns, followed by hoisting fresh colorful prayer flags on mountain ridges.',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    duration: '5 Days',
    tips: [
      'Clear winter skies offer peerless panoramas of the snow-capped Kanchenjunga peaks from Pelling',
      'Taste warm butter tea (Po Cha) and deep-fried sweet Khapse pastries shared with monastery visitors',
      'Carry warm thermal layers as sub-zero evening temperatures are common in high-altitude gompas'
    ],
    linkedDestinationNames: ['Gangtok & Rumtek', 'Pelling & West Sikkim', 'Darjeeling', 'Tawang']
  },
  {
    id: 'fest-hampi-utsav',
    name: 'Hampi Utsav (Vijaya Utsav)',
    destination: 'Hampi',
    state: 'Karnataka',
    approxMonth: 'January / November',
    monthIndex: 1,
    approxDateRange: 'Jan 10 – Jan 12',
    startDay: 10,
    endDay: 12,
    season: 'Winter',
    category: 'Folk & Heritage',
    significance: 'Mega-cultural extravaganza recreating the grandeur and poetic brilliance of the 14th-century Vijayanagara Empire among the dramatic boulder landscape.',
    culturalInsight: 'The monolithic Virupaksha Temple and Stone Chariot are illuminated with laser mapping shows, while classical musicians and Yakshagana dancers perform in royal courtyards.',
    imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=1200&auto=format&fit=crop',
    duration: '3 Days',
    tips: [
      'Take coracle boat rides across the Tungabhadra River at sunset to view the illuminated boulder hills',
      'Stay in Hospet or heritage resorts on the Anegundi side of the river',
      'Rent a bicycle to explore the royal enclosures and Queen’s Bath during cool morning hours'
    ],
    linkedDestinationNames: ['Hampi', 'Badami, Aihole & Pattadakal', 'Mysuru', 'Goa']
  },
  {
    id: 'fest-baisakhi',
    name: 'Baisakhi Harvest Festival',
    destination: 'Amritsar & Anandpur',
    state: 'Punjab',
    approxMonth: 'April 13–14',
    monthIndex: 4,
    approxDateRange: 'Apr 13 – Apr 14',
    startDay: 13,
    endDay: 14,
    season: 'Spring',
    category: 'Harvest & Boats',
    significance: 'Vibrant spring harvest festival marking the birth of the Khalsa panth by Guru Gobind Singh in 1699, celebrated with joyous Bhangra and Gidda folk dances.',
    culturalInsight: 'The Golden Temple in Amritsar is bathed in golden light and flower garlands as tens of thousands take holy dips in the Amrit Sarovar sacred pool.',
    imageUrl: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?q=80&w=1200&auto=format&fit=crop',
    duration: '2 Days',
    tips: [
      'Experience the 24-hour mega Langar at the Golden Temple, the largest free community kitchen on Earth',
      'Witness the daily evening Beating Retreat ceremony at the Wagah Border 28 km away',
      'Savor crisp Amritsari Kulchas dripping with desi butter and tall glasses of sweet malai lassi'
    ],
    linkedDestinationNames: ['Amritsar', 'Patiala', 'Chandigarh', 'Dharamshala']
  }
];

export function getDestinationsByState(stateName: string): IndianDestination[] {
  return ALL_INDIA_DESTINATIONS.filter(
    (d) => d.state.toLowerCase().includes(stateName.toLowerCase())
  );
}

export function getDestinationsByCategory(category: IndiaTravelCategory): IndianDestination[] {
  return ALL_INDIA_DESTINATIONS.filter((d) => d.categories.includes(category));
}

export function getDestinationsByRegion(region: string): IndianDestination[] {
  return ALL_INDIA_DESTINATIONS.filter((d) => d.region === region);
}

export function searchIndianDestinations(query: string): IndianDestination[] {
  const q = query.toLowerCase().trim();
  if (!q) return ALL_INDIA_DESTINATIONS;
  return ALL_INDIA_DESTINATIONS.filter((d) => {
    return (
      d.name.toLowerCase().includes(q) ||
      d.state.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.categories.some((c) => c.toLowerCase().includes(q)) ||
      d.attractions.some((a) => a.toLowerCase().includes(q)) ||
      d.signatureDishes.some((s) => s.toLowerCase().includes(q)) ||
      d.description.toLowerCase().includes(q)
    );
  });
}
