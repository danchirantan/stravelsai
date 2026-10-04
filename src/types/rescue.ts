export type EmergencyCategory =
  | 'medical'
  | 'air_ambulance'
  | 'police'
  | 'fire_disaster'
  | 'highway_breakdown'
  | 'desert_wilderness'
  | 'water_rescue'
  | 'tourist_consular'
  | 'women_safety'
  | 'crisis_hotline';

export interface EmergencyPersonalContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  notifyOnSos: boolean;
}

export interface DeadManTimerConfig {
  isActive: boolean;
  durationMinutes: number;
  startedAt: string | null;
  targetEndTime: string | null;
  activityNote: string;
}

export interface WildernessDistressProtocol {
  id: string;
  title: string;
  category: 'audio' | 'visual' | 'medical' | 'desert';
  code: string;
  description: string;
  actionSteps: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  category: EmergencyCategory;
  description: string;
  coverage: string; // e.g. "All India", "Rajasthan State", "Jaisalmer Thar Desert"
  isTollFree: boolean;
  isAvailable24x7: boolean;
  priority: 'CRITICAL' | 'HIGH' | 'STANDARD';
  icon: string;
  badge?: string;
}

export interface EmergencyHospitalOrStation {
  id: string;
  name: string;
  city: string;
  category: 'Hospital / Trauma' | 'Police Station' | 'Desert Patrol Post' | 'Tourist Police';
  address: string;
  phone: string;
  coordinates: { lat: number; lng: number };
  has24x7Emergency: boolean;
  distanceKm?: number;
}

export interface GpsBreadcrumb {
  id: string;
  lat: number;
  lng: number;
  altitude?: number | null;
  accuracy: number;
  speed?: number | null;
  heading?: number | null;
  timestamp: string;
  note?: string;
}

export interface OfflineMapPackage {
  id: string;
  tripId: string;
  tripTitle: string;
  downloadedAt: string;
  expiresAt?: string;
  sizeBytes: number;
  sizeFormatted: string;
  destinations: string[];
  waypointsCount: number;
  cachedEmergencyContactsCount: number;
  cachedFacilitiesCount: number;
  isOfflineReady: boolean;
  bounds: {
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  };
  waypoints: {
    id: string;
    title: string;
    category: string;
    city: string;
    dayNumber: number;
    lat: number;
    lng: number;
    aiNote: string;
    emergencyTips?: string;
  }[];
  offlineEmergencyDirectory: EmergencyContact[];
  offlineRouteSummary: {
    totalDistanceKm: number;
    drivingTimeHours: number;
    criticalWaypoints: string[];
    safeShelters: string[];
  };
}

export interface LiveGpsTelemetry {
  lat: number;
  lng: number;
  altitude: number | null;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  lastUpdated: string;
  isTracking: boolean;
  provider: 'Satellite GPS' | 'Cached Offline Fix' | 'Simulated Fix';
}
