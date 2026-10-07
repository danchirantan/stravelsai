import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  ChevronDown,
  ChevronUp,
  MapPin,
  ArrowRight,
  Sun,
  Sparkles,
  Plus,
  Minus,
  Check,
  PlaneTakeoff,
  Flag
} from 'lucide-react';
import { Trip } from '../../types/travel';
import { ActiveTab } from './Sidebar';

interface TripGlobalProgressBarProps {
  trip: Trip;
  completedDays: number;
  onUpdateCompletedDays: (newCount: number) => void;
  onSelectDay?: (dayNumber: number) => void;
  setActiveTab: (tab: ActiveTab) => void;
  theme: 'dark' | 'light';
}

export const TripGlobalProgressBar: React.FC<TripGlobalProgressBarProps> = ({
  trip,
  completedDays,
  onUpdateCompletedDays,
  onSelectDay,
  setActiveTab,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredDayNumber, setHoveredDayNumber] = useState<number | null>(null);

  const totalDays = trip.daysCount || trip.days.length || 1;
  const clampedCompleted = Math.max(0, Math.min(completedDays, totalDays));
  const progressPercent = Math.round((clampedCompleted / totalDays) * 100);

  // Active / current day is typically the next uncompleted day (or totalDays if all finished)
  const currentDayNumber = clampedCompleted < totalDays ? clampedCompleted + 1 : totalDays;
  const currentDayData = trip.days.find((d) => d.dayNumber === currentDayNumber) || trip.days[0];
  const remainingDays = Math.max(0, totalDays - clampedCompleted);

  // Format date range
  const formattedDates = trip.startDate && trip.endDate
    ? `${trip.startDate} — ${trip.endDate}`
    : `${totalDays} Days Journey`;

  const handleDayClick = (dayNumber: number) => {
    if (onSelectDay) {
      onSelectDay(dayNumber);
    }
    setActiveTab('itinerary');
  };

  const handleIncrement = () => {
    if (clampedCompleted < totalDays) {
      onUpdateCompletedDays(clampedCompleted + 1);
    }
  };

  const handleDecrement = () => {
    if (clampedCompleted > 0) {
      onUpdateCompletedDays(clampedCompleted - 1);
    }
  };

  const handleToggleDayCompleted = (dayNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (dayNumber <= clampedCompleted) {
      // Unmark up to this day minus 1
      onUpdateCompletedDays(dayNumber - 1);
    } else {
      // Mark complete through this day
      onUpdateCompletedDays(dayNumber);
    }
  };

  return (
    <div
      className={`border-b transition-colors duration-200 select-none ${
        isDark
          ? 'bg-stone-900/90 border-stone-800/80 backdrop-blur-md text-stone-200'
          : 'bg-white/95 border-stone-200/90 backdrop-blur-md text-stone-800'
      }`}
      aria-label="Trip Progress"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Top Overview Row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Journey Title & Duration Meta */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`p-1.5 rounded-lg shrink-0 ${
                isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-700'
              }`}
            >
              <Compass className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold tracking-wide uppercase truncate font-mono-num">
                  {trip.destinations?.[0] || 'Trip'} Journey Progress
                </span>

                {/* Status Indicator */}
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                    clampedCompleted === totalDays
                      ? 'text-emerald-500'
                      : clampedCompleted > 0
                      ? 'text-amber-500'
                      : isDark ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      clampedCompleted === totalDays
                        ? 'bg-emerald-400'
                        : clampedCompleted > 0
                        ? 'bg-amber-400 animate-pulse'
                        : 'bg-stone-400'
                    }`}
                  />
                  {clampedCompleted === totalDays
                    ? 'Journey Completed'
                    : clampedCompleted === 0
                    ? 'Journey Planned'
                    : `Day ${currentDayNumber} · In Progress`}
                </span>
              </div>

              {/* Clean unboxed metadata with typographic separators */}
              <div
                className={`text-[11px] flex items-center gap-2 flex-wrap leading-tight mt-0.5 ${
                  isDark ? 'text-stone-400' : 'text-stone-500'
                }`}
              >
                <span>
                  <strong>{clampedCompleted}</strong> of <strong>{totalDays}</strong> days completed ({progressPercent}%)
                </span>
                <span aria-hidden="true" className="opacity-40">·</span>
                <span className="hidden sm:inline">
                  {remainingDays === 0 ? 'Destination reached' : `${remainingDays} ${remainingDays === 1 ? 'day' : 'days'} remaining`}
                </span>
                {currentDayData?.city && (
                  <>
                    <span aria-hidden="true" className="opacity-40 hidden sm:inline">·</span>
                    <span className="hidden sm:inline flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-amber-500 inline -mt-0.5" />
                      Current City: <strong className={isDark ? 'text-stone-200' : 'text-stone-700'}>{currentDayData.city}</strong>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Quick Interactive Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Completion Stepper */}
            <div
              className={`flex items-center rounded-lg border text-xs overflow-hidden ${
                isDark ? 'border-stone-800 bg-stone-950/60' : 'border-stone-200 bg-stone-50'
              }`}
              title="Adjust completed days"
            >
              <button
                type="button"
                onClick={handleDecrement}
                disabled={clampedCompleted === 0}
                className={`px-2 py-1 transition-colors ${
                  clampedCompleted === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark
                    ? 'hover:bg-stone-800 text-stone-300'
                    : 'hover:bg-stone-200 text-stone-700'
                }`}
                title="Decrease completed days"
                aria-label="Decrease completed days"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="px-2 font-mono-num text-[11px] font-semibold">
                {clampedCompleted}/{totalDays}d
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={clampedCompleted === totalDays}
                className={`px-2 py-1 transition-colors ${
                  clampedCompleted === totalDays
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark
                    ? 'hover:bg-stone-800 text-stone-300'
                    : 'hover:bg-stone-200 text-stone-700'
                }`}
                title="Mark next day complete"
                aria-label="Mark next day complete"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            {/* Quick Itinerary Jump */}
            <button
              type="button"
              onClick={() => {
                if (onSelectDay) onSelectDay(currentDayNumber);
                setActiveTab('itinerary');
              }}
              className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                isDark
                  ? 'border-stone-800 hover:border-amber-500/40 hover:bg-stone-800 text-stone-300'
                  : 'border-stone-200 hover:border-amber-400 hover:bg-stone-100 text-stone-700'
              }`}
            >
              <span>Day {currentDayNumber} Plan</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            {/* Expand / Collapse Details Toggle */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-1.5 rounded-lg border transition-colors ${
                isDark
                  ? 'border-stone-800 hover:bg-stone-800 text-stone-400 hover:text-stone-200'
                  : 'border-stone-200 hover:bg-stone-100 text-stone-500 hover:text-stone-800'
              }`}
              title={isExpanded ? 'Collapse journey timeline' : 'Expand full journey timeline'}
              aria-label={isExpanded ? 'Collapse journey timeline' : 'Expand full journey timeline'}
            >
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Global Multi-Segment Progress Bar Track */}
        <div className="mt-2.5">
          {/* Segmented Bar */}
          <div className="relative">
            {/* Background Track with Segments */}
            <div className="grid gap-1.5 w-full" style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(0, 1fr))` }}>
              {Array.from({ length: totalDays }, (_, idx) => {
                const dayNum = idx + 1;
                const isCompleted = dayNum <= clampedCompleted;
                const isCurrent = dayNum === currentDayNumber && clampedCompleted < totalDays;
                const dayData = trip.days.find((d) => d.dayNumber === dayNum);

                return (
                  <div
                    key={dayNum}
                    onClick={() => handleDayClick(dayNum)}
                    onMouseEnter={() => setHoveredDayNumber(dayNum)}
                    onMouseLeave={() => setHoveredDayNumber(null)}
                    className="group relative cursor-pointer flex flex-col"
                  >
                    {/* The Segment Bar Line */}
                    <div
                      className={`h-2.5 rounded-full transition-all duration-300 relative overflow-hidden ${
                        isCompleted
                          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20'
                          : isCurrent
                          ? 'bg-amber-500 ring-2 ring-amber-400/40 animate-pulse'
                          : isDark
                          ? 'bg-stone-800 hover:bg-stone-700'
                          : 'bg-stone-200 hover:bg-stone-300'
                      }`}
                    >
                      {/* Subtle Completion Sheen */}
                      {isCompleted && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      )}
                    </div>

                    {/* Day Micro-Label below the bar */}
                    <div className="mt-1 flex items-center justify-between text-[10px] leading-none px-0.5">
                      <span
                        className={`font-mono-num font-medium transition-colors ${
                          isCurrent
                            ? 'text-amber-500 font-bold'
                            : isCompleted
                            ? 'text-emerald-500'
                            : isDark
                            ? 'text-stone-500 group-hover:text-stone-300'
                            : 'text-stone-400 group-hover:text-stone-700'
                        }`}
                      >
                        D{dayNum}
                      </span>
                      {dayData?.city && (
                        <span
                          className={`hidden md:inline truncate ml-1 text-[9px] max-w-[70px] ${
                            isCurrent
                              ? 'text-amber-400'
                              : isCompleted
                              ? 'text-stone-400'
                              : isDark
                              ? 'text-stone-500'
                              : 'text-stone-400'
                          }`}
                        >
                          {dayData.city}
                        </span>
                      )}
                    </div>

                    {/* Hover Floating Tooltip */}
                    {hoveredDayNumber === dayNum && (
                      <div
                        className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-nowrap p-2 rounded-lg border text-xs shadow-xl animate-in fade-in zoom-in-95 duration-150 ${
                          isDark
                            ? 'bg-stone-950 border-stone-800 text-stone-200'
                            : 'bg-white border-stone-200 text-stone-900 shadow-stone-300/40'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold">
                          <span>Day {dayNum}: {dayData?.city || 'Scheduled Stop'}</span>
                          {isCompleted ? (
                            <span className="text-emerald-400 text-[10px] font-mono-num">✓ Completed</span>
                          ) : isCurrent ? (
                            <span className="text-amber-400 text-[10px] font-mono-num">● In Progress</span>
                          ) : (
                            <span className="text-stone-400 text-[10px] font-mono-num">Scheduled</span>
                          )}
                        </div>
                        {dayData?.theme && (
                          <div className={`text-[10px] truncate max-w-xs ${isDark ? 'text-stone-400' : 'text-stone-500'}`}>
                            {dayData.theme}
                          </div>
                        )}
                        <div className="text-[9px] text-stone-400 mt-0.5">
                          {dayData?.activities?.length || 0} activities · Click to view in itinerary
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Expandable Comprehensive Timeline Horizon */}
        {isExpanded && (
          <div
            className={`mt-3.5 pt-3 border-t grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2 animate-in fade-in slide-in-from-top-1 duration-200 ${
              isDark ? 'border-stone-800/80' : 'border-stone-200'
            }`}
          >
            {Array.from({ length: totalDays }, (_, idx) => {
              const dayNum = idx + 1;
              const isCompleted = dayNum <= clampedCompleted;
              const isCurrent = dayNum === currentDayNumber && clampedCompleted < totalDays;
              const dayData = trip.days.find((d) => d.dayNumber === dayNum);

              return (
                <div
                  key={`card-${dayNum}`}
                  onClick={() => handleDayClick(dayNum)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative group ${
                    isCurrent
                      ? isDark
                        ? 'border-amber-500/50 bg-amber-500/10 shadow-sm shadow-amber-500/10'
                        : 'border-amber-400 bg-amber-50/70 shadow-sm shadow-amber-400/20'
                      : isCompleted
                      ? isDark
                        ? 'border-emerald-500/30 bg-emerald-950/20'
                        : 'border-emerald-200 bg-emerald-50/50'
                      : isDark
                      ? 'border-stone-800 bg-stone-950/40 hover:border-stone-700'
                      : 'border-stone-200 bg-stone-50 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[11px] font-mono-num font-semibold">
                      Day {dayNum}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleToggleDayCompleted(dayNum, e)}
                      className={`p-0.5 rounded transition-colors ${
                        isCompleted
                          ? 'text-emerald-500 hover:text-emerald-400'
                          : isDark
                          ? 'text-stone-600 hover:text-stone-400'
                          : 'text-stone-400 hover:text-stone-600'
                      }`}
                      title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
                    >
                      <CheckCircle2 className={`w-3.5 h-3.5 ${isCompleted ? 'fill-emerald-500/20 text-emerald-500' : ''}`} />
                    </button>
                  </div>

                  <div className="text-xs font-medium truncate mb-0.5">
                    {dayData?.city || 'Day Itinerary'}
                  </div>

                  <div
                    className={`text-[10px] truncate leading-tight ${
                      isDark ? 'text-stone-400' : 'text-stone-500'
                    }`}
                  >
                    {dayData?.theme || `${dayData?.activities?.length || 0} activities`}
                  </div>

                  {dayData?.weather && (
                    <div
                      className={`text-[9px] mt-1 flex items-center gap-1 font-mono-num ${
                        isDark ? 'text-stone-500' : 'text-stone-400'
                      }`}
                    >
                      <Sun className="w-2.5 h-2.5 text-amber-500" />
                      <span>{dayData.weather.temp}</span>
                    </div>
                  )}

                  <div className="mt-2 pt-1 border-t border-white/5 flex items-center justify-between text-[9px]">
                    <span className={isCompleted ? 'text-emerald-500' : isCurrent ? 'text-amber-500' : 'text-stone-500'}>
                      {isCompleted ? 'Done' : isCurrent ? 'Active Today' : 'Upcoming'}
                    </span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-amber-500 flex items-center gap-0.5">
                      Open <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
