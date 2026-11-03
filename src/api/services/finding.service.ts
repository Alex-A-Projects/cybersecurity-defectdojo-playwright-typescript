import { FindingApiClient } from '../clients/finding.client';
import type { FindingDto, Severity } from '../models/finding.model';
import { uniqueFindingTitle } from '../../shared/generators';

/**
 * DefectDojo maps each `severity` to a `numerical_severity` code:
 *   Critical → S0
 *   High     → S1
 *   Medium   → S2
 *   Low      → S3
 *   Info     → S4
 *
 * Source: dojo/finding/models.py (Finding.get_numerical_severity), confirmed
 * against the v2 OpenAPI spec on 2026-10-20.
 */
function numericalSeverityFor(severity: Severity | undefined): string | undefined {
  switch (severity) {
    case 'Critical': return 'S0';
    case 'High':     return 'S1';
    case 'Medium':   return 'S2';
    case 'Low':      return 'S3';
    case 'Info':     return 'S4';
    default:         return undefined;
  }
}

/**
 * Finding service — DefectDojo v2.
 *
 * Hard requirement from the OpenAPI spec: a Finding must be created via
 * the chain Product → Engagement → Test → TestType, with `test` (FK),
 * `found_by` (test_type IDs), and `numerical_severity` (S0..S4) on the
 * Finding POST body. The defaults here satisfy the minimal request —
 * pass `testId` and `foundBy` to override.
 */
export class FindingService {
  constructor(
    private readonly client: FindingApiClient,
    private readonly headers: Record<string, string>,
  ) {}

  async list(opts: { limit?: number; test?: number; severity?: string } = {}): Promise<FindingDto[]> {
    const resp = await this.client.list(this.headers, {
      limit: opts.limit ?? 25,
      test: opts.test,
      severity: opts.severity,
    });
    return resp.results;
  }

  /**
   * Create a Finding.
   *
   * @param input.testId   DefectDojo requires this. FK to /api/v2/tests/.
   * @param input.foundBy  Array of test_type ids. Required by DefectDojo.
   * @param input.severity Title-Case; default 'Medium'. numerical_severity
   *                       is derived automatically (S0..S4) unless overridden.
   */
  async create(
    input: { testId: number; foundBy: number[] } & Partial<FindingDto> & { severity?: Severity; numerical_severity?: string } = {
      testId: 1,
      foundBy: [1],
    },
  ): Promise<FindingDto> {
    const severity = input.severity ?? 'Medium';
    const payload: Partial<FindingDto> = {
      title: input.title ?? uniqueFindingTitle('api'),
      description: input.description ?? 'Auto-generated via API service.',
      severity,
      numerical_severity: input.numerical_severity ?? numericalSeverityFor(severity),
      test: input.testId,
      found_by: input.foundBy,
      active: input.active ?? true,
      verified: input.verified ?? false,
      false_p: input.false_p ?? false,
      duplicate: input.duplicate ?? false,
      out_of_scope: input.out_of_scope ?? false,
      risk_accepted: input.risk_accepted ?? false,
      under_review: input.under_review ?? false,
      is_mitigated: input.is_mitigated ?? false,
      ...input,
    };
    return this.client.create(payload, this.headers);
  }

  async getById(id: number): Promise<FindingDto> {
    return this.client.getOne(id, this.headers);
  }

  async update(id: number, patch: Partial<FindingDto>): Promise<FindingDto> {
    return this.client.update(id, patch, this.headers);
  }

  async delete(id: number): Promise<void> {
    await this.client.deleteOne(id, this.headers);
  }
}
