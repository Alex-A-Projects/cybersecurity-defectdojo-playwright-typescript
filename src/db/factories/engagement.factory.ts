import { queryOne } from '../clients/pool.client';
import { uniqueEngagementName } from '../../shared/generators';
import type { EngagementRow, EngagementStatus } from '../models/engagement.model';

/**
 * Engagement factory — inserts a row into `dojo_engagement`.
 *
 * DefectDojo's `status` choice list uses Title-Case values (e.g. "In Progress"),
 * matching `dojo.engagement.ENGAGEMENT_STATUS_CHOICES`. The factory defaults
 * to 'In Progress' so the choice is exercised rather than leaving NULL.
 */
export class EngagementFactory {
  async create(
    productId: number,
    overrides: Partial<EngagementRow> & { status?: EngagementStatus } = {},
  ): Promise<EngagementRow> {
    const today = new Date().toISOString().slice(0, 10);
    const twoWeeksOut = new Date(Date.now() + 14 * 86400_000).toISOString().slice(0, 10);

    const row = await queryOne<EngagementRow>(
      `INSERT INTO dojo_engagement (name, description, product_id, target_start, target_end, status, active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, name, description, version,
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
                 created::text, updated::text`,
      [
        overrides.name ?? uniqueEngagementName('db'),
        overrides.description ?? 'DB-suite auto-generated engagement',
        productId,
        overrides.target_start ?? today,
        overrides.target_end ?? twoWeeksOut,
        overrides.status ?? 'In Progress',
      ],
    );
    if (!row) throw new Error('EngagementFactory.create() returned no row');
    return row;
  }
}
