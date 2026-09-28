import React, { useState, useEffect, useRef } from 'react';
import {
  X,
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
  EyeOff,
  RotateCw,
  FolderPlus,
  Box,
  Hash,
  Terminal,
  FileText
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

interface ProductStudioModalProps {
  isOpen: boolean;
  token: string;
  initialProduct?: ProductStudioData | null;
  onClose: () => void;
  onSaved: (product: ProductStudioData) => void;
}

// Dedicated Circle Progress Component showing real upload percentage and exact byte transfer
const CircularProgress: React.FC<{
  percent: number;
  loadedBytes?: number;
  totalBytes?: number;
  statusText?: string;
}> = ({ percent, loadedBytes, totalBytes, statusText }) => {
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(Math.max(percent, 0), 100) / 100) * circumference;

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return '0 KB';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-2xl">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-slate-200"
            strokeWidth="6"
            fill="transparent"
          />
          <circle
            cx="48"
            cy="48"
            r={radius}
            className="stroke-orange-600 transition-all duration-300 ease-out"
            strokeWidth="6"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-base font-bold text-slate-900 tracking-tight">{Math.round(percent)}%</span>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">upload</span>
        </div>
      </div>
      {totalBytes ? (
        <div className="mt-3 text-xs font-semibold text-slate-700">
          {formatSize(loadedBytes)} <span className="text-slate-400 font-normal">/ {formatSize(totalBytes)}</span>
        </div>
      ) : null}
      {statusText && <p className="mt-1.5 text-[11px] text-slate-500 text-center max-w-xs">{statusText}</p>}
    </div>
  );
};

export const ProductStudioModal: React.FC<ProductStudioModalProps> = ({
  isOpen,
  token,
  initialProduct,
  onClose,
  onSaved,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string }>>([]);
  const [isAddingNewCat, setIsAddingNewCat] = useState(false);
  const [newCatInput, setNewCatInput] = useState('');

  // Step 1: Identity
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  // Step 2: Story
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['Master Source Files Included', 'Commercial License Rights', 'Lifetime Version Updates']);
  const [featureInput, setFeatureInput] = useState('');

  // Step 3: Gallery
  const [thumbnail, setThumbnail] = useState('/src/assets/images/hero_white_orange_1790435384152.jpg');
  const [gallery, setGallery] = useState<string[]>(['/src/assets/images/hero_white_orange_1790435384152.jpg']);
  const [thumbUploadProgress, setThumbUploadProgress] = useState<{ active: boolean; percent: number; loaded: number; total: number } | null>(null);

  // Step 4: Package & Commercials
  const [fileUrl, setFileUrl] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [category, setCategory] = useState('Dev Kits');
  const [sku, setSku] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [tools, setTools] = useState<string[]>([]);
  const [toolInput, setToolInput] = useState('');
  const [formats, setFormats] = useState<string[]>(['.zip']);
  const [formatInput, setFormatInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Fullstack', 'TypeScript', 'Clean Code']);
  const [tagInput, setTagInput] = useState('');
  const [price, setPrice] = useState('49');
  const [salePrice, setSalePrice] = useState('');
  const [securityScan, setSecurityScan] = useState<any>(null);
  const [zipUploadProgress, setZipUploadProgress] = useState<{ active: boolean; percent: number; loaded: number; total: number; statusText: string } | null>(null);

  // General & Submission
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [saving, setSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  const thumbInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Load categories
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
        }
      }
    } catch {
      // fallback
    }
  };

  // Populate data when modal opens
  useEffect(() => {
    if (initialProduct) {
      setTitle(initialProduct.title || '');
      setSubtitle(initialProduct.subtitle || '');
      setShortDescription(initialProduct.short_description || '');
      setDescription(initialProduct.description || '');
      setCategory(initialProduct.category || 'Dev Kits');
      setPrice(String(initialProduct.price || 49));
      setSalePrice(initialProduct.sale_price !== undefined ? String(initialProduct.sale_price) : '');
      setSku(initialProduct.sku || `KRO-AST-${Math.floor(1000 + Math.random() * 9000)}`);
      setVersion(initialProduct.version || '1.0.0');
      setTools(Array.isArray(initialProduct.tools) ? initialProduct.tools : []);
      setFormats(Array.isArray(initialProduct.formats) ? initialProduct.formats : ['.zip']);
      setTags(Array.isArray(initialProduct.tags) ? initialProduct.tags : []);
      setFeatures(Array.isArray(initialProduct.features) && initialProduct.features.length > 0
        ? initialProduct.features
        : ['Master Source Files Included', 'Commercial License Rights', 'Lifetime Version Updates']
      );
      setThumbnail(initialProduct.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg');
      setGallery(Array.isArray(initialProduct.gallery) && initialProduct.gallery.length > 0
        ? initialProduct.gallery
        : [initialProduct.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg']
      );
      setFileUrl(initialProduct.file_url || '');
      setFileSize(initialProduct.file_size || '');
      setSecurityScan(initialProduct.security_scan || null);
      setStatus(initialProduct.status || 'published');
    } else {
      // New Asset Initialization
      setTitle('');
      setSubtitle('');
      setShortDescription('');
      setDescription('');
      setCategory('Dev Kits');
      setPrice('49');
      setSalePrice('');
      setSku(`KRO-DEV-${Math.floor(1000 + Math.random() * 9000)}`);
      setVersion('1.0.0');
      setTools(['React 19', 'Next.js 15', 'Tailwind CSS v4', 'TypeScript']);
      setFormats(['.tsx', '.ts', '.css', '.zip']);
      setTags(['React', 'Next.js', 'TypeScript', 'Clean Code']);
      setFeatures(['Production Tested Components', 'Clean Architectural Layout', 'Commercial Rights Included']);
      setThumbnail('/src/assets/images/hero_white_orange_1790435384152.jpg');
      setGallery(['/src/assets/images/hero_white_orange_1790435384152.jpg']);
      setFileUrl('');
      setFileSize('');
      setSecurityScan(null);
      setStatus('published');
    }
    setCurrentStep(1);
    setErrorNotice(null);
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

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
            // If first image or default placeholder, set as primary thumbnail
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
          const res = JSON.parse(xhr.responseText);
          const scan = res.scan;

          if (!scan.isSafe) {
            setErrorNotice(`Security Scan Failed: ${scan.threats.join(' • ')}`);
            setSecurityScan(scan);
            return;
          }

          // Populate package details
          setFileUrl(res.fileUrl);
          setFileSize(res.fileSize || scan.compressedSizeFormatted);
          setSecurityScan(scan);

          // Auto-populate detected tools
          if (Array.isArray(scan.detectedTools) && scan.detectedTools.length > 0) {
            setTools(prev => Array.from(new Set([...prev, ...scan.detectedTools])));
          }

          // Auto-populate detected formats
          if (Array.isArray(scan.detectedFormats) && scan.detectedFormats.length > 0) {
            setFormats(prev => Array.from(new Set([...prev, ...scan.detectedFormats])));
          }

          // Auto-populate detected tags
          if (Array.isArray(scan.detectedTags) && scan.detectedTags.length > 0) {
            setTags(prev => Array.from(new Set([...prev, ...scan.detectedTags])));
          }

          // Auto-populate category & update category dropdown list
          if (scan.detectedCategory) {
            setCategory(scan.detectedCategory);
            fetchCategories();
          }

          // Auto-suggest SKU & version
          if (scan.suggestedSku && !initialProduct) {
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

  // Gallery Controls
  const handleSetPrimaryThumbnail = (url: string) => {
    setThumbnail(url);
  };

  const handleRemoveGalleryImage = (url: string) => {
    setGallery(prev => prev.filter(u => u !== url));
    if (thumbnail === url) {
      const remaining = gallery.filter(u => u !== url);
      setThumbnail(remaining[0] || '/src/assets/images/hero_white_orange_1790435384152.jpg');
    }
  };

  // Validation before progressing
  const validateStep = (step: number): boolean => {
    setErrorNotice(null);
    if (step === 1) {
      if (!title.trim()) {
        setErrorNotice('Product Asset Title is required.');
        return false;
      }
    }
    if (step === 2) {
      if (!description.trim() && !shortDescription.trim()) {
        setErrorNotice('Please provide at least a short summary or detailed description.');
        return false;
      }
    }
    if (step === 4) {
      if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
        setErrorNotice('Please specify a valid product regular price.');
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => (prev < 5 ? (prev + 1 as any) : prev));
    }
  };

  const prevStep = () => {
    setErrorNotice(null);
    setCurrentStep(prev => (prev > 1 ? (prev - 1 as any) : prev));
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
      onClose();
    } catch (err: any) {
      setErrorNotice(err.message || 'Unexpected error publishing product');
    } finally {
      setSaving(false);
    }
  };

  const cleanSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'new-digital-asset';

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col my-auto max-h-[92vh]">
        
        {/* Studio Top Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Asset Studio</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500 font-mono">Step {currentStep} of 5</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5 tracking-tight">
              {initialProduct ? `Edit Asset: ${title || 'Digital Product'}` : 'Add New Digital Asset'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 5-Step Visual Stepper Bar */}
        <div className="px-6 py-3.5 border-b border-slate-100 bg-white">
          <div className="grid grid-cols-5 gap-2">
            {[
              { num: 1, label: 'Identity', desc: 'Title & Tagline' },
              { num: 2, label: 'Story', desc: 'Description' },
              { num: 3, label: 'Media', desc: 'Cover & Gallery' },
              { num: 4, label: 'Package', desc: 'ZIP & Frameworks' },
              { num: 5, label: 'Review', desc: 'Verify & Publish' },
            ].map((s) => {
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
                  className={`text-left p-2 rounded-xl border transition-all ${
                    isActive
                      ? 'border-orange-600/30 bg-orange-50/60 ring-2 ring-orange-500/10'
                      : isPassed
                      ? 'border-emerald-200/80 bg-emerald-50/30 hover:bg-slate-50'
                      : 'border-slate-100 bg-slate-50/40 text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        isActive
                          ? 'bg-orange-600 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? '✓' : s.num}
                    </span>
                    <span className={`text-xs font-semibold truncate ${isActive ? 'text-orange-950' : isPassed ? 'text-slate-800' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate hidden sm:block pl-5">
                    {s.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Notice alert */}
        {errorNotice && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
            <div className="leading-relaxed font-medium">{errorNotice}</div>
          </div>
        )}

        {/* Step Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800">
          {/* STEP 1: IDENTITY & VALUE TAGLINE */}
          {currentStep === 1 && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div>
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Step 1</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Asset Identity & Value Tagline</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Define the product title and customer proposition for the marketplace catalog.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Asset Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Next.js 15 Fullstack SaaS Starter with Neon DB"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm text-slate-900 font-medium"
                  />
                  <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-400">
                    <span>Keep titles concise, informative, and searchable.</span>
                    <span>{title.length} characters</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Subtitle / Value Tagline
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Production-ready design tokens and 250+ responsive React components"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-sm text-slate-900"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    A single clear sentence explaining what makes this asset valuable to engineers and designers.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                    Storefront URL Preview
                  </span>
                  <div className="font-mono text-xs text-slate-700 flex items-center gap-1.5">
                    <span className="text-slate-400">https://kroma.studio/products/</span>
                    <span className="text-orange-600 font-semibold">{cleanSlug}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PRODUCT STORY & DEEP SPECIFICATIONS */}
          {currentStep === 2 && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div>
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Step 2</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Product Story & Feature Highlights</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Detail what is included, architecture highlights, and licensing permissions.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Short Description (Catalog Cards & SEO)
                  </label>
                  <textarea
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief 1-2 sentence overview shown in category cards and social meta tags..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Detailed Long Description
                  </label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Comprehensive explanation of what is included, documentation links, prerequisites, and features..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs text-slate-900 leading-relaxed font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Key Feature Bullet Points
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddFeature();
                        }
                      }}
                      placeholder="e.g. 24+ Tactile Sound Design Assets"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
                    >
                      Add Bullet
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {features.map((feat, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="text-slate-800">{feat}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(idx)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: PRODUCT THUMBNAIL & MULTIPLE GALLERY STUDIO */}
          {currentStep === 3 && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div>
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Step 3</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Cover Art & Multiple Thumbnail Gallery</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload high-resolution screenshots and showcase images with live circular transfer tracking.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div>
                <input
                  type="file"
                  ref={thumbInputRef}
                  onChange={handleUploadGalleryImages}
                  accept="image/*"
                  multiple
                  className="hidden"
                />

                {thumbUploadProgress?.active ? (
                  <CircularProgress
                    percent={thumbUploadProgress.percent}
                    loadedBytes={thumbUploadProgress.loaded}
                    totalBytes={thumbUploadProgress.total}
                    statusText="Uploading visual assets to CDN storage..."
                  />
                ) : (
                  <div
                    onClick={() => thumbInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-orange-500 bg-slate-50/60 hover:bg-orange-50/20 rounded-2xl p-8 text-center cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-orange-600 group-hover:scale-105 transition-transform mb-3">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      Click or Drag Images to Upload
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports PNG, JPG, WEBP, SVG • Upload multiple screenshots at once
                    </p>
                  </div>
                )}
              </div>

              {/* Primary Cover Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Primary Cover Art (Marketplace Card)
                </label>
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video max-h-56 flex items-center justify-center">
                  <img
                    src={thumbnail}
                    alt="Primary Cover"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/hero_white_orange_1790435384152.jpg';
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg text-[10px] font-semibold flex items-center gap-1.5">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Primary Cover Art
                  </div>
                </div>
              </div>

              {/* Gallery Thumbnails Strip */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Showcase Gallery ({gallery.length} Images)
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {gallery.map((url, idx) => {
                    const isCover = thumbnail === url;
                    return (
                      <div
                        key={idx}
                        className={`relative rounded-xl overflow-hidden border group aspect-video ${
                          isCover ? 'ring-2 ring-orange-500 border-transparent' : 'border-slate-200 bg-slate-50'
                        }`}
                      >
                        <img
                          src={url}
                          alt={`Gallery ${idx}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/src/assets/images/hero_white_orange_1790435384152.jpg';
                          }}
                        />

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryThumbnail(url)}
                              className="px-2 py-1 bg-white text-slate-900 rounded-lg text-[10px] font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors shadow"
                              title="Set as Primary Cover Art"
                            >
                              Make Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(url)}
                            className="p-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow"
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        {isCover && (
                          <div className="absolute bottom-1 right-1 bg-orange-600 text-white px-1.5 py-0.5 rounded text-[9px] font-bold">
                            Active Cover
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Direct Image URL (Alternative)
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => {
                    setThumbnail(e.target.value);
                    if (!gallery.includes(e.target.value)) {
                      setGallery(prev => [...prev, e.target.value]);
                    }
                  }}
                  placeholder="https://assets.kroma.studio/.../cover.webp"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900"
                />
              </div>
            </div>
          )}

          {/* STEP 4: DIGITAL PACKAGE (ZIP) & INTELLIGENT BACKEND INSPECTION */}
          {currentStep === 4 && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div>
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Step 4</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Package Ingestion & Framework Intelligence</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your release ZIP file. The system automatically performs 5-layer virus & exploit scans, deduces tools, frameworks, and registers categories without duplicates.
                </p>
              </div>

              {/* Package Dropzone & Circular Progress */}
              <div>
                <input
                  type="file"
                  ref={zipInputRef}
                  onChange={handleUploadZipPackage}
                  accept=".zip"
                  className="hidden"
                />

                {zipUploadProgress?.active ? (
                  <CircularProgress
                    percent={zipUploadProgress.percent}
                    loadedBytes={zipUploadProgress.loaded}
                    totalBytes={zipUploadProgress.total}
                    statusText={zipUploadProgress.statusText}
                  />
                ) : (
                  <div
                    onClick={() => zipInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-200 hover:border-orange-500 bg-slate-50/60 hover:bg-orange-50/20 rounded-2xl p-7 text-center cursor-pointer transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mx-auto text-orange-600 group-hover:scale-105 transition-transform mb-3">
                      <Box className="w-6 h-6" />
                    </div>
                    <div className="text-xs font-bold text-slate-800">
                      {fileUrl ? 'Replace Digital Package ZIP' : 'Click to Upload Digital Release Package (.ZIP)'}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Direct upload to private storage with automated security & framework inspection
                    </p>
                  </div>
                )}
              </div>

              {/* Real-time Security & Inspection Report Card */}
              {securityScan && (
                <div className={`p-4 rounded-2xl border ${
                  securityScan.isSafe ? 'bg-emerald-50/70 border-emerald-200/80 text-emerald-950' : 'bg-red-50 border-red-200 text-red-900'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {securityScan.isSafe ? (
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold text-xs">{securityScan.securityGrade}</div>
                        <div className="text-[11px] opacity-80">{securityScan.securitySummary}</div>
                      </div>
                    </div>

                    <div className="font-mono text-[11px] px-2 py-1 bg-white/80 rounded-lg border border-emerald-200/60 font-semibold">
                      {securityScan.fileCount} files • {fileSize || securityScan.compressedSizeFormatted}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-200/40 text-[10px] font-mono text-emerald-800/80 flex items-center justify-between">
                    <span>SHA-256: {securityScan.sha256?.substring(0, 24)}...</span>
                    <span>Decompressed: {securityScan.uncompressedSizeFormatted}</span>
                  </div>
                </div>
              )}

              {/* Package URI */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Package Storage Reference
                </label>
                <input
                  type="text"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="r2://admin_primary/private/secure-products/package.zip or /uploads/..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900"
                />
              </div>

              {/* Category & SKU & Version */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">Category</label>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewCat(!isAddingNewCat)}
                      className="text-[10px] text-orange-600 font-semibold hover:underline"
                    >
                      {isAddingNewCat ? 'Select' : '+ New'}
                    </button>
                  </div>

                  {isAddingNewCat ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newCatInput}
                        onChange={(e) => setNewCatInput(e.target.value)}
                        placeholder="New category..."
                        className="w-full px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleCreateCategory}
                        className="px-2 py-1 bg-orange-600 text-white text-xs rounded-lg"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900"
                    >
                      {categories.map((c) => (
                        <option key={c.id || c.slug} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">SKU</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={sku}
                      onChange={(e) => setSku(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const code = category.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'AST';
                        setSku(`KRO-${code}-${Math.floor(1000 + Math.random() * 9000)}`);
                      }}
                      className="p-2 border border-slate-200 rounded-xl hover:bg-slate-100 text-slate-600"
                      title="Generate new SKU"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="1.0.0"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs text-slate-900"
                  />
                </div>
              </div>

              {/* Tools & Frameworks Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detected Tools & Frameworks
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTool();
                      }
                    }}
                    placeholder="Add tool or library (e.g. Tailwind v4, Three.js)..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTool}
                    className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
                  >
                    Add Tool
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tools.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-800 rounded-lg text-xs font-medium"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTool(t)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing Matrix */}
              <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                <div className="text-xs font-bold text-slate-900">Commercial Pricing Matrix</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Regular Price ($ USD) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="49"
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sale / Offer Price ($ USD) <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">$</span>
                      <input
                        type="number"
                        step="0.01"
                        value={salePrice}
                        onChange={(e) => setSalePrice(e.target.value)}
                        placeholder="e.g. 39"
                        className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      />
                    </div>
                  </div>
                </div>

                {salePrice && parseFloat(salePrice) > 0 && parseFloat(price) > parseFloat(salePrice) && (
                  <div className="text-[11px] text-emerald-700 font-medium">
                    Discount active: Customer saves ${(parseFloat(price) - parseFloat(salePrice)).toFixed(2)} ({Math.round(((parseFloat(price) - parseFloat(salePrice)) / parseFloat(price)) * 100)}% off)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 5: FINAL VERIFICATION & SUBMIT */}
          {currentStep === 5 && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div>
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wider">Step 5</span>
                <h3 className="text-xl font-bold text-slate-900 tracking-tight mt-1">Final Dossier & Publication Review</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Review digital product packaging and security certification before publishing live.
                </p>
              </div>

              {/* Product Visual Card Summary */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                    <img
                      src={thumbnail}
                      alt={title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/src/assets/images/hero_white_orange_1790435384152.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-semibold text-slate-700">
                        {category}
                      </span>
                      <span className="font-mono text-[10px] text-slate-400">
                        {sku} • v{version}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 tracking-tight truncate">{title || 'Untitled Asset'}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{subtitle || shortDescription}</p>

                    <div className="flex items-baseline gap-2 mt-3">
                      {salePrice && parseFloat(salePrice) > 0 ? (
                        <>
                          <span className="text-lg font-bold text-slate-900">${salePrice}</span>
                          <span className="text-xs text-slate-400 line-through">${price}</span>
                          <span className="text-[11px] font-semibold text-emerald-600">Save {Math.round(((parseFloat(price) - parseFloat(salePrice)) / parseFloat(price)) * 100)}%</span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-slate-900">${price}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Grade Bar */}
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Clean Security Clearance • PK Integrity Verified</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500">
                    {fileSize || 'Digital Package Verified'}
                  </span>
                </div>
              </div>

              {/* Tools list */}
              {tools.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Technical Frameworks</label>
                  <div className="flex flex-wrap gap-1.5">
                    {tools.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-700">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features list */}
              {features.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Included Deliverables</label>
                  <div className="space-y-1">
                    {features.map((f, idx) => (
                      <div key={idx} className="text-xs text-slate-600 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Studio Bottom Controls Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 rounded-xl transition-colors"
            >
              Cancel
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleFinalSubmit('draft')}
                  disabled={saving}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => handleFinalSubmit('published')}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 active:scale-[0.99] text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
                >
                  {saving ? 'Publishing...' : 'Publish Immediately'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
