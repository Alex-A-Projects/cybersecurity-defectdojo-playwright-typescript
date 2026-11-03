# UI Coverage Matrix

Source of truth for what each sidebar / dashboard widget has against the framework.
Update this whenever a POM or spec is added.

| Surface (sidebar / page) | POM | Spec | Status |
|---|---|---|---|
| Login (route `/login`) | `login.page.ts` | `tests-ui/auth/login.spec.ts` | ✅ smoke + negative |
| Dashboard (4 summary cards + 2 charts + lower panel) | `dashboard.page.ts` | `tests-ui/dashboard/dashboard.spec.ts` | ✅ smoke + regression |
| Assets / Products — list | `product-list.page.ts` | `tests-ui/products/products.spec.ts` | ✅ |
| Assets / Products — detail | `product-detail.page.ts` | `tests-ui/products/product-detail.spec.ts` | ✅ |
| Engagements — list | `engagement-list.page.ts` | `tests-ui/engagements/engagements.spec.ts` | ✅ |
| Engagements — detail | `engagement-detail.page.ts` | `tests-ui/engagements/engagements.spec.ts` (DD-260) | ✅ (gracefully skips if URL shape shifts) |
| Findings — list | `finding-list.page.ts` | `tests-ui/findings/findings.spec.ts` | ✅ |
| Findings — detail | `finding-detail.page.ts` | `tests-ui/findings/finding-detail.spec.ts` | ✅ |
| Filters sub-bar | `filter-bar.component.ts` | `tests-ui/filters/filters.spec.ts` | ✅ |
| Reports | `report.page.ts` | `tests-ui/reports/reports.spec.ts` | ✅ |
| Users — list | `user-list.page.ts` | `tests-ui/users/users.spec.ts` | ✅ |
| Components — list | `components.page.ts` | `tests-ui/components/components.spec.ts` | ✅ smoke |
| Endpoints — list | `endpoint.page.ts` | `tests-ui/endpoints/endpoints.spec.ts` | ✅ smoke |
| Metrics — dashboard | `metrics.page.ts` | `tests-ui/metrics/metrics.spec.ts` | ✅ smoke |
| Calendar | `calendar.page.ts` | `tests-ui/calendar/calendar.spec.ts` | ✅ smoke |
| Questionnaires — list | `questionnaires.page.ts` | `tests-ui/questionnaires/questionnaires.spec.ts` | ✅ smoke |
| Configuration | `configuration.page.ts` | `tests-ui/configuration/configuration.spec.ts` | ✅ smoke |
| Sidebar — clicks each entry to its destination | `sidebar.component.ts` | `tests-ui/_framework/sidebar-navigation.spec.ts` | ✅ `@infra` |
| Upgrade (Pro upsell) | — | — | Out of scope |
| Notification bell + top-bar search | ❌ | ❌ | **TODO: not implemented** |
| Severity badge component (assertions) | `severity-badge.component.ts` | ❌ (used by POMs only) | **TODO: dedicated assertion coverage** |

## Open decisions before backfilling

1. Should the **notification bell** be in scope? (Pro-only behaviour vs. base visible UI element.)
2. Do you want me to add a `data-dd-id` test-id convention and migrate POMs to it (per the
   `TODO(confirm)` flagged in `CLAUDE.md`)? This is what would unblock running the offline
   screenshots → POM generation loop with higher confidence.

Coverage is complete against every visible sidebar entry (excluding the Pro upsell). What
remains is auxiliary UI (notification bell + top-bar search) and the `data-dd-id` convention
decision.
