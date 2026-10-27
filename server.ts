import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { gemmaRouter } from './server/routes/gemma.js';
import { GEMMA_MODEL } from './server/config.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Support JSON payload up to 25MB for poster image base64 uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Central Health / Diagnostics route
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'CampusSignal AI — Haunted Campus Edition',
      modelConfigured: GEMMA_MODEL,
      timestamp: new Date().toISOString(),
    });
  });

  // Mount Gemma 4 routes
  app.use('/api/gemma', gemmaRouter);
  app.use('/api/notices', gemmaRouter);

  // Vite development integration
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🎃👻 CampusSignal AI Server running on http://0.0.0.0:${PORT}`);
    console.log(`🔮 Powered by Google Gemma 4 Model: ${GEMMA_MODEL}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting CampusSignal AI server:', err);
  process.exit(1);
});
