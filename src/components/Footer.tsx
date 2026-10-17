import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  ShieldCheck,
  Zap,
  Headphones,
  Globe,
  ArrowRight,
  ChevronRight,
  PenTool,
  Code2,
  Megaphone,
  Briefcase,
  Music2,
  GraduationCap,
  LayoutGrid
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useBranding } from '../context/BrandingContext';
import { OmyraMallLogo } from './OmyraMallLogo';
import omyraLaptopBannerImg from '@/src/assets/images/omyra_laptop_banner_1792198485259.jpg';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedProduct, setSelectedCategory } = useStore();
  const { branding } = useBranding();

  // Newsletter state
  const [emailInput, setEmailInput] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const email = emailInput.trim();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setNewsletterStatus('error');
      return;
    }

    setNewsletterStatus('loading');
    setTimeout(() => {
      setNewsletterStatus('success');
      setEmailInput('');
    }, 400);
  };

  const handleCategoryClick = (categoryName: string) => {
    setActiveView('store');
    setSelectedProduct(null);
    setSelectedCategory(categoryName);
    const catalog = document.getElementById('marketplace-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  const handleExploreNow = () => {
    setActiveView('store');
    setSelectedProduct(null);
    setSelectedCategory('All');
    const catalog = document.getElementById('marketplace-catalog');
    if (catalog) {
      catalog.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 380, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-white text-[#58769F] border-t border-[#E5EDF5]">
      
      {/* ========================================================================= */}
      {/* 1. TOP PROMOTIONAL CTA BANNER (Image as Background)                       */}
      {/* ========================================================================= */}
      <section className="pt-8 sm:pt-10 pb-6 sm:pb-8">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl lg:rounded-[32px] bg-[#FFFDFC] border border-[#FCE2D0] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 overflow-hidden shadow-[0_16px_48px_rgba(255,100,0,0.06),0_2px_12px_rgba(16,43,82,0.03)]">
            
            {/* BACKGROUND IMAGE LAYER */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              {/* 3D Mockup banner image positioned in the background */}
              <img
                src={omyraLaptopBannerImg}
                alt=""
                referrerPolicy="no-referrer"
                className="absolute right-0 top-0 sm:-top-8 md:-top-12 bottom-0 h-full w-full sm:w-[75%] lg:w-[58%] xl:w-[54%] object-cover object-center lg:object-right select-none opacity-35 sm:opacity-75 lg:opacity-100"
              />

              {/* Gradient overlays to ensure 100% crisp text readability on the left */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#FFFDFC] via-[#FFFDFC]/95 to-transparent sm:via-[#FFFDFC]/90 lg:via-[#FFFDFC]/80 lg:to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDFC] via-transparent to-transparent sm:hidden" />
              
              {/* Warm decorative ambient lighting */}
              <div className="absolute -right-12 -bottom-12 w-96 h-96 rounded-full bg-gradient-to-tl from-[#FF7A1A]/20 via-[#FF6500]/10 to-transparent blur-3xl" />
              <div className="absolute -left-12 -top-12 w-80 h-80 rounded-full bg-[#FFEFE2]/70 blur-2xl" />
            </div>

            {/* FOREGROUND CONTENT */}
            <div className="relative z-10 max-w-xl lg:max-w-2xl xl:max-w-[620px] space-y-4 sm:space-y-5 lg:space-y-6">
              
              {/* 1. Sparkle Pill */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFEADA] border border-[#FCD2B3]/80 text-[#FF5500] shadow-2xs">
                  <span className="text-xs">✦</span>
                  <span className="text-xs sm:text-[13px] font-bold tracking-wide">Join OMYRA MALL</span>
                </div>
              </div>

              {/* 2. Headline with organic brush swoosh underline */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] xl:text-[46px] font-black text-[#0B1F44] tracking-tight leading-[1.12]">
                Get the Best Digital Products <br />
                and{' '}
                <span className="relative inline-block text-[#FF5500]">
                  Grow Your Creativity!
                  {/* Brush swoosh underline */}
                  <svg
                    className="absolute -bottom-2 sm:-bottom-2.5 lg:-bottom-3 left-0 w-full h-2.5 sm:h-3 lg:h-3.5 text-[#FF5500]"
                    viewBox="0 0 280 14"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 2 8 C 60 3 150 3 278 7 C 230 12 140 13 2 10 Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </h2>

              {/* 3. Subheading / Paragraph */}
              <p className="text-xs sm:text-sm lg:text-[15px] xl:text-[16px] text-[#4E6B94] leading-relaxed font-normal max-w-lg">
                Join thousands of creators, developers and businesses who trust OMYRA MALL for premium digital products.
              </p>

              {/* 4. Three Benefit Items in a single row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5 lg:gap-4 pt-1 sm:pt-2">
                
                {/* Benefit 1: Instant Access */}
                <div className="flex items-center sm:items-start gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/70 backdrop-blur-xs border border-[#FBE3D0]/80 shadow-[0_2px_8px_rgba(255,100,0,0.03)]">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFF0E2] flex items-center justify-center shrink-0 text-[#FF5500] border border-[#FFD9BA]/80 shadow-2xs">
                    <Zap className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#0B1F44] text-xs sm:text-[13px] leading-tight">
                      Instant Access
                    </h4>
                    <p className="text-[10.5px] sm:text-[11px] text-[#58769F] leading-snug mt-0.5">
                      Start using your products immediately
                    </p>
                  </div>
                </div>

                {/* Benefit 2: Secure Payments */}
                <div className="flex items-center sm:items-start gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/70 backdrop-blur-xs border border-[#FBE3D0]/80 shadow-[0_2px_8px_rgba(255,100,0,0.03)]">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFF0E2] flex items-center justify-center shrink-0 text-[#FF5500] border border-[#FFD9BA]/80 shadow-2xs">
                    <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#0B1F44] text-xs sm:text-[13px] leading-tight">
                      Secure Payments
                    </h4>
                    <p className="text-[10.5px] sm:text-[11px] text-[#58769F] leading-snug mt-0.5">
                      Your data is 100% protected
                    </p>
                  </div>
                </div>

                {/* Benefit 3: 24/7 Support */}
                <div className="flex items-center sm:items-start gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-xl bg-white/70 backdrop-blur-xs border border-[#FBE3D0]/80 shadow-[0_2px_8px_rgba(255,100,0,0.03)]">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FFF0E2] flex items-center justify-center shrink-0 text-[#FF5500] border border-[#FFD9BA]/80 shadow-2xs">
                    <Headphones className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.3]" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[#0B1F44] text-xs sm:text-[13px] leading-tight">
                      24/7 Support
                    </h4>
                    <p className="text-[10.5px] sm:text-[11px] text-[#58769F] leading-snug mt-0.5">
                      We're always here to help
                    </p>
                  </div>
                </div>

              </div>

              {/* 5. Explore Now Button */}
              <div className="pt-2 sm:pt-3">
                <button
                  onClick={handleExploreNow}
                  className="group inline-flex items-center justify-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-white bg-gradient-to-r from-[#FF5500] via-[#FF6000] to-[#FF6A00] hover:from-[#E64D00] hover:to-[#D93600] shadow-[0_10px_24px_rgba(255,85,0,0.32)] hover:shadow-[0_14px_30px_rgba(255,85,0,0.42)] active:scale-[0.98] transition-all cursor-pointer text-sm sm:text-base"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1.5 transition-transform stroke-[2.5]" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. FIVE MAIN FOOTER COLUMNS                                               */}
      {/* ========================================================================= */}
      <div className="py-10 sm:py-12 bg-white">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6">
            
            {/* ---------------- COLUMN 1: BRAND INFORMATION (lg:col-span-3) ---------------- */}
            <div className="lg:col-span-3 lg:pr-6 lg:border-r border-[#E5EDF5] space-y-4">
              {/* Footer Logo: Custom uploaded footer logo OR styled site logo / name */}
              {branding.footerLogoUrl ? (
                <div className="flex items-center select-none">
                  <img
                    src={branding.footerLogoUrl}
                    alt={branding.siteName || 'Footer Logo'}
                    className="h-10 w-auto max-w-[220px] object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
              ) : (
                <OmyraMallLogo size="md" />
              )}

              {/* Subtitle */}
              <h4 className="text-sm font-bold text-[#0B2046]">
                {branding.showTagline && branding.tagline ? branding.tagline : 'Digital Products Marketplace'}
              </h4>

              {/* Bio */}
              <p className="text-xs text-[#58769F] leading-relaxed">
                Discover premium digital products, software, templates, plugins and more — all in one place. Build, create and grow with OMYRA MALL.
              </p>

              {/* Social Channels (4 round icons matching screenshot) */}
              <div className="flex items-center gap-2.5 pt-1">
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded-full border border-[#D8E4F0] flex items-center justify-center text-[#0B2046] hover:text-[#FF5A00] hover:border-[#FF5A00] hover:bg-[#FFF5EC] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>

                {/* X (Twitter) */}
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter X"
                  className="w-8 h-8 rounded-full border border-[#D8E4F0] flex items-center justify-center text-[#0B2046] hover:text-[#FF5A00] hover:border-[#FF5A00] hover:bg-[#FFF5EC] transition-colors"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-full border border-[#D8E4F0] flex items-center justify-center text-[#0B2046] hover:text-[#FF5A00] hover:border-[#FF5A00] hover:bg-[#FFF5EC] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded-full border border-[#D8E4F0] flex items-center justify-center text-[#0B2046] hover:text-[#FF5A00] hover:border-[#FF5A00] hover:bg-[#FFF5EC] transition-colors"
                >
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
              </div>

              {/* Hand-drawn Script Tagline matching screenshot exact */}
              <div className="pt-3 pb-1">
                <div className="inline-block transform -rotate-[9deg] origin-bottom-left select-none">
                  <div 
                    className="font-handwriting text-[#FF4915] font-bold text-[28px] sm:text-[30px] leading-[0.92] tracking-normal"
                    style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
                  >
                    <span className="block">Better Tools.</span>
                    <span className="block">Bigger Dreams.</span>
                  </div>
                  {/* Tapered organic brush swoosh underline */}
                  <svg
                    className="w-full max-w-[170px] h-3 text-[#FF4915] -mt-0.5"
                    viewBox="0 0 180 14"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M 2 8 C 42 12 100 13 152 7 C 166 5.5 174 4 178 2 C 165 4.5 140 7 112 8.5 C 70 10.5 28 9.5 2 8 Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* ---------------- COLUMN 2: QUICK LINKS (lg:col-span-2) ---------------- */}
            <div className="lg:col-span-2 lg:px-2 space-y-3.5">
              <h4 className="text-sm font-bold text-[#0B2046]">
                Quick Links
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { label: 'Home', action: () => { setActiveView('store'); setSelectedCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
                  { label: 'Digital Products', action: handleExploreNow },
                  { label: 'Deals', action: () => { setActiveView('store'); setSelectedCategory('All'); } },
                  { label: 'Support', action: () => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); } },
                  { label: 'About Us', action: () => { setActiveView('store'); } },
                  { label: 'Blog', action: () => { setActiveView('store'); } },
                ].map((item) => (
                  <li key={item.label}>
                    <button
                      onClick={item.action}
                      className="w-full flex items-center justify-between text-[#0B2046] hover:text-[#FF5A00] transition-colors text-left group cursor-pointer"
                    >
                      <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-[#FF5A00] shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* ---------------- COLUMN 3: CATEGORIES (lg:col-span-2) ---------------- */}
            <div className="lg:col-span-2 lg:px-2 space-y-3.5">
              <h4 className="text-sm font-bold text-[#0B2046]">
                Categories
              </h4>
              <ul className="space-y-2.5 text-xs">
                {[
                  { label: 'Design & Graphics', cat: 'Graphics', icon: PenTool },
                  { label: 'Development', cat: 'Dev Kits', icon: Code2 },
                  { label: 'Marketing', cat: 'Templates', icon: Megaphone },
                  { label: 'Business', cat: 'UI & Figma', icon: Briefcase },
                  { label: 'Audio & Music', cat: 'Audio', icon: Music2 },
                  { label: 'Education', cat: 'Dev Kits', icon: GraduationCap },
                  { label: 'More Categories', cat: 'All', icon: LayoutGrid },
                ].map((item) => {
                  const IconComp = item.icon;
                  return (
                    <li key={item.label}>
                      <button
                        onClick={() => handleCategoryClick(item.cat)}
                        className="flex items-center gap-2.5 text-[#0B2046] hover:text-[#FF5A00] transition-colors text-left group cursor-pointer"
                      >
                        <div className="w-5 h-5 rounded flex items-center justify-center text-[#FF5A00] border border-[#FFE1CE] bg-[#FFF8F3] shrink-0">
                          <IconComp className="w-3 h-3 stroke-[2.2]" />
                        </div>
                        <span className="group-hover:translate-x-0.5 transition-transform">{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ---------------- COLUMN 4: NEED HELP? (lg:col-span-2) ---------------- */}
            <div className="lg:col-span-2 lg:px-4 lg:border-l lg:border-r border-[#E5EDF5] space-y-4">
              <h4 className="text-sm font-bold text-[#0B2046]">
                Need Help?
              </h4>
              <div className="space-y-4 text-xs">
                {/* Email Support */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <a href="mailto:support@omyra.org" className="font-bold text-[#0B2046] hover:text-[#FF5A00] transition-colors block text-[11px] sm:text-xs">
                      support@omyra.org
                    </a>
                    <span className="text-[10px] text-[#58769F] block">Send us an email</span>
                  </div>
                </div>

                {/* Helpline Phone */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <a href="tel:+919876543210" className="font-bold text-[#0B2046] hover:text-[#FF5A00] transition-colors block text-[11px] sm:text-xs">
                      +91 98765 43210
                    </a>
                    <span className="text-[10px] text-[#58769F] block">Mon – Sat, 9:00 AM – 6:00 PM</span>
                  </div>
                </div>

                {/* Live Chat */}
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <a href="mailto:support@omyra.org?subject=Live%20Chat%20Support" className="font-bold text-[#0B2046] hover:text-[#FF5A00] transition-colors block text-[11px] sm:text-xs">
                      Live Chat
                    </a>
                    <span className="text-[10px] text-[#58769F] block">Chat with our support team</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ---------------- COLUMN 5: NEWSLETTER & APP DOWNLOAD (lg:col-span-3) ---------------- */}
            <div className="lg:col-span-3 lg:pl-3 space-y-5">
              
              {/* Subscribe to Our Newsletter */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-[#0B2046]">
                  Subscribe to Our Newsletter
                </h4>
                <p className="text-xs text-[#58769F]">
                  Get the latest updates, new products and exclusive offers.
                </p>

                <form onSubmit={handleSubscribe} className="pt-1">
                  <div className="relative flex items-center">
                    <div className="absolute left-3 text-[#58769F] pointer-events-none">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full h-10 pl-9 pr-12 rounded-xl border border-[#D5E2F0] bg-white text-xs text-[#0B2046] placeholder-[#8099B5] focus:outline-none focus:border-[#FF5A00] transition-colors"
                    />
                    <button
                      type="submit"
                      aria-label="Submit newsletter"
                      className="absolute right-1 w-8 h-8 rounded-lg bg-[#FF5A00] hover:bg-[#E54F00] text-white flex items-center justify-center cursor-pointer transition-colors shadow-xs"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  {newsletterStatus === 'success' && (
                    <p className="text-[11px] text-emerald-600 mt-1">Thank you for subscribing!</p>
                  )}
                  {newsletterStatus === 'error' && (
                    <p className="text-[11px] text-red-600 mt-1">Please enter a valid email.</p>
                  )}
                </form>
              </div>

              {/* Download Our App */}
              <div className="space-y-2 pt-1">
                <h4 className="text-sm font-bold text-[#0B2046]">
                  Download Our App
                </h4>
                <p className="text-xs text-[#58769F]">
                  Shop on the go with our mobile app.
                </p>
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  {/* App Store badge */}
                  <a
                    href="#download"
                    onClick={(e) => { e.preventDefault(); alert('OMYRA MALL iOS App is releasing soon on the App Store! Use our mobile web experience today.'); }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 transition-colors shadow-xs"
                  >
                    <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 170 170">
                      <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.68-7.85-11.97-14.43-5.74-8.8-10.23-18.72-13.48-29.77-3.25-11.05-4.88-21.46-4.88-31.25 0-14.89 3.82-27.18 11.46-36.88 7.64-9.7 17.2-14.64 28.69-14.82 4.13 0 9.07 1.05 14.82 3.17 5.75 2.12 9.53 3.29 11.34 3.5 2.83-.56 6.77-1.79 11.83-3.69 5.06-1.9 9.68-2.77 13.86-2.61 10.23.49 18.76 4.13 25.59 10.92 6.83 6.79 11.34 15.11 13.53 24.97-9.04 5.44-13.5 13.06-13.38 22.86.13 8.37 3.36 15.53 9.69 21.48 6.33 5.95 13.88 9.39 22.65 10.32-2.12 6.54-4.87 13.25-8.25 20.14zM119.22 31.81c0-7.39 2.68-14.28 8.04-20.67 5.36-6.39 12.01-10.42 19.96-12.08.13 1.09.19 2.07.19 2.94 0 7.28-2.81 14.2-8.43 20.76-5.62 6.56-12.44 10.47-20.45 11.73-.25-.87-.38-1.76-.38-2.68z"/>
                    </svg>
                    <div className="text-left">
                      <span className="block text-[8px] text-zinc-300 leading-tight">Download on the</span>
                      <span className="block text-[11px] font-bold text-white leading-tight">App Store</span>
                    </div>
                  </a>

                  {/* Google Play badge */}
                  <a
                    href="#download"
                    onClick={(e) => { e.preventDefault(); alert('OMYRA MALL Android App is releasing soon on Google Play! Use our mobile web experience today.'); }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-zinc-800 transition-colors shadow-xs"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 512 512">
                      <path fill="#00f076" d="M380.9 237.4L110.8 74.8C91.9 63.5 67 77.2 67 99.1v313.8c0 21.9 24.9 35.6 43.8 24.3l270.1-162.6c17.5-10.5 17.5-36.7 0-47.2z"/>
                      <path fill="#00d6ff" d="M67 99.1v313.8c0 14.3 10.7 24.8 22.4 25.1L277 256 89.4 74c-11.7.3-22.4 10.8-22.4 25.1z"/>
                      <path fill="#ff3a44" d="M380.9 237.4l-103.9 18.6L89.4 74c5.8-5.7 13.9-9.1 21.4-4.6l270.1 162.6c17.5 10.5 17.5 36.7 0 47.2z"/>
                      <path fill="#ffc800" d="M380.9 274.6l-270.1 162.6c-7.5 4.5-15.6 1.1-21.4-4.6l187.6-182 103.9 24z"/>
                    </svg>
                    <div className="text-left">
                      <span className="block text-[8px] text-zinc-300 leading-tight uppercase">GET IT ON</span>
                      <span className="block text-[11px] font-bold text-white leading-tight">Google Play</span>
                    </div>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MARKETPLACE TRUST AND BENEFIT STRIP                                    */}
      {/* ========================================================================= */}
      <div className="border-y border-[#E5EDF5] bg-white py-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:gap-y-6 lg:divide-x divide-[#E5EDF5]">
            
            {/* 1. 100% Secure Payments */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0">
              <div className="w-11 h-11 rounded-2xl bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shrink-0 shadow-2xs">
                <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-[#0B2046]">100% Secure Payments</h5>
                <p className="text-xs text-[#58769F]">Multiple payment options</p>
              </div>
            </div>

            {/* 2. Instant Access */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 sm:pl-4 lg:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shrink-0 shadow-2xs">
                <Zap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-[#0B2046]">Instant Access</h5>
                <p className="text-xs text-[#58769F]">Get your products immediately</p>
              </div>
            </div>

            {/* 3. 24/7 Support */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shrink-0 shadow-2xs">
                <Headphones className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-[#0B2046]">24/7 Support</h5>
                <p className="text-xs text-[#58769F]">We&apos;re here to help</p>
              </div>
            </div>

            {/* 4. Global Marketplace */}
            <div className="flex items-center gap-3.5 pt-3 sm:pt-0 lg:pl-6">
              <div className="w-11 h-11 rounded-2xl bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shrink-0 shadow-2xs">
                <Globe className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <h5 className="text-xs sm:text-sm font-bold text-[#0B2046]">Global Marketplace</h5>
                <p className="text-xs text-[#58769F]">Digital products for everyone</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. BOTTOM COPYRIGHT & STATUS BAR                                          */}
      {/* ========================================================================= */}
      <div className="bg-white py-4 sm:py-5">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#58769F]">
            <div>
              &copy; 2025 OMYRA MALL. All rights reserved.
            </div>
            <div className="flex items-center gap-2 font-medium">
              <span>Secure</span>
              <span className="text-[#58769F]">&bull;</span>
              <span>Reliable</span>
              <span className="text-[#58769F]">&bull;</span>
              <span>Global</span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  );
};
