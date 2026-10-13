import React, { useMemo } from 'react';
import { Star, Flame, Sparkles, X, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';
import { DigitalProduct } from '../types';

export const ProductSections: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();

  const isFiltering = selectedCategory !== 'All' || searchQuery.trim().length > 0;

  // Filtered products list when search or category is active
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.format.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.tools && p.tools.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Curated lists
  const featuredProducts = useMemo(() => {
    const list = products.filter((p) => p.featured);
    return list.length > 0 ? list : products.slice(0, 4);
  }, [products]);

  const trendingProducts = useMemo(() => {
    // Sort by sales count descending & rating
    return [...products]
      .sort((a, b) => b.salesCount - a.salesCount || b.rating - a.rating)
      .slice(0, 4);
  }, [products]);

  const newestProducts = useMemo(() => {
    // First products flagged isNew, then latest
    const newItems = products.filter((p) => p.isNew);
    if (newItems.length >= 4) return newItems.slice(0, 4);
    const nonNew = products.filter((p) => !p.isNew);
    return [...newItems, ...nonNew].slice(0, 4);
  }, [products]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  return (
    <div id="marketplace-catalog" className="w-full pt-4 pb-12 scroll-mt-24">
      {/* ========================================================= */}
      {/* ACTIVE SEARCH OR CATEGORY FILTER STATE                    */}
      {/* ========================================================= */}
      {isFiltering ? (
        <section className="mb-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-[#f95a12] border border-orange-200 shadow-2xs">
                  <Zap className="w-3.5 h-3.5" />
                  Filter Active
                </span>
                <span className="text-xs text-zinc-500 font-medium">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight mt-2">
                {selectedCategory !== 'All' ? `${selectedCategory}` : `Search Results`}
              </h2>
              <p className="mt-1 text-sm text-zinc-600">
                {searchQuery
                  ? `Showing results matching "${searchQuery}"`
                  : `Curated digital products in the ${selectedCategory} category`}
              </p>
            </div>

            <button
              onClick={clearAllFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-semibold text-zinc-700 hover:text-zinc-950 shadow-2xs transition-all cursor-pointer self-start sm:self-auto"
            >
              <X className="w-4 h-4 text-zinc-500" />
              Reset & View All Sections
            </button>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50/70 p-12 text-center max-w-lg mx-auto my-12">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#f95a12] flex items-center justify-center mx-auto mb-4">
                <X className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-zinc-900">No products found</h3>
              <p className="text-xs text-zinc-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                We couldn&apos;t find any digital assets matching your criteria. Try adjusting your search query or reset filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#f95a12] text-white text-xs font-semibold hover:bg-orange-600 transition-colors cursor-pointer shadow-sm shadow-orange-600/20"
              >
                View All Curated Sections
              </button>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>
      ) : (
        /* ========================================================= */
        /* CURATED SECTIONS: FEATURED, TRENDING, NEWEST               */
        /* ========================================================= */
        <div className="space-y-16 lg:space-y-20">
          
          {/* ========================================================= */}
          {/* 1. FEATURED PRODUCTS SECTION                               */}
          {/* ========================================================= */}
          <section className="relative">
            {/* Header matching exact user requirements */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-100">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-orange-50 text-[#f95a12] border border-orange-200/80 mb-2 shadow-2xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  Staff Picked Quality
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                  Featured Products
                </h2>
                <p className="mt-1.5 text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                  Handpicked digital products for creators, developers and businesses.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 shrink-0">
                <span className="hidden sm:inline">Guaranteed instant download</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-zinc-700 font-semibold">{featuredProducts.length} Featured Items</span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* ========================================================= */}
          {/* 2. TRENDING PRODUCTS SECTION                              */}
          {/* ========================================================= */}
          <section className="relative pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-100">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200/80 mb-2 shadow-2xs">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  Top Community Demand
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                  Trending Products
                </h2>
                <p className="mt-1.5 text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                  Most popular digital assets, high-velocity developer kits, and bestsellers this week.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 shrink-0">
                <span className="hidden sm:inline">Updated hourly by sales velocity</span>
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span className="text-zinc-700 font-semibold">{trendingProducts.length} Trending Items</span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* ========================================================= */}
          {/* 3. NEWEST PRODUCTS SECTION                                */}
          {/* ========================================================= */}
          <section className="relative pt-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-100">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/80 mb-2 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  Just Added To Store
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                  Newest Products
                </h2>
                <p className="mt-1.5 text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
                  Freshly published UI systems, mobile application templates, and latest boilerplates.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-zinc-500 shrink-0">
                <span className="hidden sm:inline">Verified code & source files</span>
                <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                <span className="text-zinc-700 font-semibold">{newestProducts.length} New Releases</span>
              </div>
            </div>

            {/* Products Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {newestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

        </div>
      )}
    </div>
  );
};
