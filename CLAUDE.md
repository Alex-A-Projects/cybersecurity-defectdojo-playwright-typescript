# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Product Overview: DefectDojo

DefectDojo is an **open-source vulnerability-management platform**. Security and application-security teams use it to:

- Ingest vulnerability scans from 100+ tools (Burp, Nessus, Snyk, Trivy, …)
- Deduplicate and prioritise findings
- Track remediation through engagement lifecycles
- Produce management reports

**Tech stack of the app under test:**

- Python / Django backend, Django REST Framework for the v2 API
- PostgreSQL 16 as the production database (server-side, not the test container)
- HTML rendered server-side; templates and a few JS bundles; no SPA framework
- DRF token auth + Django session auth; SSO/SAML are Pro-tier

**Sandbox:** `https://demo.defectdojo.org/` · admin · password in `.env` as `TEST_PASSWORD` · resets daily.

---

## Test Automation Overview

This repo houses **three suites** sharing a small `src/shared/` core:

```
tests-ui/        →  src/ui/    (POM, components, services, fixtures)
tests-api/       →  src/api/   (clients, services, fixtures)
tests-db/        →  src/db/    (repositories, factories, fixtures, postgres client)
```

Each suite has its own Playwright config, its own Allure result dir, its own reporter wiring. `src/shared/` is the **only** cross-suite import path.

### Setup and run commands

See `README.md`. Three axes to be aware of:

- `TEST_ENV` — frontend env (drives `page.goto()`). Today: `demo`.
- `DEMO_API_URL` — backend/API env (drives request clients, may differ from frontend).
- `DD_DB_*` — Postgres container connection (DB suite only).

### Layer rules (all three suites)

```
   Test (spec)  →  Fixtures (DI composition root)  →  POM / Component / Service / Client / Repo  →  Page / HTTP / DB
```

- **Test layer** — AAA pattern, tags, no locators, no raw SQL, no business logic. Always import `test`/`expect` from the suite's fixture barrel.
- **Fixtures layer** — composition root spread (`src/<suite>/fixtures/index.ts`). Typed intersection of each fixture group's named exports.
- **POM / Component / Service / Client / Repo** — zero assertions. Return data, expose state.
- **Model layer** — typed DTOs, row shapes; no behaviour beyond trivial builders.

### DOM conventions (UI suite)

- **No custom `data-*` test ID attribute exists** in DefectDojo. POMs use `getByRole` → `getByLabel` → `getByText` → CSS. `getByTestId` is intentionally not used.
- **TODO(confirm):** if/when the frontend agrees on a `data-dd-id` convention, set `testIdAttribute` in `playwright.ui.config.ts` and migrate POMs.

### Git Flow & Branch Naming

Follow `.claude/rules/git-flow-branching.md`. Ticket prefix is **`DD-####`** (DefectDojo / Jira).

- Permanent branch `main`
- Branch types `feat/`, `fix/`, `hotfix/`, `refactor/`, `chore/`, `docs/`, `test/`
- Format `<type>/<issue-id>-<kebab-case-description>` (e.g. `feat/dd-1234-add-finding-filters`)
- Branch-name validation is convention-only — the rule documents a pre-push hook but no hook is installed by default.

### Playwright MCP Browser Mode

Follow `.claude/rules/playwright-mcp-headless-mode.md`. Default to headless; use MCP inspection tools (`browser_snapshot`, `browser_take_screenshot`, `browser_console_messages`, `browser_network_requests`) before ever reaching for headed mode.

### Feature Gating & Test Tags

- Feature tags are built with `featureTag('name')` and gated by `config/test-policy.json` (`env → feature → enabled`). A test tagged for a disabled feature is auto-skipped; a tag naming an undeclared feature **fails loudly** via the `policyFixture`.
- Suite/type tags from `Tags` (`src/shared/tags.ts`): `@smoke`, `@sanity`, `@regression`, `@negative`, `@boundary`, `@e2e`, `@security`, `@accessibility`, `@critical`. Selected at the CLI, never gated.

### Test Case Design

When designing test cases for a feature or endpoint, invoke `skill-write-test-cases` first. The automation-decisions file is the single source of truth for which tags each spec carries.

For larger test-case files (DB constraint matrix, full CRUD sweep), route through `agent-test-automation-orchestrator` instead of implementing directly — it partitions `AUTOMATE_UI / AUTOMATE_API / AUTOMATE_DB` cases into chunks and spawns the matching suite agent (`agent-{ui,api,db}-test-automation`) sequentially.

### Code Review

After finishing development, run `/skill-code-review` to review all branch changes against the project's architecture rules and quality standards before merging.
