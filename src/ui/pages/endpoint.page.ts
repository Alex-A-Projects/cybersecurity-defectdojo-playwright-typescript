import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { SidebarComponent } from '../components/sidebar.component';

/**
 * /endpoint — endpoint catalogue (DefectDojo's term for asset-level hosts /
 * services / URLs that produce or carry findings).
 *
 * Note: DefectDojo's URL is `/endpoint` (singular), matching Django's model.
 */
export class EndpointPage extends BasePage {
  protected readonly path = '/endpoint';

  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;

  readonly pageHeading: Locator;
  readonly toolbar: Locator;
  readonly endpointRows: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.pageHeading = page.getByRole('heading', { level: 3 });
    this.toolbar = page.getByRole('button', { name: /^filters$/i }).first();
    this.endpointRows = page.locator('table tbody tr');
  }

  async waitForReady(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible' }).catch(() => undefined);
    await this.toolbar.waitFor({ state: 'visible' }).catch(() => undefined);
  }
}
