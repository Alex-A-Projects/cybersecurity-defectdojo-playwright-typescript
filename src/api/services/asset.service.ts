import { AssetApiClient } from '../clients/asset.client';
import type { AssetDto, BusinessCriticality } from '../models/asset.model';
import { uniqueProductName } from '../../shared/generators';

/**
 * Asset service — wraps the asset ("product") API client with defaults that
 * satisfy the v2 schema's POST requirements: `name`, `description`, `organization`.
 *
 * NOTE: DefectDojo v2 calls products → assets. The canonical location is now
 * `src/api/clients/asset.client.ts` + `src/api/services/asset.service.ts`. The
 * `src/api/services/product.service.ts` file is a thin re-export kept for
 * backward compat with specs that imported `ProductService` before the rename.
 */
export class AssetService {
  constructor(
    private readonly client: AssetApiClient,
    private readonly headers: Record<string, string>,
  ) {}

  async list(limit = 25): Promise<AssetDto[]> {
    const resp = await this.client.list(this.headers, { limit });
    return resp.results;
  }

  /**
   * `organization` is required by the schema. Defaulted to `1` which is
   * the seed organization id on the demo sandbox. Override for clean envs.
   */
  async create(overrides: Partial<AssetDto> & { organization?: number } = {}): Promise<AssetDto> {
    const payload: Partial<AssetDto> = {
      name: overrides.name ?? uniqueProductName('api'),
      description: overrides.description ?? 'Auto-generated via API service.',
      organization: overrides.organization ?? 1,
      business_criticality: (overrides.business_criticality ?? 'medium') as BusinessCriticality,
      ...overrides,
    };
    return this.client.create(payload, this.headers);
  }

  async getById(id: number): Promise<AssetDto> {
    return this.client.getOne(id, this.headers);
  }

  async update(id: number, patch: Partial<AssetDto>): Promise<AssetDto> {
    return this.client.update(id, patch, this.headers);
  }

  async delete(id: number): Promise<void> {
    await this.client.deleteOne(id, this.headers);
  }
}
