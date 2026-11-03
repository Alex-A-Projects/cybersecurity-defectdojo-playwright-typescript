import fs from 'fs';
import { Paths } from './paths';
import { env } from './env';

interface PolicyJson {
  envs: Record<string, { features: Record<string, boolean> }>;
}

/**
 * Reads `config/test-policy.json` and answers:
 *   isDeclared(feature) — does the feature exist in the matrix?
 *   isEnabled(feature)  — is it `true` for the current TEST_ENV?
 *   skipReason(feature) — the skip message Playwright will record.
 *
 * Construction is cheap; instantiate once per suite process.
 */
export class PolicyEngine {
  private readonly features: Record<string, boolean>;

  constructor() {
    const raw = fs.readFileSync(Paths.testPolicyFile, 'utf-8');
    const parsed: PolicyJson = JSON.parse(raw);
    const envEntry = parsed.envs[env.testEnv];
    if (!envEntry) {
      const known = Object.keys(parsed.envs).join(', ');
      throw new Error(
        `TEST_ENV="${env.testEnv}" is not defined in config/test-policy.json. ` +
        `Known envs: ${known}.`,
      );
    }
    this.features = envEntry.features ?? {};
  }

  isDeclared(featureName: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.features, featureName);
  }

  isEnabled(featureName: string): boolean {
    return this.isDeclared(featureName) && this.features[featureName] === true;
  }

  skipReason(featureName: string): string {
    return `Feature "${featureName}" is disabled in ${env.testEnv}.`;
  }
}
