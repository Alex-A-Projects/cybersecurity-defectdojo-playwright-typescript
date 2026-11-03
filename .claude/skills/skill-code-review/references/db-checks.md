# DB suite checks

Layer rules from the `skill-implement-db-test-automation/SKILL.md`.

| Severity | Check |
|---|---|
| CRITICAL | No `expect(...)` inside Factory or Repo |
| CRITICAL | No hardcoded connection strings / credentials in Factory or Repo code |
| MAJOR | Spec uses Factory or Repo fixtures; no raw `query()` calls except for SQL-specific assertions (pg_constraint, pg_index, information_schema) |
| MAJOR | Per-test data is created via Factory, never assumed pre-existing |
| MAJOR | Postgres version pinned in docker-compose matches production |
| MAJOR | Spec runs in `workers: 1`, `fullyParallel: false` (the DB suite config enforces this) |
| MINOR | Class names: factory = `<Resource>Factory`, repo = `<Resource>Repo` |
