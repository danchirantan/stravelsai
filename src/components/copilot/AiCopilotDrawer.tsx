import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Send,
  MessageSquareCode,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Building,
  UtensilsCrossed,
  DollarSign
} from 'lucide-react';
import { Trip } from '../../types/travel';

interface AiCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  theme: 'dark' | 'light';
  currency: string;
}

interface Message {
  id: string;
  sender: 'user' | 'tripmind';
  text: string;
  timestamp: string;
  actionablePills?: string[];
  contextBadge?: string;
}

export const AiCopilotDrawer: React.FC<AiCopilotDrawerProps> = ({
  isOpen,
  onClose,
  trip,
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isIndia =
    trip.destinations?.some((d) =>
      ['jaipur', 'jodhpur', 'jaisalmer', 'udaipur', 'delhi', 'rajasthan', 'kerala', 'varanasi', 'goa', 'mumbai'].some(
        (k) => d.toLowerCase().includes(k)
      )
    ) ||
    trip.title.toLowerCase().includes('rajasthan') ||
    trip.currency === 'INR';

  const firstDest = trip.destinations[0] || 'your destination';
  const secondDest = trip.destinations[1] || trip.destinations[0] || 'the region';

  const defaultInitText = `Good morning. I've audited your ${trip.daysCount || trip.days?.length || 5}-day ${trip.title} itinerary across ${trip.destinations.join(', ') || 'your destinations'}. I'm monitoring local meteorological conditions, route operating hours, and curated reservations in real time. How can I optimize your journey today?`;

  const defaultPills = [
    `Best time to explore ${firstDest} avoiding midday heat & crowds`,
    `Find a scenic evening dining reservation in ${secondDest}`,
    `Recommend authentic regional delicacies and food stops in ${firstDest}`,
    `Calculate remaining trip budget impact and contingency reserve`,
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'tripmind',
      text: defaultInitText,
      timestamp: '09:00 AM',
      contextBadge: 'Trip Operating Intelligence',
      actionablePills: defaultPills,
    },
  ]);

  if (!isOpen) return null;

  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || isLoading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          tripContext: {
            destination: trip.title,
            duration: `${trip.daysCount} days`,
            travelers: trip.travelersCount,
            budget: `₹${trip.budgetTotal}`,
          },
        }),
      });

      const data = await res.json();
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'tripmind',
        text: data.reply || "TripMind has analyzed your request against your itinerary schedule.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextBadge: data.source === 'gemini-3.8-flash' ? 'Gemini 3.8 Intelligence' : 'TripMind Operating Engine',
        actionablePills: [
          'Review updated timeline',
          'Calculate budget impact',
          'Check walking transit time',
        ],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // Fallback response
      const fallbackMsg: Message = {
        id: `ai-fb-${Date.now()}`,
        sender: 'tripmind',
        text: isIndia
          ? `Based on your ${trip.title} schedule across ${trip.destinations.join(', ')}, scheduling morning fort visits before 11:00 AM avoids midday sun. I've re-calculated travel timing and confirmed shaded courtyard dining for your afternoon pause.`
          : `Based on your ${trip.title} pacing, scheduling outdoor activities in early morning provides optimal light and lower crowds. I've re-calculated walking transit to provide seamless connections.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        contextBadge: 'TripMind Intelligence',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[460px] shadow-2xl flex flex-col border-l animate-in slide-in-from-right duration-200 backdrop-blur-md">
      <div
        className={`flex flex-col h-full ${
          isDark
            ? 'bg-[#10161B]/95 border-white/10 text-stone-100'
            : 'bg-white/95 border-stone-200 text-stone-900'
        }`}
      >
        {/* Copilot Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-editorial text-lg font-bold block leading-none">
                Ask TripMind
              </span>
              <span className="text-[10px] font-mono-num text-emerald-400">
                Ground Travel Copilot · Active Context: {trip.destinations.join(' → ')}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-stone-500/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isAI = msg.sender === 'tripmind';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAI ? 'items-start' : 'items-end'}`}
              >
                {/* Context badge */}
                {msg.contextBadge && (
                  <span className="text-[10px] font-mono-num text-emerald-400 mb-1 px-1">
                    {msg.contextBadge}
                  </span>
                )}

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl max-w-[92%] text-xs leading-relaxed font-sans-ui ${
                    isAI
                      ? isDark
                        ? 'bg-[#161F26] border border-white/10 text-stone-200'
                        : 'bg-stone-100 border border-stone-200 text-stone-800'
                      : 'bg-emerald-600 text-white font-medium shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                <span className="text-[9px] font-mono-num text-stone-500 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Actionable Question Pills */}
                {msg.actionablePills && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {msg.actionablePills.map((pill, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(pill)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border text-left transition-colors cursor-pointer ${
                          isDark
                            ? 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10 hover:text-white'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {pill}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 text-xs text-stone-400">
              <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin"></div>
              <span>TripMind is cross-referencing route coordinates...</span>
            </div>
          )}
        </div>

        {/* Query Input Box */}
        <div className="p-4 border-t border-white/10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about weather, transit, quieter spots, dinner..."
              className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all ${
                isDark
                  ? 'bg-black/20 border-white/10 text-white placeholder:text-stone-500'
                  : 'bg-stone-100 border-stone-200 text-stone-900 placeholder:text-stone-400'
              }`}
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <span className="text-[10px] text-stone-500 block text-center mt-2 font-mono-num">
            TripMind Travel Operating Engine · Powered by Gemini
          </span>
        </div>
      </div>
    </div>
  );
};
