import React, { useState, useEffect } from 'react';
import { ShieldCheck, Zap, Clock, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES_COUNT = 20;
const HERO_IMAGE_SRC = '/src/assets/images/hero_smart_meter_1793319056512.jpg';

export const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slides every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES_COUNT);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const slides = Array.from({ length: SLIDES_COUNT }).map((_, idx) => ({
    id: idx + 1,
    src: HERO_IMAGE_SRC,
  }));

  return (
    <div className="bg-gradient-to-br from-[#0c1833] via-[#0f2147] to-[#0a152b] text-white rounded-2xl overflow-hidden mb-8 border border-orange-500/30 shadow-xl shadow-black/30">
      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
        {/* Left Column: Headline and Value Proposition */}
        <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-orange-400 mb-3 tracking-wide px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
              <Zap className="w-4 h-4 fill-orange-400 text-orange-400" />
              <span>OFFICIAL NIGERIAN UTILITY VENDING NETWORK</span>
              <span className="text-orange-500" aria-hidden="true">·</span>
              <span className="text-slate-300 font-normal">STS-Certified IEC 62055-41</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-4 leading-tight" style={{ textWrap: 'balance' }}>
              Instant Electricity Tokens for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-300 to-orange-500">All Nigerian DISCOs</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 mb-6 leading-relaxed max-w-xl">
              Buy prepaid electricity tokens or settle postpaid bills instantly with CaseBox Utility. Real-time meter validation, instant 20-digit STS token generation, and seamless checkout via Card, Bank Transfer, or USSD.
            </p>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-200">
              <Clock className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Instant Token &lt; 3s</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>NERC &amp; STS Certified</span>
            </div>
            <div className="flex items-center gap-2 text-slate-200">
              <CreditCard className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Card / Transfer / USSD</span>
            </div>
          </div>
        </div>

        {/* Right Column: 20-Slide Smart Meter Image Slider */}
        <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full bg-slate-950 overflow-hidden group select-none">
          {/* Slider Slides Container */}
          <div className="relative w-full h-full min-h-[260px] lg:min-h-full overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <a
                  href="/"
                  className="block w-full h-full relative cursor-pointer"
                  title={`CaseBox Utility Homepage - Slide ${slide.id} of ${SLIDES_COUNT}`}
                  aria-label={`Prepaid Smart Meter Slide ${slide.id} of ${SLIDES_COUNT} - Return to Homepage`}
                >
                  <img
                    src={slide.src}
                    alt={`Digital prepaid electricity smart meter with keypad - Slide ${slide.id} of 20`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Subtle gradient scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a152b] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0f2147] lg:via-transparent lg:to-transparent" />
                </a>
              </div>
            ))}
          </div>

          {/* Slide Counter Badge */}
          <div className="absolute top-3 right-3 z-20 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-full border border-orange-500/40 text-[10px] font-mono text-orange-300 font-bold flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span>Slide {currentSlide + 1} / {SLIDES_COUNT}</span>
          </div>

          {/* Previous / Next Slide Arrows */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentSlide((prev) => (prev === 0 ? SLIDES_COUNT - 1 : prev - 1));
            }}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-orange-500 text-white hover:text-slate-950 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/10 hover:border-orange-400 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setCurrentSlide((prev) => (prev === SLIDES_COUNT - 1 ? 0 : prev + 1));
            }}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-orange-500 text-white hover:text-slate-950 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 border border-white/10 hover:border-orange-400 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Overlay Tag */}
          <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:bottom-6 z-20 bg-[#091122]/90 backdrop-blur-md p-3.5 rounded-xl border border-orange-500/30 flex items-center justify-between text-xs shadow-lg pointer-events-none">
            <div>
              <span className="text-[11px] text-orange-200/70 block">Active Grid Coverage</span>
              <span className="font-semibold text-white">All 11 Discos: IKEDC, EKEDC, AEDC + 8 more</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-orange-200/70 block">Standard Protocol</span>
              <span className="font-mono text-emerald-400 font-bold">STS Certified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Verified Utility Capabilities Ribbon */}
      <div className="bg-[#070e1c] px-6 py-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="font-semibold text-white">Direct DISCO Gateway</span>
          <span className="text-slate-400">Official Settlement</span>
        </div>
        <div className="hidden sm:inline text-orange-500/40" aria-hidden="true">·</div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="font-semibold text-white">20-Digit STS Tokens</span>
          <span className="text-slate-400">Prepaid &amp; Postpaid</span>
        </div>
        <div className="hidden sm:inline text-orange-500/40" aria-hidden="true">·</div>
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="font-semibold text-white">Multiple Payment Channels</span>
          <span className="text-slate-400">Card, Transfer &amp; USSD</span>
        </div>
        <div className="hidden sm:inline text-orange-500/40" aria-hidden="true">·</div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold text-white">24/7 Availability</span>
          <span className="text-slate-400">Real-Time Vending</span>
        </div>
      </div>
    </div>
  );
};
