import Link from 'next/link';
import { BookOpen, Usb, ShieldCheck, ArrowRight } from 'lucide-react';
import EchoWidget from '@/components/EchoWidget';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Sleek Minimalist Top Navigation */}
      <nav className="border-b border-zinc-850 px-6 py-3.5 flex items-center justify-between max-w-6xl w-full mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-md bg-white text-zinc-950 flex items-center justify-center font-bold text-xs shadow-sm">
            G
          </div>
          <span className="font-semibold text-sm tracking-tight text-white">Gatsby</span>
          <span className="font-mono text-[10px] text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
            DEMO_SURFACE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-800 transition-colors text-xs font-medium"
          >
            <span>Founder Dashboard</span>
            <ArrowRight className="w-3 h-3 text-zinc-400" />
          </Link>
        </div>
      </nav>

      {/* Main Showcase */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>ECHO_INTERVIEW // EMBEDDED_WIDGET</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white max-w-2xl leading-[1.15] mb-5">
          The offline e-reader companion for macOS.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mb-12 leading-relaxed">
          Gatsby is a lightweight, local-first library manager for Kindle and Kobo. Fast book management with zero telemetry.
        </p>

        {/* Feature Cards Grid (Representing the Host Application) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left mb-14">
          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850">
            <ShieldCheck className="w-4 h-4 text-zinc-300 mb-2.5" />
            <h3 className="font-medium text-xs mb-1 text-zinc-200">100% Offline & Private</h3>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Never connects to the cloud. Your books and metadata stay on your local disk.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850">
            <Usb className="w-4 h-4 text-zinc-300 mb-2.5" />
            <h3 className="font-medium text-xs mb-1 text-zinc-200">Hardware USB Sync</h3>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Auto-detects connected Kindles and Kobos. Injects real covers and APNX page numbers.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-850">
            <BookOpen className="w-4 h-4 text-zinc-300 mb-2.5" />
            <h3 className="font-medium text-xs mb-1 text-zinc-200">Native Performance</h3>
            <p className="text-[11px] text-zinc-400 leading-normal">
              Built with Tauri and React. No 500MB Chromium runtimes or legacy bloat.
            </p>
          </div>
        </div>

        {/* Explanation Card */}
        <div className="w-full bg-zinc-900/20 border border-zinc-850 rounded-xl p-5 text-left font-mono">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-850 mb-3 text-[11px] text-zinc-400">
            <span>QUALITATIVE_DISCOVERY_PIPELINE</span>
            <span className="text-zinc-500">ASSEMBLYAI_CORE</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-zinc-500 block mb-0.5 text-[10px]">01 // CAPTURE</span>
              <span className="text-zinc-300 text-[11px]">User speaks 90s feedback in dock widget</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-0.5 text-[10px]">02 // INTELLIGENCE</span>
              <span className="text-zinc-300 text-[11px]">AssemblyAI diarization & sentiment spikes</span>
            </div>
            <div>
              <span className="text-zinc-500 block mb-0.5 text-[10px]">03 // EXTRACTION</span>
              <span className="text-zinc-300 text-[11px]">Mom-Test workarounds delivered to dashboard</span>
            </div>
          </div>
        </div>
      </main>

      {/* Understated Minimal Footer */}
      <footer className="border-t border-zinc-900 px-6 py-4 text-center font-mono text-[11px] text-zinc-600">
        ECHOINTERVIEW // POWERED BY ASSEMBLYAI SPEECH INTELLIGENCE
      </footer>

      {/* The Sleek Floating Voice Widget */}
      <EchoWidget productName="Gatsby Desktop" />
    </div>
  );
}
