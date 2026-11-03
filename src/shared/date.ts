/**
 * Date helpers used across UI/API/DB suites.
 * DefectDojo's UI displays dates in `YYYY-MM-DD` (ISO) form for finding/engagement forms.
 */

export function toIsoDate(daysFromToday: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().slice(0, 10);
}

export function toIsoDateTime(daysFromToday: number = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString();
}

export function formatHumanDate(date: Date): string {
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}
