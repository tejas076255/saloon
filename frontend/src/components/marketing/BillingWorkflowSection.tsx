import React, { useState } from 'react';
import { Search, ShoppingBag, CreditCard, Send, Printer, CheckCircle, ArrowRight, Smartphone } from 'lucide-react';

export const BillingWorkflowSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: 1,
      title: "1. Client Selection",
      desc: "Type customer's phone or name for instant recall, or tap 'Quick Walk-in' with zero friction.",
      icon: Search,
    },
    {
      num: 2,
      title: "2. Tap Services & Retail",
      desc: "Select hair styling, beard grooming, or retail products. Quantities and discounts compute instantly.",
      icon: ShoppingBag,
    },
    {
      num: 3,
      title: "3. Fast Checkout & Share",
      desc: "Accept Cash, UPI, or Card. Print 80mm thermal receipts or send direct WhatsApp bills with one tap.",
      icon: Send,
    }
  ];

  return (
    <section id="workflow" className="py-24 bg-dark-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-3">
            <span>Built For Peak Rush Hours</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            The 15-Second Billing Engine
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Never make clients wait in line at checkout. Experience a billing workflow designed specifically for fast-paced salon counters.
          </p>
        </div>

        {/* Step Selector Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.num;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(s.num)}
                className={`p-6 rounded-2xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-dark-850 border-brand-violet shadow-xl shadow-brand-violet/10 ring-1 ring-brand-violet'
                    : 'bg-dark-900/60 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
                    isCurrent ? 'bg-brand-violet text-white' : 'bg-white/10 text-slate-400'
                  }`}>
                    {s.num}
                  </div>
                  <h3 className="font-semibold text-white text-base">{s.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Interactive Mock Display for the Active Step */}
        <div className="rounded-2xl p-6 md:p-8 bg-dark-900 border border-white/10 shadow-2xl relative">
          
          {activeStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-brand-violet" /> Customer Lookup
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-brand-violet/20 text-brand-violet font-medium">
                  Auto-Deduplication Active
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-dark-800 border border-brand-violet/40 space-y-2">
                  <div className="text-xs text-slate-400 font-medium">Search Customer by Phone or Name</div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-dark-950 border border-white/10 text-sm text-white font-mono">
                    <Search className="w-4 h-4 text-slate-500" />
                    <span>+91 98200 44556</span>
                  </div>
                  <div className="mt-3 p-3 rounded-lg bg-dark-850 border border-white/5 space-y-1">
                    <div className="font-semibold text-white text-sm">Rahul Khanna (Regular Client)</div>
                    <div className="text-xs text-slate-400">Total Visits: 14 • Total Spent: ₹8,420 • Last Visit: 12 Oct</div>
                    <div className="text-xs text-brand-gold italic">Preference: "Zero machine fade, low tea with ginger"</div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-dark-800 border border-white/10 flex flex-col justify-between">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Walk-in Option</div>
                    <div className="text-sm text-white mt-1">First-time walk-in guest?</div>
                    <p className="text-xs text-slate-400 mt-2">
                      Generate a valid invoice instantly without forcing unnecessary registration or email addresses.
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-dark-850 border border-dashed border-white/20 text-center text-xs text-brand-violet font-medium">
                    ⚡ Quick Walk-in Mode Enabled (Zero Mandatory Fields)
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-brand-gold" /> Service & Retail Selection
                </span>
                <span className="text-xs text-slate-400 font-mono">Auto 18% GST Calculated</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-dark-800 border border-brand-violet/50 space-y-1">
                  <div className="text-xs font-semibold text-white">Classic Haircut</div>
                  <div className="text-xs text-emerald-400 font-bold">₹350.00</div>
                  <div className="text-[10px] text-brand-violet font-medium">Selected (1x)</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-800 border border-brand-violet/50 space-y-1">
                  <div className="text-xs font-semibold text-white">Beard Sculpt & Towel</div>
                  <div className="text-xs text-emerald-400 font-bold">₹250.00</div>
                  <div className="text-[10px] text-brand-violet font-medium">Selected (1x)</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-800 border border-white/5 space-y-1 opacity-70">
                  <div className="text-xs font-semibold text-white">Hydra Facial</div>
                  <div className="text-xs text-slate-300 font-bold">₹1,200.00</div>
                  <div className="text-[10px] text-slate-400">+ Add to Bill</div>
                </div>
                <div className="p-3 rounded-xl bg-dark-800 border border-white/5 space-y-1 opacity-70">
                  <div className="text-xs font-semibold text-white">Matte Clay Pomade</div>
                  <div className="text-xs text-slate-300 font-bold">₹550.00</div>
                  <div className="text-[10px] text-slate-400">Stock: 8 in store</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-dark-850 border border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-300">Active Subtotal: ₹600.00 | GST (18%): ₹108.00</span>
                <span className="font-bold text-emerald-400 text-sm">Total Bill: ₹708.00</span>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" /> Multi-Method Payment & WhatsApp Share
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">
                  Verified Invoice #INV-2026-0189
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-dark-800 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400">Payment Recorded</div>
                  <div className="text-lg font-bold text-white">₹708.00</div>
                  <div className="text-xs text-sky-400 font-medium flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5" /> UPI (Ref: 432109876543)
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-dark-800 border border-white/10 space-y-2">
                  <div className="text-xs text-slate-400">Thermal Print</div>
                  <button className="w-full py-2 px-3 rounded-lg bg-dark-700 hover:bg-dark-600 text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors">
                    <Printer className="w-4 h-4" /> Print 80mm Receipt
                  </button>
                  <div className="text-[10px] text-slate-400 text-center">Compatible with standard USB/Bluetooth printers</div>
                </div>
                <div className="p-4 rounded-xl bg-dark-800 border border-emerald-500/40 space-y-2">
                  <div className="text-xs text-slate-400">WhatsApp Receipt Link</div>
                  <button className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-950/40">
                    <Send className="w-4 h-4" /> Send Bill via WhatsApp
                  </button>
                  <div className="text-[10px] text-emerald-400 text-center">Opens chat with branded receipt summary</div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
