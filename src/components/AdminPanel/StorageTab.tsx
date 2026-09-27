import React, { useState, useEffect, useRef } from 'react';
import {
  Cloud,
  HardDrive,
  Key,
  ShieldCheck,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileArchive,
  Image as ImageIcon,
  User,
  Layout,
  ExternalLink,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Clock,
  Sparkles,
  Download,
  FolderTree,
  ShieldAlert
} from 'lucide-react';

interface StorageTabProps {
  token: string;
}

interface R2Config {
  isConfigured: boolean;
  accountId: string;
  accessKeyId: string;
  hasSecretKey: boolean;
  secretAccessKeyMasked: string;
  bucketName: string;
  publicDomain: string;
}

interface R2FileItem {
  key: string;
  filename: string;
  size: number;
  lastModified: string;
  folderType: 'thumbnails' | 'avatars' | 'banners' | 'secure-products' | 'other';
  isSecure: boolean;
  publicUrl: string | null;
  directAccessBlocked: boolean;
}

interface FileCounts {
  thumbnails: number;
  avatars: number;
  banners: number;
  secureProducts: number;
  total: number;
}

type ActiveFolder = 'all' | 'thumbnails' | 'avatars' | 'banners' | 'secure-products';

export const StorageTab: React.FC<StorageTabProps> = ({ token }) => {
  // Config state
  const [config, setConfig] = useState<R2Config>({
    isConfigured: false,
    accountId: '',
    accessKeyId: '',
    hasSecretKey: false,
    secretAccessKeyMasked: '',
    bucketName: '',
    publicDomain: ''
  });
  const [secretKeyInput, setSecretKeyInput] = useState('');
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [savingConfig, setSavingConfig] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);

  // Status & Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    success: boolean;
    message: string;
    sampleCount?: number;
  } | null>(null);

  // File explorer state
  const [activeUserId, setActiveUserId] = useState('admin_primary');
  const [activeFolder, setActiveFolder] = useState<ActiveFolder>('thumbnails');
  const [files, setFiles] = useState<R2FileItem[]>([]);
  const [counts, setCounts] = useState<FileCounts>({
    thumbnails: 0,
    avatars: 0,
    banners: 0,
    secureProducts: 0,
    total: 0
  });
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');

  // Presigned URL generation modal/state
  const [presignedResult, setPresignedResult] = useState<{
    key: string;
    url: string;
    expiresAt: string;
    expiresInSeconds: number;
    filename: string;
  } | null>(null);
  const [generatingSignedUrl, setGeneratingSignedUrl] = useState<string | null>(null);

  // Security test result
  const [securityTestResult, setSecurityTestResult] = useState<{
    key: string;
    directBypassBlocked: boolean;
    directAccessStatus: string;
    securityGrade: string;
    protectionSummary: string;
  } | null>(null);
  const [testingSecurityForKey, setTestingSecurityForKey] = useState<string | null>(null);

  // Copy feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Load config on mount
  useEffect(() => {
    fetchConfig();
  }, [token]);

  const fetchConfig = async () => {
    setLoadingConfig(true);
    try {
      const res = await fetch('/api/admin/r2/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setConfig(data);
        if (data.isConfigured) {
          fetchFiles(activeUserId, activeFolder);
        }
      }
    } catch (err: any) {
      console.error('Failed to load R2 config', err);
    } finally {
      setLoadingConfig(false);
    }
  };

  // 2. Fetch files
  const fetchFiles = async (userId: string, folder: ActiveFolder) => {
    setLoadingFiles(true);
    try {
      const url = `/api/admin/r2/files?userId=${encodeURIComponent(userId)}&folder=${folder}`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFiles(data.files || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.error('Failed to list R2 files', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  // 3. Test connection
  const handleTestConnection = async () => {
    setTestingConnection(true);
    setConnectionStatus(null);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/r2/test-connection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: config.accountId,
          accessKeyId: config.accessKeyId,
          secretAccessKey: secretKeyInput || undefined,
          bucketName: config.bucketName
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setConnectionStatus({
          tested: true,
          success: true,
          message: data.message,
          sampleCount: data.sampleCount
        });
        setFeedback({ type: 'success', message: data.message });
      } else {
        setConnectionStatus({
          tested: true,
          success: false,
          message: data.error || 'Connection failed'
        });
        setFeedback({ type: 'error', message: data.error || 'Connection failed' });
      }
    } catch (err: any) {
      setConnectionStatus({
        tested: true,
        success: false,
        message: err.message || 'Network error testing Cloudflare R2'
      });
      setFeedback({ type: 'error', message: err.message || 'Network error' });
    } finally {
      setTestingConnection(false);
    }
  };

  // 4. Save config
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    setFeedback(null);

    try {
      const res = await fetch('/api/admin/r2/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: config.accountId,
          accessKeyId: config.accessKeyId,
          secretAccessKey: secretKeyInput || undefined,
          bucketName: config.bucketName,
          publicDomain: config.publicDomain
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save R2 configuration');

      setFeedback({ type: 'success', message: 'Cloudflare R2 credentials saved in database.' });
      setSecretKeyInput('');
      fetchConfig();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setSavingConfig(false);
    }
  };

  // 5. Upload file
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadProgressText(`Uploading ${file.name} to ${activeFolder}...`);
    setFeedback(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', activeUserId);
    formData.append('folderType', activeFolder === 'all' ? 'thumbnails' : activeFolder);

    try {
      const res = await fetch('/api/admin/r2/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');

      setFeedback({
        type: 'success',
        message: `${file.name} uploaded successfully to ${data.key}`
      });
      fetchFiles(activeUserId, activeFolder);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setUploading(false);
      setUploadProgressText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // 6. Delete file
  const handleDeleteFile = async (key: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${key}" from Cloudflare R2?`)) return;

    try {
      const res = await fetch('/api/admin/r2/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete file');

      setFeedback({ type: 'success', message: `Deleted ${key}` });
      fetchFiles(activeUserId, activeFolder);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  // 7. Generate presigned URL for secure download
  const handleGeneratePresignedUrl = async (key: string, filename: string) => {
    setGeneratingSignedUrl(key);
    setPresignedResult(null);

    try {
      const res = await fetch('/api/admin/r2/generate-signed-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          key,
          expiresInSeconds: 120, // 2 minutes
          downloadFilename: filename
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate signed download link');

      setPresignedResult({
        key: data.key,
        url: data.signedUrl,
        expiresAt: data.expiresAt,
        expiresInSeconds: data.expiresInSeconds,
        filename: data.filename
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setGeneratingSignedUrl(null);
    }
  };

  // 8. Run Security & Direct Bypass Verification Test
  const handleRunSecurityTest = async (key: string) => {
    setTestingSecurityForKey(key);
    setSecurityTestResult(null);

    try {
      const res = await fetch('/api/admin/r2/test-security', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ key })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to run security test');

      setSecurityTestResult({
        key: data.key,
        directBypassBlocked: data.directBypassBlocked,
        directAccessStatus: data.directAccessStatus,
        securityGrade: data.securityGrade,
        protectionSummary: data.protectionSummary
      });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    } finally {
      setTestingSecurityForKey(null);
    }
  };

  const copyToClipboard = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(identifier);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Cloudflare R2 Storage</h1>
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                config.isConfigured
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  config.isConfigured ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              {config.isConfigured ? 'Storage Active' : 'Setup Required'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Configure your Cloudflare R2 credentials directly from this panel. Uses a single bucket architecture
            where all files are strictly isolated under each user's unique ID folder (<code className="text-slate-700 font-mono font-medium">{'{userId}/'}</code>), with zero public direct access on private digital packages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchConfig}
            disabled={loadingConfig}
            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            title="Refresh Status"
          >
            <RefreshCw className={`w-4 h-4 ${loadingConfig ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Global Notice Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs flex items-start gap-3 border transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
          )}
          <div className="flex-1 font-medium leading-relaxed">{feedback.message}</div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-slate-600 font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Grid: Credentials Form & Architecture Explainer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Credentials Configuration Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">R2 Storage Credentials</h2>
                <p className="text-[11px] text-slate-400">Stored securely in database • No .env editing needed</p>
              </div>
            </div>
            {config.bucketName && (
              <span className="font-mono text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                {config.bucketName}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveConfig} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Cloudflare Account ID <span className="text-orange-600">*</span>
              </label>
              <input
                type="text"
                required
                value={config.accountId}
                onChange={(e) => setConfig({ ...config, accountId: e.target.value })}
                placeholder="e.g. 8f6b4d32a10e7c54123456789abcdef0"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Found in your Cloudflare dashboard URL or on the Workers & R2 Overview page.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  R2 Access Key ID <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={config.accessKeyId}
                  onChange={(e) => setConfig({ ...config, accessKeyId: e.target.value })}
                  placeholder="e.g. 9b7a42c8d10e5f..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  R2 Bucket Name <span className="text-orange-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={config.bucketName}
                  onChange={(e) => setConfig({ ...config, bucketName: e.target.value })}
                  placeholder="e.g. kroma-marketplace-assets"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  R2 Secret Access Key <span className="text-orange-600">*</span>
                </label>
                {config.hasSecretKey && !secretKeyInput && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Key saved in database
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  value={secretKeyInput}
                  onChange={(e) => setSecretKeyInput(e.target.value)}
                  placeholder={
                    config.hasSecretKey
                      ? config.secretAccessKeyMasked || '••••••••••••••••••••••••••••••••'
                      : 'Paste your Cloudflare R2 Secret Access Key'
                  }
                  className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Generated from Cloudflare &gt; R2 &gt; Manage R2 API Tokens with Object Read &amp; Write permissions.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Public Custom Domain / CDN URL (Optional)
              </label>
              <input
                type="text"
                value={config.publicDomain}
                onChange={(e) => setConfig({ ...config, publicDomain: e.target.value })}
                placeholder="e.g. https://assets.omyra.org or https://pub-xxxx.r2.dev"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Used to fast-serve public thumbnails, avatars, and shop banners globally via Cloudflare CDN.
              </span>
            </div>

            {/* Test Connection Result Box */}
            {connectionStatus && (
              <div
                className={`p-3.5 rounded-xl border text-xs flex items-center justify-between ${
                  connectionStatus.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  {connectionStatus.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span className="font-medium">{connectionStatus.message}</span>
                </div>
                {connectionStatus.success && connectionStatus.sampleCount !== undefined && (
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Verified
                  </span>
                )}
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection || (!config.accountId && !config.bucketName)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testingConnection ? 'animate-spin' : ''}`} />
                <span>{testingConnection ? 'Pinging R2...' : 'Test Connection'}</span>
              </button>

              <button
                type="submit"
                disabled={savingConfig}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-50"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{savingConfig ? 'Saving...' : 'Save Credentials'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Multi-Vendor Isolated Folder Architecture Explainer */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700">
                <FolderTree className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Single Bucket Architecture</h3>
                <p className="text-[11px] text-slate-400">Strict multi-vendor &amp; user isolation</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Every digital asset uploaded to your single bucket is programmatically routed under a top-level root folder matching the user’s or vendor’s <strong>Unique User ID</strong>:
            </p>

            {/* Tree display */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs leading-relaxed overflow-x-auto shadow-inner">
              <div className="text-slate-400 mb-2"># R2 Bucket Object Key Prefix Hierarchy</div>
              <div className="text-orange-400 font-bold">{config.bucketName || 'my-marketplace-bucket'}/</div>
              <div className="pl-4 text-emerald-400">
                └── <span className="text-white font-bold">{'{userId}'}/</span>{' '}
                <span className="text-slate-500 text-[10px]">(e.g. admin_primary or vendor_id)</span>
              </div>
              <div className="pl-8 text-sky-300">
                ├── <span className="font-bold text-sky-200">public/</span>
              </div>
              <div className="pl-12 text-slate-300">
                ├── <span className="text-amber-300">thumbnails/</span> <span className="text-slate-500 text-[10px]">(Cover art, cards)</span>
              </div>
              <div className="pl-12 text-slate-300">
                ├── <span className="text-amber-300">avatars/</span> <span className="text-slate-500 text-[10px]">(Profile photos)</span>
              </div>
              <div className="pl-12 text-slate-300">
                └── <span className="text-amber-300">banners/</span> <span className="text-slate-500 text-[10px]">(Shop hero banners)</span>
              </div>
              <div className="pl-8 text-red-300">
                └── <span className="font-bold text-red-200">private/</span>
              </div>
              <div className="pl-12 text-red-200 font-semibold">
                └── <span className="text-red-400">secure-products/</span> <span className="text-slate-400 text-[10px]">(Zip packages)</span>
              </div>
            </div>

            {/* World-Class Security Banner */}
            <div className="p-3.5 bg-orange-50/70 border border-orange-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950">
                <Lock className="w-3.5 h-3.5 text-orange-600" />
                <span>Zero-Bypass Cryptographic Security</span>
              </div>
              <p className="text-[11px] text-orange-900 leading-relaxed">
                Files inside <code className="font-mono bg-orange-100 px-1 rounded text-orange-800">private/secure-products/</code> reject direct HTTP GET requests. Customers only receive short-lived (120s) AWS SigV4 presigned URLs generated server-side after payment verification.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Multi-vendor ready</span>
            <span className="text-emerald-600 font-medium">Automatic Folder Provisioning</span>
          </div>
        </div>
      </div>

      {/* Cloudflare R2 Bucket Explorer & File Manager */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Explorer Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Bucket File Explorer</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Active Scope:</span>
                <span className="font-mono font-semibold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
                  {config.bucketName || 'Bucket'}/{activeUserId}/
                </span>
              </div>
            </div>
          </div>

          {/* User ID Selector & Upload Trigger */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs text-slate-500 font-medium">User Folder:</span>
              <input
                type="text"
                value={activeUserId}
                onChange={(e) => setActiveUserId(e.target.value)}
                onBlur={() => fetchFiles(activeUserId, activeFolder)}
                placeholder="admin_primary"
                className="w-32 bg-transparent text-xs font-mono font-bold text-slate-800 focus:outline-none"
              />
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={!config.isConfigured || uploading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all disabled:opacity-50"
            >
              <UploadCloud className={`w-4 h-4 ${uploading ? 'animate-bounce' : ''}`} />
              <span>
                {uploading ? uploadProgressText || 'Uploading...' : `Upload to ${activeFolder === 'all' ? 'thumbnails' : activeFolder}`}
              </span>
            </button>
          </div>
        </div>

        {/* Folder Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'thumbnails' as ActiveFolder, label: 'Thumbnails', count: counts.thumbnails, icon: ImageIcon, isSecure: false },
            { id: 'secure-products' as ActiveFolder, label: 'Secure Zip Packages', count: counts.secureProducts, icon: FileArchive, isSecure: true },
            { id: 'avatars' as ActiveFolder, label: 'Profile Avatars', count: counts.avatars, icon: User, isSecure: false },
            { id: 'banners' as ActiveFolder, label: 'Shop Banners', count: counts.banners, icon: Layout, isSecure: false },
            { id: 'all' as ActiveFolder, label: 'All Files', count: counts.total, icon: Cloud, isSecure: false },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFolder === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFolder(tab.id);
                  fetchFiles(activeUserId, tab.id);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
                {tab.isSecure && (
                  <Lock className={`w-3 h-3 ${isActive ? 'text-orange-400' : 'text-orange-600'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Presigned Download Result Banner */}
        {presignedResult && (
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
                <Clock className="w-4 h-4 text-orange-600" />
                <span>Temporary Cryptographic Presigned Download Link Generated</span>
              </div>
              <span className="text-[11px] font-mono text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                Valid for {presignedResult.expiresInSeconds}s
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={presignedResult.url}
                className="flex-1 px-3 py-1.5 bg-white border border-orange-200 rounded-lg text-xs font-mono text-slate-800"
              />
              <button
                onClick={() => copyToClipboard(presignedResult.url, 'presigned')}
                className="px-3 py-1.5 bg-orange-600 text-white rounded-lg text-xs font-semibold hover:bg-orange-700 transition-colors shrink-0"
              >
                {copiedKey === 'presigned' ? 'Copied!' : 'Copy Link'}
              </button>
              <a
                href={presignedResult.url}
                download={presignedResult.filename}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Test Download</span>
              </a>
            </div>
            <p className="text-[10px] text-orange-800">
              This link is signed with AWS SigV4. It can only be used until {new Date(presignedResult.expiresAt).toLocaleTimeString()}, after which Cloudflare R2 will reject all requests.
            </p>
          </div>
        )}

        {/* Security Audit Verification Box */}
        {securityTestResult && (
          <div className="p-4 bg-slate-900 text-white rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Live Security &amp; Direct Bypass Verification Report</span>
              </div>
              <span className="text-[11px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
                Security Grade: {securityTestResult.securityGrade}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-mono space-y-1">
              <div>• Direct Anonymous Access: <strong className={securityTestResult.directBypassBlocked ? 'text-emerald-400' : 'text-red-400'}>{securityTestResult.directAccessStatus}</strong></div>
              <div>• Presigned Authorization: <strong className="text-emerald-400">Active (120s SigV4 Cryptographic Token)</strong></div>
              <div>• Verdict: <span className="text-slate-300">{securityTestResult.protectionSummary}</span></div>
            </div>
          </div>
        )}

        {/* File Table / Explorer */}
        {!config.isConfigured ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mx-auto">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Cloudflare R2 is not configured yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Please enter your Account ID, Access Key ID, Secret Access Key, and Bucket Name above and click Save Credentials to connect your bucket.
            </p>
          </div>
        ) : loadingFiles ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto text-orange-600" />
            <div>Reading Cloudflare R2 bucket hierarchy for {activeUserId}...</div>
          </div>
        ) : files.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 space-y-3">
            <div className="w-12 h-12 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 mx-auto">
              <FileArchive className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">No files found in {activeFolder}</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No objects have been uploaded to <code className="font-mono text-slate-700">{activeUserId}/{activeFolder}/</code> yet. Click the upload button above to add assets.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Asset / Filename</th>
                  <th className="py-3 px-4">Folder Scope</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Protection Level</th>
                  <th className="py-3 px-4">Uploaded</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {files.map((file) => (
                  <tr key={file.key} className="hover:bg-slate-50/70 transition-colors">
                    {/* Filename & Key */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          file.isSecure ? 'bg-red-50 text-red-600' : 'bg-sky-50 text-sky-600'
                        }`}>
                          {file.isSecure ? <FileArchive className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-xs">
                            {file.filename}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 truncate max-w-[240px]">
                            {file.key}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Folder Scope */}
                    <td className="py-3 px-4">
                      <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {file.folderType}
                      </span>
                    </td>

                    {/* Size */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {formatBytes(file.size)}
                    </td>

                    {/* Protection */}
                    <td className="py-3 px-4">
                      {file.isSecure ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                          <Lock className="w-3 h-3 text-red-600" />
                          Zero-Bypass Protected
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          <Unlock className="w-3 h-3 text-emerald-600" />
                          Public CDN Deliverable
                        </span>
                      )}
                    </td>

                    {/* Last Modified */}
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(file.lastModified).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* If public, allow copying public CDN URL */}
                        {file.publicUrl && (
                          <button
                            onClick={() => copyToClipboard(file.publicUrl!, file.key)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Copy Public CDN URL"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* If secure, generate presigned download URL */}
                        {file.isSecure && (
                          <>
                            <button
                              onClick={() => handleGeneratePresignedUrl(file.key, file.filename)}
                              disabled={generatingSignedUrl === file.key}
                              className="px-2.5 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors"
                              title="Generate 120s Presigned Download Link"
                            >
                              <Key className={`w-3 h-3 ${generatingSignedUrl === file.key ? 'animate-spin' : ''}`} />
                              <span>Sign Download</span>
                            </button>

                            <button
                              onClick={() => handleRunSecurityTest(file.key)}
                              disabled={testingSecurityForKey === file.key}
                              className="p-1.5 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Verify Direct Access is Blocked (403)"
                            >
                              <ShieldAlert className={`w-3.5 h-3.5 ${testingSecurityForKey === file.key ? 'animate-spin' : ''}`} />
                            </button>
                          </>
                        )}

                        {/* Delete button */}
                        <button
                          onClick={() => handleDeleteFile(file.key)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete from R2"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
