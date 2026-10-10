import React, { useState } from 'react';
import { Check, Sparkles, ArrowRight } from 'lucide-react';

interface PricingProps {
  onSelectPlan: (planId: string) => void;
}

export const PricingSection: React.FC<PricingProps> = ({ onSelectPlan }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      id: 'starter',
      name: 'Starter Plan',
      price: billingCycle === 'monthly' ? 299 : 249,
      period: 'per month',
      description: 'Ideal for independent barbers, solo stylists, and single-chair studios.',
      badge: 'Essential POS',
      popular: false,
      features: [
        'Up to 2 Staff accounts',
        'Unlimited quick POS billing',
        'Customer profiles & notes',
        'Daily revenue summary',
        'WhatsApp receipt sharing',
        'Thermal 80mm print receipts',
        'Standard email support',
      ]
    },
    {
      id: 'pro',
      name: 'Pro Growth',
      price: billingCycle === 'monthly' ? 699 : 599,
      period: 'per month',
      description: 'Our most popular plan for busy barber shops and growing styling parlours.',
      badge: 'Most Popular',
      popular: true,
      features: [
        'Up to 6 Staff accounts with RBAC',
        'Unlimited invoices & clients',
        'Automated PDF GST tax receipts',
        'Retail product & stock tracking',
        'Daily & monthly sales analytics',
        'CSV spreadsheet export',
        'Multi-device counter support',
        'Priority WhatsApp & phone support',
      ]
    },
    {
      id: 'business',
      name: 'Business Elite',
      price: billingCycle === 'monthly' ? 1299 : 1099,
      period: 'per month',
      description: 'For luxury unisex salons, high-volume studios, and multi-location owners.',
      badge: 'Uncapped Power',
      popular: false,
      features: [
        'Unlimited Staff accounts',
        'Unlimited monthly invoices',
        'Multi-chair chair queue display',
        'Custom thermal receipt branding',
        'Immutable audit logs & void tracking',
        'Advanced discount permission controls',
        'Dedicated 24/7 account manager',
        'Custom salon onboarding session',
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-dark-900 border-t border-b border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-violet/10 border border-brand-violet/20 text-xs font-semibold text-brand-violet mb-3">
            <span>Simple, Transparent SaaS Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Start Free. Upgrade As You Scale.
          </h2>
          <p className="mt-4 text-base text-slate-300">
            Every plan includes a 14-day free trial. No credit card required to start. Cancel anytime with zero lock-in.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center p-1 rounded-xl bg-dark-950 border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                billingCycle === 'monthly' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === 'yearly' ? 'bg-brand-purple text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Annual Billing</span>
              <span className="px-1.5 py-0.5 rounded bg-brand-gold text-dark-950 font-bold text-[9px]">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-dark-850 to-dark-900 border-2 border-brand-violet shadow-2xl shadow-brand-violet/15 md:-translate-y-2'
                  : 'bg-dark-950/70 border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-brand-violet to-brand-purple text-white text-[11px] font-bold tracking-wide uppercase shadow-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-gold" /> {plan.badge}
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-white font-display">{plan.name}</h3>
                  {!plan.popular && (
                    <span className="text-[10px] text-slate-400 uppercase font-semibold px-2 py-0.5 rounded bg-white/5 border border-white/10">
                      {plan.badge}
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 min-h-[32px]">{plan.description}</p>

                {/* Price Display */}
                <div className="my-6 pb-6 border-b border-white/10 flex items-baseline gap-1.5">
                  <span className="text-4xl font-extrabold text-white">₹{plan.price}</span>
                  <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                </div>

                {/* Features List */}
                <div className="space-y-3">
                  <div className="text-[11px] uppercase font-semibold text-slate-400 tracking-wider">Included Features:</div>
                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-white/5">
                <button
                  onClick={() => onSelectPlan(plan.id)}
                  id={`pricing-btn-${plan.id}`}
                  className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-violet hover:to-indigo-500 text-white shadow-lg shadow-brand-purple/25'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10'
                  }`}
                >
                  <span>Start 14-Day Free Trial</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-center text-[10px] text-slate-500 mt-2">
                  Instant activation • Zero commitment
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
