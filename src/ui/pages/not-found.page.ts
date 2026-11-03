import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * 404 page. Used to verify the framework's negative-path assertions.
 * The path is never hit by `goto()` — the page is reached by navigating to
 * any non-existent URL.
 */
export class NotFoundPage extends BasePage {
  protected readonly path = '/__nonexistent__404__';

  readonly heading: Locator;
  readonly notFoundMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { level: 1 });
    this.notFoundMessage = page.getByText(/not found|page not found|404/i).first();
  }

  /** Override `goto` to actually hit a 404 path; we don't call BasePage.goto. */
  async gotoNotFound(): Promise<void> {
    await this.page.goto('/this-route-does-not-exist', { waitUntil: 'domcontentloaded' });
  }
}
