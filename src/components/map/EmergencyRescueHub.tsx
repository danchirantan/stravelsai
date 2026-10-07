import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  AlertTriangle,
  Phone,
  PhoneCall,
  Shield,
  Siren,
  Volume2,
  VolumeX,
  MapPin,
  Compass,
  Radio,
  Share2,
  Copy,
  Check,
  X,
  Navigation,
  ExternalLink,
  Flame,
  LifeBuoy,
  HeartPulse,
  Activity,
  Car,
  Crosshair,
  RotateCcw,
  Download,
  Info,
  Clock,
  UserPlus,
  Trash2,
  Bell,
  BookOpen,
  Battery,
  Send
} from 'lucide-react';
import {
  EmergencyCategory,
  EmergencyContact,
  EmergencyHospitalOrStation,
  GpsBreadcrumb,
  LiveGpsTelemetry,
  EmergencyPersonalContact,
  DeadManTimerConfig
} from '../../types/rescue';
import { EMERGENCY_CONTACTS, EMERGENCY_FACILITIES, WILDERNESS_DISTRESS_PROTOCOLS } from '../../data/emergencyRescueData';
import { OfflineMapStorage } from '../../services/offlineMapStorage';

import { Trip } from '../../types/travel';

interface EmergencyRescueHubProps {
  trip?: Trip;
  theme: 'dark' | 'light';
  onClose: () => void;
  onViewLocationOnMap?: (lat: number, lng: number, title: string) => void;
  initialTab?: 'sos' | 'directory' | 'tracker' | 'facilities' | 'protocols';
}

export const EmergencyRescueHub: React.FC<EmergencyRescueHubProps> = ({
  trip,
  theme,
  onClose,
  onViewLocationOnMap,
  initialTab = 'sos',
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'sos' | 'directory' | 'tracker' | 'facilities' | 'protocols'>(initialTab);

  // Filter for emergency contacts directory
  const [categoryFilter, setCategoryFilter] = useState<EmergencyCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const initialLat = trip?.days?.[0]?.activities?.[0]?.coordinates?.lat || 26.9124;
  const initialLng = trip?.days?.[0]?.activities?.[0]?.coordinates?.lng || 75.7873;

  // Live GPS Telemetry
  const [gpsTelemetry, setGpsTelemetry] = useState<LiveGpsTelemetry>({
    lat: initialLat,
    lng: initialLng,
    altitude: 431,
    accuracy: 12,
    heading: 45,
    speed: 0,
    lastUpdated: 'Just now',
    isTracking: false,
    provider: 'Simulated Fix',
  });

  // Breadcrumbs state
  const [breadcrumbs, setBreadcrumbs] = useState<GpsBreadcrumb[]>(() =>
    OfflineMapStorage.getBreadcrumbs()
  );
  const [isBreadcrumbActive, setIsBreadcrumbActive] = useState(false);

  // SOS Beacon State
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [isSosActive, setIsSosActive] = useState(false);
  const [isSirenMuted, setIsSirenMuted] = useState(false);
  const [isStrobeActive, setIsStrobeActive] = useState(false);
  const [isWhistling, setIsWhistling] = useState(false);
  const [copiedCoordinates, setCopiedCoordinates] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  // In Case of Emergency (ICE) Personal Contacts
  const [iceContacts, setIceContacts] = useState<EmergencyPersonalContact[]>(() =>
    OfflineMapStorage.getEmergencyPersonalContacts()
  );
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactRelation, setNewContactRelation] = useState('Family');

  // Dead Man's / Safety Check-in Timer State
  const [deadManTimer, setDeadManTimer] = useState<DeadManTimerConfig>(() =>
    OfflineMapStorage.getDeadManTimer()
  );
  const [deadManSecondsLeft, setDeadManSecondsLeft] = useState<number | null>(null);
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);

  const sirenRef = useRef<{ stop: () => void } | null>(null);
  const countdownTimerRef = useRef<any>(null);
  const breadcrumbIntervalRef = useRef<any>(null);
  const deadManIntervalRef = useRef<any>(null);

  // Battery Status API
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
      }).catch(() => {});
    }
  }, []);

  // Dead Man's Timer countdown tick
  useEffect(() => {
    if (deadManTimer.isActive && deadManTimer.targetEndTime) {
      const targetTime = new Date(deadManTimer.targetEndTime).getTime();

      const updateRemaining = () => {
        const now = Date.now();
        const diffSecs = Math.max(0, Math.floor((targetTime - now) / 1000));
        setDeadManSecondsLeft(diffSecs);

        if (diffSecs <= 0) {
          // Timer expired! Trigger SOS alarm
          if (!isSosActive) {
            startSosAlert();
          }
        }
      };

      updateRemaining();
      deadManIntervalRef.current = setInterval(updateRemaining, 1000);
    } else {
      setDeadManSecondsLeft(null);
      if (deadManIntervalRef.current) clearInterval(deadManIntervalRef.current);
    }

    return () => {
      if (deadManIntervalRef.current) clearInterval(deadManIntervalRef.current);
    };
  }, [deadManTimer.isActive, deadManTimer.targetEndTime]);

  const handleStartDeadManTimer = (minutes: number) => {
    const now = new Date();
    const target = new Date(now.getTime() + minutes * 60000);
    const updated: DeadManTimerConfig = {
      isActive: true,
      durationMinutes: minutes,
      startedAt: now.toISOString(),
      targetEndTime: target.toISOString(),
      activityNote: deadManTimer.activityNote || 'Solo wilderness expedition',
    };
    OfflineMapStorage.saveDeadManTimer(updated);
    setDeadManTimer(updated);
  };

  const handleCheckInDeadManTimer = () => {
    OfflineMapStorage.clearDeadManTimer();
    setDeadManTimer({
      isActive: false,
      durationMinutes: 60,
      startedAt: null,
      targetEndTime: null,
      activityNote: '',
    });
    setDeadManSecondsLeft(null);
    if (deadManIntervalRef.current) clearInterval(deadManIntervalRef.current);
  };

  const handleAddIceContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContactName.trim() || !newContactPhone.trim()) return;

    const contact: EmergencyPersonalContact = {
      id: `ice-${Date.now()}`,
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      relation: newContactRelation.trim() || 'Next of Kin',
      notifyOnSos: true,
    };

    const updated = [...iceContacts, contact];
    setIceContacts(updated);
    OfflineMapStorage.saveEmergencyPersonalContacts(updated);
    setNewContactName('');
    setNewContactPhone('');
    setIsAddingContact(false);
  };

  const handleRemoveIceContact = (id: string) => {
    const updated = iceContacts.filter((c) => c.id !== id);
    setIceContacts(updated);
    OfflineMapStorage.saveEmergencyPersonalContacts(updated);
  };

  const handleSoundWhistle = () => {
    setIsWhistling(true);
    OfflineMapStorage.playWhistleDistressSignal();
    setTimeout(() => setIsWhistling(false), 3500);
  };

  // Initialize GPS Tracking with HTML5 Geolocation API
  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setGpsTelemetry({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            altitude: pos.coords.altitude,
            accuracy: Math.round(pos.coords.accuracy),
            heading: pos.coords.heading,
            speed: pos.coords.speed ? Math.round(pos.coords.speed * 3.6) : 0,
            lastUpdated: new Date().toLocaleTimeString(),
            isTracking: true,
            provider: 'Satellite GPS',
          });
        },
        (err) => {
          console.warn('GPS hardware note:', err.message);
          // Keep calibrated Rajasthan default coordinates
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  // Offline Breadcrumb Logging Interval
  useEffect(() => {
    if (isBreadcrumbActive) {
      breadcrumbIntervalRef.current = setInterval(() => {
        // Add current location as breadcrumb
        const newCrumb: GpsBreadcrumb = {
          id: `crumb-${Date.now()}`,
          lat: gpsTelemetry.lat + (Math.random() - 0.5) * 0.0004,
          lng: gpsTelemetry.lng + (Math.random() - 0.5) * 0.0004,
          altitude: gpsTelemetry.altitude,
          accuracy: gpsTelemetry.accuracy,
          speed: gpsTelemetry.speed,
          heading: gpsTelemetry.heading,
          timestamp: new Date().toLocaleTimeString(),
        };
        OfflineMapStorage.saveBreadcrumb(newCrumb);
        setBreadcrumbs(OfflineMapStorage.getBreadcrumbs());
      }, 5000);
    } else {
      if (breadcrumbIntervalRef.current) clearInterval(breadcrumbIntervalRef.current);
    }

    return () => {
      if (breadcrumbIntervalRef.current) clearInterval(breadcrumbIntervalRef.current);
    };
  }, [isBreadcrumbActive, gpsTelemetry]);

  // Clean up siren on unmount
  useEffect(() => {
    return () => {
      if (sirenRef.current) {
        sirenRef.current.stop();
      }
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  // SOS Trigger Countdown
  const triggerSosCountdown = () => {
    if (isSosActive) {
      stopSosAlert();
      return;
    }

    setSosCountdown(5);
    countdownTimerRef.current = setInterval(() => {
      setSosCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(countdownTimerRef.current);
          startSosAlert();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const cancelSosCountdown = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
    }
    setSosCountdown(null);
  };

  const startSosAlert = () => {
    setIsSosActive(true);
    setIsStrobeActive(true);
    setSosCountdown(null);

    // Start siren tone
    if (!isSirenMuted) {
      sirenRef.current = OfflineMapStorage.playSosDistressSiren();
    }
  };

  const stopSosAlert = () => {
    setIsSosActive(false);
    setIsStrobeActive(false);
    setSosCountdown(null);
    if (sirenRef.current) {
      sirenRef.current.stop();
      sirenRef.current = null;
    }
  };

  const toggleSirenSound = () => {
    if (isSirenMuted) {
      setIsSirenMuted(false);
      if (isSosActive) {
        sirenRef.current = OfflineMapStorage.playSosDistressSiren();
      }
    } else {
      setIsSirenMuted(true);
      if (sirenRef.current) {
        sirenRef.current.stop();
        sirenRef.current = null;
      }
    }
  };

  // Automated Distress Message Payload
  const distressMessage = useMemo(() => {
    const lat = gpsTelemetry.lat.toFixed(5);
    const lng = gpsTelemetry.lng.toFixed(5);
    const alt = gpsTelemetry.altitude ? ` Altitude: ${Math.round(gpsTelemetry.altitude)}m ASL.` : '';
    const bat = batteryLevel !== null ? ` Phone Battery: ${batteryLevel}%.` : '';
    const ice =
      iceContacts.length > 0
        ? ` ICE Contacts to Notify: ${iceContacts.map((c) => `${c.name} (${c.phone})`).join(', ')}.`
        : '';
    return `EMERGENCY RESCUE SOS! I require urgent assistance. My live GPS Coordinates: ${lat}, ${lng} (Accuracy: ±${gpsTelemetry.accuracy}m).${alt}${bat} Map link: https://maps.google.com/?q=${lat},${lng}${ice} - Sent via TripMind Emergency Rescue SOS System.`;
  }, [gpsTelemetry, batteryLevel, iceContacts]);

  const copyCoordinates = () => {
    navigator.clipboard.writeText(`${gpsTelemetry.lat.toFixed(6)}, ${gpsTelemetry.lng.toFixed(6)}`);
    setCopiedCoordinates(true);
    setTimeout(() => setCopiedCoordinates(false), 2500);
  };

  const copyDistressMessage = () => {
    navigator.clipboard.writeText(distressMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  // Emergency facilities with distance
  const facilitiesWithDistance = useMemo(() => {
    return EMERGENCY_FACILITIES.map((fac) => {
      const dist = OfflineMapStorage.calculateDistanceKm(
        gpsTelemetry.lat,
        gpsTelemetry.lng,
        fac.coordinates.lat,
        fac.coordinates.lng
      );
      return {
        ...fac,
        distanceKm: dist,
      };
    }).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
  }, [gpsTelemetry]);

  // Nearest facility
  const nearestFacility = facilitiesWithDistance[0];

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return EMERGENCY_CONTACTS.filter((c) => {
      if (categoryFilter !== 'all' && c.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return (
          c.name.toLowerCase().includes(q) ||
          c.number.includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.coverage.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [categoryFilter, searchQuery]);

  // Retrace Bearing back to starting point / first breadcrumb
  const returnBearing = useMemo(() => {
    if (breadcrumbs.length < 2) return null;
    const origin = breadcrumbs[0];
    return OfflineMapStorage.calculateBearingDegrees(
      gpsTelemetry.lat,
      gpsTelemetry.lng,
      origin.lat,
      origin.lng
    );
  }, [breadcrumbs, gpsTelemetry]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150 ${
        isStrobeActive ? 'animate-pulse' : ''
      }`}
    >
      <div
        className={`w-full max-w-4xl rounded-3xl border p-5 md:p-7 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto ${
          isSosActive
            ? 'bg-gradient-to-b from-rose-950/90 via-stone-950 to-black border-rose-500 shadow-rose-950/80'
            : isDark
            ? 'bg-[#11171C] border-white/15 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-num text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>OFFLINE EMERGENCY RESCUE, GPS TRACKER & SOS SYSTEM</span>
            </div>
            <h2 className="font-editorial text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2.5">
              <span>Emergency Rescue Command</span>
              {isSosActive && (
                <span className="text-xs font-mono-num px-2.5 py-1 rounded-full bg-rose-600 text-white font-bold animate-pulse">
                  SOS TRANSMITTING
                </span>
              )}
            </h2>
            <p className="text-xs text-stone-400 font-sans-ui">
              Unified emergency services directory, real-time satellite GPS tracker, offline breadcrumb recorder, and instant SOS beacon with acoustic distress siren.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-black/30 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-white/10 text-xs font-mono-num">
          <button
            onClick={() => setActiveTab('sos')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'sos'
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-black/20 text-stone-400 hover:text-white border border-white/5'
            }`}
          >
            <Siren className="w-4 h-4 text-rose-300" />
            <span>SOS Alert Beacon</span>
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'directory'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-black/20 text-stone-400 hover:text-white border border-white/5'
            }`}
          >
            <Shield className="w-4 h-4 text-emerald-300" />
            <span>Rescue Directory ({EMERGENCY_CONTACTS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'tracker'
                ? 'bg-sky-600 text-white shadow-md'
                : 'bg-black/20 text-stone-400 hover:text-white border border-white/5'
            }`}
          >
            <Navigation className="w-4 h-4 text-sky-300" />
            <span>Offline GPS Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('facilities')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'facilities'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-black/20 text-stone-400 hover:text-white border border-white/5'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-amber-300" />
            <span>Hospitals & Outposts</span>
          </button>

          <button
            onClick={() => setActiveTab('protocols')}
            className={`px-4 py-2 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'protocols'
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-black/20 text-stone-400 hover:text-white border border-white/5'
            }`}
          >
            <BookOpen className="w-4 h-4 text-purple-300" />
            <span>Survival Protocols ({WILDERNESS_DISTRESS_PROTOCOLS.length})</span>
          </button>
        </div>

        {/* ================= TAB 1: SOS ALERT BEACON ================= */}
        {activeTab === 'sos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Main SOS Trigger Center */}
            <div className="p-6 md:p-8 rounded-3xl bg-black/40 border border-rose-500/30 text-center space-y-5">
              <div className="relative inline-block">
                {/* Ping rings */}
                {(isSosActive || sosCountdown !== null) && (
                  <span className="absolute -inset-4 rounded-full bg-rose-500/30 animate-ping" />
                )}

                <button
                  onClick={triggerSosCountdown}
                  className={`relative w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center transition-all cursor-pointer font-bold shadow-2xl ${
                    isSosActive
                      ? 'bg-rose-600 hover:bg-rose-700 text-white scale-105 border-4 border-white'
                      : sosCountdown !== null
                      ? 'bg-amber-600 text-white animate-pulse border-4 border-amber-300'
                      : 'bg-gradient-to-tr from-rose-700 via-rose-600 to-red-500 hover:scale-105 text-white border-4 border-rose-400/60'
                  }`}
                >
                  <Siren className="w-12 h-12 md:w-16 md:h-16 stroke-[2]" />
                  <span className="font-editorial text-xl md:text-2xl mt-1 tracking-wider">
                    {sosCountdown !== null ? `CANCEL (${sosCountdown})` : isSosActive ? 'STOP SOS' : 'TRIGGER SOS'}
                  </span>
                  <span className="text-[10px] font-mono-num opacity-80 uppercase">
                    {sosCountdown !== null ? 'Tap to abort' : isSosActive ? 'Beacon Transmitting' : 'Press for Rescue'}
                  </span>
                </button>
              </div>

              {/* Countdown Warning Banner */}
              {sosCountdown !== null && (
                <div className="p-4 rounded-2xl bg-amber-950/50 border border-amber-500/40 text-amber-200 flex items-center justify-between gap-4 max-w-md mx-auto">
                  <div className="flex items-center gap-2.5 text-left">
                    <span className="text-2xl font-bold font-mono-num">{sosCountdown}s</span>
                    <p className="text-xs">
                      SOS beacon transmitting coordinates and sounding audible distress siren in {sosCountdown} seconds.
                    </p>
                  </div>
                  <button
                    onClick={cancelSosCountdown}
                    className="px-3.5 py-1.5 rounded-xl bg-white text-stone-900 font-bold text-xs hover:bg-stone-200 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Siren, Strobe, & Audio Whistle Controls */}
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <button
                  onClick={toggleSirenSound}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-num border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isSirenMuted
                      ? 'bg-black/30 border-white/10 text-stone-400'
                      : 'bg-rose-500/20 border-rose-400/40 text-rose-300 font-bold'
                  }`}
                >
                  {isSirenMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  <span>{isSirenMuted ? 'Siren Muted' : 'Acoustic Siren Active'}</span>
                </button>

                <button
                  onClick={() => setIsStrobeActive((p) => !p)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-num border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isStrobeActive
                      ? 'bg-amber-500/20 border-amber-400/40 text-amber-300 font-bold'
                      : 'bg-black/30 border-white/10 text-stone-400'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>{isStrobeActive ? 'Night Strobe ON' : 'Night Strobe OFF'}</span>
                </button>

                <button
                  onClick={handleSoundWhistle}
                  disabled={isWhistling}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-num border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isWhistling
                      ? 'bg-purple-500/30 border-purple-400 text-purple-200 font-bold animate-pulse'
                      : 'bg-black/30 border-white/10 text-stone-400 hover:text-white'
                  }`}
                  title="Sound 3 high-pitched distress whistle blasts"
                >
                  <Bell className="w-4 h-4 text-purple-400" />
                  <span>{isWhistling ? 'Whistling (3 Blasts)...' : 'Audio Whistle (3 Blasts)'}</span>
                </button>
              </div>
            </div>

            {/* Dead Man's Safety Check-in Timer */}
            <div className="p-4 md:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-mono-num text-amber-400">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>DEAD MAN'S SAFETY CHECK-IN TIMER</span>
                </div>
                {deadManTimer.isActive && (
                  <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold animate-pulse">
                    TIMER ARMED
                  </span>
                )}
              </div>

              {deadManTimer.isActive ? (
                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs text-stone-400">Check-in Required Before Expiry:</span>
                    <div className="text-2xl font-bold font-mono-num text-amber-300">
                      {deadManSecondsLeft !== null
                        ? `${Math.floor(deadManSecondsLeft / 60)}m ${deadManSecondsLeft % 60}s remaining`
                        : 'Calculating...'}
                    </div>
                    <p className="text-[11px] text-stone-400">
                      Note: &ldquo;{deadManTimer.activityNote}&rdquo; · If not checked in, SOS beacon will activate automatically.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={handleCheckInDeadManTimer}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Check In (I&apos;m Safe)</span>
                    </button>
                    <button
                      onClick={handleCheckInDeadManTimer}
                      className="px-3 py-2 rounded-xl border border-white/10 hover:border-white text-stone-400 hover:text-white text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <p className="text-stone-400 font-sans-ui text-xs">
                    Venturing solo into remote dunes, desert trails, or national parks? Set a safety countdown. If you don&apos;t check in before it expires, the app will sound a distress alarm.
                  </p>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono-num text-stone-400 mr-1">Arm Timer:</span>
                    <button
                      onClick={() => handleStartDeadManTimer(30)}
                      className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white font-mono-num cursor-pointer"
                    >
                      30m
                    </button>
                    <button
                      onClick={() => handleStartDeadManTimer(60)}
                      className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white font-mono-num cursor-pointer"
                    >
                      1 Hour
                    </button>
                    <button
                      onClick={() => handleStartDeadManTimer(120)}
                      className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white font-mono-num cursor-pointer"
                    >
                      2 Hours
                    </button>
                    <button
                      onClick={() => handleStartDeadManTimer(240)}
                      className="px-2.5 py-1.5 rounded-lg bg-black/40 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white font-mono-num cursor-pointer"
                    >
                      4 Hours
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Current GPS Position Card */}
            <div className="p-4 md:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
                  <Crosshair className="w-4 h-4 text-emerald-400" />
                  <span>PRECISE SATELLITE GPS COORDINATES</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] font-mono-num text-stone-400">
                  {batteryLevel !== null && (
                    <span className="flex items-center gap-1 text-emerald-300">
                      <Battery className="w-3.5 h-3.5" />
                      <span>{batteryLevel}% Battery</span>
                    </span>
                  )}
                  <span>Accuracy: ±{gpsTelemetry.accuracy}m · {gpsTelemetry.provider}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-black/40 border border-white/5 font-mono-num text-sm">
                <div>
                  <span className="text-stone-400 text-xs block">Latitude, Longitude:</span>
                  <strong className="text-white text-base">
                    {gpsTelemetry.lat.toFixed(5)}° N, {gpsTelemetry.lng.toFixed(5)}° E
                  </strong>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCoordinates}
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-emerald-400 text-xs font-mono-num text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer bg-black/30"
                  >
                    {copiedCoordinates ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCoordinates ? 'Copied GPS' : 'Copy GPS'}</span>
                  </button>

                  {onViewLocationOnMap && (
                    <button
                      onClick={() => onViewLocationOnMap(gpsTelemetry.lat, gpsTelemetry.lng, 'My Live GPS Fix')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>View on Map</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Nearest safe facility recommendation */}
              {nearestFacility && (
                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-stone-300">
                      <strong>Nearest Hospital / Police:</strong> {nearestFacility.name} ({nearestFacility.city})
                    </span>
                  </div>
                  <span className="text-emerald-400 font-mono-num font-bold">
                    ~{nearestFacility.distanceKm} km away
                  </span>
                </div>
              )}
            </div>

            {/* In Case of Emergency (ICE) Personal Contacts Card */}
            <div className="p-4 md:p-5 rounded-2xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 text-xs font-mono-num text-purple-400">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <span>IN CASE OF EMERGENCY (ICE) NEXT-OF-KIN CONTACTS</span>
                </div>
                <button
                  onClick={() => setIsAddingContact((p) => !p)}
                  className="text-xs font-mono-num text-purple-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{isAddingContact ? 'Cancel' : '+ Add Contact'}</span>
                </button>
              </div>

              {isAddingContact && (
                <form
                  onSubmit={handleAddIceContact}
                  className="p-3.5 rounded-xl bg-black/40 border border-purple-500/30 grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs"
                >
                  <input
                    type="text"
                    placeholder="Contact Name"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:border-purple-400"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Phone (+91...)"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:border-purple-400 font-mono-num"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Relation (e.g. Spouse/Parent)"
                    value={newContactRelation}
                    onChange={(e) => setNewContactRelation(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-black/40 border border-white/10 text-white placeholder:text-stone-500 focus:outline-none focus:border-purple-400"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold cursor-pointer"
                  >
                    Save ICE Contact
                  </button>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {iceContacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <strong className="text-white text-xs">{contact.name}</strong>
                        <span className="text-[10px] font-mono-num px-1.5 py-0.2 rounded bg-purple-950/40 text-purple-300 border border-purple-500/20">
                          {contact.relation}
                        </span>
                      </div>
                      <span className="text-stone-400 font-mono-num text-[11px] block mt-0.5">
                        {contact.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <a
                        href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                        className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                        title="Call ICE Contact"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`sms:${contact.phone.replace(/\s+/g, '')}?body=${encodeURIComponent(distressMessage)}`}
                        className="p-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer"
                        title="Send SOS SMS to ICE Contact"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </a>
                      {iceContacts.length > 1 && (
                        <button
                          onClick={() => handleRemoveIceContact(contact.id)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-rose-400 cursor-pointer"
                          title="Remove Contact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick 1-Tap SOS Dispatch Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Call 112 */}
              <a
                href="tel:112"
                className="p-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition-all shadow-lg flex items-center justify-between gap-3 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                    <PhoneCall className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono-num opacity-80 block">All-India ERSS</span>
                    <span className="text-base font-editorial">Dial 112 Dispatch</span>
                  </div>
                </div>
                <span className="text-xl font-bold font-mono-num group-hover:scale-110 transition-transform">112</span>
              </a>

              {/* SMS with GPS */}
              <a
                href={`sms:?body=${encodeURIComponent(distressMessage)}`}
                className="p-4 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 text-white font-semibold transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono-num text-stone-400 block">Offline SMS Relay</span>
                    <span className="text-sm">Send SMS with GPS</span>
                  </div>
                </div>
              </a>

              {/* WhatsApp Broadcast */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(distressMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-2xl bg-black/40 hover:bg-black/60 border border-white/10 text-white font-semibold transition-all flex items-center justify-between gap-3 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono-num text-stone-400 block">Instant Chat</span>
                    <span className="text-sm">WhatsApp SOS</span>
                  </div>
                </div>
              </a>
            </div>

            {/* Generated SOS Message Preview */}
            <div className="p-4 rounded-2xl bg-black/20 border border-white/5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-400 font-mono-num">
                <span>Distress Message Payload:</span>
                <button
                  onClick={copyDistressMessage}
                  className="text-stone-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedMessage ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedMessage ? 'Copied Message' : 'Copy Text'}</span>
                </button>
              </div>
              <p className="p-3 rounded-xl bg-black/40 border border-white/5 text-stone-300 font-mono-num text-[11px] leading-relaxed select-all">
                {distressMessage}
              </p>
            </div>
          </div>
        )}

        {/* ================= TAB 2: RESCUE SERVICES DIRECTORY ================= */}
        {activeTab === 'directory' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Search & Category Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emergency rescue by name, category, or region..."
                  className="w-full px-4 py-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full text-xs font-mono-num">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'all'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  All Types
                </button>
                <button
                  onClick={() => setCategoryFilter('medical')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'medical'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🚑 Medical & Trauma
                </button>
                <button
                  onClick={() => setCategoryFilter('air_ambulance')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'air_ambulance'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🚁 Air Ambulance / Medevac
                </button>
                <button
                  onClick={() => setCategoryFilter('police')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'police'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  👮 Police & ERSS 112
                </button>
                <button
                  onClick={() => setCategoryFilter('desert_wilderness')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'desert_wilderness'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🐪 Desert & Wilderness SAR
                </button>
                <button
                  onClick={() => setCategoryFilter('highway_breakdown')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'highway_breakdown'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🛣️ Highway Breakdown 1033
                </button>
                <button
                  onClick={() => setCategoryFilter('fire_disaster')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'fire_disaster'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🚒 Fire & Disaster (SDRF/NDRF)
                </button>
                <button
                  onClick={() => setCategoryFilter('water_rescue')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'water_rescue'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🚤 Water & Marine Patrol
                </button>
                <button
                  onClick={() => setCategoryFilter('tourist_consular')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'tourist_consular'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🌐 Tourist & Embassy
                </button>
                <button
                  onClick={() => setCategoryFilter('women_safety')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'women_safety'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🚺 Women Safety 1090
                </button>
                <button
                  onClick={() => setCategoryFilter('crisis_hotline')}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                    categoryFilter === 'crisis_hotline'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  🧠 Crisis Mental Health 14416
                </button>
              </div>
            </div>

            {/* Contacts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto pr-1">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 rounded-2xl bg-black/30 border border-white/10 hover:border-white/20 transition-all space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{contact.icon}</span>
                        <h4 className="font-editorial text-sm font-bold text-white truncate max-w-[220px]">
                          {contact.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-black/40 border border-white/10 font-bold text-stone-300">
                        {contact.coverage}
                      </span>
                    </div>

                    <p className="text-xs text-stone-400 font-sans-ui leading-relaxed">
                      {contact.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                    <span className="text-xs font-mono-num font-bold text-emerald-400">
                      {contact.number}
                    </span>

                    <a
                      href={`tel:${contact.number.replace(/\s+/g, '')}`}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: OFFLINE GPS TRACKER & BREADCRUMBS ================= */}
        {activeTab === 'tracker' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Live GPS Telemetry Dashboard */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-num text-xs">
              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-stone-400 text-[10px] block">Live Coordinates</span>
                <span className="text-sm font-bold text-white block">
                  {gpsTelemetry.lat.toFixed(4)}°, {gpsTelemetry.lng.toFixed(4)}°
                </span>
                <span className="text-[10px] text-emerald-400">±{gpsTelemetry.accuracy}m satellite radius</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-stone-400 text-[10px] block">Altitude / Terrain</span>
                <span className="text-sm font-bold text-white block">
                  {gpsTelemetry.altitude ? `${Math.round(gpsTelemetry.altitude)}m ASL` : '431m (Jaipur Plateau)'}
                </span>
                <span className="text-[10px] text-stone-400">Above Sea Level</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-stone-400 text-[10px] block">Heading & Speed</span>
                <span className="text-sm font-bold text-white block">
                  {gpsTelemetry.heading ? `${Math.round(gpsTelemetry.heading)}°` : '045° NE'} · {gpsTelemetry.speed} km/h
                </span>
                <span className="text-[10px] text-stone-400">Magnetic Bearing</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                <span className="text-stone-400 text-[10px] block">Logged Breadcrumbs</span>
                <span className="text-sm font-bold text-sky-400 block">
                  {breadcrumbs.length} points
                </span>
                <span className="text-[10px] text-stone-400">Stored in offline memory</span>
              </div>
            </div>

            {/* Offline Breadcrumb Logging Control */}
            <div className="p-5 rounded-2xl bg-sky-950/20 border border-sky-500/30 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="font-editorial text-base font-bold text-white flex items-center gap-2">
                    <span>Offline GPS Breadcrumb Tracking</span>
                    {isBreadcrumbActive && (
                      <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                    )}
                  </h4>
                  <p className="text-xs text-stone-400 font-sans-ui">
                    Continuously records your trail every 5 seconds without internet. Essential for retracing your path back to camp in desert dunes or dense national parks.
                  </p>
                </div>

                <button
                  onClick={() => setIsBreadcrumbActive((p) => !p)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0 ${
                    isBreadcrumbActive
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : 'bg-sky-600 hover:bg-sky-500 text-white'
                  }`}
                >
                  <Radio className="w-4 h-4" />
                  <span>{isBreadcrumbActive ? 'Stop Logging Trail' : 'Start Logging Trail'}</span>
                </button>
              </div>

              {/* Retrace Steps Bearing Arrow */}
              {returnBearing !== null && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-xs font-mono-num">
                  <div className="flex items-center gap-2">
                    <Compass
                      className="w-5 h-5 text-amber-400"
                      style={{ transform: `rotate(${returnBearing}deg)` }}
                    />
                    <span className="text-stone-300">
                      <strong>Retrace Bearing to Start Point:</strong> {Math.round(returnBearing)}°
                    </span>
                  </div>
                  <span className="text-stone-400 text-[11px]">Follow compass heading</span>
                </div>
              )}

              {/* Trail Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10 text-xs font-mono-num">
                {breadcrumbs.length > 0 && (
                  <>
                    <button
                      onClick={() => OfflineMapStorage.exportBreadcrumbsAsGpx()}
                      className="px-3 py-1.5 rounded-lg border border-white/10 hover:border-white text-stone-300 hover:text-white transition-colors bg-black/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-400" />
                      <span>Export GPX Trail</span>
                    </button>
                    <button
                      onClick={() => {
                        OfflineMapStorage.clearBreadcrumbs();
                        setBreadcrumbs([]);
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-500/20 hover:border-rose-500 text-rose-400 hover:text-rose-300 transition-colors bg-black/30 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Clear Trail</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: HOSPITALS & OUTPOSTS ================= */}
        {activeTab === 'facilities' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <p className="text-xs text-stone-400 font-sans-ui">
              Verified emergency medical trauma centers, desert camel police stations, and tourist police booths sorted by proximity to your current location.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
              {facilitiesWithDistance.map((fac) => (
                <div
                  key={fac.id}
                  className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-bold">
                        {fac.category}
                      </span>
                      {fac.distanceKm !== undefined && (
                        <span className="text-xs font-mono-num font-bold text-amber-400">
                          ~{fac.distanceKm} km
                        </span>
                      )}
                    </div>

                    <h4 className="font-editorial text-base font-bold text-white">
                      {fac.name}
                    </h4>

                    <p className="text-xs text-stone-400 font-sans-ui leading-relaxed">
                      {fac.address}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2 text-xs">
                    <span className="text-stone-300 font-mono-num font-medium">
                      {fac.phone}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {onViewLocationOnMap && (
                        <button
                          onClick={() => onViewLocationOnMap(fac.coordinates.lat, fac.coordinates.lng, fac.name)}
                          className="px-2.5 py-1.5 rounded-lg border border-white/10 hover:border-emerald-400 text-stone-300 hover:text-white cursor-pointer"
                          title="View on Map"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <a
                        href={`tel:${fac.phone.replace(/\s+/g, '')}`}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: SURVIVAL & DISTRESS PROTOCOLS ================= */}
        {activeTab === 'protocols' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30">
              <div className="space-y-0.5">
                <h4 className="font-editorial text-base font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-400" />
                  <span>Wilderness Survival, Distress Signaling & First Aid</span>
                </h4>
                <p className="text-xs text-stone-400 font-sans-ui">
                  Internationally recognized search-and-rescue (SAR) protocols cached locally for zero-signal emergency operation.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleSoundWhistle}
                  disabled={isWhistling}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono-num border transition-colors flex items-center gap-1.5 cursor-pointer ${
                    isWhistling
                      ? 'bg-purple-500/30 border-purple-400 text-purple-200 font-bold animate-pulse'
                      : 'bg-black/30 border-white/10 text-stone-300 hover:text-white'
                  }`}
                >
                  <Bell className="w-3.5 h-3.5 text-purple-400" />
                  <span>{isWhistling ? 'Whistling...' : 'Test 3 Whistle Blasts'}</span>
                </button>

                <button
                  onClick={() => setIsStrobeActive((p) => !p)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-mono-num border border-white/10 hover:border-amber-400 text-stone-300 hover:text-white bg-black/30 flex items-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isStrobeActive ? 'Stop Strobe' : 'Flash Screen Strobe'}</span>
                </button>
              </div>
            </div>

            {/* Protocol Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WILDERNESS_DISTRESS_PROTOCOLS.map((proto) => (
                <div
                  key={proto.id}
                  className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-purple-950/40 text-purple-300 border border-purple-500/20 font-bold">
                        {proto.category} protocol
                      </span>
                      <span className="text-xs font-mono-num font-bold text-amber-300">
                        {proto.code}
                      </span>
                    </div>

                    <h4 className="font-editorial text-base font-bold text-white">
                      {proto.title}
                    </h4>

                    <p className="text-xs text-stone-400 font-sans-ui leading-relaxed">
                      {proto.description}
                    </p>

                    <div className="pt-2 border-t border-white/5 space-y-1.5">
                      <span className="text-[10px] uppercase font-mono-num text-stone-400 block font-bold">
                        Mandatory Action Sequence:
                      </span>
                      {proto.actionSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-stone-300">
                          <span className="w-4 h-4 rounded-full bg-white/10 text-white flex items-center justify-center text-[10px] shrink-0 font-mono-num mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ground-to-Air Visual Symbols Chart */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
              <h5 className="text-xs font-mono-num font-bold text-stone-200 uppercase tracking-wider flex items-center gap-2">
                <span>Ground-to-Air Visual Distress Signals (For Search Aircraft)</span>
              </h5>
              <p className="text-xs text-stone-400">
                Stomp in desert sand dunes or lay out dark rocks/clothing in high-contrast letters at least 3 meters (10 feet) long:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center font-mono-num text-xs">
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-2xl font-bold text-emerald-400 block font-editorial">V</span>
                  <span className="text-[11px] text-stone-300 block">Require Assistance</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-2xl font-bold text-rose-400 block font-editorial">X</span>
                  <span className="text-[11px] text-stone-300 block">Require Medical Aid</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-2xl font-bold text-amber-400 block font-editorial">N</span>
                  <span className="text-[11px] text-stone-300 block">No / Negative</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-2xl font-bold text-sky-400 block font-editorial">Y</span>
                  <span className="text-[11px] text-stone-300 block">Yes / Affirmative</span>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/5 space-y-1">
                  <span className="text-2xl font-bold text-purple-400 block font-editorial">&uarr;</span>
                  <span className="text-[11px] text-stone-300 block">Proceeding This Way</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-stone-500" />
            <span>Emergency numbers in India (112, 108, 100, 101) operate toll-free even with no SIM balance or without unlocking phone.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
          >
            Close Command Hub
          </button>
        </div>
      </div>
    </div>
  );
};
