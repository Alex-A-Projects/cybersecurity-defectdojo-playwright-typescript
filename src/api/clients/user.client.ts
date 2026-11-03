import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base.client';
import type { UserDto } from '../models/user.model';

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserDto[];
}

export class UserApiClient extends BaseApiClient {
  protected readonly basePath = '/api/v2';

  constructor(http: APIRequestContext) {
    super(http);
  }

  list(headers: Record<string, string>, params?: { limit?: number; offset?: number }): Promise<UserListResponse> {
    return this.get<UserListResponse>('/users/', { headers, params });
  }

  getOne(id: number, headers: Record<string, string>): Promise<UserDto> {
    return this.get<UserDto>(`/users/${id}/`, { headers });
  }
}
