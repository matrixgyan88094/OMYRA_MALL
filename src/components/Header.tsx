import React, { useState } from 'react';
import { ShoppingBag, Search, User } from 'lucide-react';
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
    setSelectedCategory 
  } = useStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [activeMenuTab, setActiveMenuTab] = useState<'Home' | 'Digital Products' | 'Creator Hub' | 'Deals' | 'Support'>('Home');

  const handleMenuClick = (tab: 'Home' | 'Digital Products' | 'Creator Hub' | 'Deals' | 'Support') => {
    setActiveMenuTab(tab);
    if (tab === 'Home') {
      setActiveView('store');
      setSelectedCategory('All');
    } else if (tab === 'Digital Products') {
      setActiveView('store');
    } else if (tab === 'Creator Hub') {
      setActiveView('vendor');
    } else if (tab === 'Deals') {
      setActiveView('store');
      setSearchQuery('deal');
    } else if (tab === 'Support') {
      const el = document.getElementById('footer-contact') || document.getElementById('about');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-zinc-200 shadow-2xs">
      {/* ================= TOP NAVBAR ================= */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4 md:gap-8">
          
          {/* 1. Left Brand Logo */}
          <button
            onClick={() => {
              setActiveView('store');
              setSelectedCategory('All');
              setActiveMenuTab('Home');
            }}
            className="flex items-center text-left focus:outline-none cursor-pointer shrink-0"
            title="OMYRA MALL"
          >
            <OmyraMallLogo />
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

          {/* 3. Right Action Controls: Login, Sign Up button (orange pill), Shopping Cart */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Login button */}
            <button
              onClick={() => setActiveView('library')}
              className="flex items-center gap-1.5 text-sm font-semibold text-zinc-800 hover:text-[#f95a12] transition-colors cursor-pointer"
            >
              <User className="h-4 w-4 text-zinc-700" />
              <span>Login</span>
            </button>

            {/* Sign Up button - Vibrant orange rounded-xl */}
            <button
              onClick={() => setActiveView('vendor')}
              className="h-10 px-5 rounded-xl bg-[#f95a12] text-white text-sm font-semibold shadow-xs hover:bg-[#e04a07] active:scale-[0.98] transition-all cursor-pointer"
            >
              Sign Up
            </button>

            {/* Shopping Cart with count badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-zinc-800 hover:text-[#f95a12] transition-colors cursor-pointer"
              title="Shopping Cart"
            >
              <ShoppingBag className="h-6 w-6 stroke-[1.8]" />
              {cartItemCount >= 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#f95a12] px-1 text-[11px] font-bold text-white shadow-2xs">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search bar if screen is small */}
        <div className="pb-3 sm:hidden">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400">
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
              className="w-full h-10 rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:border-[#f95a12] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* ================= SECONDARY SUB-MENU BAR ================= */}
      <div className="border-t border-zinc-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-12 items-center text-sm">
            
            {/* Horizontal menu navigation links with orange active indicator */}
            <nav className="flex items-center gap-7 overflow-x-auto scrollbar-none h-full">
              {[
                { name: 'Home', tab: 'Home' as const },
                { name: 'Digital Products', tab: 'Digital Products' as const },
                { name: 'Creator Hub', tab: 'Creator Hub' as const },
                { name: 'Deals', tab: 'Deals' as const },
                { name: 'Support', tab: 'Support' as const },
              ].map((item) => {
                const isActive = activeMenuTab === item.tab;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleMenuClick(item.tab)}
                    className={`relative h-full flex items-center text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                      isActive 
                        ? 'text-[#f95a12] font-semibold' 
                        : 'text-zinc-600 hover:text-zinc-900'
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
    </header>
  );
};
