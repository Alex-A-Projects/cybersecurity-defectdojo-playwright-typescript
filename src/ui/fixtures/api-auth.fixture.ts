import { test as base, request } from '@playwright/test';

import { env, effectiveApiBaseUrl } from '../../shared/env';
import { AuthApiClient } from '../../api/clients/auth.client';

/*
 * apiAuthFixture — obtains a DRF API token via the v2 endpoint and exposes
 * it to specs that need it.
 *
 * DefectDojo v2 endpoint: POST /api/v2/api-token-auth/
 *   Content-Type: application/x-www-form-urlencoded (verified 2026-10-20)
 *   Request:  { username: string, password: string }
 *   Response: { token: string }
 *
 * Specs then call API endpoints via the http fixture; this fixture only
 * provides the bearer-style token.
 */

export type ApiToken = string;

export type ApiAuthFixtures = {
  apiToken: ApiToken;
};

export const apiAuthFixture: Parameters<typeof base.extend<ApiAuthFixtures>>[0] = {
  apiToken: [
    async ({}, use) => {
      if (!env.testUser || !env.testPassword) {
        throw new Error('TEST_USER/TEST_PASSWORD required for apiToken fixture.');
      }
      const ctx = await request.newContext({ baseURL: effectiveApiBaseUrl() });
      try {
        const auth = new AuthApiClient(ctx);
        const token = await auth.getToken(env.testUser, env.testPassword);
        await use(token);
      } finally {
        await ctx.dispose();
      }
    },
    { scope: 'test' },
  ],
};
