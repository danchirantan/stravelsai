import React, { useState, useMemo } from 'react';
import {
  Compass,
  MapPin,
  Calendar,
  Plane,
  Train,
  Car,
  Clock,
  Sparkles,
  CloudSun,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Tag,
  Info,
  ChevronRight,
  RefreshCw,
  Sliders,
  DollarSign,
  AlertTriangle,
  Sun,
  Moon,
  CloudRain,
  Leaf
} from 'lucide-react';
import { Trip, Booking } from '../../types/travel';
import {
  SOURCE_CITIES,
  getDateWeatherEstimations,
  getFlightsForRoute,
  getTrainsForRoute,
  getCabsForRoute,
  getMultiModalComparison,
} from '../../data/transitData';
import { FlightOption, TrainOption, CabOption } from '../../types/transit';

interface SourceTransitHubProps {
  theme: 'dark' | 'light';
  trip: Trip;
  onUpdateTrip?: (updated: Trip) => void;
  onAddBooking?: (booking: Booking) => void;
  currency?: string;
}

export const SourceTransitHub: React.FC<SourceTransitHubProps> = ({
  theme,
  trip,
  onUpdateTrip,
  onAddBooking,
  currency = 'INR',
}) => {
  const isDark = theme === 'dark';

  // State for user's Source City and Journey Dates
  const [sourceCity, setSourceCity] = useState<string>(trip.sourceCity || 'New Delhi / NCR');
  const [customCityInput, setCustomCityInput] = useState<string>('');
  const [showCustomCity, setShowCustomCity] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>(trip.startDate || '2026-10-15');
  const [endDate, setEndDate] = useState<string>(trip.endDate || '2026-10-21');
  const [activeTab, setActiveTab] = useState<'comparison' | 'flights' | 'trains' | 'cabs' | 'weather'>('comparison');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Calculate duration in days
  const durationDays = useMemo(() => {
    const s = new Date(startDate);
    const e = new Date(endDate);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 7;
    const diff = Math.round((e.getTime() - s.getTime()) / 86400000) + 1;
    return Math.max(1, diff);
  }, [startDate, endDate]);

  // Derived options based on source city and destination
  const flightOptions = useMemo(
    () => getFlightsForRoute(sourceCity, trip.title),
    [sourceCity, trip.title]
  );

  const trainOptions = useMemo(
    () => getTrainsForRoute(sourceCity, trip.title),
    [sourceCity, trip.title]
  );

  const cabOptions = useMemo(
    () => getCabsForRoute(sourceCity, trip.title),
    [sourceCity, trip.title]
  );

  const comparisons = useMemo(
    () => getMultiModalComparison(sourceCity),
    [sourceCity]
  );

  const weatherEstimations = useMemo(
    () => getDateWeatherEstimations(startDate, endDate, trip.title),
    [startDate, endDate, trip.title]
  );

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  // Sync back to master trip object
  const handleApplyJourneyConfig = () => {
    if (!onUpdateTrip) return;

    // Recalculate days dates
    const s = new Date(startDate);
    const updatedDays = trip.days.map((day, idx) => {
      const dayDate = new Date(s.getTime() + idx * 86400000);
      const formattedDate = dayDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });
      return {
        ...day,
        date: formattedDate,
      };
    });

    const updatedTrip: Trip = {
      ...trip,
      sourceCity,
      startDate,
      endDate,
      daysCount: durationDays,
      days: updatedDays,
    };

    onUpdateTrip(updatedTrip);
    triggerToast(`✓ Journey updated: Departing from ${sourceCity} (${startDate} to ${endDate}, ${durationDays} days)`);
  };

  const handleSelectFlight = (fl: FlightOption) => {
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      type: 'Flight',
      title: `${fl.airline} ${fl.flightNumber} (${fl.departureCode} → ${fl.arrivalCode})`,
      provider: fl.airline,
      reference: `AI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      date: startDate,
      time: `${fl.departureTime} – ${fl.arrivalTime}`,
      location: `${fl.departureAirport} to ${fl.arrivalAirport}`,
      status: 'Confirmed',
      cost: fl.pricePerSeat,
      currency: 'INR',
      cancellationPolicy: 'Refundable up to 24h prior to scheduled departure.',
    };

    if (onAddBooking) {
      onAddBooking(booking);
      triggerToast(`✓ Added ${fl.airline} ${fl.flightNumber} to your Bookings Hub!`);
    }
  };

  const handleSelectTrain = (tr: TrainOption, classCode: string, fare: number) => {
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      type: 'Train',
      title: `${tr.trainName} (${tr.trainNumber}) · Class ${classCode}`,
      provider: 'Indian Railways (IRCTC)',
      reference: `PNR-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      date: startDate,
      time: `${tr.departureTime} – ${tr.arrivalTime}`,
      location: `${tr.departureStation} → ${tr.arrivalStation}`,
      status: 'Confirmed',
      cost: fare,
      currency: 'INR',
      cancellationPolicy: 'Full refund as per IRCTC standard cancellation policy.',
    };

    if (onAddBooking) {
      onAddBooking(booking);
      triggerToast(`✓ Added ${tr.trainName} (PNR generated) to your Bookings Hub!`);
    }
  };

  const handleSelectCab = (cab: CabOption) => {
    const booking: Booking = {
      id: `bk-${Date.now()}`,
      type: 'Activity',
      title: `Private Highway Chauffeur (${cab.vehicleModel})`,
      provider: 'TripMind Verified Chauffeur Fleet',
      reference: `CAB-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      date: startDate,
      time: '07:00 AM Departure',
      location: `${sourceCity} to Jaipur / Rajasthan via NE4 Expressway`,
      status: 'Confirmed',
      cost: cab.estimatedPrice,
      currency: 'INR',
      cancellationPolicy: 'Free cancellation up to 6 hours prior to pickup time.',
    };

    if (onAddBooking) {
      onAddBooking(booking);
      triggerToast(`✓ Reserved ${cab.vehicleModel} chauffeur in your Bookings Hub!`);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-emerald-900/90 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl flex items-center gap-3 backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{successToast}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
          <Compass className="w-4 h-4 text-emerald-400" />
          <span>ORIGIN & TRANSIT INTELLIGENCE</span>
        </div>
        <h1 className="font-editorial text-3xl md:text-5xl font-bold tracking-tight">
          Journey Gateway & Travel Logistics
        </h1>
        <p className="text-xs md:text-sm text-stone-400 font-sans-ui max-w-3xl leading-relaxed">
          Configure your departure origin city and exact travel dates to unlock real-time transit connections (Vande Bharat Express, non-stop flights, highway chauffeurs) and meteorological forecasts tailored specifically to your dates.
        </p>
      </div>

      {/* Main Interactive Configuration Cockpit */}
      <div
        className={`p-6 md:p-8 rounded-2xl border transition-all ${
          isDark ? 'bg-[#11171C] border-white/10' : 'bg-white border-stone-200 shadow-sm'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* 1. Source Origin Selection */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono-num uppercase tracking-wider text-stone-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Your Departure Source City</span>
              </label>
              <button
                onClick={() => setShowCustomCity(!showCustomCity)}
                className="text-[11px] text-emerald-400 hover:underline cursor-pointer"
              >
                {showCustomCity ? 'Pick from Presets' : 'Custom City +'}
              </button>
            </div>

            {showCustomCity ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCityInput}
                  onChange={(e) => setCustomCityInput(e.target.value)}
                  placeholder="Enter any Indian or International city..."
                  className="flex-1 px-3.5 py-2.5 rounded-xl bg-black/20 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500"
                />
                <button
                  onClick={() => {
                    if (customCityInput.trim()) {
                      setSourceCity(customCityInput.trim());
                      setShowCustomCity(false);
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold cursor-pointer"
                >
                  Set Origin
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5">
                  {SOURCE_CITIES.slice(0, 6).map((city) => (
                    <button
                      key={city.id}
                      onClick={() => setSourceCity(city.name)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono-num transition-all cursor-pointer ${
                        sourceCity === city.name
                          ? 'bg-emerald-600 text-white font-bold shadow-md'
                          : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10 border border-white/5'
                      }`}
                    >
                      {city.name}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-stone-400">Other hubs:</span>
                  <select
                    value={sourceCity}
                    onChange={(e) => setSourceCity(e.target.value)}
                    className="px-2.5 py-1 rounded bg-black/30 border border-white/10 text-white text-xs font-mono-num focus:outline-none"
                  >
                    {SOURCE_CITIES.map((c) => (
                      <option key={c.id} value={c.name} className="bg-stone-900 text-white">
                        {c.name} ({c.code}) · {c.distanceToJaipurKm} km
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* 2. Destination (Fixed & Synchronized) */}
          <div className="lg:col-span-3 space-y-1 p-4 rounded-xl bg-black/20 border border-white/5">
            <span className="text-[10px] font-mono-num uppercase tracking-wider text-stone-400 block">
              Destination Circuit
            </span>
            <div className="font-editorial text-lg font-bold text-white flex items-center gap-2">
              <span>{trip.destinations?.slice(0, 3).join(' → ') || 'Jaipur → Jodhpur → Udaipur'}</span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono-num block">
              Rajasthan Royal Heritage Corridor
            </span>
          </div>

          {/* 3. Dates & Duration Picker */}
          <div className="lg:col-span-4 space-y-3">
            <label className="text-xs font-mono-num uppercase tracking-wider text-stone-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <span>Travel Dates & Length</span>
              </span>
              <span className="text-emerald-400 font-bold">{durationDays} Days</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-stone-400 block mb-1">Departure</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs font-mono-num focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>
              <div>
                <span className="text-[10px] text-stone-400 block mb-1">Return</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white text-xs font-mono-num focus:outline-none focus:border-emerald-500 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Apply to Entire App */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Clicking apply updates the entire application timeline, day dates, packing manifests, and weather feeds.
            </span>
          </div>
          <button
            onClick={handleApplyJourneyConfig}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Sync Journey Dates & Origin</span>
          </button>
        </div>
      </div>

      {/* Date-Specific Weather & Seasonal Estimations Banner */}
      <div
        className={`p-6 rounded-2xl border transition-all ${
          isDark
            ? 'bg-gradient-to-r from-amber-950/20 via-orange-950/10 to-stone-900 border-amber-500/20'
            : 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-num text-amber-400">
              <Sun className="w-4 h-4" />
              <span>DATE-CALIBRATED METEOROLOGY · {weatherEstimations[0]?.season}</span>
            </div>
            <h3 className="font-editorial text-2xl font-bold mt-1">
              Weather & Climate Estimations for {startDate} – {endDate}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="font-editorial text-2xl font-bold font-mono-num block">
                {weatherEstimations[0]?.highTempC}°C / {weatherEstimations[0]?.lowTempC}°C
              </span>
              <span className="text-[10px] text-stone-400 uppercase font-mono-num">
                Typical Day / Night Temp
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl">
              ☀️
            </div>
          </div>
        </div>

        {/* Dynamic Days Forecast Stream */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
          {weatherEstimations.slice(0, 7).map((fc, i) => (
            <div
              key={i}
              className="p-3 rounded-xl bg-black/20 border border-white/5 text-center space-y-1"
            >
              <span className="text-[11px] font-mono-num text-stone-400 block font-semibold">
                Day {i + 1}
              </span>
              <span className="text-[10px] text-stone-400 block">{fc.date.split(',')[0]}</span>
              <span className="text-lg block my-1">
                {fc.icon === 'cloud-rain' ? '🌧️' : '☀️'}
              </span>
              <span className="font-mono-num text-xs font-bold text-white block">
                {fc.highTempC}° / {fc.lowTempC}°
              </span>
              <span className="text-[9px] text-amber-300/90 block leading-tight">
                {fc.condition.split('&')[0]}
              </span>
            </div>
          ))}
        </div>

        {/* Advisory and Attire Guidance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/5 text-xs">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-stone-200 block">Attire & Pacing Advice for these Dates:</span>
              <span className="text-stone-400 leading-relaxed text-[11px]">
                {weatherEstimations[0]?.clothingAdvice} Best outdoor hours: {weatherEstimations[0]?.bestTimeOfDay}.
              </span>
            </div>
          </div>

          {weatherEstimations[0]?.desertNightAlert && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold block">Desert Night Advisory:</span>
                {weatherEstimations[0]?.desertNightAlert}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Transit Multi-Modal Navigation Tabs */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'comparison'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Multi-Modal Comparison Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('trains')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'trains'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Train className="w-3.5 h-3.5 text-sky-400" />
            <span>Indian Railways ({trainOptions.length} Direct & Express)</span>
            <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-sky-950 text-sky-300">
              Vande Bharat
            </span>
          </button>

          <button
            onClick={() => setActiveTab('flights')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'flights'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Plane className="w-3.5 h-3.5 text-emerald-400" />
            <span>Flights ({flightOptions.length} Non-Stop Options)</span>
          </button>

          <button
            onClick={() => setActiveTab('cabs')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cabs'
                ? 'bg-emerald-600 text-white font-bold shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-amber-400" />
            <span>Chauffeured Roadways & NE4 Expressway</span>
          </button>
        </div>

        {/* 1. COMPARISON MATRIX TAB */}
        {activeTab === 'comparison' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {comparisons.map((c, idx) => (
                <div
                  key={idx}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    isDark ? 'bg-[#11171C] border-white/10 hover:border-emerald-500/40' : 'bg-white border-stone-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                        {c.icon}
                      </div>
                      <span className="text-[10px] font-mono-num uppercase px-2.5 py-1 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                        {c.mode}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-editorial text-xl font-bold text-white">{c.title}</h3>
                      <p className="text-xs text-stone-400 mt-1 leading-relaxed">{c.bestFor}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-2 text-xs font-mono-num">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-sky-400" /> Door-to-Door Time:
                        </span>
                        <span className="text-white font-bold">{c.doorToDoorTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Starting From:
                        </span>
                        <span className="text-emerald-400 font-bold">₹{c.startingPrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-stone-400 flex items-center gap-1.5">
                          <Leaf className="w-3.5 h-3.5 text-emerald-400" /> Carbon Footprint:
                        </span>
                        <span className="text-stone-300">{c.carbonFootprintKg} kg CO₂ / pax</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5">
                    <button
                      onClick={() => {
                        if (c.mode === 'Flight') setActiveTab('flights');
                        else if (c.mode === 'Train') setActiveTab('trains');
                        else setActiveTab('cabs');
                      }}
                      className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <span>Explore Specific {c.mode}s</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. TRAINS TAB (Vande Bharat, Shatabdi, Superfast) */}
        {activeTab === 'trains' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/20 text-sky-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Train className="w-4 h-4 text-sky-400 shrink-0" />
                <span>
                  Showing direct rail connections from <strong>{sourceCity}</strong> to Rajasthan. Vande Bharat Express (20978) offers 160 km/h cruising with hot regional catering.
                </span>
              </div>
              <span className="text-[10px] font-mono-num uppercase font-bold text-sky-300 shrink-0">
                IRCTC Integrated
              </span>
            </div>

            <div className="space-y-4">
              {trainOptions.map((tr) => (
                <div
                  key={tr.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#11171C] border-white/10 hover:border-sky-500/40' : 'bg-white border-stone-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono-num px-2.5 py-0.5 rounded bg-sky-950 text-sky-300 font-bold border border-sky-500/30">
                          Train #{tr.trainNumber}
                        </span>
                        <h3 className="font-editorial text-2xl font-bold text-white">
                          {tr.trainName}
                        </h3>
                        {tr.cateringIncluded && (
                          <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
                            Catering Included 🍽️
                          </span>
                        )}
                      </div>

                      {/* Timetable schedule row */}
                      <div className="flex items-center gap-4 text-xs font-mono-num pt-2">
                        <div>
                          <span className="text-xl font-bold text-white block">{tr.departureTime}</span>
                          <span className="text-stone-400 text-[11px]">{tr.departureStation}</span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <span className="text-[10px] text-stone-400">{tr.duration}</span>
                          <div className="w-24 h-0.5 bg-stone-700 relative my-1">
                            <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-sky-400" />
                            <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold">{tr.speedType}</span>
                        </div>
                        <div>
                          <span className="text-xl font-bold text-white block">{tr.arrivalTime}</span>
                          <span className="text-stone-400 text-[11px]">{tr.arrivalStation}</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-400 font-mono-num">
                        Operating: <strong className="text-stone-300">{tr.daysRunning}</strong> · Punctuality: <span className="text-emerald-400">{tr.punctualityRate}</span>
                      </div>
                    </div>

                    {/* Classes & Instant Add */}
                    <div className="lg:w-80 space-y-2">
                      <span className="text-[10px] font-mono-num uppercase tracking-wider text-stone-400 block">
                        Select Seat Class:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        {tr.classes.map((cls) => (
                          <button
                            key={cls.code}
                            onClick={() => handleSelectTrain(tr, cls.code, cls.fare)}
                            className="p-2.5 rounded-xl bg-black/30 hover:bg-sky-950/50 border border-white/10 hover:border-sky-500/40 text-left transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono-num text-xs font-bold text-sky-300">{cls.code}</span>
                              <span className="text-[10px] text-emerald-400 font-bold font-mono-num">₹{cls.fare}</span>
                            </div>
                            <span className="text-[10px] text-stone-400 block truncate">{cls.name}</span>
                            <span className="text-[9px] text-emerald-400/90 block font-mono-num mt-0.5">
                              {cls.availableCount ? `${cls.availableCount} seats left` : 'Available'}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. FLIGHTS TAB */}
        {activeTab === 'flights' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-emerald-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Non-stop flights connecting <strong>{sourceCity}</strong> to Jaipur (JAI) and Udaipur (UDR). Check-in baggage included.
                </span>
              </div>
              <span className="text-[10px] font-mono-num uppercase font-bold text-emerald-300 shrink-0">
                Live Fare Estimate
              </span>
            </div>

            <div className="space-y-4">
              {flightOptions.map((fl) => (
                <div
                  key={fl.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isDark ? 'bg-[#11171C] border-white/10 hover:border-emerald-500/40' : 'bg-white border-stone-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{fl.logo}</span>
                        <div>
                          <h3 className="font-editorial text-2xl font-bold text-white">
                            {fl.airline}
                          </h3>
                          <span className="text-xs font-mono-num text-emerald-400">
                            Flight {fl.flightNumber} · {fl.cabinClass}
                          </span>
                        </div>
                      </div>

                      {/* Flight Timetable */}
                      <div className="flex items-center gap-4 text-xs font-mono-num pt-2">
                        <div>
                          <span className="text-xl font-bold text-white block">{fl.departureTime}</span>
                          <span className="text-stone-400 text-[11px]">{fl.departureAirport} ({fl.departureCode})</span>
                        </div>
                        <div className="flex flex-col items-center px-4">
                          <span className="text-[10px] text-stone-400">{fl.duration}</span>
                          <div className="w-24 h-0.5 bg-stone-700 relative my-1">
                            <div className="absolute left-0 -top-1 w-2 h-2 rounded-full bg-emerald-400" />
                            <div className="absolute right-0 -top-1 w-2 h-2 rounded-full bg-emerald-400" />
                          </div>
                          <span className="text-[9px] text-emerald-400 font-semibold">{fl.nonStop ? 'Non-Stop' : fl.stops}</span>
                        </div>
                        <div>
                          <span className="text-xl font-bold text-white block">{fl.arrivalTime}</span>
                          <span className="text-stone-400 text-[11px]">{fl.arrivalAirport} ({fl.arrivalCode})</span>
                        </div>
                      </div>

                      <div className="text-[11px] text-stone-400 font-mono-num flex items-center gap-4">
                        <span>Baggage: <strong className="text-stone-300">{fl.baggage}</strong></span>
                        <span>· {fl.punctualityScore}</span>
                      </div>
                    </div>

                    <div className="lg:text-right space-y-2">
                      <div className="font-editorial text-3xl font-bold font-mono-num text-white">
                        ₹{fl.pricePerSeat.toLocaleString('en-IN')}
                        <span className="text-xs font-sans-ui font-normal text-stone-400"> / passenger</span>
                      </div>
                      <button
                        onClick={() => handleSelectFlight(fl)}
                        className="w-full lg:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Plane className="w-3.5 h-3.5" />
                        <span>Reserve & Add to Vault</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. CHAUFFEURED HIGHWAY CABS TAB */}
        {activeTab === 'cabs' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/20 text-amber-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Highway cab choices via the <strong>NE4 Delhi-Mumbai Expressway</strong>. Doorstep home pickup, commercial FASTag, and vetted highway chauffeurs.
                </span>
              </div>
              <span className="text-[10px] font-mono-num uppercase font-bold text-amber-300 shrink-0">
                All Tolls Pre-Paid
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {cabOptions.map((cab) => (
                <div
                  key={cab.id}
                  className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                    isDark ? 'bg-[#11171C] border-white/10 hover:border-amber-500/40' : 'bg-white border-stone-200 shadow-sm'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
                        {cab.vehicleCategory}
                      </span>
                      <span className="text-xs font-mono-num text-emerald-400">
                        {cab.fuelType}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-editorial text-2xl font-bold text-white">
                        {cab.vehicleModel}
                      </h3>
                      <span className="text-xs text-stone-400 block font-mono-num mt-1">
                        Up to {cab.capacityPassengers} Guests · {cab.luggageCapacityBags} Large Suitcases
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/20 border border-white/5 space-y-2 text-xs">
                      <div className="font-semibold text-stone-300">Route Highlights:</div>
                      <ul className="space-y-1 text-stone-400 text-[11px]">
                        {cab.routeHighlights.map((rh, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-emerald-400">✓</span>
                            <span>{rh}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="text-[11px] text-stone-400 italic">
                      Chauffeur: {cab.chauffeurDetails}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="font-editorial text-2xl font-bold font-mono-num text-white block">
                        ₹{cab.estimatedPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono-num">
                        {cab.ratePerKm} · Tolls Included
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectCab(cab)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Car className="w-3.5 h-3.5" />
                      <span>Book Cab</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
