import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';

/**
 * /user/list — list users (admin-only).
 */
export class UserListPage extends BasePage {
  protected readonly path = '/user';

  readonly header: HeaderComponent;

  readonly toolbar: Locator;
  readonly userTable: Locator;
  readonly userRows: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.toolbar = page.getByRole('button', { name: /^filters$/i }).first();
    this.userTable = page.locator('table').first();
    this.userRows = page.locator('table tbody tr');
  }

  async waitForReady(): Promise<void> {
    await this.toolbar.waitFor({ state: 'visible' });
  }
}
