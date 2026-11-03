import type { Locator, Page } from '@playwright/test';

export type SeverityLevel = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

/**
 * Severity badge — a coloured pill rendered next to each finding row and on
 * the finding detail page. DefectDojo uses Bootstrap badges with severity
 * classes (`severity-Critical`, `severity-High`, etc.).
 */
export class SeverityBadgeComponent {
  readonly root: Locator;

  constructor(private readonly page: Page, level?: SeverityLevel) {
    if (level) {
      this.root = page.locator(`.severity-${level.toLowerCase()}, .severity.${level.toLowerCase()}, [class*="severity-${level}"]`).first();
    } else {
      this.root = page.locator('.severity, .severity-badge, [class*="severity-"]').first();
    }
  }

  async text(): Promise<string> {
    return (await this.root.textContent()) ?? '';
  }
}
