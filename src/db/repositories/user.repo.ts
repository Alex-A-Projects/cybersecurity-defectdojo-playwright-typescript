import { query, queryOne } from '../clients/pool.client';
import type { UserRow } from '../models/user.model';

/*
 * User repository — Django's `auth_user` table.
 *
 * The full DefectDojo model wraps `auth_user` via a `Dojo_User` profile, but the
 * DB suite only FK-references the bare users (e.g. `lead_id`, `reporter_id`),
 * so we read directly from `auth_user`.
 */
export class UserRepo {
  async findByUsername(username: string): Promise<UserRow | undefined> {
    return queryOne<UserRow>(
      `SELECT id, username, password, email, first_name, last_name,
              is_active, is_staff, is_superuser, last_login::text, date_joined::text
         FROM auth_user WHERE username = $1`,
      [username],
    );
  }

  async findById(id: number): Promise<UserRow | undefined> {
    return queryOne<UserRow>(
      `SELECT id, username, password, email, first_name, last_name,
              is_active, is_staff, is_superuser, last_login::text, date_joined::text
         FROM auth_user WHERE id = $1`,
      [id],
    );
  }

  async deleteByUsername(username: string): Promise<void> {
    await query('DELETE FROM auth_user WHERE username = $1', [username]);
  }
}
