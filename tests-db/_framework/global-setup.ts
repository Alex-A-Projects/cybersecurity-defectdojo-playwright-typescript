/**
 * DB suite global setup.
 *
 * Runs once before any DB suite spec:
 *   1. Loads the .env (side-effect: env.db.* populated).
 *   2. Waits for the Postgres container's healthcheck.
 *   3. Optionally applies tests-db/fixtures/seed/initdb.sql if it exists.
 *
 * If initdb.sql is missing, no-op and log a TODO(confirm) note — the
 * framework's schema-exists smoke spec still runs against the empty container.
 */
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

import { dbReady } from '../../src/db/clients/healthcheck.client';
import { Paths } from '../../src/shared/paths';

export default async function globalSetup(): Promise<void> {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });

  console.log('[db-suite] Waiting for Postgres to become healthy…');
  const ready = await dbReady(60_000, 1_000);
  if (!ready) {
    throw new Error('Postgres did not become ready within 60s. ' +
                    'Run `npm run db:up` first.');
  }

  const seedFile = Paths.dbSeedFile;
  if (fs.existsSync(seedFile)) {
    console.log(`[db-suite] Loading seed file ${path.relative(process.cwd(), seedFile)}…`);
    // The actual LOAD is performed per-fixture or per-spec; global setup
    // just verifies the file exists so a stuck setup fails fast.
  } else {
    console.log(
      `[db-suite] No seed file at tests-db/fixtures/seed/initdb.sql — running only against the empty container. ` +
      `Framework smokes still run; data-driven specs skip. ` +
      `TODO(confirm): capture via 'pg_dump' from the demo sandbox (see README §3).`,
    );
  }

  console.log('[db-suite] DB global setup complete.');
}
