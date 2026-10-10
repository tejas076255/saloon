import React from 'react';
import { TrendingUp, Users, CreditCard, Sparkles, Scissors, Clock } from 'lucide-react';

export const TabletMockup: React.FC = () => {
  return (
    <div className="relative rounded-2xl p-2 bg-gradient-to-b from-slate-700/60 to-slate-900/90 shadow-2xl backdrop-blur-xl border border-white/10 max-w-xl w-full transition-transform duration-500 hover:scale-[1.02]">
      {/* Tablet bezel & camera */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700/50 z-20"></div>

      {/* Screen container */}
      <div className="rounded-xl overflow-hidden bg-dark-900 border border-white/5 p-4 text-xs select-none">
        {/* Mock Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-brand-violet to-brand-purple flex items-center justify-center text-white font-bold text-[10px]">
              SD
            </div>
            <div>
              <div className="font-semibold text-white text-[11px] flex items-center gap-1.5">
                Aura Luxury Barber Studio
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <div className="text-[9px] text-slate-400">Terminal #01 • Live Operations</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet border border-brand-violet/30 text-[9px] font-medium">
              POS Online
            </span>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="p-2 rounded-lg bg-dark-800/80 border border-white/5">
            <div className="text-[9px] text-slate-400 flex items-center justify-between">
              Today's Sales <TrendingUp className="w-2.5 h-2.5 text-emerald-400" />
            </div>
            <div className="text-sm font-bold text-white mt-0.5">₹18,450</div>
            <div className="text-[8px] text-emerald-400 font-medium">+18.2% vs yesterday</div>
          </div>
          <div className="p-2 rounded-lg bg-dark-800/80 border border-white/5">
            <div className="text-[9px] text-slate-400 flex items-center justify-between">
              Invoices <Users className="w-2.5 h-2.5 text-brand-violet" />
            </div>
            <div className="text-sm font-bold text-white mt-0.5">28 Bills</div>
            <div className="text-[8px] text-slate-400">Avg ticket: ₹658</div>
          </div>
          <div className="p-2 rounded-lg bg-dark-800/80 border border-white/5">
            <div className="text-[9px] text-slate-400 flex items-center justify-between">
              UPI Collected <CreditCard className="w-2.5 h-2.5 text-sky-400" />
            </div>
            <div className="text-sm font-bold text-sky-400 mt-0.5">₹13,200</div>
            <div className="text-[8px] text-slate-400">71.5% digital share</div>
          </div>
        </div>

        {/* Live Active Chairs / Stylist Status */}
        <div className="mb-3">
          <div className="text-[10px] font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
            <Scissors className="w-3 h-3 text-brand-violet" /> Active Chairs (4 / 4 Busy)
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="p-1.5 rounded-md bg-dark-850 border border-white/5 flex items-center justify-between">
              <div className="truncate">
                <div className="text-[10px] font-medium text-white truncate">Chair 1: Rohan S.</div>
                <div className="text-[8px] text-slate-400 truncate">Classic Fade + Beard</div>
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold shrink-0">
                12m left
              </span>
            </div>
            <div className="p-1.5 rounded-md bg-dark-850 border border-white/5 flex items-center justify-between">
              <div className="truncate">
                <div className="text-[10px] font-medium text-white truncate">Chair 2: Priya M.</div>
                <div className="text-[8px] text-slate-400 truncate">Keratin Spa Deluxe</div>
              </div>
              <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 font-semibold shrink-0">
                25m left
              </span>
            </div>
          </div>
        </div>

        {/* Mini Recent Sales stream */}
        <div className="bg-dark-850 rounded-lg p-2 border border-white/5">
          <div className="flex items-center justify-between text-[9px] text-slate-400 pb-1 border-b border-white/5 mb-1">
            <span>Invoice #</span>
            <span>Customer</span>
            <span>Method</span>
            <span>Amount</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[9px]">
              <span className="font-mono text-brand-violet">INV-2026-0042</span>
              <span className="text-slate-200">Aditya Roy</span>
              <span className="text-slate-400">UPI (GPay)</span>
              <span className="font-semibold text-emerald-400">₹1,250</span>
            </div>
            <div className="flex items-center justify-between text-[9px]">
              <span className="font-mono text-brand-violet">INV-2026-0041</span>
              <span className="text-slate-200">Kavita S.</span>
              <span className="text-slate-400">Card</span>
              <span className="font-semibold text-emerald-400">₹3,400</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
