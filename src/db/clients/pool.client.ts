import { Pool, type PoolClient } from 'pg';
import { env } from '../../shared/env';

/*
 * Postgres connection pool used by every repo and factory.
 *
 * One pool per process. Tests acquire/release a client via `withClient`.
 * The DB suite runs with workers: 1 and fullyParallel: false, so a single
 * pool is safe.
 */
let _pool: Pool | undefined;

export function getPool(): Pool {
  if (_pool) return _pool;
  _pool = new Pool({
    host: env.db.host,
    port: env.db.port,
    database: env.db.database,
    user: env.db.user,
    password: env.db.password,
    ssl: env.db.ssl,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  });
  return _pool;
}

export async function closePool(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = undefined;
  }
}

export async function withClient<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

/**
 * Run `query` with parameter substitution. DefectDojo stores dates as
 * `timestamptz`; pass ISO strings.
 *
 * The default constraint is `object` so any DTO shape works without forcing
 * an index signature onto every row type. Pass an explicit `T` to type the rows.
 */
export async function query<T extends object = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  return withClient((c) => c.query<T>(text, params).then((r) => r.rows as T[]));
}

export async function queryOne<T extends object = Record<string, unknown>>(
  text: string,
  params: unknown[] = [],
): Promise<T | undefined> {
  const rows = await query<T>(text, params);
  return rows[0];
}
