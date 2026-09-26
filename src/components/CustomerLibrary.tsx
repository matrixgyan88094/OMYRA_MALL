import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  Search,
  ArrowRight,
  FolderArchive,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CustomerLibrary: React.FC = () => {
  const { purchasedItems, simulateDownload, setActiveView } = useStore();
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredPurchases = purchasedItems.filter(
    (item) =>
      item.productTitle.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.licenseKey.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header zone */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-200">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-orange-600 mb-1">
            Customer Library
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-950">
            My Purchased Digital Goods
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Access your acquired design systems, code boilerplates, and 3D assets with active license keys.
          </p>
        </div>

        <button
          onClick={() => setActiveView('store')}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-orange-700 transition-colors self-start sm:self-auto min-h-[44px]"
        >
          <span>Browse More Assets</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {/* Search & Filter */}
      {purchasedItems.length > 0 && (
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search your library..."
              className="w-full rounded-lg border border-zinc-200 bg-white py-2 pl-9 pr-4 text-xs text-zinc-900 placeholder-zinc-400 focus:border-orange-500 focus:outline-none min-h-[40px] shadow-sm"
            />
          </div>

          <span className="text-xs text-zinc-500">
            <span className="font-semibold text-zinc-900">
              {filteredPurchases.length}
            </span>{' '}
            assets available
          </span>
        </div>
      )}

      {/* Library Grid or Empty State */}
      {purchasedItems.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 mx-auto">
            <FolderArchive className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-zinc-900">No Assets in Your Library Yet</h3>
          <p className="text-xs text-zinc-600 leading-relaxed">
            When you complete a purchase, your digital asset packages, version updates, and license keys will appear here instantly for unlimited downloads.
          </p>
          <button
            onClick={() => setActiveView('store')}
            className="rounded-lg bg-orange-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-orange-700 transition-colors inline-block"
          >
            Visit Marketplace Storefront
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPurchases.map((item) => (
            <div
              key={item.licenseKey}
              className="rounded-xl border border-zinc-200 bg-white p-5 space-y-4 shadow-xs hover:border-orange-300 transition-all"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-base font-semibold text-zinc-950">
                    {item.productTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                    <span className="text-orange-600 font-medium">{item.tierLabel}</span>
                    <span>·</span>
                    <span className="font-mono">{item.format}</span>
                    <span>·</span>
                    <span className="font-mono">{item.fileSize}</span>
                  </div>
                </div>

                <button
                  onClick={() => simulateDownload(item)}
                  className="flex items-center gap-1.5 rounded-lg bg-orange-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-orange-700 transition-colors shadow-sm shrink-0"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download</span>
                </button>
              </div>

              {/* License key container */}
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-zinc-500 font-medium">Commercial License Key:</span>
                  <button
                    onClick={() => handleCopyKey(item.licenseKey)}
                    className="flex items-center gap-1 text-[11px] text-orange-600 hover:text-orange-700 font-semibold"
                  >
                    {copiedKey === item.licenseKey ? (
                      <>
                        <Check className="h-3 w-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        <span>Copy Key</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="font-mono text-xs font-bold text-zinc-900 tracking-wider">
                  {item.licenseKey}
                </div>
              </div>

              {/* Metadata footer */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                <span>Version v{item.version} · Commercial License</span>
                <span className="text-emerald-600 font-medium">Active & Valid</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
