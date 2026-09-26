import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const { cart, activeView, setActiveView, setIsCartOpen } = useStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center">
          <button
            onClick={() => setActiveView('store')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-600 text-base font-bold text-white shadow-sm group-hover:bg-orange-500 transition-colors">
              K
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950 group-hover:text-orange-600 transition-colors">
              Kroma
            </span>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-600">
          <button
            onClick={() => setActiveView('store')}
            className={`transition-colors hover:text-zinc-950 ${
              activeView === 'store' ? 'text-orange-600 font-semibold' : ''
            }`}
          >
            Storefront
          </button>

          <button
            onClick={() => setActiveView('library')}
            className={`transition-colors hover:text-zinc-950 ${
              activeView === 'library' ? 'text-orange-600 font-semibold' : ''
            }`}
          >
            My Library
          </button>

          <button
            onClick={() => setActiveView('vendor')}
            className={`transition-colors hover:text-zinc-950 ${
              activeView === 'vendor' ? 'text-orange-600 font-semibold' : ''
            }`}
          >
            Creator Studio
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex h-10 items-center gap-2 rounded-lg bg-orange-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="hidden sm:inline">Bag</span>
            {cartItemCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-orange-600">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
