# Common checks (apply to every PR)

| Severity | Check |
|---|---|
| CRITICAL | No hardcoded credentials, tokens, or connection strings in committed code |
| CRITICAL | `tsc --noEmit` (npm run typecheck) passes with zero errors |
| CRITICAL | No `test.only` in committed code (CI sets `forbidOnly: true`) |
| CRITICAL | No `waitForTimeout` / `sleep` |
| MAJOR | Test title starts with `DD-####` |
| MAJOR | Every test that touches a feature carries `featureTag('<name>')` and the feature is declared in `config/test-policy.json` |
| MAJOR | Tags come from `Tags` constants or `featureTag(...)` — no inline `@tag` strings |
| MAJOR | Spec imports `test` / `expect` from the suite's fixture barrel, never `@playwright/test` directly |
| MINOR | File naming follows the layer-suffix convention (`*.page.ts`, `*.component.ts`, etc.) |
| MINOR | TODO comments use the `TODO(confirm):` prefix so they're greppable |
