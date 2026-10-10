import React, { useState, useEffect } from 'react';
import {
  Search, Download, Printer, Send, Ban, RotateCcw, Eye,
  CheckCircle, AlertCircle, FileText, X
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth/AuthContext';
import { formatCurrency, formatDateTime, generateWhatsAppReceiptLink } from '../../lib/utils/formatters';
import type { Invoice } from '../../types';

export const InvoicesHistoryView: React.FC = () => {
  const { salon } = useAuth();
  const currency = salon?.currency || '₹';

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Selected invoice for detail modal
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [actionReason, setActionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const data = await api.invoices.list({
        search: search || undefined,
        status: statusFilter || undefined,
        limit: 100
      });
      setInvoices(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInvoices();
    }, 200);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const handleCancel = async (invId: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await api.invoices.cancel(invId, actionReason || 'Voided by cashier');
      setSelectedInvoice(updated);
      fetchInvoices();
    } catch (err: any) {
      setActionError(err.message || 'Failed to cancel invoice');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefund = async (invId: string) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await api.invoices.refund(invId, actionReason || 'Customer requested refund');
      setSelectedInvoice(updated);
      fetchInvoices();
    } catch (err: any) {
      setActionError(err.message || 'Failed to refund invoice');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by invoice #, customer name, phone..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-brand-violet outline-none"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-dark-950 border border-white/5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: '', label: 'All Status' },
            { id: 'PAID', label: 'Paid' },
            { id: 'PARTIAL', label: 'Partial' },
            { id: 'CANCELLED', label: 'Cancelled' },
            { id: 'REFUNDED', label: 'Refunded' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === st.id
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl bg-dark-900 border border-white/10 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850 text-slate-400 border-b border-white/5">
              <tr>
                <th className="p-4 font-semibold">Invoice No</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date & Time</th>
                <th className="p-4 font-semibold">Items</th>
                <th className="p-4 font-semibold text-right">Total Amount</th>
                <th className="p-4 font-semibold text-right">Paid</th>
                <th className="p-4 font-semibold text-center">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <span className="w-6 h-6 border-2 border-brand-violet/30 border-t-brand-violet rounded-full inline-block animate-spin mb-2"></span>
                    <div>Loading invoices...</div>
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No invoices matching current filter.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 font-mono font-bold text-brand-violet">
                      {inv.invoice_number}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-white">{inv.customer_name}</div>
                      <div className="text-[10px] text-slate-400">{inv.customer_phone || 'Walk-in'}</div>
                    </td>
                    <td className="p-4 text-slate-400">
                      {formatDateTime(inv.created_at)}
                    </td>
                    <td className="p-4 text-slate-300">
                      {inv.items?.length || 1} item(s)
                    </td>
                    <td className="p-4 font-mono font-bold text-white text-right">
                      {formatCurrency(inv.total_amount, currency)}
                    </td>
                    <td className="p-4 font-mono text-emerald-400 text-right">
                      {formatCurrency(inv.paid_amount, currency)}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status === 'PAID'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : inv.status === 'PARTIAL'
                          ? 'bg-amber-500/20 text-amber-400'
                          : inv.status === 'CANCELLED'
                          ? 'bg-slate-500/20 text-slate-400 line-through'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 hover:text-white transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => api.invoices.downloadPdf(inv.id, inv.invoice_number)}
                          title="Download PDF"
                          className="p-1.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-brand-violet hover:text-white transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={generateWhatsAppReceiptLink(
                            inv.customer_phone,
                            salon?.name || 'SalonDesk',
                            inv.invoice_number,
                            inv.total_amount,
                            currency
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Send WhatsApp"
                          className="p-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-800 text-emerald-400 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL & ACTION MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-dark-900 border border-white/15 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-bold text-brand-violet">Invoice Details</span>
                <h3 className="text-xl font-mono font-bold text-white mt-0.5">
                  {selectedInvoice.invoice_number}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Client Info */}
            <div className="p-3 rounded-xl bg-dark-950 border border-white/5 grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-500">Customer:</span>
                <div className="font-semibold text-white">{selectedInvoice.customer_name}</div>
              </div>
              <div>
                <span className="text-slate-500">Phone:</span>
                <div className="font-mono text-white">{selectedInvoice.customer_phone || 'Walk-in'}</div>
              </div>
              <div>
                <span className="text-slate-500">Date:</span>
                <div className="text-slate-300">{formatDateTime(selectedInvoice.created_at)}</div>
              </div>
              <div>
                <span className="text-slate-500">Status:</span>
                <div className="font-bold text-emerald-400">{selectedInvoice.status}</div>
              </div>
            </div>

            {/* Line items table */}
            <div className="space-y-1.5 text-xs">
              <div className="font-semibold text-slate-300">Itemized Breakdown</div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1">
                {selectedInvoice.items?.map((it, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded-lg bg-dark-800 border border-white/5 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium text-white">{it.name}</div>
                      <div className="text-[10px] text-slate-400">
                        {it.quantity} x {formatCurrency(it.unit_price, currency)}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-emerald-400">
                      {formatCurrency(it.subtotal, currency)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="p-3 rounded-xl bg-dark-950 border border-white/5 space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">{formatCurrency(selectedInvoice.subtotal, currency)}</span>
              </div>
              {selectedInvoice.discount_amount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatCurrency(selectedInvoice.discount_amount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>GST ({selectedInvoice.tax_rate}%):</span>
                <span className="font-mono text-white">{formatCurrency(selectedInvoice.tax_amount, currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-white pt-1 border-t border-white/10">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-400">{formatCurrency(selectedInvoice.total_amount, currency)}</span>
              </div>
              <div className="flex justify-between font-semibold text-xs text-slate-300">
                <span>Paid:</span>
                <span className="font-mono text-emerald-400">{formatCurrency(selectedInvoice.paid_amount, currency)}</span>
              </div>
            </div>

            {/* Actions & Voids */}
            {actionError && (
              <div className="p-2 rounded-lg bg-rose-500/20 text-rose-300 text-xs">
                {actionError}
              </div>
            )}

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={() => api.invoices.downloadPdf(selectedInvoice.id, selectedInvoice.invoice_number)}
                className="flex-1 py-2 rounded-xl bg-dark-800 hover:bg-dark-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-white/10"
              >
                <Download className="w-3.5 h-3.5" /> PDF
              </button>

              {selectedInvoice.status !== 'CANCELLED' && selectedInvoice.status !== 'REFUNDED' && (
                <>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleCancel(selectedInvoice.id)}
                    className="py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold flex items-center gap-1.5 border border-rose-900/40"
                  >
                    <Ban className="w-3.5 h-3.5" /> Cancel Bill
                  </button>

                  <button
                    disabled={actionLoading}
                    onClick={() => handleRefund(selectedInvoice.id)}
                    className="py-2 px-3 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold flex items-center gap-1.5 border border-amber-900/40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Refund
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
