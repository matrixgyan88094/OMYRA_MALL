import React from 'react';
import { ShoppingBag, Star, Check } from 'lucide-react';
import { DigitalProduct } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: DigitalProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, cart } = useStore();

  const isAlreadyInCart = cart.some((item) => item.product.id === product.id);
  const displayPrice = product.salePrice ?? product.basePrice;
  const hasDiscount = product.salePrice && product.salePrice < product.basePrice;

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white transition-all duration-200 hover:border-orange-400/60 hover:shadow-md">
      {/* Product Image Stage */}
      <div 
        onClick={() => setSelectedProduct(product)}
        className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 cursor-pointer"
      >
        <img
          src={product.coverImage}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
        />

        {/* Clean format tag */}
        <div className="absolute top-3 right-3">
          <span className="rounded bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[11px] font-medium text-zinc-700 border border-zinc-200/80 shadow-xs">
            {product.format}
          </span>
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <span>{product.category}</span>
          <span aria-hidden="true">·</span>
          <span>v{product.version}</span>
          <span aria-hidden="true">·</span>
          <span>{product.fileSize}</span>
        </div>

        {/* Product Title */}
        <h3
          onClick={() => setSelectedProduct(product)}
          className="mt-2 text-base font-semibold text-zinc-950 group-hover:text-orange-600 transition-colors line-clamp-1 cursor-pointer"
        >
          {product.title}
        </h3>

        {/* Product Tagline */}
        <p className="mt-1 text-xs text-zinc-500 line-clamp-2 leading-relaxed flex-1">
          {product.tagline}
        </p>

        {/* Rating and Sales */}
        <div className="mt-3 flex items-center justify-between text-xs text-zinc-500 pt-3 border-t border-zinc-100">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-zinc-800">
              {product.rating}
            </span>
            <span className="text-zinc-400">({product.reviewCount})</span>
          </div>

          <span className="text-zinc-500">
            {product.salesCount.toLocaleString()} sales
          </span>
        </div>

        {/* Price & Action Row */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-zinc-950 tabular-nums">
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
              onClick={() => setSelectedProduct(product)}
              className="rounded-lg border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 transition-colors"
            >
              Details
            </button>

            <button
              onClick={() => addToCart(product, 'personal')}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                isAlreadyInCart
                  ? 'bg-zinc-100 text-orange-600 border border-orange-200'
                  : 'bg-orange-600 text-white hover:bg-orange-700 active:scale-95 shadow-sm'
              }`}
            >
              {isAlreadyInCart ? (
                <>
                  <Check className="h-3.5 w-3.5" />
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
