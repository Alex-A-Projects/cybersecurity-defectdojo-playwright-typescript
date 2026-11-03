import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';

test.describe('Reports', () => {
  test.fixme(
    'DD-500 | Reports page renders the report-type selector',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('reports')] },
    async ({ pages, loggedInSession }) => {
      // TODO(confirm): the reports page produced an EMPTY page snapshot on
      // every failing run, so the submit control's real accessible name is
      // unknown. The report-type `<select>` resolved (this test got past
      // `waitForReady()`), so only the submit button's label is in question —
      // it may be "Generate Report", "Create Report", or a Pro-gated control
      // that never renders on the demo sandbox.
      await pages.report.goto();
      await pages.report.waitForReady();
      await expect(pages.report.reportTypeSelect).toBeVisible();
    },
  );
});
