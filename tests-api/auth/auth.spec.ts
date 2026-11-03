import { test, expect, Tags, featureTag } from '../../src/api/fixtures';

test.describe('Auth – DRF token endpoint', () => {
  test(
    'DD-1000 | valid credentials mint a non-empty token',
    { tag: [Tags.SMOKE, Tags.CRITICAL, featureTag('auth')] },
    async ({ apiToken }) => {
      expect(typeof apiToken).toBe('string');
      expect(apiToken.length).toBeGreaterThan(10);
    },
  );

  test(
    'DD-1001 | Authorization header carries the token',
    { tag: [Tags.REGRESSION, featureTag('auth')] },
    async ({ apiAuthorization, apiToken }) => {
      expect(apiAuthorization.Authorization).toBe(`Token ${apiToken}`);
    },
  );
});
