import React from 'react';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { DigitalProduct } from '../types';
import { useStore } from '../context/StoreContext';
import { TechToolIcon } from './TechToolIcon';
import { resolveProductImage } from '../utils/imageResolver';

interface ProductCardProps {
  product: DigitalProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, cart } = useStore();

  const isAlreadyInCart = cart.some((item) => item.product.id === product.id);
  const displayPrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;

  // Formatted tag label (e.g. "Featured", "Verified", "Hot Release")
  const pillTag = product.isNew 
    ? 'New Release' 
    : product.featured 
    ? 'Verified Asset' 
    : product.category;

  const resolvedCover = resolveProductImage(product.coverImage);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200/90 bg-white transition-all duration-200 hover:border-orange-400/80 hover:shadow-lg hover:shadow-orange-950/5">
      {/* Product Image Stage */}
      <div 
        onClick={() => {
          setSelectedProduct(product);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 cursor-pointer"
      >
        <img
          src={resolvedCover}
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={(e) => {
            const target = e.currentTarget;
            if (!target.dataset.triedFallback) {
              target.dataset.triedFallback = 'true';
              target.src = resolveProductImage(null);
            }
          }}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Top-Left: Light Purple Pill Tag as seen in the screenshot */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center rounded-full bg-purple-50/95 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-semibold text-purple-700 border border-purple-200/90 shadow-2xs">
            {pillTag}
          </span>
        </div>

        {/* Top-Right: Clean format tag */}
        <div className="absolute top-3 right-3">
          <span className="rounded bg-white/95 backdrop-blur-sm px-2 py-0.5 text-[11px] font-medium text-zinc-700 border border-zinc-200/80 shadow-2xs font-mono">
            {product.format}
          </span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span className="font-medium text-zinc-700">{product.category}</span>
          <span aria-hidden="true">·</span>
          <span>v{product.version}</span>
          <span aria-hidden="true">·</span>
          <span>{product.fileSize}</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => {
            setSelectedProduct(product);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="mt-2 text-base font-semibold text-zinc-950 group-hover:text-[#f95a12] transition-colors line-clamp-1 cursor-pointer tracking-tight"
        >
          {product.title}
        </h3>

        {/* Product Tagline */}
        <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed flex-1">
          {product.tagline}
        </p>

        {/* Exact Framework & Tool Vector Logos */}
        {product.tools && product.tools.length > 0 && (
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {product.tools.slice(0, 4).map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-1 rounded bg-zinc-100 hover:bg-zinc-200/80 px-2 py-0.5 text-[11px] font-medium text-zinc-700 transition-colors border border-zinc-200/60"
                title={tool}
              >
                <TechToolIcon toolName={tool} className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate max-w-[85px]">{tool}</span>
              </span>
            ))}
            {product.tools.length > 4 && (
              <span className="text-[10px] font-semibold text-zinc-400">
                +{product.tools.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Rating and Sales */}
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-zinc-800">
              {product.rating}
            </span>
            <span className="text-zinc-400">({product.reviewCount})</span>
          </div>

          <span className="text-zinc-500 font-medium">
            {product.salesCount.toLocaleString()} sales
          </span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-zinc-950 tabular-nums tracking-tight">
              ${displayPrice}
            </span>
            {hasDiscount && (
              <span className="text-xs text-zinc-400 line-through tabular-nums">
                ${product.basePrice}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedProduct(product);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 hover:border-zinc-300 transition-colors cursor-pointer"
            >
              Details
            </button>

            <button
              onClick={() => addToCart(product, 'personal')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all cursor-pointer ${
                isAlreadyInCart
                  ? 'bg-orange-50 text-[#f95a12] border border-orange-200'
                  : 'bg-[#f95a12] text-white hover:bg-[#e04a07] active:scale-95 shadow-xs'
              }`}
            >
              {isAlreadyInCart ? (
                <>
                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                  <span>In Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
