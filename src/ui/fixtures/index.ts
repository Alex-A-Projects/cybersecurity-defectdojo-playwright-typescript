import { test as base } from '@playwright/test';

import {
  cookiesFixture,
  policyFixture,
} from './core.fixture';
import type {
  CookiesFixtures,
  PolicyFixtures,
} from './core.fixture';

import { pagesFixture } from './pages.fixture';
import type { PagesFixtures } from './pages.fixture';

import {
  dashboardPageFixture,
  dataSetupFixture,
  findingListPageFixture,
} from './flows.fixture';
import type {
  DashboardReadyFixtures,
  DataSetupFixtures,
  FindingListReadyFixtures,
} from './flows.fixture';

import { authFixture } from './auth.fixture';
import type { AuthFixtures } from './auth.fixture';

import { apiAuthFixture } from './api-auth.fixture';
import type { ApiAuthFixtures } from './api-auth.fixture';

import { Tags, featureTag } from '../../shared/tags';

/*
 * UI suite composition root.
 *
 * The fixture type is assembled in dependency order:
 *   core (cookies, policy gate) → pages (POM instantiation) →
 *   flows (ready-state + data setup) → auth/api-auth (login + token).
 *
 * Each layer's named fixtures are spread in directly so tests see flat keys
 * (`pages`, `loggedInSession`, etc.) rather than a wrapper object.
 */
type UiFixtures = CookiesFixtures &
  PolicyFixtures &
  PagesFixtures &
  DataSetupFixtures &
  DashboardReadyFixtures &
  FindingListReadyFixtures &
  AuthFixtures &
  ApiAuthFixtures;

export const test = base.extend<UiFixtures>({
  ...cookiesFixture,
  ...policyFixture,
  ...pagesFixture,
  ...dataSetupFixture,
  ...dashboardPageFixture,
  ...findingListPageFixture,
  ...authFixture,
  ...apiAuthFixture,
});

export { Tags, featureTag };
export const expect = test.expect;
