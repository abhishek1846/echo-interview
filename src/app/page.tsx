'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, ShieldCheck, Truck, Headphones, Sliders, Volume2, Check } from 'lucide-react';
import EchoWidget from '@/components/EchoWidget';

export default function Home() {
  const [selectedColor, setSelectedColor] = useState<'black' | 'aluminum' | 'sand'>('black');
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Brand Navigation */}
      <nav className="border-b border-zinc-850 bg-zinc-950/80 backdrop-blur-md px-6 py-4 sticky top-0 z-40">
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-950 flex items-center justify-center font-mono font-bold text-xs tracking-tighter">
              K
            </div>
            <span className="font-mono text-xs font-semibold tracking-widest uppercase text-white">
              KROMA // ACOUSTICS
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6 font-mono text-xs text-zinc-400">
            <span className="text-white cursor-pointer">HEADPHONES</span>
            <span className="hover:text-white cursor-pointer transition-colors">MONITORS</span>
            <span className="hover:text-white cursor-pointer transition-colors">DACS & AMPS</span>
            <span className="hover:text-white cursor-pointer transition-colors">ACCESSORIES</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-200 px-3 py-1.5 rounded-lg border border-zinc-800 transition-colors text-xs font-mono"
            >
              <span>TELEMETRY_DASHBOARD</span>
              <ArrowRight className="w-3 h-3 text-zinc-400" />
            </Link>

            <button className="relative p-2 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 border border-zinc-800 transition-colors">
              <ShoppingBag className="w-3.5 h-3.5" />
              {addedToCart && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Showcase: Model-1 Headphones */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 flex flex-col gap-16">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Product Visuals */}
          <div className="lg:col-span-7 bg-zinc-900/30 border border-zinc-850 rounded-2xl p-8 sm:p-12 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute top-4 left-4 font-mono text-[10px] text-zinc-500 uppercase tracking-widest">
              SERIES_01 // PLANAR_MAGNETIC
            </div>

            {/* Stylized Minimalist Product Render */}
            <div className="w-64 h-64 sm:w-80 sm:h-80 relative flex items-center justify-center my-6">
              <div className="absolute inset-0 rounded-full border border-dashed border-zinc-800 animate-spin-slow"></div>
              <div className="w-56 h-56 rounded-full bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 flex items-center justify-center shadow-2xl">
                <Headphones className="w-28 h-28 text-zinc-300 stroke-[1.2] transition-transform duration-500 group-hover:scale-105" />
              </div>
            </div>

            {/* Hardware Telemetry Spec Bar */}
            <div className="grid grid-cols-3 gap-4 w-full border-t border-zinc-850 pt-4 mt-2 font-mono text-center text-xs">
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Driver</span>
                <span className="text-zinc-200">50mm Planar</span>
              </div>
              <div className="border-x border-zinc-850">
                <span className="text-[10px] text-zinc-500 block uppercase">Response</span>
                <span className="text-zinc-200">5Hz - 45kHz</span>
              </div>
              <div>
                <span className="text-[10px] text-zinc-500 block uppercase">Weight</span>
                <span className="text-zinc-200">312g CNC Alum</span>
              </div>
            </div>
          </div>

          {/* Right Column: Purchasing & Customizer */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                IN_STOCK // SHIPS_TODAY
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                Kroma Model-1
              </h1>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Precision open-back planar headphones designed for critical mixing and reference listening. CNC machined aerospace aluminum with magnetic lambskin cushions.
              </p>
            </div>

            <div className="flex items-baseline gap-3 pb-4 border-b border-zinc-850">
              <span className="font-mono text-3xl font-medium text-white">$289</span>
              <span className="text-xs text-zinc-500 line-through">$349</span>
              <span className="font-mono text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
                SAVE $60
              </span>
            </div>

            {/* Finish Selector */}
            <div>
              <div className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider mb-2.5">
                Chassis Finish: <span className="text-white capitalize">{selectedColor}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedColor('black')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-mono transition-all ${
                    selectedColor === 'black'
                      ? 'border-white bg-zinc-900 text-white'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  Matte Black
                </button>
                <button
                  onClick={() => setSelectedColor('aluminum')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-mono transition-all ${
                    selectedColor === 'aluminum'
                      ? 'border-white bg-zinc-900 text-white'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  Raw Aluminum
                </button>
                <button
                  onClick={() => setSelectedColor('sand')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-mono transition-all ${
                    selectedColor === 'sand'
                      ? 'border-white bg-zinc-900 text-white'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  Sand Dunes
                </button>
              </div>
            </div>

            {/* Purchasing Action */}
            <div className="flex flex-col gap-2.5">
              <button
                onClick={handleAddToCart}
                className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-zinc-950 font-medium rounded-xl text-xs transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag — $289</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-zinc-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3 h-3 text-zinc-400" />
                  <span>Free Worldwide Shipping</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-zinc-400" />
                  <span>30-Day In-Home Trial</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Catalog Section: Complementary Audio Hardware */}
        <section className="border-t border-zinc-850 pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-mono text-xs uppercase tracking-wider text-zinc-300">
              STUDIO_COMPONENTS // HARDWARE_ECOSYSTEM
            </h2>
            <span className="font-mono text-[10px] text-zinc-500">3 ITEMS LISTED</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="p-2 w-fit rounded bg-zinc-900 text-zinc-300 border border-zinc-800 mb-3">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-white mb-1">Kroma DAC-Mini</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  32-bit / 384kHz balanced portable amplifier with ES9038Q2M chip. Drives high-impedance loads with zero floor noise.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-zinc-850 font-mono text-xs">
                <span className="text-white">$149</span>
                <span className="text-zinc-500 text-[10px]">USB-C LOSSLESS</span>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="p-2 w-fit rounded bg-zinc-900 text-zinc-300 border border-zinc-850 mb-3">
                  <Volume2 className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-white mb-1">Magnetic Lambskin Cushions</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Perforated memory foam cushions wrapped in full-grain Italian lambskin. Magnetic snap-lock for instant replacement.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-zinc-850 font-mono text-xs">
                <span className="text-white">$38</span>
                <span className="text-zinc-500 text-[10px]">PAIR // MODULAR</span>
              </div>
            </div>

            <div className="bg-zinc-900/30 border border-zinc-850 rounded-xl p-5 flex flex-col justify-between">
              <div>
                <div className="p-2 w-fit rounded bg-zinc-900 text-zinc-300 border border-zinc-850 mb-3">
                  <Headphones className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-sm text-white mb-1">Anodized Desk Mount</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                  Solid 450g weighted aluminum stand with silicone base pad to prevent desk scratches and preserve headband shape.
                </p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-zinc-850 font-mono text-xs">
                <span className="text-white">$65</span>
                <span className="text-zinc-500 text-[10px]">ALUMINUM CNC</span>
              </div>
            </div>
          </div>
        </section>

        {/* Consumer Research Callout Bar */}
        <section className="bg-zinc-900/20 border border-zinc-850 rounded-2xl p-6 font-mono text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="max-w-xl">
            <span className="text-zinc-500 uppercase text-[10px] tracking-wider block mb-1">
              Live AssemblyAI Integration Showcase
            </span>
            <p className="text-zinc-300 leading-relaxed">
              Consumer brands lose customers to unspoken checkout doubts (customs, cable lengths, macOS setup). Echo gives shoppers an effortless 90-second voice channel to voice hesitation.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="shrink-0 flex items-center gap-1.5 bg-white text-zinc-950 font-medium px-4 py-2 rounded-xl text-xs hover:bg-zinc-200 transition-colors"
          >
            <span>View Discovered Friction</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </section>
      </main>

      {/* Modern Minimal Footer */}
      <footer className="border-t border-zinc-850 px-6 py-6 text-center font-mono text-[10px] text-zinc-500">
        KROMA ACOUSTICS // POWERED BY ASSEMBLYAI SPEECH INTELLIGENCE & THE MOM TEST
      </footer>

      {/* Floating Consumer Feedback Widget */}
      <EchoWidget productName="Kroma Audio" />
    </div>
  );
}
