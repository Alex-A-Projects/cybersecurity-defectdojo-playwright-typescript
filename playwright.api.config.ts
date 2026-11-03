import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const apiBaseURL = (() => {
  const env = (process.env.TEST_ENV ?? 'demo').toLowerCase();
  const map: Record<string, string | undefined> = {
    demo: process.env.DEMO_API_URL,
  };
  const url = map[env];
  if (!url) {
    throw new Error(
      `No API base URL resolved for TEST_ENV="${env}". ` +
      `Set ${env.toUpperCase()}_API_URL.`,
    );
  }
  return url;
})();

/**
 * DefectDojo API suite — config.
 *
 * - No browser; uses Playwright's `request` fixture exclusively.
 * - Per-suite Allure result dir so reports stay mergeable per suite.
 * - Forbid `test.only` on CI.
 */
export default defineConfig({
  testDir: './tests-api',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: Number(process.env.TEST_TIMEOUT ?? 30000),
  reporter: [
    ['line'],
    ['allure-playwright', { resultsDir: 'allure-results-api', detail: true, suiteTitle: false }],
    ['html', { outputFolder: 'playwright-report-api', open: 'never' }],
  ],
  use: {
    baseURL: apiBaseURL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
    trace: 'on-first-retry',
  },
});
