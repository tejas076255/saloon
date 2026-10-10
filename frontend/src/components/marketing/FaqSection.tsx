import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "Does SalonDesk work on my iPad, tablet, Android phone, or PC?",
      a: "Yes! SalonDesk is a modern cloud web application built with responsive mobile-first architecture. It runs smoothly inside any modern browser (Chrome, Safari, Edge) on your front-desk tablet, laptop, iPad, or personal smartphone without requiring bulky software installs."
    },
    {
      q: "Can I connect my thermal receipt printer?",
      a: "Absolutely. SalonDesk includes built-in thermal print formatting designed specifically for standard 80mm and 58mm thermal printers (USB, Bluetooth, or WiFi). Tap 'Print Receipt' and it immediately sends a clean receipt to your connected printer."
    },
    {
      q: "How does WhatsApp receipt sharing work?",
      a: "When a bill is generated, SalonDesk creates a one-click WhatsApp action. Clicking it opens the customer's WhatsApp chat with a personalized thank-you message and receipt summary, saving hundreds of rupees on SMS pack costs."
    },
    {
      q: "Is our salon financial data safe and isolated from other salons?",
      a: "Yes. SalonDesk enforces multi-tenant security architecture with strict workspace tenant boundaries. Every query verifies your salon membership and role. Users from one salon cannot access or export records belonging to another salon."
    },
    {
      q: "Can I configure my own salon currency and GST / VAT rate?",
      a: "Yes. In your Salon Settings, you can set your currency symbol (default ₹), tax name (e.g. GST), and exact percentage (e.g. 18% or 5%). You can also disable taxes entirely if you operate as a composition scheme salon."
    },
    {
      q: "Can multiple staff members bill at the same counter simultaneously?",
      a: "Yes. With SalonDesk's real-time cloud database, multiple barbers or stylists can add items or search clients from their phones or tablets while the front desk receptionist collects payments."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-dark-950 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-brand-violet" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Everything you need to know about setting up SalonDesk for your salon or barber shop.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-dark-900 border border-white/10 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 text-white font-semibold text-base hover:text-brand-violet transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-brand-violet' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
