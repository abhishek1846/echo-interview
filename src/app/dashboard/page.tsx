'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  ExternalLink,
  Clock, 
  AlertCircle,
  Wrench,
  Terminal,
  Activity,
  Layers
} from 'lucide-react';
import { InterviewRecord } from '@/lib/types';

export default function DashboardPage() {
  const [interviews, setInterviews] = useState<InterviewRecord[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<InterviewRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/interviews')
      .then((res) => res.json())
      .then((data: InterviewRecord[]) => {
        setInterviews(data);
        if (data.length > 0) {
          setSelectedInterview(data[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load interviews:', err);
        setLoading(false);
      });
  }, []);

  const totalInterviews = interviews.length;
  const totalFrictions = interviews.reduce(
    (acc, cur) => acc + (cur.mom_test?.friction_points?.length || 0),
    0
  );
  const totalWorkarounds = interviews.reduce(
    (acc, cur) => acc + (cur.mom_test?.user_workarounds?.length || 0),
    0
  );
  const frustratedCount = interviews.filter(
    (i) => i.mom_test?.sentiment_summary?.overall === 'Frustrated'
  ).length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Technical Navbar */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview</span>
          </Link>
          <span className="text-zinc-700">/</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h1 className="font-mono text-xs uppercase tracking-wider text-zinc-200">
              ECHO // DISCOVERY_LOG
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-zinc-500 border border-zinc-800 px-2 py-0.5 rounded">
            ASSEMBLYAI_INTELLIGENCE
          </span>
          <Link
            href="https://github.com/abhishek1846/echo-interview"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-850 px-2.5 py-1 rounded-md border border-zinc-800 transition-colors"
          >
            <span className="font-mono text-[11px]">REPO</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* Metric Cards Grid - Cartesia / Linear telemetry style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
              <span>01 // SESSIONS</span>
              <Activity className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-2xl font-mono font-medium tracking-tight text-white">{totalInterviews}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Recorded qualitative runs</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
              <span>02 // FRICTIONS</span>
              <AlertCircle className="w-3.5 h-3.5 text-amber-400/80" />
            </div>
            <div className="text-2xl font-mono font-medium tracking-tight text-amber-400">{totalFrictions}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Negative sentiment spikes</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
              <span>03 // WORKAROUNDS</span>
              <Wrench className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <div className="text-2xl font-mono font-medium tracking-tight text-zinc-200">{totalWorkarounds}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Unprompted user hacks</div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-850 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
              <span>04 // FRUSTRATION</span>
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            </div>
            <div className="text-2xl font-mono font-medium tracking-tight text-rose-400">{frustratedCount}</div>
            <div className="text-[11px] text-zinc-500 mt-1">High-priority churn signals</div>
          </div>
        </div>

        {/* Master-Detail Layout */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12 text-zinc-500 font-mono text-xs">
            FETCHING_TELEMETRY...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
            {/* Left Column: Data Grid (5 cols) */}
            <div className="lg:col-span-5 bg-zinc-900/30 border border-zinc-850 rounded-xl overflow-hidden flex flex-col">
              <div className="p-3 border-b border-zinc-850 bg-zinc-900/60 flex items-center justify-between font-mono text-[11px]">
                <span className="text-zinc-400">RECORDED_SESSIONS ({interviews.length})</span>
                <span className="text-zinc-500">SORT: DESC</span>
              </div>
              <div className="divide-y divide-zinc-850/60 max-h-[640px] overflow-y-auto">
                {interviews.map((item) => {
                  const isSelected = selectedInterview?.id === item.id;
                  const overall = item.mom_test?.sentiment_summary?.overall || 'Neutral';
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInterview(item)}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-zinc-850/70 border-l-2 border-white'
                          : 'hover:bg-zinc-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-medium text-zinc-200 tracking-tight">
                          {item.id}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                            overall === 'Frustrated'
                              ? 'bg-rose-950/40 text-rose-300 border-rose-800/40'
                              : overall === 'Positive'
                              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40'
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                          }`}
                        >
                          {overall.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-2 font-normal">
                        {item.transcript_text}
                      </p>

                      <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          {item.duration_seconds}s
                        </span>
                        <span>•</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-amber-400/90">
                          {item.mom_test?.friction_points?.length || 0} friction
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Inspector Panel (7 cols) */}
            {selectedInterview && (
              <div className="lg:col-span-7 bg-zinc-900/30 border border-zinc-850 rounded-xl p-5 flex flex-col gap-5">
                {/* Header */}
                <div className="flex items-start justify-between pb-3.5 border-b border-zinc-850">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold text-white">
                        {selectedInterview.product_name}
                      </span>
                      <span className="font-mono text-xs text-zinc-500">[{selectedInterview.id}]</span>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-400">
                      INDEXED // {new Date(selectedInterview.created_at).toLocaleString()} • DURATION: {selectedInterview.duration_seconds}s
                    </div>
                  </div>
                </div>

                {/* AssemblyAI Executive Summary */}
                <div className="bg-zinc-900/60 border border-zinc-850 rounded-lg p-3.5">
                  <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                    <Terminal className="w-3 h-3" />
                    <span>AssemblyAI Speech Intelligence Summary</span>
                  </div>
                  <div className="text-xs text-zinc-300 whitespace-pre-line leading-relaxed">
                    {selectedInterview.summary}
                  </div>
                </div>

                {/* Mom Test Qualitative Analysis: Friction & Workaround */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Friction Points */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-lg p-3.5">
                    <div className="flex items-center gap-1.5 text-rose-400 mb-2 font-mono text-[10px] uppercase tracking-wider">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Friction Moments</span>
                    </div>
                    <ul className="space-y-1.5">
                      {selectedInterview.mom_test?.friction_points?.map((fp, idx) => (
                        <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                          <span className="text-rose-400 font-mono mt-0.5">•</span>
                          <span>{fp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* User Workarounds */}
                  <div className="bg-zinc-900/40 border border-zinc-850 rounded-lg p-3.5">
                    <div className="flex items-center gap-1.5 text-zinc-300 mb-2 font-mono text-[10px] uppercase tracking-wider">
                      <Wrench className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Workaround Resorted</span>
                    </div>
                    <ul className="space-y-1.5">
                      {selectedInterview.mom_test?.user_workarounds?.map((w, idx) => (
                        <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2">
                          <span className="text-zinc-500 font-mono mt-0.5">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Quotes */}
                {selectedInterview.mom_test?.key_quotes && selectedInterview.mom_test.key_quotes.length > 0 && (
                  <div>
                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
                      Grounded Audio Quotes
                    </div>
                    <div className="space-y-1.5">
                      {selectedInterview.mom_test.key_quotes.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-zinc-900/50 border border-zinc-850 rounded-md flex items-start justify-between text-xs"
                        >
                          <span className="text-zinc-300 font-normal">&ldquo;{q.quote}&rdquo;</span>
                          <span className="font-mono text-[10px] text-zinc-500 ml-3 shrink-0 bg-zinc-850 px-1.5 py-0.5 rounded">
                            {q.timestamp}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Entities Detected */}
                {selectedInterview.entities && selectedInterview.entities.length > 0 && (
                  <div>
                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Layers className="w-3 h-3" />
                      <span>Entities & Concepts Detected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInterview.entities.map((e, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded"
                        >
                          {e.text} <span className="text-zinc-500">[{e.entity_type}]</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Transcript */}
                <div>
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2">
                    Diarized Transcript Feed
                  </div>
                  <div className="bg-zinc-950 border border-zinc-850 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 font-mono text-[11px] text-zinc-300 leading-relaxed">
                    {selectedInterview.utterances && selectedInterview.utterances.length > 0 ? (
                      selectedInterview.utterances.map((u, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-zinc-500 shrink-0">
                            [{u.speaker} {(u.start / 1000).toFixed(1)}s]:
                          </span>
                          <span className="text-zinc-300">{u.text}</span>
                        </div>
                      ))
                    ) : (
                      <p>{selectedInterview.transcript_text}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
