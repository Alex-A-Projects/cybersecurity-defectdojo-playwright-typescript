/* eslint-disable @typescript-eslint/naming-convention */
/**
 * v2 Finding DTO.
 *
 * Source of truth: /api/v2/oa3/schema/?format=json (DefectDojo).
 * The schema's `FindingCreate.required` includes `test`, `found_by`,
 * `severity`, plus auto-populated fields. We mirror that shape here so the
 * service and factory can satisfy the API's required-field checks.
 */
export const SEVERITIES = ['Info', 'Low', 'Medium', 'High', 'Critical'] as const;
export type Severity = typeof SEVERITIES[number];

export interface FindingDto {
  id: number;
  title: string;
  description?: string;
  severity?: Severity;
  /** DefectDojo v2 FindingCreate requires `test` (FK). */
  test: number;
  /** DefectDojo v2 FindingCreate requires `found_by` (array of test_type ids). */
  found_by: number[];
  created?: string;
  updated?: string;
  active?: boolean;
  verified?: boolean;
  false_p?: boolean;
  duplicate?: boolean;
  out_of_scope?: boolean;
  risk_accepted?: boolean;
  under_review?: boolean;
  is_mitigated?: boolean;
  numerical_severity?: string;
  // …additional fields elided; their DTO shape matches the OpenAPI spec.
  [key: string]: unknown;
}
