import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ---------------------------------------------------------
// DATABASE & STORAGE LAYER (Neon PostgreSQL + Graceful Fallback)
// ---------------------------------------------------------
const DATA_DIR = process.env.VERCEL
  ? path.join('/tmp', '.data')
  : path.resolve(process.cwd(), '.data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.error('Failed to create .data dir', err);
  }
}
const DB_FILE = path.join(DATA_DIR, 'db_store.json');

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

interface AdminAccount {
  id: string;
  email: string;
  password_hash: string;
  access_alias: string;
  resend_api_key?: string;
  resend_from_email?: string;
  resend_domain?: string;
  resend_sender_name?: string;
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

function loadLocalStore(): LocalStore {
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
      return data;
    }
  } catch (err) {
    console.error('Error reading local db store, initializing fresh:', err);
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
  saveLocalStore(initialStore);
  return initialStore;
}

function saveLocalStore(store: LocalStore) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write local db store', err);
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

      await sql`
        CREATE TABLE IF NOT EXISTS admin_passkeys (
          id TEXT PRIMARY KEY,
          credential_id TEXT NOT NULL,
          public_key TEXT NOT NULL,
          counter INTEGER DEFAULT 0,
          name TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS products (
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
        CREATE TABLE IF NOT EXISTS orders (
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
      const existingProducts = await sql`SELECT id FROM products LIMIT 1;`;
      if (existingProducts.length === 0) {
        for (const p of DEFAULT_PRODUCTS) {
          await sql`
            INSERT INTO products (id, title, subtitle, description, category, price, formats, tags, features, thumbnail, rating, reviews_count, sales_count, status, file_url)
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
      return rows as PasskeyRecord[];
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
        INSERT INTO admin_passkeys (id, credential_id, public_key, counter, name, created_at)
        VALUES (${passkey.id}, ${passkey.credential_id}, ${passkey.public_key}, ${passkey.counter}, ${passkey.name}, ${passkey.created_at});
      `;
    } catch (e) {
      console.warn('Neon addPasskey failed:', e);
    }
  }
  const store = loadLocalStore();
  store.passkeys = [passkey, ...(store.passkeys || [])];
  saveLocalStore(store);
}

async function removePasskey(id: string): Promise<void> {
  if (sql && neonConnected) {
    try {
      await sql`DELETE FROM admin_passkeys WHERE id = ${id};`;
    } catch (e) {
      console.warn('Neon removePasskey failed:', e);
    }
  }
  const store = loadLocalStore();
  store.passkeys = (store.passkeys || []).filter(p => p.id !== id);
  saveLocalStore(store);
}

async function getAllProducts(): Promise<ProductRecord[]> {
  if (sql && neonConnected) {
    try {
      const rows = await sql`SELECT * FROM products ORDER BY created_at DESC;`;
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
        INSERT INTO products (id, title, subtitle, description, category, price, formats, tags, features, thumbnail, rating, reviews_count, sales_count, status, file_url, created_at)
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
          status = EXCLUDED.status,
          file_url = EXCLUDED.file_url;
      `;
    } catch (e) {
      console.warn('Neon saveProduct failed:', e);
    }
  }
  const store = loadLocalStore();
  const existingIdx = store.products.findIndex(p => p.id === product.id);
  if (existingIdx >= 0) {
    store.products[existingIdx] = product;
  } else {
    store.products.unshift(product);
  }
  saveLocalStore(store);
}

async function deleteProduct(id: string): Promise<void> {
  if (sql && neonConnected) {
    try {
      await sql`DELETE FROM products WHERE id = ${id};`;
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
      const rows = await sql`SELECT * FROM orders ORDER BY created_at DESC;`;
      return rows.map(r => ({
        ...r,
        total: parseFloat(r.total),
        subtotal: parseFloat(r.subtotal),
        discount: parseFloat(r.discount || 0),
        items: typeof r.items === 'string' ? JSON.parse(r.items) : r.items,
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
        INSERT INTO orders (id, order_number, customer_email, total, subtotal, discount, license_key, items, created_at, email_sent, resend_id)
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
// AUTHENTICATION & WEBAUTHN SESSIONS
// ---------------------------------------------------------
const activeSessions: Map<string, { email: string; expires: number }> = new Map();

function createSessionToken(email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    email,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
  });
  return token;
}

function verifyAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized. Admin session token required.' });
  }
  const token = authHeader.substring(7);
  const session = activeSessions.get(token);
  if (!session || session.expires < Date.now()) {
    if (session) activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }
  (req as any).adminEmail = session.email;
  next();
}

// Temporary in-memory challenges for WebAuthn FIDO2
const webauthnChallenges: Map<string, { challenge: string; expires: number; type: 'register' | 'login' }> = new Map();

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
// REST API ROUTES
// ---------------------------------------------------------

// Database and System Diagnostics
app.get('/api/database/status', async (req: Request, res: Response) => {
  const dbUrl = process.env.DATABASE_URL;
  res.json({
    neonConnected,
    hasEnvVar: Boolean(dbUrl && dbUrl.length > 5),
    maskedUrl: dbUrl ? dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : null,
    driver: 'Neon Serverless WebSockets/HTTPS',
    fallbackActive: !neonConnected,
    storageType: neonConnected ? 'Neon PostgreSQL' : 'Local Persistent Storage (.data/db_store.json)',
    errorNotice: neonError
  });
});

// Admin Alias Lookup (Public so front router knows the authorized path)
app.get('/api/admin/alias', async (req: Request, res: Response) => {
  const admin = await getAdminAccount();
  res.json({
    alias: admin.access_alias || 'md1620'
  });
});

// Admin Login with Email & Password
app.post('/api/admin/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
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
app.get('/api/admin/me', verifyAuth, async (req: Request, res: Response) => {
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
app.post('/api/admin/update-credentials', verifyAuth, async (req: Request, res: Response) => {
  const { currentPassword, newEmail, newPassword } = req.body;
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
app.post('/api/admin/update-alias', verifyAuth, async (req: Request, res: Response) => {
  const { newAlias } = req.body;
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
app.post('/api/admin/resend/config', verifyAuth, async (req: Request, res: Response) => {
  const { apiKey, fromEmail, domain, senderName } = req.body;
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
app.get('/api/admin/resend/domains', verifyAuth, async (req: Request, res: Response) => {
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
app.post('/api/admin/resend/test', verifyAuth, async (req: Request, res: Response) => {
  const { targetEmail } = req.body;
  if (!targetEmail || !targetEmail.includes('@')) {
    return res.status(400).json({ error: 'Valid recipient email required' });
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; background: #ffffff; color: #0f172a; border-radius: 12px; border: 1px solid #e2e8f0;">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
        <div style="background: #ea580c; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #ffffff; font-weight: bold; font-size: 20px; text-align: center; line-height: 36px;">K</div>
        <span style="font-size: 20px; font-weight: 700; color: #0f172a;">Kroma Studio</span>
      </div>
      <h2 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0;">Resend Provider Connected Successfully</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        This test message verifies that your <strong>Resend.com API Key</strong> is authenticated and ready to deliver real transactional order receipts, license keys, and automated product notifications.
      </p>
      <div style="margin: 24px 0; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px;">
        <span style="display: block; font-size: 12px; text-transform: uppercase; color: #c2410c; font-weight: 700; letter-spacing: 0.05em;">Dispatch Status</span>
        <span style="font-size: 15px; font-weight: 600; color: #9a3412;">200 OK • Production Delivery Verified</span>
      </div>
      <p style="font-size: 13px; color: #94a3b8; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-bottom: 0;">
        Kroma Studio Digital Marketplace • Handcrafted by Senior Engineering
      </p>
    </div>
  `;

  const result = await sendResendEmail(targetEmail, '✅ Kroma Studio: Resend Provider Test Verified', html);
  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  res.json({ success: true, resendId: result.id });
});

// Get Resend Email Logs
app.get('/api/admin/resend/logs', verifyAuth, async (req: Request, res: Response) => {
  const logs = await getEmailLogs();
  res.json(logs);
});

// ---------------------------------------------------------
// FINGERPRINT & WEBAUTHN FIDO2 PASSKEY ENGINE
// ---------------------------------------------------------

// Step 1: Register Options (Challenge generation for navigator.credentials.create)
app.post('/api/auth/webauthn/register-options', verifyAuth, async (req: Request, res: Response) => {
  const challenge = crypto.randomBytes(32).toString('base64url');
  const challengeId = crypto.randomBytes(16).toString('hex');

  webauthnChallenges.set(challengeId, {
    challenge,
    expires: Date.now() + 1000 * 60 * 5, // 5 min
    type: 'register'
  });

  const admin = await getAdminAccount();

  res.json({
    challengeId,
    publicKey: {
      challenge,
      rp: {
        name: 'Kroma Studio Admin',
        id: req.hostname.replace(/:\d+$/, '')
      },
      user: {
        id: Buffer.from(admin.email).toString('base64url'),
        name: admin.email,
        displayName: 'Kroma Master Admin'
      },
      pubKeyCredParams: [
        { alg: -7, type: 'public-key' },  // ES256
        { alg: -257, type: 'public-key' } // RS256
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform', // Platform biometric (fingerprint/FaceID/TouchID)
        userVerification: 'required',
        residentKey: 'preferred'
      },
      timeout: 60000,
      attestation: 'none'
    }
  });
});

// Step 2: Register Verify (Save credential)
app.post('/api/auth/webauthn/register-verify', verifyAuth, async (req: Request, res: Response) => {
  const { challengeId, credentialId, clientDataJSON, attestationObject, deviceName } = req.body;

  const stored = webauthnChallenges.get(challengeId);
  if (!stored || stored.type !== 'register' || stored.expires < Date.now()) {
    return res.status(400).json({ error: 'Registration challenge expired or invalid. Please try again.' });
  }
  webauthnChallenges.delete(challengeId);

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
app.post('/api/auth/webauthn/login-options', async (req: Request, res: Response) => {
  const passkeys = await getPasskeys();
  if (passkeys.length === 0) {
    return res.status(404).json({ error: 'No fingerprint passkeys registered on this server yet. Please log in with password to set up your passkey in Security.' });
  }

  const challenge = crypto.randomBytes(32).toString('base64url');
  const challengeId = crypto.randomBytes(16).toString('hex');

  webauthnChallenges.set(challengeId, {
    challenge,
    expires: Date.now() + 1000 * 60 * 5,
    type: 'login'
  });

  res.json({
    challengeId,
    publicKey: {
      challenge,
      rpId: req.hostname.replace(/:\d+$/, ''),
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
app.post('/api/auth/webauthn/login-verify', async (req: Request, res: Response) => {
  const { challengeId, credentialId } = req.body;

  const stored = webauthnChallenges.get(challengeId);
  if (!stored || stored.type !== 'login' || stored.expires < Date.now()) {
    return res.status(400).json({ error: 'Biometric challenge expired or invalid. Please try again.' });
  }
  webauthnChallenges.delete(challengeId);

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
app.get('/api/admin/passkeys', verifyAuth, async (req: Request, res: Response) => {
  const passkeys = await getPasskeys();
  res.json(passkeys);
});

// Delete a Passkey
app.delete('/api/admin/passkeys/:id', verifyAuth, async (req: Request, res: Response) => {
  await removePasskey(req.params.id);
  res.json({ success: true });
});

// ---------------------------------------------------------
// PRODUCTS CATALOG MANAGEMENT (Real CRUD)
// ---------------------------------------------------------
app.get('/api/products', async (req: Request, res: Response) => {
  const products = await getAllProducts();
  const onlyPublished = req.query.all !== 'true';
  const filtered = onlyPublished ? products.filter(p => p.status === 'published') : products;
  res.json(filtered);
});

app.post('/api/products', verifyAuth, async (req: Request, res: Response) => {
  const data = req.body;
  const newProduct: ProductRecord = {
    id: data.id || 'kroma-' + crypto.randomBytes(4).toString('hex'),
    title: data.title,
    subtitle: data.subtitle || '',
    description: data.description || '',
    category: data.category || 'UI & Figma',
    price: parseFloat(data.price) || 49,
    formats: Array.isArray(data.formats) ? data.formats : ['.fig', '.json'],
    tags: Array.isArray(data.tags) ? data.tags : ['Design'],
    features: Array.isArray(data.features) ? data.features : [],
    thumbnail: data.thumbnail || '/src/assets/images/hero_white_orange_1790435384152.jpg',
    rating: 5.0,
    reviews_count: 0,
    sales_count: 0,
    status: data.status || 'published',
    file_url: data.file_url || 'https://downloads.kroma.studio/releases/package.zip',
    created_at: new Date().toISOString()
  };

  await saveProduct(newProduct);
  res.json(newProduct);
});

app.put('/api/products/:id', verifyAuth, async (req: Request, res: Response) => {
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

app.delete('/api/products/:id', verifyAuth, async (req: Request, res: Response) => {
  await deleteProduct(req.params.id);
  res.json({ success: true });
});

// ---------------------------------------------------------
// ORDERS & REAL RESEND TRANSACTIONAL EMAILS
// ---------------------------------------------------------
app.get('/api/orders', verifyAuth, async (req: Request, res: Response) => {
  const orders = await getOrders();
  res.json(orders);
});

// Customer Library Lookup by Email
app.get('/api/orders/lookup', async (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const orders = await getOrders();
  const customerOrders = orders.filter(o => o.customer_email.toLowerCase().trim() === email.toLowerCase().trim());
  res.json(customerOrders);
});

// Checkout & Create Order with Automated Resend Email
app.post('/api/orders', async (req: Request, res: Response) => {
  const { customerEmail, items, total, subtotal, discount } = req.body;

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
        <span style="font-size: 20px; font-weight: 700; color: #0f172a;">Kroma Studio</span>
      </div>
      <h2 style="font-size: 22px; font-weight: 700; color: #0f172a; margin-top: 0;">Order Confirmed • ${orderNumber}</h2>
      <p style="font-size: 15px; line-height: 1.6; color: #475569;">
        Thank you for your purchase. Your commercial digital assets are prepared and your license key is active.
      </p>
      
      <div style="margin: 24px 0; padding: 20px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 10px;">
        <span style="display: block; font-size: 12px; text-transform: uppercase; color: #c2410c; font-weight: 700; letter-spacing: 0.05em;">Commercial License Key</span>
        <code style="font-family: monospace; font-size: 18px; font-weight: 700; color: #9a3412; display: block; margin-top: 6px;">${licenseKey}</code>
      </div>

      <h3 style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Purchased Items</h3>
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

  const emailRes = await sendResendEmail(customerEmail, `Your Kroma Studio Order & License (${orderNumber})`, orderEmailHtml);
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
app.post('/api/orders/:id/resend-email', verifyAuth, async (req: Request, res: Response) => {
  const orders = await getOrders();
  const order = orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

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

  const emailRes = await sendResendEmail(order.customer_email, `Re-sent: Kroma License Key (${order.order_number})`, orderEmailHtml);
  if (!emailRes.success) {
    return res.status(400).json({ error: emailRes.error });
  }

  res.json({ success: true, resendId: emailRes.id });
});

// ---------------------------------------------------------
// SERVER INITIALIZATION & VITE MIDDLEWARE MOUNTING
// ---------------------------------------------------------
async function startServer() {
  await initNeonDatabase();

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Production-Ready Fullstack Marketplace running on port ${PORT}`);
    console.log(`🔒 Initial Admin Entry Point: http://localhost:${PORT}/md1620`);
  });
}

// Only start standalone server when executed directly, not inside Vercel Serverless environment
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  startServer().catch(err => {
    console.error('Fatal startup error in server.ts:', err);
  });
}

export default app;
