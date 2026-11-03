import { test, expect, Tags, featureTag } from '../../src/api/fixtures';

test.describe('Findings – CRUD via API', () => {
  test(
    'DD-1300 | Creating a finding requires a product (chain: product → engagement → test → finding)',
    { tag: [Tags.E2E, Tags.REGRESSION, featureTag('findings')] },
    async ({ apiProduct, apiEngagement, apiTestType, apiTest, apiFinding }) => {
      // Full DefectDojo chain: find a test_type id (DefectDojo seeds several),
      // create product → engagement → test, then create finding on the test.
      const testTypes = await apiTestType.list({ limit: 5 });
      const testTypeId = testTypes[0]?.id ?? 1;
      const foundBy = [testTypeId];

      const product = await apiProduct.create({ name: `APIF-Product ${Date.now()}` });
      const engagement = await apiEngagement.create(product.id, { name: `APIF-Eng ${Date.now()}` });
      const test = await apiTest.create(engagement.id, testTypeId);

      const finding = await apiFinding.create({
        testId: test.id,
        foundBy,
        title: `APIF-Finding ${Date.now()}`,
        severity: 'High',
      });

      expect(finding.id).toBeGreaterThan(0);
      expect(finding.severity).toBe('High');

      const updated = await apiFinding.update(finding.id, { verified: true });
      expect(updated.verified).toBe(true);

      // Cleanup in reverse order.
      await apiFinding.delete(finding.id);
      await apiEngagement.delete(engagement.id);
      await apiProduct.delete(product.id);
    },
  );

  test(
    'DD-1301 | Listing findings includes the one we just created',
    { tag: [Tags.REGRESSION, featureTag('findings')] },
    async ({ apiProduct, apiEngagement, apiTestType, apiTest, apiFinding }) => {
      const testTypes = await apiTestType.list({ limit: 5 });
      const testTypeId = testTypes[0]?.id ?? 1;

      const product = await apiProduct.create({ name: `APIF-List ${Date.now()}` });
      const engagement = await apiEngagement.create(product.id, { name: `APIF-ListEng ${Date.now()}` });
      const test = await apiTest.create(engagement.id, testTypeId);

      const f = await apiFinding.create({
        testId: test.id,
        foundBy: [testTypeId],
        title: `APIF-L ${Date.now()}`,
      });

      // Scope to this test_id so we don't have to paginate.
      const list = await apiFinding.list({ test: test.id, limit: 100 });
      expect(list.some((x) => x.id === f.id)).toBe(true);

      await apiFinding.delete(f.id);
      await apiEngagement.delete(engagement.id);
      await apiProduct.delete(product.id);
    },
  );
});
