# Black-box test design techniques

Use these when designing DefectDojo test cases. Apply at least **two** techniques per feature for meaningful coverage; combining equivalence partitioning with BVA catches most field-input bugs, while state-transition testing catches role/permission regressions.

## Equivalence Partitioning (EP)

Divide the input space into equivalence classes where any member of the class should behave identically. For DefectDojo fields:

| Field | Valid class | Invalid classes |
|---|---|---|
| `severity` | `Critical / High / Medium / Low / Info` | anything else (rejected by CHECK constraint) |
| `status` | `Active / Verified / False Positive / Closed / Under Review / Risk Accepted` | anything else (rejected by check) |
| `cwe` | integer ≥ 1 matching an existing CWE id | 0, negative, non-integer, nonexistent CWE |
| `cvssv3` | `<vector string>` matching `CVSS:3.1/...` | arbitrary string not matching the prefix |
| `product.name` | non-empty string ≤ 300 chars | empty string, > 300 chars |

## Boundary Value Analysis (BVA)

Test the **boundary** of each EP:

- empty + 1-char + max-char
- 0 + 1 + INT_MAX
- min date + max date + day-after-max

For Severity: test the five enums (no boundary).
For CVSSv3: test valid-prefix + invalid-prefix.

## Decision Tables

For multi-condition logic (e.g. "what happens when severity=Critical AND status=Active AND active=true"), enumerate truth-table-style. Most relevant when validating the `dojo_finding.risk_accepted` workflow.

## State Transition Testing

DefectDojo entities have well-defined lifecycles:

- **Finding**: `New (Active)` → `Verified` → (`Risk Accepted` | `Closed` | `False Positive`)
- **Engagement**: `Not Started` → `Blocked` | `In Progress` → `Completed`

Build a state graph and cover valid transitions + each invalid one (negative cases).

## Use

When designing tests for a DefectDojo feature, ask: which techniques apply?

- Form fields → EP + BVA
- Multi-checkbox form → Decision table
- Workflow with status changes → State transition
- Role-based visibility → Decision table (user role × page)
