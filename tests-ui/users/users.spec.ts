import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';

test.describe('Users – list', () => {
  test(
    'DD-400 | User list renders',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('users')] },
    async ({ pages, loggedInSession }) => {
      await pages.userList.goto();
      await pages.userList.waitForReady();
      await expect(pages.userList.toolbar).toBeVisible();
    },
  );

  test(
    'DD-401 | User list contains the test user',
    { tag: [Tags.SANITY, featureTag('users')] },
    async ({ pages, loggedInSession }) => {
      await pages.userList.goto();
      const admin = pages.userList.userRows.filter({ hasText: process.env.TEST_USER ?? 'admin' }).first();
      await expect(admin).toBeVisible();
    },
  );
});
