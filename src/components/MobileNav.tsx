import React from 'react';
import { Store, Search, Download, ShoppingBag, BarChart3 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface MobileNavProps {
  onSearchFocus?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ onSearchFocus }) => {
  const { activeView, setActiveView, cart, setIsCartOpen } = useStore();
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 backdrop-blur-lg pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-1 max-w-lg mx-auto">
        {/* Tab 1: Store */}
        <button
          onClick={() => setActiveView('store')}
          className={`flex min-h-[44px] flex-col items-center justify-center transition-colors ${
            activeView === 'store' ? 'text-orange-600 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Store className="h-5 w-5" />
          <span className="text-[10px] tracking-tight mt-1">Store</span>
        </button>

        {/* Tab 2: Search */}
        <button
          onClick={() => {
            setActiveView('store');
            if (onSearchFocus) {
              onSearchFocus();
            }
          }}
          className="flex min-h-[44px] flex-col items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <Search className="h-5 w-5" />
          <span className="text-[10px] tracking-tight mt-1">Search</span>
        </button>

        {/* Tab 3: My Library */}
        <button
          onClick={() => setActiveView('library')}
          className={`flex min-h-[44px] flex-col items-center justify-center transition-colors ${
            activeView === 'library' ? 'text-orange-600 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <Download className="h-5 w-5" />
          <span className="text-[10px] tracking-tight mt-1">Library</span>
        </button>

        {/* Tab 4: Cart */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex min-h-[44px] flex-col items-center justify-center text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <div className="relative">
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-orange-600 px-1 text-[9px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight mt-1">Bag</span>
        </button>

        {/* Tab 5: Vendor Studio */}
        <button
          onClick={() => setActiveView('vendor')}
          className={`flex min-h-[44px] flex-col items-center justify-center transition-colors ${
            activeView === 'vendor' ? 'text-orange-600 font-semibold' : 'text-zinc-500 hover:text-zinc-900'
          }`}
        >
          <BarChart3 className="h-5 w-5" />
          <span className="text-[10px] tracking-tight mt-1">Studio</span>
        </button>
      </div>
    </div>
  );
};
