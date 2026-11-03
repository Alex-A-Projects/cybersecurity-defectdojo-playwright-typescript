/**
 * UI suite — Product detail page.
 *
 * Asserts the read-only product detail. CRUD is exercised through
 * `tests-ui/products/products.spec.ts`.
 */
import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';
import { uniqueProductName } from '../../src/shared/generators';

test.describe('Products – detail', () => {
  test.fixme(
    'DD-220 | New product detail page renders title, type, and edit/delete controls',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('products')] },
    async ({ pages, loggedInSession, productService }) => {
      // TODO(confirm): depends on DD-201's create flow; see products.spec.ts
      // for why the create control is not yet locatable.
      //
      const product = await productService.createProduct({
        name: uniqueProductName('ui'),
      });

      // Navigate to the product list, then click the row to reach the detail page.
      await pages.productList.goto();
      const row = pages.productList.rowByName(product.name);
      await row.click();

      await expect(pages.productDetail.title).toBeVisible();
      await expect(pages.productDetail.editButton).toBeAttached();
      await expect(pages.productDetail.deleteButton).toBeAttached();
    },
  );
});
