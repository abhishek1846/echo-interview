'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Sparkles, CheckCircle2, AlertCircle, ArrowRight, X, Volume2 } from 'lucide-react';
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

  // Audio waveform animation
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

      const barWidth = (canvas.width / bufferLength) * 2.5;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = (dataArray[i] / 255) * canvas.height * 0.9;
        ctx.fillStyle = `rgb(99, 102, 241)`;
        ctx.fillRect(x, (canvas.height - barHeight) / 2, barWidth - 1, barHeight || 2);
        x += barWidth + 1;
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

      // Setup audio analyzer for waveform
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
        // Stop audio tracks
        stream.getTracks().forEach((track) => track.stop());
        if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        if (audioContextRef.current) audioContextRef.current.close();

        // Send audio to AssemblyAI backend
        await uploadAndProcessAudio();
      };

      mediaRecorder.start(250); // collect 250ms chunks
      setRecordingState('recording');
      setTimeLeft(90);

      // Start drawing canvas
      setTimeout(drawWaveform, 100);
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
        throw new Error(errorData.error || 'Failed to process interview');
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
      {/* Floating Trigger Pill */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2.5 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-3 rounded-full shadow-2xl border border-neutral-700 transition-all hover:scale-105 active:scale-95"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
            </span>
            <Mic className="w-4 h-4 text-indigo-400" />
            <span className="text-sm font-medium tracking-tight">Talk to our team (90s)</span>
          </button>
        </div>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-neutral-100">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-400 border border-indigo-500/20">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-tight text-white">Echo Researcher</h3>
                  <p className="text-xs text-neutral-400">Powered by AssemblyAI Speech Intelligence</p>
                </div>
              </div>
              <button
                onClick={resetModal}
                className="text-neutral-500 hover:text-neutral-300 p-1 rounded-lg hover:bg-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-6 flex flex-col items-center text-center">
              {recordingState === 'idle' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center mb-4 text-indigo-400">
                    <Mic className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-medium mb-1 text-white">Share Your Experience</h4>
                  <p className="text-sm text-neutral-400 max-w-xs mb-6">
                    What were you trying to do in {productName}? What felt clunky or confusing? We listen to real voice feedback.
                  </p>
                  <button
                    onClick={startRecording}
                    className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-indigo-600/20 active:scale-98 flex items-center justify-center gap-2"
                  >
                    <Mic className="w-4 h-4" />
                    Start 90-Second Interview
                  </button>
                </>
              )}

              {recordingState === 'recording' && (
                <>
                  {/* Waveform Visualizer */}
                  <div className="w-full h-20 bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-center mb-4 overflow-hidden relative">
                    <canvas ref={canvasRef} width={360} height={80} className="w-full h-full" />
                    <div className="absolute top-2 right-2 text-xs font-mono text-neutral-400 bg-neutral-950/80 px-2 py-0.5 rounded border border-neutral-800">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span className="text-sm font-medium text-neutral-200">Listening to your thoughts...</span>
                  </div>

                  <p className="text-xs text-neutral-400 mb-6 max-w-xs">
                    Speak naturally. Mention what you were trying to accomplish and where you got stuck.
                  </p>

                  <button
                    onClick={stopRecording}
                    className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 active:scale-98"
                  >
                    <Square className="w-4 h-4 fill-current" />
                    Done / Submit Feedback
                  </button>
                </>
              )}

              {recordingState === 'processing' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-indigo-950/40 border border-indigo-800/30 flex items-center justify-center mb-4">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <h4 className="text-base font-medium mb-1 text-white">Analyzing Speech Intelligence</h4>
                  <p className="text-xs text-neutral-400 max-w-xs leading-relaxed mb-4">
                    AssemblyAI is generating the transcript, detecting speaker turns, and indexing friction moments...
                  </p>
                  <div className="w-full bg-neutral-900 rounded-lg p-3 text-left border border-neutral-800 text-xs font-mono space-y-1.5 text-neutral-400">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                      1. Uploading raw audio buffer...
                    </div>
                    <div className="flex items-center gap-2 text-indigo-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                      2. Speech-to-Text & Diarization...
                    </div>
                    <div className="flex items-center gap-2 text-neutral-500">
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-600"></span>
                      3. Sentiment analysis & friction alert extraction...
                    </div>
                  </div>
                </>
              )}

              {recordingState === 'done' && analysisResult && (
                <>
                  <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-800/30 flex items-center justify-center mb-4 text-emerald-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-medium mb-1 text-white">Feedback Indexed!</h4>
                  <p className="text-xs text-neutral-400 mb-4 max-w-xs">
                    Your qualitative feedback was analyzed and indexed for the product team.
                  </p>

                  <div className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-left mb-6 text-xs">
                    <div className="text-neutral-400 font-semibold mb-1 uppercase tracking-wider text-[10px]">
                      AssemblyAI Summary:
                    </div>
                    <div className="text-neutral-200 line-clamp-3 leading-relaxed">
                      {analysisResult.summary}
                    </div>
                  </div>

                  <div className="w-full flex gap-2">
                    <button
                      onClick={() => {
                        resetModal();
                        router.push('/dashboard');
                      }}
                      className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>View in Dashboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={resetModal}
                      className="py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-xl text-xs font-medium transition-all border border-neutral-800"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}

              {recordingState === 'error' && (
                <>
                  <div className="w-16 h-16 rounded-full bg-red-950/50 border border-red-800/30 flex items-center justify-center mb-4 text-red-400">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-medium mb-1 text-white">Something Went Wrong</h4>
                  <p className="text-xs text-red-400 max-w-xs mb-6">
                    {errorMessage || 'Failed to capture or process audio.'}
                  </p>
                  <button
                    onClick={() => setRecordingState('idle')}
                    className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 rounded-xl text-xs font-medium border border-neutral-800 transition-all"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-neutral-900 flex items-center justify-between text-[11px] text-neutral-500">
              <span className="flex items-center gap-1">
                <Volume2 className="w-3 h-3 text-indigo-400" />
                90s Mom-Test Audio
              </span>
              <span>AssemblyAI Hackathon 2026</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
