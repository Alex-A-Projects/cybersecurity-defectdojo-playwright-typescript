import { queryOne } from '../clients/pool.client';
import { uniqueUsername } from '../../shared/generators';
import type { UserRow } from '../models/user.model';

/**
 * User factory — inserts a row into Django's `auth_user` table.
 *
 * NOTE: DefectDojo stores password as a Django PBKDF2 hash. Tests that need
 * password-based login must produce a hash the local Django instance accepts
 * (e.g. via `python -c "from django.contrib.auth.hashers import make_password; print(make_password('…'))"`).
 * Stub hash below lets tests construct users without a real login attempt.
 */
export class UserFactory {
  async create(overrides: Partial<UserRow> = {}): Promise<UserRow> {
    const placeholderHash = 'pbkdf2_sha256$600000$placeholder$placeholder';
    const row = await queryOne<UserRow>(
      `INSERT INTO auth_user (username, email, password, is_active, is_staff, is_superuser, first_name, last_name, date_joined)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id, username, email, first_name, last_name, is_active, is_superuser, is_staff, password, last_login::text, date_joined::text`,
      [
        overrides.username ?? uniqueUsername('db'),
        overrides.email ?? `${overrides.username ?? 'user'}@db.test.invalid`,
        overrides.password ?? placeholderHash,
        overrides.is_active ?? true,
        overrides.is_staff ?? false,
        overrides.is_superuser ?? false,
        overrides.first_name ?? null,
        overrides.last_name ?? null,
      ],
    );
    if (!row) throw new Error('UserFactory.create() returned no row');
    return row;
  }
}
