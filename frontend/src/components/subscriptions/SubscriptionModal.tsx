import React, { useState, useEffect } from 'react';
import {
  CreditCard, Check, Sparkles, ShieldAlert, ArrowRight, X, Clock, AlertCircle
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth/AuthContext';
import { formatCurrency } from '../../lib/utils/formatters';
import type { Subscription } from '../../types';

export const SubscriptionModal: React.FC = () => {
  const { salon } = useAuth();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlanId, setSelectedPlanId] = useState('pro');
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchSub = async () => {
    setLoading(true);
    try {
      const data = await api.subscriptions.getCurrent();
      setSub(data);
      setSelectedPlanId(data.plan_id);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSub();
  }, []);

  const handleUpgrade = async (planId: string) => {
    setUpgradeLoading(true);
    setSuccessMsg(null);
    try {
      const res = await api.subscriptions.upgrade(planId);
      setSub(res);
      setSuccessMsg(`Successfully upgraded to ${res.plan_name} [Development Sandbox Simulation]`);
    } catch (err: any) {
      console.error(err);
    } finally {
      setUpgradeLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Current Subscription Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-brand-violet/30 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet border border-brand-violet/30 text-xs font-bold uppercase tracking-wider">
                {sub?.status === 'trial' ? 'Free 14-Day Trial' : 'Active Subscription'}
              </span>
              {sub?.is_dev_mode && (
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" /> Dev Mode Sandbox
                </span>
              )}
            </div>

            <h2 className="text-2xl font-bold text-white font-display mt-2">
              Current Plan: {sub?.plan_name}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Workspace: <span className="font-semibold text-white">{salon?.name}</span> • Max Staff: {sub?.max_staff} • Monthly Invoices: {sub?.max_invoices_per_month}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-dark-950 border border-white/5 text-right w-full sm:w-auto">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Trial Time Remaining</div>
            <div className="text-xl font-black text-brand-gold font-mono mt-0.5">
              {sub?.days_remaining ?? 14} Days Left
            </div>
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs">
            {successMsg}
          </div>
        )}
      </div>

      {/* Available Plans Selector */}
      <div className="space-y-4">
        <div className="text-sm font-bold text-white uppercase tracking-wider text-slate-400">
          Available Subscription Plans
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sub?.available_plans?.map((plan) => {
            const isCurrent = sub.plan_id === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                  plan.is_popular
                    ? 'bg-dark-850 border-brand-violet shadow-xl shadow-brand-violet/10 ring-1 ring-brand-violet'
                    : 'bg-dark-900 border-white/10'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-white font-display">{plan.name}</h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 min-h-[32px]">{plan.tagline}</p>

                  <div className="my-5 pb-5 border-b border-white/10 flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">₹{plan.price_inr}</span>
                    <span className="text-xs text-slate-400">/month</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {plan.features.map((f, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-slate-300">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-5 border-t border-white/5">
                  <button
                    disabled={isCurrent || upgradeLoading}
                    onClick={() => handleUpgrade(plan.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                      isCurrent
                        ? 'bg-dark-950 text-slate-500 cursor-default'
                        : 'bg-brand-purple hover:bg-brand-violet text-white shadow-md'
                    }`}
                  >
                    <span>{isCurrent ? 'Current Active Plan' : `Switch to ${plan.name}`}</span>
                    {!isCurrent && <ArrowRight className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
