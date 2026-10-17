// Dynamic Google Fonts Loader Utility for 100+ Professional Typography Fonts

const loadedFonts = new Set<string>();

/**
 * Normalizes font name into Google Fonts API URL format
 */
export function getGoogleFontUrl(fontName: string, weights: string = '400;600;700;800;900'): string {
  const formattedName = fontName.trim().replace(/\s+/g, '+');
  return `https://fonts.googleapis.com/css2?family=${formattedName}:wght@${weights}&display=swap`;
}

/**
 * Dynamically loads a Google Font into document.head if not already loaded
 */
export function loadGoogleFont(fontName: string, weights: string = '400;600;700;800;900'): Promise<boolean> {
  if (typeof document === 'undefined') return Promise.resolve(false);
  
  const cleanName = fontName.trim();
  if (!cleanName || loadedFonts.has(cleanName)) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    // Check if link tag already exists in DOM
    const elementId = `google-font-${cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    if (document.getElementById(elementId)) {
      loadedFonts.add(cleanName);
      resolve(true);
      return;
    }

    const link = document.createElement('link');
    link.id = elementId;
    link.rel = 'stylesheet';
    link.href = getGoogleFontUrl(cleanName, weights);

    link.onload = () => {
      loadedFonts.add(cleanName);
      resolve(true);
    };

    link.onerror = () => {
      // Fallback: try loading without weights if font only supports 400
      const fallbackLink = document.createElement('link');
      fallbackLink.id = `${elementId}-fallback`;
      fallbackLink.rel = 'stylesheet';
      fallbackLink.href = `https://fonts.googleapis.com/css2?family=${cleanName.replace(/\s+/g, '+')}&display=swap`;
      fallbackLink.onload = () => {
        loadedFonts.add(cleanName);
        resolve(true);
      };
      fallbackLink.onerror = () => resolve(false);
      document.head.appendChild(fallbackLink);
    };

    document.head.appendChild(link);
  });
}

/**
 * Batch loads an array of font names
 */
export function loadBatchGoogleFonts(fontNames: string[]): void {
  fontNames.forEach(name => loadGoogleFont(name));
}

/**
 * Extracts the primary font family name from a CSS family string (e.g. "'Outfit', sans-serif" -> "Outfit")
 */
export function extractFontNameFromCss(cssFamily: string): string {
  if (!cssFamily) return '';
  const first = cssFamily.split(',')[0] || '';
  return first.replace(/['"]/g, '').trim();
}
