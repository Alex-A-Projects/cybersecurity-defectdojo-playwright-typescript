import { withClient } from './pool.client';

/**
 * Health check used by `globalSetup` (`tests-db/_framework/global-setup.ts`).
 * Polls `SELECT 1` until Postgres is ready or the timeout elapses.
 */
export async function dbReady(timeoutMs = 60_000, intervalMs = 1_000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await withClient((c) => c.query('SELECT 1'));
      return true;
    } catch {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
  return false;
}
