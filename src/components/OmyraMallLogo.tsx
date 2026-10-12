import React from 'react';

interface OmyraMallLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OmyraMallLogo: React.FC<OmyraMallLogoProps> = ({ className = '', size = 'md' }) => {
  const boxDim = size === 'sm' ? 'w-8 h-8 rounded-lg' : size === 'lg' ? 'w-12 h-12 rounded-xl' : 'w-10 h-10 rounded-xl';
  const textClass = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-[22px]';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Orange rounded square with bold white M inside */}
      <div 
        className={`${boxDim} bg-[#f95a12] flex items-center justify-center text-white font-black shadow-xs shrink-0 select-none`}
        style={{ backgroundColor: '#f95a12' }}
      >
        <span className="text-white text-xl sm:text-2xl font-black tracking-tighter leading-none" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 900 }}>
          M
        </span>
      </div>

      {/* Brand Name: OMYRA MALL */}
      <div className="flex items-center tracking-tight select-none">
        <span className={`${textClass} font-extrabold text-zinc-900 tracking-tight leading-none`}>
          OMYRA
        </span>
        <span className={`${textClass} font-extrabold text-[#f95a12] tracking-tight leading-none ml-1.5`}>
          MALL
        </span>
      </div>
    </div>
  );
};
