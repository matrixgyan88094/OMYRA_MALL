import React, { useState } from 'react';
import { ShoppingBag, Search, User, ChevronDown } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useMenu } from '../context/MenuContext';
import { MenuItem } from '../types/menu';
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
  const { activeHeaderMenu } = useMenu();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [activeMenuTab, setActiveMenuTab] = useState<string>('Home');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

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
      <div className="border-t border-zinc-100 bg-white w-full overflow-visible">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex h-11 items-center text-xs sm:text-sm overflow-x-auto scrollbar-none w-full">
            {/* Horizontal menu navigation links with orange active indicator */}
            <nav className="flex items-center gap-5 sm:gap-8 overflow-x-auto scrollbar-none h-full min-w-0 flex-1">
              {activeHeaderMenu && activeHeaderMenu.items.length > 0 ? (
                activeHeaderMenu.items.map((item) => {
                  const isActive = activeMenuTab === item.title;
                  const hasChildren = Boolean(item.children && item.children.length > 0);

                  if (hasChildren) {
                    return (
                      <div 
                        key={item.id} 
                        className="relative h-full flex items-center group shrink-0"
                        onMouseLeave={() => setOpenDropdownId(null)}
                      >
                        <button
                          onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)}
                          className={`relative h-full flex items-center gap-1 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer py-3 ${
                            isActive || openDropdownId === item.id
                              ? 'text-[#f95a12]' 
                              : 'text-zinc-700 hover:text-zinc-950'
                          }`}
                        >
                          <span>{item.title}</span>
                          {item.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-orange-100 text-orange-700">
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                          {(isActive || openDropdownId === item.id) && (
                            <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#f95a12] rounded-t-full" />
                          )}
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 -mt-1 hidden group-hover:block min-w-[210px] bg-white rounded-xl shadow-lg border border-zinc-200/90 py-1.5 z-50 animate-in fade-in slide-in-from-top-1">
                          {item.children!.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => {
                                handleMenuClick(child.title as any);
                                setSelectedProduct(null);
                                setOpenDropdownId(null);
                                if (child.url.includes('category=')) {
                                  const parts = child.url.split('category=');
                                  if (parts[1]) {
                                    setSelectedCategory(decodeURIComponent(parts[1].replace(/\+/g, ' ')));
                                    setActiveView('store');
                                  }
                                } else if (child.url === '/library') {
                                  setActiveView('library');
                                } else if (child.url === '/vendor') {
                                  setActiveView('vendor');
                                } else if (child.url.startsWith('#')) {
                                  const el = document.getElementById(child.url.replace('#', ''));
                                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                                } else {
                                  setActiveView('store');
                                }
                              }}
                              className="w-full text-left px-4 py-2 text-xs font-semibold text-zinc-700 hover:text-[#f95a12] hover:bg-orange-50/70 transition-colors flex items-center justify-between"
                            >
                              <span>{child.title}</span>
                              {child.badge && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-orange-100 text-orange-700">
                                  {child.badge}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveMenuTab(item.title);
                        setSelectedProduct(null);
                        const url = (item.url || '').trim();

                        if (item.target === '_blank') {
                          window.open(url, '_blank');
                          return;
                        }

                        if (url === '/' || url === '') {
                          setActiveView('store');
                          setSelectedCategory('All');
                        } else if (url.includes('deal')) {
                          setActiveView('store');
                          setSearchQuery('deal');
                        } else if (url === '/library') {
                          setActiveView('library');
                        } else if (url === '/vendor') {
                          setActiveView('vendor');
                        } else if (url === '/checkout') {
                          setActiveView('checkout');
                        } else if (url.startsWith('#')) {
                          const el = document.getElementById(url.replace('#', ''));
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          setActiveView('store');
                        }
                      }}
                      className={`relative h-full flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap cursor-pointer py-3 shrink-0 ${
                        isActive 
                          ? 'text-[#f95a12]' 
                          : 'text-zinc-700 hover:text-zinc-950'
                      }`}
                    >
                      <span>{item.title}</span>
                      {item.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-orange-100 text-orange-700">
                          {item.badge}
                        </span>
                      )}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#f95a12] rounded-t-full" />
                      )}
                    </button>
                  );
                })
              ) : (
                /* Fallback if no items */
                [
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
                })
              )}
            </nav>
          </div>
        </div>
      </div>
      )}
    </header>
  );
};
