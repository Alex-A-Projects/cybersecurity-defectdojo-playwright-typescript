# Test layer — Writing specs

## Structure (AAA)

- **Arrange** — set up data, navigate.
- **Act** — perform the action.
- **Assert** — verify the outcome.

## Rules

- One behaviour per test.
- No locators, no API calls, no business logic.
- Import `test`, `expect`, `Tags`, `featureTag` from `src/ui/fixtures`.
- Tag every test with at least one suite tag (`Tags.SMOKE`, `Tags.REGRESSION`, etc.).
- Tag every test touching a feature with `featureTag('<name>')`.

## Ticket prefix

Every test title starts with `DD-#### | <action>`:

```ts
test('DD-100 | Login form displays username and password fields',
  { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('auth')] },
  async ({ pages }) => {
    await pages.login.goto();
    await expect(pages.login.usernameInput).toBeVisible();
    await expect(pages.login.passwordInput).toBeVisible();
    await expect(pages.login.submitButton).toBeVisible();
  },
);
```

## Multiple independent checks

When a test verifies several independent facts:

```ts
const failures: string[] = [];
await collect('a', () => expect(a).toBeVisible(), failures);
await collect('b', () => expect(b).toBeVisible(), failures);
expect(failures, `Missing: ${failures.join(', ')}`).toEqual([]);
```

(Helper lives at `src/shared/assertion-collector.ts`.)

## Anti-patterns

- ❌ `test.only` in committed code.
- ❌ Inline `@smoke` strings — use `Tags.SMOKE` (catches typos at compile time).
- ❌ Hardcoded test data — use `uniqueId('ui')` (or appropriate prefix).
- ❌ Test order dependencies.
- ❌ Skipping the feature tag — the policy fixture will fail loudly.
