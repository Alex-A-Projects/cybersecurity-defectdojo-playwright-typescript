import { query, queryOne } from '../clients/pool.client';
import type { EngagementRow } from '../models/engagement.model';

/*
 * Engagement repository — direct SQL against DefectDojo's `dojo_engagement`.
 * Schema derived from `dojo/engagement/models.py` on 2026-10-20.
 */
export class EngagementRepo {
  async findById(id: number): Promise<EngagementRow | undefined> {
    return queryOne<EngagementRow>(
      `SELECT id, name, description, version,
              to_char(first_contacted, 'YYYY-MM-DD') AS first_contacted,
              to_char(target_start,  'YYYY-MM-DD') AS target_start,
              to_char(target_end,    'YYYY-MM-DD') AS target_end,
              product_id, active, status, progress,
              threat_model, api_test, pen_test, check_list,
              deduplication_on_engagement, done_testing,
              engagement_type, tracker, test_strategy,
              build_id, commit_hash, branch_tag,
              source_code_management_uri, reason,
              lead_id, requester_id, preset_id, report_type_id,
              created::text, updated::text
         FROM dojo_engagement WHERE id = $1`,
      [id],
    );
  }

  async findByName(name: string): Promise<EngagementRow | undefined> {
    return queryOne<EngagementRow>(
      `SELECT id, name, description, version,
              to_char(first_contacted, 'YYYY-MM-DD') AS first_contacted,
              to_char(target_start,  'YYYY-MM-DD') AS target_start,
              to_char(target_end,    'YYYY-MM-DD') AS target_end,
              product_id, active, status, progress,
              threat_model, api_test, pen_test, check_list,
              deduplication_on_engagement, done_testing,
              engagement_type, tracker, test_strategy,
              build_id, commit_hash, branch_tag,
              source_code_management_uri, reason,
              lead_id, requester_id, preset_id, report_type_id,
              created::text, updated::text
         FROM dojo_engagement WHERE name = $1`,
      [name],
    );
  }

  async listForProduct(productId: number, limit = 50): Promise<EngagementRow[]> {
    return query<EngagementRow>(
      `SELECT id, name, description, version,
              to_char(first_contacted, 'YYYY-MM-DD') AS first_contacted,
              to_char(target_start,  'YYYY-MM-DD') AS target_start,
              to_char(target_end,    'YYYY-MM-DD') AS target_end,
              product_id, active, status, progress,
              threat_model, api_test, pen_test, check_list,
              deduplication_on_engagement, done_testing,
              engagement_type, tracker, test_strategy,
              build_id, commit_hash, branch_tag,
              source_code_management_uri, reason,
              lead_id, requester_id, preset_id, report_type_id,
              created::text, updated::text
         FROM dojo_engagement WHERE product_id = $1 ORDER BY id DESC LIMIT $2`,
      [productId, limit],
    );
  }

  async deleteById(id: number): Promise<void> {
    await query('DELETE FROM dojo_engagement WHERE id = $1', [id]);
  }
}
