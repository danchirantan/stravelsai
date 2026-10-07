import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  CloudRain,
  Sun,
  Thermometer,
  Wind,
  ShieldAlert,
  Plus,
  Check,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Luggage,
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  Layers,
  Info,
  Zap,
  Flame,
  Umbrella,
  Eye,
  Camera,
  Shirt,
  HeartPulse,
  FileText
} from 'lucide-react';
import { Trip, DestinationWeather, Activity } from '../../types/travel';
import { PackingItem, ItemCategory, ItemPriority } from '../../types/packing';

interface AiPackingAssistantProps {
  trip?: Trip;
  effectiveWeather: DestinationWeather;
  selectedWeatherCity: string;
  existingItems: PackingItem[];
  onAddItems: (items: Omit<PackingItem, 'id' | 'packed'>[]) => void;
  theme: 'dark' | 'light';
  onToast?: (message: string) => void;
}

export type TravelVibe = 'balanced' | 'ultralight' | 'luxury' | 'photo';

export interface AiSuggestedItem {
  id: string;
  name: string;
  category: ItemCategory;
  priority: ItemPriority;
  quantity: number;
  weightGrams: number;
  aiReason: string;
  triggerType: 'weather' | 'activity' | 'culture' | 'duration';
  destinationCity: string;
}

export const AiPackingAssistant: React.FC<AiPackingAssistantProps> = ({
  trip,
  effectiveWeather,
  selectedWeatherCity,
  existingItems,
  onAddItems,
  theme,
  onToast,
}) => {
  const isDark = theme === 'dark';

  const [travelVibe, setTravelVibe] = useState<TravelVibe>('balanced');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [selectedFocusCity, setSelectedFocusCity] = useState<string>('all');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [analysisTimestamp, setAnalysisTimestamp] = useState<string>('Just now');

  // Trigger simulated AI re-analysis
  const handleReAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisTimestamp(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      if (onToast) {
        onToast('✨ AI Packing Assistant re-analyzed trip itinerary and weather radar!');
      }
    }, 700);
  };

  // Extract all unique destination cities from trip
  const destinationList = useMemo(() => {
    const set = new Set<string>();
    if (trip?.destinations && trip.destinations.length > 0) {
      trip.destinations.forEach((d) => set.add(d.trim()));
    }
    if (trip?.days && trip.days.length > 0) {
      trip.days.forEach((day) => {
        if (day.city) set.add(day.city.trim());
      });
    }
    if (set.size === 0) set.add(selectedWeatherCity);
    return Array.from(set);
  }, [trip, selectedWeatherCity]);

  // Aggregate all activities across trip days
  const allActivities: { activity: Activity; city: string; dayNumber: number }[] = useMemo(() => {
    if (!trip?.days) return [];
    const list: { activity: Activity; city: string; dayNumber: number }[] = [];
    trip.days.forEach((day) => {
      const city = day.city || selectedWeatherCity;
      day.activities?.forEach((act) => {
        list.push({ activity: act, city, dayNumber: day.dayNumber });
      });
    });
    return list;
  }, [trip, selectedWeatherCity]);

  // Dynamic Rule & Heuristics Engine for Generating Personalized Gear
  const aiRecommendations: AiSuggestedItem[] = useMemo(() => {
    const items: AiSuggestedItem[] = [];
    const temp = effectiveWeather.current.temp;
    const isRainy = effectiveWeather.current.rainProbability >= 40 || effectiveWeather.current.precipitation > 0;
    const isHot = temp >= 32;
    const isCold = temp <= 16;
    const isWindy = effectiveWeather.current.windSpeed >= 25;
    const daysCount = trip?.daysCount || trip?.days?.length || 7;

    const currentCity = selectedFocusCity === 'all' ? selectedWeatherCity : selectedFocusCity;
    const cityLower = currentCity.toLowerCase();

    // 1. Weather-Driven Gear
    if (isRainy) {
      items.push({
        id: 'ai-rain-umbrella',
        name: 'Storm-Resistant Windproof Compact Umbrella',
        category: 'gear',
        priority: 'essential',
        quantity: 1,
        weightGrams: 280,
        aiReason: `High precipitation probability (${effectiveWeather.current.rainProbability}%) detected in ${selectedWeatherCity}. Required for open-air walking tours.`,
        triggerType: 'weather',
        destinationCity: selectedWeatherCity,
      });

      items.push({
        id: 'ai-rain-poncho',
        name: 'Ultra-Light Breathable Ripstop Rain Shell / Poncho',
        category: 'clothing',
        priority: 'essential',
        quantity: 1,
        weightGrams: 220,
        aiReason: `Protects your daypack and clothing during torrential tropical showers.`,
        triggerType: 'weather',
        destinationCity: selectedWeatherCity,
      });

      items.push({
        id: 'ai-rain-shoe-covers',
        name: 'Waterproof Silicone Shoe Covers',
        category: 'clothing',
        priority: 'recommended',
        quantity: 1,
        weightGrams: 140,
        aiReason: `Prevents soaked footwear in waterlogged bazaars and heritage stone alleyways.`,
        triggerType: 'weather',
        destinationCity: selectedWeatherCity,
      });
    }

    if (isHot) {
      items.push({
        id: 'ai-heat-electrolytes',
        name: 'Hydration Electrolyte Replacement Packs (Pack of 10)',
        category: 'medical',
        priority: 'essential',
        quantity: 1,
        weightGrams: 100,
        aiReason: `Combat peak daytime heat (${temp}°C) and arid dehydration during extensive walking itineraries.`,
        triggerType: 'weather',
        destinationCity: selectedWeatherCity,
      });

      items.push({
        id: 'ai-heat-sunscreen',
        name: 'Broad-Spectrum Mineral Sunscreen SPF 50+ PA++++',
        category: 'toiletries',
        priority: 'essential',
        quantity: 1,
        weightGrams: 150,
        aiReason: `Critical protection under intense tropical UV index at open palace courtyards.`,
        triggerType: 'weather',
        destinationCity: selectedWeatherCity,
      });

      items.push({
        id: 'ai-heat-hat',
        name: 'Foldable Wide-Brim UV Safari Sun Hat with Chin Strap',
        category: 'clothing',
        priority: 'essential',
        quantity: 1,
        weightGrams: 120,
        aiReason: `360-degree shade protection against desert and coastal heat exposure.`,
        triggerType: 'weather',
        destinationCity: selectedWeatherCity,
      });
    }

    if (isCold) {
      items.push({
        id: 'ai-cold-merino',
        name: 'Merino Wool 200g Thermal Base Layer Top & Bottom',
        category: 'clothing',
        priority: 'essential',
        quantity: 1,
        weightGrams: 350,
        aiReason: `Evening temperature plunges to ${temp}°C in ${selectedWeatherCity}. Essential for stargazing and dusk strolls.`,
        triggerType: 'weather',
        destinationCity: selectedWeatherCity,
      });

      items.push({
        id: 'ai-cold-windbreaker',
        name: 'Packable Down Puffer / Windbreaker Jacket',
        category: 'clothing',
        priority: 'essential',
        quantity: 1,
        weightGrams: 320,
        aiReason: `Lightweight compressible thermal core layer for brisk morning departures.`,
        triggerType: 'weather',
        destinationCity: selectedWeatherCity,
      });
    }

    if (isWindy || cityLower.includes('jaisalmer') || cityLower.includes('desert') || cityLower.includes('leh')) {
      items.push({
        id: 'ai-wind-buff',
        name: 'Seamless Dustproof Microfiber Desert Scarf / Neck Buff',
        category: 'clothing',
        priority: 'essential',
        quantity: 1,
        weightGrams: 60,
        aiReason: `Guards airways and face against high winds (${effectiveWeather.current.windSpeed} km/h) and fine sand grit.`,
        triggerType: 'weather',
        destinationCity: currentCity,
      });

      items.push({
        id: 'ai-wind-pouches',
        name: 'Airtight Dust-Seal Ziplock Electronics & Camera Pouches',
        category: 'gear',
        priority: 'recommended',
        quantity: 1,
        weightGrams: 40,
        aiReason: `Prevents sand dust and particulate grit from penetrating mobile ports and camera sensors.`,
        triggerType: 'weather',
        destinationCity: currentCity,
      });
    }

    // 2. Itinerary Activity-Driven Gear
    const activitiesText = allActivities.map((a) => a.activity.title + ' ' + (a.activity.aiReason || '')).join(' ').toLowerCase();

    // Sacred Temples, Ghats, & Shrine Walks
    if (
      activitiesText.includes('temple') ||
      activitiesText.includes('ghat') ||
      activitiesText.includes('aarti') ||
      activitiesText.includes('mosque') ||
      activitiesText.includes('shrine') ||
      activitiesText.includes('gurudwara') ||
      cityLower.includes('varanasi') ||
      cityLower.includes('pushkar')
    ) {
      items.push({
        id: 'ai-act-temple-wrap',
        name: 'Lightweight Cotton Modesty Shawl / Dupatta Wrap',
        category: 'clothing',
        priority: 'essential',
        quantity: 1,
        weightGrams: 110,
        aiReason: `Mandatory respectful coverage for head and shoulders at sacred shrines, ghats, and historical sanctuaries.`,
        triggerType: 'culture',
        destinationCity: 'Sacred Corridors',
      });

      items.push({
        id: 'ai-act-slipon-shoes',
        name: 'Breathable Easy Slip-On Walking Loafers / Sandals',
        category: 'clothing',
        priority: 'recommended',
        quantity: 1,
        weightGrams: 420,
        aiReason: `Streamlines repeated barefoot transitions at temple entrances with stone courtyard heat protection.`,
        triggerType: 'activity',
        destinationCity: 'Sacred Corridors',
      });

      items.push({
        id: 'ai-act-wipes',
        name: 'Alcohol-Free Antimicrobial Sanitizing Wet Wipes',
        category: 'toiletries',
        priority: 'recommended',
        quantity: 2,
        weightGrams: 90,
        aiReason: `Quick hygienic foot cleaning after barefoot temple circumambulations.`,
        triggerType: 'activity',
        destinationCity: 'Sacred Corridors',
      });
    }

    // Desert Safaris, Glamping & Dunes
    if (
      activitiesText.includes('desert') ||
      activitiesText.includes('safari') ||
      activitiesText.includes('dunes') ||
      activitiesText.includes('camel') ||
      cityLower.includes('jaisalmer')
    ) {
      items.push({
        id: 'ai-act-sunglasses',
        name: 'Polarized UV400 Anti-Glare Wraparound Sunglasses',
        category: 'gear',
        priority: 'essential',
        quantity: 1,
        weightGrams: 80,
        aiReason: `Cuts blinding desert albedo reflections during afternoon dune safaris.`,
        triggerType: 'activity',
        destinationCity: 'Thar Desert / Jaisalmer',
      });

      items.push({
        id: 'ai-act-lipbalm',
        name: 'Medicated SPF 30 Moisturizing Beeswax Lip Balm',
        category: 'toiletries',
        priority: 'recommended',
        quantity: 1,
        weightGrams: 25,
        aiReason: `Prevents severe dry-lip chapping caused by arid desert winds.`,
        triggerType: 'weather',
        destinationCity: 'Thar Desert / Jaisalmer',
      });
    }

    // Water, Boating, Backwaters, & Lakes (Kerala / Udaipur / Goa)
    if (
      activitiesText.includes('boat') ||
      activitiesText.includes('lake') ||
      activitiesText.includes('backwater') ||
      activitiesText.includes('beach') ||
      activitiesText.includes('island') ||
      cityLower.includes('udaipur') ||
      cityLower.includes('alleppey') ||
      cityLower.includes('kochi') ||
      cityLower.includes('goa')
    ) {
      items.push({
        id: 'ai-act-drybag',
        name: '15L Heavy-Duty Waterproof Roll-Top Dry Bag',
        category: 'gear',
        priority: 'essential',
        quantity: 1,
        weightGrams: 240,
        aiReason: `Shields electronics, passports, and valuables during lake ferry crossings and kettuvallam canal cruises.`,
        triggerType: 'activity',
        destinationCity: 'Waterway Corridors',
      });

      items.push({
        id: 'ai-act-mosquito-repellent',
        name: 'DEET / Odomos Botanical Long-Lasting Mosquito Cream',
        category: 'medical',
        priority: 'essential',
        quantity: 1,
        weightGrams: 120,
        aiReason: `High-efficacy mosquito shielding during dusk waterside strolls and tropical canal navigation.`,
        triggerType: 'weather',
        destinationCity: 'Waterway Corridors',
      });

      items.push({
        id: 'ai-act-quickdry-towel',
        name: 'Compact Microfiber Quick-Dry Pack Towel',
        category: 'gear',
        priority: 'recommended',
        quantity: 1,
        weightGrams: 160,
        aiReason: `Absorbs 4x its weight and dries in minutes after boat spray or spontaneous lake dips.`,
        triggerType: 'activity',
        destinationCity: 'Waterway Corridors',
      });
    }

    // High Altitude / Treks / Mountains (Ladakh / Himachal)
    if (
      activitiesText.includes('pass') ||
      activitiesText.includes('trek') ||
      activitiesText.includes('altitude') ||
      activitiesText.includes('khardung') ||
      activitiesText.includes('himalaya') ||
      cityLower.includes('leh') ||
      cityLower.includes('nubra') ||
      cityLower.includes('shimla') ||
      cityLower.includes('manali')
    ) {
      items.push({
        id: 'ai-act-altitude-pulse-oximeter',
        name: 'Fingertip Pulse Oximeter & Diamox Acclimatization Kit',
        category: 'medical',
        priority: 'essential',
        quantity: 1,
        weightGrams: 110,
        aiReason: `Monitors blood oxygen saturation at high-altitude passes exceeding 11,000 ft.`,
        triggerType: 'activity',
        destinationCity: 'High Altitude Zone',
      });

      items.push({
        id: 'ai-act-trek-socks',
        name: 'Cushioned Anti-Blister Merino Wool Hiking Socks (2 Pairs)',
        category: 'clothing',
        priority: 'essential',
        quantity: 2,
        weightGrams: 180,
        aiReason: `Impact cushioning and moisture wicking on steep rocky gompa trails.`,
        triggerType: 'activity',
        destinationCity: 'High Altitude Zone',
      });
    }

    // 3. Travel Vibe Adaptations
    if (travelVibe === 'photo') {
      items.push({
        id: 'ai-vibe-powerbank',
        name: '20,000mAh 65W High-Capacity Fast-Charge Power Bank',
        category: 'electronics',
        priority: 'essential',
        quantity: 1,
        weightGrams: 390,
        aiReason: `Keeps high-drain mirrorless cameras, phones, and GPS devices powered during 12-hour day tours.`,
        triggerType: 'duration',
        destinationCity: 'All Destinations',
      });

      items.push({
        id: 'ai-vibe-lens-cloth',
        name: 'Air Blower Bulb & Microfiber Optics Cleaning Kit',
        category: 'gear',
        priority: 'recommended',
        quantity: 1,
        weightGrams: 85,
        aiReason: `Cleans dust and condensation off camera lenses without scratching delicate coatings.`,
        triggerType: 'activity',
        destinationCity: 'All Destinations',
      });
    } else if (travelVibe === 'luxury') {
      items.push({
        id: 'ai-vibe-formal-linen',
        name: 'Wrinkle-Resistant Fine Linen Evening Kurta / Shirt',
        category: 'clothing',
        priority: 'recommended',
        quantity: 2,
        weightGrams: 320,
        aiReason: `Elevated smart casual attire for palace courtyards, heritage dining, and candlelit terrace reservations.`,
        triggerType: 'culture',
        destinationCity: 'All Destinations',
      });

      items.push({
        id: 'ai-vibe-steam-spray',
        name: 'Travel Wrinkle-Release & Fabric Refresher Mist (100ml)',
        category: 'toiletries',
        priority: 'optional',
        quantity: 1,
        weightGrams: 120,
        aiReason: `Keeps linen and silk travel garments fresh without waiting on hotel dry-cleaning.`,
        triggerType: 'culture',
        destinationCity: 'All Destinations',
      });
    } else if (travelVibe === 'ultralight') {
      items.push({
        id: 'ai-vibe-wash-sheets',
        name: 'Dissolvable Travel Laundry Detergent Sheets (Pack of 20)',
        category: 'toiletries',
        priority: 'recommended',
        quantity: 1,
        weightGrams: 30,
        aiReason: `Enables quick sink-washing of quick-dry shirts to travel light without baggage weight.`,
        triggerType: 'duration',
        destinationCity: 'All Destinations',
      });
    }

    // 4. Universal Destination Necessities
    items.push({
      id: 'ai-uni-universal-adapter',
      name: 'Surge-Protected Universal Multi-Plug Travel Adapter',
      category: 'electronics',
      priority: 'essential',
      quantity: 1,
      weightGrams: 150,
      aiReason: `Protects sensitive electronics against sudden voltage fluctuations in heritage hotels and remote homestays.`,
      triggerType: 'duration',
      destinationCity: 'All Destinations',
    });

    items.push({
      id: 'ai-uni-first-aid',
      name: 'Compact Traveler GI Health Kit (ORS, Charcoal, Antihistamine)',
      category: 'medical',
      priority: 'essential',
      quantity: 1,
      weightGrams: 180,
      aiReason: `Safeguards your digestive system while experimenting with exotic street gastronomy and spices.`,
      triggerType: 'activity',
      destinationCity: 'All Destinations',
    });

    return items;
  }, [effectiveWeather, selectedFocusCity, selectedWeatherCity, trip, allActivities, travelVibe]);

  // Filter recommendations by active category and city
  const filteredRecommendations = useMemo(() => {
    return aiRecommendations.filter((item) => {
      if (activeCategoryFilter !== 'all' && item.category !== activeCategoryFilter) {
        return false;
      }
      return true;
    });
  }, [aiRecommendations, activeCategoryFilter]);

  // Check if item already exists in checklist
  const isItemInChecklist = (name: string) => {
    return existingItems.some(
      (item) => item.name.toLowerCase().trim() === name.toLowerCase().trim()
    );
  };

  // Add individual item to checklist
  const handleAddSingleItem = (item: AiSuggestedItem) => {
    onAddItems([
      {
        name: item.name,
        category: item.category,
        priority: item.priority,
        quantity: item.quantity,
        weightGrams: item.weightGrams,
        notes: item.aiReason,
        aiSuggested: true,
        aiReason: item.aiReason,
      },
    ]);
    if (onToast) {
      onToast(`✓ Added "${item.name}" to your packing checklist!`);
    }
  };

  // Bulk add all currently filtered items not yet in checklist
  const handleAddAllItems = () => {
    const itemsToAdd = filteredRecommendations
      .filter((item) => !isItemInChecklist(item.name))
      .map((item) => ({
        name: item.name,
        category: item.category,
        priority: item.priority,
        quantity: item.quantity,
        weightGrams: item.weightGrams,
        notes: item.aiReason,
        aiSuggested: true,
        aiReason: item.aiReason,
      }));

    if (itemsToAdd.length === 0) {
      if (onToast) onToast('All suggested items are already in your packing checklist!');
      return;
    }

    onAddItems(itemsToAdd);
    if (onToast) {
      onToast(`✓ Added ${itemsToAdd.length} AI-recommended items to your checklist!`);
    }
  };

  const unaddedCount = filteredRecommendations.filter((item) => !isItemInChecklist(item.name)).length;

  return (
    <section
      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
        isDark
          ? 'bg-gradient-to-b from-[#121921] via-[#0f151c] to-[#0c1117] border-emerald-500/30 shadow-2xl'
          : 'bg-gradient-to-b from-emerald-50/70 via-white to-stone-50 border-emerald-300/80 shadow-md'
      }`}
      aria-label="AI Packing Assistant"
    >
      {/* Header Bar */}
      <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-0.5 shadow-lg shrink-0">
            <div className="w-full h-full rounded-[14px] bg-stone-950 flex items-center justify-center text-amber-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono-num uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>AI PACKING ASSISTANT · ITINERARY & WEATHER RADAR</span>
              </span>
              <span className="text-xs text-stone-400 font-mono-num">
                Calibrated {analysisTimestamp}
              </span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight mt-1 text-white">
              Dynamic Itinerary & Climate Gear Calibration
            </h2>

            <p className="text-xs text-stone-300 font-sans-ui max-w-2xl mt-0.5 leading-relaxed">
              Synthesizes scheduled itinerary activities in {destinationList.join(', ')} with real-time doppler satellite radar ({effectiveWeather.current.temp}°C · {effectiveWeather.current.condition}) to recommend tailored travel necessities.
            </p>
          </div>
        </div>

        {/* Action Controls: Profile Selector & Re-Analyze */}
        <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
          <button
            onClick={handleReAnalyze}
            disabled={isAnalyzing}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 cursor-pointer ${
              isAnalyzing
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 cursor-wait'
                : 'border-white/10 hover:border-emerald-400/50 bg-black/30 hover:bg-black/50 text-stone-200'
            }`}
            title="Scan itinerary & re-calibrate weather conditions"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-emerald-400' : 'text-amber-400'}`} />
            <span>{isAnalyzing ? 'Scanning Radar...' : 'Re-Analyze'}</span>
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-stone-400 hover:text-white transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand Assistant' : 'Collapse Assistant'}
            aria-label={isCollapsed ? 'Expand Assistant' : 'Collapse Assistant'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Top Assistant Intelligence Bar: Travel Vibe & City Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-black/30 border border-white/5 items-center">
            {/* Travel Personality / Vibe Selector */}
            <div className="md:col-span-7 flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-mono-num uppercase text-stone-400 font-semibold mr-1 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-emerald-400" />
                <span>Travel Vibe:</span>
              </span>

              <button
                onClick={() => setTravelVibe('balanced')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  travelVibe === 'balanced'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                ⚖️ Balanced
              </button>

              <button
                onClick={() => setTravelVibe('ultralight')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  travelVibe === 'ultralight'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                🎒 Ultralight
              </button>

              <button
                onClick={() => setTravelVibe('luxury')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  travelVibe === 'luxury'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                👑 Luxury Comfort
              </button>

              <button
                onClick={() => setTravelVibe('photo')}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  travelVibe === 'photo'
                    ? 'bg-emerald-600 text-white font-bold shadow-sm'
                    : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
                }`}
              >
                📸 Photography
              </button>
            </div>

            {/* Destination Hub Filter */}
            <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-2">
              <span className="text-[11px] font-mono-num text-stone-400">Target Hub:</span>
              <select
                value={selectedFocusCity}
                onChange={(e) => setSelectedFocusCity(e.target.value)}
                className="px-3 py-1 rounded-lg text-xs font-mono-num bg-stone-900 border border-white/15 text-stone-200 focus:outline-none"
              >
                <option value="all">Entire Itinerary ({destinationList.length} Hubs)</option>
                {destinationList.map((d) => (
                  <option key={d} value={d}>
                    {d} Only
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Real-time Environmental Telemetry Digest */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-num text-xs">
            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Sun className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-stone-400 text-[10px] block">Atmosphere</span>
                <span className="font-bold text-white truncate block">{effectiveWeather.current.temp}°C · {effectiveWeather.current.condition}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <CloudRain className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-stone-400 text-[10px] block">Precipitation Risk</span>
                <span className="font-bold text-sky-300">{effectiveWeather.current.rainProbability}% Probability</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
                <Wind className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-stone-400 text-[10px] block">Surface Wind</span>
                <span className="font-bold text-white">{effectiveWeather.current.windSpeed} km/h Gusts</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <Zap className="w-4 h-4" />
              </div>
              <div className="truncate">
                <span className="text-stone-400 text-[10px] block">AI Calibrated Gear</span>
                <span className="font-bold text-emerald-400">{aiRecommendations.length} Items Evaluated</span>
              </div>
            </div>
          </div>

          {/* Recommendations Filter Tabs & Bulk Add Action */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs font-medium">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeCategoryFilter === 'all'
                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm'
                    : 'border-white/10 text-stone-300 hover:text-white bg-black/20'
                }`}
              >
                All Gear ({aiRecommendations.length})
              </button>
              <button
                onClick={() => setActiveCategoryFilter('clothing')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                  activeCategoryFilter === 'clothing'
                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm'
                    : 'border-white/10 text-stone-300 hover:text-white bg-black/20'
                }`}
              >
                <Shirt className="w-3.5 h-3.5" />
                <span>Clothing</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('gear')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                  activeCategoryFilter === 'gear'
                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm'
                    : 'border-white/10 text-stone-300 hover:text-white bg-black/20'
                }`}
              >
                <Luggage className="w-3.5 h-3.5" />
                <span>Technical Gear</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('medical')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1 ${
                  activeCategoryFilter === 'medical'
                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm'
                    : 'border-white/10 text-stone-300 hover:text-white bg-black/20'
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5" />
                <span>Health & Wellness</span>
              </button>
              <button
                onClick={() => setActiveCategoryFilter('electronics')}
                className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  activeCategoryFilter === 'electronics'
                    ? 'bg-amber-500 text-stone-950 border-amber-500 font-bold shadow-sm'
                    : 'border-white/10 text-stone-300 hover:text-white bg-black/20'
                }`}
              >
                Electronics
              </button>
            </div>

            {/* Bulk Add Button */}
            <button
              onClick={handleAddAllItems}
              disabled={unaddedCount === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer self-start sm:self-auto ${
                unaddedCount > 0
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-white/5'
              }`}
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>
                {unaddedCount > 0 ? `Add All Recommendations (+${unaddedCount})` : 'All Gear Already in Checklist'}
              </span>
            </button>
          </div>

          {/* Recommendations Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredRecommendations.map((item) => {
              const alreadyPacked = isItemInChecklist(item.name);

              const priorityBadgeClass =
                item.priority === 'essential'
                  ? 'text-rose-400 bg-rose-500/10 border-rose-500/30'
                  : item.priority === 'recommended'
                  ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                  : 'text-stone-400 bg-stone-500/10 border-stone-500/30';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 relative group ${
                    alreadyPacked
                      ? isDark
                        ? 'bg-stone-950/40 border-emerald-500/20 opacity-80'
                        : 'bg-stone-50 border-emerald-300 opacity-80'
                      : isDark
                      ? 'bg-black/30 border-white/10 hover:border-amber-500/40 hover:bg-black/40'
                      : 'bg-white border-stone-200 hover:border-amber-400 hover:shadow-md'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Top Row: Category, Priority, Weight */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-num uppercase font-semibold text-stone-400">
                        {item.category} · ~{item.weightGrams}g
                      </span>

                      <span className={`px-2 py-0.5 rounded text-[9px] font-mono-num font-bold uppercase border ${priorityBadgeClass}`}>
                        {item.priority}
                      </span>
                    </div>

                    {/* Item Title */}
                    <h4 className="font-editorial text-base font-bold text-white group-hover:text-amber-200 transition-colors leading-snug">
                      {item.name}
                    </h4>

                    {/* AI Reasoning Strip */}
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono-num text-amber-400">
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>AI Contextual Rationale</span>
                      </div>
                      <p className="text-[11px] text-stone-300 font-sans-ui leading-relaxed">
                        {item.aiReason}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] text-stone-400 font-mono-num">
                      Qty: {item.quantity}
                    </span>

                    {alreadyPacked ? (
                      <span className="text-xs font-mono-num text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>In Checklist</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => handleAddSingleItem(item)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm flex items-center gap-1 cursor-pointer active:scale-95"
                      >
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>Add to List</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
