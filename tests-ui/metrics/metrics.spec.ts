import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';

test.describe('Metrics – dashboard', () => {
  test(
    'DD-800 | Metrics dashboard renders',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('metrics')] },
    async ({ pages, loggedInSession, page }) => {
      await pages.metrics.goto();
      // DefectDojo's metrics page lacks a stable h1; assert URL + the
      // chart canvas presence instead.
      await expect(page).toHaveURL(/\/metrics/);
      await expect(pages.metrics.charts).toBeAttached();
    },
  );
});
