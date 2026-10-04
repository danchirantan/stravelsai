import React, { useState } from 'react';
import {
  User,
  Globe,
  MapPin,
  Calendar,
  Sparkles,
  Sliders,
  DollarSign,
  Shield,
  CheckCircle2,
  Camera,
  Moon,
  Sun
} from 'lucide-react';

interface ProfileViewProps {
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  currency: string;
  setCurrency: (c: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  theme,
  setTheme,
  currency,
  setCurrency,
}) => {
  const isDark = theme === 'dark';
  const [slowMornings, setSlowMornings] = useState(true);
  const [heritageFocus, setHeritageFocus] = useState(true);
  const [transitSpeed, setTransitSpeed] = useState<'Express High-Speed' | 'Scenic Local'>('Express High-Speed');
  const [saveConfirmation, setSaveConfirmation] = useState(false);

  const stats = [
    { label: 'Journeys Completed', value: '14' },
    { label: 'Destinations Explored', value: '18' },
    { label: 'Heritage Sites Cataloged', value: '47' },
    { label: 'Curated Experiences', value: '128' },
  ];

  const handleSave = () => {
    setSaveConfirmation(true);
    setTimeout(() => setSaveConfirmation(false), 2000);
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-10">
      {/* Header Profile Identity */}
      <div
        className={`p-6 md:p-8 rounded-2xl border flex flex-col md:flex-row items-center md:items-start gap-6 ${
          isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=260&auto=format&fit=crop"
            alt="Chirantan Dan"
            referrerPolicy="no-referrer"
            className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-2 border-emerald-500/50 shadow-md"
          />
          <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-[#11171C] flex items-center justify-center text-[10px] text-black font-bold">
            ✓
          </span>
        </div>

        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="font-editorial text-3xl md:text-4xl font-bold">
                Chirantan Dan
              </h1>
              <span className="text-xs font-mono-num text-emerald-400">
                Founding Voyager · Travel DNA Archetype: Heritage & Architecture Connoisseur
              </span>
            </div>
            <span className="text-xs font-mono-num px-3 py-1 rounded bg-black/30 border border-white/10 text-stone-300 self-center md:self-start">
              TripMind Elite Tier
            </span>
          </div>

          <p className="text-xs text-stone-400 max-w-xl font-sans-ui leading-relaxed">
            Architectural designer and cultural heritage explorer based in New Delhi. Enjoys sandstone fort ramparts, stepwell geometry, artisan craft ateliers, and quiet palace courtyard dining.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
            {stats.map((s, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-black/20 border border-white/5 text-center"
              >
                <span className="font-editorial text-xl font-bold font-mono-num text-white block">
                  {s.value}
                </span>
                <span className="text-[10px] uppercase font-mono-num text-stone-400">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preferences & System Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Travel Intelligence Persona Settings */}
        <div
          className={`p-6 md:p-8 rounded-2xl border space-y-6 ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-mono-num text-emerald-400 uppercase tracking-wider block">
              AI Travel Preferences
            </span>
            <h3 className="font-editorial text-2xl font-bold">Rhythm & Curation</h3>
          </div>

          <div className="space-y-4 text-xs font-sans-ui">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
              <div>
                <span className="font-semibold text-stone-200 block">Slow Morning Departure Buffer</span>
                <span className="text-stone-400 text-[11px]">Schedule departures after 08:30 AM to savor tea.</span>
              </div>
              <input
                type="checkbox"
                checked={slowMornings}
                onChange={(e) => setSlowMornings(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
              <div>
                <span className="font-semibold text-stone-200 block">Heritage Palace Dining Focus</span>
                <span className="text-stone-400 text-[11px]">Prioritize royal recipes, thalis, and historic courtyards.</span>
              </div>
              <input
                type="checkbox"
                checked={heritageFocus}
                onChange={(e) => setHeritageFocus(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-2">
              <span className="font-semibold text-stone-200 block">Preferred Transit Priority</span>
              <div className="grid grid-cols-2 gap-2">
                {(['Express High-Speed', 'Scenic Local'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setTransitSpeed(mode)}
                    className={`py-2 px-3 rounded-lg text-xs font-mono-num border transition-colors cursor-pointer ${
                      transitSpeed === mode
                        ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500'
                        : 'border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Global Settings & Appearance */}
        <div
          className={`p-6 md:p-8 rounded-2xl border space-y-6 ${
            isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-mono-num text-emerald-400 uppercase tracking-wider block">
              Application Configuration
            </span>
            <h3 className="font-editorial text-2xl font-bold">Preferences & Display</h3>
          </div>

          <div className="space-y-4 text-xs font-sans-ui">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
              <div>
                <span className="font-semibold text-stone-200 block">Interface Color Theme</span>
                <span className="text-stone-400 text-[11px]">Choose Midnight Cockpit or Editorial Light.</span>
              </div>
              <button
                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                className="px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-1.5 text-xs text-stone-300 hover:text-white cursor-pointer"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{isDark ? 'Midnight (Dark)' : 'Editorial (Light)'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/20 border border-white/5">
              <div>
                <span className="font-semibold text-stone-200 block">Primary Display Currency</span>
                <span className="text-stone-400 text-[11px]">Automatically converts international expenses.</span>
              </div>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white font-mono-num text-xs focus:outline-none"
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
                <option value="JPY">¥ JPY (Japanese Yen)</option>
              </select>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-stone-300 text-xs flex items-center justify-between">
              <span>All preferences saved locally & synced to TripMind Cloud.</span>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold cursor-pointer whitespace-nowrap"
              >
                {saveConfirmation ? 'Saved ✓' : 'Update Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
