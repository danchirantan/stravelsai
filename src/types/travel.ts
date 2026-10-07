export type TravelStyle =
  | 'Luxury'
  | 'Culture'
  | 'Food'
  | 'Adventure'
  | 'Nature'
  | 'Relaxation'
  | 'Photography'
  | 'Shopping'
  | 'Nightlife'
  | 'Wellness';

export type ActivityCategory =
  | 'Culture'
  | 'Food'
  | 'Sightseeing'
  | 'Transit'
  | 'Relaxation'
  | 'Shopping'
  | 'Nightlife'
  | 'Nature'
  | 'Adventure'
  | 'Photography'
  | 'Hotels';

export interface CompanionVote {
  companionId: string;
  companionName: string;
  avatar: string;
  vote: 'up' | 'down';
  timestamp: string;
}

export interface SuggestedItineraryItem {
  id: string;
  dayNumber: number;
  time: string;
  title: string;
  category: ActivityCategory;
  duration: string;
  cost: number;
  currency: string;
  location: string;
  coordinates: { lat: number; lng: number };
  suggestedBy: {
    name: string;
    avatar: string;
    role: string;
  };
  aiReason: string;
  upvotes: number;
  downvotes: number;
  userVote: 'up' | 'down' | null;
  companionVotes: CompanionVote[];
  status: 'Pending' | 'Accepted' | 'Declined';
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  category: ActivityCategory;
  duration: string;
  travelTime?: string;
  cost: number;
  currency: string;
  location: string;
  coordinates: { lat: number; lng: number };
  reservationStatus: 'Confirmed' | 'Reserved' | 'Not Needed' | 'Recommended';
  aiReason: string;
  rating?: number;
  imageUrl?: string;
  notes?: string;
  isSuggested?: boolean;
  suggestedBy?: string;
  upvotes?: number;
  downvotes?: number;
  userVote?: 'up' | 'down' | null;
  companionVotes?: CompanionVote[];
}

export interface ItineraryDay {
  dayNumber: number;
  date: string;
  city: string;
  theme: string;
  weather: {
    temp: string;
    condition: string;
    icon: string;
    advisory?: string;
  };
  activities: Activity[];
}

export interface Trip {
  id: string;
  title: string;
  subtitle: string;
  sourceCity?: string;
  destinations: string[];
  startDate: string;
  endDate: string;
  daysCount: number;
  travelersCount: number;
  budgetTotal: number;
  budgetSpent: number;
  currency: string;
  readinessScore: number;
  confidenceScore: number;
  travelStyle: TravelStyle[];
  pace: 'Slow' | 'Balanced' | 'Packed';
  coverImage: string;
  days: ItineraryDay[];
}

export interface DestinationPlace {
  id: string;
  name: string;
  city: string;
  category: 'Palace' | 'Fort' | 'Temple' | 'Nature' | 'Market' | 'Viewpoint' | 'Heritage' | 'Experience' | 'Coast';
  tagline: string;
  description: string;
  imageUrl: string;
  recommendedDuration: string;
  bestTimeOfDay: 'Morning' | 'Afternoon' | 'Sunset' | 'Evening' | 'Full Day';
  entryFee: string;
  rating: number;
  reviewsCount: number;
  highlight: string;
  curatorTip?: string;
  coordinates: { lat: number; lng: number };
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  tagline: string;
  bestTime: string;
  typicalBudget: string;
  flightDuration: string;
  weather: string;
  description: string;
  neighborhoods: string[];
  experiences: string[];
  highlights: string[];
  imageUrl: string;
  coordinates: { lat: number; lng: number };
  places?: DestinationPlace[];
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  style:
    | 'Heritage Palace'
    | 'Royal Haveli'
    | 'Desert Luxury Camp'
    | 'Lakeside Sanctuary'
    | 'Boutique Luxury'
    | 'Contemporary Sanctuary'
    | 'Design Hotel'
    | 'Colonial Harbour Villa'
    | 'High-Altitude Luxury Sanctuary'
    | 'Seaside Portuguese Estate'
    | 'Sacred Riverfront Palace';
  amenities: string[];
  aiReason: string;
  imageUrl: string;
  distanceToKeySpot: string;
}

export interface Restaurant {
  id: string;
  name: string;
  city: string;
  cuisine: string;
  rating: number;
  priceTier: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  avgPrice: number;
  atmosphere: string;
  distance: string;
  dietary: string[];
  aiContext: string;
  imageUrl: string;
  recommendedDish: string;
}

export interface Expense {
  id: string;
  category: 'Flights' | 'Hotels' | 'Food' | 'Activities' | 'Transport' | 'Shopping' | 'Other';
  title: string;
  amount: number;
  currency: string;
  paidBy: string;
  date: string;
  status: 'Estimated' | 'Actual';
  city?: string;
}

export interface Booking {
  id: string;
  type: 'Flight' | 'Hotel' | 'Train' | 'Activity' | 'Dining';
  title: string;
  provider: string;
  reference: string;
  date: string;
  time: string;
  location: string;
  status: 'Confirmed' | 'Pending' | 'Waitlisted';
  cost: number;
  currency: string;
  cancellationPolicy: string;
}

export interface TravelDocument {
  id: string;
  type: 'Passport' | 'Visa' | 'Insurance' | 'License' | 'Rail Pass';
  holder: string;
  identifier: string;
  expiryDate: string;
  status: 'Valid' | 'Expires Soon' | 'Action Needed';
  issuingAuthority: string;
  secureSnippet: string;
}

export interface TravelCompanion {
  id: string;
  name: string;
  email: string;
  role: 'Organizer' | 'Co-Planner' | 'Viewer';
  avatar: string;
  votedActivities: string[];
  expensesOwed: number;
}

export interface WeatherDailyForecast {
  date: string;
  weatherCode: number;
  condition: string;
  tempMax: number;
  tempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  windSpeedMax: number;
}

export interface DestinationWeather {
  city: string;
  country: string;
  coordinates: { lat: number; lng: number };
  current: {
    temp: number;
    apparentTemp: number;
    humidity: number;
    precipitation: number;
    rainProbability: number;
    windSpeed: number;
    windGusts: number;
    weatherCode: number;
    condition: string;
    icon: string;
  };
  daily: WeatherDailyForecast[];
  retrievedAt: string;
  source: string;
  hasActiveDisruption: boolean;
}

export type DisruptionSeverity = 'CRITICAL' | 'WARNING' | 'ADVISORY';

export interface WeatherDisruptionAlert {
  id: string;
  city: string;
  severity: DisruptionSeverity;
  type: 'TORRENTIAL_RAIN' | 'TYPHOON_WIND' | 'SEVERE_THUNDERSTORM' | 'EXTREME_HEAT' | 'SNOW_FREEZE';
  headline: string;
  details: string;
  aiRecommendation: string;
  suggestedAction: string;
  targetDayNumber?: number;
  targetDate?: string;
  affectedActivities?: string[];
  metrics: {
    temp: string;
    precipitationProb: string;
    precipitationAmount?: string;
    windSpeed?: string;
  };
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  category: 'AI' | 'Travel' | 'Bookings' | 'Budget' | 'Weather';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionLabel?: string;
  actionType?: string;
  weatherAlert?: WeatherDisruptionAlert;
}

export interface TripMemory {
  id: string;
  dayNumber: number;
  date: string;
  location: string;
  title: string;
  story: string;
  photoCount: number;
  locationsCount: number;
  highlights: string[];
  imageUrl: string;
  geoTag?: {
    destination: string;
    city: string;
    coordinates: { lat: number; lng: number };
    timestamp: string;
    timeString: string;
    dayTheme?: string;
    weather?: string;
    altitude?: string;
    deviceLens?: string;
  };
  capturedViaCamera?: boolean;
}

export type IndiaTravelCategory =
  | 'Mountains'
  | 'Beaches'
  | 'Wildlife'
  | 'Spiritual'
  | 'Heritage'
  | 'Food'
  | 'Luxury'
  | 'Adventure'
  | 'Cultural'
  | 'Monsoon'
  | 'Offbeat'
  | 'Nature'
  | 'Photography'
  | 'Nightlife'
  | 'Relaxation'
  | 'Honeymoon'
  | 'Family Vacation'
  | 'Shopping'
  | 'Desert'
  | 'Wellness';

export interface IndianDestination {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'West' | 'East' | 'Northeast' | 'Central' | 'Islands';
  isUnionTerritory?: boolean;
  latitude: number;
  longitude: number;
  heroImage: string;
  gallery: string[];
  description: string;
  categories: IndiaTravelCategory[];
  bestTimeToVisit: string;
  recommendedDuration: string;
  estimatedBudget: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  avgDailyBudgetINR: number;
  idealFor: string[];
  attractions: string[];
  activities: string[];
  restaurants: string[];
  signatureDishes: string[];
  hotels: string[];
  localExperiences: string[];
  hiddenGems: string[];
  nearbyDestinations: string[];
  transportation: {
    nearestAirport: string;
    nearestRailway: string;
    roadConnectivity: string;
  };
  weather: {
    summer: string;
    monsoon: string;
    winter: string;
    peakSeason: string;
  };
  culturalNotes: string;
  aiInsights: string[];
}

export interface IndianCircuit {
  id: string;
  title: string;
  subtitle: string;
  route: string[];
  durationDays: number;
  typicalBudgetINR: number;
  coverImage: string;
  theme: string;
  highlights: string[];
}
