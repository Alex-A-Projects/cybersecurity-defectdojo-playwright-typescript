# DefectDojo Test Framework

UI + API + DB test automation for [DefectDojo](https://github.com/DefectDojo/django-DefectDojo), the open-source vulnerability-management platform.

**Stack:** TypeScript · Playwright · PostgreSQL 16 (Docker) · Allure Report · GitHub Actions.

```
┌──────────────────────┬──────────────────────┬──────────────────────┐
│  tests-ui/  (browser)│  tests-api/  (HTTP)  │  tests-db/  (SQL)    │
├──────────────────────┼──────────────────────┼──────────────────────┤
│  src/ui/             │  src/api/            │  src/db/             │
│  pages, components,  │  clients, services,  │  repos, factories,   │
│  services, fixtures  │  fixtures            │  fixtures, clients   │
├──────────────────────┴──────────────────────┴──────────────────────┤
│              src/shared/  (env, paths, tags, policy, …)            │
└────────────────────────────────────────────────────────────────────┘
```

Only `src/shared/` is cross-suite. The three suites have independent Playwright configs and cannot import each other.

## 1. Setup

```bash
# 1. Install Node deps + Playwright browsers
npm install
npx playwright install --with-deps

# 2. Configure environment
cp .env.example .env
# Edit .env — sandbox creds are pre-filled (demo.defectdojo.org)
#
# TEST_ENV=demo
# DEMO_BASE_URL=https://demo.defectdojo.org
# DEMO_API_URL=https://demo.defectdojo.org
# TEST_USER=admin
# TEST_PASSWORD=<sandbox password>   # see .env.example

# 3. Start the DB container (DB suite only)
npm run db:up
npm run db:wait    # blocks until pg_isready succeeds
```

## 2. Running

```bash
# Run a single suite
npm run test:ui
npm run test:api
npm run test:db

# Filter by tag
npm run test:smoke
npx playwright test --config=playwright.api.config.ts --grep @regression
npx playwright test --config=playwright.ui.config.ts --grep "@smoke|@critical"

# Combine environment + tags
TEST_ENV=demo npx playwright test --config=playwright.ui.config.ts --grep @smoke
```

All commands respect the two-axis env model:

- **`TEST_ENV`** picks the frontend environment (drives `page.goto()`).
- `DEMO_API_URL` (or future per-env `*_API_URL`) picks the API base for clients.

They may legitimately differ in one run; this is intentional, not a bug.

## 3. DB suite — seed capture

> The synthetic `initdb.sql` is **already committed** (captured 2026-10-20
> from `dojo/{product,product_type,engagement,finding}/models.py`). The public
> sandbox at `demo.defectdojo.org` does not expose PostgreSQL credentials,
> so the seed is reconstructed from DefectDojo's open-source models rather
> than `pg_dump`-ed from a live DB.

Schema source of truth (read 2026-10-20):

- `dojo/product/models.py` (Product)
- `dojo/product_type/models.py` (Product_Type)
- `dojo/engagement/models.py` (Engagement)
- `dojo/finding/models.py` (Finding)

The seed sets up the FK chain `finding → test → engagement → product →
product_type` and seeds one row each in `auth_user` (admin), `dojo_product_type`
(`Other`), `dojo_sla_configuration` (`Default SLA`), and `dojo_test_type`
(`Generic`) so test factories can rely on id=1 default rows.

To **replace** the synthetic seed with a real `pg_dump` from a self-hosted
DefectDojo:

```bash
# 1) Stand up local DefectDojo with the upstream compose:
git clone https://github.com/DefectDojo/django-DefectDojo
cd django-DefectDojo
docker compose build && docker compose up -d
sleep 60  # let migrations run

# 2) Back in this repo, capture the real schema:
DD_DB_HOST=localhost \
DD_DB_PORT=5432 \
DD_DB_NAME=defectdojo \
DD_DB_USER=defectdojo \
DD_DB_PASSWORD=defectdojo \
./scripts/dump-seed.sh

# 3) Replace the synthetic seed with the real one:
git add -f tests-db/fixtures/seed/initdb.sql
git commit --amend -m "DB seed: switch to real pg_dump from local DefectDojo"

# 4) Run the suite against the test container:
npm run db:up && npm run db:wait && npm run test:db
```

If you delete or replace `initdb.sql`, `tests-db/_framework/schema-exists.spec.ts`
still runs and reports the empty state instead of failing — fixtures cascade
to skips with clear messages.

## 4. Feature gating

`config/test-policy.json` declares per-env feature flags. A spec that touches a gated feature must carry a `featureTag('name')`; the policy gate fixture (composed into every suite's `test` object) auto-skips disabled features and fails loudly on undeclared ones.

```ts
test('lists critical findings',
  { tag: [Tags.SMOKE, featureTag('findings')] },
  async ({ findingListPage }) => { … },
);
```

## 5. Reports

```bash
npm run allure:serve:ui       # serve the latest UI run in your browser
npm run allure:serve:api
npm run allure:serve:db
```

Result dirs are suite-scoped (`allure-results-{ui,api,db}/`) so reports can be generated and shared per suite.

## 6. Suite ↔ rule reference

| Suite  | Config                        | Tags module                       | Skill |
|--------|-------------------------------|-----------------------------------|-------|
| UI     | `playwright.ui.config.ts`     | `src/shared/tags.ts`              | `skill-implement-ui-test-automation` |
| API    | `playwright.api.config.ts`    | `src/shared/tags.ts`              | `skill-implement-api-test-automation` |
| DB     | `playwright.db.config.ts`     | `src/shared/tags.ts`              | `skill-implement-db-test-automation` |

## 7. Authoring rules

- **No assertions in POMs / clients / services / repos** — assertion lives in specs.
- **No `test.only`** in committed code (CI sets `forbidOnly: true`).
- **No `waitForTimeout`** — use web-first assertions, `waitForResponse`, locator states.
- **Credentials only from `process.env.*`** — never inlined.
- **Test titles** prefix a ticket ID: `DD-1234 | login succeeds with valid credentials`.
- **Test data** uses `uniqueId('ui' | 'api' | 'db')` — never the same prefix between suites.

## 8. See also

- `CLAUDE.md` — project overview for Claude Code
- `docs/INDEX.md` — full guide index
- `docs/FEATURE-GATING-GUIDE.md` — feature tag reference
- `.claude/skills/skill-implement-{ui,api,db}-test-automation` — authoring skills
