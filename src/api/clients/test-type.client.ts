import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base.client';
import type { TestTypeDto } from '../models/test-type.model';

export interface TestTypeListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: TestTypeDto[];
}

/**
 * DefectDojo v2 test_types API client.
 *
 * The seeded sandbox ships with several test_types (Nuclei, Generic, etc.).
 * Use `findByName` to resolve a stable test_type id for `found_by` arrays.
 */
export class TestTypeApiClient extends BaseApiClient {
  protected readonly basePath = '/api/v2';

  constructor(http: APIRequestContext) {
    super(http);
  }

  list(headers: Record<string, string>, params?: { limit?: number; offset?: number; name?: string }): Promise<TestTypeListResponse> {
    return this.get<TestTypeListResponse>('/test_types/', { headers, params });
  }
}
