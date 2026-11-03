import { test as base } from '@playwright/test';

import { FEATURE_PREFIX, Tags } from '../../shared/tags';
import { PolicyEngine } from '../../shared/policy';

/*
 * API suite core fixture — feature gating parity with the UI suite.
 *
 * Same `policyFixture` shape (auto fixture that reads config/test-policy.json
 * and either skips or errors per feature tag).
 */

export interface PolicyFixtures {
  _policy: void;
}

const policy = new PolicyEngine();

export const policyFixture = {
  _policy: [
    async ({}, use: (value: void) => Promise<void>, testInfo) => {
      if (testInfo.tags.includes(Tags.INFRA)) {
        await use(undefined);
        return;
      }
      const featureTags = testInfo.tags.filter((t) => t.startsWith(FEATURE_PREFIX));
      if (featureTags.length === 0) {
        throw new Error(
          `Test "${testInfo.title}" has no @feature: tag. ` +
          `Add featureTag('<name>') from src/shared/tags.`,
        );
      }
      for (const tag of featureTags) {
        const name = tag.slice(FEATURE_PREFIX.length);
        if (!policy.isDeclared(name)) {
          throw new Error(`Undeclared feature tag: "${name}". Add it to config/test-policy.json.`);
        }
        if (!policy.isEnabled(name)) {
          testInfo.skip(true, policy.skipReason(name));
        }
      }
      await use(undefined);
    },
    { auto: true, title: 'policy-gate' },
  ],
} as Parameters<typeof base.extend<PolicyFixtures>>[0];
