import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';

test.describe('Endpoints – list', () => {
  test(
    'DD-700 | Endpoints list page renders',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('endpoints')] },
    async ({ pages, loggedInSession, page }) => {
      await pages.endpoint.goto();
      // DefectDojo's endpoints list page lacks a stable h1; assert URL +
      // the table presence.
      await expect(page).toHaveURL(/\/endpoint/);
      // `.first()` — multi-element locator, see components spec for rationale.
      await expect(pages.endpoint.endpointRows.first()).toBeAttached();
    },
  );
});
