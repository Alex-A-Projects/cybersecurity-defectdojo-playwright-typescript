import { queryOne } from '../clients/pool.client';
import { uniqueFindingTitle } from '../../shared/generators';
import type { FindingRow, Severity } from '../models/finding.model';

/**
 * Finding factory — inserts a row into `dojo_finding`.
 *
 * DefectDojo's Finding FK chain:
 *   Finding.test_id → Test → Engagement → Product → ProductType
 *
 * `test_id` is therefore required (NOT NULL in the schema). Pass one in.
 *
 * The Finding table has NO direct `product_id`, `engagement_id`, or `status`
 * columns. If your spec needs them, JOIN through `dojo_test` (use
 * `FindingRepo.listForProduct` / `listForEngagement`).
 */
export class FindingFactory {
  async create(
    input: { testId: number } & Partial<FindingRow> & {
      severity?: Severity;
      active?: boolean;
      verified?: boolean;
    } = { testId: 1 },
  ): Promise<FindingRow> {
    const row = await queryOne<FindingRow>(
      `INSERT INTO dojo_finding (
          title, description, severity,
          test_id, active, verified, false_p, duplicate,
          out_of_scope, risk_accepted, under_review, is_mitigated,
          thread_id, last_status_update,
          static_finding, dynamic_finding
        )
        VALUES (
          $1, $2, $3,
          $4, $5, $6, false, false,
          false, false, false, false,
          0, NOW(),
          false, true
        )
        RETURNING
          id, title, to_char(date, 'YYYY-MM-DD') AS date,
          sla_start_date, sla_expiration_date, cwe, cve,
          epss_score, epss_percentile, known_exploited, ransomware_used, kev_date,
          url, severity, description, mitigation, fix_available, fix_version,
          impact, steps_to_reproduce, severity_justification, "references",
          test_id, active, verified, false_p, duplicate, duplicate_finding_id,
          out_of_scope, risk_accepted, under_review, is_mitigated,
          thread_id, last_status_update, last_reviewed,
          numerical_severity, hash_code, line, file_path, component_name,
          component_version, static_finding, dynamic_finding, scanner_confidence,
          sonarqube_issue_id, unique_id_from_tool, vuln_id_from_tool,
          sast_source_object, sast_sink_object, sast_source_line,
          sast_source_file_path, nb_occurences, publish_date, service,
          planned_remediation_date, planned_remediation_version, effort_for_fixing,
          reporter_id, review_requested_by_id, defect_review_requested_by_id,
          last_reviewed_by_id, mitigated_by_id, mitigated,
          created::text, updated::text
      `,
      [
        input.title ?? uniqueFindingTitle('db'),
        input.description ?? 'DB-suite auto-generated finding',
        input.severity ?? 'Medium',
        input.testId,
        input.active ?? true,
        input.verified ?? false,
      ],
    );
    if (!row) throw new Error('FindingFactory.create() returned no row');
    return row;
  }
}
