/**
 * DefectDojo Asset DTO.
 *
 * Source of truth: `/api/v2/oa3/schema/?format=json` (loaded 2026-10-20).
 * DefectDojo v2 calls "products" → **assets** at the API level. The model
 * fields below mirror the `Asset` and `AssetRequest` schemas.
 *
 * NOTE: the create minimum (required by POST `/api/v2/assets/`) is:
 *   - name (string, ≤ 255)
 *   - description (string, ≤ 4000)
 *   - organization (integer FK to Organization)
 */
export interface AssetDto {
  id: number;
  name: string;
  description: string;
  organization: number;
  business_criticality: BusinessCriticality | null;
  platform: string | null;
  lifecycle: string | null;
  origin: string | null;
  external_audience: boolean;
  internet_accessible: boolean;
  enable_simple_risk_acceptance: boolean;
  enable_full_risk_acceptance: boolean;
  disable_sla_breach_notifications: boolean;
  technical_contact: number | null;
  team_manager: number | null;
  sla_configuration: number;
  asset_managers: number | null;
  asset_numeric_grade: number | null;
  enable_asset_tag_inheritance: boolean;
  authorized_users: number[];
  regulations: number[];
  tags: string[];
  created: string | null;
  updated: string | null;
}

/** Lowercase, hyphen-insensitive — values as documented in the v2 schema. */
export type BusinessCriticality =
  | 'very high'
  | 'high'
  | 'medium'
  | 'low'
  | 'very low'
  | 'none'
  | '';

export interface ProductTypeDto {
  id: number;
  name: string;
  /** `critical_product` per the v2 ProductType schema. */
  critical_product: boolean;
  key_product: boolean;
  description?: string;
  created: string;
  updated: string;
}
