export type EngagementStatus = 'Not Started' | 'Blocked' | 'In Progress' | 'Completed';

export interface EngagementModel {
  name: string;
  product: string; // product name; resolved via UI to a Product id
  targetStart: string; // ISO date
  targetEnd: string;   // ISO date
  status: EngagementStatus;
  description?: string;
}
