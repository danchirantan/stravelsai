import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Clock,
  Compass,
  DollarSign,
  Star,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Plus
} from 'lucide-react';
import { Trip } from '../../types/travel';

interface SmartRecommendationsProps {
  trip: Trip;
  theme: 'dark' | 'light';
  currency: string;
  onAddRecommendationToItinerary?: (title: string, category: string, cost: number) => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  trip,
  theme,
  currency,
  onAddRecommendationToItinerary,
}) => {
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState<'All' | 'Nearby' | 'Detour' | 'Budget'>('All');
  const [addedItems, setAddedItems] = useState<string[]>([]);

  const recommendations = [
    {
      id: 'rec-1',
      title: 'Anokhi Museum of Hand Printing & Master Block Artisan Session',
      city: 'Jaipur (Amer Foothills)',
      category: 'Culture',
      tag: 'Hidden Gems Nearby',
      cost: 450,
      timing: '1h 15m · 8 min from Amer Fort',
      imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop',
      aiReason: 'You noted an interest in authentic textiles and craftsmanship. Housed in a restored haveli at the base of Amer Fort, master printers demonstrate ancient natural vegetable dye block-printing techniques with almost zero tourist crowds.',
    },
    {
      id: 'rec-2',
      title: 'Rao Jodha Desert Rock Park Guided Sunset Geological Walk',
      city: 'Jodhpur (Mehrangarh Foothills)',
      category: 'Culture',
      tag: 'Because You Like Photography & Craft',
      cost: 800,
      timing: '1h 30m · Steps from Singhoria Gate',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
      aiReason: 'Ecologically restored 70-hectare volcanic rock sanctuary. Native desert plants, ancient welded tuff rocks, and the single most dramatic camera angle looking straight up at Mehrangarh Fort battlements.',
    },
    {
      id: 'rec-3',
      title: 'Kuldhara Abandoned Ghost Village & Stargazing Detour',
      city: 'Jaisalmer (Thar Desert Outpost)',
      category: 'Sightseeing',
      tag: 'Worth the Detour',
      cost: 1200,
      timing: '1h 45m · On the scenic road to Sam Sand Dunes',
      imageUrl: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=600&auto=format&fit=crop',
      aiReason: 'Since Day 4 takes you towards the Sam Sand Dunes, stopping at the 13th-century deserted Paliwal Brahmin village adds only 15 minutes of driving while granting an eerie, sublime golden hour photography walkthrough.',
    },
    {
      id: 'rec-4',
      title: 'Dharohar Evening Folk Dance & Puppet Performance at Bagore Ki Haveli',
      city: 'Udaipur (Gangaur Ghat Waterfront)',
      category: 'Culture',
      tag: 'Perfect for Tonight',
      cost: 350,
      timing: '19:00 – 20:00 · Gangaur Ghat',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
      aiReason: 'Celebrated cultural performance within the 18th-century Neem Chowk courtyard of Bagore Ki Haveli, featuring traditional Chari, Ghoomar, and fire dances right on the lake edge.',
    },
    {
      id: 'rec-5',
      title: 'Sunrise Hot-Air Balloon Float over Amer Fort & Aravalli Ranges',
      city: 'Jaipur (Amber Valley)',
      category: 'Sightseeing',
      tag: 'Under Your Budget',
      cost: 8500,
      timing: '2h excursion at 05:45 AM sunrise',
      imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
      aiReason: 'Peaceful bird-eye perspective floating over the fortified crests of Jaigarh and Nahargarh as morning light breaks across the Rajasthan desert horizon.',
    },
  ];

  const handleAdd = (item: typeof recommendations[0]) => {
    setAddedItems((prev) => [...prev, item.id]);
    if (onAddRecommendationToItinerary) {
      onAddRecommendationToItinerary(item.title, item.category, item.cost);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>CONTEXTUAL RECOMMENDATION ENGINE</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
          Smart Recommendations
        </h1>
        <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-2xl">
          Every suggestion is derived from your pace, budget ceiling, previous stops, and active weather conditions.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3">
        {(['All', 'Nearby', 'Detour', 'Budget'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeCategory === tab
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : isDark
                ? 'text-stone-400 hover:text-white hover:bg-white/5'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {tab === 'All' && 'All Intelligent Picks'}
            {tab === 'Nearby' && 'Hidden Gems Nearby'}
            {tab === 'Detour' && 'Worth The Detour'}
            {tab === 'Budget' && 'Under Your Budget'}
          </button>
        ))}
      </div>

      {/* Grid of Recommendation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => {
          const isAdded = addedItems.includes(rec.id);
          return (
            <div
              key={rec.id}
              className={`rounded-2xl border overflow-hidden flex flex-col justify-between transition-all group ${
                isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={rec.imageUrl}
                    alt={rec.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <span className="absolute top-3 left-3 text-[10px] font-mono-num font-semibold uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
                    {rec.tag}
                  </span>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-mono-num text-stone-300 block">
                      {rec.city}
                    </span>
                    <h3 className="font-editorial text-xl font-bold leading-tight">
                      {rec.title}
                    </h3>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* AI Explanation Pill */}
                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] font-mono-num uppercase tracking-wider text-emerald-400 font-semibold block">
                      Why TripMind Recommends This
                    </span>
                    <p className="text-xs text-stone-300 leading-relaxed font-sans-ui">
                      {rec.aiReason}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono-num text-stone-400 pt-1">
                    <span>{rec.timing}</span>
                    <span className="text-emerald-400 font-bold">
                      ₹{rec.cost.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => handleAdd(rec)}
                  disabled={isAdded}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-950/50 text-emerald-300 border border-emerald-500/30'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-98'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Added to Day Itinerary</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Itinerary</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
