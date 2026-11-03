# Page Object layer — DefectDojo

## Principles

- One Page Object per logical page (`/login`, `/product/list`, `/finding/detail`).
- Locators as readonly class properties; initialize in the constructor only.
- Methods are user-intent ("login", "filterBySeverity", "selectFinding"), not UI mechanics.
- Zero assertions.
- Composed of Components when a UI element appears on multiple pages (Header, FilterBar).

## Locator priority

1. `page.getByRole('button' | 'link' | 'heading' | 'tab', { name: ... })`
2. `page.getByLabel('Field name')`
3. `page.getByText(/.../i)`
4. `page.getByPlaceholder(/.../i)`
5. CSS / XPath — last resort; tag with `TODO(confirm):` if you reach for it.

## Example — LoginPage

```ts
import type { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';

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
    this.submitButton = page.getByRole('button', { name: /sign in/i });
    this.errorMessage = page.locator('.alert-danger, [role="alert"]').first();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }
}
```

## Methods — return types

- `void` — same page.
- `Promise<NextPage>` — navigates forward; consumer can chain.
- A primitive data type — pure read.

## Composing Components

```ts
// header.component.ts
export class HeaderComponent {
  readonly userMenu: Locator;
  readonly logoutLink: Locator;
  constructor(private readonly page: Page) { /* ... */ }
  async logout(): Promise<void> { /* ... */ }
}

// product-list.page.ts
export class ProductListPage extends BasePage {
  readonly header: HeaderComponent;
  // ...
  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
  }
}
```

## Anti-patterns

- ❌ `expect(locator).toBeVisible()` inside a POM.
- ❌ Locator strings that include product-specific copy ("Add Product" — rebrand risk).
- ❌ Returning raw locators (`getRow()` from outside); expose methods.
- ❌ Mixing Page and Component responsibilities.
