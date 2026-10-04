import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  Calendar,
  Users,
  DollarSign,
  CloudRain,
  CheckCircle2,
  Clock,
  MapPin,
  Plane,
  Building,
  Check,
  AlertCircle,
  Sliders,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Train
} from 'lucide-react';
import { Trip, Destination, DestinationWeather, WeatherDisruptionAlert } from '../../types/travel';
import { ActiveTab } from '../navigation/Sidebar';

interface HomeDashboardProps {
  trip: Trip;
  destinations: Destination[];
  setActiveTab: (tab: ActiveTab) => void;
  openCreateTripModal: () => void;
  openCopilot: () => void;
  openNotifications?: () => void;
  theme: 'dark' | 'light';
  currency: string;
  liveWeather?: Record<string, DestinationWeather>;
  activeDisruptions?: WeatherDisruptionAlert[];
  onTriggerWeatherCheck?: () => Promise<void>;
  onApplyWeatherOptimization?: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  trip,
  destinations,
  setActiveTab,
  openCreateTripModal,
  openCopilot,
  openNotifications,
  theme,
  currency,
  liveWeather,
  activeDisruptions = [],
  onTriggerWeatherCheck,
  onApplyWeatherOptimization,
}) => {
  const isDark = theme === 'dark';
  const [naturalQuery, setNaturalQuery] = useState(
    'Plan a 7-day Rajasthan Royal Circuit under ₹1,25,000 with palaces, heritage havelis & desert glamping'
  );
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [insightAccepted, setInsightAccepted] = useState(false);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openCreateTripModal();
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-10">
      {/* Editorial Hero Section */}
      <section className="relative rounded-2xl overflow-hidden border border-white/10 p-6 md:p-12 transition-all">
        {/* Cinematic Atmospheric Backdrop */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 scale-105"
          style={{
            backgroundImage: `url('${trip.coverImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop'}')`,
          }}
        />
        {/* Measured dark gradient scrim for WCAG AA readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/85 to-stone-950/70" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400 tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>INTELLIGENT TRAVEL OPERATING SYSTEM</span>
          </div>

          <h1 className="font-editorial text-4xl md:text-6xl font-bold text-white tracking-tight leading-none text-balance">
            Where are you going next?
          </h1>

          <p className="text-sm md:text-base text-stone-300 font-sans-ui max-w-xl leading-relaxed">
            TripMind turns scattered travel ideas into intelligent, route-optimized, and beautifully paced journeys.
          </p>

          {/* Large Intelligent Search / Input Interface */}
          <form onSubmit={handleHeroSubmit} className="pt-2">
            <div className="p-2 bg-stone-900/90 backdrop-blur-md rounded-xl border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center gap-2">
              <div className="flex items-center gap-2.5 px-3 flex-1 w-full">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="Describe your dream journey (destination, duration, pace, budget)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-stone-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab('destinations')}
                  className="px-3.5 py-2 text-xs font-medium text-stone-300 hover:text-white transition-colors cursor-pointer"
                >
                  Explore Catalog
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                >
                  <span>Plan My Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="flex items-center gap-2 mt-3 text-xs text-stone-400 flex-wrap">
              <span className="text-[11px] font-mono-num text-stone-400">Quick ideas:</span>
              <button
                type="button"
                onClick={() => setNaturalQuery('7 days royal palaces & Thar desert safari in Jaipur & Jaisalmer under ₹1,25,000')}
                className="hover:text-emerald-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Rajasthan Royal Circuit
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setNaturalQuery('5 days tea valleys & private houseboat in Kerala Backwaters under ₹85,000')}
                className="hover:text-emerald-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Kerala Houseboat & Hills
              </button>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => setNaturalQuery('6 days luxury honeymoon in Amalfi Coast under ₹2,50,000')}
                className="hover:text-emerald-300 underline underline-offset-2 transition-colors cursor-pointer"
              >
                Amalfi Coast luxury
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* AI Contextual Insight Card (Live Demonstration of System Intelligence) */}
      {!insightDismissed && (
        <section
          className={`p-5 rounded-xl border transition-all ${
            isDark
              ? 'bg-gradient-to-r from-emerald-950/40 via-[#111920] to-[#111920] border-emerald-500/30'
              : 'bg-emerald-50/70 border-emerald-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                <CloudRain className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-editorial text-lg font-bold text-current">
                    TripMind noticed something
                  </span>
                  <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded text-emerald-400 bg-emerald-950/40 border border-emerald-500/20">
                    Weather Intelligence
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed max-w-3xl">
                  {insightAccepted
                    ? 'Changes accepted! Day 1 Amber Fort visit shifted to early morning (08:30 AM); reserved shaded courtyard lunch at 1135 AD.'
                    : 'Jaipur midday forecast indicates peak desert sun (31°C) on Day 1 between 12:30 PM and 15:00 PM. We recommend visiting Amber Fort at 08:30 AM and enjoying shaded courtyard dining during peak heat.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {!insightAccepted ? (
                <>
                  <button
                    onClick={() => {
                      setInsightAccepted(true);
                      onApplyWeatherOptimization?.();
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                  >
                    Apply Optimization
                  </button>
                  <button
                    onClick={() => setInsightDismissed(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      isDark
                        ? 'border-white/10 hover:bg-white/5 text-stone-300'
                        : 'border-stone-200 hover:bg-stone-100 text-stone-600'
                    }`}
                  >
                    Keep Original
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Itinerary Optimized</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Personalized Dashboard: Your Next Journey */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl md:text-3xl font-bold">
              Your Active Journey
            </h2>
            <p className="text-xs text-stone-400">
              Real-time synchronization across flights, boutique stays, transit, and daily routes.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('itinerary')}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
          >
            <span>View Full Timeline</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Cinematic Main Trip Card */}
        <div
          className={`rounded-2xl border overflow-hidden transition-all ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          {/* Card Top Banner */}
          <div className="relative h-56 md:h-72 w-full overflow-hidden">
            <img
              src={trip.coverImage || "https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1600&auto=format&fit=crop"}
              alt={trip.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#11171C] via-[#11171C]/50 to-transparent" />

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <span className="text-xs font-mono-num font-semibold uppercase px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
                {trip.startDate} – {trip.endDate}
              </span>
              <span className="text-xs font-mono-num font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-stone-300 border border-white/10">
                Confidence {trip.confidenceScore || 95}%
              </span>
            </div>

            <div className="absolute bottom-4 left-6 right-6">
              <div className="text-xs font-mono-num text-emerald-400 font-semibold uppercase tracking-wider mb-1">
                {trip.daysCount} Days · {trip.travelersCount} Travelers · {trip.pace} Rhythm
              </div>
              <h3 className="font-editorial text-3xl md:text-5xl font-bold text-white tracking-tight">
                {trip.subtitle || trip.title}
              </h3>
            </div>
          </div>

          {/* Card Body: Readiness & Metrics */}
          <div className="p-6 space-y-6">
            {/* Trip Readiness Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-400">Trip Readiness Progress</span>
                <span className="font-mono-num font-bold text-emerald-400">
                  {trip.readinessScore}% Complete
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${trip.readinessScore}%` }}
                />
              </div>
            </div>

            {/* Quick Stat Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              <div
                onClick={() => setActiveTab('transit')}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'bg-sky-950/25 border-sky-500/30 hover:bg-sky-900/40' : 'bg-sky-50 border-sky-200 hover:bg-sky-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-sky-400 mb-1 text-[11px]">
                  <Train className="w-3.5 h-3.5" />
                  <span>Origin & Transit</span>
                </div>
                <span className="text-xs font-semibold block text-sky-300 truncate">
                  {trip.sourceCity ? trip.sourceCity.split('/')[0] : 'New Delhi'}
                </span>
                <span className="text-[10px] text-stone-400 truncate block">Vande Bharat / Road</span>
              </div>

              <div
                onClick={() => setActiveTab('bookings')}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/8 hover:bg-white/10' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-stone-400 mb-1 text-[11px]">
                  <Plane className="w-3.5 h-3.5" />
                  <span>Flights & Rail</span>
                </div>
                <span className="text-xs font-semibold block text-emerald-400">Confirmed</span>
                <span className="text-[10px] text-stone-400 truncate block">AI 491 & Vande Bharat</span>
              </div>

              <div
                onClick={() => setActiveTab('hotels')}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/8 hover:bg-white/10' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-stone-400 mb-1 text-[11px]">
                  <Building className="w-3.5 h-3.5" />
                  <span>Hotels & Camps</span>
                </div>
                <span className="text-xs font-semibold block text-emerald-400">Reserved</span>
                <span className="text-[10px] text-stone-400 truncate block">Samode Haveli & Desert Camp</span>
              </div>

              <div
                onClick={() => setActiveTab('itinerary')}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/8 hover:bg-white/10' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-stone-400 mb-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Itinerary</span>
                </div>
                <span className="text-xs font-semibold block text-stone-200">{trip.daysCount} Days</span>
                <span className="text-[10px] text-stone-400 truncate block">{trip.startDate} to {trip.endDate}</span>
              </div>

              <div
                onClick={() => setActiveTab('transit')}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/8 hover:bg-white/10' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-stone-400 mb-1 text-[11px]">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Date Weather</span>
                </div>
                <span className="text-xs font-semibold block text-stone-200">28°C / 14°C</span>
                <span className="text-[10px] text-stone-400 truncate block">Golden Autumn Sky</span>
              </div>

              <div
                onClick={() => setActiveTab('documents')}
                className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                  isDark ? 'bg-white/5 border-white/8 hover:bg-white/10' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-1.5 text-stone-400 mb-1 text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Docs & Passes</span>
                </div>
                <span className="text-xs font-semibold block text-emerald-400">Vault Secure</span>
                <span className="text-[10px] text-stone-400 truncate block">Aadhaar + IRCTC PNR</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('itinerary')}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                >
                  Enter Itinerary Workspace
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isDark ? 'border-white/10 hover:bg-white/5 text-stone-300' : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  View Route Map
                </button>
              </div>

              <button
                onClick={openCopilot}
                className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Ask TripMind about Day 3 modifications</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destination Spotlights */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-editorial text-2xl font-bold">
              Curated Destination Intelligence
            </h2>
            <p className="text-xs text-stone-400">
              Detailed seasonal climates, budget expectations, and regional masterclasses.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('destinations')}
            className="text-xs text-emerald-400 hover:underline cursor-pointer"
          >
            View all destinations →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {destinations.slice(0, 3).map((dest) => (
            <div
              key={dest.id}
              onClick={() => setActiveTab('destinations')}
              className={`group rounded-xl border overflow-hidden transition-all hover:border-emerald-500/50 cursor-pointer ${
                isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <span className="absolute top-3 left-3 text-[10px] font-mono-num font-semibold uppercase px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-emerald-300 border border-white/10">
                  {dest.country}
                </span>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-editorial text-xl font-bold">{dest.name}</h4>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <p className="text-xs text-stone-400 line-clamp-2 leading-relaxed">
                  {dest.tagline}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-num text-stone-400">
                  <span>{dest.weather}</span>
                  <span className="text-emerald-400">{dest.typicalBudget.split('/')[0]}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
