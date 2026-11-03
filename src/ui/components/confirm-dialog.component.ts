import type { Locator, Page } from '@playwright/test';

/**
 * Bootstrap modal used as a "Are you sure?" prompt before destructive
 * actions like deleting a finding. Has a body and OK/Cancel buttons.
 */
export class ConfirmDialogComponent {
  readonly root: Locator;
  readonly title: Locator;
  readonly body: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('.modal[role="dialog"], .modal-dialog, [role="alertdialog"]').first();
    this.title = page.locator('.modal-title, [role="dialog"] h2, [role="dialog"] h3').first();
    this.body = page.locator('.modal-body').first();
    this.confirmButton = page.locator('.modal-footer button.btn-primary, .modal-footer button.btn-danger, [role="dialog"] button:has-text("OK")').first();
    this.cancelButton = page.locator('.modal-footer button.btn-secondary, .modal-footer button:has-text("Cancel"), [role="dialog"] button:has-text("Cancel")').first();
  }

  async confirm(): Promise<void> {
    await this.confirmButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
    await this.root.waitFor({ state: 'hidden' });
  }
}
