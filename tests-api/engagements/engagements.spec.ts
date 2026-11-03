import { test, expect, Tags, featureTag } from '../../src/api/fixtures';

test.describe('Engagements – CRUD via API', () => {
  test(
    'DD-1200 | Engagement round-trip',
    { tag: [Tags.E2E, Tags.REGRESSION, featureTag('engagements')] },
    async ({ apiProduct, apiEngagement }) => {
      const product = await apiProduct.create({
        name: `APIE-Product ${Date.now()}`,
      });
      const eng = await apiEngagement.create(product.id, { name: `APIE-Eng ${Date.now()}` });
      expect(eng.product).toBe(product.id);
      // DefectDojo Engagement.status is Title-Case per the v2 OpenAPI spec.
      expect(eng.status).toBe('In Progress');

      await apiEngagement.delete(eng.id);
      await apiProduct.delete(product.id);
    },
  );

  test(
    'DD-1201 | Listing engagements for a product returns the ones we created',
    { tag: [Tags.REGRESSION, featureTag('engagements')] },
    async ({ apiProduct, apiEngagement }) => {
      const product = await apiProduct.create({ name: `APIE-List ${Date.now()}` });
      const created = await apiEngagement.create(product.id, { name: `APIE-ListEng ${Date.now()}` });
      // Scope to this product so we don't have to paginate.
      const list = await apiEngagement.list({ product: product.id });
      expect(list.some((e) => e.id === created.id)).toBe(true);
      expect(list.find((e) => e.id === created.id)?.product).toBe(product.id);
      // Clean up.
      await apiEngagement.delete(created.id);
      await apiProduct.delete(product.id);
    },
  );
});
