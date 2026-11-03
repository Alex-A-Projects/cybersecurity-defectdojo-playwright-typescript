import type { Page } from '@playwright/test';

/**
 * Base class for every UI Page Object.
 * - `path` is the route within the app under test, e.g. `/product/list`.
 * - `goto()` navigates and waits for `domcontentloaded`. Page-specific readiness
 *   (e.g. lists having rendered) lives on the subclass as `waitForReady()`.
 *
 * Notes for DefectDojo:
 * - No custom `data-*` test ID exists in the DOM. POMs use role/label/text.
 * - Subclasses are encouraged to also expose a `header` Component for shared
 *   navigation rather than re-implementing the top bar in every page.
 */
export abstract class BasePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto(): Promise<void> {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }

  get expectedUrlPattern(): RegExp {
    return new RegExp(this.path.replace(/\//g, '\\/'));
  }

  /** Subclasses override to wait for any page-specific load completion. */
  async waitForReady(): Promise<void> {
    // default: nothing beyond domcontentloaded (default in goto).
  }
}
