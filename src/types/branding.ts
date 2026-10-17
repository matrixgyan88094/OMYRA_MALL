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

export type FontCategory = 'Modern Sans' | 'Geometric' | 'Luxury Serif' | 'Tech & Cyber' | 'Bold Display' | 'Editorial';

export interface FontOption {
  id: string;
  name: string;
  category: FontCategory;
  cssFamily: string;
  sample: string;
}

export const AVAILABLE_FONTS: FontOption[] = [
  // 1. MODERN SANS & TECH (20)
  { id: 'plus-jakarta', name: 'Plus Jakarta Sans', category: 'Modern Sans', cssFamily: "'Plus Jakarta Sans', sans-serif", sample: 'Contemporary UI' },
  { id: 'inter', name: 'Inter', category: 'Modern Sans', cssFamily: "'Inter', sans-serif", sample: 'Silicon Valley Standard' },
  { id: 'manrope', name: 'Manrope', category: 'Modern Sans', cssFamily: "'Manrope', sans-serif", sample: 'Ultra-Modern Fintech' },
  { id: 'dm-sans', name: 'DM Sans', category: 'Modern Sans', cssFamily: "'DM Sans', sans-serif", sample: 'Precise Geometric Sans' },
  { id: 'sora', name: 'Sora', category: 'Modern Sans', cssFamily: "'Sora', sans-serif", sample: 'Cryptographic Clean' },
  { id: 'urbanist', name: 'Urbanist', category: 'Modern Sans', cssFamily: "'Urbanist', sans-serif", sample: 'Modernist Digital' },
  { id: 'figtree', name: 'Figtree', category: 'Modern Sans', cssFamily: "'Figtree', sans-serif", sample: 'Friendly SaaS Wave' },
  { id: 'albert-sans', name: 'Albert Sans', category: 'Modern Sans', cssFamily: "'Albert Sans', sans-serif", sample: 'Modern Scandinavian' },
  { id: 'spline-sans', name: 'Spline Sans', category: 'Modern Sans', cssFamily: "'Spline Sans', sans-serif", sample: '3D UI Aesthetic' },
  { id: 'onest', name: 'Onest', category: 'Modern Sans', cssFamily: "'Onest', sans-serif", sample: 'Universal Geometric' },
  { id: 'instrument-sans', name: 'Instrument Sans', category: 'Modern Sans', cssFamily: "'Instrument Sans', sans-serif", sample: 'Industrial Silicon' },
  { id: 'bricolage-grotesque', name: 'Bricolage Grotesque', category: 'Modern Sans', cssFamily: "'Bricolage Grotesque', sans-serif", sample: 'Punchy Neo-Grotesque' },
  { id: 'red-hat-display', name: 'Red Hat Display', category: 'Modern Sans', cssFamily: "'Red Hat Display', sans-serif", sample: 'Enterprise Power' },
  { id: 'hanken-grotesk', name: 'Hanken Grotesk', category: 'Modern Sans', cssFamily: "'Hanken Grotesk', sans-serif", sample: 'Crisp Editorial Sans' },
  { id: 'chivo', name: 'Chivo', category: 'Modern Sans', cssFamily: "'Chivo', sans-serif", sample: 'High-Impact Grotesque' },
  { id: 'epilogue', name: 'Epilogue', category: 'Modern Sans', cssFamily: "'Epilogue', sans-serif", sample: 'Variable Contemporary' },
  { id: 'rubik', name: 'Rubik', category: 'Modern Sans', cssFamily: "'Rubik', sans-serif", sample: 'Rounded High-Tech' },
  { id: 'be-vietnam-pro', name: 'Be Vietnam Pro', category: 'Modern Sans', cssFamily: "'Be Vietnam Pro', sans-serif", sample: 'Global Engineering' },
  { id: 'work-sans', name: 'Work Sans', category: 'Modern Sans', cssFamily: "'Work Sans', sans-serif", sample: 'Professional Workspace' },
  { id: 'public-sans', name: 'Public Sans', category: 'Modern Sans', cssFamily: "'Public Sans', sans-serif", sample: 'Authority Clean' },
  { id: 'kumbh-sans', name: 'Kumbh Sans', category: 'Modern Sans', cssFamily: "'Kumbh Sans', sans-serif", sample: 'Modern Balanced' },
  { id: 'readex-pro', name: 'Readex Pro', category: 'Modern Sans', cssFamily: "'Readex Pro', sans-serif", sample: 'Optimal Legibility' },

  // 2. GEOMETRIC & BAUHAUS (18)
  { id: 'outfit', name: 'Outfit', category: 'Geometric', cssFamily: "'Outfit', sans-serif", sample: 'Geometric Tech Power' },
  { id: 'lexend', name: 'Lexend', category: 'Geometric', cssFamily: "'Lexend', sans-serif", sample: 'Streamlined Reading' },
  { id: 'montserrat', name: 'Montserrat', category: 'Geometric', cssFamily: "'Montserrat', sans-serif", sample: 'Punchy Urban Clean' },
  { id: 'poppins', name: 'Poppins', category: 'Geometric', cssFamily: "'Poppins', sans-serif", sample: 'Friendly Curves' },
  { id: 'archivo', name: 'Archivo', category: 'Geometric', cssFamily: "'Archivo', sans-serif", sample: 'Architectural Geometric' },
  { id: 'jost', name: 'Jost', category: 'Geometric', cssFamily: "'Jost', sans-serif", sample: 'Futura Renaissance' },
  { id: 'league-spartan', name: 'League Spartan', category: 'Geometric', cssFamily: "'League Spartan', sans-serif", sample: 'Bold Geometric Statement' },
  { id: 'sen', name: 'Sen', category: 'Geometric', cssFamily: "'Sen', sans-serif", sample: 'Clean Balanced Geometric' },
  { id: 'questrial', name: 'Questrial', category: 'Geometric', cssFamily: "'Questrial', sans-serif", sample: 'Circle-Based Modern' },
  { id: 'mulish', name: 'Mulish', category: 'Geometric', cssFamily: "'Mulish', sans-serif", sample: 'Minimalist Structure' },
  { id: 'bai-jamjuree', name: 'Bai Jamjuree', category: 'Geometric', cssFamily: "'Bai Jamjuree', sans-serif", sample: 'Square Geometric Form' },
  { id: 'nunito', name: 'Nunito', category: 'Geometric', cssFamily: "'Nunito', sans-serif", sample: 'Soft Rounded Curves' },
  { id: 'cabin', name: 'Cabin', category: 'Geometric', cssFamily: "'Cabin', sans-serif", sample: 'Humanist Geometric' },
  { id: 'overpass', name: 'Overpass', category: 'Geometric', cssFamily: "'Overpass', sans-serif", sample: 'Wayfinding Precision' },
  { id: 'josefin-sans', name: 'Josefin Sans', category: 'Geometric', cssFamily: "'Josefin Sans', sans-serif", sample: 'Vintage Scandinavian' },
  { id: 'quicksand', name: 'Quicksand', category: 'Geometric', cssFamily: "'Quicksand', sans-serif", sample: 'Modern Friendly' },
  { id: 'comfortaa', name: 'Comfortaa', category: 'Geometric', cssFamily: "'Comfortaa', cursive", sample: 'Ultra-Smooth Rounded' },
  { id: 'tenor-sans', name: 'Tenor Sans', category: 'Geometric', cssFamily: "'Tenor Sans', sans-serif", sample: 'Fashion Elegance' },

  // 3. HIGH-END LUXURY & EDITORIAL SERIF (22)
  { id: 'playfair', name: 'Playfair Display', category: 'Luxury Serif', cssFamily: "'Playfair Display', Georgia, serif", sample: 'Luxury Editorial Fashion' },
  { id: 'cinzel', name: 'Cinzel', category: 'Luxury Serif', cssFamily: "'Cinzel', Georgia, serif", sample: 'Regal Roman Classical' },
  { id: 'cormorant-garamond', name: 'Cormorant Garamond', category: 'Luxury Serif', cssFamily: "'Cormorant Garamond', Georgia, serif", sample: 'High-Society Editorial' },
  { id: 'bodoni-moda', name: 'Bodoni Moda', category: 'Luxury Serif', cssFamily: "'Bodoni Moda', serif", sample: 'Haute Couture Vogue' },
  { id: 'prata', name: 'Prata', category: 'Luxury Serif', cssFamily: "'Prata', serif", sample: 'Didone Tear Drop' },
  { id: 'marcellus', name: 'Marcellus', category: 'Luxury Serif', cssFamily: "'Marcellus', serif", sample: 'Flared Classical Serif' },
  { id: 'castoro', name: 'Castoro', category: 'Luxury Serif', cssFamily: "'Castoro', serif", sample: 'Scholarly Academic' },
  { id: 'fraunces', name: 'Fraunces', category: 'Luxury Serif', cssFamily: "'Fraunces', serif", sample: 'Warm Vintage Wonky' },
  { id: 'newsreader', name: 'Newsreader', category: 'Luxury Serif', cssFamily: "'Newsreader', serif", sample: 'Times Elite Journal' },
  { id: 'libre-baskerville', name: 'Libre Baskerville', category: 'Luxury Serif', cssFamily: "'Libre Baskerville', serif", sample: 'Timeless British Serif' },
  { id: 'spectral', name: 'Spectral', category: 'Luxury Serif', cssFamily: "'Spectral', serif", sample: 'Crisp Screen Serif' },
  { id: 'dm-serif-display', name: 'DM Serif Display', category: 'Luxury Serif', cssFamily: "'DM Serif Display', serif", sample: 'High-Contrast Impact' },
  { id: 'lora', name: 'Lora', category: 'Luxury Serif', cssFamily: "'Lora', serif", sample: 'Contemporary Literary' },
  { id: 'bitter', name: 'Bitter', category: 'Luxury Serif', cssFamily: "'Bitter', serif", sample: 'Slab Serif Precision' },
  { id: 'merriweather', name: 'Merriweather', category: 'Luxury Serif', cssFamily: "'Merriweather', serif", sample: 'Pleasant Warm Reading' },
  { id: 'eb-garamond', name: 'EB Garamond', category: 'Luxury Serif', cssFamily: "'EB Garamond', serif", sample: 'Historical Renaissance' },
  { id: 'cormorant', name: 'Cormorant', category: 'Luxury Serif', cssFamily: "'Cormorant', serif", sample: 'Fine Hairline Elegance' },
  { id: 'rozha-one', name: 'Rozha One', category: 'Luxury Serif', cssFamily: "'Rozha One', serif", sample: 'Dramatic Thick & Thin' },
  { id: 'cinzel-decorative', name: 'Cinzel Decorative', category: 'Luxury Serif', cssFamily: "'Cinzel Decorative', serif", sample: 'Ornate Imperial Swash' },
  { id: 'bellefair', name: 'Bellefair', category: 'Luxury Serif', cssFamily: "'Bellefair', serif", sample: 'Graceful Slender Serif' },
  { id: 'forum', name: 'Forum', category: 'Luxury Serif', cssFamily: "'Forum', serif", sample: 'Antiquity Architectural' },
  { id: 'cardo', name: 'Cardo', category: 'Luxury Serif', cssFamily: "'Cardo', serif", sample: 'Classical Humanist Serif' },

  // 4. TECH, CYBER & GAMING (16)
  { id: 'space-grotesk', name: 'Space Grotesk', category: 'Tech & Cyber', cssFamily: "'Space Grotesk', monospace, sans-serif", sample: 'Cyber Engineering Bold' },
  { id: 'orbitron', name: 'Orbitron', category: 'Tech & Cyber', cssFamily: "'Orbitron', sans-serif", sample: 'Futuristic Sci-Fi Power' },
  { id: 'righteous', name: 'Righteous', category: 'Tech & Cyber', cssFamily: "'Righteous', cursive, sans-serif", sample: 'Retro Cyber Neon' },
  { id: 'rajdhani', name: 'Rajdhani', category: 'Tech & Cyber', cssFamily: "'Rajdhani', sans-serif", sample: 'Modular Mecha HUD' },
  { id: 'chakra-petch', name: 'Chakra Petch', category: 'Tech & Cyber', cssFamily: "'Chakra Petch', sans-serif", sample: 'Robotics Engineering' },
  { id: 'exo-2', name: 'Exo 2', category: 'Tech & Cyber', cssFamily: "'Exo 2', sans-serif", sample: 'Space Explorer UI' },
  { id: 'audiowide', name: 'Audiowide', category: 'Tech & Cyber', cssFamily: "'Audiowide', cursive", sample: 'Synthwave Electronic' },
  { id: 'michroma', name: 'Michroma', category: 'Tech & Cyber', cssFamily: "'Michroma', sans-serif", sample: 'Aerospace Cockpit' },
  { id: 'oxanium', name: 'Oxanium', category: 'Tech & Cyber', cssFamily: "'Oxanium', sans-serif", sample: 'Cyberpunk Tactical' },
  { id: 'bruno-ace', name: 'Bruno Ace', category: 'Tech & Cyber', cssFamily: "'Bruno Ace', sans-serif", sample: 'High-Velocity Racer' },
  { id: 'nova-square', name: 'Nova Square', category: 'Tech & Cyber', cssFamily: "'Nova Square', cursive", sample: 'Digital Circuit Grid' },
  { id: 'russo-one', name: 'Russo One', category: 'Tech & Cyber', cssFamily: "'Russo One', sans-serif", sample: 'Heavy Armor Titanium' },
  { id: 'electrolize', name: 'Electrolize', category: 'Tech & Cyber', cssFamily: "'Electrolize', sans-serif", sample: 'Electronic Terminal' },
  { id: 'saira', name: 'Saira', category: 'Tech & Cyber', cssFamily: "'Saira', sans-serif", sample: 'Aerodynamic Variable' },
  { id: 'teko', name: 'Teko', category: 'Tech & Cyber', cssFamily: "'Teko', sans-serif", sample: 'Tall Kinetic Display' },
  { id: 'zen-dots', name: 'Zen Dots', category: 'Tech & Cyber', cssFamily: "'Zen Dots', cursive", sample: 'Matrix Arcade Neo' },

  // 5. BOLD CONDENSED & IMPACT (14)
  { id: 'bebas-neue', name: 'Bebas Neue', category: 'Bold Display', cssFamily: "'Bebas Neue', sans-serif", sample: 'BOLD CONDENSED IMPACT' },
  { id: 'anton', name: 'Anton', category: 'Bold Display', cssFamily: "'Anton', sans-serif", sample: 'Solid Heavy Sans' },
  { id: 'barlow-condensed', name: 'Barlow Condensed', category: 'Bold Display', cssFamily: "'Barlow Condensed', sans-serif", sample: 'Californian Condensed' },
  { id: 'oswald', name: 'Oswald', category: 'Bold Display', cssFamily: "'Oswald', sans-serif", sample: 'Reworked Classic Sans' },
  { id: 'fjalla-one', name: 'Fjalla One', category: 'Bold Display', cssFamily: "'Fjalla One', sans-serif", sample: 'Nordic Tall Sans' },
  { id: 'archivo-black', name: 'Archivo Black', category: 'Bold Display', cssFamily: "'Archivo Black', sans-serif", sample: 'Brutal Black Weight' },
  { id: 'big-shoulders-display', name: 'Big Shoulders Display', category: 'Bold Display', cssFamily: "'Big Shoulders Display', cursive", sample: 'Chicago Condensed' },
  { id: 'six-caps', name: 'Six Caps', category: 'Bold Display', cssFamily: "'Six Caps', sans-serif", sample: 'Ultra-Condensed Stripped' },
  { id: 'league-gothic', name: 'League Gothic', category: 'Bold Display', cssFamily: "'League Gothic', sans-serif", sample: 'Historic American Sans' },
  { id: 'antonio', name: 'Antonio', category: 'Bold Display', cssFamily: "'Antonio', sans-serif", sample: 'Signage Condensed' },
  { id: 'squada-one', name: 'Squada One', category: 'Bold Display', cssFamily: "'Squada One', cursive", sample: 'Geometric Square Display' },
  { id: 'saira-condensed', name: 'Saira Condensed', category: 'Bold Display', cssFamily: "'Saira Condensed', sans-serif", sample: 'Tight Space Power' },
  { id: 'pathway-gothic-one', name: 'Pathway Gothic One', category: 'Bold Display', cssFamily: "'Pathway Gothic One', sans-serif", sample: 'Slender High-Density' },
  { id: 'dela-gothic-one', name: 'Dela Gothic One', category: 'Bold Display', cssFamily: "'Dela Gothic One', cursive", sample: 'Japanese Heavy Block' },

  // 6. EDITORIAL, AVANT-GARDE & CALLIGRAPHIC (18)
  { id: 'syne', name: 'Syne', category: 'Editorial', cssFamily: "'Syne', sans-serif", sample: 'Avant-Garde Designer' },
  { id: 'raleway', name: 'Raleway', category: 'Editorial', cssFamily: "'Raleway', sans-serif", sample: 'Sophisticated Slim Elegance' },
  { id: 'unbounded', name: 'Unbounded', category: 'Editorial', cssFamily: "'Unbounded', cursive", sample: 'Neo-Brutalist Wide' },
  { id: 'darker-grotesque', name: 'Darker Grotesque', category: 'Editorial', cssFamily: "'Darker Grotesque', sans-serif", sample: 'Vietnamese Editorial' },
  { id: 'italiana', name: 'Italiana', category: 'Editorial', cssFamily: "'Italiana', serif", sample: 'Italian Renaissance Luxury' },
  { id: 'zen-kaku-gothic', name: 'Zen Kaku Gothic Antique', category: 'Editorial', cssFamily: "'Zen Kaku Gothic Antique', sans-serif", sample: 'Japanese Minimalist' },
  { id: 'marcellus-sc', name: 'Marcellus SC', category: 'Editorial', cssFamily: "'Marcellus SC', serif", sample: 'Classical Small Capitals' },
  { id: 'federo', name: 'Federo', category: 'Editorial', cssFamily: "'Federo', sans-serif", sample: 'Early 20th Century Poster' },
  { id: 'caveat', name: 'Caveat', category: 'Editorial', cssFamily: "'Caveat', cursive", sample: 'Handwritten Expressive' },
  { id: 'kaushan-script', name: 'Kaushan Script', category: 'Editorial', cssFamily: "'Kaushan Script', cursive", sample: 'Energetic Brush Calligraphy' },
  { id: 'allura', name: 'Allura', category: 'Editorial', cssFamily: "'Allura', cursive", sample: 'Flowing Formal Script' },
  { id: 'great-vibes', name: 'Great Vibes', category: 'Editorial', cssFamily: "'Great Vibes', cursive", sample: 'Elegant Swash Flourish' },
  { id: 'playfair-display-sc', name: 'Playfair Display SC', category: 'Editorial', cssFamily: "'Playfair Display SC', serif", sample: 'Small Caps Editorial' },
  { id: 'cormorant-sc', name: 'Cormorant SC', category: 'Editorial', cssFamily: "'Cormorant SC', serif", sample: 'Regal Small Caps' },
  { id: 'petit-formal-script', name: 'Petit Formal Script', category: 'Editorial', cssFamily: "'Petit Formal Script', cursive", sample: 'Refined Royal Script' },
  { id: 'alegreya-sans-sc', name: 'Alegreya Sans SC', category: 'Editorial', cssFamily: "'Alegreya Sans SC', sans-serif", sample: 'Dynamic Small Caps' },
  { id: 'cinzel-decorative-bold', name: 'Cinzel Decorative Bold', category: 'Editorial', cssFamily: "'Cinzel Decorative', serif", sample: 'Classical Architectural' },
  { id: 'syne-tactile', name: 'Syne Tactile', category: 'Editorial', cssFamily: "'Syne Tactile', cursive", sample: 'Artisanal Tactile Designer' },
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
  fontFamily: "'Plus Jakarta Sans', sans-serif",
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
