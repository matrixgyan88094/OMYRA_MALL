import React from 'react';
import { Mail } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { setActiveView } = useStore();

  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 text-zinc-600 pt-16 pb-24 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-zinc-200">
          {/* Brand & Vendor Bio */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-600 text-base font-bold text-white shadow-sm">
                K
              </div>
              <span className="text-lg font-bold tracking-tight text-zinc-950">
                Kroma
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed max-w-md">
              Kroma is an independent digital studio creating enterprise UI kits, React boilerplates, and 3D graphics. Engineered with high production standards and continuous updates.
            </p>

            <div className="flex items-center gap-4 text-xs pt-1">
              <a
                href="mailto:support@kroma.design"
                className="flex items-center gap-1.5 text-zinc-900 hover:text-orange-600 transition-colors font-medium"
              >
                <Mail className="h-3.5 w-3.5 text-orange-600" />
                <span>support@kroma.design</span>
              </a>
              <span className="text-zinc-300">·</span>
              <span className="text-zinc-500">Commercial Licensing Included</span>
            </div>
          </div>

          {/* Guarantees */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Guarantees
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                <span>Instant automated file delivery</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                <span>Free lifetime version upgrades</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-600" />
                <span>Commercial client usage rights</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-zinc-600">
              <li>
                <button
                  onClick={() => setActiveView('store')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Storefront Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('library')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Customer Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveView('vendor')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Creator Studio Management
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Kroma Studio. All digital products delivered under standard commercial license terms.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>License Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
