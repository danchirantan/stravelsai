import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Download,
  Sparkles,
  Compass,
  Calendar,
  DollarSign,
  QrCode
} from 'lucide-react';
import { Trip } from '../../types/travel';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  theme: 'dark' | 'light';
  currency: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  trip,
  theme,
  currency,
}) => {
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `https://tripmind.ai/journey/${trip.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-xl rounded-2xl shadow-2xl border overflow-hidden transition-all relative ${
          isDark ? 'bg-[#10161B] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-500/10 text-stone-400 hover:text-white transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Editorial Magazine Share Card Preview */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-mono-num text-emerald-400 uppercase tracking-widest block">
              TripMind Editorial Export
            </span>
            <h2 className="font-editorial text-2xl md:text-3xl font-bold">
              Share Your Journey
            </h2>
          </div>

          {/* Magazine Cover Preview Container */}
          <div className="rounded-xl border border-white/10 overflow-hidden relative shadow-xl">
            <div className="relative h-60 overflow-hidden">
              <img
                src={trip.coverImage}
                alt={trip.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent" />

              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-mono-num font-bold uppercase px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-emerald-300 border border-white/10">
                  {trip.title ? `ROYAL JOURNEY: ${trip.title.split('—')[0].trim()}` : "CHIRANTAN'S EXPEDITION"}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-mono-num text-emerald-400 font-semibold block mb-1">
                  {trip.subtitle} · {trip.daysCount} Days
                </span>
                <h3 className="font-editorial text-2xl font-bold leading-tight">
                  {trip.title}
                </h3>
              </div>
            </div>

            <div className="p-4 bg-stone-900/90 text-xs flex items-center justify-between font-mono-num border-t border-white/10 text-stone-300">
              <span>Confidence 92% · 42 Curated Stops</span>
              <span className="text-emerald-400">TRIPMIND TRAVEL OS</span>
            </div>
          </div>

          {/* Share Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-stone-400 block">
              Public Read-Only Travel Magazine Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-black/20 border border-white/10 text-stone-300 font-mono-num focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied Link' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Export Action */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-stone-400">
              Export ready for PDF and offline mobile viewing.
            </span>
            <button
              onClick={handleExport}
              className={`px-4 py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                exportSuccess
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                  : 'border-white/10 hover:bg-white/5 text-stone-200'
              }`}
            >
              {exportSuccess ? <Check className="w-3.5 h-3.5" /> : <Download className="w-3.5 h-3.5" />}
              <span>{exportSuccess ? 'Dossier Downloaded' : 'Export Full Dossier'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
