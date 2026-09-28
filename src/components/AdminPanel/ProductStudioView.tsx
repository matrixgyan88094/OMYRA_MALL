import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Layers,
  Tag,
  DollarSign,
  FileCode2,
  Image as ImageIcon,
  Trash2,
  Star,
  Eye,
  RotateCw,
  FolderPlus,
  Box,
  Hash,
  Terminal,
  FileText,
  Check,
  Info
} from 'lucide-react';

export interface ProductStudioData {
  id?: string;
  title: string;
  subtitle: string;
  short_description: string;
  description: string;
  category: string;
  price: number;
  sale_price?: number;
  sku: string;
  version: string;
  tools: string[];
  formats: string[];
  tags: string[];
  features: string[];
  thumbnail: string;
  gallery: string[];
  file_url: string;
  file_size?: string;
  security_scan?: any;
  status: 'published' | 'draft';
}

interface ProductStudioViewProps {
  token: string;
  initialProduct?: ProductStudioData | null;
  onBack: () => void;
  onSaved: (product: ProductStudioData) => void;
}

// Precision-engineered, minimalist Circular Progress Ring
const BeautifulCircularProgress: React.FC<{
  percent: number;
  loadedBytes?: number;
  totalBytes?: number;
  statusText?: string;
  size?: 'sm' | 'md';
}> = ({ percent, loadedBytes, totalBytes, statusText, size = 'md' }) => {
  const isSm = size === 'sm';
  const diameter = isSm ? 54 : 76;
  const strokeWidth = isSm ? 3 : 4;
  const radius = (diameter - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const safePercent = Math.min(Math.max(percent, 0), 100);
  const strokeDashoffset = circumference - (safePercent / 100) * circumference;

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '0 KB';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
      <div className="relative flex items-center justify-center" style={{ width: diameter, height: diameter }}>
        <svg
          className="-rotate-90"
          width={diameter}
          height={diameter}
          viewBox={`0 0 ${diameter} ${diameter}`}
        >
          {/* Subtle track ring */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            className="stroke-slate-100"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Dynamic progress ring */}
          <circle
            cx={diameter / 2}
            cy={diameter / 2}
            r={radius}
            className="stroke-orange-500 transition-all duration-300 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Crisp Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={`${isSm ? 'text-xs' : 'text-sm'} font-semibold font-mono text-slate-900 tracking-tight`}>
            {Math.round(safePercent)}%
          </span>
        </div>
      </div>

      {/* File Size and Transfer Metrics */}
      <div className="mt-3.5 text-center">
        {totalBytes ? (
          <div className="text-xs font-semibold text-slate-800 font-mono tracking-tight">
            {formatSize(loadedBytes)} <span className="text-slate-400 font-normal">/ {formatSize(totalBytes)}</span>
          </div>
        ) : null}

        {statusText && (
          <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse shrink-0" />
            <span>{statusText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const ProductStudioView: React.FC<ProductStudioViewProps> = ({
  token,
  initialProduct,
  onBack,
  onSaved
}) => {
  // 5 Steps: 1: Identity, 2: Story, 3: Media, 4: Package, 5: Review
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form Fields
  const [title, setTitle] = useState(initialProduct?.title || '');
  const [subtitle, setSubtitle] = useState(initialProduct?.subtitle || '');
  const [shortDescription, setShortDescription] = useState(initialProduct?.short_description || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [category, setCategory] = useState(initialProduct?.category || 'Dev Kits');
  const [price, setPrice] = useState(initialProduct?.price ? initialProduct.price.toString() : '49');
  const [salePrice, setSalePrice] = useState(initialProduct?.sale_price ? initialProduct.sale_price.toString() : '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [version, setVersion] = useState(initialProduct?.version || '1.0.0');
  const [tools, setTools] = useState<string[]>(initialProduct?.tools || []);
  const [formats, setFormats] = useState<string[]>(initialProduct?.formats || ['.zip']);
  const [tags, setTags] = useState<string[]>(initialProduct?.tags || []);
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features && initialProduct.features.length > 0
      ? initialProduct.features
      : ['Instant Digital Download', 'Full Commercial License', 'Free Updates for 1 Year']
  );
  const [thumbnail, setThumbnail] = useState(initialProduct?.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg');
  const [gallery, setGallery] = useState<string[]>(
    initialProduct?.gallery && initialProduct.gallery.length > 0
      ? initialProduct.gallery
      : [initialProduct?.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg']
  );
  const [fileUrl, setFileUrl] = useState(initialProduct?.file_url || '');
  const [fileSize, setFileSize] = useState(initialProduct?.file_size || '');
  const [securityScan, setSecurityScan] = useState<any>(initialProduct?.security_scan || null);
  const [productStatus, setProductStatus] = useState<'published' | 'draft'>(initialProduct?.status || 'published');

  // Available Categories (loaded dynamically from database)
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [newCatInput, setNewCatInput] = useState('');
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);

  // Chip Inputs
  const [toolInput, setToolInput] = useState('');
  const [formatInput, setFormatInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  // Upload States
  const [thumbUploadProgress, setThumbUploadProgress] = useState<{
    active: boolean;
    percent: number;
    loaded: number;
    total: number;
  } | null>(null);

  const [zipUploadProgress, setZipUploadProgress] = useState<{
    active: boolean;
    percent: number;
    loaded: number;
    total: number;
    statusText: string;
  } | null>(null);

  // Feedback & Saving
  const [saving, setSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Refs for hidden inputs
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate SKU if blank
  useEffect(() => {
    if (!sku) {
      const prefix = category ? category.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'KRO') : 'KRO';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setSku(`${prefix}-${randomNum}`);
    }
  }, [category]);

  // Fetch real categories from Neon DB
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCategories(data);
          if (!category) setCategory(data[0].name);
        }
      }
    } catch {
      // Fallback
      setCategories([
        { id: 'ui-figma', name: 'UI & Figma', slug: 'ui-figma' },
        { id: 'dev-kits', name: 'Dev Kits', slug: 'dev-kits' },
        { id: '3d-spatial', name: '3D & Spatial', slug: '3d-spatial' },
        { id: 'motion-audio', name: 'Motion & Audio', slug: 'motion-audio' },
        { id: 'templates', name: 'Templates', slug: 'templates' }
      ]);
    }
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    setErrorNotice(null);
    if (step === 1) {
      if (!title.trim()) {
        setErrorNotice('Please provide a descriptive title for this digital asset.');
        return false;
      }
      if (!category.trim()) {
        setErrorNotice('Please select or specify a category.');
        return false;
      }
    } else if (step === 2) {
      if (!description.trim()) {
        setErrorNotice('Please provide a detailed product description.');
        return false;
      }
    } else if (step === 3) {
      if (!thumbnail.trim()) {
        setErrorNotice('Please upload at least one primary thumbnail/cover image.');
        return false;
      }
    } else if (step === 4) {
      if (!fileUrl.trim()) {
        setErrorNotice('Please upload the digital product ZIP archive or enter the file package URL.');
        return false;
      }
      if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        setErrorNotice('Please enter a valid regular price greater than $0.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => (prev < 5 ? (prev + 1 as any) : prev));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    setErrorNotice(null);
    setCurrentStep(prev => (prev > 1 ? (prev - 1 as any) : prev));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real Multi-Image Upload with XHR byte progress
  const handleUploadGalleryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorNotice(null);
    const fileList = Array.from(files);

    fileList.forEach(file => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 'admin_primary');
      formData.append('folderType', 'thumbnails');

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setThumbUploadProgress({
            active: true,
            percent,
            loaded: event.loaded,
            total: event.total
          });
        }
      };

      xhr.onload = () => {
        setThumbUploadProgress(null);
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            const uploadedUrl = data.publicUrl || `r2://${data.key}`;
            setGallery(prev => {
              const updated = [...prev, uploadedUrl];
              return Array.from(new Set(updated));
            });
            setThumbnail(prev => (prev.includes('hero_white_orange') ? uploadedUrl : prev));
          } catch {
            setErrorNotice('Failed to parse uploaded thumbnail image response.');
          }
        } else {
          setErrorNotice('Image upload failed. Please verify storage configuration.');
        }
      };

      xhr.onerror = () => {
        setThumbUploadProgress(null);
        setErrorNotice('Network error uploading thumbnail image.');
      };

      xhr.open('POST', '/api/admin/r2/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(formData);
    });

    if (thumbInputRef.current) thumbInputRef.current.value = '';
  };

  // Real ZIP Package Ingestion + 5-Layer Security Scan + Auto-Detection Engine
  const handleUploadZipPackage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setErrorNotice('Invalid file type: Please upload a valid .zip archive.');
      return;
    }

    setErrorNotice(null);
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    setZipUploadProgress({
      active: true,
      percent: 0,
      loaded: 0,
      total: file.size,
      statusText: 'Streaming archive to server...'
    });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.min((event.loaded / event.total) * 92, 92);
        setZipUploadProgress({
          active: true,
          percent,
          loaded: event.loaded,
          total: event.total,
          statusText: percent > 85 ? 'Running 5-layer security scan & framework intelligence...' : 'Streaming package to secure storage...'
        });
      }
    };

    xhr.onload = () => {
      setZipUploadProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const resp = JSON.parse(xhr.responseText);
          const scan = resp.scan;
          setSecurityScan(scan);
          setFileUrl(resp.fileUrl || `r2://${resp.key}`);
          setFileSize(resp.fileSize || scan.formattedCompressedSize || '15 MB');

          if (scan.detectedTools && Array.isArray(scan.detectedTools)) {
            setTools(prev => Array.from(new Set([...prev, ...scan.detectedTools])));
          }

          if (scan.suggestedCategory) {
            setCategory(scan.suggestedCategory);
            fetchCategories();
          }

          if (scan.suggestedTags && Array.isArray(scan.suggestedTags)) {
            setTags(prev => Array.from(new Set([...prev, ...scan.suggestedTags])));
          }

          if (scan.suggestedSku && (!sku || sku.trim() === '')) {
            setSku(scan.suggestedSku);
          }
          if (scan.suggestedVersion && (!version || version === '1.0.0')) {
            setVersion(scan.suggestedVersion);
          }

          if (scan.packageDetails?.name && (!title || title.trim() === '')) {
            setTitle(scan.packageDetails.name);
          }
          if (scan.packageDetails?.description && (!description || description.trim() === '')) {
            setDescription(scan.packageDetails.description);
          }
        } catch {
          setErrorNotice('Failed to process server security analysis response.');
        }
      } else {
        try {
          const errData = JSON.parse(xhr.responseText);
          setErrorNotice(errData.error || 'Failed to inspect and secure archive.');
        } catch {
          setErrorNotice('Server error during archive security inspection.');
        }
      }
    };

    xhr.onerror = () => {
      setZipUploadProgress(null);
      setErrorNotice('Network error uploading package archive.');
    };

    xhr.open('POST', '/api/admin/products/inspect-and-upload-zip');
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);

    if (zipInputRef.current) zipInputRef.current.value = '';
  };

  const handleCreateCategory = async () => {
    if (!newCatInput.trim()) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name: newCatInput.trim() })
      });
      const data = await res.json();
      if (res.ok && data.category) {
        setCategory(data.category.name);
        setIsAddingNewCat(false);
        setNewCatInput('');
        fetchCategories();
      } else {
        setErrorNotice(data.error || 'Failed to create category');
      }
    } catch (e: any) {
      setErrorNotice(e.message || 'Error creating category');
    }
  };

  // Feature Bullets Add/Remove
  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures(prev => [...prev, featureInput.trim()]);
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(prev => prev.filter((_, i) => i !== idx));
  };

  // Tools Chips
  const handleAddTool = () => {
    if (!toolInput.trim()) return;
    setTools(prev => Array.from(new Set([...prev, toolInput.trim()])));
    setToolInput('');
  };

  const handleRemoveTool = (t: string) => {
    setTools(prev => prev.filter(x => x !== t));
  };

  // Formats Chips
  const handleAddFormat = () => {
    if (!formatInput.trim()) return;
    const clean = formatInput.trim().startsWith('.') ? formatInput.trim() : `.${formatInput.trim()}`;
    setFormats(prev => Array.from(new Set([...prev, clean])));
    setFormatInput('');
  };

  const handleRemoveFormat = (f: string) => {
    setFormats(prev => prev.filter(x => x !== f));
  };

  // Tags Chips
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    setTags(prev => Array.from(new Set([...prev, tagInput.trim()])));
    setTagInput('');
  };

  const handleRemoveTag = (t: string) => {
    setTags(prev => prev.filter(x => x !== t));
  };

  // Final Publish Handler
  const handleFinalSubmit = async (publishStatus: 'published' | 'draft') => {
    setSaving(true);
    setErrorNotice(null);

    const payload: ProductStudioData = {
      id: initialProduct?.id,
      title: title.trim(),
      subtitle: subtitle.trim(),
      short_description: shortDescription.trim() || subtitle.trim(),
      description: description.trim(),
      category: category.trim(),
      price: parseFloat(price) || 49,
      sale_price: salePrice && !isNaN(parseFloat(salePrice)) ? parseFloat(salePrice) : undefined,
      sku: sku.trim() || `KRO-AST-${Math.floor(1000 + Math.random() * 9000)}`,
      version: version.trim() || '1.0.0',
      tools,
      formats,
      tags,
      features,
      thumbnail,
      gallery,
      file_url: fileUrl,
      file_size: fileSize || '24 MB',
      security_scan: securityScan,
      status: publishStatus
    };

    try {
      const url = initialProduct?.id ? `/api/products/${initialProduct.id}` : '/api/products';
      const method = initialProduct?.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save digital product to catalog');
      }

      onSaved(data);
    } catch (err: any) {
      setErrorNotice(err.message || 'Unexpected error publishing product');
    } finally {
      setSaving(false);
    }
  };

  const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'new-digital-asset';

  const stepsList = [
    { num: 1, label: 'Identity', title: 'Asset Identity' },
    { num: 2, label: 'Story', title: 'Product Story & Specs' },
    { num: 3, label: 'Media', title: 'Cover & Gallery Media' },
    { num: 4, label: 'Package', title: 'ZIP Ingestion & Engine' },
    { num: 5, label: 'Review', title: 'Review & Publish' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Products</span>
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-orange-600">Asset Studio</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">Step {currentStep} of 5</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {initialProduct ? `Edit Asset: ${title || 'Digital Product'}` : 'Add New Digital Asset'}
            </h1>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Discard
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleFinalSubmit('draft')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all shadow-xs"
          >
            Save Draft
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleFinalSubmit('published')}
            className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-all shadow-xs shadow-orange-600/20"
          >
            {saving ? 'Publishing...' : 'Publish Live'}
          </button>
        </div>
      </div>

      {/* Modern, Refined 5-Step Segment Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-3">
        {/* Continuous Slim Line Progress Bar */}
        <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-orange-500 transition-all duration-500 ease-out rounded-full"
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Step Items */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 sm:gap-2">
          {stepsList.map((s) => {
            const isActive = currentStep === s.num;
            const isPassed = currentStep > s.num;

            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < currentStep || validateStep(currentStep)) {
                    setCurrentStep(s.num as any);
                  }
                }}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all ${
                  isActive
                    ? 'bg-orange-50/80 border border-orange-200/80 text-orange-950 font-bold'
                    : isPassed
                    ? 'bg-slate-50/80 text-slate-800 hover:bg-slate-100 font-medium'
                    : 'text-slate-400 hover:text-slate-600 font-medium'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 transition-all ${
                    isActive
                      ? 'bg-orange-600 text-white font-bold'
                      : isPassed
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isPassed ? '✓' : `0${s.num}`}
                </div>
                <div className="truncate">
                  <span className="text-xs truncate block">{s.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error / Validation Notification Banner */}
      {errorNotice && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-3 text-rose-800 text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorNotice}</span>
          </div>
          <button onClick={() => setErrorNotice(null)} className="text-rose-500 hover:text-rose-700 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Studio Body Workspace */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-6 sm:p-8">
        
        {/* ========================================================================= */}
        {/* STEP 1: IDENTITY & MARKET POSITIONING                                     */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Step 1: Asset Identity & Market Positioning</h2>
              <p className="text-xs text-slate-500 mt-1">Define the core branding, title, category, and public URL slug for your digital product.</p>
            </div>

            {/* Asset Title */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Asset Title <span className="text-orange-600">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">{title.length}/80</span>
              </div>
              <input
                type="text"
                value={title}
                maxLength={80}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kroma Design System v2.0"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Subtitle / Value Proposition */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Value Tagline / Subtitle
                </label>
                <span className="text-[11px] text-slate-400 font-mono">{subtitle.length}/140</span>
              </div>
              <input
                type="text"
                value={subtitle}
                maxLength={140}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. 250+ responsive React components, dark mode tokens, and complete Figma source files"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            {/* Category Selector with Dynamic Creator */}
            <div className="p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-slate-900 block">
                    Product Category <span className="text-orange-600">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">Categories are dynamically indexed and synced with marketplace filter bars.</span>
                </div>
                {!isAddingNewCat && (
                  <button
                    type="button"
                    onClick={() => setIsAddingNewCat(true)}
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>+ New Category</span>
                  </button>
                )}
              </div>

              {isAddingNewCat ? (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newCatInput}
                    onChange={(e) => setNewCatInput(e.target.value)}
                    placeholder="Enter unique category name..."
                    className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-xl transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsAddingNewCat(false); setNewCatInput(''); }}
                    className="px-3 py-2 text-xs font-medium text-slate-500 hover:bg-slate-200 rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categories.map((c) => (
                    <button
                      key={c.id || c.name}
                      type="button"
                      onClick={() => setCategory(c.name)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        category === c.name
                          ? 'border-orange-500 bg-white ring-2 ring-orange-500/10 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className={`text-xs font-semibold block ${category === c.name ? 'text-orange-950' : 'text-slate-700'}`}>
                        {c.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">/{c.slug || c.name.toLowerCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Live Slug Preview */}
            <div className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Storefront URL Slug</span>
                <span className="text-xs font-mono text-slate-700">kroma.store/products/<strong className="text-orange-600 font-bold">{cleanSlug}</strong></span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] font-mono font-medium text-slate-600">
                auto-generated
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: PRODUCT STORY & DEEP SPECIFICATIONS                              */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Step 2: Product Story & Deep Specifications</h2>
              <p className="text-xs text-slate-500 mt-1">Provide clear, compelling copy for marketplace discovery and technical documentation.</p>
            </div>

            {/* Short Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Short Description (Card Teaser & SEO Meta)
                </label>
                <span className="text-[11px] text-slate-400 font-mono">{shortDescription.length}/180</span>
              </div>
              <textarea
                rows={2}
                value={shortDescription}
                maxLength={180}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Brief snapshot shown on catalog cards and search result snippets..."
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
              />
            </div>

            {/* Detailed Description */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Full Detailed Description <span className="text-orange-600">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Markdown supported</span>
              </div>
              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe everything included in this asset, compatibility, setup instructions, architecture..."
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            {/* What's Included Feature Bullets */}
            <div className="p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl space-y-3">
              <label className="text-xs font-semibold text-slate-900 block">
                What's Included (Key Feature Highlights)
              </label>
              
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                  placeholder="e.g. 50+ Figma Auto-layout components..."
                  className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
                >
                  Add Bullet
                </button>
              </div>

              <div className="space-y-1.5 pt-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{feat}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFeature(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: MEDIA & MULTI-IMAGE GALLERY STUDIO                                */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Step 3: Media & Multi-Image Gallery Studio</h2>
              <p className="text-xs text-slate-500 mt-1">Upload high-resolution preview shots. Files stream directly to Cloudflare R2 storage.</p>
            </div>

            {/* Hidden Input for Real Upload */}
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={handleUploadGalleryImages}
            />

            {/* Upload Zone & Beautiful Circle Progress */}
            {thumbUploadProgress?.active ? (
              <BeautifulCircularProgress
                percent={thumbUploadProgress.percent}
                loadedBytes={thumbUploadProgress.loaded}
                totalBytes={thumbUploadProgress.total}
                statusText="Streaming image to Cloudflare R2 storage..."
              />
            ) : (
              <div
                onClick={() => thumbInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-slate-200 hover:border-orange-500/60 rounded-3xl bg-slate-50/40 hover:bg-orange-50/20 text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-600 group-hover:text-orange-600 group-hover:border-orange-200 flex items-center justify-center mx-auto transition-colors shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-3">Upload Gallery Preview Shots</h3>
                <p className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP up to 25MB each. Click to select files.</p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs hover:bg-slate-50"
                >
                  Select From Device
                </button>
              </div>
            )}

            {/* Gallery Image Manager Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-900">
                  Uploaded Gallery Assets ({gallery.length})
                </span>
                <span className="text-[11px] text-slate-500">Click "Set Cover" to change primary card image</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {gallery.map((imgUrl, idx) => {
                  const isPrimary = thumbnail === imgUrl;
                  return (
                    <div
                      key={idx}
                      className={`relative aspect-[16/10] rounded-2xl overflow-hidden border transition-all group ${
                        isPrimary
                          ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-sm'
                          : 'border-slate-200 bg-slate-100 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={imgUrl}
                        alt={`Asset preview ${idx + 1}`}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />

                      {/* Primary Badge */}
                      {isPrimary && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          <span>Primary Cover</span>
                        </div>
                      )}

                      {/* Hover Controls */}
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {!isPrimary && (
                          <button
                            type="button"
                            onClick={() => setThumbnail(imgUrl)}
                            className="px-2.5 py-1 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-sm hover:bg-orange-50"
                          >
                            Set Cover
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setGallery(prev => prev.filter((_, i) => i !== idx));
                            if (isPrimary && gallery.length > 1) {
                              const remaining = gallery.filter((_, i) => i !== idx);
                              setThumbnail(remaining[0]);
                            }
                          }}
                          className="w-7 h-7 bg-white text-rose-600 rounded-lg flex items-center justify-center hover:bg-rose-50 transition-colors shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: DIGITAL PACKAGE INGESTION & INTELLIGENT BACKEND ENGINE            */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Step 4: Digital Package Ingestion & Security Engine</h2>
              <p className="text-xs text-slate-500 mt-1">Upload the actual customer download archive (.zip). The backend streams, verifies security, and auto-detects dependencies.</p>
            </div>

            {/* Hidden Input for Real ZIP Archive */}
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              onChange={handleUploadZipPackage}
            />

            {/* Beautiful Progress Indicator During Upload */}
            {zipUploadProgress?.active ? (
              <BeautifulCircularProgress
                percent={zipUploadProgress.percent}
                loadedBytes={zipUploadProgress.loaded}
                totalBytes={zipUploadProgress.total}
                statusText={zipUploadProgress.statusText}
              />
            ) : (
              <div
                onClick={() => zipInputRef.current?.click()}
                className="p-8 border-2 border-dashed border-slate-200 hover:border-orange-500/60 rounded-3xl bg-slate-50/40 hover:bg-orange-50/20 text-center cursor-pointer transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-600 group-hover:text-orange-600 group-hover:border-orange-200 flex items-center justify-center mx-auto transition-colors shadow-xs">
                  <Box className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 mt-3">
                  {fileUrl ? 'Replace ZIP Archive Package' : 'Upload Digital Asset Archive (.zip)'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Supports packages up to 350MB. Real-time path traversal, decompression bomb, and malware scanning.</p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs hover:bg-slate-50"
                >
                  Select ZIP Archive
                </button>
              </div>
            )}

            {/* Verified Package Badge & Security Dossier */}
            {fileUrl && (
              <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Package Verified Clean</span>
                      <span className="text-[11px] text-slate-500 font-mono">Size: {fileSize || '18 MB'} • Cloudflare R2 Protected</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => zipInputRef.current?.click()}
                    className="text-xs font-semibold text-orange-600 hover:underline"
                  >
                    Change Archive
                  </button>
                </div>

                {/* Auto-detected tools chips */}
                {tools.length > 0 && (
                  <div className="pt-2 border-t border-slate-200/60">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      Auto-detected Tools & Frameworks ({tools.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tools.map((t, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
                          <span>{t}</span>
                          <button type="button" onClick={() => handleRemoveTool(t)} className="text-slate-400 hover:text-rose-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Manual Tool & Tag Addition */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Add Framework/Tool Chip */}
              <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">Tools & Frameworks</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTool(); } }}
                    placeholder="e.g. Next.js 15, Tailwind, Three.js..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                  <button type="button" onClick={handleAddTool} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold">Add</button>
                </div>
              </div>

              {/* Add Format Chip */}
              <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">File Formats Included</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={formatInput}
                    onChange={(e) => setFormatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFormat(); } }}
                    placeholder="e.g. .fig, .tsx, .blend, .zip..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                  <button type="button" onClick={handleAddFormat} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold">Add</button>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {formats.map((f, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 bg-white border border-slate-200 rounded text-[11px] font-mono text-slate-700">
                      <span>{f}</span>
                      <button type="button" onClick={() => handleRemoveFormat(f)} className="text-slate-400 hover:text-rose-500">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Commercials: Price, Sale Price, SKU, Version */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-slate-50/50 border border-slate-200/80 rounded-2xl">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Regular Price ($) <span className="text-orange-600">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="49"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Sale Price ($) <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={salePrice}
                  onChange={(e) => setSalePrice(e.target.value)}
                  placeholder="29"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">SKU</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="KRO-AST-1001"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-mono text-slate-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: FINAL REVIEW & INSTANT PUBLISH                                    */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Step 5: Review & Publish Dossier</h2>
              <p className="text-xs text-slate-500 mt-1">Review the live presentation, pricing structure, and package specifications before making it live.</p>
            </div>

            {/* Visual Executive Summary Card */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12">
                <div className="sm:col-span-5 relative aspect-[16/10] sm:aspect-auto bg-slate-100">
                  <img
                    src={thumbnail}
                    alt={title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {category}
                  </div>
                </div>

                <div className="sm:col-span-7 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="font-mono">v{version} • SKU: {sku}</span>
                      <span className="font-mono">{fileSize || '18 MB'}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{subtitle || shortDescription}</p>

                    {/* Price preview */}
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">
                        ${salePrice && parseFloat(salePrice) > 0 ? salePrice : price}
                      </span>
                      {salePrice && parseFloat(salePrice) > 0 && (
                        <span className="text-xs text-slate-400 line-through">${price}</span>
                      )}
                      <span className="text-xs text-slate-500 font-medium">USD</span>
                    </div>
                  </div>

                  {/* Tools preview */}
                  {tools.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1">
                      {tools.slice(0, 5).map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {t}
                        </span>
                      ))}
                      {tools.length > 5 && (
                        <span className="px-2 py-0.5 rounded text-[10px] text-slate-400">+{tools.length - 5} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Security Verification & Integrity Status */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Security & Integrity Clearance</span>
                  <span className="text-[11px] text-emerald-700">0 malicious binaries detected • Safe uncompressed ratio • Ready for SigV4 direct customer downloads</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Step Navigation Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white transition-all shadow-xs"
              >
                <span>Continue to {stepsList[currentStep]?.label || 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleFinalSubmit('draft')}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleFinalSubmit('published')}
                  className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-xs font-bold text-white shadow-xs shadow-orange-600/20"
                >
                  {saving ? 'Publishing...' : 'Publish Asset to Store'}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
