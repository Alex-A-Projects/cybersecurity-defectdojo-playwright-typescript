# Repository layer — SELECT/UPDATE/DELETE helpers

## Principle

A Repo exposes typed reads for one table. Tests use Repos for assertions ("the row I just inserted looks like X") and for setup of more complex flows ("find Product by name, then create Engagement under it").

## Example — ProductRepo

```ts
export class ProductRepo {
  async findById(id: number): Promise<ProductRow | undefined> {
    return queryOne<ProductRow>(
      `SELECT id, name, description, prod_type_id, … FROM dojo_product WHERE id = $1`,
      [id],
    );
  }
  async deleteById(id: number): Promise<void> {
    await query('DELETE FROM dojo_product WHERE id = $1', [id]);
  }
}
```

## When to add a method

- A new query shape the suite reuses (e.g. `findWithEngagements(id)`).
- A CASCADE cleanup helper (e.g. `deleteFindingById` then product).

## Don't

- ❌ Put business logic in a Repo (e.g. "verify all critical findings have been remediated" — that's a Service).
- ❌ Wrap mutations in transactions without reason.
