import React, { useState } from 'react';
import {
  Mail,
  Phone,
  ShieldCheck,
  Zap,
  Headphones,
  Sparkles,
  ArrowRight,
  Lock,
  Award,
  CheckCircle2,
  FileText,
  Smartphone,
  X,
  Clock,
  Layers,
  Code2,
  Box,
  Palette,
  Check
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { OmyraMallLogo } from './OmyraMallLogo';

type LegalModalType = 'privacy' | 'terms' | 'license' | 'pwa' | null;

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedProduct } = useStore();

  // Newsletter state
  const [emailInput, setEmailInput] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [newsletterMessage, setNewsletterMessage] = useState('');

  // Legal modal state
  const [activeModal, setActiveModal] = useState<LegalModalType>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setNewsletterStatus('error');
      setNewsletterMessage('Please enter a valid email address.');
      return;
    }

    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setNewsletterMessage('Welcome to OMYRA MALL! Check your inbox for your 15% welcome discount.');
      setEmailInput('');
    }, 600);
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveView('store');
    setSelectedProduct(null);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleExploreNow = () => {
    setActiveView('store');
    setSelectedProduct(null);
    const catalog = document.getElementById('marketplace-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-white text-[#58769F] overflow-hidden border-t border-[#E4EDF7]">
      
      {/* ========================================================================= */}
      {/* SECTION 1: PREMIUM PROMOTIONAL CTA BANNER                                */}
      {/* ========================================================================= */}
      <div className="pt-8 sm:pt-12 lg:pt-14 pb-8 sm:pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFF5EC] via-[#FFF8F3] to-[#FFF0E4] border border-[#FFE5D2] p-6 sm:p-9 lg:p-11 overflow-hidden shadow-xs">
            
            {/* Ambient decorative warm blurs */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#FF6500]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#FF7A1A]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center relative z-10">
              
              {/* Left & Center Content (approx 68% desktop) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-5 sm:space-y-6">
                
                {/* Rounded Peach Pill Badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0E3] border border-[#FFDEC4]">
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6500]" />
                  <span className="text-xs font-semibold text-[#FF6500] tracking-wide">
                    ✦ Join OMYRA MALL
                  </span>
                </div>

                {/* Main Headline */}
                <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-extrabold text-[#102B52] tracking-tight leading-[1.18]">
                  Get the Best Digital Products <br className="hidden sm:inline" />
                  and <span className="text-[#FF6500]">Grow Your Creativity!</span>
                </h2>

                {/* Description */}
                <p className="text-sm sm:text-base text-[#58769F] max-w-xl leading-relaxed">
                  Join thousands of creators, developers and businesses who trust OMYRA MALL for premium digital products.
                </p>

                {/* Center 3 Benefit Items */}
                <div className="pt-1 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 sm:divide-x divide-[#FFE5D2]">
                  {/* Benefit 1 */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFDEC4]/70">
                      <Zap className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#102B52]">Instant Access</h4>
                      <p className="text-[11px] sm:text-xs text-[#58769F] truncate">Start using your products immediately</p>
                    </div>
                  </div>

                  {/* Benefit 2 */}
                  <div className="flex items-center gap-3 sm:pl-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFDEC4]/70">
                      <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#102B52]">Secure Payments</h4>
                      <p className="text-[11px] sm:text-xs text-[#58769F] truncate">Your data is 100% protected</p>
                    </div>
                  </div>

                  {/* Benefit 3 */}
                  <div className="flex items-center gap-3 sm:pl-4">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFDEC4]/70">
                      <Headphones className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#102B52]">24/7 Support</h4>
                      <p className="text-[11px] sm:text-xs text-[#58769F] truncate">We&apos;re always here to help</p>
                    </div>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={handleExploreNow}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 sm:px-7 sm:py-3.5 rounded-xl font-semibold text-white bg-[#FF6500] hover:bg-[#EA5800] active:scale-[0.98] transition-all shadow-sm hover:shadow-md cursor-pointer text-sm sm:text-base group"
                  >
                    <span>Explore Now</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

              </div>

              {/* Right Illustration: High-End Marketplace & Laptop Device Artwork */}
              <div className="lg:col-span-5 xl:col-span-4 flex items-center justify-center relative">
                <div className="relative w-full max-w-[340px] sm:max-w-[380px] lg:max-w-full aspect-[4/3] flex items-center justify-center">
                  
                  {/* Subtle warm backdrop circle */}
                  <div className="absolute w-56 h-56 rounded-full bg-gradient-to-tr from-[#FFDEC4]/60 to-[#FFF0E3]/90 blur-xl" />

                  {/* Floating Creative Software & Digital Product Badges */}
                  {/* 1. Figma / UI Kit Badge */}
                  <div className="absolute -top-1 left-2 sm:left-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#FFE5D2] shadow-sm animate-bounce [animation-duration:4s]">
                    <div className="w-6 h-6 rounded-lg bg-orange-50 text-[#FF6500] flex items-center justify-center">
                      <Palette className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#102B52]">UI Kits</span>
                  </div>

                  {/* 2. React / Code Script Badge */}
                  <div className="absolute top-8 -right-1 sm:right-2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#FFE5D2] shadow-sm animate-bounce [animation-duration:5s]">
                    <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Code2 className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#102B52]">Dev Stacks</span>
                  </div>

                  {/* 3. 3D Graphics Badge */}
                  <div className="absolute -bottom-2 right-4 sm:right-8 z-20 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-xs border border-[#FFE5D2] shadow-sm">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                      <Box className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-[#102B52]">3D Assets</span>
                  </div>

                  {/* Silver Laptop Displaying OMYRA MALL Interface */}
                  <div className="relative z-10 w-[84%] sm:w-[88%] bg-[#E4EDF7] p-2 sm:p-2.5 rounded-t-2xl shadow-xl border-t border-l border-r border-white">
                    {/* Camera dot */}
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mx-auto mb-1.5" />
                    
                    {/* Screen Bezel */}
                    <div className="rounded-lg bg-white overflow-hidden border border-slate-200/60 shadow-inner">
                      
                      {/* Laptop Screen Top Header */}
                      <div className="bg-[#102B52] px-2.5 py-1.5 flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-[#FF6500]" />
                          <span className="text-[9px] font-bold text-white tracking-wider">OMYRA MALL</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[8px] px-1.5 py-0.5 rounded-xs bg-[#FF6500] text-white font-medium">PRO</span>
                        </div>
                      </div>

                      {/* Screen Storefront Body */}
                      <div className="p-2.5 bg-[#F9FBFE] space-y-2">
                        {/* Mini Search & Banner Bar */}
                        <div className="h-4 rounded-md bg-[#FFEAD9] border border-[#FFDEC4] flex items-center px-2">
                          <span className="text-[7.5px] font-medium text-[#FF6500]">Search 5,000+ Verified Assets...</span>
                        </div>

                        {/* Mini Product Cards Grid inside Laptop Screen */}
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="rounded-md border border-[#E4EDF7] bg-white p-1.5 shadow-2xs space-y-1">
                            <div className="h-8 rounded-sm bg-gradient-to-tr from-orange-100 to-amber-50 flex items-center justify-center">
                              <Layers className="w-3.5 h-3.5 text-[#FF6500]" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-bold text-[#102B52]">Kroma UI</span>
                              <span className="text-[8px] font-extrabold text-[#FF6500]">$29</span>
                            </div>
                          </div>

                          <div className="rounded-md border border-[#E4EDF7] bg-white p-1.5 shadow-2xs space-y-1">
                            <div className="h-8 rounded-sm bg-gradient-to-tr from-blue-100 to-indigo-50 flex items-center justify-center">
                              <Code2 className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-[8px] font-bold text-[#102B52]">Next SaaS</span>
                              <span className="text-[8px] font-extrabold text-[#FF6500]">$49</span>
                            </div>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Laptop Keyboard Base & Hinge */}
                    <div className="mt-1.5 h-2 rounded-b-lg bg-[#CBD5E1] border-t border-slate-300 relative shadow-sm">
                      <div className="w-12 h-0.5 bg-slate-400 rounded-full mx-auto" />
                    </div>

                  </div>

                  {/* Decorative Potted Plant on bottom left */}
                  <div className="absolute -bottom-2 -left-2 z-20 flex items-end">
                    <div className="relative">
                      {/* Leaf 1 */}
                      <div className="w-3.5 h-5 rounded-tl-full bg-emerald-500 transform -rotate-12 origin-bottom-right" />
                      {/* Leaf 2 */}
                      <div className="absolute bottom-1 -right-1 w-3.5 h-5 rounded-tr-full bg-emerald-600 transform rotate-20 origin-bottom-left" />
                      {/* Pot */}
                      <div className="w-4 h-3.5 bg-amber-700/80 rounded-b-sm border-t border-amber-600" />
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 2: MAIN FOOTER CONTENT (FIVE DESKTOP COLUMNS)                    */}
      {/* ========================================================================= */}
      <div className="py-12 sm:py-16 border-t border-[#E4EDF7] bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 lg:gap-8">
            
            {/* ---------------- COLUMN 1: BRAND INFORMATION (lg:col-span-4) ---------------- */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center">
                <OmyraMallLogo />
              </div>

              <p className="text-xs sm:text-sm text-[#58769F] leading-relaxed max-w-sm">
                OMYRA MALL is a digital marketplace providing verified codebases, UI design kits, WordPress themes, 3D graphics, and dev stacks. Engineered with high production standards and continuous updates.
              </p>

              {/* Social Channels */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-[#102B52] block">Follow Our Community</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube Channel"
                    className="w-8 h-8 rounded-full border border-[#E4EDF7] flex items-center justify-center text-[#58769F] hover:text-[#FF6500] hover:border-[#FF6500] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter / X"
                    className="w-8 h-8 rounded-full border border-[#E4EDF7] flex items-center justify-center text-[#58769F] hover:text-[#FF6500] hover:border-[#FF6500] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full border border-[#E4EDF7] flex items-center justify-center text-[#58769F] hover:text-[#FF6500] hover:border-[#FF6500] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-full border border-[#E4EDF7] flex items-center justify-center text-[#58769F] hover:text-[#FF6500] hover:border-[#FF6500] transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Mobile App Download Badges */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-[#102B52] block mb-2">Experience On Any Device</span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setActiveModal('pwa')}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#DDE7F2] bg-white hover:border-[#FF6500] text-left transition-colors cursor-pointer group"
                  >
                    <Smartphone className="w-4 h-4 text-[#FF6500]" />
                    <div>
                      <span className="block text-[8px] text-[#7991B2] uppercase leading-tight">Mobile Web & PWA</span>
                      <span className="block text-[11px] font-bold text-[#102B52] group-hover:text-[#FF6500] transition-colors leading-tight">Install App</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* ---------------- COLUMN 2: QUICK LINKS (lg:col-span-2) ---------------- */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-sm font-bold text-[#102B52] tracking-tight">
                Quick Links
              </h4>
              <ul className="space-y-2 text-xs text-[#58769F]">
                <li>
                  <button
                    onClick={() => { setActiveView('store'); setSelectedProduct(null); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleExploreNow}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    Digital Products
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveView('vendor'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    Creator Hub
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => { setActiveView('library'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    Customer Library
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('license')}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    Commercial Licensing
                  </button>
                </li>
              </ul>
            </div>

            {/* ---------------- COLUMN 3: CATEGORIES (lg:col-span-2) ---------------- */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-sm font-bold text-[#102B52] tracking-tight">
                Categories
              </h4>
              <ul className="space-y-2 text-xs text-[#58769F]">
                <li>
                  <button
                    onClick={() => handleCategoryClick('ui-templates')}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    UI Templates & Kits
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('code-scripts')}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    Code & Scripts
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('wordpress')}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    WordPress Themes
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('3d-graphics')}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    3D Graphics & Models
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleCategoryClick('dev-boilerplates')}
                    className="hover:text-[#FF6500] transition-colors cursor-pointer"
                  >
                    Dev Boilerplates
                  </button>
                </li>
              </ul>
            </div>

            {/* ---------------- COLUMN 4: NEED HELP? (lg:col-span-2) ---------------- */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-sm font-bold text-[#102B52] tracking-tight">
                Need Help?
              </h4>
              <ul className="space-y-3 text-xs text-[#58769F]">
                <li>
                  <a
                    href="mailto:support@omyra.org"
                    className="inline-flex items-start gap-2 hover:text-[#FF6500] transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#7991B2]">Email Support</span>
                      <span className="font-semibold text-[#102B52] group-hover:text-[#FF6500] transition-colors">support@omyra.org</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919876543210"
                    className="inline-flex items-start gap-2 hover:text-[#FF6500] transition-colors group"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <span className="block text-[11px] text-[#7991B2]">Helpline</span>
                      <span className="font-semibold text-[#102B52] group-hover:text-[#FF6500] transition-colors">+91 98765 43210</span>
                    </div>
                  </a>
                </li>
                <li className="pt-1">
                  <div className="inline-flex items-center gap-1.5 text-[11px] text-[#7991B2]">
                    <Clock className="w-3 h-3 text-[#FF6500]" />
                    <span>Response within 15 mins</span>
                  </div>
                </li>
              </ul>
            </div>

            {/* ---------------- COLUMN 5: NEWSLETTER (lg:col-span-2) ---------------- */}
            <div className="lg:col-span-2 space-y-3.5">
              <h4 className="text-sm font-bold text-[#102B52] tracking-tight">
                Newsletter
              </h4>
              <p className="text-xs text-[#58769F] leading-relaxed">
                Subscribe to get weekly curated drops, exclusive discounts, and creative developer resources.
              </p>

              {/* Form */}
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      if (newsletterStatus === 'error') setNewsletterStatus('idle');
                    }}
                    placeholder="Enter your email"
                    disabled={newsletterStatus === 'loading'}
                    className="w-full h-10 rounded-xl border border-[#DDE7F2] bg-white px-3.5 text-xs text-[#102B52] placeholder-[#7991B2] focus:outline-none focus:border-[#FF6500] focus:ring-1 focus:ring-[#FF6500] transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={newsletterStatus === 'loading'}
                  className="w-full h-10 rounded-xl bg-[#FF6500] hover:bg-[#EA5800] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-70"
                >
                  {newsletterStatus === 'loading' ? (
                    <span>Subscribing...</span>
                  ) : (
                    <>
                      <span>Subscribe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {/* Feedback messages */}
              {newsletterStatus === 'success' && (
                <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{newsletterMessage}</span>
                </div>
              )}

              {newsletterStatus === 'error' && (
                <p className="text-[11px] text-red-600 font-medium">
                  {newsletterMessage}
                </p>
              )}

              <p className="text-[10px] text-[#7991B2]">
                No spam. Unsubscribe at any time.
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 3: MARKETPLACE TRUST AND BENEFIT STRIP                           */}
      {/* ========================================================================= */}
      <div className="border-t border-[#E4EDF7] bg-[#FAFBFD] py-6 sm:py-7">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Trust Item 1 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFDEC4]/60">
                <Zap className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#102B52]">Instant File Delivery</h5>
                <p className="text-[11px] text-[#7991B2]">Automated zip & license generation</p>
              </div>
            </div>

            {/* Trust Item 2 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFDEC4]/60">
                <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#102B52]">100% Quality Inspected</h5>
                <p className="text-[11px] text-[#7991B2]">Manually tested & virus-scanned</p>
              </div>
            </div>

            {/* Trust Item 3 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFDEC4]/60">
                <Award className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#102B52]">Commercial Client Rights</h5>
                <p className="text-[11px] text-[#7991B2]">Perpetual use in end-user products</p>
              </div>
            </div>

            {/* Trust Item 4 */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center shrink-0 border border-[#FFDEC4]/60">
                <Lock className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-[#102B52]">256-Bit Bank Encryption</h5>
                <p className="text-[11px] text-[#7991B2]">PCI-DSS Level 1 compliant checkout</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 4: BOTTOM COPYRIGHT & BRAND-STATUS ROW                           */}
      {/* ========================================================================= */}
      <div className="border-t border-[#E4EDF7] bg-white py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#7991B2]">
            
            {/* Left: Copyright */}
            <div className="text-center md:text-left">
              &copy; {new Date().getFullYear()} OMYRA MALL. All rights reserved.
            </div>

            {/* Center: Legal Links (Clickable with full real policy modals) */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <button
                onClick={() => setActiveModal('privacy')}
                className="hover:text-[#FF6500] transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setActiveModal('terms')}
                className="hover:text-[#FF6500] transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
              <button
                onClick={() => setActiveModal('license')}
                className="hover:text-[#FF6500] transition-colors cursor-pointer"
              >
                License Agreement
              </button>
            </div>

            {/* Right: Operational Status */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="font-medium text-[#102B52]">
                Secure &middot; Reliable &middot; Global
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEGAL & PWA INFORMATIONAL MODALS                                          */}
      {/* ========================================================================= */}
      {activeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-zinc-200 space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0E3] text-[#FF6500] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-[#102B52]">
                  {activeModal === 'privacy' && 'Privacy Policy'}
                  {activeModal === 'terms' && 'Terms of Service'}
                  {activeModal === 'license' && 'Certified Commercial License'}
                  {activeModal === 'pwa' && 'OMYRA MALL Mobile Web & PWA'}
                </h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-7 h-7 rounded-lg hover:bg-zinc-100 flex items-center justify-center text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeModal === 'privacy' && (
              <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
                <p>
                  At OMYRA MALL, we value your privacy above all. We collect only the information necessary to fulfill digital orders, authenticate your purchases, and generate verifiable cryptographic license certificates.
                </p>
                <p>
                  <strong>Data Protection:</strong> We never sell, rent, or lease customer contact lists or transaction metadata to third-party ad networks. All payment processing is direct and handled securely via certified PCI-DSS Level 1 compliant gateways.
                </p>
                <p>
                  <strong>Cookie Policy:</strong> We use strictly essential cookies for cart persistence, session authorization, and your downloaded files vault.
                </p>
              </div>
            )}

            {activeModal === 'terms' && (
              <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
                <p>
                  By accessing or purchasing from OMYRA MALL, you agree to abide by our marketplace standards and code of conduct.
                </p>
                <p>
                  <strong>File Delivery:</strong> All digital assets are unlocked automatically upon confirmed checkout. Customers retain perpetual access through their Customer Library.
                </p>
                <p>
                  <strong>Refunds:</strong> If a digital product is fundamentally defective, misstated, or contains critical unresolvable bugs within 14 days of purchase, our support team will issue a prompt replacement or refund.
                </p>
              </div>
            )}

            {activeModal === 'license' && (
              <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
                <p>
                  Every product purchased on OMYRA MALL includes clear commercial rights.
                </p>
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 space-y-1.5 text-zinc-700">
                  <div className="flex items-center gap-1.5 font-bold text-[#102B52]">
                    <Check className="w-3.5 h-3.5 text-[#FF6500]" />
                    <span>Unlimited Commercial End Products</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    You can use assets to build unlimited client projects, commercial websites, internal enterprise tools, and SaaS platforms.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-zinc-700">
                  <div className="flex items-center gap-1.5 font-bold text-[#102B52]">
                    <Check className="w-3.5 h-3.5 text-[#FF6500]" />
                    <span>Free Lifetime Version Upgrades</span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Whenever an author publishes updates for new framework or tool versions, your library automatically gets the latest release.
                  </p>
                </div>
              </div>
            )}

            {activeModal === 'pwa' && (
              <div className="text-xs text-zinc-600 space-y-3 leading-relaxed">
                <p>
                  OMYRA MALL is engineered as an ultra-fast Progressive Web App. You can install it directly onto your iOS or Android home screen without needing app store downloads.
                </p>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5">
                  <p className="font-bold text-[#102B52]">How to install:</p>
                  <ul className="list-disc pl-4 space-y-1 text-[11px]">
                    <li><strong>On Safari (iOS):</strong> Tap the Share button, then scroll and select &quot;Add to Home Screen&quot;.</li>
                    <li><strong>On Chrome (Android / Desktop):</strong> Tap the 3 dots menu or the install icon in your address bar, then select &quot;Install App&quot;.</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FF6500] text-white hover:bg-[#EA5800] transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </footer>
  );
};
