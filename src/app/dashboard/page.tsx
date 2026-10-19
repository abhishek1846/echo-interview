'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Users, 
  AlertTriangle, 
  Wrench, 
  ArrowLeft, 
  Play, 
  Tag, 
  Sparkles, 
  Clock, 
  ExternalLink,
  Quote
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

  // Aggregated Stats
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md px-6 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Demo</span>
          </Link>
          <div className="h-4 w-px bg-neutral-800 mx-1"></div>
          <div className="flex items-center gap-2">
            <div className="p-1 bg-indigo-500/10 rounded border border-indigo-500/20 text-indigo-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h1 className="font-semibold text-sm tracking-tight text-white">EchoInterview Dashboard</h1>
            <span className="text-[11px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-700">
              AssemblyAI Speech Intelligence
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="https://github.com/abhishek1846/echo-interview"
            target="_blank"
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 rounded-lg border border-neutral-800 transition-colors"
          >
            <span>GitHub</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto flex flex-col gap-6">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Total Voice Interviews</span>
              <Users className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-white">{totalInterviews}</div>
            <div className="text-[11px] text-neutral-500 mt-1">90s autonomous user sessions</div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Friction Alerts Flagged</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-amber-400">{totalFrictions}</div>
            <div className="text-[11px] text-neutral-500 mt-1">Negative sentiment moments</div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>User Workarounds Discovered</span>
              <Wrench className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-2xl font-bold tracking-tight text-indigo-300">{totalWorkarounds}</div>
            <div className="text-[11px] text-neutral-500 mt-1">Hacks used when app failed</div>
          </div>

          <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between text-neutral-400 text-xs mb-2">
              <span>Frustrated Sessions</span>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-red-400">{frustratedCount}</div>
            <div className="text-[11px] text-neutral-500 mt-1">High-priority churn signals</div>
          </div>
        </div>

        {/* Master-Detail Split Pane */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center p-12 text-neutral-500 text-sm">
            Loading interviews from AssemblyAI database...
          </div>
        ) : interviews.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 border border-dashed border-neutral-800 rounded-2xl text-center">
            <Users className="w-10 h-10 text-neutral-600 mb-3" />
            <h3 className="font-semibold text-base mb-1">No interviews recorded yet</h3>
            <p className="text-xs text-neutral-400 max-w-sm mb-4">
              Return to the demo page and click the floating widget to record your first 90-second interview.
            </p>
            <Link
              href="/"
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
            >
              Go to Demo & Record
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-start">
            {/* Left Column: Interview List (5 cols) */}
            <div className="lg:col-span-5 bg-neutral-900/30 border border-neutral-800/80 rounded-2xl overflow-hidden flex flex-col">
              <div className="p-3.5 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between text-xs font-medium">
                <span className="text-neutral-400">Interview Sessions ({interviews.length})</span>
                <span className="text-[11px] text-neutral-500">Ordered by date</span>
              </div>
              <div className="divide-y divide-neutral-800/60 max-h-[650px] overflow-y-auto">
                {interviews.map((item) => {
                  const isSelected = selectedInterview?.id === item.id;
                  const overall = item.mom_test?.sentiment_summary?.overall || 'Neutral';
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedInterview(item)}
                      className={`p-4 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-neutral-800/70 border-l-2 border-indigo-500'
                          : 'hover:bg-neutral-900/60'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-semibold text-xs text-neutral-200">{item.product_name}</span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                              overall === 'Frustrated'
                                ? 'bg-red-950/60 text-red-300 border-red-800/40'
                                : overall === 'Positive'
                                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                            }`}
                          >
                            {overall}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed mb-2">
                        {item.transcript_text}
                      </p>

                      <div className="flex items-center gap-3 text-[11px] text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.duration_seconds}s
                        </span>
                        <span>•</span>
                        <span>{new Date(item.created_at).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="text-amber-400/90 font-mono">
                          {item.mom_test?.friction_points?.length || 0} friction
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Detail Inspector (7 cols) */}
            {selectedInterview && (
              <div className="lg:col-span-7 bg-neutral-900/30 border border-neutral-800/80 rounded-2xl p-6 flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-start justify-between pb-4 border-b border-neutral-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-base font-bold text-white tracking-tight">
                        {selectedInterview.product_name} Feedback
                      </h2>
                      <span className="text-xs font-mono text-neutral-500">({selectedInterview.id})</span>
                    </div>
                    <p className="text-xs text-neutral-400">
                      Recorded on {new Date(selectedInterview.created_at).toLocaleString()} • Duration: {selectedInterview.duration_seconds}s
                    </p>
                  </div>
                </div>

                {/* AssemblyAI Executive Summary */}
                <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">
                      AssemblyAI Speech Intelligence Summary
                    </h3>
                  </div>
                  <div className="text-xs text-neutral-300 whitespace-pre-line leading-relaxed">
                    {selectedInterview.summary}
                  </div>
                </div>

                {/* Mom Test Qualitative Analysis: Friction & Workaround */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Friction Points */}
                  <div className="bg-red-950/20 border border-red-900/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-red-400 mb-2">
                      <AlertTriangle className="w-4 h-4" />
                      <h4 className="text-xs font-semibold uppercase tracking-wider">Points of Friction</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedInterview.mom_test?.friction_points?.map((fp, idx) => (
                        <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span>
                          <span>{fp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* User Workarounds */}
                  <div className="bg-indigo-950/20 border border-indigo-900/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-indigo-400 mb-2">
                      <Wrench className="w-4 h-4" />
                      <h4 className="text-xs font-semibold uppercase tracking-wider">Unprompted Workarounds</h4>
                    </div>
                    <ul className="space-y-2">
                      {selectedInterview.mom_test?.user_workarounds?.map((w, idx) => (
                        <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                          <span className="text-indigo-400 mt-0.5">•</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Friction Quotes */}
                {selectedInterview.mom_test?.key_quotes && selectedInterview.mom_test.key_quotes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-2">
                      <Quote className="w-3.5 h-3.5 text-indigo-400" />
                      Grounded Audio Quotes
                    </h4>
                    <div className="space-y-2">
                      {selectedInterview.mom_test.key_quotes.map((q, idx) => (
                        <div
                          key={idx}
                          className="p-3 bg-neutral-900/50 border border-neutral-800 rounded-lg flex items-start justify-between text-xs"
                        >
                          <span className="italic text-neutral-300">&ldquo;{q.quote}&rdquo;</span>
                          <span className="font-mono text-[10px] text-neutral-500 ml-4 shrink-0 bg-neutral-800 px-2 py-0.5 rounded">
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
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-2">
                      <Tag className="w-3.5 h-3.5 text-neutral-400" />
                      Entities & Products Mentioned
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInterview.entities.map((e, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-neutral-900 border border-neutral-800 text-neutral-300 px-2.5 py-1 rounded-md"
                        >
                          {e.text} <span className="text-[9px] text-neutral-500 font-mono">({e.entity_type})</span>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Full Transcript */}
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-3">
                    Full Diarized Transcript
                  </h4>
                  <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 max-h-56 overflow-y-auto space-y-3 font-mono text-xs text-neutral-300 leading-relaxed">
                    {selectedInterview.utterances && selectedInterview.utterances.length > 0 ? (
                      selectedInterview.utterances.map((u, idx) => (
                        <div key={idx} className="flex gap-3">
                          <span className="text-indigo-400 font-semibold shrink-0">
                            Speaker {u.speaker} [{(u.start / 1000).toFixed(1)}s]:
                          </span>
                          <span className="text-neutral-300">{u.text}</span>
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
