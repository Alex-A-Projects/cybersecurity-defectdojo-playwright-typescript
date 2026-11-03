# Automation decision framework

For every test case in `test-cases/<area>/<feature>.md`, the matching row in
`test-cases/<area>/<feature>-automation-decisions.md` looks like:

| TC ID | Automate? | Suite | Tags (preserve from test-case) | Notes |
|---|---|---|---|---|
| DD-100 | YES | UI | `@smoke, @regression, @feature:auth` | Stable selectors (Username, Password, Sign In buttons) |
| DD-101 | YES | UI | `@negative, @regression, @feature:auth` | Relies on the Bootstrap alert class |
| DD-XYZ | NO  | — | n/a | Manual exploratory — defensible because the assertion target is "looks pleasant" |
| DD-ABC | LATER | API | `@feature:findings, @feature:products` | Missing `initdb.sql` blocks the prerequisite flow; defer until seed lands |

## Decide per case

| Question | If no | If yes |
|---|---|---|
| Is the behaviour deterministic across the public sandbox daily reset? | Move to DB suite (it runs in your container) | OK to automate against UI/API |
| Are there stable selectors / endpoints / tables? | Manual | OK |
| Does the assertion target a UI render "looks good"? | Manual | OK |
| Will the test break every release? | One-shot probe (then revisit) | Risk-flag @boundary |
| Is the feature off by default in the matrix? | Tag with `@feature:*` so it skips; if behaviour matters, add to matrix | OK |

## When you tag

Copy tags from the source test-case row verbatim. The implementing agent reads this decisions file and applies tags exactly as recorded — that's how we keep the suite tag → spec mapping auditable.
