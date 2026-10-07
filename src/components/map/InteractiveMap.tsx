import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Calendar,
  Sparkles,
  Info,
  Building,
  UtensilsCrossed,
  Train,
  Camera,
  Bookmark,
  Check,
  Eye,
  EyeOff,
  Filter,
  Download,
  WifiOff,
  Siren,
  Radio,
  ShieldAlert,
  Crosshair,
  PhoneCall,
  HardDrive,
  BookOpen,
  HeartPulse,
  Compass,
  Shield,
  Activity
} from 'lucide-react';
import { Trip } from '../../types/travel';
import { OfflineMapModal } from './OfflineMapModal';
import { EmergencyRescueHub } from './EmergencyRescueHub';
import { OfflineMapStorage } from '../../services/offlineMapStorage';
import { OfflineMapPackage, GpsBreadcrumb } from '../../types/rescue';
import { EMERGENCY_FACILITIES } from '../../data/emergencyRescueData';

interface InteractiveMapProps {
  trip: Trip;
  theme: 'dark' | 'light';
  currency: string;
}

export type MapLayerType =
  | 'hotels'
  | 'restaurants'
  | 'attractions'
  | 'transportationRoutes'
  | 'savedPlaces'
  | 'emergencyFacilities';

export interface MapMarker {
  id: string;
  title: string;
  category: 'Hotels' | 'Restaurants' | 'Attractions' | 'Transit' | 'Saved Places' | 'Emergency';
  layerType: MapLayerType;
  dayNumber: number; // 0 means general / saved
  time?: string;
  cost: number;
  coordinates: { x: number; y: number; lat: number; lng: number };
  aiNote: string;
  city: string;
  isSaved?: boolean;
  isOriginGateway?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  trip,
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [activeMarker, setActiveMarker] = useState<MapMarker | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Offline Map and Rescue Command State
  const [cachedPackage, setCachedPackage] = useState<OfflineMapPackage | null>(() =>
    OfflineMapStorage.getOfflineMapPackage(trip.id)
  );
  const [isOfflineModalOpen, setIsOfflineModalOpen] = useState(false);
  const [isRescueHubOpen, setIsRescueHubOpen] = useState(false);
  const [rescueHubInitialTab, setRescueHubInitialTab] = useState<
    'sos' | 'directory' | 'tracker' | 'facilities' | 'protocols'
  >('sos');
  const [breadcrumbs, setBreadcrumbs] = useState<GpsBreadcrumb[]>(() =>
    OfflineMapStorage.getBreadcrumbs()
  );
  const [isBreadcrumbTrailVisible, setIsBreadcrumbTrailVisible] = useState(true);

  const handleViewLocationOnMap = (lat: number, lng: number, title: string) => {
    const x = Math.min(880, Math.max(120, Math.round(180 + ((lng - 70.8) / 5.2) * 600)));
    const y = Math.min(580, Math.max(120, Math.round(500 - ((lat - 24.5) / 2.6) * 360)));

    const existing = allMarkers.find(
      (m) => Math.abs(m.coordinates.lat - lat) < 0.05 && Math.abs(m.coordinates.lng - lng) < 0.05
    );
    if (existing) {
      setActiveMarker(existing);
    } else {
      setActiveMarker({
        id: `target-${Date.now()}`,
        title,
        category: 'Emergency',
        layerType: 'emergencyFacilities',
        dayNumber: 0,
        cost: 0,
        coordinates: { x, y, lat, lng },
        aiNote: `Emergency Location Target: ${title} (Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)})`,
        city: 'Rajasthan',
      });
    }
    setZoomLevel(1.5);
    setIsRescueHubOpen(false);
  };

  // Interactive Layer Visibility Filters
  const [layerFilters, setLayerFilters] = useState<Record<MapLayerType, boolean>>({
    hotels: true,
    restaurants: true,
    attractions: true,
    transportationRoutes: true,
    savedPlaces: true,
    emergencyFacilities: true,
  });

  const toggleLayer = (layer: MapLayerType) => {
    setLayerFilters((prev) => ({
      ...prev,
      [layer]: !prev[layer],
    }));
  };

  const selectAllLayers = () => {
    setLayerFilters({
      hotels: true,
      restaurants: true,
      attractions: true,
      transportationRoutes: true,
      savedPlaces: true,
      emergencyFacilities: true,
    });
  };

  const deselectAllLayers = () => {
    setLayerFilters({
      hotels: false,
      restaurants: false,
      attractions: false,
      transportationRoutes: false,
      savedPlaces: false,
      emergencyFacilities: false,
    });
  };

  const isIndia = true;

  const allMarkers: MapMarker[] = useMemo(() => {
    const markers: MapMarker[] = [];
    const tripTitleLower = trip.title.toLowerCase();
    const destsLower = trip.destinations.map((d) => d.toLowerCase());

    const isKerala = tripTitleLower.includes('kerala') || destsLower.some((d) => d.includes('kochi') || d.includes('munnar') || d.includes('alleppey'));
    const isLadakh = tripTitleLower.includes('ladakh') || destsLower.some((d) => d.includes('leh') || d.includes('nubra') || d.includes('pangong'));
    const isGoa = tripTitleLower.includes('goa') || destsLower.some((d) => d.includes('panaji') || d.includes('palolem') || d.includes('vagator'));
    const isVaranasi = tripTitleLower.includes('varanasi') || destsLower.some((d) => d.includes('kashi') || d.includes('sarnath'));
    const isHimachal = tripTitleLower.includes('himachal') || destsLower.some((d) => d.includes('shimla') || d.includes('manali') || d.includes('dharamshala'));

    // Extract all valid coordinates to compute dynamic bounding box
    const validCoords: { lat: number; lng: number }[] = [];
    trip.days.forEach((day) => {
      day.activities.forEach((act) => {
        if (act.coordinates?.lat && act.coordinates?.lng) {
          validCoords.push({ lat: act.coordinates.lat, lng: act.coordinates.lng });
        }
      });
    });

    let minLat = validCoords.length > 0 ? Math.min(...validCoords.map((c) => c.lat)) : 24.5;
    let maxLat = validCoords.length > 0 ? Math.max(...validCoords.map((c) => c.lat)) : 27.5;
    let minLng = validCoords.length > 0 ? Math.min(...validCoords.map((c) => c.lng)) : 70.8;
    let maxLng = validCoords.length > 0 ? Math.max(...validCoords.map((c) => c.lng)) : 76.5;

    // Buffer to avoid dividing by 0 or clumped margins
    if (maxLat - minLat < 0.25) {
      minLat -= 0.35;
      maxLat += 0.35;
    }
    if (maxLng - minLng < 0.25) {
      minLng -= 0.35;
      maxLng += 0.35;
    }

    const projectCoords = (lat: number, lng: number) => {
      const normX = Math.max(0, Math.min(1, (lng - minLng) / (maxLng - minLng)));
      const normY = Math.max(0, Math.min(1, (maxLat - lat) / (maxLat - minLat)));
      const x = Math.round(160 + normX * 680);
      const y = Math.round(140 + normY * 420);
      return { x, y };
    };

    trip.days.forEach((day) => {
      day.activities.forEach((act) => {
        let layerType: MapLayerType = 'attractions';
        let cat: 'Hotels' | 'Restaurants' | 'Attractions' | 'Transit' | 'Saved Places' = 'Attractions';

        if (act.category === 'Food') {
          layerType = 'restaurants';
          cat = 'Restaurants';
        } else if (act.category === 'Transit') {
          layerType = 'transportationRoutes';
          cat = 'Transit';
        } else if (
          act.category === 'Hotels' ||
          act.category === 'Relaxation' ||
          act.title.toLowerCase().includes('hotel') ||
          act.title.toLowerCase().includes('haveli') ||
          act.title.toLowerCase().includes('check-in') ||
          act.title.toLowerCase().includes('palace') ||
          act.title.toLowerCase().includes('resort')
        ) {
          layerType = 'hotels';
          cat = 'Hotels';
        }

        const lat = act.coordinates?.lat || (minLat + maxLat) / 2;
        const lng = act.coordinates?.lng || (minLng + maxLng) / 2;
        const { x, y } = projectCoords(lat, lng);

        markers.push({
          id: act.id,
          title: act.title,
          category: cat,
          layerType,
          dayNumber: day.dayNumber,
          time: act.time,
          cost: act.cost,
          city: day.city,
          coordinates: { x, y, lat, lng },
          aiNote: act.aiReason || `${act.category} experience in ${day.city}`,
        });
      });
    });

    // Destination-specific Saved Places
    if (isKerala) {
      const p1 = projectCoords(10.2851, 76.5698);
      const p2 = projectCoords(9.6178, 76.4301);
      const p3 = projectCoords(9.6014, 76.2974);
      markers.push(
        {
          id: 'm-ker-saved-1',
          title: 'Athirappilly Rainforest Waterfalls (Niagara of India)',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 250,
          city: 'Thrissur / Chalakudy',
          coordinates: { x: p1.x, y: p1.y, lat: 10.2851, lng: 76.5698 },
          aiNote: 'Saved: 80-foot majestic cascading waterfall amidst pristine Western Ghats canopy.',
          isSaved: true,
        },
        {
          id: 'm-ker-saved-2',
          title: 'Kumarakom Bird Sanctuary & Vembanad Marshlands',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 400,
          city: 'Kumarakom',
          coordinates: { x: p2.x, y: p2.y, lat: 9.6178, lng: 76.4301 },
          aiNote: 'Saved: 14-acre haven for migratory Siberian storks and egrets on Vembanad Lake.',
          isSaved: true,
        },
        {
          id: 'm-ker-saved-3',
          title: 'Marari White Sand Coconut Beach Sanctuary',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 0,
          city: 'Mararikulam',
          coordinates: { x: p3.x, y: p3.y, lat: 9.6014, lng: 76.2974 },
          aiNote: 'Saved: Tranquil Arabian Sea shore untouched by commercial resorts.',
          isSaved: true,
        }
      );
    } else if (isLadakh) {
      const p1 = projectCoords(34.1952, 77.3485);
      const p2 = projectCoords(34.2812, 76.7745);
      const p3 = projectCoords(34.0578, 77.6669);
      markers.push(
        {
          id: 'm-lad-saved-1',
          title: 'Magnetic Hill & Indus-Zanskar Sangam Confluence',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 0,
          city: 'Nimmu, Ladakh',
          coordinates: { x: p1.x, y: p1.y, lat: 34.1952, lng: 77.3485 },
          aiNote: 'Saved: Gravity-defying visual phenomenon and two-tone river confluence.',
          isSaved: true,
        },
        {
          id: 'm-lad-saved-2',
          title: 'Lamayuru Moonland & 11th-Century Yungdrung Gompa',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 300,
          city: 'Lamayuru',
          coordinates: { x: p2.x, y: p2.y, lat: 34.2812, lng: 76.7745 },
          aiNote: 'Saved: Surreal eroded lunar geological formations and Tibetan monastery.',
          isSaved: true,
        },
        {
          id: 'm-lad-saved-3',
          title: 'Thiksey 12-Story Monastic Complex & Maitreya Buddha',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 150,
          city: 'Thiksey',
          coordinates: { x: p3.x, y: p3.y, lat: 34.0578, lng: 77.6669 },
          aiNote: 'Saved: Historic Gompa resembling Potala Palace of Tibet.',
          isSaved: true,
        }
      );
    } else if (isGoa) {
      const p1 = projectCoords(15.3144, 74.3144);
      const p2 = projectCoords(15.0934, 73.9214);
      const p3 = projectCoords(15.5185, 73.9165);
      markers.push(
        {
          id: 'm-goa-saved-1',
          title: 'Dudhsagar 4-Tier Waterfalls & Bhagwan Mahaveer Sanctuary',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 650,
          city: 'Sonaulim, Goa',
          coordinates: { x: p1.x, y: p1.y, lat: 15.3144, lng: 74.3144 },
          aiNote: 'Saved: Sea of Milk 310m cascade on Mandovi river nestled in dense jungle.',
          isSaved: true,
        },
        {
          id: 'm-goa-saved-2',
          title: 'Cabo de Rama Fort & Ocean Bluff Lookout',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 0,
          city: 'Canacona',
          coordinates: { x: p2.x, y: p2.y, lat: 15.0934, lng: 73.9214 },
          aiNote: 'Saved: Ancient coastal cape fortress with panoramic Arabian Sea views.',
          isSaved: true,
        },
        {
          id: 'm-goa-saved-3',
          title: 'Divar Island Ferry Route & Colonial Chapel Ruins',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 20,
          city: 'Divar Island',
          coordinates: { x: p3.x, y: p3.y, lat: 15.5185, lng: 73.9165 },
          aiNote: 'Saved: Peaceful river island accessed only by roll-on roll-off ferry.',
          isSaved: true,
        }
      );
    } else if (isVaranasi) {
      const p1 = projectCoords(25.2678, 83.0252);
      const p2 = projectCoords(25.3789, 83.0245);
      const p3 = projectCoords(25.3109, 83.0141);
      markers.push(
        {
          id: 'm-var-saved-1',
          title: 'Ramnagar 18th-Century Fortress & Vintage Car Museum',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 300,
          city: 'Ramnagar, Varanasi',
          coordinates: { x: p1.x, y: p1.y, lat: 25.2678, lng: 83.0252 },
          aiNote: 'Saved: Red sandstone fort across the Ganges with antique royal armory.',
          isSaved: true,
        },
        {
          id: 'm-var-saved-2',
          title: 'Chaukhandi Stupa & Sarnath Deer Park Relics',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 200,
          city: 'Sarnath',
          coordinates: { x: p2.x, y: p2.y, lat: 25.3789, lng: 83.0245 },
          aiNote: 'Saved: Ancient 5th-century Gupta stupa commemorating Buddha arrival.',
          isSaved: true,
        },
        {
          id: 'm-var-saved-3',
          title: 'Manikarnika Historical Ghat & Eternal Sacred Fire',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 0,
          city: 'Varanasi',
          coordinates: { x: p3.x, y: p3.y, lat: 25.3109, lng: 83.0141 },
          aiNote: 'Saved: Holiest ghat of Kashi with continuous spiritual rituals.',
          isSaved: true,
        }
      );
    } else {
      // Default Rajasthan saved places
      markers.push(
        {
          id: 'm-raj-saved-1',
          title: 'Galta Ji (Monkey Temple) Sun Temple',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 500,
          city: 'Jaipur',
          coordinates: { x: 790, y: 220, lat: 26.915, lng: 75.86 },
          aiNote: 'Saved: 18th-century temple complex in narrow Aravalli pass.',
          isSaved: true,
        },
        {
          id: 'm-raj-saved-2',
          title: 'Ranakpur Jain Marble Temples (1,444 Pillars)',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 1200,
          city: 'Pali / Ranakpur',
          coordinates: { x: 480, y: 440, lat: 25.116, lng: 73.473 },
          aiNote: 'Saved: Architectural wonder carved from light-colored marble.',
          isSaved: true,
        },
        {
          id: 'm-raj-saved-3',
          title: 'Kuldhara Abandoned Ghost Village',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 400,
          city: 'Jaisalmer',
          coordinates: { x: 160, y: 300, lat: 26.871, lng: 70.785 },
          aiNote: 'Saved: 13th-century cursed heritage village left overnight.',
          isSaved: true,
        },
        {
          id: 'm-raj-saved-4',
          title: 'Pushkar Sacred Lake & Brahma Temple',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 0,
          city: 'Pushkar',
          coordinates: { x: 620, y: 320, lat: 26.4897, lng: 74.5511 },
          aiNote: 'Saved: Holy lake surrounded by 52 bathing ghats and rare Brahma shrine.',
          isSaved: true,
        },
        {
          id: 'm-raj-saved-5',
          title: 'Jaswant Thada Translucent Marble Memorial',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 100,
          city: 'Jodhpur',
          coordinates: { x: 380, y: 310, lat: 26.3043, lng: 73.0242 },
          aiNote: 'Saved: Royal cenotaph crafted from glowing Makrana marble sheets.',
          isSaved: true,
        },
        {
          id: 'm-raj-saved-6',
          title: 'Sam Sand Dunes Camel Safari & Sunset Ridge',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 1500,
          city: 'Jaisalmer',
          coordinates: { x: 120, y: 320, lat: 26.8322, lng: 70.5056 },
          aiNote: 'Saved: Vast golden Thar desert ripples with Kalbelia folk performances.',
          isSaved: true,
        },
        {
          id: 'm-raj-saved-7',
          title: 'Jag Mandir Island Palace & Lake Pichola',
          category: 'Saved Places',
          layerType: 'savedPlaces',
          dayNumber: 0,
          cost: 500,
          city: 'Udaipur',
          coordinates: { x: 500, y: 550, lat: 24.5677, lng: 73.6782 },
          aiNote: 'Saved: Floating marble island palace with stone elephant sentinels.',
          isSaved: true,
        }
      );
    }

    // Filter and map relevant emergency facilities
    const relevantFacilities = EMERGENCY_FACILITIES.filter((fac) => {
      if (isKerala) return fac.city.includes('Kochi') || fac.city.includes('Alleppey');
      if (isLadakh) return fac.city.includes('Leh');
      if (isGoa) return fac.city.includes('Panaji') || fac.city.includes('Goa');
      if (isVaranasi) return fac.city.includes('Varanasi');
      return ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur'].includes(fac.city);
    });

    relevantFacilities.forEach((fac) => {
      const lat = fac.coordinates.lat;
      const lng = fac.coordinates.lng;
      const { x, y } = projectCoords(lat, lng);

      markers.push({
        id: `fac-${fac.id}`,
        title: fac.name,
        category: 'Emergency',
        layerType: 'emergencyFacilities',
        dayNumber: 0,
        cost: 0,
        city: fac.city,
        coordinates: { x, y, lat, lng },
        aiNote: `24x7 Emergency Rescue Facility (${fac.category}): ${fac.address}. Emergency Phone: ${fac.phone}`,
      });
    });

    // Add Departure Origin Gateway Marker
    const srcCity = trip.sourceCity || 'New Delhi / NCR';
    const firstDest = trip.destinations[0] || 'Destination Hub';
    markers.push({
      id: 'm-origin-gateway',
      title: `Origin Gateway: ${srcCity}`,
      category: 'Transit',
      layerType: 'transportationRoutes',
      dayNumber: 0,
      cost: 0,
      city: srcCity,
      coordinates: { x: 890, y: 110, lat: 28.6139, lng: 77.209 },
      aiNote: `Departure Gateway: ${srcCity}. High-speed corridor connecting directly to ${firstDest}.`,
      isOriginGateway: true,
    });

    return markers;
  }, [trip, isIndia]);

  // Dynamic filter application: check both day filter and layer toggle
  const visibleMarkers = allMarkers.filter((m) => {
    // Layer visibility check
    if (!layerFilters[m.layerType]) return false;

    // Day filter check (0 means all days, saved places and emergency facilities shown on all days or day 0)
    if (selectedDay !== 0) {
      if (m.dayNumber !== 0 && m.dayNumber !== selectedDay) return false;
    }

    return true;
  });

  // Layer item counters for UI badges
  const counts = {
    hotels: allMarkers.filter((m) => m.layerType === 'hotels').length,
    restaurants: allMarkers.filter((m) => m.layerType === 'restaurants').length,
    attractions: allMarkers.filter((m) => m.layerType === 'attractions').length,
    transportationRoutes: allMarkers.filter((m) => m.layerType === 'transportationRoutes').length,
    savedPlaces: allMarkers.filter((m) => m.layerType === 'savedPlaces').length,
    emergencyFacilities: allMarkers.filter((m) => m.layerType === 'emergencyFacilities').length,
  };

  const activeLayersCount = Object.values(layerFilters).filter(Boolean).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>INTELLIGENT CARTOGRAPHY, OFFLINE NAVIGATION & SOS RESCUE</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-4xl font-bold tracking-tight">
            Cinematic Route Map
          </h1>
          <p className="text-xs text-stone-400">
            Showing <span className="font-bold text-emerald-400 font-mono-num">{visibleMarkers.length}</span> spots across active visibility layers.
          </p>
        </div>

        {/* Quick Offline & Emergency Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Download Offline Map Button */}
          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className={`px-3.5 py-2 rounded-xl text-xs font-mono-num font-semibold transition-all cursor-pointer flex items-center gap-1.5 border shadow-sm ${
              cachedPackage
                ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-600/30'
                : 'bg-black/40 hover:bg-black/60 border-white/10 text-stone-300 hover:text-white'
            }`}
            title="Download offline itinerary route & coordinates for zero-signal areas"
          >
            {cachedPackage ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                <span>Offline Map Cached ({cachedPackage.sizeFormatted})</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Download Offline Map</span>
              </>
            )}
          </button>

          {/* Emergency SOS & Rescue Button */}
          <button
            onClick={() => {
              setRescueHubInitialTab('sos');
              setIsRescueHubOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs font-mono-num font-bold transition-all cursor-pointer flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white shadow-lg animate-pulse active:scale-95"
            title="Trigger Emergency SOS Beacon, Siren, and Rescue Dispatch"
          >
            <Siren className="w-3.5 h-3.5 text-rose-200" />
            <span>Emergency SOS & Rescue</span>
          </button>

          {/* Offline GPS Tracker Button */}
          <button
            onClick={() => {
              setRescueHubInitialTab('tracker');
              setIsRescueHubOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-mono-num font-semibold transition-all cursor-pointer flex items-center gap-1.5 bg-sky-600/20 hover:bg-sky-600/30 border border-sky-400/40 text-sky-300"
            title="Open Offline GPS Tracker & Breadcrumb Trail"
          >
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>GPS Tracker ({breadcrumbs.length})</span>
          </button>
        </div>
      </div>

      {/* Day Filters Sub-bar */}
      <div className="flex items-center justify-between gap-2 flex-wrap border-b border-white/5 pb-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <span className="text-[10px] font-mono-num uppercase text-stone-400 px-2 shrink-0">Filter by Day:</span>
          <button
            onClick={() => setSelectedDay(0)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-medium transition-colors cursor-pointer ${
              selectedDay === 0
                ? 'bg-emerald-600 text-white font-semibold'
                : isDark
                ? 'bg-[#11171C] border border-white/10 text-stone-400 hover:text-white'
                : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
            }`}
          >
            All Route
          </button>
          {Array.from({ length: trip.days?.length || 7 }, (_, i) => i + 1).map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-medium transition-colors cursor-pointer ${
                selectedDay === d
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : isDark
                  ? 'bg-[#11171C] border border-white/10 text-stone-400 hover:text-white'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              Day 0{d}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Layer Visibility Toggle Bar */}
      <div
        className={`p-3 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-3 ${
          isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-300">
          <Filter className="w-3.5 h-3.5 text-emerald-400" />
          <span>Interactive Layer Toggles:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Hotels Toggle */}
          <button
            onClick={() => toggleLayer('hotels')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
              layerFilters.hotels
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm font-semibold'
                : isDark
                ? 'bg-white/5 border-white/10 text-stone-500 hover:text-stone-300'
                : 'bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-700'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            <span>Hotels</span>
            <span className="text-[10px] font-mono-num opacity-80">({counts.hotels})</span>
            {layerFilters.hotels ? <Check className="w-3 h-3 stroke-[3]" /> : <EyeOff className="w-3 h-3 opacity-60" />}
          </button>

          {/* Restaurants Toggle */}
          <button
            onClick={() => toggleLayer('restaurants')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
              layerFilters.restaurants
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm font-semibold'
                : isDark
                ? 'bg-white/5 border-white/10 text-stone-500 hover:text-stone-300'
                : 'bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-700'
            }`}
          >
            <UtensilsCrossed className="w-3.5 h-3.5" />
            <span>Restaurants</span>
            <span className="text-[10px] font-mono-num opacity-80">({counts.restaurants})</span>
            {layerFilters.restaurants ? <Check className="w-3 h-3 stroke-[3]" /> : <EyeOff className="w-3 h-3 opacity-60" />}
          </button>

          {/* Attractions Toggle */}
          <button
            onClick={() => toggleLayer('attractions')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
              layerFilters.attractions
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm font-semibold'
                : isDark
                ? 'bg-white/5 border-white/10 text-stone-500 hover:text-stone-300'
                : 'bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-700'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Attractions</span>
            <span className="text-[10px] font-mono-num opacity-80">({counts.attractions})</span>
            {layerFilters.attractions ? <Check className="w-3 h-3 stroke-[3]" /> : <EyeOff className="w-3 h-3 opacity-60" />}
          </button>

          {/* Transportation Routes Toggle */}
          <button
            onClick={() => toggleLayer('transportationRoutes')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
              layerFilters.transportationRoutes
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm font-semibold'
                : isDark
                ? 'bg-white/5 border-white/10 text-stone-500 hover:text-stone-300'
                : 'bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-700'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span>Transit & Routes</span>
            <span className="text-[10px] font-mono-num opacity-80">({counts.transportationRoutes})</span>
            {layerFilters.transportationRoutes ? <Check className="w-3 h-3 stroke-[3]" /> : <EyeOff className="w-3 h-3 opacity-60" />}
          </button>

          {/* Saved Places Toggle */}
          <button
            onClick={() => toggleLayer('savedPlaces')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
              layerFilters.savedPlaces
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm font-semibold'
                : isDark
                ? 'bg-white/5 border-white/10 text-stone-500 hover:text-stone-300'
                : 'bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-700'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Places</span>
            <span className="text-[10px] font-mono-num opacity-80">({counts.savedPlaces})</span>
            {layerFilters.savedPlaces ? <Check className="w-3 h-3 stroke-[3]" /> : <EyeOff className="w-3 h-3 opacity-60" />}
          </button>

          {/* Emergency Facilities Toggle */}
          <button
            onClick={() => toggleLayer('emergencyFacilities')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${
              layerFilters.emergencyFacilities
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm font-semibold'
                : isDark
                ? 'bg-white/5 border-white/10 text-stone-500 hover:text-stone-300'
                : 'bg-stone-100 border-stone-200 text-stone-400 hover:text-stone-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Emergency & Trauma</span>
            <span className="text-[10px] font-mono-num opacity-80">({counts.emergencyFacilities})</span>
            {layerFilters.emergencyFacilities ? <Check className="w-3 h-3 stroke-[3]" /> : <EyeOff className="w-3 h-3 opacity-60" />}
          </button>
        </div>

        {/* Bulk Actions */}
        <div className="flex items-center gap-2 text-[11px] font-mono-num">
          <button
            onClick={selectAllLayers}
            className="text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer underline underline-offset-2"
          >
            Select All
          </button>
          <span className="text-stone-600">·</span>
          <button
            onClick={deselectAllLayers}
            className="text-stone-400 hover:text-red-400 transition-colors cursor-pointer underline underline-offset-2"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div
        className={`relative rounded-2xl border overflow-hidden transition-all h-[540px] md:h-[620px] select-none ${
          isDark ? 'bg-[#0B0F13] border-white/10' : 'bg-[#E5E9EC] border-stone-300'
        }`}
      >
        {/* Vector Cartography SVG Surface */}
        <svg
          className="w-full h-full cursor-grab active:cursor-grabbing"
          viewBox="0 0 1000 650"
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}
                strokeWidth="1"
              />
            </pattern>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>

          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Landmass Outlines & Geological Landmarks tailored to Active Destination */}
          {(() => {
            const tripTitleLower = trip.title.toLowerCase();
            const destsLower = trip.destinations.map((d) => d.toLowerCase());

            const isKerala = tripTitleLower.includes('kerala') || destsLower.some((d) => d.includes('kochi') || d.includes('munnar') || d.includes('alleppey'));
            const isLadakh = tripTitleLower.includes('ladakh') || destsLower.some((d) => d.includes('leh') || d.includes('nubra') || d.includes('pangong'));
            const isGoa = tripTitleLower.includes('goa') || destsLower.some((d) => d.includes('panaji') || d.includes('palolem') || d.includes('vagator'));
            const isVaranasi = tripTitleLower.includes('varanasi') || destsLower.some((d) => d.includes('kashi') || d.includes('sarnath'));
            const isHimachal = tripTitleLower.includes('himachal') || destsLower.some((d) => d.includes('shimla') || d.includes('manali') || d.includes('dharamshala'));

            if (isKerala) {
              return (
                <>
                  {/* Western Ghats & Coastal Malabar Landmass */}
                  <path
                    d="M 220 100 Q 360 180 340 320 T 310 490 Q 280 580 230 550 T 200 380 Q 180 240 220 100 Z"
                    fill={isDark ? '#141C24' : '#D5DCE2'}
                    stroke={isDark ? '#233240' : '#B8C4CE'}
                    strokeWidth="2"
                  />
                  {/* Vembanad Lagoon & Backwaters Waterway */}
                  <ellipse
                    cx="285"
                    cy="430"
                    rx="45"
                    ry="28"
                    fill={isDark ? '#0B0F13' : '#E5E9EC'}
                    stroke={isDark ? '#1D2A36' : '#A2B3C2'}
                    strokeWidth="1.5"
                  />
                  {/* Arabian Sea Waves Ripple */}
                  <path
                    d="M 160 260 Q 190 280 220 260 T 250 280"
                    fill="none"
                    stroke={isDark ? 'rgba(56, 189, 248, 0.35)' : 'rgba(14, 165, 233, 0.45)'}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  {/* Kerala Regional Labels */}
                  <text x="210" y="160" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    MALABAR COAST · KOCHI SPICE PORT
                  </text>
                  <text x="480" y="240" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    WESTERN GHATS · MUNNAR TEA HIGHLANDS
                  </text>
                  <text x="450" y="380" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    PERIYAR WILDLIFE · THEKKADY RESERVE
                  </text>
                  <text x="180" y="520" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    VEMBANAD LAGOON · ALLEPPEY CANALS
                  </text>
                </>
              );
            }

            if (isLadakh) {
              return (
                <>
                  {/* High Mountain Karakoram & Zanskar Ridge Landmass */}
                  <path
                    d="M 160 220 Q 320 120 540 140 T 820 180 Q 860 310 760 440 T 440 540 Q 280 520 180 410 Z"
                    fill={isDark ? '#141C24' : '#D5DCE2'}
                    stroke={isDark ? '#233240' : '#B8C4CE'}
                    strokeWidth="2"
                  />
                  {/* Pangong Tso Glacial Basin */}
                  <path
                    d="M 680 340 Q 750 310 820 330 T 890 310"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="8"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                  {/* Alpine Pass Contours */}
                  <path
                    d="M 380 210 L 460 170 L 520 220"
                    fill="none"
                    stroke={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)'}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                  {/* Ladakh Regional Labels */}
                  <text x="240" y="310" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    INDUS VALLEY · LEH (3,524m)
                  </text>
                  <text x="360" y="170" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    KHARDUNG LA PASS · 5,359m
                  </text>
                  <text x="560" y="190" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    SHYOK VALLEY · NUBRA HUNDER DUNES
                  </text>
                  <text x="640" y="420" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    GLACIAL BASIN · PANGONG TSO (4,250m)
                  </text>
                </>
              );
            }

            if (isGoa) {
              return (
                <>
                  {/* Konkan Coast Laterite Landmass */}
                  <path
                    d="M 280 140 Q 420 180 400 320 T 360 510 Q 280 540 240 480 T 260 260 Z"
                    fill={isDark ? '#141C24' : '#D5DCE2'}
                    stroke={isDark ? '#233240' : '#B8C4CE'}
                    strokeWidth="2"
                  />
                  {/* Mandovi & Zuari River Estuary */}
                  <path
                    d="M 240 280 Q 320 290 380 270"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="4"
                    className="opacity-60"
                  />
                  {/* Goa Regional Labels */}
                  <text x="260" y="210" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    NORTH GOA · VAGATOR & ASSAGAO
                  </text>
                  <text x="320" y="320" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    CENTRAL GOA · PANAJI & OLD GOA
                  </text>
                  <text x="280" y="460" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    SOUTH GOA · PALOLEM & CABO DE RAMA
                  </text>
                </>
              );
            }

            if (isVaranasi) {
              return (
                <>
                  {/* Sacred Ganga Crescent River Arc */}
                  <path
                    d="M 320 540 Q 460 380 390 210 T 480 110"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="12"
                    strokeLinecap="round"
                    className="opacity-70"
                  />
                  {/* Varanasi Regional Labels */}
                  <text x="440" y="320" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    SACRED GANGA · DASHASHWAMEDH GHAT
                  </text>
                  <text x="220" y="440" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    ANCIENT KASHI · VISHWANATH CORRIDOR
                  </text>
                  <text x="480" y="160" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    SARNATH · DEER PARK & DHAMEK STUPA
                  </text>
                </>
              );
            }

            if (isHimachal) {
              return (
                <>
                  {/* Himachal Alpine Valley Outlines */}
                  <path
                    d="M 180 240 Q 340 140 560 160 T 810 210 Q 760 390 620 480 T 260 460 Z"
                    fill={isDark ? '#141C24' : '#D5DCE2'}
                    stroke={isDark ? '#233240' : '#B8C4CE'}
                    strokeWidth="2"
                  />
                  <text x="260" y="410" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    THE RIDGE · SHIMLA CAPITAL
                  </text>
                  <text x="420" y="280" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    BEAS GORGE · KULLU & MANALI
                  </text>
                  <text x="560" y="190" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    SOLANG GLACIER · ROHTANG CORRIDOR
                  </text>
                  <text x="180" y="290" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    LITTLE LHASA · MCLEOD GANJ & DHARAMSHALA
                  </text>
                </>
              );
            }

            // Default: Rajasthan circuit or generic destination
            const firstD = trip.destinations[0] || 'Destination Region';
            const secondD = trip.destinations[1] || '';
            const thirdD = trip.destinations[2] || '';

            return (
              <>
                {/* Abstract Landmass Outlines */}
                <path
                  d="M 140 180 Q 320 110 520 130 T 820 160 Q 910 240 870 380 T 680 560 Q 520 600 370 540 T 130 400 Q 80 260 140 180 Z"
                  fill={isDark ? '#141C24' : '#D5DCE2'}
                  stroke={isDark ? '#233240' : '#B8C4CE'}
                  strokeWidth="2"
                />

                {/* Lake/Water Body */}
                <ellipse
                  cx="505"
                  cy="495"
                  rx="35"
                  ry="22"
                  fill={isDark ? '#0B0F13' : '#E5E9EC'}
                  stroke={isDark ? '#1D2A36' : '#A2B3C2'}
                  strokeWidth="1.5"
                />

                {/* Geographic Ripple */}
                <path
                  d="M 120 220 Q 180 240 240 210 T 310 230"
                  fill="none"
                  stroke={isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(217, 119, 6, 0.45)'}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                {/* Regional Cultural Area Labels */}
                <text x="680" y="180" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                  {firstD.toUpperCase()} CIRCUIT
                </text>
                {secondD && (
                  <text x="360" y="260" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    {secondD.toUpperCase()} DISTRICT
                  </text>
                )}
                {thirdD && (
                  <text x="110" y="270" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                    {thirdD.toUpperCase()} SECTOR
                  </text>
                )}
                <text x="440" y="550" className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60">
                  HERITAGE CORRIDOR
                </text>
              </>
            );
          })()}

          {/* Highway & Transit Corridor Paths */}
          {layerFilters.transportationRoutes && (
            <>
              {/* Inbound Arterial from Departure Origin to First Destination */}
              <path
                d="M 890 110 Q 780 160 680 220"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
              <text
                x="760"
                y="145"
                className="font-mono-num text-[9px] font-bold fill-sky-400 opacity-90 tracking-wider"
              >
                GATEWAY EXPRESS CORRIDOR
              </text>

              {/* Dynamic Connecting Route between Activity Clusters */}
              <path
                d="M 680 220 Q 520 260 400 320 T 220 300 Q 340 430 480 480"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="3.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            </>
          )}

          {/* GPS Breadcrumb Trail from Offline Tracker */}
          {isBreadcrumbTrailVisible && breadcrumbs.length > 0 && (
            <g className="gps-trail-layer">
              {breadcrumbs.length > 1 && (
                <path
                  d={breadcrumbs
                    .map((b, idx) => {
                      const x = Math.min(880, Math.max(120, Math.round(180 + ((b.lng - 70.8) / 5.2) * 600)));
                      const y = Math.min(580, Math.max(120, Math.round(500 - ((b.lat - 24.5) / 2.6) * 360)));
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                  strokeDasharray="4 2"
                  opacity="0.85"
                />
              )}
              {breadcrumbs.map((b, idx) => {
                const x = Math.min(880, Math.max(120, Math.round(180 + ((b.lng - 70.8) / 5.2) * 600)));
                const y = Math.min(580, Math.max(120, Math.round(500 - ((b.lat - 24.5) / 2.6) * 360)));
                const isLatest = idx === breadcrumbs.length - 1;
                return (
                  <g key={b.id || idx} transform={`translate(${x}, ${y})`}>
                    <circle
                      r={isLatest ? 6 : 2.5}
                      fill={isLatest ? '#38BDF8' : '#7DD3FC'}
                      stroke="#0284C7"
                      strokeWidth="1"
                    />
                    {isLatest && (
                      <circle r="12" fill="none" stroke="#38BDF8" strokeWidth="1.5" className="animate-ping" />
                    )}
                  </g>
                );
              })}
            </g>
          )}

          {/* Render Interactive Marker Pins dynamically */}
          {visibleMarkers.map((marker) => {
            const isSelected = activeMarker?.id === marker.id;

            // Distinct theme colors based on layerType
            let pinColor = '#10B981'; // default emerald
            let ringColor = 'rgba(16, 185, 129, 0.3)';

            if (marker.isOriginGateway) {
              pinColor = '#6366F1'; // vibrant indigo
              ringColor = 'rgba(99, 102, 241, 0.45)';
            } else if (marker.layerType === 'hotels') {
              pinColor = '#F59E0B'; // warm amber
              ringColor = 'rgba(245, 158, 11, 0.35)';
            } else if (marker.layerType === 'restaurants') {
              pinColor = '#F43F5E'; // rose/coral
              ringColor = 'rgba(244, 63, 94, 0.35)';
            } else if (marker.layerType === 'transportationRoutes') {
              pinColor = '#38BDF8'; // sky blue
              ringColor = 'rgba(56, 189, 248, 0.35)';
            } else if (marker.layerType === 'savedPlaces') {
              pinColor = '#A855F7'; // purple
              ringColor = 'rgba(168, 85, 247, 0.35)';
            } else if (marker.layerType === 'emergencyFacilities') {
              pinColor = '#EF4444'; // emergency red
              ringColor = 'rgba(239, 68, 68, 0.45)';
            }

            return (
              <g
                key={marker.id}
                transform={`translate(${marker.coordinates.x}, ${marker.coordinates.y})`}
                onClick={() => setActiveMarker(marker)}
                className="cursor-pointer group"
              >
                {/* Glow ring */}
                <circle
                  r={isSelected ? 18 : 10}
                  className={`transition-all duration-300 ${
                    isSelected ? 'animate-ping' : 'group-hover:scale-125'
                  }`}
                  fill={ringColor}
                  stroke={pinColor}
                  strokeWidth="1.5"
                />
                {/* Center Node */}
                <circle
                  r={isSelected ? 7 : 5}
                  fill={pinColor}
                />

                {/* Layer icon indicator mark */}
                {marker.isSaved && (
                  <circle
                    r="2"
                    cx="0"
                    cy="0"
                    fill="#FFFFFF"
                  />
                )}

                {/* Micro Label */}
                <text
                  x="12"
                  y="4"
                  className={`text-[10px] font-mono-num font-medium transition-colors ${
                    isSelected
                      ? 'fill-white font-bold'
                      : isDark
                      ? 'fill-stone-300 group-hover:fill-white'
                      : 'fill-stone-800'
                  }`}
                >
                  {marker.title.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Empty State Banner if all layers are toggled off */}
        {visibleMarkers.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs p-6 text-center">
            <Layers className="w-10 h-10 text-stone-500 mb-3" />
            <h4 className="font-editorial text-xl font-bold text-white mb-1">
              No Map Layers Selected
            </h4>
            <p className="text-xs text-stone-400 max-w-sm mb-4">
              Toggle hotels, restaurants, attractions, transportation routes, or saved places in the bar above to visualize waypoints.
            </p>
            <button
              onClick={selectAllLayers}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all cursor-pointer"
            >
              Enable All Layers
            </button>
          </div>
        )}

        {/* Map Overlays: Zoom & View Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
            className="p-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
            className="p-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setActiveMarker(null);
            }}
            className="p-2 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-stone-300 hover:text-white transition-colors cursor-pointer"
            title="Reset Map View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Marker Detail Card (Bottom Float) */}
        {activeMarker && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 rounded-xl p-4 bg-stone-950/95 backdrop-blur-md border border-white/15 text-white shadow-2xl space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono-num text-emerald-400 mb-0.5">
                  <span className="uppercase font-bold">{activeMarker.category}</span>
                  {activeMarker.dayNumber > 0 && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>DAY 0{activeMarker.dayNumber}</span>
                    </>
                  )}
                  {activeMarker.time && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span>{activeMarker.time}</span>
                    </>
                  )}
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-300">{activeMarker.city}</span>
                </div>
                <h4 className="font-editorial text-lg font-bold">
                  {activeMarker.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveMarker(null)}
                className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
              {activeMarker.aiNote}
            </p>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs font-mono-num">
              <span className="text-stone-400">
                GPS: {activeMarker.coordinates.lat.toFixed(4)}, {activeMarker.coordinates.lng.toFixed(4)}
              </span>
              <span className="text-emerald-400 font-semibold">
                {activeMarker.cost > 0 ? `₹${activeMarker.cost.toLocaleString('en-IN')}` : 'Included'}
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Legend */}
        <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-4 px-3.5 py-2 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-[11px] font-mono-num text-stone-300">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Hotels</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Restaurants</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Attractions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
            <span>Transit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>Saved</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span>Emergency 24x7</span>
          </div>
        </div>
      </div>

      {/* Offline Status & Cartography Cache Readiness Bar */}
      {cachedPackage ? (
        <div
          className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
            isDark
              ? 'bg-emerald-950/20 border-emerald-500/30 text-stone-200'
              : 'bg-emerald-50 border-emerald-200 text-stone-800'
          }`}
        >
          <div className="flex items-start md:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-num font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Offline Vector Map Ready
                </span>
                <span className="text-xs font-mono-num text-stone-400">
                  {cachedPackage.sizeFormatted} · Saved {cachedPackage.downloadedAt}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-0.5">
                Route cached for <strong>{cachedPackage.destinations.join(' → ')}</strong> with{' '}
                {cachedPackage.waypointsCount} stops and {cachedPackage.cachedFacilitiesCount} emergency facilities. Zero data connection needed.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsBreadcrumbTrailVisible((v) => !v)}
              className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-sky-400 text-xs font-mono-num text-stone-300 hover:text-white transition-colors cursor-pointer bg-black/30 flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              <span>{isBreadcrumbTrailVisible ? 'Hide GPS Trail' : 'Show GPS Trail'}</span>
            </button>

            <button
              onClick={() => setIsOfflineModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono-num font-bold transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Manage Offline Vault</span>
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isDark
              ? 'bg-[#11171C] border-white/10 text-stone-300'
              : 'bg-white border-stone-200 text-stone-800 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <WifiOff className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <strong className="text-white block font-sans-ui">Headed to remote areas without cellular connectivity?</strong>
              <span className="text-stone-400">Download the full itinerary route, vector coordinates, and emergency facilities package for offline use.</span>
            </div>
          </div>
          <button
            onClick={() => setIsOfflineModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono-num font-bold text-xs transition-all shadow-md shrink-0 cursor-pointer flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Offline Map</span>
          </button>
        </div>
      )}

      {/* Emergency Rescue Command Grid: 8 Comprehensive Rescue Types & SOS */}
      <div
        className={`p-5 rounded-3xl border transition-all space-y-4 ${
          isDark
            ? 'bg-gradient-to-b from-[#11171C] to-black border-rose-500/20 shadow-xl'
            : 'bg-white border-stone-200 shadow-lg'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-mono-num text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <span>24x7 COMPREHENSIVE EMERGENCY RESCUE, GPS TRACKER & SOS MATRIX</span>
            </div>
            <h3 className="font-editorial text-xl font-bold text-white flex items-center gap-2">
              <span>Emergency Rescue & Distress Dispatch Hub</span>
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setRescueHubInitialTab('sos');
                setIsRescueHubOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono-num font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer animate-pulse"
            >
              <Siren className="w-3.5 h-3.5" />
              <span>Launch SOS Beacon</span>
            </button>

            <button
              onClick={() => {
                setRescueHubInitialTab('tracker');
                setIsRescueHubOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 border border-sky-400/40 text-sky-200 text-xs font-mono-num font-semibold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Radio className="w-3.5 h-3.5 text-sky-400" />
              <span>Live GPS ({breadcrumbs.length})</span>
            </button>
          </div>
        </div>

        {/* 8 Rescue Type Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
          {/* 1. Medical & Trauma */}
          <button
            onClick={() => {
              setRescueHubInitialTab('directory');
              setIsRescueHubOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-rose-950/30 border border-white/5 hover:border-rose-500/40 text-left transition-all group cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🚑</span>
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 font-bold border border-rose-500/30">
                Dial 108
              </span>
            </div>
            <strong className="text-white block font-editorial text-sm group-hover:text-rose-300 transition-colors">
              Medical & Trauma
            </strong>
            <p className="text-[11px] text-stone-400 leading-snug">
              Apex ICU hospitals & rapid ambulance dispatch.
            </p>
          </button>

          {/* 2. Air Ambulance & Helicopter */}
          <button
            onClick={() => {
              setRescueHubInitialTab('directory');
              setIsRescueHubOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-sky-950/30 border border-white/5 hover:border-sky-500/40 text-left transition-all group cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🚁</span>
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-500/30">
                Dial 1066
              </span>
            </div>
            <strong className="text-white block font-editorial text-sm group-hover:text-sky-300 transition-colors">
              Air Medevac
            </strong>
            <p className="text-[11px] text-stone-400 leading-snug">
              ICU helicopter airlift from remote dunes/passes.
            </p>
          </button>

          {/* 3. Desert & Wilderness SAR */}
          <button
            onClick={() => {
              setRescueHubInitialTab('directory');
              setIsRescueHubOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-amber-950/30 border border-white/5 hover:border-amber-500/40 text-left transition-all group cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🐪</span>
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 font-bold border border-amber-500/30">
                Thar SAR
              </span>
            </div>
            <strong className="text-white block font-editorial text-sm group-hover:text-amber-300 transition-colors">
              Desert Patrol
            </strong>
            <p className="text-[11px] text-stone-400 leading-snug">
              Lost trekker search, camel squad & 4x4 stuck recovery.
            </p>
          </button>

          {/* 4. Highway Breakdown & Towing */}
          <button
            onClick={() => {
              setRescueHubInitialTab('directory');
              setIsRescueHubOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-emerald-950/30 border border-white/5 hover:border-emerald-500/40 text-left transition-all group cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🛣️</span>
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/30">
                Dial 1033
              </span>
            </div>
            <strong className="text-white block font-editorial text-sm group-hover:text-emerald-300 transition-colors">
              Highway 1033
            </strong>
            <p className="text-[11px] text-stone-400 leading-snug">
              NHAI 24x7 towing, tire puncture & fuel breakdown.
            </p>
          </button>

          {/* 5. Police & 112 ERSS */}
          <button
            onClick={() => {
              setRescueHubInitialTab('directory');
              setIsRescueHubOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-blue-950/30 border border-white/5 hover:border-blue-500/40 text-left transition-all group cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">👮</span>
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 font-bold border border-blue-500/30">
                Dial 112
              </span>
            </div>
            <strong className="text-white block font-editorial text-sm group-hover:text-blue-300 transition-colors">
              Unified ERSS
            </strong>
            <p className="text-[11px] text-stone-400 leading-snug">
              Tourist police & automated GPS dispatch coordination.
            </p>
          </button>

          {/* 6. Fire & Disaster NDRF */}
          <button
            onClick={() => {
              setRescueHubInitialTab('directory');
              setIsRescueHubOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-orange-950/30 border border-white/5 hover:border-orange-500/40 text-left transition-all group cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🚒</span>
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-orange-950 text-orange-300 font-bold border border-orange-500/30">
                101 / 1070
              </span>
            </div>
            <strong className="text-white block font-editorial text-sm group-hover:text-orange-300 transition-colors">
              Disaster / Fire
            </strong>
            <p className="text-[11px] text-stone-400 leading-snug">
              Flash floods, structure rescue & SDRF force.
            </p>
          </button>

          {/* 7. Women Safety Sakhi 181 */}
          <button
            onClick={() => {
              setRescueHubInitialTab('directory');
              setIsRescueHubOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-pink-950/30 border border-white/5 hover:border-pink-500/40 text-left transition-all group cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">🚺</span>
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-pink-950 text-pink-300 font-bold border border-pink-500/30">
                1090 / 181
              </span>
            </div>
            <strong className="text-white block font-editorial text-sm group-hover:text-pink-300 transition-colors">
              Women Safety
            </strong>
            <p className="text-[11px] text-stone-400 leading-snug">
              24x7 anti-harassment cell & transit escort.
            </p>
          </button>

          {/* 8. Wilderness Protocols */}
          <button
            onClick={() => {
              setRescueHubInitialTab('protocols');
              setIsRescueHubOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-black/40 hover:bg-purple-950/30 border border-white/5 hover:border-purple-500/40 text-left transition-all group cursor-pointer space-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="text-xl">📖</span>
              <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 font-bold border border-purple-500/30">
                Distress Code
              </span>
            </div>
            <strong className="text-white block font-editorial text-sm group-hover:text-purple-300 transition-colors">
              Distress Protocols
            </strong>
            <p className="text-[11px] text-stone-400 leading-snug">
              3-blast whistle codes, snakebite & air signals.
            </p>
          </button>
        </div>
      </div>

      {/* Offline Map Package Modal */}
      {isOfflineModalOpen && (
        <OfflineMapModal
          trip={trip}
          theme={theme}
          cachedPackage={cachedPackage}
          onPackageUpdated={(pkg) => setCachedPackage(pkg)}
          onClose={() => setIsOfflineModalOpen(false)}
        />
      )}

      {/* Emergency Rescue Command Hub Modal */}
      {isRescueHubOpen && (
        <EmergencyRescueHub
          trip={trip}
          theme={theme}
          onClose={() => setIsRescueHubOpen(false)}
          onViewLocationOnMap={handleViewLocationOnMap}
          initialTab={rescueHubInitialTab}
        />
      )}
    </div>
  );
};
