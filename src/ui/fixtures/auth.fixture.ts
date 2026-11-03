import { test as base, type Page } from '@playwright/test';

import { env } from '../../shared/env';
import type { AppPages, PagesFixtures } from './pages.fixture';

/*
 * authFixture — UI-based authentication flows.
 *
 * Fixture:
 *   loggedInSession — logs the test user in via the UI login form.
 *                     Use this when the test must exercise the UI login
 *                     flow itself, or when the test depends on a fully
 *                     browser-side session state.
 *
 * Scope: "test" — every test gets its own fresh session.
 *
 * NOTE: The sandbox `admin` user is shared across all tests; tests that
 * mutate global state (create products, etc.) must clean up after themselves
 * or use unique-enough data to avoid collisions across runs.
 */

export type AuthFixtures = {
  loggedInSession: void;
};

export const authFixture: Parameters<typeof base.extend<AuthFixtures & PagesFixtures>>[0] = {
  loggedInSession: [
    async ({ pages }: { pages: AppPages; page: Page }, use: (value: void) => Promise<void>) => {
      if (!env.testUser || !env.testPassword) {
        throw new Error(
          'TEST_USER and TEST_PASSWORD must be set in .env to use loggedInSession.',
        );
      }
      await pages.login.goto();
      await pages.login.login(env.testUser, env.testPassword);
      await use(undefined);
    },
    { scope: 'test' },
  ],
};
