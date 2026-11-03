import { query, queryOne } from '../clients/pool.client';
import type { ProductRow, ProductTypeRow, SlaConfigurationRow } from '../models/product.model';

/*
 * Product repository — direct SQL against DefectDojo's schema.
 *
 * `dojo_product`, `dojo_product_type`, `dojo_sla_configuration`. Column names
 * follow the Django field names exactly (snake_case). Verified against the
 * dojo/product/models.py and dojo/product_type/models.py sources on 2026-10-20.
 */
export class ProductRepo {
  async findById(id: number): Promise<ProductRow | undefined> {
    return queryOne<ProductRow>(
      `SELECT id, name, description, prod_type_id, sla_configuration_id,
              business_criticality, platform, lifecycle, origin,
              external_audience, internet_accessible,
              enable_simple_risk_acceptance, enable_full_risk_acceptance,
              enable_product_tag_inheritance, disable_sla_breach_notifications,
              async_updating, user_records, revenue::text, prod_numeric_grade,
              tid, technical_contact_id, team_manager_id, product_manager_id,
              created::text, updated::text
         FROM dojo_product WHERE id = $1`,
      [id],
    );
  }

  async findByName(name: string): Promise<ProductRow | undefined> {
    return queryOne<ProductRow>(
      `SELECT id, name, description, prod_type_id, sla_configuration_id,
              business_criticality, platform, lifecycle, origin,
              external_audience, internet_accessible,
              enable_simple_risk_acceptance, enable_full_risk_acceptance,
              enable_product_tag_inheritance, disable_sla_breach_notifications,
              async_updating, user_records, revenue::text, prod_numeric_grade,
              tid, technical_contact_id, team_manager_id, product_manager_id,
              created::text, updated::text
         FROM dojo_product WHERE name = $1`,
      [name],
    );
  }

  async listAll(limit = 50): Promise<ProductRow[]> {
    return query<ProductRow>(
      `SELECT id, name, description, prod_type_id, sla_configuration_id,
              business_criticality, platform, lifecycle, origin,
              external_audience, internet_accessible,
              enable_simple_risk_acceptance, enable_full_risk_acceptance,
              enable_product_tag_inheritance, disable_sla_breach_notifications,
              async_updating, user_records, revenue::text, prod_numeric_grade,
              tid, technical_contact_id, team_manager_id, product_manager_id,
              created::text, updated::text
         FROM dojo_product ORDER BY id DESC LIMIT $1`,
      [limit],
    );
  }

  async deleteById(id: number): Promise<void> {
    await query('DELETE FROM dojo_product WHERE id = $1', [id]);
  }
}

export class ProductTypeRepo {
  async findByName(name: string): Promise<ProductTypeRow | undefined> {
    return queryOne<ProductTypeRow>(
      `SELECT id, name, description, critical_product, key_product,
              created::text, updated::text
         FROM dojo_product_type WHERE name = $1`,
      [name],
    );
  }

  async create(input: { name: string; critical_product?: boolean; key_product?: boolean; description?: string } = {} as any): Promise<ProductTypeRow> {
    const inserted = await queryOne<ProductTypeRow>(
      `INSERT INTO dojo_product_type (name, description, critical_product, key_product)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, description, critical_product, key_product,
                 created::text, updated::text`,
      [
        input.name,
        input.description ?? null,
        input.critical_product ?? false,
        input.key_product ?? false,
      ],
    );
    if (!inserted) throw new Error(`Failed to insert ProductType '${input.name}'`);
    return inserted;
  }

  /**
   * Look up a ProductType by name; insert with sensible defaults if absent.
   * Used by ProductFactory.create() callers that don't care about the type.
   */
  async findOrCreate(name: string): Promise<ProductTypeRow> {
    const existing = await this.findByName(name);
    if (existing) return existing;
    return this.create({ name, critical_product: false, key_product: false });
  }
}

export class SlaConfigurationRepo {
  async findById(id: number): Promise<SlaConfigurationRow | undefined> {
    return queryOne<SlaConfigurationRow>(
      `SELECT id, name, description, created::text, updated::text
         FROM dojo_sla_configuration WHERE id = $1`,
      [id],
    );
  }
}
