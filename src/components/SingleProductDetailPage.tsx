import React, { useState, useEffect } from 'react';
import {
  Star,
  Check,
  ShieldCheck,
  Zap,
  Download,
  Share2,
  Heart,
  ChevronRight,
  ExternalLink,
  Lock,
  Layers,
  Sparkles,
  Info,
  CheckCircle2,
  FileText,
  Clock,
  HardDrive,
  Code2,
  Boxes,
  HelpCircle,
  ShoppingBag,
  ArrowLeft,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { DigitalProduct, LicenseTier } from '../types';
import { useStore } from '../context/StoreContext';
import { TechToolIcon } from './TechToolIcon';

interface SingleProductDetailPageProps {
  product?: DigitalProduct | null;
  onBack?: () => void;
}

export const SingleProductDetailPage: React.FC<SingleProductDetailPageProps> = ({
  product: propProduct,
  onBack
}) => {
  const { products, selectedProduct, setSelectedProduct, addToCart, cart, setIsCartOpen, setActiveView } = useStore();

  // Use either the passed product, the store's selected product, or fallback to the first product
  const product = propProduct || selectedProduct || products[0];

  const [selectedTier, setSelectedTier] = useState<LicenseTier>('personal');
  const [selectedImage, setSelectedImage] = useState<string>(product?.coverImage || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'changelog' | 'reviews'>('overview');
  const [isCopied, setIsCopied] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Auto-scroll to top when page opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (product) {
      setSelectedImage(product.coverImage);
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-zinc-900">Product Not Found</h2>
        <button
          onClick={() => {
            if (onBack) onBack();
            else setActiveView('store');
          }}
          className="mt-4 px-4 py-2 bg-[#f95a12] text-white rounded-lg text-sm font-semibold"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isAlreadyInCart = cart.some(
    (item) => item.product.id === product.id && item.selectedTier === selectedTier
  );

  const currentLicense = product.licenses[selectedTier];
  const regularPrice = product.basePrice || 69;
  const salePrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
    : 0;

  const galleryImages = [
    product.coverImage,
    ...(product.galleryImages || [])
  ].filter(Boolean);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setSelectedProduct(null);
      setActiveView('store');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900">
      {/* ================= BREADCRUMBS BAR ================= */}
      <div className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={handleBack}
              className="hover:text-zinc-900 font-medium transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <button
              onClick={handleBack}
              className="hover:text-zinc-900 font-medium transition-colors cursor-pointer"
            >
              {product.category}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span className="font-semibold text-zinc-900 truncate max-w-[200px] sm:max-w-md">
              {product.title}
            </span>
          </div>

          <button
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#f95a12] transition-colors cursor-pointer shrink-0 ml-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to Marketplace</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </div>

      {/* ================= MAIN CONTAINER ================= */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT MAIN COLUMN: IMAGES, DEMO & CONTENT (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Top Product Header (Mobile only, on desktop it's right or above) */}
            <div className="lg:hidden space-y-2 pb-2 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  {product.category}
                </span>
                <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                  {product.format}
                </span>
                <span className="text-xs text-zinc-400">·</span>
                <span className="text-xs text-zinc-500">v{product.version}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-950 tracking-tight leading-snug">
                {product.title}
              </h1>
              <p className="text-xs text-zinc-600 leading-relaxed">
                {product.tagline}
              </p>
            </div>

            {/* Main Image Showcase Stage */}
            <div className="rounded-2xl border border-zinc-200/90 bg-white p-2.5 sm:p-3 shadow-xs">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-100">
                <img
                  src={selectedImage || product.coverImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-all duration-300"
                />

                {/* Top Badge: Category */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-xs font-semibold text-zinc-800 border border-zinc-200/80 shadow-2xs">
                    {product.category}
                  </span>
                </div>

                {/* Top Badge: Format */}
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-zinc-700 hover:text-red-500 shadow-2xs border border-zinc-200/80 transition-colors cursor-pointer"
                    title="Add to wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="h-9 w-9 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-zinc-700 hover:text-[#f95a12] shadow-2xs border border-zinc-200/80 transition-colors cursor-pointer"
                    title="Share product"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Gallery Thumbnails Strip */}
              {galleryImages.length > 1 && (
                <div className="mt-3 flex items-center gap-2.5 overflow-x-auto pb-1 pt-1">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`relative h-18 w-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                        selectedImage === img
                          ? 'border-[#f95a12] ring-2 ring-orange-500/20 shadow-xs'
                          : 'border-zinc-200 opacity-70 hover:opacity-100 hover:border-zinc-300'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Preview thumbnail ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Live Preview Banner Button */}
            <div className="rounded-xl border border-orange-200 bg-orange-50/70 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#f95a12] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900">
                    Live Interactive Demo & Inspect
                  </h4>
                  <p className="text-xs text-zinc-600">
                    Test full component tokens, theme modes, and live framework assets.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const el = document.getElementById('product-specs');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-white border border-zinc-200 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 hover:text-zinc-950 transition-all shadow-2xs cursor-pointer whitespace-nowrap"
                >
                  <span>View Specifications</span>
                </button>
              </div>
            </div>

            {/* Content Tabs Navigation */}
            <div className="border-b border-zinc-200">
              <nav className="flex items-center gap-8 -mb-px">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'features', label: 'Key Features' },
                  { id: 'changelog', label: 'File Contents' },
                  { id: 'reviews', label: `Reviews (${product.reviewCount})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3.5 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-[#f95a12] text-[#f95a12]'
                        : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab 1: Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6 pt-2">
                <div className="prose prose-zinc max-w-none text-xs sm:text-sm text-zinc-700 leading-relaxed space-y-4">
                  <h3 className="text-base font-bold text-zinc-900">About this Digital Asset</h3>
                  <p>{product.description}</p>
                  
                  {product.tagline && (
                    <div className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 text-xs text-zinc-700 font-medium">
                      💡 {product.tagline}
                    </div>
                  )}
                </div>

                {/* Framework & Tool Logos */}
                {product.tools && product.tools.length > 0 && (
                  <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                      Technologies & Frameworks Supported
                    </h4>
                    <div className="flex flex-wrap items-center gap-2">
                      {product.tools.map((t) => (
                        <div
                          key={t}
                          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 shadow-2xs"
                        >
                          <TechToolIcon toolName={t} className="w-4 h-4 shrink-0" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Technical Specifications Matrix */}
                <div id="product-specs" className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                    Technical Specifications
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] mb-1">
                        <FileText className="w-3.5 h-3.5 text-[#f95a12]" />
                        <span>Format</span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-zinc-900 font-mono">
                        {product.format}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] mb-1">
                        <HardDrive className="w-3.5 h-3.5 text-[#f95a12]" />
                        <span>File Size</span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-zinc-900 font-mono">
                        {product.fileSize}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] mb-1">
                        <Code2 className="w-3.5 h-3.5 text-[#f95a12]" />
                        <span>Version</span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-zinc-900 font-mono">
                        v{product.version}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
                      <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] mb-1">
                        <Clock className="w-3.5 h-3.5 text-[#f95a12]" />
                        <span>Updated</span>
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-zinc-900">
                        {product.lastUpdated}
                      </span>
                    </div>
                  </div>

                  {/* Extended Specs table if available */}
                  {product.specs && Object.keys(product.specs).length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-100">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {Object.entries(product.specs).map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between py-1.5 border-b border-zinc-100">
                            <span className="text-zinc-500 font-medium">{k}</span>
                            <span className="text-zinc-900 font-semibold">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Key Features */}
            {activeTab === 'features' && (
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-zinc-900">Highlights & Production Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {product.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-zinc-200 bg-white flex items-start gap-3 shadow-2xs"
                    >
                      <div className="h-6 w-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                      <p className="text-xs sm:text-sm text-zinc-700 font-medium leading-relaxed">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: File Contents */}
            {activeTab === 'changelog' && (
              <div className="space-y-4 pt-2">
                <h3 className="text-base font-bold text-zinc-900">Delivered Package Files</h3>
                <p className="text-xs text-zinc-500">
                  You will receive an automated download link and lifetime license key for all files below:
                </p>

                <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2.5">
                  {product.includes.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 border border-zinc-100 text-xs font-mono text-zinc-800"
                    >
                      <Download className="w-4 h-4 text-[#f95a12] shrink-0" />
                      <span className="truncate">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-5 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-zinc-900">
                    Customer Reviews ({product.reviewCount})
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs">
                    <div className="flex text-amber-400">
                      {'★'.repeat(5)}
                    </div>
                    <span className="font-bold text-zinc-900">{product.rating}</span>
                    <span className="text-zinc-500">out of 5</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-xl border border-zinc-200 bg-white space-y-2 shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-zinc-900">{rev.author}</span>
                            <span className="text-xs text-zinc-400 ml-2">· {rev.role}</span>
                          </div>
                          <span className="text-[11px] text-zinc-400">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-400 text-xs">
                          {'★'.repeat(rev.rating)}
                        </div>
                        <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                          "{rev.content}"
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-xs text-zinc-500 bg-white rounded-xl border border-zinc-200">
                      No customer reviews yet. Be the first to leave a review!
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT SIDEBAR: PRICING, LICENSES, CART & CHECKOUT (4 COLS) ================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Main Purchase Box */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
              
              {/* Desktop Product Title & Rating */}
              <div className="hidden lg:block space-y-2 pb-4 border-b border-zinc-100">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                    {product.category}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                    {product.format}
                  </span>
                </div>

                <h1 className="text-lg font-bold text-zinc-950 tracking-tight leading-snug">
                  {product.title}
                </h1>

                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-zinc-900">{product.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{product.reviewCount} reviews</span>
                  <span>·</span>
                  <span>{product.salesCount.toLocaleString()} sales</span>
                </div>
              </div>

              {/* Price Banner */}
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-zinc-950 tabular-nums tracking-tight">
                      ${currentLicense.price}
                    </span>
                    {hasDiscount && (
                      <span className="text-sm text-zinc-400 line-through tabular-nums">
                        ${regularPrice}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-500">One-time payment · Lifetime access</span>
                </div>

                {hasDiscount && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-50 text-[#f95a12] border border-orange-200">
                    Save {discountPercent}%
                  </span>
                )}
              </div>

              {/* License Tier Radio Selector */}
              <div className="space-y-2.5 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                  Select License Tier
                </label>

                <div className="space-y-2">
                  {(['personal', 'team', 'enterprise'] as LicenseTier[]).map((tierKey) => {
                    const tier = product.licenses[tierKey];
                    const isSelected = selectedTier === tierKey;

                    return (
                      <div
                        key={tierKey}
                        onClick={() => setSelectedTier(tierKey)}
                        className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#f95a12] bg-orange-50/40 ring-1 ring-[#f95a12]/30'
                            : 'border-zinc-200 bg-white hover:border-zinc-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected
                                  ? 'border-[#f95a12] bg-[#f95a12]'
                                  : 'border-zinc-300'
                              }`}
                            >
                              {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                            </div>
                            <span className="text-xs font-bold text-zinc-900">{tier.label}</span>
                          </div>
                          <span className="text-sm font-extrabold text-zinc-950 tabular-nums">
                            ${tier.price}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-500 pl-6.5">
                          {tier.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Included with License bullets */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-4 space-y-2">
                <span className="text-xs font-bold text-zinc-900 block">
                  Included with {currentLicense.label}:
                </span>
                <ul className="space-y-1.5">
                  {currentLicense.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-zinc-700">
                      <Check className="w-3.5 h-3.5 text-[#f95a12] shrink-0 stroke-[2.5]" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                {/* Instant Checkout Button (Primary Orange) */}
                <button
                  onClick={() => {
                    addToCart(product, selectedTier);
                    setIsCartOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f95a12] hover:bg-[#e04a07] text-white py-3.5 px-4 text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                  <span>Instant Checkout</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>

                {/* Add to Bag Button (Secondary Dark Outline) */}
                <button
                  onClick={() => addToCart(product, selectedTier)}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all cursor-pointer ${
                    isAlreadyInCart
                      ? 'bg-zinc-100 text-[#f95a12] border border-orange-200'
                      : 'border border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 active:scale-[0.98]'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isAlreadyInCart ? 'In Bag (Add Another)' : 'Add to Shopping Bag'}</span>
                </button>
              </div>

              {/* Safe & Secure Guarantee Badges */}
              <div className="pt-3 border-t border-zinc-100 space-y-2 text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified 100% Virus & Malware Clean</span>
                </div>
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-zinc-600 shrink-0" />
                  <span>Instant automated file delivery to your email</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-zinc-600 shrink-0" />
                  <span>256-Bit SSL Encrypted checkout</span>
                </div>
              </div>

            </div>

            {/* Author / Vendor Profile Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block">
                Publisher & Support
              </span>

              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#f95a12] text-white font-extrabold flex items-center justify-center text-sm shadow-2xs">
                  OM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900">OMYRA MALL Studio</h4>
                  <p className="text-[11px] text-zinc-500">Verified Marketplace Author</p>
                </div>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">
                Direct developer support with regular version upgrades, security patches, and active token updates.
              </p>

              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                <span className="text-zinc-500">Response time:</span>
                <span className="font-semibold text-zinc-800">Under 2 hours</span>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};
