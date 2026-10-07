import React, { useState } from 'react';
import {
  Building,
  Star,
  Sparkles,
  MapPin,
  Check,
  Coffee,
  Waves,
  ShieldCheck,
  Bookmark
} from 'lucide-react';
import { MOCK_HOTELS } from '../../data/mockData';
import { Hotel, Trip } from '../../types/travel';

interface HotelDiscoveryProps {
  trip?: Trip;
  theme: 'dark' | 'light';
  currency: string;
}

export const HotelDiscovery: React.FC<HotelDiscoveryProps> = ({
  trip,
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [selectedStyle, setSelectedStyle] = useState<string>('All');
  const [savedHotelIds, setSavedHotelIds] = useState<string[]>(['hotel-1']);

  // Extract all unique styles dynamically from MOCK_HOTELS
  const allStyles = ['All', ...Array.from(new Set(MOCK_HOTELS.map((h) => h.style)))];

  const filteredHotels = MOCK_HOTELS.filter((h) => {
    if (selectedStyle === 'All') return true;
    return h.style === selectedStyle;
  });

  const toggleSave = (id: string) => {
    setSavedHotelIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const tripRegionName = trip?.title.split('—')[0].trim() || 'Curated';

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
          <Building className="w-4 h-4 text-emerald-400" />
          <span>CURATED HERITAGE STAYS & BOUTIQUE RETREATS</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
          {tripRegionName} Stays, Villas & Sanctuaries
        </h1>
        <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-2xl">
          Every palace, waterfront villa, high-altitude sanctuary, and boutique haveli is vetted for architectural provenance, quiet courtyard gardens, and serene hospitality.
        </p>
      </div>

      {/* Style Filters */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {allStyles.map((style) => (
          <button
            key={style}
            onClick={() => setSelectedStyle(style)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedStyle === style
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : isDark
                ? 'text-stone-400 hover:text-white hover:bg-white/5'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {style}
          </button>
        ))}
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredHotels.map((hotel) => {
          const isSaved = savedHotelIds.includes(hotel.id);
          return (
            <div
              key={hotel.id}
              className={`rounded-2xl border overflow-hidden transition-all flex flex-col justify-between ${
                isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={hotel.imageUrl}
                    alt={hotel.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="text-[10px] font-mono-num font-semibold uppercase px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
                      {hotel.style}
                    </span>
                    <button
                      onClick={() => toggleSave(hotel.id)}
                      className={`p-2 rounded-full bg-black/60 backdrop-blur-md border border-white/10 transition-colors cursor-pointer ${
                        isSaved ? 'text-amber-400' : 'text-stone-300 hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-amber-300 font-mono-num mb-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="font-bold">{hotel.rating}</span>
                      <span className="text-stone-400">({hotel.reviewsCount} reviews)</span>
                      <span aria-hidden="true" className="text-stone-400">·</span>
                      <span className="text-stone-300">{hotel.city}</span>
                    </div>
                    <h3 className="font-editorial text-2xl font-bold">{hotel.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* AI Recommendation Context Box */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono-num uppercase tracking-wider text-emerald-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Why TripMind Selected This</span>
                    </div>
                    <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
                      {hotel.aiReason}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-2">
                    {hotel.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-black/20 border border-white/5 text-stone-300"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-stone-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>{hotel.distanceToKeySpot}</span>
                  </div>
                </div>
              </div>

              {/* Price & Booking Bar */}
              <div className="p-6 pt-0 border-t border-white/5 mt-2 flex items-center justify-between">
                <div>
                  <span className="font-mono-num text-xl font-bold text-emerald-400">
                    ₹{hotel.pricePerNight.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-stone-400 block -mt-1 font-mono-num">
                    / night per room
                  </span>
                </div>

                <button className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-colors cursor-pointer">
                  Reserve in Itinerary
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
