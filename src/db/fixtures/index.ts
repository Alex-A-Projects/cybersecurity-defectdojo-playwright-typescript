import { test as base } from '@playwright/test';

import { policyFixture } from './core.fixture';
import type { PolicyFixtures } from './core.fixture';

import { dbFactoriesFixture, dbReposFixture } from './repos.fixture';
import type { DbFactoryFixtures, DbRepoFixtures } from './repos.fixture';

import { Tags, featureTag } from '../../shared/tags';

/*
 * DB suite composition root.
 *   policy gate → repos → factories. No browser, no HTTP, no auth.
 */
type DbFixtures = PolicyFixtures & DbRepoFixtures & DbFactoryFixtures;

export const test = base.extend<DbFixtures>({
  ...policyFixture,
  ...dbReposFixture,
  ...dbFactoriesFixture,
});

export { Tags, featureTag };
export const expect = test.expect;
