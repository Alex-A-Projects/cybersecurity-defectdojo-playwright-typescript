export type UserRole = 'Superuser' | 'Staff' | 'API User' | 'Reader';

export interface UserModel {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
}
