import React, { useState, useMemo } from 'react';
import {
  Compass,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Check,
  ChevronRight,
  Search,
  Plus,
  Star,
  Bookmark,
  BookmarkCheck,
  Eye,
  Camera,
  Info,
  X,
  Landmark,
  Mountain,
  Sun,
  Filter,
  ArrowRight,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { Destination, DestinationPlace } from '../../types/travel';
import { MOCK_DESTINATIONS } from '../../data/mockData';

interface DestinationExplorerProps {
  onSelectDestinationForPlanning: (destName: string) => void;
  onAddDestinationToTrip?: (destName: string) => void;
  onSwitchActiveTripToDestination?: (destName: string) => void;
  onAddPlaceToItinerary?: (place: DestinationPlace) => void;
  currentTripDestinations?: string[];
  theme: 'dark' | 'light';
  currency: string;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  onSelectDestinationForPlanning,
  onAddDestinationToTrip,
  onSwitchActiveTripToDestination,
  onAddPlaceToItinerary,
  currentTripDestinations = [],
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [selectedDestId, setSelectedDestId] = useState<string>(MOCK_DESTINATIONS[0].id);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Places filtering and search
  const [placeCategoryFilter, setPlaceCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [savedPlaceIds, setSavedPlaceIds] = useState<Set<string>>(new Set());
  const [inspectingPlace, setInspectingPlace] = useState<DestinationPlace | null>(null);

  // Custom user places stored locally
  const [customPlacesMap, setCustomPlacesMap] = useState<Record<string, DestinationPlace[]>>({});
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState<boolean>(false);

  // New place form state
  const [newPlaceName, setNewPlaceName] = useState<string>('');
  const [newPlaceCity, setNewPlaceCity] = useState<string>('');
  const [newPlaceCategory, setNewPlaceCategory] = useState<DestinationPlace['category']>('Palace');
  const [newPlaceTagline, setNewPlaceTagline] = useState<string>('');
  const [newPlaceDescription, setNewPlaceDescription] = useState<string>('');
  const [newPlaceDuration, setNewPlaceDuration] = useState<string>('2 hours');
  const [newPlaceBestTime, setNewPlaceBestTime] = useState<DestinationPlace['bestTimeOfDay']>('Morning');
  const [newPlaceEntryFee, setNewPlaceEntryFee] = useState<string>('₹200');
  const [newPlaceTip, setNewPlaceTip] = useState<string>('');

  const selectedDest =
    MOCK_DESTINATIONS.find((d) => d.id === selectedDestId) || MOCK_DESTINATIONS[0];

  const cityName = selectedDest.name.split('—')[0].split(',')[0].trim();
  const isInTrip = currentTripDestinations.some(
    (d) => d.toLowerCase().includes(cityName.toLowerCase()) || cityName.toLowerCase().includes(d.toLowerCase())
  );

  // All places for current destination (base places + any user custom places)
  const allCurrentPlaces = useMemo(() => {
    const basePlaces = selectedDest.places || [];
    const customPlaces = customPlacesMap[selectedDest.id] || [];
    return [...customPlaces, ...basePlaces];
  }, [selectedDest, customPlacesMap]);

  // Filtered places
  const filteredPlaces = useMemo(() => {
    return allCurrentPlaces.filter((pl) => {
      // Category filter
      const matchesCategory =
        placeCategoryFilter === 'All' ||
        (placeCategoryFilter === 'Forts & Palaces' && (pl.category === 'Fort' || pl.category === 'Palace')) ||
        (placeCategoryFilter === 'Nature & Scenic' && (pl.category === 'Nature' || pl.category === 'Coast')) ||
        (placeCategoryFilter === 'Temples & Sacred' && pl.category === 'Temple') ||
        (placeCategoryFilter === 'Heritage & Culture' && (pl.category === 'Heritage' || pl.category === 'Market' || pl.category === 'Experience')) ||
        (placeCategoryFilter === 'Viewpoints' && pl.category === 'Viewpoint');

      // Search query
      const matchesSearch =
        searchQuery === '' ||
        pl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pl.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pl.highlight.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [allCurrentPlaces, placeCategoryFilter, searchQuery]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAddDestination = () => {
    if (onAddDestinationToTrip) {
      onAddDestinationToTrip(cityName);
      showToast(`✓ Added ${cityName} to active itinerary destinations!`);
    }
  };

  const handleToggleSavePlace = (placeId: string, placeName: string) => {
    setSavedPlaceIds((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
        showToast(`Removed "${placeName}" from saved places`);
      } else {
        next.add(placeId);
        showToast(`✓ Bookmarked "${placeName}" in your saved places`);
      }
      return next;
    });
  };

  const handleAddPlace = (place: DestinationPlace) => {
    if (onAddPlaceToItinerary) {
      onAddPlaceToItinerary(place);
      showToast(`✓ Added "${place.name}" directly to your active itinerary!`);
    } else {
      showToast(`✓ Selected "${place.name}" for your journey!`);
    }
  };

  const handleCreateCustomPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim()) return;

    const newPlace: DestinationPlace = {
      id: `custom-pl-${Date.now()}`,
      name: newPlaceName.trim(),
      city: newPlaceCity.trim() || selectedDest.name.split('—')[0].trim(),
      category: newPlaceCategory,
      tagline: newPlaceTagline.trim() || 'Custom curated landmark',
      description: newPlaceDescription.trim() || 'Custom landmark added by traveler.',
      imageUrl: selectedDest.imageUrl,
      recommendedDuration: newPlaceDuration,
      bestTimeOfDay: newPlaceBestTime,
      entryFee: newPlaceEntryFee || 'Free',
      rating: 4.9,
      reviewsCount: 1,
      highlight: newPlaceTip || 'Traveler-curated personal recommendation.',
      curatorTip: newPlaceTip || 'Added by you to this destination dossier.',
      coordinates: selectedDest.coordinates
    };

    setCustomPlacesMap((prev) => ({
      ...prev,
      [selectedDest.id]: [newPlace, ...(prev[selectedDest.id] || [])]
    }));

    setIsAddPlaceModalOpen(false);
    // Reset form
    setNewPlaceName('');
    setNewPlaceCity('');
    setNewPlaceTagline('');
    setNewPlaceDescription('');
    setNewPlaceTip('');

    showToast(`✓ Added new place "${newPlace.name}" to ${selectedDest.name}!`);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs md:text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
            <Compass className="w-4 h-4 text-emerald-400" />
            <span>GLOBAL DESTINATION & LANDMARK DOSSIER</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
            Destination & Places Explorer
          </h1>
          <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-2xl">
            Explore authentic regions across India, inspect must-visit iconic landmarks, add places straight to your itinerary, and curate custom hidden gems.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddPlaceModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Place to {cityName}</span>
          </button>
        </div>
      </div>

      {/* Destination Grid Selector (10 curated destinations) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-400 font-mono-num">
          <span>SELECT DESTINATION REGION ({MOCK_DESTINATIONS.length} REGIONS AVAILABLE)</span>
          <span>{allCurrentPlaces.length} CURATED PLACES IN THIS DESTINATION</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {MOCK_DESTINATIONS.map((dest) => {
            const isSelected = dest.id === selectedDestId;
            const placeCount = (dest.places?.length || 0) + (customPlacesMap[dest.id]?.length || 0);

            return (
              <button
                key={dest.id}
                onClick={() => {
                  setSelectedDestId(dest.id);
                  setSearchQuery('');
                  setPlaceCategoryFilter('All');
                }}
                className={`rounded-xl p-3 border text-left transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm ring-1 ring-emerald-500/50'
                    : isDark
                    ? 'bg-[#11171C] border-white/10 text-stone-400 hover:text-white hover:bg-white/5'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono-num uppercase tracking-wider block text-emerald-400">
                    {dest.country}
                  </span>
                  <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded bg-white/10 text-stone-300">
                    {placeCount} places
                  </span>
                </div>
                <span className="text-xs font-bold font-editorial truncate block text-stone-200 mt-1">
                  {dest.name.split('—')[0]}
                </span>
                <span className="text-[10px] text-stone-400 truncate block mt-0.5">
                  {dest.tagline.split(',')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Destination Deep Dive Card */}
      <div
        className={`rounded-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        {/* Cinematic Hero Banner */}
        <div className="relative h-64 md:h-96 w-full overflow-hidden">
          <img
            src={selectedDest.imageUrl}
            alt={selectedDest.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

          <div className="absolute top-6 left-6 flex items-center gap-2">
            <span className="text-xs font-mono-num font-semibold uppercase px-3 py-1 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
              {selectedDest.country} · Intelligence Dossier
            </span>
            <span className="text-xs font-mono-num px-3 py-1 rounded bg-emerald-950/80 backdrop-blur-md text-emerald-200 border border-emerald-500/30">
              {allCurrentPlaces.length} Places Cataloged
            </span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="font-editorial text-3xl md:text-5xl font-bold text-white tracking-tight">
                {selectedDest.name}
              </h2>
              <p className="text-xs md:text-sm text-stone-300 font-sans-ui mt-1 max-w-xl">
                {selectedDest.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {isInTrip ? (
                <div className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 backdrop-blur-md">
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                  <span>In Active Journey</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleAddDestination}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                  >
                    <span>+ Add Destination to Journey</span>
                  </button>
                  {onSwitchActiveTripToDestination && (
                    <button
                      onClick={() => onSwitchActiveTripToDestination(selectedDest.name)}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 font-bold"
                      title="Switch the entire app to this destination immediately"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                      <span>Switch Active Trip Here</span>
                    </button>
                  )}
                </>
              )}

              <button
                onClick={() => onSelectDestinationForPlanning(selectedDest.name)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 cursor-pointer shrink-0 transition-transform active:scale-95"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-200" />
                <span>Customize with AI →</span>
              </button>
            </div>
          </div>
        </div>

        {/* Detailed Insights & Breakdown */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Key Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono-num uppercase tracking-wider text-stone-400">
                Best Climate Window
              </span>
              <span className="text-xs font-semibold text-white block">
                {selectedDest.bestTime}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono-num uppercase tracking-wider text-stone-400">
                Typical Budget Tier
              </span>
              <span className="text-xs font-semibold text-emerald-400 block font-mono-num">
                {selectedDest.typicalBudget}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono-num uppercase tracking-wider text-stone-400">
                Transit Accessibility
              </span>
              <span className="text-xs font-semibold text-white block font-mono-num">
                {selectedDest.flightDuration}
              </span>
            </div>

            <div className="p-4 rounded-xl bg-black/20 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono-num uppercase tracking-wider text-stone-400">
                Current Weather
              </span>
              <span className="text-xs font-semibold text-white block font-mono-num">
                {selectedDest.weather}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-editorial text-xl font-bold">Curator Regional Overview</h3>
            <p className="text-xs md:text-sm text-stone-400 leading-relaxed font-sans-ui max-w-4xl">
              {selectedDest.description}
            </p>
          </div>

          {/* Neighborhoods & Experiences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 font-mono-num">
                Curated Neighborhoods & Hubs
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedDest.neighborhoods.map((n, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1.5 rounded-lg border border-white/10 bg-black/20 text-stone-300"
                  >
                    {n}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 font-mono-num">
                Signature Experiences
              </h4>
              <div className="space-y-2">
                {selectedDest.experiences.map((exp, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span>{exp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SECTION: PLACES TO VISIT IN THIS DESTINATION */}
      {/* ========================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
              <Landmark className="w-4 h-4 text-emerald-400" />
              <span>MUST-VISIT PLACES & LANDMARKS</span>
            </div>
            <h2 className="font-editorial text-2xl md:text-4xl font-bold tracking-tight">
              Places to Explore in {selectedDest.name.split('—')[0]}
            </h2>
            <p className="text-xs md:text-sm text-stone-400 max-w-xl">
              {allCurrentPlaces.length} iconic monuments, temples, glacial viewpoints, and hidden retreats. Click to inspect, save, or add directly to your itinerary.
            </p>
          </div>

          <button
            onClick={() => setIsAddPlaceModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95 shrink-0 self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Custom Place</span>
          </button>
        </div>

        {/* Filter bar & Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              'All',
              'Forts & Palaces',
              'Nature & Scenic',
              'Temples & Sacred',
              'Viewpoints',
              'Heritage & Culture',
            ].map((cat) => {
              const active = placeCategoryFilter === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setPlaceCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono-num whitespace-nowrap transition-colors cursor-pointer ${
                    active
                      ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                      : isDark
                      ? 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places by name or city..."
              className={`w-full pl-9 pr-4 py-1.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors ${
                isDark
                  ? 'bg-black/40 border-white/10 text-white placeholder-stone-500'
                  : 'bg-white border-stone-200 text-stone-800 placeholder-stone-400'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Places Grid */}
        {filteredPlaces.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-white/10 space-y-3">
            <Landmark className="w-8 h-8 text-stone-500 mx-auto" />
            <p className="text-sm text-stone-400">No places found matching your filter or query.</p>
            <button
              onClick={() => {
                setPlaceCategoryFilter('All');
                setSearchQuery('');
              }}
              className="text-xs text-emerald-400 hover:underline cursor-pointer"
            >
              Reset filters and show all {allCurrentPlaces.length} places
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPlaces.map((place) => {
              const isSaved = savedPlaceIds.has(place.id);

              return (
                <div
                  key={place.id}
                  className={`group rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:border-emerald-500/50 hover:shadow-xl ${
                    isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
                  }`}
                >
                  {/* Place Image */}
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[10px] font-mono-num font-semibold uppercase px-2.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
                        {place.category} · {place.city}
                      </span>

                      <button
                        onClick={() => handleToggleSavePlace(place.id, place.name)}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-amber-500 text-stone-950 shadow-md'
                            : 'bg-black/50 text-white/80 hover:text-white hover:bg-black/70'
                        }`}
                        title={isSaved ? 'Bookmarked' : 'Save place'}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                        ) : (
                          <Bookmark className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Rating and duration pill */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                      <div className="flex items-center gap-1 text-[11px] font-mono-num font-semibold bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{place.rating}</span>
                        <span className="text-stone-400">({(place.reviewsCount / 1000).toFixed(1)}k)</span>
                      </div>

                      <div className="text-[11px] font-mono-num text-stone-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded">
                        <span>⏱️ {place.recommendedDuration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-editorial text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                          {place.name}
                        </h4>
                      </div>

                      <p className="text-xs text-stone-300 line-clamp-2 leading-relaxed">
                        {place.description}
                      </p>

                      {/* Metadata Chips */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono-num text-stone-400">
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5">
                          🌅 Best: {place.bestTimeOfDay}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-emerald-400">
                          🎟️ {place.entryFee}
                        </span>
                      </div>

                      {/* Curator Insight Tip */}
                      {place.curatorTip && (
                        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-emerald-200 text-[11px] flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{place.curatorTip}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA Actions */}
                    <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setInspectingPlace(place)}
                        className="text-xs font-medium text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Dossier</span>
                      </button>

                      <button
                        onClick={() => handleAddPlace(place)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add to Itinerary</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================= */}
      {/* MODAL 1: PLACE DOSSIER DEEP DIVE */}
      {/* ========================================================= */}
      {inspectingPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div
            className={`max-w-2xl w-full rounded-2xl border overflow-hidden shadow-2xl space-y-0 max-h-[90vh] flex flex-col ${
              isDark ? 'bg-[#11171C] border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {/* Header Hero */}
            <div className="relative h-60 w-full overflow-hidden shrink-0">
              <img
                src={inspectingPlace.imageUrl}
                alt={inspectingPlace.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              <button
                onClick={() => setInspectingPlace(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-4 left-6 right-6">
                <span className="text-[10px] font-mono-num uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-stone-950 font-bold">
                  {inspectingPlace.category} · {inspectingPlace.city}
                </span>
                <h3 className="font-editorial text-2xl md:text-3xl font-bold text-white mt-1">
                  {inspectingPlace.name}
                </h3>
              </div>
            </div>

            {/* Scrollable Dossier Content */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-mono-num uppercase tracking-wider text-stone-400">
                  Historical & Cultural Context
                </h4>
                <p className="text-xs md:text-sm text-stone-300 leading-relaxed font-sans-ui">
                  {inspectingPlace.description}
                </p>
              </div>

              {/* Grid Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono-num text-stone-400">Duration</span>
                  <span className="text-xs font-bold block">{inspectingPlace.recommendedDuration}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono-num text-stone-400">Best Time</span>
                  <span className="text-xs font-bold block">{inspectingPlace.bestTimeOfDay}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono-num text-stone-400">Entry Fee</span>
                  <span className="text-xs font-bold text-emerald-400 block">{inspectingPlace.entryFee}</span>
                </div>
                <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono-num text-stone-400">Curator Rating</span>
                  <span className="text-xs font-bold text-amber-400 block">⭐ {inspectingPlace.rating} / 5.0</span>
                </div>
              </div>

              {/* Insider Photography Tip */}
              {inspectingPlace.curatorTip && (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-mono-num font-semibold text-amber-400">
                    <Camera className="w-4 h-4" />
                    <span>INSIDER CURATOR & PHOTOGRAPHY TIP</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {inspectingPlace.curatorTip}
                  </p>
                </div>
              )}

              {/* Highlight Callout */}
              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono-num font-semibold text-emerald-400">
                  <Sparkles className="w-4 h-4" />
                  <span>SIGNATURE EXPERIENCE</span>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {inspectingPlace.highlight}
                </p>
              </div>

              {/* Coordinates */}
              <div className="flex items-center justify-between text-xs font-mono-num text-stone-400 pt-2 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Lat: {inspectingPlace.coordinates.lat.toFixed(4)}, Lng: {inspectingPlace.coordinates.lng.toFixed(4)}</span>
                </div>
                <span className="text-stone-500">Verified Landmark</span>
              </div>
            </div>

            {/* Footer CTAs */}
            <div className="p-4 border-t border-white/10 bg-black/30 flex items-center justify-end gap-3 shrink-0">
              <button
                onClick={() => setInspectingPlace(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium border border-white/10 hover:bg-white/5 text-stone-300 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleAddPlace(inspectingPlace);
                  setInspectingPlace(null);
                }}
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Place to Itinerary</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: ADD CUSTOM PLACE TO DESTINATION */}
      {/* ========================================================= */}
      {isAddPlaceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div
            className={`max-w-lg w-full rounded-2xl border overflow-hidden shadow-2xl flex flex-col ${
              isDark ? 'bg-[#11171C] border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-editorial text-xl font-bold">
                  Add Place to {selectedDest.name.split('—')[0]}
                </h3>
                <p className="text-xs text-stone-400">
                  Propose a hidden gem, palace, viewpoint, or local secret to this destination dossier.
                </p>
              </div>
              <button
                onClick={() => setIsAddPlaceModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateCustomPlace} className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
              <div className="space-y-1">
                <label className="text-xs font-mono-num text-stone-300 block">
                  Place Name *
                </label>
                <input
                  type="text"
                  required
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  placeholder="e.g. Nahargarh Biological Park & Stepwell"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono-num text-stone-300 block">
                    City / Neighborhood *
                  </label>
                  <input
                    type="text"
                    value={newPlaceCity}
                    onChange={(e) => setNewPlaceCity(e.target.value)}
                    placeholder="e.g. Jaipur"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-num text-stone-300 block">
                    Category *
                  </label>
                  <select
                    value={newPlaceCategory}
                    onChange={(e) => setNewPlaceCategory(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  >
                    <option value="Palace">Palace</option>
                    <option value="Fort">Fort</option>
                    <option value="Temple">Temple / Sacred</option>
                    <option value="Nature">Nature / Lake</option>
                    <option value="Viewpoint">Viewpoint</option>
                    <option value="Heritage">Heritage</option>
                    <option value="Market">Market / Bazaar</option>
                    <option value="Experience">Experience</option>
                    <option value="Coast">Coast / Beach</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-num text-stone-300 block">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={newPlaceTagline}
                  onChange={(e) => setNewPlaceTagline(e.target.value)}
                  placeholder="e.g. Ancient stepwell oasis in the Aravalli foothills"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-num text-stone-300 block">
                  Description & Context
                </label>
                <textarea
                  rows={2}
                  value={newPlaceDescription}
                  onChange={(e) => setNewPlaceDescription(e.target.value)}
                  placeholder="Describe why travelers should visit this place..."
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-mono-num text-stone-300 block">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={newPlaceDuration}
                    onChange={(e) => setNewPlaceDuration(e.target.value)}
                    placeholder="e.g. 2 hours"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-num text-stone-300 block">
                    Best Time
                  </label>
                  <select
                    value={newPlaceBestTime}
                    onChange={(e) => setNewPlaceBestTime(e.target.value as any)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Sunset">Sunset</option>
                    <option value="Evening">Evening</option>
                    <option value="Full Day">Full Day</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono-num text-stone-300 block">
                    Entry Fee
                  </label>
                  <input
                    type="text"
                    value={newPlaceEntryFee}
                    onChange={(e) => setNewPlaceEntryFee(e.target.value)}
                    placeholder="e.g. ₹150"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                      isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono-num text-stone-300 block">
                  Curator Insider Tip
                </label>
                <input
                  type="text"
                  value={newPlaceTip}
                  onChange={(e) => setNewPlaceTip(e.target.value)}
                  placeholder="e.g. Visit at sunset for quiet photography before the gate closes."
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                    isDark ? 'bg-black/40 border-white/10 text-white' : 'bg-white border-stone-200 text-stone-900'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddPlaceModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium border border-white/10 hover:bg-white/5 text-stone-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>Save Place to {selectedDest.name.split('—')[0]}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
