import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

/**
 * /login — Django authentication form.
 *
 * DefectDojo login form renders username + password inputs with `<label>` text
 * "Username" / "Password", plus a "Sign In" submit button. CSRF token is
 * handled by Django automatically when the form is submitted as
 * `application/x-www-form-urlencoded` from the same origin — Playwright's
 * form submit picks this up.
 */
export class LoginPage extends BasePage {
  protected readonly path = '/login';

  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByLabel('Username');
    this.passwordInput = page.getByLabel('Password');
    // DefectDojo's login button reads "Login" (not "Sign In") on the demo
    // sandbox. Match either so the POM survives older + newer templates.
    this.submitButton = page.getByRole('button', { name: /login|sign in/i });
    // Error renders server-side as a Bootstrap alert.
    this.errorMessage = page.locator('.alert-danger, [role="alert"]').first();
  }

  /**
   * Submit the login form via the standard UI flow. Returns when the
   * post-submit navigation has settled (either to dashboard or back to login
   * with an error).
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async loginExpectingError(username: string, password: string): Promise<void> {
    await this.login(username, password);
  }

  /** Convenience used by header "Log out" test assertions. */
  async logout(): Promise<void> {
    // DefectDojo's top-bar logout is a POST to /logout; the header Component
    // owns that link. Page objects own their own interactions; the header
    // component is composed in.
  }
}
