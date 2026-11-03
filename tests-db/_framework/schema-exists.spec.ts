/**
 * DB suite framework-level smoke. Verifies the seeded Postgres container exposes
 * the four primary tables DefectDojo needs and that the severity CHECK on
 * `dojo_finding` is in place.
 *
 * Tagged `@infra` so it runs regardless of feature flags. Requires the
 * seeded schema (tests-db/fixtures/seed/initdb.sql); see README §3.
 */
import { test, expect, Tags } from '../../src/db/fixtures';
import { query } from '../../src/db/clients/pool.client';

test('DB smoke | dojo_product table exists', { tag: [Tags.INFRA, Tags.SMOKE] }, async () => {
  const rows = await query<{ count: string }>(
    `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dojo_product'`,
  );
  expect(rows[0].count).toBe('1');
});

test('DB smoke | dojo_engagement table exists', { tag: [Tags.INFRA, Tags.SMOKE] }, async () => {
  const rows = await query<{ count: string }>(
    `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dojo_engagement'`,
  );
  expect(rows[0].count).toBe('1');
});

test('DB smoke | dojo_finding table exists', { tag: [Tags.INFRA, Tags.SMOKE] }, async () => {
  const rows = await query<{ count: string }>(
    `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'dojo_finding'`,
  );
  expect(rows[0].count).toBe('1');
});

test('DB smoke | auth_user table exists', { tag: [Tags.INFRA, Tags.SMOKE] }, async () => {
  const rows = await query<{ count: string }>(
    `SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'auth_user'`,
  );
  expect(rows[0].count).toBe('1');
});

test('DB smoke | dojo_finding.severity CHECK constraint is present',
  { tag: [Tags.INFRA, Tags.SMOKE] },
  async () => {
    const rows = await query<{ conname: string }>(
      `SELECT conname FROM pg_constraint
        WHERE contype = 'c' AND conrelid = 'dojo_finding'::regclass
          AND pg_get_constraintdef(oid) ILIKE '%severity%'`,
    );
    expect(rows.length).toBeGreaterThanOrEqual(1);
  },
);

test('DB smoke | seeded reference rows are present', { tag: [Tags.INFRA, Tags.SMOKE] }, async () => {
  const types = await query<{ count: string }>(
    `SELECT COUNT(*) FROM dojo_product_type WHERE name = 'Other'`,
  );
  const slas = await query<{ count: string }>(
    `SELECT COUNT(*) FROM dojo_sla_configuration WHERE name = 'Default SLA'`,
  );
  const users = await query<{ count: string }>(
    `SELECT COUNT(*) FROM auth_user WHERE username = 'admin'`,
  );
  expect(Number(types[0].count)).toBeGreaterThanOrEqual(1);
  expect(Number(slas[0].count)).toBeGreaterThanOrEqual(1);
  expect(Number(users[0].count)).toBeGreaterThanOrEqual(1);
});
