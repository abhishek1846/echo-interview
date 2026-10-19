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
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col font-sans">
      {/* Top Technical Navbar */}
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </Link>
          <span className="text-zinc-300">/</span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <h1 className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-900">
              ECHO // DISCOVERY_LOG
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-zinc-600 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded">
            ASSEMBLYAI_INTELLIGENCE
          </span>
          <Link
            href="https://github.com/abhishek1846/echo-interview"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-2.5 py-1 rounded-md border border-zinc-200 transition-colors"
          >
            <span className="font-mono text-[11px]">REPO</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-2">
              <span>01 // SESSIONS</span>
              <Activity className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="text-2xl font-mono font-semibold tracking-tight text-zinc-950">{totalInterviews}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Recorded qualitative runs</div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-2">
              <span>02 // FRICTIONS</span>
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            </div>
            <div className="text-2xl font-mono font-semibold tracking-tight text-amber-600">{totalFrictions}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Negative sentiment spikes</div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-2">
              <span>03 // WORKAROUNDS</span>
              <Wrench className="w-3.5 h-3.5 text-zinc-500" />
            </div>
            <div className="text-2xl font-mono font-semibold tracking-tight text-zinc-900">{totalWorkarounds}</div>
            <div className="text-[11px] text-zinc-500 mt-1">Unprompted shopper hacks</div>
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-2">
              <span>04 // FRUSTRATION</span>
              <div className="w-2 h-2 rounded-full bg-rose-500"></div>
            </div>
            <div className="text-2xl font-mono font-semibold tracking-tight text-rose-600">{frustratedCount}</div>
            <div className="text-[11px] text-zinc-500 mt-1">High-priority churn signals</div>
          </div>
        </div>

        {/* Master-Detail Layout */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12 text-zinc-400 font-mono text-xs">
            FETCHING_TELEMETRY...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 items-start">
            {/* Left Column: Data Grid (5 cols) */}
            <div className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-3 border-b border-zinc-150 bg-zinc-50 flex items-center justify-between font-mono text-[11px]">
                <span className="text-zinc-600 font-medium">RECORDED_SESSIONS ({interviews.length})</span>
                <span className="text-zinc-400">SORT: DESC</span>
              </div>
              <div className="divide-y divide-zinc-150 max-h-[640px] overflow-y-auto">
                {interviews.map((item) => {
                  const isSelected = selectedInterview?.id === item.id;
                  const overall = item.mom_test?.sentiment_summary?.overall || 'Neutral';
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInterview(item)}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-zinc-100 border-l-2 border-zinc-950'
                          : 'hover:bg-zinc-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs font-semibold text-zinc-900 tracking-tight">
                          {item.id}
                        </span>
                        <span
                          className={`font-mono text-[10px] px-2 py-0.5 rounded border ${
                            overall === 'Frustrated'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : overall === 'Positive'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                          }`}
                        >
                          {overall.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed mb-2 font-normal">
                        {item.transcript_text}
                      </p>

                      <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-400" />
                          {item.duration_seconds}s
                        </span>
                        <span>•</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-amber-600 font-medium">
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
              <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-xl p-5 flex flex-col gap-5 shadow-sm">
                {/* Header */}
                <div className="flex items-start justify-between pb-3.5 border-b border-zinc-150">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-sm font-semibold text-zinc-950">
                        {selectedInterview.product_name}
                      </span>
                      <span className="font-mono text-xs text-zinc-400">[{selectedInterview.id}]</span>
                    </div>
                    <div className="font-mono text-[11px] text-zinc-500">
                      INDEXED // {new Date(selectedInterview.created_at).toLocaleString()} • DURATION: {selectedInterview.duration_seconds}s
                    </div>
                  </div>
                </div>

                {/* AssemblyAI Executive Summary */}
                <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5">
                  <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">
                    <Terminal className="w-3 h-3 text-zinc-600" />
                    <span>AssemblyAI Speech Intelligence Summary</span>
                  </div>
                  <div className="text-xs text-zinc-700 whitespace-pre-line leading-relaxed">
                    {selectedInterview.summary}
                  </div>
                </div>

                {/* Mom Test Qualitative Analysis: Friction & Workaround */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Friction Points */}
                  <div className="bg-rose-50/50 border border-rose-200/80 rounded-lg p-3.5">
                    <div className="flex items-center gap-1.5 text-rose-700 mb-2 font-mono text-[10px] uppercase tracking-wider font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Friction Moments</span>
                    </div>
                    <ul className="space-y-1.5">
                      {selectedInterview.mom_test?.friction_points?.map((fp, idx) => (
                        <li key={idx} className="text-xs text-zinc-800 flex items-start gap-2">
                          <span className="text-rose-600 font-mono mt-0.5">•</span>
                          <span>{fp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* User Workarounds */}
                  <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5">
                    <div className="flex items-center gap-1.5 text-zinc-800 mb-2 font-mono text-[10px] uppercase tracking-wider font-semibold">
                      <Wrench className="w-3.5 h-3.5 text-zinc-600" />
                      <span>Workaround Resorted</span>
                    </div>
                    <ul className="space-y-1.5">
                      {selectedInterview.mom_test?.user_workarounds?.map((w, idx) => (
                        <li key={idx} className="text-xs text-zinc-800 flex items-start gap-2">
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
                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2 font-semibold">
                      Grounded Audio Quotes
                    </div>
                    <div className="space-y-1.5">
                      {selectedInterview.mom_test.key_quotes.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-md flex items-start justify-between text-xs"
                        >
                          <span className="text-zinc-800 font-normal">&ldquo;{q.quote}&rdquo;</span>
                          <span className="font-mono text-[10px] text-zinc-500 ml-3 shrink-0 bg-white border border-zinc-200 px-1.5 py-0.5 rounded">
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
                    <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5 font-semibold">
                      <Layers className="w-3 h-3 text-zinc-500" />
                      <span>Entities & Concepts Detected</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInterview.entities.map((e, idx) => (
                        <span
                          key={idx}
                          className="font-mono text-[10px] bg-zinc-100 border border-zinc-200 text-zinc-700 px-2 py-0.5 rounded"
                        >
                          {e.text} <span className="text-zinc-400">[{e.entity_type}]</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Transcript */}
                <div>
                  <div className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider mb-2 font-semibold">
                    Diarized Transcript Feed
                  </div>
                  <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 max-h-48 overflow-y-auto space-y-2 font-mono text-[11px] text-zinc-800 leading-relaxed">
                    {selectedInterview.utterances && selectedInterview.utterances.length > 0 ? (
                      selectedInterview.utterances.map((u, idx) => (
                        <div key={idx} className="flex gap-2">
                          <span className="text-zinc-400 shrink-0 font-medium">
                            [{u.speaker} {(u.start / 1000).toFixed(1)}s]:
                          </span>
                          <span className="text-zinc-800">{u.text}</span>
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
