# Environment — API suite

## Single source of truth

`src/shared/env.ts` exports `env.apiBaseURL` resolved from `DEMO_API_URL` (when `TEST_ENV=demo`).
The `apiAuthorization` fixture adds the `Authorization: Token <key>` header per test.

## Token mint

`apiAuthFixture` obtains a DRF token via `POST /api-v2/api-token-auth/` (with env-supplied credentials) and scopes it to the test.

## `.env`

```env
TEST_ENV=demo
DEMO_API_URL=https://demo.defectdojo.org
TEST_USER=admin
TEST_PASSWORD=<sandbox password>   # see .env.example; never commit a real value
```

## Override per-test

The `effectiveApiBaseUrl(perTestUrl)` helper lets a test force a different backend URL without mutating global env. Composition root exposes `apiAuthorization` per test; the clients accept it per call.

## Framework-level smoke

`tests-api/_framework/header-construction.spec.ts` verifies env resolution and client construction without hitting the network.
