import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const uiBaseURL = (() => {
  const envName = (process.env.TEST_ENV ?? 'demo').toLowerCase();
  const map: Record<string, string | undefined> = {
    demo: process.env.DEMO_BASE_URL,
  };
  const url = map[envName];
  if (!url) {
    const known = Object.keys(map).join(', ');
    throw new Error(
      `No UI base URL resolved for TEST_ENV="${envName}". ` +
      `Set ${envName.toUpperCase()}_BASE_URL (or pick one of: ${known}).`,
    );
  }
  return url;
})();

const testTimeoutMs = Number(process.env.TEST_TIMEOUT ?? 30000);

/**
 * Unified Playwright config — exposes the three suites as **projects** so the
 * VSCode Test Explorer panel shows all of them at once.
 *
 * Why a single config with `projects` (instead of three separate
 * `playwright.{ui,api,db}.config.ts` files):
 *
 *   1. The Microsoft Playwright VSCode extension groups tests under their
 *      project name in the Testing panel. One config → three groups, all
 *      visible simultaneously. Three configs → only one visible at a time.
 *
 *   2. Each project can carry a different `testDir` and its own `use`,
 *      `workers`, `globalSetup`, etc., so the layout is preserved.
 *
 *   3. The original per-suite configs (`playwright.ui.config.ts`,
 *      `playwright.api.config.ts`, `playwright.db.config.ts`) are kept for
 *      `npm run test:{ui,api,db}` runs that need **suite-specific**
 *      reporter output directories (each has its own `allure-results-*`
 *      dir). They aren't used by the Testing panel.
 *
 *   4. The unified config writes a single combined `allure-results/` dir.
 *      Allure's `labels` array tags each result with its project name
 *      (`ui` / `api` / `db`), so reports are still filterable per suite.
 *
 * If you've already opened the repo as a folder, do
 * `Developer: Reload Window` (Cmd/Ctrl+Shift+P) after pulling these changes
 * to pick up the new project tree.
 */
export default defineConfig({
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: testTimeoutMs,
  reporter: [
    ['line'],
    ['allure-playwright', { resultsDir: 'allure-results', detail: true, suiteTitle: false }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  projects: [
    {
      name: 'ui',
      testDir: './tests-ui',
      fullyParallel: true,
      use: {
        baseURL: uiBaseURL,
        headless: true,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
      },
    },
    {
      name: 'api',
      testDir: './tests-api',
      fullyParallel: true,
      use: {
        baseURL: process.env.DEMO_API_URL ?? uiBaseURL,
        extraHTTPHeaders: { Accept: 'application/json' },
        trace: 'on-first-retry',
      },
      timeout: testTimeoutMs,
    },
    {
      name: 'db',
      testDir: './tests-db',
      fullyParallel: false,
      workers: 1,
      retries: 0,
      // DB globalSetup is configured on `playwright.db.config.ts` (used by
      // `npm run test:db`) but NOT here — `globalSetup` is a config-level
      // option, not a project-level one, and running it for every project
      // would fail the UI/API runs when no DB container is up.
      // For VSCode-driven runs of the `db` project, each spec's first
      // `query()` call fails fast with a clear ECONNREFUSED if the
      // container isn't up — you'll see exactly which spec failed first.
      use: {
        trace: 'on-first-retry',
      },
      timeout: testTimeoutMs,
    },
  ],
});
