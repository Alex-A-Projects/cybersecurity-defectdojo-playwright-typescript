import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

/**
 * /engagement/<id> — engagement detail with tabs for findings, notes,
 * risk acceptance, etc. (DefectDojo tabs are Bootstrap nav-tabs).
 */
export class EngagementDetailPage extends BasePage {
  protected readonly path = '/engagement'; // overridden per visit

  readonly header: HeaderComponent;

  readonly title: Locator;
  readonly tabs: Locator;
  readonly findingsTab: Locator;
  readonly notesTab: Locator;
  readonly addFindingButton: Locator;
  readonly statusBadge: Locator;
  readonly descriptionField: Locator;
  readonly targetStartField: Locator;
  readonly targetEndField: Locator;
  readonly productBreadcrumb: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.title = page.getByRole('heading', { level: 3 });
    this.tabs = page.locator('ul.nav-tabs, [role="tablist"]').first();
    this.findingsTab = page.getByRole('tab', { name: /findings/i });
    this.notesTab = page.getByRole('tab', { name: /notes/i });
    this.addFindingButton = page.getByRole('link', { name: /add finding/i });
    this.statusBadge = page.locator('[data-field="status"], .badge').first();
    this.descriptionField = page.locator('[data-field="description"]').first();
    this.targetStartField = page.locator('[data-field="target_start"], [data-field="target-start"]').first();
    this.targetEndField = page.locator('[data-field="target_end"], [data-field="target-end"]').first();
    this.productBreadcrumb = page.locator('nav.breadcrumb, ol.breadcrumb').first();
    this.editButton = page.getByRole('link', { name: /edit engagement/i });
    this.deleteButton = page.getByRole('button', { name: /delete engagement/i });
  }
}
