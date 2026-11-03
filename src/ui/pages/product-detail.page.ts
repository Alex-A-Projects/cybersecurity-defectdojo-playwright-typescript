import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

/**
 * /product/<id> — read-only product detail + edit/delete controls.
 *
 * Note: DefectDojo's product edit lives at the same path with a different
 * intent (visit /product/<id>/edit). We don't wrap the edit flow in this POM
 * — that's a separate page.
 */
export class ProductDetailPage extends BasePage {
  protected readonly path = '/product'; // overridden per visit; do not call goto()

  readonly header: HeaderComponent;

  readonly title: Locator;
  readonly breadcrumb: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly productTypeField: Locator;
  readonly descriptionField: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.title = page.getByRole('heading', { level: 3 });
    this.breadcrumb = page.locator('nav.breadcrumb, ol.breadcrumb').first();
    this.editButton = page.getByRole('link', { name: /edit product/i });
    this.deleteButton = page.getByRole('button', { name: /delete/i });
    this.productTypeField = page.locator('[data-field="prod_type"]').first();
    this.descriptionField = page.locator('[data-field="description"]').first();
  }
}
