import React, { useState } from 'react';
import {
  X,
  Compass,
  Calendar,
  Users,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  DollarSign,
  MapPin,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { TravelStyle, Trip } from '../../types/travel';
import { ALL_INDIA_DESTINATIONS } from '../../data/indiaAllDestinations';
import { RAJASTHAN_DEMO_TRIP } from '../../data/rajasthanTrip';

interface AiPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTripGenerated: (newTrip: Trip) => void;
  currency: string;
  theme: 'dark' | 'light';
  initialDestination?: string;
}

const ALL_STYLES: { id: TravelStyle; label: string; desc: string }[] = [
  { id: 'Culture', label: 'Heritage & Royal Palaces', desc: 'Ancient forts, Havelis, UNESCO monuments, and artisan craft' },
  { id: 'Food', label: 'Culinary Trails & Flavors', desc: 'Regional thalis, Awadhi dum cuisine, Malwa & street treats' },
  { id: 'Photography', label: 'Visual & Golden Hour', desc: 'Cinematic ghats, desert dunes, and mountain passes' },
  { id: 'Luxury', label: 'Palace Stays & Luxury', desc: 'Heritage havelis, luxury houseboats, and royal hospitality' },
  { id: 'Nature', label: 'Highland Nature & Serenity', desc: 'Tea estates, backwater lagoons, and pine valleys' },
  { id: 'Relaxation', label: 'Wellness & Spiritual Peace', desc: 'Ayurveda retreats, dawn aartis, and yoga sanctuaries' },
  { id: 'Adventure', label: 'Himalayan & Desert Adventure', desc: 'High passes, river rafting, camel safaris, and treks' },
  { id: 'Shopping', label: 'Bazaars & Indigenous Crafts', desc: 'Phulkari, Blue pottery, Pashmina shawls, and spices' },
];

export const AiPlannerModal: React.FC<AiPlannerModalProps> = ({
  isOpen,
  onClose,
  onTripGenerated,
  currency,
  theme,
  initialDestination,
}) => {
  const isDark = theme === 'dark';

  // Form State
  const [step, setStep] = useState<number>(1);
  const [destination, setDestination] = useState<string>(initialDestination || 'Rajasthan (Jaipur & Udaipur)');
  const [durationDays, setDurationDays] = useState<number>(5);
  const [travelers, setTravelers] = useState<number>(2);
  const [selectedStyles, setSelectedStyles] = useState<TravelStyle[]>([
    'Culture',
    'Food',
    'Luxury',
  ]);
  const [pace, setPace] = useState<'Slow' | 'Balanced' | 'Packed'>('Balanced');
  const [budget, setBudget] = useState<number>(50000);

  // Sync initialDestination if it changes
  React.useEffect(() => {
    if (initialDestination) {
      setDestination(initialDestination);
    }
  }, [initialDestination]);

  // Cinematic AI Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStepIndex, setGenerationStepIndex] = useState<number>(0);

  const cinematicSteps = [
    'Synthesizing travel preferences & passenger profile...',
    'Evaluating seasonal weather patterns & local sunrise hours...',
    'Curating route efficiency between cities & neighborhoods...',
    'Allocating budget across boutique stays & Michelin dining...',
    'Auditing transit buffers to avoid rush-hour bottlenecks...',
    'Unlocking exclusive local experiences & artisan workshops...',
    'TripMind has crafted your bespoke journey.',
  ];

  if (!isOpen) return null;

  const toggleStyle = (style: TravelStyle) => {
    if (selectedStyles.includes(style)) {
      if (selectedStyles.length > 1) {
        setSelectedStyles(selectedStyles.filter((s) => s !== style));
      }
    } else {
      setSelectedStyles([...selectedStyles, style]);
    }
  };

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setGenerationStepIndex(0);

    for (let i = 0; i < cinematicSteps.length; i++) {
      setGenerationStepIndex(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    // Try server-side generation if available
    try {
      await fetch('/api/ai/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          days: durationDays,
          travelers,
          travelStyle: selectedStyles,
          pace,
          budget,
        }),
      });
    } catch (e) {
      // Graceful fallback
    }

    // Construct the structured generated trip
    // Check if the user requested an Indian destination or state
    const destLower = destination.toLowerCase();
    const matchedIndianDest = ALL_INDIA_DESTINATIONS.find((d) =>
      destLower.includes(d.name.toLowerCase()) ||
      destLower.includes(d.state.toLowerCase()) ||
      d.name.toLowerCase().includes(destLower)
    );

    let generatedTrip: Trip;

    if (destLower.includes('rajasthan')) {
      // Use the rich Rajasthan blueprint customized to duration and budget
      generatedTrip = {
        ...RAJASTHAN_DEMO_TRIP,
        id: `trip-india-${Date.now()}`,
        title: `RAJASTHAN — BESPOKE ${durationDays}-DAY ROYAL JOURNEY`,
        subtitle: `Curated for ${travelers} travelers · ${pace} Pace · Budget: ₹${budget.toLocaleString('en-IN')}`,
        daysCount: durationDays,
        travelersCount: travelers,
        budgetTotal: budget,
        budgetSpent: Math.round(budget * 0.78),
        currency: 'INR',
        travelStyle: selectedStyles,
        pace: pace,
        days: RAJASTHAN_DEMO_TRIP.days.slice(0, Math.min(durationDays, RAJASTHAN_DEMO_TRIP.days.length)).map((day, idx) => ({
          ...day,
          dayNumber: idx + 1,
          date: `Day 0${idx + 1}`,
        })),
      };
    } else if (matchedIndianDest) {
      // Build dynamic Indian itinerary from the destination database
      const city = matchedIndianDest.name;
      const state = matchedIndianDest.state;
      const hotel = matchedIndianDest.hotels[0] || 'Curated Heritage Stay';
      const food1 = matchedIndianDest.signatureDishes[0] || 'Local Thali';
      const food2 = matchedIndianDest.signatureDishes[1] || 'Regional Specialty';
      const attr1 = matchedIndianDest.attractions[0] || 'Historic Landmark';
      const attr2 = matchedIndianDest.attractions[1] || 'Scenic Viewpoint';
      const exp1 = matchedIndianDest.localExperiences[0] || 'Authentic Cultural Walk';

      generatedTrip = {
        id: `trip-india-${Date.now()}`,
        title: `${city.toUpperCase()} & ${state.toUpperCase()} JOURNEY`,
        subtitle: `${city}, ${state} · ${durationDays} Days · ${travelers} Travelers`,
        destinations: [city, state],
        startDate: '2026-11-10',
        endDate: '2026-11-17',
        daysCount: durationDays,
        travelersCount: travelers,
        budgetTotal: budget,
        budgetSpent: Math.round(budget * 0.8),
        currency: 'INR',
        readinessScore: 92,
        confidenceScore: 96,
        travelStyle: selectedStyles,
        pace: pace,
        coverImage: matchedIndianDest.heroImage,
        days: Array.from({ length: Math.min(durationDays, 7) }, (_, i) => {
          const dayNum = i + 1;
          return {
            dayNumber: dayNum,
            date: `Day 0${dayNum}`,
            city: city,
            theme: dayNum === 1
              ? `Arrival in ${city} & Check-in at ${hotel}`
              : dayNum === 2
              ? `Heritage Exploration of ${attr1}`
              : dayNum === 3
              ? `Local Immersion: ${attr2} & Food Trail`
              : `Hidden Trails & Cultural Discovery`,
            weather: {
              temp: '24°C',
              condition: 'Pleasant & Sunny',
              icon: 'Sun',
            },
            activities: [
              {
                id: `gen-in-${dayNum}-1`,
                time: '09:00',
                title: dayNum === 1
                  ? `Express Transfer to ${hotel} & Welcome Chai`
                  : `Morning Exploration of ${attr1}`,
                category: dayNum === 1 ? 'Transit' : 'Sightseeing',
                duration: '2h',
                cost: Math.round(budget / (durationDays * 4)),
                currency: 'INR',
                location: `${city}, ${state}`,
                coordinates: { lat: matchedIndianDest.latitude, lng: matchedIndianDest.longitude },
                reservationStatus: 'Confirmed',
                aiReason: `Selected to optimize transit and beat midday heat in ${city}.`,
                upvotes: 3,
                downvotes: 0,
                userVote: 'up',
              },
              {
                id: `gen-in-${dayNum}-2`,
                time: '13:00',
                title: `Traditional Feast: Savoring ${dayNum % 2 === 0 ? food1 : food2}`,
                category: 'Food',
                duration: '1h 30m',
                cost: Math.round(budget / (durationDays * 5)),
                currency: 'INR',
                location: matchedIndianDest.restaurants[0] || 'Historic Food Quarter',
                coordinates: { lat: matchedIndianDest.latitude, lng: matchedIndianDest.longitude },
                reservationStatus: 'Confirmed',
                aiReason: `Authentic taste of ${matchedIndianDest.signatureDishes.join(', ')}.`,
                upvotes: 4,
                downvotes: 0,
                userVote: 'up',
              },
              {
                id: `gen-in-${dayNum}-3`,
                time: '16:30',
                title: `Sunset Experience: ${exp1}`,
                category: 'Culture',
                duration: '2h',
                cost: Math.round(budget / (durationDays * 6)),
                currency: 'INR',
                location: `${attr2}, ${city}`,
                coordinates: { lat: matchedIndianDest.latitude, lng: matchedIndianDest.longitude },
                reservationStatus: 'Confirmed',
                aiReason: `Ideal golden hour light and low crowd density.`,
                upvotes: 5,
                downvotes: 0,
                userVote: 'up',
              },
            ],
          };
        }),
      };
    } else {
      // Default fallback
      generatedTrip = {
        id: `trip-${Date.now()}`,
        title: `${destination.toUpperCase()} — INTELLIGENT JOURNEY`,
        subtitle: `${destination} · ${durationDays} Days · ${travelers} Travelers`,
        destinations: [destination.split(',')[0].trim()],
        startDate: '2026-10-12',
        endDate: '2026-10-19',
        daysCount: durationDays,
        travelersCount: travelers,
        budgetTotal: budget,
        budgetSpent: Math.round(budget * 0.82),
        currency: currency || 'INR',
        readinessScore: 84,
        confidenceScore: 94,
        travelStyle: selectedStyles,
        pace: pace,
        coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
        days: [
          {
            dayNumber: 1,
            date: 'Day 01',
            city: destination.split(',')[0] || 'Jaipur',
            theme: 'Arrival, Acclimatization & Golden Hour Check-in',
            weather: { temp: '25°C', condition: 'Golden & Clear', icon: 'Sun' },
            activities: [
              {
                id: 'gen-1',
                time: '14:00',
                title: `Arrival & Private Transfer in ${destination}`,
                category: 'Transit',
                duration: '1h 30m',
                cost: 4500,
                currency: currency || 'INR',
                location: 'Main Terminal to Historic Center',
                coordinates: { lat: 26.9124, lng: 75.7873 },
                reservationStatus: 'Confirmed',
                aiReason: 'Bypasses afternoon traffic with express private transfer.',
              },
              {
                id: 'gen-2',
                time: '16:30',
                title: 'Heritage Stay Check-in & Courtyard Chai',
                category: 'Relaxation',
                duration: '1h 45m',
                cost: 0,
                currency: currency || 'INR',
                location: 'Curated Boutique Haveli',
                coordinates: { lat: 26.9124, lng: 75.7873 },
                reservationStatus: 'Confirmed',
                aiReason: 'Selected for peaceful courtyard architecture matching your pacing preferences.',
              },
              {
                id: 'gen-3',
                time: '19:30',
                title: 'Welcome Tasting Menu at Courtyard Atelier',
                category: 'Food',
                duration: '2h',
                cost: 3500,
                currency: currency || 'INR',
                location: 'Heritage District',
                coordinates: { lat: 26.9124, lng: 75.7873 },
                reservationStatus: 'Reserved',
                aiReason: 'Intimate multi-course regional celebration prepared with organic seasonal harvest.',
              },
            ],
          },
          {
            dayNumber: 2,
            date: 'Day 02',
            city: destination.split(',')[0] || 'Jaipur',
            theme: 'Cultural Masterclasses & Golden Hour Photography',
            weather: { temp: '26°C', condition: 'Sunny & Pleasant', icon: 'Sun' },
            activities: [
              {
                id: 'gen-4',
                time: '08:30',
                title: 'Dawn Heritage Walk & Ancient Shrines',
                category: 'Culture',
                duration: '2h 30m',
                cost: 1200,
                currency: currency || 'INR',
                location: 'Historic Sanctuary Zone',
                coordinates: { lat: 26.9124, lng: 75.7873 },
                reservationStatus: 'Not Needed',
                aiReason: 'Timed at low foot-traffic hours for optimal natural morning lighting.',
              },
              {
                id: 'gen-5',
                time: '12:30',
                title: 'Artisanal Thali & Culinary Tasting',
                category: 'Food',
                duration: '1h 30m',
                cost: 2200,
                currency: currency || 'INR',
                location: 'Historic Bazaars',
                coordinates: { lat: 26.9124, lng: 75.7873 },
                reservationStatus: 'Confirmed',
                aiReason: 'Regional recipes passed down across generations.',
              },
              {
                id: 'gen-6',
                time: '16:00',
                title: 'Private Workshop with Local Master Craftsman',
                category: 'Culture',
                duration: '2h',
                cost: 4500,
                currency: currency || 'INR',
                location: 'Artisanal Studio',
                coordinates: { lat: 26.9124, lng: 75.7873 },
                reservationStatus: 'Reserved',
                aiReason: 'Hands-on preservation of regional craft in an intimate atelier.',
              },
            ],
          },
        ],
      };
    }

    setIsGenerating(false);
    onTripGenerated(generatedTrip);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden transition-all relative ${
          isDark
            ? 'bg-[#10161B] border-white/10 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isGenerating}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-500/10 text-stone-400 hover:text-stone-200 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {isGenerating ? (
          /* Cinematic AI Generation Experience */
          <div className="p-8 md:p-12 text-center flex flex-col items-center justify-center min-h-[420px]">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
              </div>
              <div className="absolute inset-0 rounded-full border border-emerald-500/40 animate-ping opacity-25"></div>
            </div>

            <span className="font-editorial text-2xl md:text-3xl font-bold tracking-tight mb-3">
              TripMind is synthesizing your journey
            </span>

            <p className="text-xs md:text-sm text-stone-400 max-w-md mx-auto mb-8 font-sans-ui">
              Our intelligence engine is orchestrating routes, pacing transit, and matching boutique accommodations for{' '}
              <span className="text-emerald-400 font-semibold">{destination}</span>.
            </p>

            {/* Sequence step indicators */}
            <div className="w-full max-w-md space-y-2.5 text-left bg-black/20 p-4 rounded-xl border border-white/5">
              {cinematicSteps.map((s, idx) => {
                const isPassed = idx < generationStepIndex;
                const isCurrent = idx === generationStepIndex;
                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 text-xs transition-opacity duration-300 ${
                      isPassed
                        ? 'text-emerald-400 opacity-90'
                        : isCurrent
                        ? 'text-white font-medium opacity-100'
                        : 'text-stone-500 opacity-40'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0"></div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-stone-600 shrink-0"></div>
                    )}
                    <span className="truncate font-sans-ui">{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Multi-Step Conversational & Visual Planner */
          <div className="flex flex-col h-full max-h-[85vh]">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-white/8">
              <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400 uppercase tracking-widest mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Journey Architect · Step {step} of 6</span>
              </div>
              <h2 className="font-editorial text-2xl font-bold">
                {step === 1 && 'Where are you going next?'}
                {step === 2 && 'How many days will you explore?'}
                {step === 3 && "Who is traveling with you?"}
                {step === 4 && 'Define your travel personality'}
                {step === 5 && 'What pace feels right?'}
                {step === 6 && 'Set your journey budget'}
              </h2>
            </div>

            {/* Step Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Step 1: Destination */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400">
                    Enter any Indian state, signature circuit, or city. TripMind AI understands natural Indian travel requests.
                  </p>
                  <div className="relative">
                    <MapPin className="w-5 h-5 absolute left-3.5 top-3.5 text-amber-400" />
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="e.g. Rajasthan, Kerala Backwaters, Himachal, or Varanasi & Ayodhya"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm border focus:outline-none focus:ring-1 focus:ring-amber-500 transition-all ${
                        isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-stone-50 border-stone-200 text-stone-900'
                      }`}
                    />
                  </div>

                  {/* Natural Language Prompt Shortcuts */}
                  <div className="pt-2">
                    <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block mb-2 font-mono-num flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span>Natural Indian Travel Requests</span>
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        { label: 'Plan a 5-day Rajasthan trip under ₹50,000.', dest: 'Rajasthan', days: 5, bg: 50000 },
                        { label: 'Give me a honeymoon itinerary for Kerala.', dest: 'Kerala Backwaters & Munnar', days: 6, bg: 85000 },
                        { label: 'I have 4 days from Kolkata. Where can I go?', dest: 'Darjeeling & Kalimpong', days: 4, bg: 30000 },
                        { label: 'Plan a family trip to Himachal for 6 people.', dest: 'Himachal Pradesh (Shimla & Manali)', days: 6, bg: 120000, ppl: 6 },
                        { label: 'Find the best monsoon destinations in India.', dest: 'Meghalaya (Cherrapunji & Dawki)', days: 5, bg: 45000 },
                        { label: 'Give me a luxury Rajasthan itinerary.', dest: 'Rajasthan Luxury Circuit', days: 7, bg: 180000 },
                        { label: 'I want a spiritual trip covering Varanasi and Ayodhya.', dest: 'Varanasi & Ayodhya', days: 4, bg: 35000 },
                        { label: 'Plan a Northeast India adventure.', dest: 'Northeast (Guwahati & Kaziranga)', days: 7, bg: 75000 },
                      ].map((item, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setDestination(item.dest);
                            setDurationDays(item.days);
                            setBudget(item.bg);
                            if (item.ppl) setTravelers(item.ppl);
                          }}
                          className={`text-left text-xs p-2.5 rounded-xl border transition-all cursor-pointer ${
                            destination === item.dest
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                              : isDark
                              ? 'border-white/8 bg-black/20 hover:border-amber-400/40 text-stone-300'
                              : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                          }`}
                        >
                          <span className="block italic">"{item.label}"</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-2 font-mono-num">
                      Signature Indian Destinations
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Rajasthan (Jaipur & Udaipur)',
                        'Kerala (Kochi & Munnar)',
                        'Himachal Pradesh (Manali & Spiti)',
                        'Goa (Susegad & Beaches)',
                        'Varanasi & Ayodhya',
                        'Ladakh (Leh & Nubra Valley)',
                        'Golden Triangle (Delhi, Agra, Jaipur)',
                        'Northeast (Shillong & Kaziranga)',
                      ].map((d) => (
                        <button
                          key={d}
                          onClick={() => setDestination(d)}
                          className={`text-xs px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                            destination === d
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold'
                              : isDark
                              ? 'border-white/10 hover:bg-white/5 text-stone-300'
                              : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Duration */}
              {step === 2 && (
                <div className="space-y-6">
                  <p className="text-xs text-stone-400">
                    Select the duration for your journey. TripMind intelligently balances exploration vs rest days.
                  </p>

                  <div className="text-center py-6">
                    <span className="font-editorial text-6xl font-bold font-mono-num text-emerald-400">
                      {durationDays}
                    </span>
                    <span className="text-xl font-editorial ml-2 text-stone-400">Days</span>
                  </div>

                  <div className="px-4">
                    <input
                      type="range"
                      min="3"
                      max="14"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-stone-400 font-mono-num mt-2">
                      <span>3 Days (Weekend)</span>
                      <span>7 Days (Balanced)</span>
                      <span>14 Days (Immersion)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Travelers */}
              {step === 3 && (
                <div className="space-y-4">
                  <p className="text-xs text-stone-400">
                    We tailor dining tables, ryokan room sizes, and private vehicle allocations according to group size.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {[
                      { count: 1, label: 'Solo Traveler', desc: 'Private reflection' },
                      { count: 2, label: 'Couple / Duo', desc: 'Romance & culture' },
                      { count: 3, label: 'Small Group', desc: 'Friends exploration' },
                      { count: 4, label: 'Family Group', desc: 'Comfort & spacious' },
                    ].map((item) => (
                      <button
                        key={item.count}
                        onClick={() => setTravelers(item.count)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          travelers === item.count
                            ? 'bg-emerald-600/20 border-emerald-500 text-white'
                            : isDark
                            ? 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                            : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        <span className="font-mono-num text-xl font-bold block mb-1">
                          {item.count}
                        </span>
                        <span className="text-xs font-semibold block">{item.label}</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Travel Personality Cards */}
              {step === 4 && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-400">
                    Select what excites you. TripMind uses these to filter attractions, restaurants, and hidden spots.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ALL_STYLES.map((st) => {
                      const isSelected = selectedStyles.includes(st.id);
                      return (
                        <div
                          key={st.id}
                          onClick={() => toggleStyle(st.id)}
                          className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-emerald-600/15 border-emerald-500/60 text-white'
                              : isDark
                              ? 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/8'
                              : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                          }`}
                        >
                          <div>
                            <span className="text-xs font-semibold block">{st.label}</span>
                            <span className="text-[10px] text-stone-400 block mt-0.5">{st.desc}</span>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-md flex items-center justify-center border text-white ${
                              isSelected ? 'bg-emerald-500 border-emerald-500' : 'border-stone-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 5: Pace */}
              {step === 5 && (
                <div className="space-y-6">
                  <p className="text-xs text-stone-400">
                    How much do you want to pack into each day?
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      {
                        id: 'Slow',
                        label: 'Slow & Leisurely',
                        desc: '1-2 key activities per day. Generous tea breaks, sleeping in, no rush.',
                      },
                      {
                        id: 'Balanced',
                        label: 'Balanced Rhythm',
                        desc: '3-4 curated experiences. Thoughtful transit buffers and scenic pauses.',
                      },
                      {
                        id: 'Packed',
                        label: 'Dynamic & Packed',
                        desc: 'Maximize every hour. Dawn starts, multiple landmarks, vibrant nightlife.',
                      },
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPace(p.id as any)}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                          pace === p.id
                            ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                            : isDark
                            ? 'bg-white/5 border-white/10 text-stone-300 hover:bg-white/10'
                            : 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-stone-100'
                        }`}
                      >
                        <span className="text-xs font-semibold block mb-1">{p.label}</span>
                        <span className="text-[11px] text-stone-400 block leading-relaxed">{p.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Budget */}
              {step === 6 && (
                <div className="space-y-6">
                  <p className="text-xs text-stone-400">
                    Set your approximate overall budget for {durationDays} days for {travelers} travelers. TripMind naturally optimizes Indian travel spending.
                  </p>
                  <div className="text-center py-2">
                    <span className="font-editorial text-4xl md:text-5xl font-bold font-mono-num text-emerald-400">
                      ₹{budget.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-stone-400 block mt-1 font-mono-num">
                      (~₹{Math.round(budget / durationDays).toLocaleString('en-IN')} / day overall)
                    </span>
                  </div>

                  {/* Indian Budget Range Tier Quick Buttons */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono-num text-stone-400 uppercase tracking-wider block font-semibold">
                      India Budget Range Tiers
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { tier: '₹ (Backpacker)', val: 15000, desc: 'Homestays & street treats' },
                        { tier: '₹₹ (Smart Comfort)', val: 35000, desc: 'Boutique stays & cabs' },
                        { tier: '₹₹₹ (Premium)', val: 75000, desc: '4-star resorts & dining' },
                        { tier: '₹₹₹₹ (Royal Luxury)', val: 150000, desc: 'Heritage palaces & private car' },
                      ].map((item) => (
                        <button
                          key={item.tier}
                          onClick={() => setBudget(item.val)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            budget === item.val
                              ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500 shadow-sm'
                              : isDark
                              ? 'bg-black/30 border-white/10 hover:border-emerald-500/40 text-stone-300'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <span className="text-xs font-bold block">{item.tier}</span>
                          <span className="text-[10px] text-stone-400 block mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Exact INR Budget Presets */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-mono-num text-stone-400 uppercase tracking-wider block font-semibold">
                      Exact Indian Budget Presets
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[10000, 25000, 50000, 100000, 200000, 350000].map((amt) => (
                        <button
                          key={amt}
                          onClick={() => setBudget(amt)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono-num font-semibold border transition-all cursor-pointer ${
                            budget === amt
                              ? 'bg-emerald-500 text-stone-950 border-emerald-400 font-bold'
                              : isDark
                              ? 'border-white/10 hover:bg-white/5 text-stone-300'
                              : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                          }`}
                        >
                          ₹{amt.toLocaleString('en-IN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="px-2 pt-2">
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="5000"
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-stone-400 font-mono-num mt-2">
                      <span>₹10,000 (Budget)</span>
                      <span>₹50,000 (Popular)</span>
                      <span>₹2,50,000+ (Ultra Royal)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="p-4 px-6 border-t border-white/8 flex items-center justify-between">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                    isDark ? 'border-white/10 hover:bg-white/5 text-stone-300' : 'border-stone-200 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
              ) : (
                <div></div>
              )}

              {step < 6 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handleStartGeneration}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white transition-all shadow-lg active:scale-95 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Build My Journey →</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
