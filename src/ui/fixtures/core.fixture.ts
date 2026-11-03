import { test as base } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';
import { env } from '../../shared/env';
import { FEATURE_PREFIX, Tags } from '../../shared/tags';
import { PolicyEngine } from '../../shared/policy';

/*
 * Core fixture layer — low-level infrastructure shared by every UI test.
 *
 *   cookiesFixture  — adds a `qa_autotest` cookie so analytics identifies
 *                     automated traffic.
 *   policyFixture   — auto fixture that enforces feature tags against
 *                     config/test-policy.json (skip when disabled, fail loud
 *                     when undeclared).
 *
 * Dependency direction: core → pages → flows. Nothing here imports a POM.
 */

// ---------------------------------------------------------------------------
// cookiesFixture
// ---------------------------------------------------------------------------

export type CookiesFixtures = {
  acceptCookies: boolean;
};

export const cookiesFixture = {
  acceptCookies: [true, { option: true }],

  context: async (
    {
      context,
      acceptCookies,
    }: { context: BrowserContext; acceptCookies: boolean },
    use: (value: BrowserContext) => Promise<void>,
  ) => {
    // Always identify automated traffic for analytics
    await context.addCookies([
      {
        name: 'qa_autotest',
        value: '1',
        domain: env.cookieDomain,
        path: '/',
        sameSite: 'Lax',
        secure: true,
      },
    ]);

    // DefectDojo has no cookie banner in scope (open-source v2 defaults),
    // but we still leave the hook in case Pro adds one.
    if (acceptCookies) {
      /* placeholder for future consent cookie */
    }

    await use(context);
  },
} as Parameters<typeof base.extend<CookiesFixtures>>[0];

// ---------------------------------------------------------------------------
// policyFixture
// ---------------------------------------------------------------------------

export interface PolicyFixtures {
  _policy: void;
}

const policy = new PolicyEngine();

export const policyFixture = {
  _policy: [
    async ({}, use: (value: void) => Promise<void>, testInfo) => {
      // Framework/infrastructure tests opt out of feature gating by tagging
      // themselves with `@infra`. Use for health/structure checks that
      // shouldn't depend on a feature flag.
      if (testInfo.tags.includes(Tags.INFRA)) {
        await use(undefined);
        return;
      }

      const featureTags = testInfo.tags.filter((t) => t.startsWith(FEATURE_PREFIX));

      if (featureTags.length === 0) {
        throw new Error(
          `Test "${testInfo.title}" has no @feature: tag. ` +
          `Add featureTag('<name>') from src/shared/tags so it can be gated by config/test-policy.json.`,
        );
      }

      for (const tag of featureTags) {
        const name = tag.slice(FEATURE_PREFIX.length);

        if (!policy.isDeclared(name)) {
          throw new Error(
            `Undeclared feature tag: "${name}". Add it to config/test-policy.json.`,
          );
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
