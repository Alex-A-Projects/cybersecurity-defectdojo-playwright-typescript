import type { Page } from '@playwright/test';
import { ProductListPage } from '../pages/product-list.page';
import { uniqueProductName } from '../../shared/generators';
import type { ProductModel } from '../models/product.model';

/**
 * ProductService — UI-driven product CRUD setup helpers, used by other specs
 * to prepare data without hand-writing form fills in every spec.
 *
 * Strict layering rule: only imports from ../models and ../pages.
 */
export class ProductService {
  constructor(private readonly page: Page) {}

  async createProduct(overrides: Partial<ProductModel> = {}): Promise<ProductModel> {
    const list = new ProductListPage(this.page);
    await list.goto();
    await list.addProductButton.click();
    await this.page.waitForURL(/\/product\/add/);

    const product: ProductModel = {
      name: overrides.name ?? uniqueProductName('ui'),
      description: overrides.description ?? `Created via UI test ${Date.now()}`,
      productType: overrides.productType ?? 'Generic Product Type', // placeholder; UI resolves
      ...overrides,
    };

    // The "Add Product" form has fields Name, Description, Product Type, etc.
    await this.page.getByLabel(/^name$/i).fill(product.name);
    if (product.description) {
      await this.page.getByLabel(/description/i).fill(product.description);
    }
    // Product Type is a select — DefectDojo's UI lists types alphabetically.
    if (product.productType) {
      await this.page.getByLabel(/product type/i).selectOption({ label: product.productType });
    }

    await this.page.getByRole('button', { name: /submit|create|add/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
    return product;
  }

  async deleteProductByName(name: string): Promise<void> {
    const list = new ProductListPage(this.page);
    await list.goto();
    const row = list.rowByName(name);
    await row.locator('input[type="checkbox"], .select-box').first().check();
    await this.page.getByRole('button', { name: /delete selected/i }).first().click();
    // Bootstrap confirm modal
    await this.page.locator('.modal .btn-danger, .modal .btn-primary').first().click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
