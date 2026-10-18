import React from 'react';
import { useBranding } from '../context/BrandingContext';
import { SiteBranding, DEFAULT_BRANDING } from '../types/branding';

interface OmyraMallLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  previewBranding?: SiteBranding;
  forceShowText?: boolean;
}

export const OmyraMallLogo: React.FC<OmyraMallLogoProps> = ({ 
  className = '', 
  size = 'md',
  previewBranding,
  forceShowText = false
}) => {
  let brandingContext: ReturnType<typeof useBranding> | null = null;
  try {
    brandingContext = useBranding();
  } catch {
    // Graceful fallback if rendered outside BrandingProvider
  }

  const branding = previewBranding || brandingContext?.branding || DEFAULT_BRANDING;

  // Dimension helpers based on size
  const logoHeight = size === 'sm' ? 'h-7.5 sm:h-8' : size === 'lg' ? 'h-11' : size === 'xl' ? 'h-14' : 'h-8 sm:h-10';
  const boxDim = size === 'sm' ? 'w-8 h-8 rounded-lg text-lg' : size === 'lg' ? 'w-11 h-11 rounded-xl text-2xl' : size === 'xl' ? 'w-14 h-14 rounded-2xl text-3xl' : 'w-8.5 h-8.5 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl text-lg sm:text-xl';
  const fontSizeStyle = size === 'sm' 
    ? '17px' 
    : size === 'lg' 
    ? '24px' 
    : size === 'xl' 
    ? '30px' 
    : `clamp(18px, 2.6vw, ${branding.fontSizeDesktop || 22}px)`;

  const hasCustomLogo = Boolean(branding.siteLogoUrl && branding.siteLogoUrl.trim() !== '');
  const showOnlyLogo = hasCustomLogo && branding.logoDisplayMode === 'logo_only' && !forceShowText;
  const showLogoAndName = hasCustomLogo && (branding.logoDisplayMode === 'logo_and_name' || forceShowText);

  // Derive exact current site name words (strictly matching branding.siteName without duplication)
  const currentSiteName = (branding.siteName || 'OMYRA MALL').trim();
  const siteWords = currentSiteName ? currentSiteName.split(/\s+/).filter(Boolean) : ['OMYRA', 'MALL'];

  // 1. If Admin uploaded custom logo AND selected 'show only logo'
  if (showOnlyLogo) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={branding.siteLogoUrl!}
          alt={currentSiteName}
          className={`${logoHeight} w-auto max-w-[220px] object-contain transition-all`}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 2. Custom logo + name, OR default site name
  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 select-none ${className}`}>
      {/* Visual Mark / Icon / Logo */}
      {showLogoAndName ? (
        <img
          src={branding.siteLogoUrl!}
          alt={currentSiteName}
          className={`${logoHeight} w-auto max-w-[140px] object-contain shrink-0`}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : branding.showDefaultIconBox ? (
        /* Default Branded Icon Box (Orange rounded square with first letter or M) */
        <div 
          className={`${boxDim} bg-[#FF5A00] flex items-center justify-center text-white font-black shadow-xs shrink-0 select-none transition-transform hover:scale-105`}
          style={{ backgroundColor: branding.words?.[0]?.color === '#FF5A00' ? '#FF5A00' : (branding.words?.[1]?.color || '#FF5A00') }}
        >
          <span className="text-white font-black tracking-tighter leading-none" style={{ fontFamily: branding.fontFamily, fontWeight: 900 }}>
            {currentSiteName.charAt(0) || 'M'}
          </span>
        </div>
      ) : null}

      {/* Styled Site Name (Words strictly synchronized with siteName and individual colors) */}
      <div 
        className="flex items-center flex-wrap leading-none select-none tracking-tight"
        style={{
          fontFamily: branding.fontFamily,
          fontWeight: branding.fontWeight,
          letterSpacing: branding.letterSpacing,
          textTransform: branding.textTransform,
          fontSize: fontSizeStyle
        }}
      >
        {siteWords.map((word, idx) => {
          const wordColor = branding.words?.[idx]?.color || (idx % 2 === 0 ? '#0B2046' : '#FF5A00');
          return (
            <span
              key={`${idx}_${word}`}
              style={{ color: wordColor }}
              className={idx > 0 ? 'ml-1.5' : ''}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
