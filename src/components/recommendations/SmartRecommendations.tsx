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

  const tripTitleLower = trip.title.toLowerCase();
  const destsLower = trip.destinations.map((d) => d.toLowerCase());

  const isKerala = tripTitleLower.includes('kerala') || destsLower.some((d) => d.includes('kochi') || d.includes('munnar') || d.includes('alleppey'));
  const isLadakh = tripTitleLower.includes('ladakh') || destsLower.some((d) => d.includes('leh') || d.includes('nubra') || d.includes('pangong'));
  const isGoa = tripTitleLower.includes('goa') || destsLower.some((d) => d.includes('panaji') || d.includes('palolem') || d.includes('vagator'));
  const isVaranasi = tripTitleLower.includes('varanasi') || destsLower.some((d) => d.includes('kashi') || d.includes('sarnath'));

  const recommendations = React.useMemo(() => {
    if (isKerala) {
      return [
        {
          id: 'rec-ker-1',
          title: 'Kolukkumalai High-Altitude Tea Estate & Sunrise Cloud Walk',
          city: 'Munnar (Western Ghats)',
          category: 'Nature',
          tag: 'Hidden Gems Nearby',
          cost: 1600,
          timing: '2h 30m excursion',
          imageUrl: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600&auto=format&fit=crop',
          aiReason: 'World’s highest organic tea plantation at 7,900 ft, featuring authentic orthodox leaf manufacturing and sweeping views over Tamil Nadu plains.',
        },
        {
          id: 'rec-ker-2',
          title: 'Kumarakom Bird Sanctuary Backwater Canoe Glide',
          city: 'Kumarakom (Vembanad Lake)',
          category: 'Nature',
          tag: 'Worth the Detour',
          cost: 650,
          timing: '1h 45m · On Vembanad canals',
          imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Quiet morning paddle spotting kingfishers, egrets, and cormorants along lush canal mangroves.',
        },
        {
          id: 'rec-ker-3',
          title: 'Authentic Kalaripayattu Martial Arts & Kathakali Mask Show',
          city: 'Fort Kochi',
          category: 'Culture',
          tag: 'Perfect for Tonight',
          cost: 1200,
          timing: '19:00 – 20:30',
          imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Ancient warrior traditions of Kerala performed with swords, shields, and acrobatic jumps inside a teakwood amphitheater.',
        },
        {
          id: 'rec-ker-4',
          title: 'Ayurvedic Botanical Herbal Garden Masterclass',
          city: 'Thekkady (Spice Belt)',
          category: 'Culture',
          tag: 'Under Your Budget',
          cost: 500,
          timing: '1h 15m walk',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Guided tour identifying live cardamom, cinnamon bark, and vanilla orchids with fresh spice tastings.',
        },
      ];
    }

    if (isLadakh) {
      return [
        {
          id: 'rec-lad-1',
          title: 'Hemis 17th-Century Royal Gompa & Sacred Relic Museum',
          city: 'Hemis, Ladakh',
          category: 'Culture',
          tag: 'Hidden Gems Nearby',
          cost: 400,
          timing: '2h excursion',
          imageUrl: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Wealthiest monastery in Ladakh tucked inside a dramatic Indus river canyon with golden statues and silk thangkas.',
        },
        {
          id: 'rec-lad-2',
          title: 'Bactrian Double-Humped Camel Safari at Hunder White Dunes',
          city: 'Nubra Valley',
          category: 'Sightseeing',
          tag: 'Worth the Detour',
          cost: 1500,
          timing: '1h 30m at sunset',
          imageUrl: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Ancient Silk Route camel safari across cold desert white sand dunes with snowcapped Karakoram backdrop.',
        },
        {
          id: 'rec-lad-3',
          title: 'Stargazing Milky Way Session at High-Altitude Pangong Basin',
          city: 'Pangong Tso',
          category: 'Nature',
          tag: 'Perfect for Tonight',
          cost: 800,
          timing: '21:00 – 23:00',
          imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Crystal-clear 14,000-ft night sky revealing dramatic galactic core arms without light pollution.',
        },
      ];
    }

    if (isGoa) {
      return [
        {
          id: 'rec-goa-1',
          title: 'Dudhsagar 4-Tier Waterfalls & Jeep Safari Trek',
          city: 'Sonaulim, South Goa',
          category: 'Nature',
          tag: 'Worth the Detour',
          cost: 1800,
          timing: '4h excursion',
          imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Witness the thunderous Sea of Milk waterfall roaring down Western Ghats cliffs inside Bhagwan Mahaveer Sanctuary.',
        },
        {
          id: 'rec-goa-2',
          title: 'Fontainhas Architectural Latin Quarter Heritage Walk',
          city: 'Panaji',
          category: 'Culture',
          tag: 'Hidden Gems Nearby',
          cost: 600,
          timing: '1h 30m walk',
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Centuries-old Portuguese villas painted in pastel yellow, terracotta, and olive green with handcrafted azulejo ceramic tiles.',
        },
      ];
    }

    if (isVaranasi) {
      return [
        {
          id: 'rec-var-1',
          title: 'Subah-e-Banaras Dawn Classical Music & Ragas at Assi Ghat',
          city: 'Varanasi',
          category: 'Culture',
          tag: 'Perfect for Tomorrow Morning',
          cost: 0,
          timing: '05:30 – 07:00 AM',
          imageUrl: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Experience live sitar, shehnai, and morning Vedic chants along the sacred river steps as the sun rises over the horizon.',
        },
        {
          id: 'rec-var-2',
          title: 'Sarnath Deer Park & Ashokan Lion Capital Museum',
          city: 'Sarnath',
          category: 'Culture',
          tag: 'Worth the Detour',
          cost: 400,
          timing: '2h 30m excursion',
          imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=600&auto=format&fit=crop',
          aiReason: 'Ancient Buddhist pilgrimage ground where the Buddha delivered his first sermon in 528 BCE.',
        },
      ];
    }

    // Default / Rajasthan recommendations
    return [
      {
        id: 'rec-1',
        title: 'Anokhi Museum of Hand Printing & Master Block Artisan Session',
        city: 'Jaipur (Amer Foothills)',
        category: 'Culture',
        tag: 'Hidden Gems Nearby',
        cost: 450,
        timing: '1h 15m · 8 min from Amer Fort',
        imageUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=600&auto=format&fit=crop',
        aiReason: 'Authentic textiles and craftsmanship in a restored haveli at the base of Amer Fort.',
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
        aiReason: 'Ecologically restored 70-hectare volcanic rock sanctuary beneath Mehrangarh Fort battlements.',
      },
      {
        id: 'rec-3',
        title: 'Kuldhara Abandoned Ghost Village & Stargazing Detour',
        city: 'Jaisalmer (Thar Desert Outpost)',
        category: 'Sightseeing',
        tag: 'Worth the Detour',
        cost: 1200,
        timing: '1h 45m · Road to Sam Sand Dunes',
        imageUrl: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=600&auto=format&fit=crop',
        aiReason: '13th-century deserted Paliwal Brahmin village with eerie, sublime golden hour photography walkthrough.',
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
        aiReason: 'Traditional folk dance within the 18th-century Neem Chowk courtyard right on the lake edge.',
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
        aiReason: 'Peaceful bird-eye perspective floating over fortified crests as morning light breaks across the horizon.',
      },
    ];
  }, [isKerala, isLadakh, isGoa, isVaranasi]);

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
