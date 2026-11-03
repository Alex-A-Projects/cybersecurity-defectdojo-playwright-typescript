import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { FilterBarComponent } from '../components/filter-bar.component';

/**
 * /finding/list — finding list with filter bar (severity, status, product…).
 */
export class FindingListPage extends BasePage {
  protected readonly path = '/finding/open';

  readonly header: HeaderComponent;
  readonly filterBar: FilterBarComponent;

  readonly title: Locator;
  readonly findingTable: Locator;
  readonly findingRows: Locator;
  readonly noResultsMessage: Locator;
  readonly addFindingButton: Locator;
  readonly bulkActionBar: Locator;

  /**
   * Verified 2026-10-21 from the findings-view page snapshot. DefectDojo
   * renders the severity filter as a dropdown *button*, not an inline
   * `<select>` — the inline selects only appear once the panel is expanded.
   */
  readonly severityDropdown: Locator;
  /** Verified 2026-10-21: search is toggled by a button labelled "Search". */
  readonly searchToggle: Locator;
  /** Verified 2026-10-21: the results table exposes a "Status" column header. */
  readonly statusColumnHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.filterBar = new FilterBarComponent(page);
    this.title = page.getByRole('heading', { level: 3 });
    this.findingTable = page.locator('table').first();
    this.findingRows = page.locator('table tbody tr');
    this.noResultsMessage = page.getByText(/no findings|no results/i).first();
    this.addFindingButton = page.getByRole('link', { name: /add finding/i });
    this.bulkActionBar = page.locator('.bulk-actions, .bulk-action-bar').first();

    this.severityDropdown = page
      .getByRole('button', { name: /select findings by severity dropdown/i })
      .first();
    this.searchToggle = page.getByRole('button', { name: /^search$/i }).first();
    this.statusColumnHeader = page
      .getByRole('button', { name: /^status\s*: activate to sort$/i })
      .first();
  }

  async waitForReady(): Promise<void> {
    await this.filterBar.root.waitFor({ state: 'visible' });
  }

  rowByTitle(title: string): Locator {
    return this.findingRows.filter({ hasText: title }).first();
  }
}
