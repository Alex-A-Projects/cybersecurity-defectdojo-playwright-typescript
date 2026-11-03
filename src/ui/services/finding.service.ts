import type { Page } from '@playwright/test';
import { FindingListPage } from '../pages/finding-list.page';
import { uniqueFindingTitle } from '../../shared/generators';
import type { FindingModel } from '../models/finding.model';

/**
 * FindingService — UI-driven finding CRUD setup helpers.
 *
 * Strict layering rule: only imports from ../models and ../pages.
 */
export class FindingService {
  constructor(private readonly page: Page) {}

  async createFinding(overrides: Partial<FindingModel> = {}): Promise<FindingModel> {
    const list = new FindingListPage(this.page);
    await list.goto();

    await list.addFindingButton.click();
    await this.page.waitForURL(/\/finding\/add/);

    const finding: FindingModel = {
      title: overrides.title ?? uniqueFindingTitle('ui'),
      description: overrides.description ?? 'Auto-generated finding for UI tests.',
      severity: overrides.severity ?? 'Medium',
      status: overrides.status ?? 'Active',
      ...overrides,
    };

    await this.page.getByLabel(/^title$/i).fill(finding.title);
    await this.page.getByLabel(/description/i).fill(finding.description);
    await this.page.getByLabel(/severity/i).selectOption({ label: finding.severity });
    await this.page.getByLabel(/status/i).first().selectOption({ label: finding.status });

    await this.page.getByRole('button', { name: /submit|create|add/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
    return finding;
  }
}
