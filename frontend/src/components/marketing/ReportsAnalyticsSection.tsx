import React from 'react';
import { BarChart3, TrendingUp, Download, Check, PieChart, Calendar, IndianRupee } from 'lucide-react';

export const ReportsAnalyticsSection: React.FC = () => {
  return (
    <section className="py-24 bg-dark-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400">
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Real-Time Business Intelligence</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              Know Your Exact Numbers. <br />
              <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
                Every Single Day.
              </span>
            </h2>

            <p className="text-base text-slate-300 leading-relaxed">
              Never wonder if you made a profit today. SalonDesk automatically tallies gross sales, discounts given, refunds issued, and exact cash-in-drawer versus UPI bank transfers.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Separates Invoiced Revenue from Collected Cash</div>
                  <div className="text-xs text-slate-400">Track unpaid or pending customer balances with zero confusion.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Daily Cash & UPI Reconciliation</div>
                  <div className="text-xs text-slate-400">Match physical register cash against bank UPI account settlements.</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">One-Click CSV Export for Accountants</div>
                  <div className="text-xs text-slate-400">Download formatted sales spreadsheets ready for GST filing.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Report Dashboard Mockup */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl p-6 bg-dark-900 border border-white/10 shadow-2xl space-y-6">
              
              {/* Report Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-violet" />
                    Daily Operations Report
                  </div>
                  <div className="text-xs text-slate-400">Asia/Kolkata Timezone • Real Database Query</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Export CSV
                  </span>
                </div>
              </div>

              {/* High-level KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-dark-800 border border-white/5">
                  <div className="text-[10px] text-slate-400">Gross Billed</div>
                  <div className="text-lg font-bold text-white mt-1">₹24,850</div>
                  <div className="text-[9px] text-slate-400">38 Total Invoices</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-800 border border-white/5">
                  <div className="text-[10px] text-slate-400">Discounts</div>
                  <div className="text-lg font-bold text-amber-400 mt-1">₹1,200</div>
                  <div className="text-[9px] text-slate-400">4.8% discount rate</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-800 border border-white/5">
                  <div className="text-[10px] text-slate-400">Net Sales</div>
                  <div className="text-lg font-bold text-emerald-400 mt-1">₹23,650</div>
                  <div className="text-[9px] text-emerald-400 font-medium">Formula: Gross - Disc</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-800 border border-white/5">
                  <div className="text-[10px] text-slate-400">Outstanding Due</div>
                  <div className="text-lg font-bold text-slate-300 mt-1">₹450</div>
                  <div className="text-[9px] text-slate-400">1 Partial Bill</div>
                </div>
              </div>

              {/* Payment Methods Breakdown */}
              <div className="p-4 rounded-xl bg-dark-850 border border-white/5 space-y-3">
                <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Payment Channels Collected</span>
                  <span className="text-emerald-400 font-mono">Total: ₹23,200</span>
                </div>
                
                {/* Visual Progress bar */}
                <div className="h-2.5 rounded-full bg-dark-800 overflow-hidden flex">
                  <div className="bg-sky-400 h-full w-[65%]" title="UPI: 65%"></div>
                  <div className="bg-amber-400 h-full w-[25%]" title="Cash: 25%"></div>
                  <div className="bg-purple-400 h-full w-[10%]" title="Card: 10%"></div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400"></span>
                    <span className="text-slate-300">UPI: ₹15,080</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <span className="text-slate-300">Cash: ₹5,800</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                    <span className="text-slate-300">Card: ₹2,320</span>
                  </div>
                </div>
              </div>

              {/* Top popular services */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-slate-300">Top Performing Services Today</div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-800 border border-white/5">
                    <span className="font-medium text-white">1. Executive Haircut & Wash</span>
                    <span className="text-slate-400">18 orders</span>
                    <span className="font-semibold text-emerald-400">₹6,300</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-800 border border-white/5">
                    <span className="font-medium text-white">2. Beard Sculpt & Hot Towel</span>
                    <span className="text-slate-400">12 orders</span>
                    <span className="font-semibold text-emerald-400">₹3,000</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-dark-800 border border-white/5">
                    <span className="font-medium text-white">3. Hydra Glow Facial</span>
                    <span className="text-slate-400">4 orders</span>
                    <span className="font-semibold text-emerald-400">₹3,400</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
