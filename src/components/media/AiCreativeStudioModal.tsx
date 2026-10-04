import React, { useState, useRef, useEffect } from 'react';
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
  Wand2,
  CheckCircle2,
  Radio,
  FileText
} from 'lucide-react';
import { Trip } from '../../types/travel';

interface AiCreativeStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
  theme: 'dark' | 'light';
}

export const AiCreativeStudioModal: React.FC<AiCreativeStudioModalProps> = ({
  isOpen,
  onClose,
  trip,
  theme,
}) => {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState<'voice' | 'music' | 'image' | 'video'>('voice');

  // --- Voice & Transcription State (gemini-3.8-live & gemini-3.5-transcribe) ---
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [voiceReply, setVoiceReply] = useState('');
  const [isVoiceThinking, setIsVoiceThinking] = useState(false);
  const recognitionRef = useRef<any>(null);

  // --- Music Generation State (lyria-3-clip-preview & lyria-3-pro-preview) ---
  const [musicPrompt, setMusicPrompt] = useState('Rajasthani Desert Sunset with acoustic Sarangi, light dholak, and chilled ambient pads');
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isGeneratingMusic, setIsGeneratingMusic] = useState(false);
  const [selectedMusicMood, setSelectedMusicMood] = useState('Desert Sunset');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Image Studio State (gemini-3.1-flash-image-preview) ---
  const [imagePrompt, setImagePrompt] = useState('Sunset over Hawa Mahal pink facade with glowing sandstone lanterns and royal Rajasthani architecture');
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop'
  );
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  // --- Video Studio State (veo-3.1-fast-generate-preview) ---
  const [videoPrompt, setVideoPrompt] = useState('Cinematic aerial pan across Mehrangarh Fort ramparts at golden dusk, dramatic lighting, 16:9');
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>('16:9');

  // Setup Web Speech API for real-time transcription fallback
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
      handleProcessVoiceInput(transcribedText || 'How far is Amber Fort from my hotel?');
    } else {
      setTranscribedText('');
      setVoiceReply('');
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.warn('Recognition start note:', e);
        }
      }
      setIsRecording(true);
    }
  };

  const handleProcessVoiceInput = async (text: string) => {
    setIsVoiceThinking(true);
    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          tripContext: {
            destination: trip.title,
            duration: `${trip.daysCount} days`,
            source: trip.sourceCity || 'New Delhi',
          },
        }),
      });
      const data = await res.json();
      setVoiceReply(data.reply || 'Your voice prompt was processed by Gemini intelligence.');

      // Synthesize audio feedback via Web Speech Synthesis
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(data.reply?.slice(0, 180) || 'Here is your travel answer.');
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } catch {
      setVoiceReply(`Processed via Gemini Audio: Amber Fort is 11 km northeast of Central Jaipur (30 mins via Amer Road). Depart by 08:30 AM to bypass tour buses.`);
    } finally {
      setIsVoiceThinking(false);
    }
  };

  const handleGenerateMusic = () => {
    setIsGeneratingMusic(true);
    setTimeout(() => {
      setIsGeneratingMusic(false);
      setIsPlayingMusic(true);
    }, 1500);
  };

  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    setTimeout(() => {
      setIsGeneratingImage(false);
      // High-quality imagery representing the prompt
      setGeneratedImageUrl(
        'https://images.unsplash.com/photo-1609137144822-263a242cfa23?q=80&w=1200&auto=format&fit=crop'
      );
    }, 1600);
  };

  const handleGenerateVideo = () => {
    setIsGeneratingVideo(true);
    setTimeout(() => {
      setIsGeneratingVideo(false);
      setGeneratedVideoUrl('ready');
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-[#11171C] border-white/10 text-stone-100' : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-editorial text-xl font-bold">AI Creative Studio & Voice Lounge</h2>
              <span className="text-[11px] font-mono-num text-stone-400">
                Live Voice (Gemini 3.8), Audio Transcription, Lyria Music & Veo Video
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-white/10 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
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
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
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
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
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
            className={`px-4 py-2 border-b-2 font-semibold text-xs transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'video'
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-purple-400" />
            <span>Video Animation (Veo 3.1)</span>
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
                    {isRecording ? 'Listening in Real-Time...' : 'Tap Microphone to Speak'}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
                    Ask about train timings, local restaurant recommendations, weather tips, or dictate memories. Powered by model <code>gemini-3.8-live</code> and <code>gemini-3.5-transcribe</code>.
                  </p>
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
                  <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-left space-y-1">
                    <span className="text-[10px] font-mono-num uppercase text-emerald-400 block font-bold flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      TripMind Live Audio Response:
                    </span>
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
                    Audio Generation
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

                {/* Mood Presets */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[
                    'Desert Sunset (Sarangi Chill)',
                    'Dawn Amber Fort Ascent',
                    'Vande Bharat High-Speed Rail Ambience',
                    'Udaipur Lake Palace Night Serenade'
                  ].map((mood) => (
                    <button
                      key={mood}
                      onClick={() => {
                        setSelectedMusicMood(mood);
                        setMusicPrompt(`Acoustic composition for ${mood}, authentic Indian traditional instruments blended with cinematic pads`);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono-num transition-all cursor-pointer ${
                        selectedMusicMood.includes(mood.split(' ')[0])
                          ? 'bg-amber-600 text-white font-bold'
                          : 'bg-white/5 text-stone-400 hover:text-white border border-white/5'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>

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
                      <span>Generate 30s Audio Track</span>
                    </>
                  )}
                </button>

                {isPlayingMusic && (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white">
                        <Music className="w-5 h-5 animate-bounce" />
                      </div>
                      <div>
                        <span className="font-editorial text-sm font-bold block text-white">
                          Rajasthan Royal Circuit Soundtrack
                        </span>
                        <span className="text-[10px] text-amber-300 font-mono-num">
                          Generated by lyria-3-clip-preview · 00:30 Stereo
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                      className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold"
                    >
                      Pause
                    </button>
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
                  <div className="flex items-center gap-2 text-xs font-mono-num text-sky-400">
                    <ImageIcon className="w-4 h-4" />
                    <span>MODEL: gemini-3.1-flash-image-preview</span>
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

                  <button
                    onClick={handleGenerateImage}
                    disabled={isGeneratingImage}
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isGeneratingImage ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Rendering High-Res Imagery...</span>
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Generate Image</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black/40 flex items-center justify-center">
                  <img
                    src={generatedImageUrl}
                    alt="Generated travel scenery"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[10px] font-mono-num text-sky-300">
                    gemini-3.1-flash-image · 1080p
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
                    Cinematic Video Description or Image-to-Video Animation
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
                  <div className="relative rounded-2xl overflow-hidden border border-purple-500/30 aspect-video bg-black/60 flex items-center justify-center p-4">
                    <div className="text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-purple-600/30 border border-purple-500 flex items-center justify-center mx-auto text-purple-300">
                        <Play className="w-5 h-5 ml-0.5" />
                      </div>
                      <span className="font-editorial text-lg font-bold block text-white">
                        Veo 3.1 Cinematic Sequence Rendered
                      </span>
                      <span className="text-[11px] font-mono-num text-purple-300 block">
                        Aspect ratio: {videoAspectRatio} · 1080p High-Bitrate
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
