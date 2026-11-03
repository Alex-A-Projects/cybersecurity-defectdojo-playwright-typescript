import { queryOne } from '../clients/pool.client';
import type { TestRow } from '../models/test.model';

/**
 * Test factory — inserts a row into `dojo_test`, the bridge between
 * Engagement and Finding. Defaults to test_type_id=1 (the 'Generic'
 * TestType seeded by initdb.sql).
 */
export class TestFactory {
  async create(
    engagementId: number,
    overrides: Partial<TestRow> & { test_type_id?: number } = {},
  ): Promise<TestRow> {
    const today = new Date().toISOString().slice(0, 10);
    const twoWeeksOut = new Date(Date.now() + 14 * 86400_000).toISOString().slice(0, 10);

    const row = await queryOne<TestRow>(
      `INSERT INTO dojo_test (engagement_id, test_type_id, target_start, target_end)
       VALUES ($1, $2, $3, $4)
       RETURNING id, engagement_id, test_type_id,
                 to_char(target_start, 'YYYY-MM-DD') AS target_start,
                 to_char(target_end,   'YYYY-MM-DD') AS target_end,
                 created::text, updated::text`,
      [
        engagementId,
        overrides.test_type_id ?? 1,
        overrides.target_start ?? today,
        overrides.target_end ?? twoWeeksOut,
      ],
    );
    if (!row) throw new Error('TestFactory.create() returned no row');
    return row;
  }
}
