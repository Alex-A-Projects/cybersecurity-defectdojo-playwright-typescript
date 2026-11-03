import { test, expect, Tags, featureTag } from '../../src/api/fixtures';

test.describe('Products – CRUD via API', () => {
  test(
    'DD-1100 | GET /products/ returns a paginated list',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('products')] },
    async ({ apiProduct, apiAuthorization }) => {
      const products = await apiProduct.list(5);
      expect(Array.isArray(products)).toBe(true);
    },
  );

  test(
    'DD-1101 | POST + GET + PATCH + DELETE cycle',
    { tag: [Tags.E2E, Tags.REGRESSION, featureTag('products')] },
    async ({ apiProduct }) => {
      const created = await apiProduct.create({ name: `API-Smoke ${Date.now()}` });
      expect(created.id).toBeGreaterThan(0);

      const fetched = await apiProduct.getById(created.id);
      expect(fetched.name).toBe(created.name);

      const updated = await apiProduct.update(created.id, { description: 'Updated by smoke' });
      expect(updated.id).toBe(created.id);

      await apiProduct.delete(created.id);
      await expect(apiProduct.getById(created.id)).rejects.toThrow();
    },
  );

  test(
    'DD-1102 | Creating with the same name twice surfaces a conflict (UNIQUE)',
    { tag: [Tags.NEGATIVE, Tags.BOUNDARY, featureTag('products')] },
    async ({ apiProduct }) => {
      const name = `API-Dup ${Date.now()}`;
      await apiProduct.create({ name });
      await expect(apiProduct.create({ name })).rejects.toThrow();
      // Clean up.
      const dup = await apiProduct.list(100).then((all) => all.find((p) => p.name === name));
      if (dup) await apiProduct.delete(dup.id);
    },
  );
});
