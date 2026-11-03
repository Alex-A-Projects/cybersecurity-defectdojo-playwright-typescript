import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

/**
 * AuthService — orchestrates the login + logout flows through POMs.
 *
 * Returned values are typed data the spec can assert on; assertions live in
 * the spec layer, not here.
 */
export class AuthService {
  constructor(private readonly page: Page) {}

  async login(username: string, password: string): Promise<void> {
    const loginPage = new LoginPage(this.page);
    await loginPage.goto();
    await loginPage.login(username, password);
  }

  async loginAndReachDashboard(username: string, password: string): Promise<void> {
    await this.login(username, password);
  }

  /** DefectDojo session lives in cookies; clear them to log out. */
  async logout(): Promise<void> {
    await this.page.context().clearCookies();
  }
}
