import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Receipt, CreditCard, Banknote, Smartphone,
  Plus, ArrowUpRight, ArrowDownRight, Scissors, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth/AuthContext';
import { formatCurrency, formatDateTime } from '../../lib/utils/formatters';
import type { DailyReport, Invoice } from '../../types';

interface DashboardHomeProps {
  onNavigateTab: (tab: string) => void;
}

export const DashboardHomeView: React.FC<DashboardHomeProps> = ({ onNavigateTab }) => {
  const { salon } = useAuth();
  const currency = salon?.currency || '₹';

  const [dailyData, setDailyData] = useState<DailyReport | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const [report, invs] = await Promise.all([
        api.reports.getDaily(),
        api.invoices.list({ limit: 8 })
      ]);
      setDailyData(report);
      setRecentInvoices(invs);
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Welcome & Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-violet/20 text-brand-violet text-[10px] font-semibold mb-1">
            <Sparkles className="w-3 h-3 text-brand-gold" />
            <span>Today's Real-Time Counter</span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Welcome to {salon?.name}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Here's your live operational overview for today.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => onNavigateTab('billing')}
            id="dash-quick-new-bill"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-violet hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-brand-purple/20 flex items-center justify-center gap-1.5 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Bill</span>
          </button>

          <button
            onClick={() => onNavigateTab('customers')}
            className="px-3.5 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5"
          >
            <Users className="w-4 h-4 text-brand-violet" />
            <span>Add Customer</span>
          </button>

          <button
            onClick={loadDashboard}
            title="Refresh metrics"
            className="p-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-400 hover:text-white border border-white/10 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-violet' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Today's Sales */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Net Sales</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {formatCurrency(dailyData?.net_sales || 0, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
            <span>Gross: {formatCurrency(dailyData?.gross_billed || 0, currency)}</span>
            {dailyData && dailyData.discounts > 0 && (
              <span className="text-amber-400 ml-1">(-{formatCurrency(dailyData.discounts, currency)} disc)</span>
            )}
          </div>
        </div>

        {/* Invoice Count */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Today's Invoices</span>
            <div className="w-8 h-8 rounded-lg bg-brand-violet/20 text-brand-violet flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono mt-2">
            {dailyData?.invoice_count || 0} Bills
          </div>
          <div className="text-[11px] text-emerald-400 mt-2 font-medium">
            Active Counter Output
          </div>
        </div>

        {/* Payments Collected */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Money Collected</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Smartphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-2">
            {formatCurrency(dailyData?.payments_collected || 0, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
            <span className="text-sky-300">UPI: {formatCurrency(dailyData?.upi_collected || 0, currency)}</span>
            <span className="text-amber-300">Cash: {formatCurrency(dailyData?.cash_collected || 0, currency)}</span>
          </div>
        </div>

        {/* Outstanding Pending Balances */}
        <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Outstanding Due</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-200 font-mono mt-2">
            {formatCurrency(dailyData?.outstanding_balances || 0, currency)}
          </div>
          <div className="text-[11px] text-slate-400 mt-2">
            Pending client balances
          </div>
        </div>

      </div>

      {/* Grid: Popular Services & Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Invoices Table (8 cols) */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-brand-violet" />
              <h3 className="font-bold text-white text-sm font-display">Recent Invoices</h3>
            </div>
            <button
              onClick={() => onNavigateTab('invoices')}
              className="text-xs text-brand-violet hover:underline font-semibold"
            >
              View All Invoices →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-white/5 pb-2">
                  <th className="py-2 font-medium">Invoice No</th>
                  <th className="py-2 font-medium">Customer</th>
                  <th className="py-2 font-medium">Time</th>
                  <th className="py-2 font-medium">Total</th>
                  <th className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No invoices recorded yet. Create your first bill!
                    </td>
                  </tr>
                ) : (
                  recentInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-mono font-semibold text-brand-violet">
                        {inv.invoice_number}
                      </td>
                      <td className="py-3 text-slate-200">
                        <div className="font-medium">{inv.customer_name}</div>
                        <div className="text-[10px] text-slate-500">{inv.customer_phone || 'Walk-in'}</div>
                      </td>
                      <td className="py-3 text-slate-400">
                        {formatDateTime(inv.created_at)}
                      </td>
                      <td className="py-3 font-mono font-bold text-white">
                        {formatCurrency(inv.total_amount, currency)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : inv.status === 'PARTIAL'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Popular Services & Payment Split (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Top Services */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <Scissors className="w-4 h-4 text-brand-gold" />
              <h3 className="font-bold text-white text-sm font-display">Top Services Today</h3>
            </div>

            <div className="space-y-2">
              {dailyData?.popular_services && dailyData.popular_services.length > 0 ? (
                dailyData.popular_services.map((srv, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-medium text-white">{srv.name}</div>
                      <div className="text-[10px] text-slate-400">{srv.count} orders</div>
                    </div>
                    <div className="font-mono font-bold text-emerald-400">
                      {formatCurrency(srv.revenue, currency)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-500 text-xs">
                  No service orders recorded today.
                </div>
              )}
            </div>
          </div>

          {/* Payment Split Card */}
          <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <CreditCard className="w-4 h-4 text-sky-400" />
              <h3 className="font-bold text-white text-sm font-display">Payment Mix</h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-lg bg-dark-950 border border-white/5">
                <span className="flex items-center gap-2 text-slate-300">
                  <Smartphone className="w-3.5 h-3.5 text-sky-400" /> UPI
                </span>
                <span className="font-mono font-bold text-sky-400">
                  {formatCurrency(dailyData?.upi_collected || 0, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-dark-950 border border-white/5">
                <span className="flex items-center gap-2 text-slate-300">
                  <Banknote className="w-3.5 h-3.5 text-amber-400" /> Cash
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {formatCurrency(dailyData?.cash_collected || 0, currency)}
                </span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-lg bg-dark-950 border border-white/5">
                <span className="flex items-center gap-2 text-slate-300">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" /> Card
                </span>
                <span className="font-mono font-bold text-purple-400">
                  {formatCurrency(dailyData?.card_collected || 0, currency)}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
