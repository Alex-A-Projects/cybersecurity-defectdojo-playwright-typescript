/**
 * Tag constants — the single source of truth for suite/type tags.
 * Inline `@tag` strings in test files are a defect; use `Tags.X` or `featureTag('…')`.
 */
export const Tags = {
  SMOKE: '@smoke',
  SANITY: '@sanity',
  REGRESSION: '@regression',
  NEGATIVE: '@negative',
  BOUNDARY: '@boundary',
  E2E: '@e2e',
  SECURITY: '@security',
  ACCESSIBILITY: '@accessibility',
  CRITICAL: '@critical',
  /** Framework-level smoke / infrastructure test. Opts out of feature gating. */
  INFRA: '@infra',
} as const;

export const FEATURE_PREFIX = '@feature:';

export const featureTag = (name: string): string => `${FEATURE_PREFIX}${name}`;
