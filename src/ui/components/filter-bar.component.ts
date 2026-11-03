import type { Locator, Page } from '@playwright/test';

/**
 * Filter bar above the finding list. DefectDojo exposes severity, status,
 * product, engagement, and "CWE" filters as a Bootstrap-styled form.
 */
export class FilterBarComponent {
  readonly root: Locator;
  readonly severitySelect: Locator;
  readonly statusSelect: Locator;
  readonly productSelect: Locator;
  readonly searchInput: Locator;
  readonly applyButton: Locator;
  readonly clearButton: Locator;

  constructor(private readonly page: Page) {
    // Verified 2026-10-21: DefectDojo's filter affordance is a button labelled
    // "Filters" (or "show-filters" on the findings view), not a styled form.
    this.root = page.getByRole('button', { name: /^filters$|show-filters/i }).first();
    this.severitySelect = page.getByLabel(/severity/i).first();
    this.statusSelect = page.getByLabel(/status/i).first();
    this.productSelect = page.getByLabel(/product/i).first();
    this.searchInput = page.getByRole('searchbox').first();
    this.applyButton = page.getByRole('button', { name: /apply|filter/i }).first();
    this.clearButton = page.getByRole('button', { name: /clear|reset/i }).first();
  }

  async filterBySeverity(severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'): Promise<void> {
    await this.severitySelect.selectOption({ label: severity });
    await this.applyButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async filterByStatus(status: 'Active' | 'Verified' | 'False Positive' | 'Closed'): Promise<void> {
    await this.statusSelect.selectOption({ label: status });
    await this.applyButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async clear(): Promise<void> {
    await this.clearButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
