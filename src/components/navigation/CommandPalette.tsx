import React, { useState, useEffect } from 'react';
import { Search, Compass, Calendar, MapPin, DollarSign, Ticket, Sparkles, X, ChevronRight, Moon, Sun, Radio, FileText, Luggage, Train, Plane } from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: ActiveTab) => void;
  openCreateTripModal: () => void;
  openCopilot: () => void;
  theme: 'dark' | 'light';
  setTheme: (t: 'dark' | 'light') => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
  openCreateTripModal,
  openCopilot,
  theme,
  setTheme,
}) => {
  const [query, setQuery] = useState('');
  const isDark = theme === 'dark';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      title: 'Plan New Journey with TripMind AI',
      category: 'AI Action',
      icon: Sparkles,
      action: () => {
        onClose();
        openCreateTripModal();
      }
    },
    {
      title: 'Ask TripMind Travel Copilot',
      category: 'AI Assistant',
      icon: Sparkles,
      action: () => {
        onClose();
        openCopilot();
      }
    },
    {
      title: 'Switch to Live Travel Mode Cockpit',
      category: 'Navigation',
      icon: Radio,
      action: () => {
        setActiveTab('travelmode');
        onClose();
      }
    },
    {
      title: 'View Active Timeline Itinerary',
      category: 'Navigation',
      icon: Calendar,
      action: () => {
        setActiveTab('itinerary');
        onClose();
      }
    },
    {
      title: 'Explore India: 28 States & Cultural Festivals',
      category: 'Navigation',
      icon: Compass,
      action: () => {
        setActiveTab('india');
        onClose();
      }
    },
    {
      title: 'Configure Departure Origin & Journey Dates (Vande Bharat, Flights, Cabs)',
      category: 'Logistics',
      icon: Train,
      action: () => {
        setActiveTab('transit');
        onClose();
      }
    },
    {
      title: 'Open Packing Checklist & Custom Manifests',
      category: 'Logistics',
      icon: Luggage,
      action: () => {
        setActiveTab('packing');
        onClose();
      }
    },
    {
      title: 'Explore Interactive Vector Map',
      category: 'Navigation',
      icon: MapPin,
      action: () => {
        setActiveTab('map');
        onClose();
      }
    },
    {
      title: 'Review Budget Intelligence & Expense Split',
      category: 'Finance',
      icon: DollarSign,
      action: () => {
        setActiveTab('budget');
        onClose();
      }
    },
    {
      title: 'Open Bookings Hub & Rail Passes',
      category: 'Logistics',
      icon: Ticket,
      action: () => {
        setActiveTab('bookings');
        onClose();
      }
    },
    {
      title: 'Explore Destination: Amalfi Coast & Capri',
      category: 'Destinations',
      icon: Compass,
      action: () => {
        setActiveTab('destinations');
        onClose();
      }
    },
    {
      title: 'Explore Destination: Ubud & Uluwatu, Bali',
      category: 'Destinations',
      icon: Compass,
      action: () => {
        setActiveTab('destinations');
        onClose();
      }
    },
    {
      title: `Toggle Appearance: Switch to ${isDark ? 'Light' : 'Dark'} Mode`,
      category: 'Settings',
      icon: isDark ? Sun : Moon,
      action: () => {
        setTheme(isDark ? 'light' : 'dark');
        onClose();
      }
    }
  ];

  const filtered = actions.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-xl shadow-2xl border overflow-hidden transition-all ${
          isDark
            ? 'bg-[#12181D] border-white/10 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Search Input Bar */}
        <div
          className={`flex items-center gap-3 px-4 py-3 border-b ${
            isDark ? 'border-white/10 bg-white/5' : 'border-stone-200 bg-stone-50/50'
          }`}
        >
          <Search className="w-4 h-4 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, destination, or jump to view..."
            autoFocus
            className="w-full bg-transparent text-sm focus:outline-none placeholder:text-stone-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-stone-500/10 text-stone-400 hover:text-stone-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer group ${
                    isDark
                      ? 'hover:bg-white/8 text-stone-300 hover:text-white'
                      : 'hover:bg-stone-100 text-stone-700 hover:text-stone-950'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-md ${
                        isDark ? 'bg-white/5 text-stone-300' : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="font-medium block">{item.title}</span>
                      <span className="text-[11px] text-stone-400">{item.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              );
            })
          ) : (
            <div className="py-8 text-center text-xs text-stone-400">
              No matching commands found for "{query}". Try "Itinerary", "Map", or "AI".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          className={`px-4 py-2 text-[11px] border-t flex items-center justify-between font-mono-num text-stone-400 ${
            isDark ? 'border-white/5 bg-black/20' : 'border-stone-100 bg-stone-50'
          }`}
        >
          <span>Use ↑ ↓ to navigate</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
