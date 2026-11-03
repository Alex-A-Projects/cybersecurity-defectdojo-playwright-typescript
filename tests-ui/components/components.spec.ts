import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';

test.describe('Components – list', () => {
  test(
    'DD-600 | Components list page renders',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('components')] },
    async ({ pages, loggedInSession, page }) => {
      await pages.components.goto();
      // DefectDojo's components list page lacks a stable h1; assert URL +
      // the table presence.
      await expect(page).toHaveURL(/\/components/);
      // `.first()` — the row locator intentionally matches many rows
      // (used by `rowByName().filter()`), so a bare `toBeAttached()`
      // trips Playwright's strict-mode violation.
      await expect(pages.components.componentRows.first()).toBeAttached();
    },
  );
});
