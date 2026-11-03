import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';

test.describe('Products – list & create', () => {
  test(
    'DD-200 | Product list renders the toolbar',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('products')] },
    async ({ pages, loggedInSession }) => {
      await pages.productList.goto();
      await pages.productList.waitForReady();
      await expect(pages.productList.toolbar).toBeVisible();
    },
  );

  test.fixme(
    'DD-201 | New product appears in the list after create',
    { tag: [Tags.E2E, Tags.REGRESSION, featureTag('products')] },
    async ({ pages, loggedInSession, productService }) => {
      // TODO(confirm): the "Add Product" control lives inside the collapsed
      // "Asset Options" dropdown on /asset, so its accessible name is not in
      // the page snapshot. Needs either (a) the dropdown expanded first, or
      // (b) a confirmed direct-URL for the create route, before this can
      // be un-marked.
      //
      const product = await productService.createProduct({
        name: `UI-Test Product ${Date.now()}`,
        description: 'Created by the framework smoke test.',
      });

      await pages.productList.goto();
      const row = pages.productList.rowByName(product.name);
      await expect(row).toBeVisible();
    },
  );
});
