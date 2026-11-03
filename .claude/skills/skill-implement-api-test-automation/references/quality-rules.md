# Quality rules — API suite

## Strict

- ✅ `tsconfig.json` `strict: true`; `npm run typecheck` must pass.
- ✅ Tests import from `src/api/fixtures`.
- ✅ Clients / Services have zero assertions.
- ✅ Tests prefix `DD-####`.
- ✅ Each test has at least one feature tag if it touches a feature.

## Conventions

- Client class names end in `ApiClient`.
- Service class names end in `Service` (no `Api` — that suffix is for clients).
- DTO field names match DefectDojo's actual response (snake_case for raw fields).

## Severity (defects raised by `skill-code-review`)

| Severity | Example |
|---|---|
| CRITICAL | Client asserts, hardcoded token in spec, missing fixture |
| MAJOR | Wrong layer (Service in client file), no `Authorization` header |
| MINOR | Snake_case drift in a DTO |
