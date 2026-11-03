import dotenv from 'dotenv';
import * as path from 'path';

// Resolves to <repoRoot>/.env (same target as Paths.rootEnvFile).
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const TEST_ENV = (process.env.TEST_ENV ?? 'demo').toLowerCase();

// ── Frontend / UI base URLs ────────────────────────────────────────────
// Read lazily (inside the getter below) rather than at module load, so a
// suite that never talks HTTP — the DB suite imports this module for its
// `env.db` config only — does not fail on a missing DEMO_BASE_URL.
const UI_BASE_URL_BY_ENV: Record<string, string | undefined> = {
  demo: process.env.DEMO_BASE_URL,
};

function pickBaseUrl(
  map: Record<string, string | undefined>,
  envName: string,
  family: 'UI' | 'API',
): string {
  const url = map[envName];
  if (!url) {
    const known = Object.keys(map).join(', ');
    throw new Error(
      `No ${family} base URL resolved for TEST_ENV="${envName}". ` +
      `Set DEMO_${family === 'UI' ? 'BASE' : 'API'}_URL (or pick one of: ${known}).`,
    );
  }
  return url;
}

// ── Backend / API base URLs (independent axis) ─────────────────────────
const API_BASE_URL_BY_ENV: Record<string, string | undefined> = {
  demo: process.env.DEMO_API_URL,
};

const cookieDomain = process.env.COOKIE_DOMAIN ?? 'demo.defectdojo.org';

// ── DB connection (defensive — DB suite is the primary consumer) ────────
export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
}

function readDbConfig(): DbConfig {
  return {
    host: process.env.DD_DB_HOST ?? 'localhost',
    port: Number(process.env.DD_DB_PORT ?? 5432),
    database: process.env.DD_DB_NAME ?? 'defectdojo',
    user: process.env.DD_DB_USER ?? 'defectdojo',
    password: process.env.DD_DB_PASSWORD ?? 'defectdojo',
    ssl: (process.env.DD_DB_SSL ?? 'false').toLowerCase() === 'true',
  };
}

export const env = {
  testEnv: TEST_ENV,
  cookieDomain,
  testUser: process.env.TEST_USER ?? '',
  testPassword: process.env.TEST_PASSWORD ?? '',
  db: readDbConfig(),
  testTimeoutMs: Number(process.env.TEST_TIMEOUT ?? 30000),

  /**
   * Frontend base URL. Resolved on access, not at import — the DB suite
   * imports this module for `env.db` only and must not require DEMO_BASE_URL.
   */
  get uiBaseURL(): string {
    return pickBaseUrl(UI_BASE_URL_BY_ENV, TEST_ENV, 'UI');
  },

  /**
   * Backend base URL. Resolved on access for the same reason as `uiBaseURL`.
   */
  get apiBaseURL(): string {
    return pickBaseUrl(API_BASE_URL_BY_ENV, TEST_ENV, 'API');
  },
} as const;

/**
 * Resolves the backend/API base URL with three-tier precedence:
 *   per-test  →  run-level `*_API_URL` already in API_BASE_URL_BY_ENV  →  same as UI base URL.
 * The two axes (UI frontend env, API backend env) are independent and may differ.
 */
export function effectiveApiBaseUrl(perTestApiUrl?: string): string {
  if (perTestApiUrl && perTestApiUrl.length > 0) {
    return perTestApiUrl;
  }
  return env.apiBaseURL;
}
