/**
 * DB suite global setup.
 *
 * Runs once before any DB suite spec:
 *   1. Loads the .env (side-effect: env.db.* populated).
 *   2. Waits for the Postgres container's healthcheck.
 *   3. Applies tests-db/fixtures/seed/initdb.sql if the schema is missing.
 *
 * The schema has to exist before the first spec runs: the specs assert
 * against seeded reference rows (the 'Other' ProductType, the 'Default SLA'
 * row, the admin user), and the factories rely on those ids.
 *
 * Locally, `docker-compose.yml` mounts the seed into
 * `/docker-entrypoint-initdb.d` so Postgres applies it on first init — the
 * check below then finds the schema present and skips the load. In CI the
 * `postgres:16` service container has no such mount, so the seed is applied
 * from here.
 */
import * as dotenv from 'dotenv';
import * as path from 'path';

import { dbReady } from '../../src/db/clients/healthcheck.client';
import { applySeed, schemaPresent } from '../../src/db/clients/seed.client';
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
  const present = await schemaPresent('dojo_product');

  if (present) {
    console.log('[db-suite] Schema already present — skipping seed load.');
  } else if (await applySeed(seedFile)) {
    console.log(`[db-suite] Applied seed file ${path.relative(process.cwd(), seedFile)}.`);
  } else {
    throw new Error(
      `Schema is absent and no seed file at ${seedFile}. ` +
      `The DB suite needs the DefectDojo schema; see README §3 for how to capture it.`,
    );
  }

  console.log('[db-suite] DB global setup complete.');
}
