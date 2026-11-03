---
name: skill-allure-playwright
description: Add or improve Allure Report integration across the three suites — steps, metadata (Epic/Feature/Story, severity, owner), attachments, links, parameters. Use when asked to annotate DefectDojo tests with Allure or improve UI/API/DB reports.
disable-model-invocation: false
---

You are the reporting engineer for the DefectDojo framework. Add Allure annotations following the rules below.

---

## Step 1 — Orient

1. `package.json` — confirm `allure-playwright` is in devDependencies.
2. Each suite's playwright config — confirm the Allure reporter is registered with the suite-scoped results dir (`allure-results-{ui,api,db}`).
3. `allure-js-commons` — transitive, no separate install.

## Step 2 — Annotating tests (core reference)

```ts
import * as allure from 'allure-js-commons';
import { Severity, ContentType } from 'allure-js-commons';
```

### Metadata — at the top of the test body, before any `await` actions

| Function | Example |
|---|---|
| `allure.epic(name)` | `await allure.epic('Vulnerability Management')` |
| `allure.feature(name)` | `await allure.feature('Findings')` |
| `allure.story(name)` | `await allure.story('User lists critical findings')` |
| `allure.parentSuite(name)` | `await allure.parentSuite('UI')` (or API / DB) |
| `allure.suite(name)` | `await allure.suite('Findings – list')` |
| `allure.subSuite(name)` | `await allure.subSuite('Smoke')` |
| `allure.owner(name)` | `await allure.owner('qa-team')` |
| `allure.severity(level)` | `await allure.severity(Severity.CRITICAL)` |
| `allure.tags(...tags)` | `await allure.tags('smoke', 'findings')` |
| `allure.description(md)` | `await allure.description('Verifies the severity filter narrows the result set.')` |
| `allure.issue(url, name)` | `await allure.issue('https://jira/APP/DD-100', 'DD-100')` |
| `allure.tms(url, name)` | `await allure.tms('https://jira/APP/DD-100', 'DD-100')` |

Severity enum: `BLOCKER`, `CRITICAL`, `NORMAL`, `MINOR`, `TRIVIAL`.

### Steps

```ts
await allure.step('Filter by Critical severity', async () => {
  await findingListPage.filterBar.filterBySeverity('Critical');
  await expect(findingListPage.filterBar.severitySelect).toHaveValue(/Critical/i);
});
```

Steps nest. Use for user actions, not implementation detail.

### Attachments

```ts
await allure.attachment('Response body', JSON.stringify(body), { contentType: ContentType.JSON });
await allure.attachmentPath('Screenshot', screenshotPath, { contentType: ContentType.PNG });
```

## Integration rules

- Allure imports live in spec files only — never in POMs / clients / services / factories / repos.
- Metadata is called at the top of the test body before any `await`, so it is captured on early failure.
- Steps describe what the user is doing, not implementation details.

## Verify

```bash
npm run test:ui  # writes allure-results-ui
npm run allure:serve:ui  # opens the report
```

## Don't

- ❌ Imports in POMs / clients / services.
- ❌ `allure.step` wrapping a single click that is already encapsulated.
- ❌ `allure.attachment` of secrets / tokens / passwords.
