export interface BrandingWordStyle {
  text: string;
  color: string;
}

export interface SiteBranding {
  faviconUrl: string | null;
  siteLogoUrl: string | null;
  footerLogoUrl: string | null;
  logoDisplayMode: 'logo_only' | 'logo_and_name';
  siteName: string;
  words: BrandingWordStyle[];
  fontFamily: string;
  fontWeight: string;
  letterSpacing: string;
  textTransform: 'uppercase' | 'capitalize' | 'none';
  fontSizeDesktop: number;
  fontSizeMobile: number;
  showDefaultIconBox: boolean;
  tagline: string;
  taglineColor: string;
  showTagline: boolean;
  updatedAt?: string;
}

export interface FontOption {
  id: string;
  name: string;
  category: 'Modern Sans' | 'Luxury Serif' | 'Tech & Cyber' | 'Geometric' | 'Editorial';
  cssFamily: string;
  sample: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', category: 'Modern Sans', cssFamily: "'Plus Jakarta Sans', -apple-system, sans-serif", sample: 'Sleek & Contemporary UI' },
  { id: 'outfit', name: 'Outfit', category: 'Geometric', cssFamily: "'Outfit', -apple-system, sans-serif", sample: 'Geometric Tech Power' },
  { id: 'inter', name: 'Inter', category: 'Modern Sans', cssFamily: "'Inter', -apple-system, sans-serif", sample: 'Universal Silicon Valley UI' },
  { id: 'space-grotesk', name: 'Space Grotesk', category: 'Tech & Cyber', cssFamily: "'Space Grotesk', monospace, sans-serif", sample: 'Cyber Engineering Bold' },
  { id: 'orbitron', name: 'Orbitron', category: 'Tech & Cyber', cssFamily: "'Orbitron', sans-serif", sample: 'Futuristic Sci-Fi Power' },
  { id: 'syne', name: 'Syne', category: 'Editorial', cssFamily: "'Syne', -apple-system, sans-serif", sample: 'Avant-Garde Designer' },
  { id: 'bebas-neue', name: 'Bebas Neue', category: 'Editorial', cssFamily: "'Bebas Neue', sans-serif", sample: 'BOLD CONDENSED IMPACT' },
  { id: 'righteous', name: 'Righteous', category: 'Tech & Cyber', cssFamily: "'Righteous', cursive, sans-serif", sample: 'Retro Cyber Neon' },
  { id: 'lexend', name: 'Lexend', category: 'Geometric', cssFamily: "'Lexend', sans-serif", sample: 'Hyper-Legible Streamlined' },
  { id: 'playfair', name: 'Playfair Display', category: 'Luxury Serif', cssFamily: "'Playfair Display', Georgia, serif", sample: 'Luxury Editorial Fashion' },
  { id: 'cinzel', name: 'Cinzel', category: 'Luxury Serif', cssFamily: "'Cinzel', Georgia, serif", sample: 'Regal Roman Classical' },
  { id: 'cormorant', name: 'Cormorant Garamond', category: 'Luxury Serif', cssFamily: "'Cormorant Garamond', Georgia, serif", sample: 'High-Society Editorial' },
  { id: 'montserrat', name: 'Montserrat', category: 'Geometric', cssFamily: "'Montserrat', sans-serif", sample: 'Punchy Urban Clean' },
  { id: 'poppins', name: 'Poppins', category: 'Geometric', cssFamily: "'Poppins', sans-serif", sample: 'Friendly Geometric Curve' },
  { id: 'raleway', name: 'Raleway', category: 'Editorial', cssFamily: "'Raleway', sans-serif", sample: 'Sophisticated Slim Elegance' },
];

export const PRESET_COLORS: { name: string; hex: string }[] = [
  { name: 'OMYRA Orange', hex: '#FF5A00' },
  { name: 'Sunset Amber', hex: '#FF7A1A' },
  { name: 'Deep Navy', hex: '#0B2046' },
  { name: 'Pitch Dark', hex: '#09090B' },
  { name: 'Royal Blue', hex: '#2563EB' },
  { name: 'Indigo Dream', hex: '#4F46E5' },
  { name: 'Cyan Neon', hex: '#06B6D4' },
  { name: 'Emerald Green', hex: '#059669' },
  { name: 'Lime Glow', hex: '#84CC16' },
  { name: 'Deep Violet', hex: '#7C3AED' },
  { name: 'Electric Purple', hex: '#A855F7' },
  { name: 'Vibrant Crimson', hex: '#E11D48' },
  { name: 'Coral Rose', hex: '#F43F5E' },
  { name: 'Golden Bronze', hex: '#D97706' },
  { name: 'Slate Gray', hex: '#475569' },
  { name: 'Pure White', hex: '#FFFFFF' },
];

export const DEFAULT_BRANDING: SiteBranding = {
  faviconUrl: null,
  siteLogoUrl: null,
  footerLogoUrl: null,
  logoDisplayMode: 'logo_and_name',
  siteName: 'OMYRA MALL',
  words: [
    { text: 'OMYRA', color: '#0B2046' },
    { text: 'MALL', color: '#FF5A00' }
  ],
  fontFamily: "'Plus Jakarta Sans', -apple-system, sans-serif",
  fontWeight: '800',
  letterSpacing: '-0.02em',
  textTransform: 'uppercase',
  fontSizeDesktop: 22,
  fontSizeMobile: 18,
  showDefaultIconBox: true,
  tagline: 'Digital Products Marketplace',
  taglineColor: '#58769F',
  showTagline: false,
};
