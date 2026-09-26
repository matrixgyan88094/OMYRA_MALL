import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CreditCard,
  Lock,
  ShoppingBag,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getCartSubtotal,
    getDiscountAmount,
    getCartTotal,
    processCheckout,
    clearCart,
  } = useStore();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Checkout Form State
  const [customerName, setCustomerName] = useState('Alex Morgan');
  const [customerEmail, setCustomerEmail] = useState('alex.morgan@designstudio.io');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'credit_card' | 'paypal'>('credit_card');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ name?: string; email?: string }>({});

  if (!isCartOpen) return null;

  const subtotal = getCartSubtotal();
  const discount = getDiscountAmount();
  const total = getCartTotal();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    setCouponFeedback(res);
    if (res.success) {
      setCouponCodeInput('');
    }
  };

  const handleCompleteOrder = (method: 'apple_pay' | 'credit_card' | 'paypal' = paymentMethod) => {
    // Form validation
    const errors: { name?: string; email?: string } = {};
    if (!customerName.trim()) errors.name = 'Please provide your name';
    if (!customerEmail.trim() || !customerEmail.includes('@')) errors.email = 'Valid email required for license delivery';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      processCheckout({
        customerName,
        customerEmail,
        paymentMethod: method,
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 text-zinc-900 shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-orange-600" />
              <h2 className="text-base font-bold text-zinc-950">
                Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)})
              </h2>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-900">Your bag is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Explore our design systems, developer kits, and 3D graphics to get started.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-3 rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-700 transition-colors"
                >
                  Browse Marketplace
                </button>
              </div>
            ) : (
              <>
                {/* Cart Items List */}
                <div className="space-y-3">
                  {cart.map((item) => {
                    const price = item.product.licenses[item.selectedTier].price;
                    return (
                      <div
                        key={`${item.product.id}-${item.selectedTier}`}
                        className="flex gap-3 p-3 rounded-xl border border-zinc-200 bg-white"
                      >
                        {/* Thumbnail */}
                        <div className="h-16 w-16 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                          <img
                            src={item.product.coverImage}
                            alt={item.product.title}
                            className="h-full w-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h4 className="text-xs font-semibold text-zinc-900 truncate">
                                {item.product.title}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.product.id, item.selectedTier)}
                                className="text-zinc-400 hover:text-red-500 transition-colors p-0.5"
                                title="Remove item"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <span className="text-[11px] font-medium text-orange-600">
                              {item.product.licenses[item.selectedTier].label}
                            </span>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center rounded border border-zinc-200 bg-zinc-50">
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.selectedTier, item.quantity - 1)
                                }
                                className="px-2 py-0.5 text-zinc-600 hover:text-zinc-900 transition-colors"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-2 text-xs font-mono font-medium text-zinc-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.product.id, item.selectedTier, item.quantity + 1)
                                }
                                className="px-2 py-0.5 text-zinc-600 hover:text-zinc-900 transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <span className="text-xs font-bold text-zinc-950 tabular-nums">
                                ${price * item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code Box */}
                <div className="pt-2">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-orange-200 bg-orange-50 text-xs">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-orange-600" />
                        <div>
                          <span className="font-semibold text-orange-900 font-mono">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-orange-700 ml-1.5">
                            ({appliedCoupon.discountType === 'percentage' ? `${appliedCoupon.discountValue}% off` : `$${appliedCoupon.discountValue} off`})
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-xs text-orange-700 hover:text-orange-900 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value)}
                        placeholder="Promo code (try LAUNCH20)"
                        className="flex-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs uppercase placeholder:normal-case placeholder-zinc-400 text-zinc-900 focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-zinc-800 transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}
                  {couponFeedback && (
                    <p
                      className={`text-[11px] mt-1.5 ${
                        couponFeedback.success ? 'text-emerald-600' : 'text-rose-500'
                      }`}
                    >
                      {couponFeedback.message}
                    </p>
                  )}
                </div>

                {/* Direct Checkout Form */}
                <div className="space-y-3 pt-3 border-t border-zinc-200">
                  <h4 className="text-xs font-semibold text-zinc-900">
                    License Delivery & Billing
                  </h4>

                  <div>
                    <label className="text-[11px] text-zinc-500 block mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => {
                        setCustomerName(e.target.value);
                        if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                      }}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                    />
                    {formErrors.name && (
                      <span className="text-[10px] text-rose-500">{formErrors.name}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-500 block mb-1">
                      Email Address (where download key is sent)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => {
                        setCustomerEmail(e.target.value);
                        if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                      }}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs text-zinc-900 focus:border-orange-500 focus:outline-none"
                    />
                    {formErrors.email && (
                      <span className="text-[10px] text-rose-500">{formErrors.email}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] text-zinc-500 block mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('credit_card')}
                        className={`py-2 px-2 rounded-lg border text-center text-xs font-medium transition-colors ${
                          paymentMethod === 'credit_card'
                            ? 'border-orange-500 bg-orange-50 text-orange-900 font-semibold'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        Credit Card
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('apple_pay')}
                        className={`py-2 px-2 rounded-lg border text-center text-xs font-medium transition-colors ${
                          paymentMethod === 'apple_pay'
                            ? 'border-orange-500 bg-orange-50 text-orange-900 font-semibold'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        Apple Pay
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('paypal')}
                        className={`py-2 px-2 rounded-lg border text-center text-xs font-medium transition-colors ${
                          paymentMethod === 'paypal'
                            ? 'border-orange-500 bg-orange-50 text-orange-900 font-semibold'
                            : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50'
                        }`}
                      >
                        PayPal
                      </button>
                    </div>
                  </div>

                  {paymentMethod === 'credit_card' && (
                    <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-zinc-500" />
                        <span className="font-mono text-zinc-700">{cardNumber}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">12/28</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Drawer Footer with Price Totals */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-zinc-200 bg-white space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span className="font-mono text-zinc-800 tabular-nums">${subtotal}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-orange-600 font-medium">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${discount}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-zinc-950 pt-2 border-t border-zinc-200">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg text-zinc-950 tabular-nums">
                    ${total}
                  </span>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                onClick={() => handleCompleteOrder()}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-orange-600 py-3.5 px-4 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 active:scale-98 transition-all min-h-[44px]"
              >
                {isSubmitting ? (
                  <span>Generating Licenses...</span>
                ) : (
                  <>
                    <Lock className="h-4 w-4" />
                    <span>Authorize & Pay ${total}</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>256-bit Encrypted Checkout · Instant Delivery</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
