import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, Copy, Download, CreditCard, Sparkles, Loader2, ArrowRight, Library } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  subtotal: number;
  discount: number;
  total: number;
  promoCodeApplied?: string;
  cartItems: CartItem[];
  onPurchaseComplete: (purchasedProducts: any[]) => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  subtotal,
  discount,
  total,
  promoCodeApplied,
  cartItems,
  onPurchaseComplete
}: CheckoutModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number: 1234 5678 1234 5678
    const val = e.target.value.replace(/\D/g, '').substring(0, 16);
    const matches = val.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(' '));
    } else {
      setCardNumber(val);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format expiration date: MM/YY
    const val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      setCardExpiry(`${val.substring(0, 2)}/${val.substring(2, 4)}`);
    } else {
      setCardExpiry(val);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!emailAddress.trim()) {
      setErrorMessage('Please enter an email address for asset delivery.');
      return;
    }
    if (!cardName.trim() || cardNumber.length < 19 || !cardExpiry.trim() || cardCvv.length < 3) {
      setErrorMessage('Please fill in complete credit card details (use test values).');
      return;
    }

    // Step 2: Processing payment mockup
    setStep('processing');
    
    setTimeout(() => {
      // Step 3: Success mockup after 2.5 seconds
      const simulatedOrderNo = `OM-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderNumber(simulatedOrderNo);
      setStep('success');

      // Sync purchased products back to app layout
      const boughtList = cartItems.map(item => ({
        id: item.product.id,
        title: item.product.title,
        price: item.product.price,
        coverImage: item.product.coverImage,
        category: item.product.category,
        downloadUrl: '#' // Simulated
      }));
      onPurchaseComplete(boughtList);
    }, 2500);
  };

  const handleCopyOrder = () => {
    navigator.clipboard.writeText(orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="checkout-modal-overlay" className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-[#0A0A0B]/95 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Checkout Window Container */}
      <div id="checkout-container" className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-[#161618] shadow-2xl">
        
        {/* Top brand block */}
        <div className="flex items-center justify-between border-b border-white/5 bg-[#0A0A0B]/40 px-6 py-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4.5 w-4.5 text-[#D4FF5E]" />
            <span className="text-xs font-black uppercase tracking-widest text-[#F4F4F4]">Secure Checkout</span>
          </div>
          {step !== 'processing' && (
            <button
              id="close-checkout-btn"
              onClick={onClose}
              className="rounded-full bg-white/5 p-1.5 text-[#8E9299] hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
        </div>

        {/* Dynamic content depending on Step */}
        {step === 'details' && (
          <form onSubmit={handleCheckoutSubmit} className="p-6 md:p-8 space-y-5">
            
            {/* Visual Credit Card Canvas Widget */}
            <div className="relative h-40 w-full rounded-2xl bg-gradient-to-tr from-[#0A0A0B] via-[#161618] to-black p-5 border border-white/10 overflow-hidden flex flex-col justify-between shadow-lg">
              <div className="absolute top-0 right-0 h-28 w-28 bg-[#D4FF5E]/5 rounded-bl-full pointer-events-none" />
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black tracking-widest text-[#D4FF5E]">OMYRA SECURE CARD</span>
                <Sparkles className="h-5 w-5 text-[#D4FF5E]" />
              </div>

              <div className="space-y-1">
                <span className="text-[9px] text-[#8E9299] font-mono tracking-wider">CARD NUMBER</span>
                <div className="font-mono text-base tracking-widest text-white font-bold">
                  {cardNumber || '•••• •••• •••• ••••'}
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[8px] text-[#8E9299] font-mono tracking-wider">HOLDER</span>
                  <div className="text-xs font-bold text-[#F4F4F4] uppercase truncate max-w-[150px]">
                    {cardName || 'YOUR FULL NAME'}
                  </div>
                </div>
                <div>
                  <span className="text-[8px] text-[#8E9299] font-mono tracking-wider">EXPIRES</span>
                  <div className="text-xs font-mono font-bold text-[#F4F4F4]">
                    {cardExpiry || 'MM/YY'}
                  </div>
                </div>
              </div>
            </div>

            {/* Error alerts */}
            {errorMessage && (
              <div className="rounded-xl bg-rose-500/10 p-3.5 border border-rose-500/20 text-center text-xs font-bold uppercase tracking-wider text-rose-400">
                {errorMessage}
              </div>
            )}

            {/* Delivery Email */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest">Delivery Email Address</label>
              <input
                type="email"
                placeholder="you@domain.com"
                required
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-700 focus:outline-none focus:border-[#D4FF5E]"
              />
              <span className="text-[9px] text-[#8E9299] uppercase font-mono tracking-wider block mt-1">Archives and licenses are sent here instantly.</span>
            </div>

            {/* Card Information Fields */}
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="e.g. Liam Jenkins"
                  required
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-700 focus:outline-none focus:border-[#D4FF5E]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest">Card Number</label>
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    required
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-700 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength={3}
                    required
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-700 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-[#8E9299] uppercase tracking-widest">Expiration Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full rounded-xl border border-white/10 bg-[#0A0A0B] px-3.5 py-2.5 text-xs text-[#F4F4F4] placeholder-slate-700 focus:outline-none focus:border-[#D4FF5E]"
                  />
                </div>

                <div className="flex flex-col justify-end text-right">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-[#8E9299]">Secured token flow</span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1 mt-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    SSL Enabled
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Pricing breakdown */}
            <div className="rounded-xl bg-[#0A0A0B]/55 p-4 border border-white/5 text-xs space-y-2">
              <div className="flex justify-between text-[#8E9299] uppercase tracking-wider text-[10px]">
                <span>Total Items</span>
                <span className="text-white font-bold">{cartItems.length} products</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 uppercase tracking-wider text-[10px]">
                  <span>Promo Code Applied ({promoCodeApplied})</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-white/5 pt-2 font-black uppercase tracking-widest text-[11px]">
                <span className="text-[#8E9299]">Total Charged</span>
                <span className="text-[#D4FF5E] font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Final checkout button */}
            <button
              id="checkout-finalize-btn"
              type="submit"
              className="w-full rounded-xl bg-[#D4FF5E] py-3.5 text-xs font-black uppercase tracking-widest text-black hover:bg-[#c3ec4e] shadow-lg shadow-[#D4FF5E]/10 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Pay ${total.toFixed(2)} & Instant Delivery</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        )}

        {/* Step 2: Processing Payment State */}
        {step === 'processing' && (
          <div id="checkout-processing-state" className="p-12 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 text-[#D4FF5E] animate-spin" />
            <div>
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Processing Your Order</h3>
              <p className="mt-2 text-xs text-[#8E9299] max-w-[280px] mx-auto leading-relaxed">
                We are securing your digital token, creating your personalized file archives, and setting up licensing profiles...
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1.5 text-[10px] text-[#8E9299] bg-[#0A0A0B] px-4 py-2 rounded-full border border-white/5 uppercase tracking-wider font-bold">
              <ShieldCheck className="h-3.5 w-3.5 text-[#D4FF5E]" />
              <span>Verifying with OMYRA secure systems</span>
            </div>
          </div>
        )}

        {/* Step 3: Success Receipt State */}
        {step === 'success' && (
          <div id="checkout-success-state" className="p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
            <div className="flex flex-col items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 mb-4 border border-emerald-500/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Payment Securely Completed!</h2>
              <p className="mt-2 text-xs text-[#8E9299] max-w-[280px] mx-auto leading-relaxed">
                Your order is confirmed. Your premium digital products have been added to your **My Purchases** section!
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="rounded-2xl border border-white/10 bg-[#0A0A0B] p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3 text-xs">
                <span className="text-[#8E9299] uppercase tracking-wider text-[10px]">Order Reference</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-white text-[11px]">{orderNumber}</span>
                  <button onClick={handleCopyOrder} className="text-[#8E9299] hover:text-[#D4FF5E] cursor-pointer relative">
                    <Copy className="h-3.5 w-3.5" />
                    {copied && (
                      <span className="absolute bottom-full right-0 bg-[#D4FF5E] text-black text-[9px] uppercase font-black tracking-widest px-1.5 py-0.5 rounded shadow whitespace-nowrap mb-1">
                        Copied
                      </span>
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-left">
                <span className="text-[9px] font-black text-[#8E9299] uppercase tracking-widest block mb-1">Delivered Products</span>
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center text-xs">
                    <span className="truncate text-white max-w-[200px] font-bold">{item.product.title}</span>
                    <span className="font-mono text-[#8E9299] font-bold">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between border-t border-white/5 pt-3 text-xs font-black uppercase tracking-widest text-[#D4FF5E]">
                <span>Amount Paid</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA redirections */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                id="checkout-library-btn"
                onClick={onClose}
                className="w-full rounded-xl bg-[#D4FF5E] py-3.5 text-xs font-black uppercase tracking-widest text-black hover:bg-[#c3ec4e] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Library className="h-4 w-4 text-black" />
                <span>Go to My Purchases</span>
              </button>
              <button
                id="checkout-close-success-btn"
                onClick={onClose}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-black uppercase tracking-widest text-[#8E9299] hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
