import type { Severity } from './severity.model';
import type { FindingStatus } from './finding-status.model';

export interface FindingModel {
  title: string;
  description: string;
  severity: Severity;
  status: FindingStatus;
  product?: string;  // resolved to id by the create form
  engagement?: string;
  cwe?: number;
  cvssScore?: number;
  impact?: string;
  references?: string;
  mitigation?: string;
}
