import express from 'express';
import { success } from './response.ts';
import { registerDemoRoutes } from './routes/auth.ts';

export function registerRoutes(app: express.Express) {
  registerDemoRoutes(app);

  app.get('/api/health', (_req, res) => {
    res.json(success({ status: 'ok' }, 'ParkFlow server is running'));
  });
}
