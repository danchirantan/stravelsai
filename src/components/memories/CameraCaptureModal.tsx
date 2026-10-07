import React, { useState, useEffect, useRef } from 'react';
import {
  Camera,
  X,
  RefreshCw,
  MapPin,
  Clock,
  Sun,
  Sparkles,
  Check,
  AlertCircle,
  Upload,
  Layers,
  Sliders,
  Compass,
  ArrowRight,
  ShieldCheck,
  Image as ImageIcon
} from 'lucide-react';
import { Trip, TripMemory, ItineraryDay } from '../../types/travel';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  onSaveMemory: (memory: TripMemory) => void;
  theme: 'dark' | 'light';
}

// City coordinates mapping for automatic EXIF / GPS geo-tagging
const CITY_GEO_CATALOG: Record<string, { lat: number; lng: number; altitude: string }> = {
  jaipur: { lat: 26.9124, lng: 75.7873, altitude: '431m Elevation' },
  jodhpur: { lat: 26.2389, lng: 73.0243, altitude: '231m Elevation' },
  jaisalmer: { lat: 26.9157, lng: 70.9083, altitude: '225m Elevation' },
  udaipur: { lat: 24.5854, lng: 73.7125, altitude: '598m Elevation' },
  delhi: { lat: 28.6139, lng: 77.2090, altitude: '216m Elevation' },
  'fort kochi': { lat: 9.9674, lng: 76.2427, altitude: '2m Coastal' },
  kochi: { lat: 9.9312, lng: 76.2673, altitude: '3m Coastal' },
  munnar: { lat: 10.0889, lng: 77.0595, altitude: '1,532m High Range' },
  thekkady: { lat: 9.6031, lng: 77.1615, altitude: '900m Highlands' },
  alleppey: { lat: 9.4981, lng: 76.3388, altitude: '1m Backwaters' },
  leh: { lat: 34.1526, lng: 77.5771, altitude: '3,524m Plateau' },
  'nubra valley': { lat: 34.6863, lng: 77.5673, altitude: '3,048m Valley' },
  'pangong tso': { lat: 33.7595, lng: 78.6674, altitude: '4,225m High Altitude' },
  panaji: { lat: 15.4909, lng: 73.8278, altitude: '7m Seaside' },
  varanasi: { lat: 25.3176, lng: 82.9739, altitude: '81m River Basin' },
};

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  trip,
  onSaveMemory,
  theme,
}) => {
  const isDark = theme === 'dark';
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [showFlash, setShowFlash] = useState<boolean>(false);

  // Captured photo preview state
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState<string | null>(null);
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(() => {
    return trip.days?.[0]?.dayNumber || 1;
  });

  // Editorial metadata form
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [watermarkStyle, setWatermarkStyle] = useState<'leica' | 'hud' | 'none'>('leica');
  const [showGrid, setShowGrid] = useState(true);

  // Compute active day and destination telemetry
  const activeDay: ItineraryDay =
    trip.days.find((d) => d.dayNumber === selectedDayNumber) || trip.days[0] || {
      dayNumber: 1,
      date: 'Nov 08, 2026',
      city: trip.destinations?.[0] || 'Jaipur',
      theme: 'Arrival & Exploration',
      weather: { temp: '26°C', condition: 'Sunny', icon: 'Sun' },
      activities: [],
    };

  const activeCity = activeDay.city || trip.destinations?.[0] || 'Jaipur';
  const cityKey = activeCity.toLowerCase().trim();
  const geoData = CITY_GEO_CATALOG[cityKey] || {
    lat: 26.9124,
    lng: 75.7873,
    altitude: '450m Elevation',
  };

  // Live timestamp from trip data
  const tripDate = activeDay.date || trip.startDate || 'Nov 10, 2026';
  const now = new Date();
  const timeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} IST`;

  // Start video stream when modal is opened and clean up when closed
  useEffect(() => {
    if (!isOpen) {
      stopCameraStream();
      setCapturedPhotoUrl(null);
      setCameraError(null);
      return;
    }

    startCameraStream();

    return () => {
      stopCameraStream();
    };
  }, [isOpen, facingMode]);

  // Set default suggested title when active day changes
  useEffect(() => {
    if (activeDay) {
      setTitle(`${activeCity} — ${activeDay.theme || 'Journey Milestone'}`);
      setStory(
        `Field capture in ${activeCity} during Day ${activeDay.dayNumber} itinerary. Ambient temperature at ${activeDay.weather?.temp || '26°C'}.`
      );
    }
  }, [selectedDayNumber, activeCity]);

  const startCameraStream = async () => {
    setCameraError(null);
    stopCameraStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware access is not supported by this browser environment.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        err.message || 'Camera permission denied or camera not found. You can upload a photo or select a verified destination sample.'
      );
    }
  };

  const stopCameraStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // Toggle front / rear camera
  const handleToggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Capture shutter action
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsCapturing(true);
    setShowFlash(true);

    setTimeout(() => {
      setShowFlash(false);
    }, 150);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw camera frame
    ctx.drawImage(video, 0, 0, width, height);

    // Apply optional Geo-Watermark burn directly onto photo pixels
    if (watermarkStyle !== 'none') {
      burnGeoWatermark(ctx, width, height);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setCapturedPhotoUrl(dataUrl);
    setIsCapturing(false);
  };

  // Burn clean typographic Leica or HUD watermark onto the canvas
  const burnGeoWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const barHeight = Math.max(54, Math.round(height * 0.08));

    if (watermarkStyle === 'leica') {
      // Minimalist dark glass bar at bottom
      ctx.fillStyle = 'rgba(10, 14, 18, 0.82)';
      ctx.fillRect(0, height - barHeight, width, barHeight);

      // Top dividing accent line
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, height - barHeight);
      ctx.lineTo(width, height - barHeight);
      ctx.stroke();

      // Left metadata: Destination & Coordinates
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.round(barHeight * 0.32)}px monospace`;
      ctx.fillText(`📍 ${activeCity.toUpperCase()} · ${geoData.lat.toFixed(4)}°N, ${geoData.lng.toFixed(4)}°E`, 20, height - barHeight * 0.52);

      ctx.fillStyle = '#94a3b8';
      ctx.font = `${Math.round(barHeight * 0.24)}px sans-serif`;
      ctx.fillText(`${trip.title} · Day 0${activeDay.dayNumber} (${activeDay.theme || 'Exploration'})`, 20, height - barHeight * 0.22);

      // Right metadata: Timestamp & Climate
      ctx.textAlign = 'right';
      ctx.fillStyle = '#f59e0b';
      ctx.font = `bold ${Math.round(barHeight * 0.28)}px monospace`;
      ctx.fillText(`${tripDate} · ${timeString}`, width - 20, height - barHeight * 0.52);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = `${Math.round(barHeight * 0.24)}px monospace`;
      ctx.fillText(`${activeDay.weather?.temp || '26°C'} · ${geoData.altitude}`, width - 20, height - barHeight * 0.22);
      ctx.textAlign = 'left';
    } else if (watermarkStyle === 'hud') {
      // Modern HUD digital stamp on bottom-left
      const hudW = Math.round(width * 0.45);
      const hudH = Math.round(barHeight * 1.2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.fillRect(20, height - hudH - 20, hudW, hudH);

      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(20, height - hudH - 20, hudW, hudH);

      ctx.fillStyle = '#10b981';
      ctx.font = `bold ${Math.round(hudH * 0.22)}px monospace`;
      ctx.fillText(`TRIPMIND SAR GEO-LOCK: ${activeCity.toUpperCase()}`, 32, height - hudH);

      ctx.fillStyle = '#ffffff';
      ctx.font = `${Math.round(hudH * 0.18)}px monospace`;
      ctx.fillText(`GPS: ${geoData.lat.toFixed(4)}°N, ${geoData.lng.toFixed(4)}°E · ALT: ${geoData.altitude}`, 32, height - hudH + 20);
      ctx.fillText(`TIME: ${tripDate} ${timeString} · ${activeDay.weather?.temp}`, 32, height - hudH + 40);
    }
  };

  // Fallback: Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          if (watermarkStyle !== 'none') {
            burnGeoWatermark(ctx, img.width, img.height);
          }
          setCapturedPhotoUrl(canvas.toDataURL('image/jpeg', 0.92));
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Fallback: Curated sample destination photo
  const handleUseSampleScene = () => {
    // Select curated photo matching the destination
    const sampleUrls: Record<string, string> = {
      jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
      jodhpur: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1200&auto=format&fit=crop',
      jaisalmer: 'https://images.unsplash.com/photo-1509233725247-49e657c54213?q=80&w=1200&auto=format&fit=crop',
      udaipur: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1200&auto=format&fit=crop',
      kochi: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop',
      munnar: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1200&auto=format&fit=crop',
      leh: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?q=80&w=1200&auto=format&fit=crop',
      varanasi: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1200&auto=format&fit=crop',
    };

    const chosenUrl =
      sampleUrls[cityKey] ||
      trip.coverImage ||
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop';

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = img.width || 1200;
      canvas.height = img.height || 800;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        if (watermarkStyle !== 'none') {
          burnGeoWatermark(ctx, canvas.width, canvas.height);
        }
        setCapturedPhotoUrl(canvas.toDataURL('image/jpeg', 0.92));
      }
    };
    img.src = chosenUrl;
  };

  const handleRetake = () => {
    setCapturedPhotoUrl(null);
    startCameraStream();
  };

  // Save to Journal
  const handleSaveToJournal = () => {
    if (!capturedPhotoUrl) return;

    const newMemory: TripMemory = {
      id: `cam-mem-${Date.now()}`,
      dayNumber: activeDay.dayNumber,
      date: tripDate,
      location: `${activeCity} (${geoData.lat.toFixed(4)}°N, ${geoData.lng.toFixed(4)}°E)`,
      title: title || `${activeCity} Field Capture`,
      story: story || `Captured live during Day ${activeDay.dayNumber} in ${activeCity}.`,
      photoCount: 1,
      locationsCount: 1,
      highlights: [activeCity, geoData.altitude, activeDay.weather?.temp || '26°C'],
      imageUrl: capturedPhotoUrl,
      capturedViaCamera: true,
      geoTag: {
        destination: trip.destinations?.[0] || activeCity,
        city: activeCity,
        coordinates: { lat: geoData.lat, lng: geoData.lng },
        timestamp: tripDate,
        timeString,
        dayTheme: activeDay.theme,
        weather: activeDay.weather?.temp,
        altitude: geoData.altitude,
        deviceLens: facingMode === 'environment' ? 'Main 24mm Wide-Angle' : 'Front Selfie Camera',
      },
    };

    onSaveMemory(newMemory);
    stopCameraStream();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl max-h-[96vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden transition-all ${
          isDark ? 'bg-[#0f141a] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-editorial text-lg font-bold tracking-tight">
                  TripMind Field Camera
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-num bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold uppercase">
                  Auto-Geotag Active
                </span>
              </div>
              <p className="text-[11px] text-stone-400 truncate">
                Locked to {activeCity} · {geoData.lat.toFixed(4)}°N, {geoData.lng.toFixed(4)}°E · {tripDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                stopCameraStream();
                onClose();
              }}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Camera"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Camera Viewfinder or Photo Review */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Visual Display (8 Cols) */}
          <div className="lg:col-span-8 p-4 flex flex-col justify-between bg-black/40 relative min-h-[380px]">
            {/* The Viewfinder Container */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] bg-black rounded-xl overflow-hidden border border-white/15 flex items-center justify-center">
              {/* Shutter White Flash Effect */}
              {showFlash && (
                <div className="absolute inset-0 bg-white z-40 animate-out fade-out duration-150" />
              )}

              {/* Mode 1: Live Video Feed */}
              {!capturedPhotoUrl && !cameraError && (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Rule of Thirds Grid Overlay */}
                  {showGrid && (
                    <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-25">
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-r border-b border-white" />
                      <div className="border-b border-white" />
                      <div className="border-r border-white" />
                      <div className="border-r border-white" />
                      <div />
                    </div>
                  )}

                  {/* Top HUD Telemetry Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono-num text-white drop-shadow-md pointer-events-none">
                    <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/15">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                      <span>LIVE 4K HUD</span>
                    </div>

                    <div className="px-2 py-1 rounded bg-black/60 backdrop-blur-md border border-white/15 flex items-center gap-1.5 text-amber-400">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      <span>{geoData.lat.toFixed(4)}°N, {geoData.lng.toFixed(4)}°E</span>
                    </div>
                  </div>

                  {/* Center Crosshair Aiming Reticle */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="w-16 h-16 border border-white/30 rounded-lg flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-amber-400/80 animate-ping" />
                    </div>
                  </div>

                  {/* Bottom Telemetry Stamp Bar in Viewfinder */}
                  <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-lg bg-black/70 backdrop-blur-md border border-white/15 flex items-center justify-between text-xs text-white pointer-events-none">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-400 uppercase font-mono-num">
                        📍 {activeCity}
                      </span>
                      <span className="opacity-40">·</span>
                      <span className="text-[11px] text-stone-300 font-mono-num">
                        Day 0{activeDay.dayNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] font-mono-num text-stone-300">
                      <span>{tripDate}</span>
                      <span className="opacity-40">·</span>
                      <span className="text-amber-300">{activeDay.weather?.temp || '26°C'}</span>
                    </div>
                  </div>
                </>
              )}

              {/* Mode 2: Camera Error / Fallback Upload State */}
              {!capturedPhotoUrl && cameraError && (
                <div className="p-6 text-center space-y-4 max-w-md">
                  <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white mb-1">
                      Camera Stream Inactive
                    </h4>
                    <p className="text-xs text-stone-400 leading-relaxed">
                      {cameraError}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Device Photo</span>
                    </button>
                    <button
                      onClick={handleUseSampleScene}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-white/10 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      <span>Use {activeCity} Scene</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Mode 3: Captured Photo Preview Review */}
              {capturedPhotoUrl && (
                <div className="relative w-full h-full">
                  <img
                    src={capturedPhotoUrl}
                    alt="Captured Geo-tagged Frame"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md border border-emerald-500/40 text-emerald-300 text-xs font-mono-num flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Photo Captured & Geo-Tagged</span>
                  </div>
                </div>
              )}
            </div>

            {/* Hidden Canvas for High-Resolution Snapshot Extraction */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Hidden File Input for Fallback Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {/* Shutter & Viewfinder Control Bar */}
            <div className="mt-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowGrid(!showGrid)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs font-mono-num transition-colors ${
                    showGrid
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      : 'border-white/10 text-stone-400 hover:text-white'
                  }`}
                  title="Toggle Grid Lines"
                >
                  Grid: {showGrid ? 'On' : 'Off'}
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg border border-white/10 text-xs text-stone-400 hover:text-white hover:bg-white/5 flex items-center gap-1"
                  title="Upload from device storage"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Upload</span>
                </button>
              </div>

              {/* Central Shutter Button */}
              {!capturedPhotoUrl ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    disabled={isCapturing}
                    className="w-14 h-14 rounded-full border-4 border-white/80 bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all shadow-xl flex items-center justify-center cursor-pointer group"
                    title="Press Shutter to Capture"
                  >
                    <div className="w-10 h-10 rounded-full bg-white group-hover:scale-105 transition-transform" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-4 py-2 rounded-xl border border-white/20 bg-stone-800 text-stone-200 hover:bg-stone-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake Photo</span>
                </button>
              )}

              {/* Flip Camera Switch */}
              <button
                type="button"
                onClick={handleToggleFacingMode}
                className="p-2 rounded-xl border border-white/10 text-stone-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                title="Switch Camera Lens"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Editorial Metadata & Telemetry Inspector (4 Cols) */}
          <div className="lg:col-span-4 p-5 border-t lg:border-t-0 lg:border-l border-white/10 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-mono-num text-amber-400 uppercase tracking-wider block mb-1">
                  AUTOMATIC TELEMETRY STAMP
                </span>
                <h4 className="font-editorial text-xl font-bold">
                  Geo-Tag & EXIF Details
                </h4>
              </div>

              {/* Telemetry Readout Card */}
              <div
                className={`p-3.5 rounded-xl border text-xs space-y-2 font-mono-num ${
                  isDark ? 'bg-stone-900/80 border-white/10' : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                  <span className="text-stone-400">Destination Hub:</span>
                  <strong className="text-amber-400">{activeCity}</strong>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                  <span className="text-stone-400">GPS Coordinates:</span>
                  <span className="text-white">
                    {geoData.lat.toFixed(4)}°N, {geoData.lng.toFixed(4)}°E
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                  <span className="text-stone-400">Trip Day & Date:</span>
                  <span className="text-stone-300">
                    Day 0{activeDay.dayNumber} · {tripDate}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                  <span className="text-stone-400">Capture Time:</span>
                  <span className="text-emerald-400">{timeString}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Altitude & Climate:</span>
                  <span className="text-stone-300">
                    {geoData.altitude} · {activeDay.weather?.temp || '26°C'}
                  </span>
                </div>
              </div>

              {/* Itinerary Day Selector */}
              <div>
                <label className="text-xs text-stone-400 block mb-1">
                  Associate with Itinerary Day
                </label>
                <select
                  value={selectedDayNumber}
                  onChange={(e) => setSelectedDayNumber(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-xs text-white focus:outline-none"
                >
                  {trip.days.map((d) => (
                    <option key={d.dayNumber} value={d.dayNumber}>
                      Day {d.dayNumber}: {d.city} ({d.date})
                    </option>
                  ))}
                </select>
              </div>

              {/* Watermark Overlay Style */}
              <div>
                <label className="text-xs text-stone-400 block mb-1">
                  Geo-Watermark Stamp Style
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono-num">
                  <button
                    type="button"
                    onClick={() => setWatermarkStyle('leica')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      watermarkStyle === 'leica'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                        : 'border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    Leica Strip
                  </button>
                  <button
                    type="button"
                    onClick={() => setWatermarkStyle('hud')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      watermarkStyle === 'hud'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                        : 'border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    HUD Vector
                  </button>
                  <button
                    type="button"
                    onClick={() => setWatermarkStyle('none')}
                    className={`py-1.5 px-2 rounded-lg border text-center transition-all ${
                      watermarkStyle === 'none'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                        : 'border-white/10 text-stone-400 hover:text-white'
                    }`}
                  >
                    Exif Only
                  </button>
                </div>
              </div>

              {/* Title & Reflection */}
              <div>
                <label className="text-xs text-stone-400 block mb-1">
                  Photo Title / Landmark
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Sunset view from Mehrangarh Citadel"
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-stone-400 block mb-1">
                  Journal Reflection Story
                </label>
                <textarea
                  rows={2}
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  placeholder="Atmosphere, scents, impressions..."
                  className="w-full px-3 py-2 rounded-lg bg-black/30 border border-white/15 text-xs text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-white/10 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  stopCameraStream();
                  onClose();
                }}
                className="px-3 py-2 rounded-xl border border-white/10 text-xs text-stone-400 hover:text-white"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveToJournal}
                disabled={!capturedPhotoUrl}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                  capturedPhotoUrl
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-white/5'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save Geo-Tagged Memory</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
