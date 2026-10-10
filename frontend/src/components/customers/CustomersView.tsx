import React, { useState, useEffect } from 'react';
import {
  Users, Search, Plus, Phone, Mail, Calendar, IndianRupee,
  History, Sparkles, X, CheckCircle, FileText
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth/AuthContext';
import { formatCurrency, formatDate } from '../../lib/utils/formatters';
import type { Customer, Invoice } from '../../types';

export const CustomersView: React.FC = () => {
  const { salon } = useAuth();
  const currency = salon?.currency || '₹';

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // New Customer Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [preferences, setPreferences] = useState('');
  const [notes, setNotes] = useState('');
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Selected Customer Detail Modal
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerInvoices, setCustomerInvoices] = useState<Invoice[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const data = await api.customers.list(search || undefined);
      setCustomers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers();
    }, 200);
    return () => clearTimeout(timer);
  }, [search]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      await api.customers.create({
        name,
        phone: phone || undefined,
        email: email || undefined,
        preferences: preferences || undefined,
        notes: notes || undefined
      });
      setIsAddModalOpen(false);
      setName('');
      setPhone('');
      setEmail('');
      setPreferences('');
      setNotes('');
      fetchCustomers();
    } catch (err: any) {
      setModalError(err.message || 'Failed to create customer');
    } finally {
      setModalLoading(false);
    }
  };

  const handleOpenDetail = async (c: Customer) => {
    setSelectedCustomer(c);
    setHistoryLoading(true);
    try {
      const details = await api.customers.get(c.id);
      setCustomerInvoices(details.invoices);
    } catch (e) {
      console.error(e);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header bar */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers by name, phone or email..."
            className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-brand-violet outline-none"
          />
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          id="btn-add-customer"
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-violet hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-brand-purple/20 flex items-center justify-center gap-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Customers Table */}
      <div className="rounded-2xl bg-dark-900 border border-white/10 shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-dark-850 text-slate-400 border-b border-white/5">
              <tr>
                <th className="p-4 font-semibold">Customer Name</th>
                <th className="p-4 font-semibold">Phone</th>
                <th className="p-4 font-semibold">Preferences / Notes</th>
                <th className="p-4 font-semibold text-center">Visits</th>
                <th className="p-4 font-semibold text-right">Total Spent</th>
                <th className="p-4 font-semibold text-right">Last Visit</th>
                <th className="p-4 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    Loading customers...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No customer records found.
                  </td>
                </tr>
              ) : (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-sm">{c.name}</div>
                      {c.email && <div className="text-[10px] text-slate-500">{c.email}</div>}
                    </td>
                    <td className="p-4 font-mono text-slate-300">
                      {c.phone || <span className="text-slate-600">N/A</span>}
                    </td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">
                      {c.preferences ? (
                        <span className="text-brand-gold italic">"{c.preferences}"</span>
                      ) : (
                        <span className="text-slate-600">—</span>
                      )}
                    </td>
                    <td className="p-4 text-center font-bold text-brand-violet">
                      {c.total_visits}
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-emerald-400">
                      {formatCurrency(c.total_spent, currency)}
                    </td>
                    <td className="p-4 text-right text-slate-400">
                      {formatDate(c.last_visit_at)}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleOpenDetail(c)}
                        className="px-2.5 py-1 rounded-lg bg-dark-800 hover:bg-dark-750 text-slate-200 text-xs font-medium border border-white/5 transition-colors"
                      >
                        History
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD CUSTOMER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-dark-900 border border-white/15 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-violet" /> Add Customer Profile
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalError && (
              <div className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 text-xs">
                {modalError}
              </div>
            )}

            <form onSubmit={handleCreateCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Customer Full Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Yash Vardhan"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Styling Preferences & Hair Cut Notes</label>
                <textarea
                  rows={2}
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  placeholder="e.g. Skin taper fade, side part, sensitive scalp, cold tea"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-violet text-white font-bold transition-colors disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : 'Save Customer'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CUSTOMER DETAIL & HISTORY MODAL */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl bg-dark-900 border border-white/15 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-xs uppercase font-bold text-brand-gold">Customer Visit Profile</span>
                <h3 className="text-xl font-bold text-white mt-0.5">{selectedCustomer.name}</h3>
                <div className="text-xs text-slate-400 font-mono">{selectedCustomer.phone || 'No phone recorded'}</div>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-dark-950 border border-white/5">
                <div className="text-slate-400">Total Visits</div>
                <div className="text-lg font-bold text-brand-violet mt-1">{selectedCustomer.total_visits}</div>
              </div>
              <div className="p-3 rounded-xl bg-dark-950 border border-white/5">
                <div className="text-slate-400">Total Spent</div>
                <div className="text-lg font-bold text-emerald-400 mt-1">{formatCurrency(selectedCustomer.total_spent, currency)}</div>
              </div>
              <div className="p-3 rounded-xl bg-dark-950 border border-white/5">
                <div className="text-slate-400">Last Seen</div>
                <div className="text-xs font-bold text-slate-200 mt-2">{formatDate(selectedCustomer.last_visit_at)}</div>
              </div>
            </div>

            {selectedCustomer.preferences && (
              <div className="p-3 rounded-xl bg-brand-gold/10 border border-brand-gold/20 text-xs">
                <span className="font-bold text-brand-gold uppercase text-[10px] block mb-0.5">Styling Preferences:</span>
                <span className="text-slate-200">{selectedCustomer.preferences}</span>
              </div>
            )}

            {/* Invoices History */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">Previous Bills & Services</div>
              
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {historyLoading ? (
                  <div className="text-center py-6 text-slate-500 text-xs">Loading visit history...</div>
                ) : customerInvoices.length === 0 ? (
                  <div className="text-center py-6 text-slate-500 text-xs">No prior bills found for this customer.</div>
                ) : (
                  customerInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="p-2.5 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-mono font-bold text-brand-violet">{inv.invoice_number}</div>
                        <div className="text-[10px] text-slate-400">{formatDate(inv.created_at)}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono font-bold text-white">{formatCurrency(inv.total_amount, currency)}</div>
                        <span className="text-[10px] font-semibold text-emerald-400">{inv.status}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 rounded-xl bg-dark-800 text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
