/* eslint-disable @typescript-eslint/naming-convention */
/**
 * Minimal Django `auth_user` row. The full DefectDojo model extends this via
 * a `Dojo_User` profile, but our DB suite doesn't need that — only the
 * columns we FK-reference (e.g. `lead_id`, `reporter_id`).
 */
export interface UserRow {
  id: number;
  username: string;
  password: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  date_joined: string;
}
