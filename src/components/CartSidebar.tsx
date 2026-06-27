import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, Plus, Minus, Tag, Check, HelpCircle, ArrowRight, Ticket } from 'lucide-react';
import { CartItem } from '../types';
import { PROMO_CODES } from '../data';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (subtotal: number, discount: number, finalTotal: number, promoCodeApplied: string) => void;
}

export default function CartSidebar({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartSidebarProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [appliedCode, setAppliedCode] = useState('');

  if (!isOpen) return null;

  // Pricing calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const discountAmount = subtotal * promoDiscount;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      setPromoError('Please enter a code.');
      return;
    }

    if (PROMO_CODES[code] !== undefined) {
      const discount = PROMO_CODES[code];
      setPromoDiscount(discount);
      setPromoSuccess(`Promo applied successfully! Saved ${(discount * 100).toFixed(0)}%.`);
      setAppliedCode(code);
      setPromoError('');
    } else {
      setPromoError('Invalid coupon code. Try OMYRA20, FREEBIE, or SUMMER30!');
      setPromoDiscount(0);
      setAppliedCode('');
      setPromoSuccess('');
    }
  };

  const handleClearPromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoError('');
    setPromoSuccess('');
    setAppliedCode('');
  };

  return (
    <div id="cart-sidebar-overlay" className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        id="cart-backdrop"
        onClick={onClose} 
        className="absolute inset-0 bg-[#0A0A0B]/80 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
      />

      {/* Cart Container Drawer */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div id="cart-container" className="w-screen max-w-md bg-[#0A0A0B] text-[#F4F4F4] border-l border-white/10 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
          
          {/* Cart Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-[#161618]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-[#D4FF5E]" />
              <h2 id="cart-drawer-heading" className="text-sm font-black uppercase tracking-widest text-white">Your Shopping Cart</h2>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="rounded-full bg-white/5 p-1.5 text-[#8E9299] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
            {cartItems.length === 0 ? (
              <div id="empty-cart-state" className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#161618] border border-white/5 text-[#8E9299] mb-4 animate-pulse">
                  <ShoppingBag className="h-8 w-8" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-[#F4F4F4]">Your cart is empty</h3>
                <p className="mt-2 text-xs text-[#8E9299] max-w-[240px] leading-relaxed">
                  Browse the mall catalogs and add high-quality templates, scripts, and developer guides to get started.
                </p>
                <button
                  id="cart-continue-shopping-btn"
                  onClick={onClose}
                  className="mt-6 rounded-xl bg-[#D4FF5E]/10 border border-[#D4FF5E]/20 px-5 py-2.5 text-xs font-black uppercase tracking-widest text-[#D4FF5E] hover:bg-[#D4FF5E]/20 transition-all cursor-pointer"
                >
                  Continue Browsing
                </button>
              </div>
            ) : (
              <div id="cart-items-list" className="space-y-4">
                {cartItems.map((item) => (
                  <div 
                    key={item.product.id} 
                    id={`cart-item-${item.product.id}`}
                    className="flex gap-4 rounded-2xl border border-white/5 bg-[#161618]/50 p-4 transition-all hover:border-white/10"
                  >
                    {/* Compact Image banner */}
                    <div 
                      className="h-14 w-20 rounded-xl overflow-hidden shrink-0 flex items-center justify-center relative"
                      style={{ background: item.product.coverImage }}
                    >
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:8px_8px]" />
                      <span className="text-[9px] font-black tracking-wider text-white drop-shadow uppercase z-10 bg-black/40 px-1.5 py-0.5 rounded">{item.product.category}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="truncate text-xs font-bold text-[#F4F4F4] uppercase tracking-wide">{item.product.title}</h4>
                        <button
                          id={`remove-item-${item.product.id}`}
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-[#8E9299] hover:text-red-400 p-0.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-4 mt-2">
                        {/* Quantity Controller */}
                        <div className="flex items-center border border-white/5 rounded-lg bg-[#0A0A0B] p-0.5">
                          <button
                            id={`qty-decrease-${item.product.id}`}
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="h-5 w-5 flex items-center justify-center text-[#8E9299] hover:text-white rounded cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-mono font-bold px-2.5 text-[#F4F4F4]">{item.quantity}</span>
                          <button
                            id={`qty-increase-${item.product.id}`}
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="h-5 w-5 flex items-center justify-center text-[#8E9299] hover:text-white rounded cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price computation */}
                        <div className="text-right">
                          <div className="text-xs font-black text-white font-mono">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pricing Summary Footer */}
          {cartItems.length > 0 && (
            <div id="cart-footer-rundown" className="border-t border-white/5 bg-[#161618] px-6 py-5 space-y-4">
              
              {/* Promo code entry */}
              <div className="space-y-1.5">
                {appliedCode ? (
                  <div className="flex items-center justify-between bg-[#D4FF5E]/10 px-3 py-2 rounded-xl border border-[#D4FF5E]/20">
                    <div className="flex items-center gap-2">
                      <Ticket className="h-3.5 w-3.5 text-[#D4FF5E]" />
                      <span className="text-xs font-bold uppercase tracking-wider text-[#D4FF5E]">Promo: {appliedCode}</span>
                    </div>
                    <button 
                      id="clear-promo-btn"
                      onClick={handleClearPromo} 
                      className="text-[10px] font-bold uppercase tracking-wider text-[#8E9299] hover:text-[#F4F4F4] underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="PROMO CODE"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-700 uppercase focus:outline-none focus:border-[#D4FF5E]"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-[#0A0A0B] border border-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#F4F4F4] hover:bg-white/5 transition-all cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                )}
                {promoError && (
                  <div className="text-[10px] font-bold uppercase text-red-400 pl-1">{promoError}</div>
                )}
                {promoSuccess && !appliedCode && (
                  <div className="text-[10px] font-bold uppercase text-emerald-400 pl-1">{promoSuccess}</div>
                )}
              </div>

              {/* Fee breakups */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#8E9299] uppercase tracking-wider text-[10px]">
                  <span>Subtotal</span>
                  <span className="text-white font-bold font-mono">${subtotal.toFixed(2)}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400 uppercase tracking-wider text-[10px]">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      Discount ({(promoDiscount * 100).toFixed(0)}%)
                    </span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#8E9299] uppercase tracking-wider text-[10px]">
                  <span>Delivery fee</span>
                  <span className="text-[#D4FF5E] font-bold font-mono">FREE</span>
                </div>
                
                <div className="flex justify-between border-t border-white/5 pt-3.5 text-xs font-black uppercase tracking-widest">
                  <span className="text-white">Total Checkout</span>
                  <span className="text-[#D4FF5E] text-base font-black font-mono">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                id="cart-checkout-cta"
                onClick={() => onCheckout(subtotal, discountAmount, finalTotal, appliedCode)}
                className="w-full rounded-xl bg-[#D4FF5E] py-3.5 text-xs font-black uppercase tracking-widest text-black hover:bg-[#c3ec4e] shadow-lg shadow-[#D4FF5E]/10 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-4 w-4 text-black" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
