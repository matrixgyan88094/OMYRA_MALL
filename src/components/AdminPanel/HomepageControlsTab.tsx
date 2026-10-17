import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Globe, 
  Check, 
  RefreshCw, 
  Trash2, 
  Save, 
  Layers, 
  Eye, 
  Palette, 
  Type, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  LayoutTemplate,
  Monitor,
  Smartphone,
  ExternalLink,
  ArrowRight,
  Search,
  X
} from 'lucide-react';
import { useBranding } from '../../context/BrandingContext';
import { 
  AVAILABLE_FONTS, 
  PRESET_COLORS, 
  DEFAULT_BRANDING, 
  SiteBranding,
  FontOption,
  FontCategory
} from '../../types/branding';
import { loadGoogleFont } from '../../utils/fontLoader';
import { OmyraMallLogo } from '../OmyraMallLogo';

interface HomepageControlsTabProps {
  token: string;
}

type SubTab = 'branding' | 'hero' | 'sections';

interface UploadProgressState {
  isUploading: boolean;
  progress: number;
  stage: string;
  error: string | null;
  success: boolean;
}

export const HomepageControlsTab: React.FC<HomepageControlsTabProps> = ({ token }) => {
  const { 
    branding, 
    updateBrandingState, 
    setWordColor, 
    setSiteName, 
    saveBrandingToServer, 
    resetBrandingToServer, 
    isSaving,
    saveError 
  } = useBranding();

  const [activeSubTab, setActiveSubTab] = useState<SubTab>('branding');
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Upload progress states for each target
  const [faviconUpload, setFaviconUpload] = useState<UploadProgressState>({
    isUploading: false,
    progress: 0,
    stage: '',
    error: null,
    success: false
  });

  const [siteLogoUpload, setSiteLogoUpload] = useState<UploadProgressState>({
    isUploading: false,
    progress: 0,
    stage: '',
    error: null,
    success: false
  });

  const [footerLogoUpload, setFooterLogoUpload] = useState<UploadProgressState>({
    isUploading: false,
    progress: 0,
    stage: '',
    error: null,
    success: false
  });

  // File input refs
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const siteLogoInputRef = useRef<HTMLInputElement>(null);
  const footerLogoInputRef = useRef<HTMLInputElement>(null);

  // Active word index for color editing
  const [activeWordIndex, setActiveWordIndex] = useState<number>(0);
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop');

  // Font Library search, category filter, and dynamic loading (110+ stylish fonts)
  const [fontSearch, setFontSearch] = useState<string>('');
  const [selectedFontCategory, setSelectedFontCategory] = useState<string>('All');

  const fontCategories: ('All' | FontCategory)[] = [
    'All', 
    'Modern Sans', 
    'Geometric', 
    'Luxury Serif', 
    'Tech & Cyber', 
    'Bold Display', 
    'Editorial'
  ];

  const filteredFonts = useMemo(() => {
    return AVAILABLE_FONTS.filter(font => {
      const matchesCategory = selectedFontCategory === 'All' || font.category === selectedFontCategory;
      const q = fontSearch.toLowerCase().trim();
      const matchesSearch = !q || 
        font.name.toLowerCase().includes(q) ||
        font.category.toLowerCase().includes(q) ||
        font.sample.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [fontSearch, selectedFontCategory]);

  // Preload top visible fonts as filter/search changes
  useEffect(() => {
    const topFonts = filteredFonts.slice(0, 30);
    topFonts.forEach(f => loadGoogleFont(f.name));
  }, [filteredFonts]);

  // Robust animated file upload handler with XMLHttpRequest progress
  const performUpload = (
    file: File, 
    target: 'favicon' | 'site_logo' | 'footer_logo',
    setState: React.Dispatch<React.SetStateAction<UploadProgressState>>,
    onSuccessUrl: (url: string) => void
  ) => {
    setState({
      isUploading: true,
      progress: 8,
      stage: 'Preparing asset and validating format...',
      error: null,
      success: false
    });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('target', target);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/admin/branding/upload', true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 85);
        let currentStage = 'Uploading binary chunks...';
        if (percent > 40 && percent < 75) {
          currentStage = 'Optimizing dimensions & transparent background...';
        } else if (percent >= 75) {
          currentStage = 'Generating CDN asset URL & caching...';
        }
        setState(prev => ({
          ...prev,
          progress: Math.max(15, percent),
          stage: currentStage
        }));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const res = JSON.parse(xhr.responseText);
          if (res.success && res.url) {
            setState({
              isUploading: false,
              progress: 100,
              stage: 'Upload complete! Applied to branding.',
              error: null,
              success: true
            });
            onSuccessUrl(res.url);

            // Clear success after 3.5 seconds
            setTimeout(() => {
              setState(prev => ({ ...prev, success: false, progress: 0 }));
            }, 3500);
          } else {
            throw new Error(res.error || 'Server rejected file upload');
          }
        } catch (e: any) {
          setState({
            isUploading: false,
            progress: 0,
            stage: '',
            error: e.message || 'Failed to process server response',
            success: false
          });
        }
      } else {
        setState({
          isUploading: false,
          progress: 0,
          stage: '',
          error: `Upload failed (Status ${xhr.status}): Please check file size or format`,
          success: false
        });
      }
    };

    xhr.onerror = () => {
      setState({
        isUploading: false,
        progress: 0,
        stage: '',
        error: 'Network error occurred during file transfer',
        success: false
      });
    };

    xhr.send(formData);
  };

  const handleSave = async () => {
    const ok = await saveBrandingToServer(token);
    if (ok) {
      setSaveSuccessMessage('All branding configurations persisted successfully to server & database.');
      setTimeout(() => setSaveSuccessMessage(null), 4000);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all branding settings (logo, fonts, word colors, and favicon) back to factory defaults?')) {
      const ok = await resetBrandingToServer(token);
      if (ok) {
        setSaveSuccessMessage('Branding reset to factory default theme.');
        setTimeout(() => setSaveSuccessMessage(null), 4000);
      }
    }
  };

  const hasCustomLogo = Boolean(branding.siteLogoUrl && branding.siteLogoUrl.trim() !== '');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Breadcrumb Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-orange-100 text-orange-600 rounded-xl">
              <SlidersHorizontal className="w-5 h-5" />
            </span>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                Homepage & Controls
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600">
                  Live Management
                </span>
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize site identity, logos, browser favicon, word-by-word typography, and homepage banners.
              </p>
            </div>
          </div>
        </div>

        {/* Global Save / Reset Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleReset}
            disabled={isSaving}
            className="px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-red-600 hover:bg-red-50 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSaving ? 'animate-spin' : ''}`} />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#FF5A00] hover:bg-[#e04f00] active:scale-[0.98] rounded-xl shadow-xs shadow-orange-500/25 transition-all flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving to Database...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Success / Error Banners */}
      {saveSuccessMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMessage}</span>
          </div>
          <button onClick={() => setSaveSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900 font-bold text-sm">×</button>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveSubTab('branding')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'branding'
              ? 'bg-[#FF5A00] text-white shadow-xs shadow-orange-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Branding Management & Logos</span>
        </button>

        <button
          onClick={() => setActiveSubTab('hero')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'hero'
              ? 'bg-[#FF5A00] text-white shadow-xs shadow-orange-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Hero & Promotional Banners</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSubTab === 'sections'
              ? 'bg-[#FF5A00] text-white shadow-xs shadow-orange-500/30'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Homepage Sections & Cards</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. BRANDING MANAGEMENT SUB-TAB                                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT 7 COLS: UPLOADS & LOGIC CONTROLS */}
          <div className="lg:col-span-7 space-y-8">

            {/* SECTION 1: LOGO UPLOAD SUITE (Favicon, Site Logo, Footer Logo) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Upload className="w-4 h-4 text-orange-600" />
                  Logo & Asset Upload Suite
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload custom brand assets with real-time animated upload progress, multi-device optimization, and instant preview.
                </p>
              </div>

              {/* THREE UPLOAD CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1.1 BROWSER FAVICON */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-blue-600" />
                        Browser Favicon
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">1:1 / 32px</span>
                    </div>

                    {/* Favicon Preview */}
                    <div className="h-16 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center p-2 relative overflow-hidden">
                      {branding.faviconUrl ? (
                        <img 
                          src={branding.faviconUrl} 
                          alt="Favicon" 
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-[#FF5A00] flex items-center justify-center text-white font-black text-sm">
                          M
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress Bar for Favicon */}
                  {faviconUpload.isUploading && (
                    <div className="space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] font-bold text-orange-700">
                        <span>{faviconUpload.stage}</span>
                        <span>{faviconUpload.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300 rounded-full relative"
                          style={{ width: `${faviconUpload.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-[pulse_1s_infinite]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {faviconUpload.error && (
                    <p className="text-[10px] text-red-600 font-medium">{faviconUpload.error}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="file"
                      ref={faviconInputRef}
                      accept="image/png,image/x-icon,image/svg+xml,image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          performUpload(file, 'favicon', setFaviconUpload, (url) => {
                            updateBrandingState({ faviconUrl: url });
                          });
                        }
                      }}
                    />
                    <button
                      onClick={() => faviconInputRef.current?.click()}
                      disabled={faviconUpload.isUploading}
                      className="flex-1 py-1.5 px-2.5 text-[11px] font-bold text-white bg-slate-900 hover:bg-orange-600 rounded-lg transition-all text-center flex items-center justify-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{branding.faviconUrl ? 'Replace' : 'Upload'}</span>
                    </button>

                    {branding.faviconUrl && (
                      <button
                        onClick={() => updateBrandingState({ faviconUrl: null })}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove custom favicon"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 1.2 SITE LOGO (HEADER) */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                        Site Logo (Header)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">PNG / SVG</span>
                    </div>

                    {/* Site Logo Preview */}
                    <div className="h-16 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center p-2 relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px]">
                      {branding.siteLogoUrl ? (
                        <img 
                          src={branding.siteLogoUrl} 
                          alt="Site Logo" 
                          className="h-10 w-auto max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-[11px] text-slate-400 italic">
                          No custom logo (Showing site name)
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress Bar for Site Logo */}
                  {siteLogoUpload.isUploading && (
                    <div className="space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] font-bold text-orange-700">
                        <span>{siteLogoUpload.stage}</span>
                        <span>{siteLogoUpload.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 transition-all duration-300 rounded-full relative"
                          style={{ width: `${siteLogoUpload.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-[pulse_1s_infinite]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {siteLogoUpload.error && (
                    <p className="text-[10px] text-red-600 font-medium">{siteLogoUpload.error}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="file"
                      ref={siteLogoInputRef}
                      accept="image/png,image/svg+xml,image/webp,image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          performUpload(file, 'site_logo', setSiteLogoUpload, (url) => {
                            updateBrandingState({ 
                              siteLogoUrl: url,
                              logoDisplayMode: 'logo_and_name' // default to logo_and_name when uploaded
                            });
                          });
                        }
                      }}
                    />
                    <button
                      onClick={() => siteLogoInputRef.current?.click()}
                      disabled={siteLogoUpload.isUploading}
                      className="flex-1 py-1.5 px-2.5 text-[11px] font-bold text-white bg-slate-900 hover:bg-orange-600 rounded-lg transition-all text-center flex items-center justify-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{branding.siteLogoUrl ? 'Replace' : 'Upload'}</span>
                    </button>

                    {branding.siteLogoUrl && (
                      <button
                        onClick={() => updateBrandingState({ siteLogoUrl: null })}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove custom logo (revert to site name)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 1.3 FOOTER LOGO */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                        Footer Logo
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Optional</span>
                    </div>

                    {/* Footer Logo Preview */}
                    <div className="h-16 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center p-2 relative overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px]">
                      {branding.footerLogoUrl ? (
                        <img 
                          src={branding.footerLogoUrl} 
                          alt="Footer Logo" 
                          className="h-9 w-auto max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-center text-[11px] text-slate-400 italic">
                          Inherits Header Logo
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress Bar for Footer Logo */}
                  {footerLogoUpload.isUploading && (
                    <div className="space-y-1.5 animate-in fade-in">
                      <div className="flex items-center justify-between text-[11px] font-bold text-orange-700">
                        <span>{footerLogoUpload.stage}</span>
                        <span>{footerLogoUpload.progress}%</span>
                      </div>
                      <div className="w-full h-2 bg-orange-100 rounded-full overflow-hidden relative">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300 rounded-full relative"
                          style={{ width: `${footerLogoUpload.progress}%` }}
                        >
                          <div className="absolute inset-0 bg-white/30 animate-[pulse_1s_infinite]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {footerLogoUpload.error && (
                    <p className="text-[10px] text-red-600 font-medium">{footerLogoUpload.error}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <input
                      type="file"
                      ref={footerLogoInputRef}
                      accept="image/png,image/svg+xml,image/webp,image/jpeg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          performUpload(file, 'footer_logo', setFooterLogoUpload, (url) => {
                            updateBrandingState({ footerLogoUrl: url });
                          });
                        }
                      }}
                    />
                    <button
                      onClick={() => footerLogoInputRef.current?.click()}
                      disabled={footerLogoUpload.isUploading}
                      className="flex-1 py-1.5 px-2.5 text-[11px] font-bold text-white bg-slate-900 hover:bg-orange-600 rounded-lg transition-all text-center flex items-center justify-center gap-1"
                    >
                      <Upload className="w-3 h-3" />
                      <span>{branding.footerLogoUrl ? 'Replace' : 'Upload'}</span>
                    </button>

                    {branding.footerLogoUrl && (
                      <button
                        onClick={() => updateBrandingState({ footerLogoUrl: null })}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove custom footer logo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* SECTION 2: LOGO DISPLAY MODE LOGIC (CONDITIONAL) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Eye className="w-4 h-4 text-orange-600" />
                  Logo Display Mode Configuration
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Enforces smart storefront brand presentation based on whether a custom logo is uploaded.
                </p>
              </div>

              {!hasCustomLogo ? (
                /* STATE A: NO CUSTOM LOGO UPLOADED YET */
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-4 text-amber-900 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold">Default Mode Active: Showing Site Name</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    Because no custom site logo is uploaded, the storefront automatically renders your stylized site name ({branding.siteName}) along with the brand icon box.
                  </p>
                  <p className="text-[11px] text-amber-700 font-medium">
                    ✦ When you upload a custom site logo above, the system will automatically unlock the <strong>Show only logo</strong> and <strong>Show logo with site name</strong> options.
                  </p>
                </div>
              ) : (
                /* STATE B: CUSTOM LOGO UPLOADED -> SYSTEM REVEALS TWO CHOICES */
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Custom Logo Uploaded! Select your preferred display mode:</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    
                    {/* OPTION 1: SHOW ONLY LOGO */}
                    <button
                      type="button"
                      onClick={() => updateBrandingState({ logoDisplayMode: 'logo_only' })}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                        branding.logoDisplayMode === 'logo_only'
                          ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-900">Show Only Logo</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          branding.logoDisplayMode === 'logo_only'
                            ? 'border-orange-600 bg-orange-600 text-white'
                            : 'border-slate-300'
                        }`}>
                          {branding.logoDisplayMode === 'logo_only' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        Only your uploaded custom logo will be displayed on the navbar (clean, brand-mark focus).
                      </p>
                      {/* Live Mini Preview */}
                      <div className="h-10 bg-white border border-slate-200/80 rounded-lg flex items-center px-3">
                        <img src={branding.siteLogoUrl!} alt="Logo" className="h-6 w-auto object-contain" />
                      </div>
                    </button>

                    {/* OPTION 2: SHOW LOGO WITH SITE NAME */}
                    <button
                      type="button"
                      onClick={() => updateBrandingState({ logoDisplayMode: 'logo_and_name' })}
                      className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative ${
                        branding.logoDisplayMode === 'logo_and_name'
                          ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-900">Show Logo with Site Name</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          branding.logoDisplayMode === 'logo_and_name'
                            ? 'border-orange-600 bg-orange-600 text-white'
                            : 'border-slate-300'
                        }`}>
                          {branding.logoDisplayMode === 'logo_and_name' && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed mb-3">
                        Displays your custom logo icon alongside your stylized typography site name.
                      </p>
                      {/* Live Mini Preview */}
                      <div className="h-10 bg-white border border-slate-200/80 rounded-lg flex items-center gap-2 px-3 overflow-hidden">
                        <img src={branding.siteLogoUrl!} alt="Logo" className="h-6 w-auto object-contain shrink-0" />
                        <span className="text-xs font-bold text-slate-800 truncate" style={{ fontFamily: branding.fontFamily }}>
                          {branding.siteName}
                        </span>
                      </div>
                    </button>

                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: SITE NAME DESIGN & PER-WORD COLOR PICKER */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Type className="w-4 h-4 text-orange-600" />
                  Site Name Design & Per-Word Colors
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Type your site title and customize the color for each word individually with instant preview.
                </p>
              </div>

              {/* Site Name Text Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>Site Brand Name</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    {branding.words.length} word{branding.words.length > 1 ? 's' : ''} detected
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={branding.siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    placeholder="e.g. OMYRA MALL"
                    className="w-full px-4 py-2.5 text-sm font-bold border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* PER-WORD COLOR SELECTOR */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Word Color Customizer (Click word to pick color)
                  </label>
                  <span className="text-[11px] text-orange-600 font-medium">
                    Word-by-word styling
                  </span>
                </div>

                {/* Word selector tabs */}
                <div className="flex flex-wrap items-center gap-2">
                  {branding.words.map((w, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveWordIndex(idx)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all border flex items-center gap-2 ${
                        activeWordIndex === idx
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-black/20 shrink-0 shadow-2xs" 
                        style={{ backgroundColor: w.color }} 
                      />
                      <span>Word {idx + 1}: "{w.text}"</span>
                    </button>
                  ))}
                </div>

                {/* Color editor for active word */}
                {branding.words[activeWordIndex] && (
                  <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">
                        Color for <span className="underline decoration-orange-500 underline-offset-2">"{branding.words[activeWordIndex].text}"</span>:
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={branding.words[activeWordIndex].color}
                          onChange={(e) => setWordColor(activeWordIndex, e.target.value)}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-300 p-0.5 bg-white"
                          title="Custom Color Picker"
                        />
                        <input
                          type="text"
                          value={branding.words[activeWordIndex].color}
                          onChange={(e) => setWordColor(activeWordIndex, e.target.value)}
                          className="w-24 px-2 py-1 text-xs font-mono font-bold uppercase border border-slate-200 rounded-lg bg-white text-center focus:border-orange-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Quick Swatches Palette */}
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold mb-2">Preset Brand Swatches:</div>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setWordColor(activeWordIndex, c.hex)}
                            title={`${c.name} (${c.hex})`}
                            className={`w-7 h-7 rounded-lg border transition-all relative ${
                              branding.words[activeWordIndex].color.toLowerCase() === c.hex.toLowerCase()
                                ? 'scale-110 border-slate-900 ring-2 ring-slate-900/20'
                                : 'border-slate-200 hover:scale-105'
                            }`}
                            style={{ backgroundColor: c.hex }}
                          >
                            {branding.words[activeWordIndex].color.toLowerCase() === c.hex.toLowerCase() && (
                              <Check className={`w-3.5 h-3.5 absolute inset-0 m-auto ${c.hex === '#FFFFFF' ? 'text-slate-900' : 'text-white'}`} />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* FONT FAMILY SELECTION: 110+ STYLISH FONTS */}
              <div className="space-y-3.5 pt-2 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                    <span>Stylish Typography Font Library</span>
                    <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-extrabold">
                      {AVAILABLE_FONTS.length} Fonts
                    </span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Showing {filteredFonts.length} of {AVAILABLE_FONTS.length} stylish fonts
                  </span>
                </div>

                {/* Search Bar for Fonts */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={fontSearch}
                    onChange={(e) => setFontSearch(e.target.value)}
                    placeholder="Search 110+ fonts by name, style, or category (e.g. Outfit, Cinzel, Syne, Tech...)"
                    className="w-full pl-9 pr-8 py-2 text-xs font-medium border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:border-orange-500 focus:outline-none transition-all"
                  />
                  {fontSearch && (
                    <button
                      type="button"
                      onClick={() => setFontSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
                  {fontCategories.map((cat) => {
                    const count = cat === 'All' 
                      ? AVAILABLE_FONTS.length 
                      : AVAILABLE_FONTS.filter(f => f.category === cat).length;
                    const isSelected = selectedFontCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedFontCategory(cat)}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                          isSelected
                            ? 'bg-slate-900 text-white shadow-2xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                        }`}
                      >
                        <span>{cat}</span>
                        <span className={`ml-1 text-[10px] ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* 110+ Font Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1 border border-slate-100 rounded-xl p-1 bg-slate-50/40">
                  {filteredFonts.length === 0 ? (
                    <div className="col-span-full p-8 text-center text-xs text-slate-400 bg-white rounded-xl border border-dashed border-slate-200 space-y-2">
                      <p>No fonts found matching "{fontSearch}"</p>
                      <button
                        type="button"
                        onClick={() => { setFontSearch(''); setSelectedFontCategory('All'); }}
                        className="text-xs font-bold text-orange-600 hover:underline"
                      >
                        Reset filters to view all 110+ fonts
                      </button>
                    </div>
                  ) : (
                    filteredFonts.map((font) => {
                      const isSelected = branding.fontFamily === font.cssFamily;
                      return (
                        <button
                          key={font.id}
                          type="button"
                          onMouseEnter={() => loadGoogleFont(font.name)}
                          onFocus={() => loadGoogleFont(font.name)}
                          onClick={() => {
                            loadGoogleFont(font.name);
                            updateBrandingState({ fontFamily: font.cssFamily });
                          }}
                          className={`text-left p-3 rounded-xl border transition-all relative group cursor-pointer ${
                            isSelected
                              ? 'border-orange-500 bg-orange-50/70 ring-2 ring-orange-500/20 shadow-2xs'
                              : 'border-slate-200 hover:border-orange-300 hover:bg-white bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1 gap-1">
                            <span className="text-xs font-bold text-slate-900 truncate">{font.name}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span className="text-[9px] text-slate-400 font-medium px-1.5 py-0.2 bg-slate-100 rounded">
                                {font.category}
                              </span>
                              {isSelected && (
                                <span className="w-3.5 h-3.5 rounded-full bg-orange-600 text-white flex items-center justify-center">
                                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                                </span>
                              )}
                            </div>
                          </div>
                          <div 
                            className="text-sm text-slate-800 font-black truncate leading-tight mt-1"
                            style={{ fontFamily: font.cssFamily }}
                          >
                            {branding.siteName || 'OMYRA MALL'}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate mt-0.5 font-normal">
                            {font.sample}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* TYPOGRAPHY TUNING: Weight, Letter Spacing, Transform */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                
                {/* Font Weight */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Weight</label>
                  <select
                    value={branding.fontWeight}
                    onChange={(e) => updateBrandingState({ fontWeight: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:outline-none"
                  >
                    <option value="500">Medium (500)</option>
                    <option value="600">Semi-Bold (600)</option>
                    <option value="700">Bold (700)</option>
                    <option value="800">Extra-Bold (800)</option>
                    <option value="900">Black Heavy (900)</option>
                  </select>
                </div>

                {/* Letter Spacing */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Letter Spacing</label>
                  <select
                    value={branding.letterSpacing}
                    onChange={(e) => updateBrandingState({ letterSpacing: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:outline-none"
                  >
                    <option value="-0.04em">Ultra-Tight (-0.04em)</option>
                    <option value="-0.02em">Tight (-0.02em)</option>
                    <option value="0em">Normal (0em)</option>
                    <option value="0.04em">Wide (+0.04em)</option>
                    <option value="0.08em">Ultra-Wide (+0.08em)</option>
                  </select>
                </div>

                {/* Text Transform */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Case Transform</label>
                  <select
                    value={branding.textTransform}
                    onChange={(e) => updateBrandingState({ textTransform: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl bg-slate-50/60 focus:bg-white focus:outline-none"
                  >
                    <option value="uppercase">UPPERCASE</option>
                    <option value="capitalize">Capitalize Each</option>
                    <option value="none">As Typed (None)</option>
                  </select>
                </div>

              </div>

              {/* DEFAULT ICON BOX TOGGLE */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl">
                <div>
                  <div className="text-xs font-bold text-slate-800">Show Brand Icon Box</div>
                  <div className="text-[11px] text-slate-500">
                    Displays the rounded orange icon badge with first initial when custom logo is not used.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={branding.showDefaultIconBox}
                  onChange={(e) => updateBrandingState({ showDefaultIconBox: e.target.checked })}
                  className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                />
              </div>

            </div>

          </div>

          {/* RIGHT 5 COLS: LIVE MULTI-SURFACE PREVIEW */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-600" />
                    Live Storefront Preview
                  </h3>
                  <p className="text-[11px] text-slate-500">Real-time reactive multi-surface preview</p>
                </div>

                {/* Viewport toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
                  <button
                    onClick={() => setPreviewViewport('desktop')}
                    className={`p-1.5 rounded-md transition-all ${
                      previewViewport === 'desktop' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                    title="Desktop Preview"
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setPreviewViewport('mobile')}
                    className={`p-1.5 rounded-md transition-all ${
                      previewViewport === 'mobile' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                    }`}
                    title="Mobile Preview"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 1. BROWSER TAB MOCKUP */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Browser Tab & Favicon
                </span>
                <div className="bg-slate-200/70 p-2 rounded-xl">
                  <div className="bg-white rounded-lg px-3 py-1.5 flex items-center gap-2 max-w-[240px] shadow-2xs border border-slate-200">
                    {branding.faviconUrl ? (
                      <img src={branding.faviconUrl} alt="Favicon" className="w-4 h-4 object-contain" />
                    ) : (
                      <div className="w-4 h-4 rounded bg-[#FF5A00] flex items-center justify-center text-white font-black text-[9px]">
                        M
                      </div>
                    )}
                    <span className="text-xs font-semibold text-slate-800 truncate">
                      {branding.siteName} — Digital Products
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. HEADER NAVBAR MOCKUP */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Storefront Header Navbar
                </span>
                <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    {/* Brand Logo rendering */}
                    <OmyraMallLogo size={previewViewport === 'desktop' ? 'md' : 'sm'} />

                    {/* Fake action buttons */}
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-700 hidden sm:inline">Login</span>
                      <span className="px-3 py-1 rounded-lg bg-[#FF5A00] text-white text-[11px] font-bold shadow-2xs">
                        Sign Up
                      </span>
                    </div>
                  </div>

                  {/* Search Bar mockup */}
                  <div className="h-8 rounded-lg bg-slate-50 border border-slate-200/70 px-3 flex items-center text-xs text-slate-400">
                    Search products, brands and more...
                  </div>
                </div>
              </div>

              {/* 3. FOOTER BRAND COLUMN MOCKUP */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Footer Brand Column
                </span>
                <div className="border border-slate-200 rounded-xl bg-white p-4 shadow-sm space-y-3">
                  {branding.footerLogoUrl ? (
                    <img src={branding.footerLogoUrl} alt="Footer Logo" className="h-9 w-auto object-contain" />
                  ) : (
                    <OmyraMallLogo size="sm" />
                  )}
                  <div className="text-xs font-bold text-[#0B2046]">
                    {branding.showTagline && branding.tagline ? branding.tagline : 'Digital Products Marketplace'}
                  </div>
                  <div className="text-[11px] text-[#58769F] leading-relaxed">
                    Discover premium digital products, software, templates, plugins and more.
                  </div>
                </div>
              </div>

              {/* Quick Save Callout */}
              <div className="pt-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-[#FF5A00] rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving to Database...' : 'Apply & Save to Live Storefront'}</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HERO & PROMOTIONAL BANNERS SUB-TAB                                      */}
      {/* ========================================================================= */}
      {activeSubTab === 'hero' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-orange-600" />
              Hero & Promotional Banners Configuration
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Fine-tune the hero typography, trust badges, category shortcuts, and promotional CTA cards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                Hero Headline & Underline
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                The hero section uses a dual-tone punchy typography with hand-crafted brush swoosh accent on "Grow Your Creativity!".
              </p>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800">
                Get the Best Digital Products and <span className="text-orange-600 underline decoration-orange-400">Grow Your Creativity!</span>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-3">
              <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                Footer 2-Column Banner
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Configured with 2-column layout: left branding pill, headline, paragraph, explore button, and benefit items, with realistic 3D laptop banner mockup in card background.
              </p>
              <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-600 font-medium">
                Active & Rendered across all Desktop, Tablet, and Mobile devices.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. SECTIONS & LAYOUT CONTROLS SUB-TAB                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'sections' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-600" />
              Homepage Catalog Sections & Grid Visibility
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Control the presentation order and display cards for Featured Products, Trending Deals, and Categories.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Top Category Quick-Pills', desc: 'Displays UI Templates, SaaS Boilerplates, Motion Assets, 3D Models', active: true },
              { title: 'Hero Visual Category Cards', desc: 'Six colorful interactive cards positioned beneath hero banner', active: true },
              { title: 'Featured Products Shelf', desc: 'Displays hand-curated top-rated digital assets with verified licensing', active: true },
              { title: 'Trending Software & Themes', desc: 'Displays algorithmic top-selling developer resources', active: true },
              { title: 'New Releases & Fresh Assets', desc: 'Chronological catalog stream with instant ZIP download support', active: true },
            ].map((section, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div>
                  <div className="text-xs font-bold text-slate-900">{section.title}</div>
                  <div className="text-[11px] text-slate-500">{section.desc}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Active in Storefront
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
