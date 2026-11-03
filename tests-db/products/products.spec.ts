import { test, expect, Tags, featureTag } from '../../src/db/fixtures';

test.describe('DB – products', () => {
  test(
    'DD-2000 | Insert + read round-trip',
    { tag: [Tags.REGRESSION, featureTag('products')] },
    async ({ productFactory, productRepo }) => {
      const created = await productFactory.create();
      const fetched = await productRepo.findById(created.id);
      expect(fetched).toBeDefined();
      expect(fetched?.name).toBe(created.name);
      // node-postgres returns BIGINT columns as JavaScript strings (64-bit
      // safety). Comparing as string; coerce if you need numeric.
      expect(String(fetched?.prod_type_id)).toBe('1');  // seeded ProductType id
      await productRepo.deleteById(created.id);
    },
  );

  test(
    'DD-2001 | Insert with the same name twice violates UNIQUE',
    { tag: [Tags.NEGATIVE, Tags.BOUNDARY, featureTag('products')] },
    async ({ productFactory, productRepo }) => {
      const seed = await productFactory.create({ name: `DB-Dup ${Date.now()}` });
      await expect(productFactory.create({ name: seed.name })).rejects.toThrow();
      await productRepo.deleteById(seed.id);
    },
  );

  test(
    'DD-2002 | Product type lookup-or-insert is idempotent on name',
    { tag: [Tags.REGRESSION, featureTag('products')] },
    async ({ productTypeFactory }) => {
      const a = await productTypeFactory.create({ name: `DB-Type ${Date.now()}` });
      const b = await productTypeFactory.create({ name: a.name });
      // The schema UNIQUE on name + ON CONFLICT DO UPDATE means b.id === a.id.
      expect(b.id).toBe(a.id);
    },
  );
});
