export interface MenuItem {
  id: string;
  title: string;
  url: string;
  type: 'page' | 'category' | 'custom';
  target?: '_self' | '_blank';
  badge?: string;
  badgeColor?: string;
  icon?: string;
  parentId?: string | null;
  children?: MenuItem[];
  order: number;
}

export type MenuLocation = 'header_primary' | 'header_top_bar' | 'footer_quick_links' | 'footer_resources' | 'none';

export interface SiteMenu {
  id: string;
  name: string;
  location: MenuLocation;
  isDefault?: boolean;
  autoAddPages?: boolean;
  items: MenuItem[];
  updatedAt?: string;
}

export interface AvailablePage {
  id: string;
  title: string;
  url: string;
  description?: string;
  badge?: string;
}

export const SYSTEM_PAGES: AvailablePage[] = [
  { id: 'page-home', title: 'Home', url: '/', description: 'Storefront main homepage' },
  { id: 'page-deals', title: 'Deals & Discounts', url: '/?deals=true', description: 'Curated discounts and special offers', badge: 'HOT' },
  { id: 'page-library', title: 'Customer Library (Downloads)', url: '/library', description: 'User digital vault and downloads' },
  { id: 'page-vendor', title: 'Vendor Dashboard & Studio', url: '/vendor', description: 'Single-vendor asset creator portal' },
  { id: 'page-quality', title: 'Quality Assurance & Standards', url: '#about', description: 'Enterprise file verification section' },
  { id: 'page-support', title: 'Help & Support Center', url: '#footer-contact', description: 'Customer service and contact form' },
  { id: 'page-checkout', title: 'Secure Checkout', url: '/checkout', description: 'Stripe & crypto checkout gateway' },
  { id: 'page-terms', title: 'Terms & Verified Licenses', url: '#terms', description: 'Commercial and extended license policies' },
  { id: 'page-privacy', title: 'Privacy & Data Protection', url: '#privacy', description: 'Compliance and data handling terms' },
];

export const SYSTEM_CATEGORIES: AvailablePage[] = [
  { id: 'cat-ui-templates', title: 'UI Templates & Design Systems', url: '/?category=UI+Templates', description: 'Figma, Sketch, and Tailwind UI kits' },
  { id: 'cat-boilerplates', title: 'Developer SaaS Boilerplates', url: '/?category=SaaS+Boilerplates', description: 'Production-ready Next.js and React starters' },
  { id: 'cat-3d-motion', title: '3D Models & Motion Assets', url: '/?category=3D+Models', description: 'Blender, Cinema4D, and Lottie assets' },
  { id: 'cat-themes', title: 'CMS & Web Themes', url: '/?category=Themes', description: 'Modern responsive website themes' },
  { id: 'cat-icons', title: 'Icons & Vector Illustrations', url: '/?category=Icons', description: 'Handcrafted SVG icon packs' },
  { id: 'cat-audio', title: 'Motion Audio & Sound Design', url: '/?category=Audio', description: 'Tactile UI sounds and web audio' },
];

export const DEFAULT_MENUS: SiteMenu[] = [
  {
    id: 'menu-header-primary',
    name: 'Primary Navigation (Header)',
    location: 'header_primary',
    isDefault: true,
    autoAddPages: false,
    items: [
      { id: 'item-1', title: 'Home', url: '/', type: 'page', order: 0, target: '_self' },
      { id: 'item-2', title: 'Deals', url: '/?deals=true', type: 'page', order: 1, target: '_self', badge: 'HOT', badgeColor: '#FF5A00' },
      { 
        id: 'item-3', 
        title: 'Categories', 
        url: '#categories', 
        type: 'custom', 
        order: 2, 
        target: '_self',
        children: [
          { id: 'item-3-1', title: 'UI Templates & Kits', url: '/?category=UI+Templates', type: 'category', order: 0, parentId: 'item-3' },
          { id: 'item-3-2', title: 'SaaS Boilerplates', url: '/?category=SaaS+Boilerplates', type: 'category', order: 1, parentId: 'item-3' },
          { id: 'item-3-3', title: '3D & Motion Assets', url: '/?category=3D+Models', type: 'category', order: 2, parentId: 'item-3' },
          { id: 'item-3-4', title: 'Themes & Templates', url: '/?category=Themes', type: 'category', order: 3, parentId: 'item-3' },
        ]
      },
      { id: 'item-4', title: 'Customer Library', url: '/library', type: 'page', order: 3, target: '_self' },
      { id: 'item-5', title: 'Support', url: '#footer-contact', type: 'page', order: 4, target: '_self' },
    ]
  },
  {
    id: 'menu-footer-quick-links',
    name: 'Footer Quick Links',
    location: 'footer_quick_links',
    isDefault: false,
    autoAddPages: false,
    items: [
      { id: 'f-1', title: 'Browse Products', url: '/', type: 'page', order: 0 },
      { id: 'f-2', title: 'Featured Deals', url: '/?deals=true', type: 'page', order: 1, badge: 'HOT' },
      { id: 'f-3', title: 'Quality Standards', url: '#about', type: 'page', order: 2 },
      { id: 'f-4', title: 'Help & Contact', url: '#footer-contact', type: 'page', order: 3 },
    ]
  }
];
