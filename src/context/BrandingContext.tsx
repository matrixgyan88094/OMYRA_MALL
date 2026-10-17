import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SiteBranding, DEFAULT_BRANDING, BrandingWordStyle } from '../types/branding';
import { loadGoogleFont, extractFontNameFromCss } from '../utils/fontLoader';

interface BrandingContextType {
  branding: SiteBranding;
  isLoading: boolean;
  isSaving: boolean;
  saveError: string | null;
  updateBrandingState: (updates: Partial<SiteBranding>) => void;
  setWordColor: (index: number, color: string) => void;
  setSiteName: (name: string) => void;
  saveBrandingToServer: (token: string, newBranding?: SiteBranding) => Promise<boolean>;
  resetBrandingToServer: (token: string) => Promise<boolean>;
  refreshBranding: () => Promise<void>;
}

const BRANDING_STORAGE_KEY = 'omyra_site_branding';

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

// Helper to ensure words array matches the words in siteName
export function syncWordsWithName(name: string, existingWords: BrandingWordStyle[]): BrandingWordStyle[] {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return [{ text: 'OMYRA', color: '#0B2046' }, { text: 'MALL', color: '#FF5A00' }];
  }
  return parts.map((part, idx) => {
    const existing = existingWords[idx];
    if (existing) {
      return { text: part, color: existing.color };
    }
    // Default alternating colors if newly added word
    return {
      text: part,
      color: idx % 2 === 0 ? '#0B2046' : '#FF5A00'
    };
  });
}

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<SiteBranding>(() => {
    try {
      const cached = localStorage.getItem(BRANDING_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        return {
          ...DEFAULT_BRANDING,
          ...parsed,
          words: syncWordsWithName(parsed.siteName || DEFAULT_BRANDING.siteName, parsed.words || DEFAULT_BRANDING.words)
        };
      }
    } catch (e) {
      console.warn('Could not read cached branding:', e);
    }
    return DEFAULT_BRANDING;
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Sync favicon with DOM <link rel="icon">
  useEffect(() => {
    const updateFaviconInDOM = (url: string | null) => {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'shortcut icon';
        document.head.appendChild(link);
      }
      if (url) {
        link.href = url;
      } else {
        // Default favicon SVG/ico
        link.href = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%23FF5A00'/%3E%3Ctext x='50%25' y='52%25' dominant-baseline='central' text-anchor='middle' font-family='sans-serif' font-weight='900' font-size='18' fill='%23FFFFFF'%3EM%3C/text%3E%3C/svg%3E";
      }
    };

    updateFaviconInDOM(branding.faviconUrl);
  }, [branding.faviconUrl]);

  // Sync active typography font with DOM Google Fonts loader
  useEffect(() => {
    if (branding.fontFamily) {
      const fontName = extractFontNameFromCss(branding.fontFamily);
      if (fontName) {
        loadGoogleFont(fontName);
      }
    }
  }, [branding.fontFamily]);

  // Load from API on mount
  const refreshBranding = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/branding');
      if (res.ok) {
        const data = await res.json();
        if (data && data.branding) {
          const merged: SiteBranding = {
            ...DEFAULT_BRANDING,
            ...data.branding,
            words: syncWordsWithName(data.branding.siteName || DEFAULT_BRANDING.siteName, data.branding.words || DEFAULT_BRANDING.words)
          };
          setBranding(merged);
          localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(merged));
        }
      }
    } catch (err) {
      console.warn('Notice loading branding from API:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshBranding();
  }, [refreshBranding]);

  // Update in-memory state
  const updateBrandingState = useCallback((updates: Partial<SiteBranding>) => {
    setBranding(prev => {
      let updatedWords = prev.words;
      if (updates.siteName !== undefined) {
        updatedWords = syncWordsWithName(updates.siteName, updates.words || prev.words);
      } else if (updates.words !== undefined) {
        updatedWords = updates.words;
      }

      const next = {
        ...prev,
        ...updates,
        words: updatedWords
      };
      try {
        localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Update a single word's color
  const setWordColor = useCallback((index: number, color: string) => {
    setBranding(prev => {
      const nextWords = [...prev.words];
      if (nextWords[index]) {
        nextWords[index] = { ...nextWords[index], color };
      }
      const next = { ...prev, words: nextWords };
      try {
        localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Update site name and re-sync words
  const setSiteName = useCallback((name: string) => {
    setBranding(prev => {
      const nextWords = syncWordsWithName(name, prev.words);
      const next = { ...prev, siteName: name, words: nextWords };
      try {
        localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Persist branding to server
  const saveBrandingToServer = useCallback(async (token: string, newBranding?: SiteBranding): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);
    const payload = newBranding || branding;
    try {
      const res = await fetch('/api/admin/branding', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save branding settings on server');
      }

      const resData = await res.json();
      if (resData.branding) {
        const merged = {
          ...DEFAULT_BRANDING,
          ...resData.branding,
          words: syncWordsWithName(resData.branding.siteName || DEFAULT_BRANDING.siteName, resData.branding.words || DEFAULT_BRANDING.words)
        };
        setBranding(merged);
        localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(merged));
      }
      return true;
    } catch (err: any) {
      console.error('Error saving branding:', err);
      setSaveError(err.message || 'Error saving branding');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [branding]);

  // Reset branding to default
  const resetBrandingToServer = useCallback(async (token: string): Promise<boolean> => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch('/api/admin/branding/reset', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to reset branding on server');
      }

      setBranding(DEFAULT_BRANDING);
      localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(DEFAULT_BRANDING));
      return true;
    } catch (err: any) {
      console.error('Error resetting branding:', err);
      setSaveError(err.message || 'Error resetting branding');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return (
    <BrandingContext.Provider
      value={{
        branding,
        isLoading,
        isSaving,
        saveError,
        updateBrandingState,
        setWordColor,
        setSiteName,
        saveBrandingToServer,
        resetBrandingToServer,
        refreshBranding
      }}
    >
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = (): BrandingContextType => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
