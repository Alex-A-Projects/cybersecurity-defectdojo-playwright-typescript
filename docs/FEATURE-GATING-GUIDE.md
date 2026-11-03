# Feature Gating Guide

## How it works

`config/test-policy.json` declares an `env → feature → enabled` matrix.
The `policyFixture` (composed into every suite's `test` object) enforces it:

1. **Tag absent** → test errors loudly: "Test has no `@feature:` tag. Add `featureTag('…')`."
2. **Tag present, feature undeclared in matrix** → test errors loudly: "Undeclared feature tag: `…`. Add it to `config/test-policy.json`."
3. **Tag present, feature declared but `false` in current `TEST_ENV`** → test is **skipped** with a clear reason.
4. **Tag present, feature declared and `true` in current `TEST_ENV`** → test runs normally.

The current matrix (single env `demo`) lists:

| Feature | demo | Notes |
|---|---|---|
| `auth` | true | Login flow + session cookie |
| `products` | true | Product/asset CRUD via UI + API |
| `engagements` | true | Engagement CRUD via UI + API |
| `findings` | true | Finding CRUD via UI + API |
| `users` | true | User list + role management |
| `reports` | true | Report generation |
| `notes` | true | Per-finding notes |
| `risk_acceptance` | true | Risk-acceptance workflow |
| `jira_integration` | false | Pro-tier; not in demo |
| `azure_devops_integration` | false | Pro-tier; not in demo |
| `sso` | false | Pro-tier; not in demo |

## Adding a new feature

1. Pick a snake_case feature name.
2. Add `featureTag('foo')` to the test that touches the feature.
3. Add `"foo": true|false` under each env in `config/test-policy.json`.
4. Run the suite — if the matrix is missing the key, the policy fixture throws at runtime.

## Tagging a test

```ts
import { test, expect, Tags, featureTag } from '../../src/fixtures';

test('lists critical findings',
  { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('findings')] },
  async ({ findingListPage }) => { … },
);
```

Tags compose:

- A `@smoke` test touching a disabled feature is **skipped**, not run.
- A `@critical` test touching `jira_integration` is auto-skipped on the demo env (matrix says `false`).
