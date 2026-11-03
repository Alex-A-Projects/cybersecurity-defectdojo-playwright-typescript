# Experience-based techniques

Useful supplements to the formal techniques, particularly for capturing defects a structured design will miss.

## Error Guessing

What tends to break DefectDojo?

- Long titles with HTML; DefectDojo renders stored content — does `<script>alert(1)</script>` survive?
- Concurrent API calls creating the same finding twice (idempotency / race).
- Pages with thousands of rows (pagination regressions).
- A user without `is_staff` visiting `/admin/` (defense-in-depth).
- A CSRF attempt via a foreign-origin POST (Django middleware).

## Exploratory Charters

Time-box 30-60 min charters around each feature:

- "Discover the bug surface around finding bulk-edit, no advice on which selectors to use, in 30 minutes."
- "Verify the CSV export of an engagement with 100 findings has the right columns, in 20 minutes."

Charters land in the test-cases file as exploratory-test placeholders with a known-quality note.

## Defect Taxonomies

Bug patterns seen historically in DefectDojo:

- Off-by-one in pagination (the `next` URL sometimes points to the wrong page)
- TIMEZONE shifts in `target_start` (server vs browser)
- Foreign-key CASCADE silently deleting child records on parent delete (expected in some flows, surprising in others)
- Severity badge miscoloring (Medium seen as High when language locale is `de-DE`)
