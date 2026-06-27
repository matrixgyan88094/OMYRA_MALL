import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-figma-saas',
    title: 'Nexus SaaS Premium UI Dashboard Kit',
    tagline: 'A comprehensive, modular Figma UI system optimized for modern analytics and user dashboards.',
    description: 'Elevate your project speed with Nexus, a highly crafted dashboard UI toolkit built specifically for Figma. It features over 250+ responsive components, beautifully designed dark & light layouts, custom interactive charts, and complete mobile viewports. Ideal for startups, SaaS businesses, and enterprise products looking for a sleek, modern visual aesthetic.',
    category: 'templates',
    price: 29.00,
    rating: 4.85,
    reviewCount: 38,
    tags: ['Figma', 'UI Kit', 'SaaS', 'Dashboard', 'Analytics'],
    features: [
      '250+ highly customizable component states',
      'Full Dark Mode and Light Mode templates included',
      'Dynamic charts, graphs, and visual components',
      'Designed using modern auto-layout variables',
      'Lifetime free updates and developer style guide'
    ],
    filesIncluded: [
      'Nexus-Dashboard-Kit-v1.2.fig (Figma File)',
      'Nexus-Icon-Library-Pack.fig (Figma Library)',
      'Style-Guide-And-Variables.pdf (Design Documentation)'
    ],
    fileSize: '48.2 MB',
    coverImage: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    creator: {
      name: 'DesignAura Labs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80',
      badge: 'Pro Creator',
      salesCount: 1240,
      rating: 4.9
    },
    createdAt: '2026-04-10',
    downloads: 894,
    demoUrl: 'https://figma.com',
    reviews: [
      {
        id: 'rev-1',
        user: 'Alex Rivers',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&fit=crop&q=80',
        rating: 5,
        comment: 'Absolutely outstanding! The auto-layout is perfectly implemented. Saved me at least 40 hours of tedious work on my SaaS project.',
        date: '2026-05-14'
      },
      {
        id: 'rev-2',
        user: 'Mila K.',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=80',
        rating: 4,
        comment: 'Great layout and structure. The colors are very professional. I hope to see more widgets in the next update.',
        date: '2026-06-01'
      }
    ]
  },
  {
    id: 'prod-react-starter',
    title: 'Aura React v19 SaaS Starter Blueprint',
    tagline: 'Vite + React 19 + Tailwind CSS full stack starter boilerplate with pre-built authentication routing.',
    description: 'Stop building auth, layouts, and Stripe integrations from scratch. Aura Starter is a production-ready, clean-code boilerplate designed to launch your SaaS in a single afternoon. Features pre-integrated authentication, routing guards, multi-theme layouts, interactive custom UI components, and complete dark mode orchestration.',
    category: 'code',
    price: 49.00,
    rating: 4.92,
    reviewCount: 57,
    tags: ['React 19', 'Tailwind CSS', 'Vite', 'SaaS', 'TypeScript'],
    features: [
      'React 19 with strict TypeScript and Vite configuration',
      'Configured routing with lazy-loading and auth guards',
      '20+ modular dashboard elements with Tailwind CSS',
      'Pre-built hooks for state management and local storage syncing',
      'API proxy setup and ready-to-use fetch helper routines'
    ],
    filesIncluded: [
      'aura-saas-starter-main.zip (Codebase Repository)',
      'INSTALLATION-GUIDE.md (Markdown Instructions)',
      'api-schemas-and-types.ts (Data structure template)'
    ],
    fileSize: '12.4 MB',
    coverImage: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)',
    creator: {
      name: 'CodeVanguard',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80',
      badge: 'Elite Developer',
      salesCount: 3210,
      rating: 4.8
    },
    createdAt: '2026-05-02',
    downloads: 1450,
    demoUrl: 'https://github.com',
    reviews: [
      {
        id: 'rev-3',
        user: 'Marcus Chen',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&fit=crop&q=80',
        rating: 5,
        comment: 'Hands down the cleanest boilerplate I have ever bought. TypeScript configurations are rock solid and everything builds instantly. Essential for freelancers.',
        date: '2026-05-20'
      }
    ]
  },
  {
    id: 'prod-ts-book',
    title: 'Mastering TypeScript & Clean Architecture',
    tagline: 'An elegant, interactive e-book on production-grade software design patterns and TypeScript types.',
    description: 'Learn the patterns that separate junior coders from staff software architects. This masterbook is structured with actionable, real-world examples, moving from advanced type-level gymnastics to modular hexagonal architectures. Includes full code exercises, PDF, EPUB, and a web-based companion workspace.',
    category: 'ebooks',
    price: 19.00,
    rating: 4.78,
    reviewCount: 92,
    tags: ['TypeScript', 'Architecture', 'Clean Code', 'Software Design', 'Ebook'],
    features: [
      '280 pages of dense, zero-fluff software engineering expertise',
      'Interactive type challenges with complete solutions',
      'Covers Domain-Driven Design, Hexagonal patterns, and CQRS in TypeScript',
      'PDF, EPUB, and Kindle formats (DRM-Free)',
      'Accompanying GitHub repository with 15 sandbox exercises'
    ],
    filesIncluded: [
      'Mastering-TypeScript-Clean-Architecture.pdf (High Quality PDF)',
      'Mastering-TypeScript-Clean-Architecture.epub (EPUB Book)',
      'TS-Sandbox-Exercises-Master.zip (Code Projects)'
    ],
    fileSize: '18.9 MB',
    coverImage: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    creator: {
      name: 'Architect Mind',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&fit=crop&q=80',
      badge: 'Best Seller',
      salesCount: 4890,
      rating: 4.75
    },
    createdAt: '2026-03-22',
    downloads: 2450,
    reviews: [
      {
        id: 'rev-4',
        user: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&fit=crop&q=80',
        rating: 5,
        comment: 'This book fundamentally changed how I structure my backend services. The chapters on conditional types and mapped interfaces alone are worth ten times the price.',
        date: '2026-04-12'
      }
    ]
  },
  {
    id: 'prod-3d-icons',
    title: 'Vivid 3D Neumorphic Tech Icon Pack',
    tagline: '85+ ultra-modern 3D rendered icons in high-resolution PNG, glTF, and Figma structures.',
    description: 'Give your web and mobile applications visual depth that stands out. Vivid is a collection of premium 3D isometric icons rendered with exquisite glassmorphism, metallic contours, and dynamic lighting presets. Includes editable Blender files so you can tweak materials, scale, and lighting environments to fit your exact branding.',
    category: 'design',
    price: 14.00,
    rating: 4.91,
    reviewCount: 26,
    tags: ['3D Graphics', 'Blender', 'Icons', 'UI Design', 'Assets'],
    features: [
      '85 unique custom tech, finance, and system design icons',
      'High-res transparent PNGs (1024x1024px)',
      'Fully editable Blender (.blend) source files with cycles settings',
      'Figma catalog with nested symbols for rapid insertion',
      'Pre-rendered active, inactive, and hover state textures'
    ],
    filesIncluded: [
      'Vivid-3D-Icons-PNG-Pack.zip (Transparent Assets)',
      'Vivid-Blender-Project-Files.zip (Blender Source)',
      'Vivid-Figma-Catalog.fig (Figma Component File)'
    ],
    fileSize: '142.0 MB',
    coverImage: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
    creator: {
      name: 'PolyGlow Studio',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&fit=crop&q=80',
      salesCount: 890,
      rating: 4.8
    },
    createdAt: '2026-05-15',
    downloads: 512,
    reviews: [
      {
        id: 'rev-5',
        user: 'Devon Powell',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=80&fit=crop&q=80',
        rating: 5,
        comment: 'Excellent renders, zero artifacts, clean channels. Setting up the material inside Blender was very intuitive. Looking forward to more releases.',
        date: '2026-06-10'
      }
    ]
  },
  {
    id: 'prod-lofi-audio',
    title: 'Retro-Wave & Lofi Production Beats Pack',
    tagline: 'A curated set of 15 premium royalty-free lofi synth-wave beats and ambient transition tracks.',
    description: 'Perfect background soundscapes, gaming stream accompaniments, or commercial presentation tracks. Crafted using analog hardware synthesizers and live instruments, this sound pack delivers warm warmth, vintage tape saturation, and mellow moods. All files are royalty-free, mastered to professional specifications, and provided in uncompressed 24-bit WAV.',
    category: 'audio',
    price: 12.00,
    rating: 4.65,
    reviewCount: 19,
    tags: ['Audio', 'Beats', 'Lofi', 'Royalty Free', 'Soundtrack'],
    features: [
      '15 fully sequenced and mastered royalty-free tracks',
      'WAV (24-bit, 44.1kHz) and MP3 formats included',
      'Individual instruments stem files for customization',
      'Looped versions for video games and ambient loops',
      'Commercial distribution license agreement certificate'
    ],
    filesIncluded: [
      'Lofi-Beats-HighQuality-WAV.zip (Audio Files)',
      'Lofi-Beats-Stems-Stems.zip (Instrumental tracks)',
      'OMYRA-Royalty-Free-License.pdf (Usage License)'
    ],
    fileSize: '312.4 MB',
    coverImage: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    creator: {
      name: 'Resonance Waves',
      avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=80&fit=crop&q=80',
      badge: 'Certified Producer',
      salesCount: 460,
      rating: 4.65
    },
    createdAt: '2026-04-20',
    downloads: 320,
    reviews: [
      {
        id: 'rev-6',
        user: 'Liam Vance',
        avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=80&fit=crop&q=80',
        rating: 4,
        comment: 'Warm chords and incredible drum patterns. Used two of these in my YouTube coding streams and the viewers loved the vibe.',
        date: '2026-05-01'
      }
    ]
  },
  {
    id: 'prod-tailwind-components',
    title: 'Prism Tailwind HTML Landing Pages Collection',
    tagline: '12+ copy-paste modular marketing landing pages built with Tailwind CSS v4.',
    description: 'Launch stunning web presence in minutes. Prism is a library of beautiful landing page templates styled completely with modern Tailwind v4 properties. Optimized for conversion, fast loading speeds, and perfect semantic structure. Highly adaptable design blocks for pricing matrices, hero banners, feature lists, and contact matrices.',
    category: 'templates',
    price: 24.00,
    rating: 4.88,
    reviewCount: 43,
    tags: ['Tailwind CSS', 'HTML', 'Templates', 'Landing Page', 'Web Design'],
    features: [
      '12 distinctive, conversion-engineered landing pages',
      'Fully reactive design and interactive light/dark elements',
      'Zero external JS libraries required (pure HTML/CSS)',
      'Optimized performance with 100% Google Lighthouse score capability',
      'Fully accessible semantic headings and aria labels'
    ],
    filesIncluded: [
      'Prism-Landing-Templates-v1.zip (HTML/CSS Source)',
      'Component-Assets-Images.zip (Optimized Vectors)',
      'README-Tailwind-Deployment.md (Hosting Guide)'
    ],
    fileSize: '15.1 MB',
    coverImage: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    creator: {
      name: 'DesignAura Labs',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80',
      badge: 'Pro Creator',
      salesCount: 1240,
      rating: 4.9
    },
    createdAt: '2026-05-30',
    downloads: 410,
    reviews: [
      {
        id: 'rev-7',
        user: 'Isabella Roy',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&fit=crop&q=80',
        rating: 5,
        comment: 'Insanely fast to set up. I literally unzipped the folder, edited the copy, and deployed it to Cloudflare Pages in 10 minutes. 10/10.',
        date: '2026-06-15'
      }
    ]
  },
  {
    id: 'prod-docker-kubernetes',
    title: 'Production Docker & Kubernetes Deep Dive',
    tagline: 'Step-by-step workbook for configuring auto-scaling clusters, CI/CD pipelines, and ingress controllers.',
    description: 'Bridge the gap between working in development and managing massive scales. This premium technical guide offers complete copy-paste production-tested configurations, dynamic cluster definitions, safety parameters, multi-stage Docker build files, and horizontal pod auto-scalers. Practical, real-world solutions for real DevOps challenges.',
    category: 'ebooks',
    price: 27.00,
    rating: 4.95,
    reviewCount: 34,
    tags: ['Docker', 'Kubernetes', 'DevOps', 'CI/CD', 'SysAdmin'],
    features: [
      '180 pages of dense, hyper-practical cloud-native recipes',
      'Configuring NGINX Ingress and TLS certificates securely',
      'Writing multi-stage Dockerfiles for Node, Python, and Go',
      'Complete YAML files for auto-scaling deployments and secrets',
      'Monitoring and alerting dashboards presets for Prometheus'
    ],
    filesIncluded: [
      'Production-Docker-Kubernetes-Workbook.pdf (PDF Copy)',
      'Production-YAML-Configurations-Templates.zip (YAML source)',
      'CI-CD-Github-Actions-Templates.yaml (Workflow config)'
    ],
    fileSize: '32.1 MB',
    coverImage: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)',
    creator: {
      name: 'CodeVanguard',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&fit=crop&q=80',
      badge: 'Elite Developer',
      salesCount: 3210,
      rating: 4.8
    },
    createdAt: '2026-04-05',
    downloads: 720,
    reviews: [
      {
        id: 'rev-8',
        user: 'Tobias G.',
        avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=80&fit=crop&q=80',
        rating: 5,
        comment: 'This guide saved our team weeks of trial and error with Kubernetes horizontal pod autoscaling. The configs work right out of the box with minor edits.',
        date: '2026-05-18'
      }
    ]
  }
];

export const PROMO_CODES: { [key: string]: number } = {
  'OMYRA20': 0.20,     // 20% off
  'CREATOR10': 0.10,   // 10% off
  'FREEBIE': 1.00,     // 100% off
  'SUMMER30': 0.30      // 30% off
};
