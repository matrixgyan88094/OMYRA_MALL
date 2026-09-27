import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Mail, 
  Fingerprint, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ChevronLeft, 
  ChevronRight,
  Database,
  ShieldCheck
} from 'lucide-react';

import { OverviewTab } from './OverviewTab';
import { ProductsTab } from './ProductsTab';
import { OrdersTab } from './OrdersTab';
import { ResendTab } from './ResendTab';
import { SecurityTab } from './SecurityTab';
import { SettingsTab } from './SettingsTab';

interface AdminLayoutProps {
  token: string;
  adminEmail: string;
  currentAlias: string;
  onLogout: () => void;
  onGoHome: () => void;
  onAliasUpdated: (newAlias: string) => void;
  onEmailUpdated: (newEmail: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  token,
  adminEmail,
  currentAlias,
  onLogout,
  onGoHome,
  onAliasUpdated,
  onEmailUpdated
}) => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Inventory', icon: Package },
    { id: 'orders', label: 'Orders & Licenses', icon: ShoppingBag },
    { id: 'resend', label: 'Resend.com Email', icon: Mail },
    { id: 'security', label: 'Security & Passkeys', icon: Fingerprint, badge: 'FIDO2' },
    { id: 'settings', label: 'Routing & Database', icon: Settings },
  ];

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Alias Badge */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-lg shadow-sm shadow-orange-600/30">
              K
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">Kroma Studio</span>
                <span className="px-2 py-0.5 rounded-md bg-orange-100/70 border border-orange-200 text-orange-800 text-[10px] font-mono font-bold">
                  /{currentAlias}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Single-Vendor Master Admin</div>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            <button
              onClick={onGoHome}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
            >
              <span>View Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="hidden md:block text-right">
                <div className="text-xs font-bold text-slate-900 max-w-[160px] truncate">{adminEmail}</div>
                <div className="text-[10px] text-emerald-600 font-medium flex items-center justify-end gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Authenticated
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign Out of Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Top Smooth Horizontal Slidable Menu */}
        <div className="border-t border-slate-100 bg-white relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative flex items-center">
            {/* Scroll Left Button */}
            <button
              onClick={() => handleScroll('left')}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors mr-2 shrink-0"
              aria-label="Scroll menu left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={scrollContainerRef}
              className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar scroll-smooth w-full"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all select-none ${
                      isActive
                        ? 'bg-orange-600 text-white shadow-sm shadow-orange-600/25'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          isActive
                            ? 'bg-white/25 text-white'
                            : 'bg-orange-100 text-orange-700 border border-orange-200'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => handleScroll('right')}
              className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-2 shrink-0"
              aria-label="Scroll menu right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        {activeTab === 'overview' && (
          <OverviewTab token={token} onNavigateTab={(tab) => setActiveTab(tab)} />
        )}
        {activeTab === 'products' && <ProductsTab token={token} />}
        {activeTab === 'orders' && <OrdersTab token={token} />}
        {activeTab === 'resend' && <ResendTab token={token} />}
        {activeTab === 'security' && (
          <SecurityTab
            token={token}
            adminEmail={adminEmail}
            onEmailUpdated={onEmailUpdated}
            onSessionExpired={onLogout}
          />
        )}
        {activeTab === 'settings' && (
          <SettingsTab
            token={token}
            currentAlias={currentAlias}
            onAliasUpdated={onAliasUpdated}
          />
        )}
      </main>

      {/* Admin Minimal Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 px-6 text-center text-xs text-slate-400">
        Kroma Studio Admin Gateway • Neon PostgreSQL & Resend.com Integrated Engine
      </footer>
    </div>
  );
};
