import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { HeaderComponent } from '../components/header.component';
import { SidebarComponent } from '../components/sidebar.component';

/**
 * /calendar — engagement / product events calendar.
 *
 * Rendering is a month grid plus a list panel; the POM asserts only the
 * container is present rather than pinning cell-level selectors that vary
 * widely across versions.
 */
export class CalendarPage extends BasePage {
  protected readonly path = '/calendar/engagements';

  readonly header: HeaderComponent;
  readonly sidebar: SidebarComponent;

  readonly pageHeading: Locator;
  readonly calendarGrid: Locator;
  readonly calendarList: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.sidebar = new SidebarComponent(page);
    this.pageHeading = page.getByRole('heading', { level: 3 });
    this.calendarGrid = page.locator('.calendar, .fc, [role="grid"], table.calendar').first();
    this.calendarList = page.locator('.calendar-list, ul.calendar-events, .event-list').first();
  }

  async waitForReady(): Promise<void> {
    await this.pageHeading.waitFor({ state: 'visible' }).catch(() => undefined);
  }
}
