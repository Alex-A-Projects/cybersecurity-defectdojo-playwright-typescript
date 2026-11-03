import type { Locator, Page } from '@playwright/test';

/**
 * Transient toast/alert rendered after a successful create/update/delete.
 * DefectDojo uses Bootstrap toasts under `#messages` or `.alert-success`.
 */
export class ToastComponent {
  readonly root: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.toast, .alert-success, .alert-info, #messages .alert').first();
  }

  async dismiss(): Promise<void> {
    await this.root.waitFor({ state: 'visible' });
    await this.root.locator('button.close, .btn-close').first().click().catch(() => {
      /* no close button — let it fade */
    });
  }
}
