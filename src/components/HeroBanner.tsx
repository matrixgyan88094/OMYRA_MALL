import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, ShieldCheck, CheckCircle2, Layers, Code2, Box, Eye, ExternalLink } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { HERO_IMAGE } from '../data/mockProducts';

export const HeroBanner: React.FC = () => {
  const { products, setSelectedProduct } = useStore();

  // Find featured products for the interactive hero preview tab
  const figmaProduct = products.find((p) => p.category === 'UI & Figma') || products[0];
  const devProduct = products.find((p) => p.category === 'Dev Kits') || products[1];
  const spatialProduct = products.find((p) => p.category === '3D & Spatial') || products[2];

  const showcaseItems = [
    {
      id: 'design',
      label: 'Figma System',
      icon: Layers,
      product: figmaProduct,
      badge: 'Auto-Layout 5.0 • 1,200+ Variants',
      format: '.fig',
      stats: '142 MB • Sept 2026',
    },
    {
      id: 'code',
      label: 'Fullstack Starter',
      icon: Code2,
      product: devProduct,
      badge: 'Next.js 15 • Tailwind v4 • TypeScript',
      format: '.tsx',
      stats: '4.8 MB • Production Ready',
    },
    {
      id: '3d',
      label: '3D Geometry',
      icon: Box,
      product: spatialProduct,
      badge: 'Cycles & Eevee • 4K PBR Textures',
      format: '.blend',
      stats: '840 MB • Octane Ready',
    },
  ];

  const [activeTab, setActiveTab] = useState(0);
  const currentItem = showcaseItems[activeTab];

  const handleExplore = () => {
    const catalogEl = document.getElementById('marketplace-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenProduct = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentItem?.product) {
      setSelectedProduct(currentItem.product);
    }
  };

  return (
    <div className="relative overflow-hidden border-b border-zinc-200/80 bg-white">
      {/* Background fine grid & soft orange warmth */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-60" 
      />
      <div 
        aria-hidden="true" 
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-full max-w-7xl bg-radial from-orange-500/10 via-orange-500/0 to-transparent blur-3xl" 
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Clear Value Proposition */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            
            {/* Pill Header */}
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/70 px-3.5 py-1 text-xs font-semibold text-orange-700 shadow-xs backdrop-blur-xs w-fit mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600" />
              </span>
              <span>Digital Products & Engineering Assets</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-950 leading-[1.12]">
              High-performance assets for{' '}
              <span className="text-orange-600">
                builders and designers
              </span>
            </h1>

            {/* Description Subtext */}
            <p className="mt-5 text-base sm:text-lg text-zinc-600 leading-relaxed font-normal max-w-xl">
              Production-tested Figma design systems, fullstack boilerplates, 3D spatial renders, and motion kits. Handcrafted with precision and ready for immediate commercial deployment.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <button
                onClick={handleExplore}
                className="inline-flex items-center justify-center gap-2.5 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm shadow-orange-500/25 hover:bg-orange-700 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <ShoppingBag className="h-4 w-4" />
                Browse Catalog
                <ArrowRight className="h-4 w-4 text-orange-200" />
              </button>

              <a
                href="#about"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 active:scale-[0.98] transition-all min-h-[44px]"
              >
                <ShieldCheck className="h-4 w-4 text-orange-600" />
                License Guarantee
              </a>
            </div>

            {/* Value Checkmarks */}
            <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-zinc-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-600" />
                <span>Single-vendor vetted</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-600" />
                <span>Commercial rights included</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-orange-600" />
                <span>Instant package download</span>
              </div>
            </div>

          </div>

          {/* Right Column: Workstation Product Preview Frame */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl border border-zinc-200/90 bg-white shadow-xl shadow-zinc-200/60 overflow-hidden">
              
              {/* Studio Window Header */}
              <div className="flex items-center justify-between border-b border-zinc-200/90 bg-zinc-50/80 px-4 py-2.5 backdrop-blur-xs">
                {/* Traffic dots */}
                <div className="flex items-center gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-300" />
                </div>

                {/* Interactive Asset Switcher Tabs */}
                <div className="flex items-center gap-1 bg-zinc-200/60 p-0.5 rounded-lg text-xs">
                  {showcaseItems.map((item, idx) => {
                    const Icon = item.icon;
                    const isActive = activeTab === idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(idx)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all ${
                          isActive
                            ? 'bg-white text-orange-600 shadow-xs font-semibold'
                            : 'text-zinc-600 hover:text-zinc-900'
                        }`}
                      >
                        <Icon className="h-3 w-3" />
                        <span className="hidden sm:inline">{item.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Format Tag */}
                <span className="rounded bg-orange-100/80 px-2 py-0.5 text-[11px] font-mono font-bold text-orange-700">
                  {currentItem.format}
                </span>
              </div>

              {/* Main Showcase Image Display */}
              <div 
                onClick={handleOpenProduct}
                className="group relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden bg-zinc-100 cursor-pointer"
              >
                <img
                  src={currentItem.product?.coverImage || HERO_IMAGE}
                  alt={currentItem.product?.title || 'Kroma digital assets'}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.02]"
                />

                {/* Subtle Hover Overlay with Inspect CTA */}
                <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-zinc-900 shadow-lg border border-zinc-200/80 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Eye className="h-3.5 w-3.5 text-orange-600" />
                    Inspect Details & Live Preview
                  </div>
                </div>

                {/* Floating Specs Pill */}
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs border border-zinc-200/80 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-zinc-800 shadow-xs flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>{currentItem.badge}</span>
                </div>

                {/* Floating Price / Action */}
                <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs border border-zinc-200/80 rounded-lg px-3 py-1.5 text-xs font-bold text-zinc-900 shadow-xs flex items-center gap-2">
                  <span className="text-zinc-400 line-through text-[11px]">
                    ${currentItem.product?.basePrice}
                  </span>
                  <span className="text-orange-600 font-extrabold text-sm">
                    ${currentItem.product?.salePrice ?? currentItem.product?.basePrice}
                  </span>
                  <button 
                    onClick={handleOpenProduct}
                    className="ml-1 text-zinc-500 hover:text-orange-600"
                    title="View Product"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Bottom Card Summary Bar */}
              <div className="border-t border-zinc-200/80 bg-white p-3.5 sm:px-4 sm:py-3 flex items-center justify-between">
                <div className="min-w-0 pr-3">
                  <h4 className="text-xs sm:text-sm font-semibold text-zinc-900 truncate">
                    {currentItem.product?.title}
                  </h4>
                  <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                    {currentItem.stats} • Instant ZIP download with license certificate
                  </p>
                </div>
                
                <button
                  onClick={handleOpenProduct}
                  className="shrink-0 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
                >
                  View Details
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {/* Corporate Trust & Stat Bar */}
        <div className="mt-12 pt-8 border-t border-zinc-200/80 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
              4,800+
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              Commercial licenses issued
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
              4.96 / 5.0
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              Verified author rating
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold tracking-tight text-orange-600 tabular-nums">
              100%
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              Single-vendor engineered files
            </div>
          </div>

          <div>
            <div className="text-2xl font-bold tracking-tight text-zinc-900 tabular-nums">
              Instant
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              Immediate ZIP & license key
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
