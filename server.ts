import app from './api/index';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';

import http from 'http';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';
const isHmrDisabled = process.env.DISABLE_HMR === 'true';

async function startServer() {
  const server = http.createServer(app);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : { server }
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Production-Ready Fullstack Marketplace running on port ${PORT}`);
    console.log(`🔒 Initial Admin Entry Point: http://localhost:${PORT}/md1620`);
  });
}

// Only start the standalone HTTP listener when not inside Vercel Serverless environment
if (!process.env.VERCEL && process.env.NODE_ENV !== 'test') {
  startServer().catch(err => {
    console.error('Fatal startup error in server.ts:', err);
  });
}

export default app;
