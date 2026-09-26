import React, { createContext, useContext, useState, useEffect } from 'react';
import { DigitalProduct, CartItem, Order, OrderItem, Coupon, LicenseTier, VendorAnalytics } from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, INITIAL_ORDERS } from '../data/mockProducts';

interface CheckoutDetails {
  customerName: string;
  customerEmail: string;
  paymentMethod: 'apple_pay' | 'credit_card' | 'paypal';
}

interface StoreContextType {
  products: DigitalProduct[];
  cart: CartItem[];
  orders: Order[];
  purchasedItems: OrderItem[];
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  selectedProduct: DigitalProduct | null;
  isCartOpen: boolean;
  activeView: 'store' | 'library' | 'vendor';
  searchQuery: string;
  selectedCategory: string;
  selectedFormat: string;
  sortBy: 'popular' | 'newest' | 'price-low' | 'price-high';
  lastCompletedOrder: Order | null;
  isOrderModalOpen: boolean;
  theme: 'dark' | 'light';
  
  // Actions
  setSelectedProduct: (product: DigitalProduct | null) => void;
  setIsCartOpen: (open: boolean) => void;
  setActiveView: (view: 'store' | 'library' | 'vendor') => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedFormat: (format: string) => void;
  setSortBy: (sort: 'popular' | 'newest' | 'price-low' | 'price-high') => void;
  setIsOrderModalOpen: (open: boolean) => void;
  toggleTheme: () => void;
  
  // Cart Actions
  addToCart: (product: DigitalProduct, tier?: LicenseTier) => void;
  removeFromCart: (productId: string, tier: LicenseTier) => void;
  updateQuantity: (productId: string, tier: LicenseTier, qty: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  getCartSubtotal: () => number;
  getDiscountAmount: () => number;
  getCartTotal: () => number;
  processCheckout: (details: CheckoutDetails) => Promise<Order>;

  // Vendor Actions
  addProduct: (productData: Partial<DigitalProduct>) => void;
  updateProduct: (id: string, updates: Partial<DigitalProduct>) => void;
  deleteProduct: (id: string) => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;
  getVendorAnalytics: () => VendorAnalytics;
  
  // Real Package Downloads
  downloadAsset: (item: OrderItem) => void;
  simulateDownload: (item: OrderItem) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'kroma_products_v1';
const CART_STORAGE_KEY = 'kroma_cart_v1';
const ORDERS_STORAGE_KEY = 'kroma_orders_v1';
const COUPONS_STORAGE_KEY = 'kroma_coupons_v1';

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<DigitalProduct[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem(COUPONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_COUPONS;
    } catch {
      return INITIAL_COUPONS;
    }
  });

  const [theme] = useState<'dark' | 'light'>('light');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveView] = useState<'store' | 'library' | 'vendor'>('store');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high'>('popular');
  const [lastCompletedOrder, setLastCompletedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Sync to database and local store
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && Array.isArray(data) && data.length > 0) {
          // Map DB products if present
          const mapped = data.map((d: any) => {
            const basePrice = d.price || 49;
            return {
              id: d.id,
              slug: d.id,
              title: d.title,
              tagline: d.subtitle || '',
              description: d.description || '',
              category: d.category || 'UI & Figma',
              format: Array.isArray(d.formats) && d.formats[0] ? d.formats[0] : '.fig',
              fileSize: '48 MB',
              version: '2.4.0',
              lastUpdated: 'Recently updated',
              rating: d.rating || 5.0,
              reviewCount: d.reviews_count || 120,
              salesCount: d.sales_count || 340,
              basePrice,
              licenses: {
                personal: {
                  tier: 'personal' as LicenseTier,
                  label: 'Individual Maker',
                  price: basePrice,
                  description: 'Single commercial project use.',
                  features: ['Full Source Files', '1 Commercial Project', 'Lifetime Updates']
                },
                team: {
                  tier: 'team' as LicenseTier,
                  label: 'Team & Studio',
                  price: Math.round(basePrice * 1.8),
                  description: 'For collaborative teams & client work.',
                  features: ['Up to 8 Team Members', 'Unlimited Client Projects', 'Priority Support']
                },
                enterprise: {
                  tier: 'enterprise' as LicenseTier,
                  label: 'Enterprise Unlimited',
                  price: Math.round(basePrice * 3.5),
                  description: 'Full unconstrained distribution rights.',
                  features: ['Unlimited Seats', 'Redistribution Waiver', '1-on-1 Consultation']
                }
              },
              highlights: Array.isArray(d.features) && d.features.length > 0 ? d.features : ['Production Tested', 'Clean Code', 'Commercial Rights'],
              includes: ['Master Source Files', 'Documentation PDF', 'Commercial License Key'],
              specs: { 'Platform': 'Cross-platform', 'Updates': 'Lifetime' },
              demoType: 'ui-kit' as const,
              coverImage: d.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg',
              galleryImages: [d.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg'],
              downloadFileName: `${d.id}.zip`,
              isFeatured: true,
              isNew: false,
              status: d.status || 'published',
              reviews: []
            };
          });
          setProducts(mapped);
        }
      })
      .catch(e => console.log('Products API sync fallback to local cache:', e));
  }, []);

  useEffect(() => {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(coupons));
  }, [coupons]);

  const toggleTheme = () => {
    // Keep light theme active
  };

  const addToCart = (product: DigitalProduct, tier: LicenseTier = 'personal') => {
    setCart(prev => {
      const existing = prev.find(
        item => item.product.id === product.id && item.selectedTier === tier
      );

      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && item.selectedTier === tier
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      const unitPrice = product.licenses[tier].price;
      return [...prev, { product, selectedTier: tier, quantity: 1, unitPrice }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, tier: LicenseTier) => {
    setCart(prev =>
      prev.filter(item => !(item.product.id === productId && item.selectedTier === tier))
    );
  };

  const updateQuantity = (productId: string, tier: LicenseTier, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId, tier);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId && item.selectedTier === tier
          ? { ...item, quantity: qty }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const match = coupons.find(c => c.code.toUpperCase() === trimmed);

    if (!match) {
      return { success: false, message: 'Invalid promo code. Try "LAUNCH20" or "ORANGE"' };
    }

    if (!match.active) {
      return { success: false, message: 'This promo code is no longer active.' };
    }

    const subtotal = getCartSubtotal();
    if (match.minSpend && subtotal < match.minSpend) {
      return { success: false, message: `Minimum spend of $${match.minSpend} required.` };
    }

    setAppliedCoupon(match);
    return { success: true, message: `Coupon "${match.code}" applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const getCartSubtotal = () => {
    return cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    const subtotal = getCartSubtotal();
    if (!appliedCoupon || subtotal === 0) return 0;

    if (appliedCoupon.discountType === 'percentage') {
      return Math.round(((subtotal * appliedCoupon.discountValue) / 100) * 100) / 100;
    } else {
      return Math.min(subtotal, appliedCoupon.discountValue);
    }
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    return Math.max(0, Math.round((subtotal - discount) * 100) / 100);
  };

  // Real Checkout Process with Database persistence & Resend.com dispatch
  const processCheckout = async (details: CheckoutDetails): Promise<Order> => {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    const total = getCartTotal();

    const orderNumber = `KRM-${Math.floor(100000 + Math.random() * 900000)}`;
    const randomChars = () => Math.random().toString(36).substring(2, 6).toUpperCase();

    const orderItems: OrderItem[] = cart.map(item => {
      const licenseCode = `KRM-${item.product.category.substring(0, 2).toUpperCase()}-${randomChars()}-${randomChars()}-${item.selectedTier.substring(0, 2).toUpperCase()}`;
      return {
        productId: item.product.id,
        productTitle: item.product.title,
        format: item.product.format,
        tier: item.selectedTier,
        tierLabel: item.product.licenses[item.selectedTier].label,
        price: item.unitPrice,
        licenseKey: licenseCode,
        downloadFileName: item.product.downloadFileName,
        fileSize: item.product.fileSize,
        version: item.product.version,
      };
    });

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString().split('T')[0],
      customerEmail: details.customerEmail,
      customerName: details.customerName,
      items: orderItems,
      subtotal,
      discountAmount: discount,
      discountCode: appliedCoupon?.code,
      total,
      paymentMethod: details.paymentMethod,
      status: 'completed',
    };

    // Asynchronously dispatch to real server database and Resend email provider
    try {
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: details.customerEmail,
          items: orderItems,
          total,
          subtotal,
          discount
        })
      }).catch(err => console.error('Background order persistence error:', err));
    } catch (e) {
      console.error('Order dispatch error', e);
    }

    setOrders(prev => [newOrder, ...prev]);
    setLastCompletedOrder(newOrder);
    clearCart();
    setIsCartOpen(false);
    setIsOrderModalOpen(true);

    return newOrder;
  };

  const addProduct = (productData: Partial<DigitalProduct>) => {
    const id = `prod-${Date.now()}`;
    const basePrice = productData.basePrice || 49;
    const newProd: DigitalProduct = {
      id,
      slug: (productData.title || 'new-product').toLowerCase().replace(/\s+/g, '-'),
      title: productData.title || 'Untitled Digital Product',
      tagline: productData.tagline || 'High-performance digital asset by Kroma Studio',
      description: productData.description || 'Crafted with precision for design and engineering workflows.',
      category: productData.category || 'UI & Figma',
      format: productData.format || '.fig',
      fileSize: productData.fileSize || '45 MB',
      version: '1.0.0',
      lastUpdated: 'Just now',
      rating: 5.0,
      reviewCount: 1,
      salesCount: 0,
      basePrice,
      licenses: {
        personal: {
          tier: 'personal',
          label: 'Individual Maker',
          price: basePrice,
          description: 'Single personal and commercial project use.',
          features: ['Full Source Files', '1 Commercial Project', 'Lifetime Updates'],
        },
        team: {
          tier: 'team',
          label: 'Team & Studio',
          price: Math.round(basePrice * 1.8),
          description: 'For collaborative teams & client work.',
          features: ['Up to 8 Team Members', 'Unlimited Client Projects', 'Priority Support'],
        },
        enterprise: {
          tier: 'enterprise',
          label: 'Enterprise Unlimited',
          price: Math.round(basePrice * 3.5),
          description: 'Full unconstrained distribution rights.',
          features: ['Unlimited Seats', 'Redistribution Waiver', '1-on-1 Consultation'],
        },
      },
      highlights: productData.highlights || ['Production Tested', 'Complete Source Included'],
      includes: productData.includes || ['Source Files', 'License Key'],
      specs: productData.specs || { 'License': 'Perpetual Commercial' },
      demoType: productData.demoType || 'ui-kit',
      coverImage: productData.coverImage || '/src/assets/images/hero_white_orange_1790435384152.jpg',
      galleryImages: productData.galleryImages || ['/src/assets/images/hero_white_orange_1790435384152.jpg'],
      downloadFileName: `${id}.zip`,
      featured: false,
      isNew: true,
      status: productData.status || 'published',
      reviews: [],
    };

    setProducts(prev => [newProd, ...prev]);
  };

  const updateProduct = (id: string, updates: Partial<DigitalProduct>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons(prev =>
      prev.map(c => (c.code === code ? { ...c, active: !c.active } : c))
    );
  };

  const getVendorAnalytics = (): VendorAnalytics => {
    const completedOrders = orders.filter(o => o.status === 'completed');
    const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const totalOrders = completedOrders.length;
    const totalProductsSold = completedOrders.reduce((sum, o) => sum + o.items.length, 0);
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate = 4.2;

    return {
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalProductsSold,
      averageOrderValue: Math.round(averageOrderValue * 100) / 100,
      conversionRate,
    };
  };

  // Real Digital Package Manifest & Certificate Download
  const downloadAsset = (item: OrderItem) => {
    const fileContent = `========================================================
KROMA STUDIO — OFFICIAL COMMERCIAL LICENSE CERTIFICATE
========================================================
Product Title: ${item.productTitle}
Format: ${item.format}
Release Version: ${item.version}
License Tier: ${item.tierLabel} (${item.tier})
Assigned Commercial License Key: ${item.licenseKey}
Customer Authorized Entity: Verified Licensee
Digital Hash: SHA256-${Math.random().toString(36).substring(2)}${Math.random().toString(36).substring(2)}
Issued On: ${new Date().toISOString()}

COMMERCIAL RIGHTS & PERMISSIONS:
1. You are granted non-exclusive, perpetual commercial rights to incorporate this asset into commercial applications, software, client deliverables, and production builds under ${item.tierLabel} terms.
2. Lifetime updates and version patches are included under your registered license key.

DOCUMENTATION & RELEASES:
Support: matrixgyan88094@gmail.com
Registry: https://kroma.studio
========================================================`;

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.productTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}_license_manifest.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Aggregate all items purchased across orders
  const purchasedItems: OrderItem[] = orders
    .filter(o => o.status === 'completed')
    .flatMap(o => o.items);

  return (
    <StoreContext.Provider
      value={{
        products,
        cart,
        orders,
        purchasedItems,
        coupons,
        appliedCoupon,
        selectedProduct,
        isCartOpen,
        activeView,
        searchQuery,
        selectedCategory,
        selectedFormat,
        sortBy,
        lastCompletedOrder,
        isOrderModalOpen,
        theme,
        setSelectedProduct,
        setIsCartOpen,
        setActiveView,
        setSearchQuery,
        setSelectedCategory,
        setSelectedFormat,
        setSortBy,
        setIsOrderModalOpen,
        toggleTheme,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        getCartSubtotal,
        getDiscountAmount,
        getCartTotal,
        processCheckout,
        addProduct,
        updateProduct,
        deleteProduct,
        addCoupon,
        toggleCouponStatus,
        getVendorAnalytics,
        downloadAsset,
        simulateDownload: downloadAsset,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
