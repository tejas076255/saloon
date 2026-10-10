import React, { useState } from 'react';
import { Scissors, Menu, X, ArrowRight, LogIn, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthContext';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onNavigateToDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onNavigateToDashboard }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, salon, loginDemo } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-violet flex items-center justify-center text-white shadow-lg shadow-brand-purple/30 group-hover:scale-105 transition-transform">
              <Scissors className="w-5 h-5 text-white transform -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                SalonDesk
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-brand-violet/20 text-brand-violet border border-brand-violet/30 tracking-wider">
                  SaaS
                </span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1">Modern Salon POS</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-white transition-colors">How It Works</a>
            <a href="#showcase" className="hover:text-white transition-colors">POS & Billing</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={onNavigateToDashboard}
                id="nav-dashboard-btn"
                className="px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-violet text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-brand-purple/20 transition-all hover:scale-105"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Open Dashboard ({salon?.name || 'Workspace'})</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  id="nav-login-btn"
                  className="px-4 py-2 rounded-xl text-slate-300 hover:text-white text-sm font-medium hover:bg-white/5 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>

                <button
                  onClick={() => loginDemo()}
                  id="nav-demo-btn"
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white text-sm font-medium border border-white/10 transition-colors"
                >
                  ⚡ Try 1-Click Demo
                </button>

                <button
                  onClick={() => onOpenAuth('signup')}
                  id="nav-get-started-btn"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-violet hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-brand-purple/25 transition-all hover:scale-105 flex items-center gap-1.5"
                >
                  <span>Get Started Free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dark-900 border-b border-white/10 px-4 pt-4 pb-6 space-y-4">
          <div className="flex flex-col space-y-3 text-base font-medium text-slate-300">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Features</a>
            <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">How It Works</a>
            <a href="#showcase" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">POS & Billing</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">Pricing</a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-white py-1">FAQ</a>
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <button
                onClick={() => { setMobileMenuOpen(false); onNavigateToDashboard(); }}
                className="w-full py-3 rounded-xl bg-brand-purple text-white font-semibold text-center"
              >
                Go to Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => { setMobileMenuOpen(false); loginDemo(); }}
                  className="w-full py-2.5 rounded-xl bg-white/10 text-white font-medium text-center"
                >
                  ⚡ One-Click Demo
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAuth('login'); }}
                    className="py-2.5 rounded-xl bg-dark-800 text-slate-200 font-medium text-center border border-white/10"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAuth('signup'); }}
                    className="py-2.5 rounded-xl bg-brand-purple text-white font-semibold text-center"
                  >
                    Sign Up
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
