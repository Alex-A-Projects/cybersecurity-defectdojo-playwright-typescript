import type { Page } from '@playwright/test';
import { EngagementListPage } from '../pages/engagement-list.page';
import { uniqueEngagementName } from '../../shared/generators';
import type { EngagementModel } from '../models/engagement.model';

/**
 * EngagementService — UI-driven engagement CRUD setup helpers.
 * Strict layering rule: only imports from ../models and ../pages.
 */
export class EngagementService {
  constructor(private readonly page: Page) {}

  async createEngagement(overrides: Partial<EngagementModel> = {}): Promise<EngagementModel> {
    const list = new EngagementListPage(this.page);
    await list.goto();

    // Engagements are nested under products in DefectDojo: choose product first.
    await this.page.getByRole('link', { name: /add engagement/i }).first().click();
    await this.page.waitForURL(/\/engagement\/add/);

    const engagement: EngagementModel = {
      name: overrides.name ?? uniqueEngagementName('ui'),
      product: overrides.product ?? 'Generic Product Type', // overridden per test
      targetStart: overrides.targetStart ?? new Date().toISOString().slice(0, 10),
      targetEnd: overrides.targetEnd ?? new Date(Date.now() + 14 * 86400_000).toISOString().slice(0, 10),
      status: overrides.status ?? 'In Progress',
      ...overrides,
    };

    await this.page.getByLabel(/^name$/i).fill(engagement.name);
    await this.page.getByLabel(/product/i).first().selectOption({ label: engagement.product });
    await this.page.getByLabel(/target start|start date/i).fill(engagement.targetStart);
    await this.page.getByLabel(/target end|end date/i).fill(engagement.targetEnd);

    await this.page.getByRole('button', { name: /submit|create|add/i }).first().click();
    await this.page.waitForLoadState('domcontentloaded');
    return engagement;
  }
}
