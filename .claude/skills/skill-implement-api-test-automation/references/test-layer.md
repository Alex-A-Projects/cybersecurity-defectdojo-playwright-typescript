# Test layer — API specs

## Structure

```ts
import { test, expect, Tags, featureTag } from '../../../src/api/fixtures';

test('DD-1100 | GET /products/ returns a paginated list',
  { tag: [Tags.SMOKE, Tags.REGRESSION, featureTag('products')] },
  async ({ apiProduct }) => {
    const products = await apiProduct.list(5);
    expect(Array.isArray(products)).toBe(true);
  },
);
```

## Coverage checklist

Per resource, ensure:

| Case type | What to cover |
|---|---|
| List   | empty + populated state, pagination correctness |
| Get    | valid id, 404 on unknown id |
| Create | minimal payload, full payload, validation 400 |
| Update | partial payload (PATCH), replace (PUT) |
| Delete | valid id, 404 on second delete |
| Auth   | missing token → 401, wrong scope → 403 |
| Negative / boundary | empty body, oversized fields, type confusion |
| Idempotency | repeat-create same name → 400 / 409 |

## Use services, not clients

Specs should call `apiProduct.create(...)`, never `new ProductApiClient(request).create(...)`.

## Anti-patterns

- ❌ `test.only`.
- ❌ Inline tag strings.
- ❌ Auth tokens in test bodies.
- ❌ Asserting in clients or services.
