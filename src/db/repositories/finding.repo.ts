import { query, queryOne } from '../clients/pool.client';
import type { FindingRow } from '../models/finding.model';

/*
 * Finding repository — direct SQL against DefectDojo's `dojo_finding`.
 *
 * Schema derived from `dojo/finding/models.py` on 2026-10-20.
 *
 * IMPORTANT: DefectDojo's Finding has NO direct `product_id`, `engagement_id`,
 * or `status` columns. The product/engagement chain runs through `test_id`,
 * which bridges to `dojo_test → dojo_engagement → dojo_product`. Use the
 * `listForTest(testId, ...)` method below for product-scoped queries.
 */
export class FindingRepo {
  /** Columns we read — keeps SELECT in one place so future schema drifts are loud. */
  private static readonly COLUMNS = `
    id, title, to_char(date, 'YYYY-MM-DD') AS date,
    sla_start_date, sla_expiration_date, cwe, cve,
    epss_score, epss_percentile, known_exploited, ransomware_used, kev_date,
    url, severity, description, mitigation, fix_available, fix_version,
    impact, steps_to_reproduce, severity_justification,
    "references",
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
  `;

  async findById(id: number): Promise<FindingRow | undefined> {
    return queryOne<FindingRow>(
      `SELECT ${FindingRepo.COLUMNS} FROM dojo_finding WHERE id = $1`,
      [id],
    );
  }

  async findByTitle(title: string): Promise<FindingRow | undefined> {
    return queryOne<FindingRow>(
      `SELECT ${FindingRepo.COLUMNS} FROM dojo_finding WHERE title = $1`,
      [title],
    );
  }

  /** List findings belonging to a test (FK chain → engagement → product). */
  async listForTest(testId: number, limit = 50): Promise<FindingRow[]> {
    return query<FindingRow>(
      `SELECT ${FindingRepo.COLUMNS} FROM dojo_finding
        WHERE test_id = $1 ORDER BY id DESC LIMIT $2`,
      [testId, limit],
    );
  }

  /** List findings whose test belongs to the given engagement. */
  async listForEngagement(engagementId: number, limit = 50): Promise<FindingRow[]> {
    return query<FindingRow>(
      `SELECT ${FindingRepo.COLUMNS} FROM dojo_finding
         WHERE test_id IN (SELECT id FROM dojo_test WHERE engagement_id = $1)
         ORDER BY id DESC LIMIT $2`,
      [engagementId, limit],
    );
  }

  /** List findings across the product via the test→engagement chain. */
  async listForProduct(productId: number, limit = 50): Promise<FindingRow[]> {
    return query<FindingRow>(
      `SELECT ${FindingRepo.COLUMNS} FROM dojo_finding
         WHERE test_id IN (
           SELECT t.id FROM dojo_test t
             JOIN dojo_engagement e ON t.engagement_id = e.id
            WHERE e.product_id = $1
         )
         ORDER BY id DESC LIMIT $2`,
      [productId, limit],
    );
  }

  async deleteById(id: number): Promise<void> {
    await query('DELETE FROM dojo_finding WHERE id = $1', [id]);
  }
}
