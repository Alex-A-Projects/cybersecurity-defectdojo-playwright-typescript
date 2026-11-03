import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base.client';
import type { TestDto } from '../models/test.model';

export interface TestListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TestDto[];
}

/**
 * DefectDojo v2 tests API client.
 *
 * DefectDojo's Finding-creation flow goes through Test → Engagement → Product,
 * so creating a Finding requires a Test id (TestService creates one).
 */
export class TestApiClient extends BaseApiClient {
  protected readonly basePath = '/api/v2';

  constructor(http: APIRequestContext) {
    super(http);
  }

  create(data: Partial<TestDto>, headers: Record<string, string>): Promise<TestDto> {
    return this.post<TestDto>('/tests/', { headers, data });
  }

  list(headers: Record<string, string>, params?: { limit?: number; engagement?: number }): Promise<TestListResponse> {
    return this.get<TestListResponse>('/tests/', { headers, params });
  }

  getOne(id: number, headers: Record<string, string>): Promise<TestDto> {
    return this.get<TestDto>(`/tests/${id}/`, { headers });
  }
}
