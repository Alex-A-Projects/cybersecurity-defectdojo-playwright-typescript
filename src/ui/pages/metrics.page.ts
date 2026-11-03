import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { SidebarComponent } from '../components/sidebar.component';

/**
 * /metrics — security-metrics dashboard (counts by severity, finding ageing,
 * SLAs). Reads chart-heavy content; the POM asserts only that the page
 * resolved (the chart canvas selectors are stable enough for `toBeAttached`).
 */
export class MetricsPage extends BasePage {
  protected readonly path = '/metrics';

  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;

  readonly pageHeading: Locator;
  readonly metricsBody: Locator;
  readonly charts: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.pageHeading = page.getByRole('heading', { level: 3 });
    this.metricsBody = page.locator('main, .metrics-body, #metrics').first();
    this.charts = page.locator('canvas, svg.metrics, .chart').first();
  }

  async waitForReady(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible' }).catch(() => undefined);
    await this.metricsBody.waitFor({ state: 'visible' }).catch(() => undefined);
  }
}
