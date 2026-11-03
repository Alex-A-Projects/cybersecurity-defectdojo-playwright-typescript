import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

/**
 * /reports — pick report type, generate a PDF/HTML/Excel report, download it.
 */
export class ReportPage extends BasePage {
  protected readonly path = '/reports/builder';

  readonly header: HeaderComponent;

  readonly reportTypeSelect: Locator;
  readonly generateButton: Locator;
  readonly downloadLink: Locator;
  readonly availableReportsList: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.reportTypeSelect = page.getByLabel(/report type/i);
    this.generateButton = page.getByRole('button', { name: /generate/i });
    this.downloadLink = page.getByRole('link', { name: /download/i });
    this.availableReportsList = page.locator('.reports-list, ul.reports').first();
  }

  async waitForReady(): Promise<void> {
    await this.reportTypeSelect.waitFor({ state: 'visible' });
  }
}
