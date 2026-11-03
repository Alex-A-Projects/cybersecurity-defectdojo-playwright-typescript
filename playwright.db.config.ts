import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * DefectDojo DB suite — config.
 *
 * - No browser, no HTTP. Uses node-postgres against the container in
 *   docker-compose.yml. `globalSetup` waits for the healthcheck.
 * - Per-test isolation = TRUNCATE … CASCADE the writable tables, then
 *   re-seed via factories. See `src/db/fixtures/db-cleanup.fixture.ts`.
 * - Forbid `test.only` on CI.
 */
export default defineConfig({
  testDir: './tests-db',
  fullyParallel: false, // TRUNCATE-CASCADE conflicts with parallelism
  forbidOnly: !!process.env.CI,
  retries: 0,            // DB tests should not flake silently
  workers: 1,
  timeout: Number(process.env.TEST_TIMEOUT ?? 30000),
  reporter: [
    ['line'],
    ['allure-playwright', { resultsDir: 'allure-results-db', detail: true, suiteTitle: false }],
    ['html', { outputFolder: 'playwright-report-db', open: 'never' }],
  ],
  globalSetup: require.resolve('./tests-db/_framework/global-setup.ts'),
  use: {
    trace: 'on-first-retry',
  },
});
