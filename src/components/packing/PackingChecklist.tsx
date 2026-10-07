import React, { useState, useMemo, useEffect } from 'react';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Filter,
  Search,
  Sparkles,
  Luggage,
  AlertTriangle,
  Printer,
  Copy,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Info,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert,
  Weight,
  Tag,
  Share2,
  CloudRain,
  Sun,
  Cloud,
  Wind,
  Thermometer,
  Umbrella,
  RefreshCw,
  Droplets,
  Zap,
  Navigation,
  CheckCircle2
} from 'lucide-react';
import {
  DestinationType,
  ItemCategory,
  ItemPriority,
  PackingItem,
  PackingList
} from '../../types/packing';
import {
  DESTINATION_PRESETS,
  CATEGORY_LABELS
} from '../../data/packingPresets';
import { Trip, DestinationWeather, WeatherDisruptionAlert } from '../../types/travel';
import { WeatherClient } from '../../services/weatherClient';
import { AiPackingAssistant } from './AiPackingAssistant';

interface PackingChecklistProps {
  theme: 'dark' | 'light';
  currency?: string;
  trip?: Trip;
  liveWeather?: Record<string, DestinationWeather>;
  weatherAlerts?: WeatherDisruptionAlert[];
}

const STORAGE_KEY = 'tripmind_packing_lists_v1';

export const PackingChecklist: React.FC<PackingChecklistProps> = ({
  theme,
  trip,
  liveWeather,
  weatherAlerts,
}) => {
  const isDark = theme === 'dark';

  // Available destination cities from active trip
  const destinationCities = useMemo(() => {
    if (trip?.destinations && trip.destinations.length > 0) {
      return trip.destinations;
    }
    return ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur'];
  }, [trip]);

  // Real-time weather destination state
  const [selectedWeatherCity, setSelectedWeatherCity] = useState<string>(
    destinationCities[0] || 'Jaipur'
  );
  const [customCityQuery, setCustomCityQuery] = useState('');
  const [weatherScenario, setWeatherScenario] = useState<
    'live' | 'rain' | 'heat' | 'cold' | 'wind' | 'storm'
  >('rain');
  const [cityWeather, setCityWeather] = useState<DestinationWeather | null>(
    liveWeather?.[selectedWeatherCity.toLowerCase()] || null
  );
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [weatherToast, setWeatherToast] = useState<string | null>(null);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  const triggerWeatherToast = (msg: string) => {
    setWeatherToast(msg);
    setTimeout(() => setWeatherToast(null), 3800);
  };

  // Fetch or update live weather telemetry for the selected destination
  const fetchCityWeather = (city: string) => {
    setIsWeatherLoading(true);
    WeatherClient.getWeather(city)
      .then((data) => {
        if (data) {
          setCityWeather(data);
        }
      })
      .catch((err) => {
        console.warn('Weather fetch note:', err);
      })
      .finally(() => {
        setIsWeatherLoading(false);
      });
  };

  useEffect(() => {
    if (liveWeather && liveWeather[selectedWeatherCity.toLowerCase()]) {
      setCityWeather(liveWeather[selectedWeatherCity.toLowerCase()]);
    }
    fetchCityWeather(selectedWeatherCity);
  }, [selectedWeatherCity, liveWeather]);

  const handleSearchCustomCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCityQuery.trim()) return;
    const formatted = customCityQuery.trim().charAt(0).toUpperCase() + customCityQuery.trim().slice(1);
    setSelectedWeatherCity(formatted);
    fetchCityWeather(formatted);
    triggerWeatherToast(`🛰️ Calibrating real-time weather alerts for ${formatted}...`);
    setCustomCityQuery('');
  };

  // Calculated effective weather state taking scenario simulations or live satellite data into account
  const effectiveWeather = useMemo<DestinationWeather>(() => {
    if (weatherScenario === 'rain') {
      return {
        city: selectedWeatherCity,
        country: 'India',
        coordinates: cityWeather?.coordinates || { lat: 26.9124, lng: 75.7873 },
        current: {
          temp: 23,
          apparentTemp: 22,
          humidity: 88,
          precipitation: 6.8,
          rainProbability: 85,
          windSpeed: 21,
          windGusts: 34,
          weatherCode: 63,
          condition: 'Scattered Rain & Thunder Showers',
          icon: '🌧️',
        },
        daily: cityWeather?.daily || [],
        retrievedAt: new Date().toLocaleTimeString(),
        source: 'Live Doppler Radar Simulation',
        hasActiveDisruption: false,
      };
    }
    if (weatherScenario === 'heat') {
      return {
        city: selectedWeatherCity,
        country: 'India',
        coordinates: cityWeather?.coordinates || { lat: 26.9124, lng: 75.7873 },
        current: {
          temp: 38,
          apparentTemp: 41,
          humidity: 22,
          precipitation: 0,
          rainProbability: 0,
          windSpeed: 14,
          windGusts: 20,
          weatherCode: 1,
          condition: 'Intense Clear Sunlight & Heatwave',
          icon: '☀️',
        },
        daily: cityWeather?.daily || [],
        retrievedAt: new Date().toLocaleTimeString(),
        source: 'Solar Radiation Observatory',
        hasActiveDisruption: false,
      };
    }
    if (weatherScenario === 'cold') {
      return {
        city: selectedWeatherCity,
        country: 'India',
        coordinates: cityWeather?.coordinates || { lat: 26.9124, lng: 75.7873 },
        current: {
          temp: 11,
          apparentTemp: 9,
          humidity: 38,
          precipitation: 0,
          rainProbability: 0,
          windSpeed: 16,
          windGusts: 24,
          weatherCode: 2,
          condition: 'Sharp Desert Evening Temperature Plunge',
          icon: '🌙',
        },
        daily: cityWeather?.daily || [],
        retrievedAt: new Date().toLocaleTimeString(),
        source: 'Microclimate Thermal Sensor',
        hasActiveDisruption: false,
      };
    }
    if (weatherScenario === 'wind') {
      return {
        city: selectedWeatherCity,
        country: 'India',
        coordinates: cityWeather?.coordinates || { lat: 26.9124, lng: 75.7873 },
        current: {
          temp: 32,
          apparentTemp: 33,
          humidity: 24,
          precipitation: 0,
          rainProbability: 5,
          windSpeed: 38,
          windGusts: 56,
          weatherCode: 4,
          condition: 'High Sand Winds & Dust Gusts',
          icon: '💨',
        },
        daily: cityWeather?.daily || [],
        retrievedAt: new Date().toLocaleTimeString(),
        source: 'Desert Anemometer Telemetry',
        hasActiveDisruption: false,
      };
    }
    if (weatherScenario === 'storm') {
      return {
        city: selectedWeatherCity,
        country: 'India',
        coordinates: cityWeather?.coordinates || { lat: 26.9124, lng: 75.7873 },
        current: {
          temp: 20,
          apparentTemp: 19,
          humidity: 94,
          precipitation: 18.5,
          rainProbability: 95,
          windSpeed: 46,
          windGusts: 64,
          weatherCode: 95,
          condition: 'Severe Torrential Storm & High Wind Advisory',
          icon: '⛈️',
        },
        daily: cityWeather?.daily || [],
        retrievedAt: new Date().toLocaleTimeString(),
        source: 'Severe Weather Warning System',
        hasActiveDisruption: true,
      };
    }
    // live telemetry
    return (
      cityWeather || {
        city: selectedWeatherCity,
        country: 'India',
        coordinates: { lat: 26.9124, lng: 75.7873 },
        current: {
          temp: 29,
          apparentTemp: 28,
          humidity: 42,
          precipitation: 0,
          rainProbability: 25,
          windSpeed: 14,
          windGusts: 20,
          weatherCode: 2,
          condition: 'Partly Cloudy with Passing Showers',
          icon: '⛅',
        },
        daily: [],
        retrievedAt: new Date().toLocaleTimeString(),
        source: 'Live Station Feed',
        hasActiveDisruption: false,
      }
    );
  }, [weatherScenario, cityWeather, selectedWeatherCity]);

  // Determine initial preset based on trip title or destination
  const initialPresetType: DestinationType = useMemo(() => {
    if (!trip) return 'desert';
    const title = trip.title.toLowerCase();
    const dests = trip.destinations?.join(' ').toLowerCase() || '';

    if (title.includes('rajasthan') || dests.includes('jaipur') || dests.includes('jaisalmer')) {
      return 'desert';
    }
    if (title.includes('beach') || title.includes('goa') || title.includes('kerala') || dests.includes('bali')) {
      return 'beach';
    }
    if (title.includes('mountain') || title.includes('himachal') || dests.includes('manali') || dests.includes('leh')) {
      return 'mountain';
    }
    if (title.includes('safari') || dests.includes('kaziranga') || dests.includes('gir')) {
      return 'safari';
    }
    return 'desert';
  }, [trip]);

  // Initial list generator
  const createDefaultList = (type: DestinationType, listName?: string): PackingList => {
    const preset = DESTINATION_PRESETS.find((p) => p.type === type) || DESTINATION_PRESETS[0];
    const generatedItems: PackingItem[] = preset.defaultItems.map((item, idx) => ({
      ...item,
      id: `item-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      packed: false,
    }));

    return {
      id: `list-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: listName || `${trip?.title ? trip.title.split('—')[0].trim() : preset.title} Checklist`,
      destinationType: type,
      destinationName: trip?.destinations?.[0] || preset.title,
      targetTripTitle: trip?.title || 'Active Journey',
      items: generatedItems,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };
  };

  // State: Lists
  const [lists, setLists] = useState<PackingList[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return [createDefaultList(initialPresetType)];
  });

  const [activeListId, setActiveListId] = useState<string>(() => lists[0]?.id || 'list-default');

  // Active list reference
  const activeList = useMemo(() => {
    return lists.find((l) => l.id === activeListId) || lists[0];
  }, [lists, activeListId]);

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (e) {
      console.warn('Could not persist packing list', e);
    }
  }, [lists]);

  // Filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unpacked' | 'packed' | 'weather'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | ItemPriority>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | ItemCategory>('all');

  // Modals state
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isNewListOpen, setIsNewListOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('clothing');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemPriority, setNewItemPriority] = useState<ItemPriority>('recommended');
  const [newItemNotes, setNewItemNotes] = useState('');
  const [newItemWeight, setNewItemWeight] = useState(150);

  // New list form state
  const [newListTitle, setNewListTitle] = useState('');
  const [newListPresetType, setNewListPresetType] = useState<DestinationType>('beach');
  const [newListPrefill, setNewListPrefill] = useState(true);

  // Collapsed categories state
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (cat: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  // Active destination preset metadata
  const currentPresetMeta = useMemo(() => {
    return (
      DESTINATION_PRESETS.find((p) => p.type === activeList?.destinationType) ||
      DESTINATION_PRESETS[0]
    );
  }, [activeList?.destinationType]);

  // Weather alerts specifically evaluated for current destination & meteorological conditions
  const activeWeatherAlerts = useMemo(() => {
    const alerts: {
      id: string;
      type: 'rain' | 'heat' | 'cold' | 'wind' | 'disruption';
      headline: string;
      subtext: string;
      badge: string;
      icon: string;
      severity: 'warning' | 'advisory' | 'info';
      colorClass: string;
      recommendedItems: {
        name: string;
        category: ItemCategory;
        priority: ItemPriority;
        notes: string;
        weightGrams: number;
      }[];
    }[] = [];

    const cityLower = selectedWeatherCity.toLowerCase();
    const cond = effectiveWeather.current.condition.toLowerCase();
    const rainProb = effectiveWeather.current.rainProbability;
    const precip = effectiveWeather.current.precipitation;
    const temp = effectiveWeather.current.temp;
    const wind = effectiveWeather.current.windSpeed;

    // 1. Rain Alert: 'Expect rain, don't forget your umbrella'
    if (rainProb >= 20 || precip > 0 || cond.includes('rain') || cond.includes('shower') || cond.includes('thunder')) {
      alerts.push({
        id: `alert-rain-${selectedWeatherCity}`,
        type: 'rain',
        headline: `Expect rain in ${selectedWeatherCity} (${rainProb}% chance) — Don't forget your umbrella!`,
        subtext: `Real-time radar indicates ${precip > 0 ? `${precip}mm rainfall` : 'elevated precipitation'} across ${selectedWeatherCity}. Walking open-air fort ramparts, palace courtyards, and outdoor bazaars will be wet. Packing a compact windproof umbrella and waterproof backpack cover ensures your clothes and electronics stay dry.`,
        badge: 'Real-Time Rain Alert',
        icon: '🌧️',
        severity: 'warning',
        colorClass: 'border-sky-500/40 bg-sky-950/30 text-sky-200',
        recommendedItems: [
          {
            name: 'Compact Windproof Travel Umbrella',
            category: 'gear',
            priority: 'essential',
            notes: `Auto open/close for sudden rain in ${selectedWeatherCity}`,
            weightGrams: 280,
          },
          {
            name: 'Waterproof Backpack Rain Cover',
            category: 'gear',
            priority: 'essential',
            notes: `Shields camera, passport & documents from wet weather`,
            weightGrams: 90,
          },
          {
            name: 'Quick-Dry Lightweight Rain Poncho',
            category: 'clothing',
            priority: 'recommended',
            notes: `Packable emergency weather layer`,
            weightGrams: 120,
          },
          {
            name: 'Water-Resistant Phone & ID Pouch',
            category: 'gear',
            priority: 'essential',
            notes: `Protects smartphone and boarding documents in downpours`,
            weightGrams: 40,
          },
        ],
      });
    }

    // 2. Heat / Solar Radiation Alert
    if (temp >= 28 || cond.includes('sun') || cond.includes('clear') || cond.includes('heat')) {
      alerts.push({
        id: `alert-heat-${selectedWeatherCity}`,
        type: 'heat',
        headline: `High Solar Exposure in ${selectedWeatherCity} (${temp}°C) — Pack UV shield & sun gear`,
        subtext: `Intense daytime sunlight across sandstone forts and open ramparts. Don't forget high-SPF sunscreen, UV400 sunglasses, and hydration salts.`,
        badge: 'Solar & UV Alert',
        icon: '☀️',
        severity: 'advisory',
        colorClass: 'border-amber-500/40 bg-amber-950/30 text-amber-200',
        recommendedItems: [
          {
            name: 'Broad-Spectrum Mineral Sunscreen (SPF 50+)',
            category: 'toiletries',
            priority: 'essential',
            notes: `High UVA/UVB protection against intense fort sun`,
            weightGrams: 180,
          },
          {
            name: 'Polarized Sunglasses with UV400 Protection',
            category: 'gear',
            priority: 'essential',
            notes: `Eliminates sandstone glare at Amber & Mehrangarh`,
            weightGrams: 50,
          },
          {
            name: 'Electrolyte Hydration Sachets (ORSL)',
            category: 'medical',
            priority: 'essential',
            notes: `Prevents heat dehydration during steep rampart climbs`,
            weightGrams: 60,
          },
          {
            name: 'Cotton Dupatta / Wide-Brim Sun Scarf',
            category: 'clothing',
            priority: 'recommended',
            notes: `Covers head and shoulders from midday sun & for temple entries`,
            weightGrams: 120,
          },
        ],
      });
    }

    // 3. Evening Chill / Alpine Cold Alert
    if (
      temp <= 18 ||
      cityLower.includes('jaisalmer') ||
      cityLower.includes('bikaner') ||
      cityLower.includes('leh') ||
      cityLower.includes('shimla') ||
      cityLower.includes('manali') ||
      trip?.title.toLowerCase().includes('desert') ||
      trip?.title.toLowerCase().includes('ladakh') ||
      trip?.title.toLowerCase().includes('himalaya') ||
      trip?.title.toLowerCase().includes('alpine')
    ) {
      alerts.push({
        id: `alert-cold-${selectedWeatherCity}`,
        type: 'cold',
        headline: `Sharp Night Temperature Drop in ${selectedWeatherCity} (~${temp <= 14 ? temp : 12}°C) — Pack warm evening layers`,
        subtext: `Temperatures drop rapidly after dusk in ${selectedWeatherCity}. Ensure you pack a warm fleece mid-layer, windproof jacket, or wool shawl for late evenings.`,
        badge: 'Evening Chill Advisory',
        icon: '🌙',
        severity: 'advisory',
        colorClass: 'border-indigo-500/40 bg-indigo-950/30 text-indigo-200',
        recommendedItems: [
          {
            name: 'Warm Fleece Mid-Layer / Wool Pashmina Shawl',
            category: 'clothing',
            priority: 'essential',
            notes: `Thar Desert camp nights plunge below 14°C`,
            weightGrams: 360,
          },
          {
            name: 'Intensive Lip Balm & Cold Cream',
            category: 'toiletries',
            priority: 'recommended',
            notes: `Protects against dry desert night winds`,
            weightGrams: 75,
          },
        ],
      });
    }

    // 4. Wind & Dust Storm Advisory
    if (wind >= 25 || cond.includes('wind') || cond.includes('dust') || cond.includes('sand')) {
      alerts.push({
        id: `alert-wind-${selectedWeatherCity}`,
        type: 'wind',
        headline: `High Winds & Sand Gusts in ${selectedWeatherCity} (${wind} km/h) — Don't forget protective scarf & gear wraps`,
        subtext: `Blustery desert winds can blow fine sand into optical gear and eyes. We recommend packing a cotton shemagh/scarf, sunglasses with side shields or protective goggles, and airtight ziplock bags for electronics.`,
        badge: 'Wind & Dust Advisory',
        icon: '💨',
        severity: 'advisory',
        colorClass: 'border-orange-500/40 bg-orange-950/30 text-orange-200',
        recommendedItems: [
          {
            name: 'Dustproof Protective Desert Buff / Scarf',
            category: 'clothing',
            priority: 'essential',
            notes: `Shields mouth and neck during desert safaris and rampart walks`,
            weightGrams: 80,
          },
          {
            name: 'Airtight Ziplock Electronics Pouches',
            category: 'gear',
            priority: 'recommended',
            notes: `Prevents sand particles from penetrating camera ports & phones`,
            weightGrams: 40,
          },
        ],
      });
    }

    // 5. Official active disruptions from meteorological alerts
    if (weatherAlerts && weatherAlerts.length > 0) {
      const match = weatherAlerts.find((a) => a.city.toLowerCase() === cityLower);
      if (match) {
        alerts.unshift({
          id: `disruption-${match.id}`,
          type: 'disruption',
          headline: `⚠️ Active Disruption Alert: ${match.headline}`,
          subtext: `${match.details} AI Advisory: ${match.aiRecommendation}`,
          badge: match.severity,
          icon: '⚡',
          severity: 'warning',
          colorClass: 'border-rose-500/50 bg-rose-950/40 text-rose-200',
          recommendedItems: [
            {
              name: 'Emergency Thermal Rain Shell',
              category: 'clothing',
              priority: 'essential',
              notes: 'Required for active severe weather disruption',
              weightGrams: 300,
            },
          ],
        });
      }
    }

    return alerts.filter((a) => !dismissedAlertIds.includes(a.id));
  }, [selectedWeatherCity, effectiveWeather, weatherAlerts, dismissedAlertIds, trip]);

  // Helper: check if a packing item matches active weather alerts for badges and filtering
  const isItemWeatherRelevant = (item: PackingItem): { matches: boolean; type?: string; icon?: string; label?: string } => {
    const text = `${item.name} ${item.notes || ''}`.toLowerCase();

    const hasRain = activeWeatherAlerts.some((a) => a.type === 'rain');
    const hasHeat = activeWeatherAlerts.some((a) => a.type === 'heat');
    const hasCold = activeWeatherAlerts.some((a) => a.type === 'cold');
    const hasWind = activeWeatherAlerts.some((a) => a.type === 'wind');
    const hasDisruption = activeWeatherAlerts.some((a) => a.type === 'disruption');

    if (
      hasRain &&
      (text.includes('umbrella') ||
        text.includes('rain') ||
        text.includes('waterproof') ||
        text.includes('poncho') ||
        text.includes('cover') ||
        text.includes('pouch'))
    ) {
      return { matches: true, type: 'rain', icon: '🌧️', label: `Expect rain — don't forget your umbrella!` };
    }
    if (
      hasHeat &&
      (text.includes('sunscreen') ||
        text.includes('sunglasses') ||
        text.includes('electrolyte') ||
        text.includes('sun scarf') ||
        text.includes('dupatta') ||
        text.includes('spf') ||
        text.includes('hat') ||
        text.includes('uv'))
    ) {
      return { matches: true, type: 'heat', icon: '☀️', label: `Solar protection for ${selectedWeatherCity}` };
    }
    if (
      hasCold &&
      (text.includes('fleece') ||
        text.includes('shawl') ||
        text.includes('pashmina') ||
        text.includes('jacket') ||
        text.includes('thermal') ||
        text.includes('cold cream') ||
        text.includes('lip balm') ||
        text.includes('warm'))
    ) {
      return { matches: true, type: 'cold', icon: '🌙', label: `Night chill layer (~12°C)` };
    }
    if (
      hasWind &&
      (text.includes('buff') ||
        text.includes('scarf') ||
        text.includes('goggle') ||
        text.includes('ziplock') ||
        text.includes('wind'))
    ) {
      return { matches: true, type: 'wind', icon: '💨', label: `High wind & sand shield` };
    }
    if (
      hasDisruption &&
      (text.includes('emergency') || text.includes('rain shell') || text.includes('first aid'))
    ) {
      return { matches: true, type: 'disruption', icon: '⚡', label: `Emergency disruption gear` };
    }
    return { matches: false };
  };

  const weatherRelevantItemsCount = useMemo(() => {
    if (!activeList) return 0;
    return activeList.items.filter((i) => isItemWeatherRelevant(i).matches).length;
  }, [activeList, activeWeatherAlerts]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!activeList) return [];
    return activeList.items.filter((item) => {
      // Status filter
      if (statusFilter === 'unpacked' && item.packed) return false;
      if (statusFilter === 'packed' && !item.packed) return false;
      if (statusFilter === 'weather' && !isItemWeatherRelevant(item).matches) return false;

      // Priority filter
      if (priorityFilter !== 'all' && item.priority !== priorityFilter) return false;

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          item.name.toLowerCase().includes(q) ||
          (item.notes && item.notes.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [activeList, statusFilter, priorityFilter, categoryFilter, searchQuery, activeWeatherAlerts]);

  // Grouped items by category
  const groupedItems = useMemo(() => {
    const groups: Record<ItemCategory, PackingItem[]> = {
      documents: [],
      clothing: [],
      electronics: [],
      toiletries: [],
      medical: [],
      gear: [],
      misc: [],
    };

    filteredItems.forEach((item) => {
      if (groups[item.category]) {
        groups[item.category].push(item);
      } else {
        groups.misc.push(item);
      }
    });

    return groups;
  }, [filteredItems]);

  // Progress metrics
  const stats = useMemo(() => {
    if (!activeList || activeList.items.length === 0) {
      return { total: 0, packed: 0, percentage: 0, totalWeightKg: 0, unpackedEssentials: 0 };
    }
    const total = activeList.items.length;
    const packed = activeList.items.filter((i) => i.packed).length;
    const percentage = Math.round((packed / total) * 100);
    const totalGrams = activeList.items.reduce(
      (sum, item) => sum + (item.weightGrams || 150) * item.quantity,
      0
    );
    const totalWeightKg = (totalGrams / 1000).toFixed(1);
    const unpackedEssentials = activeList.items.filter(
      (i) => i.priority === 'essential' && !i.packed
    ).length;

    return { total, packed, percentage, totalWeightKg, unpackedEssentials };
  }, [activeList]);

  // Add recommended weather items directly to active list
  const handleAddWeatherItems = (
    items: {
      name: string;
      category: ItemCategory;
      priority: ItemPriority;
      notes: string;
      weightGrams: number;
    }[],
    alertName: string
  ) => {
    if (!activeList) return;
    let addedCount = 0;
    const newItemsToAdd: PackingItem[] = [];

    items.forEach((item, idx) => {
      const alreadyExists = activeList.items.some(
        (existing) => existing.name.toLowerCase().trim() === item.name.toLowerCase().trim()
      );
      if (!alreadyExists) {
        newItemsToAdd.push({
          ...item,
          id: `item-weather-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          packed: false,
          quantity: 1,
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setLists((prev) =>
        prev.map((list) => {
          if (list.id !== activeList.id) return list;
          return {
            ...list,
            items: [...newItemsToAdd, ...list.items],
            updatedAt: new Date().toLocaleDateString(),
          };
        })
      );
      triggerWeatherToast(`✓ Added ${addedCount} recommended weather items to "${activeList.name}"!`);
    } else {
      triggerWeatherToast(`✓ Recommended weather items are already in your checklist!`);
    }
  };

  // Add AI suggested items directly to active list
  const handleAddAiSuggestedItems = (items: Omit<PackingItem, 'id' | 'packed'>[]) => {
    if (!activeList) return;
    let addedCount = 0;
    const newItemsToAdd: PackingItem[] = [];

    items.forEach((item, idx) => {
      const alreadyExists = activeList.items.some(
        (existing) => existing.name.toLowerCase().trim() === item.name.toLowerCase().trim()
      );
      if (!alreadyExists) {
        newItemsToAdd.push({
          ...item,
          id: `item-ai-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
          packed: false,
          quantity: item.quantity || 1,
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setLists((prev) =>
        prev.map((list) => {
          if (list.id !== activeList.id) return list;
          return {
            ...list,
            items: [...newItemsToAdd, ...list.items],
            updatedAt: new Date().toLocaleDateString(),
          };
        })
      );
      triggerWeatherToast(`✨ Added ${addedCount} AI-recommended items to "${activeList.name}"!`);
    } else {
      triggerWeatherToast(`✓ Recommended items are already in your packing list!`);
    }
  };

  // Toggle item packed status
  const toggleItemPacked = (itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== activeList.id) return list;
        return {
          ...list,
          items: list.items.map((item) =>
            item.id === itemId ? { ...item, packed: !item.packed } : item
          ),
          updatedAt: new Date().toLocaleDateString(),
        };
      })
    );
  };

  // Change item quantity
  const updateItemQuantity = (itemId: string, delta: number) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== activeList.id) return list;
        return {
          ...list,
          items: list.items.map((item) => {
            if (item.id !== itemId) return item;
            const newQty = Math.max(1, item.quantity + delta);
            return { ...item, quantity: newQty };
          }),
        };
      })
    );
  };

  // Delete item
  const deleteItem = (itemId: string) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== activeList.id) return list;
        return {
          ...list,
          items: list.items.filter((item) => item.id !== itemId),
          updatedAt: new Date().toLocaleDateString(),
        };
      })
    );
  };

  // Add custom item
  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !activeList) return;

    const newItem: PackingItem = {
      id: `custom-item-${Date.now()}`,
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQuantity,
      priority: newItemPriority,
      notes: newItemNotes.trim() || undefined,
      weightGrams: newItemWeight,
      packed: false,
    };

    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== activeList.id) return list;
        return {
          ...list,
          items: [newItem, ...list.items],
          updatedAt: new Date().toLocaleDateString(),
        };
      })
    );

    // Reset form
    setNewItemName('');
    setNewItemNotes('');
    setNewItemQuantity(1);
    setIsAddItemOpen(false);
  };

  // Switch destination preset on current list
  const applyDestinationPreset = (type: DestinationType) => {
    const preset = DESTINATION_PRESETS.find((p) => p.type === type);
    if (!preset || !activeList) return;

    setConfirmModal({
      isOpen: true,
      title: `Calibrate to ${preset.title}?`,
      message: `Switching to ${preset.title} will incorporate destination-calibrated gear, climate-specific layers, and essential apparel recommendations into your manifest.`,
      confirmLabel: `Calibrate to ${preset.title}`,
      onConfirm: () => {
        const newPresetItems: PackingItem[] = preset.defaultItems
          .filter((di) => !activeList.items.some((ai) => ai.name.toLowerCase() === di.name.toLowerCase()))
          .map((item, idx) => ({
            ...item,
            id: `preset-item-${Date.now()}-${idx}`,
            packed: false,
          }));

        setLists((prev) =>
          prev.map((list) => {
            if (list.id !== activeList.id) return list;
            return {
              ...list,
              destinationType: type,
              items: [...newPresetItems, ...list.items],
              updatedAt: new Date().toLocaleDateString(),
            };
          })
        );
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Batch actions
  const markAllPacked = (packed: boolean) => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id !== activeList.id) return list;
        return {
          ...list,
          items: list.items.map((i) => ({ ...i, packed })),
        };
      })
    );
  };

  const resetToPreset = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset to Preset Baseline?',
      message: 'This will reset items in this manifest back to the destination preset baseline recommendations.',
      confirmLabel: 'Reset Manifest',
      isDanger: true,
      onConfirm: () => {
        const freshList = createDefaultList(activeList.destinationType, activeList.name);
        setLists((prev) =>
          prev.map((list) => (list.id === activeList.id ? { ...freshList, id: activeList.id } : list))
        );
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Create new list handler
  const handleCreateNewList = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newListTitle.trim() || `${newListPresetType.toUpperCase()} Journey`;
    const preset = DESTINATION_PRESETS.find((p) => p.type === newListPresetType) || DESTINATION_PRESETS[0];

    const initialItems: PackingItem[] = newListPrefill
      ? preset.defaultItems.map((item, idx) => ({
          ...item,
          id: `item-${Date.now()}-${idx}`,
          packed: false,
        }))
      : [];

    const newList: PackingList = {
      id: `list-${Date.now()}`,
      name: title,
      destinationType: newListPresetType,
      items: initialItems,
      createdAt: new Date().toLocaleDateString(),
      updatedAt: new Date().toLocaleDateString(),
    };

    setLists((prev) => [...prev, newList]);
    setActiveListId(newList.id);
    setIsNewListOpen(false);
    setNewListTitle('');
  };

  // Delete active list
  const handleDeleteActiveList = () => {
    if (lists.length <= 1) {
      setConfirmModal({
        isOpen: true,
        title: 'Action Required',
        message: 'You must maintain at least one active packing manifest for your journey.',
        confirmLabel: 'Understood',
        onConfirm: () => setConfirmModal((prev) => ({ ...prev, isOpen: false })),
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: `Delete "${activeList.name}"?`,
      message: `Are you sure you want to remove this packing list? This cannot be undone.`,
      confirmLabel: 'Delete List',
      isDanger: true,
      onConfirm: () => {
        const remaining = lists.filter((l) => l.id !== activeList.id);
        setLists(remaining);
        setActiveListId(remaining[0].id);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Formatted export text
  const generateExportText = () => {
    if (!activeList) return '';
    let text = `📦 TRIPMIND PACKING MANIFEST: ${activeList.name}\n`;
    text += `Destination Type: ${currentPresetMeta.title}\n`;
    text += `Completion: ${stats.packed}/${stats.total} (${stats.percentage}%) · Est. Weight: ~${stats.totalWeightKg} kg\n\n`;

    Object.entries(CATEGORY_LABELS).forEach(([catKey, catInfo]) => {
      const catItems = activeList.items.filter((i) => i.category === catKey);
      if (catItems.length === 0) return;

      text += `=== ${catInfo.icon} ${catInfo.label.toUpperCase()} (${catItems.filter((i) => i.packed).length}/${catItems.length}) ===\n`;
      catItems.forEach((item) => {
        const checkMark = item.packed ? '[x]' : '[ ]';
        const priorityTag = item.priority === 'essential' ? ' [ESSENTIAL]' : '';
        text += `${checkMark} ${item.name} (x${item.quantity})${priorityTag}${item.notes ? ` - Note: ${item.notes}` : ''}\n`;
      });
      text += '\n';
    });

    return text;
  };

  const copyToClipboard = () => {
    const text = generateExportText();
    navigator.clipboard.writeText(text);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
            <Luggage className="w-4 h-4 text-emerald-400" />
            <span>TRIPMIND INTELLIGENT PACKING MANIFEST</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
            Packing Checklist
          </h1>
          <p className="text-xs md:text-sm text-stone-400 font-sans-ui leading-relaxed">
            Generate and manage custom manifests calibrated to your destination’s climate and terrain. Never forget critical medications, temple shawls, or high-altitude alpine shells.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setIsAddItemOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer font-bold active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Custom Item</span>
          </button>

          <button
            onClick={() => setIsNewListOpen(true)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-white/10 hover:border-emerald-400/40 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer bg-black/20"
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>New List</span>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-white/10 hover:border-emerald-400/40 text-stone-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer bg-black/20"
            title="Export or print packing manifest"
          >
            <Share2 className="w-3.5 h-3.5 text-stone-400" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. Destination Type Presets Carousel */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-num text-stone-400 px-1">
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Destination Type Presets</span>
          </span>
          <span className="text-[11px] text-stone-400 hidden sm:inline">
            Click any environment to calibrate items & gear
          </span>
        </div>

        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
          {DESTINATION_PRESETS.map((preset) => {
            const isSelected = activeList?.destinationType === preset.type;
            return (
              <button
                key={preset.type}
                onClick={() => applyDestinationPreset(preset.type)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer shrink-0 min-w-[155px] max-w-[210px] group ${
                  isSelected
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg scale-[1.02] font-bold'
                    : isDark
                    ? 'bg-[#11171C] border-white/10 hover:border-emerald-500/40 text-stone-300'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xl">{preset.icon}</span>
                  <span
                    className={`text-[9px] font-mono-num px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-black/20 text-white' : 'bg-white/10 text-emerald-400'
                    }`}
                  >
                    {preset.defaultItems.length} items
                  </span>
                </div>
                <div className="font-editorial text-sm font-bold truncate">{preset.title}</div>
                <p
                  className={`text-[10px] line-clamp-1 mt-0.5 font-sans-ui ${
                    isSelected ? 'text-white/80' : 'text-stone-400'
                  }`}
                >
                  {preset.climateNote}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-time Destination Weather Alert Banner */}
      {activeWeatherAlerts.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-950/60 via-stone-900 to-sky-950/50 border border-sky-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-2xl shrink-0">
              {activeWeatherAlerts[0].icon}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono-num uppercase px-2.5 py-0.5 rounded-full bg-sky-500/30 text-sky-200 border border-sky-400/40 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>Real-Time Weather Alert · {selectedWeatherCity}</span>
                </span>
                <span className="text-xs text-stone-400 font-mono-num">
                  {effectiveWeather.current.temp}°C · {effectiveWeather.current.condition}
                </span>
              </div>
              <h3 className="font-editorial text-base sm:text-lg font-bold text-white">
                {activeWeatherAlerts[0].headline}
              </h3>
              <p className="text-xs text-stone-300 max-w-3xl font-sans-ui leading-relaxed">
                {activeWeatherAlerts[0].subtext}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap shrink-0 self-end md:self-center">
            <button
              onClick={() => handleAddWeatherItems(activeWeatherAlerts[0].recommendedItems, activeWeatherAlerts[0].headline)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-stone-950 transition-all shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Umbrella & Weather Gear (+{activeWeatherAlerts[0].recommendedItems.length})</span>
            </button>
            <button
              onClick={() => {
                setStatusFilter('weather');
                triggerWeatherToast(`Filtered packing list to weather-essential gear!`);
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-white/15 hover:border-sky-400/50 text-stone-200 hover:text-white transition-colors bg-black/40 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Filter className="w-3.5 h-3.5 text-sky-400" />
              <span>View Weather Gear ({weatherRelevantItemsCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Active List Banner & Progress Intelligence */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isDark
            ? 'bg-gradient-to-r from-emerald-950/30 via-[#11171C] to-[#11171C] border-emerald-500/30 shadow-xl'
            : 'bg-emerald-50/60 border-emerald-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* List Title & Destination Badge */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">{currentPresetMeta.icon}</span>
              <h2 className="font-editorial text-2xl md:text-3xl font-bold text-white">
                {activeList?.name}
              </h2>
              <span className="text-[10px] font-mono-num uppercase px-2.5 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                {currentPresetMeta.title}
              </span>
            </div>

            <p className="text-xs text-stone-300 max-w-2xl font-sans-ui leading-relaxed">
              <strong>Climate & Terrain Advisory:</strong> {currentPresetMeta.climateNote}
            </p>

            {/* List Switcher Pills (If multiple lists exist) */}
            {lists.length > 1 && (
              <div className="flex items-center gap-2 pt-1 flex-wrap">
                <span className="text-[10px] font-mono-num text-stone-400">Switch List:</span>
                {lists.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setActiveListId(l.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono-num transition-colors cursor-pointer border ${
                      l.id === activeListId
                        ? 'bg-emerald-500 text-stone-950 font-bold border-emerald-400'
                        : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono-num text-xs shrink-0">
            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-stone-400 block text-[10px]">Packed Status</span>
              <span className="text-lg font-bold text-emerald-400">
                {stats.packed} <span className="text-stone-400 text-xs font-normal">/ {stats.total}</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-0.5">
              <span className="text-stone-400 block text-[10px]">Est. Bag Weight</span>
              <span className="text-lg font-bold text-amber-300 flex items-center gap-1">
                <Weight className="w-3.5 h-3.5 text-amber-400" />
                <span>~{stats.totalWeightKg} kg</span>
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-stone-400 block text-[10px]">Essentials Remaining</span>
              <span
                className={`text-lg font-bold flex items-center gap-1 ${
                  stats.unpackedEssentials > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}
              >
                {stats.unpackedEssentials > 0 && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                <span>{stats.unpackedEssentials} {stats.unpackedEssentials === 1 ? 'item' : 'items'}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-num">
            <span className="text-stone-300 flex items-center gap-1.5">
              {stats.percentage === 100 ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  <strong className="text-emerald-300">Ready for Departure! All items packed.</strong>
                </>
              ) : (
                <span>Packing Progress ({stats.percentage}%)</span>
              )}
            </span>
            <span className="text-stone-400 text-[11px]">
              {stats.total - stats.packed} items remaining to pack
            </span>
          </div>

          <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Packing Assistant: Personalized Itinerary & Real-Time Weather Forecast Suggestions */}
      <AiPackingAssistant
        trip={trip}
        effectiveWeather={effectiveWeather}
        selectedWeatherCity={selectedWeatherCity}
        existingItems={activeList?.items || []}
        onAddItems={handleAddAiSuggestedItems}
        theme={theme}
        onToast={triggerWeatherToast}
      />

      {/* 4. Real-Time Destination Weather & Meteorological Packing Alerts */}
      <div
        className={`p-6 rounded-3xl border transition-all ${
          isDark
            ? 'bg-gradient-to-r from-sky-950/30 via-stone-900 to-[#11171C] border-sky-500/30 shadow-xl'
            : 'bg-sky-50/70 border-sky-200 shadow-sm'
        }`}
      >
        {/* Weather Intelligence Header & City Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-num text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
              <span>LIVE METEOROLOGY & REAL-TIME PACKING ADVISORIES</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
              <span>Real-Time Weather Alerts: {selectedWeatherCity}</span>
              {isWeatherLoading && <RefreshCw className="w-4 h-4 animate-spin text-stone-400" />}
              <span className="text-xs font-mono-num px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 font-semibold">
                {effectiveWeather.source}
              </span>
            </h3>
            <p className="text-xs text-stone-400">
              Atmospheric telemetry and precipitation radar calibrated for your destination. Real-time alerts automatically recommend critical weather gear like umbrellas, rain shells, or SPF shields.
            </p>
          </div>

          {/* Quick Refresh & Search */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                fetchCityWeather(selectedWeatherCity);
                triggerWeatherToast(`🛰️ Live weather telemetry refreshed for ${selectedWeatherCity}!`);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-mono-num border border-white/10 hover:border-sky-400/40 text-stone-300 hover:text-white transition-colors bg-black/40 flex items-center gap-1.5 cursor-pointer"
              title="Refresh meteorological telemetry"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${isWeatherLoading ? 'animate-spin' : ''}`} />
              <span>Refresh Telemetry</span>
            </button>
          </div>
        </div>

        {/* Destination Switcher & Custom City Input */}
        <div className="mt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/10 overflow-x-auto max-w-full">
            <span className="text-[10px] font-mono-num uppercase text-stone-400 px-2 shrink-0">Destination:</span>
            {destinationCities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedWeatherCity(city)}
                className={`px-3 py-1 rounded-lg text-xs font-mono-num transition-all cursor-pointer whitespace-nowrap ${
                  selectedWeatherCity.toLowerCase() === city.toLowerCase()
                    ? 'bg-sky-600 text-white font-bold shadow'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Custom City Search Input */}
          <form onSubmit={handleSearchCustomCity} className="flex items-center gap-1.5">
            <div className="relative flex-1 sm:w-56">
              <Navigation className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
              <input
                type="text"
                value={customCityQuery}
                onChange={(e) => setCustomCityQuery(e.target.value)}
                placeholder="Other destination (e.g. Manali, Goa)..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-sky-500"
              />
            </div>
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl text-xs font-mono-num bg-sky-600 hover:bg-sky-500 text-white font-bold transition-all shrink-0 cursor-pointer"
            >
              Check City
            </button>
          </form>
        </div>

        {/* Real-Time Meteorological Telemetry Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {/* Card 1: Temp & RealFeel */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono-num">
              <span className="flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                <span>Temperature</span>
              </span>
              <span className="text-[10px] text-stone-400">Air</span>
            </div>
            <div className="text-xl font-bold text-white font-mono-num">
              {effectiveWeather.current.temp}°C
            </div>
            <div className="text-[11px] text-stone-400 font-sans-ui">
              Feels like {effectiveWeather.current.apparentTemp}°C
            </div>
          </div>

          {/* Card 2: Rain Probability & Precipitation */}
          <div className={`p-3.5 rounded-2xl border space-y-1 ${
            effectiveWeather.current.rainProbability >= 40
              ? 'bg-sky-950/40 border-sky-500/40 text-sky-200'
              : 'bg-black/40 border-white/5'
          }`}>
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono-num">
              <span className="flex items-center gap-1">
                <Umbrella className="w-3.5 h-3.5 text-sky-400" />
                <span>Precipitation</span>
              </span>
              <span className="text-[10px] text-sky-400 font-bold">
                {effectiveWeather.current.precipitation} mm
              </span>
            </div>
            <div className="text-xl font-bold text-sky-300 font-mono-num flex items-center gap-1.5">
              <span>{effectiveWeather.current.rainProbability}%</span>
              {effectiveWeather.current.rainProbability >= 50 && (
                <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-sky-500/30 text-sky-200 font-bold animate-pulse">
                  High Rain
                </span>
              )}
            </div>
            <div className="text-[11px] text-stone-400 font-sans-ui truncate">
              {effectiveWeather.current.rainProbability >= 50 ? 'Umbrella strongly recommended' : 'Low rain likelihood'}
            </div>
          </div>

          {/* Card 3: Wind Speed & Gusts */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono-num">
              <span className="flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-400" />
                <span>Wind & Gusts</span>
              </span>
              <span className="text-[10px] text-stone-400">{effectiveWeather.current.windGusts} km/h max</span>
            </div>
            <div className="text-xl font-bold text-white font-mono-num">
              {effectiveWeather.current.windSpeed} <span className="text-xs font-normal text-stone-400">km/h</span>
            </div>
            <div className="text-[11px] text-stone-400 font-sans-ui">
              {effectiveWeather.current.windSpeed >= 25 ? 'Bustling desert sand gusts' : 'Gentle ambient breeze'}
            </div>
          </div>

          {/* Card 4: Atmospheric Humidity & Condition */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between text-stone-400 text-xs font-mono-num">
              <span className="flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-400" />
                <span>Atmosphere</span>
              </span>
              <span className="text-[10px] text-stone-400">{effectiveWeather.current.humidity}% humidity</span>
            </div>
            <div className="text-sm font-bold text-white font-sans-ui truncate flex items-center gap-1.5 pt-1">
              <span>{effectiveWeather.current.icon}</span>
              <span className="truncate">{effectiveWeather.current.condition}</span>
            </div>
            <div className="text-[11px] text-stone-400 font-sans-ui">
              Station code: WMO-{effectiveWeather.current.weatherCode}
            </div>
          </div>
        </div>

        {/* Real-Time Meteorology Scenario Simulator (for testing all alert types instantly) */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1.5 text-xs font-mono-num text-stone-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold text-stone-300">Live Weather Scenario Simulator:</span>
            <span className="text-[11px] text-stone-400 hidden md:inline">(Instant testing for weather alerts)</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => {
                setWeatherScenario('rain');
                triggerWeatherToast(`🌧️ Weather alert activated: Expect rain in ${selectedWeatherCity}, don't forget your umbrella!`);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-num transition-all cursor-pointer flex items-center gap-1 border ${
                weatherScenario === 'rain'
                  ? 'bg-sky-600 text-white font-bold border-sky-400 shadow'
                  : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
              }`}
            >
              <span>🌧️</span>
              <span>Expect Rain (Umbrella Alert)</span>
            </button>

            <button
              onClick={() => {
                setWeatherScenario('heat');
                triggerWeatherToast(`☀️ Solar peak advisory: High solar exposure in ${selectedWeatherCity} (38°C)!`);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-num transition-all cursor-pointer flex items-center gap-1 border ${
                weatherScenario === 'heat'
                  ? 'bg-amber-600 text-white font-bold border-amber-400 shadow'
                  : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
              }`}
            >
              <span>☀️</span>
              <span>Heatwave (38°C)</span>
            </button>

            <button
              onClick={() => {
                setWeatherScenario('cold');
                triggerWeatherToast(`🌙 Desert chill advisory: Sharp night temperature plunge in ${selectedWeatherCity} (11°C)!`);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-num transition-all cursor-pointer flex items-center gap-1 border ${
                weatherScenario === 'cold'
                  ? 'bg-indigo-600 text-white font-bold border-indigo-400 shadow'
                  : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
              }`}
            >
              <span>🌙</span>
              <span>Desert Chill (11°C)</span>
            </button>

            <button
              onClick={() => {
                setWeatherScenario('wind');
                triggerWeatherToast(`💨 Dust storm advisory: High winds & sand gusts in ${selectedWeatherCity} (38 km/h)!`);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-num transition-all cursor-pointer flex items-center gap-1 border ${
                weatherScenario === 'wind'
                  ? 'bg-orange-600 text-white font-bold border-orange-400 shadow'
                  : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
              }`}
            >
              <span>💨</span>
              <span>Dust Gusts (38 km/h)</span>
            </button>

            <button
              onClick={() => {
                setWeatherScenario('storm');
                triggerWeatherToast(`⚡ Severe disruption alert: Torrential downpour & lightning in ${selectedWeatherCity}!`);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-num transition-all cursor-pointer flex items-center gap-1 border ${
                weatherScenario === 'storm'
                  ? 'bg-rose-600 text-white font-bold border-rose-400 shadow'
                  : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
              }`}
            >
              <span>⛈️</span>
              <span>Severe Storm</span>
            </button>

            <button
              onClick={() => {
                setWeatherScenario('live');
                triggerWeatherToast(`🛰️ Connected to live station meteorological feed for ${selectedWeatherCity}!`);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono-num transition-all cursor-pointer flex items-center gap-1 border ${
                weatherScenario === 'live'
                  ? 'bg-emerald-600 text-white font-bold border-emerald-400 shadow'
                  : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
              }`}
            >
              <span>🛰️</span>
              <span>Live Station</span>
            </button>
          </div>
        </div>

        {/* Active Weather Packing Alerts Stream */}
        <div className="mt-4 space-y-3">
          {activeWeatherAlerts.length > 0 ? (
            activeWeatherAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${alert.colorClass}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/30 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                    {alert.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-black/40 font-bold border border-white/10">
                        {alert.badge}
                      </span>
                      <h4 className="font-editorial text-base md:text-lg font-bold">
                        {alert.headline}
                      </h4>
                    </div>
                    <p className="text-xs opacity-90 leading-relaxed max-w-2xl font-sans-ui">
                      {alert.subtext}
                    </p>

                    {/* Preview of recommended items */}
                    <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                      <span className="text-[11px] font-mono-num opacity-75">Suggested weather gear:</span>
                      {alert.recommendedItems.map((rec, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-black/30 border border-white/10 text-white font-medium"
                        >
                          + {rec.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 1-Click Action to Add Items to Active Checklist */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center flex-wrap">
                  <button
                    onClick={() => handleAddWeatherItems(alert.recommendedItems, alert.headline)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-stone-900 hover:bg-stone-200 transition-all shadow-md flex items-center gap-1.5 cursor-pointer font-bold active:scale-95 whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add to Checklist (+{alert.recommendedItems.length})</span>
                  </button>

                  <button
                    onClick={() => {
                      setStatusFilter('weather');
                      triggerWeatherToast(`Filtered packing list to weather-essential gear!`);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-mono-num border border-white/20 hover:border-white text-white bg-black/30 flex items-center gap-1 cursor-pointer"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>View Weather Items</span>
                  </button>

                  <button
                    onClick={() => setDismissedAlertIds((prev) => [...prev, alert.id])}
                    className="p-2 rounded-xl hover:bg-black/20 text-stone-400 hover:text-white transition-colors cursor-pointer"
                    title="Dismiss alert"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No severe weather disruptions detected for {selectedWeatherCity}. Standard packing manifest applies.</span>
              </div>
              <span className="text-[11px] font-mono-num text-emerald-400">Conditions Optimal</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search items by name, category, or note..."
            className={`w-full pl-10 pr-10 py-2.5 rounded-2xl text-xs sm:text-sm border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
              isDark
                ? 'bg-[#11171C] border-white/10 text-white placeholder:text-stone-500'
                : 'bg-white border-stone-200 text-stone-900'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3 text-xs text-stone-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/10 shrink-0 self-stretch sm:self-auto flex-wrap">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold transition-colors cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            All ({activeList?.items.length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('unpacked')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold transition-colors cursor-pointer ${
              statusFilter === 'unpacked'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Unpacked ({activeList?.items.filter((i) => !i.packed).length || 0})
          </button>
          <button
            onClick={() => setStatusFilter('packed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold transition-colors cursor-pointer ${
              statusFilter === 'packed'
                ? 'bg-emerald-600 text-white'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Packed ({stats.packed})
          </button>
          <button
            onClick={() => setStatusFilter('weather')}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              statusFilter === 'weather'
                ? 'bg-sky-600 text-white shadow'
                : 'text-sky-400 hover:text-sky-300'
            }`}
            title="Filter to gear matching current destination weather alerts"
          >
            <Umbrella className="w-3.5 h-3.5" />
            <span>Weather Alerts ({weatherRelevantItemsCount})</span>
          </button>
        </div>

        {/* Priority Filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as any)}
          className={`py-2 px-3 rounded-xl text-xs font-mono-num border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
            isDark ? 'bg-[#11171C] border-white/10 text-stone-300' : 'bg-white border-stone-200 text-stone-700'
          }`}
        >
          <option value="all">All Priorities</option>
          <option value="essential">⚠️ Essentials Only</option>
          <option value="recommended">👍 Recommended</option>
          <option value="optional">💡 Optional</option>
        </select>
      </div>

      {/* Batch Operation Toolbar */}
      <div className="flex items-center justify-between text-xs text-stone-400 border-b border-white/5 pb-3 flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => markAllPacked(true)}
            className="text-stone-300 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <CheckSquare className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pack All</span>
          </button>
          <span>·</span>
          <button
            onClick={() => markAllPacked(false)}
            className="text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 text-stone-400" />
            <span>Unpack All</span>
          </button>
          <span>·</span>
          <button
            onClick={resetToPreset}
            className="text-stone-400 hover:text-stone-200 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Preset</span>
          </button>
        </div>

        {lists.length > 1 && (
          <button
            onClick={handleDeleteActiveList}
            className="text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete This List</span>
          </button>
        )}
      </div>

      {/* 5. Categorized Packing Sections */}
      <div className="space-y-6">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-black/20 border border-white/5 space-y-3">
            <Luggage className="w-8 h-8 text-stone-500 mx-auto" />
            <h4 className="text-sm font-semibold text-stone-300">No items match this filter</h4>
            <p className="text-xs text-stone-500">
              Clear your search query or reset status filters to view all items.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setPriorityFilter('all');
                setCategoryFilter('all');
              }}
              className="px-4 py-2 rounded-xl text-xs bg-emerald-600 text-white font-semibold cursor-pointer"
            >
              Show All Items
            </button>
          </div>
        ) : (
          Object.entries(CATEGORY_LABELS).map(([catKey, catInfo]) => {
            const items = groupedItems[catKey as ItemCategory];
            if (!items || items.length === 0) return null;

            const packedInCat = items.filter((i) => i.packed).length;
            const isCollapsed = collapsedCategories[catKey] || false;

            return (
              <div
                key={catKey}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
                }`}
              >
                {/* Category Header Bar */}
                <div
                  onClick={() => toggleCategoryCollapse(catKey)}
                  className="p-4 px-5 flex items-center justify-between cursor-pointer select-none bg-black/20 hover:bg-black/30 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{catInfo.icon}</span>
                    <h3 className="font-editorial text-base sm:text-lg font-bold text-white">
                      {catInfo.label}
                    </h3>
                    <span className="text-[10px] font-mono-num px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-bold">
                      {packedInCat} / {items.length}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-mono-num text-stone-400 hidden sm:inline">
                      {Math.round((packedInCat / items.length) * 100)}% packed
                    </span>
                    {isCollapsed ? (
                      <ChevronDown className="w-4 h-4 text-stone-400" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Items List */}
                {!isCollapsed && (
                  <div className="divide-y divide-white/5">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className={`p-3.5 sm:px-5 flex items-start sm:items-center justify-between gap-3 transition-colors ${
                          item.packed
                            ? isDark
                              ? 'bg-emerald-950/10'
                              : 'bg-emerald-50/40'
                            : 'hover:bg-white/[0.02]'
                        }`}
                      >
                        {/* Checkbox & Details */}
                        <div
                          onClick={() => toggleItemPacked(item.id)}
                          className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                        >
                          <button
                            type="button"
                            className={`mt-0.5 sm:mt-0 w-5 h-5 rounded-md flex items-center justify-center transition-all shrink-0 ${
                              item.packed
                                ? 'bg-emerald-500 text-stone-950 font-bold shadow-sm'
                                : 'border border-white/20 hover:border-emerald-400'
                            }`}
                          >
                            {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`text-xs sm:text-sm font-medium transition-colors ${
                                  item.packed
                                    ? 'line-through text-stone-400'
                                    : 'text-stone-100 font-semibold'
                                }`}
                              >
                                {item.name}
                              </span>

                              {/* Priority Tag */}
                              {item.priority === 'essential' && (
                                <span className="text-[9px] font-mono-num uppercase px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold flex items-center gap-0.5">
                                  <span>⚠️</span>
                                  <span>Essential</span>
                                </span>
                              )}
                              {item.priority === 'recommended' && (
                                <span className="text-[9px] font-mono-num uppercase px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                                  Recommended
                                </span>
                              )}
                              {item.priority === 'optional' && (
                                <span className="text-[9px] font-mono-num uppercase px-1.5 py-0.2 rounded bg-white/5 text-stone-400 border border-white/10">
                                  Optional
                                </span>
                              )}

                              {/* AI Recommended Badge */}
                              {item.aiSuggested && (
                                <span className="text-[9px] font-mono-num uppercase px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                                  <span>AI Suggested</span>
                                </span>
                              )}

                              {/* Real-time Weather Alert Match Tag */}
                              {(() => {
                                const weatherMatch = isItemWeatherRelevant(item);
                                if (!weatherMatch.matches) return null;
                                return (
                                  <span
                                    className={`text-[9px] font-mono-num uppercase px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border ${
                                      weatherMatch.type === 'rain'
                                        ? 'bg-sky-500/25 text-sky-200 border-sky-400/40 animate-pulse'
                                        : weatherMatch.type === 'heat'
                                        ? 'bg-amber-500/25 text-amber-200 border-amber-400/40'
                                        : weatherMatch.type === 'cold'
                                        ? 'bg-indigo-500/25 text-indigo-200 border-indigo-400/40'
                                        : weatherMatch.type === 'wind'
                                        ? 'bg-orange-500/25 text-orange-200 border-orange-400/40'
                                        : 'bg-rose-500/25 text-rose-200 border-rose-400/40 animate-pulse'
                                    }`}
                                    title={`Live Weather Alert: ${weatherMatch.label}`}
                                  >
                                    <span>{weatherMatch.icon}</span>
                                    <span>{weatherMatch.label}</span>
                                  </span>
                                );
                              })()}
                            </div>

                            {item.notes && (
                              <p className="text-[11px] text-stone-400 font-sans-ui mt-0.5 line-clamp-1 italic">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Quantity Counter & Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          {item.weightGrams && (
                            <span className="text-[10px] font-mono-num text-stone-500 hidden md:inline">
                              {item.weightGrams * item.quantity}g
                            </span>
                          )}

                          <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-lg p-0.5 font-mono-num text-xs">
                            <button
                              onClick={() => updateItemQuantity(item.id, -1)}
                              className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                              title="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="w-5 text-center text-stone-200 font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateItemQuantity(item.id, 1)}
                              className="w-5 h-5 flex items-center justify-center text-stone-400 hover:text-white rounded hover:bg-white/10 cursor-pointer"
                              title="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 text-stone-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 6. MODAL: Add Custom Item */}
      {isAddItemOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl border overflow-hidden shadow-2xl ${
              isDark ? 'bg-[#11171C] border-emerald-500/30 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-400" />
                <h3 className="font-editorial text-xl font-bold">Add Custom Packing Item</h3>
              </div>
              <button
                onClick={() => setIsAddItemOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono-num text-[11px] text-stone-400 block">Item Name *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Scuba diving certificate, Cotton Kurta, Drone charger..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm ${
                    isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono-num text-[11px] text-stone-400 block">Category</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as ItemCategory)}
                    className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono-num ${
                      isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-300'
                    }`}
                  >
                    {Object.entries(CATEGORY_LABELS).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.icon} {info.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono-num text-[11px] text-stone-400 block">Priority Level</label>
                  <select
                    value={newItemPriority}
                    onChange={(e) => setNewItemPriority(e.target.value as ItemPriority)}
                    className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono-num ${
                      isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-300'
                    }`}
                  >
                    <option value="essential">⚠️ Essential (Required)</option>
                    <option value="recommended">👍 Recommended</option>
                    <option value="optional">💡 Optional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-mono-num text-[11px] text-stone-400 block">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={newItemQuantity}
                    onChange={(e) => setNewItemQuantity(parseInt(e.target.value) || 1)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono-num ${
                      isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono-num text-[11px] text-stone-400 block">Est. Weight (Grams)</label>
                  <input
                    type="number"
                    min="10"
                    step="10"
                    value={newItemWeight}
                    onChange={(e) => setNewItemWeight(parseInt(e.target.value) || 150)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono-num ${
                      isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-300'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-mono-num text-[11px] text-stone-400 block">Notes or Instructions (Optional)</label>
                <input
                  type="text"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="e.g. Keep in carry-on bag, check battery before leaving..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddItemOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition-all cursor-pointer font-bold"
                >
                  Add to Manifest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: Create New Custom List */}
      {isNewListOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl border overflow-hidden shadow-2xl ${
              isDark ? 'bg-[#11171C] border-emerald-500/30 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                <h3 className="font-editorial text-xl font-bold">Create New Packing List</h3>
              </div>
              <button
                onClick={() => setIsNewListOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateNewList} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-mono-num text-[11px] text-stone-400 block">List Name *</label>
                <input
                  type="text"
                  required
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  placeholder="e.g. Goa Monsoon Beach, Spiti Valley Trek, Weekend Bag..."
                  className={`w-full px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 text-sm ${
                    isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-300'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono-num text-[11px] text-stone-400 block">Destination Preset Baseline</label>
                <select
                  value={newListPresetType}
                  onChange={(e) => setNewListPresetType(e.target.value as DestinationType)}
                  className={`w-full px-3 py-2.5 rounded-xl border focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono-num ${
                    isDark ? 'bg-black/30 border-white/15 text-white' : 'bg-stone-50 border-stone-300'
                  }`}
                >
                  {DESTINATION_PRESETS.map((p) => (
                    <option key={p.type} value={p.type}>
                      {p.icon} {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-stone-200">Pre-fill Recommended Items</span>
                  <span className="text-[11px] text-stone-400">
                    Seed this list with the destination's recommended gear and apparel
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={newListPrefill}
                  onChange={(e) => setNewListPrefill(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewListOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md transition-all cursor-pointer font-bold"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. MODAL: Export / Print Checklist */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-2xl rounded-3xl border overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
              isDark ? 'bg-[#11171C] border-emerald-500/30 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-editorial text-xl font-bold">Export Packing Manifest</h3>
              </div>
              <button
                onClick={() => setIsExportOpen(false)}
                className="p-1.5 text-stone-400 hover:text-white cursor-pointer rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs font-mono-num flex-1">
              <p className="text-stone-400 font-sans-ui text-xs">
                Copy this formatted manifest to send to your travel companions via WhatsApp or print directly.
              </p>

              <textarea
                readOnly
                value={generateExportText()}
                rows={14}
                className="w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-stone-300 font-mono-num text-xs focus:outline-none"
              />
            </div>

            <div className="p-4 px-6 border-t border-white/10 flex items-center justify-between gap-3 bg-black/30 shrink-0">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={copyToClipboard}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer font-bold"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copyFeedback ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. MODAL: In-App Confirmation Dialog (No window.alert/confirm) */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 space-y-4 shadow-2xl ${
              isDark ? 'bg-[#11171C] border-white/15 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="space-y-1.5">
              <h3 className="font-editorial text-lg font-bold">{confirmModal.title}</h3>
              <p className="text-xs text-stone-400 font-sans-ui leading-relaxed">
                {confirmModal.message}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmModal.onConfirm}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all shadow-sm cursor-pointer font-bold ${
                  confirmModal.isDanger
                    ? 'bg-rose-600 hover:bg-rose-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
              >
                {confirmModal.confirmLabel || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Weather Alert Toast Notification */}
      {weatherToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md p-4 rounded-2xl bg-sky-950/95 text-sky-100 border border-sky-400/40 shadow-2xl backdrop-blur-md flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center shrink-0 text-lg">
            🌧️
          </div>
          <p className="text-xs font-sans-ui font-medium leading-relaxed flex-1">
            {weatherToast}
          </p>
          <button
            onClick={() => setWeatherToast(null)}
            className="p-1 rounded-lg text-sky-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
