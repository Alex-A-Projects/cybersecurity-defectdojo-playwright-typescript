/**
 * UI suite — Finding filter bar.
 *
 * Selectors verified 2026-10-21 against the demo sandbox's findings view:
 *   - severity filter  → button "Select findings by severity dropdown"
 *   - search toggle    → button "Search"
 *   - search input     → searchbox
 *   - status is a *column header* on the results table, not an inline select
 *
 * DefectDojo does NOT render inline `<select>` elements for severity/status
 * until the filter panel is expanded, so this spec asserts the panel's
 * trigger controls rather than the (not-yet-rendered) selects.
 */
import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';
import { collect } from '../../src/shared/assertion-collector';

test.describe('Finding filters – independent facts', () => {
  test(
    'DD-350 | Filter panel exposes its primary controls',
    { tag: [Tags.REGRESSION, featureTag('findings')] },
    async ({ pages, loggedInSession, findingListPage }) => {
      const failures: string[] = [];

      // Panel toggle (verified: "show-filters" on the findings view).
      await collect(
        'filter panel toggle',
        () => expect(findingListPage.filterBar.root).toBeVisible(),
        failures,
      );

      // Severity filter — a dropdown button, not a <select>.
      await collect(
        'severity dropdown',
        () => expect(findingListPage.severityDropdown).toBeAttached(),
        failures,
      );

      // Search affordance.
      await collect(
        'search toggle',
        () => expect(findingListPage.searchToggle).toBeAttached(),
        failures,
      );

      expect(failures, `Missing filter controls: ${failures.join('; ')}`).toEqual([]);
    },
  );
});