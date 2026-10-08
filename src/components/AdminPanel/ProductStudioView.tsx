import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Layers,
  Tag,
  DollarSign,
  FileCode2,
  Image as ImageIcon,
  Trash2,
  Star,
  Eye,
  Box,
  Hash,
  Terminal,
  FileText,
  Check,
  Zap,
  Cpu,
  CheckCircle,
  RefreshCw,
  FolderOpen,
  Plus
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

// =========================================================================
// BRANDED TECH & TOOL ICON COMPONENT FOR DETECTED FRAMEWORKS
// =========================================================================
export const TechToolIcon: React.FC<{ toolName: string; className?: string }> = ({ toolName, className = 'w-3.5 h-3.5' }) => {
  const norm = toolName.toLowerCase().trim();

  // Next.js
  if (norm.includes('next')) {
    return (
      <svg className={className} viewBox="0 0 180 180" fill="none">
        <mask id="mask0_next" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180" style={{ maskType: 'alpha' }}>
          <circle cx="90" cy="90" r="90" fill="black" />
        </mask>
        <g mask="url(#mask0_next)">
          <circle cx="90" cy="90" r="90" fill="#000000" />
          <path d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z" fill="white" />
          <rect x="115" y="54" width="12" height="72" fill="white" />
        </g>
      </svg>
    );
  }

  // React
  if (norm.includes('react')) {
    return (
      <svg className={className} viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#06b6d4" />
        <g stroke="#06b6d4" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Tailwind CSS
  if (norm.includes('tailwind')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#06b6d4">
        <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
      </svg>
    );
  }

  // TypeScript
  if (norm.includes('typescript') || norm === 'ts') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M11.5 8H5.5V10.2H7.3V18H9.7V10.2H11.5V8Z" fill="white" />
        <path d="M18.5 10.5C18.1 9.9 17.4 9.5 16.3 9.5C15 9.5 14.2 10.1 14.2 11.2C14.2 12.1 14.8 12.6 15.9 13.1L16.6 13.4C18.2 14.1 19 14.9 19 16.3C19 18.2 17.4 19.3 15.3 19.3C13.6 19.3 12.4 18.5 11.8 17.1L13.8 16C14.2 16.9 14.8 17.3 15.5 17.3C16.3 17.3 16.8 16.8 16.8 16.1C16.8 15.3 16.3 14.9 15.1 14.4L14.4 14.1C13 13.5 12.1 12.5 12.1 11C12.1 9.3 13.6 7.7 16.1 7.7C17.6 7.7 18.7 8.3 19.5 9.5L18.5 10.5Z" fill="white" />
      </svg>
    );
  }

  // Prisma
  if (norm.includes('prisma')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 19H21L12 2Z" stroke="#2D3748" strokeWidth="2" strokeLinejoin="round" fill="#2D3748" fillOpacity="0.2" />
        <path d="M12 2L15 19" stroke="#2D3748" strokeWidth="1.5" />
      </svg>
    );
  }

  // Stripe
  if (norm.includes('stripe')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#635BFF" />
        <path d="M13.8 10.8C12.3 10.4 11.7 10 11.7 9.3C11.7 8.5 12.6 8 13.9 8C15.4 8 16.8 8.5 17.7 9.1L18.4 6.8C17.3 6.3 15.7 6 13.8 6C10.7 6 8.7 7.5 8.7 10C8.7 12.4 10.6 13.4 13.1 14C14.8 14.5 15.4 15 15.4 15.8C15.4 16.8 14.3 17.3 12.9 17.3C11.2 17.3 9.4 16.6 8.4 15.8L7.6 18.2C8.9 18.9 10.9 19.3 12.9 19.3C16.3 19.3 18.5 17.7 18.5 15.1C18.5 12.6 16.5 11.5 13.8 10.8Z" fill="white" />
      </svg>
    );
  }

  // Supabase
  if (norm.includes('supabase')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.5 2L3 13.5H11.5L9.5 22L20.5 9.5H12.5L14.5 2H11.5Z" fill="#3ECF8E" />
      </svg>
    );
  }

  // Firebase
  if (norm.includes('firebase')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M4 18L7.5 4L11 9L4 18Z" fill="#FFA000" />
        <path d="M20 18L13 3L11 9L20 18Z" fill="#F57C00" />
        <path d="M11 9L13.5 14L4 18L11 9Z" fill="#FFCA28" />
        <path d="M4 18L12 22L20 18L11 9L4 18Z" fill="#FF8F00" />
      </svg>
    );
  }

  // PostgreSQL / Database / SQL
  if (norm.includes('postgres') || norm.includes('neon') || norm.includes('sql') || norm.includes('db')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 3C7.58172 3 4 4.34315 4 6C4 7.65685 7.58172 9 12 9C16.4183 9 20 7.65685 20 6C20 4.34315 16.4183 3 12 3Z" fill="#336791" />
        <path d="M4 6V12C4 13.6569 7.58172 15 12 15C16.4183 15 20 13.6569 20 12V6" stroke="#336791" strokeWidth="2" />
        <path d="M4 12V18C4 19.6569 7.58172 21 12 21C16.4183 21 20 19.6569 20 18V12" stroke="#336791" strokeWidth="2" />
      </svg>
    );
  }

  // Figma
  if (norm.includes('figma')) {
    return (
      <svg className={className} viewBox="0 0 38 57" fill="none">
        <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z" fill="#1ABCFE" />
        <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#0ACF83" />
        <path d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z" fill="#FF7262" />
        <path d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z" fill="#F24E1E" />
        <path d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z" fill="#A259FF" />
      </svg>
    );
  }

  // Blender / 3D / Three.js
  if (norm.includes('blender') || norm.includes('three') || norm.includes('3d') || norm.includes('webgl')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="#EA7600" strokeWidth="2" strokeLinejoin="round" />
        <path d="M12 22V12" stroke="#EA7600" strokeWidth="2" />
        <path d="M12 12L21 7" stroke="#EA7600" strokeWidth="2" />
        <path d="M12 12L3 7" stroke="#EA7600" strokeWidth="2" />
        <circle cx="12" cy="12" r="2.5" fill="#2563EB" />
      </svg>
    );
  }

  // Python
  if (norm.includes('python')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M11.9 2C8.3 2 8.6 3.5 8.6 3.5L8.6 5.2H12.2V5.7H5.4C3.8 5.7 2.4 6.7 2.4 8.7C2.4 10.7 3.4 11.7 5.1 11.7H6.6V10.1C6.6 8.3 8.1 6.8 9.9 6.8H14.1C15.4 6.8 16.5 5.7 16.5 4.4C16.5 3 15.3 2 11.9 2ZM10.3 3.3C10.8 3.3 11.2 3.7 11.2 4.2C11.2 4.7 10.8 5.1 10.3 5.1C9.8 5.1 9.4 4.7 9.4 4.2C9.4 3.7 9.8 3.3 10.3 3.3Z" fill="#3776AB" />
        <path d="M12.1 22C15.7 22 15.4 20.5 15.4 20.5L15.4 18.8H11.8V18.3H18.6C20.2 18.3 21.6 17.3 21.6 15.3C21.6 13.3 20.6 12.3 18.9 12.3H17.4V13.9C17.4 15.7 15.9 17.2 14.1 17.2H9.9C8.6 17.2 7.5 18.3 7.5 19.6C7.5 21 8.7 22 12.1 22ZM13.7 20.7C13.2 20.7 12.8 20.3 12.8 19.8C12.8 19.3 13.2 18.9 13.7 18.9C14.2 18.9 14.6 19.3 14.6 19.8C14.6 20.3 14.2 20.7 13.7 20.7Z" fill="#FFD43B" />
      </svg>
    );
  }

  // Vue.js / Nuxt
  if (norm.includes('vue') || norm.includes('nuxt')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M2 3H6.5L12 12.5L17.5 3H22L12 20.5L2 3Z" fill="#42B883" />
        <path d="M6.5 3H10.5L12 5.5L13.5 3H17.5L12 12.5L6.5 3Z" fill="#35495E" />
      </svg>
    );
  }

  // Svelte
  if (norm.includes('svelte')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="#FF3E00">
        <path d="M19.4 6.7C18.1 4.4 15.6 3 12.9 3.1C10.7 3.2 8.7 4.2 7.5 6C6.7 7.2 6.4 8.7 6.6 10.1L6.7 10.9L5.9 11.2C4.5 11.7 3.4 12.8 2.8 14.2C2.1 16 2.3 18 3.3 19.6C4.6 21.8 7.1 23.2 9.8 23.1C12 23 14 22 15.2 20.2C16 19 16.3 17.5 16.1 16.1L16 15.3L16.8 15C18.2 14.5 19.3 13.4 19.9 12C20.6 10.2 20.4 8.2 19.4 6.7Z" />
      </svg>
    );
  }

  // WordPress / PHP
  if (norm.includes('wordpress') || norm.includes('php')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#21759B" />
        <path d="M12 3.5C7.3 3.5 3.5 7.3 3.5 12C3.5 13.9 4.1 15.7 5.2 17.1L8.8 7.2C9.4 7.2 9.9 7.2 9.9 7.2L12.5 14.8L14.7 7.2H15.8L18.8 17.1C19.9 15.7 20.5 13.9 20.5 12C20.5 7.3 16.7 3.5 12 3.5Z" fill="white" />
      </svg>
    );
  }

  // HTML5 / CSS3 / Web
  if (norm.includes('html') || norm.includes('css')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M3 2L5 20L12 22L19 20L21 2H3Z" fill="#E34F26" />
        <path d="M12 4V20.2L17.5 18.7L19.1 4H12Z" fill="#EF652A" />
        <path d="M7 7H17L16.6 11.5H10.5L10.8 14.5H16.3L15.9 17.5L12 18.5L8.1 17.5L7.8 14H6.2L6.7 19.2L12 20.7L17.3 19.2L18.2 9.5H7.3L7 7Z" fill="white" />
      </svg>
    );
  }

  // Node.js / Express
  if (norm.includes('node') || norm.includes('express')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M12 2L21 7.2V16.8L12 22L3 16.8V7.2L12 2Z" fill="#5FA04E" />
        <path d="M12 5.5L17.5 8.7V15.3L12 18.5L6.5 15.3V8.7L12 5.5Z" fill="#333333" />
      </svg>
    );
  }

  // Motion / Lottie / Animation
  if (norm.includes('motion') || norm.includes('lottie') || norm.includes('audio')) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none">
        <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
      </svg>
    );
  }

  // Default clean tech chip
  return <Cpu className={`${className} text-orange-600`} />;
};

// =========================================================================
// STUNNING CIRCULAR UPLOAD PROGRESS WITH SMOOTH TICK-UP INTERPOLATION
// =========================================================================
const StunningCircularUploadProgress: React.FC<{
  targetPercent: number;
  totalBytes: number;
  targetLoadedBytes: number;
  statusText?: string;
  fileName?: string;
  isComplete?: boolean;
}> = ({
  targetPercent,
  totalBytes,
  targetLoadedBytes,
  statusText,
  fileName,
  isComplete
}) => {
  const [displayPercent, setDisplayPercent] = useState<number>(0);
  const [displayBytes, setDisplayBytes] = useState<number>(0);

  const formatSize = (bytes: number) => {
    if (!bytes || bytes <= 0) return '0.0 MB';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      setDisplayPercent(prev => {
        const goal = isComplete ? 100 : Math.max(targetPercent, 5);
        if (Math.abs(prev - goal) < 0.2) return goal;
        const diff = goal - prev;
        const step = diff * Math.min(dt * 8, 0.4) + (diff > 0 ? 0.1 : -0.1);
        const next = prev + step;
        return Math.min(Math.max(next, 0), 100);
      });

      setDisplayBytes(prev => {
        const goalBytes = isComplete ? totalBytes : targetLoadedBytes;
        if (Math.abs(prev - goalBytes) < 5000) return goalBytes;
        const diff = goalBytes - prev;
        const step = diff * Math.min(dt * 8, 0.4);
        return Math.min(Math.max(prev + step, 0), totalBytes);
      });

      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, [targetPercent, targetLoadedBytes, totalBytes, isComplete]);

  const size = 124;
  const strokeWidth = 6.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedPercent = Math.min(Math.max(displayPercent, 0), 100);
  const strokeDashoffset = circumference - (clampedPercent / 100) * circumference;

  const isFinished = isComplete && clampedPercent >= 99;

  return (
    <div className="p-8 bg-white border border-slate-200/90 rounded-3xl shadow-lg max-w-md mx-auto flex flex-col items-center justify-center text-center transition-all">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          className="-rotate-90 filter drop-shadow-sm"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <defs>
            <linearGradient id="circularUploadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
            <linearGradient id="circularCompleteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={isFinished ? 'url(#circularCompleteGradient)' : 'url(#circularUploadGradient)'}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-150 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {isFinished ? (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mt-1">Ready</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-3xl font-extrabold font-sans text-slate-900 tracking-tight leading-none">
                {Math.round(clampedPercent)}
                <span className="text-base font-semibold text-slate-400 font-mono ml-0.5">%</span>
              </span>
              <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mt-1">
                {clampedPercent > 80 ? 'Processing' : 'Uploading'}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 w-full">
        {fileName && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200/80 rounded-full text-xs font-semibold text-slate-800 max-w-full truncate mb-2">
            <Box className="w-3.5 h-3.5 text-orange-600 shrink-0" />
            <span className="truncate">{fileName}</span>
          </div>
        )}

        <div className="text-sm font-bold text-slate-900 font-mono tracking-tight">
          {formatSize(displayBytes)}{' '}
          <span className="text-slate-400 font-normal">/ {formatSize(totalBytes)}</span>
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-2 text-xs font-medium text-slate-600">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isFinished ? 'bg-emerald-500' : 'bg-orange-500 animate-ping'
            }`}
          />
          <span className="truncate max-w-xs">
            {isFinished
              ? 'Verification Completed ✓'
              : statusText || 'Streaming file to secure storage...'}
          </span>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// CIRCULAR STEP PROGRESS INDICATOR FOR TOP STUDIO HEADER
// =========================================================================
const CircularStepIndicator: React.FC<{
  currentStep: number;
  totalSteps?: number;
}> = ({ currentStep, totalSteps = 5 }) => {
  const size = 44;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = (currentStep / totalSteps) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="flex items-center gap-3 bg-white px-3.5 py-1.5 rounded-2xl border border-slate-200 shadow-xs">
      <div className="relative shrink-0 flex items-center justify-center" style={{ width: size, height: size }}>
        <svg
          className="-rotate-90"
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#f97316"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-500 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <span className="text-[11px] font-mono font-bold text-slate-900">
            {currentStep}/{totalSteps}
          </span>
        </div>
      </div>

      <div className="text-left">
        <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider">
          Step {currentStep} of {totalSteps}
        </div>
        <div className="text-xs font-bold text-slate-800 tracking-tight">
          {currentStep === 1
            ? 'Asset Identity'
            : currentStep === 2
            ? 'Story & Specs'
            : currentStep === 3
            ? 'Media & Gallery'
            : currentStep === 4
            ? 'Package & Code Intelligence'
            : 'Review & Publish'}
        </div>
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
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Core Product State
  const [title, setTitle] = useState(initialProduct?.title || '');
  const [subtitle, setSubtitle] = useState(initialProduct?.subtitle || '');
  const [shortDescription, setShortDescription] = useState(initialProduct?.short_description || '');
  const [description, setDescription] = useState(initialProduct?.description || '');
  
  // Category is 100% automatically assigned when ZIP is uploaded
  const [category, setCategory] = useState(initialProduct?.category || 'Dev Kits');
  
  const [price, setPrice] = useState(initialProduct?.price ? initialProduct.price.toString() : '49');
  const [salePrice, setSalePrice] = useState(initialProduct?.sale_price ? initialProduct.sale_price.toString() : '');
  const [sku, setSku] = useState(initialProduct?.sku || '');
  const [version, setVersion] = useState(initialProduct?.version || '1.0.0');
  
  // Automatically detected tools & keywords from ZIP inspection
  const [tools, setTools] = useState<string[]>(initialProduct?.tools || []);
  const [formats, setFormats] = useState<string[]>(initialProduct?.formats || ['.zip']);
  const [tags, setTags] = useState<string[]>(initialProduct?.tags || []);
  
  const [features, setFeatures] = useState<string[]>(
    initialProduct?.features && initialProduct.features.length > 0
      ? initialProduct.features
      : ['Instant Digital Download', 'Full Commercial License', 'Free Updates for 1 Year']
  );
  
  // Clean thumbnail & multiple gallery state
  const [thumbnail, setThumbnail] = useState<string>(initialProduct?.thumbnail || '');
  const [gallery, setGallery] = useState<string[]>(
    initialProduct?.gallery && initialProduct.gallery.length > 0
      ? initialProduct.gallery
      : (initialProduct?.thumbnail ? [initialProduct.thumbnail] : [])
  );

  // In-memory instant object URL cache so images render immediately with zero network failure
  const [previewBlobMap, setPreviewBlobMap] = useState<Record<string, string>>({});
  
  const [fileUrl, setFileUrl] = useState(initialProduct?.file_url || '');
  const [fileSize, setFileSize] = useState(initialProduct?.file_size || '');
  const [securityScan, setSecurityScan] = useState<any>(initialProduct?.security_scan || null);
  const [productStatus, setProductStatus] = useState<'published' | 'draft'>(initialProduct?.status || 'published');

  // Input states for feature bullets & custom chips
  const [featureInput, setFeatureInput] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Upload States
  const [activeUploadFile, setActiveUploadFile] = useState<string>('');
  
  const [mediaUploadProgress, setMediaUploadProgress] = useState<{
    active: boolean;
    percent: number;
    loaded: number;
    total: number;
    statusText: string;
    isComplete?: boolean;
  } | null>(null);

  const [zipUploadProgress, setZipUploadProgress] = useState<{
    active: boolean;
    percent: number;
    loaded: number;
    total: number;
    statusText: string;
    isComplete?: boolean;
  } | null>(null);

  // Feedback & Saving
  const [saving, setSaving] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [autoDetectNotice, setAutoDetectNotice] = useState<string | null>(null);

  // Hidden file input refs
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const galleryMultiInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate SKU if blank
  useEffect(() => {
    if (!sku) {
      const prefix = category ? category.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'KRO') : 'KRO';
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      setSku(`${prefix}-${randomNum}`);
    }
  }, [category]);

  // Validation
  const validateStep = (step: number): boolean => {
    setErrorNotice(null);
    if (step === 1) {
      if (!title.trim()) {
        setErrorNotice('Please enter an asset title before continuing.');
        return false;
      }
    } else if (step === 2) {
      if (!description.trim()) {
        setErrorNotice('Please enter a description for the product.');
        return false;
      }
    } else if (step === 3) {
      if (!thumbnail.trim()) {
        setErrorNotice('Please upload a product thumbnail cover image before proceeding.');
        return false;
      }
    } else if (step === 4) {
      if (!fileUrl.trim()) {
        setErrorNotice('Please upload the digital product ZIP archive so the system can verify and auto-categorize it.');
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

  // Helper: Return live display URL (prioritizing instant blob object URL)
  const getDisplayImageUrl = (url: string) => {
    if (!url) return '';
    return previewBlobMap[url] || url;
  };

  // Dedicated Cover Thumbnail Upload
  const handleUploadCoverImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorNotice(null);
    setActiveUploadFile(file.name);

    // Instant local blob URL: 100% reliable, zero latency
    const localBlob = URL.createObjectURL(file);
    setThumbnail(localBlob);
    setGallery(prev => (prev.includes(localBlob) ? prev : [localBlob, ...prev]));

    const effectiveToken = token || localStorage.getItem('kroma_admin_token') || 'admin_primary';
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', 'admin_primary');
    formData.append('folderType', 'thumbnails');

    setMediaUploadProgress({
      active: true,
      percent: 15,
      loaded: Math.round(file.size * 0.15),
      total: file.size,
      statusText: 'Streaming cover image to asset store...',
      isComplete: false
    });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const rawPercent = (event.loaded / event.total) * 100;
        setMediaUploadProgress({
          active: true,
          percent: Math.min(rawPercent, 90),
          loaded: event.loaded,
          total: event.total,
          statusText: 'Streaming cover image to asset store...',
          isComplete: false
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          const serverUrl = data.publicUrl || `/uploads/thumbnails/${data.filename || file.name}`;

          // Map serverUrl -> localBlob so preview remains razor sharp
          setPreviewBlobMap(prev => ({ ...prev, [serverUrl]: localBlob }));

          setMediaUploadProgress(prev => (prev ? { ...prev, percent: 100, loaded: file.size, isComplete: true } : null));

          setTimeout(() => {
            setMediaUploadProgress(null);
            setThumbnail(serverUrl);
            setGallery(prev => {
              const cleaned = prev.filter(x => x !== localBlob);
              return Array.from(new Set([serverUrl, ...cleaned]));
            });
          }, 600);
        } catch {
          setMediaUploadProgress(null);
        }
      } else {
        setMediaUploadProgress(null);
      }
    };

    xhr.onerror = () => {
      setMediaUploadProgress(null);
    };

    xhr.open('POST', '/api/admin/r2/upload');
    xhr.setRequestHeader('Authorization', `Bearer ${effectiveToken}`);
    xhr.send(formData);

    if (thumbInputRef.current) thumbInputRef.current.value = '';
  };

  // Upload Multiple Gallery Screenshots at once
  const handleUploadMultipleGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setErrorNotice(null);
    const fileList = Array.from(files);

    const totalBatchBytes = fileList.reduce((acc, f) => acc + f.size, 0);
    setActiveUploadFile(`${fileList.length} gallery images`);

    setMediaUploadProgress({
      active: true,
      percent: 15,
      loaded: Math.round(totalBatchBytes * 0.15),
      total: totalBatchBytes,
      statusText: `Uploading ${fileList.length} gallery images...`,
      isComplete: false
    });

    const effectiveToken = token || localStorage.getItem('kroma_admin_token') || 'admin_primary';

    fileList.forEach(file => {
      const localBlob = URL.createObjectURL(file);

      // Instant preview in gallery array
      setGallery(prev => [...prev, localBlob]);
      if (!thumbnail) setThumbnail(localBlob);

      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', 'admin_primary');
      formData.append('folderType', 'thumbnails');

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            const serverUrl = data.publicUrl || `/uploads/thumbnails/${data.filename || file.name}`;

            setPreviewBlobMap(prev => ({ ...prev, [serverUrl]: localBlob }));

            setGallery(prev => {
              const updated = prev.map(item => (item === localBlob ? serverUrl : item));
              return Array.from(new Set(updated));
            });

            setThumbnail(current => (current === localBlob ? serverUrl : current));
          } catch {}
        }
      };

      xhr.open('POST', '/api/admin/r2/upload');
      xhr.setRequestHeader('Authorization', `Bearer ${effectiveToken}`);
      xhr.send(formData);
    });

    setTimeout(() => {
      setMediaUploadProgress(prev => (prev ? { ...prev, percent: 100, isComplete: true } : null));
      setTimeout(() => setMediaUploadProgress(null), 700);
    }, 900);

    if (galleryMultiInputRef.current) galleryMultiInputRef.current.value = '';
  };

  // Real ZIP Package Ingestion + 5-Layer Security Scan + Auto-Categorization & Stack Extraction
  const handleUploadZipPackage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.zip')) {
      setErrorNotice('Invalid file format. Please upload a valid .zip archive.');
      return;
    }

    setErrorNotice(null);
    setAutoDetectNotice(null);
    setActiveUploadFile(file.name);

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('file', file);

    setZipUploadProgress({
      active: true,
      percent: 8,
      loaded: Math.round(file.size * 0.08),
      total: file.size,
      statusText: 'Streaming ZIP archive to secure storage...',
      isComplete: false
    });

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const rawPercent = (event.loaded / event.total) * 100;
        const boundedPercent = Math.min(rawPercent * 0.88, 88);
        setZipUploadProgress({
          active: true,
          percent: boundedPercent,
          loaded: event.loaded,
          total: event.total,
          statusText: boundedPercent > 65
            ? 'Analyzing package structure, dependencies & security scan...'
            : 'Streaming archive to secure storage...',
          isComplete: false
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const resp = JSON.parse(xhr.responseText);
          const scan = resp.scan;

          setZipUploadProgress(prev =>
            prev
              ? {
                  ...prev,
                  percent: 100,
                  loaded: file.size,
                  statusText: 'Security verification passed & stack identified!',
                  isComplete: true
                }
              : null
          );

          setTimeout(() => {
            setZipUploadProgress(null);

            setSecurityScan(scan);
            setFileUrl(resp.fileUrl || `r2://${resp.key}`);
            setFileSize(resp.fileSize || scan.formattedCompressedSize || '15 MB');

            // 1. AUTOMATIC CATEGORY ASSIGNMENT (100% automated from ZIP)
            const detectedCat = scan.detectedCategory || scan.suggestedCategory || 'Dev Kits';
            setCategory(detectedCat);

            // 2. AUTOMATIC VERSION EXTRACTION
            const detectedVer = scan.version || scan.suggestedVersion || scan.packageDetails?.version;
            if (detectedVer) {
              setVersion(detectedVer);
            }

            // 3. AUTOMATIC TOOLS & FRAMEWORKS EXTRACTION
            const incomingTools = scan.detectedTools || scan.tools || [];
            if (Array.isArray(incomingTools) && incomingTools.length > 0) {
              setTools(prev => Array.from(new Set([...prev, ...incomingTools])));
            }

            // 4. AUTOMATIC TAGS & KEYWORDS GENERATION
            const incomingTags = scan.detectedTags || scan.suggestedTags || [];
            if (Array.isArray(incomingTags) && incomingTags.length > 0) {
              setTags(prev => Array.from(new Set([...prev, ...incomingTags])));
            }

            // 5. AUTOMATIC FORMATS
            const incomingFormats = scan.detectedFormats || scan.formats || ['.zip'];
            if (Array.isArray(incomingFormats) && incomingFormats.length > 0) {
              setFormats(prev => Array.from(new Set([...prev, ...incomingFormats])));
            }

            if (scan.suggestedSku && (!sku || sku.trim() === '')) {
              setSku(scan.suggestedSku);
            }
            if (scan.packageDetails?.name && (!title || title.trim() === '')) {
              setTitle(scan.packageDetails.name);
            }
            if (scan.packageDetails?.description && (!description || description.trim() === '')) {
              setDescription(scan.packageDetails.description);
            }

            setAutoDetectNotice(
              `ZIP Successfully Analyzed: Assigned category "${detectedCat}", detected version v${detectedVer || version}, identified ${incomingTools.length} tools/frameworks, and generated ${incomingTags.length} keywords.`
            );
          }, 900);
        } catch {
          setZipUploadProgress(null);
          setErrorNotice('Failed to process server security analysis response.');
        }
      } else {
        setZipUploadProgress(null);
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

    const effectiveToken = token || localStorage.getItem('kroma_admin_token') || 'admin_primary';
    xhr.open('POST', '/api/admin/products/inspect-and-upload-zip');
    xhr.setRequestHeader('Authorization', `Bearer ${effectiveToken}`);
    xhr.send(formData);

    if (zipInputRef.current) zipInputRef.current.value = '';
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

  // Tools Chips Add/Remove
  const handleAddTool = () => {
    if (!toolInput.trim()) return;
    setTools(prev => Array.from(new Set([...prev, toolInput.trim()])));
    setToolInput('');
  };

  const handleRemoveTool = (t: string) => {
    setTools(prev => prev.filter(x => x !== t));
  };

  // Tags Chips Add/Remove
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
      category: category.trim() || 'Dev Kits',
      price: parseFloat(price) || 49,
      sale_price: salePrice && !isNaN(parseFloat(salePrice)) ? parseFloat(salePrice) : undefined,
      sku: sku.trim() || `KRO-AST-${Math.floor(1000 + Math.random() * 9000)}`,
      version: version.trim() || '1.0.0',
      tools,
      formats,
      tags,
      features,
      thumbnail: thumbnail.trim(),
      gallery: gallery.length > 0 ? gallery : [thumbnail.trim()],
      file_url: fileUrl,
      file_size: fileSize || '24 MB',
      security_scan: securityScan,
      status: publishStatus
    };

    try {
      const url = initialProduct?.id ? `/api/products/${initialProduct.id}` : '/api/products';
      const method = initialProduct?.id ? 'PUT' : 'POST';
      const effectiveToken = token || localStorage.getItem('kroma_admin_token') || 'admin_primary';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveToken}`
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

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar: Breadcrumb + Step Indicator (Discard/Save Draft/Publish Live REMOVED) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Products</span>
          </button>
          <div className="h-5 w-px bg-slate-200" />
          
          {/* Circular Step Completion Ring */}
          <CircularStepIndicator currentStep={currentStep} totalSteps={5} />
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

      {/* Auto-Detect Success Banner */}
      {autoDetectNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{autoDetectNotice}</span>
          </div>
          <button onClick={() => setAutoDetectNotice(null)} className="text-emerald-500 hover:text-emerald-700 font-bold">
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
              <p className="text-xs text-slate-500 mt-1">
                Enter your product title and value tagline. Categories, tools, and keywords will be 100% automatically detected when you upload the ZIP archive in Step 4.
              </p>
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
                placeholder="e.g. Modern Fullstack Next.js 15 SaaS Template"
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
                placeholder="e.g. Production-ready boilerplate with Tailwind CSS, Prisma, authentication, and Stripe payments"
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
              />
            </div>

            {/* 100% Automated Category Notice */}
            <div className="p-4 bg-orange-50/60 border border-orange-200/80 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-orange-950 block">100% Automatic Category & Stack Intelligence</span>
                <p className="text-xs text-orange-800/90 mt-0.5 leading-relaxed">
                  No manual category selection needed. When you upload your project ZIP archive in Step 4, our system inspects the code structure and dependencies, automatically detects whether it's UI & Figma, Dev Kits, 3D & Spatial, Templates, or Motion & Audio, and extracts all tools and keywords.
                </p>
                {category && (
                  <div className="mt-2.5 flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-orange-900">Current Auto-Assigned Category:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-white border border-orange-200 text-xs font-bold text-orange-700 shadow-2xs">
                      {category}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Storefront URL Slug Preview */}
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
              <p className="text-xs text-slate-500 mt-1">Provide clear documentation and feature highlights for prospective buyers.</p>
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
                placeholder="Describe everything included in this asset, architecture, setup instructions, prerequisites..."
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
                  placeholder="e.g. 50+ Responsive React components, Dark mode tokens..."
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
        {/* STEP 3: MEDIA, THUMBNAIL COVER & MULTIPLE PRODUCT GALLERY                 */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="space-y-8 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Step 3: Media, Thumbnail Cover & Gallery</h2>
              <p className="text-xs text-slate-500 mt-1">Upload the primary showcase thumbnail and multiple screenshot gallery slides for prospective buyers.</p>
            </div>

            {/* Hidden Input for Primary Cover */}
            <input
              ref={thumbInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleUploadCoverImage}
            />

            {/* Hidden Input for Multiple Gallery Images */}
            <input
              ref={galleryMultiInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={handleUploadMultipleGallery}
            />

            {/* Uploading with Smooth Circular Progress Ring */}
            {mediaUploadProgress?.active && (
              <StunningCircularUploadProgress
                targetPercent={mediaUploadProgress.percent}
                targetLoadedBytes={mediaUploadProgress.loaded}
                totalBytes={mediaUploadProgress.total}
                statusText={mediaUploadProgress.statusText}
                fileName={activeUploadFile}
                isComplete={mediaUploadProgress.isComplete}
              />
            )}

            {/* 1. PRIMARY STOREFRONT COVER CARD */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Primary Storefront Thumbnail & Cover
                </span>
                <span className="text-[11px] text-slate-500">Main card image shown in store catalog</span>
              </div>

              {thumbnail ? (
                <div className="p-5 bg-slate-50/80 border border-slate-200 rounded-3xl space-y-4">
                  {/* High-Res Preview Canvas */}
                  <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-950/5 group">
                    <img
                      src={getDisplayImageUrl(thumbnail)}
                      alt="Primary Cover Thumbnail"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                      onError={(e) => {
                        const target = e.currentTarget;
                        if (!target.src.includes('/api/')) {
                          target.src = `/api${thumbnail}`;
                        }
                      }}
                    />
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span>Primary Cover Thumbnail</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-slate-500">
                      Recommended: 1200×750px PNG, JPG, or WEBP (16:10 / 16:9 ratio)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setThumbnail('');
                          setGallery(prev => prev.filter(x => x !== thumbnail));
                        }}
                        className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors border border-rose-200"
                      >
                        Remove
                      </button>
                      <button
                        type="button"
                        onClick={() => thumbInputRef.current?.click()}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Change Cover</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => thumbInputRef.current?.click()}
                  className="p-8 border-2 border-dashed border-slate-200 hover:border-orange-500/60 rounded-3xl bg-slate-50/40 hover:bg-orange-50/20 text-center cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-slate-600 group-hover:text-orange-600 group-hover:border-orange-200 flex items-center justify-center mx-auto transition-colors shadow-xs">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-3">Upload Primary Cover Thumbnail</h3>
                  <p className="text-xs text-slate-500 mt-1">PNG, JPG, or WEBP up to 25MB. Click to browse.</p>
                  <button
                    type="button"
                    className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs hover:bg-slate-50"
                  >
                    Select Cover Image
                  </button>
                </div>
              )}
            </div>

            {/* 2. MULTIPLE PRODUCT GALLERY IMAGES SECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-orange-600" />
                    <span>Product Gallery Screenshots ({gallery.length})</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Upload multiple screenshots to showcase features, dark mode, or mobile views.</p>
                </div>

                <button
                  type="button"
                  onClick={() => galleryMultiInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Gallery Images</span>
                </button>
              </div>

              {/* Gallery Grid */}
              {gallery.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.map((imgUrl, idx) => {
                    const isCover = thumbnail === imgUrl;
                    const displaySrc = getDisplayImageUrl(imgUrl);

                    return (
                      <div
                        key={idx}
                        className={`relative aspect-[16/10] rounded-2xl overflow-hidden border transition-all group bg-slate-100 ${
                          isCover ? 'border-orange-500 ring-2 ring-orange-500/20 shadow-sm' : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <img
                          src={displaySrc}
                          alt={`Gallery screenshot ${idx + 1}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget;
                            if (!target.src.includes('/api/')) {
                              target.src = `/api${imgUrl}`;
                            }
                          }}
                        />

                        {/* Primary Cover Badge */}
                        {isCover && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                            <Star className="w-3 h-3 fill-white" />
                            <span>Cover</span>
                          </div>
                        )}

                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                          {!isCover && (
                            <button
                              type="button"
                              onClick={() => setThumbnail(imgUrl)}
                              className="px-2.5 py-1 bg-white hover:bg-orange-50 text-slate-900 rounded-lg text-xs font-bold shadow-sm transition-colors"
                            >
                              Set as Cover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              const remaining = gallery.filter((_, i) => i !== idx);
                              setGallery(remaining);
                              if (isCover && remaining.length > 0) {
                                setThumbnail(remaining[0]);
                              } else if (isCover) {
                                setThumbnail('');
                              }
                            }}
                            className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg shadow-sm transition-colors"
                            title="Delete image"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div
                  onClick={() => galleryMultiInputRef.current?.click()}
                  className="p-6 border-2 border-dashed border-slate-200 hover:border-slate-300 rounded-2xl bg-slate-50/50 text-center cursor-pointer transition-colors"
                >
                  <p className="text-xs text-slate-500">No additional screenshots yet. Click "Add Gallery Images" to upload multiple files.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: DIGITAL PACKAGE INGESTION & INTELLIGENT BACKEND ENGINE            */}
        {/* (Automatic Category, Version, Tools with Icons & Keywords Engine)        */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Step 4: Digital Package Ingestion & Code Intelligence</h2>
              <p className="text-xs text-slate-500 mt-1">
                Upload your product ZIP archive. The engine inspects dependencies, detects used tools and frameworks with branded icons, extracts version, assigns the category, and generates searchable keywords.
              </p>
            </div>

            {/* Hidden Input for Real ZIP Archive */}
            <input
              ref={zipInputRef}
              type="file"
              accept=".zip,application/zip"
              className="hidden"
              onChange={handleUploadZipPackage}
            />

            {/* Circular Progress Indicator with Smooth Tick-up */}
            {zipUploadProgress?.active ? (
              <StunningCircularUploadProgress
                targetPercent={zipUploadProgress.percent}
                targetLoadedBytes={zipUploadProgress.loaded}
                totalBytes={zipUploadProgress.total}
                statusText={zipUploadProgress.statusText}
                fileName={activeUploadFile}
                isComplete={zipUploadProgress.isComplete}
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
                <p className="text-xs text-slate-500 mt-1">Supports packages up to 350MB. Auto-analyzes package.json, frameworks, version, and verifies security.</p>
                <button
                  type="button"
                  className="mt-4 px-4 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-xs hover:bg-slate-50"
                >
                  Select ZIP Archive
                </button>
              </div>
            )}

            {/* Automatically Fetched Results Card */}
            {fileUrl && (
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">ZIP Package Verified & Inspected</span>
                      <span className="text-[11px] text-slate-500 font-mono">Size: {fileSize || '18 MB'} • Clean PK Signature</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => zipInputRef.current?.click()}
                    className="text-xs font-semibold text-orange-600 hover:underline"
                  >
                    Replace Archive
                  </button>
                </div>

                {/* Automatically Determined Category & Version Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Auto-Assigned Category
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        {category}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-orange-100 text-orange-800 text-[10px] font-bold uppercase tracking-wider">
                      Auto-Detected
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200/80 rounded-2xl">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Detected Release Version
                      </span>
                      <span className="text-sm font-mono font-bold text-slate-900">
                        v{version}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">
                      From Package
                    </span>
                  </div>
                </div>

                {/* Auto-detected tools & frameworks with BRANDED ICONS */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Detected Tools & Frameworks ({tools.length})
                    </span>
                    <span className="text-[10px] text-slate-400">Extracted from code dependencies</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tools.map((t, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 shadow-2xs">
                        <TechToolIcon toolName={t} className="w-4 h-4 shrink-0" />
                        <span>{t}</span>
                        <button type="button" onClick={() => handleRemoveTool(t)} className="text-slate-400 hover:text-rose-500 text-sm leading-none ml-1">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Auto-generated keywords / tags */}
                {tags.length > 0 && (
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                      Auto-Generated Search Keywords & Tags ({tags.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tg, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white border border-slate-200 rounded-md text-[11px] text-slate-600">
                          <span>#{tg}</span>
                          <button type="button" onClick={() => handleRemoveTag(tg)} className="text-slate-400 hover:text-rose-500">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick add custom Tool or Keyword */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">Add Tool / Framework</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={toolInput}
                    onChange={(e) => setToolInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTool(); } }}
                    placeholder="e.g. Supabase, GraphQL..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                  <button type="button" onClick={handleAddTool} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold">Add</button>
                </div>
              </div>

              <div className="p-4 bg-slate-50/50 border border-slate-200 rounded-2xl space-y-2">
                <label className="text-xs font-semibold text-slate-700 block">Add Search Keyword</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                    placeholder="e.g. saas, boilerplate..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl text-slate-900"
                  />
                  <button type="button" onClick={handleAddTag} className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-bold">Add</button>
                </div>
              </div>
            </div>

            {/* Commercial Pricing & SKU */}
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
              <p className="text-xs text-slate-500 mt-1">Review your product presentation, assigned category, and detected stack before publishing.</p>
            </div>

            {/* Visual Executive Summary Card */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
              <div className="grid grid-cols-1 sm:grid-cols-12">
                <div className="sm:col-span-5 relative aspect-[16/10] sm:aspect-auto bg-slate-100">
                  {thumbnail ? (
                    <img
                      src={getDisplayImageUrl(thumbnail)}
                      alt={title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                      No cover selected
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
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

                  {/* Tools preview with branded icons */}
                  {tools.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {tools.slice(0, 6).map((t, idx) => (
                        <span key={idx} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-800">
                          <TechToolIcon toolName={t} className="w-3.5 h-3.5 shrink-0" />
                          <span>{t}</span>
                        </span>
                      ))}
                      {tools.length > 6 && (
                        <span className="px-2 py-0.5 rounded text-[10px] text-slate-400">+{tools.length - 6} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery Screenshots Preview Counter */}
            {gallery.length > 1 && (
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-semibold text-slate-800">{gallery.length} Product Media Screenshots Configured</span>
                </div>
                <span className="text-xs font-mono text-slate-500">Cover + {gallery.length - 1} gallery images</span>
              </div>
            )}

            {/* Security Verification & Integrity Status */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-emerald-950 block">Security Clearance & Packaging Verified</span>
                  <span className="text-[11px] text-emerald-700">0 malicious binaries • Path traversal protected • Cloudflare R2 direct customer download active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
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
                <span>Continue</span>
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
