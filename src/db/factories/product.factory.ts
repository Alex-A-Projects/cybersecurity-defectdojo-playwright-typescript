import { queryOne } from '../clients/pool.client';
import { uniqueProductName } from '../../shared/generators';
import type { ProductRow, ProductTypeRow } from '../models/product.model';

/**
 * Product factory — inserts a row into `dojo_product` and returns the
 * materialised record.
 *
 * `prod_type_id` defaults to `1` (the seeded 'Other' ProductType in
 * tests-db/fixtures/seed/initdb.sql). Override only if your test needs a
 * different product type.
 *
 * `sla_configuration_id` defaults to `1` (the seeded 'Default SLA' row).
 * That's also the schema default, but we set it explicitly.
 */
export class ProductFactory {
  async create(
    overrides: Partial<ProductRow> & {
      prod_type_id?: number;
      sla_configuration_id?: number;
    } = {},
  ): Promise<ProductRow> {
    const name = overrides.name ?? uniqueProductName('db');
    const description = overrides.description ?? 'DB-suite auto-generated product';

    const row = await queryOne<ProductRow>(
      `INSERT INTO dojo_product (name, description, prod_type_id, sla_configuration_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, prod_type_id, sla_configuration_id,
                 business_criticality, platform, lifecycle, origin,
                 external_audience, internet_accessible,
                 enable_simple_risk_acceptance, enable_full_risk_acceptance,
                 enable_product_tag_inheritance, disable_sla_breach_notifications,
                 async_updating, user_records, revenue::text, prod_numeric_grade,
                 tid, technical_contact_id, team_manager_id, product_manager_id,
                 created::text, updated::text`,
      [
        name,
        description,
        overrides.prod_type_id ?? 1,
        overrides.sla_configuration_id ?? 1,
      ],
    );
    if (!row) throw new Error('ProductFactory.create() returned no row');
    return row;
  }
}

export class ProductTypeFactory {
  async create(
    overrides: Partial<ProductTypeRow> & {
      critical_product?: boolean;
      key_product?: boolean;
    } = {},
  ): Promise<ProductTypeRow> {
    const name = overrides.name ?? `TestType-${uniqueProductName('db')}`;
    const row = await queryOne<ProductTypeRow>(
      `INSERT INTO dojo_product_type (name, description, critical_product, key_product)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (name) DO UPDATE SET critical_product = EXCLUDED.critical_product
       RETURNING id, name, description, critical_product, key_product,
                 created::text, updated::text`,
      [name, overrides.description ?? null, overrides.critical_product ?? false, overrides.key_product ?? false],
    );
    if (!row) throw new Error('ProductTypeFactory.create() returned no row');
    return row;
  }
}
