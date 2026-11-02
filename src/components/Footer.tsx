import React from 'react';
import { Zap, ShieldCheck, Phone } from 'lucide-react';
import { NIGERIAN_DISCOS } from '../data/discos';

interface FooterProps {
  onSelectDisco?: (discoCode: string) => void;
  onOpenAdmin?: () => void;
  onOpenDashboard?: () => void;
  onSelectTab?: (tab: 'vend' | 'lookup' | 'saved' | 'tariff' | 'dashboard' | 'maps') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectDisco, onOpenAdmin, onOpenDashboard, onSelectTab }) => {
  return (
    <footer className="bg-[#091122] text-slate-300 text-xs border-t border-orange-500/20 mt-20 print:hidden relative">
      {/* Decorative orange border strip */}
      <div className="h-0.5 bg-gradient-to-r from-orange-600 via-amber-500 to-orange-400" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-orange-500/20">
                <Zap className="w-4 h-4 fill-slate-950 text-slate-950" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                CaseBox<span className="text-orange-400">Utility</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Simple tools for verifying CIE &amp; DISCO meters, purchasing electricity tokens, and staying ahead of the next recharge.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-orange-300/80 pt-2 font-medium">
              <ShieldCheck className="w-4 h-4 text-orange-400 shrink-0" />
              <span>Standard Transfer Specification (STS) IEC 62055-41 Certified</span>
            </div>
          </div>

          {/* Quick Services Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Services</span>
            </h4>
            <div className="flex flex-col gap-1.5 text-[11px]">
              <button
                onClick={() => onSelectTab && onSelectTab('vend')}
                className="text-left text-slate-400 hover:text-orange-400 transition-colors py-0.5 cursor-pointer"
              >
                Meter verification
              </button>
              <button
                onClick={() => onSelectTab && onSelectTab('vend')}
                className="text-left text-slate-400 hover:text-orange-400 transition-colors py-0.5 cursor-pointer"
              >
                Token purchase
              </button>
              <button
                onClick={() => onOpenDashboard && onOpenDashboard()}
                className="text-left text-slate-400 hover:text-orange-400 transition-colors py-0.5 cursor-pointer"
              >
                Token alert &amp; reminders
              </button>
              <button
                onClick={() => onSelectTab && onSelectTab('tariff')}
                className="text-left text-slate-400 hover:text-orange-400 transition-colors py-0.5 cursor-pointer"
              >
                NERC Tariff calculator
              </button>
              <button
                onClick={() => onSelectTab && onSelectTab('maps')}
                className="text-left text-slate-400 hover:text-orange-400 transition-colors py-0.5 cursor-pointer font-medium"
              >
                Nigeria Grid &amp; Substation Maps
              </button>
            </div>
          </div>

          {/* Company & Customer Dashboard */}
          <div className="md:col-span-2 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Company</span>
            </h4>
            <div className="flex flex-col gap-1.5 text-[11px]">
              <button
                onClick={() => onOpenDashboard && onOpenDashboard()}
                className="text-left text-orange-400 hover:text-orange-300 font-semibold transition-colors py-0.5 cursor-pointer"
              >
                Customer dashboard
              </button>
              <span className="text-slate-400 py-0.5">About us</span>
              <span className="text-slate-400 py-0.5">Contact Us</span>
              <span className="text-slate-400 py-0.5">Privacy policy</span>
            </div>
          </div>

          {/* Payment Infrastructure Notice */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
              <span>Payment Infrastructure</span>
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Bank-grade encrypted token delivery and automated recurring plans. ₦15,000 safety cap strictly enforced on recurring schedules.
            </p>
            <div className="pt-2 text-[11px] text-orange-400 font-semibold flex items-center gap-1.5 flex-wrap">
              <Phone className="w-3.5 h-3.5 text-orange-400 shrink-0" />
              <span>National Support Desk:</span>
              <a
                href="tel:+2348108958265"
                className="text-white hover:text-orange-400 transition-colors font-mono font-bold hover:underline"
              >
                +2348108958265
              </a>
            </div>
          </div>
        </div>

        {/* Bottom copyright ribbon */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            &copy; 2026 CaseBox Technology and Innovations Enterprise. Completed environment — real tokens are now issued.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-slate-300">NERC MYTO Band A</span>
            <span className="text-orange-500" aria-hidden="true">·</span>
            <span className="text-slate-300">STS 20-Digit Standard</span>
            <span className="text-orange-500" aria-hidden="true">·</span>
            <button
              onClick={onOpenAdmin}
              className="text-orange-400/80 hover:text-orange-300 transition-colors font-medium underline-offset-4 hover:underline cursor-pointer"
            >
              Operator Gate
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
