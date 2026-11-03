import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base.client';
import type { FindingDto } from '../models/finding.model';

export interface FindingListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FindingDto[];
}

export class FindingApiClient extends BaseApiClient {
  protected readonly basePath = '/api/v2';

  constructor(http: APIRequestContext) {
    super(http);
  }

  list(
    headers: Record<string, string>,
    params?: { limit?: number; offset?: number; test?: number; severity?: string },
  ): Promise<FindingListResponse> {
    return this.get<FindingListResponse>('/findings/', { headers, params });
  }

  getOne(id: number, headers: Record<string, string>): Promise<FindingDto> {
    return this.get<FindingDto>(`/findings/${id}/`, { headers });
  }

  create(data: Partial<FindingDto>, headers: Record<string, string>): Promise<FindingDto> {
    return this.post<FindingDto>('/findings/', { headers, data });
  }

  update(id: number, data: Partial<FindingDto>, headers: Record<string, string>): Promise<FindingDto> {
    return this.patch<FindingDto>(`/findings/${id}/`, { headers, data });
  }

  deleteOne(id: number, headers: Record<string, string>): Promise<void> {
    return this.delete<void>(`/findings/${id}/`, { headers });
  }
}
