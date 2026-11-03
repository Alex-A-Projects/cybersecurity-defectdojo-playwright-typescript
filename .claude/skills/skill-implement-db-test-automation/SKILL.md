---
name: skill-implement-db-test-automation
description: Implement DefectDojo DB tests against the Dockerised Postgres 16 container. Verify schema, constraints, isolation, per-test clean state. Use when asked to build or extend DB-level specs.
disable-model-invocation: false
---

You are a senior DB automation engineer for DefectDojo. Follow these rules.

---

## Step 0 — Feature Flag Gate

Mandatory. Confirm the feature is declared in `config/test-policy.json`. If missing, STOP and ask.

---

## Step 1 — Orient

- Confirm the container is up: `npm run db:wait`.
- Read `src/db/` and `tests-db/` to identify what to extend.
- Check `tests-db/fixtures/seed/initdb.sql` existence — without it, data-driven specs skip with a TODO(confirm).

---

## Quick navigation

| I want to… | Reference |
|---|---|
| Understand the architecture | `references/architecture.md` |
| Scaffold the suite | `references/scaffold.md` |
| Write specs with AAA + tagging | `references/test-layer.md` |
| Repositories (queries) | `references/repo-layer.md` |
| Factories (data setup) | `references/factory-layer.md` |
| Fixtures composition | `references/fixtures-layer.md` |
| Container lifecycle + seed strategy | `references/container-and-seed.md` |
| Quality bar | `references/quality-rules.md` |
| Environment variables | `references/environment.md` |

---

## 4-Layer Architecture

```
Test (spec)
   ↓
Fixtures (DI composition root)
   ↓
Factory (data) / Repository (queries)
   ↓
Pool (pg) → Postgres 16 container
```

- **Test** — AAA, tags. Uses `repo` / `factory` fixtures + `query()` only for SQL-specific assertions.
- **Fixture** — `dbFactoriesFixture` + `dbReposFixture` + `policyFixture`.
- **Factory** — INSERT with sensible defaults. Returns the row.
- **Repository** — `findById`, `findByName`, `listFor<ForeignKey>`, `deleteById`.

---

## Design patterns

| Pattern | Purpose | Example |
|---|---|---|
| **Factory** | Build a row with overrides | `ProductFactory.create({ name: 'X' })` |
| **Builder** | Stepwise complex insertions (rare for SQL) | n/a typically |
| **Strategy** | Different isolation strategy per env | TRUNCATE-CASCADE vs transaction-rollback |
| **Facade** | Multi-resource setup in one fixture | `EngagementFacade.createWithFindings(...)` |

---

## Quality standards

- ✅ Tests run in `workers: 1`, `fullyParallel: false`.
- ✅ Per-test isolation is **truncate + reseed via factories** (not transaction rollback — DefectDojo's
  triggers + sequence semantics make rollback hazardous).
- ✅ No assertions in factories or repos.
- ✅ Tests prefix titles with `DD-####`.
- ✅ Tests carry `@feature:*` for any feature they touch.
- ✅ Postgres version pinned in `docker-compose.yml` matches production.

---

## Workflow

1. Orient
2. Scaffold / extend the relevant repo + factory
3. Compose fixtures if new fixtures are needed
4. Implement spec
5. Verify

---

## Reference files

All references in `references/`.
