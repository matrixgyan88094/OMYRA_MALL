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
    selectedFormat,
    setSelectedFormat,
    sortBy,
    setSortBy,
  } = useStore();

  const categories = ['All', 'UI & Figma', 'Dev Kits', '3D & Spatial', 'Motion & Audio', 'Templates'];
  const formats = ['All', '.fig', '.tsx', '.blend', '.lottie', '.mp3'];

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
            placeholder="Search UI systems, boilerplates, 3D assets..."
            className="w-full rounded-lg border border-zinc-200 bg-white py-2.5 pl-10 pr-10 text-sm text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all min-h-[44px] shadow-sm"
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
              className="rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-medium text-zinc-700 focus:border-orange-500 focus:outline-none min-h-[44px] cursor-pointer shadow-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest Releases</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Segmented Filter Tabs */}
      <div className="mt-4 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[38px] px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-orange-600 text-white font-semibold shadow-sm'
                  : 'bg-white text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50 border border-zinc-200'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Format Filter Bar */}
      <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 flex-wrap">
        <span className="font-medium">Format:</span>
        {formats.map((fmt) => {
          const isActive = selectedFormat === fmt;
          return (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                isActive
                  ? 'bg-zinc-900 text-white font-medium'
                  : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
              }`}
            >
              {fmt}
            </button>
          );
        })}

        {(selectedCategory !== 'All' || selectedFormat !== 'All' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedFormat('All');
              setSearchQuery('');
            }}
            className="ml-auto text-xs text-orange-600 hover:text-orange-700 font-medium"
          >
            Reset Filters
          </button>
        )}
      </div>
    </div>
  );
};
