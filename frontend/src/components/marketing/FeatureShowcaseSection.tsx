import React from 'react';
import { ShieldCheck, History, PackageCheck, Layers, Lock, FileText, CheckCircle2 } from 'lucide-react';

export const FeatureShowcaseSection: React.FC = () => {
  const features = [
    {
      title: "Multi-Tenant Salon Workspaces",
      description: "Complete database isolation for every salon. Staff accounts get restricted access, while owners maintain full financial visibility.",
      icon: ShieldCheck,
      badge: "Enterprise Security",
      highlight: "Strict Row-Level & Tenant Isolation"
    },
    {
      title: "Historical Price Preservation",
      description: "When you update service or product prices, past invoices freeze their historical transaction price permanently for clean tax audits.",
      icon: History,
      badge: "Audit Compliant",
      highlight: "Immutable Invoiced Amounts"
    },
    {
      title: "Retail & Inventory Tracking",
      description: "Keep track of styling pomades, beard oils, and shampoos. Deduct inventory automatically with every bill and trigger low-stock alerts.",
      icon: PackageCheck,
      badge: "Real-time Stock",
      highlight: "Auto-Deduction on Checkout"
    },
    {
      title: "Split Payments & Method Reconciliation",
      description: "Allow clients to split bills across Cash and UPI. Distinguish manually recorded payments from verified gateway payments.",
      icon: Layers,
      badge: "Zero Discrepancies",
      highlight: "Cash, UPI & Card Breakdown"
    },
    {
      title: "Audit Logging for Voids & Refunds",
      description: "Every cancellation, refund, and modification is permanently recorded in an immutable audit log with staff identity and timestamp.",
      icon: Lock,
      badge: "Fraud Prevention",
      highlight: "100% Accountable Operations"
    },
    {
      title: "Official PDF Tax Receipts & Printing",
      description: "Generate compliant tax receipts formatted with your salon's GST number, currency, custom tagline, and thermal 80mm printer support.",
      icon: FileText,
      badge: "GST Ready",
      highlight: "80mm Thermal & A4 Formats"
    }
  ];

  return (
    <section id="showcase" className="py-24 bg-dark-900 border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-violet/20 text-xs font-semibold text-brand-violet mb-3">
            <span>SaaS Architecture Designed For Reliability</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Built Like Bank Software. <br />
            <span className="bg-gradient-to-r from-brand-violet via-purple-300 to-indigo-400 bg-clip-text text-transparent">
              Simple Like A Smartphone App.
            </span>
          </h2>
          <p className="mt-4 text-base text-slate-300">
            SalonDesk couples rigorous financial integrity with an effortless user experience that salon staff can learn in under 2 minutes.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl p-6 bg-dark-950/60 border border-white/10 hover:border-brand-violet/40 transition-all duration-300 group hover:-translate-y-1 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-brand-violet/10 border border-brand-violet/20 flex items-center justify-center text-brand-violet group-hover:scale-110 group-hover:bg-brand-violet/20 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-display">{feat.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{feat.description}</p>
                </div>

                <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-1.5 text-xs font-semibold text-brand-violet">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{feat.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
