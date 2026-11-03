import { test as base } from '@playwright/test';

import { ProductRepo, ProductTypeRepo, SlaConfigurationRepo } from '../repositories/product.repo';
import { EngagementRepo } from '../repositories/engagement.repo';
import { FindingRepo } from '../repositories/finding.repo';
import { UserRepo } from '../repositories/user.repo';

import { ProductFactory, ProductTypeFactory } from '../factories/product.factory';
import { EngagementFactory } from '../factories/engagement.factory';
import { FindingFactory } from '../factories/finding.factory';
import { UserFactory } from '../factories/user.factory';
import { TestFactory } from '../factories/test.factory';
import { TestTypeFactory } from '../factories/test-type.factory';

/*
 * DB suite repository + factory fixtures.
 * Every factory / repo is instantiated once per test (cheap, stateless).
 */
export type DbFactoryFixtures = {
  productFactory: ProductFactory;
  productTypeFactory: ProductTypeFactory;
  engagementFactory: EngagementFactory;
  findingFactory: FindingFactory;
  testFactory: TestFactory;
  testTypeFactory: TestTypeFactory;
  userFactory: UserFactory;
};

export type DbRepoFixtures = {
  productRepo: ProductRepo;
  productTypeRepo: ProductTypeRepo;
  slaConfigurationRepo: SlaConfigurationRepo;
  engagementRepo: EngagementRepo;
  findingRepo: FindingRepo;
  userRepo: UserRepo;
};

export const dbFactoriesFixture: Parameters<typeof base.extend<DbFactoryFixtures>>[0] = {
  productFactory: async ({}, use) => await use(new ProductFactory()),
  productTypeFactory: async ({}, use) => await use(new ProductTypeFactory()),
  engagementFactory: async ({}, use) => await use(new EngagementFactory()),
  findingFactory: async ({}, use) => await use(new FindingFactory()),
  testFactory: async ({}, use) => await use(new TestFactory()),
  testTypeFactory: async ({}, use) => await use(new TestTypeFactory()),
  userFactory: async ({}, use) => await use(new UserFactory()),
};

export const dbReposFixture: Parameters<typeof base.extend<DbRepoFixtures>>[0] = {
  productRepo: async ({}, use) => await use(new ProductRepo()),
  productTypeRepo: async ({}, use) => await use(new ProductTypeRepo()),
  slaConfigurationRepo: async ({}, use) => await use(new SlaConfigurationRepo()),
  engagementRepo: async ({}, use) => await use(new EngagementRepo()),
  findingRepo: async ({}, use) => await use(new FindingRepo()),
  userRepo: async ({}, use) => await use(new UserRepo()),
};
