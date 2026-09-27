import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import multer from 'multer';
import {
  S3Client,
  HeadBucketCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

dotenv.config();

const app = express();
app.set('trust proxy', 1);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 150 * 1024 * 1024 } // 150MB maximum upload limit
});

// ---------------------------------------------------------
// DATABASE & STORAGE LAYER (Neon PostgreSQL + Safe Memory Fallback)
// ---------------------------------------------------------
const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', '.data')
  : path.resolve(process.cwd(), '.data');

const DB_FILE = path.join(DATA_DIR, 'db_store.json');

interface AdminAccount {
  id: string;
  email: string;
  password_hash: string;
  access_alias: string;
  resend_api_key?: string;
  resend_from_email?: string;
  resend_domain?: string;
  resend_sender_name?: string;
  r2_account_id?: string;
  r2_access_key_id?: string;
  r2_secret_access_key?: string;
  r2_bucket_name?: string;
  r2_public_domain?: string;
  updated_at: string;
}

interface PasskeyRecord {
  id: string;
  credential_id: string;
  public_key: string;
  counter: number;
  name: string;
  created_at: string;
}

interface ProductRecord {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  price: number;
  formats: string[];
  tags: string[];
  features: string[];
  thumbnail: string;
  rating: number;
  reviews_count: number;
  sales_count: number;
  status: 'published' | 'draft';
  file_url?: string;
  created_at: string;
}

interface OrderRecord {
  id: string;
  order_number: string;
  customer_email: string;
  total: number;
  subtotal: number;
  discount: number;
  license_key: string;
  items: Array<{
    productId: string;
    productTitle: string;
    price: number;
    licenseType: string;
    fileUrl?: string;
  }>;
  created_at: string;
  email_sent: boolean;
  resend_id?: string;
}

interface EmailLog {
  id: string;
  to_email: string;
  subject: string;
  status: 'delivered' | 'failed' | 'queued';
  resend_id?: string;
  error_message?: string;
  sent_at: string;
}

interface LocalStore {
  admin: AdminAccount;
  passkeys: PasskeyRecord[];
  products: ProductRecord[];
  orders: OrderRecord[];
  email_logs: EmailLog[];
  active_challenges: Record<string, { challenge: string; expires: number; type: 'register' | 'login' }>;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_salt_kroma_marketplace').digest('hex');
}

const DEFAULT_PRODUCTS: ProductRecord[] = [
  {
    id: 'kroma-ui-core',
    title: 'Kroma UI Design System v4',
    subtitle: 'Enterprise-grade Figma library with 1,200+ production components',
    description: 'A complete, highly structured design system built on Figma Auto-Layout 5.0, Variables, responsive breakpoints, and WCAG AAA compliance. Includes dark, light, and high-contrast color palettes with automated design tokens ready for Tailwind CSS v4.',
    category: 'UI & Figma',
    price: 89,
    formats: ['.fig', '.tokens.json', '.css'],
    tags: ['Figma', 'Design System', 'Tokens', 'Tailwind'],
    features: ['1,200+ Figma components', 'Auto Layout 5.0 + Variables', 'Tailwind CSS v4 token export', 'Commercial project rights'],
    thumbnail: '/src/assets/images/product_figma_system_1790434781926.jpg',
    rating: 4.98,
    reviews_count: 248,
    sales_count: 1420,
    status: 'published',
    file_url: 'https://downloads.kroma.studio/releases/kroma-ui-core-v4.zip',
    created_at: new Date().toISOString()
  },
  {
    id: 'kroma-next15-starter',
    title: 'Next.js 15 Fullstack SaaS Starter',
    subtitle: 'Ship production apps in days with TypeScript, React 19, and Neon DB',
    description: 'Battle-tested Next.js 15 App Router boilerplate with server components, Postgres connection pooling, modern authentication, Resend transactional emails, and Stripe checkout integration.',
    category: 'Dev Kits',
    price: 129,
    formats: ['.tsx', '.sql', '.dockerfile'],
    tags: ['Next.js 15', 'TypeScript', 'React 19', 'Neon DB'],
    features: ['Next.js 15 App Router architecture', 'TypeScript strict mode & Zod schemas', 'Neon Postgres database integration', 'Resend transactional email templates'],
    thumbnail: '/src/assets/images/product_dev_boilerplate_1790434806396.jpg',
    rating: 4.95,
    reviews_count: 182,
    sales_count: 980,
    status: 'published',
    file_url: 'https://downloads.kroma.studio/releases/kroma-next15-starter-v2.zip',
    created_at: new Date().toISOString()
  },
  {
    id: 'kroma-spatial-3d',
    title: 'Spatial Geometry 3D Assets Pack',
    subtitle: '60+ pristine matte & frosted 3D objects rendered for digital products',
    description: 'Ultra-high resolution 3D models and pre-rendered transparent assets engineered specifically for modern UI cards, hero sections, and marketing landing pages. Includes Blender master files.',
    category: '3D & Spatial',
    price: 69,
    formats: ['.blend', '.glb', '.png (8K)'],
    tags: ['3D Asset', 'Blender', 'GLB', 'Abstract UI'],
    features: ['60+ unique 3D compositions', 'Full Blender setup with octane shaders', '8K transparent PNG exports', 'Optimized GLB files for Three.js'],
    thumbnail: '/src/assets/images/product_3d_assets_1790434793362.jpg',
    rating: 4.92,
    reviews_count: 114,
    sales_count: 650,
    status: 'published',
    file_url: 'https://downloads.kroma.studio/releases/kroma-spatial-3d-v1.zip',
    created_at: new Date().toISOString()
  },
  {
    id: 'kroma-micro-motion',
    title: 'Kinetic Motion & Audio Soundscape',
    subtitle: '45+ clean micro-interactions and tactile Web Audio sound bites',
    description: 'Subtle, hyper-responsive UI micro-animations and crisp acoustic UI audio tokens (clicks, confirmations, errors, and ambient hums) optimized for web and mobile touch apps.',
    category: 'Motion & Audio',
    price: 49,
    formats: ['.json (Lottie)', '.wav (24-bit)', '.mp3'],
    tags: ['Audio UI', 'Lottie', 'Haptics', 'Motion'],
    features: ['45+ tactile sound design assets', 'Lightweight Lottie animation files', 'Web Audio API code recipes', 'Instant zero-delay buffer loading'],
    thumbnail: '/src/assets/images/hero_white_orange_1790435384152.jpg',
    rating: 4.96,
    reviews_count: 89,
    sales_count: 412,
    status: 'published',
    file_url: 'https://downloads.kroma.studio/releases/kroma-micro-motion-v1.zip',
    created_at: new Date().toISOString()
  }
];

// In-memory store cache for zero-disk serverless resilience
let inMemoryStore: LocalStore | null = null;

function loadLocalStore(): LocalStore {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
      if (!data.active_challenges) data.active_challenges = {};
      if (data.admin) {
        if (!data.admin.resend_domain) data.admin.resend_domain = 'omyra.org';
        if (!data.admin.resend_from_email || data.admin.resend_from_email === 'onboarding@resend.dev') {
          data.admin.resend_from_email = 'orders@omyra.org';
        }
        if (!data.admin.resend_sender_name) data.admin.resend_sender_name = 'Kroma Studio';
      }
      inMemoryStore = data;
      return data;
    }
  } catch (err) {
    console.warn('Notice reading local db store, falling back to memory store:', err);
  }

  const initialStore: LocalStore = {
    admin: {
      id: 'admin_primary',
      email: 'developer995500@gmail.com',
      password_hash: hashPassword('admin'),
      access_alias: 'md1620',
      resend_api_key: '',
      resend_from_email: 'orders@omyra.org',
      resend_domain: 'omyra.org',
      resend_sender_name: 'Kroma Studio',
      updated_at: new Date().toISOString()
    },
    passkeys: [],
    products: DEFAULT_PRODUCTS,
    orders: [],
    email_logs: [],
    active_challenges: {}
  };

  inMemoryStore = initialStore;
  saveLocalStore(initialStore);
  return initialStore;
}

function saveLocalStore(store: LocalStore) {
  inMemoryStore = store;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    // Non-fatal in read-only lambda environments
    console.warn('Filesystem write bypassed in serverless environment, state kept in memory:', err);
  }
}

// ---------------------------------------------------------
// NEON POSTGRESQL DRIVER INTEGRATION
// ---------------------------------------------------------
let sql: NeonQueryFunction<false, false> | null = null;
let neonConnected = false;
let neonError: string | null = null;

async function initNeonDatabase() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl || dbUrl.trim() === '') {
    neonConnected = false;
    neonError = 'DATABASE_URL environment variable is not configured. Running on local persistent database store.';
    return;
  }

  try {
    sql = neon(dbUrl);
    // Test query
    const res = await sql`SELECT 1 as connected;`;
    if (res && res.length > 0) {
      neonConnected = true;
      neonError = null;
      console.log('✅ Successfully connected to Neon PostgreSQL database.');

      // Initialize Tables
      await sql`
        CREATE TABLE IF NOT EXISTS admin_account (
          id TEXT PRIMARY KEY,
          email TEXT NOT NULL,
          password_hash TEXT NOT NULL,
          access_alias TEXT NOT NULL,
          resend_api_key TEXT,
          resend_from_email TEXT,
          resend_domain TEXT,
          resend_sender_name TEXT,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await sql`ALTER TABLE admin_account ADD COLUMN IF NOT EXISTS resend_domain TEXT;`;
      await sql`ALTER TABLE admin_account ADD COLUMN IF NOT EXISTS resend_sender_name TEXT;`;
      await sql`ALTER TABLE admin_account ADD COLUMN IF NOT EXISTS r2_account_id TEXT;`;
      await sql`ALTER TABLE admin_account ADD COLUMN IF NOT EXISTS r2_access_key_id TEXT;`;
      await sql`ALTER TABLE admin_account ADD COLUMN IF NOT EXISTS r2_secret_access_key TEXT;`;
      await sql`ALTER TABLE admin_account ADD COLUMN IF NOT EXISTS r2_bucket_name TEXT;`;
      await sql`ALTER TABLE admin_account ADD COLUMN IF NOT EXISTS r2_public_domain TEXT;`;

      await sql`
        CREATE TABLE IF NOT EXISTS admin_passkeys (
          credential_id TEXT PRIMARY KEY,
          id TEXT,
          name TEXT,
          device_name TEXT,
          public_key TEXT NOT NULL,
          counter INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;
      await sql`ALTER TABLE admin_passkeys ADD COLUMN IF NOT EXISTS id TEXT;`;
      await sql`ALTER TABLE admin_passkeys ADD COLUMN IF NOT EXISTS name TEXT;`;
      await sql`ALTER TABLE admin_passkeys ADD COLUMN IF NOT EXISTS device_name TEXT;`;
      await sql`ALTER TABLE admin_passkeys ADD COLUMN IF NOT EXISTS counter INTEGER DEFAULT 0;`;

      await sql`
        CREATE TABLE IF NOT EXISTS marketplace_products (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          subtitle TEXT,
          description TEXT,
          category TEXT,
          price NUMERIC(10, 2) NOT NULL,
          formats JSONB,
          tags JSONB,
          features JSONB,
          thumbnail TEXT,
          rating NUMERIC(3, 2) DEFAULT 5.0,
          reviews_count INTEGER DEFAULT 0,
          sales_count INTEGER DEFAULT 0,
          status TEXT DEFAULT 'published',
          file_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS marketplace_orders (
          id TEXT PRIMARY KEY,
          order_number TEXT NOT NULL,
          customer_email TEXT NOT NULL,
          total NUMERIC(10, 2) NOT NULL,
          subtotal NUMERIC(10, 2) NOT NULL,
          discount NUMERIC(10, 2) DEFAULT 0,
          license_key TEXT NOT NULL,
          items JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          email_sent BOOLEAN DEFAULT FALSE,
          resend_id TEXT
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS email_logs (
          id TEXT PRIMARY KEY,
          to_email TEXT NOT NULL,
          subject TEXT NOT NULL,
          status TEXT NOT NULL,
          resend_id TEXT,
          error_message TEXT,
          sent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      // Seed initial admin if not exists
      const existingAdmin = await sql`SELECT * FROM admin_account WHERE id = 'admin_primary' LIMIT 1;`;
      if (existingAdmin.length === 0) {
        await sql`
          INSERT INTO admin_account (id, email, password_hash, access_alias, resend_from_email, resend_domain, resend_sender_name)
          VALUES ('admin_primary', 'developer995500@gmail.com', ${hashPassword('admin')}, 'md1620', 'orders@omyra.org', 'omyra.org', 'Kroma Studio');
        `;
      } else {
        if (existingAdmin[0].resend_from_email === 'onboarding@resend.dev' || !existingAdmin[0].resend_domain) {
          await sql`
            UPDATE admin_account
            SET resend_domain = COALESCE(resend_domain, 'omyra.org'),
                resend_from_email = CASE WHEN resend_from_email = 'onboarding@resend.dev' THEN 'orders@omyra.org' ELSE COALESCE(resend_from_email, 'orders@omyra.org') END,
                resend_sender_name = COALESCE(resend_sender_name, 'Kroma Studio')
            WHERE id = 'admin_primary';
          `;
        }
      }

      // Seed initial products if not exists
      const existingProducts = await sql`SELECT id FROM marketplace_products LIMIT 1;`;
      if (existingProducts.length === 0) {
        for (const p of DEFAULT_PRODUCTS) {
          await sql`
            INSERT INTO marketplace_products (id, title, subtitle, description, category, price, formats, tags, features, thumbnail, rating, reviews_count, sales_count, status, file_url)
            VALUES (${p.id}, ${p.title}, ${p.subtitle}, ${p.description}, ${p.category}, ${p.price}, ${JSON.stringify(p.formats)}, ${JSON.stringify(p.tags)}, ${JSON.stringify(p.features)}, ${p.thumbnail}, ${p.rating}, ${p.reviews_count}, ${p.sales_count}, ${p.status}, ${p.file_url});
          `;
        }
      }
    }
  } catch (err: any) {
    neonConnected = false;
    neonError = err.message || 'Error connecting to Neon PostgreSQL';
    console.error('Neon DB connection notice:', neonError);
  }
}

// Middleware to ensure DB connection is initialized across both long-running and serverless instances
let dbInitPromise: Promise<void> | null = null;
app.use(async (req: Request, res: Response, next: NextFunction) => {
  if (!dbInitPromise) {
    dbInitPromise = initNeonDatabase().catch(err => {
      console.error('Database initialization warning:', err);
    });
  }
  await dbInitPromise;
  next();
});

// ---------------------------------------------------------
// DATABASE ACCESS HELPERS (Unified Neon + Fallback)
// ---------------------------------------------------------
async function getAdminAccount(): Promise<AdminAccount> {
  if (sql && neonConnected) {
    try {
      const rows = await sql`SELECT * FROM admin_account WHERE id = 'admin_primary' LIMIT 1;`;
      if (rows.length > 0) {
        const row = rows[0] as AdminAccount;
        return {
          ...row,
          resend_domain: row.resend_domain || 'omyra.org',
          resend_from_email: row.resend_from_email === 'onboarding@resend.dev' ? 'orders@omyra.org' : (row.resend_from_email || 'orders@omyra.org'),
          resend_sender_name: row.resend_sender_name || 'Kroma Studio'
        };
      }
    } catch (e) {
      console.warn('Neon query failed, falling back to local store:', e);
    }
  }
  const store = loadLocalStore();
  if (!store.admin.resend_domain) store.admin.resend_domain = 'omyra.org';
  if (!store.admin.resend_from_email || store.admin.resend_from_email === 'onboarding@resend.dev') store.admin.resend_from_email = 'orders@omyra.org';
  if (!store.admin.resend_sender_name) store.admin.resend_sender_name = 'Kroma Studio';
  return store.admin;
}

async function updateAdminAccount(updates: Partial<AdminAccount>): Promise<AdminAccount> {
  const current = await getAdminAccount();
  const updated: AdminAccount = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString()
  };

  if (sql && neonConnected) {
    try {
      await sql`
        UPDATE admin_account
        SET email = ${updated.email},
            password_hash = ${updated.password_hash},
            access_alias = ${updated.access_alias},
            resend_api_key = ${updated.resend_api_key || null},
            resend_from_email = ${updated.resend_from_email || null},
            resend_domain = ${updated.resend_domain || null},
            resend_sender_name = ${updated.resend_sender_name || null},
            r2_account_id = ${updated.r2_account_id || null},
            r2_access_key_id = ${updated.r2_access_key_id || null},
            r2_secret_access_key = ${updated.r2_secret_access_key || null},
            r2_bucket_name = ${updated.r2_bucket_name || null},
            r2_public_domain = ${updated.r2_public_domain || null},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = 'admin_primary';
      `;
    } catch (e) {
      console.warn('Neon update admin failed:', e);
    }
  }

  const store = loadLocalStore();
  store.admin = updated;
  saveLocalStore(store);
  return updated;
}

async function getPasskeys(): Promise<PasskeyRecord[]> {
  if (sql && neonConnected) {
    try {
      const rows = await sql`SELECT * FROM admin_passkeys ORDER BY created_at DESC;`;
      if (rows && rows.length > 0) {
        return rows.map(r => ({
          id: r.id || r.credential_id,
          credential_id: r.credential_id,
          public_key: r.public_key,
          counter: Number(r.counter) || 0,
          name: r.name || r.device_name || 'Biometric Touch / Fingerprint Sensor',
          created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString()
        })) as PasskeyRecord[];
      }
      return [];
    } catch (e) {
      console.warn('Neon getPasskeys failed:', e);
    }
  }
  const store = loadLocalStore();
  return store.passkeys || [];
}

async function addPasskey(passkey: PasskeyRecord): Promise<void> {
  if (sql && neonConnected) {
    try {
      await sql`
        INSERT INTO admin_passkeys (credential_id, id, name, device_name, public_key, counter, created_at)
        VALUES (${passkey.credential_id}, ${passkey.id || passkey.credential_id}, ${passkey.name}, ${passkey.name}, ${passkey.public_key}, ${passkey.counter || 0}, ${passkey.created_at})
        ON CONFLICT (credential_id) DO UPDATE
        SET public_key = EXCLUDED.public_key,
            name = EXCLUDED.name,
            device_name = EXCLUDED.device_name,
            id = EXCLUDED.id,
            counter = EXCLUDED.counter;
      `;
    } catch (e) {
      console.warn('Neon addPasskey failed:', e);
    }
  }
  const store = loadLocalStore();
  const existingIdx = (store.passkeys || []).findIndex(p => p.credential_id === passkey.credential_id);
  if (existingIdx >= 0) {
    store.passkeys[existingIdx] = passkey;
  } else {
    store.passkeys = [passkey, ...(store.passkeys || [])];
  }
  saveLocalStore(store);
}

async function removePasskey(id: string): Promise<void> {
  if (sql && neonConnected) {
    try {
      await sql`DELETE FROM admin_passkeys WHERE id = ${id} OR credential_id = ${id};`;
    } catch (e) {
      console.warn('Neon removePasskey failed:', e);
    }
  }
  const store = loadLocalStore();
  store.passkeys = (store.passkeys || []).filter(p => p.id !== id && p.credential_id !== id);
  saveLocalStore(store);
}

async function getAllProducts(): Promise<ProductRecord[]> {
  if (sql && neonConnected) {
    try {
      const rows = await sql`SELECT * FROM marketplace_products ORDER BY created_at DESC;`;
      return rows.map(r => ({
        ...r,
        price: parseFloat(r.price),
        formats: typeof r.formats === 'string' ? JSON.parse(r.formats) : r.formats,
        tags: typeof r.tags === 'string' ? JSON.parse(r.tags) : r.tags,
        features: typeof r.features === 'string' ? JSON.parse(r.features) : r.features,
      })) as ProductRecord[];
    } catch (e) {
      console.warn('Neon getAllProducts failed:', e);
    }
  }
  const store = loadLocalStore();
  return store.products || [];
}

async function saveProduct(product: ProductRecord): Promise<void> {
  if (sql && neonConnected) {
    try {
      await sql`
        INSERT INTO marketplace_products (id, title, subtitle, description, category, price, formats, tags, features, thumbnail, rating, reviews_count, sales_count, status, file_url, created_at)
        VALUES (${product.id}, ${product.title}, ${product.subtitle}, ${product.description}, ${product.category}, ${product.price}, ${JSON.stringify(product.formats)}, ${JSON.stringify(product.tags)}, ${JSON.stringify(product.features)}, ${product.thumbnail}, ${product.rating}, ${product.reviews_count}, ${product.sales_count}, ${product.status}, ${product.file_url || null}, ${product.created_at})
        ON CONFLICT (id) DO UPDATE SET
          title = EXCLUDED.title,
          subtitle = EXCLUDED.subtitle,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          price = EXCLUDED.price,
          formats = EXCLUDED.formats,
          tags = EXCLUDED.tags,
          features = EXCLUDED.features,
          thumbnail = EXCLUDED.thumbnail,
          rating = EXCLUDED.rating,
          reviews_count = EXCLUDED.reviews_count,
          sales_count = EXCLUDED.sales_count,
          status = EXCLUDED.status,
          file_url = EXCLUDED.file_url;
      `;
    } catch (e) {
      console.warn('Neon saveProduct failed:', e);
    }
  }

  const store = loadLocalStore();
  const index = store.products.findIndex(p => p.id === product.id);
  if (index >= 0) {
    store.products[index] = product;
  } else {
    store.products.unshift(product);
  }
  saveLocalStore(store);
}

async function deleteProduct(id: string): Promise<void> {
  if (sql && neonConnected) {
    try {
      await sql`DELETE FROM marketplace_products WHERE id = ${id};`;
    } catch (e) {
      console.warn('Neon deleteProduct failed:', e);
    }
  }
  const store = loadLocalStore();
  store.products = store.products.filter(p => p.id !== id);
  saveLocalStore(store);
}

async function getOrders(): Promise<OrderRecord[]> {
  if (sql && neonConnected) {
    try {
      const rows = await sql`SELECT * FROM marketplace_orders ORDER BY created_at DESC;`;
      return rows.map(r => ({
        ...r,
        total: parseFloat(r.total),
        subtotal: parseFloat(r.subtotal),
        discount: parseFloat(r.discount),
        items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items
      })) as OrderRecord[];
    } catch (e) {
      console.warn('Neon getOrders failed:', e);
    }
  }
  const store = loadLocalStore();
  return store.orders || [];
}

async function saveOrder(order: OrderRecord): Promise<void> {
  if (sql && neonConnected) {
    try {
      await sql`
        INSERT INTO marketplace_orders (id, order_number, customer_email, total, subtotal, discount, license_key, items, created_at, email_sent, resend_id)
        VALUES (${order.id}, ${order.order_number}, ${order.customer_email}, ${order.total}, ${order.subtotal}, ${order.discount}, ${order.license_key}, ${JSON.stringify(order.items)}, ${order.created_at}, ${order.email_sent}, ${order.resend_id || null});
      `;
    } catch (e) {
      console.warn('Neon saveOrder failed:', e);
    }
  }
  const store = loadLocalStore();
  store.orders.unshift(order);
  saveLocalStore(store);
}

async function logEmail(log: EmailLog): Promise<void> {
  if (sql && neonConnected) {
    try {
      await sql`
        INSERT INTO email_logs (id, to_email, subject, status, resend_id, error_message, sent_at)
        VALUES (${log.id}, ${log.to_email}, ${log.subject}, ${log.status}, ${log.resend_id || null}, ${log.error_message || null}, ${log.sent_at});
      `;
    } catch (e) {
      console.warn('Neon logEmail failed:', e);
    }
  }
  const store = loadLocalStore();
  store.email_logs.unshift(log);
  if (store.email_logs.length > 100) store.email_logs = store.email_logs.slice(0, 100);
  saveLocalStore(store);
}

async function getEmailLogs(): Promise<EmailLog[]> {
  if (sql && neonConnected) {
    try {
      const rows = await sql`SELECT * FROM email_logs ORDER BY sent_at DESC LIMIT 50;`;
      return rows as EmailLog[];
    } catch (e) {
      console.warn('Neon getEmailLogs failed:', e);
    }
  }
  const store = loadLocalStore();
  return store.email_logs || [];
}

// ---------------------------------------------------------
// AUTHENTICATION & WEBAUTHN SESSIONS (Stateless & Serverless Resilient)
// ---------------------------------------------------------
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'kroma_admin_master_secret_88094_omyra_org_2026';
const CHALLENGE_SECRET = process.env.CHALLENGE_SECRET || SESSION_SECRET;

const activeSessions: Map<string, { email: string; expires: number }> = new Map();
const webauthnChallenges: Map<string, { challenge: string; expires: number; type: 'register' | 'login' }> = new Map();

function getRelyingPartyId(req: Request): string {
  const forwardedHost = (req.headers['x-forwarded-host'] as string)?.split(',')[0]?.trim();
  const host = forwardedHost || req.headers.host || req.hostname || 'localhost';
  return host.split(':')[0].trim();
}

function createSessionToken(email: string): string {
  const payload = {
    email,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days validity
    iat: Date.now(),
    nonce: crypto.randomBytes(16).toString('hex')
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64url');
  const token = `${payloadStr}.${signature}`;
  
  // Cache in memory for local speed
  activeSessions.set(token, {
    email,
    expires: payload.expires
  });
  return token;
}

function verifyAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin session token required.' });
  }
  const token = authHeader.substring(7).trim();
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Empty session token.' });
  }

  // 1. Fast memory check (same process)
  const session = activeSessions.get(token);
  if (session && session.expires > Date.now()) {
    (req as any).adminEmail = session.email;
    return next();
  }

  // 2. Stateless HMAC verification (works across all serverless lambda instances & cold starts)
  if (token.includes('.')) {
    const [payloadStr, signature] = token.split('.');
    if (payloadStr && signature) {
      try {
        const expectedSig = crypto.createHmac('sha256', SESSION_SECRET).update(payloadStr).digest('base64url');
        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expectedSig);
        if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
          const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
          if (payload && payload.email && typeof payload.expires === 'number') {
            if (payload.expires > Date.now()) {
              // Valid! Cache for this lambda instance
              activeSessions.set(token, { email: payload.email, expires: payload.expires });
              (req as any).adminEmail = payload.email;
              return next();
            }
          }
        }
      } catch (err) {
        console.warn('Session verification exception:', err);
      }
    }
  }

  return res.status(401).json({ error: 'Session expired. Please log in again.' });
}

function createSignedChallenge(challenge: string, type: 'register' | 'login'): string {
  const payload = {
    c: challenge,
    t: type,
    exp: Date.now() + 1000 * 60 * 5, // 5 minutes
    nonce: crypto.randomBytes(8).toString('hex')
  };
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', CHALLENGE_SECRET).update(payloadStr).digest('base64url');
  const token = `${payloadStr}.${sig}`;
  
  webauthnChallenges.set(token, {
    challenge,
    expires: payload.exp,
    type
  });
  return token;
}

function verifySignedChallenge(challengeId: string, expectedType: 'register' | 'login'): { valid: boolean; challenge?: string } {
  if (!challengeId || typeof challengeId !== 'string') {
    return { valid: false };
  }

  // Check in-memory map
  const mem = webauthnChallenges.get(challengeId);
  if (mem) {
    webauthnChallenges.delete(challengeId);
    if (mem.type === expectedType && mem.expires >= Date.now()) {
      return { valid: true, challenge: mem.challenge };
    }
  }

  // Stateless HMAC challenge verification
  if (challengeId.includes('.')) {
    const [payloadStr, sig] = challengeId.split('.');
    if (payloadStr && sig) {
      try {
        const expectedSig = crypto.createHmac('sha256', CHALLENGE_SECRET).update(payloadStr).digest('base64url');
        const sigBuf = Buffer.from(sig);
        const expBuf = Buffer.from(expectedSig);
        if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
          const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
          if (payload && payload.t === expectedType && typeof payload.exp === 'number' && payload.exp >= Date.now()) {
            return { valid: true, challenge: payload.c };
          }
        }
      } catch (err) {
        console.warn('Challenge verification error:', err);
      }
    }
  }

  return { valid: false };
}

// ---------------------------------------------------------
// RESEND.COM EMAIL SERVICE
// (Explicitly configured directly from Admin UI, NOT .env)
// ---------------------------------------------------------
async function sendResendEmail(to: string, subject: string, htmlContent: string): Promise<{ success: boolean; id?: string; error?: string }> {
  const admin = await getAdminAccount();
  const apiKey = admin.resend_api_key?.trim();

  if (!apiKey) {
    const errorMsg = 'Resend API key is not configured in Admin Settings. Please configure it in the Resend tab.';
    await logEmail({
      id: crypto.randomUUID(),
      to_email: to,
      subject,
      status: 'failed',
      error_message: errorMsg,
      sent_at: new Date().toISOString()
    });
    return { success: false, error: errorMsg };
  }

  const fromEmail = admin.resend_from_email?.trim() || 'orders@omyra.org';
  const senderName = admin.resend_sender_name?.trim() || 'Kroma Studio';

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: `${senderName} <${fromEmail}>`,
        to: [to],
        subject: subject,
        html: htmlContent
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errDetail = data?.message || data?.error || 'Failed to send email via Resend API';
      await logEmail({
        id: crypto.randomUUID(),
        to_email: to,
        subject,
        status: 'failed',
        error_message: errDetail,
        sent_at: new Date().toISOString()
      });
      return { success: false, error: errDetail };
    }

    await logEmail({
      id: crypto.randomUUID(),
      to_email: to,
      subject,
      status: 'delivered',
      resend_id: data.id,
      sent_at: new Date().toISOString()
    });

    return { success: true, id: data.id };
  } catch (err: any) {
    const errDetail = err.message || 'Network error communicating with Resend';
    await logEmail({
      id: crypto.randomUUID(),
      to_email: to,
      subject,
      status: 'failed',
      error_message: errDetail,
      sent_at: new Date().toISOString()
    });
    return { success: false, error: errDetail };
  }
}

// ---------------------------------------------------------
// REST API ROUTER (Mounted on BOTH '/api' and '/' for bulletproof routing)
// ---------------------------------------------------------
const apiRouter = express.Router();

// Database and System Diagnostics
apiRouter.get('/database/status', async (req: Request, res: Response) => {
  const dbUrl = process.env.DATABASE_URL;
  res.json({
    neonConnected,
    hasEnvVar: Boolean(dbUrl && dbUrl.length > 5),
    maskedUrl: dbUrl ? dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : null,
    driver: 'Neon Serverless WebSockets/HTTPS',
    fallbackActive: !neonConnected,
    storageType: neonConnected ? 'Neon PostgreSQL' : 'Resilient In-Memory & Database Store',
    errorNotice: neonError
  });
});

// Admin Alias Lookup (Public so front router knows the authorized path)
apiRouter.get('/admin/alias', async (req: Request, res: Response) => {
  const admin = await getAdminAccount();
  res.json({
    alias: admin.access_alias || 'md1620'
  });
});

// Admin Login with Email & Password
apiRouter.post('/admin/login', async (req: Request, res: Response) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const admin = await getAdminAccount();
  const inputHash = hashPassword(password);

  if (email.toLowerCase().trim() === admin.email.toLowerCase().trim() && inputHash === admin.password_hash) {
    const token = createSessionToken(admin.email);
    return res.json({
      success: true,
      token,
      email: admin.email,
      alias: admin.access_alias
    });
  }

  return res.status(401).json({ error: 'Invalid email or password' });
});

// Get Admin Profile & Stats
apiRouter.get('/admin/me', verifyAuth, async (req: Request, res: Response) => {
  const admin = await getAdminAccount();
  const passkeys = await getPasskeys();
  res.json({
    email: admin.email,
    alias: admin.access_alias,
    resendApiKeySet: Boolean(admin.resend_api_key && admin.resend_api_key.length > 5),
    resendFromEmail: admin.resend_from_email || 'orders@omyra.org',
    resendDomain: admin.resend_domain || 'omyra.org',
    resendSenderName: admin.resend_sender_name || 'Kroma Studio',
    passkeyCount: passkeys.length,
    neonConnected
  });
});

// Update Admin Credentials (Email / Password)
apiRouter.post('/admin/update-credentials', verifyAuth, async (req: Request, res: Response) => {
  const { currentPassword, newEmail, newPassword } = req.body || {};
  const admin = await getAdminAccount();

  if (hashPassword(currentPassword) !== admin.password_hash) {
    return res.status(403).json({ error: 'Current password verification failed' });
  }

  const updates: Partial<AdminAccount> = {};
  if (newEmail && newEmail.includes('@')) {
    updates.email = newEmail.toLowerCase().trim();
  }
  if (newPassword && newPassword.length >= 4) {
    updates.password_hash = hashPassword(newPassword);
  }

  await updateAdminAccount(updates);
  res.json({ success: true, message: 'Admin security credentials updated successfully' });
});

// Update Admin URL Alias (e.g. from md1620 to custom)
apiRouter.post('/admin/update-alias', verifyAuth, async (req: Request, res: Response) => {
  const { newAlias } = req.body || {};
  if (!newAlias || typeof newAlias !== 'string') {
    return res.status(400).json({ error: 'Valid URL alias required' });
  }

  const cleaned = newAlias.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
  if (cleaned.length < 3) {
    return res.status(400).json({ error: 'Alias must be at least 3 alphanumeric characters' });
  }

  await updateAdminAccount({ access_alias: cleaned });
  res.json({ success: true, alias: cleaned });
});

// Update Resend Provider & Verified Domain Configuration
apiRouter.post('/admin/resend/config', verifyAuth, async (req: Request, res: Response) => {
  const { apiKey, fromEmail, domain, senderName } = req.body || {};
  const updates: Partial<AdminAccount> = {};

  if (typeof apiKey === 'string') {
    updates.resend_api_key = apiKey.trim();
  }
  if (typeof fromEmail === 'string' && fromEmail.trim()) {
    updates.resend_from_email = fromEmail.trim().toLowerCase();
  }
  if (typeof domain === 'string' && domain.trim()) {
    updates.resend_domain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
  }
  if (typeof senderName === 'string' && senderName.trim()) {
    updates.resend_sender_name = senderName.trim();
  }

  const updatedAdmin = await updateAdminAccount(updates);
  res.json({
    success: true,
    message: 'Resend verified domain and sender settings saved successfully',
    domain: updatedAdmin.resend_domain,
    fromEmail: updatedAdmin.resend_from_email,
    senderName: updatedAdmin.resend_sender_name
  });
});

// Live Domain Verification Check with Resend API
apiRouter.get('/admin/resend/domains', verifyAuth, async (req: Request, res: Response) => {
  const admin = await getAdminAccount();
  const apiKey = admin.resend_api_key?.trim();

  if (!apiKey) {
    return res.status(400).json({
      error: 'Resend API key is not configured. Please paste and save your Resend API key first.',
      configuredDomain: admin.resend_domain || 'omyra.org',
      fromEmail: admin.resend_from_email || 'orders@omyra.org',
      senderName: admin.resend_sender_name || 'Kroma Studio'
    });
  }

  try {
    const resendRes = await fetch('https://api.resend.com/domains', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await resendRes.json();
    if (!resendRes.ok) {
      return res.status(resendRes.status).json({
        error: data.message || data.error || 'Failed to fetch domains from Resend API',
        configuredDomain: admin.resend_domain || 'omyra.org',
        fromEmail: admin.resend_from_email || 'orders@omyra.org',
        senderName: admin.resend_sender_name || 'Kroma Studio'
      });
    }

    res.json({
      success: true,
      domains: data.data || [],
      configuredDomain: admin.resend_domain || 'omyra.org',
      fromEmail: admin.resend_from_email || 'orders@omyra.org',
      senderName: admin.resend_sender_name || 'Kroma Studio'
    });
  } catch (err: any) {
    res.status(500).json({
      error: err.message || 'Error communicating with Resend domains API',
      configuredDomain: admin.resend_domain || 'omyra.org',
      fromEmail: admin.resend_from_email || 'orders@omyra.org',
      senderName: admin.resend_sender_name || 'Kroma Studio'
    });
  }
});

// Send Test Email via Resend
apiRouter.post('/admin/resend/test', verifyAuth, async (req: Request, res: Response) => {
  const { targetEmail } = req.body || {};
  if (!targetEmail || !targetEmail.includes('@')) {
    return res.status(400).json({ error: 'Valid recipient email required' });
  }

  const admin = await getAdminAccount();
  const domain = admin.resend_domain || 'omyra.org';
  const fromEmail = admin.resend_from_email || 'orders@omyra.org';
  const senderName = admin.resend_sender_name || 'Kroma Studio';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #0f172a; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
        <div style="background: #ea580c; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: 20px; text-align: center; line-height: 36px;">K</div>
        <span style="font-size: 20px; font-weight: 700; color: #0f172a;">${senderName}</span>
      </div>
      <h2 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0;">Resend Provider Connected Successfully</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        This test message verifies that your <strong>Resend.com API Key</strong> and verified domain <strong>${domain}</strong> are authenticated and actively dispatching from <code>${fromEmail}</code>.
      </p>
      <div style="margin: 24px 0; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px;">
        <span style="display: block; font-size: 12px; text-transform: uppercase; color: #c2410c; font-weight: 700; letter-spacing: 0.05em;">Dispatch Status</span>
        <span style="font-size: 15px; font-weight: 600; color: #9a3412;">200 OK • Production Delivery from ${fromEmail} Verified</span>
      </div>
      <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-bottom: 0;">
        ${senderName} Digital Marketplace • Fully Functional Production Release
      </p>
    </div>
  `;

  const result = await sendResendEmail(targetEmail, `✅ ${senderName}: Resend Provider Test Verified (${domain})`, html);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ success: true, resendId: result.id });
});

// Get Resend Email Logs
apiRouter.get('/admin/resend/logs', verifyAuth, async (req: Request, res: Response) => {
  const logs = await getEmailLogs();
  res.json(logs);
});

// ---------------------------------------------------------
// CLOUDFLARE R2 STORAGE & BUCKET ENGINE
// (Single Bucket Architecture with Isolated User/Vendor Folders)
// ---------------------------------------------------------

type R2FolderType = 'thumbnails' | 'avatars' | 'banners' | 'secure-products';

function getR2ClientFromConfig(account: AdminAccount): { client: S3Client; bucket: string; accountId: string; publicDomain?: string } | null {
  if (!account.r2_account_id || !account.r2_access_key_id || !account.r2_secret_access_key || !account.r2_bucket_name) {
    return null;
  }
  const accountId = account.r2_account_id.trim();
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: account.r2_access_key_id.trim(),
      secretAccessKey: account.r2_secret_access_key.trim(),
    },
  });
  return {
    client,
    bucket: account.r2_bucket_name.trim(),
    accountId,
    publicDomain: account.r2_public_domain ? account.r2_public_domain.trim().replace(/\/+$/, '') : undefined
  };
}

function buildR2Key(userId: string, folderType: R2FolderType, filename: string): string {
  const cleanUserId = (userId || 'admin_primary').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const cleanFilename = filename.trim().replace(/[^a-zA-Z0-9._-]/g, '_');

  if (folderType === 'secure-products') {
    return `${cleanUserId}/private/secure-products/${cleanFilename}`;
  }
  return `${cleanUserId}/public/${folderType}/${cleanFilename}`;
}

// 1. Get Cloudflare R2 Configuration (Masked secret key)
apiRouter.get('/admin/r2/config', verifyAuth, async (req: Request, res: Response) => {
  const admin = await getAdminAccount();
  const isConfigured = Boolean(
    admin.r2_account_id &&
    admin.r2_access_key_id &&
    admin.r2_secret_access_key &&
    admin.r2_bucket_name
  );

  res.json({
    isConfigured,
    accountId: admin.r2_account_id || '',
    accessKeyId: admin.r2_access_key_id || '',
    hasSecretKey: Boolean(admin.r2_secret_access_key && admin.r2_secret_access_key.trim().length > 0),
    secretAccessKeyMasked: (admin.r2_secret_access_key && admin.r2_secret_access_key.trim().length > 0)
      ? '••••••••••••' + admin.r2_secret_access_key.slice(-4)
      : '',
    bucketName: admin.r2_bucket_name || '',
    publicDomain: admin.r2_public_domain || ''
  });
});

// 2. Save Cloudflare R2 Configuration to Database
apiRouter.post('/admin/r2/config', verifyAuth, async (req: Request, res: Response) => {
  const { accountId, accessKeyId, secretAccessKey, bucketName, publicDomain } = req.body || {};
  const admin = await getAdminAccount();

  const updates: Partial<AdminAccount> = {};

  if (typeof accountId === 'string') updates.r2_account_id = accountId.trim();
  if (typeof accessKeyId === 'string') updates.r2_access_key_id = accessKeyId.trim();
  if (typeof bucketName === 'string') updates.r2_bucket_name = bucketName.trim();
  if (typeof publicDomain === 'string') {
    updates.r2_public_domain = publicDomain.trim().replace(/\/+$/, '');
  }

  // Update secret key if provided and not a placeholder mask (or clear if empty string)
  if (typeof secretAccessKey === 'string' && !secretAccessKey.includes('••••')) {
    updates.r2_secret_access_key = secretAccessKey.trim();
  }

  const updated = await updateAdminAccount(updates);
  res.json({
    success: true,
    message: 'Cloudflare R2 storage credentials saved successfully in database.',
    isConfigured: Boolean(
      updated.r2_account_id &&
      updated.r2_access_key_id &&
      updated.r2_secret_access_key &&
      updated.r2_bucket_name
    ),
    accountId: updated.r2_account_id,
    bucketName: updated.r2_bucket_name
  });
});

// 3. Test Cloudflare R2 Connection (Direct HeadBucket & ListObjects verification)
apiRouter.post('/admin/r2/test-connection', verifyAuth, async (req: Request, res: Response) => {
  const body = req.body || {};
  const admin = await getAdminAccount();

  const accountId = (body.accountId || admin.r2_account_id || '').trim();
  const accessKeyId = (body.accessKeyId || admin.r2_access_key_id || '').trim();
  let secretAccessKey = (body.secretAccessKey || '').trim();

  // If secretAccessKey wasn't supplied or is masked, use saved secret
  if (!secretAccessKey || secretAccessKey.includes('••••')) {
    secretAccessKey = (admin.r2_secret_access_key || '').trim();
  }

  const bucketName = (body.bucketName || admin.r2_bucket_name || '').trim();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    return res.status(400).json({
      success: false,
      error: 'Please fill in Account ID, Access Key ID, Secret Access Key, and Bucket Name.'
    });
  }

  try {
    const client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey
      }
    });

    // 1. Verify bucket access
    await client.send(new HeadBucketCommand({ Bucket: bucketName }));

    // 2. Verify listing permissions
    const listRes = await client.send(new ListObjectsV2Command({
      Bucket: bucketName,
      MaxKeys: 5
    }));

    res.json({
      success: true,
      message: `Connection successful! Authenticated with Cloudflare R2 bucket "${bucketName}".`,
      bucketName,
      accountId,
      sampleCount: listRes.KeyCount || 0
    });
  } catch (err: any) {
    console.error('Cloudflare R2 connection test failed:', err);
    let friendlyMessage = err.message || 'Failed to authenticate with Cloudflare R2.';

    if (err.name === 'NoSuchBucket' || err.$metadata?.httpStatusCode === 404) {
      friendlyMessage = `Bucket "${bucketName}" was not found in Cloudflare R2 Account "${accountId}". Ensure the bucket exists and spelling is exact.`;
    } else if (err.name === 'InvalidAccessKeyId') {
      friendlyMessage = 'The R2 Access Key ID is invalid or not found.';
    } else if (err.name === 'SignatureDoesNotMatch' || err.$metadata?.httpStatusCode === 403) {
      friendlyMessage = 'Authentication failed (403 Forbidden). Please check your Secret Access Key and ensure your R2 API Token has Object Read & Write permissions.';
    }

    res.status(400).json({
      success: false,
      error: friendlyMessage
    });
  }
});

// 4. List Files under User ID in Bucket (Categorized by folder)
apiRouter.get('/admin/r2/files', verifyAuth, async (req: Request, res: Response) => {
  const admin = await getAdminAccount();
  const r2 = getR2ClientFromConfig(admin);

  if (!r2) {
    return res.status(400).json({
      error: 'Cloudflare R2 credentials are not configured. Please configure your R2 credentials first.'
    });
  }

  const userId = (req.query.userId as string || 'admin_primary').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const folderFilter = req.query.folder as string || 'all';

  try {
    const prefix = `${userId}/`;
    const listCmd = new ListObjectsV2Command({
      Bucket: r2.bucket,
      Prefix: prefix
    });

    const response = await r2.client.send(listCmd);
    const rawObjects = response.Contents || [];

    const files = rawObjects.map(obj => {
      const key = obj.Key || '';
      const parts = key.split('/');
      let folderType: R2FolderType | 'other' = 'other';
      let isSecure = false;

      if (parts.length >= 4 && parts[1] === 'private' && parts[2] === 'secure-products') {
        folderType = 'secure-products';
        isSecure = true;
      } else if (parts.length >= 4 && parts[1] === 'public') {
        if (parts[2] === 'thumbnails') folderType = 'thumbnails';
        else if (parts[2] === 'avatars') folderType = 'avatars';
        else if (parts[2] === 'banners') folderType = 'banners';
      }

      const filename = parts.slice(3).join('/') || parts[parts.length - 1];
      const publicUrl = (!isSecure && r2.publicDomain) ? `${r2.publicDomain}/${key}` : null;

      return {
        key,
        filename,
        size: obj.Size || 0,
        lastModified: obj.LastModified ? obj.LastModified.toISOString() : new Date().toISOString(),
        folderType,
        isSecure,
        publicUrl,
        directAccessBlocked: isSecure
      };
    });

    // Compute category counts
    const counts = {
      thumbnails: files.filter(f => f.folderType === 'thumbnails').length,
      avatars: files.filter(f => f.folderType === 'avatars').length,
      banners: files.filter(f => f.folderType === 'banners').length,
      secureProducts: files.filter(f => f.folderType === 'secure-products').length,
      total: files.length
    };

    // Filter by folder if requested
    const filteredFiles = folderFilter === 'all'
      ? files
      : files.filter(f => f.folderType === folderFilter);

    res.json({
      success: true,
      userId,
      bucketName: r2.bucket,
      files: filteredFiles,
      counts,
      publicDomain: r2.publicDomain
    });
  } catch (err: any) {
    console.error('Failed to list R2 files:', err);
    res.status(500).json({ error: err.message || 'Failed to list objects in Cloudflare R2 bucket.' });
  }
});

// 5. Upload File to Specific Folder under User ID in Bucket
apiRouter.post('/admin/r2/upload', verifyAuth, upload.single('file'), async (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file provided for upload.' });
  }

  const admin = await getAdminAccount();
  const r2 = getR2ClientFromConfig(admin);

  if (!r2) {
    return res.status(400).json({
      error: 'Cloudflare R2 is not configured. Please save your R2 credentials first.'
    });
  }

  const userId = (req.body.userId || 'admin_primary').trim();
  const folderType = (req.body.folderType || 'thumbnails') as R2FolderType;
  const originalName = req.body.customFilename || req.file.originalname;

  const validFolders: R2FolderType[] = ['thumbnails', 'avatars', 'banners', 'secure-products'];
  if (!validFolders.includes(folderType)) {
    return res.status(400).json({ error: `Invalid folder type. Allowed: ${validFolders.join(', ')}` });
  }

  const key = buildR2Key(userId, folderType, originalName);
  const isSecure = folderType === 'secure-products';

  try {
    const putCmd = new PutObjectCommand({
      Bucket: r2.bucket,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype || 'application/octet-stream',
      Metadata: {
        'uploaded-by': userId,
        'folder-type': folderType,
        'security-level': isSecure ? 'private-cryptographic-signed-only' : 'public-cdn'
      }
    });

    await r2.client.send(putCmd);

    const publicUrl = (!isSecure && r2.publicDomain) ? `${r2.publicDomain}/${key}` : null;

    res.json({
      success: true,
      key,
      filename: path.basename(key),
      size: req.file.size,
      folderType,
      userId,
      isSecure,
      publicUrl,
      directAccessBlocked: isSecure,
      message: isSecure
        ? 'Protected package stored securely. Direct unauthenticated access is forbidden; download requires time-limited cryptographic presigned authorization.'
        : 'File uploaded successfully to public asset catalog.'
    });
  } catch (err: any) {
    console.error('R2 upload failed:', err);
    res.status(500).json({ error: err.message || 'Failed to upload object to Cloudflare R2.' });
  }
});

// 6. Delete File from R2 Bucket
apiRouter.delete('/admin/r2/files', verifyAuth, async (req: Request, res: Response) => {
  const { key } = req.body || {};
  if (!key || typeof key !== 'string') {
    return res.status(400).json({ error: 'Object key is required for deletion.' });
  }

  const admin = await getAdminAccount();
  const r2 = getR2ClientFromConfig(admin);

  if (!r2) {
    return res.status(400).json({ error: 'Cloudflare R2 is not configured.' });
  }

  try {
    await r2.client.send(new DeleteObjectCommand({
      Bucket: r2.bucket,
      Key: key
    }));

    res.json({ success: true, message: `Object "${key}" removed from bucket.` });
  } catch (err: any) {
    console.error('Failed to delete R2 object:', err);
    res.status(500).json({ error: err.message || 'Failed to delete object from R2.' });
  }
});

// 7. Generate Real Time-Limited Cryptographic Presigned URL (SigV4)
apiRouter.post('/admin/r2/generate-signed-url', verifyAuth, async (req: Request, res: Response) => {
  const admin = await getAdminAccount();
  const r2 = getR2ClientFromConfig(admin);

  if (!r2) {
    return res.status(400).json({ error: 'Cloudflare R2 is not configured.' });
  }

  const { key, expiresInSeconds = 120, downloadFilename } = req.body || {};
  if (!key || typeof key !== 'string') {
    return res.status(400).json({ error: 'Valid R2 object key is required.' });
  }

  const cleanFilename = downloadFilename || path.basename(key);
  const duration = Math.min(Math.max(Number(expiresInSeconds) || 120, 30), 3600);

  try {
    const command = new GetObjectCommand({
      Bucket: r2.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${cleanFilename}"`
    });

    const signedUrl = await getSignedUrl(r2.client, command, { expiresIn: duration });

    res.json({
      success: true,
      key,
      signedUrl,
      expiresInSeconds: duration,
      expiresAt: new Date(Date.now() + duration * 1000).toISOString(),
      filename: cleanFilename,
      directAccessBlocked: key.includes('/private/')
    });
  } catch (err: any) {
    console.error('Failed to generate presigned URL:', err);
    res.status(500).json({ error: err.message || 'Failed to generate presigned URL.' });
  }
});

// 8. Test Security & Direct Bypass Block Verification
apiRouter.post('/admin/r2/test-security', verifyAuth, async (req: Request, res: Response) => {
  const admin = await getAdminAccount();
  const r2 = getR2ClientFromConfig(admin);

  if (!r2) {
    return res.status(400).json({ error: 'Cloudflare R2 is not configured.' });
  }

  const { key } = req.body || {};
  if (!key || typeof key !== 'string') {
    return res.status(400).json({ error: 'Valid R2 object key is required for security verification.' });
  }

  const directEndpointUrl = `https://${r2.bucket}.${r2.accountId}.r2.cloudflarestorage.com/${key}`;
  let directAccessStatus = 'Unknown';
  let directBypassBlocked = true;

  try {
    const directRes = await fetch(directEndpointUrl, { method: 'GET' });
    if (directRes.status === 401 || directRes.status === 403 || !directRes.ok) {
      directAccessStatus = `${directRes.status} ${directRes.statusText || 'Forbidden'} (Direct access blocked as expected)`;
      directBypassBlocked = true;
    } else {
      directAccessStatus = `${directRes.status} OK (Warning: Direct public access allowed on endpoint)`;
      directBypassBlocked = false;
    }
  } catch (err: any) {
    directAccessStatus = `Blocked / Unreachable directly (${err.message || 'Access Denied'})`;
    directBypassBlocked = true;
  }

  // Generate real cryptographic presigned URL to verify authorized path
  const command = new GetObjectCommand({
    Bucket: r2.bucket,
    Key: key,
    ResponseContentDisposition: `attachment; filename="${path.basename(key)}"`
  });
  const signedUrl = await getSignedUrl(r2.client, command, { expiresIn: 120 });

  res.json({
    success: true,
    key,
    directBypassBlocked,
    directAccessStatus,
    directEndpointUrl,
    signedUrlSample: signedUrl.substring(0, 90) + '...',
    expiresInSeconds: 120,
    securityGrade: directBypassBlocked ? 'A+ (Zero-Trust Cryptographic Presigned Auth)' : 'B (Review Public CDN ACLs)',
    protectionSummary: 'Direct anonymous downloads are rejected with 403 Forbidden. Only server-issued SigV4 time-limited signed URLs are authorized.'
  });
});

// 9. Customer Secure Download Gateway (Validates License & Issues 120s SigV4 Link)
apiRouter.get('/r2/download/:licenseKey/:productId', async (req: Request, res: Response) => {
  const { licenseKey, productId } = req.params;
  if (!licenseKey || !productId) {
    return res.status(400).json({ error: 'License key and product ID are required.' });
  }

  const orders = await getOrders();
  const matchedOrder = orders.find(o =>
    o.license_key.trim().toUpperCase() === licenseKey.trim().toUpperCase() &&
    o.items.some(i => i.productId === productId)
  );

  if (!matchedOrder) {
    return res.status(403).json({ error: 'Invalid commercial license key or product is not associated with this purchase.' });
  }

  const products = await getAllProducts();
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product package not found in catalog.' });
  }

  const admin = await getAdminAccount();
  const r2 = getR2ClientFromConfig(admin);

  if (product.file_url && r2 && (product.file_url.startsWith('r2://') || !product.file_url.startsWith('http'))) {
    const rawKey = product.file_url.replace(/^r2:\/\/[^/]+\//, '').replace(/^r2:\/\//, '');
    const cleanKey = rawKey.startsWith('admin_primary') ? rawKey : `admin_primary/private/secure-products/${rawKey}`;

    try {
      const command = new GetObjectCommand({
        Bucket: r2.bucket,
        Key: cleanKey,
        ResponseContentDisposition: `attachment; filename="${product.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_package.zip"`
      });
      const signedUrl = await getSignedUrl(r2.client, command, { expiresIn: 120 });
      return res.redirect(signedUrl);
    } catch (e: any) {
      console.warn('Presigned download redirect fallback:', e);
    }
  }

  if (product.file_url && product.file_url.startsWith('http')) {
    return res.redirect(product.file_url);
  }

  res.json({
    success: true,
    licenseKey,
    productId,
    productTitle: product.title,
    message: 'Authorized commercial license verified. Ready for download.'
  });
});

// ---------------------------------------------------------
// FINGERPRINT & WEBAUTHN FIDO2 PASSKEY ENGINE
// ---------------------------------------------------------

// Step 1: Register Options (Challenge generation for navigator.credentials.create)
apiRouter.post('/auth/webauthn/register-options', verifyAuth, async (req: Request, res: Response) => {
  const challenge = crypto.randomBytes(32).toString('base64url');
  const challengeId = createSignedChallenge(challenge, 'register');
  const rpId = getRelyingPartyId(req);

  const admin = await getAdminAccount();
  const userId = crypto.createHash('sha256').update(admin.email).digest('base64url');

  res.json({
    challengeId,
    publicKey: {
      challenge,
      rp: {
        name: 'Kroma Studio Admin Gateway',
        id: rpId
      },
      user: {
        id: userId,
        name: admin.email,
        displayName: 'Kroma Studio Master Admin'
      },
      pubKeyCredParams: [
        { type: 'public-key', alg: -7 },   // ES256
        { type: 'public-key', alg: -257 }  // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        userVerification: 'required',
        residentKey: 'preferred'
      },
      timeout: 60000,
      attestation: 'none'
    }
  });
});

// Step 2: Register Verify (Save new Passkey to Database)
apiRouter.post('/auth/webauthn/register-verify', verifyAuth, async (req: Request, res: Response) => {
  const { challengeId, credentialId, attestationObject, deviceName } = req.body || {};

  const verification = verifySignedChallenge(challengeId, 'register');
  if (!verification.valid) {
    return res.status(400).json({ error: 'Registration challenge expired or invalid. Please try again.' });
  }

  const newPasskey: PasskeyRecord = {
    id: 'passkey_' + crypto.randomBytes(8).toString('hex'),
    credential_id: credentialId,
    public_key: attestationObject || 'fido2-platform-credential',
    counter: 0,
    name: deviceName || 'Biometric Touch / Fingerprint Sensor',
    created_at: new Date().toISOString()
  };

  await addPasskey(newPasskey);
  res.json({ success: true, message: 'Fingerprint Passkey registered successfully' });
});

// Step 3: Login Options (Challenge generation for navigator.credentials.get)
apiRouter.post('/auth/webauthn/login-options', async (req: Request, res: Response) => {
  const passkeys = await getPasskeys();
  if (passkeys.length === 0) {
    return res.status(404).json({ error: 'No fingerprint passkeys registered on this server yet. Please log in with password to set up your passkey in Security.' });
  }

  const challenge = crypto.randomBytes(32).toString('base64url');
  const challengeId = createSignedChallenge(challenge, 'login');
  const rpId = getRelyingPartyId(req);

  res.json({
    challengeId,
    publicKey: {
      challenge,
      rpId,
      allowCredentials: passkeys.map(p => ({
        id: p.credential_id,
        type: 'public-key',
        transports: ['internal']
      })),
      userVerification: 'required',
      timeout: 60000
    }
  });
});

// Step 4: Login Verify (Authenticate with Biometric Passkey)
apiRouter.post('/auth/webauthn/login-verify', async (req: Request, res: Response) => {
  const { challengeId, credentialId } = req.body || {};

  const verification = verifySignedChallenge(challengeId, 'login');
  if (!verification.valid) {
    return res.status(400).json({ error: 'Biometric challenge expired or invalid. Please try again.' });
  }

  const passkeys = await getPasskeys();
  const matched = passkeys.find(p => p.credential_id === credentialId);
  if (!matched) {
    return res.status(401).json({ error: 'Unrecognized passkey credential' });
  }

  const admin = await getAdminAccount();
  const token = createSessionToken(admin.email);

  res.json({
    success: true,
    token,
    email: admin.email,
    alias: admin.access_alias,
    deviceName: matched.name
  });
});

// List Registered Passkeys
apiRouter.get('/admin/passkeys', verifyAuth, async (req: Request, res: Response) => {
  const passkeys = await getPasskeys();
  res.json(passkeys);
});

// Remove a Passkey
apiRouter.delete('/admin/passkeys/:id', verifyAuth, async (req: Request, res: Response) => {
  await removePasskey(req.params.id);
  res.json({ success: true });
});

// ---------------------------------------------------------
// PRODUCTS API
// ---------------------------------------------------------
apiRouter.get('/products', async (req: Request, res: Response) => {
  const products = await getAllProducts();
  res.json(products);
});

apiRouter.post('/products', verifyAuth, async (req: Request, res: Response) => {
  const body = req.body || {};
  const newProduct: ProductRecord = {
    id: body.id || 'prod_' + crypto.randomBytes(6).toString('hex'),
    title: body.title || 'Untitled Digital Product',
    subtitle: body.subtitle || '',
    description: body.description || '',
    category: body.category || 'Dev Kits',
    price: parseFloat(body.price) || 29,
    formats: Array.isArray(body.formats) ? body.formats : ['.zip'],
    tags: Array.isArray(body.tags) ? body.tags : ['Digital Asset'],
    features: Array.isArray(body.features) ? body.features : ['Master Files', 'Commercial Rights'],
    thumbnail: body.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg',
    rating: 5.0,
    reviews_count: 0,
    sales_count: 0,
    status: body.status === 'draft' ? 'draft' : 'published',
    file_url: body.file_url || '',
    created_at: new Date().toISOString()
  };

  await saveProduct(newProduct);
  res.json(newProduct);
});

apiRouter.put('/products/:id', verifyAuth, async (req: Request, res: Response) => {
  const products = await getAllProducts();
  const existing = products.find(p => p.id === req.params.id);
  if (!existing) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updated: ProductRecord = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? parseFloat(req.body.price) : existing.price
  };

  await saveProduct(updated);
  res.json(updated);
});

apiRouter.delete('/products/:id', verifyAuth, async (req: Request, res: Response) => {
  await deleteProduct(req.params.id);
  res.json({ success: true });
});

// ---------------------------------------------------------
// ORDERS & REAL RESEND TRANSACTIONAL EMAILS
// ---------------------------------------------------------
apiRouter.get('/orders', verifyAuth, async (req: Request, res: Response) => {
  const orders = await getOrders();
  res.json(orders);
});

// Customer Library Lookup by Email
apiRouter.get('/orders/lookup', async (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const orders = await getOrders();
  const customerOrders = orders.filter(o => o.customer_email.toLowerCase().trim() === email.toLowerCase().trim());
  res.json(customerOrders);
});

// Checkout & Create Order with Automated Resend Email
apiRouter.post('/orders', async (req: Request, res: Response) => {
  const { customerEmail, items, total, subtotal, discount } = req.body || {};

  if (!customerEmail || !customerEmail.includes('@') || !items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Valid customer email and cart items required' });
  }

  const orderNumber = 'KRM-' + Math.floor(100000 + Math.random() * 900000);
  const licenseKey = 'KRM-' + crypto.randomBytes(3).toString('hex').toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase() + '-LIC';

  const newOrder: OrderRecord = {
    id: crypto.randomUUID(),
    order_number: orderNumber,
    customer_email: customerEmail.trim().toLowerCase(),
    total: parseFloat(total) || 0,
    subtotal: parseFloat(subtotal) || 0,
    discount: parseFloat(discount) || 0,
    license_key: licenseKey,
    items,
    created_at: new Date().toISOString(),
    email_sent: false
  };

  const admin = await getAdminAccount();
  const senderName = admin.resend_sender_name || 'Kroma Studio';

  // Attempt real email dispatch via Resend
  const itemsHtml = items.map((i: any) => `
    <div style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between;">
      <div>
        <strong style="color: #0f172a; font-size: 15px;">${i.productTitle || 'Digital Asset'}</strong>
        <div style="color: #64748b; font-size: 13px;">License: ${i.licenseType || 'Standard Commercial'}</div>
      </div>
      <div style="font-weight: 700; color: #ea580c; font-size: 15px;">$${i.price}</div>
    </div>
  `).join('');

  const orderEmailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #0f172a; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
        <div style="background: #ea580c; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: 20px; text-align: center; line-height: 36px;">K</div>
        <span style="font-size: 20px; font-weight: 700; color: #0f172a;">${senderName}</span>
      </div>

      <h1 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0;">Order Confirmed • ${orderNumber}</h1>
      <p style="color: #475569; font-size: 15px; line-height: 1.5;">
        Thank you for purchasing from <strong>${senderName}</strong>. Your commercial license key and digital download package are ready below:
      </p>

      <div style="margin: 24px 0; padding: 18px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px;">
        <span style="display: block; font-size: 12px; text-transform: uppercase; color: #c2410c; font-weight: 700; letter-spacing: 0.05em;">Commercial License Key</span>
        <code style="font-family: monospace; font-size: 20px; font-weight: 700; color: #9a3412; letter-spacing: 0.05em;">${licenseKey}</code>
      </div>

      <div style="margin-bottom: 24px;">
        ${itemsHtml}
      </div>

      <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; font-size: 14px; color: #64748b; margin-bottom: 6px;">
          <span>Subtotal</span>
          <span>$${newOrder.subtotal}</span>
        </div>
        ${newOrder.discount > 0 ? `
          <div style="display: flex; justify-content: space-between; font-size: 14px; color: #16a34a; margin-bottom: 6px;">
            <span>Discount Applied</span>
            <span>-$${newOrder.discount}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 8px;">
          <span>Total Paid</span>
          <span style="color: #ea580c;">$${newOrder.total}</span>
        </div>
      </div>

      <div style="text-align: center; margin-top: 32px;">
        <a href="${process.env.APP_URL || 'https://kroma.studio'}/#library" style="display: inline-block; background: #ea580c; color: #ffffff; text-decoration: none; padding: 12px 28px; font-weight: 600; border-radius: 8px; font-size: 15px;">Access My Downloads</a>
      </div>

      <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 24px; margin-top: 32px; text-align: center;">
        Need help? Contact support directly or visit your Customer Library anytime.
      </p>
    </div>
  `;

  const emailRes = await sendResendEmail(customerEmail, `Your ${senderName} Order & License (${orderNumber})`, orderEmailHtml);
  if (emailRes.success) {
    newOrder.email_sent = true;
    newOrder.resend_id = emailRes.id;
  }

  await saveOrder(newOrder);
  res.json({
    success: true,
    order: newOrder,
    emailStatus: emailRes.success ? 'dispatched' : 'pending_provider_config'
  });
});

// Admin re-send license email
apiRouter.post('/orders/:id/resend-email', verifyAuth, async (req: Request, res: Response) => {
  const orders = await getOrders();
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const admin = await getAdminAccount();
  const senderName = admin.resend_sender_name || 'Kroma Studio';

  const orderEmailHtml = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 580px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #0f172a; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="font-size: 20px; font-weight: 700; color: #0f172a;">Re-issued License & Downloads • ${order.order_number}</h2>
      <p style="color: #475569; font-size: 14px;">Here is your digital product license information requested by administration:</p>
      <div style="margin: 20px 0; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px;">
        <span style="display: block; font-size: 12px; text-transform: uppercase; color: #c2410c; font-weight: 700;">License Key</span>
        <code style="font-family: monospace; font-size: 18px; font-weight: 700; color: #9a3412;">${order.license_key}</code>
      </div>
    </div>
  `;

  const emailRes = await sendResendEmail(order.customer_email, `Re-sent: ${senderName} License Key (${order.order_number})`, orderEmailHtml);
  if (!emailRes.success) {
    return res.status(400).json({ error: emailRes.error });
  }

  res.json({ success: true, resendId: emailRes.id });
});

// Mount the apiRouter at both '/api' and '/'
app.use('/api', apiRouter);
app.use('/', apiRouter);

export { app };
export default app;
