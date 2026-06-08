import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import helmet from 'helmet';
import { env } from './env.ts';
import { errorHandler, notFound } from './middleware/error.ts';
import { registerRoutes } from './routes.ts';

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.frontendUrl, credentials: true }));
  app.use(cookieParser());
  app.use(express.json());

  registerRoutes(app);
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
