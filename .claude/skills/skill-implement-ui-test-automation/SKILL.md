---
name: skill-implement-ui-test-automation
description: Scaffold, implement, or review DefectDojo UI tests under the layered architecture (Test → Fixtures → POM/Component/Service → Page). Apply design patterns (Factory, Builder, Strategy, Facade) and the project's quality bar. Use when asked to build or extend UI specs.
disable-model-invocation: false
---

You are a senior UI automation engineer for DefectDojo. Follow these rules — no exceptions.

---

## Step 0 — Feature Flag Gate

**Mandatory before any code:**

1. Ask whether the test depends on a feature not available on all environments.
2. Read `config/test-policy.json` to confirm the feature is declared.
3. Decision tree:
   - No feature dep → confirm, proceed.
   - Feature dep + name exists in matrix for `demo` → confirm, proceed.
   - Feature dep + name missing from matrix → **STOP.** Tell the user to add it.
4. Record the confirmed feature flag. Every test touching the feature MUST carry `featureTag('<name>')`.

---

## Step 1 — Orient

Read `src/ui/` and `tests-ui/` structure; identify which layers are missing or need extension.

---

## Quick navigation

| I want to… | Reference |
|---|---|
| Understand the 4-layer architecture | `references/architecture.md` |
| Scaffold a new framework from scratch | `references/scaffold.md` |
| Write specs with AAA + tagging | `references/test-layer.md` |
| Implement POMs with locators | `references/pom-layer.md` |
| Service layer (UI-driven setup) | `references/service-layer.md` |
| Fixtures composition root | `references/fixtures-layer.md` |
| Apply design patterns | `references/design-patterns.md` |
| Check the quality bar | `references/quality-rules.md` |
| Set up environment variables | `references/environment.md` |
| Verify and report | (within skill — see Step 7) |

---

## 4-Layer Architecture (DefectDojo)

```
Test (spec.ts)
   ↓
Fixtures (src/ui/fixtures/index.ts)
   ↓
Page Object + Component + Service
   ↓
Playwright Page
```

- **Test** — AAA, tags, no locators. Imports from `src/ui/fixtures`.
- **Fixtures** — composition root spread; per-area fixture modules.
- **POM / Component** — zero assertions. Methods return data or next-page; locators as readonly props.
- **Service** — UI-driven setup helpers (e.g. `productService.create`). Never imports from other suites.

---

## Design patterns

| Pattern | Purpose | Example |
|---|---|---|
| **Factory** | Generate test data with overrides | `FindingFactory.create({severity:'High'})` |
| **Builder** | Stepwise construction | (rare in UI; use Service methods instead) |
| **Strategy** | Swap per env | UI login vs API user injection |
| **Facade** | High-level flow | `ProductFacade.createAndVerify(...)` (when needed) |

---

## Quality standards (non-negotiable)

- ✅ Web-first assertions only (`await expect(...).toBeVisible()`).
- ✅ No `waitForTimeout` / `sleep`.
- ✅ No hardcoded secrets.
- ✅ No `test.only` in committed code.
- ✅ Tests are independent (no global mutable state).
- ✅ TypeScript `strict: true`.
- ✅ Page Objects have zero assertions.
- ✅ Test titles prefix a `DD-####` ticket ID.

---

## DefectDojo DOM conventions

No `data-*` test ID attribute exists. POM locators use:

1. `page.getByRole('button', { name: /sign in/i })` (preferred)
2. `page.getByLabel('Username')` (form fields)
3. `page.getByText(/not found/i)`
4. CSS / XPath (last resort — leave a `TODO(confirm):` if you reach for this)

---

## Workflow

1. Orient
2. Scaffold (if needed)
3. Layer rules
4. Implement test → POM → service → fixture in that order
5. Apply design patterns
6. Quality check
7. Verify — run the spec; on failure, refer to `references/architecture.md` for diagnostics

---

## Reference files

All references in `references/`. Adopt the ones you need; skip the rest.
