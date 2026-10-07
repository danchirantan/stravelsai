import React, { useState, useMemo } from 'react';
import {
  Camera,
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  Utensils,
  Share2,
  Plus,
  BookOpen,
  Filter,
  CheckCircle2,
  Clock,
  Sun,
  Download,
  X,
  Compass,
  ArrowRight,
  ShieldCheck,
  Eye,
  Layers,
  Flame
} from 'lucide-react';
import { MOCK_MEMORIES } from '../../data/mockData';
import { TripMemory, Trip } from '../../types/travel';
import { CameraCaptureModal } from './CameraCaptureModal';

interface MemoriesViewProps {
  trip?: Trip;
  theme: 'dark' | 'light';
  currency: string;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({
  trip,
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [memories, setMemories] = useState<TripMemory[]>(MOCK_MEMORIES);
  const [showAddNote, setShowAddNote] = useState(false);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedMemoryDetail, setSelectedMemoryDetail] = useState<TripMemory | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [newTitle, setNewTitle] = useState('');
  const [newStory, setNewStory] = useState('');

  // Dynamic travel DNA based on the destination
  const travelDNA = useMemo(() => {
    const titleLower = trip?.title?.toLowerCase() || '';
    const dests = trip?.destinations?.map((d) => d.toLowerCase()) || [];

    if (dests.some((d) => d.includes('kerala') || d.includes('kochi') || d.includes('munnar'))) {
      return [
        { trait: 'Emerald Backwater & Canal Voyager', weight: 'High affinity for slow-paced traditional kettuvallam navigation & tranquil lagoons' },
        { trait: 'Highland Spice & Tea Explorer', weight: 'Prioritizes misty cloud-forest walks, organic cardamom estates & Nilgiri views' },
        { trait: 'Coastal Ayurvedic Purist', weight: 'Values traditional herbal therapies, oil massage retreats & oceanfront yoga' },
        { trait: 'Malabar Culinary Connoisseur', weight: 'Schedules authentic sadhya feasts served on fresh plantain leaves & coastal fish curries' },
        { trait: 'Kathakali & Living Art Patron', weight: 'Passionate about temple percussion, mural heritage & classical dance dramas' },
      ];
    }

    if (dests.some((d) => d.includes('ladakh') || d.includes('leh') || d.includes('nubra'))) {
      return [
        { trait: 'High-Altitude Pass Explorer', weight: 'Navigates 17,500ft glacial mountain passes like Khardung La & Chang La' },
        { trait: 'Tibetan Gompa & Monastic Scholar', weight: 'Spends contemplative mornings at Thiksey, Diskit & Hemis morning prayers' },
        { trait: 'Dark Sky Astrophotographer', weight: 'Equipped for midnight long-exposure astrophotography over crystalline Pangong Tso' },
        { trait: 'Cold Desert Silk Road Trekker', weight: 'Explores ancient Bactrian camel dunes in Hunder and remote Nubra oasis valleys' },
        { trait: 'Highland Eco-Travel Advocate', weight: 'Practices zero-waste high-altitude acclimatization & respects local community homestays' },
      ];
    }

    if (dests.some((d) => d.includes('goa') || d.includes('panaji') || d.includes('candolim'))) {
      return [
        { trait: 'Indo-Portuguese Heritage Walker', weight: 'Explores Fontainhas pastel Latin quarter alleys & colonial azulejo tiles' },
        { trait: 'Konkan Coastal Gastronome', weight: 'Prioritizes wood-fired poi bread, prawn balchão & authentic feni distilleries' },
        { trait: 'Secret Cove & Estuary Kayaker', weight: 'Finds tranquil backwaters around Divar Island & secluded southern capes' },
        { trait: 'Sunset Ambient Photographer', weight: 'Catches coastal dramatic tidal reflections at Cabo de Rama and Vagator cliffs' },
        { trait: 'Boutique Seaside Villa Patron', weight: 'Prefers restored 18th-century Portuguese estates over commercial resorts' },
      ];
    }

    if (dests.some((d) => d.includes('varanasi') || d.includes('sarnath') || d.includes('kashi'))) {
      return [
        { trait: 'Sacred Riverfront Dawn Pilgrim', weight: 'Greets dawn by wooden hand-rowed boat along the mystical crescent of Ganga ghats' },
        { trait: 'Classical Spirtual & Vedic Seeker', weight: 'Attends atmospheric Dashashwamedh Maha Aarti bells and ancient Sanskrit chants' },
        { trait: 'Banarasi Brocade & Silk Patron', weight: 'Deeply admires generational Master Zari weavers in ancient Chowk alleys' },
        { trait: 'Street Gastronomy Connoisseur', weight: 'Savors tamatar chaat, creamy malaiyo froth & authentic clay-pot rabdi lassi' },
        { trait: 'Buddhist Archaeological Explorer', weight: 'Reflects at Sarnath Deer Park where the Dhamma Wheel was first turned' },
      ];
    }

    // Default: Imperial Rajasthan & Pan-India
    return [
      { trait: 'Heritage Fort & Palace Explorer', weight: 'High affinity for Rajput sandstone architecture & hill ramparts' },
      { trait: 'Royal Gastronomy Connoisseur', weight: 'Prioritizes authentic Dal Baati Churma, royal thalis & saffron sweets' },
      { trait: 'Golden Hour Photographer', weight: 'Schedules vantage points around sunset lighting at Hawa Mahal & Thar Dunes' },
      { trait: 'Architectural Haveli Stays', weight: 'Values hand-carved jharokhas and tranquil courtyard fountains over generic chains' },
      { trait: 'Artisan & Textile Patron', weight: 'Passionate about traditional Bagru wooden block-printing & Kundan enamel' },
    ];
  }, [trip]);

  // Handle saving new camera-captured memory
  const handleSaveCameraMemory = (newMemory: TripMemory) => {
    setMemories([newMemory, ...memories]);
  };

  // Handle saving standard text memory
  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const currentCity = trip?.destinations?.[0] || 'Destination';
    const newMem: TripMemory = {
      id: `mem-${Date.now()}`,
      dayNumber: 1,
      date: trip?.startDate || 'Nov 08, 2026',
      location: `${currentCity} — Heritage Center`,
      title: newTitle,
      story: newStory || `Reflective journal log recorded during journey stop in ${currentCity}.`,
      photoCount: 1,
      locationsCount: 1,
      highlights: [currentCity, 'Journal Reflection'],
      imageUrl: trip?.coverImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop',
    };

    setMemories([newMem, ...memories]);
    setNewTitle('');
    setNewStory('');
    setShowAddNote(false);
  };

  // Filter memories
  const filteredMemories = useMemo(() => {
    if (activeFilter === 'all') return memories;
    if (activeFilter === 'camera') return memories.filter((m) => m.capturedViaCamera || m.geoTag);
    return memories.filter(
      (m) =>
        m.location.toLowerCase().includes(activeFilter.toLowerCase()) ||
        m.geoTag?.city.toLowerCase().includes(activeFilter.toLowerCase())
    );
  }, [memories, activeFilter]);

  const cameraCapturesCount = memories.filter((m) => m.capturedViaCamera || m.geoTag).length;
  const uniqueCities = useMemo(() => {
    const set = new Set<string>();
    memories.forEach((m) => {
      if (m.geoTag?.city) set.add(m.geoTag.city);
      else {
        const parts = m.location.split('—');
        if (parts[0]) set.add(parts[0].trim());
      }
    });
    return Array.from(set);
  }, [memories]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>JOURNAL ARCHIVE & GEO-TAGGED FIELD PHOTOGRAPHY</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
            Trip Journal & Memories
          </h1>
          <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-xl">
            Capture photos directly via camera with automatic geo-tagging, GPS coordinates, and destination timestamps anchored to your live itinerary.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 self-start">
          <button
            onClick={() => setIsCameraModalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-md flex items-center gap-2 cursor-pointer transition-all"
          >
            <Camera className="w-4 h-4" />
            <span>📸 Capture Geo-Tagged Photo</span>
          </button>

          <button
            onClick={() => setShowAddNote(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/10 hover:bg-white/5 text-stone-200 shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Text Reflection</span>
          </button>
        </div>
      </div>

      {/* Travel DNA Card */}
      <section
        className={`p-6 md:p-8 rounded-2xl border ${
          isDark
            ? 'bg-gradient-to-r from-emerald-950/30 via-[#11171C] to-[#11171C] border-emerald-500/30'
            : 'bg-emerald-50/70 border-emerald-200'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Your Living Travel DNA</span>
        </div>
        <h2 className="font-editorial text-2xl md:text-3xl font-bold mb-1">
          How TripMind Understands You
        </h2>
        <p className="text-xs text-stone-400 mb-4 font-sans-ui">
          Synthesized from your travel style, route pacing, and photographic choices across {trip?.destinations?.join(' · ') || 'your itinerary'}.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {travelDNA.map((dna, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-1"
            >
              <span className="text-xs font-bold text-white block">
                {dna.trait}
              </span>
              <span className="text-[11px] text-stone-300 block font-sans-ui">
                {dna.weight}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Memories Timeline Stream & Filters */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
          <div>
            <h3 className="font-editorial text-2xl font-bold">
              Chapter Reflections: {trip?.title || 'Active Journey'}
            </h3>
            <span className="text-xs text-stone-400 font-mono-num">
              {filteredMemories.length} entries ({cameraCapturesCount} live camera geo-tags)
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-medium ${
                activeFilter === 'all'
                  ? 'bg-amber-500 text-stone-950 border-amber-500 font-semibold'
                  : isDark
                  ? 'border-white/10 text-stone-400 hover:text-white'
                  : 'border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              All Entries ({memories.length})
            </button>

            <button
              onClick={() => setActiveFilter('camera')}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer font-medium ${
                activeFilter === 'camera'
                  ? 'bg-rose-600 text-white border-rose-600 font-semibold shadow-sm'
                  : isDark
                  ? 'border-white/10 text-stone-400 hover:text-white'
                  : 'border-stone-200 text-stone-600 hover:text-stone-900'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Camera Geo-Tagged ({cameraCapturesCount})</span>
            </button>

            {uniqueCities.slice(0, 4).map((city) => (
              <button
                key={city}
                onClick={() => setActiveFilter(activeFilter === city ? 'all' : city)}
                className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer text-[11px] font-mono-num ${
                  activeFilter === city
                    ? 'bg-emerald-600 text-white border-emerald-600 font-semibold'
                    : isDark
                    ? 'border-white/10 text-stone-400 hover:text-white'
                    : 'border-stone-200 text-stone-600 hover:text-stone-900'
                }`}
              >
                📍 {city}
              </button>
            ))}
          </div>
        </div>

        {/* Memories Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredMemories.map((mem) => {
            const isGeoTagged = mem.capturedViaCamera || !!mem.geoTag;

            return (
              <div
                key={mem.id}
                onClick={() => setSelectedMemoryDetail(mem)}
                className={`rounded-2xl border overflow-hidden transition-all duration-200 group cursor-pointer ${
                  isDark
                    ? 'bg-[#11171C] border-white/10 hover:border-amber-500/40'
                    : 'bg-white border-stone-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="relative h-64 overflow-hidden bg-stone-950">
                  <img
                    src={mem.imageUrl}
                    alt={mem.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span className="text-xs font-mono-num font-semibold uppercase px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
                      Day 0{mem.dayNumber} · {mem.date}
                    </span>

                    {isGeoTagged && (
                      <span className="text-[10px] font-mono-num font-bold uppercase px-2 py-1 rounded bg-rose-950/80 backdrop-blur-md text-rose-300 border border-rose-500/40 flex items-center gap-1">
                        <Camera className="w-3 h-3 text-rose-400" />
                        <span>Geo-Tagged</span>
                      </span>
                    )}
                  </div>

                  {/* Bottom Image Overlay: Location & Title */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-amber-400 font-mono-num mb-1">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{mem.location}</span>
                    </div>
                    <h4 className="font-editorial text-2xl font-bold leading-tight group-hover:text-amber-200 transition-colors">
                      {mem.title}
                    </h4>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
                    "{mem.story}"
                  </p>

                  {/* Geo-Tag Metadata Strip if available */}
                  {mem.geoTag && (
                    <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-num text-stone-400">
                      <span className="text-amber-400 font-semibold">
                        GPS: {mem.geoTag.coordinates.lat.toFixed(4)}°N, {mem.geoTag.coordinates.lng.toFixed(4)}°E
                      </span>
                      <span>{mem.geoTag.timeString || mem.geoTag.timestamp}</span>
                      {mem.geoTag.altitude && <span>· {mem.geoTag.altitude}</span>}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    {mem.highlights.map((h, i) => (
                      <span
                        key={i}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-black/20 border border-white/5 text-stone-300"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-mono-num text-stone-400">
                    <span>{mem.photoCount} High-Res Frames Synced</span>
                    <span className="text-amber-400/90 font-medium group-hover:underline flex items-center gap-1">
                      View EXIF Details →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Photo EXIF & Geo-Tag Lightbox Modal */}
      {selectedMemoryDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-4xl max-h-[94vh] rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
              isDark ? 'bg-[#0f141a] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-500/10 text-amber-400">
                  <MapPin className="w-4 h-4" />
                </span>
                <h3 className="font-editorial text-lg font-bold">
                  {selectedMemoryDetail.title}
                </h3>
              </div>

              <button
                onClick={() => setSelectedMemoryDetail(null)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
              {/* Photo Display */}
              <div className="lg:col-span-8 bg-black flex items-center justify-center p-2 relative min-h-[320px]">
                <img
                  src={selectedMemoryDetail.imageUrl}
                  alt={selectedMemoryDetail.title}
                  className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />
              </div>

              {/* EXIF & Geo-Tag Inspection Panel */}
              <div className="lg:col-span-4 p-5 space-y-4 border-t lg:border-t-0 lg:border-l border-white/10 text-xs">
                <div>
                  <span className="text-[10px] font-mono-num uppercase tracking-wider text-amber-400 block mb-1">
                    EXIF & TELEMETRY PROFILE
                  </span>
                  <h4 className="font-editorial text-xl font-bold">
                    Geo-Tag Verification
                  </h4>
                </div>

                <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2 font-mono-num text-[11px]">
                  <div className="flex items-center justify-between pb-1 border-b border-white/5">
                    <span className="text-stone-400">Location:</span>
                    <strong className="text-amber-400 truncate max-w-[150px]">
                      {selectedMemoryDetail.location}
                    </strong>
                  </div>

                  {selectedMemoryDetail.geoTag && (
                    <>
                      <div className="flex items-center justify-between pb-1 border-b border-white/5">
                        <span className="text-stone-400">Coordinates:</span>
                        <span className="text-white">
                          {selectedMemoryDetail.geoTag.coordinates.lat.toFixed(4)}°N, {selectedMemoryDetail.geoTag.coordinates.lng.toFixed(4)}°E
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-1 border-b border-white/5">
                        <span className="text-stone-400">Timestamp:</span>
                        <span className="text-emerald-400">
                          {selectedMemoryDetail.geoTag.timeString}
                        </span>
                      </div>
                      {selectedMemoryDetail.geoTag.altitude && (
                        <div className="flex items-center justify-between pb-1 border-b border-white/5">
                          <span className="text-stone-400">Altitude:</span>
                          <span className="text-stone-300">
                            {selectedMemoryDetail.geoTag.altitude}
                          </span>
                        </div>
                      )}
                      {selectedMemoryDetail.geoTag.weather && (
                        <div className="flex items-center justify-between">
                          <span className="text-stone-400">Weather:</span>
                          <span className="text-stone-300">
                            {selectedMemoryDetail.geoTag.weather}
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <span className="text-stone-400">Trip Day:</span>
                    <span className="text-stone-300">
                      Day 0{selectedMemoryDetail.dayNumber} · {selectedMemoryDetail.date}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-stone-400 block mb-1">Journal Reflection:</span>
                  <p className="text-stone-300 leading-relaxed font-sans-ui italic">
                    "{selectedMemoryDetail.story}"
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <a
                    href={selectedMemoryDetail.imageUrl}
                    download={`tripmind-${selectedMemoryDetail.id}.jpg`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-stone-200 flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Image</span>
                  </a>

                  <button
                    onClick={() => setSelectedMemoryDetail(null)}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Standard Text Memory Modal */}
      {showAddNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-xl p-6 border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#12181D] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-editorial text-xl font-bold">New Memory Entry</h3>
              <button
                onClick={() => setShowAddNote(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Title of Memory / Moment</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Sunset Boat Ride along Backwaters"
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Journal Reflection</label>
                <textarea
                  rows={4}
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  placeholder="Describe the atmosphere, tastes, scents, or thoughts..."
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddNote(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save to Journal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Camera Capture & Auto-Geo-Tagging Modal */}
      {trip && (
        <CameraCaptureModal
          isOpen={isCameraModalOpen}
          onClose={() => setIsCameraModalOpen(false)}
          trip={trip}
          onSaveMemory={handleSaveCameraMemory}
          theme={theme}
        />
      )}
    </div>
  );
};
