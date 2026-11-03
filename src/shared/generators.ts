/**
 * Test data generators.
 * Always use the suite-specific prefix (`ui-`, `api-`, `db-`) so trace data in
 * logs and databases is greppable by suite.
 */
export function uniqueId(prefix: 'ui' | 'api' | 'db'): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}-${ts}-${rand}`;
}

export function uniqueUsername(prefix: 'ui' | 'api' | 'db'): string {
  return uniqueId(prefix).replace(/-/g, '_');
}

export function uniqueEmail(prefix: 'ui' | 'api' | 'db'): string {
  return `${uniqueId(prefix)}@defectdojo.test`;
}

export function uniqueFindingTitle(prefix: 'ui' | 'api' | 'db'): string {
  return `Finding ${prefix}-${Date.now()}`;
}

export function uniqueProductName(prefix: 'ui' | 'api' | 'db'): string {
  return `Product ${prefix}-${Date.now()}`;
}

export function uniqueEngagementName(prefix: 'ui' | 'api' | 'db'): string {
  return `Engagement ${prefix}-${Date.now()}`;
}
