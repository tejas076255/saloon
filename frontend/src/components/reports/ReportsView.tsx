import React, { useState, useEffect } from 'react';
import {
  BarChart3, Download, Calendar, TrendingUp, DollarSign,
  Smartphone, Banknote, CreditCard, RefreshCw, CheckCircle, PieChart
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth/AuthContext';
import { formatCurrency } from '../../lib/utils/formatters';
import type { DailyReport, SalesReport } from '../../types';

export const ReportsView: React.FC = () => {
  const { salon } = useAuth();
  const currency = salon?.currency || '₹';

  // Range options
  const [rangeType, setRangeType] = useState<'today' | '7days' | '30days'>('today');
  const [salesReport, setSalesReport] = useState<SalesReport | null>(null);
  const [dailyReport, setDailyReport] = useState<DailyReport | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      if (rangeType === 'today') {
        const dRep = await api.reports.getDaily(today);
        setDailyReport(dRep);
      } else {
        const daysBack = rangeType === '7days' ? 6 : 29;
        const start = new Date(Date.now() - daysBack * 86400000).toISOString().split('T')[0];
        const sRep = await api.reports.getSales(start, today);
        setSalesReport(sRep);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [rangeType]);

  const handleExportCsv = () => {
    const today = new Date().toISOString().split('T')[0];
    let start = today;
    if (rangeType === '7days') {
      start = new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0];
    } else if (rangeType === '30days') {
      start = new Date(Date.now() - 29 * 86400000).toISOString().split('T')[0];
    }
    const exportUrl = api.reports.getExportUrl(start, today);
    window.open(exportUrl, '_blank');
  };

  // Summaries based on range
  const grossBilled = rangeType === 'today' ? (dailyReport?.gross_billed || 0) : (salesReport?.total_gross_billed || 0);
  const discounts = rangeType === 'today' ? (dailyReport?.discounts || 0) : (salesReport?.total_discounts || 0);
  const refunds = rangeType === 'today' ? (dailyReport?.refunds || 0) : (salesReport?.total_refunds || 0);
  const netSales = rangeType === 'today' ? (dailyReport?.net_sales || 0) : (salesReport?.total_net_sales || 0);
  const paymentsCollected = rangeType === 'today' ? (dailyReport?.payments_collected || 0) : (salesReport?.total_payments_collected || 0);
  const outstanding = rangeType === 'today' ? (dailyReport?.outstanding_balances || 0) : (salesReport?.total_outstanding || 0);
  const invoiceCount = rangeType === 'today' ? (dailyReport?.invoice_count || 0) : (salesReport?.total_invoices || 0);

  const cashAmount = rangeType === 'today' ? (dailyReport?.cash_collected || 0) : (salesReport?.payment_methods_breakdown?.Cash || 0);
  const upiAmount = rangeType === 'today' ? (dailyReport?.upi_collected || 0) : (salesReport?.payment_methods_breakdown?.UPI || 0);
  const cardAmount = rangeType === 'today' ? (dailyReport?.card_collected || 0) : (salesReport?.payment_methods_breakdown?.Card || 0);

  const topServices = rangeType === 'today' ? (dailyReport?.popular_services || []) : (salesReport?.top_services || []);

  return (
    <div className="space-y-6">
      
      {/* Top Filter and CSV Export bar */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Range Selector */}
        <div className="flex items-center p-1 rounded-xl bg-dark-950 border border-white/5 w-full sm:w-auto">
          <button
            onClick={() => setRangeType('today')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              rangeType === 'today' ? 'bg-brand-purple text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Today's Report
          </button>
          <button
            onClick={() => setRangeType('7days')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              rangeType === '7days' ? 'bg-brand-purple text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setRangeType('30days')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              rangeType === '30days' ? 'bg-brand-purple text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 30 Days
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={fetchReports}
            className="p-2.5 rounded-xl bg-dark-800 hover:bg-dark-750 text-slate-300 border border-white/10 transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-violet' : ''}`} />
          </button>

          <button
            onClick={handleExportCsv}
            id="btn-export-csv"
            className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>

      </div>

      {/* Main KPI metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg">
          <div className="text-xs text-slate-400">Gross Billed Revenue</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {formatCurrency(grossBilled, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            Across {invoiceCount} total invoice(s)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg">
          <div className="text-xs text-slate-400">Total Discounts & Refunds</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">
            {formatCurrency(discounts + refunds, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            Discounts: {formatCurrency(discounts, currency)} • Refunds: {formatCurrency(refunds, currency)}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-brand-violet/30 shadow-lg relative overflow-hidden">
          <div className="text-xs text-brand-violet font-semibold">Net Recognized Sales</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {formatCurrency(netSales, currency)}
          </div>
          <div className="text-[10px] text-emerald-400/80 mt-2">
            Formula: Gross - Discounts - Refunds
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg">
          <div className="text-xs text-slate-400">Money Collected In-Bank / Register</div>
          <div className="text-2xl font-black text-sky-400 font-mono mt-1">
            {formatCurrency(paymentsCollected, currency)}
          </div>
          <div className="text-[10px] text-slate-500 mt-2">
            Pending dues: {formatCurrency(outstanding, currency)}
          </div>
        </div>

      </div>

      {/* Two columns: Payment Channel Split & Popular Services */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Payment Channels (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <PieChart className="w-4 h-4 text-brand-violet" />
            <h3 className="font-bold text-white text-sm font-display">Collections by Payment Method</h3>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">UPI & QR Code</div>
                  <div className="text-[10px] text-slate-400">PhonePe, GPay, Paytm settlements</div>
                </div>
              </div>
              <div className="font-mono font-bold text-sky-400 text-sm">
                {formatCurrency(upiAmount, currency)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Banknote className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Cash in Register</div>
                  <div className="text-[10px] text-slate-400">Physical drawer currency</div>
                </div>
              </div>
              <div className="font-mono font-bold text-amber-400 text-sm">
                {formatCurrency(cashAmount, currency)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">Credit & Debit Card</div>
                  <div className="text-[10px] text-slate-400">POS machine swipes</div>
                </div>
              </div>
              <div className="font-mono font-bold text-purple-400 text-sm">
                {formatCurrency(cardAmount, currency)}
              </div>
            </div>
          </div>
        </div>

        {/* Top Services Ranking (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-dark-900 border border-white/10 shadow-lg space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-white text-sm font-display">Revenue by Service Categories</h3>
          </div>

          <div className="space-y-2">
            {topServices.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No services billed in this date range.
              </div>
            ) : (
              topServices.map((srv, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-white/10 text-slate-300 flex items-center justify-center font-mono font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-white">{srv.name}</div>
                      <div className="text-[10px] text-slate-400">{srv.count} total order(s)</div>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-emerald-400 text-sm">
                    {formatCurrency(srv.revenue, currency)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
