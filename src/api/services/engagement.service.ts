import { EngagementApiClient } from '../clients/engagement.client';
import type { EngagementDto } from '../models/engagement.model';
import { uniqueEngagementName } from '../../shared/generators';

export class EngagementService {
  constructor(
    private readonly client: EngagementApiClient,
    private readonly headers: Record<string, string>,
  ) {}

  /**
   * List engagements, optionally filtered by product and/or status. Pass
   * `product` to scope to one asset's engagements (avoids pagination skew
   * where the engagement you want is on a later page).
   */
  async list(opts: { limit?: number; product?: number; status?: string } = {}): Promise<EngagementDto[]> {
    const resp = await this.client.list(this.headers, {
      limit: opts.limit ?? 25,
      product: opts.product,
      status: opts.status,
    });
    return resp.results;
  }

  async create(productId: number, overrides: Partial<EngagementDto> = {}): Promise<EngagementDto> {
    const today = new Date().toISOString().slice(0, 10);
    const twoWeeksOut = new Date(Date.now() + 14 * 86400_000).toISOString().slice(0, 10);

    return this.client.create(
      {
        name: overrides.name ?? uniqueEngagementName('api'),
        description: overrides.description ?? 'Auto-generated via API service.',
        product: productId,
        target_start: overrides.target_start ?? today,
        target_end: overrides.target_end ?? twoWeeksOut,
        // DefectDojo Engagement.status uses Title-Case values per the
        // v2 OpenAPI spec (e.g. "In Progress", "Not Started"). Lowercase
        // / snake_case forms are rejected by the API with 400 invalid_choice.
        status: overrides.status ?? 'In Progress',
        ...overrides,
      },
      this.headers,
    );
  }

  async getById(id: number): Promise<EngagementDto> {
    return this.client.getOne(id, this.headers);
  }

  async update(id: number, patch: Partial<EngagementDto>): Promise<EngagementDto> {
    return this.client.update(id, patch, this.headers);
  }

  async delete(id: number): Promise<void> {
    await this.client.deleteOne(id, this.headers);
  }
}
