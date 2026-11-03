/**
 * UI suite framework-level smoke.
 * Verifies env resolution + cookie domain without ever opening a browser.
 *
 * Runs without credentials and without network access — useful as the very
 * first check on a fresh checkout or in CI before the live tests.
 */
import { test, expect } from '../../src/ui/fixtures';
import { Tags } from '../../src/shared/tags';

test('UI smoke | env resolves to demo base URL', { tag: [Tags.INFRA] }, async () => {
  // Import lazily so this file can also run in isolation.
  const { env } = await import('../../src/shared/env');
  expect(env.uiBaseURL).toMatch(/^https?:\/\//);
  expect(env.testEnv).toBe('demo');
  expect(env.cookieDomain.length).toBeGreaterThan(0);
});

test('UI smoke | Tags and featureTag export correctly', { tag: [Tags.INFRA] }, async () => {
  const { Tags, featureTag } = await import('../../src/shared/tags');
  expect(Tags.SMOKE).toBe('@smoke');
  expect(featureTag('findings')).toBe('@feature:findings');
});

test('UI smoke | policy engine refuses an undeclared feature tag', { tag: [Tags.INFRA] }, async () => {
  const { PolicyEngine } = await import('../../src/shared/policy');
  const pe = new PolicyEngine();
  // `totally_made_up_feature` is not in test-policy.json
  expect(pe.isDeclared('totally_made_up_feature')).toBe(false);
});
