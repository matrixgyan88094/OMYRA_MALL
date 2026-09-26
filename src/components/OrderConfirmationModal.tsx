import React, { useState } from 'react';
import {
  CheckCircle2,
  Download,
  Copy,
  Check,
  ArrowRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrderConfirmationModal: React.FC = () => {
  const {
    lastCompletedOrder,
    isOrderModalOpen,
    setIsOrderModalOpen,
    simulateDownload,
    setActiveView,
  } = useStore();

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOrderModalOpen || !lastCompletedOrder) return null;

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGoToLibrary = () => {
    setIsOrderModalOpen(false);
    setActiveView('library');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white text-zinc-900 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setIsOrderModalOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Celebration Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="h-14 w-14 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-orange-600" />
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-orange-600">
              Order Confirmed
            </div>
            <h2 className="text-2xl font-bold text-zinc-950 mt-1">
              Your Digital Assets Are Ready
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 mt-1 max-w-md">
              Order <span className="font-mono font-semibold text-zinc-900">{lastCompletedOrder.orderNumber}</span> completed. A receipt and download links were sent to{' '}
              <span className="font-medium text-zinc-900">{lastCompletedOrder.customerEmail}</span>.
            </p>
          </div>
        </div>

        {/* Purchased Items */}
        <div className="space-y-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
            Purchased Licenses & Downloads
          </span>

          <div className="space-y-3">
            {lastCompletedOrder.items.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-zinc-200 bg-zinc-50 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900">{item.productTitle}</h4>
                    <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                      <span className="text-orange-600 font-medium">{item.tierLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{item.format}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono">{item.fileSize}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => simulateDownload(item)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-xs font-semibold text-white hover:bg-orange-700 shadow-sm active:scale-95 transition-all min-h-[40px]"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Package</span>
                  </button>
                </div>

                {/* License Key Box */}
                <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3 py-2">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-zinc-500">License Key:</span>
                    <span className="font-mono font-bold text-zinc-900 tracking-wider">
                      {item.licenseKey}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyKey(item.licenseKey)}
                    className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-700 font-medium"
                  >
                    {copiedKey === item.licenseKey ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Navigation Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-zinc-200">
          <div className="flex items-center gap-1.5 text-xs text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span>Lifetime access backed up in your library</span>
          </div>

          <button
            onClick={handleGoToLibrary}
            className="flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors w-full sm:w-auto"
          >
            <span>View in My Library</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
