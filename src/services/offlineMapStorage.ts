import { OfflineMapPackage, GpsBreadcrumb, EmergencyPersonalContact, DeadManTimerConfig } from '../types/rescue';
import { Trip } from '../types/travel';
import { EMERGENCY_CONTACTS, EMERGENCY_FACILITIES } from '../data/emergencyRescueData';

const OFFLINE_MAP_PREFIX = 'tripmind_offline_map_';
const BREADCRUMBS_KEY = 'tripmind_gps_breadcrumbs_v1';
const ICE_CONTACTS_KEY = 'tripmind_ice_contacts_v1';
const DEAD_MAN_KEY = 'tripmind_dead_man_timer_v1';

export class OfflineMapStorage {
  /**
   * Check if a trip map is already downloaded and cached locally
   */
  static isTripMapCached(tripId: string): boolean {
    try {
      const data = localStorage.getItem(`${OFFLINE_MAP_PREFIX}${tripId}`);
      return !!data;
    } catch {
      return false;
    }
  }

  /**
   * Retrieve cached offline map package
   */
  static getOfflineMapPackage(tripId: string): OfflineMapPackage | null {
    try {
      const raw = localStorage.getItem(`${OFFLINE_MAP_PREFIX}${tripId}`);
      if (!raw) return null;
      return JSON.parse(raw) as OfflineMapPackage;
    } catch (err) {
      console.warn('Error reading offline map cache:', err);
      return null;
    }
  }

  /**
   * Cache full itinerary route, waypoints, and emergency directory for offline use
   */
  static async downloadOfflineMapPackage(trip: Trip): Promise<OfflineMapPackage> {
    // Collect all waypoints from days & activities
    const waypoints: OfflineMapPackage['waypoints'] = [];

    let minLat = 90;
    let maxLat = -90;
    let minLng = 180;
    let maxLng = -180;

    trip.days.forEach((day) => {
      day.activities.forEach((act) => {
        const lat = act.coordinates?.lat || 26.9;
        const lng = act.coordinates?.lng || 75.8;

        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);

        waypoints.push({
          id: act.id,
          title: act.title,
          category: act.category,
          city: day.city,
          dayNumber: day.dayNumber,
          lat,
          lng,
          aiNote: act.aiReason || `${act.category} stop in ${day.city}`,
          emergencyTips:
            act.category === 'Adventure' || day.city.toLowerCase().includes('jaisalmer')
              ? 'Thar Desert area: Carry minimum 3L potable water, sun shield, and keep satellite GPS active.'
              : 'Urban Rajasthan hub: Tourist police and 108 Ambulance coverage active.',
        });
      });
    });

    // Fallback bounds if coordinates are identical
    if (minLat === 90) {
      minLat = 24.5;
      maxLat = 27.2;
      minLng = 70.8;
      maxLng = 76.0;
    }

    const pkg: OfflineMapPackage = {
      id: `offline-pkg-${trip.id}-${Date.now()}`,
      tripId: trip.id,
      tripTitle: trip.title,
      downloadedAt: new Date().toLocaleString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      destinations: trip.destinations || ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur'],
      waypointsCount: waypoints.length,
      cachedEmergencyContactsCount: EMERGENCY_CONTACTS.length,
      cachedFacilitiesCount: EMERGENCY_FACILITIES.length,
      isOfflineReady: true,
      bounds: {
        minLat,
        maxLat,
        minLng,
        maxLng,
      },
      waypoints,
      offlineEmergencyDirectory: EMERGENCY_CONTACTS,
      offlineRouteSummary: {
        totalDistanceKm: 890, // Royal Rajasthan corridor
        drivingTimeHours: 14.5,
        criticalWaypoints: [
          'Jaipur Pink City & Amber Fortress',
          'Ajmer-Pushkar Sacred Aravalli Pass',
          'Jodhpur Mehrangarh Sun Citadel',
          'Jaisalmer Thar Sand Dunes Camp',
          'Ranakpur Marble Sanctuary',
          'Udaipur Lake Pichola Palace Waterfront',
        ],
        safeShelters: [
          'Sawai Man Singh Apex Trauma Centre, Jaipur',
          'AIIMS Emergency Block, Jodhpur',
          'Shree Jawahir District ICU Hospital, Jaisalmer',
          'Sam Sand Dunes Camel Police Post, Thar Desert',
          'Maharana Bhupal Government Hospital, Udaipur',
        ],
      },
      sizeBytes: 0,
      sizeFormatted: '0 KB',
    };

    // Estimate package size in bytes
    const serialized = JSON.stringify(pkg);
    const sizeBytes = new Blob([serialized]).size;
    pkg.sizeBytes = sizeBytes;
    pkg.sizeFormatted = `${(sizeBytes / 1024).toFixed(1)} KB`;

    // Persist to local storage
    try {
      localStorage.setItem(`${OFFLINE_MAP_PREFIX}${trip.id}`, JSON.stringify(pkg));
    } catch (e) {
      console.warn('LocalStorage quota or permission issue for offline map:', e);
    }

    return pkg;
  }

  /**
   * Delete cached offline map package
   */
  static removeOfflineMapPackage(tripId: string): boolean {
    try {
      localStorage.removeItem(`${OFFLINE_MAP_PREFIX}${tripId}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Export cached offline map package as a standalone downloadable JSON file
   */
  static exportOfflineMapPackageFile(pkg: OfflineMapPackage): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(pkg, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tripmind-offline-route-${pkg.tripId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  }

  // ================= GPS Breadcrumb Tracking ================= //

  static getBreadcrumbs(): GpsBreadcrumb[] {
    try {
      const raw = localStorage.getItem(BREADCRUMBS_KEY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveBreadcrumb(crumb: GpsBreadcrumb): void {
    try {
      const list = this.getBreadcrumbs();
      list.push(crumb);
      // Keep last 150 points for storage safety
      const trimmed = list.slice(-150);
      localStorage.setItem(BREADCRUMBS_KEY, JSON.stringify(trimmed));
    } catch (e) {
      console.warn('Could not save GPS breadcrumb:', e);
    }
  }

  static clearBreadcrumbs(): void {
    try {
      localStorage.removeItem(BREADCRUMBS_KEY);
    } catch (e) {
      console.warn('Could not clear breadcrumbs:', e);
    }
  }

  static exportBreadcrumbsAsGpx(): void {
    const list = this.getBreadcrumbs();
    if (list.length === 0) return;

    let gpx = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    gpx += `<gpx version="1.1" creator="TripMind GPS Rescue Tracker" xmlns="http://www.topografix.com/GPX/1/1">\n`;
    gpx += `  <trk>\n    <name>TripMind Offline Emergency Breadcrumb Trail</name>\n    <trkseg>\n`;

    list.forEach((pt) => {
      gpx += `      <trkpt lat="${pt.lat}" lon="${pt.lng}">\n`;
      if (pt.altitude) gpx += `        <ele>${pt.altitude.toFixed(1)}</ele>\n`;
      gpx += `        <time>${pt.timestamp}</time>\n`;
      gpx += `      </trkpt>\n`;
    });

    gpx += `    </trkseg>\n  </trk>\n</gpx>`;

    const blob = new Blob([gpx], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tripmind-emergency-trail-${Date.now()}.gpx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // ================= Haversine Distance & Bearing Calculation ================= //

  static calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  }

  static calculateBearingDegrees(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
    const x =
      Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
      Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
    const brng = toDeg(Math.atan2(y, x));
    return (brng + 360) % 360;
  }

  // ================= Acoustic SOS Distress Siren ================= //

  /**
   * Synthesize audible emergency distress siren using Web Audio API
   */
  static playSosDistressSiren(): { stop: () => void } {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        return { stop: () => {} };
      }

      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);

      // Modulate frequency between 750Hz and 1250Hz in emergency pattern
      let high = false;
      const interval = setInterval(() => {
        if (ctx.state === 'closed') return;
        const targetFreq = high ? 1200 : 750;
        osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);
        high = !high;
      }, 350);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      return {
        stop: () => {
          clearInterval(interval);
          try {
            osc.stop();
            ctx.close();
          } catch {
            // Already closed
          }
        },
      };
    } catch (e) {
      console.warn('Web Audio emergency siren note:', e);
      return { stop: () => {} };
    }
  }

  /**
   * Sound 3 high-pitched emergency whistle blasts (2800 Hz) adhering to international distress protocol
   */
  static playWhistleDistressSignal(): void {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      const blastCount = 3;
      const blastDuration = 0.8;
      const pauseDuration = 0.5;

      for (let i = 0; i < blastCount; i++) {
        const startTime = ctx.currentTime + i * (blastDuration + pauseDuration);
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(2800, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
        gain.gain.setValueAtTime(0.4, startTime + blastDuration - 0.05);
        gain.gain.linearRampToValueAtTime(0, startTime + blastDuration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + blastDuration);
      }
    } catch (e) {
      console.warn('Whistle audio note:', e);
    }
  }

  // ================= GeoJSON Export ================= //

  static exportOfflineMapAsGeoJson(pkg: OfflineMapPackage): void {
    const features = pkg.waypoints.map((wp) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [wp.lng, wp.lat],
      },
      properties: {
        id: wp.id,
        title: wp.title,
        category: wp.category,
        city: wp.city,
        dayNumber: wp.dayNumber,
        aiNote: wp.aiNote,
        emergencyTips: wp.emergencyTips,
      },
    }));

    const geoJson = {
      type: 'FeatureCollection',
      name: `TripMind_${pkg.tripTitle}_Offline_Route`,
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geoJson, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `tripmind-route-${pkg.tripId}.geojson`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  // ================= Personal ICE Emergency Contacts ================= //

  static getEmergencyPersonalContacts(): EmergencyPersonalContact[] {
    try {
      const raw = localStorage.getItem(ICE_CONTACTS_KEY);
      if (!raw) {
        return [
          {
            id: 'ice-default-1',
            name: 'Primary Family / Next of Kin',
            relation: 'Family',
            phone: '+91 98200 11223',
            email: 'emergency.family@example.com',
            notifyOnSos: true,
          },
        ];
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveEmergencyPersonalContacts(contacts: EmergencyPersonalContact[]): void {
    try {
      localStorage.setItem(ICE_CONTACTS_KEY, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Could not save ICE contacts:', e);
    }
  }

  // ================= Dead Man's / Safety Check-in Timer ================= //

  static getDeadManTimer(): DeadManTimerConfig {
    try {
      const raw = localStorage.getItem(DEAD_MAN_KEY);
      if (!raw) {
        return {
          isActive: false,
          durationMinutes: 60,
          startedAt: null,
          targetEndTime: null,
          activityNote: 'Solo desert trail trek',
        };
      }
      return JSON.parse(raw);
    } catch {
      return {
        isActive: false,
        durationMinutes: 60,
        startedAt: null,
        targetEndTime: null,
        activityNote: 'Solo desert trail trek',
      };
    }
  }

  static saveDeadManTimer(config: DeadManTimerConfig): void {
    try {
      localStorage.setItem(DEAD_MAN_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Could not save dead man timer:', e);
    }
  }

  static clearDeadManTimer(): void {
    try {
      localStorage.removeItem(DEAD_MAN_KEY);
    } catch (e) {
      console.warn('Could not clear dead man timer:', e);
    }
  }
}
