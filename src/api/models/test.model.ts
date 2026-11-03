/* eslint-disable @typescript-eslint/naming-convention */
/**
 * v2 Test DTO.
 *
 * Source of truth: /api/v2/oa3/schema/?format=json (DefectDojo).
 * `TestRequest.required = [engagement, target_start, target_end, test_type]`.
 */
export interface TestDto {
  id: number;
  title?: string;
  description?: string;
  target_start: string;       // date
  target_end: string;         // date
  engagement: number;          // FK → engagement
  test_type: number;           // FK → test_type
  percent_complete?: number;
  version?: string;
  build_id?: string;
  commit_hash?: string;
  branch_tag?: string;
  lead?: number;
  scan_type?: string;
}
