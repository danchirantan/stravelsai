import React, { useState } from 'react';
import {
  Compass,
  Calendar,
  DollarSign,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronRight
} from 'lucide-react';
import { Destination } from '../../types/travel';
import { MOCK_DESTINATIONS } from '../../data/mockData';

interface DestinationExplorerProps {
  onSelectDestinationForPlanning: (destName: string) => void;
  theme: 'dark' | 'light';
  currency: string;
}

export const DestinationExplorer: React.FC<DestinationExplorerProps> = ({
  onSelectDestinationForPlanning,
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [selectedDestId, setSelectedDestId] = useState<string>(MOCK_DESTINATIONS[0].id);

  const selectedDest =
    MOCK_DESTINATIONS.find((d) => d.id === selectedDestId) || MOCK_DESTINATIONS[0];

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>GLOBAL DESTINATION INTELLIGENCE</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
          Destination Explorer
        </h1>
        <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-xl">
          Deep seasonal intelligence, curated neighborhoods, cultural etiquette, and estimated budgeting for discerning travelers.
        </p>
      </div>

      {/* Destination Grid Selector (5 featured destinations) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {MOCK_DESTINATIONS.map((dest) => {
          const isSelected = dest.id === selectedDestId;
          return (
            <button
              key={dest.id}
              onClick={() => setSelectedDestId(dest.id)}
              className={`rounded-xl p-3 border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                  : isDark
                  ? 'bg-[#11171C] border-white/10 text-stone-400 hover:text-white hover:bg-white/5'
                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <span className="text-[10px] font-mono-num uppercase tracking-wider block text-emerald-400">
                {dest.country}
              </span>
              <span className="text-xs font-bold font-editorial truncate block text-stone-200">
                {dest.name.split(',')[0]}
              </span>
            </button>
          );
        })}
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

          <div className="absolute top-6 left-6">
            <span className="text-xs font-mono-num font-semibold uppercase px-3 py-1 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
              {selectedDest.country} · Intelligence Dossier
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

            <button
              onClick={() => onSelectDestinationForPlanning(selectedDest.name)}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg flex items-center gap-2 cursor-pointer shrink-0 transition-transform active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Plan This Destination →</span>
            </button>
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
                Flight Transit
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
            <h3 className="font-editorial text-xl font-bold">Curator Overview</h3>
            <p className="text-xs md:text-sm text-stone-400 leading-relaxed font-sans-ui max-w-4xl">
              {selectedDest.description}
            </p>
          </div>

          {/* Neighborhoods & Experiences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 font-mono-num">
                Curated Neighborhoods
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

          {/* Highlights & Safety */}
          <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-6 text-xs text-stone-400 font-mono-num">
            {selectedDest.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-1.5 text-stone-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
