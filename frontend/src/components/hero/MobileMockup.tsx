import React from 'react';
import { Send, CheckCircle2, Phone, Sparkles } from 'lucide-react';

export const MobileMockup: React.FC = () => {
  return (
    <div className="relative rounded-[2.5rem] p-2 bg-gradient-to-b from-slate-700/80 to-slate-900 shadow-2xl backdrop-blur-xl border border-white/20 w-64 transition-transform duration-500 hover:scale-[1.03]">
      {/* Notch / Dynamic Island */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-black z-30 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-slate-800 mr-2"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
      </div>

      {/* Screen */}
      <div className="rounded-[2rem] overflow-hidden bg-dark-900 border border-white/5 p-3 pt-8 text-xs select-none">
        {/* Status header */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
          <div className="font-semibold text-white text-[11px] flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-brand-gold" /> Fast POS Bill
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-mono">
            ₹550.00
          </span>
        </div>

        {/* Customer card */}
        <div className="bg-dark-800 rounded-lg p-2 border border-white/5 mb-2.5">
          <div className="text-[9px] text-slate-400">Customer</div>
          <div className="text-[11px] font-semibold text-white">Vikram Malhotra</div>
          <div className="text-[9px] text-brand-violet flex items-center gap-1 mt-0.5">
            <Phone className="w-2.5 h-2.5" /> +91 98765 43210
          </div>
        </div>

        {/* Selected Services */}
        <div className="space-y-1.5 mb-2.5">
          <div className="flex justify-between items-center text-[10px] bg-dark-850 p-1.5 rounded border border-white/5">
            <span className="text-slate-200">1x Executive Haircut</span>
            <span className="font-semibold text-white">₹350</span>
          </div>
          <div className="flex justify-between items-center text-[10px] bg-dark-850 p-1.5 rounded border border-white/5">
            <span className="text-slate-200">1x Royal Beard Trim</span>
            <span className="font-semibold text-white">₹200</span>
          </div>
        </div>

        {/* Total Summary */}
        <div className="bg-dark-800/90 rounded-lg p-2 border border-white/5 mb-2.5 space-y-1 text-[10px]">
          <div className="flex justify-between text-slate-400">
            <span>Subtotal</span>
            <span>₹550.00</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>GST (18%)</span>
            <span>₹99.00</span>
          </div>
          <div className="flex justify-between font-bold text-white pt-1 border-t border-white/10 text-[11px]">
            <span>Total Payable</span>
            <span className="text-emerald-400">₹649.00</span>
          </div>
        </div>

        {/* WhatsApp Direct Share Button */}
        <button className="w-full py-2 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-[10px] flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-colors">
          <Send className="w-3 h-3" />
          <span>Send Bill via WhatsApp</span>
        </button>

        <div className="text-center mt-1.5 text-[8px] text-slate-400 flex items-center justify-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" /> Instant GST Receipt Generated
        </div>
      </div>
    </div>
  );
};
