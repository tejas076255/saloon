import React, { useState, useEffect } from 'react';
import {
  Scissors, ShoppingBag, Plus, Search, Edit3, CheckCircle2,
  AlertTriangle, X, Tag, Package
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth/AuthContext';
import { formatCurrency } from '../../lib/utils/formatters';
import type { ServiceItem, ProductItem, ServiceCategory } from '../../types';

export const CatalogView: React.FC = () => {
  const { salon } = useAuth();
  const currency = salon?.currency || '₹';

  const [activeTab, setActiveTab] = useState<'services' | 'products'>('services');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State for Service
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState<number>(350);
  const [serviceDuration, setServiceDuration] = useState<number>(30);
  const [serviceDesc, setServiceDesc] = useState('');
  const [serviceCategory, setServiceCategory] = useState<string>('');

  // Modal State for Product
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(450);
  const [prodStock, setProdStock] = useState<number>(10);
  const [prodThreshold, setProdThreshold] = useState<number>(3);

  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const [srvs, prods, cats] = await Promise.all([
        api.services.list(),
        api.products.list(),
        api.services.getCategories()
      ]);
      setServices(srvs);
      setProducts(prods);
      setCategories(cats);
      if (cats.length > 0 && !serviceCategory) {
        setServiceCategory(cats[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      await api.services.create({
        name: serviceName,
        price: servicePrice,
        duration_minutes: serviceDuration,
        description: serviceDesc || undefined,
        category_id: serviceCategory || undefined,
        is_active: true
      });
      setIsServiceModalOpen(false);
      setServiceName('');
      setServiceDesc('');
      fetchCatalog();
    } catch (err: any) {
      setModalError(err.message || 'Failed to save service');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    setModalError(null);
    try {
      await api.products.create({
        name: prodName,
        sku: prodSku || undefined,
        price: prodPrice,
        stock_quantity: prodStock,
        low_stock_threshold: prodThreshold,
        is_active: true
      });
      setIsProductModalOpen(false);
      setProdName('');
      setProdSku('');
      fetchCatalog();
    } catch (err: any) {
      setModalError(err.message || 'Failed to save product');
    } finally {
      setModalLoading(false);
    }
  };

  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Navigation and Add Button */}
      <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Tab switch */}
        <div className="flex items-center p-1 rounded-xl bg-dark-950 border border-white/5 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('services')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'services'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Services Menu ({services.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'products'
                ? 'bg-brand-purple text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Retail Inventory ({products.length})</span>
          </button>
        </div>

        {/* Search & Add CTA */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${activeTab}...`}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-brand-violet outline-none"
            />
          </div>

          {activeTab === 'services' ? (
            <button
              onClick={() => setIsServiceModalOpen(true)}
              id="btn-add-service"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-violet hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-purple/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          ) : (
            <button
              onClick={() => setIsProductModalOpen(true)}
              id="btn-add-product"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-violet hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-purple/20 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product</span>
            </button>
          )}
        </div>

      </div>

      {/* Catalog Table */}
      <div className="rounded-2xl bg-dark-900 border border-white/10 shadow-lg overflow-hidden">
        {activeTab === 'services' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-850 text-slate-400 border-b border-white/5">
                <tr>
                  <th className="p-4 font-semibold">Service Name</th>
                  <th className="p-4 font-semibold">Duration</th>
                  <th className="p-4 font-semibold text-right">Price</th>
                  <th className="p-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredServices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      No services found. Add your first service above!
                    </td>
                  </tr>
                ) : (
                  filteredServices.map((s) => (
                    <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{s.name}</div>
                        {s.description && (
                          <div className="text-[10px] text-slate-400 mt-0.5">{s.description}</div>
                        )}
                      </td>
                      <td className="p-4 text-slate-300 font-mono">
                        {s.duration_minutes} minutes
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        {formatCurrency(s.price, currency)}
                      </td>
                      <td className="p-4 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-dark-850 text-slate-400 border-b border-white/5">
                <tr>
                  <th className="p-4 font-semibold">Product Name</th>
                  <th className="p-4 font-semibold">SKU</th>
                  <th className="p-4 font-semibold text-center">In Stock</th>
                  <th className="p-4 font-semibold text-right">Selling Price</th>
                  <th className="p-4 font-semibold text-center">Stock Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-500">
                      No retail products added yet.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 font-bold text-white text-sm">{p.name}</td>
                      <td className="p-4 font-mono text-slate-400">{p.sku || 'N/A'}</td>
                      <td className="p-4 text-center font-mono font-bold text-white">
                        {p.stock_quantity} units
                      </td>
                      <td className="p-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        {formatCurrency(p.price, currency)}
                      </td>
                      <td className="p-4 text-center">
                        {p.stock_quantity <= p.low_stock_threshold ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 flex items-center justify-center gap-1 w-max mx-auto">
                            <AlertTriangle className="w-3 h-3" /> Low Stock
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 w-max mx-auto block">
                            In Stock
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD SERVICE MODAL */}
      {isServiceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-dark-900 border border-white/15 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Scissors className="w-4 h-4 text-brand-violet" /> Add Salon Service
              </h3>
              <button
                onClick={() => setIsServiceModalOpen(false)}
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

            <form onSubmit={handleCreateService} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. Keratin Smooth Therapy"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Price ({currency}) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white font-mono focus:border-brand-violet outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={serviceDuration}
                    onChange={(e) => setServiceDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white font-mono focus:border-brand-violet outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={serviceCategory}
                  onChange={(e) => setServiceCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white focus:border-brand-violet outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  value={serviceDesc}
                  onChange={(e) => setServiceDesc(e.target.value)}
                  placeholder="Includes hair wash, head steam and styling"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-violet text-white font-bold transition-colors disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : 'Add to Menu'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* ADD PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-dark-900 border border-white/15 p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-brand-gold" /> Add Retail Product
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
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

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="e.g. Argan Oil Hair Serum (100ml)"
                  className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white placeholder-slate-500 focus:border-brand-violet outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">SKU / Barcode</label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    placeholder="SKU-8871"
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white font-mono focus:border-brand-violet outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Retail Price ({currency}) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white font-mono focus:border-brand-violet outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Initial Stock Units</label>
                  <input
                    type="number"
                    min="0"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white font-mono focus:border-brand-violet outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Low-Stock Alert Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={prodThreshold}
                    onChange={(e) => setProdThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-dark-950 border border-white/10 text-white font-mono focus:border-brand-violet outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-violet text-white font-bold transition-colors disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : 'Add Product'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
