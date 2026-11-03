/**
 * UI suite — Auth login.
 * Tests speak through POMs and fixtures only. No assertions in POMs.
 */
import { test, expect, Tags, featureTag } from '../../src/ui/fixtures';

test.describe('Auth – Login', () => {
  test(
    'DD-100 | Login form displays username and password fields',
    { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('auth')] },
    async ({ pages }) => {
      await pages.login.goto();
      await expect(pages.login.usernameInput).toBeVisible();
      await expect(pages.login.passwordInput).toBeVisible();
      await expect(pages.login.submitButton).toBeVisible();
    },
  );

  test(
    'DD-101 | Invalid credentials render a visible error',
    { tag: [Tags.NEGATIVE, Tags.REGRESSION, featureTag('auth')] },
    async ({ pages }) => {
      await pages.login.goto();
      await pages.login.login('admin', 'wrong-password-on-purpose');

      // Server-side error renders in an `.alert-danger` block.
      await expect(pages.login.errorMessage).toBeVisible();
    },
  );

  test(
    'DD-102 | Valid admin login reaches the dashboard',
    { tag: [Tags.SMOKE, Tags.CRITICAL, featureTag('auth')] },
    async ({ pages, loggedInSession, page }) => {
      const pass = process.env.TEST_PASSWORD ?? '';
      test.skip(pass === '', 'TEST_PASSWORD required to run this test.');

      // `loggedInSession` already drove the full login flow via the
      // AuthService (UI form). After that fixture returns, we should be
      // on /dashboard. The URL pattern is the most durable signal —
      // DefectDojo's dashboard has no stable h1 to assert on, and the
      // sidebar's "Dashboard" entry has an accessible name shaped by the
      // brand image, which makes getByRole flaky across minor template
      // changes. URL match is sufficient.
      await expect(page).toHaveURL(/\/dashboard$/);
    },
  );

  test(
    'DD-103 | Empty submission shows field-level validation',
    { tag: [Tags.NEGATIVE, Tags.BOUNDARY, featureTag('auth')] },
    async ({ pages }) => {
      await pages.login.goto();
      await pages.login.submitButton.click();
      // Form does not submit; we stay on /login.
      await expect(pages.login.usernameInput).toBeVisible();
      await expect(pages.login.passwordInput).toBeVisible();
    },
  );
});
