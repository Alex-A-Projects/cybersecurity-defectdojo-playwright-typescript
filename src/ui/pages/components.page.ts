import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { SidebarComponent } from '../components/sidebar.component';

/**
 * /components — asset-component catalogue. DefectDojo models components as
 * sub-resources inside an Asset (Product). The list can be filtered by
 * product via a query parameter (`?product=42`).
 *
 * NOTE: DefectDojo's path may be `/components` or `/product/<id>/components`
 * depending on version — this POM targets the canonical list route.
 * `TODO(confirm):` if the sandbox resolves `/components` differently.
 */
export class ComponentsPage extends BasePage {
  protected readonly path = '/components';

  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;

  readonly pageHeading: Locator;
  readonly toolbar: Locator;
  readonly componentRows: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.pageHeading = page.getByRole('heading', { level: 3 });
    this.toolbar = page.getByRole('button', { name: /^filters$/i }).first();
    this.componentRows = page.locator('table tbody tr');
  }

  async waitForReady(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible' }).catch(() => undefined);
    await this.toolbar.waitFor({ state: 'visible' }).catch(() => undefined);
  }
}
