import React, { useState } from 'react';
import {
  UtensilsCrossed,
  Star,
  MapPin,
  Sparkles,
  Clock,
  Check,
  ChevronRight
} from 'lucide-react';
import { MOCK_RESTAURANTS } from '../../data/mockData';

interface RestaurantDiscoveryProps {
  theme: 'dark' | 'light';
  currency: string;
}

export const RestaurantDiscovery: React.FC<RestaurantDiscoveryProps> = ({
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [selectedCity, setSelectedCity] = useState<'All' | 'Jaipur' | 'Jodhpur' | 'Jaisalmer' | 'Udaipur'>('All');

  const filteredRestaurants = MOCK_RESTAURANTS.filter((r) => {
    if (selectedCity === 'All') return true;
    return r.city === selectedCity;
  });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
          <UtensilsCrossed className="w-4 h-4 text-emerald-400" />
          <span>GASTRONOMIC INTELLIGENCE</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
          Curated Dining & Royal Rajasthani Feasts
        </h1>
        <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-2xl">
          Historic fort-top dining, rooftop haveli terraces, royal thalis, and centuries-old culinary institutions coordinated around your day's journey.
        </p>
      </div>

      {/* City Filters */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {(['All', 'Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur'] as const).map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCity === city
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : isDark
                ? 'text-stone-400 hover:text-white hover:bg-white/5'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {city === 'All' ? 'All Destinations' : `${city} Dining`}
          </button>
        ))}
      </div>

      {/* Restaurant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
              isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
            }`}
          >
            <div>
              <div className="relative h-52 overflow-hidden">
                <img
                  src={restaurant.imageUrl}
                  alt={restaurant.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono-num font-semibold uppercase px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
                    {restaurant.cuisine}
                  </span>
                  <span className="text-xs font-mono-num font-bold px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-stone-200 border border-white/10">
                    {restaurant.priceTier} · {restaurant.city}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono-num mb-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold">{restaurant.rating}</span>
                    <span className="text-stone-400">· {restaurant.atmosphere}</span>
                  </div>
                  <h3 className="font-editorial text-2xl font-bold">{restaurant.name}</h3>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* AI Context Box */}
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono-num uppercase tracking-wider text-emerald-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Perfect For Your Evening</span>
                  </div>
                  <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
                    {restaurant.aiContext}
                  </p>
                </div>

                {/* Recommended Dish */}
                <div className="text-xs text-stone-300">
                  <span className="text-stone-400 font-semibold">Signature Order: </span>
                  <span className="italic">{restaurant.recommendedDish}</span>
                </div>

                {/* Dietary options */}
                <div className="flex flex-wrap gap-2">
                  {restaurant.dietary.map((d, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-black/20 border border-white/5 text-stone-400"
                    >
                      {d}
                    </span>
                  ))}
                </div>

                <div className="text-xs text-stone-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{restaurant.distance}</span>
                </div>
              </div>
            </div>

            {/* Price & Action */}
            <div className="p-6 pt-0 border-t border-white/5 mt-2 flex items-center justify-between">
              <div>
                <span className="font-mono-num text-lg font-bold text-emerald-400">
                  ~₹{restaurant.avgPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[11px] text-stone-400 block -mt-1 font-mono-num">
                  estimated tasting / guest
                </span>
              </div>

              <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer">
                Request Table Hold
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
