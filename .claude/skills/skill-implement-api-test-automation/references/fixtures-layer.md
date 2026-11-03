# Fixtures layer — API suite

## Composition order

```
core (policy gate, no auto on this suite)
  → auth (apiToken + apiAuthorization header)
    → clients (apiProduct, apiEngagement, apiFinding, apiUser)
```

```ts
type ApiFixtures = PolicyFixtures & ApiAuthFixtures & ApiClientFixtures;

export const test = base.extend<ApiFixtures>({
  ...policyFixture,
  ...apiAuthFixture,
  ...apiClientsFixture,
});
```

## Adding a new fixture

1. Decide whether it's auth / clients / cross-resource orchestration.
2. Create `src/api/fixtures/<feature>.fixture.ts`.
3. Compose in `index.ts`.
