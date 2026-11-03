# Architecture — DB suite

```
   Test (spec)
       ↓
   Fixtures (DI composition root)
       ↓
   Factory (INSERT) / Repository (SELECT/UPDATE/DELETE)
       ↓
   Pool (pg) → Postgres 16
```

## Layout

```
src/db/
├── clients/         # pool + bootstrap + healthcheck
├── repositories/    # ProductRepo, EngagementRepo, FindingRepo, UserRepo
├── factories/       # *Factory inserts + returns the row
├── fixtures/        # core, repos, index
└── models/          # matching row DTOs

tests-db/
├── _framework/      # schema-exists smoke + global-setup
├── constraints/
├── products/
├── engagements/
├── findings/
└── users/
```

## Strict rules

- Tests import only from `src/db/fixtures`.
- Tests never import from `src/ui/` or `src/api/`.
- Factories / Repos have zero assertions.
- `globalSetup` (`tests-db/_framework/global-setup.ts`) waits for the container's `pg_isready`.
- Test isolation = truncate + reseed via factories (workers: 1).

## Why truncate + reseed, not transaction-rollback

- DefectDojo's triggers call `setval('seq', nextval(...))` on every INSERT.
- Wrapping the whole test in a transaction breaks that.
- TRUNCATE … CASCADE clears the writable tables; factories re-create fresh data.

## Don't

- Don't assert in factories or repos.
- Don't open multiple pools.
- Don't ship raw SQL strings inside spec files except for SQL-specific assertions
  (constraint lookups, `pg_constraint`, `pg_index`, `information_schema`).
