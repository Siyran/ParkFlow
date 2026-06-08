import type { NextFunction, Request, Response } from 'express';

export function notFound(_req: Request, res: Response) {
  res.status(404).json({
    success: false,
    data: null,
    message: 'Route not found',
    error: 'NOT_FOUND',
  });
}

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const message = err instanceof Error ? err.message : 'Unexpected server error';
  res.status(500).json({
    success: false,
    data: null,
    message,
    error: 'INTERNAL_SERVER_ERROR',
  });
}
