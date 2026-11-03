import * as fs from 'fs';

import { withClient } from './pool.client';

/**
 * Applies the synthetic schema seed (`tests-db/fixtures/seed/initdb.sql`) to
 * the connected Postgres database.
 *
 * Why this exists: the DB suite's specs assert against seeded reference rows
 * (the 'Other' ProductType, the 'Default SLA' row, the admin user), so the
 * schema must exist before the first spec runs.
 *
 * - Locally, `docker-compose.yml` mounts the seed into
 *   `/docker-entrypoint-initdb.d`, so Postgres applies it on first init.
 * - In CI, the `postgres:16` service container has no such mount, so the
 *   schema has to be applied from here instead.
 *
 * The seed file is written to be idempotent — it drops and recreates every
 * table it owns — so re-applying it is safe.
 */
export async function applySeed(seedFilePath: string): Promise<boolean> {
  if (!fs.existsSync(seedFilePath)) {
    return false;
  }

  const sql = fs.readFileSync(seedFilePath, 'utf8');

  await withClient(async (client) => {
    // node-postgres uses the simple query protocol when no parameters are
    // bound, which allows a multi-statement script in a single round trip.
    await client.query(sql);
  });

  return true;
}

/**
 * True when the DefectDojo schema the DB suite reads is present.
 * Used to decide whether the seed still needs applying.
 */
export async function schemaPresent(tableName: string): Promise<boolean> {
  const rows = await withClient(async (client) => {
    const result = await client.query<{ count: string }>(
      `SELECT COUNT(*) FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = $1`,
      [tableName],
    );
    return result.rows;
  });

  return Number(rows[0]?.count ?? 0) > 0;
}
