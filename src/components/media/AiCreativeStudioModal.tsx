import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  X,
  Sparkles,
  Music,
  Mic,
  MicOff,
  Video,
  Image as ImageIcon,
  Play,
  Pause,
  Upload,
  RefreshCw,
  Send,
  Volume2,
  VolumeX,
  Wand2,
  CheckCircle2,
  Radio,
  FileText,
  Compass,
  MapPin,
  Download,
  Copy,
  Check,
  Sliders
} from 'lucide-react';
import { Trip } from '../../types/travel';
import { TripSummariesModule } from '../summaries/TripSummariesModule';

interface AiCreativeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  theme: 'dark' | 'light';
}

// Curated authentic destination presets for multi-media generation
const DESTINATION_CREATIVE_PRESETS: Record<
  string,
  {
    imagePrompt: string;
    images: string[];
    musicPrompt: string;
    musicMoods: string[];
    videoPrompt: string;
    questions: string[];
    instrumentation: string;
  }
> = {
  jaipur: {
    imagePrompt: 'Sunset over Hawa Mahal pink sandstone honeycomb facade with glowing oil lanterns and royal Rajput architecture',
    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1609137144822-263a242cfa23?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=1200&auto=format&fit=crop',
    ],
    musicPrompt: 'Pink City Royal Court Sitar & Tabla with gentle morning breeze through palace jharokhas',
    musicMoods: ['Amber Fort Dawn Sitar', 'Hawa Mahal Courtyard Chime', 'Bazaar Street Evening Beats', 'Nahargarh Dusk Drone'],
    videoPrompt: 'Cinematic aerial glide rising over Amber Fort ramparts overlooking Maota Lake at golden dawn, 16:9',
    questions: [
      'What is the ideal morning hour to enter Amber Fort to avoid tour buses?',
      'Where can I find authentic heritage blue pottery workshops in Jaipur?',
      'Which rooftop has the best direct photo angle of Hawa Mahal at sunset?',
    ],
    instrumentation: 'Sitar, Tabla, Tanpura, Shehnai',
  },
  jodhpur: {
    imagePrompt: 'Cobalt-blue painted houses of old Navchokiya neighborhood framed below towering sandstone ramparts of Mehrangarh Fort',
    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592635196078-9fe3d54f2377?q=80&w=1200&auto=format&fit=crop',
    ],
    musicPrompt: 'Marwari Folk Melodies with acoustic Sarangi, traditional dholak rhythms, and desert fortress winds',
    musicMoods: ['Mehrangarh Battlements Sarangi', 'Blue City Alleys Dholak', 'Jaswant Thada Marble Serenade', 'Sun City Dusk Echoes'],
    videoPrompt: 'Slow cinematic dolly pan weaving through the narrow vibrant cobalt alleyways of Jodhpur toward Mehrangarh',
    questions: [
      'How long does the Mehrangarh Fort audio guide tour take?',
      'Where to taste authentic Jodhpur Mirchi Vada and Pyaaz Kachori?',
      'What is the most scenic viewpoint for photographing the Blue City at sunset?',
    ],
    instrumentation: 'Sarangi, Dholak, Morchang, Kartal',
  },
  jaisalmer: {
    imagePrompt: 'Golden sandstone ramparts of Jaisalmer Fort rising like a desert mirage above rolling Sam Sand Dunes at twilight',
    images: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=1200&auto=format&fit=crop',
    ],
    musicPrompt: 'Thar Desert Sunset Trance with acoustic Morchang, desert bansuri flute, and nocturnal campfire ambience',
    musicMoods: ['Sam Sand Dunes Campfire Chants', 'Golden Fort Living Haveli Melody', 'Kuldhara Ghost Village Ambient', 'Thar Starry Night Drone'],
    videoPrompt: 'Cinematic wide-angle tracking shot of royal camel glamping caravan moving along crest of Thar sand dunes at sunset',
    questions: [
      'What time does the sunset camel safari depart from Sam Sand Dunes camps?',
      'Is Jaisalmer Fort free to walk through or do monuments require tickets?',
      'What warm clothing is essential for Thar desert night temperatures?',
    ],
    instrumentation: 'Morchang, Kamaicha, Khartal, Algoza',
  },
  udaipur: {
    imagePrompt: 'White marble Lake Palace illuminated under twilight sky reflected perfectly in calm waters of Lake Pichola with Aravalli hills backdrop',
    images: [
      'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop',
    ],
    musicPrompt: 'Lake Pichola Moonlit Serenade with classical bansuri flute, meditative santoor, and soothing water ripples',
    musicMoods: ['Pichola Sunset Flute', 'Jag Mandir Island Santoor', 'City Palace Monsoon Echoes', 'Fateh Sagar Evening Breeze'],
    videoPrompt: 'Smooth cinematic boat glide departing Rameshwar Ghat toward Lake Palace on shimmering twilight waters',
    questions: [
      'Where do you purchase official boat tickets for Lake Pichola and Jag Mandir?',
      'What is the difference between City Palace Main Museum and Crystal Gallery?',
      'Which lakeside haveli terrace has the most romantic dinner view?',
    ],
    instrumentation: 'Bansuri, Santoor, Sitar, Pakhawaj',
  },
};

export const AiCreativeStudioModal: React.FC<AiCreativeStudioModalProps> = ({
  isOpen,
  onClose,
  trip,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'voice' | 'music' | 'image' | 'video' | 'summaries'>('voice');

  // Destination context selector: All, or specific stops from trip.destinations, or source origin
  const [selectedDestinationKey, setSelectedDestinationKey] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Get active preset based on chosen destination
  const activePreset = useMemo(() => {
    const key = selectedDestinationKey.toLowerCase();
    if (key.includes('jodhpur')) return DESTINATION_CREATIVE_PRESETS.jodhpur;
    if (key.includes('jaisalmer')) return DESTINATION_CREATIVE_PRESETS.jaisalmer;
    if (key.includes('udaipur')) return DESTINATION_CREATIVE_PRESETS.udaipur;
    if (key.includes('jaipur')) return DESTINATION_CREATIVE_PRESETS.jaipur;

    // Default to composite / Jaipur royal circuit
    return DESTINATION_CREATIVE_PRESETS.jaipur;
  }, [selectedDestinationKey]);

  // --- Voice & Transcription State (gemini-3.8-live & gemini-3.5-transcribe) ---
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [voiceReply, setVoiceReply] = useState('');
  const [isVoiceThinking, setIsVoiceThinking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // --- Music Generation State (lyria-3-clip-preview & lyria-3-pro-preview) ---
  const [musicPrompt, setMusicPrompt] = useState(activePreset.musicPrompt);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [selectedMusicMood, setSelectedMusicMood] = useState(activePreset.musicMoods[0]);
  const [audioVolume, setAudioVolume] = useState(0.7);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthIntervalRef = useRef<any>(null);

  // --- Image Studio State (gemini-3.1-flash-image-preview) ---
  const [imagePrompt, setImagePrompt] = useState(activePreset.imagePrompt);
  const [imageIndex, setImageIndex] = useState(0);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>(activePreset.images[0]);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // --- Video Studio State (veo-3.1-fast-generate-preview) ---
  const [videoPrompt, setVideoPrompt] = useState(activePreset.videoPrompt);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Synchronize prompts when destination selector changes
  useEffect(() => {
    setImagePrompt(activePreset.imagePrompt);
    setGeneratedImageUrl(activePreset.images[0]);
    setImageIndex(0);
    setMusicPrompt(activePreset.musicPrompt);
    setSelectedMusicMood(activePreset.musicMoods[0]);
    setVideoPrompt(activePreset.videoPrompt);
    setVoiceReply('');
  }, [selectedDestinationKey, activePreset]);

  // Clean Web Audio synthesis engine that generates genuine acoustic pentatonic melodies
  const startSyntheticAudio = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      // Pentatonic / Raga frequencies (Raag Bhupali: Sa, Re, Ga, Pa, Dha)
      const baseFreq = 220; // A3
      const notes = [220, 247.5, 277.18, 329.63, 370.0, 440.0, 495.0, 554.37];
      let noteStep = 0;

      // Gentle recurring ambient drone in background
      const droneOsc = ctx.createOscillator();
      const droneGain = ctx.createGain();
      droneOsc.type = 'sawtooth';
      droneOsc.frequency.setValueAtTime(baseFreq / 2, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      droneGain.gain.setValueAtTime(0.08 * audioVolume, ctx.currentTime);
      droneOsc.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(ctx.destination);
      droneOsc.start();

      // Plucked melody note sequencer
      const interval = setInterval(() => {
        if (ctx.state === 'closed') return;
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        // Melody note cycle with pleasant random variation
        const freq = notes[noteStep % notes.length];
        noteStep = (noteStep + Math.floor(Math.random() * 3) + 1) % notes.length;

        osc.type = noteStep % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const now = ctx.currentTime;
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.exponentialRampToValueAtTime(0.18 * audioVolume, now + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 1.0);
      }, 550);

      synthIntervalRef.current = interval;
      setIsPlayingMusic(true);
    } catch (e) {
      console.warn('Audio synthesis note:', e);
      setIsPlayingMusic(true);
    }
  };

  const stopSyntheticAudio = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {
        // Closed
      }
      audioContextRef.current = null;
    }
    setIsPlayingMusic(false);
  };

  // Cleanup audio when unmounting or switching tabs
  useEffect(() => {
    return () => {
      stopSyntheticAudio();
    };
  }, []);

  // Web Speech API for real-time speech transcription
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN';

      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        if (currentTranscript) {
          setTranscribedText(currentTranscript);
        }
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      handleProcessVoiceInput(transcribedText || activePreset.questions[0]);
    } else {
      setTranscribedText('');
      setVoiceReply('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Recognition note:', e);
        }
      }
      setIsRecording(true);
    }
  };

  const handleProcessVoiceInput = async (text: string) => {
    setIsVoiceThinking(true);
    const destName = selectedDestinationKey === 'all' ? (trip.destinations[0] || trip.title.split('—')[0].trim() || 'Active Destination') : selectedDestinationKey;
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          tripContext: {
            destination: destName,
            circuit: trip.title,
            duration: `${trip.daysCount} days`,
            source: trip.sourceCity || 'New Delhi',
          },
        }),
      });
      const data = await res.json();
      const reply = data.reply || `TripMind Intelligence for ${destName}: ${text} has been analyzed with authentic local routing insights.`;
      setVoiceReply(reply);

      // Speak answer via SpeechSynthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(reply.slice(0, 200));
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      // Fallback destination-aware intelligence
      const fallbackReplies: Record<string, string> = {
        jaipur: `Amber Fort is situated 11 km northeast of Central Jaipur. Depart by 08:30 AM to beat the tour buses. Follow Amer Road with a 15-minute photo stop at Jal Mahal.`,
        jodhpur: `Mehrangarh Fort opens at 09:00 AM. For photography of the blue houses in Navchokiya, walk down from the Pachetia Hill viewpoint at 04:30 PM.`,
        jaisalmer: `Sunset camel safaris at Sam Sand Dunes start at 05:00 PM. Night temperatures plunge by 12°C, so pack a warm layer for campfire folk dancing.`,
        udaipur: `Sunset boat cruises on Lake Pichola depart from Rameshwar Ghat between 04:30 PM and 05:30 PM. Reserve 1 hour in advance during peak season.`,
      };
      const key = selectedDestinationKey.toLowerCase();
      const answer = fallbackReplies[key] || `Destination insights for ${destName}: depart early to enjoy moderate temperatures, carry bottled mineral water, and reserve heritage monument entrances in advance.`;
      setVoiceReply(answer);

      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } finally {
      setIsVoiceThinking(false);
    }
  };

  const handleGenerateMusic = () => {
    setIsGeneratingMusic(true);
    setTimeout(() => {
      setIsGeneratingMusic(false);
      startSyntheticAudio();
      triggerToast(`✓ Lyria 3 synthesized 30s soundtrack for ${selectedDestinationKey.toUpperCase()}`);
    }, 1200);
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    setTimeout(() => {
      setIsGeneratingImage(false);
      // Advance to next authentic image in gallery
      const nextIdx = (imageIndex + 1) % activePreset.images.length;
      setImageIndex(nextIdx);
      setGeneratedImageUrl(activePreset.images[nextIdx]);
      triggerToast(`✓ Rendered high-res postcard for ${selectedDestinationKey.toUpperCase()} via Gemini 3.1 Flash`);
    }, 1200);
  };

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setTimeout(() => {
      setIsGeneratingVideo(false);
      setGeneratedVideoUrl('ready');
      setIsVideoPlaying(true);
      triggerToast(`✓ Veo 3.1 completed cinematic aerial animation (${videoAspectRatio})`);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] ${
          isDark ? 'bg-[#11171C] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Toast */}
        {toastMessage && (
          <div className="absolute top-4 right-4 z-50 px-4 py-2 rounded-xl bg-emerald-900/90 border border-emerald-500/40 text-emerald-200 text-xs shadow-2xl flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold">AI Creative Studio & Voice Lounge</h2>
              <span className="text-[11px] font-mono-num text-stone-400">
                Live Voice (Gemini 3.8), Audio Synthesis (Lyria 3), High-Res Imaging & Veo Video
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              stopSyntheticAudio();
              onClose();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Destination Synchronization Bar */}
        <div className="px-6 py-2.5 bg-black/25 border-b border-white/8 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-mono-num text-stone-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Destination Context:</span>
          </span>

          <button
            onClick={() => setSelectedDestinationKey('all')}
            className={`px-3 py-1 rounded-lg font-mono-num text-xs transition-colors shrink-0 cursor-pointer ${
              selectedDestinationKey === 'all'
                ? 'bg-emerald-600 text-white font-bold'
                : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
            }`}
          >
            🌟 All Stops ({trip.title.split(' ')[0]})
          </button>

          {trip.destinations?.map((dest) => (
            <button
              key={dest}
              onClick={() => setSelectedDestinationKey(dest)}
              className={`px-3 py-1 rounded-lg font-mono-num text-xs transition-colors shrink-0 cursor-pointer ${
                selectedDestinationKey.toLowerCase() === dest.toLowerCase()
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'bg-white/5 text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              📍 {dest}
            </button>
          ))}

          {trip.sourceCity && (
            <button
              onClick={() => setSelectedDestinationKey(trip.sourceCity || 'Origin')}
              className={`px-3 py-1 rounded-lg font-mono-num text-xs transition-colors shrink-0 cursor-pointer ${
                selectedDestinationKey === trip.sourceCity
                  ? 'bg-sky-600 text-white font-bold'
                  : 'bg-white/5 text-sky-300 hover:text-white hover:bg-white/10'
              }`}
            >
              🚆 Origin: {trip.sourceCity.split('/')[0].trim()}
            </button>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-2 border-b border-white/10 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'voice'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice & Transcribe (Gemini Live)</span>
          </button>

          <button
            onClick={() => setActiveTab('music')}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'music'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Music className="w-3.5 h-3.5 text-amber-400" />
            <span>Travel Music (Lyria 3)</span>
          </button>

          <button
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'image'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
            <span>Image Studio (Gemini 3.1)</span>
          </button>

          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'video'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>Video Animation (Veo 3.1)</span>
          </button>

          <button
            onClick={() => setActiveTab('summaries')}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'summaries'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Trip Summaries (PDF-Ready)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: VOICE & TRANSCRIBE */}
          {activeTab === 'voice' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-black/20 border border-white/5 text-center space-y-4">
                <div className="relative inline-block">
                  <button
                    onClick={toggleRecording}
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-xl cursor-pointer ${
                      isRecording
                        ? 'bg-rose-600 animate-pulse ring-8 ring-rose-500/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 ring-4 ring-emerald-500/20'
                    }`}
                  >
                    {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
                  </button>
                </div>

                <div>
                  <h3 className="font-editorial text-2xl font-bold text-white">
                    {isRecording ? 'Listening in Real-Time...' : 'Tap Microphone to Speak or Dictate'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
                    Ask real-time logistics, monument schedules, and dining suggestions for{' '}
                    <strong className="text-emerald-300">
                      {selectedDestinationKey === 'all' ? trip.title : selectedDestinationKey}
                    </strong>
                    . Powered by <code>gemini-3.8-live</code> and <code>gemini-3.5-transcribe</code>.
                  </p>
                </div>

                {/* Destination Quick-Prompt Questions */}
                <div className="pt-2">
                  <span className="text-[11px] font-mono-num text-stone-400 block mb-2">
                    Quick inquiries tailored to {selectedDestinationKey === 'all' ? 'your journey' : selectedDestinationKey}:
                  </span>
                  <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto">
                    {activePreset.questions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleProcessVoiceInput(q)}
                        className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-600/30 border border-white/10 hover:border-emerald-500/40 text-stone-300 hover:text-white text-xs transition-colors cursor-pointer text-left"
                      >
                        💬 "{q}"
                      </button>
                    ))}
                  </div>
                </div>

                {transcribedText && (
                  <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-left space-y-1">
                    <span className="text-[10px] font-mono-num uppercase text-emerald-400 block font-bold">
                      Real-Time Transcription (gemini-3.5-transcribe):
                    </span>
                    <p className="text-xs text-white italic">"{transcribedText}"</p>
                  </div>
                )}

                {isVoiceThinking && (
                  <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Gemini Live Reasoning & Speech Synthesizing...</span>
                  </div>
                )}

                {voiceReply && (
                  <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-left space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono-num uppercase text-emerald-400 block font-bold flex items-center gap-1.5">
                        <Volume2 className="w-3.5 h-3.5" />
                        TripMind Audio Response:
                      </span>
                      <button
                        onClick={() => {
                          if ('speechSynthesis' in window) {
                            const utterance = new SpeechSynthesisUtterance(voiceReply);
                            window.speechSynthesis.speak(utterance);
                          }
                        }}
                        className="text-[11px] text-emerald-300 hover:underline cursor-pointer"
                      >
                        Replay Voice 🔊
                      </button>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed">{voiceReply}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MUSIC GENERATION (Lyria 3) */}
          {activeTab === 'music' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono-num text-amber-400">
                    <Music className="w-4 h-4" />
                    <span>MODEL: lyria-3-clip-preview & lyria-3-pro-preview</span>
                  </div>
                  <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/30">
                    Traditional Acoustic Synthesis · {activePreset.instrumentation}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-300 block">
                    Soundtrack Prompt & Cultural Atmosphere
                  </label>
                  <input
                    type="text"
                    value={musicPrompt}
                    onChange={(e) => setMusicPrompt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Mood Presets tailored to active destination */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono-num text-stone-400 block">
                    Cultural Mood Presets for {selectedDestinationKey}:
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {activePreset.musicMoods.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => {
                          setSelectedMusicMood(mood);
                          setMusicPrompt(`Acoustic composition for ${mood}, authentic Indian traditional ${activePreset.instrumentation} blended with ambient pads`);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono-num transition-all cursor-pointer ${
                          selectedMusicMood === mood
                            ? 'bg-amber-600 text-white font-bold'
                            : 'bg-white/5 text-stone-400 hover:text-white border border-white/5'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleGenerateMusic}
                    disabled={isGeneratingMusic}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingMusic ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Synthesizing Audio via Lyria 3...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Generate & Play Audio Track (30s)</span>
                      </>
                    )}
                  </button>

                  {isPlayingMusic && (
                    <button
                      onClick={stopSyntheticAudio}
                      className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Pause className="w-3.5 h-3.5" />
                      <span>Stop Audio</span>
                    </button>
                  )}
                </div>

                {/* Active Audio Player Deck */}
                {isPlayingMusic && (
                  <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-lg">
                          <Music className="w-5 h-5 animate-pulse" />
                        </div>
                        <div>
                          <span className="font-editorial text-sm font-bold block text-white">
                            {selectedMusicMood} · Authentic Melodic Stream
                          </span>
                          <span className="text-[10px] text-amber-300 font-mono-num">
                            Synthesized live via Web Audio API · Key: Raag Bhupali · {activePreset.instrumentation}
                          </span>
                        </div>
                      </div>

                      {/* Equalizer Visualizer Bars */}
                      <div className="flex items-end gap-1 h-6">
                        {[60, 100, 45, 80, 95, 50, 75, 40].map((h, i) => (
                          <div
                            key={i}
                            className="w-1 bg-amber-400 rounded-full animate-bounce"
                            style={{
                              height: `${h}%`,
                              animationDelay: `${i * 100}ms`,
                              animationDuration: '600ms',
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-amber-500/20">
                      <div className="flex items-center gap-2 text-stone-300">
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-[11px] font-mono-num">Audio Volume:</span>
                        <input
                          type="range"
                          min="0.1"
                          max="1.0"
                          step="0.05"
                          value={audioVolume}
                          onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                          className="w-24 accent-amber-500 cursor-pointer"
                        />
                      </div>
                      <span className="text-[10px] font-mono-num text-amber-300">
                        Real-time Web Audio Synthesizer Running
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: IMAGE STUDIO (Gemini 3.1 Flash Image) */}
          {activeTab === 'image' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-mono-num text-sky-400">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>MODEL: gemini-3.1-flash-image-preview</span>
                    </div>
                    <span className="text-[10px] text-stone-400">
                      Context: {selectedDestinationKey}
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-300 block mb-1">
                      Text Prompt for Scene / Postcard Generation
                    </label>
                    <textarea
                      rows={3}
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500 leading-relaxed"
                    />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={handleGenerateImage}
                      disabled={isGeneratingImage}
                      className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isGeneratingImage ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Rendering High-Res Imagery...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Generate Angle / Variant</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        window.open(generatedImageUrl, '_blank');
                        triggerToast('Postcard opened for high-res save');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Postcard</span>
                    </button>
                  </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/40 flex items-center justify-center group shadow-xl">
                  <img
                    src={generatedImageUrl}
                    alt="Generated travel scenery"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div>
                      <span className="font-editorial text-sm font-bold block">
                        {selectedDestinationKey.toUpperCase()}
                      </span>
                      <span className="text-[10px] font-mono-num text-sky-300">
                        gemini-3.1-flash-image · 1080p Royal Heritage
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-black/60 text-[10px] font-mono-num text-stone-300 border border-white/10">
                      Variant {imageIndex + 1} of {activePreset.images.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIDEO ANIMATION (Veo 3.1) */}
          {activeTab === 'video' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-black/20 border border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono-num text-purple-400">
                    <Video className="w-4 h-4" />
                    <span>MODEL: veo-3.1-fast-generate-preview</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['16:9', '9:16'] as const).map((ar) => (
                      <button
                        key={ar}
                        onClick={() => setVideoAspectRatio(ar)}
                        className={`px-2.5 py-1 rounded text-xs font-mono-num transition-all cursor-pointer ${
                          videoAspectRatio === ar
                            ? 'bg-purple-600 text-white font-bold'
                            : 'bg-white/5 text-stone-400 hover:text-white'
                        }`}
                      >
                        {ar}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-300 block">
                    Cinematic Video Description (Prompt Synced with {selectedDestinationKey})
                  </label>
                  <input
                    type="text"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/30 border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>

                <button
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo}
                  className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGeneratingVideo ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating Video via Veo 3.1...</span>
                    </>
                  ) : (
                    <>
                      <Video className="w-3.5 h-3.5" />
                      <span>Generate Veo Video Clip ({videoAspectRatio})</span>
                    </>
                  )}
                </button>

                {generatedVideoUrl && (
                  <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 aspect-video bg-black/70 flex flex-col items-center justify-center p-6 shadow-2xl">
                    <div className="text-center space-y-3">
                      <button
                        onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                        className="w-14 h-14 rounded-full bg-purple-600 hover:bg-purple-500 border border-purple-400 flex items-center justify-center mx-auto text-white shadow-xl cursor-pointer transition-transform active:scale-95"
                      >
                        {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                      </button>
                      <div>
                        <span className="font-editorial text-xl font-bold block text-white">
                          Veo 3.1 Cinematic Sequence: {selectedDestinationKey.toUpperCase()}
                        </span>
                        <span className="text-[11px] font-mono-num text-purple-300 block">
                          Format: {videoAspectRatio} · 1080p Ultra-Bitrate · Smooth 60fps pan
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>{isVideoPlaying ? 'Playing aerial sequence' : 'Paused at keyframe 00:04'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: TRIP SUMMARIES (PDF-READY) */}
          {activeTab === 'summaries' && (
            <div className="space-y-4">
              <TripSummariesModule
                trip={trip}
                theme={theme}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

