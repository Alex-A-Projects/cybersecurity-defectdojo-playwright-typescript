/* eslint-disable @typescript-eslint/naming-convention */
/**
 * DefectDojo Engagement DTO — v2 API.
 *
 * Source of truth: `/api/v2/oa3/schema/?format=json` (OpenAPI 3). Status is
 * Title-Case per `dojo.engagement.ENGAGEMENT_STATUS_CHOICES`.
 */
export type EngagementStatus =
  | 'Not Started'
  | 'Blocked'
  | 'Cancelled'
  | 'Completed'
  | 'In Progress'
  | 'On Hold'
  | 'Scheduled'
  | 'Waiting for Resource';

export interface EngagementDto {
  id: number;
  name: string;
  description?: string;
  product: number;        // FK
  target_start: string;   // ISO date
  target_end: string;     // ISO date
  status: EngagementStatus;
  created: string;
  updated: string;
}
