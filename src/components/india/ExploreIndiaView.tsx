import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Sparkles,
  Calendar,
  DollarSign,
  ArrowRight,
  Search,
  Filter,
  Flame,
  Award,
  ChevronRight,
  Sun,
  ShieldCheck,
  UtensilsCrossed,
  Layers,
  Heart,
  ExternalLink
} from 'lucide-react';
import {
  ALL_INDIA_DESTINATIONS,
  ALL_28_INDIAN_STATES,
  ALL_UNION_TERRITORIES,
  INDIA_CIRCUITS,
  INDIAN_FESTIVALS,
  searchIndianDestinations,
  IndiaStateMeta
} from '../../data/indiaAllDestinations';
import { IndianDestination, IndiaTravelCategory, IndianCircuit } from '../../types/travel';
import { InteractiveIndiaMap } from './InteractiveIndiaMap';
import { FestivalsCalendarView } from './FestivalsCalendarView';

interface ExploreIndiaViewProps {
  onSelectDestinationForPlanning: (destinationName: string) => void;
  onSelectCircuitForPlanning?: (circuit: IndianCircuit) => void;
  theme: 'dark' | 'light';
  currency: string;
}

export const ExploreIndiaView: React.FC<ExploreIndiaViewProps> = ({
  onSelectDestinationForPlanning,
  onSelectCircuitForPlanning,
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IndiaTravelCategory | 'All'>('All');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedStateCode, setSelectedStateCode] = useState<string | null>('RJ'); // Default to Rajasthan
  const [selectedFestivalState, setSelectedFestivalState] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'map' | 'destinations' | 'circuits' | 'festivals'>('map');

  // Search & Filtered destinations
  const filteredDestinations = searchIndianDestinations(searchQuery).filter((dest) => {
    if (selectedCategory !== 'All' && !dest.categories.includes(selectedCategory)) {
      return false;
    }
    if (selectedRegion !== 'All' && dest.region !== selectedRegion) {
      return false;
    }
    return true;
  });

  const activeStateMeta = [...ALL_28_INDIAN_STATES, ...ALL_UNION_TERRITORIES].find(
    (s) => s.code === selectedStateCode
  );

  const stateDestinations = activeStateMeta
    ? ALL_INDIA_DESTINATIONS.filter((d) =>
        d.state.toLowerCase().includes(activeStateMeta.name.toLowerCase())
      )
    : [];

  const CATEGORIES: Array<{ id: IndiaTravelCategory | 'All'; label: string; icon: string }> = [
    { id: 'All', label: 'All Experiences', icon: '🇮🇳' },
    { id: 'Heritage', label: 'Royal Heritage', icon: '🏰' },
    { id: 'Mountains', label: 'Himalayan Mountains', icon: '🏔' },
    { id: 'Beaches', label: 'Tropical Beaches', icon: '🏖' },
    { id: 'Wildlife', label: 'Tiger Wildlife', icon: '🐅' },
    { id: 'Spiritual', label: 'Spiritual & Sacred', icon: '🛕' },
    { id: 'Food', label: 'Culinary Trails', icon: '🍛' },
    { id: 'Luxury', label: 'Palace Luxury', icon: '💎' },
    { id: 'Adventure', label: 'High Adventure', icon: '🧗' },
    { id: 'Offbeat', label: 'Hidden India', icon: '✨' },
  ];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Editorial Hero Header */}
      <section className="relative rounded-3xl overflow-hidden border border-white/10 p-6 md:p-14 transition-all">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/85 to-stone-950/70" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-num text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse"></span>
            <span>INDIA DESTINATION INTELLIGENCE · 28 STATES & UNION TERRITORIES</span>
          </div>

          <h1 className="font-editorial text-4xl md:text-7xl font-bold text-white tracking-tight leading-none">
            One country. <br />
            <span className="text-amber-300 italic font-serif">A thousand journeys.</span>
          </h1>

          <p className="text-sm md:text-base text-stone-300 font-sans-ui max-w-2xl leading-relaxed">
            From the snow corridors of Kashmir and Ladakh to the sacred temple coasts of Tamil Nadu; from the white salt desert of Kutch to the cloud bridges of Meghalaya. Explore India’s deepest travel ecosystem.
          </p>

          {/* Quick Search Bar */}
          <div className="pt-3">
            <div className="p-2 bg-stone-900/90 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2.5 px-3 flex-1 w-full">
                <Search className="w-4 h-4 text-amber-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 84+ destinations, states, Awadhi cuisine, royal palaces, or hidden gems..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-stone-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  onClick={() => setSearchQuery('')}
                  className="px-3 py-1.5 text-xs text-stone-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={() => onSelectDestinationForPlanning('Rajasthan')}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Plan India Journey</span>
                </button>
              </div>
            </div>

            {/* Quick Keyword Pills */}
            <div className="flex items-center gap-2 mt-3 text-xs text-stone-400 flex-wrap">
              <span className="text-[11px] font-mono-num text-stone-400">Popular shortcuts:</span>
              {[
                'Rajasthan Luxury',
                'Kerala Backwaters',
                'Diwali Deepotsav',
                'Holi Vrindavan',
                'Pushkar Camel Fair',
                'Hornbill Festival',
                'Durga Puja Kolkata',
                'Spiti High Passes',
              ].map((term) => (
                <button
                  key={term}
                  onClick={() => {
                    if (term.includes('Diwali') || term.includes('Holi') || term.includes('Pushkar') || term.includes('Hornbill') || term.includes('Durga')) {
                      setActiveTab('festivals');
                    } else {
                      setSearchQuery(term.split(' ')[0]);
                    }
                  }}
                  className="hover:text-amber-300 underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* AI India Travel Planner Natural Language Request Prompts (Section 8 Requirement) */}
      <section className={`p-5 rounded-2xl border transition-all ${
        isDark ? 'bg-[#0E1418] border-amber-500/20' : 'bg-amber-50/50 border-amber-200'
      }`}>
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-editorial text-lg font-bold text-white">
              AI India Travel Planner — Natural Prompts
            </h3>
          </div>
          <span className="text-[11px] font-mono-num text-amber-400">
            Click any prompt to launch bespoke Indian journey
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {[
            { prompt: 'Plan a 5-day Rajasthan trip under ₹50,000.', target: 'Rajasthan', budget: '₹50,000' },
            { prompt: 'Give me a honeymoon itinerary for Kerala.', target: 'Kerala', budget: '₹75,000' },
            { prompt: 'I have 4 days from Kolkata. Where can I go?', target: 'Darjeeling', budget: '₹25,000' },
            { prompt: 'Plan a family trip to Himachal for 6 people.', target: 'Himachal Pradesh', budget: '₹1,00,000' },
            { prompt: 'Find the best monsoon destinations in India.', target: 'Meghalaya', budget: '₹40,000' },
            { prompt: 'Give me a luxury Rajasthan itinerary.', target: 'Rajasthan', budget: '₹1,50,000' },
            { prompt: 'I want a spiritual trip covering Varanasi and Ayodhya.', target: 'Varanasi', budget: '₹30,000' },
            { prompt: 'Plan a Northeast India adventure.', target: 'Assam & Meghalaya', budget: '₹60,000' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => onSelectDestinationForPlanning(item.target)}
              className="p-3 text-left rounded-xl bg-black/40 border border-white/8 hover:border-amber-400/50 transition-all text-xs group cursor-pointer flex flex-col justify-between gap-2"
            >
              <span className="text-stone-300 font-sans-ui group-hover:text-amber-300 transition-colors leading-relaxed">
                "{item.prompt}"
              </span>
              <div className="flex items-center justify-between text-[10px] font-mono-num text-stone-400 pt-1 border-t border-white/5">
                <span className="text-amber-400 font-bold">{item.target}</span>
                <span className="text-emerald-400">{item.budget}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Main Section Navigation Switcher */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('map')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'map'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive India Map</span>
          </button>
          <button
            onClick={() => setActiveTab('destinations')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'destinations'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Destinations & State Explorer ({ALL_INDIA_DESTINATIONS.length})
          </button>
          <button
            onClick={() => setActiveTab('circuits')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'circuits'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Multi-City Signature Circuits ({INDIA_CIRCUITS.length})
          </button>
          <button
            onClick={() => setActiveTab('festivals')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'festivals'
                ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Festivals & Events</span>
            <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-black/30 text-amber-300 font-bold">
              {INDIAN_FESTIVALS.length}
            </span>
          </button>
        </div>

        <span className="text-xs font-mono-num text-amber-400 hidden sm:inline">
          100% Verified Indian Curations
        </span>
      </div>

      {/* TAB 0: Interactive India Map */}
      {activeTab === 'map' && (
        <InteractiveIndiaMap
          selectedStateCode={selectedStateCode}
          onSelectState={(code) => setSelectedStateCode(code)}
          onSelectDestinationForPlanning={onSelectDestinationForPlanning}
          onViewFestivals={(stateName) => {
            setSelectedFestivalState(stateName);
            setActiveTab('festivals');
          }}
          theme={theme}
          currency={currency}
        />
      )}

      {/* TAB 1: Destinations & State-by-State Explorer */}
      {activeTab === 'destinations' && (
        <div className="space-y-10">
          {/* Interactive State Selector Carousel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-2xl font-bold">
                  All 28 States & Union Territories
                </h3>
                <p className="text-xs text-stone-400">
                  Select any state below to view its featured tourist destinations, seasonal best times, and typical budgets.
                </p>
              </div>
              <span className="text-xs font-mono-num text-stone-400">
                Active: <span className="text-amber-400 font-bold">{activeStateMeta?.name}</span>
              </span>
            </div>

            {/* Scrollable State Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-thin">
              {ALL_28_INDIAN_STATES.map((state) => {
                const isSelected = selectedStateCode === state.code;
                return (
                  <button
                    key={state.code}
                    onClick={() => {
                      setSelectedStateCode(state.code);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm font-semibold'
                        : isDark
                        ? 'bg-[#11171C] border-white/10 text-stone-400 hover:text-stone-200 hover:border-white/20'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{state.name}</span>
                    <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-black/30 text-amber-400">
                      {state.destinationsCount}
                    </span>
                  </button>
                );
              })}

              <div className="h-6 w-px bg-white/20 mx-1 shrink-0" />

              {ALL_UNION_TERRITORIES.map((ut) => {
                const isSelected = selectedStateCode === ut.code;
                return (
                  <button
                    key={ut.code}
                    onClick={() => {
                      setSelectedStateCode(ut.code);
                      setSearchQuery('');
                    }}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-500/20 text-teal-300 border-teal-500/50 shadow-sm font-semibold'
                        : isDark
                        ? 'bg-[#11171C] border-white/10 text-stone-400 hover:text-stone-200'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{ut.name} (UT)</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active State Spotlight Card */}
          {activeStateMeta && (
            <div
              className={`p-6 rounded-2xl border transition-all ${
                isDark
                  ? 'bg-gradient-to-r from-amber-950/20 via-[#11171C] to-[#11171C] border-amber-500/30'
                  : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono-num text-amber-400">
                    <span className="uppercase">{activeStateMeta.region} INDIA</span>
                    <span aria-hidden="true">·</span>
                    <span>CAPITAL: {activeStateMeta.capital}</span>
                    <span aria-hidden="true">·</span>
                    <span>BEST TIME: {activeStateMeta.bestSeason}</span>
                  </div>

                  <h2 className="font-editorial text-3xl md:text-4xl font-bold">
                    {activeStateMeta.name}
                  </h2>

                  <p className="text-xs md:text-sm text-stone-300 font-sans-ui max-w-2xl leading-relaxed">
                    Key Highlights: <span className="text-white font-medium">{activeStateMeta.highlightTag}</span>. Ideal for{' '}
                    <span className="text-amber-300 font-medium">{activeStateMeta.travelStyle}</span> with an estimated{' '}
                    <span className="font-mono-num text-emerald-400">{activeStateMeta.typicalBudget}</span> daily budget.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-stone-400 font-mono-num text-[11px]">Primary destinations:</span>
                    {activeStateMeta.sampleDestinations.map((d) => (
                      <button
                        key={d}
                        onClick={() => onSelectDestinationForPlanning(d)}
                        className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10 hover:border-amber-400 text-stone-200 hover:text-amber-300 transition-colors font-mono-num text-xs cursor-pointer flex items-center gap-1"
                      >
                        <span>{d}</span>
                        <ChevronRight className="w-3 h-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  <button
                    onClick={() => onSelectDestinationForPlanning(activeStateMeta.name)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-bold"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Plan {activeStateMeta.name} Trip</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedFestivalState(activeStateMeta.name);
                      setActiveTab('festivals');
                    }}
                    className="w-full sm:w-auto px-4 py-3 rounded-xl text-xs font-semibold bg-black/40 hover:bg-black/60 text-amber-300 border border-amber-500/30 hover:border-amber-400 transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>View Festivals</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Experience Filter Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white text-stone-950 font-bold border-white shadow-md'
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

          {/* Destinations Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>
                Showing <strong className="text-white font-mono-num">{filteredDestinations.length}</strong> Indian destinations
              </span>
              <span>Sorted by Cultural & Historical Prominence</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between group ${
                    isDark
                      ? 'bg-[#11171C] border-white/10 hover:border-amber-400/40'
                      : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
                  }`}
                >
                  {/* Destination Top Hero Image */}
                  <div className="relative h-52 w-full overflow-hidden bg-stone-900">
                    <img
                      src={dest.heroImage}
                      alt={dest.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-amber-300 border border-white/10">
                        {dest.state}
                      </span>
                      <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-emerald-400 border border-white/10 font-bold">
                        {dest.estimatedBudget} · ₹{dest.avgDailyBudgetINR.toLocaleString('en-IN')}/day
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="text-[11px] font-mono-num text-amber-300 font-semibold mb-0.5">
                        {dest.region} India · {dest.recommendedDuration}
                      </div>
                      <h4 className="font-editorial text-2xl font-bold text-white leading-tight">
                        {dest.name}
                      </h4>
                    </div>
                  </div>

                  {/* Destination Card Body */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <p className="text-xs text-stone-300 font-sans-ui leading-relaxed line-clamp-3">
                        {dest.description}
                      </p>

                      {/* Category Badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {dest.categories.map((c) => (
                          <span
                            key={c}
                            className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-white/5 border border-white/10 text-stone-300"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Signature Dishes & Attractions */}
                      <div className="pt-2 border-t border-white/5 space-y-1.5 text-xs">
                        <div className="flex items-start gap-1.5">
                          <span className="text-[10px] font-mono-num uppercase text-stone-400 shrink-0">
                            Must Try:
                          </span>
                          <span className="text-stone-300 font-medium truncate">
                            {dest.signatureDishes.slice(0, 2).join(' · ')}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-[10px] font-mono-num uppercase text-stone-400 shrink-0">
                            Highlights:
                          </span>
                          <span className="text-stone-300 truncate">
                            {dest.attractions.slice(0, 2).join(' · ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                      <div className="text-[10px] font-mono-num text-stone-400">
                        <span>Best: </span>
                        <span className="text-amber-300 font-semibold">{dest.bestTimeToVisit}</span>
                      </div>

                      <button
                        onClick={() => onSelectDestinationForPlanning(dest.name)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 transition-all flex items-center gap-1 cursor-pointer"
                      >
                        <span>Plan Trip</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Multi-City Signature Circuits */}
      {activeTab === 'circuits' && (
        <div className="space-y-6">
          <div>
            <h3 className="font-editorial text-2xl md:text-3xl font-bold">
              Multi-City Route Optimized Circuits
            </h3>
            <p className="text-xs text-stone-400">
              Intelligently sequenced journeys minimizing travel time and maximizing regional immersion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INDIA_CIRCUITS.map((circuit) => (
              <div
                key={circuit.id}
                className={`rounded-2xl border overflow-hidden p-6 transition-all flex flex-col justify-between ${
                  isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded text-amber-400 bg-amber-950/40 border border-amber-500/30">
                        {circuit.durationDays} Days · {circuit.theme}
                      </span>
                      <h4 className="font-editorial text-2xl font-bold mt-2">
                        {circuit.title}
                      </h4>
                      <p className="text-xs text-stone-400 font-mono-num mt-0.5">
                        {circuit.subtitle}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-stone-400 block font-mono-num">Est. Budget</span>
                      <span className="text-emerald-400 font-bold font-mono-num text-sm">
                        ₹{circuit.typicalBudgetINR.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Route Sequence Waypoints */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-2">
                    {circuit.route.map((city, idx) => (
                      <React.Fragment key={city}>
                        <span className="px-2.5 py-1 rounded-md bg-black/40 border border-white/10 text-xs font-mono-num text-stone-200 whitespace-nowrap">
                          {city}
                        </span>
                        {idx < circuit.route.length - 1 && (
                          <ChevronRight className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="space-y-1.5 text-xs text-stone-300 font-sans-ui bg-black/20 p-3.5 rounded-xl border border-white/5">
                    {circuit.highlights.map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold shrink-0">✓</span>
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                  <span className="text-xs text-stone-400">
                    Full logistics, stays & pacing pre-configured
                  </span>
                  <button
                    onClick={() => {
                      if (onSelectCircuitForPlanning) {
                        onSelectCircuitForPlanning(circuit);
                      } else {
                        onSelectDestinationForPlanning(circuit.route[1] || circuit.title);
                      }
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch This Itinerary</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Festivals & Events Cultural Calendar */}
      {activeTab === 'festivals' && (
        <FestivalsCalendarView
          onSelectDestinationForPlanning={onSelectDestinationForPlanning}
          theme={theme}
          currency={currency}
          initialStateFilter={selectedFestivalState}
        />
      )}
    </div>
  );
};
