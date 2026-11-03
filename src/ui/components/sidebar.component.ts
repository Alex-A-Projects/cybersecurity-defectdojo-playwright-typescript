import type { Locator, Page } from '@playwright/test';

/**
 * Left navigation sidebar — appears on every authenticated dashboard page.
 * DefectDojo's sidebar groups links per feature area.
 *
 * Note on DefectDojo's sidebar interaction model:
 * - Rows with `>` expand a submenu when clicked (e.g. Findings > Open).
 * - Rows without `>` navigate directly (e.g. Dashboard).
 * - The locators below pick the **labeled** link/button — click behaviour is
 *   exercised by `tests-ui/_framework/sidebar-navigation.spec.ts`.
 */
export class SidebarComponent {
  readonly root: Locator;

  // Direct-navigation entries.
  readonly dashboardLink: Locator;
  readonly componentsLink: Locator;
  readonly endpointLink: Locator;
  readonly reportsLink: Locator;
  readonly metricsLink: Locator;
  readonly usersLink: Locator;
  readonly calendarLink: Locator;
  readonly questionnairesLink: Locator;
  readonly configurationLink: Locator;
  readonly upgradeLink: Locator;

  // Expandable sections.
  readonly assetsSection: Locator;
  readonly engagementsSection: Locator;
  readonly findingsSection: Locator;
  readonly adminSection: Locator;

  /**
   * Verified 2026-10-21: each sidebar entry is an `<a>` whose accessible
   * name is prefixed by a FontAwesome icon glyph, so an exact `name:` match
   * (e.g. `{ name: 'Findings' }`) fails. Match the visible text with a
   * case-insensitive regex instead.
   */
  readonly findingsLink: Locator;
  readonly engagementsLink: Locator;
  readonly assetsLink: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('aside, .sidebar, #sidebar').first();

    this.dashboardLink = page.getByRole('link', { name: /^dashboard$/i }).first();
    this.componentsLink = page.getByRole('link', { name: /^components$/i }).first();
    this.endpointLink = page.getByRole('link', { name: /^endpoints?$/i }).first();
    this.reportsLink = page.getByRole('link', { name: /^reports$/i }).first();
    this.metricsLink = page.getByRole('link', { name: /^metrics$/i }).first();
    this.usersLink = page.getByRole('link', { name: /^users$/i }).first();
    this.calendarLink = page.getByRole('link', { name: /^calendar$/i }).first();
    this.questionnairesLink = page.getByRole('link', { name: /^questionnaires?$/i }).first();
    this.configurationLink = page.getByRole('link', { name: /^configuration$/i }).first();
    this.upgradeLink = page.getByRole('link', { name: /^upgrade$/i }).first();

    this.assetsSection = page.locator('aside [data-section="assets"], .sidebar-assets').first();
    this.engagementsSection = page.locator('aside [data-section="engagements"], .sidebar-engagements').first();
    this.findingsSection = page.locator('aside [data-section="findings"], .sidebar-findings').first();
    this.adminSection = page.locator('aside [data-section="admin"], .sidebar-admin').first();

    this.findingsLink = page.getByRole('link', { name: /findings/i }).first();
    this.engagementsLink = page.getByRole('link', { name: /engagements/i }).first();
    this.assetsLink = page.getByRole('link', { name: /assets/i }).first();
  }
}
