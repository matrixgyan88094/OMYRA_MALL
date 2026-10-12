import React from 'react';
import { Search, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface FilterBarProps {
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ searchInputRef, totalCount }) => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
  } = useStore();

  return (
    <div id="marketplace-catalog" className="w-full pt-8 pb-6 scroll-mt-20">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input with 44px touch target */}
        <div className="relative flex-1 max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            ref={searchInputRef as any}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products, brands, templates, assets..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all min-h-[44px] shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Sort & Count Row */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <span className="text-xs font-medium text-zinc-500 whitespace-nowrap">
            <span className="font-semibold text-zinc-900">{totalCount}</span> products
          </span>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 focus:border-orange-500 focus:outline-none min-h-[44px] cursor-pointer shadow-xs"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Releases</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Badge if selected from Hero category cards or search query */}
      {(selectedCategory !== 'All' || searchQuery) && (
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs">
              <span>Category: <strong>{selectedCategory}</strong></span>
              <button
                onClick={() => setSelectedCategory('All')}
                className="hover:text-orange-950 transition-colors cursor-pointer"
                title="Clear category filter"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 border border-zinc-200 shadow-2xs">
              <span>Search: &ldquo;{searchQuery}&rdquo;</span>
              <button
                onClick={() => setSearchQuery('')}
                className="hover:text-zinc-950 transition-colors cursor-pointer"
                title="Clear search query"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="text-xs text-orange-600 hover:text-orange-700 hover:underline cursor-pointer ml-1"
          >
            Clear filter
          </button>
        </div>
      )}
    </div>
  );
};
