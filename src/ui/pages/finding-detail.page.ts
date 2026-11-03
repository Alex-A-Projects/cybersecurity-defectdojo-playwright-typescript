import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog.component';

/**
 * /finding/<id> — finding detail with edit/delete and severity/status controls.
 */
export class FindingDetailPage extends BasePage {
  protected readonly path = '/finding'; // overridden per visit

  readonly header: HeaderComponent;
  readonly confirmDialog: ConfirmDialogComponent;

  readonly title: Locator;
  readonly severityBadge: Locator;
  readonly statusBadge: Locator;
  readonly descriptionField: Locator;
  readonly cweField: Locator;
  readonly cvssField: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.confirmDialog = new ConfirmDialogComponent(page);
    this.title = page.getByRole('heading', { level: 3 });
    this.severityBadge = page.locator('[data-field="severity"], .severity-badge, .severity').first();
    this.statusBadge = page.locator('[data-field="status"], .status-badge, .status').first();
    this.descriptionField = page.locator('[data-field="description"]').first();
    this.cweField = page.locator('[data-field="cwe"]').first();
    this.cvssField = page.locator('[data-field="cvss"]').first();
    this.editButton = page.getByRole('link', { name: /edit finding/i });
    this.deleteButton = page.getByRole('button', { name: /delete finding/i });
  }
}
