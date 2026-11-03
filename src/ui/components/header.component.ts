import type { Locator, Page } from '@playwright/test';

/**
 * Top navigation bar — appears on every authenticated page.
 *
 * Top-bar structure in DefectDojo v2:
 * - Brand link → `/`
 * - Nav links: Products / Engagements / Findings / Reports / Users
 * - User menu (right): username dropdown → profile + logout
 *
 * No assertions here; methods click through and let the caller verify.
 */
export class HeaderComponent {
  readonly root: Locator;
  readonly brandLink: Locator;
  readonly productsLink: Locator;
  readonly engagementsLink: Locator;
  readonly findingsLink: Locator;
  readonly reportsLink: Locator;
  readonly usersLink: Locator;
  readonly userMenu: Locator;
  readonly logoutLink: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('header, .navbar, nav.top-nav').first();
    this.brandLink = page.locator('header a.brand, .navbar-brand').first();
    this.productsLink = page.getByRole('link', { name: /^products$/i }).first();
    this.engagementsLink = page.getByRole('link', { name: /^engagements$/i }).first();
    this.findingsLink = page.getByRole('link', { name: /^findings$/i }).first();
    this.reportsLink = page.getByRole('link', { name: /^reports$/i }).first();
    this.usersLink = page.getByRole('link', { name: /^users$/i }).first();
    this.userMenu = page.locator('.user-menu, .navbar-right .dropdown-toggle').first();
    this.logoutLink = page.getByRole('link', { name: /logout/i });
  }

  async logout(): Promise<void> {
    await this.userMenu.click();
    await this.logoutLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
