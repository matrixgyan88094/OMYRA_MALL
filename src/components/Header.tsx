import React, { useState } from 'react';
import { ShoppingBag, Search, ChevronDown, User, Heart, Sparkles, LayoutGrid, Layers, Code2, Box, Music, Globe } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OmyraMallLogo } from './OmyraMallLogo';

export const Header: React.FC = () => {
  const { cart, activeView, setActiveView, setIsCartOpen, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const categories = [
    { label: 'All Categories', icon: LayoutGrid, cat: 'All' },
    { label: 'UI & Figma', icon: Layers, cat: 'UI & Figma' },
    { label: 'Dev Kits & Boilerplates', icon: Code2, cat: 'Dev Kits' },
    { label: '3D & Spatial Assets', icon: Box, cat: '3D & Spatial' },
    { label: 'Motion & Audio', icon: Music, cat: 'Motion & Audio' },
    { label: 'Web Applications & Themes', icon: Globe, cat: 'Templates' },
  ];

  const handleSelectCategory = (cat: string) => {
    setSelectedCategory(cat);
    setActiveView('store');
    setIsCategoryMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/90 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-zinc-950 text-white text-[11px] font-medium py-1.5 px-4 text-center tracking-wide">
        <span className="text-orange-400 font-semibold mr-1.5">🚀 Verified Digital Assets</span>
        Instant download after purchase • Full commercial rights & continuous updates included
      </div>

      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6 shrink-0">
          <button
            onClick={() => {
              setActiveView('store');
              setSelectedCategory('All');
            }}
            className="flex items-center text-left group focus:outline-none cursor-pointer"
            title="OMYRA MALL"
          >
            <OmyraMallLogo />
          </button>

          {/* Category Dropdown Button */}
          <div className="relative hidden lg:block">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 transition-colors shadow-2xs"
            >
              <LayoutGrid className="h-3.5 w-3.5 text-orange-600" />
              <span>{selectedCategory === 'All' ? 'Categories' : selectedCategory}</span>
              <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {isCategoryMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsCategoryMenuOpen(false)} 
                />
                <div className="absolute left-0 top-full mt-1.5 w-60 rounded-xl border border-zinc-200 bg-white p-1.5 shadow-xl z-20">
                  {categories.map((item) => {
                    const Icon = item.icon;
                    const isActive = selectedCategory === item.cat;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleSelectCategory(item.cat)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-left transition-colors ${
                          isActive 
                            ? 'bg-orange-50 text-orange-600 font-semibold' 
                            : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
                        }`}
                      >
                        <Icon className={`h-4 w-4 ${isActive ? 'text-orange-600' : 'text-zinc-500'}`} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Center Search Input */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
              <Search className="h-4 w-4 text-zinc-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeView !== 'store') setActiveView('store');
              }}
              placeholder="Search UI systems, boilerplates, 3D assets, WordPress..."
              className="w-full rounded-full border border-zinc-200 bg-zinc-50/70 py-2 pl-10 pr-4 text-xs font-medium text-zinc-900 placeholder-zinc-400 focus:bg-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all shadow-2xs"
            />
          </div>
        </div>

        {/* Primary Navigation & Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-zinc-600 mr-2">
            <button
              onClick={() => setActiveView('store')}
              className={`transition-colors hover:text-zinc-950 ${
                activeView === 'store' ? 'text-orange-600 font-semibold' : ''
              }`}
            >
              Explore
            </button>

            <button
              onClick={() => setActiveView('library')}
              className={`transition-colors hover:text-zinc-950 ${
                activeView === 'library' ? 'text-orange-600 font-semibold' : ''
              }`}
            >
              Purchases
            </button>

            <button
              onClick={() => setActiveView('vendor')}
              className={`transition-colors hover:text-zinc-950 ${
                activeView === 'vendor' ? 'text-orange-600 font-semibold' : ''
              }`}
            >
              Seller Studio
            </button>
          </nav>

          {/* Cart / Bag Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 items-center gap-2 rounded-lg bg-orange-600 px-3.5 sm:px-4 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-orange-700 active:scale-[0.98] transition-all whitespace-nowrap"
            title="Shopping Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartItemCount > 0 ? (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-orange-600">
                {cartItemCount}
              </span>
            ) : (
              <span className="hidden sm:inline text-orange-200 font-normal text-xs">(0)</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

