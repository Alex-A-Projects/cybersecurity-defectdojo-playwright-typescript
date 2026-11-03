/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Mirror of the DefectDojo `dojo_product` (+ sibling) Postgres tables.
 *
 * Field names mirror the Django-generated columns exactly so raw SQL works.
 * Schema derived from `dojo/product/models.py` and
 * `dojo/product_type/models.py` on 2026-10-20.
 */
export interface ProductRow {
  id: number;
  name: string;
  description: string;                          // NOT NULL in the schema
  prod_type_id: number;                         // FK NOT NULL → dojo_product_type
  sla_configuration_id: number;                 // FK NOT NULL → dojo_sla_configuration
  business_criticality:
    | 'very high' | 'high' | 'medium' | 'low' | 'very low' | 'none' | null;
  platform: string | null;
  lifecycle: string | null;
  origin: string | null;
  external_audience: boolean;
  internet_accessible: boolean;
  enable_simple_risk_acceptance: boolean;
  enable_full_risk_acceptance: boolean;
  enable_product_tag_inheritance: boolean;
  disable_sla_breach_notifications: boolean;
  async_updating: boolean;
  user_records: number | null;
  revenue: string | null;                       // numeric(15,2)
  prod_numeric_grade: number | null;
  tid: number;
  technical_contact_id: number | null;
  team_manager_id: number | null;
  product_manager_id: number | null;
  created: string;
  updated: string;
}

export interface ProductTypeRow {
  id: number;
  name: string;
  description: string | null;
  critical_product: boolean;
  key_product: boolean;
  created: string;
  updated: string;
}

export interface SlaConfigurationRow {
  id: number;
  name: string;
  description: string | null;
  created: string;
  updated: string;
}
