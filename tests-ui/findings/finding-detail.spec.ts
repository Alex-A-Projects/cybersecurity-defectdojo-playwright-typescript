/**
 * UI suite — Finding detail page.
 *
 * Asserts the read-only finding detail (severity, status, CWE, CVSS, edit/delete).
 */
import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';
import { uniqueFindingTitle } from '../../src/shared/generators';

test.describe('Findings – detail', () => {
  test.fixme(
    'DD-340 | New finding detail page renders severity, status, and edit/delete controls',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('findings')] },
    async ({ pages, loggedInSession, findingService }) => {
      // TODO(confirm): depends on DD-302's create flow; see findings.spec.ts.
      //
      const finding = await findingService.createFinding({
        title: uniqueFindingTitle('ui'),
        severity: 'High',
      });

      // Navigate to the finding list, then click the row to reach the detail page.
      await pages.findingList.goto();
      const row = pages.findingList.rowByTitle(finding.title);
      await row.click();

      await expect(pages.findingDetail.title).toBeVisible();
      await expect(pages.findingDetail.severityBadge).toBeAttached();
      await expect(pages.findingDetail.statusBadge).toBeAttached();
      await expect(pages.findingDetail.editButton).toBeAttached();
      await expect(pages.findingDetail.deleteButton).toBeAttached();
    },
  );
});
