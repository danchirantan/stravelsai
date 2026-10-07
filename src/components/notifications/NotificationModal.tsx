import React, { useState } from 'react';
import {
  X,
  Bell,
  Sparkles,
  Ticket,
  DollarSign,
  CloudRain,
  Check,
  CheckCheck,
  AlertTriangle,
  Flame,
  Wind,
  Droplets,
  RefreshCw,
  Compass,
  ArrowRight
} from 'lucide-react';
import { NotificationItem, WeatherDisruptionAlert } from '../../types/travel';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onSelectAction?: (actionType?: string, weatherAlert?: WeatherDisruptionAlert) => void;
  onRefreshWeather?: () => Promise<void>;
  theme: 'dark' | 'light';
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onSelectAction,
  onRefreshWeather,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'Weather' | 'AI' | 'Bookings'>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  if (!isOpen) return null;

  const weatherCount = notifications.filter((n) => n.category === 'Weather').length;

  const filteredNotifications = notifications.filter((n) => {
    if (selectedFilter === 'All') return true;
    return n.category === selectedFilter;
  });

  const handleRefresh = async () => {
    if (!onRefreshWeather || isRefreshing) return;
    setIsRefreshing(true);
    await onRefreshWeather();
    setIsRefreshing(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-20 p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden transition-all ${
          isDark ? 'bg-[#12181D] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="p-4 px-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-xl font-bold leading-tight">
                Disruption & Smart Alerts
              </h3>
              <span className="text-[10px] text-stone-400 font-mono-num">
                Real-Time Atmospheric & Logistics Telemetry
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onRefreshWeather && (
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-1.5 rounded-lg border border-white/10 text-stone-400 hover:text-emerald-400 transition-colors cursor-pointer"
                title="Refresh Real-Time Satellite Weather Radar"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              </button>
            )}

            <button
              onClick={onMarkAllAsRead}
              className="text-xs text-stone-400 hover:text-emerald-400 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="px-6 py-2 border-b border-white/5 flex items-center gap-1.5 text-xs bg-black/20">
          {(['All', 'Weather', 'AI', 'Bookings'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedFilter === filter
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <span>{filter === 'Weather' ? 'Weather Disruptions' : filter}</span>
              {filter === 'Weather' && weatherCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-stone-950 font-mono-num text-[10px] font-bold">
                  {weatherCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="max-h-[62vh] overflow-y-auto divide-y divide-white/5 p-2">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif, idx) => {
              const isWeather = notif.category === 'Weather';
              const alert = notif.weatherAlert;
              const staggerDelay = `${Math.min(idx * 45, 350)}ms`;

              if (isWeather && alert) {
                // High-priority Weather Disruption Card
                const isCritical = alert.severity === 'CRITICAL';
                return (
                  <div
                    key={notif.id}
                    style={{ animationDelay: staggerDelay }}
                    className={`p-4 md:p-5 rounded-xl m-2 border transition-all space-y-3 animate-notif-enter ${
                      isCritical
                        ? 'bg-rose-950/20 border-rose-500/40 text-stone-200'
                        : 'bg-amber-950/20 border-amber-500/40 text-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isCritical
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          <CloudRain className="w-4 h-4" />
                        </div>
                        <div>
                          <span
                            className={`text-[10px] font-mono-num font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                              isCritical
                                ? 'bg-rose-950/50 text-rose-300 border-rose-500/40'
                                : 'bg-amber-950/50 text-amber-300 border-amber-500/40'
                            }`}
                          >
                            {alert.severity} WEATHER DISRUPTION
                          </span>
                          <span className="text-[10px] text-stone-400 font-mono-num ml-2">
                            {alert.city} · {alert.targetDate || 'Live Forecast'}
                          </span>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono-num text-stone-400">
                        {notif.timestamp}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-editorial text-lg font-bold text-white leading-tight">
                        {alert.headline}
                      </h4>
                      <p className="text-xs text-stone-300 font-sans-ui mt-1 leading-relaxed">
                        {alert.details}
                      </p>
                    </div>

                    {/* Meteorological Disruption Metrics */}
                    <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono-num">
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase">Temperature</span>
                        <span className="font-bold text-white">{alert.metrics.temp}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase">Rain Probability</span>
                        <span className="font-bold text-amber-300">{alert.metrics.precipitationProb}</span>
                      </div>
                      <div>
                        <span className="text-stone-500 block text-[9px] uppercase">Precipitation Rate</span>
                        <span className="font-bold text-teal-300">{alert.metrics.precipitationAmount || 'Active'}</span>
                      </div>
                    </div>

                    {/* AI Recommendation */}
                    <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono-num text-emerald-400 font-semibold uppercase">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>TripMind Intelligent Mitigation</span>
                      </div>
                      <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
                        {alert.aiRecommendation}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-1 flex items-center justify-between">
                      <span className="text-[11px] text-stone-400 font-mono-num">
                        Satellite Radar Data Synced
                      </span>

                      <button
                        onClick={() => {
                          if (onSelectAction) onSelectAction(notif.actionType, alert);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <span>{alert.suggestedAction}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              }

              // Standard Notification Item
              return (
                <div
                  key={notif.id}
                  style={{ animationDelay: staggerDelay }}
                  className={`p-4 px-6 space-y-1 transition-colors animate-notif-enter ${
                    !notif.read ? (isDark ? 'bg-white/5' : 'bg-stone-50') : ''
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono-num">
                    <span className="text-emerald-400 font-semibold uppercase">
                      {notif.category} Intelligence
                    </span>
                    <span className="text-stone-500">{notif.timestamp}</span>
                  </div>

                  <h4 className="font-editorial text-base font-bold text-white">
                    {notif.title}
                  </h4>
                  <p className="text-xs text-stone-300 font-sans-ui leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.actionLabel && (
                    <button
                      onClick={() => {
                        if (onSelectAction) onSelectAction(notif.actionType);
                        onClose();
                      }}
                      className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2 pt-1 block cursor-pointer"
                    >
                      {notif.actionLabel} →
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-stone-400">
              No notifications matching "{selectedFilter}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
