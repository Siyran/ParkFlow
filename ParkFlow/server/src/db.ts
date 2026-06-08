import { Pool } from 'pg';
import { env } from './env.ts';

const pool = new Pool({ connectionString: env.databaseUrl });

export function query<T>(text: string, params: unknown[] = []) {
  return pool.query<T>(text, params);
}

export function closeDatabase() {
  return pool.end();
}