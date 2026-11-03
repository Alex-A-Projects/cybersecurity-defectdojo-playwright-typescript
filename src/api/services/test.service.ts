import { TestApiClient } from '../clients/test.client';
import type { TestDto } from '../models/test.model';

/**
 * Test service — wraps the tests API client with sane defaults.
 *
 * DefectDojo's TestRequest.required is [engagement, target_start, target_end,
 * test_type]. `create()` only asks the caller for the two user-facing inputs
 * (engagement id + test_type id); the rest default to today / +14d / no title.
 */
export class TestService {
  constructor(
    private readonly client: TestApiClient,
    private readonly headers: Record<string, string>,
  ) {}

  async create(
    engagementId: number,
    testTypeId: number,
    overrides: Partial<TestDto> = {},
  ): Promise<TestDto> {
    const today = new Date().toISOString().slice(0, 10);
    const twoWeeksOut = new Date(Date.now() + 14 * 86400_000).toISOString().slice(0, 10);

    return this.client.create(
      {
        engagement: engagementId,
        test_type: testTypeId,
        target_start: overrides.target_start ?? today,
        target_end: overrides.target_end ?? twoWeeksOut,
        ...overrides,
      },
      this.headers,
    );
  }

  async getById(id: number): Promise<TestDto> {
    return this.client.getOne(id, this.headers);
  }
}
