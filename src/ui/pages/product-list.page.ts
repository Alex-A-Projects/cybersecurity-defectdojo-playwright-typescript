import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

/**
 * /product/list — lists all products (DefectDojo's "assets").
 *
 * Selection uses a form with a checkbox per row; bulk actions like "delete
 * selected" are exposed as buttons in the toolbar above the table.
 */
export class ProductListPage extends BasePage {
  protected readonly path = '/asset';

  readonly header: HeaderComponent;

  readonly toolbar: Locator;
  readonly addProductButton: Locator;
  readonly productTable: Locator;
  readonly productRows: Locator;
  readonly searchInput: Locator;
  readonly noResultsRow: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.toolbar = page.getByRole('button', { name: /^filters$/i }).first();
    // Verified 2026-10-21 against the demo sandbox: the Asset List toolbar
    // renders the create control as a *button* labelled "Add Product",
    // not a link.
    this.addProductButton = page.getByRole('button', { name: /add product/i }).first();
    this.productTable = page.locator('table').first();
    this.productRows = page.locator('table tbody tr');
    this.searchInput = page.getByPlaceholder(/search/i).first();
    this.noResultsRow = page.locator('table tbody tr td', { hasText: /no results/i }).first();
  }

  async waitForReady(): Promise<void> {
    await this.toolbar.waitFor({ state: 'visible' });
  }

  rowByName(name: string): Locator {
    return this.productRows.filter({ hasText: name }).first();
  }
}
