import {
  SourceCity,
  FlightOption,
  TrainOption,
  CabOption,
  DateWeatherForecast,
  MultiModalComparison,
} from '../types/transit';

export const SOURCE_CITIES: SourceCity[] = [
  { id: 'del', name: 'New Delhi / NCR', state: 'Delhi', code: 'DEL', distanceToJaipurKm: 268, popular: true },
  { id: 'bom', name: 'Mumbai', state: 'Maharashtra', code: 'BOM', distanceToJaipurKm: 1148, popular: true },
  { id: 'blr', name: 'Bengaluru', state: 'Karnataka', code: 'BLR', distanceToJaipurKm: 1755, popular: true },
  { id: 'ccu', name: 'Kolkata', state: 'West Bengal', code: 'CCU', distanceToJaipurKm: 1515, popular: true },
  { id: 'hyd', name: 'Hyderabad', state: 'Telangana', code: 'HYD', distanceToJaipurKm: 1410, popular: true },
  { id: 'amd', name: 'Ahmedabad', state: 'Gujarat', code: 'AMD', distanceToJaipurKm: 655, popular: true },
  { id: 'maa', name: 'Chennai', state: 'Tamil Nadu', code: 'MAA', distanceToJaipurKm: 1980, popular: false },
  { id: 'pnq', name: 'Pune', state: 'Maharashtra', code: 'PNQ', distanceToJaipurKm: 1190, popular: false },
  { id: 'ixc', name: 'Chandigarh', state: 'Punjab/Haryana', code: 'IXC', distanceToJaipurKm: 505, popular: false },
  { id: 'lko', name: 'Lucknow', state: 'Uttar Pradesh', code: 'LKO', distanceToJaipurKm: 570, popular: false },
];

/**
 * Returns weather estimations specifically calibrated to the journey dates!
 */
export function getDateWeatherEstimations(
  startDateStr: string,
  endDateStr: string,
  destination: string = 'Rajasthan (Jaipur / Jodhpur / Jaisalmer / Udaipur)'
): DateWeatherForecast[] {
  const start = new Date(startDateStr || '2026-10-15');
  const end = new Date(endDateStr || '2026-10-21');

  // Guard against invalid dates
  const sDate = isNaN(start.getTime()) ? new Date('2026-10-15') : start;
  const eDate = isNaN(end.getTime()) ? new Date(sDate.getTime() + 6 * 86400000) : end;

  const daysCount = Math.max(1, Math.min(14, Math.round((eDate.getTime() - sDate.getTime()) / 86400000) + 1));
  const forecasts: DateWeatherForecast[] = [];

  for (let i = 0; i < daysCount; i++) {
    const cur = new Date(sDate.getTime() + i * 86400000);
    const month = cur.getMonth(); // 0 = Jan, 9 = Oct
    const dateFormatted = cur.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    let season = 'Festive Autumn';
    let highTempC = 30;
    let lowTempC = 16;
    let condition = 'Clear & Golden Sun';
    let icon: DateWeatherForecast['icon'] = 'sun';
    let humidityPercent = 35;
    let uvIndex = 6;
    let summary = 'Crisp mornings, luminous sunshine for fort exploration, pleasant sunset breezes.';
    let clothingAdvice = 'Breathable cottons or linens for day walks; light layer or jacket for desert evenings.';
    let bestTimeOfDay = '08:00 AM – 11:30 AM (Forts) & 04:30 PM – 07:00 PM (Lakes/Dunes)';
    let desertNightAlert: string | undefined = undefined;

    if (month === 11 || month === 0 || month === 1) {
      // Winter (Dec, Jan, Feb)
      season = 'Royal Winter Peak';
      highTempC = 23 + (i % 3);
      lowTempC = 8 - (i % 2);
      condition = 'Cool Winter Azure & Morning Mist';
      humidityPercent = 42;
      uvIndex = 5;
      summary = 'Peak travel season. Crisp brisk air, flawless blue skies, and chilled starry nights.';
      clothingAdvice = 'Warm layers, wool jacket or pashmina shawl for evening terrace dining and night safaris.';
      desertNightAlert = 'Thar Desert temperatures plunge to 6°C at night in Jaisalmer! Keep camp heaters on.';
    } else if (month >= 2 && month <= 4) {
      // Spring & Early Summer (Mar, Apr, May)
      season = month === 2 ? 'Spring Bloom' : 'High Desert Sun';
      highTempC = month === 2 ? 31 : 39 + (i % 3);
      lowTempC = month === 2 ? 18 : 25;
      condition = month === 2 ? 'Pleasant Sun' : 'Intense Dry Radiance';
      humidityPercent = 22;
      uvIndex = 9;
      summary = month === 2
        ? 'Golden daytime warmth and lively bazaars.'
        : 'High dry heat. Majestic quiet courtyards and tranquil shaded havelis.';
      clothingAdvice = 'Lightweight loose cottons, UV protective sunglasses, broad-brim sun hats.';
      bestTimeOfDay = 'Early dawn (07:00 AM – 10:00 AM) and evening after 06:00 PM';
    } else if (month >= 5 && month <= 7) {
      // Monsoon (Jun, Jul, Aug)
      season = 'Monsoon Rejuvenation';
      highTempC = 33 - (i % 3);
      lowTempC = 24;
      condition = i % 2 === 0 ? 'Passing Rain Showers & Cool Breezes' : 'Misty Overcast & Green Hills';
      icon = 'cloud-rain';
      humidityPercent = 75;
      uvIndex = 6;
      summary = 'Lakes in Udaipur and Jaipur brim full, Aravalli hills turn emerald green.';
      clothingAdvice = 'Quick-dry fabrics, slip-resistant waterproof footwear, compact umbrella.';
      bestTimeOfDay = 'Late afternoons when cool rain sweeps across palace ramparts';
    } else if (month >= 8 && month <= 10) {
      // Post-Monsoon / Autumn (Sep, Oct, Nov)
      season = 'Festive Autumn Circuit';
      highTempC = 29 + (i % 2);
      lowTempC = 15 + (i % 3);
      condition = 'Sunny & Golden Hue';
      humidityPercent = 38;
      uvIndex = 7;
      summary = 'Superb visibility across palace ramparts, dry comfortable air, festive atmosphere.';
      clothingAdvice = 'Comfortable sneakers for stone ramparts, cotton outfits, light evening wrap.';
      if (destination.toLowerCase().includes('jaisalmer')) {
        desertNightAlert = 'Expect brisk 14°C night breeze across Sam Sand Dunes during camel safaris.';
      }
    }

    forecasts.push({
      date: dateFormatted,
      season,
      highTempC,
      lowTempC,
      condition,
      icon,
      humidityPercent,
      uvIndex,
      summary,
      clothingAdvice,
      bestTimeOfDay,
      desertNightAlert,
    });
  }

  return forecasts;
}

/**
 * Returns tailored flight choices from chosen source city to destination
 */
export function getFlightsForRoute(sourceCityName: string, destinationName: string): FlightOption[] {
  const isDelhi = sourceCityName.toLowerCase().includes('delhi');
  const isMumbai = sourceCityName.toLowerCase().includes('mumbai');
  const isBengaluru = sourceCityName.toLowerCase().includes('bengaluru') || sourceCityName.toLowerCase().includes('bangalore');
  const isKolkata = sourceCityName.toLowerCase().includes('kolkata');

  if (isDelhi) {
    return [
      {
        id: 'fl-del-jai-1',
        airline: 'IndiGo',
        flightNumber: '6E 2134',
        logo: '✈️',
        departureAirport: 'Indira Gandhi Int’l Airport (T3)',
        departureCode: 'DEL',
        departureTime: '06:20',
        arrivalAirport: 'Jaipur International Airport (T2)',
        arrivalCode: 'JAI',
        arrivalTime: '07:20',
        duration: '1h 00m',
        nonStop: true,
        pricePerSeat: 3150,
        currency: 'INR',
        cabinClass: 'Economy',
        baggage: '15 kg check-in · 7 kg cabin',
        punctualityScore: '94% On-Time',
        carbonKg: 42,
      },
      {
        id: 'fl-del-jai-2',
        airline: 'Air India',
        flightNumber: 'AI 491',
        logo: '🛩️',
        departureAirport: 'Indira Gandhi Int’l Airport (T3)',
        departureCode: 'DEL',
        departureTime: '09:45',
        arrivalAirport: 'Jaipur International Airport (T2)',
        arrivalCode: 'JAI',
        arrivalTime: '10:45',
        duration: '1h 00m',
        nonStop: true,
        pricePerSeat: 3850,
        currency: 'INR',
        cabinClass: 'Premium Economy',
        baggage: '20 kg check-in · 7 kg cabin · Complimentary Hot Meal',
        punctualityScore: '89% On-Time',
        carbonKg: 45,
      },
      {
        id: 'fl-del-jdh-3',
        airline: 'IndiGo',
        flightNumber: '6E 2471',
        logo: '✈️',
        departureAirport: 'Indira Gandhi Int’l Airport (T2)',
        departureCode: 'DEL',
        departureTime: '13:10',
        arrivalAirport: 'Jodhpur Civil Airport',
        arrivalCode: 'JDH',
        arrivalTime: '14:25',
        duration: '1h 15m',
        nonStop: true,
        pricePerSeat: 4400,
        currency: 'INR',
        cabinClass: 'Economy',
        baggage: '15 kg check-in · 7 kg cabin',
        punctualityScore: '91% On-Time',
        carbonKg: 52,
      },
      {
        id: 'fl-del-udr-4',
        airline: 'Air India',
        flightNumber: 'AI 471',
        logo: '🛩️',
        departureAirport: 'Indira Gandhi Int’l Airport (T3)',
        departureCode: 'DEL',
        departureTime: '15:30',
        arrivalAirport: 'Maharana Pratap Airport Udaipur',
        arrivalCode: 'UDR',
        arrivalTime: '16:50',
        duration: '1h 20m',
        nonStop: true,
        pricePerSeat: 4650,
        currency: 'INR',
        cabinClass: 'Economy',
        baggage: '15 kg check-in · 7 kg cabin',
        punctualityScore: '92% On-Time',
        carbonKg: 55,
      },
    ];
  }

  if (isMumbai) {
    return [
      {
        id: 'fl-bom-jai-1',
        airline: 'IndiGo',
        flightNumber: '6E 5212',
        logo: '✈️',
        departureAirport: 'Chhatrapati Shivaji Maharaj Int’l (T2)',
        departureCode: 'BOM',
        departureTime: '06:05',
        arrivalAirport: 'Jaipur International Airport (T2)',
        arrivalCode: 'JAI',
        arrivalTime: '07:50',
        duration: '1h 45m',
        nonStop: true,
        pricePerSeat: 4850,
        currency: 'INR',
        cabinClass: 'Economy',
        baggage: '15 kg check-in · 7 kg cabin',
        punctualityScore: '93% On-Time',
        carbonKg: 78,
      },
      {
        id: 'fl-bom-udr-2',
        airline: 'Air India Express',
        flightNumber: 'IX 2942',
        logo: '🛩️',
        departureAirport: 'Chhatrapati Shivaji Maharaj Int’l (T1)',
        departureCode: 'BOM',
        departureTime: '10:20',
        arrivalAirport: 'Maharana Pratap Airport Udaipur',
        arrivalCode: 'UDR',
        arrivalTime: '11:45',
        duration: '1h 25m',
        nonStop: true,
        pricePerSeat: 4500,
        currency: 'INR',
        cabinClass: 'Economy',
        baggage: '15 kg check-in · 7 kg cabin',
        punctualityScore: '90% On-Time',
        carbonKg: 65,
      },
      {
        id: 'fl-bom-jdh-3',
        airline: 'Akasa Air',
        flightNumber: 'QP 1421',
        logo: '✈️',
        departureAirport: 'Chhatrapati Shivaji Maharaj Int’l (T2)',
        departureCode: 'BOM',
        departureTime: '14:40',
        arrivalAirport: 'Jodhpur Civil Airport',
        arrivalCode: 'JDH',
        arrivalTime: '16:20',
        duration: '1h 40m',
        nonStop: true,
        pricePerSeat: 5200,
        currency: 'INR',
        cabinClass: 'Economy',
        baggage: '15 kg check-in · 7 kg cabin',
        punctualityScore: '96% On-Time',
        carbonKg: 72,
      },
    ];
  }

  // Default / Other cities (Bengaluru, Kolkata, Hyderabad, etc.)
  const originCode = isBengaluru ? 'BLR' : isKolkata ? 'CCU' : 'ORIGIN';
  const airportName = isBengaluru
    ? 'Kempegowda Int’l Airport (T2)'
    : isKolkata
    ? 'Netaji Subhash Chandra Bose Int’l (T2)'
    : `${sourceCityName} Airport`;

  return [
    {
      id: 'fl-gen-jai-1',
      airline: 'IndiGo',
      flightNumber: '6E 6428',
      logo: '✈️',
      departureAirport: airportName,
      departureCode: originCode,
      departureTime: '07:30',
      arrivalAirport: 'Jaipur International Airport (T2)',
      arrivalCode: 'JAI',
      arrivalTime: '09:55',
      duration: '2h 25m',
      nonStop: true,
      pricePerSeat: 6400,
      currency: 'INR',
      cabinClass: 'Economy',
      baggage: '15 kg check-in · 7 kg cabin',
      punctualityScore: '92% On-Time',
      carbonKg: 110,
    },
    {
      id: 'fl-gen-udr-2',
      airline: 'Air India',
      flightNumber: 'AI 593',
      logo: '🛩️',
      departureAirport: airportName,
      departureCode: originCode,
      departureTime: '11:15',
      arrivalAirport: 'Maharana Pratap Airport Udaipur',
      arrivalCode: 'UDR',
      arrivalTime: '14:20',
      duration: '3h 05m',
      nonStop: false,
      stops: '1-stop via DEL (45m layover)',
      pricePerSeat: 7850,
      currency: 'INR',
      cabinClass: 'Economy',
      baggage: '20 kg check-in · 7 kg cabin · Complimentary Snacks',
      punctualityScore: '88% On-Time',
      carbonKg: 125,
    },
  ];
}

/**
 * Returns tailored Indian Railways train options
 */
export function getTrainsForRoute(sourceCityName: string, destinationName: string): TrainOption[] {
  const isDelhi = sourceCityName.toLowerCase().includes('delhi');
  const isMumbai = sourceCityName.toLowerCase().includes('mumbai');
  const isAhmedabad = sourceCityName.toLowerCase().includes('ahmedabad');

  if (isDelhi) {
    return [
      {
        id: 'tr-del-vb-1',
        trainName: 'Vande Bharat Express',
        trainNumber: '20978',
        departureStation: 'Delhi Cantt (DEC)',
        departureStationCode: 'DEC',
        departureTime: '06:10',
        arrivalStation: 'Jaipur Junction (JP)',
        arrivalStationCode: 'JP',
        arrivalTime: '09:55',
        duration: '3h 45m',
        daysRunning: 'Except Wed',
        speedType: 'Vande Bharat Express',
        cateringIncluded: true,
        punctualityRate: '98% On-Time (Ultra-Fast Corridor)',
        classes: [
          { code: 'EC', name: 'Executive Chair Car', fare: 1850, status: 'Available', availableCount: 24 },
          { code: 'CC', name: 'AC Chair Car', fare: 990, status: 'Available', availableCount: 112 },
        ],
      },
      {
        id: 'tr-del-shat-2',
        trainName: 'Ajmer Shatabdi Express',
        trainNumber: '12015',
        departureStation: 'New Delhi Railway Station (NDLS)',
        departureStationCode: 'NDLS',
        departureTime: '06:10',
        arrivalStation: 'Jaipur Junction (JP)',
        arrivalStationCode: 'JP',
        arrivalTime: '10:40',
        duration: '4h 30m',
        daysRunning: 'Daily (7 Days)',
        speedType: 'Shatabdi Express',
        cateringIncluded: true,
        punctualityRate: '94% On-Time',
        classes: [
          { code: '1A', name: 'Executive Anubhuti', fare: 1680, status: 'Available', availableCount: 8 },
          { code: 'CC', name: 'AC Chair Car', fare: 885, status: 'Available', availableCount: 76 },
        ],
      },
      {
        id: 'tr-del-ashram-3',
        trainName: 'Ashram Express',
        trainNumber: '12916',
        departureStation: 'Old Delhi Railway Station (DLI)',
        departureStationCode: 'DLI',
        departureTime: '15:20',
        arrivalStation: 'Jaipur Junction (JP)',
        arrivalStationCode: 'JP',
        arrivalTime: '20:15',
        duration: '4h 55m',
        daysRunning: 'Daily',
        speedType: 'Superfast Express',
        cateringIncluded: false,
        punctualityRate: '91% On-Time',
        classes: [
          { code: '1A', name: 'First AC', fare: 1540, status: 'Available', availableCount: 6 },
          { code: '2A', name: 'Second AC', fare: 940, status: 'Available', availableCount: 22 },
          { code: '3A', name: 'Third AC', fare: 680, status: 'Available', availableCount: 54 },
        ],
      },
      {
        id: 'tr-del-chetak-4',
        trainName: 'Chetak Express (Direct to Udaipur)',
        trainNumber: '20473',
        departureStation: 'Delhi Sarai Rohilla (DEE)',
        departureStationCode: 'DEE',
        departureTime: '19:40',
        arrivalStation: 'Udaipur City (UDZ)',
        arrivalStationCode: 'UDZ',
        arrivalTime: '07:48 (Next Day)',
        duration: '12h 08m',
        daysRunning: 'Daily',
        speedType: 'Superfast Express',
        cateringIncluded: false,
        punctualityRate: '93% On-Time',
        classes: [
          { code: '1A', name: 'First AC (Coupe/Cabin)', fare: 2650, status: 'Available', availableCount: 4 },
          { code: '2A', name: 'Second AC', fare: 1580, status: 'Available', availableCount: 18 },
          { code: '3A', name: 'Third AC', fare: 1120, status: 'Available', availableCount: 60 },
        ],
      },
    ];
  }

  if (isMumbai) {
    return [
      {
        id: 'tr-bom-duronto-1',
        trainName: 'Mumbai - Jaipur Duronto Express',
        trainNumber: '12239',
        departureStation: 'Mumbai Central (MMCT)',
        departureStationCode: 'MMCT',
        departureTime: '23:10',
        arrivalStation: 'Jaipur Junction (JP)',
        arrivalStationCode: 'JP',
        arrivalTime: '14:35 (Next Day)',
        duration: '15h 25m',
        daysRunning: 'Tue, Sun',
        speedType: 'Duronto Express',
        cateringIncluded: true,
        punctualityRate: '96% On-Time (Non-stop Superfast)',
        classes: [
          { code: '1A', name: 'First AC', fare: 4120, status: 'Available', availableCount: 6 },
          { code: '2A', name: 'Second AC', fare: 2540, status: 'Available', availableCount: 30 },
          { code: '3A', name: 'Third AC', fare: 1820, status: 'Available', availableCount: 88 },
        ],
      },
      {
        id: 'tr-bom-garibrath-2',
        trainName: 'Bandra Terminus - Jaipur Garib Rath',
        trainNumber: '12216',
        departureStation: 'Bandra Terminus (BDTS)',
        departureStationCode: 'BDTS',
        departureTime: '12:00',
        arrivalStation: 'Jaipur Junction (JP)',
        arrivalStationCode: 'JP',
        arrivalTime: '06:55 (Next Day)',
        duration: '18h 55m',
        daysRunning: 'Tue, Wed, Fri, Sun',
        speedType: 'Superfast Express',
        cateringIncluded: false,
        punctualityRate: '92% On-Time',
        classes: [
          { code: '3A', name: '3 AC Economy', fare: 1050, status: 'Available', availableCount: 140 },
        ],
      },
    ];
  }

  // Default / Other cities:
  return [
    {
      id: 'tr-gen-exp-1',
      trainName: `${sourceCityName} – Rajasthan Superfast Connect`,
      trainNumber: '12988',
      departureStation: `${sourceCityName} Central`,
      departureStationCode: 'STN',
      departureTime: '16:45',
      arrivalStation: 'Jaipur Junction (JP)',
      arrivalStationCode: 'JP',
      arrivalTime: '10:30 (Next Day)',
      duration: '17h 45m',
      daysRunning: 'Daily',
      speedType: 'Superfast Express',
      cateringIncluded: true,
      punctualityRate: '90% On-Time',
      classes: [
        { code: '2A', name: 'Second AC', fare: 2150, status: 'Available', availableCount: 16 },
        { code: '3A', name: 'Third AC', fare: 1480, status: 'Available', availableCount: 62 },
      ],
    },
  ];
}

/**
 * Returns Chauffeured Cabs & Roadway options from chosen origin
 */
export function getCabsForRoute(sourceCityName: string, destinationName: string): CabOption[] {
  const isDelhi = sourceCityName.toLowerCase().includes('delhi');
  const isAhmedabad = sourceCityName.toLowerCase().includes('ahmedabad');

  if (isDelhi) {
    return [
      {
        id: 'cab-sedan-del-1',
        vehicleCategory: 'Sedan',
        vehicleModel: 'Maruti Suzuki Dzire / Toyota Etios (AC)',
        capacityPassengers: 3,
        luggageCapacityBags: 2,
        airConditioned: true,
        estimatedPrice: 3850,
        ratePerKm: '₹12.5 / km',
        tollAndTaxesIncluded: true,
        durationEstimate: '4h 15m (via NE4 Delhi-Mumbai Expressway)',
        routeHighlights: [
          'Delhi → Sohna Elevated Corridor → NE4 Expressway Spur → Dausa Interchange → Jaipur bypass',
          'Smooth 120 km/h expressway surface with minimal city congestion',
          'Fastag automated toll included (~₹480 value)',
        ],
        chauffeurDetails: 'Verified highway chauffeur with 8+ years experience, fluent in Hindi & English.',
        fuelType: 'Petrol / CNG',
      },
      {
        id: 'cab-suv-del-2',
        vehicleCategory: 'Prime SUV',
        vehicleModel: 'Toyota Innova Crysta / Hycross (Captain Seats)',
        capacityPassengers: 6,
        luggageCapacityBags: 5,
        airConditioned: true,
        estimatedPrice: 6200,
        ratePerKm: '₹18.0 / km',
        tollAndTaxesIncluded: true,
        durationEstimate: '4h 00m (Expressway)',
        routeHighlights: [
          'Direct doorstep pickup from Delhi/NCR residence or airport terminal',
          'Reclining plush leather captain seats, USB charging on every row',
          'Free 30-minute pitstop at Waycool Highway Oasis for masala tea & snacks',
        ],
        chauffeurDetails: 'Commercial badge certified driver, non-smoking, GPS live monitored.',
        fuelType: 'Diesel',
      },
      {
        id: 'cab-lux-del-3',
        vehicleCategory: 'Luxury Chauffeur',
        vehicleModel: 'Mercedes-Benz E-Class / Audi A6 Chauffeur',
        capacityPassengers: 3,
        luggageCapacityBags: 3,
        airConditioned: true,
        estimatedPrice: 15500,
        ratePerKm: '₹45.0 / km',
        tollAndTaxesIncluded: true,
        durationEstimate: '3h 45m',
        routeHighlights: [
          'VIP Royal Palace welcome experience with chilled Himalayan mineral water',
          'Wi-Fi onboard, panoramic acoustic insulation for executive calm',
          'Priority terminal pickup with luggage concierge service',
        ],
        chauffeurDetails: 'Uniformed executive concierge chauffeur trained in luxury hospitality protocol.',
        fuelType: 'EV / Green',
      },
    ];
  }

  // Intercity / Local rental for longer distance or other origins
  return [
    {
      id: 'cab-gen-suv-1',
      vehicleCategory: 'Prime SUV',
      vehicleModel: 'Toyota Innova Crysta (AC)',
      capacityPassengers: 6,
      luggageCapacityBags: 4,
      airConditioned: true,
      estimatedPrice: 7500,
      ratePerKm: '₹19.0 / km',
      tollAndTaxesIncluded: true,
      durationEstimate: 'Dependent on route (Full Day Rental available)',
      routeHighlights: [
        'Dedicated vehicle & chauffeur for multi-day Rajasthan circuit',
        'Sightseeing flexibility across forts, stepwells & heritage alleys',
        'State border road tax and parking slips fully pre-paid',
      ],
      chauffeurDetails: 'Local Rajasthan road specialist with deep knowledge of fort parking and bypasses.',
      fuelType: 'Diesel',
    },
    {
      id: 'cab-gen-sedan-2',
      vehicleCategory: 'Sedan',
      vehicleModel: 'Hyundai Aura / Honda Amaze (AC)',
      capacityPassengers: 3,
      luggageCapacityBags: 2,
      airConditioned: true,
      estimatedPrice: 4200,
      ratePerKm: '₹14.0 / km',
      tollAndTaxesIncluded: true,
      durationEstimate: 'Local airport/station transfer & full day city run',
      routeHighlights: [
        'Door-to-door transfer between airport, hotel, and old city monuments',
        'No surge pricing guarantee',
      ],
      chauffeurDetails: 'Background checked, courtesy verified driver.',
      fuelType: 'Petrol / CNG',
    },
  ];
}

/**
 * Returns multi-modal comparison matrix
 */
export function getMultiModalComparison(sourceCityName: string): MultiModalComparison[] {
  const isDelhi = sourceCityName.toLowerCase().includes('delhi');

  if (isDelhi) {
    return [
      {
        mode: 'Train',
        title: 'Vande Bharat Express (Train 20978)',
        icon: '🚆',
        doorToDoorTime: '4h 15m (City-center to City-center)',
        startingPrice: 990,
        convenienceRating: 4.9,
        scenicRating: 4.4,
        carbonFootprintKg: 14,
        bestFor: 'Best overall balance of price, speed, comfort & hot catered meals.',
      },
      {
        mode: 'Flight',
        title: 'Non-Stop Flight (DEL → JAI)',
        icon: '✈️',
        doorToDoorTime: '3h 30m (including 2h airport check-in + transit)',
        startingPrice: 3150,
        convenienceRating: 4.3,
        scenicRating: 3.5,
        carbonFootprintKg: 42,
        bestFor: 'Connecting passengers landing at Delhi Airport from overseas or other states.',
      },
      {
        mode: 'Chauffeured Cab',
        title: 'Expressway Private Chauffeur (NE4)',
        icon: '🚗',
        doorToDoorTime: '4h 00m (Doorstep to Hotel lobby)',
        startingPrice: 3850,
        convenienceRating: 4.8,
        scenicRating: 4.6,
        carbonFootprintKg: 28,
        bestFor: 'Families & groups traveling together with heavy luggage or private schedule.',
      },
    ];
  }

  return [
    {
      mode: 'Flight',
      title: `Direct / Express Flight from ${sourceCityName}`,
      icon: '✈️',
      doorToDoorTime: '4h 30m (total door-to-door)',
      startingPrice: 4850,
      convenienceRating: 4.8,
      scenicRating: 4.0,
      carbonFootprintKg: 78,
      bestFor: 'Fastest and most comfortable connection across long distances (> 500 km).',
    },
    {
      mode: 'Train',
      title: 'Superfast / Duronto Overnight Train',
      icon: '🚆',
      doorToDoorTime: '15h–18h (Overnight sleeper)',
      startingPrice: 1820,
      convenienceRating: 4.2,
      scenicRating: 4.7,
      carbonFootprintKg: 22,
      bestFor: 'Scenic overnight rail travel, saving one night hotel cost.',
    },
    {
      mode: 'Chauffeured Cab',
      title: 'Chauffeured Circuit Cab in Rajasthan',
      icon: '🚗',
      doorToDoorTime: 'Flexible on-demand',
      startingPrice: 6200,
      convenienceRating: 4.9,
      scenicRating: 4.9,
      carbonFootprintKg: 35,
      bestFor: 'Intercity multi-day exploration between Jaipur, Jodhpur, Jaisalmer & Udaipur.',
    },
  ];
}
