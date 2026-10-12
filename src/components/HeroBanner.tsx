import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import omyraBannerImg from '@/src/assets/images/omyra_hero_banner_1791801127812.jpg';

export const HeroBanner: React.FC = () => {
  const { setSelectedProduct, products } = useStore();

  const handleExplore = () => {
    const catalogEl = document.getElementById('marketplace-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full pt-4 pb-2 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Rounded Hero Banner Card matching screenshot */}
        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#fff3eb] via-[#fef7f2] to-[#fff3eb] border border-orange-100/80 shadow-xs">
          
          <div className="relative min-h-[380px] sm:min-h-[420px] lg:min-h-[460px] flex items-center">
            
            {/* Background 3D Desk & Laptop Image */}
            <div className="absolute inset-0 z-0">
              <img
                src={omyraBannerImg}
                alt="OMYRA MALL Digital Marketplace Laptop & Apps"
                className="w-full h-full object-cover object-right sm:object-right-center"
              />
              {/* Left subtle gradient overlay to guarantee maximum typography legibility while keeping image crisp */}
              <div 
                aria-hidden="true" 
                className="absolute inset-0 bg-gradient-to-r from-[#fff5ee] via-[#fff5ee]/90 to-transparent w-full md:w-[65%] pointer-events-none" 
              />
            </div>

            {/* Left Column: Text & CTA Button */}
            <div className="relative z-10 max-w-xl pl-6 sm:pl-12 lg:pl-14 pr-4 py-10 sm:py-14">
              
              {/* OMYRA MALL badge */}
              <div className="inline-block rounded-full bg-[#fde9de] px-3.5 py-1 text-xs font-bold text-[#f95a12] mb-5 tracking-wide shadow-2xs">
                OMYRA MALL
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-[1.12]">
                Digital Products.
                <br />
                <span className="text-[#f95a12]">Better Experiences</span>
                <span className="text-zinc-950">.</span>
              </h1>

              {/* Description Subtext */}
              <p className="mt-4 text-sm sm:text-base text-zinc-600 font-medium leading-relaxed max-w-md">
                Discover premium digital products, software, templates, plugins and more — all in one place.
              </p>

              {/* Explore Now Button */}
              <div className="mt-7">
                <button
                  onClick={handleExplore}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[#f95a12] px-7 py-3.5 text-sm sm:text-base font-semibold text-white shadow-md shadow-orange-500/25 hover:bg-[#e04a07] active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Explore Now</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
