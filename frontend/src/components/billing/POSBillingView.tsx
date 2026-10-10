import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Minus, Trash2, User, Phone, Sparkles, CreditCard,
  Printer, Send, Download, CheckCircle, Percent, AlertCircle, ShoppingBag,
  Scissors, Tag, Smartphone, Banknote, ShieldAlert
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../lib/api';
import { useAuth } from '../../lib/auth/AuthContext';
import { formatCurrency, generateWhatsAppReceiptLink } from '../../lib/utils/formatters';
import type { ServiceItem, ProductItem, Customer, Invoice, InvoiceItem } from '../../types';

interface POSBillingViewProps {
  onViewInvoiceHistory?: () => void;
}

export const POSBillingView: React.FC<POSBillingViewProps> = () => {
  const { salon } = useAuth();
  const currency = salon?.currency || '₹';
  const taxRate = salon?.tax_rate ?? 18.0;

  // Catalog state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeCatalogTab, setActiveCatalogTab] = useState<'services' | 'products'>('services');
  const [serviceSearch, setServiceSearch] = useState('');
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);

  // Customer state
  const [customerSearch, setCustomerSearch] = useState('');
  const [customersList, setCustomersList] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [walkInName, setWalkInName] = useState('Walk-in Client');
  const [walkInPhone, setWalkInPhone] = useState('');
  const [isWalkIn, setIsWalkIn] = useState(true);

  // Cart state
  const [cart, setCart] = useState<InvoiceItem[]>([]);
  const [discountType, setDiscountType] = useState<'fixed' | 'percent'>('fixed');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [notes, setNotes] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'UPI' | 'CARD' | 'SPLIT'>('UPI');
  const [cashAmount, setCashAmount] = useState<number>(0);
  const [upiAmount, setUpiAmount] = useState<number>(0);
  const [upiReference, setUpiReference] = useState('');
  const [cardAmount, setCardAmount] = useState<number>(0);

  // Submission & Post-bill states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedInvoice, setCompletedInvoice] = useState<Invoice | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showThermalPreview, setShowThermalPreview] = useState(false);

  // Load catalog
  useEffect(() => {
    async function loadCatalog() {
      setIsLoadingCatalog(true);
      try {
        const [srvs, prods] = await Promise.all([
          api.services.list(),
          api.products.list()
        ]);
        setServices(srvs);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load catalog:', err);
      } finally {
        setIsLoadingCatalog(false);
      }
    }
    loadCatalog();
  }, []);

  // Search customers
  useEffect(() => {
    if (!customerSearch.trim()) {
      setCustomersList([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await api.customers.list(customerSearch);
        setCustomersList(results);
      } catch (e) {
        console.error(e);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  // Cart operations
  const addToCart = (item: ServiceItem | ProductItem, type: 'service' | 'product') => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item_type === type && (type === 'service' ? i.service_id === item.id : i.product_id === item.id));
      if (existing) {
        return prev.map((i) =>
          i === existing
            ? { ...i, quantity: i.quantity + 1, subtotal: round((i.quantity + 1) * i.unit_price) }
            : i
        );
      }
      return [
        ...prev,
        {
          item_type: type,
          service_id: type === 'service' ? item.id : undefined,
          product_id: type === 'product' ? item.id : undefined,
          name: item.name,
          quantity: 1,
          unit_price: item.price,
          subtotal: item.price
        }
      ];
    });
  };

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? { ...item, quantity: newQty, subtotal: round(newQty * item.unit_price) }
          : item
      )
    );
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setWalkInName('Walk-in Client');
    setWalkInPhone('');
    setIsWalkIn(true);
    setDiscountValue(0);
    setNotes('');
    setUpiReference('');
  };

  const round = (num: number) => Math.round((num + Number.EPSILON) * 100) / 100;

  // Financial calculations
  const subtotal = round(cart.reduce((acc, curr) => acc + curr.subtotal, 0));
  
  let discountAmount = 0;
  if (discountType === 'percent') {
    discountAmount = round(subtotal * (Math.min(100, Math.max(0, discountValue)) / 100));
  } else {
    discountAmount = round(Math.min(subtotal, Math.max(0, discountValue)));
  }

  const taxableAmount = Math.max(0, round(subtotal - discountAmount));
  const taxAmount = round(taxableAmount * (taxRate / 100));
  const totalAmount = round(taxableAmount + taxAmount);

  // Synchronize payment default amounts
  useEffect(() => {
    if (paymentMethod === 'CASH') {
      setCashAmount(totalAmount);
      setUpiAmount(0);
      setCardAmount(0);
    } else if (paymentMethod === 'UPI') {
      setUpiAmount(totalAmount);
      setCashAmount(0);
      setCardAmount(0);
    } else if (paymentMethod === 'CARD') {
      setCardAmount(totalAmount);
      setCashAmount(0);
      setUpiAmount(0);
    } else if (paymentMethod === 'SPLIT') {
      if (cashAmount + upiAmount + cardAmount === 0) {
        setUpiAmount(totalAmount);
      }
    }
  }, [totalAmount, paymentMethod]);

  const totalPaid = round(cashAmount + upiAmount + cardAmount);
  const balanceDue = Math.max(0, round(totalAmount - totalPaid));

  // Handle final checkout
  const handleGenerateInvoice = async () => {
    if (cart.length === 0) {
      setErrorMsg('Cannot generate an empty invoice. Please select services or products.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const paymentsPayload = [];
      if (cashAmount > 0) {
        paymentsPayload.push({
          amount: cashAmount,
          payment_method: 'CASH',
          notes: 'Cash in register'
        });
      }
      if (upiAmount > 0) {
        paymentsPayload.push({
          amount: upiAmount,
          payment_method: 'UPI',
          reference_id: upiReference || undefined,
          notes: 'UPI transfer'
        });
      }
      if (cardAmount > 0) {
        paymentsPayload.push({
          amount: cardAmount,
          payment_method: 'CARD',
          notes: 'POS Card swipe'
        });
      }

      // Unique idempotency key to prevent duplicate clicks
      const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const invoicePayload = {
        customer_id: isWalkIn ? undefined : selectedCustomer?.id,
        customer_name: isWalkIn ? (walkInName || 'Walk-in Client') : selectedCustomer!.name,
        customer_phone: isWalkIn ? (walkInPhone || undefined) : selectedCustomer?.phone,
        idempotency_key: idempotencyKey,
        items: cart.map((i) => ({
          item_type: i.item_type,
          service_id: i.service_id,
          product_id: i.product_id,
          name: i.name,
          quantity: i.quantity,
          unit_price: i.unit_price
        })),
        discount_type: discountType,
        discount_value: discountValue,
        tax_rate: taxRate,
        payments: paymentsPayload,
        notes: notes || undefined
      };

      const result = await api.invoices.create(invoicePayload);
      setCompletedInvoice(result);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });

      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to generate invoice. Please review input.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter catalog items
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6">
      
      {/* LEFT COLUMN: Catalog Selector & Customer Quick Lookup */}
      <div className="flex-1 flex flex-col gap-4 min-w-0">
        
        {/* Customer Select Bar */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <User className="w-4 h-4 text-brand-violet" />
              <span>Customer Identification</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setIsWalkIn(true); setSelectedCustomer(null); }}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isWalkIn
                    ? 'bg-brand-violet text-white shadow-sm'
                    : 'bg-dark-800 text-slate-400 hover:text-white'
                }`}
              >
                ⚡ Quick Walk-in
              </button>
              <button
                type="button"
                onClick={() => setIsWalkIn(false)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  !isWalkIn
                    ? 'bg-brand-violet text-white shadow-sm'
                    : 'bg-dark-800 text-slate-400 hover:text-white'
                }`}
              >
                Registered Client
              </button>
            </div>
          </div>

          {isWalkIn ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <input
                type="text"
                value={walkInName}
                onChange={(e) => setWalkInName(e.target.value)}
                placeholder="Client Name (e.g. Walk-in Client)"
                className="px-3.5 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-brand-violet outline-none"
              />
              <input
                type="tel"
                value={walkInPhone}
                onChange={(e) => setWalkInPhone(e.target.value)}
                placeholder="Phone (Optional for WhatsApp receipt)"
                className="px-3.5 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-brand-violet outline-none"
              />
            </div>
          ) : (
            <div className="relative pt-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  placeholder="Search client by name or 10-digit phone number..."
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-brand-violet outline-none"
                />
              </div>

              {/* Autocomplete dropdown */}
              {customersList.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 max-h-48 overflow-y-auto rounded-xl bg-dark-850 border border-white/15 shadow-2xl p-1 space-y-1">
                  {customersList.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setSelectedCustomer(c);
                        setCustomerSearch('');
                        setCustomersList([]);
                      }}
                      className="w-full p-2 rounded-lg text-left hover:bg-dark-700 flex items-center justify-between text-xs transition-colors"
                    >
                      <div>
                        <div className="font-semibold text-white">{c.name}</div>
                        <div className="text-[10px] text-slate-400">{c.phone || 'No phone'}</div>
                      </div>
                      <span className="text-[10px] text-brand-gold font-medium">
                        {c.total_visits} visits
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {selectedCustomer && (
                <div className="mt-2 p-2.5 rounded-xl bg-dark-800 border border-brand-violet/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-white">{selectedCustomer.name}</span>
                    <span className="text-slate-400 ml-2 font-mono">{selectedCustomer.phone}</span>
                    {selectedCustomer.preferences && (
                      <div className="text-[10px] text-brand-gold mt-0.5 italic">
                        Note: {selectedCustomer.preferences}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedCustomer(null)}
                    className="text-slate-400 hover:text-rose-400 text-xs"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Catalog Selector Header */}
        <div className="p-4 rounded-2xl bg-dark-900 border border-white/10 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-dark-950 border border-white/5 w-full sm:w-auto">
            <button
              onClick={() => setActiveCatalogTab('services')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeCatalogTab === 'services'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Services Menu ({services.length})</span>
            </button>
            <button
              onClick={() => setActiveCatalogTab('products')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                activeCatalogTab === 'products'
                  ? 'bg-brand-purple text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Retail Stock ({products.length})</span>
            </button>
          </div>

          {/* Catalog Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
            <input
              type="text"
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              placeholder={`Search ${activeCatalogTab}...`}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:border-brand-violet outline-none"
            />
          </div>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto max-h-[520px] p-1">
          {activeCatalogTab === 'services' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredServices.map((service) => (
                <button
                  key={service.id}
                  onClick={() => addToCart(service, 'service')}
                  className="p-3.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-white/5 hover:border-brand-violet/50 text-left transition-all duration-150 group shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-brand-violet transition-colors line-clamp-1">
                      {service.name}
                    </div>
                    {service.description && (
                      <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                        {service.description}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      {formatCurrency(service.price, currency)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {service.duration_minutes}m
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredProducts.map((prod) => (
                <button
                  key={prod.id}
                  onClick={() => addToCart(prod, 'product')}
                  className="p-3.5 rounded-xl bg-dark-900 hover:bg-dark-850 border border-white/5 hover:border-brand-gold/50 text-left transition-all duration-150 group shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-brand-gold transition-colors line-clamp-1">
                      {prod.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      SKU: {prod.sku || 'N/A'}
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      {formatCurrency(prod.price, currency)}
                    </span>
                    <span className={`text-[10px] font-medium ${
                      prod.stock_quantity <= prod.low_stock_threshold ? 'text-rose-400' : 'text-slate-400'
                    }`}>
                      Qty: {prod.stock_quantity}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* RIGHT COLUMN: Active Cart, Financial Calculator & Checkout */}
      <div className="w-full lg:w-96 flex flex-col rounded-2xl bg-dark-900 border border-white/10 shadow-2xl p-4 md:p-5">
        
        {/* Cart Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-brand-violet" />
            <span className="text-sm font-bold text-white font-display">Active Invoice Cart</span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[11px] text-rose-400 hover:text-rose-300 font-medium"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto max-h-56 space-y-2 mb-3 pr-1">
          {cart.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <ShoppingBag className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <span>Your cart is empty.</span>
              <div className="text-[10px] text-slate-600 mt-1">Tap services or retail items on the left to add.</div>
            </div>
          ) : (
            cart.map((item, idx) => (
              <div
                key={idx}
                className="p-2.5 rounded-xl bg-dark-950 border border-white/5 flex items-center justify-between gap-2 text-xs"
              >
                <div className="overflow-hidden min-w-0 flex-1">
                  <div className="font-semibold text-white truncate">{item.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {formatCurrency(item.unit_price, currency)} each
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => updateQuantity(idx, item.quantity - 1)}
                    className="w-6 h-6 rounded-md bg-dark-800 hover:bg-dark-700 text-slate-200 flex items-center justify-center"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-5 text-center font-bold text-white font-mono">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(idx, item.quantity + 1)}
                    className="w-6 h-6 rounded-md bg-dark-800 hover:bg-dark-700 text-slate-200 flex items-center justify-center"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>

                <div className="font-bold text-emerald-400 font-mono text-right w-14 shrink-0">
                  {formatCurrency(item.subtotal, currency)}
                </div>

                <button
                  onClick={() => removeFromCart(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Discount & Calculations */}
        <div className="pt-3 border-t border-white/10 space-y-2 text-xs">
          
          {/* Discount input */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-[11px] shrink-0">Discount:</span>
            <div className="flex items-center rounded-lg bg-dark-950 border border-white/10 p-0.5 flex-1">
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  discountType === 'fixed' ? 'bg-brand-violet text-white' : 'text-slate-400'
                }`}
              >
                {currency} Fixed
              </button>
              <button
                type="button"
                onClick={() => setDiscountType('percent')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  discountType === 'percent' ? 'bg-brand-violet text-white' : 'text-slate-400'
                }`}
              >
                % Percent
              </button>
              <input
                type="number"
                min="0"
                value={discountValue || ''}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                placeholder="0"
                className="w-16 ml-1 px-1.5 py-0.5 bg-transparent text-right font-mono text-white outline-none"
              />
            </div>
          </div>

          {/* Breakdown summary */}
          <div className="space-y-1 pt-1 text-slate-400 text-xs">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white">{formatCurrency(subtotal, currency)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Discount ({discountType === 'percent' ? `${discountValue}%` : 'Flat'})</span>
                <span className="font-mono">-{formatCurrency(discountAmount, currency)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{salon?.tax_name || 'GST'} ({taxRate}%)</span>
              <span className="font-mono text-white">{formatCurrency(taxAmount, currency)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/10">
              <span>Total Payable</span>
              <span className="font-mono text-emerald-400">{formatCurrency(totalAmount, currency)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-3 pt-3 border-t border-white/10 space-y-2.5">
          <div className="text-[11px] font-semibold text-slate-300">Payment Channel</div>
          
          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={() => setPaymentMethod('UPI')}
              className={`p-1.5 rounded-lg text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'UPI'
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-400/50 shadow-sm'
                  : 'bg-dark-950 text-slate-400 border border-white/5'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>UPI</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('CASH')}
              className={`p-1.5 rounded-lg text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'CASH'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-400/50 shadow-sm'
                  : 'bg-dark-950 text-slate-400 border border-white/5'
              }`}
            >
              <Banknote className="w-3.5 h-3.5" />
              <span>Cash</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('CARD')}
              className={`p-1.5 rounded-lg text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'CARD'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-400/50 shadow-sm'
                  : 'bg-dark-950 text-slate-400 border border-white/5'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Card</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('SPLIT')}
              className={`p-1.5 rounded-lg text-center text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                paymentMethod === 'SPLIT'
                  ? 'bg-brand-violet text-white border border-brand-violet shadow-sm'
                  : 'bg-dark-950 text-slate-400 border border-white/5'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
          </div>

          {/* Conditional Payment Inputs */}
          {paymentMethod === 'UPI' && (
            <input
              type="text"
              value={upiReference}
              onChange={(e) => setUpiReference(e.target.value)}
              placeholder="UPI Reference / UTR Number (Optional)"
              className="w-full px-3 py-1.5 rounded-xl bg-dark-950 border border-white/10 text-xs text-white placeholder-slate-500 outline-none"
            />
          )}

          {paymentMethod === 'SPLIT' && (
            <div className="p-2.5 rounded-xl bg-dark-950 border border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cash Amount:</span>
                <input
                  type="number"
                  min="0"
                  value={cashAmount || ''}
                  onChange={(e) => setCashAmount(Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded bg-dark-900 border border-white/10 text-right text-white font-mono"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">UPI Amount:</span>
                <input
                  type="number"
                  min="0"
                  value={upiAmount || ''}
                  onChange={(e) => setUpiAmount(Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded bg-dark-900 border border-white/10 text-right text-white font-mono"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Card Amount:</span>
                <input
                  type="number"
                  min="0"
                  value={cardAmount || ''}
                  onChange={(e) => setCardAmount(Number(e.target.value))}
                  className="w-24 px-2 py-1 rounded bg-dark-900 border border-white/10 text-right text-white font-mono"
                />
              </div>
              {balanceDue > 0 && (
                <div className="text-[10px] text-amber-400 text-right font-medium">
                  Remaining Unpaid Balance: {formatCurrency(balanceDue, currency)}
                </div>
              )}
            </div>
          )}

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Generate Bill CTA */}
          <button
            onClick={handleGenerateInvoice}
            disabled={isSubmitting || cart.length === 0}
            id="pos-submit-bill-btn"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-xl shadow-emerald-950/40 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Complete Bill & Generate Receipt ({formatCurrency(totalAmount, currency)})</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* POST-BILL SUCCESS MODAL */}
      {completedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl bg-dark-900 border border-white/15 p-6 shadow-2xl text-center space-y-4">
            
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-bold">Bill Generated Successfully</div>
              <h3 className="text-2xl font-black text-white font-mono mt-1">
                {completedInvoice.invoice_number}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {completedInvoice.customer_name} • Total: {formatCurrency(completedInvoice.total_amount, currency)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-dark-950 border border-white/10 space-y-1.5 text-xs text-left">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono text-white">{formatCurrency(completedInvoice.subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST ({completedInvoice.tax_rate}%):</span>
                <span className="font-mono text-white">{formatCurrency(completedInvoice.tax_amount, currency)}</span>
              </div>
              <div className="flex justify-between font-bold text-white pt-1 border-t border-white/10">
                <span>Paid Amount:</span>
                <span className="font-mono text-emerald-400">{formatCurrency(completedInvoice.paid_amount, currency)}</span>
              </div>
            </div>

            {/* Receipt Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => setShowThermalPreview(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-750 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Printer className="w-4 h-4 text-brand-gold" />
                <span>Print 80mm Thermal Receipt</span>
              </button>

              <button
                onClick={() => api.invoices.downloadPdf(completedInvoice.id, completedInvoice.invoice_number)}
                className="w-full py-2.5 px-4 rounded-xl bg-dark-800 hover:bg-dark-750 text-white text-xs font-semibold flex items-center justify-center gap-2 border border-white/10 transition-colors"
              >
                <Download className="w-4 h-4 text-brand-violet" />
                <span>Download Official Tax PDF</span>
              </button>

              {/* Direct WhatsApp Share */}
              <a
                href={generateWhatsAppReceiptLink(
                  completedInvoice.customer_phone,
                  salon?.name || 'SalonDesk',
                  completedInvoice.invoice_number,
                  completedInvoice.total_amount,
                  currency
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Send Receipt via WhatsApp</span>
              </a>
            </div>

            <button
              onClick={() => setCompletedInvoice(null)}
              className="mt-2 text-xs text-slate-400 hover:text-white"
            >
              Start Next Customer Bill →
            </button>
          </div>
        </div>
      )}

      {/* THERMAL 80MM PRINT PREVIEW MODAL */}
      {showThermalPreview && completedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 p-6 shadow-2xl relative">
            <button
              onClick={() => setShowThermalPreview(false)}
              className="absolute top-3 right-3 text-slate-500 hover:text-black font-bold"
            >
              ✕
            </button>

            {/* Thermal Print Receipt Container */}
            <div id="thermal-receipt" className="font-mono text-xs space-y-2 select-text">
              <div className="text-center border-b border-dashed border-slate-300 pb-2">
                <div className="font-bold text-sm tracking-wide">{salon?.name.toUpperCase()}</div>
                <div className="text-[10px] text-slate-600">{salon?.tagline}</div>
                <div className="text-[10px] text-slate-600">{salon?.address} {salon?.city}</div>
                <div className="text-[10px] text-slate-600">Phone: {salon?.phone || 'N/A'}</div>
              </div>

              <div className="flex justify-between text-[11px] border-b border-dashed border-slate-300 py-1">
                <span>INV: {completedInvoice.invoice_number}</span>
                <span>{new Date().toLocaleDateString('en-IN')}</span>
              </div>

              <div className="text-[10px]">
                <div>Client: {completedInvoice.customer_name}</div>
                {completedInvoice.customer_phone && <div>Phone: {completedInvoice.customer_phone}</div>}
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-1 space-y-1">
                {completedInvoice.items.map((it, i) => (
                  <div key={i} className="flex justify-between text-[10px]">
                    <span className="truncate pr-2">{it.quantity}x {it.name}</span>
                    <span className="font-bold shrink-0">{currency}{it.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-0.5 text-[10px] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>{currency}{completedInvoice.subtotal.toFixed(2)}</span>
                </div>
                {completedInvoice.discount_amount > 0 && (
                  <div className="flex justify-between text-slate-700">
                    <span>Discount:</span>
                    <span>-{currency}{completedInvoice.discount_amount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{salon?.tax_name} ({completedInvoice.tax_rate}%):</span>
                  <span>{currency}{completedInvoice.tax_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xs pt-1 border-t border-dashed border-slate-300">
                  <span>TOTAL:</span>
                  <span>{currency}{completedInvoice.total_amount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid:</span>
                  <span>{currency}{completedInvoice.paid_amount.toFixed(2)}</span>
                </div>
              </div>

              <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-600">
                <div>*** THANK YOU FOR VISITING ***</div>
                <div>Computer Generated Tax Receipt</div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded-lg bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Send to Thermal Printer</span>
              </button>
              <button
                onClick={() => setShowThermalPreview(false)}
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
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
