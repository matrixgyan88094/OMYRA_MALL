import React, { useState } from 'react';
import { Download, FileText, CheckCircle2, ShoppingBag, ShieldCheck, RefreshCw, Key, ArrowRight, Compass } from 'lucide-react';

interface PurchasedAsset {
  id: string;
  title: string;
  price: number;
  coverImage: string;
  category: string;
  downloadUrl: string;
}

interface LibraryProps {
  purchasedAssets: PurchasedAsset[];
  onBrowseMall: () => void;
}

export default function Library({
  purchasedAssets,
  onBrowseMall
}: LibraryProps) {
  // Track download states: { [productId]: 'idle' | 'downloading' | 'completed' }
  const [downloadStates, setDownloadStates] = useState<{ [key: string]: 'idle' | 'downloading' | 'completed' }>({});
  // Track download progress value: { [productId]: number }
  const [downloadProgress, setDownloadProgress] = useState<{ [key: string]: number }>({});
  // Track license keys generated: { [productId]: string }
  const [licenseKeys, setLicenseKeys] = useState<{ [key: string]: string }>({});

  const handleDownloadAsset = (assetId: string) => {
    // Initiate downloading simulation
    setDownloadStates(prev => ({ ...prev, [assetId]: 'downloading' }));
    setDownloadProgress(prev => ({ ...prev, [assetId]: 0 }));

    // Generate simulated license key
    if (!licenseKeys[assetId]) {
      const p1 = Math.random().toString(36).substring(2, 7).toUpperCase();
      const p2 = Math.random().toString(36).substring(2, 7).toUpperCase();
      const p3 = Math.random().toString(36).substring(2, 7).toUpperCase();
      setLicenseKeys(prev => ({ ...prev, [assetId]: `LIC-${p1}-${p2}-${p3}` }));
    }

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        const current = prev[assetId] || 0;
        if (current >= 100) {
          clearInterval(interval);
          setDownloadStates(state => ({ ...state, [assetId]: 'completed' }));
          return prev;
        }
        return { ...prev, [assetId]: current + Math.floor(10 + Math.random() * 15) };
      });
    }, 250);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'templates': return 'UI Template';
      case 'code': return 'Developer Code';
      case 'ebooks': return 'Interactive Book';
      case 'design': return '3D Asset Bundle';
      case 'audio': return 'Master Audio beats';
      default: return category;
    }
  };

  return (
    <div id="library-dashboard" className="space-y-6">
      
      {/* Visual greeting card banner */}
      <div className="rounded-[32px] border border-white/10 bg-[#161618] p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-32 w-32 bg-[#D4FF5E]/5 rounded-bl-full pointer-events-none" />
        <div className="max-w-xl">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#D4FF5E] bg-[#D4FF5E]/10 border border-[#D4FF5E]/20 px-3 py-1.5 rounded-full">
            Purchases Dashboard
          </span>
          <h1 className="mt-4 font-display text-2xl md:text-3xl font-black uppercase italic tracking-tight text-white">
            My Purchased Digital Assets
          </h1>
          <p className="mt-2.5 text-xs md:text-sm text-[#8E9299] leading-relaxed font-medium">
            Instant secured access to your purchased licenses, developers guidelines, and clean asset downloads. Everything is backed up and synchronized forever.
          </p>
        </div>
      </div>

      {/* Main product listings inside library */}
      {purchasedAssets.length === 0 ? (
        <div id="library-empty-state" className="rounded-[32px] border border-white/10 bg-[#161618] p-12 text-center flex flex-col items-center justify-center max-w-md mx-auto">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/5 border border-white/5 text-[#8E9299] mb-4">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest text-white">No assets in your library</h3>
          <p className="mt-2 text-xs text-[#8E9299] leading-relaxed">
            You haven't completed any purchases on OMYRA MALL yet. Explore our high-quality listings!
          </p>
          <button
            id="lib-browse-mall-btn"
            onClick={onBrowseMall}
            className="mt-6 rounded-xl bg-[#D4FF5E] px-6 py-3 text-xs font-black uppercase tracking-widest text-black hover:bg-[#c3ec4e] transition-all flex items-center gap-2 cursor-pointer"
          >
            <Compass className="h-4 w-4 text-black" />
            <span>Browse OMYRA MALL</span>
          </button>
        </div>
      ) : (
        <div id="library-assets-grid" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchasedAssets.map((asset) => {
            const status = downloadStates[asset.id] || 'idle';
            const progress = downloadProgress[asset.id] || 0;
            const lKey = licenseKeys[asset.id];

            return (
              <div 
                key={asset.id} 
                id={`purchased-asset-${asset.id}`}
                className="rounded-3xl border border-white/10 bg-[#161618] p-5 flex flex-col md:flex-row gap-5 hover:border-[#D4FF5E]/30 transition-all duration-300"
              >
                {/* Visual Backdrop preview */}
                <div 
                  className="h-24 md:h-full w-full md:w-32 rounded-2xl overflow-hidden shrink-0 flex flex-col items-center justify-center relative p-4 text-center min-h-[96px]"
                  style={{ background: asset.coverImage }}
                >
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:8px_8px]" />
                  <span className="z-10 text-[9px] font-black text-white uppercase tracking-wider drop-shadow bg-black/40 px-2 py-0.5 rounded border border-white/5">{getCategoryLabel(asset.category)}</span>
                  <span className="z-10 text-[8px] font-mono text-[#D4FF5E] mt-1 drop-shadow opacity-95 uppercase font-bold">Zip Pack</span>
                </div>

                {/* Info and Download controller */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[9px] font-mono font-bold text-[#8E9299] uppercase tracking-wider">{asset.category}</span>
                      <span className="text-[8px] font-black uppercase tracking-widest text-[#D4FF5E] bg-[#D4FF5E]/10 px-2 py-0.5 rounded flex items-center gap-0.5 border border-[#D4FF5E]/10">
                        <ShieldCheck className="h-3 w-3" />
                        Active License
                      </span>
                    </div>
                    <h3 className="truncate text-sm font-black uppercase text-white leading-snug tracking-tight mt-1">{asset.title}</h3>
                  </div>

                  {/* Interactive download status */}
                  <div className="mt-4 space-y-3.5">
                    {status === 'idle' && (
                      <button
                        id={`btn-dl-${asset.id}`}
                        onClick={() => handleDownloadAsset(asset.id)}
                        className="w-full rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 px-3.5 py-3 text-xs font-bold uppercase tracking-wider text-[#F4F4F4] transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="h-4 w-4 text-[#D4FF5E]" />
                        <span>Download Archive</span>
                      </button>
                    )}

                    {status === 'downloading' && (
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-[#8E9299]">
                          <span className="flex items-center gap-1.5">
                            <RefreshCw className="h-3.5 w-3.5 text-[#D4FF5E] animate-spin" />
                            Compressing archives...
                          </span>
                          <span className="font-mono text-white">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#0A0A0B] rounded-full overflow-hidden border border-white/5">
                          <div 
                            className="h-full bg-[#D4FF5E] rounded-full transition-all duration-300" 
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {status === 'completed' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-400">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          <span>Archive download ready</span>
                        </div>

                        {/* License widget */}
                        {lKey && (
                          <div className="rounded-xl bg-[#0A0A0B] border border-white/5 p-2.5 text-[10px] font-mono flex items-center justify-between text-slate-400 gap-2">
                            <span className="flex items-center gap-1 text-[#F4F4F4] font-bold">
                              <Key className="h-3.5 w-3.5 text-[#D4FF5E]" />
                              <span className="truncate">{lKey}</span>
                            </span>
                            <span className="text-[8px] font-sans font-black text-[#D4FF5E] uppercase tracking-widest bg-[#D4FF5E]/10 px-2 py-0.5 rounded">
                              Active
                            </span>
                          </div>
                        )}

                        <button
                          id={`btn-redl-${asset.id}`}
                          onClick={() => handleDownloadAsset(asset.id)}
                          className="text-[9px] text-[#8E9299] hover:text-white uppercase font-bold tracking-widest flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <RefreshCw className="h-3 w-3 text-[#D4FF5E]" />
                          Download Again
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
