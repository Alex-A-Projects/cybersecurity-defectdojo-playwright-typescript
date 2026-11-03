# Environment — DB suite

## Connection

`src/shared/env.ts` exports `env.db`. Connection comes from:

```
DD_DB_HOST     (default localhost)
DD_DB_PORT     (default 5432)
DD_DB_NAME     (default defectdojo)
DD_DB_USER     (default defectdojo)
DD_DB_PASSWORD (default defectdojo)
DD_DB_SSL      (default false)
```

## Connection-vs-container

`DD_DB_HOST` is the host the **test** connects to (your localhost in dev; the runner's localhost
in CI). The container's **internal** port is the same (5432), and `docker-compose.yml` publishes
that port on the host.

## Pool

A single `pg.Pool` per process is held by `src/db/clients/pool.client.ts`. Tests acquire/release
clients via `withClient(fn)` or `query(text, params)`.

## `.env`

```env
DD_DB_HOST=localhost
DD_DB_PORT=5432
DD_DB_NAME=defectdojo
DD_DB_USER=defectdojo
DD_DB_PASSWORD=defectdojo
DD_DB_SSL=false
```

## CI

`.github/workflows/test.yml` declares a `postgres:16` service container with the same env vars
and a TCP-wait step before running `npm run test:db`.
