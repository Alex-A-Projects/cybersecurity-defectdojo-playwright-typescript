export type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Info';

export const SEVERITIES: Severity[] = ['Critical', 'High', 'Medium', 'Low', 'Info'];

export const SEVERITY_BY_LABEL: Record<string, Severity> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Info',
};
