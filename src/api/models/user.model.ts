export interface UserDto {
  id: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_staff?: boolean;
  // role-based, DefectDojo stores user permissions in a related model
}
