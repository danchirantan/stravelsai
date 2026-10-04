import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowUpDown,
  MoveRight,
  Info,
  DollarSign,
  Sun,
  CloudRain,
  Share2,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Users,
  Check,
  Award
} from 'lucide-react';
import { Trip, ItineraryDay, Activity, ActivityCategory, SuggestedItineraryItem, WeatherDisruptionAlert, DestinationWeather } from '../../types/travel';

interface ItineraryViewProps {
  trip: Trip;
  onUpdateTrip: (updated: Trip) => void;
  openCopilot: () => void;
  openNotifications?: () => void;
  theme: 'dark' | 'light';
  currency: string;
  suggestedItems: SuggestedItineraryItem[];
  weatherAlerts?: WeatherDisruptionAlert[];
  liveWeather?: Record<string, DestinationWeather>;
  onVoteSuggestion: (id: string, direction: 'up' | 'down') => void;
  onAcceptSuggestion: (id: string) => void;
  onProposeSuggestion: (item: Omit<SuggestedItineraryItem, 'id' | 'upvotes' | 'downvotes' | 'userVote' | 'companionVotes' | 'status'>) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  trip,
  onUpdateTrip,
  openCopilot,
  openNotifications,
  theme,
  currency,
  suggestedItems,
  weatherAlerts = [],
  liveWeather,
  onVoteSuggestion,
  onAcceptSuggestion,
  onProposeSuggestion,
}) => {
  const isDark = theme === 'dark';
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(3);
  const [expandedActivityId, setExpandedActivityId] = useState<string | null>('act-3-4');
  const [conflictPrompt, setConflictPrompt] = useState<{
    show: boolean;
    message: string;
    actionActivityId?: string;
  } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [activeTabSection, setActiveTabSection] = useState<'schedule' | 'suggestions'>('schedule');

  const [showAddActivityModal, setShowAddActivityModal] = useState<boolean>(false);
  const [showProposeModal, setShowProposeModal] = useState<boolean>(false);

  // New activity form
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('16:00');
  const [newCategory, setNewCategory] = useState<ActivityCategory>('Culture');
  const [newDuration, setNewDuration] = useState('1h 30m');
  const [newCost, setNewCost] = useState('1500');
  const [newLocation, setNewLocation] = useState('Jaipur Old City');
  const [newReason, setNewReason] = useState('Great spot for group cultural immersion.');

  const currentDay = trip.days.find((d) => d.dayNumber === selectedDayNumber) || trip.days[0];

  // Filter activities
  const filteredActivities = currentDay.activities.filter((act) => {
    if (categoryFilter === 'All') return true;
    return act.category === categoryFilter;
  });

  // Filter suggestions for current day
  const currentDaySuggestions = suggestedItems.filter(
    (s) => s.dayNumber === selectedDayNumber || s.dayNumber === 0
  );

  // Reorder / shift activity (simulates drag/move)
  const handleMoveActivity = (index: number, direction: 'up' | 'down') => {
    const acts = [...currentDay.activities];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= acts.length) return;

    // Swap
    const temp = acts[index];
    acts[index] = acts[targetIdx];
    acts[targetIdx] = temp;

    // Trigger AI transit conflict alert to demonstrate proactive intelligence
    setConflictPrompt({
      show: true,
      message: `Moving "${temp.title}" creates a potential 38-minute transit conflict with "${acts[index].title}". TripMind can re-sequence the afternoon buffer.`,
      actionActivityId: temp.id,
    });

    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber ? { ...d, activities: acts } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleResolveConflict = () => {
    setConflictPrompt(null);
  };

  const handleDeleteActivity = (actId: string) => {
    const acts = currentDay.activities.filter((a) => a.id !== actId);
    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber ? { ...d, activities: acts } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleVoteMasterActivity = (actId: string, direction: 'up' | 'down') => {
    const acts = currentDay.activities.map((a) => {
      if (a.id !== actId) return a;
      const currentUp = a.upvotes || 3;
      const currentDown = a.downvotes || 0;
      let newUp = currentUp;
      let newDown = currentDown;
      let newUserVote: 'up' | 'down' | null = a.userVote || null;

      if (direction === 'up') {
        if (newUserVote === 'up') {
          newUp = Math.max(0, currentUp - 1);
          newUserVote = null;
        } else if (newUserVote === 'down') {
          newUp = currentUp + 1;
          newDown = Math.max(0, currentDown - 1);
          newUserVote = 'up';
        } else {
          newUp = currentUp + 1;
          newUserVote = 'up';
        }
      } else {
        if (newUserVote === 'down') {
          newDown = Math.max(0, currentDown - 1);
          newUserVote = null;
        } else if (newUserVote === 'up') {
          newDown = currentDown + 1;
          newUp = Math.max(0, currentUp - 1);
          newUserVote = 'down';
        } else {
          newDown = currentDown + 1;
          newUserVote = 'down';
        }
      }

      return {
        ...a,
        upvotes: newUp,
        downvotes: newDown,
        userVote: newUserVote,
      };
    });

    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber ? { ...d, activities: acts } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    const newAct: Activity = {
      id: `act-custom-${Date.now()}`,
      time: newTime,
      title: newTitle,
      category: newCategory,
      duration: newDuration,
      cost: Number(newCost) || 0,
      currency: currency || 'INR',
      location: newLocation,
      coordinates: { lat: 35.0116, lng: 135.7681 },
      reservationStatus: 'Recommended',
      aiReason: newReason || 'Manually added by traveler; TripMind verified proximity to adjacent stops.',
      upvotes: 2,
      downvotes: 0,
      userVote: 'up',
    };

    const acts = [...currentDay.activities, newAct].sort((a, b) =>
      a.time.localeCompare(b.time)
    );
    const updatedDays = trip.days.map((d) =>
      d.dayNumber === currentDay.dayNumber ? { ...d, activities: acts } : d
    );
    onUpdateTrip({ ...trip, days: updatedDays });

    setNewTitle('');
    setShowAddActivityModal(false);
  };

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    onProposeSuggestion({
      dayNumber: selectedDayNumber,
      time: newTime,
      title: newTitle,
      category: newCategory,
      duration: newDuration,
      cost: Number(newCost) || 0,
      currency: currency || 'INR',
      location: newLocation,
      coordinates: { lat: 35.0116, lng: 135.7681 },
      suggestedBy: {
        name: 'Chirantan Dan',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
        role: 'Organizer',
      },
      aiReason: newReason || 'Suggested for companion review and voting.',
    });

    setNewTitle('');
    setShowProposeModal(false);
    setActiveTabSection('suggestions');
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Trip Overview Header */}
      <section
        className={`p-6 md:p-8 rounded-2xl border transition-all ${
          isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>{trip.daysCount} DAYS MASTER ITINERARY</span>
              <span aria-hidden="true">·</span>
              <span>CONFIDENCE 92%</span>
            </div>
            <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
              {trip.title}
            </h1>
            <p className="text-xs md:text-sm text-stone-400 font-sans-ui">
              {trip.subtitle} · {trip.travelersCount} Travelers · {trip.pace} Rhythm
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono-num">
            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
              <span className="text-stone-400 block text-[10px] uppercase">Total Budget</span>
              <span className="font-bold text-emerald-400 text-sm">
                ₹{trip.budgetTotal.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
              <span className="text-stone-400 block text-[10px] uppercase">Cities Covered</span>
              <span className="font-bold text-white text-sm">3 Regional Hubs</span>
            </div>
            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
              <span className="text-stone-400 block text-[10px] uppercase">Experiences</span>
              <span className="font-bold text-white text-sm">42 Curated</span>
            </div>
            <div className="p-3 rounded-xl bg-black/20 border border-white/5">
              <span className="text-stone-400 block text-[10px] uppercase">Companion Suggestions</span>
              <span className="font-bold text-teal-300 text-sm">
                {suggestedItems.filter((s) => s.status === 'Pending').length} Pending Vote
              </span>
            </div>
          </div>
        </div>

        {/* Trip Health Transparent Scorecard */}
        <div className="pt-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-stone-300">
              Trip Health & Feasibility Telemetry
            </span>
            <span className="text-[11px] text-stone-400 font-mono-num">
              All metrics validated against physical distances & timetables
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Budget</span>
                <span className="text-emerald-400 font-semibold">Excellent</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                ₹15,500 under limit with contingency buffers.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Pacing</span>
                <span className="text-emerald-400 font-semibold">Balanced</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                Average 3.2 sights/day with 45m transit buffers.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Transit</span>
                <span className="text-emerald-400 font-semibold">Efficient</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                Shinkansen Nozomi Green Car reserved.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Weather</span>
                <span className="text-amber-300 font-semibold">Monitored</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                Day 3 drizzle accommodated indoors.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-black/20 border border-white/5 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400">Readiness</span>
                <span className="text-emerald-400 font-semibold">78% Complete</span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                Flights & Ryokans confirmed; tea slot reserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Conflict Detection Banner (if triggered) */}
      {conflictPrompt?.show && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-4 animate-in slide-in-from-top-2 duration-200 ${
            isDark
              ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
              : 'bg-amber-50 border-amber-200 text-amber-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs">
              <span className="font-semibold block">TripMind Schedule Adjustment</span>
              <span>{conflictPrompt.message}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleResolveConflict}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 transition-colors cursor-pointer"
            >
              Auto-Optimize Buffer
            </button>
            <button
              onClick={() => setConflictPrompt(null)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-amber-500/30 hover:bg-amber-500/10 transition-colors cursor-pointer"
            >
              Keep Anyway
            </button>
          </div>
        </div>
      )}

      {/* Day Selector Tabs (Days 1 to 7) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {trip.days.map((day) => {
          const isActive = day.dayNumber === selectedDayNumber;
          const daySugCount = suggestedItems.filter(
            (s) => s.dayNumber === day.dayNumber && s.status === 'Pending'
          ).length;

          return (
            <button
              key={day.dayNumber}
              onClick={() => setSelectedDayNumber(day.dayNumber)}
              className={`flex flex-col text-left px-4 py-3 rounded-xl border shrink-0 transition-all cursor-pointer min-w-[130px] ${
                isActive
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                  : isDark
                  ? 'bg-[#11171C] border-white/8 text-stone-400 hover:text-stone-200 hover:bg-white/5'
                  : 'bg-white border-stone-200 text-stone-600 hover:text-stone-950 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono-num mb-1">
                <span className="font-bold text-current">Day 0{day.dayNumber}</span>
                <span className="text-[10px] text-stone-400">{day.city}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium truncate block text-stone-300">
                  {day.weather.temp} · {day.weather.condition.split(' ')[0]}
                </span>
                {daySugCount > 0 && (
                  <span className="text-[9px] font-mono-num px-1 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    +{daySugCount} vote
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-Navigation between Scheduled Itinerary & Companion Voting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTabSection('schedule')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'schedule'
                ? 'bg-emerald-600 text-white shadow-sm'
                : isDark
                ? 'bg-white/5 text-stone-400 hover:text-white'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Master Schedule ({filteredActivities.length})</span>
          </button>

          <button
            onClick={() => setActiveTabSection('suggestions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeTabSection === 'suggestions'
                ? 'bg-emerald-600 text-white shadow-sm'
                : isDark
                ? 'bg-white/5 text-stone-400 hover:text-white'
                : 'bg-stone-100 text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-teal-300" />
            <span>Companion Voting & Suggestions</span>
            {currentDaySuggestions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-teal-400/20 text-teal-300 text-[10px] font-mono-num font-bold">
                {currentDaySuggestions.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeTabSection === 'schedule' ? (
            <>
              {/* Category Filter */}
              <div className="flex items-center gap-1 p-1 rounded-lg border border-white/10 bg-black/20 text-xs">
                {['All', 'Culture', 'Food', 'Sightseeing', 'Transit'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      categoryFilter === cat
                        ? 'bg-white/15 text-white font-medium shadow-sm'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowAddActivityModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Stop</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowProposeModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Propose Stop for Voting</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: Master Scheduled Itinerary Stream */}
      {activeTabSection === 'schedule' && (
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-num text-stone-400 mb-1">
              <span>{currentDay.date}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold">{currentDay.city}</span>
              <span aria-hidden="true">·</span>
              <span>{currentDay.weather.temp}</span>
            </div>
            <h2 className="font-editorial text-2xl md:text-3xl font-bold">
              {currentDay.theme}
            </h2>
            {currentDay.weather.advisory && (
              <div className="mt-3 p-3.5 rounded-xl border border-amber-500/30 bg-amber-950/20 text-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <CloudRain className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-semibold text-amber-300 block">Weather Disruption Detected</span>
                    <span className="text-stone-300">{currentDay.weather.advisory}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {openNotifications && (
                    <button
                      onClick={openNotifications}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors cursor-pointer"
                    >
                      View Radar Report
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 relative before:absolute before:left-7 md:before:left-8 before:top-4 before:bottom-4 before:w-0.5 before:bg-white/10">
            {filteredActivities.map((activity, index) => {
              const isExpanded = expandedActivityId === activity.id;
              const upCount = activity.upvotes ?? 3;
              const downCount = activity.downvotes ?? 0;
              const netScore = upCount - downCount;

              return (
                <div
                  key={activity.id}
                  className={`relative pl-14 md:pl-18 transition-all group ${
                    isDark ? 'text-stone-200' : 'text-stone-800'
                  }`}
                >
                  {/* Timeline Marker Node */}
                  <div
                    className={`absolute left-5 md:left-6 top-5 -translate-x-1/2 w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center ${
                      isExpanded
                        ? 'bg-emerald-400 border-emerald-400 shadow-md ring-4 ring-emerald-500/20'
                        : 'bg-[#11171C] border-stone-500 group-hover:border-emerald-400'
                    }`}
                  />

                  {/* Activity Card */}
                  <div
                    className={`rounded-xl border p-4 md:p-5 transition-all ${
                      isDark
                        ? 'bg-[#11171C] border-white/10 hover:border-white/20'
                        : 'bg-white border-stone-200 shadow-sm hover:border-stone-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2 text-xs font-mono-num text-stone-400">
                          <span className="font-bold text-emerald-400">{activity.time}</span>
                          <span aria-hidden="true">·</span>
                          <span>{activity.duration}</span>
                          {activity.travelTime && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-stone-400">Transit {activity.travelTime}</span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span className="text-stone-300">{activity.category}</span>
                        </div>

                        <h3 className="font-editorial text-lg md:text-xl font-bold text-white">
                          {activity.title}
                        </h3>

                        <div className="flex items-center gap-3 text-xs text-stone-400 font-sans-ui">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            <span>{activity.location}</span>
                          </span>
                          {activity.cost > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="font-mono-num font-medium text-stone-300">
                                ₹{activity.cost.toLocaleString('en-IN')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Companion Voting & Status Controls */}
                      <div className="flex flex-wrap items-center gap-2 self-start">
                        {/* Companion Voting Widget on Itinerary Item */}
                        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/30 border border-white/10">
                          <button
                            onClick={() => handleVoteMasterActivity(activity.id, 'up')}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              activity.userVote === 'up'
                                ? 'text-emerald-400 bg-emerald-500/20'
                                : 'text-stone-400 hover:text-emerald-400'
                            }`}
                            title="Upvote this scheduled stop"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>

                          <span
                            className={`text-[11px] font-mono-num font-bold px-1.5 py-0.5 rounded ${
                              netScore > 0 ? 'text-emerald-400 bg-emerald-950/40' : netScore < 0 ? 'text-rose-400 bg-rose-950/40' : 'text-stone-400'
                            }`}
                            title={`Total Votes: ${upCount + downCount} · ${upCount} Upvotes, ${downCount} Downvotes`}
                          >
                            Total: {upCount + downCount} ({netScore > 0 ? `+${netScore}` : netScore})
                          </span>

                          <button
                            onClick={() => handleVoteMasterActivity(activity.id, 'down')}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              activity.userVote === 'down'
                                ? 'text-rose-400 bg-rose-500/20'
                                : 'text-stone-400 hover:text-rose-400'
                            }`}
                            title="Downvote this scheduled stop"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span
                          className={`text-[10px] font-mono-num px-2 py-0.5 rounded border ${
                            activity.reservationStatus === 'Confirmed'
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                              : activity.reservationStatus === 'Reserved'
                              ? 'bg-teal-950/40 text-teal-300 border-teal-500/30'
                              : 'bg-stone-800 text-stone-300 border-stone-700'
                          }`}
                        >
                          {activity.reservationStatus}
                        </span>

                        {/* Reorder Buttons */}
                        <div className="flex items-center rounded border border-white/10 bg-black/20">
                          <button
                            onClick={() => handleMoveActivity(index, 'up')}
                            disabled={index === 0}
                            title="Move Earlier"
                            className="p-1 hover:bg-white/10 disabled:opacity-30 text-stone-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveActivity(index, 'down')}
                            disabled={index === filteredActivities.length - 1}
                            title="Move Later"
                            className="p-1 hover:bg-white/10 disabled:opacity-30 text-stone-400 hover:text-white transition-colors cursor-pointer"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          title="Remove activity"
                          className="p-1.5 rounded hover:bg-red-500/10 text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Expand/Collapse details */}
                        <button
                          onClick={() =>
                            setExpandedActivityId(isExpanded ? null : activity.id)
                          }
                          className="p-1.5 rounded hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* "Why TripMind Picked This" AI Expandable Insight */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-white/5 space-y-3 animate-in fade-in duration-150">
                        <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 flex items-start gap-2.5">
                          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-[11px] font-mono-num uppercase tracking-wider text-emerald-300 font-semibold block">
                              Why TripMind Selected This
                            </span>
                            <p className="text-xs text-stone-300 leading-relaxed font-sans-ui">
                              {activity.aiReason}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                          <div className="flex items-center gap-3">
                            <span>GPS: {activity.coordinates.lat.toFixed(4)}, {activity.coordinates.lng.toFixed(4)}</span>
                            <span aria-hidden="true">·</span>
                            <span>Estimated duration: {activity.duration}</span>
                          </div>
                          <button
                            onClick={openCopilot}
                            className="text-xs text-teal-400 hover:text-teal-300 underline underline-offset-2 cursor-pointer"
                          >
                            Ask Copilot for alternatives
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION 2: Companion Suggested Items & Voting System */}
      {activeTabSection === 'suggestions' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono-num text-teal-400">
                <Users className="w-3.5 h-3.5" />
                <span>TRAVEL PARTY COLLABORATIVE DECISION ENGINE</span>
              </div>
              <h2 className="font-editorial text-2xl md:text-3xl font-bold">
                Companion Suggestions & Voting
              </h2>
              <p className="text-xs text-stone-400">
                Upvote or downvote suggested activities proposed by Elena, Marcus, and group members. The system tallies consensus to finalize stops.
              </p>
            </div>

            <button
              onClick={() => setShowProposeModal(true)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 self-start cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Propose Stop</span>
            </button>
          </div>

          {/* Suggestions List */}
          {currentDaySuggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {currentDaySuggestions.map((suggestion) => {
                const netScore = suggestion.upvotes - suggestion.downvotes;
                const isAccepted = suggestion.status === 'Accepted';

                // Consensus badge
                let consensusBadge = 'Discussion in Progress';
                let consensusColor = 'text-stone-300 bg-stone-800 border-stone-700';

                if (netScore >= 3) {
                  consensusBadge = 'High Group Consensus';
                  consensusColor = 'text-emerald-300 bg-emerald-950/40 border-emerald-500/30';
                } else if (netScore < 0) {
                  consensusBadge = 'Contested / Mixed';
                  consensusColor = 'text-rose-300 bg-rose-950/40 border-rose-500/30';
                }

                return (
                  <div
                    key={suggestion.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                      isAccepted
                        ? 'bg-emerald-950/20 border-emerald-500/40'
                        : isDark
                        ? 'bg-[#11171C] border-white/10 hover:border-white/20'
                        : 'bg-white border-stone-200 shadow-sm'
                    }`}
                  >
                    <div className="space-y-3">
                      {/* Top Proposer Lockup & Score Banner */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={suggestion.suggestedBy.avatar}
                            alt={suggestion.suggestedBy.name}
                            referrerPolicy="no-referrer"
                            className="w-8 h-8 rounded-full object-cover border border-emerald-500/30"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-white">
                                {suggestion.suggestedBy.name}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono-num">
                                · {suggestion.suggestedBy.role}
                              </span>
                            </div>
                            <span className="text-[10px] text-stone-400 font-mono-num">
                              Suggested for Day 0{suggestion.dayNumber} · {suggestion.time}
                            </span>
                          </div>
                        </div>

                        {/* Status Tag */}
                        <span className={`text-[10px] font-mono-num px-2 py-0.5 rounded border ${consensusColor}`}>
                          {isAccepted ? 'Added to Itinerary ✓' : consensusBadge}
                        </span>
                      </div>

                      {/* Title & Metadata */}
                      <div>
                        <h3 className="font-editorial text-xl font-bold text-white leading-tight">
                          {suggestion.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-stone-400 font-mono-num mt-1">
                          <span className="text-emerald-400 font-semibold">{suggestion.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{suggestion.duration}</span>
                          <span aria-hidden="true">·</span>
                          <span>{suggestion.location}</span>
                          {suggestion.cost > 0 && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-stone-300 font-bold">
                                ₹{suggestion.cost.toLocaleString('en-IN')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* AI Feasibility Note */}
                      <div className="p-3 rounded-xl bg-black/20 border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono-num text-emerald-400 uppercase tracking-wider font-semibold">
                          <Sparkles className="w-3 h-3" />
                          <span>Feasibility Context</span>
                        </div>
                        <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
                          {suggestion.aiReason}
                        </p>
                      </div>

                      {/* Voter Avatars Breakdown */}
                      <div className="pt-1 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] text-stone-400">Voters:</span>
                          <div className="flex -space-x-1.5 overflow-hidden">
                            {suggestion.companionVotes.map((v, idx) => (
                              <img
                                key={idx}
                                src={v.avatar}
                                alt={v.companionName}
                                title={`${v.companionName}: voted ${v.vote.toUpperCase()}`}
                                className={`inline-block h-5 w-5 rounded-full ring-2 ${
                                  v.vote === 'up' ? 'ring-emerald-500' : 'ring-rose-500'
                                } object-cover`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Explicit Total Votes Display */}
                        <div className="text-[11px] font-mono-num flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/40 border border-white/5">
                          <span className="text-white font-bold">
                            Total: {suggestion.upvotes + suggestion.downvotes} Votes
                          </span>
                          <span className="text-stone-500">·</span>
                          <span className="text-emerald-400 font-semibold">{suggestion.upvotes} Up</span>
                          <span className="text-stone-500">/</span>
                          <span className="text-rose-400 font-semibold">{suggestion.downvotes} Down</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Voting Actions & Promotion Bar */}
                    <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between gap-3">
                      {/* Interactive Voting Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onVoteSuggestion(suggestion.id, 'up')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold transition-all cursor-pointer border ${
                            suggestion.userVote === 'up'
                              ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                              : isDark
                              ? 'bg-white/5 border-white/10 text-stone-300 hover:text-emerald-400 hover:bg-emerald-500/10'
                              : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                          }`}
                          title="Vote Yes / Upvote"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>{suggestion.upvotes}</span>
                        </button>

                        <button
                          onClick={() => onVoteSuggestion(suggestion.id, 'down')}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold transition-all cursor-pointer border ${
                            suggestion.userVote === 'down'
                              ? 'bg-rose-600 text-white border-rose-500 shadow-sm'
                              : isDark
                              ? 'bg-white/5 border-white/10 text-stone-300 hover:text-rose-400 hover:bg-rose-500/10'
                              : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200'
                          }`}
                          title="Vote No / Downvote"
                        >
                          <ThumbsDown className="w-3.5 h-3.5" />
                          <span>{suggestion.downvotes}</span>
                        </button>

                        {/* Net Score Pill */}
                        <span
                          className={`text-xs font-mono-num font-bold px-2 py-1 rounded-md ${
                            netScore > 0
                              ? 'text-emerald-400 bg-emerald-950/30'
                              : netScore < 0
                              ? 'text-rose-400 bg-rose-950/30'
                              : 'text-stone-400 bg-black/20'
                          }`}
                        >
                          Net: {netScore > 0 ? `+${netScore}` : netScore}
                        </span>
                      </div>

                      {/* Accept into Itinerary Button */}
                      {!isAccepted ? (
                        <button
                          onClick={() => onAcceptSuggestion(suggestion.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Accept Stop</span>
                        </button>
                      ) : (
                        <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>On Master Schedule</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center rounded-2xl border border-white/10 bg-[#11171C] p-8 space-y-3">
              <Users className="w-8 h-8 text-stone-500 mx-auto" />
              <h3 className="font-editorial text-xl font-bold text-white">
                No Companion Suggestions for Day 0{selectedDayNumber} Yet
              </h3>
              <p className="text-xs text-stone-400 max-w-md mx-auto">
                Propose an activity or dining spot for your travel companions to review and vote on.
              </p>
              <button
                onClick={() => setShowProposeModal(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Propose First Stop</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Propose Stop for Companion Voting Modal */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-2xl p-6 border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#12181D] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-teal-400" />
                <h3 className="font-editorial text-xl font-bold">Propose Stop for Companion Voting</h3>
              </div>
              <button
                onClick={() => setShowProposeModal(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProposeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Title of Proposed Experience</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Philosopher's Path Sunset Walk"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Target Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  >
                    <option value="Culture">Culture</option>
                    <option value="Food">Food</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Relaxation">Relaxation</option>
                    <option value="Nightlife">Nightlife</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="1h 30m"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Est. Cost (₹ INR)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="2500"
                    className="w-full px-3.5 py-2 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Location Details</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Hawa Mahal Road, Badi Chaupar, Jaipur"
                  className="w-full px-3.5 py-2 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Why Companions Will Love This</label>
                <textarea
                  rows={2}
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="Intricate jharokha lattice work, rooftop views and artisan spice stalls nearby..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProposeModal(false)}
                  className="px-4 py-2 rounded-xl border border-white/10 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold shadow-sm"
                >
                  Submit for Companion Voting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Custom Activity to Master Itinerary Modal */}
      {showAddActivityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            className={`w-full max-w-md rounded-xl p-6 border shadow-2xl space-y-4 ${
              isDark ? 'bg-[#12181D] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
            }`}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="font-editorial text-xl font-bold">Add Stop to Day 0{currentDay.dayNumber}</h3>
              <button
                onClick={() => setShowAddActivityModal(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddActivity} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-400 block mb-1">Title of Activity / Venue</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Albert Hall Museum or Anokhi Museum"
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  >
                    <option value="Culture">Culture</option>
                    <option value="Food">Food</option>
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Transit">Transit</option>
                    <option value="Relaxation">Relaxation</option>
                    <option value="Shopping">Shopping</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-400 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="1h 30m"
                    className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-stone-400 block mb-1">Cost (₹ INR)</label>
                  <input
                    type="number"
                    value={newCost}
                    onChange={(e) => setNewCost(e.target.value)}
                    placeholder="1500"
                    className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-400 block mb-1">Location Details</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="Badi Choupad, Old Pink City, Jaipur"
                  className="w-full px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white text-xs focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddActivityModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                >
                  Save to Itinerary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
