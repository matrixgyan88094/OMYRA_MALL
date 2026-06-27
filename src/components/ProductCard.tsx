import React from 'react';
import { Star, ArrowRight, ShoppingCart, Layout, Code, BookOpen, Layers, Music, ArrowDown, ExternalLink } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: string;
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isAlreadyInCart: boolean;
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  isAlreadyInCart
}: ProductCardProps) {
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'templates': return <Layout className="h-3.5 w-3.5 text-[#D4FF5E]" />;
      case 'code': return <Code className="h-3.5 w-3.5 text-[#D4FF5E]" />;
      case 'ebooks': return <BookOpen className="h-3.5 w-3.5 text-[#D4FF5E]" />;
      case 'design': return <Layers className="h-3.5 w-3.5 text-[#D4FF5E]" />;
      case 'audio': return <Music className="h-3.5 w-3.5 text-[#D4FF5E]" />;
      default: return null;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'templates': return 'UI Template';
      case 'code': return 'Source Code';
      case 'ebooks': return 'E-Book / Guide';
      case 'design': return '3D Asset';
      case 'audio': return 'Audio Asset';
      default: return category;
    }
  };

  // Generate stylized decorative geometric grid for cards dynamically
  const cardGradient = product.coverImage || 'linear-gradient(135deg, #242427 0%, #161618 100%)';

  return (
    <div 
      id={`product-card-${product.id}`}
      className="group flex flex-col overflow-hidden rounded-[32px] border border-white/10 bg-[#161618] transition-all duration-300 hover:translate-y-[-6px] hover:border-[#D4FF5E]/30 hover:shadow-2xl hover:shadow-[#D4FF5E]/5"
    >
      {/* Dynamic Cover Artwork with Decorative Vectors */}
      <div 
        id={`product-cover-${product.id}`}
        onClick={() => onViewDetails(product)}
        className="relative aspect-video w-full cursor-pointer overflow-hidden flex items-center justify-center"
        style={{ background: cardGradient }}
      >
        {/* Semi-transparent pattern grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* Dynamic visual representations of products */}
        <div className="z-10 flex flex-col items-center justify-center p-4 text-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-black/40 backdrop-blur-md shadow-inner ring-1 ring-white/10 transition-all duration-500 group-hover:scale-110">
            {product.category === 'templates' && <Layout className="h-6 w-6 text-white" />}
            {product.category === 'code' && <Code className="h-6 w-6 text-white" />}
            {product.category === 'ebooks' && <BookOpen className="h-6 w-6 text-white" />}
            {product.category === 'design' && <Layers className="h-6 w-6 text-white" />}
            {product.category === 'audio' && <Music className="h-6 w-6 text-white" />}
          </div>
          <span className="text-[10px] font-black tracking-widest text-[#D4FF5E] uppercase drop-shadow">
            {product.tags[0] || 'Premium Asset'}
          </span>
          <span className="mt-1 max-w-[200px] truncate text-xs font-bold text-white uppercase tracking-wider drop-shadow-md">
            {product.fileSize} Zip Included
          </span>
        </div>

        {/* Floating elements */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded-full bg-black/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F4F4F4] backdrop-blur-md border border-white/10">
          {getCategoryIcon(product.category)}
          <span>{getCategoryLabel(product.category)}</span>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-black/80 px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#D4FF5E] backdrop-blur-md border border-white/10">
          <Star className="h-3 w-3 fill-[#D4FF5E] text-[#D4FF5E]" />
          <span>{product.rating.toFixed(2)}</span>
        </div>
      </div>

      {/* Card Content Description */}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 
            id={`product-title-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="cursor-pointer font-sans text-lg font-black uppercase italic tracking-tight text-[#F4F4F4] hover:text-[#D4FF5E] transition-colors line-clamp-1"
          >
            {product.title}
          </h3>
        </div>

        <p className="mt-2 text-xs text-[#8E9299] line-clamp-2 leading-relaxed">
          {product.tagline}
        </p>

        {/* Creator Credit Info */}
        <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex items-center gap-2.5">
            <img 
              src={product.creator.avatar} 
              alt={product.creator.name}
              referrerPolicy="no-referrer"
              className="h-7 w-7 rounded-full object-cover ring-1 ring-white/10"
            />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F4F4F4] line-clamp-1">
                {product.creator.name}
              </span>
              <span className="text-[9px] text-[#8E9299] uppercase font-mono">
                {product.creator.salesCount}+ Sales
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-[#8E9299] uppercase font-mono tracking-wider block">Price</span>
            <div className="text-lg font-black text-[#D4FF5E] font-mono">
              ${product.price.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-5 flex gap-2">
          <button
            id={`btn-view-${product.id}`}
            onClick={() => onViewDetails(product)}
            className="flex-1 rounded-xl bg-white/5 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-[#F4F4F4] hover:bg-white/10 border border-white/10 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            Explore
            <ArrowRight className="h-3 w-3" />
          </button>
          
          <button
            id={`btn-cart-${product.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            disabled={isAlreadyInCart}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
              isAlreadyInCart 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 cursor-default'
                : 'bg-[#D4FF5E] hover:bg-[#c3ec4e] text-black border border-transparent'
            }`}
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span>{isAlreadyInCart ? 'In Cart' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
