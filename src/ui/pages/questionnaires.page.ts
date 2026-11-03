import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { SidebarComponent } from '../components/sidebar.component';

/**
 * /questionnaire — questionnaire catalogue. DefectDojo has two surfaces:
 *   1. /questionnaire — general questionnaire list (admin)
 *   2. /engagement/<id>/questionnaire — engagement-scoped answers
 *
 * The sidebar links to the catalogue.
 */
export class QuestionnairesPage extends BasePage {
  protected readonly path = '/questionnaire';

  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;

  readonly pageHeading: Locator;
  readonly toolbar: Locator;
  readonly questionnaireRows: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.pageHeading = page.getByRole('heading', { level: 3 });
    this.toolbar = page.getByRole('button', { name: /^filters$/i }).first();
    this.questionnaireRows = page.locator('table tbody tr');
  }

  async waitForReady(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible' }).catch(() => undefined);
    await this.toolbar.waitFor({ state: 'visible' }).catch(() => undefined);
  }
}
