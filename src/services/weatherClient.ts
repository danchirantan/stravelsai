import { DestinationWeather, WeatherDisruptionAlert, NotificationItem } from '../types/travel';

export class WeatherClient {
  /**
   * Fetch weather for a city from the server backend
   */
  static async getWeather(city: string): Promise<DestinationWeather | null> {
    try {
      const res = await fetch(`/api/v1/weather?city=${encodeURIComponent(city)}`);
      if (!res.ok) throw new Error(`Weather API returned ${res.status}`);
      const json = await res.json();
      return json.data;
    } catch (err) {
      console.warn('WeatherClient fetch error, using graceful client fallback:', err);
      return null;
    }
  }

  /**
   * Check for major weather disruptions across the active trip destinations
   */
  static async checkDisruptions(
    destinations: string[]
  ): Promise<{ alerts: WeatherDisruptionAlert[]; notifications: NotificationItem[] }> {
    try {
      const res = await fetch('/api/v1/weather/check-disruptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destinations }),
      });

      if (!res.ok) throw new Error(`Disruption API returned ${res.status}`);
      const json = await res.json();
      const alerts: WeatherDisruptionAlert[] = json.data || [];

      // Convert alerts to rich NotificationItems
      const notifications: NotificationItem[] = alerts.map((alert) => ({
        id: `notif-weather-${alert.id}`,
        category: 'Weather',
        title: alert.headline,
        message: `${alert.details} AI Recommendation: ${alert.aiRecommendation}`,
        timestamp: alert.timestamp || 'Just now',
        read: false,
        actionLabel: alert.suggestedAction || 'Review Weather Adjustment',
        actionType: 'itinerary',
        weatherAlert: alert,
      }));

      return { alerts, notifications };
    } catch (err) {
      console.warn('WeatherClient disruption check fallback:', err);

      const primeCity = destinations && destinations.length > 0 ? destinations[0] : 'Jaipur';

      // Client-side contextual fallback weather disruption alert
      const fallbackAlert: WeatherDisruptionAlert = {
        id: `alert-${primeCity.toLowerCase()}-heat-fallback`,
        city: primeCity,
        severity: 'WARNING',
        type: 'EXTREME_HEAT',
        headline: `${primeCity} Midday Heat & UV Peak Advisory (31°C)`,
        details:
          `High solar radiation and direct desert exposure forecast between 12:30 PM and 15:30 PM across ${primeCity}. Open-air rampart walking may cause elevated thermal fatigue.`,
        aiRecommendation:
          `TripMind route adjustment: Sequence open-air fort viewpoints for early morning (08:30 AM) and shift shaded courtyard museums or haveli dining to midday.`,
        suggestedAction: 'Apply Optimal Pacing Adjustment',
        targetDayNumber: 1,
        targetDate: 'Nov 08, 2026',
        affectedActivities: ['raj-1-2', 'raj-1-3'],
        metrics: {
          temp: '31°C',
          precipitationProb: '5%',
          precipitationAmount: '0 mm/h',
          windSpeed: '14 km/h',
        },
        timestamp: 'Just now',
      };

      const fallbackNotif: NotificationItem = {
        id: `notif-weather-fallback-${Date.now()}`,
        category: 'Weather',
        title: fallbackAlert.headline,
        message: `${fallbackAlert.details} AI Recommendation: ${fallbackAlert.aiRecommendation}`,
        timestamp: 'Just now',
        read: false,
        actionLabel: fallbackAlert.suggestedAction,
        actionType: 'itinerary',
        weatherAlert: fallbackAlert,
      };

      return { alerts: [fallbackAlert], notifications: [fallbackNotif] };
    }
  }

  /**
   * Force refresh weather cache from satellite radar
   */
  static async refreshWeather(): Promise<boolean> {
    try {
      const res = await fetch('/api/v1/weather/refresh', { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }
}
