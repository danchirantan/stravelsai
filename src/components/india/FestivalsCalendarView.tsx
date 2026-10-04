import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Sparkles,
  Filter,
  Search,
  ChevronRight,
  Flame,
  Award,
  Clock,
  Info,
  CheckCircle2,
  Tag,
  Compass,
  ArrowRight,
  ChevronLeft,
  Sun,
  Umbrella,
  X,
  Share2,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import {
  INDIAN_FESTIVALS,
  ALL_INDIA_DESTINATIONS,
  ALL_28_INDIAN_STATES,
  IndianFestival
} from '../../data/indiaAllDestinations';
import { IndianDestination } from '../../types/travel';

export interface FestivalsCalendarViewProps {
  onSelectDestinationForPlanning: (destinationName: string) => void;
  theme: 'dark' | 'light';
  currency: string;
  initialStateFilter?: string;
}

export const MONTHS = [
  { index: 0, label: 'All Year', short: 'All', season: 'Annual', icon: '✨', days: 365 },
  { index: 1, label: 'January', short: 'Jan', season: 'Winter', icon: '❄️', days: 31 },
  { index: 2, label: 'February', short: 'Feb', season: 'Winter', icon: '❄️', days: 28 },
  { index: 3, label: 'March', short: 'Mar', season: 'Spring', icon: '🌸', days: 31 },
  { index: 4, label: 'April', short: 'Apr', season: 'Spring', icon: '🌿', days: 30 },
  { index: 5, label: 'May', short: 'May', season: 'Summer', icon: '☀️', days: 31 },
  { index: 6, label: 'June', short: 'Jun', season: 'Summer', icon: '☀️', days: 30 },
  { index: 7, label: 'July', short: 'Jul', season: 'Monsoon', icon: '🌧️', days: 31 },
  { index: 8, label: 'August', short: 'Aug', season: 'Monsoon', icon: '🌧️', days: 31 },
  { index: 9, label: 'September', short: 'Sep', season: 'Monsoon', icon: '🍃', days: 30 },
  { index: 10, label: 'October', short: 'Oct', season: 'Autumn', icon: '🍂', days: 31 },
  { index: 11, label: 'November', short: 'Nov', season: 'Autumn', icon: '🪔', days: 30 },
  { index: 12, label: 'December', short: 'Dec', season: 'Winter', icon: '❄️', days: 31 },
];

export const CATEGORIES = [
  { id: 'All', label: 'All Celebrations', icon: '🇮🇳' },
  { id: 'Sacred & Lights', label: 'Lights & Sacred (Diwali/Aartis)', icon: '🪔' },
  { id: 'Colors & Spring', label: 'Colors & Spring (Holi/Kites)', icon: '🎨' },
  { id: 'Desert Fair', label: 'Desert Fairs (Pushkar/Kutch)', icon: '🐪' },
  { id: 'Folk & Heritage', label: 'Folk & Tribal (Hornbill/Dasara)', icon: '🪘' },
  { id: 'Harvest & Boats', label: 'Harvest & Regattas (Onam/Baisakhi)', icon: '🛶' },
  { id: 'Dance & Classical', label: 'Dance & Classical (Khajuraho)', icon: '💃' },
  { id: 'Carnival & Fest', label: 'Carnivals (Goa Viva)', icon: '🎭' },
  { id: 'Martial & Arts', label: 'Martial Arts (Hola Mohalla)', icon: '⚔️' },
];

export const SEASONS = [
  { id: 'All', label: 'All Seasons', icon: '✨' },
  { id: 'Winter', label: 'Winter (Dec–Feb)', icon: '❄️' },
  { id: 'Spring', label: 'Spring (Mar–Apr)', icon: '🌸' },
  { id: 'Summer', label: 'Summer (May–Jun)', icon: '☀️' },
  { id: 'Monsoon', label: 'Monsoon (Jul–Sep)', icon: '🌧️' },
  { id: 'Autumn', label: 'Autumn (Oct–Nov)', icon: '🍂' },
];

export const REGIONS = [
  { id: 'All', label: 'All India' },
  { id: 'North', label: 'North India' },
  { id: 'South', label: 'South India' },
  { id: 'West', label: 'West India' },
  { id: 'East', label: 'East India' },
  { id: 'Northeast', label: 'Northeast' },
  { id: 'Central', label: 'Central' },
];

// Helper to link festivals to real destinations in ALL_INDIA_DESTINATIONS
export function getLinkedDestinations(fest: IndianFestival): IndianDestination[] {
  const festName = fest.name.toLowerCase();
  const festDest = fest.destination.toLowerCase();
  const festState = fest.state.toLowerCase().replace(/\s*\(ut\)/i, '').trim();

  // 1. First priority: explicitly named destinations in fest.linkedDestinationNames
  if (fest.linkedDestinationNames && fest.linkedDestinationNames.length > 0) {
    const matchedByName: IndianDestination[] = [];
    fest.linkedDestinationNames.forEach((targetName) => {
      const lower = targetName.toLowerCase();
      const found = ALL_INDIA_DESTINATIONS.find((d) => {
        const dLower = d.name.toLowerCase();
        return dLower.includes(lower) || lower.includes(dLower);
      });
      if (found && !matchedByName.some((m) => m.id === found.id)) {
        matchedByName.push(found);
      }
    });
    if (matchedByName.length > 0) {
      return matchedByName.slice(0, 4);
    }
  }

  // 2. Specific iconic festival bindings
  const specificBindings: { [key: string]: string[] } = {
    'diwali': ['varanasi', 'ayodhya', 'jaipur', 'delhi'],
    'holi': ['mathura', 'agra', 'pushkar', 'jaipur'],
    'pushkar': ['pushkar', 'jaipur', 'jodhpur', 'udaipur'],
    'durga puja': ['kolkata', 'darjeeling', 'sundarbans'],
    'hornbill': ['kohima', 'dzukou', 'shillong', 'kaziranga'],
    'dev deepawali': ['varanasi', 'ayodhya', 'rajgir'],
    'rann utsav': ['kutch', 'gir', 'ahmedabad'],
    'onam': ['alleppey', 'kochi', 'munnar', 'wayanad'],
    'dasara': ['mysuru', 'coorg', 'hampi', 'bangalore'],
    'ganesh': ['mumbai', 'ajanta', 'mahabaleshwar'],
    'hemis': ['leh', 'pangong', 'nubra'],
    'kite': ['ahmedabad', 'kutch', 'daman'],
    'hola mohalla': ['amritsar', 'patiala', 'chandigarh'],
    'bihu': ['guwahati', 'kaziranga', 'majuli'],
    'kumbh': ['varanasi', 'ayodhya', 'rishikesh'],
    'chhath': ['rajgir', 'patna', 'varanasi', 'bodh gaya'],
    'ratha yatra': ['puri', 'bhubaneswar', 'chilika'],
    'thrissur': ['kochi', 'munnar', 'alleppey'],
    'khajuraho': ['khajuraho', 'gwalior', 'varanasi'],
    'bastar': ['jagdalpur', 'chitrakote', 'raipur'],
    'goa carnival': ['north goa', 'south goa', 'hampi'],
    'wangala': ['shillong', 'cherrapunji', 'kaziranga'],
    'losar': ['gangtok', 'pelling', 'darjeeling', 'tawang'],
    'hampi utsav': ['hampi', 'badami', 'mysuru', 'goa'],
    'baisakhi': ['amritsar', 'patiala', 'chandigarh', 'dharamshala']
  };

  for (const [key, searchKeywords] of Object.entries(specificBindings)) {
    if (festName.includes(key)) {
      const results: IndianDestination[] = [];
      for (const kw of searchKeywords) {
        const match = ALL_INDIA_DESTINATIONS.find((d) => d.name.toLowerCase().includes(kw));
        if (match && !results.some((r) => r.id === match.id)) {
          results.push(match);
        }
      }
      if (results.length > 0) return results.slice(0, 4);
    }
  }

  // 3. Fallback: match by destination name or state
  const directMatches = ALL_INDIA_DESTINATIONS.filter((d) => {
    const dName = d.name.toLowerCase();
    const dState = d.state.toLowerCase();
    return festDest.includes(dName) || dName.includes(festDest) || dState.includes(festState);
  });

  return directMatches.slice(0, 4);
}

export const FestivalsCalendarView: React.FC<FestivalsCalendarViewProps> = ({
  onSelectDestinationForPlanning,
  theme,
  currency,
  initialStateFilter = 'All'
}) => {
  const isDark = theme === 'dark';

  // Filters state
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = All
  const [selectedDay, setSelectedDay] = useState<number | null>(null); // Specific day in month
  const [selectedState, setSelectedState] = useState<string>(initialStateFilter);
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeason, setSelectedSeason] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'timeline' | 'month-grid' | 'cards'>('timeline');
  const [selectedFestivalModal, setSelectedFestivalModal] = useState<IndianFestival | null>(null);

  // Quick preset filter
  const [activePreset, setActivePreset] = useState<string | null>(null);

  // Extract distinct states with counts
  const availableStates = useMemo(() => {
    const statesMap = new Map<string, number>();
    INDIAN_FESTIVALS.forEach((f) => {
      const cleanState = f.state.replace(/\s*\(UT\)/i, '').trim();
      statesMap.set(cleanState, (statesMap.get(cleanState) || 0) + 1);
    });
    return Array.from(statesMap.entries()).sort((a, b) => b[1] - a[1]);
  }, []);

  // Filtered festivals
  const filteredFestivals = useMemo(() => {
    return INDIAN_FESTIVALS.filter((fest) => {
      // Month filter
      if (selectedMonth !== 0 && fest.monthIndex !== selectedMonth) {
        return false;
      }

      // Day filter (if user clicked a day in month grid)
      if (selectedDay !== null && selectedMonth !== 0) {
        const start = fest.startDay || 1;
        const end = fest.endDay || (start + 5);
        if (selectedDay < start || selectedDay > end) {
          return false;
        }
      }

      // State filter
      if (selectedState !== 'All') {
        const cleanState = fest.state.replace(/\s*\(UT\)/i, '').trim();
        if (cleanState.toLowerCase() !== selectedState.toLowerCase()) return false;
      }

      // Region filter
      if (selectedRegion !== 'All') {
        // Find state's region
        const cleanState = fest.state.replace(/\s*\(UT\)/i, '').trim();
        const stateMeta = ALL_28_INDIAN_STATES.find(
          (s) => s.name.toLowerCase() === cleanState.toLowerCase()
        );
        if (stateMeta && stateMeta.region !== selectedRegion) {
          return false;
        }
      }

      // Season filter
      if (selectedSeason !== 'All' && fest.season !== selectedSeason) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && fest.category !== selectedCategory) {
        return false;
      }

      // Preset filter
      if (activePreset) {
        const nameLower = fest.name.toLowerCase();
        if (activePreset === 'big-three') {
          if (!nameLower.includes('diwali') && !nameLower.includes('holi') && !nameLower.includes('pushkar')) {
            return false;
          }
        } else if (activePreset === 'unesco') {
          if (!nameLower.includes('durga') && !nameLower.includes('kumbh') && !nameLower.includes('diwali')) {
            return false;
          }
        } else if (activePreset === 'desert') {
          if (fest.category !== 'Desert Fair' && !nameLower.includes('pushkar') && !nameLower.includes('rann')) {
            return false;
          }
        } else if (activePreset === 'tribal') {
          if (
            !nameLower.includes('hornbill') &&
            !nameLower.includes('wangala') &&
            !nameLower.includes('bastar') &&
            !nameLower.includes('losar')
          ) {
            return false;
          }
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          fest.name.toLowerCase().includes(q) ||
          fest.destination.toLowerCase().includes(q) ||
          fest.state.toLowerCase().includes(q) ||
          fest.significance.toLowerCase().includes(q) ||
          fest.approxMonth.toLowerCase().includes(q) ||
          fest.culturalInsight.toLowerCase().includes(q) ||
          fest.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    }).sort((a, b) => a.monthIndex - b.monthIndex);
  }, [
    selectedMonth,
    selectedDay,
    selectedState,
    selectedRegion,
    selectedCategory,
    selectedSeason,
    activePreset,
    searchQuery,
  ]);

  // Group festivals by month for Calendar Timeline View
  const groupedByMonth = useMemo(() => {
    const groups: { [key: number]: IndianFestival[] } = {};
    filteredFestivals.forEach((f) => {
      if (!groups[f.monthIndex]) groups[f.monthIndex] = [];
      groups[f.monthIndex].push(f);
    });
    return groups;
  }, [filteredFestivals]);

  // Calculate day markers for the currently active month
  const activeMonthMeta = useMemo(() => {
    return MONTHS.find((m) => m.index === (selectedMonth || 10)) || MONTHS[10];
  }, [selectedMonth]);

  const festivalsInActiveMonth = useMemo(() => {
    const mIdx = selectedMonth === 0 ? 10 : selectedMonth; // Default to Oct/Nov peak
    return INDIAN_FESTIVALS.filter((f) => f.monthIndex === mIdx);
  }, [selectedMonth]);

  const resetAllFilters = () => {
    setSelectedMonth(0);
    setSelectedDay(null);
    setSelectedState('All');
    setSelectedRegion('All');
    setSelectedCategory('All');
    setSelectedSeason('All');
    setActivePreset(null);
    setSearchQuery('');
  };

  const isAnyFilterActive =
    selectedMonth !== 0 ||
    selectedDay !== null ||
    selectedState !== 'All' ||
    selectedRegion !== 'All' ||
    selectedCategory !== 'All' ||
    selectedSeason !== 'All' ||
    activePreset !== null ||
    searchQuery !== '';

  return (
    <div className="space-y-8">
      {/* 1. EDITORIAL HEADER BANNER */}
      <div
        className={`p-6 md:p-8 rounded-3xl border relative overflow-hidden transition-all ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/40 via-[#11171C] to-[#11171C] border-amber-500/30 shadow-2xl'
            : 'bg-amber-50/70 border-amber-200 shadow-md'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono-num text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>EXPLORE INDIA · INTERACTIVE FESTIVALS & DESTINATION CALENDAR</span>
            </div>
            <h2 className="font-editorial text-3xl md:text-5xl font-bold text-white tracking-tight">
              Festivals & Cultural Events
            </h2>
            <p className="text-xs md:text-sm text-stone-300 font-sans-ui leading-relaxed">
              Experience India’s greatest living spectacles—from the 2.5 million lamps of <strong>Diwali</strong> in Ayodhya and the ecstatic colors of <strong>Holi</strong> in Vrindavan, to the legendary <strong>Pushkar Camel Fair</strong> in the Thar dunes. Filter by exact month, season, or state, and link each event directly to curated travel destinations and AI trip planning.
            </p>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1.5 rounded-2xl border border-white/10 shrink-0 self-start md:self-center">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Chronological timeline view"
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Calendar Timeline</span>
            </button>
            <button
              onClick={() => setViewMode('month-grid')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'month-grid'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Interactive monthly matrix"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Day Matrix</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Cards grid view"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Cards ({filteredFestivals.length})</span>
            </button>
          </div>
        </div>

        {/* Quick Cultural Presets */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] font-mono-num text-stone-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Featured Highlights:</span>
          </span>
          {[
            { id: 'big-three', label: 'Diwali · Holi · Pushkar', icon: '✨' },
            { id: 'unesco', label: 'UNESCO Intangible Heritage', icon: '🏛' },
            { id: 'desert', label: 'Desert & Dunes Fairs', icon: '🐪' },
            { id: 'tribal', label: 'Tribal & Indigenous (Hornbill/Wangala)', icon: '🪘' },
          ].map((preset) => {
            const isSelected = activePreset === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => {
                  if (isSelected) {
                    setActivePreset(null);
                  } else {
                    setActivePreset(preset.id);
                    setSelectedMonth(0);
                    setSelectedState('All');
                  }
                }}
                className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer border flex items-center gap-1 ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-sm'
                    : 'bg-black/30 border-white/10 text-stone-300 hover:text-white hover:border-amber-400/40'
                }`}
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. SCROLLABLE INTERACTIVE MONTH HORIZON (DATE-BASED FILTERING) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-mono-num text-stone-400 px-1">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Scrollable Date & Month Horizon</span>
            </span>
            <span className="text-stone-500 hidden sm:inline">· Scroll horizontally or click any month</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedMonth !== 0 && (
              <button
                onClick={() => {
                  setSelectedMonth(0);
                  setSelectedDay(null);
                }}
                className="text-[11px] text-amber-400 hover:underline cursor-pointer"
              >
                Clear Month
              </button>
            )}
            <span>
              Active: <strong className="text-white font-bold">{MONTHS.find((m) => m.index === selectedMonth)?.label}</strong>
            </span>
          </div>
        </div>

        {/* Scrollable Month Carousel */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-3 pt-1 scrollbar-thin">
          {MONTHS.map((m) => {
            const isSelected = selectedMonth === m.index;
            const countInMonth =
              m.index === 0
                ? INDIAN_FESTIVALS.length
                : INDIAN_FESTIVALS.filter((f) => f.monthIndex === m.index).length;

            return (
              <button
                key={m.index}
                onClick={() => {
                  setSelectedMonth(m.index);
                  setSelectedDay(null);
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer shrink-0 min-w-[110px] group ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-lg scale-105 font-bold'
                    : isDark
                    ? 'bg-[#12181E] border-white/10 hover:border-amber-400/40 text-stone-300'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-base">{m.icon}</span>
                  <span
                    className={`text-[10px] font-mono-num px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-black/20 text-stone-950' : 'bg-white/10 text-amber-400'
                    }`}
                  >
                    {countInMonth} {countInMonth === 1 ? 'event' : 'events'}
                  </span>
                </div>
                <span className="text-xs font-bold block">{m.label}</span>
                <span
                  className={`text-[10px] block mt-0.5 font-mono-num ${
                    isSelected ? 'text-stone-950/80' : 'text-stone-400'
                  }`}
                >
                  {m.season}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. INTERACTIVE MONTHLY DAY MATRIX VIEW (Shown when month-grid active or month clicked) */}
      {viewMode === 'month-grid' && (
        <div
          className={`p-5 rounded-3xl border transition-all ${
            isDark ? 'bg-[#0E1418] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{activeMonthMeta.icon}</span>
                <h3 className="font-editorial text-xl font-bold text-white">
                  {activeMonthMeta.label} Interactive Calendar Matrix
                </h3>
                <span className="text-xs font-mono-num px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {festivalsInActiveMonth.length} Festivals Plotted
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans-ui mt-0.5">
                Click any highlighted day to filter directly to the rituals and celebrations occurring on that date.
              </p>
            </div>

            {selectedDay !== null && (
              <button
                onClick={() => setSelectedDay(null)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono-num hover:bg-amber-500/30 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Show all days in {activeMonthMeta.label}</span>
              </button>
            )}
          </div>

          {/* Interactive Day Grid */}
          <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 gap-1.5 text-center font-mono-num">
            {Array.from({ length: activeMonthMeta.days }, (_, i) => i + 1).map((day) => {
              // Check if any festival in this month spans this day
              const matchingFests = festivalsInActiveMonth.filter((f) => {
                const start = f.startDay || 1;
                const end = f.endDay || (start + 4);
                return day >= start && day <= end;
              });

              const hasFestivals = matchingFests.length > 0;
              const isDaySelected = selectedDay === day;

              return (
                <button
                  key={day}
                  onClick={() => {
                    if (hasFestivals) {
                      setSelectedDay(isDaySelected ? null : day);
                    }
                  }}
                  disabled={!hasFestivals}
                  className={`p-2 rounded-xl text-xs flex flex-col items-center justify-between min-h-[58px] transition-all border ${
                    isDaySelected
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-300 shadow-lg scale-105'
                      : hasFestivals
                      ? 'bg-amber-950/40 border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-900/40 cursor-pointer shadow-sm'
                      : 'bg-black/20 border-white/5 text-stone-600 cursor-not-allowed opacity-40'
                  }`}
                  title={
                    hasFestivals
                      ? `${activeMonthMeta.short} ${day}: ${matchingFests.map((f) => f.name).join(', ')}`
                      : `${activeMonthMeta.short} ${day}`
                  }
                >
                  <span className="font-bold text-xs">{day}</span>
                  {hasFestivals && (
                    <div className="w-full flex items-center justify-center gap-0.5 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      <span className="text-[9px] truncate max-w-[45px] font-semibold">
                        {matchingFests[0].name.split(' ')[0]}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Day Detail Banner */}
          {selectedDay !== null && (
            <div className="mt-4 p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-amber-400" />
                <span className="text-stone-200">
                  Showing festivals active on{' '}
                  <strong className="text-amber-300">
                    {activeMonthMeta.label} {selectedDay}
                  </strong>
                </span>
              </div>
              <span className="text-stone-400 font-mono-num text-[11px]">
                {filteredFestivals.length} event(s)
              </span>
            </div>
          )}
        </div>
      )}

      {/* 4. STATE-BASED & REGIONAL FILTERS (Scrollable State Chips + Dropdown) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono-num text-stone-400 px-1 gap-2">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>State-Based Festival Filter</span>
            </span>
            <span>·</span>
            <span className="text-stone-300">
              {availableStates.length} Indian States with Major Festivals
            </span>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {REGIONS.map((r) => {
              const isSelected = selectedRegion === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRegion(r.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-white bg-black/30'
                  }`}
                >
                  {r.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Scrollable State Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            onClick={() => setSelectedState('All')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
              selectedState === 'All'
                ? 'bg-white text-stone-950 font-bold border-white shadow-md'
                : isDark
                ? 'bg-[#11171C] border-white/10 text-stone-400 hover:text-stone-200'
                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
            }`}
          >
            All States ({INDIAN_FESTIVALS.length})
          </button>

          {availableStates.map(([stateName, count]) => {
            const isSelected = selectedState.toLowerCase() === stateName.toLowerCase();
            return (
              <button
                key={stateName}
                onClick={() => setSelectedState(isSelected ? 'All' : stateName)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md'
                    : isDark
                    ? 'bg-[#11171C] border-white/10 text-stone-400 hover:text-stone-200 hover:border-white/20'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{stateName}</span>
                <span
                  className={`text-[10px] font-mono-num px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-stone-950/20 text-stone-950 font-bold' : 'bg-black/30 text-amber-400'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. SEARCH BAR, SEASONS & CATEGORY FILTERS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Quick Search */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by festival (Diwali, Holi, Pushkar, Bihu), state, city, rituals, or food..."
              className={`w-full pl-10 pr-16 py-2.5 rounded-2xl text-xs sm:text-sm border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all ${
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
                Clear
              </button>
            )}
          </div>

          {/* State Dropdown Selector for Rapid Access */}
          <div className="w-full sm:w-56 shrink-0">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className={`w-full py-2.5 px-3 rounded-2xl text-xs border focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono-num ${
                isDark ? 'bg-[#11171C] border-white/10 text-stone-200' : 'bg-white border-stone-200 text-stone-800'
              }`}
            >
              <option value="All">All States ({INDIAN_FESTIVALS.length} festivals)</option>
              {availableStates.map(([stateName, count]) => (
                <option key={stateName} value={stateName}>
                  {stateName} ({count})
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters Button */}
          {isAnyFilterActive && (
            <button
              onClick={resetAllFilters}
              className="px-4 py-2.5 rounded-2xl text-xs font-mono-num text-amber-400 hover:bg-amber-400/10 border border-amber-400/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Season & Category Filter Horizon */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin flex-1">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-semibold shadow-sm'
                      : isDark
                      ? 'bg-[#11171C] border-white/10 text-stone-400 hover:text-stone-200'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Seasons Pills */}
          <div className="flex items-center gap-1 shrink-0 overflow-x-auto">
            {SEASONS.map((s) => {
              const isSelected = selectedSeason === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedSeason(s.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono-num transition-colors cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-bold border-amber-400'
                      : 'border-white/10 bg-black/20 text-stone-400 hover:text-white'
                  }`}
                >
                  <span>{s.icon} </span>
                  <span>{s.id}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header Status */}
      <div className="flex items-center justify-between text-xs text-stone-400 border-b border-white/5 pb-2">
        <span>
          Showing <strong className="text-white font-mono-num">{filteredFestivals.length}</strong> festivals matching active date, state & category filters
        </span>
        <span className="font-mono-num text-[11px] text-amber-400 hidden sm:inline">
          Each festival is directly linked to relevant travel destinations & instant AI planning
        </span>
      </div>

      {/* 6. MAIN VIEW CONTENT */}

      {/* VIEW 1: Chronological Calendar Timeline View */}
      {viewMode === 'timeline' && (
        <div className="space-y-12">
          {Object.keys(groupedByMonth).length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-black/20 border border-white/5 space-y-3">
              <CalendarIcon className="w-8 h-8 text-stone-500 mx-auto" />
              <h4 className="text-sm font-semibold text-stone-300">No festivals found for this filter</h4>
              <p className="text-xs text-stone-500">
                Try selecting "All Year" or clearing the state filter to view the complete annual cycle.
              </p>
              <button
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl text-xs bg-amber-500 text-stone-950 font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            MONTHS.filter((m) => m.index > 0 && groupedByMonth[m.index]?.length > 0).map((m) => (
              <div key={m.index} className="space-y-5">
                {/* Month Milestone Header */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono-num text-xs font-bold shrink-0">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{m.label.toUpperCase()}</span>
                    <span>·</span>
                    <span>{m.season} Season</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                    <span>
                      {groupedByMonth[m.index].length}{' '}
                      {groupedByMonth[m.index].length === 1 ? 'Festival' : 'Festivals'}
                    </span>
                  </div>
                  <div className="h-px bg-white/10 flex-1" />
                </div>

                {/* Festivals in this Month */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {groupedByMonth[m.index].map((fest) => (
                    <FestivalCard
                      key={fest.id}
                      fest={fest}
                      isDark={isDark}
                      onSelect={() => setSelectedFestivalModal(fest)}
                      onPlanDestination={onSelectDestinationForPlanning}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW 2: Month Grid View (Shows Agenda below the matrix) */}
      {viewMode === 'month-grid' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredFestivals.map((fest) => (
              <FestivalCard
                key={fest.id}
                fest={fest}
                isDark={isDark}
                onSelect={() => setSelectedFestivalModal(fest)}
                onPlanDestination={onSelectDestinationForPlanning}
              />
            ))}
          </div>

          {filteredFestivals.length === 0 && (
            <div className="p-8 text-center rounded-2xl bg-black/20 border border-white/5 text-xs text-stone-400">
              No festivals matching the selected day or filters. Click another date in the matrix above.
            </div>
          )}
        </div>
      )}

      {/* VIEW 3: Grid Cards View */}
      {viewMode === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFestivals.map((fest) => (
            <FestivalCard
              key={fest.id}
              fest={fest}
              isDark={isDark}
              onSelect={() => setSelectedFestivalModal(fest)}
              onPlanDestination={onSelectDestinationForPlanning}
            />
          ))}
        </div>
      )}

      {/* Festival Inspection & Details Modal (with linked travel destinations) */}
      {selectedFestivalModal && (
        <FestivalModal
          fest={selectedFestivalModal}
          isDark={isDark}
          onClose={() => setSelectedFestivalModal(null)}
          onPlanDestination={onSelectDestinationForPlanning}
        />
      )}
    </div>
  );
};

// ==========================================
// Sub-Component: Festival Card with Linked Destinations
// ==========================================
interface FestivalCardProps {
  fest: IndianFestival;
  isDark: boolean;
  onSelect: () => void;
  onPlanDestination: (destName: string) => void;
}

const FestivalCard: React.FC<FestivalCardProps> = ({
  fest,
  isDark,
  onSelect,
  onPlanDestination,
}) => {
  const linkedDestinations = useMemo(() => getLinkedDestinations(fest), [fest]);

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between group ${
        isDark
          ? 'bg-[#11171C] border-white/10 hover:border-amber-400/40 shadow-sm hover:shadow-xl'
          : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Banner Image with Date Badge */}
      <div className="relative h-56 w-full overflow-hidden bg-stone-900 cursor-pointer" onClick={onSelect}>
        <img
          src={fest.imageUrl}
          alt={fest.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

        {/* Date & State Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[10px] font-mono-num uppercase px-2.5 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-amber-300 border border-white/10 font-bold flex items-center gap-1 shadow-sm">
            <CalendarIcon className="w-3 h-3 text-amber-400" />
            <span>{fest.approxDateRange}</span>
          </span>

          <span className="text-[10px] font-mono-num px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-stone-200 border border-white/10 font-semibold">
            {fest.state}
          </span>
        </div>

        <div className="absolute bottom-3 left-4 right-4">
          <span className="text-[10px] font-mono-num text-amber-400 font-bold uppercase tracking-wider block mb-0.5">
            {fest.destination} · {fest.category}
          </span>
          <h4 className="font-editorial text-2xl font-bold text-white leading-tight group-hover:text-amber-200 transition-colors">
            {fest.name}
          </h4>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <p className="text-xs text-stone-300 font-sans-ui leading-relaxed line-clamp-3">
            {fest.significance}
          </p>

          <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs text-stone-300 flex items-start gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="italic text-[11px] text-stone-300 line-clamp-2">
              "{fest.culturalInsight}"
            </p>
          </div>

          {/* Linked Travel Destinations Preview */}
          <div className="pt-2 border-t border-white/5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono-num text-stone-400">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <MapPin className="w-3 h-3 text-amber-400" />
                <span>Relevant Travel Destinations ({linkedDestinations.length}):</span>
              </span>
              <span>Click to plan</span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {linkedDestinations.map((d) => (
                <button
                  key={d.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlanDestination(d.name);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 hover:border-amber-400 text-stone-300 hover:text-amber-300 text-[11px] font-mono-num flex items-center gap-1.5 transition-colors cursor-pointer group/dest"
                  title={`Plan a trip to ${d.name} (${d.state})`}
                >
                  <span className="truncate max-w-[130px] font-medium">{d.name}</span>
                  <span className="text-[9px] text-emerald-400 font-bold">₹{d.avgDailyBudgetINR.toLocaleString('en-IN')}/d</span>
                  <ChevronRight className="w-3 h-3 text-stone-500 group-hover/dest:text-amber-300 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <button
            onClick={onSelect}
            className="text-xs text-stone-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-mono-num"
          >
            <span>View Rituals & Tips</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          <button
            onClick={() => onPlanDestination(fest.destination.split('&')[0].trim())}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 transition-all flex items-center gap-1.5 cursor-pointer font-bold shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            <span>AI Plan Trip</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// Sub-Component: Festival Details Modal
// ==========================================
interface FestivalModalProps {
  fest: IndianFestival;
  isDark: boolean;
  onClose: () => void;
  onPlanDestination: (destName: string) => void;
}

const FestivalModal: React.FC<FestivalModalProps> = ({
  fest,
  isDark,
  onClose,
  onPlanDestination,
}) => {
  const linkedDestinations = useMemo(() => getLinkedDestinations(fest), [fest]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-3xl border overflow-hidden shadow-2xl relative max-h-[92vh] flex flex-col ${
          isDark ? 'bg-[#10161B] border-amber-500/30 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Modal Image Header */}
        <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-stone-900 shrink-0">
          <img
            src={fest.imageUrl}
            alt={fest.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors cursor-pointer border border-white/20 z-10"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs font-mono-num text-amber-300 font-bold mb-1 flex-wrap">
              <span className="uppercase px-2.5 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/40">
                {fest.category}
              </span>
              <span>·</span>
              <span>{fest.approxDateRange}</span>
              <span>·</span>
              <span>{fest.season} Season</span>
            </div>
            <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-white">
              {fest.name}
            </h3>
          </div>
        </div>

        {/* Modal Content Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Key Specs Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-num text-xs">
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-stone-400 block text-[10px]">Primary Host City</span>
              <span className="text-white font-semibold truncate block">{fest.destination}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-stone-400 block text-[10px]">State</span>
              <span className="text-amber-300 font-semibold truncate block">{fest.state}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-stone-400 block text-[10px]">Date Window</span>
              <span className="text-white font-semibold truncate block">{fest.approxDateRange}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-black/30 border border-white/5">
              <span className="text-stone-400 block text-[10px]">Typical Duration</span>
              <span className="text-emerald-400 font-semibold truncate block">{fest.duration}</span>
            </div>
          </div>

          {/* Significance */}
          <div className="space-y-2">
            <h4 className="font-editorial text-base font-bold text-white">
              Significance & Mythological Lore
            </h4>
            <p className="text-stone-300 font-sans-ui leading-relaxed">
              {fest.significance}
            </p>
          </div>

          {/* The Signature Experience */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-mono-num text-amber-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Signature Experience</span>
            </div>
            <p className="text-stone-300 italic font-sans-ui leading-relaxed">
              "{fest.culturalInsight}"
            </p>
          </div>

          {/* Linked Travel Destinations Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-editorial text-base font-bold text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                <span>Linked Travel Destinations ({linkedDestinations.length})</span>
              </h4>
              <span className="text-[11px] font-mono-num text-stone-400">
                Hubs to stay & explore during the festival
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {linkedDestinations.map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-xl bg-black/30 border border-white/10 hover:border-amber-400/50 transition-all flex flex-col justify-between space-y-2"
                >
                  <div>
                    <img
                      src={d.heroImage}
                      alt={d.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-24 rounded-lg object-cover mb-2"
                    />
                    <div className="text-[10px] font-mono-num text-amber-400 font-semibold uppercase">
                      {d.state}
                    </div>
                    <div className="font-editorial text-sm font-bold text-white truncate">
                      {d.name}
                    </div>
                    <div className="text-[11px] text-stone-400 line-clamp-1 font-mono-num">
                      Best: {d.bestTimeToVisit}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono-num text-emerald-400 font-bold">
                      ₹{d.avgDailyBudgetINR.toLocaleString('en-IN')}/d
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onPlanDestination(d.name);
                      }}
                      className="text-[11px] text-amber-300 hover:text-white font-bold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Plan</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insider Travel Tips */}
          <div className="space-y-2">
            <h4 className="font-editorial text-base font-bold text-white">
              Insider Travel & Logistics Tips
            </h4>
            <div className="space-y-1.5 font-sans-ui">
              {fest.tips.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-stone-300">
                  <span className="text-amber-400 font-bold shrink-0">✓</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 px-6 border-t border-white/10 flex items-center justify-between gap-3 bg-black/40">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-medium border border-white/10 hover:bg-white/5 text-stone-300 transition-colors cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              const dest = fest.destination.split('&')[0].trim();
              onClose();
              onPlanDestination(dest);
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-md flex items-center gap-2 font-bold cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Plan Journey to {fest.destination.split('&')[0].trim()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
