# UI suite checks

Layer rules from the `skill-implement-ui-test-automation/SKILL.md` and the matching `references/pom-layer.md`.

| Severity | Check |
|---|---|
| CRITICAL | No `expect(...)` / assertion of any kind inside POMs / Components / Services |
| CRITICAL | Spec never calls `page.locator(...)` directly — only via POM / Component |
| MAJOR | POM extends `BasePage` |
| MAJOR | LOC priority: `getByRole` / `getByLabel` / `getByText` / CSS; no `data-*` test ID assumptions |
| MAJOR | Components (Header, FilterBar, …) composed in the POM constructor; not re-constructed in tests |
| MAJOR | Services never import from `src/api/` or `src/db/` |
| MAJOR | `headless: true` (no `headless: false`) unless documented justification |
| MINOR | Selector strings don't include product copy ("Add Product" rebrand risk) |
