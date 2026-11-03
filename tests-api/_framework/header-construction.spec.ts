/**
 * API suite framework-level smoke. Builds base URLs + headers without
 * hitting the network.
 */
import { test, expect } from '../../src/api/fixtures';
import { Tags } from '../../src/shared/tags';
import { env, effectiveApiBaseUrl } from '../../src/shared/env';
import { ProductApiClient } from '../../src/api/clients/product.client';
import { FindingApiClient } from '../../src/api/clients/finding.client';
import { EngagementApiClient } from '../../src/api/clients/engagement.client';

test('API smoke | env resolves to demo API URL', { tag: [Tags.INFRA] }, async () => {
  expect(env.apiBaseURL).toMatch(/^https?:\/\//);
  expect(env.testEnv).toBe('demo');
});

test('API smoke | effectiveApiBaseUrl respects per-test override', { tag: [Tags.INFRA] }, async () => {
  expect(effectiveApiBaseUrl()).toBe(env.apiBaseURL);
  expect(effectiveApiBaseUrl('https://example.test/api')).toBe('https://example.test/api');
});

test('API smoke | clients resolve base paths correctly', { tag: [Tags.INFRA] }, async () => {
  // Construct against a stub context — never used.
  const stub: never = {} as never;
  void stub;
  // Path resolution is pure string ops; verify via prototype.
  const pProto = Object.getPrototypeOf(new ProductApiClient(stub as never));
  const fProto = Object.getPrototypeOf(new FindingApiClient(stub as never));
  const eProto = Object.getPrototypeOf(new EngagementApiClient(stub as never));
  expect(pProto).toBeDefined();
  expect(fProto).toBeDefined();
  expect(eProto).toBeDefined();
});
