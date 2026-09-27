import app from './api/index';
import path from 'path';
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
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

  app.listen(PORT, '0.0.0.0', () => {
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
