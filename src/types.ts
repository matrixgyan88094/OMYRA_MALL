export interface Review {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Creator {
  name: string;
  avatar: string;
  badge?: string;
  salesCount: number;
  rating?: number;
}

export interface Product {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'templates' | 'ebooks' | 'design' | 'code' | 'audio';
  price: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  features: string[];
  filesIncluded: string[];
  fileSize: string;
  coverImage: string; // Background color preset/illustration
  creator: Creator;
  reviews: Review[];
  createdAt: string;
  downloads: number;
  demoUrl?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Purchase {
  id: string;
  date: string;
  products: {
    id: string;
    title: string;
    price: number;
    coverImage: string;
    category: string;
    downloadUrl: string;
  }[];
  subtotal: number;
  discount: number;
  total: number;
  promoCode?: string;
}

export interface CreatorStats {
  views: number;
  sales: number;
  earnings: number;
  conversionRate: number;
}
