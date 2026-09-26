export type LicenseTier = 'personal' | 'team' | 'enterprise';

export interface ProductLicense {
  tier: LicenseTier;
  label: string;
  price: number;
  description: string;
  features: string[];
}

export interface ProductReview {
  id: string;
  author: string;
  role: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}

export interface DigitalProduct {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: 'UI & Figma' | 'Dev Kits' | '3D & Spatial' | 'Motion & Audio' | 'Templates';
  format: '.fig' | '.tsx' | '.blend' | '.lottie' | '.mp3';
  fileSize: string;
  version: string;
  lastUpdated: string;
  rating: number;
  reviewCount: number;
  salesCount: number;
  featured?: boolean;
  isNew?: boolean;
  basePrice: number;
  salePrice?: number;
  coverImage: string;
  galleryImages: string[];
  licenses: {
    personal: ProductLicense;
    team: ProductLicense;
    enterprise: ProductLicense;
  };
  highlights: string[];
  includes: string[];
  specs: Record<string, string>;
  demoType: 'ui-kit' | 'code-preview' | '3d-viewer' | 'audio-player' | 'interactive-cards';
  status: 'published' | 'draft' | 'archived';
  downloadFileName: string;
  reviews: ProductReview[];
}

export interface CartItem {
  product: DigitalProduct;
  selectedTier: LicenseTier;
  unitPrice: number;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  maxUses?: number;
  usedCount: number;
  active: boolean;
}

export interface OrderItem {
  productId: string;
  productTitle: string;
  format: string;
  tier: LicenseTier;
  tierLabel: string;
  price: number;
  licenseKey: string;
  downloadFileName: string;
  fileSize: string;
  version: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerEmail: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  discountCode?: string;
  total: number;
  paymentMethod: 'apple_pay' | 'credit_card' | 'paypal';
  status: 'completed' | 'refunded';
}

export interface VendorAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProductsSold: number;
  averageOrderValue: number;
  conversionRate: number;
}
