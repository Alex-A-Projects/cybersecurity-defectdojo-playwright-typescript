import { defineConfig, devices } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const uiBaseURL = (() => {
  const env = (process.env.TEST_ENV ?? 'demo').toLowerCase();
  const map: Record<string, string | undefined> = {
    demo: process.env.DEMO_BASE_URL,
  };
  const url = map[env];
  if (!url) {
    throw new Error(
      `No UI base URL resolved for TEST_ENV="${env}". ` +
      `Set ${env.toUpperCase()}_BASE_URL.`,
    );
  }
  return url;
})();

/**
 * DefectDojo UI suite — config.
 *
 * - No custom testIdAttribute (DefectDojo DOM has no `data-*` test ID
 *   convention). POMs use role/label/text. Keep `getByTestId` out of POMs.
 * - Default headless; do not flip to headed without documenting why
 *   (.claude/rules/playwright-mcp-headless-mode.md).
 * - Allure results dir is suite-scoped to keep reports mergeable per suite.
 */
export default defineConfig({
  testDir: './tests-ui',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: Number(process.env.TEST_TIMEOUT ?? 30000),
  reporter: [
    ['line'],
    ['allure-playwright', { resultsDir: 'allure-results-ui', detail: true, suiteTitle: false }],
    ['html', { outputFolder: 'playwright-report-ui', open: 'never' }],
  ],
  use: {
    baseURL: uiBaseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
