import React, { useState } from 'react';
import {
  Camera,
  Sparkles,
  Heart,
  Calendar,
  MapPin,
  Utensils,
  Share2,
  Plus,
  BookOpen
} from 'lucide-react';
import { MOCK_MEMORIES } from '../../data/mockData';
import { TripMemory } from '../../types/travel';

interface MemoriesViewProps {
  theme: 'dark' | 'light';
  currency: string;
}

export const MemoriesView: React.FC<MemoriesViewProps> = ({
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [memories, setMemories] = useState<TripMemory[]>(MOCK_MEMORIES);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStory, setNewStory] = useState('');

  const travelDNA = [
    { trait: 'Heritage Fort & Palace Explorer', weight: 'High affinity for 16th-century Rajput architecture & hill ramparts' },
    { trait: 'Royal Gastronomy Connoisseur', weight: 'Prioritizes authentic Dal Baati Churma, royal thalis & saffron sweets' },
    { trait: 'Golden Hour Photographer', weight: 'Schedules vantage points around sunset lighting at Hawa Mahal & Thar Dunes' },
    { trait: 'Architectural Haveli Stays', weight: 'Values hand-carved jharokhas and tranquil courtyard fountains over generic chains' },
    { trait: 'Artisan & Textile Patron', weight: 'Passionate about traditional Bagru wooden block-printing & Kundan enamel' },
  ];

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newMem: TripMemory = {
      id: `mem-${Date.now()}`,
      dayNumber: 3,
      date: 'Nov 10, 2026',
      location: 'Jodhpur — Mehrangarh Fort & Blue City',
      title: newTitle,
      story: newStory || 'Standing atop the sheer stone battlements of Mehrangarh as dusk painted the blue city indigo.',
      photoCount: 12,
      locationsCount: 2,
      highlights: ['Mehrangarh ramparts', 'Blue City rooftop views'],
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop',
    };

    setMemories([newMem, ...memories]);
    setNewTitle('');
    setNewStory('');
    setShowAddNote(false);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>JOURNAL ARCHIVE & TRAVEL IDENTITY</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
            Trip Journal & Memories
          </h1>
          <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-xl">
            TripMind automatically synthesizes your check-ins, photography timestamps, and restaurant notes into an editorial keepsake.
          </p>
        </div>

        <button
          onClick={() => setShowAddNote(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Journal Reflection</span>
        </button>
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
        <h2 className="font-editorial text-2xl md:text-3xl font-bold mb-4">
          How TripMind Understands You
        </h2>
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

      {/* Memories Timeline Stream */}
      <div className="space-y-8">
        <h3 className="font-editorial text-2xl font-bold">
          Chapter Reflections: Royal Rajasthan Journey
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {memories.map((mem) => (
            <div
              key={mem.id}
              className={`rounded-2xl border overflow-hidden transition-all ${
                isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={mem.imageUrl}
                  alt={mem.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="text-xs font-mono-num font-semibold uppercase px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
                    Day 0{mem.dayNumber} · {mem.date}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs text-stone-300 font-mono-num block mb-1">
                    {mem.location}
                  </span>
                  <h4 className="font-editorial text-2xl font-bold leading-tight">
                    {mem.title}
                  </h4>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
                  "{mem.story}"
                </p>

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
                  <span>{mem.locationsCount} Verified Locations</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Memory Modal */}
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
                  placeholder="e.g. Sunset Boat Ride along Oi River"
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
    </div>
  );
};
