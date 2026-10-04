import React from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  User,
  Radio
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface MobileNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCopilot: () => void;
  theme: 'dark' | 'light';
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  setActiveTab,
  openCopilot,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 right-0 h-16 border-t px-2 flex items-center justify-around z-40 backdrop-blur-lg transition-colors ${
        isDark
          ? 'bg-[#0E1317]/95 border-white/10 text-stone-300'
          : 'bg-[#FAFAF9]/95 border-stone-200 text-stone-700'
      }`}
    >
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center gap-0.5 p-1 transition-colors ${
          activeTab === 'home' ? 'text-emerald-400 font-medium' : 'text-stone-400'
        }`}
      >
        <Compass className="w-4 h-4" />
        <span className="text-[10px]">Explore</span>
      </button>

      <button
        onClick={() => setActiveTab('itinerary')}
        className={`flex flex-col items-center justify-center gap-0.5 p-1 transition-colors ${
          activeTab === 'itinerary' ? 'text-emerald-400 font-medium' : 'text-stone-400'
        }`}
      >
        <Calendar className="w-4 h-4" />
        <span className="text-[10px]">Plan</span>
      </button>

      {/* Prominent Center AI Copilot Button */}
      <button
        onClick={openCopilot}
        className="flex flex-col items-center justify-center -mt-4 p-2 rounded-full bg-emerald-600 text-white shadow-lg active:scale-95 transition-transform"
        aria-label="Ask TripMind AI"
      >
        <Sparkles className="w-5 h-5 text-amber-200" />
      </button>

      <button
        onClick={() => setActiveTab('map')}
        className={`flex flex-col items-center justify-center gap-0.5 p-1 transition-colors ${
          activeTab === 'map' ? 'text-emerald-400 font-medium' : 'text-stone-400'
        }`}
      >
        <MapPin className="w-4 h-4" />
        <span className="text-[10px]">Map</span>
      </button>

      <button
        onClick={() => setActiveTab('travelmode')}
        className={`flex flex-col items-center justify-center gap-0.5 p-1 transition-colors ${
          activeTab === 'travelmode' ? 'text-emerald-400 font-medium' : 'text-stone-400'
        }`}
      >
        <Radio className="w-4 h-4" />
        <span className="text-[10px]">Live</span>
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center gap-0.5 p-1 transition-colors ${
          activeTab === 'profile' ? 'text-emerald-400 font-medium' : 'text-stone-400'
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  );
};
