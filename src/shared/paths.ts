import fs from 'fs';
import path from 'path';

/**
 * Locate the repo root by walking up to the `.git` marker.
 * `PROJECT_ROOT` overrides in monorepo or worktree scenarios.
 */
function findRepoRoot(startDir: string): string {
  if (process.env.PROJECT_ROOT) {
    return process.env.PROJECT_ROOT;
  }
  let current = startDir;
  while (true) {
    if (fs.existsSync(path.join(current, '.git'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      throw new Error(
        'Could not locate repo root (no .git directory found). ' +
        'Set the PROJECT_ROOT environment variable to override.',
      );
    }
    current = parent;
  }
}

const repoRoot = findRepoRoot(__dirname);

export const Paths = {
  repoRoot,
  configDir: path.join(repoRoot, 'config'),
  testPolicyFile: path.join(repoRoot, 'config', 'test-policy.json'),
  rootEnvFile: path.join(repoRoot, '.env'),
  apiDir: path.join(repoRoot, 'src', 'api'),
  uiDir: path.join(repoRoot, 'src', 'ui'),
  dbDir: path.join(repoRoot, 'src', 'db'),
  sharedDir: path.join(repoRoot, 'src', 'shared'),
  dbSeedDir: path.join(repoRoot, 'tests-db', 'fixtures', 'seed'),
  dbSeedFile: path.join(repoRoot, 'tests-db', 'fixtures', 'seed', 'initdb.sql'),
} as const;
