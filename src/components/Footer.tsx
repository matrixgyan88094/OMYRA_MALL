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
import footerBannerImg from '@/src/assets/images/footer_laptop_banner_1792053516372.jpg';

export const Footer: React.FC = () => {
  const { setActiveView, setSelectedProduct, setSelectedCategory } = useStore();

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
      {/* 1. TOP PROMOTIONAL CTA BANNER                                             */}
      {/* ========================================================================= */}
      <section className="pt-6 sm:pt-8 pb-4 sm:pb-6">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#FFF5EC] via-[#FFF9F4] to-[#FFEFE4] border border-[#FEDEC5] p-6 sm:p-8 lg:p-10 overflow-hidden shadow-[0_8px_32px_rgba(255,90,0,0.05)]">
            
            {/* Subtle warm decorative background glows */}
            <div className="absolute -top-12 -right-12 w-96 h-96 bg-gradient-to-bl from-[#FFD8B8]/40 via-[#FFEADC]/20 to-transparent rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-80 h-80 bg-[#FF8020]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
              
              {/* Left Column: Headline & Description (5 cols) */}
              <div className="lg:col-span-5 space-y-3.5">
                {/* Sparkle Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFEADC] border border-[#FED6BF]/70 text-[#FF5A00] shadow-2xs">
                  <span className="text-xs">✦</span>
                  <span className="text-xs font-bold tracking-wide">Join OMYRA MALL</span>
                </div>

                {/* Heading */}
                <h2 className="text-2xl sm:text-3xl lg:text-[32px] xl:text-[34px] font-black text-[#0B2046] tracking-tight leading-[1.16]">
                  Get the Best Digital Products <br />
                  and <span className="text-[#FF5A00]">Grow Your Creativity!</span>
                </h2>

                {/* Subtitle */}
                <p className="text-xs sm:text-sm text-[#58769F] max-w-md leading-relaxed">
                  Join thousands of creators, developers and businesses who trust OMYRA MALL for premium digital products.
                </p>
              </div>

              {/* Middle Column: 3 Benefits + Explore CTA Button (4 cols) */}
              <div className="lg:col-span-4 flex flex-col justify-between space-y-4 sm:space-y-5">
                {/* Benefits Card with clean dividers */}
                <div className="bg-white/70 backdrop-blur-xs rounded-2xl p-3 sm:p-3.5 border border-[#FFE4CF]/90 shadow-2xs">
                  <div className="grid grid-cols-3 gap-2 divide-x divide-[#F0DAC7]/80">
                    {/* Benefit 1 */}
                    <div className="space-y-1.5 pr-1.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shadow-2xs">
                        <Zap className="w-4 h-4 stroke-[2.4]" />
                      </div>
                      <h4 className="text-xs font-bold text-[#0B2046] leading-tight">Instant Access</h4>
                      <p className="text-[10px] text-[#58769F] leading-snug">Start using products immediately</p>
                    </div>

                    {/* Benefit 2 */}
                    <div className="space-y-1.5 px-1.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shadow-2xs">
                        <ShieldCheck className="w-4 h-4 stroke-[2.4]" />
                      </div>
                      <h4 className="text-xs font-bold text-[#0B2046] leading-tight">Secure Payments</h4>
                      <p className="text-[10px] text-[#58769F] leading-snug">Your data is 100% protected</p>
                    </div>

                    {/* Benefit 3 */}
                    <div className="space-y-1.5 pl-1.5">
                      <div className="w-8 h-8 rounded-xl bg-[#FFEEDE] text-[#FF5A00] flex items-center justify-center shadow-2xs">
                        <Headphones className="w-4 h-4 stroke-[2.4]" />
                      </div>
                      <h4 className="text-xs font-bold text-[#0B2046] leading-tight">24/7 Support</h4>
                      <p className="text-[10px] text-[#58769F] leading-snug">We&apos;re always here to help</p>
                    </div>
                  </div>
                </div>

                {/* Explore Now Button */}
                <div>
                  <button
                    onClick={handleExploreNow}
                    className="group inline-flex items-center justify-center gap-2.5 px-6 py-2.5 sm:py-3 rounded-xl font-bold text-white bg-gradient-to-r from-[#FF5A00] to-[#FF701A] hover:from-[#E54F00] hover:to-[#FF5A00] active:scale-[0.98] transition-all duration-200 shadow-[0_4px_16px_rgba(255,90,0,0.25)] hover:shadow-[0_6px_22px_rgba(255,90,0,0.35)] cursor-pointer text-xs sm:text-sm"
                  >
                    <span>Explore Now</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right Column: High-End Marketplace Laptop Illustration (3 cols) */}
              <div className="lg:col-span-3 flex items-center justify-center lg:justify-end">
                <div className="relative w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[380px] rounded-2xl overflow-hidden border border-[#FEDDC3]/80 bg-[#FFF5EC] shadow-[0_8px_24px_rgba(255,90,0,0.08)] group">
                  <img
                    src={footerBannerImg}
                    alt="OMYRA MALL Digital Marketplace Laptop"
                    className="w-full h-auto object-cover transform group-hover:scale-[1.03] transition-transform duration-500 select-none pointer-events-none"
                  />
                  {/* Subtle glass reflection accent */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
                </div>
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
              {/* Logo: [M] OMYRA MALL */}
              <div className="flex items-center gap-2.5 select-none">
                <div className="w-9 h-9 rounded-xl bg-[#FF5A00] flex items-center justify-center text-white font-black text-xl shadow-xs shrink-0">
                  M
                </div>
                <div className="flex items-center text-xl font-black tracking-tight">
                  <span className="text-[#0B2046]">OMYRA</span>
                  <span className="text-[#FF5A00] ml-1.5">MALL</span>
                </div>
              </div>

              {/* Subtitle */}
              <h4 className="text-sm font-bold text-[#0B2046]">
                Digital Products Marketplace
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
                  { label: 'Creator Hub', action: () => { setActiveView('vendor'); window.scrollTo({ top: 0, behavior: 'smooth' }); } },
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
