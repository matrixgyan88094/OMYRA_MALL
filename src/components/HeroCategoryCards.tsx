import React from 'react';
import { 
  Code, 
  Monitor, 
  Gamepad2, 
  Palette, 
  Puzzle, 
  Smartphone, 
  CloudDownload 
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CategoryItem {
  id: string;
  name: string;
  mappedCategory: string;
  iconBg: string; // Tailwind background or hex
  textColor: string;
  customIcon?: React.ReactNode;
}

export const HeroCategoryCards: React.FC = () => {
  const { selectedCategory, setSelectedCategory, setActiveView } = useStore();

  const categories: CategoryItem[] = [
    {
      id: 'software-apps',
      name: 'Software & Apps',
      mappedCategory: 'Dev Kits',
      iconBg: 'bg-[#ff5722]',
      textColor: 'text-zinc-800',
      customIcon: (
        <div className="w-12 h-12 rounded-2xl bg-[#ff5722] flex items-center justify-center text-white shadow-xs">
          <Code className="w-6 h-6 stroke-[2.5]" />
        </div>
      ),
    },
    {
      id: 'web-templates',
      name: 'Web Templates',
      mappedCategory: 'Templates',
      iconBg: 'bg-[#ff6f00]',
      textColor: 'text-zinc-800',
      customIcon: (
        <div className="w-12 h-12 rounded-2xl bg-[#ff9800] flex items-center justify-center text-white shadow-xs">
          <Monitor className="w-6 h-6 stroke-[2.3]" />
        </div>
      ),
    },
    {
      id: 'wordpress-themes',
      name: 'WordPress Themes',
      mappedCategory: 'Templates',
      iconBg: 'bg-[#0f172a]',
      textColor: 'text-zinc-800',
      customIcon: (
        <div className="w-12 h-12 rounded-2xl bg-[#0f172a] flex items-center justify-center text-white shadow-xs">
          <span className="font-serif font-black text-2xl tracking-tighter leading-none select-none">
            W
          </span>
        </div>
      ),
    },
    {
      id: 'game-projects',
      name: 'Game Projects',
      mappedCategory: '3D & Spatial',
      iconBg: 'bg-[#0f172a]',
      textColor: 'text-zinc-800',
      customIcon: (
        <div className="w-12 h-12 rounded-2xl bg-[#0f172a] flex items-center justify-center text-white shadow-xs">
          <Gamepad2 className="w-6 h-6 stroke-[2.2]" />
        </div>
      ),
    },
    {
      id: 'graphics-design',
      name: 'Graphics & Design',
      mappedCategory: 'UI & Figma',
      iconBg: 'bg-[#f4511e]',
      textColor: 'text-zinc-800',
      customIcon: (
        <div className="w-12 h-12 rounded-2xl bg-[#f4511e] flex items-center justify-center text-white shadow-xs">
          <Palette className="w-6 h-6 stroke-[2.3]" />
        </div>
      ),
    },
    {
      id: 'plugins-scripts',
      name: 'Plugins & Scripts',
      mappedCategory: 'Dev Kits',
      iconBg: 'bg-[#2e7d32]',
      textColor: 'text-zinc-800',
      customIcon: (
        <div className="w-12 h-12 rounded-2xl bg-[#2e7d32] flex items-center justify-center text-white shadow-xs">
          <Puzzle className="w-6 h-6 stroke-[2.3]" />
        </div>
      ),
    },
    {
      id: 'mobile-apps',
      name: 'Mobile Apps',
      mappedCategory: 'Dev Kits',
      iconBg: 'bg-[#ff6f00]',
      textColor: 'text-zinc-800',
      customIcon: (
        <div className="w-12 h-12 rounded-2xl bg-[#ff6f00] flex items-center justify-center text-white shadow-xs">
          <Smartphone className="w-6 h-6 stroke-[2.3]" />
        </div>
      ),
    },
    {
      id: 'digital-assets',
      name: 'Digital Assets',
      mappedCategory: 'All',
      iconBg: 'bg-[#0288d1]',
      textColor: 'text-zinc-800',
      customIcon: (
        <div className="w-12 h-12 rounded-2xl bg-[#0288d1] flex items-center justify-center text-white shadow-xs">
          <CloudDownload className="w-6 h-6 stroke-[2.3]" />
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
    <div className="w-full pt-8 pb-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 8 colorful category cards in an aesthetic horizontal grid matching screenshot */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.mappedCategory && cat.mappedCategory !== 'All';
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.mappedCategory)}
                className={`group flex flex-col items-center justify-center py-6 px-3 rounded-2xl bg-[#f8f9fa] border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'border-[#f95a12] shadow-sm bg-orange-50/40 ring-1 ring-[#f95a12]'
                    : 'border-zinc-200/70 hover:border-zinc-300 hover:bg-white hover:shadow-sm'
                }`}
              >
                {/* Colorful Rounded Icon */}
                <div className="transition-transform duration-200 group-hover:scale-105">
                  {cat.customIcon}
                </div>

                {/* Category Name */}
                <span className="mt-3.5 text-xs sm:text-[13px] font-semibold text-zinc-800 text-center leading-tight tracking-tight group-hover:text-[#f95a12] transition-colors">
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
