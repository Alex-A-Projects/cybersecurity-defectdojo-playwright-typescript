import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { SidebarComponent } from '../components/sidebar.component';

/**
 * /configuration — admin-only DefectDojo configuration dashboard (DDoS
 * providers, language, DAST/SAST mappings, JIRA templates, etc.).
 *
 * Some controls here are Pro-only. Specs assert that the page renders and
 * that header sections appear, but do not exercise Pro-gated fields.
 */
export class ConfigurationPage extends BasePage {
  protected readonly path = '/configuration';

  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;

  readonly pageHeading: Locator;
  readonly configSections: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.pageHeading = page.getByRole('heading', { level: 3 });
    this.configSections = page.locator('main, .configuration-body, #configuration').first();
  }

  async waitForReady(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible' }).catch(() => undefined);
    await this.configSections.waitFor({ state: 'visible' }).catch(() => undefined);
  }
}
