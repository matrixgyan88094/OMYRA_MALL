import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useBranding } from '../context/BrandingContext';
import omyraBannerImg from '@/src/assets/images/omyra_hero_banner_1791801127812.jpg';

export const HeroBanner: React.FC = () => {
  const { setSelectedProduct, products } = useStore();
  const { branding } = useBranding();

  const handleExplore = () => {
    const catalogEl = document.getElementById('marketplace-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pt-2 sm:pt-4 pb-1 sm:pb-2 bg-white">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Rounded Hero Banner Card matching screenshot */}
        <div className="relative overflow-hidden rounded-[20px] sm:rounded-[26px] bg-gradient-to-r from-[#fff3eb] via-[#fef7f2] to-[#fff3eb] border border-orange-100/80 shadow-xs">
          
          <div className="relative min-h-[170px] sm:min-h-[340px] lg:min-h-[400px] flex items-center">
            
            {/* Background 3D Desk & Laptop Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={omyraBannerImg}
                alt="OMYRA MALL Digital Marketplace Laptop & Apps"
                className="w-full h-full object-cover object-[92%_center] sm:object-right-center"
              />
              {/* Controlled white-to-transparent overlay: solid on mobile left so text is 100% legible, fading smoothly to artwork */}
              <div 
                aria-hidden="true" 
                className="absolute inset-0 bg-gradient-to-r from-[#fff3eb] via-[#fff3eb] via-55% to-[#fff3eb]/30 sm:from-[#fff5ee] sm:via-[#fff5ee]/90 sm:to-transparent w-full md:w-[65%] pointer-events-none" 
              />
            </div>

            {/* Left Column: Text & CTA Button */}
            <div className="relative z-10 max-w-xl pl-4 sm:pl-10 lg:pl-14 pr-2 sm:pr-4 py-3 sm:py-8">
              
              {/* OMYRA MALL badge */}
              <div className="inline-block rounded-full bg-[#fde9de] px-2 py-0.5 sm:px-3.5 sm:py-1 text-[9px] sm:text-xs font-bold text-[#f95a12] mb-1.5 sm:mb-3 tracking-wide shadow-2xs">
                {branding.siteName || 'OMYRA MALL'}
              </div>

              {/* Main Headline */}
              <h1 className="text-lg sm:text-3xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.15]">
                Digital Products.
                <br />
                <span className="text-[#f95a12]">Better Experiences</span>
                <span className="text-zinc-950">.</span>
              </h1>

              {/* Description Subtext */}
              <p className="mt-1 sm:mt-2.5 text-[11px] sm:text-base text-zinc-700 sm:text-zinc-600 font-medium leading-snug sm:leading-relaxed max-w-[220px] sm:max-w-md">
                Discover premium digital products, software, templates, plugins and more — all in one place.
              </p>

              {/* Explore Now Button */}
              <div className="mt-2.5 sm:mt-5">
                <button
                  onClick={handleExplore}
                  className="inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-[#f95a12] px-3.5 sm:px-7 py-1.5 sm:py-3.5 text-[11px] sm:text-base font-semibold text-white shadow-md shadow-orange-500/25 hover:bg-[#e04a07] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
