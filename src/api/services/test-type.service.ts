import { TestTypeApiClient } from '../clients/test-type.client';
import type { TestTypeDto } from '../models/test-type.model';

export class TestTypeService {
  constructor(
    private readonly client: TestTypeApiClient,
    private readonly headers: Record<string, string>,
  ) {}

  async list(opts: { limit?: number; name?: string } = {}): Promise<TestTypeDto[]> {
    const resp = await this.client.list(this.headers, {
      limit: opts.limit ?? 25,
      name: opts.name,
    });
    return resp.results;
  }

  /** Resolve a test_type id by its name; returns undefined if no row matches. */
  async findIdByName(name: string): Promise<number | undefined> {
    const rows = await this.list({ name });
    return rows[0]?.id;
  }
}
