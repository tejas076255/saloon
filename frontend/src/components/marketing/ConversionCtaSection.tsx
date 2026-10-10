import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface ConversionCtaProps {
  onStartTrial: () => void;
  onTryDemo: () => void;
}

export const ConversionCtaSection: React.FC<ConversionCtaProps> = ({ onStartTrial, onTryDemo }) => {
  return (
    <section className="py-24 bg-dark-900 border-t border-white/5 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-brand-purple/20 via-brand-violet/25 to-indigo-600/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-brand-violet mb-6">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
          <span>Zero Setup Fees • Instant Setup</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-display max-w-3xl mx-auto leading-tight">
          Ready to Modernize Your Salon Operations?
        </h2>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Start your 14-day free trial right now. Set up your salon services, invite your staff, and experience 15-second POS billing today.
        </p>

        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartTrial}
            id="cta-bottom-start-btn"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-purple via-brand-violet to-indigo-600 text-white font-semibold text-base shadow-2xl shadow-brand-purple/30 hover:shadow-brand-purple/50 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>Start Free 14-Day Trial</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTryDemo}
            id="cta-bottom-demo-btn"
            className="w-full sm:w-auto px-7 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-base border border-white/10 backdrop-blur-md transition-all flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <span>Launch Live Interactive Demo</span>
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Cancel anytime
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% data ownership
          </span>
        </div>

      </div>
    </section>
  );
};
