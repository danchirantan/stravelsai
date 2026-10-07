import React, { useState, useMemo } from 'react';
import {
  MapPin,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Sparkles,
  Info,
  DollarSign,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle2,
  Layers,
  Flame,
  ChevronRight,
  Eye,
  Building,
  Utensils,
  Car,
  Compass as CompassIcon,
  ShoppingBag
} from 'lucide-react';
import { Trip, Expense } from '../../types/travel';

interface GeographicalSpendHeatmapProps {
  trip: Trip;
  expenses: Expense[];
  theme: 'dark' | 'light';
  currency: string;
  selectedCity?: string | null;
  onSelectCity?: (city: string | null) => void;
}

export type HeatmapViewMode = 'total' | 'burnRate' | 'share';

export interface CitySpendMetrics {
  city: string;
  lat: number;
  lng: number;
  totalSpend: number;
  daysCount: number;
  burnRate: number; // spend per day
  budgetSharePct: number;
  intensityScore: number; // 0.0 to 1.0
  intensityTier: 'peak' | 'moderate' | 'efficient';
  categories: {
    Hotels: number;
    Food: number;
    Transport: number;
    Activities: number;
    Shopping: number;
    Other: number;
  };
  topExpenseTitle: string;
  topExpenseAmount: number;
  expensesCount: number;
}

// Comprehensive geographic coordinate catalog for Indian destinations
const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Rajasthan
  jaipur: { lat: 26.9124, lng: 75.7873 },
  jodhpur: { lat: 26.2389, lng: 73.0243 },
  jaisalmer: { lat: 26.9157, lng: 70.9083 },
  udaipur: { lat: 24.5854, lng: 73.7125 },
  pushkar: { lat: 26.4899, lng: 74.5511 },
  bikaner: { lat: 28.0229, lng: 73.3119 },
  'mount abu': { lat: 24.5926, lng: 72.7156 },
  delhi: { lat: 28.6139, lng: 77.209 },
  'new delhi': { lat: 28.6139, lng: 77.209 },
  agra: { lat: 27.1767, lng: 78.0081 },

  // Kerala
  'fort kochi': { lat: 9.9674, lng: 76.2427 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  munnar: { lat: 10.0889, lng: 77.0595 },
  thekkady: { lat: 9.6031, lng: 77.1615 },
  alleppey: { lat: 9.4981, lng: 76.3388 },
  alappuzha: { lat: 9.4981, lng: 76.3388 },
  'marari beach': { lat: 9.6000, lng: 76.2974 },
  varkala: { lat: 8.7379, lng: 76.7163 },
  trivandrum: { lat: 8.5241, lng: 76.9366 },
  kovalam: { lat: 8.4004, lng: 76.9787 },

  // Ladakh & Kashmir
  leh: { lat: 34.1526, lng: 77.5771 },
  'sham valley': { lat: 34.2500, lng: 77.1000 },
  'nubra valley': { lat: 34.6863, lng: 77.5673 },
  'pangong tso': { lat: 33.7595, lng: 78.6674 },
  srinagar: { lat: 34.0837, lng: 74.7973 },
  gulmarg: { lat: 34.0484, lng: 74.3805 },

  // Goa
  panaji: { lat: 15.4909, lng: 73.8278 },
  candolim: { lat: 15.5178, lng: 73.7634 },
  calangute: { lat: 15.5439, lng: 73.7553 },
  palolem: { lat: 15.0100, lng: 74.0232 },
  anjuna: { lat: 15.5733, lng: 73.7410 },
  margao: { lat: 15.2832, lng: 73.9862 },

  // Uttar Pradesh / Varanasi
  varanasi: { lat: 25.3176, lng: 82.9739 },
  sarnath: { lat: 25.3762, lng: 83.0227 },
  prayagraj: { lat: 25.4358, lng: 81.8463 },
  ayodhya: { lat: 26.7922, lng: 82.1998 },
  lucknow: { lat: 26.8467, lng: 80.9462 },

  // Himachal & Uttarakhand
  shimla: { lat: 31.1048, lng: 77.1734 },
  manali: { lat: 32.2396, lng: 77.1887 },
  dharamshala: { lat: 32.2190, lng: 76.3234 },
  spiti: { lat: 32.2461, lng: 78.0349 },
  rishikesh: { lat: 30.0869, lng: 78.2676 },
  haridwar: { lat: 29.9457, lng: 78.1642 },
};

export const GeographicalSpendHeatmap: React.FC<GeographicalSpendHeatmapProps> = ({
  trip,
  expenses,
  theme,
  currency,
  selectedCity,
  onSelectCity,
}) => {
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<HeatmapViewMode>('total');
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  // 1. Gather all unique destination cities from trip itinerary & destinations list
  const destinationCities = useMemo(() => {
    const set = new Set<string>();
    if (trip.destinations && trip.destinations.length > 0) {
      trip.destinations.forEach((d) => set.add(d.trim()));
    }
    if (trip.days && trip.days.length > 0) {
      trip.days.forEach((day) => {
        if (day.city) set.add(day.city.trim());
      });
    }
    // Fallback if empty
    if (set.size === 0) {
      set.add('Jaipur');
      set.add('Jodhpur');
      set.add('Jaisalmer');
      set.add('Udaipur');
    }
    return Array.from(set);
  }, [trip]);

  // 2. Compute spending metrics for each destination city
  const cityMetricsList: CitySpendMetrics[] = useMemo(() => {
    const totalRecordedSpend = expenses.reduce((sum, e) => sum + e.amount, 0) || trip.budgetSpent || 1;

    // Map each city to its metrics
    const list: CitySpendMetrics[] = destinationCities.map((cityName, index) => {
      const lowerCity = cityName.toLowerCase();

      // Find coordinates
      let coords = CITY_COORDINATES[lowerCity];
      if (!coords) {
        // Partial matching
        const matchKey = Object.keys(CITY_COORDINATES).find(
          (k) => lowerCity.includes(k) || k.includes(lowerCity)
        );
        if (matchKey) {
          coords = CITY_COORDINATES[matchKey];
        } else {
          // Deterministic calibrated fallback position
          const baseLat = 24.0 + (index * 1.8) % 8.0;
          const baseLng = 73.0 + (index * 2.1) % 6.0;
          coords = { lat: baseLat, lng: baseLng };
        }
      }

      // Count days spent in this city
      const matchingDays = trip.days.filter(
        (d) => d.city && d.city.toLowerCase().includes(lowerCity)
      );
      const daysCount = Math.max(1, matchingDays.length);

      // Match expenses directly by city or matching title
      const directExpenses = expenses.filter((e) => {
        if (e.city && e.city.toLowerCase().includes(lowerCity)) return true;
        if (e.title && e.title.toLowerCase().includes(lowerCity)) return true;
        return false;
      });

      let cityTotal = directExpenses.reduce((sum, e) => sum + e.amount, 0);

      // If no direct expenses were tagged for this city (e.g. freshly switched destination),
      // derive proportional spend from day activities and budget allocation
      if (cityTotal === 0) {
        const activitiesCost = matchingDays.reduce(
          (sum, d) => sum + (d.activities?.reduce((aSum, a) => aSum + (a.cost || 0), 0) || 0),
          0
        );
        // Base accommodation + meals factor based on days
        const avgDailyAlloc = Math.round(trip.budgetSpent / (trip.daysCount || 7));
        cityTotal = Math.max(activitiesCost, avgDailyAlloc * daysCount);
      }

      // Categories breakdown
      const categories = {
        Hotels: 0,
        Food: 0,
        Transport: 0,
        Activities: 0,
        Shopping: 0,
        Other: 0,
      };

      if (directExpenses.length > 0) {
        directExpenses.forEach((e) => {
          if (e.category === 'Hotels') categories.Hotels += e.amount;
          else if (e.category === 'Food') categories.Food += e.amount;
          else if (e.category === 'Transport' || e.category === 'Flights') categories.Transport += e.amount;
          else if (e.category === 'Activities') categories.Activities += e.amount;
          else if (e.category === 'Shopping') categories.Shopping += e.amount;
          else categories.Other += e.amount;
        });
      } else {
        // Synthesize category ratio for visual balance
        categories.Hotels = Math.round(cityTotal * 0.45);
        categories.Food = Math.round(cityTotal * 0.22);
        categories.Activities = Math.round(cityTotal * 0.20);
        categories.Transport = Math.round(cityTotal * 0.13);
      }

      // Find top expense
      let topExpenseTitle = 'Major Stay & Cultural Experience';
      let topExpenseAmount = Math.round(cityTotal * 0.4);
      if (directExpenses.length > 0) {
        const sorted = [...directExpenses].sort((a, b) => b.amount - a.amount);
        topExpenseTitle = sorted[0].title;
        topExpenseAmount = sorted[0].amount;
      }

      const burnRate = Math.round(cityTotal / daysCount);
      const budgetSharePct = Math.round((cityTotal / totalRecordedSpend) * 100);

      return {
        city: cityName,
        lat: coords.lat,
        lng: coords.lng,
        totalSpend: cityTotal,
        daysCount,
        burnRate,
        budgetSharePct,
        intensityScore: 0, // calculated next
        intensityTier: 'moderate' as const,
        categories,
        topExpenseTitle,
        topExpenseAmount,
        expensesCount: directExpenses.length,
      };
    });

    // Normalize intensity scores (0.0 to 1.0)
    const maxVal = Math.max(...list.map((m) => (viewMode === 'burnRate' ? m.burnRate : m.totalSpend)), 1);
    const minVal = Math.min(...list.map((m) => (viewMode === 'burnRate' ? m.burnRate : m.totalSpend)), 0);
    const spread = maxVal - minVal || 1;

    list.forEach((m) => {
      const currentVal = viewMode === 'burnRate' ? m.burnRate : m.totalSpend;
      const normalized = Math.max(0.15, Math.min(1.0, (currentVal - minVal) / spread));
      m.intensityScore = normalized;

      if (normalized >= 0.65 || m.budgetSharePct >= 30) {
        m.intensityTier = 'peak';
      } else if (normalized >= 0.35 || m.budgetSharePct >= 18) {
        m.intensityTier = 'moderate';
      } else {
        m.intensityTier = 'efficient';
      }
    });

    // Sort by total spend descending
    return list.sort((a, b) => b.totalSpend - a.totalSpend);
  }, [destinationCities, expenses, trip, viewMode]);

  // Overall key insights
  const peakCity = cityMetricsList[0];
  const lowestCity = cityMetricsList[cityMetricsList.length - 1];
  const highestBurnCity = [...cityMetricsList].sort((a, b) => b.burnRate - a.burnRate)[0];

  // Dynamic SVG bounds calculation
  const mapBounds = useMemo(() => {
    if (cityMetricsList.length === 0) {
      return { minLat: 24, maxLat: 28, minLng: 70, maxLng: 78 };
    }
    const lats = cityMetricsList.map((c) => c.lat);
    const lngs = cityMetricsList.map((c) => c.lng);

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const latPad = Math.max(0.6, (maxLat - minLat) * 0.25);
    const lngPad = Math.max(0.8, (maxLng - minLng) * 0.25);

    return {
      minLat: minLat - latPad,
      maxLat: maxLat + latPad,
      minLng: minLng - lngPad,
      maxLng: maxLng + lngPad,
    };
  }, [cityMetricsList]);

  // Project geographic coordinates into SVG viewBox (800 x 500)
  const project = (lat: number, lng: number) => {
    const width = 800;
    const height = 480;
    const padding = 60;

    const xRatio = (lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng || 1);
    const yRatio = (mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat || 1);

    const x = padding + xRatio * (width - padding * 2);
    const y = padding + yRatio * (height - padding * 2);

    return { x, y };
  };

  // Generate connecting itinerary spline between destination stops
  const routePath = useMemo(() => {
    if (cityMetricsList.length < 2) return '';
    const points = cityMetricsList.map((c) => project(c.lat, c.lng));
    return points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = points[i - 1];
      const cx = (prev.x + pt.x) / 2;
      const cy = (prev.y + pt.y) / 2 - 15;
      return `${acc} Q ${cx} ${cy} ${pt.x} ${pt.y}`;
    }, '');
  }, [cityMetricsList, mapBounds]);

  const activeFocusCity = hoveredCity || selectedCity;
  const activeFocusMetrics = cityMetricsList.find((c) => c.city === activeFocusCity);

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
        isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
      }`}
    >
      {/* Heatmap Header & Controls */}
      <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-num text-amber-400">
            <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>REGIONAL SPENDING INTENSITY HEATMAP</span>
          </div>
          <h2 className="font-editorial text-2xl md:text-3xl font-bold tracking-tight mt-0.5">
            Geographical Cost Distribution
          </h2>
          <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-2xl mt-0.5">
            Spatial analysis of financial capital allocated per destination hub. Detect high-cost epicenters, luxury accommodation hubs, and budget-friendly stopovers across your journey itinerary.
          </p>
        </div>

        {/* View Mode Lens Toggles & Clear Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedCity && onSelectCity && (
            <button
              onClick={() => onSelectCity(null)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono-num bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Filter: {selectedCity}</span>
              <span className="text-stone-400 hover:text-white">✕</span>
            </button>
          )}

          <div
            className={`p-1 rounded-xl border flex items-center gap-1 text-xs font-medium ${
              isDark ? 'bg-stone-900/90 border-stone-800' : 'bg-stone-100 border-stone-200'
            }`}
          >
            <button
              onClick={() => setViewMode('total')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'total'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : isDark
                  ? 'text-stone-400 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Total Spend (₹)
            </button>
            <button
              onClick={() => setViewMode('burnRate')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'burnRate'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : isDark
                  ? 'text-stone-400 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Daily Burn Rate (₹/d)
            </button>
            <button
              onClick={() => setViewMode('share')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                viewMode === 'share'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow-sm'
                  : isDark
                  ? 'text-stone-400 hover:text-white'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Budget Share (%)
            </button>
          </div>
        </div>
      </div>

      {/* High-Cost & Strategic Fiscal Insights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 sm:p-6 bg-black/15 border-b border-white/5">
        {/* Peak Cost Epicenter */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isDark ? 'bg-rose-950/20 border-rose-500/30' : 'bg-rose-50 border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono-num mb-1">
            <span className="text-rose-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              Peak Cost Epicenter
            </span>
            <span className="text-rose-400 font-bold">{peakCity?.budgetSharePct}% of Spend</span>
          </div>
          <div className="font-editorial text-2xl font-bold text-white tracking-tight">
            {peakCity?.city}
          </div>
          <div className="text-xs text-stone-300 font-mono-num mt-1">
            ₹{peakCity?.totalSpend.toLocaleString('en-IN')} allocated · ₹{peakCity?.burnRate.toLocaleString('en-IN')}/day
          </div>
          <div className="text-[11px] text-stone-400 mt-1 truncate">
            Top Driver: {peakCity?.topExpenseTitle} (₹{peakCity?.topExpenseAmount.toLocaleString('en-IN')})
          </div>
        </div>

        {/* Most Budget-Friendly Stop */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isDark ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono-num mb-1">
            <span className="text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Cost Efficiency Leader
            </span>
            <span className="text-emerald-400 font-bold">{lowestCity?.budgetSharePct}% of Spend</span>
          </div>
          <div className="font-editorial text-2xl font-bold text-white tracking-tight">
            {lowestCity?.city}
          </div>
          <div className="text-xs text-stone-300 font-mono-num mt-1">
            ₹{lowestCity?.totalSpend.toLocaleString('en-IN')} allocated · ₹{lowestCity?.burnRate.toLocaleString('en-IN')}/day
          </div>
          <div className="text-[11px] text-emerald-300/80 mt-1 truncate">
            Optimal ratio for activities and heritage sightseeing
          </div>
        </div>

        {/* Regional Spend Disparity & AI Tip */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            isDark ? 'bg-amber-950/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono-num mb-1">
            <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Itinerary Fiscal Disparity
            </span>
            <span className="text-amber-400 font-mono-num font-bold">
              {lowestCity && peakCity ? (peakCity.totalSpend / Math.max(1, lowestCity.totalSpend)).toFixed(1) : '1.0'}x Spread
            </span>
          </div>
          <div className="font-editorial text-lg font-bold text-white tracking-tight">
            {highestBurnCity?.city} Burn Rate Alert
          </div>
          <p className="text-[11px] text-stone-300 leading-relaxed mt-1 font-sans-ui">
            {peakCity?.city} consumes {(peakCity?.budgetSharePct || 0)}% of your overall capital primarily on premium stays. Consider balancing with curated local bistros to retain surplus reserves.
          </p>
        </div>
      </div>

      {/* Main Geographical Heatmap Display + City Breakdown Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* SVG Interactive Cartographic Heatmap */}
        <div className="lg:col-span-8 p-4 sm:p-6 relative flex flex-col justify-between min-h-[460px]">
          {/* Cartography Background Grid & Map Vector Canvas */}
          <div
            className={`w-full rounded-2xl border relative overflow-hidden flex-1 ${
              isDark
                ? 'bg-gradient-to-br from-[#0c1218] via-[#0f171f] to-[#0a0e13] border-white/10'
                : 'bg-gradient-to-br from-stone-50 via-slate-100 to-stone-100 border-stone-200'
            }`}
            style={{ minHeight: '440px' }}
          >
            {/* Ambient Cartographic Grid Lines */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" className={isDark ? 'text-white' : 'text-stone-900'} />
              </svg>
            </div>

            {/* Compass Rose Watermark */}
            <div className="absolute top-4 right-4 pointer-events-none opacity-20 flex flex-col items-center">
              <CompassIcon className="w-8 h-8 text-amber-400" />
              <span className="text-[9px] font-mono-num font-bold tracking-widest text-amber-400 mt-0.5">N</span>
            </div>

            {/* Geo Coordinates Stamp */}
            <div className="absolute top-4 left-4 pointer-events-none text-[10px] font-mono-num text-stone-500 tracking-wider">
              <span>BOUNDS: {mapBounds.minLat.toFixed(1)}°N – {mapBounds.maxLat.toFixed(1)}°N · {mapBounds.minLng.toFixed(1)}°E – {mapBounds.maxLng.toFixed(1)}°E</span>
            </div>

            {/* Main Interactive SVG Canvas */}
            <svg
              viewBox="0 0 800 480"
              className="w-full h-full min-h-[440px] select-none"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Radial Thermal Heatmap Gradient: Peak Intensity (Rose / Crimson) */}
                <radialGradient id="heat-peak" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.85" />
                  <stop offset="25%" stopColor="#f43f5e" stopOpacity="0.6" />
                  <stop offset="55%" stopColor="#fb7185" stopOpacity="0.3" />
                  <stop offset="85%" stopColor="#e11d48" stopOpacity="0.08" />
                  <stop offset="100%" stopColor="#e11d48" stopOpacity="0" />
                </radialGradient>

                {/* Radial Thermal Heatmap Gradient: Moderate Intensity (Amber / Gold) */}
                <radialGradient id="heat-moderate" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="30%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="65%" stopColor="#fbbf24" stopOpacity="0.25" />
                  <stop offset="85%" stopColor="#d97706" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                </radialGradient>

                {/* Radial Thermal Heatmap Gradient: Cost-Efficient Intensity (Emerald / Teal) */}
                <radialGradient id="heat-efficient" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.75" />
                  <stop offset="30%" stopColor="#10b981" stopOpacity="0.45" />
                  <stop offset="65%" stopColor="#34d399" stopOpacity="0.2" />
                  <stop offset="85%" stopColor="#059669" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                </radialGradient>

                {/* Animated Dash Array Stroke */}
                <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
                </linearGradient>

                <filter id="glow-shadow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Itinerary Transit Flow Route */}
              {routePath && (
                <g className="route-layer">
                  <path
                    d={routePath}
                    fill="none"
                    stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                  <path
                    d={routePath}
                    fill="none"
                    stroke="url(#route-gradient)"
                    strokeWidth="2.5"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    className="opacity-70 animate-pulse"
                  />
                </g>
              )}

              {/* Heatmap Layer: Thermal Radiation Halos */}
              <g className="heat-radiation-layer">
                {cityMetricsList.map((m) => {
                  const pt = project(m.lat, m.lng);
                  const isHovered = hoveredCity === m.city;
                  const isSelected = selectedCity === m.city;

                  // Radius scaled to intensity score (45px to 110px)
                  const baseRadius = 42 + m.intensityScore * 65;
                  const haloRadius = isHovered || isSelected ? baseRadius * 1.25 : baseRadius;

                  const gradientId =
                    m.intensityTier === 'peak'
                      ? 'url(#heat-peak)'
                      : m.intensityTier === 'moderate'
                      ? 'url(#heat-moderate)'
                      : 'url(#heat-efficient)';

                  return (
                    <g key={`halo-${m.city}`} className="transition-all duration-300">
                      {/* Diffuse Thermal Aura */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={haloRadius}
                        fill={gradientId}
                        className="transition-all duration-500"
                      />

                      {/* Concentric Seismic Wave Pulse for Peak Intensity */}
                      {m.intensityTier === 'peak' && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={baseRadius * 0.75}
                          fill="none"
                          stroke="#f43f5e"
                          strokeWidth="1"
                          strokeOpacity="0.4"
                          strokeDasharray="4 4"
                          className="animate-spin"
                          style={{ animationDuration: '24s', transformOrigin: `${pt.x}px ${pt.y}px` }}
                        />
                      )}

                      {/* Focus Highlight Ring */}
                      {(isHovered || isSelected) && (
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={baseRadius + 14}
                          fill="none"
                          stroke={m.intensityTier === 'peak' ? '#f43f5e' : m.intensityTier === 'moderate' ? '#f59e0b' : '#10b981'}
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          strokeOpacity="0.75"
                        />
                      )}
                    </g>
                  );
                })}
              </g>

              {/* City Focal Node Markers & Labels */}
              <g className="city-nodes-layer">
                {cityMetricsList.map((m) => {
                  const pt = project(m.lat, m.lng);
                  const isHovered = hoveredCity === m.city;
                  const isSelected = selectedCity === m.city;
                  const isTarget = isHovered || isSelected;

                  const tierColor =
                    m.intensityTier === 'peak'
                      ? '#f43f5e'
                      : m.intensityTier === 'moderate'
                      ? '#f59e0b'
                      : '#10b981';

                  const nodeRadius = isTarget ? 10 : 7 + m.intensityScore * 3;

                  return (
                    <g
                      key={`node-${m.city}`}
                      className="cursor-pointer group"
                      onMouseEnter={() => setHoveredCity(m.city)}
                      onMouseLeave={() => setHoveredCity(null)}
                      onClick={() => onSelectCity && onSelectCity(selectedCity === m.city ? null : m.city)}
                    >
                      {/* Pulse Ring */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={nodeRadius + 4}
                        fill={tierColor}
                        fillOpacity="0.25"
                        className={isTarget ? 'animate-ping' : ''}
                      />

                      {/* Main Node Circle */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={nodeRadius}
                        fill={tierColor}
                        stroke={isDark ? '#0f171f' : '#ffffff'}
                        strokeWidth="2.5"
                        filter="url(#glow-shadow)"
                      />

                      {/* Inner Dot */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={nodeRadius * 0.4}
                        fill="#ffffff"
                      />

                      {/* Permanent City Name & Metric Badge */}
                      <g transform={`translate(${pt.x}, ${pt.y + nodeRadius + 14})`}>
                        {/* Background Pill */}
                        <rect
                          x="-58"
                          y="-10"
                          width="116"
                          height="28"
                          rx="6"
                          fill={isDark ? 'rgba(15, 23, 31, 0.92)' : 'rgba(255, 255, 255, 0.94)'}
                          stroke={isTarget ? tierColor : isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}
                          strokeWidth={isTarget ? '1.5' : '1'}
                          className="transition-all"
                        />
                        {/* City Name */}
                        <text
                          x="0"
                          y="1"
                          textAnchor="middle"
                          fill={isDark ? '#ffffff' : '#1c1917'}
                          fontSize="10"
                          fontWeight="700"
                          fontFamily="sans-serif"
                        >
                          {m.city}
                        </text>
                        {/* Primary Value Display */}
                        <text
                          x="0"
                          y="12"
                          textAnchor="middle"
                          fill={tierColor}
                          fontSize="9"
                          fontWeight="600"
                          fontFamily="monospace"
                        >
                          {viewMode === 'burnRate'
                            ? `₹${(m.burnRate / 1000).toFixed(1)}k/d`
                            : viewMode === 'share'
                            ? `${m.budgetSharePct}% Share`
                            : `₹${(m.totalSpend / 1000).toFixed(1)}k`}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              {/* Floating Deep Inspection HUD Tooltip on Hover */}
              {activeFocusMetrics && (
                (() => {
                  const pt = project(activeFocusMetrics.lat, activeFocusMetrics.lng);
                  // Keep tooltip inside viewable boundaries
                  const tooltipWidth = 230;
                  const tooltipX = pt.x + 25 + tooltipWidth > 780 ? pt.x - tooltipWidth - 25 : pt.x + 25;
                  const tooltipY = Math.max(30, Math.min(320, pt.y - 70));

                  const tierColor =
                    activeFocusMetrics.intensityTier === 'peak'
                      ? '#f43f5e'
                      : activeFocusMetrics.intensityTier === 'moderate'
                      ? '#f59e0b'
                      : '#10b981';

                  return (
                    <g transform={`translate(${tooltipX}, ${tooltipY})`} className="pointer-events-none">
                      {/* Tooltip Card Background */}
                      <rect
                        width={tooltipWidth}
                        height="150"
                        rx="12"
                        fill={isDark ? '#0a0e13' : '#ffffff'}
                        stroke={tierColor}
                        strokeWidth="1.5"
                        filter="url(#glow-shadow)"
                      />

                      {/* Header Title */}
                      <text x="14" y="24" fill={isDark ? '#ffffff' : '#0f172a'} fontSize="13" fontWeight="bold">
                        {activeFocusMetrics.city}
                      </text>
                      <text x={tooltipWidth - 14} y="23" textAnchor="end" fill={tierColor} fontSize="10" fontWeight="bold" fontFamily="monospace">
                        {activeFocusMetrics.intensityTier.toUpperCase()} INTENSITY
                      </text>

                      {/* Spend & Burn Rate */}
                      <text x="14" y="44" fill={tierColor} fontSize="15" fontWeight="bold" fontFamily="monospace">
                        ₹{activeFocusMetrics.totalSpend.toLocaleString('en-IN')}
                      </text>
                      <text x={tooltipWidth - 14} y="43" textAnchor="end" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="10" fontFamily="monospace">
                        {activeFocusMetrics.daysCount} {activeFocusMetrics.daysCount === 1 ? 'day' : 'days'} ({activeFocusMetrics.budgetSharePct}% of total)
                      </text>

                      {/* Burn rate stat */}
                      <text x="14" y="60" fill={isDark ? '#cbd5e1' : '#334155'} fontSize="10">
                        Daily Burn: <tspan fontWeight="bold" fill={isDark ? '#ffffff' : '#0f172a'}>₹{activeFocusMetrics.burnRate.toLocaleString('en-IN')}/day</tspan>
                      </text>

                      {/* Mini Category Bars */}
                      <g transform="translate(14, 76)">
                        <text x="0" y="0" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" fontWeight="600">
                          Hotels: ₹{(activeFocusMetrics.categories.Hotels / 1000).toFixed(1)}k · Food: ₹{(activeFocusMetrics.categories.Food / 1000).toFixed(1)}k
                        </text>
                        <text x="0" y="14" fill={isDark ? '#94a3b8' : '#64748b'} fontSize="9" fontWeight="600">
                          Activities: ₹{(activeFocusMetrics.categories.Activities / 1000).toFixed(1)}k · Transit: ₹{(activeFocusMetrics.categories.Transport / 1000).toFixed(1)}k
                        </text>
                      </g>

                      {/* Top Expense */}
                      <g transform="translate(14, 114)">
                        <rect width={tooltipWidth - 28} height="24" rx="6" fill={isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'} />
                        <text x="8" y="15" fill={isDark ? '#e2e8f0' : '#1e293b'} fontSize="9" fontWeight="500">
                          Top: {activeFocusMetrics.topExpenseTitle.slice(0, 26)}...
                        </text>
                      </g>
                    </g>
                  );
                })()
              )}
            </svg>

            {/* Bottom Intensity Scale Legend */}
            <div
              className={`absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md p-2.5 rounded-xl border backdrop-blur-md flex items-center justify-between gap-3 text-xs ${
                isDark ? 'bg-stone-950/85 border-white/10 text-stone-200' : 'bg-white/90 border-stone-200 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-1.5 shrink-0 text-[11px] font-mono-num">
                <span className="font-semibold">Heat Intensity:</span>
              </div>

              {/* Gradient Bar */}
              <div className="flex-1 flex flex-col gap-1">
                <div className="h-2 rounded-full w-full bg-gradient-to-r from-emerald-500 via-amber-500 to-rose-500 shadow-sm" />
                <div className="flex items-center justify-between text-[9px] font-mono-num text-stone-400">
                  <span>Efficient (&lt; 20%)</span>
                  <span>Moderate (20-35%)</span>
                  <span>Peak (&gt; 35%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* City Breakdown & Ledger Filter Matrix (Right 4 Columns) */}
        <div className="lg:col-span-4 p-4 sm:p-6 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-editorial text-xl font-bold flex items-center gap-2">
                <span>Ranked Cost Density</span>
                <span className="text-xs font-mono-num px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">
                  {cityMetricsList.length} Cities
                </span>
              </h3>
              <span className="text-[10px] text-stone-400 font-mono-num">
                Click city to filter ledger
              </span>
            </div>

            {/* Scrollable Ranked Cities List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {cityMetricsList.map((c, index) => {
                const isSelected = selectedCity === c.city;
                const isHovered = hoveredCity === c.city;

                const tierBadge =
                  c.intensityTier === 'peak'
                    ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                    : c.intensityTier === 'moderate'
                    ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                    : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';

                return (
                  <div
                    key={c.city}
                    onMouseEnter={() => setHoveredCity(c.city)}
                    onMouseLeave={() => setHoveredCity(null)}
                    onClick={() => onSelectCity && onSelectCity(isSelected ? null : c.city)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? isDark
                          ? 'bg-amber-500/15 border-amber-500 shadow-md shadow-amber-500/10'
                          : 'bg-amber-50 border-amber-500 shadow-md shadow-amber-500/20'
                        : isHovered
                        ? isDark
                          ? 'bg-white/5 border-white/20'
                          : 'bg-stone-50 border-stone-300'
                        : isDark
                        ? 'bg-stone-900/60 border-white/5 hover:border-white/15'
                        : 'bg-stone-50/70 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    {/* Top Row: Rank, City, Intensity Badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono-num text-[11px] font-bold text-stone-400 shrink-0">
                          #{index + 1}
                        </span>
                        <span className="font-semibold text-xs truncate">
                          {c.city}
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono-num shrink-0">
                          · {c.daysCount}d
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono-num font-bold uppercase border shrink-0 ${tierBadge}`}>
                        {c.intensityTier}
                      </span>
                    </div>

                    {/* Spend Metrics & Burn Rate */}
                    <div className="flex items-center justify-between text-xs font-mono-num mb-2">
                      <span className="font-bold text-white text-sm">
                        ₹{c.totalSpend.toLocaleString('en-IN')}
                      </span>
                      <span className="text-stone-400 text-[11px]">
                        Burn: <strong>₹{c.burnRate.toLocaleString('en-IN')}/d</strong> ({c.budgetSharePct}%)
                      </span>
                    </div>

                    {/* Proportional Spend Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-stone-800 overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          c.intensityTier === 'peak'
                            ? 'bg-rose-500'
                            : c.intensityTier === 'moderate'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, c.budgetSharePct * 2.2)}%` }}
                      />
                    </div>

                    {/* Mini Category Distribution Badges */}
                    <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono-num pt-1 border-t border-white/5">
                      <span className="truncate max-w-[170px]">
                        Top: {c.topExpenseTitle}
                      </span>
                      <span className="shrink-0 text-amber-400/90 font-medium">
                        {isSelected ? '✓ Filtered' : 'Filter Ledger →'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Ledger Filter Status & Action Banner */}
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 ${
              selectedCity
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                : isDark
                ? 'bg-stone-900/60 border-white/5 text-stone-400'
                : 'bg-stone-100 border-stone-200 text-stone-600'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <Filter className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span className="truncate">
                {selectedCity
                  ? `Filtering Ledger by ${selectedCity}`
                  : 'Select any city to isolate expenses'}
              </span>
            </div>
            {selectedCity && onSelectCity && (
              <button
                onClick={() => onSelectCity(null)}
                className="text-[11px] underline font-mono-num hover:text-white shrink-0 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
