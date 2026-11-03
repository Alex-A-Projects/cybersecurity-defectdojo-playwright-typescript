import { test as base } from '@playwright/test';
import type { Page } from '@playwright/test';

import { env } from '../../shared/env';
import { FindingService } from '../services/finding.service';
import { ProductService } from '../services/product.service';
import { EngagementService } from '../services/engagement.service';
import type { AppPages, PagesFixtures } from './pages.fixture';
import type { CookiesFixtures } from './core.fixture';

/*
 * Flows fixture layer — ready-state workflows.
 *
 * Each fixture takes the pure Page Objects from the pages layer and either
 * (a) drives a precondition (login) so the rest of the test runs against an
 * authenticated session, or (b) offers a CRUD setup helper that other specs
 * can call instead of hand-rolling fills.
 *
 * Dependency direction: core → pages → flows.
 */

// ---------------------------------------------------------------------------
// dashboardPageFixture — already logged-in dashboard
// ---------------------------------------------------------------------------

export type DashboardReadyFixtures = { dashboardPage: import('../pages/dashboard.page').DashboardPage };

export const dashboardPageFixture = {
  dashboardPage: async (
    { pages }: { pages: AppPages },
    use: (value: import('../pages/dashboard.page').DashboardPage) => Promise<void>,
  ) => {
    if (!env.testUser || !env.testPassword) {
      throw new Error(
        'TEST_USER and TEST_PASSWORD must be set in .env to log in via the UI fixture.',
      );
    }
    // The login itself lives in auth.fixture's `loggedInSession`; this
    // fixture just navigates. auth.fixture composes before this one when
    // both are requested.
    await pages.dashboard.goto();
    await pages.dashboard.waitForReady();
    await use(pages.dashboard);
  },
} as Parameters<typeof base.extend<DashboardReadyFixtures & PagesFixtures & CookiesFixtures>>[0];

// ---------------------------------------------------------------------------
// dataSetupFixture — wraps the *Services into fixtures
// ---------------------------------------------------------------------------

export type DataSetupFixtures = {
  productService: ProductService;
  engagementService: EngagementService;
  findingService: FindingService;
};

export const dataSetupFixture: Parameters<typeof base.extend<DataSetupFixtures>>[0] = {
  productService: async ({ page }, use) => {
    await use(new ProductService(page));
  },
  engagementService: async ({ page }, use) => {
    await use(new EngagementService(page));
  },
  findingService: async ({ page }, use) => {
    await use(new FindingService(page));
  },
};

// ---------------------------------------------------------------------------
// findingListPageFixture — finding list, navigated and ready
// ---------------------------------------------------------------------------

export type FindingListReadyFixtures = { findingListPage: import('../pages/finding-list.page').FindingListPage };

export const findingListPageFixture = {
  findingListPage: async (
    { pages }: { pages: AppPages },
    use: (value: import('../pages/finding-list.page').FindingListPage) => Promise<void>,
  ) => {
    await pages.findingList.goto();
    await pages.findingList.waitForReady();
    await use(pages.findingList);
  },
} as Parameters<typeof base.extend<FindingListReadyFixtures & PagesFixtures>>[0];
