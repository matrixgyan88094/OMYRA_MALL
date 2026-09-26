import React from 'react';
import { ArrowLeft, ShieldAlert, Home } from 'lucide-react';

interface NotFoundPageProps {
  attemptedPath?: string;
  onGoHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ attemptedPath, onGoHome }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      {/* Top minimal header */}
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-orange-600/20">
              K
            </div>
            <span className="font-bold text-slate-900 tracking-tight text-lg">Kroma Studio</span>
          </div>

          <button
            onClick={onGoHome}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-orange-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Store
          </button>
        </div>
      </header>

      {/* Main 404 Animated Centerpiece */}
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Animated 404 visual */}
          <div className="relative mb-8 inline-block">
            <div className="absolute -inset-4 bg-orange-100 rounded-3xl blur-xl opacity-70 animate-pulse" />
            <div className="relative bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <ShieldAlert className="w-8 h-8 animate-bounce" />
              </div>
              <span className="font-mono text-5xl font-black text-slate-900 tracking-tight">
                404
              </span>
              <div className="mt-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                Access Restricted • Page Not Found
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-3">
            Destination Unavailable
          </h1>

          <p className="text-slate-600 text-sm leading-relaxed mb-6">
            The page <span className="font-mono bg-slate-200/70 px-2 py-0.5 rounded text-slate-800 font-semibold">{attemptedPath || window.location.pathname}</span> does not exist or has been relocated behind a protected administrative alias.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={onGoHome}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-orange-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Home className="w-4 h-4" />
              Go to Marketplace
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto px-6 py-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-all"
            >
              Retry Connection
            </button>
          </div>
        </div>
      </main>

      {/* Footer minimal info */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        Kroma Studio Single-Vendor Digital Ecosystem • Security Protected Gateway
      </footer>
    </div>
  );
};
