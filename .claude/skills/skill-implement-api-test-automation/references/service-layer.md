# Service layer — API domain wrappers

## Purpose

A Service hides the no-default-request-body mechanics from specs. Example: a spec that needs "a product with a unique name and a specific prod_type" calls `apiProduct.create({prod_type: 1})` — the defaults for unique name and required fields are applied here.

## Example — ProductService

```ts
export class ProductService {
  constructor(
    private readonly client: ProductApiClient,
    private readonly headers: Record<string, string>,
  ) {}

  async create(overrides: Partial<ProductDto> = {}): Promise<ProductDto> {
    return this.client.create({
      name: overrides.name ?? uniqueProductName('api'),
      description: overrides.description ?? 'Auto-generated via API service.',
      prod_type: overrides.prod_type ?? 1,
      ...overrides,
    }, this.headers);
  }
}
```

## When to add a Service

- Defaults exist for typical DTO creation? → Service.
- One-off complex queries (filters by product_type + tags + description regex)? → Probably extend the client.
- Cross-resource orchestration (create engagement under a product, then add findings)? → New orchestrating Service or a Facade.

## Anti-patterns

- ❌ Asserting in a Service.
- ❌ Storing global state on the Service.
- ❌ Importing from `src/ui/` or `src/db/`.
