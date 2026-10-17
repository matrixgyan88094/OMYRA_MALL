import React, { useState } from 'react';
import { ShoppingBag, Search, User, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OmyraMallLogo } from './OmyraMallLogo';

export const Header: React.FC = () => {
  const { 
    cart, 
    activeView, 
    setActiveView, 
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery, 
    setSelectedCategory,
    setSelectedProduct 
  } = useStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [activeMenuTab, setActiveMenuTab] = useState<'Home' | 'Deals' | 'Support'>('Home');

  const handleMenuClick = (tab: 'Home' | 'Deals' | 'Support') => {
    setActiveMenuTab(tab);
    setSelectedProduct(null);
    if (tab === 'Home') {
      setActiveView('store');
      setSelectedCategory('All');
    } else if (tab === 'Deals') {
      setActiveView('store');
      setSearchQuery('deal');
    } else if (tab === 'Support') {
      const el = document.getElementById('footer-contact') || document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200 shadow-2xs overflow-x-hidden">
      {/* ================= TOP NAVBAR ================= */}
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between gap-2 sm:gap-4 md:gap-8">
          
          {/* 1. Left Brand Logo */}
          <button
            onClick={() => {
              setSelectedProduct(null);
              setActiveView('store');
              setSelectedCategory('All');
              setActiveMenuTab('Home');
            }}
            className="flex items-center text-left focus:outline-none cursor-pointer shrink-0"
            title="OMYRA MALL"
          >
            <OmyraMallLogo size="sm" className="sm:hidden" />
            <OmyraMallLogo size="md" className="hidden sm:flex" />
          </button>

          {/* 2. Middle Search Bar: large rounded pill with subtle search icon */}
          <div className="flex-1 max-w-2xl mx-auto hidden sm:block">
            <div className="relative w-full">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeView !== 'store') setActiveView('store');
                }}
                placeholder="Search for products, brands and more..."
                className="w-full h-11 rounded-lg border border-zinc-200 bg-zinc-50/60 pl-11 pr-4 text-sm text-zinc-800 placeholder-zinc-400 focus:bg-white focus:border-[#f95a12] focus:outline-none focus:ring-1 focus:ring-[#f95a12] transition-all"
              />
            </div>
          </div>

          {/* 3. Right Action Controls: Login / Greeting, Sign Up button, Shopping Cart */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
            {activeView === 'checkout' ? (
              /* Personalized greeting matching screenshot on checkout page */
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#101D39] cursor-pointer">
                <User className="h-4 w-4 text-[#101D39]" />
                <span className="hidden xs:inline">Hello, Nurullah</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#8292AC]" />
              </div>
            ) : (
              <>
                {/* Login button */}
                <button
                  onClick={() => setActiveView('library')}
                  className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-zinc-800 hover:text-[#f95a12] transition-colors cursor-pointer px-1 py-1"
                >
                  <User className="h-4 w-4 text-zinc-700" />
                  <span className="hidden xs:inline">Login</span>
                </button>

                {/* Sign Up button - Vibrant orange rounded-xl */}
                <button
                  onClick={() => setActiveView('vendor')}
                  className="h-8 sm:h-10 px-3 sm:px-5 rounded-lg sm:rounded-xl bg-[#f95a12] text-white text-xs sm:text-sm font-semibold shadow-xs hover:bg-[#e04a07] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* Shopping Cart with count badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 text-zinc-800 hover:text-[#f95a12] transition-colors cursor-pointer shrink-0"
              title="Shopping Cart"
            >
              <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.8]" />
              {cartItemCount >= 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 sm:h-5 min-w-[18px] sm:min-w-[20px] items-center justify-center rounded-full bg-[#f95a12] px-1 text-[10px] sm:text-[11px] font-bold text-white shadow-2xs">
                  {cartItemCount === 0 && activeView === 'checkout' ? 1 : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar if screen is small */}
        <div className="pb-2.5 sm:hidden">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'store') setActiveView('store');
              }}
              placeholder="Search products, brands and more..."
              className="w-full h-9 rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:border-[#f95a12] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ================= SECONDARY SUB-MENU BAR (Hidden on checkout to match screenshot) ================= */}
      {activeView !== 'checkout' && (
      <div className="border-t border-zinc-100 bg-white w-full overflow-hidden">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-11 items-center text-xs sm:text-sm overflow-x-auto scrollbar-none w-full">
            {/* Horizontal menu navigation links with orange active indicator */}
            <nav className="flex items-center gap-5 sm:gap-8 overflow-x-auto scrollbar-none h-full min-w-0 flex-1">
              {[
                { name: 'Home', tab: 'Home' as const },
                { name: 'Deals', tab: 'Deals' as const },
                { name: 'Support', tab: 'Support' as const },
              ].map((item) => {
                const isActive = activeMenuTab === item.tab;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleMenuClick(item.tab)}
                    className={`relative h-full flex items-center text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer py-3 shrink-0 ${
                      isActive 
                        ? 'text-[#f95a12]' 
                        : 'text-zinc-700 hover:text-zinc-950'
                    }`}
                  >
                    <span>{item.name}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#f95a12] rounded-t-full" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
      )}
    </header>
  );
};
