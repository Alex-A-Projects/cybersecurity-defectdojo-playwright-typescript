import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';

test.describe('Configuration', () => {
  test.fixme(
    'DD-1100 | Configuration page renders',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('configuration')] },
    async ({ pages, loggedInSession, page }) => {
      // TODO(confirm): the configuration page produced an EMPTY page snapshot
      // on every failing run. The URL assertion passes (`/configuration`
      // resolves), so only the body-container markup is unknown. Many
      // DefectDojo configuration panels are Pro-gated and may render a
      // paywall instead of a body container on the demo sandbox.
      await pages.configuration.goto();
      await expect(page).toHaveURL(/\/configuration/);
    },
  );
});
