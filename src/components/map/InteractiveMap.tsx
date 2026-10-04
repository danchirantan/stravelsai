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
  PhoneCall
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
          act.category === 'Relaxation' ||
          act.title.toLowerCase().includes('hotel') ||
          act.title.toLowerCase().includes('haveli') ||
          act.title.toLowerCase().includes('check-in') ||
          act.title.toLowerCase().includes('palace')
        ) {
          layerType = 'hotels';
          cat = 'Hotels';
        }

        const lat = act.coordinates?.lat || 26.9;
        const lng = act.coordinates?.lng || 75.8;

        const x = Math.min(880, Math.max(120, Math.round(180 + ((lng - 70.8) / 5.2) * 600)));
        const y = Math.min(580, Math.max(120, Math.round(500 - ((lat - 24.5) / 2.6) * 360)));

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
      }
    );

    // Map 24x7 Emergency Facilities, Trauma Centers & Desert Camel Patrol Posts
    EMERGENCY_FACILITIES.forEach((fac) => {
      const lat = fac.coordinates.lat;
      const lng = fac.coordinates.lng;
      const x = Math.min(880, Math.max(120, Math.round(180 + ((lng - 70.8) / 5.2) * 600)));
      const y = Math.min(580, Math.max(120, Math.round(500 - ((lat - 24.5) / 2.6) * 360)));

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

          {/* Landmass Outlines & Geological Landmarks */}
          {isIndia ? (
            <>
              {/* Abstract Landmass Outlines for Rajasthan (Jaipur - Jodhpur - Jaisalmer - Udaipur) */}
              <path
                d="M 140 180 Q 320 110 520 130 T 820 160 Q 910 240 870 380 T 680 560 Q 520 600 370 540 T 130 400 Q 80 260 140 180 Z"
                fill={isDark ? '#141C24' : '#D5DCE2'}
                stroke={isDark ? '#233240' : '#B8C4CE'}
                strokeWidth="2"
              />

              {/* Lake Pichola & Fateh Sagar (Udaipur Lake District) */}
              <ellipse
                cx="505"
                cy="495"
                rx="35"
                ry="22"
                fill={isDark ? '#0B0F13' : '#E5E9EC'}
                stroke={isDark ? '#1D2A36' : '#A2B3C2'}
                strokeWidth="1.5"
              />

              {/* Thar Desert Dunes Ripple (Jaisalmer) */}
              <path
                d="M 120 220 Q 180 240 240 210 T 310 230"
                fill="none"
                stroke={isDark ? 'rgba(245, 158, 11, 0.35)' : 'rgba(217, 119, 6, 0.45)'}
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Regional Cultural Area Labels */}
              <text
                x="720"
                y="180"
                className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60"
              >
                DHUNDHAR · JAIPUR PINK CITY
              </text>
              <text
                x="360"
                y="260"
                className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60"
              >
                MARWAR · JODHPUR SUN CITY
              </text>
              <text
                x="110"
                y="270"
                className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60"
              >
                THAR DESERT · JAISALMER
              </text>
              <text
                x="440"
                y="550"
                className="font-editorial text-sm font-bold fill-stone-400 tracking-widest opacity-60"
              >
                MEWAR · UDAIPUR LAKE SANCTUARY
              </text>

              {/* Royal Highway Route Path (Animated Glowing Dashed Line) */}
              {layerFilters.transportationRoutes && (
                <>
                  <path
                    d="M 780 220 Q 590 270 430 320 T 180 280 Q 320 420 510 490"
                    fill="none"
                    stroke="url(#routeGradient)"
                    strokeWidth="3.5"
                    strokeDasharray="6 4"
                    className="animate-pulse"
                  />
                  {/* Highway Connections */}
                  <path
                    d="M 780 220 L 760 200 L 800 240"
                    fill="none"
                    stroke={isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(14, 165, 233, 0.6)'}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                  <path
                    d="M 430 320 L 450 300 L 420 350"
                    fill="none"
                    stroke={isDark ? 'rgba(56, 189, 248, 0.45)' : 'rgba(14, 165, 233, 0.6)'}
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />
                </>
              )}
            </>
          ) : null}

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

            if (marker.layerType === 'hotels') {
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
        </div>
      </div>
    </div>
  );
};
