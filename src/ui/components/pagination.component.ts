import type { Locator, Page } from '@playwright/test';

/**
 * Pagination control rendered at the bottom of long lists (products,
 * findings, users). DefectDojo uses Bootstrap pagination markup.
 */
export class PaginationComponent {
  readonly root: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly pageLinks: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.pagination, nav[aria-label*="pagination"]').first();
    this.nextButton = page.getByRole('link', { name: /next|›|»/i }).first();
    this.previousButton = page.getByRole('link', { name: /previous|‹|«/i }).first();
    this.pageLinks = page.locator('.pagination .page-link, .pagination a');
  }

  async gotoPage(n: number): Promise<void> {
    await this.pageLinks.filter({ hasText: new RegExp(`^${n}$`) }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async next(): Promise<void> {
    await this.nextButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
