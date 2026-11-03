import { test, expect, Tags, featureTag } from '../../src/db/fixtures';
import { query } from '../../src/db/clients/pool.client';
import { withClient } from '../../src/db/clients/pool.client';

test.describe('DB – schema constraints', () => {
  test(
    'DD-2200 | NOT NULL on dojo_finding.title is enforced',
    { tag: [Tags.NEGATIVE, featureTag('findings')] },
    async ({ productFactory, engagementFactory, testFactory, productRepo }) => {
      const product = await productFactory.create();
      const engagement = await engagementFactory.create(product.id);
      const test = await testFactory.create(engagement.id);

      let threw = false;
      try {
        await withClient((c) =>
          c.query(
            `INSERT INTO dojo_finding (severity, test_id) VALUES ($1, $2)`,
            ['Medium', test.id],
          ),
        );
      } catch {
        threw = true;
      }
      expect(threw).toBe(true);
      await productRepo.deleteById(product.id);
    },
  );

  test(
    'DD-2201 | FK on dojo_engagement.product_id rejects an unknown product',
    { tag: [Tags.NEGATIVE, featureTag('engagements')] },
    async () => {
      let threw = false;
      try {
        await withClient((c) =>
          c.query(
            `INSERT INTO dojo_engagement (name, product_id, target_start, target_end, status)
             VALUES ($1, $2, $3, $4, $5)`,
            [`FK-${Date.now()}`, -1, '2026-01-01', '2026-01-15', 'In Progress'],
          ),
        );
      } catch {
        threw = true;
      }
      expect(threw).toBe(true);
    },
  );

  test(
    'DD-2202 | dojo_finding severity CHECK rejects "InvalidSev"',
    { tag: [Tags.NEGATIVE, featureTag('findings')] },
    async ({ productFactory, engagementFactory, testFactory, productRepo }) => {
      const product = await productFactory.create();
      const engagement = await engagementFactory.create(product.id);
      const test = await testFactory.create(engagement.id);

      let threw = false;
      try {
        await withClient((c) =>
          c.query(
            `INSERT INTO dojo_finding (title, severity, test_id) VALUES ($1, $2, $3)`,
            [`CHK-${Date.now()}`, 'InvalidSev', test.id],
          ),
        );
      } catch {
        threw = true;
      }
      expect(threw).toBe(true);
      await productRepo.deleteById(product.id);
    },
  );

  test(
    'DD-2203 | pg_constraint lists at least one severity CHECK on dojo_finding',
    { tag: [Tags.REGRESSION, featureTag('findings')] },
    async () => {
      const rows = await query<{ conname: string }>(
        `SELECT conname FROM pg_constraint
          WHERE contype = 'c' AND conrelid = 'dojo_finding'::regclass
            AND pg_get_constraintdef(oid) ILIKE '%severity%'`,
      );
      expect(rows.length).toBeGreaterThanOrEqual(1);
    },
  );
});
