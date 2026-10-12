import React from 'react';
import { useStore } from '../context/StoreContext';

interface CategoryItem {
  id: string;
  name: string;
  mappedCategory: string;
  isFirst?: boolean;
  renderIcon: () => React.ReactNode;
}

export const HeroCategoryCards: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setActiveView } = useStore();

  const categories: CategoryItem[] = [
    // 1. Software & Apps: Orange rounded box with crisp white code brackets and slash </>
    {
      id: 'software-apps',
      name: 'Software & Apps',
      mappedCategory: 'Dev Kits',
      isFirst: true,
      renderIcon: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Subtle soft orange glow behind icon */}
          <div 
            className="w-14 h-14 rounded-[18px] flex items-center justify-center text-white"
            style={{
              background: 'linear-gradient(145deg, #ff5722 0%, #f44336 100%)',
              boxShadow: '0 4px 12px rgba(244, 67, 54, 0.28)'
            }}
          >
            <svg 
              className="w-8 h-8 text-white stroke-current" 
              viewBox="0 0 24 24" 
              fill="none" 
              strokeWidth="2.8" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points="7 8 3 12 7 16" />
              <line x1="10" y1="18" x2="14" y2="6" strokeWidth="2.6" />
              <polyline points="17 8 21 12 17 16" />
            </svg>
          </div>
        </div>
      ),
    },

    // 2. Web Templates: Soft warm card with glowing soft rounded orange squircle and desktop screen + stand
    {
      id: 'web-templates',
      name: 'Web Templates',
      mappedCategory: 'Templates',
      renderIcon: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Subtle warm orange soft backing pill */}
          <div 
            className="w-14 h-14 rounded-[18px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #fff3e6 0%, #fee4cc 100%)',
              boxShadow: '0 4px 12px rgba(255, 122, 0, 0.12)'
            }}
          >
            <svg 
              className="w-8 h-8 text-[#ff6600] stroke-current" 
              viewBox="0 0 24 24" 
              fill="none" 
              strokeWidth="2.4" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="2" y="3" width="20" height="14" rx="2.5" />
              <line x1="8" y1="21" x2="16" y2="21" strokeWidth="2.4" />
              <line x1="12" y1="17" x2="12" y2="21" strokeWidth="2.4" />
            </svg>
          </div>
        </div>
      ),
    },

    // 3. WordPress Themes: Exact official black circular WordPress logo
    {
      id: 'wordpress-themes',
      name: 'WordPress Themes',
      mappedCategory: 'Templates',
      renderIcon: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div 
            className="w-14 h-14 rounded-full bg-[#111827] flex items-center justify-center text-white"
            style={{
              background: '#0d1117',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.22)'
            }}
          >
            <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12c0 5.093 3.176 9.444 7.669 11.168L3.25 8.167C4.12 4.542 7.42 2.052 11.233 2.052c1.942 0 3.763.666 5.228 1.833L12 0zm0 24c-.754 0-1.492-.07-2.209-.203l4.757-13.81 4.873 13.35C17.065 23.754 14.613 24 12 24zm-8.816-9.74c-.035-.395-.054-.805-.054-1.228 0-1.503.488-2.894 1.316-4.025l4.316 11.835C5.877 18.995 3.738 16.275 3.184 14.26zm16.48-5.328c.453 1.107.706 2.327.706 3.606 0 2.115-.694 4.07-1.87 5.656l-3.32-9.645c1.455.071 2.895.19 4.484.383z"/>
            </svg>
          </div>
        </div>
      ),
    },

    // 4. Game Projects: Exact dark gaming controller with D-pad & action dots
    {
      id: 'game-projects',
      name: 'Game Projects',
      mappedCategory: '3D & Spatial',
      renderIcon: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <svg className="w-12 h-12 text-[#0f172a] fill-current" viewBox="0 0 24 24">
            <path d="M19.5 6h-15C2.56 6 1 7.56 1 9.5v5c0 1.94 1.56 3.5 3.5 3.5.83 0 1.6-.29 2.22-.78L9.44 15h5.12l2.72 2.22c.62.49 1.39.78 2.22.78 1.94 0 3.5-1.56 3.5-3.5v-5C23 7.56 21.44 6 19.5 6zM8 12.5H6.5V14H5.5v-1.5H4v-1h1.5V10h1v1.5H8v1zm9.5 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm2-2.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
        </div>
      ),
    },

    // 5. Graphics & Design: Warm peach soft square with vibrant orange paint palette
    {
      id: 'graphics-design',
      name: 'Graphics & Design',
      mappedCategory: 'UI & Figma',
      renderIcon: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div 
            className="w-14 h-14 rounded-[18px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #fff2e6 0%, #fedfcb 100%)',
            }}
          >
            <svg className="w-10 h-10 text-[#f5550a] fill-current" viewBox="0 0 24 24">
              <path d="M12 2C6.49 2 2 6.49 2 12c0 4.41 3.59 8 8 8 .55 0 1-.45 1-1 0-.28-.11-.53-.29-.71-.18-.18-.29-.43-.29-.71 0-.55.45-1 1-1h1.58c3.54 0 6.42-2.88 6.42-6.42C19.71 5.92 16.27 2 12 2zm-5.5 8c-.83 0-1.5-.67-1.5-1.5S5.67 7 6.5 7 8 7.67 8 8.5 7.33 10 6.5 10zm3-3c-.83 0-1.5-.67-1.5-1.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 3c-.83 0-1.5-.67-1.5-1.5S16.67 7 17.5 7s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
            </svg>
          </div>
        </div>
      ),
    },

    // 6. Plugins & Scripts: Soft mint background squircle with bright emerald green interlocking puzzle piece
    {
      id: 'plugins-scripts',
      name: 'Plugins & Scripts',
      mappedCategory: 'Dev Kits',
      renderIcon: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div 
            className="w-14 h-14 rounded-[18px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #e8f9ee 0%, #cff5dc 100%)',
            }}
          >
            <svg className="w-9 h-9 text-[#15a350] fill-current" viewBox="0 0 24 24">
              <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.12 11.88 1 10.5 1S8 2.12 8 3.5V5H4c-1.1 0-1.99.9-1.99 2v3.8H3.5c1.49 0 2.7 1.21 2.7 2.7s-1.21 2.7-2.7 2.7H2V20c0 1.1.9 2 2 2h3.8v-1.5c0-1.49 1.21-2.7 2.7-2.7s2.7 1.21 2.7 2.7V22H17c1.1 0 2-.9 2-2v-4h1.5c1.38 0 2.5-1.12 2.5-2.5s-1.12-2.5-2.5-2.5z" />
            </svg>
          </div>
        </div>
      ),
    },

    // 7. Mobile Apps: Soft warm card with glowing orange smartphone
    {
      id: 'mobile-apps',
      name: 'Mobile Apps',
      mappedCategory: 'Dev Kits',
      renderIcon: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div 
            className="w-14 h-14 rounded-[18px] flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #fff3e6 0%, #fee4cc 100%)',
            }}
          >
            <svg 
              className="w-8 h-8 text-[#ff6600] stroke-current" 
              viewBox="0 0 24 24" 
              fill="none" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <rect x="5" y="2" width="14" height="20" rx="3.5" ry="3.5" />
              <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="3" />
            </svg>
          </div>
        </div>
      ),
    },

    // 8. Digital Assets: Vivid blue cloud with white downward download arrow
    {
      id: 'digital-assets',
      name: 'Digital Assets',
      mappedCategory: 'All',
      renderIcon: () => (
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div 
            className="w-14 h-14 rounded-[18px] flex items-center justify-center text-white"
            style={{
              background: 'linear-gradient(145deg, #2196f3 0%, #1976d2 100%)',
              boxShadow: '0 4px 12px rgba(33, 150, 243, 0.28)'
            }}
          >
            <svg className="w-8 h-8 text-white fill-current" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
            </svg>
          </div>
        </div>
      ),
    },
  ];

  const handleCategoryClick = (mapped: string) => {
    setSelectedCategory(mapped);
    setActiveView('store');
    const catalogEl = document.getElementById('marketplace-catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full pt-4 pb-6 bg-white select-none">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Strictly in ONE SINGLE ROW (flex-nowrap with horizontal scrollbar if needed on ultra-narrow screens) */}
        <div className="flex flex-nowrap items-stretch justify-between gap-3 sm:gap-3.5 lg:gap-4 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat, index) => {
            const isSelected = selectedCategory === cat.mappedCategory && cat.mappedCategory !== 'All';
            const isFirst = index === 0;

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.mappedCategory)}
                className={`group flex-1 min-w-[125px] sm:min-w-[135px] max-w-[155px] flex flex-col items-center justify-between py-5 px-3 rounded-[20px] transition-all duration-200 cursor-pointer text-center shrink-0 sm:shrink ${
                  isFirst
                    ? 'bg-[#fff1ea] border border-[#fed7c7] shadow-2xs hover:shadow-sm'
                    : isSelected
                    ? 'bg-orange-50/50 border border-[#f95a12] shadow-xs'
                    : 'bg-[#faf8f6] border border-[#f1ebe5] hover:bg-white hover:border-zinc-300 hover:shadow-xs'
                }`}
              >
                {/* Icon Container with hover zoom */}
                <div className="flex-1 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
                  {cat.renderIcon()}
                </div>

                {/* Category Text matching exact font styling */}
                <span className={`text-[13px] sm:text-[14px] font-semibold leading-tight tracking-tight mt-3 ${
                  isFirst 
                    ? 'text-[#a33202]' 
                    : 'text-zinc-800 group-hover:text-[#f95a12]'
                }`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
};
