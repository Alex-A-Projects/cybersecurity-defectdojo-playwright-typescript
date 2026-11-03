# Test layer — DB specs

## Structure

```ts
import { test, expect, Tags, featureTag } from '../../../src/db/fixtures';

test('DD-2000 | Insert + read round-trip',
  { tag: [Tags.REGRESSION, featureTag('products')] },
  async ({ productFactory, productRepo }) => {
    const created = await productFactory.create();
    const fetched = await productRepo.findById(created.id);
    expect(fetched?.name).toBe(created.name);
    await productRepo.deleteById(created.id);
  },
);
```

## Coverage checklist

| Concern | What to verify |
|---|---|
| Round-trip | insert then select returns the same row |
| NOT NULL | `null` rejected at INSERT |
| UNIQUE | duplicate value rejected |
| FK | child insert with unknown parent id rejected |
| CHECK | invalid enum value rejected |
| CASCADE | parent delete removes children |
| INDEX | `pg_index` row exists for expected indexes |

## Multi-resource transactions

For multi-row flows, do not wrap them in transactions. Use sequential awaits:

```ts
const product = await productFactory.create();
const engagement = await engagementFactory.create(product.id);
// ...
```

The TRUNCATE+reseed strategy at suite end cleans everything. Each spec creates its own data so
ordering is irrelevant.

## Anti-patterns

- ❌ `test.only`.
- ❌ Assertions in factories.
- ❌ Specs that depend on data left by another spec.
- ❌ Transactions inside specs (defeats the isolation model).
