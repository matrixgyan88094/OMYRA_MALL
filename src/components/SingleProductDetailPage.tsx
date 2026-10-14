import React, { useState, useEffect } from 'react';
import {
  Star,
  Check,
  Shield,
  ShieldCheck,
  Zap,
  Download,
  Share2,
  Heart,
  ChevronRight,
  ChevronDown,
  Lock,
  Layers,
  Sparkles,
  Award,
  ShoppingBag,
  Home,
  Flag,
  Users,
  Layout,
  Sun,
  Edit3,
  Smartphone,
  Headphones,
  Globe,
  ArrowRight,
  CheckCircle2,
  Play
} from 'lucide-react';
import { DigitalProduct, LicenseTier } from '../types';
import { useStore } from '../context/StoreContext';
import { TechToolIcon } from './TechToolIcon';
import { kromaOverviewImg } from '../data/mockProducts';
import { resolveProductImage } from '../utils/imageResolver';

interface SingleProductDetailPageProps {
  product?: DigitalProduct | null;
  onBack?: () => void;
}

export const SingleProductDetailPage: React.FC<SingleProductDetailPageProps> = ({
  product: propProduct,
  onBack
}) => {
  const {
    products,
    selectedProduct,
    setSelectedProduct,
    addToCart,
    cart,
    setIsCartOpen,
    setActiveView
  } = useStore();

  // Primary product from prop, selectedProduct or first product (Kroma UI)
  const product = propProduct || selectedProduct || products[0];

  const [selectedTier, setSelectedTier] = useState<LicenseTier>('personal');
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'included' | 'screenshots' | 'reviews'>('overview');
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [reportReason, setReportReason] = useState<string>('copyright');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  // Auto-scroll to top when loaded
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImageIndex(0);
  }, [product?.id]);

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-[#101D39]">Product Not Found</h2>
        <button
          onClick={() => {
            if (onBack) onBack();
            else setActiveView('store');
          }}
          className="mt-4 px-5 py-2.5 bg-[#FF6500] hover:bg-[#EA5800] text-white rounded-lg text-sm font-semibold transition-colors"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  // Gallery images with thumbnails
  const galleryImages: string[] = [
    product.coverImage,
    ...(product.galleryImages || [])
  ].filter(Boolean);

  // Ensure at least 5 thumbnails to match reference thumbnail rail
  while (galleryImages.length < 5) {
    galleryImages.push(product.coverImage);
  }

  const activeMainImage = galleryImages[selectedImageIndex] || product.coverImage;

  // License options & pricing
  const currentLicense = product.licenses[selectedTier] || product.licenses.personal;

  // Prices calculation from license
  const isPersonal = selectedTier === 'personal';
  const isTeam = selectedTier === 'team';
  const isUnlimited = selectedTier === 'enterprise';

  const displayPrice = isPersonal ? 89 : isTeam ? 179 : 299;
  const originalPrice = isPersonal ? 149 : isTeam ? 299 : 499;
  const savingsAmount = originalPrice - displayPrice;
  const discountPercent = Math.round((savingsAmount / originalPrice) * 100);

  const isAlreadyInCart = cart.some(
    (item) => item.product.id === product.id && item.selectedTier === selectedTier
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.tagline,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareFeedback('Link copied to clipboard!');
      setTimeout(() => setShareFeedback(null), 2500);
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

  const handleAddToCart = () => {
    addToCart(product, selectedTier);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedTier);
    setIsCartOpen(true);
  };

  // 5 Related products matching prompt & screenshot:
  // 1. Next.js 15 Fullstack SaaS Starter
  // 2. Spatial Geometry 3D Assets Pack
  // 3. Kinetic Motion & Audio Soundscape
  // 4. Botiga WordPress Premium Plugin
  // 5. Design Kit Pro
  const relatedProducts = products
    .filter((p) => p.id !== product.id)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-white text-[#101D39] font-sans">
      
      {/* ================= 3. BREADCRUMB NAVIGATION ROW ================= */}
      <div className="border-b border-[#E5EAF1] bg-white">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-9 h-11 flex items-center justify-between text-xs">
          {/* Left: Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-[#61789C] overflow-x-auto whitespace-nowrap scrollbar-none py-1">
            <button
              onClick={handleBack}
              className="text-[#61789C] hover:text-[#FF6500] flex items-center gap-1 cursor-pointer transition-colors"
              title="Home"
            >
              <Home className="w-3.5 h-3.5 text-[#61789C]" />
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#8292AC] shrink-0" />
            <button
              onClick={handleBack}
              className="hover:text-[#FF6500] transition-colors cursor-pointer"
            >
              Digital Products
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#8292AC] shrink-0" />
            <button
              onClick={handleBack}
              className="hover:text-[#FF6500] transition-colors cursor-pointer"
            >
              {product.category || 'UI & Figma'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#8292AC] shrink-0" />
            <span className="font-semibold text-[#101D39] truncate max-w-[220px] sm:max-w-md">
              {product.title}
            </span>
          </nav>

          {/* Right: Share & Report actions */}
          <div className="flex items-center gap-4 text-xs shrink-0 ml-4">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-[#61789C] hover:text-[#FF6500] transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={() => setIsReportOpen(true)}
              className="inline-flex items-center gap-1.5 text-[#61789C] hover:text-[#FF6500] transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Toast Banner if clicked */}
      {shareFeedback && (
        <div className="bg-[#FFF5EE] border-b border-[#FFE4D2] py-2 px-4 text-center text-xs font-semibold text-[#FF6500]">
          {shareFeedback}
        </div>
      )}

      {/* ================= 4. MAIN PRODUCT DETAILS AREA ================= */}
      <main className="mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-9 py-6 sm:py-8">
        
        {/* Two-Column Grid: Left (approx 64%) and Right (approx 34%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ================= LEFT PRODUCT PRESENTATION COLUMN (8 COLS) ================= */}
          <div className="lg:col-span-8 space-y-5">
            
            {/* 8A. PRODUCT IMAGE GALLERY */}
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              
              {/* Vertical Thumbnail Rail (approx 64-66px wide, 5 thumbnails, video icons) */}
              <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-visible w-full sm:w-[66px] shrink-0 pb-1 sm:pb-0">
                {galleryImages.slice(0, 5).map((thumbImg, idx) => {
                  const isActive = selectedImageIndex === idx;
                  const isVideoThumb = idx === 3 || idx === 4;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-14 h-14 sm:w-[64px] sm:h-[62px] rounded-[7px] overflow-hidden border transition-all cursor-pointer shrink-0 bg-[#101D39] ${
                        isActive
                          ? 'border-[#FF6500] ring-1 ring-[#FF6500]'
                          : 'border-[#E5EAF1] opacity-80 hover:opacity-100 hover:border-[#8292AC]'
                      }`}
                    >
                      <img
                        src={resolveProductImage(thumbImg)}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.currentTarget;
                          if (!target.dataset.fallback) {
                            target.dataset.fallback = 'true';
                            target.src = resolveProductImage(null);
                          }
                        }}
                      />
                      {isVideoThumb && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                          <Play className="w-4 h-4 fill-white" />
                        </div>
                      )}
                    </button>
                  );
                })}

                {/* Downward Chevron at bottom of vertical rail */}
                <div className="hidden sm:flex items-center justify-center py-0.5 text-[#8292AC]">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Main Preview Stage (approx 310px tall at desktop reference proportions) */}
              <div className="relative flex-1 w-full aspect-[16/9] sm:aspect-[16/10] max-h-[360px] rounded-[9px] overflow-hidden bg-[#150a24] border border-[#E5EAF1] shadow-2xs">
                <img
                  src={resolveProductImage(activeMainImage)}
                  alt={product.title}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = 'true';
                      target.src = resolveProductImage(null);
                    }
                  }}
                />

                {/* Top-Left: Orange "Best Seller" badge with award icon */}
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[11px] font-bold bg-[#FF6500] text-white shadow-xs">
                    <Award className="w-3.5 h-3.5" />
                    Best Seller
                  </span>
                </div>

                {/* Top-Right: Wishlist Heart Circle button */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#101D39] hover:text-red-500 transition-colors shadow-2xs cursor-pointer"
                    title={isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                {/* Bottom-Right: Image Counter e.g. "1 / 8" */}
                <div className="absolute bottom-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[11px] font-mono font-medium bg-black/60 text-white backdrop-blur-xs">
                    {selectedImageIndex + 1} / 8
                  </span>
                </div>
              </div>

            </div>

            {/* 9. PRODUCT INFORMATION BELOW THE GALLERY */}
            <div className="space-y-3 pt-1">
              
              {/* Category Badge: Very light lavender background, purple text */}
              <div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#F2EAFA] text-[#7A3E9D]">
                  {product.category || 'UI & Figma'}
                </span>
              </div>

              {/* Product Title: dark navy, approx 28px bold */}
              <h1 className="text-2xl sm:text-[28px] font-extrabold text-[#101D39] tracking-tight leading-tight">
                {product.title}
              </h1>

              {/* Short Description */}
              <p className="text-xs sm:text-[13px] text-[#61789C] leading-relaxed">
                {product.tagline || 'Enterprise-grade Figma library with 1,200+ production components'}
              </p>

              {/* Rating and Sales Metadata Row */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-[#E5EAF1]/60">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 fill-[#FFB323] text-[#FFB323]" />
                  <span className="font-bold text-[#101D39]">{product.rating || '4.98'}</span>
                  <span className="text-[#8292AC]">({product.reviewCount || '248'} reviews)</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#61789C]">
                  <Users className="w-3.5 h-3.5 text-[#8292AC]" />
                  <span>{(product.salesCount || 1420).toLocaleString()} sales</span>
                </div>
              </div>

              {/* Compact Product Specifications Row: Bordered white panel with 4 evenly distributed cells */}
              <div className="rounded-[8px] border border-[#E5EAF1] bg-white p-3.5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-[#E5EAF1]">
                  
                  {/* Cell 1: 1,200+ Components */}
                  <div className="flex items-center gap-2.5 px-2 pt-2 sm:pt-0">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF5EE] text-[#FF6500] flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101D39] leading-tight">1,200+</div>
                      <div className="text-[11px] text-[#8292AC]">Components</div>
                    </div>
                  </div>

                  {/* Cell 2: 50+ Screens */}
                  <div className="flex items-center gap-2.5 px-2 pt-2 sm:pt-0">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF5EE] text-[#FF6500] flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101D39] leading-tight">50+</div>
                      <div className="text-[11px] text-[#8292AC]">Screens</div>
                    </div>
                  </div>

                  {/* Cell 3: Light & Dark Themes */}
                  <div className="flex items-center gap-2.5 px-2 pt-2 sm:pt-0">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF5EE] text-[#FF6500] flex items-center justify-center shrink-0">
                      <Sun className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101D39] leading-tight">Light & Dark</div>
                      <div className="text-[11px] text-[#8292AC]">Themes</div>
                    </div>
                  </div>

                  {/* Cell 4: Fully Editable in Figma */}
                  <div className="flex items-center gap-2.5 px-2 pt-2 sm:pt-0">
                    <div className="w-7 h-7 rounded-lg bg-[#FFF5EE] text-[#FF6500] flex items-center justify-center shrink-0">
                      <Edit3 className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#101D39] leading-tight">Fully Editable</div>
                      <div className="text-[11px] text-[#8292AC]">in Figma</div>
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>

          {/* ================= RIGHT PURCHASE PANEL (4 COLS) ================= */}
          <div className="lg:col-span-4">
            <div className="rounded-[10px] border border-[#E5EAF1] bg-white p-5 shadow-xs space-y-4">
              
              {/* 10A. Bestseller Badge */}
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#FF6500] text-white">
                  <Award className="w-3 h-3" />
                  Best Seller
                </span>
              </div>

              {/* 10B. Price and Discount */}
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl sm:text-[32px] font-extrabold text-[#101D39] tabular-nums tracking-tight">
                    ${displayPrice}
                  </span>
                  <span className="text-base text-[#8292AC] line-through tabular-nums">
                    ${originalPrice}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-bold bg-[#FF6500] text-white">
                    {discountPercent}% OFF
                  </span>
                </div>

                {/* Savings indicator */}
                <div className="mt-1 flex items-center gap-1 text-xs font-semibold text-[#13B981]">
                  <ArrowRight className="w-3 h-3 rotate-45" />
                  <span>You save ${savingsAmount} ({discountPercent}%)</span>
                </div>
              </div>

              {/* 10C. Rating & Sales Summary */}
              <div className="flex items-center justify-between text-xs py-2 border-y border-[#E5EAF1]">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-[#FFB323] text-[#FFB323]" />
                  <span className="font-bold text-[#101D39]">4.98</span>
                  <span className="text-[#8292AC]">(248 reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-[#61789C]">
                  <Users className="w-3.5 h-3.5 text-[#8292AC]" />
                  <span>1,420 sales</span>
                </div>
              </div>

              {/* 10D. License Selection */}
              <div className="space-y-2 pt-1">
                <label className="text-xs font-bold text-[#101D39] block">
                  Choose License
                </label>

                {/* 3 License cards in a single horizontal row */}
                <div className="grid grid-cols-3 gap-2">
                  
                  {/* Card 1: Personal (Default Selected) */}
                  <div
                    onClick={() => setSelectedTier('personal')}
                    className={`relative p-2.5 rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between h-[76px] ${
                      isPersonal
                        ? 'border-[#FF6500] bg-[#FFF5EE]'
                        : 'border-[#E5EAF1] bg-white hover:border-[#8292AC]'
                    }`}
                  >
                    {isPersonal && (
                      <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-[#FF6500] flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-[#101D39]">Personal</div>
                      <div className="text-[10px] text-[#8292AC]">1 user</div>
                    </div>
                    <div className="text-sm font-extrabold text-[#101D39]">$89</div>
                  </div>

                  {/* Card 2: Team */}
                  <div
                    onClick={() => setSelectedTier('team')}
                    className={`relative p-2.5 rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between h-[76px] ${
                      isTeam
                        ? 'border-[#FF6500] bg-[#FFF5EE]'
                        : 'border-[#E5EAF1] bg-white hover:border-[#8292AC]'
                    }`}
                  >
                    {isTeam && (
                      <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-[#FF6500] flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-[#101D39]">Team</div>
                      <div className="text-[10px] text-[#8292AC]">Up to 10 users</div>
                    </div>
                    <div className="text-sm font-extrabold text-[#101D39]">$179</div>
                  </div>

                  {/* Card 3: Unlimited */}
                  <div
                    onClick={() => setSelectedTier('enterprise')}
                    className={`relative p-2.5 rounded-[8px] border transition-all cursor-pointer flex flex-col justify-between h-[76px] ${
                      isUnlimited
                        ? 'border-[#FF6500] bg-[#FFF5EE]'
                        : 'border-[#E5EAF1] bg-white hover:border-[#8292AC]'
                    }`}
                  >
                    {isUnlimited && (
                      <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full bg-[#FF6500] flex items-center justify-center text-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-[#101D39]">Unlimited</div>
                      <div className="text-[10px] text-[#8292AC]">Unlimited users</div>
                    </div>
                    <div className="text-sm font-extrabold text-[#101D39]">$299</div>
                  </div>

                </div>
              </div>

              {/* 10E & 10F. Action Purchase Buttons */}
              <div className="space-y-2.5 pt-1">
                {/* Primary Button: Add to Cart (Orange) */}
                <button
                  onClick={handleAddToCart}
                  className="w-full h-10 rounded-[7px] bg-[#FF6500] hover:bg-[#EA5800] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4 stroke-[2.2]" />
                  <span>{isAlreadyInCart ? 'Added in Cart (Add Again)' : 'Add to Cart'}</span>
                </button>

                {/* Secondary Button: Buy Now (White with thin orange border) */}
                <button
                  onClick={handleBuyNow}
                  className="w-full h-10 rounded-[7px] bg-white hover:bg-[#FFF5EE] border border-[#FF6500] text-[#101D39] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4 text-[#FF6500] fill-[#FF6500]" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* 10G. Purchase Assurance Items (3 compact rows with icons in pale-peach squares) */}
              <div className="space-y-3 pt-2">
                
                {/* Row 1: Secure Checkout */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF5EE] text-[#FF6500] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#101D39]">Secure Checkout</div>
                    <div className="text-[11px] text-[#8292AC]">Your payment is safe and encrypted</div>
                  </div>
                </div>

                {/* Row 2: Instant Access */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF5EE] text-[#FF6500] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#101D39]">Instant Access</div>
                    <div className="text-[11px] text-[#8292AC]">Get your files immediately</div>
                  </div>
                </div>

                {/* Row 3: 24/7 Support */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FFF5EE] text-[#FF6500] flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#101D39]">24/7 Support</div>
                    <div className="text-[11px] text-[#8292AC]">We&apos;re here to help</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* ================= 11. FULL-WIDTH PRODUCT BENEFITS STRIP ================= */}
        <section className="mt-8 rounded-[9px] border border-[#FFE4D2] bg-[#FFF7F1] p-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#FFE4D2]">
            
            {/* Item 1: Clean & Modern */}
            <div className="flex items-center gap-2.5 px-2 pt-2 md:pt-0">
              <Shield className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">Clean & Modern</div>
                <div className="text-[11px] text-[#8292AC]">Design System</div>
              </div>
            </div>

            {/* Item 2: 1,200+ Ready-to-use */}
            <div className="flex items-center gap-2.5 px-2 pt-2 md:pt-0">
              <Layers className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">1,200+ Ready-to-use</div>
                <div className="text-[11px] text-[#8292AC]">Components</div>
              </div>
            </div>

            {/* Item 3: 50+ Beautiful */}
            <div className="flex items-center gap-2.5 px-2 pt-2 md:pt-0">
              <Layout className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">50+ Beautiful</div>
                <div className="text-[11px] text-[#8292AC]">Screens</div>
              </div>
            </div>

            {/* Item 4: Light & Dark */}
            <div className="flex items-center gap-2.5 px-2 pt-2 md:pt-0">
              <Sun className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">Light & Dark</div>
                <div className="text-[11px] text-[#8292AC]">Themes</div>
              </div>
            </div>

            {/* Item 5: Fully Editable */}
            <div className="flex items-center gap-2.5 px-2 pt-2 md:pt-0">
              <Edit3 className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">Fully Editable</div>
                <div className="text-[11px] text-[#8292AC]">in Figma</div>
              </div>
            </div>

            {/* Item 6: Responsive */}
            <div className="flex items-center gap-2.5 px-2 pt-2 md:pt-0">
              <Smartphone className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">Responsive</div>
                <div className="text-[11px] text-[#8292AC]">Web & Mobile</div>
              </div>
            </div>

          </div>
        </section>

        {/* ================= 12. PRODUCT INFORMATION TABS AND OVERVIEW PANEL ================= */}
        <section className="mt-8 rounded-[8px] border border-[#E5EAF1] bg-white overflow-hidden shadow-2xs">
          
          {/* 12A. Tabs Row */}
          <div className="border-b border-[#E5EAF1] px-5 bg-white">
            <nav className="flex items-center gap-7 overflow-x-auto scrollbar-none">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'features', label: 'Features' },
                { id: 'included', label: "What's Included" },
                { id: 'screenshots', label: 'Screenshots' },
                { id: 'reviews', label: 'Reviews (248)' },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`py-3 text-xs sm:text-[13px] font-semibold transition-colors cursor-pointer relative whitespace-nowrap ${
                      isActive
                        ? 'text-[#FF6500]'
                        : 'text-[#61789C] hover:text-[#101D39]'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#FF6500]" />
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* 12B & 12C. Overview Panel Content: Two Columns */}
          <div className="p-5 sm:p-7">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Column (approx 45%) */}
                <div className="lg:col-span-5 space-y-4">
                  <h2 className="text-xl sm:text-[22px] font-bold text-[#101D39] tracking-tight">
                    Build Faster. Design Better.
                  </h2>

                  <p className="text-xs text-[#61789C] leading-relaxed">
                    Kroma UI is a modern, enterprise-grade Figma UI kit designed to help you build beautiful and consistent digital products — faster. With 1,200+ carefully crafted components, 50+ ready-to-use screens, and both light and dark themes, Kroma UI gives you everything you need to create professional web and mobile applications.
                  </p>

                  {/* Feature Checklist: 5 items with orange checkmark icon */}
                  <div className="space-y-2 pt-1">
                    {[
                      '1,200+ production-ready components',
                      '50+ pre-designed screens & templates',
                      'Light & dark mode themes',
                      'Well-organized layers and global styles',
                      'Designed for web, mobile and SaaS products',
                    ].map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-[#101D39] font-medium">
                        <Check className="w-4 h-4 text-[#FF6500] stroke-[2.5] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  {/* Handwritten Tagline with decorative underline */}
                  <div className="pt-2">
                    <span 
                      className="text-lg text-[#FF6500] italic font-semibold inline-block relative select-none"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      Everything you need, in one place.
                      <svg
                        className="w-full h-2 text-[#FF6500] mt-0.5"
                        viewBox="0 0 180 8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2 5.5C45 2 135 2 178 5.5"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Right Column Product Artwork (approx 55%) */}
                <div className="lg:col-span-7">
                  <div className="relative rounded-xl overflow-hidden border border-[#E5EAF1] bg-[#FFF5EE]/50 p-2 sm:p-3 shadow-2xs">
                    <div className="relative w-full aspect-[16/10] max-h-[320px] rounded-lg overflow-hidden bg-white flex items-center justify-center">
                      <img
                        src={kromaOverviewImg}
                        alt="Kroma UI Overview Showcase"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />

                      {/* Floating Labels matching screenshot */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-[#101D39] shadow-xs border border-[#E5EAF1]">
                          <span className="w-2 h-2 rounded-full bg-[#FF6500]" />
                          Light & Dark Themes
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 text-[#101D39] shadow-xs border border-[#E5EAF1]">
                          <Sun className="w-3 h-3 text-[#FF6500]" />
                          1,200+ Components
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Tab: Features */}
            {activeTab === 'features' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#101D39]">Deep Feature Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Auto-Layout 5.0', desc: 'Every component uses clean responsive constraints and auto-layout spacing.' },
                    { title: 'Global Color Tokens', desc: 'Swappable variables for obsidian dark, radiant orange, and clean light.' },
                    { title: 'WCAG AAA Accessible', desc: 'Tested contrast scores ensuring universal accessibility compliance.' },
                    { title: '140+ Page Templates', desc: 'Dashboards, checkout funnels, landing headers, and mobile screens.' },
                    { title: 'Component Variants', desc: 'Interactive state toggles for hover, pressed, active, and loading.' },
                    { title: 'Lifetime Free Updates', desc: 'Receive all future Figma version upgrades and new UI tokens free.' },
                  ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-lg border border-[#E5EAF1] bg-white space-y-1">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#101D39]">
                        <CheckCircle2 className="w-4 h-4 text-[#FF6500]" />
                        <span>{item.title}</span>
                      </div>
                      <p className="text-xs text-[#61789C] leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: What's Included */}
            {activeTab === 'included' && (
              <div className="space-y-3">
                <h3 className="text-base font-bold text-[#101D39]">Package Contents Delivered</h3>
                <div className="rounded-lg border border-[#E5EAF1] p-4 bg-zinc-50 space-y-2">
                  {[
                    'Master Kroma UI Figma (.fig) file (142 MB)',
                    'Organized Design System Tokens JSON export',
                    'Figma Component Library publishing guide (PDF + Loom video)',
                    'Universal Commercial License waiver & invoice receipt',
                    'Discord VIP community access pass',
                  ].map((f, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-[#101D39] font-mono">
                      <Download className="w-3.5 h-3.5 text-[#FF6500]" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab: Screenshots */}
            {activeTab === 'screenshots' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#101D39]">Interface Previews & Artwork</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <img src={kromaOverviewImg} alt="Preview 1" className="rounded-lg border border-[#E5EAF1] w-full" />
                  <img src={activeMainImage} alt="Preview 2" className="rounded-lg border border-[#E5EAF1] w-full" />
                </div>
              </div>
            )}

            {/* Tab: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#E5EAF1]">
                  <h3 className="text-base font-bold text-[#101D39]">Customer Reviews (248)</h3>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#101D39]">
                    <Star className="w-4 h-4 fill-[#FFB323] text-[#FFB323]" />
                    <span>4.98 out of 5</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {[
                    { author: 'Sarah Jenkins', role: 'Head of Product Design at Vertex', text: 'The token architecture and dark/orange palette are impeccably organized. We ported our entire platform to Kroma UI in under 3 days.' },
                    { author: 'Marcus Brody', role: 'Principal Designer & Founder', text: 'Clean auto-layout math that actually maps 1:1 to Tailwind CSS classes. Outstanding quality.' },
                  ].map((r, i) => (
                    <div key={i} className="p-4 rounded-lg border border-[#E5EAF1] bg-white space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[#101D39]">{r.author}</span>
                        <span className="text-[#8292AC]">{r.role}</span>
                      </div>
                      <p className="text-xs text-[#61789C]">{r.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </section>

        {/* ================= 13. RELATED PRODUCTS SECTION ================= */}
        <section className="mt-10">
          
          {/* Header */}
          <div className="flex items-end justify-between pb-3">
            <div>
              <h2 className="text-lg font-bold text-[#101D39] tracking-tight">
                Related Products
              </h2>
              <p className="text-xs text-[#61789C]">
                You might also like these similar products
              </p>
            </div>

            <button
              onClick={() => {
                handleBack();
              }}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6500] hover:text-[#EA5800] transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5 Compact Product Cards in One Horizontal Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {relatedProducts.map((relProd) => {
              const relInCart = cart.some((c) => c.product.id === relProd.id);

              return (
                <div
                  key={relProd.id}
                  className="rounded-[8px] border border-[#E5EAF1] bg-white overflow-hidden shadow-2xs hover:border-[#FF6500]/60 transition-all flex flex-col justify-between group"
                >
                  {/* Artwork & category */}
                  <div
                    onClick={() => {
                      setSelectedProduct(relProd);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 cursor-pointer"
                  >
                    <img
                      src={resolveProductImage(relProd.coverImage)}
                      alt={relProd.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = 'true';
                          target.src = resolveProductImage(null);
                        }
                      }}
                    />

                    {/* Wishlist icon overlay */}
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white">
                        <Heart className="w-3 h-3" />
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      {/* Compact category badge */}
                      <span className="inline-block text-[10px] font-bold text-[#7A3E9D] bg-[#F2EAFA] px-2 py-0.5 rounded-full mb-1">
                        {relProd.category}
                      </span>

                      {/* Product Title */}
                      <h4
                        onClick={() => {
                          setSelectedProduct(relProd);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="text-xs font-bold text-[#101D39] line-clamp-1 hover:text-[#FF6500] transition-colors cursor-pointer"
                        title={relProd.title}
                      >
                        {relProd.title}
                      </h4>

                      {/* Rating and Reviews */}
                      <div className="flex items-center justify-between text-[11px] text-[#8292AC] mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#FFB323] text-[#FFB323]" />
                          <span className="font-bold text-[#101D39]">{relProd.rating}</span>
                          <span>({relProd.reviewCount})</span>
                        </div>
                        <span>{relProd.salesCount} sales</span>
                      </div>
                    </div>

                    {/* Price and Add to Cart Row */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#E5EAF1]/70">
                      <span className="text-sm font-extrabold text-[#101D39] tabular-nums">
                        ${relProd.salePrice ?? relProd.basePrice}
                      </span>

                      <button
                        onClick={() => addToCart(relProd, 'personal')}
                        className={`h-7 px-3 rounded-[6px] text-[11px] font-bold transition-all cursor-pointer ${
                          relInCart
                            ? 'bg-[#FFF5EE] text-[#FF6500] border border-[#FFE4D2]'
                            : 'bg-[#FF6500] hover:bg-[#EA5800] text-white shadow-2xs'
                        }`}
                      >
                        {relInCart ? 'In Cart' : 'Add to Cart'}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* ================= 14. BOTTOM TRUST AND SERVICE STRIP ================= */}
        <section className="mt-10 rounded-[8px] border border-[#E5EAF1] bg-[#F7F9FC] p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#E5EAF1]">
            
            {/* Item 1: 100% Secure Payments */}
            <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
              <ShieldCheck className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">100% Secure Payments</div>
                <div className="text-[11px] text-[#8292AC]">Multiple payment options</div>
              </div>
            </div>

            {/* Item 2: Instant Access */}
            <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
              <Zap className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">Instant Access</div>
                <div className="text-[11px] text-[#8292AC]">Get your products immediately</div>
              </div>
            </div>

            {/* Item 3: 24/7 Support */}
            <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
              <Headphones className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">24/7 Support</div>
                <div className="text-[11px] text-[#8292AC]">We&apos;re here to help</div>
              </div>
            </div>

            {/* Item 4: Global Marketplace */}
            <div className="flex items-center gap-3 px-2 pt-2 md:pt-0">
              <Globe className="w-5 h-5 text-[#FF6500] stroke-[2.2] shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#101D39]">Global Marketplace</div>
                <div className="text-[11px] text-[#8292AC]">Digital products for everyone</div>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Report Modal */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl border border-[#E5EAF1] space-y-4">
            <h3 className="text-base font-bold text-[#101D39]">Report Product</h3>
            <p className="text-xs text-[#61789C]">
              Help us maintain marketplace standards. Please describe why you are reporting this file:
            </p>

            {reportSubmitted ? (
              <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold text-center">
                Thank you. Our compliance team has received your report.
              </div>
            ) : (
              <div className="space-y-3">
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full h-10 rounded-lg border border-[#E5EAF1] px-3 text-xs text-[#101D39] focus:outline-none focus:border-[#FF6500]"
                >
                  <option value="copyright">Intellectual property / copyright concern</option>
                  <option value="malware">Security or broken file issue</option>
                  <option value="misleading">Misleading screenshots or title</option>
                  <option value="other">Other policy concern</option>
                </select>

                <textarea
                  placeholder="Additional details (optional)..."
                  rows={3}
                  className="w-full rounded-lg border border-[#E5EAF1] p-3 text-xs text-[#101D39] focus:outline-none focus:border-[#FF6500]"
                />

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => setIsReportOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-[#61789C] hover:bg-zinc-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setReportSubmitted(true);
                      setTimeout(() => {
                        setReportSubmitted(false);
                        setIsReportOpen(false);
                      }, 1800);
                    }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#FF6500] text-white hover:bg-[#EA5800]"
                  >
                    Submit Report
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
