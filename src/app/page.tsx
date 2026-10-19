'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  ArrowRight, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  Terminal,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { ConversationTurn } from '@/lib/types';

export default function ConversationalSurveyPage() {
  const [sessionState, setSessionState] = useState<'idle' | 'agent_speaking' | 'listening' | 'thinking' | 'completed'>('idle');
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [completedRecordId, setCompletedRecordId] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns, currentTranscript]);

  // Initialize Speech Synthesis & Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              const final = event.results[i][0].transcript.trim();
              if (final) {
                handleUserSubmit(final);
              }
            } else {
              interim += event.results[i][0].transcript;
            }
          }
          setCurrentTranscript(interim);
        };

        recognition.onerror = (e: any) => {
          console.error('Speech recognition error:', e);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Speak agent utterance out loud
  const speakText = (text: string, onEnd?: () => void) => {
    if (!synthRef.current || voiceMuted) {
      if (onEnd) onEnd();
      return;
    }

    synthRef.current.cancel(); // stop any active speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Pick a natural English voice if available
    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(
      (v) => (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha')) && v.lang.startsWith('en')
    );
    if (naturalVoice) {
      utterance.voice = naturalVoice;
    }

    setSessionState('agent_speaking');

    utterance.onend = () => {
      setSessionState('listening');
      startListening();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      setSessionState('listening');
      startListening();
      if (onEnd) onEnd();
    };

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setMicActive(true);
      } catch (err) {
        // already started
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setMicActive(false);
      } catch (err) {
        // ignore
      }
    }
  };

  // Start the voice survey session
  const startSurvey = async () => {
    setTurns([]);
    setCurrentTranscript('');
    setSessionState('thinking');

    try {
      const res = await fetch('/api/survey/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productName: 'Kroma Audio', history: [] }),
      });

      const data = await res.json();
      setTurns(data.turns);

      // Agent speaks Turn 1 out loud
      speakText(data.agentReply);
    } catch (err) {
      console.error('Failed to start survey:', err);
      setSessionState('idle');
    }
  };

  // Submit user response (via voice speech or manual text)
  const handleUserSubmit = async (text: string) => {
    if (!text.trim()) return;

    stopListening();
    setCurrentTranscript('');
    setSessionState('thinking');

    try {
      const res = await fetch('/api/survey/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: 'Kroma Audio',
          history: turns,
          userMessage: text,
        }),
      });

      const data = await res.json();
      setTurns(data.turns);

      if (data.isComplete) {
        setCompletedRecordId(data.recordId);
        speakText(data.agentReply, () => {
          setSessionState('completed');
        });
      } else {
        // Agent speaks follow-up question out loud
        speakText(data.agentReply);
      }
    } catch (err) {
      console.error('Turn error:', err);
      setSessionState('listening');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans selection:bg-zinc-200 selection:text-zinc-900">
      {/* Top Navbar */}
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded bg-zinc-900 text-white flex items-center justify-center font-mono font-bold text-xs tracking-tighter shadow-sm">
            E
          </div>
          <span className="font-mono text-xs font-semibold tracking-wider uppercase text-zinc-950">
            ECHO // VOICE_SURVEY_STUDIO
          </span>
          <span className="font-mono text-[10px] text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded hidden sm:inline-block">
            MOM_TEST_PROTOCOL
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1.5 rounded-lg border border-zinc-200 transition-colors text-xs font-mono font-medium"
          >
            <span>TELEMETRY_DASHBOARD</span>
            <ArrowRight className="w-3 h-3 text-zinc-500" />
          </Link>
        </div>
      </header>

      {/* Main Conversational Stage */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-6 py-8 flex flex-col gap-6">
        {/* Survey Header Banner */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-[10px] font-mono text-zinc-600 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              ACTIVE_TARGET // KROMA_AUDIO
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-950">
              Post-Experience Voice Survey
            </h1>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-lg mt-1">
              Echo conducts a 90-second conversational interview using The Mom Test protocol. It speaks questions out loud and probes for real user friction.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setVoiceMuted(!voiceMuted)}
              title={voiceMuted ? 'Unmute AI voice' : 'Mute AI voice'}
              className="p-2 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 transition-colors"
            >
              {voiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            {sessionState !== 'idle' && (
              <button
                onClick={startSurvey}
                title="Restart survey"
                className="p-2 rounded-lg border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-600 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Live Audio Visualizer Stage */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          {sessionState === 'idle' && (
            <div className="py-8 flex flex-col items-center max-w-sm">
              <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center mb-4 text-zinc-900 shadow-sm">
                <Volume2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-semibold text-zinc-900 mb-1">
                Start Conversational Survey
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed mb-6">
                Echo will speak an opening question out loud. Speak back naturally to share your experience with Kroma Audio.
              </p>
              <button
                onClick={startSurvey}
                className="py-2.5 px-6 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-mono font-medium transition-colors shadow-sm flex items-center gap-2"
              >
                <Mic className="w-4 h-4" />
                <span>START_VOICE_SESSION (90S)</span>
              </button>
            </div>
          )}

          {(sessionState === 'agent_speaking' || sessionState === 'listening' || sessionState === 'thinking') && (
            <div className="py-4 w-full flex flex-col items-center">
              {/* Dynamic Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-4 font-mono text-[11px] transition-all bg-zinc-50 border-zinc-200 text-zinc-800">
                {sessionState === 'agent_speaking' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    <span>ECHO IS SPEAKING OUT LOUD...</span>
                  </>
                )}
                {sessionState === 'listening' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                    <span className="text-rose-700 font-semibold">LISTENING TO YOU (SPEAK FREELY)...</span>
                  </>
                )}
                {sessionState === 'thinking' && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-spin"></span>
                    <span>ECHO IS ANALYZING RESPONSE...</span>
                  </>
                )}
              </div>

              {/* Rhythmic Speech Bar Visualizer */}
              <div className="flex items-center gap-1.5 h-16 mb-4">
                {[40, 65, 30, 85, 55, 95, 45, 75, 35, 90, 60, 40].map((height, i) => (
                  <span
                    key={i}
                    style={{
                      height:
                        sessionState === 'agent_speaking'
                          ? `${Math.max(8, (height * (Math.sin(Date.now() / 200 + i) + 1.2)) / 2)}px`
                          : sessionState === 'listening'
                          ? `${Math.max(6, (height * 0.4))}px`
                          : '4px',
                    }}
                    className={`w-1 rounded-full transition-all duration-150 ${
                      sessionState === 'agent_speaking'
                        ? 'bg-zinc-950'
                        : sessionState === 'listening'
                        ? 'bg-rose-500'
                        : 'bg-zinc-300'
                    }`}
                  />
                ))}
              </div>

              {/* Current Live Transcription Stream */}
              {sessionState === 'listening' && (
                <div className="w-full max-w-md bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-700 min-h-12 flex items-center justify-center font-mono">
                  {currentTranscript ? (
                    <span>&ldquo;{currentTranscript}&rdquo;</span>
                  ) : (
                    <span className="text-zinc-400 italic">Listening for speech...</span>
                  )}
                </div>
              )}
            </div>
          )}

          {sessionState === 'completed' && (
            <div className="py-6 flex flex-col items-center max-w-sm">
              <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-semibold text-zinc-950 mb-1">
                Survey Session Completed
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed mb-5">
                The conversation transcript was processed through AssemblyAI Speech Intelligence and indexed for the team.
              </p>
              <div className="flex gap-2">
                <Link
                  href="/dashboard"
                  className="py-2 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-mono font-medium transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <span>VIEW_IN_DASHBOARD</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={startSurvey}
                  className="py-2 px-3 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 rounded-xl text-xs font-mono transition-colors border border-zinc-200"
                >
                  RESTART
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Multi-Turn Dialogue Transcript */}
        {turns.length > 0 && (
          <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-150">
              <div className="flex items-center gap-2 font-mono text-xs font-semibold text-zinc-700">
                <Terminal className="w-3.5 h-3.5 text-zinc-500" />
                <span>LIVE_CONVERSATION_TRANSCRIPT ({turns.length} TURNS)</span>
              </div>
              <span className="font-mono text-[10px] text-zinc-400">THE_MOM_TEST</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {turns.map((turn, idx) => (
                <div
                  key={turn.id || idx}
                  className={`flex flex-col gap-1 p-3.5 rounded-xl text-xs ${
                    turn.role === 'agent'
                      ? 'bg-zinc-50 border border-zinc-200 text-zinc-900'
                      : 'bg-zinc-100/70 border border-zinc-200 text-zinc-900 ml-4'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className={`font-semibold uppercase ${turn.role === 'agent' ? 'text-zinc-600' : 'text-indigo-600'}`}>
                      {turn.role === 'agent' ? 'ECHO // AI_RESEARCHER' : 'YOU // CUSTOMER'}
                    </span>
                    <span className="text-zinc-400">
                      {new Date(turn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <p className="leading-relaxed font-normal">{turn.text}</p>
                </div>
              ))}
              <div ref={transcriptEndRef} />
            </div>

            {/* Quick manual text response option (fallback if microphone is quiet) */}
            {sessionState === 'listening' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = (e.currentTarget.elements.namedItem('reply') as HTMLInputElement).value;
                  if (input.trim()) {
                    handleUserSubmit(input);
                    e.currentTarget.reset();
                  }
                }}
                className="flex items-center gap-2 pt-2 border-t border-zinc-150"
              >
                <input
                  name="reply"
                  type="text"
                  placeholder="Or type your reply here if microphone is muted..."
                  className="flex-1 bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 font-mono"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition-colors"
                  title="Send response"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* Footer Technical Note */}
        <div className="text-center font-mono text-[10px] text-zinc-400 py-2">
          ECHO SURVEY ENGINE // FULL-DUPLEX TWO-WAY SPEECH & ASSEMBLYAI INTELLIGENCE
        </div>
      </main>
    </div>
  );
}
