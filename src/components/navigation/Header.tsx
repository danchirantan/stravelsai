import React from 'react';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Radio,
  Share2,
  Menu,
  Sparkles,
  CloudRain,
  LogIn,
  LogOut,
  MapPin,
  Calendar
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openCommandPalette: () => void;
  openShareModal: () => void;
  openNotifications: () => void;
  unreadNotificationsCount: number;
  hasWeatherDisruption?: boolean;
  tripTitle?: string;
  tripSubtitle?: string;
  sourceCity?: string;
  startDate?: string;
  endDate?: string;
  user?: any;
  onSignIn?: () => void;
  onSignOut?: () => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
  currency: string;
  setCurrency: (c: string) => void;
  onMobileMenuToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openCommandPalette,
  openShareModal,
  openNotifications,
  unreadNotificationsCount,
  hasWeatherDisruption,
  tripTitle = 'Active Journey',
  tripSubtitle = 'Curated Itinerary',
  sourceCity = 'New Delhi / NCR',
  startDate = '2026-10-15',
  endDate = '2026-10-21',
  user,
  onSignIn,
  onSignOut,
  theme,
  setTheme,
  currency,
  setCurrency,
  onMobileMenuToggle,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`h-16 px-4 md:px-8 border-b sticky top-0 z-20 flex items-center justify-between backdrop-blur-md transition-colors duration-200 ${
        isDark
          ? 'bg-[#0E1317]/85 border-white/8 text-stone-100'
          : 'bg-[#FAFAF9]/85 border-stone-200 text-stone-900'
      }`}
    >
      {/* Zone 1: Brand Wordmark / Breadcrumb single line */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="md:hidden p-1.5 rounded-md hover:bg-stone-500/10 text-stone-400"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-baseline gap-2 truncate">
          <span
            onClick={() => setActiveTab('home')}
            className="font-editorial text-lg md:text-xl font-bold tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
          >
            TRIPMIND
          </span>
          <span className="text-stone-400 text-xs hidden sm:inline" aria-hidden="true">·</span>
          <span className="text-xs font-medium text-stone-400 truncate hidden sm:inline">
            {tripTitle} ({tripSubtitle})
          </span>
        </div>
      </div>

      {/* Zone 2: Clean 4-5 Navigation Links / Interactive Context Tabs */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveTab('home')}
          className={`cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'home'
              ? isDark ? 'text-white font-semibold' : 'text-stone-950 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Command Center
        </button>
        <button
          onClick={() => setActiveTab('itinerary')}
          className={`cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'itinerary'
              ? isDark ? 'text-white font-semibold' : 'text-stone-950 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Timeline Itinerary
        </button>
        <button
          onClick={() => setActiveTab('map')}
          className={`cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'map'
              ? isDark ? 'text-white font-semibold' : 'text-stone-950 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Interactive Map
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'budget'
              ? isDark ? 'text-white font-semibold' : 'text-stone-950 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Budget Intelligence
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'bookings'
              ? isDark ? 'text-white font-semibold' : 'text-stone-950 font-semibold'
              : 'text-stone-400 hover:text-stone-200'
          }`}
        >
          Bookings & Vouchers
        </button>
        <button
          onClick={() => setActiveTab('transit')}
          className={`cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'transit'
              ? isDark ? 'text-white font-semibold' : 'text-stone-950 font-semibold'
              : 'text-sky-400 hover:text-sky-300'
          }`}
        >
          <span>Origin & Transit</span>
          <span className="text-[10px] font-mono-num px-1 rounded bg-sky-950 text-sky-300 font-bold">New</span>
        </button>
      </nav>

      {/* Interactive Source & Dates Pill */}
      <button
        onClick={() => setActiveTab('transit')}
        className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono-num transition-all cursor-pointer shadow-sm"
        title="Click to view and adjust Origin City, Dates, Trains & Flights"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-semibold">{sourceCity.split('/')[0].trim()} → {tripTitle.split('—')[0].trim()}</span>
        <span className="opacity-40">|</span>
        <span>{startDate} – {endDate}</span>
      </button>

      {/* Zone 3: Primary Actions (Search trigger, Travel Mode switch, Currency, Theme, Share) */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Quick Search / Command Palette Trigger */}
        <button
          onClick={openCommandPalette}
          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors cursor-pointer border ${
            isDark
              ? 'bg-white/5 border-white/10 hover:bg-white/10 text-stone-300'
              : 'bg-stone-100 border-stone-200 hover:bg-stone-200/70 text-stone-700'
          }`}
          aria-label="Open Command Palette"
        >
          <Search className="w-3.5 h-3.5 opacity-70" />
          <span className="hidden xl:inline text-stone-400">Search destinations, activities...</span>
          <kbd className="text-[10px] font-mono-num px-1 py-0.5 rounded bg-black/20 text-stone-400 border border-white/5">
            ⌘K
          </kbd>
        </button>

        {/* Real-time Travel Mode (Cockpit View) Button */}
        <button
          onClick={() => setActiveTab('travelmode')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all border ${
            activeTab === 'travelmode'
              ? 'bg-emerald-500 text-stone-950 font-semibold border-emerald-400 shadow-sm'
              : isDark
              ? 'bg-emerald-950/30 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/40'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
          }`}
          title="Switch to Real-time Ground Travel Mode"
        >
          <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span className="hidden sm:inline">Travel Mode</span>
        </button>

        {/* Currency Switcher */}
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
          className={`text-xs font-mono-num rounded-md px-2 py-1.5 cursor-pointer border transition-colors outline-none ${
            isDark
              ? 'bg-[#141B20] border-white/10 text-stone-300 hover:bg-white/10'
              : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
          }`}
          aria-label="Select currency"
        >
          <option value="INR">₹ INR</option>
          <option value="USD">$ USD</option>
          <option value="EUR">€ EUR</option>
          <option value="JPY">¥ JPY</option>
        </select>

        {/* Share Trip Button */}
        <button
          onClick={openShareModal}
          className={`p-2 rounded-md transition-colors cursor-pointer border ${
            isDark
              ? 'border-white/8 hover:bg-white/10 text-stone-300'
              : 'border-stone-200 hover:bg-stone-100 text-stone-700'
          }`}
          title="Share Trip Magazine"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>

        {/* Weather Disruption Alert Trigger */}
        {hasWeatherDisruption && (
          <button
            onClick={openNotifications}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-mono-num font-semibold bg-amber-500/15 border border-amber-500/40 text-amber-300 hover:bg-amber-500/25 transition-all cursor-pointer animate-pulse"
            title="Weather Disruption Alert: Meteorological condition detected for your destination"
          >
            <CloudRain className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Weather Alert</span>
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={openNotifications}
          className={`relative p-2 rounded-md transition-colors cursor-pointer border ${
            isDark
              ? 'border-white/8 hover:bg-white/10 text-stone-300'
              : 'border-stone-200 hover:bg-stone-100 text-stone-700'
          }`}
          title="Notifications & Smart Alerts"
        >
          <Bell className="w-3.5 h-3.5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
          )}
        </button>

        {/* Dark / Light Mode Toggle */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className={`p-2 rounded-md transition-colors cursor-pointer border ${
            isDark
              ? 'border-white/8 hover:bg-white/10 text-stone-300'
              : 'border-stone-200 hover:bg-stone-100 text-stone-700'
          }`}
          title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-stone-600" />}
        </button>

        {/* User Account / Google Sign In */}
        {user ? (
          <div className="flex items-center gap-2 pl-1">
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 cursor-pointer group"
              title={`${user.displayName || user.email} — Profile`}
            >
              <img
                src={
                  user.photoURL ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop'
                }
                alt={user.displayName || 'User'}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-emerald-500/60 group-hover:border-emerald-400 transition-colors"
              />
              <span className="hidden 2xl:inline text-xs font-semibold text-stone-200">
                {user.displayName?.split(' ')[0] || 'Voyager'}
              </span>
            </div>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="p-1.5 rounded hover:bg-white/10 text-stone-400 hover:text-rose-400 text-xs transition-colors"
                title="Sign Out of Firebase"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer"
              title="Sign in with Google using Firebase Auth"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Google Sign-In</span>
            </button>
            <div
              onClick={() => setActiveTab('profile')}
              className="cursor-pointer group"
              title="Profile"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop"
                alt="Demo avatar"
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-emerald-500/40 group-hover:border-emerald-400 transition-colors"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
