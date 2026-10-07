import React, { useState, useEffect } from 'react';
import {
  Compass,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio,
  CloudRain,
  Sun,
  ChevronRight,
  Utensils,
  Camera
} from 'lucide-react';
import { Trip, Activity } from '../../types/travel';

interface TravelModeViewProps {
  trip: Trip;
  theme: 'dark' | 'light';
  currency: string;
  onExitTravelMode: () => void;
  openCopilot: () => void;
}

export const TravelModeView: React.FC<TravelModeViewProps> = ({
  trip,
  theme,
  currency,
  onExitTravelMode,
  openCopilot,
}) => {
  const isDark = theme === 'dark';
  const [currentTime, setCurrentTime] = useState<string>('10:45 AM');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const activeDay = trip.days?.[0] || {
    dayNumber: 1,
    city: trip.destinations?.[0] || 'Destination Hub',
    theme: 'Arrival & Welcome Exploration',
    weather: { temp: '26°C', condition: 'Pleasant & Sunny', icon: 'Sun' },
    activities: [] as Activity[]
  };

  const city = activeDay.city || trip.destinations?.[0] || 'Destination';
  const nowActivity = activeDay.activities?.[0] || {
    title: `Arrival & Exploration in ${city}`,
    location: `${city} Central`,
    time: '11:30',
    duration: '1h 30m',
    aiReason: 'Optimal timing for check-in and orientation.'
  };

  const nextActivity = activeDay.activities?.[1] || {
    title: `Heritage Walk & Scenic Viewpoint in ${city}`,
    location: `${city} Historic Quarter`,
    time: '15:30',
    duration: '2h',
    aiReason: 'Gentle afternoon light and minimal transit friction.'
  };

  const afterActivity = activeDay.activities?.[2] || {
    title: `Traditional Feast & Evening Experience in ${city}`,
    location: `${city} Dining Quarter`,
    time: '19:30',
    duration: '1h 45m',
    aiReason: 'Reserved table ready for authentic local dishes.'
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Live Cockpit Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 px-6 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300">
        <div className="flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <span className="text-xs font-mono-num font-bold uppercase tracking-wider block">
              TripMind Live Travel Mode · {city} Local Time (IST)
            </span>
            <span className="text-[11px] text-emerald-200/80">
              GPS Synchronized · Day 0{activeDay.dayNumber}: {activeDay.theme}
            </span>
          </div>
        </div>

        <button
          onClick={onExitTravelMode}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer self-start sm:self-center"
        >
          Exit Travel Mode
        </button>
      </div>

      {/* Hero Cockpit Blocks: NOW / NEXT / AFTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* NOW Block */}
        <div
          className={`p-6 md:p-8 rounded-2xl border flex flex-col justify-between relative overflow-hidden ${
            isDark ? 'bg-[#11171C] border-emerald-500/40' : 'bg-white border-emerald-500 shadow-md'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-num">
              <span className="px-2 py-0.5 rounded bg-emerald-500 text-stone-950 font-bold uppercase tracking-wider">
                NOW
              </span>
              <span className="text-emerald-400 font-bold text-sm">{currentTime}</span>
            </div>

            <div>
              <span className="text-xs text-stone-400 font-mono-num block mb-1">
                {nowActivity.location}
              </span>
              <h2 className="font-editorial text-2xl md:text-3xl font-bold text-white leading-tight">
                {nowActivity.title}
              </h2>
            </div>

            <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
              {nowActivity.aiReason || 'Sunlight casting perfect golden reflections across pink sandstone facade.'}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs font-mono-num">
            <span className="text-stone-400">Duration: {nowActivity.duration || '1h 30m'}</span>
            <span className="text-emerald-400 font-semibold">On Schedule</span>
          </div>
        </div>

        {/* NEXT Block */}
        <div
          className={`p-6 md:p-8 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-num">
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold uppercase tracking-wider">
                NEXT
              </span>
              <span className="text-stone-400">{nextActivity.time} ({nextActivity.duration})</span>
            </div>

            <div>
              <span className="text-xs text-stone-400 font-mono-num block mb-1">
                {nextActivity.location}
              </span>
              <h2 className="font-editorial text-2xl md:text-3xl font-bold text-white leading-tight">
                {nextActivity.title}
              </h2>
            </div>

            <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
              {nextActivity.aiReason || 'Authentic artisan workshops with royal block prints and gemstone cutting.'}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs font-mono-num">
            <span className="text-stone-400">Transit: 8 min heritage rickshaw</span>
            <span className="text-emerald-400">Route Cached</span>
          </div>
        </div>

        {/* AFTER Block */}
        <div
          className={`p-6 md:p-8 rounded-2xl border flex flex-col justify-between ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono-num">
              <span className="px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-bold uppercase tracking-wider">
                AFTER
              </span>
              <span className="text-stone-400">{afterActivity.time}</span>
            </div>

            <div>
              <span className="text-xs text-stone-400 font-mono-num block mb-1">
                {afterActivity.location}
              </span>
              <h2 className="font-editorial text-2xl md:text-3xl font-bold text-white leading-tight">
                {afterActivity.title}
              </h2>
            </div>

            <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
              {afterActivity.aiReason || 'Reserved heritage dining table ready for the evening.'}
            </p>
          </div>

          <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-xs font-mono-num">
            <span className="text-stone-400">Table: Confirmed</span>
            <span className="text-stone-300">Ref: LMB-1954</span>
          </div>
        </div>
      </div>

      {/* Real-time Environmental & Ground Intelligence Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Micro-Climate Live Sensor */}
        <div
          className={`p-6 rounded-2xl border flex items-center gap-4 ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <Sun className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-mono-num uppercase tracking-wider text-stone-400 block">
              {city} Micro-Climate Live
            </span>
            <span className="font-editorial text-2xl font-bold text-white block">
              {activeDay.weather.temp} · {activeDay.weather.condition}
            </span>
            <span className="text-xs text-stone-300 font-sans-ui mt-0.5 block">
              Clear desert skies. UV Index moderate. Pleasant evening breeze expected after sunset (18:15).
            </span>
          </div>
        </div>

        {/* Dynamic AI Ground Tip */}
        <div
          className={`p-6 rounded-2xl border flex items-start gap-4 ${
            isDark
              ? 'bg-gradient-to-r from-emerald-950/30 to-[#11171C] border-emerald-500/30'
              : 'bg-emerald-50 border-emerald-200 shadow-sm'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono-num uppercase tracking-wider text-emerald-400 font-semibold block">
              TripMind Live Ground Tip
            </span>
            <p className="text-xs text-stone-200 leading-relaxed font-sans-ui">
              "Head to the rooftop cafe directly opposite Hawa Mahal around 16:15 PM; the late afternoon sun illuminates the pink facade at an optimum 45° angle before market shadows lengthen."
            </p>
          </div>
        </div>
      </div>

      {/* Travel Assistant Quick Action */}
      <div className="p-4 rounded-xl bg-black/20 border border-white/10 flex items-center justify-between">
        <span className="text-xs text-stone-300">
          Need an emergency detour, authorized heritage guide, or translation support?
        </span>
        <button
          onClick={openCopilot}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
        >
          Ask TripMind Live Copilot
        </button>
      </div>
    </div>
  );
};
