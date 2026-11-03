/* eslint-disable @typescript-eslint/naming-convention */
/** Mirror of the `dojo_test` table — bridge between Engagement and Finding. */
export interface TestRow {
  id: number;
  engagement_id: number;
  test_type_id: number;
  target_start: string | null;
  target_end: string | null;
  created: string;
  updated: string;
}
