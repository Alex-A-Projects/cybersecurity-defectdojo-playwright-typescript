# Quality rules (UI suite)

## Strict (compiler-enforced where possible)

- `tsconfig.json` has `strict: true`; `npm run typecheck` must pass with zero errors.
- POMs / Components / Services have zero `expect(...)` calls.
- Tests import `test` / `expect` from the suite's fixtures barrel, never `@playwright/test`.
- Test titles prefix `DD-####`.
- All non-framework tests carry `@feature:*`.

## Strict (enforced by tooling or review)

- No `test.only` (`forbidOnly: true` on CI).
- No `waitForTimeout` / `sleep` — web-first assertions or `waitForResponse`.
- No hardcoded credentials in committed code.
- No locator strings duplicating product copy.

## Conventions

- File names: kebab-case + layer suffix (`login.page.ts`, `header.component.ts`, `product.service.ts`).
- POM extends `BasePage` (`src/ui/pages/base.page.ts`).
- Component instances are composed in the POM constructor; not re-constructed in tests.
- Service providers are in fixtures; tests consume them as fixtures (`{ productService }`), not via `new`.

## Severity model (defects raised by `skill-code-review`)

| Severity | Example |
|---|---|
| CRITICAL | Locator-only logic in spec, assertion in POM, secret in code |
| MAJOR | Layer violation, fixture order wrong, missing feature tag |
| MINOR | Naming drift, missing `TODO(confirm):` on an exotic selector |
