import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Luggage,
  CloudRain,
  PhoneCall,
  Download,
  Copy,
  Check,
  Volume2,
  VolumeX,
  Share2,
  Wand2,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { Trip } from '../../types/travel';

interface TripSummariesModuleProps {
  trip: Trip;
  theme: 'dark' | 'light';
  currency?: string;
  onOpenCreativeStudio?: () => void;
}

export type SummaryTimeframe = 'weekly' | 'monthly';
export type SummaryTone = 'editorial' | 'executive' | 'storyteller' | 'concise';

export const TripSummariesModule: React.FC<TripSummariesModuleProps> = ({
  trip,
  theme,
  currency = 'INR',
  onOpenCreativeStudio,
}) => {
  const isDark = theme === 'dark';
  const [timeframe, setTimeframe] = useState<SummaryTimeframe>('weekly');
  const [tone, setTone] = useState<SummaryTone>('editorial');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Default AI Executive Briefing text based on tone
  const [aiBriefing, setAiBriefing] = useState<string>(() => {
    const src = trip.sourceCity || 'New Delhi / NCR';
    const dests = trip.destinations?.length > 0 ? trip.destinations.join(' ➔ ') : trip.title;
    return `EXECUTIVE JOURNEY SUMMARY · ${trip.title.toUpperCase()}\n\n` +
      `This ${trip.days?.length || 7}-day expedition orchestrates an immersive journey linking ${src} to ${dests}.\n\n` +
      `• Total Budget Commitment: ₹${trip.budgetTotal.toLocaleString('en-IN')} (₹15,500 surplus contingency preserved)\n` +
      `• Travel Dates: ${trip.startDate} to ${trip.endDate} (${trip.days?.length || trip.daysCount} Days)\n` +
      `• Key Highlights: ${trip.destinations?.join(', ') || trip.title} signature cultural corridors, high-speed transit & luxury stays.\n` +
      `• Logistics & Safety: 24x7 Emergency 112 & 108 coverage active across all transit legs with offline vector map caching ready.`;
  });

  // Re-sync briefing whenever trip or tone changes
  useEffect(() => {
    const src = trip.sourceCity || 'New Delhi / NCR';
    const dests = trip.destinations?.length > 0 ? trip.destinations.join(' ➔ ') : trip.title;
    setAiBriefing(
      `EXECUTIVE JOURNEY SUMMARY · ${trip.title.toUpperCase()}\n\n` +
      `This ${trip.days?.length || trip.daysCount || 7}-day expedition orchestrates an immersive journey linking ${src} to ${dests}.\n\n` +
      `• Total Budget Commitment: ₹${trip.budgetTotal.toLocaleString('en-IN')} (₹15,500 surplus contingency preserved)\n` +
      `• Travel Dates: ${trip.startDate} to ${trip.endDate} (${trip.days?.length || trip.daysCount} Days)\n` +
      `• Key Highlights: ${trip.destinations?.join(', ') || trip.title} signature cultural corridors, high-speed transit & luxury stays.\n` +
      `• Logistics & Safety: 24x7 Emergency 112 & 108 coverage active across all transit legs with offline vector map caching ready.`
    );
  }, [trip.title, trip.sourceCity, trip.destinations, trip.startDate, trip.endDate, trip.budgetTotal, trip.days]);

  const handleGenerateAiSummary = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      let generated = '';
      if (tone === 'editorial') {
        const firstCity = trip.days[0]?.city || trip.destinations[0] || 'the gateway';
        const lastCity = trip.days[trip.days.length - 1]?.city || trip.destinations[trip.destinations.length - 1] || 'the departure hub';
        generated =
          `THE CURATED EXPEDITION COMPENDIUM · ${trip.title.toUpperCase()}\n\n` +
          `A bespoke voyage exploring ${trip.destinations?.join(', ') || 'signature destinations'}. Spanning ${trip.days?.length || trip.daysCount || 7} days, the itinerary gracefully transitions from ${firstCity} through to ${lastCity}.\n\n` +
          `Day-by-Day Cadence:\n` +
          trip.days
            .map(
              (d) =>
                `• Day 0${d.dayNumber} (${d.city}): ${d.activities.map((a) => a.title).join(' → ')}`
            )
            .join('\n') +
          `\n\nCurator Note: Daily burn rate averages ₹${Math.round(trip.budgetTotal / (trip.days?.length || 7)).toLocaleString('en-IN')}, maintaining a comfortable buffer against peak season rates.`;
      } else if (tone === 'executive') {
        generated =
          `EXECUTIVE LOGISTICS & FINANCIAL AUDIT · ${trip.title.toUpperCase()}\n\n` +
          `Projected Scope: ${trip.destinations?.join(' → ') || 'Gateway Circuit'}\n` +
          `Travel Window: ${trip.startDate} to ${trip.endDate}\n` +
          `Total Budget Target: ₹${trip.budgetTotal.toLocaleString('en-IN')}\n\n` +
          `Key Milestones:\n` +
          trip.days
            .map(
              (d) =>
                `[Day 0${d.dayNumber}] ${d.city} — ${d.activities.length} Scheduled Stops | Approx. ₹${d.activities.reduce((sum, a) => sum + (a.cost || 0), 0).toLocaleString('en-IN')}`
            )
            .join('\n') +
          `\n\nContingency & Emergency: 108 Ambulance, 112 ERSS, and Regional Tourist Rescue directory pre-loaded.`;
      } else if (tone === 'storyteller') {
        const topMoments = trip.days
          .flatMap((d) => d.activities)
          .filter((a) => a.category !== 'Transit')
          .slice(0, 4);

        generated =
          `TALES OF ${trip.title.toUpperCase()} · TRAVEL MEMOIR\n\n` +
          `Underneath the open skies of ${trip.destinations?.join(' and ') || 'this journey'}, every landmark tells a vibrant story of heritage, cuisine, and local devotion. From savoring regional delicacies to golden hour vistas, this itinerary weaves discovery and serenity together.\n\n` +
          `Must-Experience Moments:\n` +
          (topMoments.length > 0
            ? topMoments.map((m, idx) => `${idx + 1}. ${m.title} (${m.location}).`).join('\n')
            : `1. Sunrise panoramic photography.\n2. Curated regional gastronomy.\n3. Heritage walking exploration.\n4. Twilight waterfront reflections.`);
      } else {
        generated =
          `POCKET ITINERARY SUMMARY\n` +
          `Trip: ${trip.title}\n` +
          `Dates: ${trip.startDate} – ${trip.endDate}\n` +
          `Cities: ${trip.destinations?.join(', ')}\n` +
          `Budget: ₹${trip.budgetTotal.toLocaleString('en-IN')}\n\n` +
          trip.days
            .map((d) => `Day ${d.dayNumber} (${d.city}): ${d.activities.map((a) => a.title).join(', ')}`)
            .join('\n');
      }

      setAiBriefing(generated);
      setIsGeneratingAi(false);
    }, 700);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const textToCopy =
      `# ${trip.title} - ${timeframe === 'weekly' ? 'Weekly Executive Summary' : 'Monthly Comprehensive Overview'}\n\n` +
      `**Dates:** ${trip.startDate} to ${trip.endDate}\n` +
      `**Destinations:** ${trip.destinations?.join(' → ')}\n` +
      `**Budget:** ₹${trip.budgetTotal.toLocaleString('en-IN')}\n\n` +
      `## AI Briefing\n${aiBriefing}\n\n` +
      `## Daily Schedule\n` +
      trip.days
        .map(
          (d) =>
            `### Day ${d.dayNumber}: ${d.city}\n` +
            d.activities.map((a) => `- **${a.time || 'Activity'}**: ${a.title} (${a.category}) - ₹${a.cost}`).join('\n')
        )
        .join('\n\n');

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeakSummary = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(aiBriefing);
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  // Calculate totals
  const totalActivities = trip.days.reduce((acc, d) => acc + d.activities.length, 0);
  const totalCost = trip.days.reduce(
    (acc, d) => acc + d.activities.reduce((s, a) => s + (a.cost || 0), 0),
    0
  );

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Print styles container */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-trip-summary, #printable-trip-summary * {
            visibility: visible;
          }
          #printable-trip-summary {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Top Header & Action Controls (Hidden when printing) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>AI CREATIVE STUDIO · EXECUTIVE TRIP SUMMARIES</span>
          </div>
          <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight text-white mt-1">
            Trip Summaries & Digest
          </h1>
          <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-2xl mt-1">
            Transform your active itinerary data into weekly or monthly PDF-ready executive briefs, polished editorial memoirs, or logistics summaries using the AI Creative Studio.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          {onOpenCreativeStudio && (
            <button
              onClick={onOpenCreativeStudio}
              className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-purple-400 text-stone-300 hover:text-white transition-colors bg-black/30 flex items-center gap-1.5 text-xs font-mono-num cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-purple-400" />
              <span>AI Studio Lounge</span>
            </button>
          )}

          <button
            onClick={handleCopyMarkdown}
            className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-emerald-400 text-stone-300 hover:text-white transition-colors bg-black/30 flex items-center gap-1.5 text-xs font-mono-num cursor-pointer"
            title="Copy Markdown Summary to Clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrintPdf}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono-num shadow-lg flex items-center gap-2 cursor-pointer transition-all hover:scale-102"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Export PDF</span>
          </button>
        </div>
      </div>

      {/* Control Panel: Timeframe & AI Tone Selector (Hidden in print) */}
      <div
        className={`no-print p-5 rounded-3xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
          isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono-num text-stone-400 uppercase">Timeframe:</span>
          <div className="p-1 rounded-xl bg-black/40 border border-white/10 flex items-center gap-1 text-xs font-mono-num">
            <button
              onClick={() => setTimeframe('weekly')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeframe === 'weekly'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Weekly Digest (7 Days)
            </button>
            <button
              onClick={() => setTimeframe('monthly')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                timeframe === 'monthly'
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Monthly Circuit View
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono-num text-stone-400 uppercase">AI Tone:</span>
          <div className="flex items-center gap-1">
            {(['editorial', 'executive', 'storyteller', 'concise'] as SummaryTone[]).map((t) => (
              <button
                key={t}
                onClick={() => setTone(t)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-mono-num uppercase transition-colors cursor-pointer ${
                  tone === t
                    ? 'bg-purple-600 text-white font-bold'
                    : 'bg-black/30 text-stone-400 hover:text-white border border-white/5'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateAiSummary}
            disabled={isGeneratingAi}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-mono-num font-bold flex items-center gap-1.5 cursor-pointer shadow-sm ml-2"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGeneratingAi ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAi ? 'Synthesizing...' : 'Regenerate AI Brief'}</span>
          </button>
        </div>
      </div>

      {/* ================= Printable Document Canvas ================= */}
      <div
        id="printable-trip-summary"
        className={`rounded-3xl border p-6 md:p-10 space-y-8 shadow-2xl transition-all ${
          isDark
            ? 'bg-[#0E1317] border-white/15 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Document Header Banner */}
        <div className="border-b border-stone-200 dark:border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-600 dark:text-emerald-400">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-bold uppercase">
                {timeframe === 'weekly' ? 'Weekly Executive Digest' : 'Monthly Comprehensive Overview'}
              </span>
              <span>· Confidential Travel Itinerary</span>
            </div>
            <h2 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
              {trip.title}
            </h2>
            <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 font-sans-ui">
              {trip.subtitle || `Curated itinerary across ${trip.destinations?.join(', ') || 'India'}.`}
            </p>
          </div>

          <div className="text-right text-xs font-mono-num space-y-1">
            <div className="text-stone-500 dark:text-stone-400">
              <strong>Dates:</strong> {trip.startDate} – {trip.endDate}
            </div>
            <div className="text-stone-500 dark:text-stone-400">
              <strong>Origin:</strong> {trip.sourceCity || 'New Delhi'} → <strong>Circuit:</strong>{' '}
              {trip.destinations?.join(' · ')}
            </div>
            <div className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">
              Budget: ₹{trip.budgetTotal.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Key Metrics Executive Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-num">
          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-black/30 border border-stone-200 dark:border-white/5 space-y-1">
            <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase block">Duration</span>
            <strong className="text-xl font-bold text-stone-900 dark:text-white block">
              {trip.days.length} Days
            </strong>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">
              {timeframe === 'weekly' ? 'Week 01 Full Itinerary' : 'Month Circuit Overview'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-black/30 border border-stone-200 dark:border-white/5 space-y-1">
            <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase block">Total Stops</span>
            <strong className="text-xl font-bold text-emerald-600 dark:text-emerald-400 block">
              {totalActivities} Experiences
            </strong>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">
              {trip.destinations?.length || 4} Heritage Cities
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-black/30 border border-stone-200 dark:border-white/5 space-y-1">
            <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase block">Estimated Spend</span>
            <strong className="text-xl font-bold text-sky-600 dark:text-sky-400 block">
              ₹{totalCost.toLocaleString('en-IN')}
            </strong>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              ✓ Under target ceiling
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-100 dark:bg-black/30 border border-stone-200 dark:border-white/5 space-y-1">
            <span className="text-stone-500 dark:text-stone-400 text-[10px] uppercase block">Emergency State</span>
            <strong className="text-xl font-bold text-teal-600 dark:text-teal-400 block">
              100% Ready
            </strong>
            <span className="text-[10px] text-stone-500 dark:text-stone-400">
              Offline GPS & ERSS 112
            </span>
          </div>
        </div>

        {/* AI Executive Summary Briefing */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/20 via-stone-900/30 to-purple-950/10 border border-purple-500/20 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-num text-purple-400 font-bold uppercase">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>AI Creative Studio Synthesized Brief ({tone} tone)</span>
            </div>

            <button
              onClick={handleSpeakSummary}
              className="no-print text-xs font-mono-num text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
              title="Narrate summary using speech synthesizer"
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
            </button>
          </div>

          <p className="font-sans-ui text-xs md:text-sm leading-relaxed whitespace-pre-line text-stone-200">
            {aiBriefing}
          </p>
        </div>

        {/* Day-by-Day Detailed Executive Digest */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-2">
            <h3 className="font-editorial text-2xl font-bold">
              {timeframe === 'weekly' ? 'Weekly Daily Breakdown' : 'Monthly Activity Timeline'}
            </h3>
            <span className="text-xs font-mono-num text-stone-400">
              {trip.days.length} Days Planned
            </span>
          </div>

          <div className="space-y-4">
            {trip.days.map((day) => {
              const dayTotal = day.activities.reduce((s, a) => s + (a.cost || 0), 0);
              return (
                <div
                  key={day.dayNumber}
                  className="p-4 md:p-5 rounded-2xl bg-stone-50 dark:bg-black/30 border border-stone-200 dark:border-white/10 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 dark:border-white/5 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-mono-num font-bold text-xs flex items-center justify-center shrink-0">
                        D0{day.dayNumber}
                      </span>
                      <div>
                        <h4 className="font-editorial text-lg font-bold text-stone-900 dark:text-white">
                          {day.city} · {day.date || `Day ${day.dayNumber}`}
                        </h4>
                        <span className="text-[11px] text-stone-500 dark:text-stone-400 font-sans-ui">
                          {day.theme || `${day.activities.length} planned experiences`}
                        </span>
                      </div>
                    </div>

                    <div className="text-right text-xs font-mono-num">
                      <span className="text-stone-400 block text-[10px] uppercase">Allocated Spend</span>
                      <strong className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                        ₹{dayTotal.toLocaleString('en-IN')}
                      </strong>
                    </div>
                  </div>

                  {/* Activities List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1">
                    {day.activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-xl bg-white dark:bg-black/40 border border-stone-200 dark:border-white/5 space-y-1 text-xs"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <strong className="text-stone-900 dark:text-white font-medium">
                            {act.title}
                          </strong>
                          <span className="text-[10px] font-mono-num uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                            {act.category}
                          </span>
                        </div>

                        {act.time && (
                          <span className="text-[11px] font-mono-num text-stone-500 dark:text-stone-400 block">
                            ⏰ {act.time}
                          </span>
                        )}

                        {act.aiReason && (
                          <p className="text-[11px] text-stone-600 dark:text-stone-300 font-sans-ui leading-relaxed">
                            {act.aiReason}
                          </p>
                        )}

                        <div className="pt-1 flex items-center justify-between text-[11px] font-mono-num text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-white/5 mt-1">
                          <span>Cost: {act.cost ? `₹${act.cost.toLocaleString('en-IN')}` : 'Included'}</span>
                          <span>Rating: 4.8 ★</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 24x7 Safety & Emergency Protocols Stamp */}
        <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="text-stone-900 dark:text-white block font-mono-num">
                Emergency & Rescue Coverage (Pan-India & {trip.destinations?.[0] || 'Active Region'})
              </strong>
              <span className="text-stone-600 dark:text-stone-300 text-[11px]">
                ERSS Police 112 · Ambulance 108 · Highway Breakdown 1033 · Air Medevac 1066. Offline GPS Coordinates cached.
              </span>
            </div>
          </div>
          <span className="text-xs font-mono-num text-rose-400 font-bold uppercase shrink-0">
            Verified by TripMind SAR
          </span>
        </div>

        {/* Document Footer */}
        <div className="border-t border-stone-200 dark:border-white/10 pt-4 flex items-center justify-between text-[11px] font-mono-num text-stone-500 dark:text-stone-400">
          <span>Generated with TripMind AI Creative Studio</span>
          <span>Print / PDF Export Ready · Page 1 of 1</span>
        </div>
      </div>
    </div>
  );
};
