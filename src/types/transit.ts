export interface SourceCity {
  id: string;
  name: string;
  state: string;
  code: string; // airport / rail hub code (e.g. DEL, BOM)
  distanceToJaipurKm: number;
  popular: boolean;
}

export interface DateWeatherForecast {
  date: string;
  season: string;
  highTempC: number;
  lowTempC: number;
  condition: string;
  icon: 'sun' | 'cloud' | 'cloud-rain' | 'wind' | 'moon';
  humidityPercent: number;
  uvIndex: number;
  summary: string;
  clothingAdvice: string;
  bestTimeOfDay: string;
  desertNightAlert?: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  logo: string;
  departureAirport: string;
  departureCode: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalCode: string;
  arrivalTime: string;
  duration: string;
  nonStop: boolean;
  stops?: string;
  pricePerSeat: number;
  currency: string;
  cabinClass: 'Economy' | 'Premium Economy' | 'Business';
  baggage: string;
  punctualityScore: string;
  carbonKg: number;
}

export interface TrainClassSeat {
  code: string; // 1A, 2A, 3A, CC, EC, SL
  name: string;
  fare: number;
  status: 'Available' | 'RAC' | 'Waitlist';
  availableCount?: number;
}

export interface TrainOption {
  id: string;
  trainName: string;
  trainNumber: string;
  departureStation: string;
  departureStationCode: string;
  departureTime: string;
  arrivalStation: string;
  arrivalStationCode: string;
  arrivalTime: string;
  duration: string;
  daysRunning: string;
  speedType: 'Vande Bharat Express' | 'Shatabdi Express' | 'Duronto Express' | 'Superfast Express' | 'Rajdhani Express';
  classes: TrainClassSeat[];
  cateringIncluded: boolean;
  punctualityRate: string;
}

export interface CabOption {
  id: string;
  vehicleCategory: 'Sedan' | 'Prime SUV' | 'Luxury Chauffeur' | 'Tempo Traveler';
  vehicleModel: string;
  capacityPassengers: number;
  luggageCapacityBags: number;
  airConditioned: boolean;
  estimatedPrice: number;
  ratePerKm: string;
  tollAndTaxesIncluded: boolean;
  durationEstimate: string;
  routeHighlights: string[];
  chauffeurDetails: string;
  fuelType: 'EV / Green' | 'Diesel' | 'Petrol / CNG';
}

export interface MultiModalComparison {
  mode: 'Flight' | 'Train' | 'Chauffeured Cab';
  title: string;
  icon: string;
  doorToDoorTime: string;
  startingPrice: number;
  convenienceRating: number; // out of 5
  scenicRating: number; // out of 5
  carbonFootprintKg: number;
  bestFor: string;
}
