import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

/**
 * /engagement/list — engagement list with per-product grouping.
 */
export class EngagementListPage extends BasePage {
  protected readonly path = '/engagement';

  readonly header: HeaderComponent;

  readonly toolbar: Locator;
  readonly engagementTable: Locator;
  readonly engagementRows: Locator;
  readonly noEngagementsRow: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.toolbar = page.getByRole('button', { name: /^filters$/i }).first();
    this.engagementTable = page.locator('table').first();
    this.engagementRows = page.locator('table tbody tr');
    this.noEngagementsRow = page.locator('table tbody tr td', { hasText: /no engagements/i }).first();
  }

  async waitForReady(): Promise<void> {
    await this.toolbar.waitFor({ state: 'visible' });
  }

  rowByName(name: string): Locator {
    return this.engagementRows.filter({ hasText: name }).first();
  }

  /** Click the row whose visible text matches `name`; expect a navigation to the detail page. */
  async openEngagementByName(name: string): Promise<void> {
    await this.rowByName(name).click();
    await this.page.waitForURL(/\/engagement\/\d+|\/engagement\/view/, { timeout: 5000 }).catch(() => {
      /* sandbox detail URL shape may vary; caller retries via direct URL fallback */
    });
  }
}
