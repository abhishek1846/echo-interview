import Link from 'next/link';
import { ArrowRight, BookOpen, Usb, ShieldCheck, Sparkles, LayoutDashboard } from 'lucide-react';
import EchoWidget from '@/components/EchoWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Hackathon Demo Notice Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-neutral-900 to-indigo-950/80 border-b border-indigo-900/40 px-4 py-2.5 text-xs text-neutral-300 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse"></span>
          <span>
            <strong>EchoInterview Live Demo:</strong> Test the autonomous 90s voice interviewer via the floating widget in the bottom-right.
          </span>
        </div>
        <Link
          href="/dashboard"
          className="hidden sm:flex items-center gap-1.5 font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          <span>Open Founder Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="border-b border-neutral-900 px-6 py-4 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight text-white">Gatsby</span>
          <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full border border-neutral-700">
            Host App Demo
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 px-3.5 py-2 rounded-xl border border-neutral-800 transition-all hover:border-neutral-700"
          >
            <LayoutDashboard className="w-3.5 h-3.5 text-indigo-400" />
            <span>Founder Dashboard</span>
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-800/40 text-indigo-300 text-xs font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>AssemblyAI Speech Intelligence Showcase</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-2xl leading-[1.1] mb-6">
          The modern e-reader library for macOS.
        </h1>

        <p className="text-base sm:text-lg text-neutral-400 max-w-xl mb-10 leading-relaxed">
          Gatsby is a lightweight, 100% offline companion for Kindle and Kobo. Fast book management with zero telemetry and automatic APNX page numbering.
        </p>

        {/* Feature Cards Grid (Representing the Host App) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left mb-16">
          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm mb-1 text-white">100% Offline & Private</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Never connects to the cloud. Your books, metadata, and reading history stay exclusively on your local machine.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <Usb className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm mb-1 text-white">Kindle & Kobo USB Sync</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Auto-detects plugged-in devices, embeds real covers, and injects custom APNX page numbers directly to Kindle.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-neutral-900/40 border border-neutral-800/80">
            <div className="p-2 w-fit rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-3">
              <BookOpen className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm mb-1 text-white">Clean Native UI</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Built with Tauri and React. No 500MB Chromium runtimes or legacy menus. Just fast, fluid table sorting and tags.
            </p>
          </div>
        </div>

        {/* Callout Box Explaining EchoInterview */}
        <div className="w-full bg-gradient-to-b from-neutral-900/70 to-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 text-left">
          <div className="flex items-center gap-2.5 mb-3 text-indigo-400">
            <Sparkles className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-wider">How This Hackathon Demo Works</h3>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed mb-4">
            Instead of generic surveys or 30-minute user calls, EchoInterview allows users to click the floating button in the bottom right corner to give a <strong>90-second voice walkthrough</strong> of their experience.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
              <span className="font-semibold text-white block mb-1">1. Speak Naturally</span>
              <span className="text-neutral-400">Talk about what you tried to do and any snags you hit.</span>
            </div>
            <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
              <span className="font-semibold text-white block mb-1">2. AssemblyAI Processing</span>
              <span className="text-neutral-400">Generates speech-to-text, diarization, and sentence sentiment.</span>
            </div>
            <div className="p-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
              <span className="font-semibold text-white block mb-1">3. Mom-Test Insights</span>
              <span className="text-neutral-400">Extracts user workarounds and friction alerts to the dashboard.</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-900 px-6 py-6 text-center text-xs text-neutral-500">
        <p>Built for AssemblyAI Voice Hackathon Week 2026 • Powered by AssemblyAI Speech Intelligence</p>
      </footer>

      {/* Floating Echo Widget */}
      <EchoWidget productName="Gatsby Desktop" />
    </div>
  );
}
