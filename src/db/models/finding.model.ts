/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Mirror of the DefectDojo `dojo_finding` Postgres table.
 *
 * Schema derived from `dojo/finding/models.py` on 2026-10-20.
 *
 * Important: DefectDojo's Finding has NO direct `product_id`, `engagement_id`,
 * or `status` columns. The product/engagement chain runs through `test_id`
 * (FK → `dojo_test`, which has `engagement_id` which → `dojo_product`). The
 * "status" pseudo-column is computed by a Python @property in the model;
 * it's not persisted.
 *
 * `severity` is CHECK-constrained to five values (`Info / Low / Medium /
 * High / Critical`) per the model's choices tuple.
 */
export const SEVERITIES = ['Info', 'Low', 'Medium', 'High', 'Critical'] as const;
export type Severity = typeof SEVERITIES[number];

export interface FindingRow {
  id: number;
  title: string;
  date: string;                                // date NOT NULL DEFAULT CURRENT_DATE
  sla_start_date: string | null;
  sla_expiration_date: string | null;
  cwe: number | null;
  cve: string | null;
  epss_score: string | null;                   // numeric(5,2) — string-cast
  epss_percentile: string | null;
  known_exploited: boolean;
  ransomware_used: boolean;
  kev_date: string | null;
  url: string | null;
  severity: Severity;                          // CHECK-constrained
  description: string | null;
  mitigation: string | null;
  fix_available: boolean | null;
  fix_version: string | null;
  impact: string | null;
  steps_to_reproduce: string | null;
  severity_justification: string | null;
  references: string | null;
  /** FK NOT NULL → dojo_test, which links to engagement → product. */
  test_id: number;
  active: boolean;
  verified: boolean;
  false_p: boolean;
  duplicate: boolean;
  duplicate_finding_id: number | null;
  out_of_scope: boolean;
  risk_accepted: boolean;
  under_review: boolean;
  is_mitigated: boolean;
  thread_id: number;
  last_status_update: string;
  last_reviewed: string | null;
  numerical_severity: string | null;
  hash_code: string | null;
  line: number | null;
  file_path: string | null;
  component_name: string | null;
  component_version: string | null;
  static_finding: boolean;
  dynamic_finding: boolean;
  scanner_confidence: number | null;
  sonarqube_issue_id: number | null;
  unique_id_from_tool: string | null;
  vuln_id_from_tool: string | null;
  sast_source_object: string | null;
  sast_sink_object: string | null;
  sast_source_line: number | null;
  sast_source_file_path: string | null;
  nb_occurences: number | null;
  publish_date: string | null;
  service: string | null;
  planned_remediation_date: string | null;
  planned_remediation_version: string | null;
  effort_for_fixing: string | null;
  reporter_id: number | null;
  review_requested_by_id: number | null;
  defect_review_requested_by_id: number | null;
  last_reviewed_by_id: number | null;
  mitigated_by_id: number | null;
  mitigated: string | null;
  created: string;
  updated: string;
}
