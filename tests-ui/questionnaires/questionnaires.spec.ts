import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';

test.describe('Questionnaires', () => {
  test(
    'DD-1000 | Questionnaires list renders',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('questionnaires')] },
    async ({ pages, loggedInSession, page }) => {
      await pages.questionnaires.goto();
      // DefectDojo's questionnaires list page has a submenu trigger rather
      // than a stable h1; assert URL + the table presence.
      await expect(page).toHaveURL(/\/questionnaire/);
      // `.first()` — multi-element locator, see components spec for rationale.
      await expect(pages.questionnaires.questionnaireRows.first()).toBeAttached();
    },
  );
});
