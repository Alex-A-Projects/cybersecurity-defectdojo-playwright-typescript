import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base.client';
import type { EngagementDto } from '../models/engagement.model';

export interface EngagementListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EngagementDto[];
}

export class EngagementApiClient extends BaseApiClient {
  protected readonly basePath = '/api/v2';

  constructor(http: APIRequestContext) {
    super(http);
  }

  /**
   * List engagements with optional filters. DefectDojo's engagements list
   * endpoint supports a `product` query param (and many others — see the
   * OpenAPI spec). Passing a productId scopes the list to engagements on
   * that product, avoiding pagination issues.
   */
  list(
    headers: Record<string, string>,
    params?: { limit?: number; offset?: number; product?: number; status?: string },
  ): Promise<EngagementListResponse> {
    return this.get<EngagementListResponse>('/engagements/', { headers, params });
  }

  getOne(id: number, headers: Record<string, string>): Promise<EngagementDto> {
    return this.get<EngagementDto>(`/engagements/${id}/`, { headers });
  }

  create(data: Partial<EngagementDto>, headers: Record<string, string>): Promise<EngagementDto> {
    return this.post<EngagementDto>('/engagements/', { headers, data });
  }

  update(id: number, data: Partial<EngagementDto>, headers: Record<string, string>): Promise<EngagementDto> {
    return this.patch<EngagementDto>(`/engagements/${id}/`, { headers, data });
  }

  deleteOne(id: number, headers: Record<string, string>): Promise<void> {
    return this.delete<void>(`/engagements/${id}/`, { headers });
  }
}
