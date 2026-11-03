import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { SidebarComponent } from '../components/sidebar.component';

/**
 * / — DefectDojo dashboard / landing page after login.
 *
 * Shows a top bar (Header), a left sidebar (Sidebar), and a main panel with
 * summary cards + charts. POMs compose `header` and `sidebar` Components
 * rather than duplicating their selectors.
 *
 * Selectors below describe things visible on the dashboard only — header and
 * sidebar lives in components/. Some dashboard widgets (the donut chart, the
 * monthly chart) are rendered as `<canvas>` elements; locators target the
 * wrappers, not pixel coordinates.
 */
export class DashboardPage extends BasePage {
  protected readonly path = '/dashboard';

  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;

  readonly pageHeading: Locator;
  readonly quickLinks: Locator;

  // Summary cards (the four tiles at the top of the dashboard).
  readonly activeEngagementsCard: Locator;
  readonly lastSevenDaysCard: Locator;
  readonly closedLastSevenDaysCard: Locator;
  readonly riskAcceptedCard: Locator;

  // Charts.
  readonly historicalSeverityChart: Locator;
  readonly reportedSeverityByMonthChart: Locator;

  // Lower panel.
  readonly unansweredQuestionnairesHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
    // Verified 2026-10-21: DefectDojo page titles render as <h3>, not <h1>.
    this.pageHeading = page.getByRole('heading', { level: 3 });
    this.quickLinks = page.locator('.dashboard-quick-links a, main a[href^="/"]');

    // Summary cards use DefectDojo's tile markup. Each tile is identified by
    // its visible heading text; the body contains the count.
    this.activeEngagementsCard = page.locator('.card, .dashboard-tile, section').filter({ hasText: /^[\s\S]*Active Engagements[\s\S]*$/ }).first();
    this.lastSevenDaysCard     = page.locator('.card, .dashboard-tile, section').filter({ hasText: /^[\s\S]*Last Seven Days[\s\S]*$/ }).first();
    this.closedLastSevenDaysCard = page.locator('.card, .dashboard-tile, section').filter({ hasText: /^[\s\S]*Closed In Last Seven Days[\s\S]*$/ }).first();
    this.riskAcceptedCard      = page.locator('.card, .dashboard-tile, section').filter({ hasText: /^[\s\S]*Risk Accepted In Last Seven Days[\s\S]*$/ }).first();

    this.historicalSeverityChart = page.getByRole('heading', { name: /Historical Finding Severity/i }).first();
    this.reportedSeverityByMonthChart = page.getByRole('heading', { name: /Reported Finding Severity by Month/i }).first();

    this.unansweredQuestionnairesHeading = page.getByRole('heading', { name: /Unassigned Answered Engagement Questionnaires/i });
  }

  async waitForReady(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible' });
  }
}
