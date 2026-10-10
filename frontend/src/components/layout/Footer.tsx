import React from 'react';
import { Scissors, Mail, Phone, MapPin, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-dark-950 border-t border-white/10 text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-purple to-brand-violet flex items-center justify-center text-white">
                <Scissors className="w-4 h-4 transform -rotate-45" />
              </div>
              <span className="text-lg font-bold text-white font-display">SalonDesk</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              The premier all-in-one SaaS platform built for modern barber shops, styling parlours, and luxury salons.
            </p>
            <div className="text-[11px] text-slate-500">
              © {new Date().getFullYear()} SalonDesk Technologies Inc. All rights reserved.
            </div>
          </div>

          {/* Product links */}
          <div className="space-y-2.5">
            <div className="text-sm font-semibold text-white uppercase tracking-wider">Product</div>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">POS Billing Engine</a></li>
              <li><a href="#workflow" className="hover:text-white transition-colors">Customer CRM & History</a></li>
              <li><a href="#showcase" className="hover:text-white transition-colors">Daily Sales Analytics</a></li>
              <li><a href="#pricing" className="hover:text-white transition-colors">Subscription Plans</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Frequently Asked Questions</a></li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-2.5">
            <div className="text-sm font-semibold text-white uppercase tracking-wider">Security & Legal</div>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GST Compliance</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Isolation Architecture</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Whitepaper</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2.5">
            <div className="text-sm font-semibold text-white uppercase tracking-wider">Support & Help</div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-violet" />
                <span>support@salondesk.io</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-violet" />
                <span>+91 98200 12345 (India Helpline)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-brand-violet" />
                <span>Bandra Kurla Complex, Mumbai</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500">
          <div>Crafted with precision for salon owners worldwide.</div>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Fast • Secure • Multi-Tenant • GST Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
