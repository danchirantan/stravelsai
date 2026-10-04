import React from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Sparkles,
  Bookmark,
  Camera,
  MessageSquareCode,
  Sliders,
  DollarSign,
  Ticket,
  FileCheck2,
  Luggage,
  Train,
  Users,
  Radio,
  Plus,
  Zap
} from 'lucide-react';

export type ActiveTab =
  | 'home'
  | 'itinerary'
  | 'map'
  | 'india'
  | 'planner'
  | 'copilot'
  | 'recommendations'
  | 'destinations'
  | 'hotels'
  | 'restaurants'
  | 'budget'
  | 'bookings'
  | 'transit'
  | 'documents'
  | 'packing'
  | 'companions'
  | 'travelmode'
  | 'memories'
  | 'profile';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCreateTripModal: () => void;
  openCopilot: () => void;
  openStudio?: () => void;
  tripTitle?: string;
  theme: 'dark' | 'light';
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  openCreateTripModal,
  openCopilot,
  openStudio,
  tripTitle = 'Rajasthan — The Royal Journey',
  theme,
}) => {
  const isDark = theme === 'dark';

  const navItemClass = (tab: ActiveTab) => {
    const isActive = activeTab === tab;
    return `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
      isActive
        ? isDark
          ? 'bg-white/10 text-white font-semibold shadow-sm'
          : 'bg-stone-900 text-white font-semibold shadow-sm'
        : isDark
        ? 'text-stone-400 hover:text-stone-100 hover:bg-white/5'
        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
    }`;
  };

  const groupHeaderClass = `px-3 text-[10px] uppercase tracking-wider font-semibold mb-1.5 ${
    isDark ? 'text-stone-500' : 'text-stone-400'
  }`;

  return (
    <aside
      className={`w-64 shrink-0 h-screen sticky top-0 flex flex-col border-r transition-colors duration-200 z-30 select-none ${
        isDark ? 'bg-[#0E1317] border-white/8 text-stone-200' : 'bg-[#FAFAF9] border-stone-200 text-stone-800'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 pb-3">
        <div className="flex items-center justify-between">
          <div
            onClick={() => setActiveTab('home')}
            className="cursor-pointer group flex items-center gap-2"
          >
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-sm">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="font-editorial text-lg tracking-wide font-bold text-current">
                TRIPMIND
              </span>
              <span className="text-[9px] uppercase tracking-widest block -mt-1 opacity-60 font-mono-num">
                Travel OS
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono-num px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-950/40 border border-emerald-500/20">
            v2.4
          </span>
        </div>

        {/* Create Trip Action Button */}
        <button
          onClick={openCreateTripModal}
          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm hover:shadow active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Plan New Journey</span>
        </button>
      </div>

      {/* Nav Scroll Area */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {/* Core Navigation */}
        <div>
          <div className={groupHeaderClass}>Workspace</div>
          <nav className="space-y-0.5">
            <button
              onClick={() => setActiveTab('home')}
              className={`w-full text-left ${navItemClass('home')}`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Overview & Command</span>
            </button>
            <button
              onClick={() => setActiveTab('itinerary')}
              className={`w-full text-left ${navItemClass('itinerary')}`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Active Itinerary</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`w-full text-left ${navItemClass('map')}`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Cinematic Map</span>
            </button>
            <button
              onClick={() => setActiveTab('india')}
              className={`w-full text-left ${navItemClass('india')} border border-amber-500/30 bg-amber-950/20`}
            >
              <span className="text-sm">🇮🇳</span>
              <div className="flex items-center justify-between w-full">
                <span className="font-semibold text-amber-300">Explore India</span>
                <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-300 font-bold">28 States</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('travelmode')}
              className={`w-full text-left ${navItemClass('travelmode')}`}
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex items-center justify-between w-full">
                <span>Travel Mode (Live)</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('memories')}
              className={`w-full text-left ${navItemClass('memories')}`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Journal & Memories</span>
            </button>
          </nav>
        </div>

        {/* AI Suite */}
        <div>
          <div className={groupHeaderClass}>TripMind Intelligence</div>
          <nav className="space-y-0.5">
            <button
              onClick={openCopilot}
              className={`w-full text-left ${navItemClass('copilot')}`}
            >
              <MessageSquareCode className="w-3.5 h-3.5 text-teal-400" />
              <div className="flex items-center justify-between w-full">
                <span>Ask TripMind</span>
                <span className="text-[10px] text-teal-400 font-mono-num font-normal">⌘J</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('recommendations')}
              className={`w-full text-left ${navItemClass('recommendations')}`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Smart Recommendations</span>
            </button>
            <button
              onClick={() => setActiveTab('destinations')}
              className={`w-full text-left ${navItemClass('destinations')}`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Destination Explorer</span>
            </button>
            {openStudio && (
              <button
                onClick={openStudio}
                className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer text-purple-300 hover:text-purple-200 hover:bg-white/5"
              >
                <Zap className="w-3.5 h-3.5 text-purple-400" />
                <div className="flex items-center justify-between w-full">
                  <span>AI Creative Studio</span>
                  <span className="text-[10px] font-mono-num px-1 py-0.2 rounded bg-purple-950/60 text-purple-300 font-bold border border-purple-500/20">
                    Voice & Media
                  </span>
                </div>
              </button>
            )}
          </nav>
        </div>

        {/* Explore & Stays */}
        <div>
          <div className={groupHeaderClass}>Discovery</div>
          <nav className="space-y-0.5">
            <button
              onClick={() => setActiveTab('hotels')}
              className={`w-full text-left ${navItemClass('hotels')}`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Boutique Stays</span>
            </button>
            <button
              onClick={() => setActiveTab('restaurants')}
              className={`w-full text-left ${navItemClass('restaurants')}`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Curated Dining</span>
            </button>
          </nav>
        </div>

        {/* Organize */}
        <div>
          <div className={groupHeaderClass}>Logistics & Vault</div>
          <nav className="space-y-0.5">
            <button
              onClick={() => setActiveTab('transit')}
              className={`w-full text-left ${navItemClass('transit')}`}
            >
              <Train className="w-3.5 h-3.5 text-sky-400" />
              <div className="flex items-center justify-between w-full">
                <span>Origin & Transit Hub</span>
                <span className="text-[10px] font-mono-num px-1 py-0.2 rounded bg-sky-950/60 text-sky-300 font-bold border border-sky-500/20">
                  New
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full text-left ${navItemClass('bookings')}`}
            >
              <Ticket className="w-3.5 h-3.5" />
              <span>Bookings Hub</span>
            </button>
            <button
              onClick={() => setActiveTab('budget')}
              className={`w-full text-left ${navItemClass('budget')}`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Budget Intelligence</span>
            </button>
            <button
              onClick={() => setActiveTab('packing')}
              className={`w-full text-left ${navItemClass('packing')}`}
            >
              <Luggage className="w-3.5 h-3.5 text-emerald-400" />
              <div className="flex items-center justify-between w-full">
                <span>Packing Checklist</span>
                <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-bold">
                  New
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`w-full text-left ${navItemClass('documents')}`}
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Document Wallet</span>
            </button>
            <button
              onClick={() => setActiveTab('companions')}
              className={`w-full text-left ${navItemClass('companions')}`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Travel Companions</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Persistent Bottom Engine Status */}
      <div
        className={`p-3 border-t text-xs ${
          isDark ? 'border-white/8 bg-[#0B0F12]' : 'border-stone-200 bg-white'
        }`}
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-medium opacity-90">TripMind Engine</span>
          </div>
          <span className="text-[10px] font-mono-num text-emerald-400">Online</span>
        </div>
        <div className="text-[11px] text-stone-400 truncate">
          Active: <span className="text-current font-medium">{tripTitle}</span>
        </div>
      </div>
    </aside>
  );
};
