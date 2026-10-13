import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { HeroCategoryCards } from './components/HeroCategoryCards';
import { ProductSections } from './components/ProductSections';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { CustomerLibrary } from './components/CustomerLibrary';
import { VendorDashboard } from './components/VendorDashboard';
import { MobileNav } from './components/MobileNav';
import { Footer } from './components/Footer';
import { AdminLayout } from './components/AdminPanel/AdminLayout';
import { AdminLogin } from './components/AdminPanel/AdminLogin';
import { NotFoundPage } from './components/NotFoundPage';
import { SingleProductDetailPage } from './components/SingleProductDetailPage';
import { Shield, Zap, CheckCircle2, Lock } from 'lucide-react';

const ADMIN_TOKEN_KEY = 'omyra_admin_token';
const ADMIN_EMAIL_KEY = 'omyra_admin_email';

const StorefrontContent: React.FC = () => {

  return (
    <>
      {/* Hero Showcase */}
      <HeroBanner />

      {/* Colorful Category Cards (Exact matching screenshot at bottom of hero) */}
      <HeroCategoryCards />

      {/* Main Catalog Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* Curated Product Sections: Featured, Trending, and Newest Products */}
        <ProductSections />

        {/* Standards & Enterprise Reliability */}
        <section id="about" className="mt-14 pt-10 border-t border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-2">
              <span className="inline-flex items-center text-[11px] font-medium text-orange-600 bg-orange-50 border border-orange-200/60 px-2 py-0.5 rounded-md">
                Quality Assurance
              </span>
              <h2 className="text-base sm:text-lg font-semibold text-zinc-900 tracking-tight">
                Enterprise Standards in Every File
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Unlike open marketplaces filled with abandoned files and messy codebases, every asset on OMYRA MALL is engineered to high production standards, thoroughly documented, and actively updated.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-1.5 shadow-xs">
                <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-zinc-900">Zero Unnecessary Bloat</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Clean, production-grade files without extraneous packages or messy layers.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-1.5 shadow-xs">
                <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-zinc-900">Direct Author Support</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Architecture questions or token adjustments? Get prompt, direct technical support.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-1.5 shadow-xs">
                <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-zinc-900">Continuous Updates</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Whenever Figma, Tailwind, or Next.js update major versions, new builds are provided free.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-1.5 shadow-xs">
                <div className="h-7 w-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <h3 className="text-xs font-semibold text-zinc-900">Clear Commercial Rights</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Transparent multi-tier licenses with itemized rights for individuals and agencies.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const MarketplaceShell: React.FC = () => {
  const { activeView, setActiveView, selectedProduct, setSelectedProduct } = useStore();

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      <Header />
      <div className="flex-1">
        {activeView === 'product-detail' || (selectedProduct && activeView === 'store') ? (
          <SingleProductDetailPage
            product={selectedProduct}
            onBack={() => {
              setSelectedProduct(null);
              setActiveView('store');
            }}
          />
        ) : (
          <>
            {activeView === 'store' && <StorefrontContent />}
            {activeView === 'library' && <CustomerLibrary />}
            {activeView === 'vendor' && <VendorDashboard />}
          </>
        )}
      </div>
      <CartDrawer />
      <OrderConfirmationModal />
      <Footer />
      <MobileNav />
    </div>
  );
};

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);
  const [adminAlias, setAdminAlias] = useState<string>('md1620');
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY) || localStorage.getItem('kroma_admin_token'));
  const [adminEmail, setAdminEmail] = useState<string>(() => localStorage.getItem(ADMIN_EMAIL_KEY) || localStorage.getItem('kroma_admin_email') || 'developer995500@gmail.com');
  const [isAliasLoaded, setIsAliasLoaded] = useState(false);

  // Fetch active admin alias from server
  useEffect(() => {
    fetch('/api/admin/alias')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.alias) {
          setAdminAlias(data.alias);
        }
      })
      .catch(err => console.log('Alias fetch notice:', err))
      .finally(() => setIsAliasLoaded(true));
  }, []);

  // Sync window navigation events (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  const handleAdminLoginSuccess = (token: string, email: string, alias: string) => {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    localStorage.setItem(ADMIN_EMAIL_KEY, email);
    setAdminToken(token);
    setAdminEmail(email);
    setAdminAlias(alias);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAdminToken(null);
  };

  const handleAliasUpdated = (newAlias: string) => {
    setAdminAlias(newAlias);
    navigateTo(`/${newAlias}`);
  };

  // Route Analysis
  const cleanedPath = currentPath.replace(/^\/+/, '').replace(/\/+$/, '');
  const isRoot = cleanedPath === '' || cleanedPath.startsWith('#');
  const isAdminPath = isAliasLoaded && cleanedPath === adminAlias;

  // If wrong path specified (e.g. /admin, /dashboard, or wrong alias), show 404 page!
  const isInvalidAdminOrUnknown = !isRoot && !isAdminPath;

  if (isInvalidAdminOrUnknown) {
    return (
      <NotFoundPage
        attemptedPath={currentPath}
        onGoHome={() => navigateTo('/')}
      />
    );
  }

  // Admin Gateway
  if (isAdminPath) {
    if (!adminToken) {
      return (
        <AdminLogin
          currentAlias={adminAlias}
          onSuccess={handleAdminLoginSuccess}
          onGoHome={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminLayout
        token={adminToken}
        adminEmail={adminEmail}
        currentAlias={adminAlias}
        onLogout={handleAdminLogout}
        onGoHome={() => navigateTo('/')}
        onAliasUpdated={handleAliasUpdated}
        onEmailUpdated={(email) => {
          setAdminEmail(email);
          localStorage.setItem(ADMIN_EMAIL_KEY, email);
        }}
      />
    );
  }

  // Marketplace Storefront (Path is /)
  return (
    <StoreProvider>
      <MarketplaceShell />
    </StoreProvider>
  );
}
