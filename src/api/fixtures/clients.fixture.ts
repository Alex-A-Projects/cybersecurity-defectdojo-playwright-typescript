import { test as base } from '@playwright/test';

import type { ApiAuthFixtures } from './auth.fixture';
import { AssetApiClient } from '../clients/asset.client';
import { EngagementApiClient } from '../clients/engagement.client';
import { FindingApiClient } from '../clients/finding.client';
import { TestApiClient } from '../clients/test.client';
import { TestTypeApiClient } from '../clients/test-type.client';
import { UserApiClient } from '../clients/user.client';

import { AssetService } from '../services/asset.service';
import { EngagementService } from '../services/engagement.service';
import { FindingService } from '../services/finding.service';
import { TestService } from '../services/test.service';
import { TestTypeService } from '../services/test-type.service';
import { UserService } from '../services/user.service';

/*
 * Per-test API clients + service wrappers, all sharing the same
 * Playwright `request` context and the bearer token from apiAuthFixture.
 *
 * Specs consume the *Service (e.g. `apiAsset.create({...})`), not the
 * raw client, so future auth changes live in one place.
 *
 * NOTE: DefectDojo v2 calls products → assets. The canonical fixture
 * is `apiAsset`. `apiProduct` is a deprecated alias kept for backward
 * compat with specs written before the spec-driven rename.
 *
 * Finding-create needs a Test id and test_type ids (DefectDojo's
 * `FindingCreate` requires `test` + `found_by`). The matching services
 * are wired as `apiTest` and `apiTestType` so specs can do the full
 * Product → Engagement → Test → TestType → Finding chain.
 */

export type ApiClientFixtures = {
  apiAsset: AssetService;
  apiProduct: AssetService;     // @deprecated — use `apiAsset`
  apiEngagement: EngagementService;
  apiTest: TestService;
  apiTestType: TestTypeService;
  apiFinding: FindingService;
  apiUser: UserService;
};

export const apiClientsFixture: Parameters<typeof base.extend<ApiClientFixtures & ApiAuthFixtures>>[0] = {
  apiAsset: async ({ request, apiAuthorization }, use) => {
    const client = new AssetApiClient(request);
    await use(new AssetService(client, apiAuthorization));
  },
  // @deprecated alias; same instance as apiAsset.
  apiProduct: async ({ apiAsset }, use) => {
    await use(apiAsset);
  },
  apiEngagement: async ({ request, apiAuthorization }, use) => {
    const client = new EngagementApiClient(request);
    await use(new EngagementService(client, apiAuthorization));
  },
  apiTest: async ({ request, apiAuthorization }, use) => {
    const client = new TestApiClient(request);
    await use(new TestService(client, apiAuthorization));
  },
  apiTestType: async ({ request, apiAuthorization }, use) => {
    const client = new TestTypeApiClient(request);
    await use(new TestTypeService(client, apiAuthorization));
  },
  apiFinding: async ({ request, apiAuthorization }, use) => {
    const client = new FindingApiClient(request);
    await use(new FindingService(client, apiAuthorization));
  },
  apiUser: async ({ request, apiAuthorization }, use) => {
    const client = new UserApiClient(request);
    await use(new UserService(client, apiAuthorization));
  },
};
