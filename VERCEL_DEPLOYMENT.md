# Vercel Deployment Guide

This marketplace is configured for 1-click deployment on [Vercel](https://vercel.com).

---

## 🚀 Quick Deployment Steps

### Method 1: Git Import via Vercel Dashboard (Recommended)

1. Push this repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"** -> **"Import Git Repository"**.
3. Vercel automatically detects the configuration from `vercel.json`:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Expand **Environment Variables** and add:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string  
     *(e.g., `postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require`)*
5. Click **Deploy**.

---

### Method 2: Deploy using Vercel CLI

```bash
# 1. Install Vercel CLI (if not installed)
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Link and Deploy
vercel

# 4. For production deployment
vercel --prod
```

---

## ⚙️ Architecture on Vercel

| Component | Vercel Handling | Description |
|-----------|-----------------|-------------|
| **Frontend UI** | Edge CDN (`dist/`) | Ultra-fast global CDN delivery for HTML, JS, CSS, and images. |
| **Backend API** | Serverless (`/api`) | Delegated to `api/index.ts` serverless function with Express & Neon PostgreSQL. |
| **SPA Routing** | `vercel.json` rewrites | All client-side routes (including `/md1620` and deep links) serve `index.html`. |
| **Passkeys / Biometrics** | HTTPS | FIDO2 / WebAuthn requires HTTPS, which Vercel provides out of the box. |

---

## 🔑 Environment Variables on Vercel

Configure these in **Project Settings > Environment Variables**:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | **Yes** | Neon PostgreSQL connection string. Enables persistent cloud storage. |

> **Note regarding Resend.com**:  
> Per security architecture requirements, the Resend.com API key is **NOT** set in environment variables. You configure and manage your Resend API key directly from inside the Admin Panel UI under **Resend.com Email**.
