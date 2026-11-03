import { queryOne } from '../clients/pool.client';
import type { TestTypeRow } from '../models/test-type.model';

/**
 * TestType factory — inserts a row into `dojo_test_type`. The model is
 * intentionally minimal; DefectDojo's Test_Type has more fields but the
 * only one we need to exercise is `name`.
 */
export class TestTypeFactory {
  async create(overrides: Partial<TestTypeRow> = {}): Promise<TestTypeRow> {
    const name = overrides.name ?? `Test Type ${Date.now()}`;
    const row = await queryOne<TestTypeRow>(
      `INSERT INTO dojo_test_type (name)
       VALUES ($1)
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, name, created::text, updated::text`,
      [name],
    );
    if (!row) throw new Error('TestTypeFactory.create() returned no row');
    return row;
  }
}
