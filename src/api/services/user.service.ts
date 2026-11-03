import { UserApiClient } from '../clients/user.client';
import type { UserDto } from '../models/user.model';

export class UserService {
  constructor(
    private readonly client: UserApiClient,
    private readonly headers: Record<string, string>,
  ) {}

  async list(limit = 25): Promise<UserDto[]> {
    const resp = await this.client.list(this.headers, { limit });
    return resp.results;
  }

  async getById(id: number): Promise<UserDto> {
    return this.client.getOne(id, this.headers);
  }
}
