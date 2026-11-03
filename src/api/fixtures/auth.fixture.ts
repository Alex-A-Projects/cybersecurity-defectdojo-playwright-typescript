import { test as base, request } from '@playwright/test';

import { env, effectiveApiBaseUrl } from '../../shared/env';
import { AuthApiClient } from '../clients/auth.client';

/*
 * apiAuthFixture — obtains a DRF token via `/api/v2/api-token-auth/`.
 *
 * Scope: "test" — every test receives its own token. Tokens issued against
 * the public sandbox carry real-world risk and should never be persisted.
 */

export type ApiAuthFixtures = {
  apiToken: string;
  apiAuthorization: { Authorization: string };
};

export const apiAuthFixture: Parameters<typeof base.extend<ApiAuthFixtures>>[0] = {
  apiToken: [
    async ({}, use: (token: string) => Promise<void>) => {
      if (!env.testUser || !env.testPassword) {
        throw new Error('TEST_USER/TEST_PASSWORD required for API auth fixture.');
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

  apiAuthorization: async ({ apiToken }, use) => {
    await use({ Authorization: `Token ${apiToken}` });
  },
};
