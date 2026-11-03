# Architecture — API suite (DefectDojo)

```
   Test (spec)
       ↓
   Fixtures (DI composition root)
       ↓
   Service (domain wrapper)
       ↓
   Client (HTTP wrapper, one per resource)
       ↓
   Playwright request → /api/v2/...
```

## Layout

```
src/api/
├── clients/        # *ApiClient extends BaseApiClient
├── services/       # wraps client with defaults + convenience
├── fixtures/       # core, auth, clients, index
└── models/         # ProductDto, EngagementDto, FindingDto, UserDto

tests-api/
├── _framework/     # header-construction smoke
├── auth/           # login + token mint
├── products/       # CRUD
├── engagements/    # CRUD
├── findings/       # CRUD
└── ...
```

## Strict rules

- Tests import only from `src/api/fixtures`.
- Tests never import from `src/ui/` or `src/db/`.
- Clients / Services have zero `expect(...)` calls.
- DTO field names match DefectDojo's actual response shape (snake_case).
- The fixture composition root (`src/api/fixtures/index.ts`) is the only place fixture groups are spread in.

## DefectDojo API conventions

- v2 endpoints only.
- DRF Token auth: `Authorization: Token <key>`.
- 401 on missing/invalid token; 403 on insufficient perms; 400 with field errors on validation; 404 on unknown id.
- List endpoints paginated: `{ count, next, previous, results }`.

## Don't

- Don't add v1 endpoints — DefectDojo v2 is the supported surface.
- Don't invent response shapes — `TODO(confirm):` and exit BLOCKED if you can't verify.
