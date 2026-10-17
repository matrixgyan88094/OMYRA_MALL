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
  const logoHeight = size === 'sm' ? 'h-8' : size === 'lg' ? 'h-11' : size === 'xl' ? 'h-14' : 'h-9 sm:h-10';
  const boxDim = size === 'sm' ? 'w-8 h-8 rounded-lg text-lg' : size === 'lg' ? 'w-11 h-11 rounded-xl text-2xl' : size === 'xl' ? 'w-14 h-14 rounded-2xl text-3xl' : 'w-9.5 h-9.5 sm:w-10 sm:h-10 rounded-xl text-xl';
  const fontSizeStyle = size === 'sm' ? '18px' : size === 'lg' ? '24px' : size === 'xl' ? '30px' : `${branding.fontSizeDesktop || 22}px`;

  const hasCustomLogo = Boolean(branding.siteLogoUrl && branding.siteLogoUrl.trim() !== '');
  const showOnlyLogo = hasCustomLogo && branding.logoDisplayMode === 'logo_only' && !forceShowText;
  const showLogoAndName = hasCustomLogo && (branding.logoDisplayMode === 'logo_and_name' || forceShowText);

  // 1. If Admin uploaded custom logo AND selected 'show only logo'
  if (showOnlyLogo) {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={branding.siteLogoUrl!}
          alt={branding.siteName || 'Site Logo'}
          className={`${logoHeight} w-auto max-w-[220px] object-contain transition-all`}
          onError={(e) => {
            // Fallback gracefully if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>
    );
  }

  // 2. Either custom logo + name, OR default site name
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Visual Mark / Icon / Logo */}
      {showLogoAndName ? (
        <img
          src={branding.siteLogoUrl!}
          alt={branding.siteName || 'Site Logo'}
          className={`${logoHeight} w-auto max-w-[140px] object-contain shrink-0`}
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      ) : branding.showDefaultIconBox ? (
        /* Default Branded Icon Box (Orange rounded square with first letter or M) */
        <div 
          className={`${boxDim} bg-[#FF5A00] flex items-center justify-center text-white font-black shadow-xs shrink-0 select-none transition-transform hover:scale-105`}
          style={{ backgroundColor: branding.words[0]?.color === '#FF5A00' ? '#FF5A00' : (branding.words[1]?.color || '#FF5A00') }}
        >
          <span className="text-white font-black tracking-tighter leading-none" style={{ fontFamily: branding.fontFamily, fontWeight: 900 }}>
            {branding.siteName?.trim().charAt(0) || 'M'}
          </span>
        </div>
      ) : null}

      {/* Styled Site Name (Every word customizable in font, color, weight) */}
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
        {branding.words && branding.words.length > 0 ? (
          branding.words.map((w, idx) => (
            <span
              key={`${idx}_${w.text}`}
              style={{ color: w.color }}
              className={idx > 0 ? 'ml-1.5' : ''}
            >
              {w.text}
            </span>
          ))
        ) : (
          <span style={{ color: '#0B2046' }}>{branding.siteName || 'OMYRA MALL'}</span>
        )}
      </div>
    </div>
  );
};
