import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base.client';
import type { AssetDto } from '../models/asset.model';

export interface AssetListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: AssetDto[];
}

/**
 * DefectDojo v2 asset ("product") API client.
 *
 * The endpoint path was renamed from my originally-guessed `/products/` to
 * `/assets/` after fetching the live OpenAPI spec on 2026-10-20.
 *   GET    /api/v2/assets/         list
 *   POST   /api/v2/assets/         create (requires name, description, organization)
 *   GET    /api/v2/assets/{id}/    read
 *   PATCH  /api/v2/assets/{id}/    update
 *   DELETE /api/v2/assets/{id}/    delete
 *
 * Required create fields: `name`, `description`, `organization`.
 */
export class AssetApiClient extends BaseApiClient {
  protected readonly basePath = '/api/v2';

  constructor(http: APIRequestContext) {
    super(http);
  }

  list(headers: Record<string, string>, params?: { limit?: number; offset?: number }): Promise<AssetListResponse> {
    return this.get<AssetListResponse>('/assets/', { headers, params });
  }

  getOne(id: number, headers: Record<string, string>): Promise<AssetDto> {
    return this.get<AssetDto>(`/assets/${id}/`, { headers });
  }

  create(data: Partial<AssetDto>, headers: Record<string, string>): Promise<AssetDto> {
    return this.post<AssetDto>('/assets/', { headers, data });
  }

  update(id: number, data: Partial<AssetDto>, headers: Record<string, string>): Promise<AssetDto> {
    return this.patch<AssetDto>(`/assets/${id}/`, { headers, data });
  }

  deleteOne(id: number, headers: Record<string, string>): Promise<void> {
    return this.delete<void>(`/assets/${id}/`, { headers });
  }
}
