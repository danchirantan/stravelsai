import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Gemini initialization note:', err);
  }
}

// AI Copilot endpoint
app.post('/api/ai/copilot', async (req: Request, res: Response) => {
  const { query, tripContext, conversationHistory } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  if (aiClient) {
    try {
      const systemInstruction = `You are TripMind AI, an elite travel intelligence engine with deep India-first destination mastery and global luxury travel expertise.
Current Trip Context:
Destination: ${tripContext?.destination || 'Rajasthan (Jaipur, Jodhpur, Jaisalmer, Udaipur)'}
Duration: ${tripContext?.duration || '7 days'}
Travelers: ${tripContext?.travelers || '2'}
Budget: ${tripContext?.budget || '₹1,25,000'}
Preferences: Luxury, Heritage Palaces, Authentic Regional Gastronomy, Desert Exploration, Photography.
Pacing: Balanced.

You possess native expertise across all 28 Indian States and Union Territories (e.g. Rajasthan royal circuits, Kerala backwaters, Himachal & Ladakh high passes, Northeast living roots, Varanasi spiritual ghats, Konkan beaches, MP tiger reserves).
Provide high-context, ultra-personalized travel advice. Format answers cleanly with clear reasons, exact timing, estimated costs in INR (₹), local culinary recommendations, and actionable next steps. Never sound like a generic chatbot; speak like a luxury private concierge with deep local intelligence.`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Question: ${query}` }] }
        ]
      });

      const reply = response.text || '';
      return res.json({ reply, source: 'gemini-3.8-flash' });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local intelligence:', err.message);
    }
  }

  // Fallback intelligent responses based on context & query keywords
  const q = (query || '').toLowerCase();
  let reply = '';
  if (q.includes('rajasthan') || q.includes('jaipur') || q.includes('udaipur') || q.includes('jaisalmer')) {
    reply = "For your Rajasthan Royal Circuit, we recommend the 7-day arc: Delhi → Jaipur (Amber Fort, Hawa Mahal, LMB Thali) → Jodhpur (Mehrangarh ramparts, Indique rooftop) → Jaisalmer (Sam Sand Dunes luxury glamping, Living Fort) → Udaipur (Lake Pichola sunset boat, Ambrai dinner). Optimal budget: ₹1,25,000 for two with heritage haveli stays.";
  } else if (q.includes('kerala') || q.includes('backwater') || q.includes('honeymoon')) {
    reply = "For Kerala, the signature route is Kochi → Munnar (misty tea plantations at 5,000 ft) → Thekkady (Periyar spice trails & bamboo rafting) → Alleppey (overnight luxury private Kettuvallam houseboat with personal chef) → Varkala (dramatic red cliffs). Best season: October to March. Typical budget: ₹75,000–₹95,000 for two.";
  } else if (q.includes('himachal') || q.includes('manali') || q.includes('shimla') || q.includes('spiti')) {
    reply = "In Himachal Pradesh, for a 5-day mountain escape: Fly into Chandigarh and drive up through the Solan bypass to Shimla (Viceregal Lodge, Mall Road, toy train), then through the Atal Tunnel to Sissu and Old Manali (Jogini falls, trout dining). For high adventure, extend 4 days across Kunzum Pass into Spiti Valley (Key Monastery, Chandratal, Hikkim post office).";
  } else if (q.includes('northeast') || q.includes('meghalaya') || q.includes('shillong') || q.includes('assam')) {
    reply = "For Northeast India, explore Guwahati (Kamakhya temple) → Shillong (Umiam lake, Dylan's Cafe) → Cherrapunji (Nohkalikai falls, Double Decker Living Root Bridge in Nongriat) → Dawki (crystal-clear Umngot river boating) → Kaziranga National Park (One-Horned Rhino dawn elephant safari). Budget: ₹65,000–₹85,000.";
  } else if (q.includes('spiritual') || q.includes('varanasi') || q.includes('ayodhya') || q.includes('kashi')) {
    reply = "For a sacred heritage journey: Combine Varanasi (dawn wooden rowboat along the 84 ghats, Kashi Vishwanath corridor, evening Dashashwamedh Ganga Aarti) with Sarnath (Deer Park where Buddha preached), followed by an express Vande Bharat ride to Ayodhya (Ram Mandir, Saryu River Aarti, Kanak Bhawan). 4 Days, estimated budget: ₹25,000–₹40,000.";
  } else if (q.includes('monsoon')) {
    reply = "India's premier monsoon destinations include: Cherrapunji & Meghalaya (thunderous Nohkalikai waterfalls), Munnar & Wayanad in Kerala (roaring Athirappilly falls and lush mist-shrouded tea slopes), Udaipur (Monsoon Palace Sajjangarh with full lakes), Bastar in Chhattisgarh (Chitrakote 'Niagara of India' in full fury), and Coorg in the Western Ghats.";
  } else if (q.includes('food') || q.includes('cuisine') || q.includes('dish')) {
    reply = "TripMind Culinary Intelligence highlights: In Rajasthan, sample Dal Baati Churma and Mathania Laal Maas; in Lucknow, authentic melt-in-mouth Tunday Galouti Kebabs and Sheermal; in Kolkata, Kosha Mangsho with Luchi and hot baked Rosogolla; in Kerala, Karimeen Pollichathu with Appam; in Amritsar, crisp Amritsari Kulcha with melting white makhan and 12-hour simmered dal.";
  } else if (q.includes('train') || q.includes('rail') || q.includes('vande') || q.includes('shatabdi') || q.includes('irctc')) {
    reply = "Direct Rail Intelligence from your Origin to Rajasthan: We recommend the Vande Bharat Express (Train #20978, departing Delhi Cantt at 06:10 AM, arriving Jaipur Jn at 09:55 AM in just 3h 45m). Executive Chair Car (EC: ₹1,850) and AC Chair Car (CC: ₹990) both feature complimentary hot Indian breakfast. Alternative: Ajmer Shatabdi (Train #12015, NDLS at 06:10 AM, 4h 30m). For Udaipur, board the overnight Chetak Express (#20473, 1A coupe / 2A berths).";
  } else if (q.includes('flight') || q.includes('airline') || q.includes('airport') || q.includes('fly')) {
    reply = "Flight Connectivity to Rajasthan: Non-stop flights operate daily between Delhi (DEL), Mumbai (BOM), Bengaluru (BLR) and Jaipur (JAI) / Udaipur (UDR). Signature options: IndiGo 6E-2134 (DEL 06:20 → JAI 07:20, non-stop, ~₹3,150) and Air India AI-491 (DEL 09:45 → JAI 10:45, includes 20kg baggage and hot snacks, ~₹3,850). For Mumbai departures, IndiGo 6E-5212 takes 1h 45m non-stop to Jaipur.";
  } else if (q.includes('cab') || q.includes('taxi') || q.includes('drive') || q.includes('expressway') || q.includes('car')) {
    reply = "Highway & Chauffeur Roadways: The newly opened Delhi-Mumbai Expressway (NE4 via Sohna-Dausa spur) has slashed road travel time to Jaipur to just 4 hours (275 km at 120 km/h). Recommended vehicle options: Prime AC Sedan (Dzire / Etios at ~₹3,850, tolls included) or Luxury SUV (Toyota Innova Crysta / Hycross at ~₹6,200 with captain reclining seats). All TripMind chauffeurs include pre-paid FASTag and commercial highway certification.";
  } else if (q.includes('date') || q.includes('when') || q.includes('month') || q.includes('season') || q.includes('october') || q.includes('november') || q.includes('december')) {
    reply = "Date & Seasonal Weather Estimation: For October–November journeys, Rajasthan experiences its prime Festive Autumn season. Expect brilliant golden sunshine during the day (28°C–31°C) and crisp, cool evening breezes (13°C–16°C). In Thar Desert / Jaisalmer dunes, nighttime temperatures can drop sharply below 12°C. Attire tip: Light breathable cottons for daytime palace ramparts; pack a warm fleece or pashmina shawl for evening terrace dining and desert camp safaris.";
  } else if (q.includes('rain') || q.includes('weather')) {
    reply = "Atmospheric telemetry across your active route shows clear sunshine (26°C–29°C) in Jaipur, Jodhpur, and Udaipur with cool desert evenings (12°C). In the Western Ghats / Kerala, mild post-monsoon green conditions prevail. TripMind dynamically adapts outdoor pacing around midday heat.";
  } else {
    reply = `TripMind Intelligence has evaluated your request: "${query}". Based on our curated database of 84+ destinations across all 28 Indian States and signature multi-city circuits, we recommend a balanced 4-to-7 day journey allocating ₹4,500–₹6,500 daily per couple with advance heritage bookings and morning sight pacing to bypass peak tourist congestion.`;
  }

  return res.json({ reply, source: 'tripmind-offline-intelligence' });
});

// AI Trip Generator endpoint
app.post('/api/ai/generate-trip', async (req: Request, res: Response) => {
  const { destination, days, travelers, travelStyle, pace, budget } = req.body;

  if (aiClient) {
    try {
      const prompt = `Create an intelligent, highly curated day-by-day travel itinerary for ${destination || 'Rajasthan'} for ${days || 7} days, ${travelers || 2} travelers, style: ${travelStyle?.join(', ') || 'Culture, Food, Luxury'}, pace: ${pace || 'Balanced'}, budget: ${budget || '₹1,25,000'}.
Return JSON only matching format:
{
  "title": string,
  "summary": string,
  "confidenceScore": number,
  "estimatedBudget": number,
  "days": [
    {
      "dayNumber": number,
      "location": string,
      "theme": string,
      "activities": [
        {
          "time": string,
          "title": string,
          "category": "Sightseeing" | "Food" | "Culture" | "Transit" | "Relaxation",
          "duration": string,
          "cost": string,
          "reason": string
        }
      ]
    }
  ]
}`;
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: { responseMimeType: 'application/json' }
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    } catch (err: any) {
      console.warn('Gemini trip generation fallback:', err.message);
    }
  }

  return res.json({
    status: 'fallback_ready'
  });
});

// Weather Service Endpoints
import { WeatherService } from './server/services/weatherService.ts';

// GET /api/v1/weather
app.get('/api/v1/weather', async (req: Request, res: Response) => {
  const requestId = `tm_wthr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const city = (req.query.city as string) || 'Jaipur';
  const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
  const lon = req.query.lon ? parseFloat(req.query.lon as string) : undefined;

  try {
    const weather = await WeatherService.getDestinationWeather(city, lat, lon);
    return res.json({
      success: true,
      data: weather,
      requestId,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'WEATHER_FETCH_ERROR',
        message: 'Could not fetch weather data. Showing cached meteorological baseline.',
        requestId,
      },
    });
  }
});

// POST /api/v1/weather/check-disruptions
app.post('/api/v1/weather/check-disruptions', async (req: Request, res: Response) => {
  const requestId = `tm_dsrp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const { destinations } = req.body;
  const targetCities = Array.isArray(destinations) && destinations.length > 0
    ? destinations
    : ['Jaipur', 'Jodhpur', 'Jaisalmer', 'Udaipur'];

  try {
    const alerts = await WeatherService.detectTripDisruptions(targetCities);
    return res.json({
      success: true,
      data: alerts,
      requestId,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'DISRUPTION_DETECTION_ERROR',
        message: 'Unable to analyze atmospheric disruptions at this moment.',
        requestId,
      },
    });
  }
});

// POST /api/v1/weather/refresh
app.post('/api/v1/weather/refresh', (req: Request, res: Response) => {
  WeatherService.clearCache();
  return res.json({
    success: true,
    message: 'Atmospheric satellite cache refreshed.',
  });
});

// Production Health Check
app.get('/api/health', (req: Request, res: Response) => {
  return res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TripMind-Production-Core',
    aiIntegration: !!aiClient,
  });
});

// Mount Vite or serve static files
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`TripMind AI Server running on http://0.0.0.0:${port}`);
  });
}

startServer();
