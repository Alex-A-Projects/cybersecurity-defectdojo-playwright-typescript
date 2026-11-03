/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Mirror of the DefectDojo `dojo_engagement` Postgres table.
 *
 * Schema derived from `dojo/engagement/models.py` on 2026-10-20.
 */
export const ENGAGEMENT_STATUSES = [
  'Not Started',
  'Blocked',
  'Cancelled',
  'Completed',
  'In Progress',
  'On Hold',
  'Scheduled',
  'Waiting for Resource',
] as const;

export type EngagementStatus = typeof ENGAGEMENT_STATUSES[number];

export interface EngagementRow {
  id: number;
  name: string | null;
  description: string | null;
  version: string | null;
  first_contacted: string | null;        // date
  target_start: string;                  // date NOT NULL
  target_end: string;                    // date NOT NULL
  product_id: number;                    // FK NOT NULL → dojo_product
  active: boolean;
  status: EngagementStatus | null;
  progress: string;
  threat_model: boolean;
  api_test: boolean;
  pen_test: boolean;
  check_list: boolean;
  deduplication_on_engagement: boolean;
  done_testing: boolean;
  engagement_type: 'Interactive' | 'CI/CD' | null;
  tracker: string | null;
  test_strategy: string | null;
  build_id: string | null;
  commit_hash: string | null;
  branch_tag: string | null;
  source_code_management_uri: string | null;
  reason: string | null;
  lead_id: number | null;                // FK → auth_user
  requester_id: number | null;
  preset_id: number | null;
  report_type_id: number | null;
  created: string;
  updated: string;
}
