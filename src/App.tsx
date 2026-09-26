import React, { useState, useEffect, useRef } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { FilterBar } from './components/FilterBar';
import { ProductCard } from './components/ProductCard';
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
import { Shield, Zap, CheckCircle2, Lock } from 'lucide-react';

const ADMIN_TOKEN_KEY = 'kroma_admin_token';
const ADMIN_EMAIL_KEY = 'kroma_admin_email';

const StorefrontContent: React.FC = () => {
  const {
    products,
    searchQuery,
    selectedCategory,
    selectedFormat,
    sortBy,
  } = useStore();

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    if (prod.status === 'draft') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = prod.title.toLowerCase().includes(q);
      const matchTagline = prod.tagline.toLowerCase().includes(q);
      const matchCat = prod.category.toLowerCase().includes(q);
      const matchFormat = prod.format.toLowerCase().includes(q);
      if (!matchTitle && !matchTagline && !matchCat && !matchFormat) return false;
    }

    if (selectedCategory !== 'All' && prod.category !== selectedCategory) {
      return false;
    }

    if (selectedFormat !== 'All' && prod.format !== selectedFormat) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'popular') return b.salesCount - a.salesCount;
    if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (sortBy === 'price-low') {
      const priceA = a.salePrice ?? a.basePrice;
      const priceB = b.salePrice ?? b.basePrice;
      return priceA - priceB;
    }
    if (sortBy === 'price-high') {
      const priceA = a.salePrice ?? a.basePrice;
      const priceB = b.salePrice ?? b.basePrice;
      return priceB - priceA;
    }
    return 0;
  });

  return (
    <>
      {/* Hero Showcase */}
      <HeroBanner />

      {/* Main Catalog Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* Filter & Search Bar */}
        <FilterBar searchInputRef={searchInputRef} totalCount={sortedProducts.length} />

        {/* Product Grid */}
        {sortedProducts.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-12 text-center max-w-md mx-auto my-8">
            <p className="text-sm font-semibold text-zinc-900">No products matched your criteria</p>
            <p className="text-xs text-zinc-500 mt-1">
              Try adjusting your category filter or search terms.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Standards & Enterprise Reliability */}
        <section id="about" className="mt-20 pt-14 border-t border-zinc-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-orange-600">
                Quality Assurance
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight">
                Enterprise Standards in Every File
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                Unlike open marketplaces filled with abandoned files and messy codebases, every asset on Kroma is engineered to high production standards, thoroughly documented, and actively updated.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2 shadow-xs">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Zap className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-950">Zero Unnecessary Bloat</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Clean, production-grade files without extraneous packages or messy layers.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2 shadow-xs">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Shield className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-950">Direct Author Support</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Architecture questions or token adjustments? Get prompt, direct technical support.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2 shadow-xs">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-950">Continuous Updates</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
                  Whenever Figma, Tailwind, or Next.js update major versions, new builds are provided free.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-200 bg-white p-5 space-y-2 shadow-xs">
                <div className="h-8 w-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
                  <Lock className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold text-zinc-950">Clear Commercial Rights</h3>
                <p className="text-xs text-zinc-600 leading-relaxed">
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
  const { activeView, selectedProduct, setSelectedProduct } = useStore();

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      <Header />
      <div className="flex-1">
        {activeView === 'store' && <StorefrontContent />}
        {activeView === 'library' && <CustomerLibrary />}
        {activeView === 'vendor' && <VendorDashboard />}
      </div>
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
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
  const [adminToken, setAdminToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [adminEmail, setAdminEmail] = useState<string>(() => localStorage.getItem(ADMIN_EMAIL_KEY) || 'developer995500@gmail.com');
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
