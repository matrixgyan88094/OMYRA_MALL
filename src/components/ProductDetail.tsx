import React, { useState } from 'react';
import { X, Star, Check, FileText, Globe, ShoppingCart, MessageSquare, Plus, ArrowLeft, BadgeCheck, ShieldCheck, Zap } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isAlreadyInCart: boolean;
  onAddReview: (productId: string, review: Omit<Review, 'id' | 'date'>) => void;
}

export default function ProductDetail({
  product,
  onClose,
  onAddToCart,
  isAlreadyInCart,
  onAddReview
}: ProductDetailProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'reviews'>('overview');
  
  // Simulated review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) {
      setReviewError('Please fill out all review fields.');
      return;
    }
    
    onAddReview(product.id, {
      user: reviewName,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=80', // Default user avatar
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewSuccess(true);
    setReviewName('');
    setReviewComment('');
    setReviewRating(5);
    setReviewError('');
    
    setTimeout(() => {
      setReviewSuccess(false);
    }, 4000);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'templates': return 'Design UI Template';
      case 'code': return 'SaaS Source Code';
      case 'ebooks': return 'Interactive E-Book';
      case 'design': return 'Premium 3D Assets';
      case 'audio': return 'Master Audio beats';
      default: return category;
    }
  };

  return (
    <div id="product-detail-modal" className="fixed inset-0 z-50 overflow-y-auto bg-[#0A0A0B]/95 backdrop-blur-md animate-in fade-in duration-300">
      <div className="min-h-screen px-4 py-8 md:p-8 lg:p-12">
        
        {/* Main detail container */}
        <div className="mx-auto max-w-5xl rounded-[32px] border border-white/10 bg-[#161618] shadow-2xl overflow-hidden">
          
          {/* Header Bar with back controls */}
          <div className="flex items-center justify-between border-b border-white/5 bg-[#0A0A0B]/60 px-6 py-5">
            <button
              id="detail-back-btn"
              onClick={onClose}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8E9299] hover:text-[#D4FF5E] transition-colors cursor-pointer animate-pulse"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Mall</span>
            </button>
            <button
              id="detail-close-btn"
              onClick={onClose}
              className="rounded-full bg-white/5 p-2 text-[#8E9299] hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Immersive Category Graphic Canvas */}
          <div 
            id="detail-canvas-banner"
            className="relative h-48 md:h-64 w-full flex items-center justify-center text-center p-6"
            style={{ background: product.coverImage }}
          >
            <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:20px_30px]" />
            <div className="z-10 max-w-2xl">
              <span className="rounded-full bg-black/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-[#D4FF5E] backdrop-blur-md ring-1 ring-white/10">
                {getCategoryLabel(product.category)}
              </span>
              <h1 id="detail-product-title" className="mt-3 font-display text-2xl md:text-4xl font-black uppercase italic tracking-tight text-white drop-shadow-lg">
                {product.title}
              </h1>
              <p className="mt-2 text-xs md:text-sm text-slate-100/90 drop-shadow max-w-xl mx-auto font-medium">
                {product.tagline}
              </p>
            </div>
          </div>

          {/* Grid Layout of Detail content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-6 md:p-8">
            
            {/* Left columns - product specifications & tabs */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Core tab buttons */}
              <div className="flex border-b border-white/5">
                <button
                  id="tab-overview"
                  onClick={() => setActiveTab('overview')}
                  className={`border-b-2 px-6 py-4.5 text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'overview'
                      ? 'border-[#D4FF5E] text-[#D4FF5E]'
                      : 'border-transparent text-[#8E9299] hover:text-[#F4F4F4]'
                  }`}
                >
                  Overview
                </button>
                <button
                  id="tab-files"
                  onClick={() => setActiveTab('files')}
                  className={`border-b-2 px-6 py-4.5 text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'files'
                      ? 'border-[#D4FF5E] text-[#D4FF5E]'
                      : 'border-transparent text-[#8E9299] hover:text-[#F4F4F4]'
                  }`}
                >
                  Files & Specs ({product.filesIncluded.length})
                </button>
                <button
                  id="tab-reviews"
                  onClick={() => setActiveTab('reviews')}
                  className={`border-b-2 px-6 py-4.5 text-xs font-black uppercase tracking-widest transition-all ${
                    activeTab === 'reviews'
                      ? 'border-[#D4FF5E] text-[#D4FF5E]'
                      : 'border-transparent text-[#8E9299] hover:text-[#F4F4F4]'
                  }`}
                >
                  Reviews ({product.reviews.length})
                </button>
              </div>

              {/* Tab Contents */}
              <div className="min-h-[250px]">
                {activeTab === 'overview' && (
                  <div id="overview-content" className="space-y-6">
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider mb-2">Product Description</h3>
                      <p className="text-xs md:text-sm text-[#8E9299] leading-relaxed whitespace-pre-wrap">
                        {product.description}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">Key Features & Benefits</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {product.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs text-[#8E9299]">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D4FF5E]/10 text-[#D4FF5E]">
                              <Check className="h-3 w-3" />
                            </span>
                            <span className="leading-tight">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {product.tags.map((tag) => (
                        <span key={tag} className="rounded-lg bg-[#0A0A0B] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#8E9299] border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'files' && (
                  <div id="files-content" className="space-y-6">
                    <div>
                      <h3 className="text-xs font-black text-white uppercase tracking-wider mb-3">Included Files</h3>
                      <p className="text-xs text-[#8E9299] mb-4">
                        Upon purchasing, you will obtain instant access to download the following file packages:
                      </p>
                      
                      <div className="space-y-2.5">
                        {product.filesIncluded.map((file, idx) => (
                          <div key={idx} className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0A0A0B]/40 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#161618] text-[#8E9299] border border-white/10">
                              <FileText className="h-4.5 w-4.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate text-xs font-bold text-[#F4F4F4]">{file}</div>
                              <div className="text-[10px] uppercase font-mono text-[#8E9299] mt-0.5">Secure Download Link Included</div>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-[#D4FF5E] bg-black/60 px-2.5 py-1 rounded border border-white/5 uppercase">
                              Zip Pack
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-dashed border-white/10 p-5">
                      <div className="flex items-start gap-3">
                        <ShieldCheck className="h-5 w-5 text-[#D4FF5E] shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">OMYRA Verified Purchases Protection</h4>
                          <p className="mt-1.5 text-xs text-[#8E9299] leading-relaxed">
                            All files listed on our mall undergo dynamic checksum auditing. You are guaranteed clean downloads that are secure and match the developer documentation perfectly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div id="reviews-content" className="space-y-6">
                    
                    {/* Review Listings */}
                    <div className="space-y-4">
                      {product.reviews.length === 0 ? (
                        <div className="text-center py-10 text-[#8E9299] text-xs uppercase tracking-widest font-bold">
                          No reviews listed yet. Be the first to share your experience!
                        </div>
                      ) : (
                        product.reviews.map((rev) => (
                          <div key={rev.id} className="rounded-2xl border border-white/5 bg-[#0A0A0B]/20 p-5">
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <img 
                                  src={rev.avatar} 
                                  alt={rev.user}
                                  referrerPolicy="no-referrer"
                                  className="h-8 w-8 rounded-full object-cover ring-1 ring-white/10"
                                />
                                <div>
                                  <div className="text-xs font-bold text-white uppercase tracking-wider">{rev.user}</div>
                                  <div className="text-[10px] font-mono text-[#8E9299]">{rev.date}</div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-0.5 text-[#D4FF5E]">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < rev.rating ? 'fill-[#D4FF5E] text-[#D4FF5E]' : 'text-slate-800'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="mt-3 text-xs text-[#8E9299] leading-relaxed whitespace-pre-wrap">
                              {rev.comment}
                            </p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Submit Review Form */}
                    <div className="rounded-[24px] border border-white/10 bg-[#0A0A0B]/40 p-6">
                      <h4 className="text-xs font-black text-white uppercase tracking-widest mb-4">Write a Product Review</h4>
                      
                      {reviewSuccess ? (
                        <div className="rounded-xl bg-[#D4FF5E]/15 p-4 border border-[#D4FF5E]/30 text-center">
                          <span className="text-xs font-bold text-[#D4FF5E]">Thank you! Your feedback has been dynamically processed.</span>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmitReview} className="space-y-4">
                          {reviewError && (
                            <div className="text-xs font-bold text-red-400 uppercase tracking-wide">{reviewError}</div>
                          )}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Your Name</label>
                              <input
                                type="text"
                                value={reviewName}
                                onChange={(e) => setReviewName(e.target.value)}
                                placeholder="e.g. Liam Taylor"
                                className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] py-2 px-4 text-xs text-[#F4F4F4] focus:outline-none focus:border-[#D4FF5E]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Rating Value</label>
                              <select
                                value={reviewRating}
                                onChange={(e) => setReviewRating(Number(e.target.value))}
                                className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] py-2 px-4 text-xs text-[#F4F4F4] focus:outline-none focus:border-[#D4FF5E] cursor-pointer"
                              >
                                <option value="5">⭐⭐⭐⭐⭐ Excellent (5/5)</option>
                                <option value="4">⭐⭐⭐⭐ Great (4/5)</option>
                                <option value="3">⭐⭐⭐ Average (3/5)</option>
                                <option value="2">⭐⭐ Fair (2/5)</option>
                                <option value="1">⭐ Poor (1/5)</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-1.5">Comment</label>
                            <textarea
                              rows={3}
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              placeholder="Describe your experience with this developer artifact..."
                              className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] py-2 px-4 text-xs text-[#F4F4F4] focus:outline-none focus:border-[#D4FF5E]"
                            />
                          </div>
                          <button
                            type="submit"
                            className="w-full rounded-xl bg-[#D4FF5E] py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#c3ec4e] transition-all cursor-pointer"
                          >
                            Submit Review
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right column - purchase box & creator info */}
            <div className="space-y-6">
              
              {/* Checkout Action Box */}
              <div className="rounded-[24px] border border-white/10 bg-[#0A0A0B]/80 p-6 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 h-16 w-16 bg-[#D4FF5E]/10 rounded-bl-full flex items-center justify-center pointer-events-none">
                  <Zap className="h-4.5 w-4.5 text-[#D4FF5E] rotate-12 animate-bounce" />
                </div>

                <div className="text-[10px] font-black text-[#D4FF5E] uppercase tracking-widest">Instant Delivery</div>
                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white font-mono tracking-tighter">${product.price.toFixed(2)}</span>
                  <span className="text-xs text-[#8E9299] line-through font-mono">${(product.price * 1.4).toFixed(0)}</span>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">40% Off</span>
                </div>
                <p className="mt-3 text-xs text-[#8E9299] leading-relaxed">
                  Includes lifetime updates, support license, and instant access to download archives.
                </p>

                <div className="mt-6 space-y-2.5">
                  <button
                    id="detail-checkout-btn"
                    onClick={() => onAddToCart(product)}
                    disabled={isAlreadyInCart}
                    className={`w-full rounded-xl py-3.5 text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isAlreadyInCart
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-[#D4FF5E] text-black hover:bg-[#c3ec4e] shadow-lg shadow-[#D4FF5E]/10'
                    }`}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{isAlreadyInCart ? 'Item in Shopping Cart' : 'Add to Shopping Cart'}</span>
                  </button>

                  {product.demoUrl && (
                    <a
                      href={product.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-bold uppercase tracking-wider text-[#F4F4F4] hover:bg-white/10 transition-all flex items-center justify-center gap-1.5"
                    >
                      <Globe className="h-3.5 w-3.5 text-[#D4FF5E]" />
                      <span>Live Sandbox Preview</span>
                      <X className="h-3 w-3 rotate-45" />
                    </a>
                  )}
                </div>

                <div className="mt-6 border-t border-white/5 pt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[11px] text-[#8E9299] uppercase font-mono tracking-wider">
                    <ShieldCheck className="h-4 w-4 text-[#D4FF5E] shrink-0" />
                    <span>Safe 256-bit SSL Escrows</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#8E9299] uppercase font-mono tracking-wider">
                    <Check className="h-4 w-4 text-[#D4FF5E] shrink-0" />
                    <span>Format: ZIP Archive ({product.fileSize})</span>
                  </div>
                </div>
              </div>

              {/* Creator Metadata */}
              <div className="rounded-[24px] border border-white/10 bg-[#161618] p-6">
                <h4 className="text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-3">Listed By Creator</h4>
                
                <div className="flex items-start gap-3">
                  <img 
                    src={product.creator.avatar} 
                    alt={product.creator.name}
                    referrerPolicy="no-referrer"
                    className="h-10 w-10 rounded-full object-cover border border-white/10 ring-2 ring-black"
                  />
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">{product.creator.name}</span>
                      {product.creator.badge && (
                        <BadgeCheck className="h-3.5 w-3.5 text-[#D4FF5E] shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#8E9299] uppercase font-mono mt-0.5">Author of {product.category} items</p>
                    <div className="mt-3.5 grid grid-cols-2 gap-4 border-t border-white/5 pt-3">
                      <div>
                        <div className="text-[9px] text-[#8E9299] uppercase font-black tracking-widest">Total Sales</div>
                        <div className="text-xs font-bold text-[#F4F4F4] font-mono mt-0.5">{product.creator.salesCount}+</div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#8E9299] uppercase font-black tracking-widest">Rating</div>
                        <div className="text-xs font-bold text-[#D4FF5E] font-mono mt-0.5 flex items-center gap-0.5">
                          <Star className="h-3 w-3 fill-[#D4FF5E] text-[#D4FF5E]" />
                          <span>{product.creator.rating || '4.8'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* General details specifications table */}
              <div className="rounded-[24px] border border-white/10 bg-[#161618] p-6 space-y-3 text-xs text-[#8E9299]">
                <h4 className="text-[10px] font-black text-[#8E9299] uppercase tracking-widest mb-2">Technical Specs</h4>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="uppercase tracking-wider font-semibold text-[10px]">File Size</span>
                  <span className="text-white font-bold font-mono">{product.fileSize}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="uppercase tracking-wider font-semibold text-[10px]">Category</span>
                  <span className="text-white font-bold uppercase font-mono text-[10px]">{product.category}</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="uppercase tracking-wider font-semibold text-[10px]">Published</span>
                  <span className="text-white font-bold font-mono">{product.createdAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="uppercase tracking-wider font-semibold text-[10px]">License</span>
                  <span className="text-white font-bold uppercase text-[10px] tracking-wider">Standard</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
