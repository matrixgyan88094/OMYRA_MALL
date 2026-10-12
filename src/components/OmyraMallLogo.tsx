import React from 'react';

interface OmyraMallLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const OmyraMallLogo: React.FC<OmyraMallLogoProps> = ({ className = '', size = 'md' }) => {
  const iconSize = size === 'sm' ? 'w-8 h-8' : size === 'lg' ? 'w-11 h-11' : 'w-9 h-9';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Orange rounded square with bold white modern M mark */}
      <div className={`${iconSize} rounded-xl bg-orange-600 flex items-center justify-center text-white font-extrabold shadow-sm transition-transform group-hover:scale-105 select-none shrink-0`}>
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="w-5 h-5 text-white"
        >
          <path d="M4 19V5l8 9 8-9v14" />
        </svg>
      </div>

      {/* Brand Name: OMYRA MALL */}
      <div className="flex flex-col leading-none">
        <span className={`${textSize} font-black tracking-tight text-zinc-950 font-sans group-hover:text-orange-600 transition-colors uppercase`}>
          OMYRA <span className="text-orange-600 font-extrabold">MALL</span>
        </span>
      </div>
    </div>
  );
};
