'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Check, X, ArrowUpRight, Loader2, Disc } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EchoWidget({ productName = 'Gatsby Desktop' }: { productName?: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [recordingState, setRecordingState] = useState<'idle' | 'recording' | 'processing' | 'done' | 'error'>('idle');
  const [timeLeft, setTimeLeft] = useState(90);
  const [errorMessage, setErrorMessage] = useState('');
  const [analysisResult, setAnalysisResult] = useState<{ id: string; summary: string; sentiment: string } | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Global key listener (Esc to close, Space to stop recording)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        resetModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Timer countdown
  useEffect(() => {
    if (recordingState === 'recording') {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recordingState]);

  // Cartesia-style pro audio visualizer (clean vertical metering bars)
  const drawWaveform = () => {
    if (!canvasRef.current || !analyserRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const render = () => {
      analyser.getByteFrequencyData(dataArray);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const totalBars = 32;
      const barWidth = 3;
      const spacing = 4;
      const totalWidth = totalBars * (barWidth + spacing) - spacing;
      const startX = (canvas.width - totalWidth) / 2;

      for (let i = 0; i < totalBars; i++) {
        const dataIndex = Math.floor((i / totalBars) * bufferLength);
        const value = dataArray[dataIndex] / 255;
        const barHeight = Math.max(3, value * (canvas.height - 12));
        const x = startX + i * (barWidth + spacing);
        const y = (canvas.height - barHeight) / 2;

        // Subtle gradient: muted zinc into bright white peak
        if (value > 0.6) {
          ctx.fillStyle = '#ffffff';
        } else if (value > 0.2) {
          ctx.fillStyle = '#a1a1aa';
        } else {
          ctx.fillStyle = '#3f3f46';
        }

        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 1.5);
        ctx.fill();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  const startRecording = async () => {
    try {
      setErrorMessage('');
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.fftSize = 64;

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
        await uploadAndProcessAudio();
      };

      mediaRecorder.start(250);
      setRecordingState('recording');
      setTimeLeft(90);

      setTimeout(drawWaveform, 60);
    } catch (err: unknown) {
      console.error('Error accessing microphone:', err);
      setRecordingState('error');
      setErrorMessage('Microphone access was denied. Please allow microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingState('processing');
    }
  };

  const uploadAndProcessAudio = async () => {
    try {
      setRecordingState('processing');
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'interview.webm');
      formData.append('product_name', productName);

      const response = await fetch('/api/interviews', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process audio');
      }

      const data = await response.json();
      setAnalysisResult({
        id: data.id,
        summary: data.summary,
        sentiment: data.mom_test.sentiment_summary.overall,
      });
      setRecordingState('done');
    } catch (err: unknown) {
      console.error('Processing error:', err);
      setRecordingState('error');
      setErrorMessage(err instanceof Error ? err.message : 'Processing failed');
    }
  };

  const resetModal = () => {
    setRecordingState('idle');
    setTimeLeft(90);
    setAnalysisResult(null);
    setErrorMessage('');
    setIsOpen(false);
  };

  return (
    <>
      {/* Discreet Cartesia-style dock trigger */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="group flex items-center gap-2.5 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white px-3.5 py-2 rounded-full border border-zinc-800/80 shadow-lg backdrop-blur-md transition-all duration-150 hover:border-zinc-700 text-xs font-medium"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <Mic className="w-3.5 h-3.5 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
            <span>Voice Feedback</span>
            <kbd className="hidden sm:inline-block font-mono text-[10px] text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
              90s
            </kbd>
          </button>
        </div>
      )}

      {/* Modern Studio Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="relative w-full max-w-sm bg-zinc-950 border border-zinc-800/90 rounded-2xl shadow-2xl overflow-hidden p-5 text-zinc-100">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-850">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-500"></span>
                <span className="font-mono text-xs text-zinc-400 tracking-tight">ECHO // USER_AUDIO</span>
              </div>
              <button
                onClick={resetModal}
                className="text-zinc-500 hover:text-zinc-300 p-1 rounded-md hover:bg-zinc-900 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="py-5 flex flex-col items-center">
              {recordingState === 'idle' && (
                <div className="w-full text-left">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-zinc-100 tracking-tight mb-1">
                      Give 90-Second Voice Feedback
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      What were you trying to accomplish in {productName}? What felt clunky or required a workaround?
                    </p>
                  </div>

                  <div className="bg-zinc-900/60 border border-zinc-850 rounded-xl p-3 mb-5 text-[11px] text-zinc-400 space-y-1 font-mono">
                    <div className="text-zinc-500 uppercase text-[9px] tracking-wider mb-1.5">Guidelines</div>
                    <div>• Describe past actions, not wishes</div>
                    <div>• Mention any specific errors or hesitation</div>
                    <div>• Audio processes via AssemblyAI</div>
                  </div>

                  <button
                    onClick={startRecording}
                    className="w-full py-2.5 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Mic className="w-3.5 h-3.5" />
                    <span>Start Recording</span>
                  </button>
                </div>
              )}

              {recordingState === 'recording' && (
                <div className="w-full flex flex-col items-center text-center">
                  {/* Status header with live audio indicator */}
                  <div className="flex items-center justify-between w-full mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <Disc className="w-3.5 h-3.5 text-rose-500 animate-spin" />
                      <span className="font-mono text-[11px] text-zinc-300">RECORDING</span>
                    </div>
                    <span className="font-mono text-xs text-zinc-200 tabular-nums bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
                      00:{(timeLeft).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Clean audio visualizer canvas */}
                  <div className="w-full h-16 bg-zinc-900/40 border border-zinc-850 rounded-xl flex items-center justify-center mb-4 overflow-hidden">
                    <canvas ref={canvasRef} width={320} height={64} className="w-full h-full" />
                  </div>

                  <p className="text-[11px] text-zinc-400 mb-5 leading-normal max-w-xs">
                    Speak your thought freely. When finished, hit complete.
                  </p>

                  <button
                    onClick={stopRecording}
                    className="w-full py-2.5 px-4 bg-zinc-100 hover:bg-white text-zinc-950 font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Square className="w-3 h-3 fill-current" />
                    <span>Complete & Analyze</span>
                  </button>
                </div>
              )}

              {recordingState === 'processing' && (
                <div className="w-full py-6 flex flex-col items-center text-center">
                  <Loader2 className="w-6 h-6 text-zinc-400 animate-spin mb-3" />
                  <h4 className="text-xs font-mono text-zinc-200 uppercase tracking-wider mb-1">Processing Telemetry</h4>
                  <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed font-mono">
                    AssemblyAI: speech-to-text → diarization → sentiment analysis
                  </p>
                </div>
              )}

              {recordingState === 'done' && analysisResult && (
                <div className="w-full text-left">
                  <div className="flex items-center gap-2 text-emerald-400 mb-2">
                    <Check className="w-4 h-4" />
                    <span className="text-xs font-semibold uppercase tracking-wider">Analysis Complete</span>
                  </div>

                  <div className="bg-zinc-900/70 border border-zinc-850 rounded-xl p-3.5 mb-4 text-xs">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1.5">
                      Executive Extract
                    </div>
                    <div className="text-zinc-300 leading-relaxed line-clamp-3">
                      {analysisResult.summary}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        resetModal();
                        router.push('/dashboard');
                      }}
                      className="flex-1 py-2 px-3 bg-white hover:bg-zinc-200 text-zinc-950 font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Open in Dashboard</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={resetModal}
                      className="py-2 px-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs border border-zinc-800 transition-colors"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {recordingState === 'error' && (
                <div className="w-full text-left">
                  <div className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1.5">
                    Stream Interrupted
                  </div>
                  <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
                    {errorMessage || 'Failed to capture or upload audio stream.'}
                  </p>
                  <button
                    onClick={() => setRecordingState('idle')}
                    className="w-full py-2 px-3 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 rounded-xl text-xs border border-zinc-800 transition-colors"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-zinc-850 flex items-center justify-between font-mono text-[10px] text-zinc-500">
              <span>PCM 16KHZ // WEBM</span>
              <span>ASSEMBLYAI_SDK</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
