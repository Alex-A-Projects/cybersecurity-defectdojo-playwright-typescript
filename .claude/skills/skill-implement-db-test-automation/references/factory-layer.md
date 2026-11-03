# Factory layer — INSERT helpers

## Principle

A Factory knows the INSERT statement for one table. It returns the materialised row (including server-generated `id` / `created`). Tests call the Factory when they need a row to test against; Repos when they need to read.

## Example — ProductFactory

```ts
export class ProductFactory {
  async create(overrides: Partial<ProductRow> = {}): Promise<ProductRow> {
    const row = await queryOne<ProductRow>(
      `INSERT INTO dojo_product (name, description, prod_type_id)
       VALUES ($1, $2, $3) RETURNING …`,
      [
        overrides.name ?? uniqueProductName('db'),
        overrides.description ?? 'DB-suite auto-generated product',
        overrides.prod_type_id ?? 1,
      ],
    );
    if (!row) throw new Error('ProductFactory.create() returned no row');
    return row;
  }
}
```

## Why return the row

The caller can use `row.id` for next-step fixtures (e.g. create an Engagement under this Product) without an extra round-trip.

## Anti-patterns

- ❌ Asserting in a Factory.
- ❌ Hardcoding an `id` — let the DB assign.
- ❌ Using a Factory inside another Factory — extract a shared helper.
