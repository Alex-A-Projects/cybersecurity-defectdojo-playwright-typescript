# Quality rules — DB suite

## Strict

- ✅ `tsconfig.json` `strict: true`; `npm run typecheck` must pass.
- ✅ Tests import from `src/db/fixtures`.
- ✅ Factories / Repositories have zero assertions.
- ✅ Tests prefix `DD-####`.
- ✅ Each test has at least one feature tag if it touches a feature.
- ✅ Postgres version pinned in docker-compose matches production.

## Conventions

- Factory class names end in `Factory`.
- Repo class names end in `Repo`.
- Row DTOs end in `Row` (`ProductRow`, `FindingRow`).

## Severity (defects raised by `skill-code-review`)

| Severity | Example |
|---|---|
| CRITICAL | Hardcoded credentials in a Factory, assertion in a Factory |
| MAJOR | Spec missing a feature tag, wrong layer (raw SQL in spec where a Repo would do) |
| MINOR | Snake_case drift in a DTO |
