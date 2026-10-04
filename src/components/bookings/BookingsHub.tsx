import React, { useState } from 'react';
import {
  Ticket,
  Plane,
  Building,
  Train,
  Sparkles,
  Download,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { MOCK_BOOKINGS } from '../../data/mockData';
import { Booking } from '../../types/travel';

interface BookingsHubProps {
  theme: 'dark' | 'light';
  currency: string;
}

export const BookingsHub: React.FC<BookingsHubProps> = ({
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [selectedType, setSelectedType] = useState<string>('All');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const filtered = MOCK_BOOKINGS.filter((b) => {
    if (selectedType === 'All') return true;
    return b.type === selectedType;
  });

  const handleDownloadVoucher = (ref: string) => {
    setDownloadSuccess(ref);
    setTimeout(() => setDownloadSuccess(null), 2500);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
          <Ticket className="w-4 h-4 text-emerald-400" />
          <span>CENTRALIZED RESERVATIONS VAULT</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
          Bookings Hub
        </h1>
        <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-xl">
          Confirmed flights, high-speed rail passes, ryokan reservations, and VIP admissions with digital offline vouchers.
        </p>
      </div>

      {/* Type Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
        {['All', 'Flight', 'Hotel', 'Train', 'Activity'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedType === type
                ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                : isDark
                ? 'text-stone-400 hover:text-white hover:bg-white/5'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            {type === 'All' ? 'All Bookings' : `${type}s`}
          </button>
        ))}
      </div>

      {/* Bookings Card List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((booking) => {
          const isDownloaded = downloadSuccess === booking.reference;
          return (
            <div
              key={booking.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                      {booking.type === 'Flight' && <Plane className="w-4 h-4" />}
                      {booking.type === 'Hotel' && <Building className="w-4 h-4" />}
                      {booking.type === 'Train' && <Train className="w-4 h-4" />}
                      {booking.type === 'Activity' && <Sparkles className="w-4 h-4" />}
                    </div>
                    <div>
                      <span className="text-[10px] font-mono-num uppercase tracking-wider text-emerald-400 font-semibold block">
                        {booking.provider}
                      </span>
                      <h3 className="font-editorial text-xl font-bold leading-tight">
                        {booking.title}
                      </h3>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                    {booking.status}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-2 text-xs font-mono-num">
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Confirmation Ref:</span>
                    <span className="font-bold text-white tracking-wider">{booking.reference}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Date & Schedule:</span>
                    <span className="text-stone-300">{booking.date} · {booking.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-stone-400">Location:</span>
                    <span className="text-stone-300 truncate max-w-[200px]">{booking.location}</span>
                  </div>
                </div>

                <p className="text-[11px] text-stone-400 leading-relaxed font-sans-ui">
                  <span className="font-semibold text-stone-300">Policy: </span>
                  {booking.cancellationPolicy}
                </p>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between">
                <div>
                  <span className="font-mono-num font-bold text-emerald-400 text-sm">
                    ₹{booking.cost.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-stone-400 block -mt-0.5">settled in full</span>
                </div>

                <button
                  onClick={() => handleDownloadVoucher(booking.reference)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    isDownloaded
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : isDark
                      ? 'border-white/10 hover:bg-white/5 text-stone-300'
                      : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  {isDownloaded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Pass Generated</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Digital Pass</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
