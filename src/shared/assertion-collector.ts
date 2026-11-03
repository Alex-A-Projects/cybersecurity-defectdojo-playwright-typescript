/**
 * Multi-failure collection helper.
 *
 * Playwright's default `expect(...)` short-circuits on the first failure. When a
 * test verifies several independent UI/API facts, we want them ALL reported in
 * one shot, not just the first. This helper mirrors the pattern in the reference
 * framework: collect failures, then assert at the end that the failure list is
 * empty.
 *
 * Usage:
 *
 *   const failed: string[] = [];
 *   await collect('submit button visible', () => expect(submit).toBeVisible(), failed);
 *   await collect('header text matches', () => expect(header).toHaveText(/Welcome/i), failed);
 *   expect(failed, `Not visible: ${failed.join(', ')}`).toEqual([]);
 */
export async function collect(
  description: string,
  fn: () => Promise<unknown>,
  failures: string[],
): Promise<void> {
  try {
    await fn();
  } catch (err) {
    failures.push(`${description}: ${(err as Error).message.split('\n')[0]}`);
  }
}

/**
 * Sync variant. Not used much in Playwright, but useful when checking
 * multiple plain values.
 */
export function collectSync(description: string, fn: () => void, failures: string[]): void {
  try {
    fn();
  } catch (err) {
    failures.push(`${description}: ${(err as Error).message.split('\n')[0]}`);
  }
}
