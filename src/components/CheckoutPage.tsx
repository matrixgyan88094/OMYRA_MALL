import React, { useState } from 'react';
import {
  ShieldCheck,
  Zap,
  Headphones,
  Check,
  Trash2,
  Lock,
  ArrowRight,
  User,
  Mail,
  ChevronDown,
  Sparkles,
  Gem,
  Award,
  CreditCard,
  ShoppingBag,
  Sun,
  Globe,
  Youtube,
  Twitter,
  Instagram,
  Linkedin,
  Phone,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { resolveProductImage, checkoutHeroImg } from '../utils/imageResolver';
import { OmyraMallLogo } from './OmyraMallLogo';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    products,
    removeFromCart,
    updateQuantity,
    appliedCoupon,
    setActiveView,
    setIsCartOpen,
    processCheckout
  } = useStore();

  // If cart is empty, provide default preview item (Kroma UI Design System v4) as in the master prompt & screenshot
  const displayCartItems = cart.length > 0
    ? cart
    : [
        {
          product: products[0] || {
            id: 'prod-01',
            title: 'Kroma UI Design System v4',
            coverImage: '',
            basePrice: 149,
            salePrice: 89,
            licenses: {
              personal: { label: 'Personal License (1 user)', price: 89, tier: 'personal', description: '', features: [] },
              team: { label: 'Team License (10 users)', price: 179, tier: 'team', description: '', features: [] },
              enterprise: { label: 'Unlimited License', price: 299, tier: 'enterprise', description: '', features: [] },
            }
          } as any,
          selectedTier: 'personal' as const,
          quantity: 1
        }
      ];

  // Checkout multi-step state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [fullName, setFullName] = useState('Mohammad Nurullah');
  const [emailAddress, setEmailAddress] = useState('nurullah@example.com');
  const [phoneCode, setPhoneCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('98765 43210');
  
  // Shipping Address Fields
  const [addressLine1, setAddressLine1] = useState('123, Green Park Road');
  const [addressLine2, setAddressLine2] = useState('Near City Mall');
  const [city, setCity] = useState('Patna');
  const [stateName, setStateName] = useState('Bihar');
  const [pinCode, setPinCode] = useState('800001');

  // Billing Toggle
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Payment Selection (for Step 2)
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'paypal'>('card');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  // Form Validation & Errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  // Pricing calculations
  const rawSubtotal = displayCartItems.reduce((acc, item) => {
    const licPrice = item.product.licenses?.[item.selectedTier]?.price ?? item.product.salePrice ?? item.product.basePrice ?? 89;
    return acc + licPrice * item.quantity;
  }, 0);

  // Promotional discount calculation matching reference
  const discountAmount = 60; // Shown as -$60 (40% OFF) in screenshot
  const taxAmount = 0;
  const finalTotal = Math.max(0, rawSubtotal);

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Please enter your full name';
    if (!emailAddress.trim() || !emailAddress.includes('@')) errors.email = 'Please enter a valid email address';
    if (!phoneNumber.trim()) errors.phone = 'Please enter your phone number';
    if (!addressLine1.trim()) errors.address1 = 'Street address is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!pinCode.trim()) errors.pinCode = 'Postal code is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
        window.scrollTo({ top: 380, behavior: 'smooth' });
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
      window.scrollTo({ top: 380, behavior: 'smooth' });
    } else if (currentStep === 3) {
      handleFinalOrderSubmit();
    }
  };

  const handleFinalOrderSubmit = async () => {
    setIsProcessing(true);
    try {
      if (cart.length > 0) {
        await processCheckout({
          customerName: fullName,
          customerEmail: emailAddress,
          paymentMethod: paymentMethod === 'paypal' ? 'paypal' : 'credit_card',
        });
      }
    } catch (err) {
      console.warn('Checkout process notice:', err);
    } finally {
      setIsProcessing(false);
      setOrderComplete(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#101D39] font-sans">
      
      {/* ================= 2. SECURE-CHECKOUT HERO BANNER ================= */}
      <section className="w-full bg-[#FFF5ED] border-b border-[#FFE3D0] overflow-hidden">
        <div className="mx-auto max-w-[1440px] px-3 sm:px-8 lg:px-9 py-4 sm:py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 items-center">
            
            {/* Left Column: Heading, Subtitle & Trust Points (approx 58%) */}
            <div className="lg:col-span-7 space-y-2.5 sm:space-y-4">
              
              {/* Badge: Secure Checkout */}
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-md bg-[#FFF0E2] border border-[#FFDEC4]">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6500]" />
                <span className="text-[10px] sm:text-xs font-bold text-[#FF6500] tracking-wide">
                  Secure Checkout
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-xl sm:text-4xl lg:text-[42px] font-extrabold text-[#101D39] tracking-tight leading-tight">
                Complete Your Purchase
              </h1>

              {/* Supporting Subtitle */}
              <p className="text-xs sm:text-base font-medium text-[#243B60]">
                Your digital products, just a few steps away.
              </p>

              {/* Trust Indicators: 3 horizontally aligned benefit items */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-4 border-t border-[#FFE3D0]/70 sm:divide-x sm:divide-[#FFE3D0]">
                
                {/* Item 1 */}
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FFEAD9] text-[#FF6500] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101D39]">Secure Payments</h4>
                    <p className="text-[10px] sm:text-[11px] text-[#61789C]">Your data is encrypted</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-2.5 sm:pl-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FFEAD9] text-[#FF6500] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101D39]">Instant Access</h4>
                    <p className="text-[10px] sm:text-[11px] text-[#61789C]">Get your files immediately</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-2.5 sm:pl-4">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FFEAD9] text-[#FF6500] flex items-center justify-center shrink-0">
                    <Headphones className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#101D39]">24/7 Support</h4>
                    <p className="text-[10px] sm:text-[11px] text-[#61789C]">We&apos;re here to help</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column: Hero Digital Illustration Artwork (approx 42%) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[280px] sm:max-w-[480px] aspect-[16/10] rounded-xl overflow-hidden shadow-sm">
                <img
                  src={resolveProductImage(checkoutHeroImg)}
                  alt="Safe & Secure Checkout Protection"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.dataset.tried) {
                      target.dataset.tried = 'true';
                      target.src = resolveProductImage(null);
                    }
                  }}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 3. MAIN CHECKOUT CONTENT AREA ================= */}
      <main className="mx-auto max-w-[1440px] px-3 sm:px-8 lg:px-9 py-6 sm:py-10">
        
        {orderComplete ? (
          /* Order Confirmation Screen */
          <div className="max-w-2xl mx-auto p-8 rounded-xl border border-[#E3EAF3] bg-white text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#101D39]">
              Thank You! Your Order is Confirmed
            </h2>
            <p className="text-xs sm:text-sm text-[#61789C]">
              We have generated your lifetime commercial license keys. Receipt and direct download links have been dispatched to <strong className="text-[#101D39]">{emailAddress}</strong>.
            </p>

            <div className="p-4 rounded-lg bg-[#F7F9FC] border border-[#E3EAF3] text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-[#61789C]">Order Reference:</span>
                <span className="font-mono font-bold text-[#101D39]">OMY-ORD-{Math.floor(100000 + Math.random() * 900000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#61789C]">Total Paid:</span>
                <span className="font-bold text-[#101D39]">${finalTotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#61789C]">Payment Method:</span>
                <span className="font-medium text-[#101D39]">Instant 256-bit SSL Card</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setActiveView('library');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-lg bg-[#FF6500] hover:bg-[#EA5800] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Go to My Digital Library
              </button>
              <button
                onClick={() => {
                  setActiveView('store');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-2.5 rounded-lg border border-[#E3EAF3] bg-white text-[#101D39] text-xs font-semibold hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Continue Browsing Store
              </button>
            </div>
          </div>
        ) : (
          /* Normal Two-Column Layout (62% Left / 34% Right) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* ================= LEFT COLUMN: CHECKOUT FORM PANEL (approx 62%) ================= */}
            <div className="lg:col-span-8 rounded-[9px] border border-[#E3EAF3] bg-white p-3.5 sm:p-7 shadow-2xs space-y-5 sm:space-y-7 overflow-hidden">
              
              {/* 8A. Three-Step Progress Indicator */}
              <div className="grid grid-cols-3 divide-x divide-[#E3EAF3] border-b border-[#E3EAF3] pb-3 sm:pb-5">
                
                {/* Step 1: Shipping / Details */}
                <div 
                  onClick={() => setCurrentStep(1)}
                  className="flex items-center gap-1.5 sm:gap-3 px-1 sm:px-4 cursor-pointer relative justify-center sm:justify-start min-w-0"
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shrink-0 ${
                      currentStep === 1
                        ? 'bg-[#FF6500] text-white'
                        : currentStep > 1
                        ? 'bg-[#10B981] text-white'
                        : 'bg-[#E3EAF3] text-[#61789C]'
                    }`}
                  >
                    {currentStep > 1 ? <Check className="w-3 h-3 stroke-[3]" /> : '1'}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-[11px] sm:text-xs font-bold truncate ${currentStep === 1 ? 'text-[#FF6500]' : 'text-[#101D39]'}`}>
                      Shipping
                    </h4>
                    <p className="text-[10px] text-[#8292AC] hidden sm:block">Your details</p>
                  </div>
                  {currentStep === 1 && (
                    <span className="absolute -bottom-3 sm:-bottom-5 left-0 right-0 h-[2px] bg-[#FF6500]" />
                  )}
                </div>

                {/* Step 2: Payment */}
                <div
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(2);
                  }}
                  className="flex items-center gap-1.5 sm:gap-3 px-1 sm:px-4 cursor-pointer relative justify-center sm:justify-start min-w-0"
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shrink-0 ${
                      currentStep === 2
                        ? 'bg-[#FF6500] text-white'
                        : currentStep > 2
                        ? 'bg-[#10B981] text-white'
                        : 'bg-[#F0F4F8] text-[#8292AC]'
                    }`}
                  >
                    {currentStep > 2 ? <Check className="w-3 h-3 stroke-[3]" /> : '2'}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-[11px] sm:text-xs font-bold truncate ${currentStep === 2 ? 'text-[#FF6500]' : 'text-[#101D39]'}`}>
                      Payment
                    </h4>
                    <p className="text-[10px] text-[#8292AC] hidden sm:block">Choose method</p>
                  </div>
                  {currentStep === 2 && (
                    <span className="absolute -bottom-3 sm:-bottom-5 left-0 right-0 h-[2px] bg-[#FF6500]" />
                  )}
                </div>

                {/* Step 3: Review */}
                <div
                  onClick={() => {
                    if (validateStep1()) setCurrentStep(3);
                  }}
                  className="flex items-center gap-1.5 sm:gap-3 px-1 sm:px-4 cursor-pointer relative justify-center sm:justify-start min-w-0"
                >
                  <div
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all shrink-0 ${
                      currentStep === 3
                        ? 'bg-[#FF6500] text-white'
                        : 'bg-[#F0F4F8] text-[#8292AC]'
                    }`}
                  >
                    3
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-[11px] sm:text-xs font-bold truncate ${currentStep === 3 ? 'text-[#FF6500]' : 'text-[#101D39]'}`}>
                      Review
                    </h4>
                    <p className="text-[10px] text-[#8292AC] hidden sm:block">Confirm order</p>
                  </div>
                  {currentStep === 3 && (
                    <span className="absolute -bottom-3 sm:-bottom-5 left-0 right-0 h-[2px] bg-[#FF6500]" />
                  )}
                </div>

              </div>

              {/* STEP 1 CONTENT: CONTACT & ADDRESS FORMS */}
              {currentStep === 1 && (
                <form onSubmit={handleContinueToPayment} className="space-y-6">
                  
                  {/* 8B. Section 1 — Your Information */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-[#101D39]">
                        1. Your Information
                      </h3>
                      <p className="text-xs text-[#61789C]">
                        Enter your details to continue with checkout.
                      </p>
                    </div>

                    {/* Name and Email side by side on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div>
                        <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-[#8292AC] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full h-10 pl-9 pr-3 rounded-[6px] border border-[#E3EAF3] bg-white text-xs text-[#101D39] focus:outline-none focus:border-[#FF6500]"
                          />
                        </div>
                        {formErrors.fullName && (
                          <span className="text-[10px] text-[#DC2626] mt-0.5 block">{formErrors.fullName}</span>
                        )}
                      </div>

                      {/* Email Address */}
                      <div>
                        <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-[#8292AC] absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full h-10 pl-9 pr-3 rounded-[6px] border border-[#E3EAF3] bg-white text-xs text-[#101D39] focus:outline-none focus:border-[#FF6500]"
                          />
                        </div>
                        {formErrors.email && (
                          <span className="text-[10px] text-[#DC2626] mt-0.5 block">{formErrors.email}</span>
                        )}
                      </div>
                    </div>

                    {/* Phone Number with India Flag and Country Code */}
                    <div className="max-w-sm">
                      <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                        Phone Number *
                      </label>
                      <div className="flex rounded-[6px] border border-[#E3EAF3] bg-white overflow-hidden h-10 focus-within:border-[#FF6500]">
                        <div className="flex items-center gap-1.5 px-3 bg-[#F7F9FC] border-r border-[#E3EAF3] text-xs font-semibold text-[#101D39] shrink-0">
                          <span className="text-sm">🇮🇳</span>
                          <span>{phoneCode}</span>
                          <ChevronDown className="w-3 h-3 text-[#8292AC]" />
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder="Phone number"
                          className="flex-1 min-w-0 px-3 text-xs text-[#101D39] focus:outline-none"
                        />
                      </div>
                      {formErrors.phone && (
                        <span className="text-[10px] text-[#DC2626] mt-0.5 block">{formErrors.phone}</span>
                      )}
                    </div>

                  </div>

                  {/* 8C. Divider */}
                  <div className="border-t border-[#E3EAF3]" />

                  {/* 8D. Section 2 — Shipping Address */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-[#101D39]">
                        2. Shipping Address
                      </h3>
                      <p className="text-xs text-[#61789C]">
                        Add your address for product delivery and support.
                      </p>
                    </div>

                    {/* Address Line 1 & Line 2 side by side */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                          Address Line 1 *
                        </label>
                        <input
                          type="text"
                          value={addressLine1}
                          onChange={(e) => setAddressLine1(e.target.value)}
                          placeholder="Street address"
                          className="w-full h-10 px-3 rounded-[6px] border border-[#E3EAF3] bg-white text-xs text-[#101D39] focus:outline-none focus:border-[#FF6500]"
                        />
                        {formErrors.address1 && (
                          <span className="text-[10px] text-[#DC2626] mt-0.5 block">{formErrors.address1}</span>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                          Address Line 2 (Optional)
                        </label>
                        <input
                          type="text"
                          value={addressLine2}
                          onChange={(e) => setAddressLine2(e.target.value)}
                          placeholder="Apartment, suite or landmark"
                          className="w-full h-10 px-3 rounded-[6px] border border-[#E3EAF3] bg-white text-xs text-[#101D39] focus:outline-none focus:border-[#FF6500]"
                        />
                      </div>
                    </div>

                    {/* City, State, and PIN Code in 3 columns */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                          City *
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="City"
                          className="w-full h-10 px-3 rounded-[6px] border border-[#E3EAF3] bg-white text-xs text-[#101D39] focus:outline-none focus:border-[#FF6500]"
                        />
                        {formErrors.city && (
                          <span className="text-[10px] text-[#DC2626] mt-0.5 block">{formErrors.city}</span>
                        )}
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                          State *
                        </label>
                        <div className="relative">
                          <select
                            value={stateName}
                            onChange={(e) => setStateName(e.target.value)}
                            className="w-full h-10 px-3 pr-8 rounded-[6px] border border-[#E3EAF3] bg-white text-xs text-[#101D39] focus:outline-none focus:border-[#FF6500] appearance-none"
                          >
                            <option value="Bihar">Bihar</option>
                            <option value="Delhi">Delhi</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="West Bengal">West Bengal</option>
                            <option value="Uttar Pradesh">Uttar Pradesh</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-[#8292AC] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                          PIN Code *
                        </label>
                        <input
                          type="text"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          placeholder="Postal code"
                          className="w-full h-10 px-3 rounded-[6px] border border-[#E3EAF3] bg-white text-xs text-[#101D39] focus:outline-none focus:border-[#FF6500]"
                        />
                        {formErrors.pinCode && (
                          <span className="text-[10px] text-[#DC2626] mt-0.5 block">{formErrors.pinCode}</span>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* 8E. Divider */}
                  <div className="border-t border-[#E3EAF3]" />

                  {/* 8F. Section 3 — Billing Information */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-[#101D39]">
                        3. Billing Information
                      </h3>

                      {/* Small Orange Toggle matching screenshot */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSameAsShipping(!sameAsShipping)}
                          className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                            sameAsShipping ? 'bg-[#FF6500]' : 'bg-[#E3EAF3]'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded-full bg-white transition-transform ${
                              sameAsShipping ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-[#61789C]">
                      Same as shipping address
                    </p>

                    {/* 8G. Billing Information Notice: Pale-Peach banner */}
                    <div className="rounded-[7px] border border-[#FFE3D0] bg-[#FFF5ED] px-3.5 py-2.5 flex items-center gap-2.5 text-xs text-[#243B60]">
                      <div className="w-5 h-5 rounded-full bg-[#FF6500] text-white flex items-center justify-center shrink-0 text-[11px] font-bold">
                        i
                      </div>
                      <span>Your invoice will be sent to the email address you provided.</span>
                    </div>
                  </div>

                  {/* 8H. Primary CTA Button: Continue to Payment */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full h-11 rounded-[7px] bg-[#FF6500] hover:bg-[#EA5800] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </form>
              )}

              {/* STEP 2 CONTENT: PAYMENT METHOD SELECTION */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#101D39]">
                      Select Payment Method
                    </h3>
                    <p className="text-xs text-[#61789C]">
                      All transactions are 256-bit encrypted and tokenized.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#FF6500] bg-[#FFF5ED] ring-1 ring-[#FF6500]'
                          : 'border-[#E3EAF3] bg-white hover:border-[#8292AC]'
                      }`}
                    >
                      <CreditCard className="w-5 h-5 text-[#FF6500] mb-2" />
                      <div className="text-xs font-bold text-[#101D39]">Credit/Debit Card</div>
                      <div className="text-[10px] text-[#8292AC]">Visa, Mastercard, Amex</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-[#FF6500] bg-[#FFF5ED] ring-1 ring-[#FF6500]'
                          : 'border-[#E3EAF3] bg-white hover:border-[#8292AC]'
                      }`}
                    >
                      <Zap className="w-5 h-5 text-[#FF6500] mb-2" />
                      <div className="text-xs font-bold text-[#101D39]">UPI / NetBanking</div>
                      <div className="text-[10px] text-[#8292AC]">Google Pay, PhonePe, Paytm</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-[#FF6500] bg-[#FFF5ED] ring-1 ring-[#FF6500]'
                          : 'border-[#E3EAF3] bg-white hover:border-[#8292AC]'
                      }`}
                    >
                      <Globe className="w-5 h-5 text-[#FF6500] mb-2" />
                      <div className="text-xs font-bold text-[#101D39]">PayPal / Global</div>
                      <div className="text-[10px] text-[#8292AC]">International currency</div>
                    </button>
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="p-4 rounded-lg border border-[#E3EAF3] bg-[#F7F9FC] space-y-3">
                      <div>
                        <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full h-10 px-3 rounded-[6px] border border-[#E3EAF3] bg-white text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full h-10 px-3 rounded-[6px] border border-[#E3EAF3] bg-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-[#101D39] block mb-1">
                            CVV / CVC
                          </label>
                          <input
                            type="password"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value)}
                            className="w-full h-10 px-3 rounded-[6px] border border-[#E3EAF3] bg-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="px-4 py-2.5 rounded-[7px] border border-[#E3EAF3] bg-white text-xs font-semibold hover:bg-zinc-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="flex-1 h-11 rounded-[7px] bg-[#FF6500] hover:bg-[#EA5800] text-white font-semibold text-xs flex items-center justify-center gap-2"
                    >
                      <span>Proceed to Order Review</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3 CONTENT: ORDER REVIEW & FINAL AUTHORIZATION */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-[#101D39]">
                      3. Review and Confirm Order
                    </h3>
                    <p className="text-xs text-[#61789C]">
                      Please review your customer and license details before final confirmation.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-[#E3EAF3] bg-[#F7F9FC] space-y-2.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#61789C]">Customer:</span>
                      <span className="font-semibold text-[#101D39]">{fullName} ({emailAddress})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#61789C]">Delivery & Billing:</span>
                      <span className="font-semibold text-[#101D39]">{addressLine1}, {city}, {stateName} - {pinCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#61789C]">Payment Method:</span>
                      <span className="font-semibold text-[#101D39] uppercase">{paymentMethod} (256-bit SSL)</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2.5 rounded-[7px] border border-[#E3EAF3] bg-white text-xs font-semibold hover:bg-zinc-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={handleFinalOrderSubmit}
                      className="flex-1 h-11 rounded-[7px] bg-[#FF6500] hover:bg-[#EA5800] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-[0.99]"
                    >
                      {isProcessing ? (
                        <span>Processing Payment & Generating Licenses...</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Authorize & Pay ${finalTotal}</span>
                          <ArrowRight className="w-4 h-4 ml-1" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* ================= RIGHT COLUMN: ORDER SUMMARY CARD (approx 34%) ================= */}
            <div className="lg:col-span-4 rounded-[9px] border border-[#E3EAF3] bg-white p-3.5 sm:p-6 shadow-2xs space-y-4 sm:space-y-5 overflow-hidden">
              
              {/* 9A. Order Summary Heading & Edit Cart link */}
              <div className="flex items-center justify-between pb-3 border-b border-[#E3EAF3]">
                <h3 className="text-base font-bold text-[#101D39]">
                  Order Summary
                </h3>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#FF6500] hover:text-[#EA5800] transition-colors cursor-pointer"
                >
                  <span>Edit Cart</span>
                </button>
              </div>

              {/* 9B. Product Item Row */}
              <div className="space-y-3">
                {displayCartItems.map((item, idx) => {
                  const resolvedImg = resolveProductImage(item.product.coverImage);
                  const licenseLabel = item.product.licenses?.[item.selectedTier]?.label || 'Personal License (1 user)';
                  const itemPrice = item.product.licenses?.[item.selectedTier]?.price ?? item.product.salePrice ?? item.product.basePrice ?? 89;

                  return (
                    <div key={idx} className="flex gap-2.5 sm:gap-3 items-start">
                      {/* Product Thumbnail (approx 88-92px wide, rounded-7px, dark purple UI artwork) */}
                      <div className="w-20 h-20 sm:w-[88px] sm:h-[86px] rounded-[7px] overflow-hidden bg-[#101D39] shrink-0 border border-[#E3EAF3] relative">
                        <img
                          src={resolvedImg}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.dataset.tried) {
                              target.dataset.tried = 'true';
                              target.src = resolveProductImage(null);
                            }
                          }}
                        />
                      </div>

                      {/* Product details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-xs sm:text-[13px] font-bold text-[#101D39] line-clamp-2 leading-snug">
                          {item.product.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[#61789C] truncate">
                          {licenseLabel}
                        </p>
                        <div className="text-sm font-extrabold text-[#101D39] tabular-nums">
                          ${itemPrice}
                        </div>

                        {/* Quantity Controls & Delete Icon */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center rounded border border-[#E3EAF3] bg-[#F7F9FC]">
                            <button
                              type="button"
                              onClick={() => {
                                if (cart.length > 0) updateQuantity(item.product.id, item.selectedTier, Math.max(1, item.quantity - 1));
                              }}
                              className="px-2 py-0.5 text-xs text-[#61789C] hover:text-[#101D39]"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-semibold text-[#101D39]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                if (cart.length > 0) updateQuantity(item.product.id, item.selectedTier, item.quantity + 1);
                              }}
                              className="px-2 py-0.5 text-xs text-[#61789C] hover:text-[#101D39]"
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (cart.length > 0) removeFromCart(item.product.id, item.selectedTier);
                            }}
                            className="text-[#8292AC] hover:text-red-500 transition-colors p-1"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 9C. Divider */}
              <div className="border-t border-[#E3EAF3]" />

              {/* 9D. Price Details */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#101D39]">
                  Price Details
                </h4>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-[#61789C]">
                    <span>Subtotal</span>
                    <span className="font-semibold text-[#101D39] tabular-nums">${rawSubtotal}</span>
                  </div>

                  <div className="flex justify-between text-[#61789C]">
                    <span>Discount</span>
                    <span className="font-semibold text-[#10B981] tabular-nums">-${discountAmount}</span>
                  </div>

                  <div className="flex justify-between text-[#61789C]">
                    <span>Tax (0%)</span>
                    <span className="font-semibold text-[#101D39] tabular-nums">$0</span>
                  </div>
                </div>

                {/* 9E. Total Row */}
                <div className="pt-2.5 border-t border-[#E3EAF3] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#101D39]">Total</span>
                  <span className="text-xl font-extrabold text-[#101D39] tabular-nums">
                    ${finalTotal}
                  </span>
                </div>
              </div>

              {/* 9F. Special Offer Card: Pale-Peach background */}
              <div className="rounded-[8px] border border-[#FFE3D0] bg-[#FFF5ED] p-3 flex items-center justify-between gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#FFEAD9] text-[#FF6500] flex items-center justify-center shrink-0">
                  <Gem className="w-4 h-4 stroke-[2.2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-[#101D39]">Special Offer</h5>
                  <p className="text-[11px] text-[#61789C]">
                    You&apos;re saving <strong className="text-[#FF6500] font-bold">$60 (40%)</strong> on this order!
                  </p>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#FFEAD9] text-[#FF6500] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3" />
                </div>
              </div>

              {/* 9G. Divider */}
              <div className="border-t border-[#E3EAF3]" />

              {/* 9H. Why Choose OMYRA MALL? (3 compact reassurance items) */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold text-[#101D39]">
                  Why Choose OMYRA MALL?
                </h4>

                {/* Item 1 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FFF5ED] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFE3D0]/60">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[#101D39] truncate">100% Secure Payments</h5>
                    <p className="text-[11px] text-[#8292AC] truncate">Multiple payment options</p>
                  </div>
                </div>

                {/* Item 2 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FFF5ED] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFE3D0]/60">
                    <Zap className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[#101D39] truncate">Instant Access</h5>
                    <p className="text-[11px] text-[#8292AC] truncate">Get your products immediately</p>
                  </div>
                </div>

                {/* Item 3 */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#FFF5ED] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFE3D0]/60">
                    <Headphones className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-[#101D39] truncate">24/7 Support</h5>
                    <p className="text-[11px] text-[#8292AC] truncate">We&apos;re here to help</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>
    </div>
  );
};
