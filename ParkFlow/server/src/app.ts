import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { env } from './env.ts';
import path from 'path';
import fs from 'fs';
import { errorHandler, notFound } from './middleware/error.ts';
import { registerRoutes } from './routes.ts';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.frontendUrl, credentials: true }));
  app.use(cookieParser());
  app.use(
    express.json({
      verify: (req: any, _res, buffer: Buffer) => {
        req.rawBody = buffer.toString('utf8');
      },
    }),
  );

  registerRoutes(app);
  // Serve client build if present
  const clientDist = path.join(process.cwd(), 'client', 'dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get(/.*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
  }
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
