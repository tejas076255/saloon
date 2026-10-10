import React, { useState } from 'react';
import {
  Scissors, LayoutDashboard, Receipt, Users, ShoppingBag, BarChart3,
  CreditCard, Settings, LogOut, Menu, X, Plus, Sparkles, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthContext';

interface DashboardLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, salon, logout } = useAuth();

  const navigation = [
    { id: 'billing', name: 'POS Billing', icon: Receipt, badge: 'Fast POS' },
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'invoices', name: 'Invoices & History', icon: Receipt },
    { id: 'customers', name: 'Customers & CRM', icon: Users },
    { id: 'catalog', name: 'Services & Products', icon: ShoppingBag },
    { id: 'reports', name: 'Reports & Analytics', icon: BarChart3 },
    { id: 'subscriptions', name: 'Subscription Plan', icon: CreditCard, badge: 'Pro' },
    { id: 'settings', name: 'Salon Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-dark-900 border-b border-white/10 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-purple flex items-center justify-center text-white">
            <Scissors className="w-4 h-4 transform -rotate-45" />
          </div>
          <div>
            <div className="text-sm font-bold text-white font-display leading-tight">{salon?.name || 'SalonDesk'}</div>
            <div className="text-[10px] text-brand-violet">POS Terminal</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('billing')}
            className="px-2.5 py-1.5 rounded-lg bg-brand-purple text-white text-xs font-semibold flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Bill
          </button>
          <button
            onClick={logout}
            className="p-1.5 rounded-lg bg-dark-800 text-slate-400 hover:text-rose-400 text-xs"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-dark-900 border-r border-white/10 flex flex-col justify-between transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-violet flex items-center justify-center text-white shadow-md shadow-brand-purple/30">
                <Scissors className="w-5 h-5 transform -rotate-45" />
              </div>
              <div className="overflow-hidden">
                <div className="text-base font-bold text-white font-display truncate">
                  {salon?.name || 'SalonDesk'}
                </div>
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="truncate">{salon?.city || 'Terminal 01'}</span>
                </div>
              </div>
            </div>

            {/* Quick Bill Action in Sidebar */}
            <button
              onClick={() => { onSelectTab('billing'); setMobileSidebarOpen(false); }}
              id="sidebar-new-bill-btn"
              className="mt-4 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-violet hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-purple/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Bill</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  id={`nav-tab-${item.id}`}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-brand-purple text-white shadow-md shadow-brand-purple/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-brand-violet/20 text-brand-violet'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile and logout */}
        <div className="p-4 border-t border-white/10 bg-dark-950/40">
          <div className="flex items-center justify-between mb-3">
            <div className="overflow-hidden pr-2">
              <div className="text-xs font-semibold text-white truncate">{user?.full_name}</div>
              <div className="text-[10px] text-slate-400 truncate">{user?.email}</div>
            </div>
            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-brand-violet/20 text-brand-violet border border-brand-violet/30 shrink-0">
              {salon?.role || 'Owner'}
            </span>
          </div>

          <button
            onClick={logout}
            id="dashboard-logout-btn"
            className="w-full py-2 px-3 rounded-lg bg-dark-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 text-xs font-medium flex items-center justify-center gap-2 border border-white/5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 bg-slate-950 flex flex-col h-screen overflow-y-auto">
        {/* Top desktop header bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-4 bg-dark-900/60 border-b border-white/5 backdrop-blur-md sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-white capitalize font-display">
              {navigation.find(n => n.id === currentTab)?.name || currentTab}
            </h1>
            <div className="text-xs text-slate-400">
              Workspace: <span className="text-white font-medium">{salon?.name}</span> • Currency: <span className="text-brand-gold font-bold">{salon?.currency || '₹'}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Fast POS Mode Active</span>
            </div>

            <button
              onClick={() => onSelectTab('billing')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-purple to-indigo-600 hover:from-brand-violet hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-brand-purple/20 transition-all hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Bill</span>
            </button>

            <button
              onClick={logout}
              id="topbar-logout-btn"
              title="Sign Out of Salon"
              className="px-3.5 py-2 rounded-xl bg-dark-800 hover:bg-rose-950/50 hover:text-rose-400 text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* View body */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>

    </div>
  );
};
