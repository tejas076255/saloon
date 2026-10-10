import React from 'react';
import { AlertCircle, CheckCircle2, Clock, FileSpreadsheet, Smartphone, TrendingDown, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export const PainPointsSection: React.FC = () => {
  const comparisons = [
    {
      oldProblem: "Messy paper register and lost bills at the end of every busy Saturday.",
      newSolution: "Lightning-fast 3-click POS billing with automated digital invoice sequence and search.",
      icon: Clock,
    },
    {
      oldProblem: "Confusing UPI payments where staff forget to check if money actually arrived.",
      newSolution: "Explicit reference ID tracking and separate reconciliation for Cash, UPI, and Cards.",
      icon: Smartphone,
    },
    {
      oldProblem: "Clients frustrated because repeat barbers forget their preferred hairstyle or fade number.",
      newSolution: "Automatic customer CRM storing previous visits, exact services, and styling notes.",
      icon: Sparkles,
    },
    {
      oldProblem: "Spending hours calculating daily revenue, staff commissions, and tax deductions.",
      newSolution: "One-click real-time daily reports with gross sales, discounts, refunds, and CSV exports.",
      icon: TrendingUp,
    }
  ];

  return (
    <section id="features" className="py-24 bg-dark-900 border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-xs font-semibold text-brand-violet mb-3">
            <span>Built Specifically For Salon Owners</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Say Goodbye to Salon Chaos. <br />
            <span className="bg-gradient-to-r from-brand-violet to-brand-gold bg-clip-text text-transparent">
              Say Hello to Effortless Operations.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Running a busy salon shouldn't mean staying up until midnight doing accounting. SalonDesk was engineered from the ground up to solve daily salon bottlenecks.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl p-6 bg-dark-950/70 border border-white/10 hover:border-brand-violet/30 transition-all duration-300 shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Traditional Pain Point */}
                <div className="p-3.5 rounded-xl bg-rose-950/30 border border-rose-900/40 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase text-rose-300 tracking-wider">Traditional Method</div>
                    <div className="text-sm text-slate-300 mt-0.5">{item.oldProblem}</div>
                  </div>
                </div>

                {/* SalonDesk Solution */}
                <div className="p-3.5 rounded-xl bg-brand-purple/10 border border-brand-violet/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold uppercase text-brand-violet tracking-wider">The SalonDesk Way</div>
                    <div className="text-sm text-slate-100 font-medium mt-0.5">{item.newSolution}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
