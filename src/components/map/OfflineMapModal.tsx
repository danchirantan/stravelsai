import React, { useState } from 'react';
import {
  Download,
  CheckCircle2,
  HardDrive,
  Trash2,
  FileJson,
  X,
  Compass,
  AlertTriangle,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  WifiOff,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { OfflineMapPackage } from '../../types/rescue';
import { Trip } from '../../types/travel';
import { OfflineMapStorage } from '../../services/offlineMapStorage';

interface OfflineMapModalProps {
  trip: Trip;
  theme: 'dark' | 'light';
  cachedPackage: OfflineMapPackage | null;
  onPackageUpdated: (pkg: OfflineMapPackage | null) => void;
  onClose: () => void;
}

export const OfflineMapModal: React.FC<OfflineMapModalProps> = ({
  trip,
  theme,
  cachedPackage,
  onPackageUpdated,
  onClose,
}) => {
  const isDark = theme === 'dark';
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStep, setDownloadStep] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);

  const handleDownload = async () => {
    setIsDownloading(true);
    setProgressPercent(15);
    setDownloadStep('Collecting vector routes and itinerary waypoints...');

    await new Promise((r) => setTimeout(r, 400));
    setProgressPercent(45);
    setDownloadStep('Packaging offline emergency directory & hospital coordinates...');

    await new Promise((r) => setTimeout(r, 450));
    setProgressPercent(80);
    setDownloadStep('Compressing cartographic geometries for zero-signal operation...');

    await new Promise((r) => setTimeout(r, 350));
    const pkg = await OfflineMapStorage.downloadOfflineMapPackage(trip);
    setProgressPercent(100);
    setDownloadStep('Offline map package verified and cached locally!');

    await new Promise((r) => setTimeout(r, 300));
    setIsDownloading(false);
    onPackageUpdated(pkg);
  };

  const handleRemove = () => {
    OfflineMapStorage.removeOfflineMapPackage(trip.id);
    onPackageUpdated(null);
  };

  const handleExportFile = () => {
    if (cachedPackage) {
      OfflineMapStorage.exportOfflineMapPackageFile(cachedPackage);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-2xl rounded-3xl border p-6 md:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto ${
          isDark
            ? 'bg-[#11171C] border-white/15 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono-num text-emerald-400">
              <WifiOff className="w-4 h-4 text-emerald-400" />
              <span>OFFLINE VECTOR CARTOGRAPHY VAULT</span>
            </div>
            <h2 className="font-editorial text-2xl md:text-3xl font-bold tracking-tight">
              Download Offline Map
            </h2>
            <p className="text-xs text-stone-400 font-sans-ui">
              Cache full itinerary route, vector waypoints, and emergency rescue directory for complete operation when navigating remote desert dunes or mountain passes with zero cellular signal.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-black/30 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        {cachedPackage ? (
          <div className="p-4 md:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono-num uppercase px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 font-bold">
                    Active & Cached Locally
                  </span>
                  <h4 className="font-editorial text-base font-bold text-white mt-0.5">
                    {cachedPackage.tripTitle} (Offline Ready)
                  </h4>
                </div>
              </div>

              <span className="text-xs font-mono-num font-bold text-emerald-400 px-2.5 py-1 rounded-lg bg-black/40 border border-white/10">
                {cachedPackage.sizeFormatted}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono-num pt-2 border-t border-white/10">
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-stone-400 block">Waypoints</span>
                <span className="text-sm font-bold text-white">{cachedPackage.waypointsCount} stops</span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-stone-400 block">Emergency Contacts</span>
                <span className="text-sm font-bold text-emerald-300">{cachedPackage.cachedEmergencyContactsCount} helplines</span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-stone-400 block">Hospitals / Police</span>
                <span className="text-sm font-bold text-amber-300">{cachedPackage.cachedFacilitiesCount} facilities</span>
              </div>
              <div className="p-2 rounded-xl bg-black/30 border border-white/5">
                <span className="text-[10px] text-stone-400 block">Downloaded</span>
                <span className="text-[11px] font-medium text-stone-300 truncate block">{cachedPackage.downloadedAt}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl bg-black/30 border border-white/10 space-y-2 text-center py-8">
            <HardDrive className="w-10 h-10 text-stone-500 mx-auto" />
            <h4 className="font-editorial text-lg font-bold text-stone-200">
              No Offline Map Cached For This Route Yet
            </h4>
            <p className="text-xs text-stone-400 max-w-md mx-auto">
              Download your route package before leaving cellular coverage. Includes coordinates, safe emergency hospitals, and desert rescue outposts.
            </p>
          </div>
        )}

        {/* Download Progress Bar */}
        {isDownloading && (
          <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono-num">
              <span className="text-emerald-400 font-semibold">{downloadStep}</span>
              <span className="text-white font-bold">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full bg-stone-900 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* What gets saved */}
        <div className="space-y-3">
          <h4 className="text-xs font-mono-num font-bold text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Included in the Offline Cache Package:</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-200 block">Full Vector Itinerary Waypoints</strong>
                <span className="text-stone-400 text-[11px]">All {trip.days?.length || trip.daysCount || 5} days of activities, stays, coordinates, and opening hours.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-start gap-2.5">
              <Compass className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-200 block">Offline Route Geometries</strong>
                <span className="text-stone-400 text-[11px]">Highway and scenic transit corridor lines ({trip.destinations?.join(' ➔ ') || 'all stops'}).</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-200 block">Full Emergency SOS & Helplines</strong>
                <span className="text-stone-400 text-[11px]">112 ERSS, 108 Ambulance, Desert Patrol, Highway 1033, and Women Helplines.</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-black/20 border border-white/5 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-200 block">Offline Hospital & Police Directory</strong>
                <span className="text-stone-400 text-[11px]">Trauma centers, ICU hospital locations, and tourist police posts with direct phone links.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {cachedPackage && (
              <>
                <button
                  onClick={handleExportFile}
                  className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-emerald-400/40 text-stone-300 hover:text-white transition-colors bg-black/20 flex items-center gap-1.5 text-xs font-mono-num cursor-pointer"
                  title="Export raw JSON backup file"
                >
                  <FileJson className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Export JSON</span>
                </button>

                <button
                  onClick={() => {
                    if (cachedPackage) {
                      OfflineMapStorage.exportOfflineMapAsGeoJson(cachedPackage);
                    }
                  }}
                  className="px-3.5 py-2 rounded-xl border border-white/10 hover:border-sky-400/40 text-stone-300 hover:text-white transition-colors bg-black/20 flex items-center gap-1.5 text-xs font-mono-num cursor-pointer"
                  title="Export standard GeoJSON for GIS & GPS apps (OsmAnd, Garmin, Gaia)"
                >
                  <Compass className="w-3.5 h-3.5 text-sky-400" />
                  <span>Export GeoJSON</span>
                </button>

                <button
                  onClick={handleRemove}
                  className="px-3 py-2 rounded-xl border border-rose-500/20 hover:border-rose-500/50 text-rose-400 hover:text-rose-300 transition-colors bg-black/20 flex items-center gap-1.5 text-xs font-mono-num cursor-pointer"
                  title="Delete local offline map cache"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Cache</span>
                </button>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer ${
                cachedPackage
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-stone-950'
              }`}
            >
              {cachedPackage ? (
                <>
                  <RefreshCw className={`w-3.5 h-3.5 ${isDownloading ? 'animate-spin' : ''}`} />
                  <span>Update Offline Cache</span>
                </>
              ) : (
                <>
                  <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                  <span>Download Offline Map</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
