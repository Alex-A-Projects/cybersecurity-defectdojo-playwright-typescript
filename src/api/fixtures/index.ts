import { test as base } from '@playwright/test';

import { policyFixture } from './core.fixture';
import type { PolicyFixtures } from './core.fixture';

import { apiAuthFixture } from './auth.fixture';
import type { ApiAuthFixtures } from './auth.fixture';

import { apiClientsFixture } from './clients.fixture';
import type { ApiClientFixtures } from './clients.fixture';

import { Tags, featureTag } from '../../shared/tags';

/*
 * API suite composition root.
 *   policy gate → auth (token) → clients (per-test).
 * No browser, no pages.
 */
type ApiFixtures = PolicyFixtures & ApiAuthFixtures & ApiClientFixtures;

export const test = base.extend<ApiFixtures>({
  ...policyFixture,
  ...apiAuthFixture,
  ...apiClientsFixture,
});

export { Tags, featureTag };
export const expect = test.expect;
