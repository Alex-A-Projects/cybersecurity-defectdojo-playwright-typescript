import { test, expect, Tags, featureTag } from '../../src/db/fixtures';

test.describe('DB – findings', () => {
  test(
    'DD-2100 | Finding round-trip via Engagement → Test bridge',
    { tag: [Tags.E2E, Tags.REGRESSION, featureTag('findings')] },
    async ({
      productFactory, engagementFactory, testFactory, findingFactory,
      productRepo, findingRepo,
    }) => {
      const product = await productFactory.create();
      const engagement = await engagementFactory.create(product.id);
      const test = await testFactory.create(engagement.id);

      const finding = await findingFactory.create({
        testId: test.id,
        title: `DB-Finding ${Date.now()}`,
        severity: 'High',
      });

      const fetched = await findingRepo.findById(finding.id);
      expect(fetched).toBeDefined();
      expect(fetched?.test_id).toBe(test.id);
      expect(fetched?.severity).toBe('High');

      // Cleanup: deleting the product cascades Engagement → Test → Finding via
      // ON DELETE CASCADE on each FK.
      await findingRepo.deleteById(finding.id);
      await productRepo.deleteById(product.id);
    },
  );

  test(
    'DD-2101 | Listing findings for an engagement includes ones created through Test',
    { tag: [Tags.REGRESSION, featureTag('findings')] },
    async ({
      productFactory, engagementFactory, testFactory, findingFactory, findingRepo, productRepo,
    }) => {
      const product = await productFactory.create();
      const engagement = await engagementFactory.create(product.id);
      const test = await testFactory.create(engagement.id);

      const f = await findingFactory.create({ testId: test.id });
      const list = await findingRepo.listForEngagement(engagement.id, 100);
      expect(list.some((x) => x.id === f.id)).toBe(true);

      // tests-db uses ON DELETE CASCADE; product deletion cleans up the chain.
      await findingRepo.deleteById(f.id);
      await productRepo.deleteById(product.id);
    },
  );

  test(
    'DD-2102 | dojo_finding lists for the product via product_id (JOIN through Test/Engagement)',
    { tag: [Tags.REGRESSION, featureTag('findings')] },
    async ({ productFactory, engagementFactory, testFactory, findingFactory, findingRepo, productRepo }) => {
      const product = await productFactory.create();
      const engagement = await engagementFactory.create(product.id);
      const test = await testFactory.create(engagement.id);
      const f = await findingFactory.create({ testId: test.id, title: `DB-Join ${Date.now()}` });

      const list = await findingRepo.listForProduct(product.id, 100);
      expect(list.some((x) => x.id === f.id)).toBe(true);

      await findingRepo.deleteById(f.id);
      await productRepo.deleteById(product.id);
    },
  );

  test(
    'DD-2103 | Severity CHECK constraint rejects an invalid value',
    { tag: [Tags.NEGATIVE, featureTag('findings')] },
    async ({ productFactory, engagementFactory, testFactory, productRepo, engagementRepo }) => {
      const product = await productFactory.create();
      const engagement = await engagementFactory.create(product.id);
      const test = await testFactory.create(engagement.id);

      const { withClient } = await import('../../src/db/clients/pool.client');
      let threw = false;
      try {
        await withClient((c) =>
          c.query(
            `INSERT INTO dojo_finding (title, severity, test_id) VALUES ($1, $2, $3)`,
            [`InvalidSev-${Date.now()}`, 'Galactic', test.id],
          ),
        );
      } catch {
        threw = true;
      }
      expect(threw).toBe(true);

      await productRepo.deleteById(product.id);
    },
  );
});
