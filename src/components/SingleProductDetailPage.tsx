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
  AlertCircle,
  Headphones,
  Globe,
  Shield,
  Eye,
  X,
  Laptop,
  Smartphone,
  Tablet,
  CheckCircle,
  Tag
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

  // Use passed product, selected product, or fallback to first product
  const product = propProduct || selectedProduct || products[0];

  const [selectedTier, setSelectedTier] = useState<LicenseTier>('personal');
  const [selectedImage, setSelectedImage] = useState<string>(product?.coverImage || '');
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'specs' | 'includes' | 'reviews'>('overview');
  const [isCopied, setIsCopied] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLivePreviewOpen, setIsLivePreviewOpen] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [previewDarkMode, setPreviewDarkMode] = useState(false);

  // Auto-scroll to top when page opens or product changes
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
          className="mt-4 px-4 py-2 bg-[#f95a12] text-white rounded-lg text-sm font-semibold hover:bg-[#e04a07] transition-colors"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  const isAlreadyInCart = cart.some(
    (item) => item.product.id === product.id && item.selectedTier === selectedTier
  );

  const currentLicense = product.licenses[selectedTier] || product.licenses.personal;
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

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category === product.category || true))
    .slice(0, 4);

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
      
      {/* ================= 1. BREADCRUMBS BAR ================= */}
      <div className="bg-white border-b border-zinc-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={handleBack}
              className="hover:text-[#f95a12] font-medium transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <button
              onClick={handleBack}
              className="hover:text-[#f95a12] font-medium transition-colors cursor-pointer"
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
            <span className="hidden sm:inline">Back to Catalog</span>
            <span className="sm:hidden">Back</span>
          </button>
        </div>
      </div>

      {/* ================= 2. PRODUCT TITLE & HEADER BANNER ================= */}
      <div className="bg-white border-b border-zinc-200 py-6 sm:py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            
            {/* Title & Metadata */}
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-[#f95a12] border border-orange-200">
                  {product.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                  {product.format}
                </span>
                {product.featured && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <Sparkles className="w-3 h-3" /> Featured Pick
                  </span>
                )}
                {(product as any).badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {(product as any).badge}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight leading-tight">
                {product.title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-zinc-600">
                <div className="flex items-center gap-1.5 font-medium">
                  <span>By</span>
                  <span className="font-semibold text-zinc-900">OMYRA MALL Studio</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#f95a12]" />
                </div>
                <span className="text-zinc-300">|</span>
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {'★'.repeat(5)}
                  </div>
                  <span className="font-bold text-zinc-900">{product.rating}</span>
                  <span className="text-zinc-500">({product.reviewCount} reviews)</span>
                </div>
                <span className="text-zinc-300">|</span>
                <div className="flex items-center gap-1 font-semibold text-zinc-700">
                  <span>{product.salesCount.toLocaleString()}</span>
                  <span className="text-zinc-500 font-normal">Sales</span>
                </div>
                <span className="text-zinc-300">|</span>
                <div className="flex items-center gap-1 text-zinc-500">
                  <Clock className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Updated: {product.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Share & Wishlist) */}
            <div className="flex items-center gap-2 pt-2 md:pt-0 self-start">
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isWishlisted
                    ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                    : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'
                }`}
                title="Add to Wishlist"
              >
                <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{isWishlisted ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50 transition-all cursor-pointer shadow-2xs"
                title="Share Product"
              >
                <Share2 className="w-3.5 h-3.5 text-zinc-600" />
                <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ================= 3. MAIN 2-COLUMN WORKSPACE ================= */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT COLUMN: SHOWCASE, GALLERY, TABS (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Image Showcase Stage */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-3 sm:p-4 shadow-sm space-y-3.5">
              
              {/* Cover Display with responsive ratio */}
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-zinc-950 flex items-center justify-center group">
                <img
                  src={selectedImage || product.coverImage}
                  alt={product.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-[1.01]"
                />

                {/* Floating "Live Demo" button overlay */}
                <div className="absolute inset-0 bg-zinc-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setIsLivePreviewOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/95 backdrop-blur-md text-xs font-bold text-zinc-900 shadow-xl hover:bg-white active:scale-95 transition-all cursor-pointer"
                  >
                    <Eye className="w-4 h-4 text-[#f95a12]" />
                    <span>Open Interactive Live Preview</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons Below Main Image: Live Preview & Screenshots */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => setIsLivePreviewOpen(true)}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f95a12] text-white text-xs font-bold shadow-xs hover:bg-[#e04a07] active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Preview</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('gallery-thumbnails');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-800 text-xs font-bold shadow-2xs hover:bg-zinc-50 active:scale-[0.98] transition-all cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-zinc-600" />
                    <span>Screenshots ({galleryImages.length})</span>
                  </button>
                </div>

                <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 self-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Interactive responsive prototype ready</span>
                </div>
              </div>

              {/* Multiple Gallery Thumbnail Strip */}
              {galleryImages.length > 1 && (
                <div id="gallery-thumbnails" className="pt-2 border-t border-zinc-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                    Preview Screens
                  </span>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-2 pt-0.5">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative h-20 w-28 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                          selectedImage === img
                            ? 'border-[#f95a12] ring-2 ring-orange-500/20 shadow-xs scale-[1.02]'
                            : 'border-zinc-200 opacity-70 hover:opacity-100 hover:border-zinc-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content Tabs Navigation Bar */}
            <div className="border-b border-zinc-200 bg-white rounded-xl shadow-2xs px-4">
              <nav className="flex items-center gap-6 sm:gap-8 overflow-x-auto whitespace-nowrap">
                {[
                  { id: 'overview', label: 'Item Details' },
                  { id: 'features', label: 'Key Features' },
                  { id: 'specs', label: 'Specifications' },
                  { id: 'includes', label: 'Files Included' },
                  { id: 'reviews', label: `Reviews (${product.reviewCount})` },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-4 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
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

            {/* TAB 1: Item Details / Overview */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Description Card */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950 mb-3">About this Digital Product</h3>
                    <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
                      {product.description}
                    </p>
                  </div>

                  {product.tagline && (
                    <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/50 flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#f95a12] shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-zinc-800 font-medium leading-relaxed">
                        {product.tagline}
                      </p>
                    </div>
                  )}

                  {/* Highlights Grid with Checkmarks */}
                  {product.highlights && product.highlights.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        What's Included in This Release
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {product.highlights.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-2.5 p-3 rounded-xl bg-zinc-50/80 border border-zinc-100"
                          >
                            <div className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                            <span className="text-xs text-zinc-800 font-medium leading-snug">
                              {item}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Supported Tools and Frameworks */}
                  {product.tools && product.tools.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-zinc-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                        Compatible Tools & Frameworks
                      </h4>
                      <div className="flex flex-wrap items-center gap-2.5">
                        {product.tools.map((t) => (
                          <div
                            key={t}
                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-800 shadow-2xs"
                          >
                            <TechToolIcon toolName={t} className="w-4 h-4 shrink-0" />
                            <span>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 2: Key Features */}
            {activeTab === 'features' && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-5 shadow-2xs">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 mb-1">Production-Grade Features</h3>
                  <p className="text-xs text-zinc-500">
                    Engineered to the highest industry standards with clean documentation and tokenized hierarchy.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {product.highlights.map((feat, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-zinc-200/90 bg-white hover:border-orange-300 transition-all flex items-start gap-3 shadow-2xs"
                    >
                      <div className="h-7 w-7 rounded-lg bg-orange-50 text-[#f95a12] flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-zinc-900">Feature #{idx + 1}</h5>
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          {feat}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: Specifications Table */}
            {activeTab === 'specs' && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 mb-1">Full Technical Specifications</h3>
                  <p className="text-xs text-zinc-500">
                    Detailed attribute breakdown and compatibility requirements for this release.
                  </p>
                </div>

                {/* 4-Box Specs Highlight */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[11px] font-medium text-zinc-500 block mb-1">File Format</span>
                    <span className="text-sm font-bold text-zinc-900 font-mono">{product.format}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[11px] font-medium text-zinc-500 block mb-1">Archive Size</span>
                    <span className="text-sm font-bold text-zinc-900 font-mono">{product.fileSize}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[11px] font-medium text-zinc-500 block mb-1">Version</span>
                    <span className="text-sm font-bold text-zinc-900 font-mono">v{product.version}</span>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80">
                    <span className="text-[11px] font-medium text-zinc-500 block mb-1">Last Update</span>
                    <span className="text-sm font-bold text-zinc-900">{product.lastUpdated}</span>
                  </div>
                </div>

                {/* Extended Specs Key-Value Table */}
                <div className="border border-zinc-200 rounded-xl overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-zinc-200">
                      <tr className="bg-zinc-50/50">
                        <td className="py-3 px-4 font-semibold text-zinc-600 w-1/3">High Resolution</td>
                        <td className="py-3 px-4 font-bold text-zinc-900">Yes (Retina Ready 2x / 3x)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-zinc-600">Compatible Browsers</td>
                        <td className="py-3 px-4 font-medium text-zinc-900">Chrome, Safari, Firefox, Edge, Brave</td>
                      </tr>
                      <tr className="bg-zinc-50/50">
                        <td className="py-3 px-4 font-semibold text-zinc-600">Vector Shapes</td>
                        <td className="py-3 px-4 font-bold text-zinc-900">100% Fully Scalable Vector</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-zinc-600">Documentation</td>
                        <td className="py-3 px-4 font-medium text-zinc-900">Well Documented (Setup Guide & Tokens Guide)</td>
                      </tr>
                      <tr className="bg-zinc-50/50">
                        <td className="py-3 px-4 font-semibold text-zinc-600">Responsive Layout</td>
                        <td className="py-3 px-4 font-bold text-zinc-900">Yes (Auto-Layout v5 + Flexbox)</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 font-semibold text-zinc-600">Commercial License</td>
                        <td className="py-3 px-4 font-medium text-zinc-900">Included with all tiers</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 4: Files Included */}
            {activeTab === 'includes' && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-5 shadow-2xs">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 mb-1">Delivered Package Contents</h3>
                  <p className="text-xs text-zinc-500">
                    Instant access to the complete source files archive immediately after checkout:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {product.includes.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 text-xs font-mono text-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <Download className="w-4 h-4 text-[#f95a12] shrink-0" />
                        <span className="font-semibold">{file}</span>
                      </div>
                      <span className="text-[11px] font-sans font-medium text-zinc-400">Included</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Reviews */}
            {activeTab === 'reviews' && (
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 space-y-6 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-100">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-950">Customer Feedback ({product.reviewCount})</h3>
                    <p className="text-xs text-zinc-500">Verified buyer ratings and reviews</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400 text-base">
                      {'★'.repeat(5)}
                    </div>
                    <span className="text-base font-extrabold text-zinc-900">{product.rating}</span>
                    <span className="text-xs text-zinc-500">out of 5.0</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-5 rounded-xl border border-zinc-200 bg-zinc-50/50 space-y-2"
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
                    <div className="p-8 text-center text-xs text-zinc-500 bg-zinc-50 rounded-xl border border-zinc-200">
                      No customer reviews yet. Be the first to leave a review!
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ================= RIGHT SIDEBAR: PRICING, LICENSES, CART & SPECS (4 COLS) ================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Main Purchase Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 shadow-sm space-y-5">
              
              {/* Price Banner */}
              <div className="flex items-baseline justify-between pb-4 border-b border-zinc-100">
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

              {/* License Selection Options */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block">
                  Select License
                </label>

                <div className="space-y-2">
                  {(['personal', 'team', 'enterprise'] as LicenseTier[]).map((tierKey) => {
                    const tier = product.licenses[tierKey];
                    if (!tier) return null;
                    const isSelected = selectedTier === tierKey;

                    return (
                      <div
                        key={tierKey}
                        onClick={() => setSelectedTier(tierKey)}
                        className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
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

              {/* Included Perks Bullets */}
              <div className="rounded-xl border border-zinc-200/80 bg-zinc-50/70 p-3.5 space-y-2">
                <span className="text-xs font-bold text-zinc-900 block">
                  Included with this License:
                </span>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2 text-xs text-zinc-700">
                    <Check className="w-3.5 h-3.5 text-[#f95a12] shrink-0 stroke-[2.5]" />
                    <span>Quality verified by OMYRA MALL</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-zinc-700">
                    <Check className="w-3.5 h-3.5 text-[#f95a12] shrink-0 stroke-[2.5]" />
                    <span>Free lifetime version upgrades</span>
                  </li>
                  <li className="flex items-center gap-2 text-xs text-zinc-700">
                    <Check className="w-3.5 h-3.5 text-[#f95a12] shrink-0 stroke-[2.5]" />
                    <span>6 months dedicated author support</span>
                  </li>
                </ul>
              </div>

              {/* ACTION BUTTONS (Exact Match to Screenshot Style) */}
              <div className="space-y-2.5 pt-1">
                
                {/* 1. Add to Cart (Clean white outlined button) */}
                <button
                  onClick={() => {
                    addToCart(product, selectedTier);
                  }}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-xs font-bold transition-all cursor-pointer ${
                    isAlreadyInCart
                      ? 'bg-zinc-100 text-[#f95a12] border border-orange-200'
                      : 'border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 active:scale-[0.98]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAlreadyInCart ? 'In Cart (Add Another)' : 'Add to Cart'}</span>
                </button>

                {/* 2. Buy Now / Instant Checkout (Vibrant OMYRA MALL Orange button) */}
                <button
                  onClick={() => {
                    addToCart(product, selectedTier);
                    setIsCartOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#f95a12] hover:bg-[#e04a07] text-white py-3.5 px-4 text-sm font-bold shadow-xs hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Buy Now</span>
                  <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>

              </div>

              {/* Price Note & SSL Security */}
              <div className="pt-2 border-t border-zinc-100 space-y-2 text-center">
                <p className="text-[11px] text-zinc-400">
                  Price is in USD and includes all taxes & direct digital delivery.
                </p>
                <div className="flex items-center justify-center gap-4 text-xs text-zinc-500 pt-1">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Virus Free</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>256-Bit SSL</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Product Attributes Table (Envato/ThemeForest Market Style) */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block pb-2 border-b border-zinc-100">
                Item Attributes
              </span>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Released</span>
                  <span className="font-semibold text-zinc-800">September 2026</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Last Update</span>
                  <span className="font-semibold text-zinc-800">{product.lastUpdated}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">High Resolution</span>
                  <span className="font-semibold text-zinc-800">Yes</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Compatible With</span>
                  <span className="font-semibold text-zinc-800 truncate max-w-[170px]">
                    {product.tools?.join(', ') || 'Figma, React'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">File Size</span>
                  <span className="font-semibold text-zinc-800 font-mono">{product.fileSize}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-zinc-100">
                  <span className="text-zinc-500">Documentation</span>
                  <span className="font-semibold text-zinc-800">Well Documented</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-zinc-500">Layout</span>
                  <span className="font-semibold text-zinc-800">Responsive Vector</span>
                </div>
              </div>
            </div>

            {/* Author / Vendor Profile Card */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 space-y-3.5 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 block pb-2 border-b border-zinc-100">
                Author & Support
              </span>

              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-[#f95a12] text-white font-extrabold flex items-center justify-center text-sm shadow-2xs">
                  OM
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                    <span>OMYRA MALL Studio</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#f95a12]" />
                  </h4>
                  <p className="text-[11px] text-zinc-500">Elite Marketplace Author</p>
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

        {/* ================= 4. BOTTOM FEATURES BANNER (4 HORIZONTAL ITEMS AS IN SCREENSHOT) ================= */}
        <div className="mt-16 rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* 1. Secure Payments (Shield) */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-100 text-[#f95a12] flex items-center justify-center shrink-0 shadow-2xs">
                <Shield className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900">Secure Payments</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  100% secure encrypted checkout with Stripe & PayPal.
                </p>
              </div>
            </div>

            {/* 2. Instant Access (Lightning Bolt) */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-100 text-[#f95a12] flex items-center justify-center shrink-0 shadow-2xs">
                <Zap className="w-6 h-6 stroke-[1.8] fill-orange-100" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900">Instant Access</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Immediate digital download right after purchase.
                </p>
              </div>
            </div>

            {/* 3. Expert Support (Headset) */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-100 text-[#f95a12] flex items-center justify-center shrink-0 shadow-2xs">
                <Headphones className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900">Dedicated Support</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Direct support from verified authors within 2 hours.
                </p>
              </div>
            </div>

            {/* 4. Global Marketplace (Globe) */}
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl bg-orange-50 border border-orange-100 text-[#f95a12] flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-zinc-900">Global Marketplace</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Trusted by 100,000+ creators & engineers worldwide.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ================= 5. RELATED PRODUCTS SECTION ================= */}
        <div className="mt-14 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
            <div>
              <h3 className="text-lg font-bold text-zinc-950">You May Also Like</h3>
              <p className="text-xs text-zinc-500">Related premium digital assets handpicked for your workflow</p>
            </div>
            <button
              onClick={handleBack}
              className="text-xs font-semibold text-[#f95a12] hover:underline cursor-pointer"
            >
              Browse All Products →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relProduct) => (
              <div
                key={relProduct.id}
                onClick={() => {
                  setSelectedProduct(relProduct);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white hover:border-orange-400/80 hover:shadow-lg transition-all duration-200 cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                  <img
                    src={relProduct.coverImage}
                    alt={relProduct.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="rounded-full bg-white/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-zinc-800 border border-zinc-200">
                      {relProduct.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 line-clamp-1 group-hover:text-[#f95a12] transition-colors">
                      {relProduct.title}
                    </h4>
                    <p className="mt-1 text-[11px] text-zinc-500 line-clamp-2">
                      {relProduct.tagline}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                    <span className="text-sm font-extrabold text-zinc-950">
                      ${relProduct.basePrice}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="font-bold text-zinc-800">{relProduct.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ================= 6. INTERACTIVE LIVE PREVIEW MODAL ================= */}
      {isLivePreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-6xl h-[92vh] rounded-2xl border border-zinc-700 bg-zinc-900 text-white shadow-2xl flex flex-col overflow-hidden">
            
            {/* Top Preview Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-zinc-800 bg-zinc-950">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="text-xs font-semibold text-zinc-300 ml-2 hidden sm:inline">
                  Interactive Live Preview · {product.title}
                </span>
              </div>

              {/* Device Selector */}
              <div className="flex items-center gap-1 bg-zinc-800/80 p-1 rounded-lg border border-zinc-700">
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewDevice === 'desktop' ? 'bg-[#f95a12] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Desktop View"
                >
                  <Laptop className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewDevice === 'tablet' ? 'bg-[#f95a12] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Tablet View"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    previewDevice === 'mobile' ? 'bg-[#f95a12] text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                  title="Mobile View"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsLivePreviewOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Preview Frame Body */}
            <div className="flex-1 bg-zinc-950 p-4 sm:p-8 flex items-center justify-center overflow-auto">
              <div
                className={`transition-all duration-300 rounded-xl overflow-hidden shadow-2xl border border-zinc-800 bg-white ${
                  previewDevice === 'desktop'
                    ? 'w-full h-full max-w-5xl'
                    : previewDevice === 'tablet'
                    ? 'w-[768px] h-[95%]'
                    : 'w-[375px] h-[90%]'
                }`}
              >
                <div className="w-full h-full overflow-y-auto">
                  <img
                    src={selectedImage || product.coverImage}
                    alt={product.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain"
                  />
                  {galleryImages.slice(1).map((gImg, idx) => (
                    <img
                      key={idx}
                      src={gImg}
                      alt={`Screen ${idx + 2}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-contain border-t border-zinc-200"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Preview Footer with Buy button */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-zinc-800 bg-zinc-950 text-xs">
              <div className="text-zinc-400">
                Viewing production export with responsive auto-layout tokens
              </div>
              <button
                onClick={() => {
                  setIsLivePreviewOpen(false);
                  addToCart(product, selectedTier);
                  setIsCartOpen(true);
                }}
                className="px-4 py-2 rounded-lg bg-[#f95a12] text-white font-bold hover:bg-[#e04a07] transition-colors"
              >
                Buy Now (${currentLicense.price})
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
