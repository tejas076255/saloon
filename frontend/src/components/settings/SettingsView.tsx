import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle2, Store, Phone, Mail, MapPin, IndianRupee, Percent } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth/AuthContext';
import type { Salon } from '../../types';

export const SettingsView: React.FC = () => {
  const { salon, refreshSalon } = useAuth();

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [currency, setCurrency] = useState('₹');
  const [taxName, setTaxName] = useState('GST');
  const [taxRate, setTaxRate] = useState<number>(18.0);

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (salon) {
      setName(salon.name || '');
      setTagline(salon.tagline || '');
      setPhone(salon.phone || '');
      setEmail(salon.email || '');
      setAddress(salon.address || '');
      setCity(salon.city || '');
      setCurrency(salon.currency || '₹');
      setTaxName(salon.tax_name || 'GST');
      setTaxRate(salon.tax_rate ?? 18.0);
    }
  }, [salon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      await api.salons.updateCurrent({
        name,
        tagline,
        phone,
        email,
        address,
        city,
        currency,
        tax_name: taxName,
        tax_rate: taxRate
      });
      await refreshSalon();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update salon settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      <div className="p-6 rounded-2xl bg-dark-900 border border-white/10 shadow-xl space-y-6">
        <div className="pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Settings className="w-5 h-5 text-brand-violet" /> Salon Workspace Settings
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure your brand identity, contact information, and billing tax rates shown on receipts.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Salon settings updated successfully! All future invoices will reflect these changes.</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Salon Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Brand Tagline / Slogan</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Modern Barber Shop & Grooming"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Contact Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98200 12345"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">Support Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@salon.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Physical Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Shop No. 4, Prestige Plaza, MG Road"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">City / Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Mumbai"
                className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-white/10">
            <div className="text-xs font-semibold text-slate-300 mb-3">Currency & Tax Configuration</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-400 font-medium mb-1">Currency Symbol</label>
                <input
                  type="text"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white font-mono focus:border-brand-violet outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Tax Label</label>
                <input
                  type="text"
                  value={taxName}
                  onChange={(e) => setTaxName(e.target.value)}
                  placeholder="GST"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white font-mono focus:border-brand-violet outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Applicable Tax Rate (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-950 border border-white/10 text-white font-mono focus:border-brand-violet outline-none"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              id="settings-save-btn"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-violet hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-brand-purple/20 flex items-center gap-2 disabled:opacity-50 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
