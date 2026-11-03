# Test case template

Use this template for every test case in `test-cases/<area>/<feature>.md`. Adapt column widths to your editor.

## Columns

| Column | Description |
|---|---|
| **ID** | `DD-####` (matches the ticket the test will live under in CI). |
| **Title** | One-line action-driven statement. |
| **Preconditions** | State the fixture must establish (e.g. "one Product of type 'Research and Development' exists"). |
| **Steps** | Numbered, each ≤ 1 user action + 1 system response. |
| **Expected** | The single observable outcome. |
| **Action** | `AUTOMATE_UI` / `AUTOMATE_API` / `AUTOMATE_DB` / `MANUAL` / `DEFER`. |
| **Tags** | Comma-separated suite/feature tags. The implementation reads these verbatim from the automation-decisions file. |
| **Owner** | (optional) ticket owner. |
| **Risk** | `Low` / `Medium` / `High`. High-risk tests get `@critical`. |

## Example

```markdown
| ID | Title | Preconditions | Steps | Expected | Action | Tags | Risk |
|---|---|---|---|---|---|---|---|
| DD-100 | Login form displays username + password | None | 1. Visit `/login` | Username field, Password field, and Sign In button are visible | AUTOMATE_UI | @smoke, @regression, @feature:auth | Medium |
| DD-101 | Invalid login renders visible error | None | 1. Visit `/login` 2. Type `admin` / `wrong-pass` 3. Click Sign In | An error message under the password field reads "Invalid email or password." | AUTOMATE_UI | @negative, @regression, @feature:auth | Medium |
```

## Notes

- IDs and Titles are stable — the implementing agent must reuse the ID and title verbatim so failures map back to a single ticket.
- Preconditions describe what the **fixture** must do; do not duplicate that into Steps.
- Tags stay short — one @smoke / @regression / @negative / @boundary / @e2e / @security / @accessibility / @critical + 1–N `@feature:*`.
