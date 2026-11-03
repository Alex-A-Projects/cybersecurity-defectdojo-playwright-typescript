import type { APIRequestContext } from '@playwright/test';
import { BaseApiClient } from './base.client';

const API_TOKEN_PATH = '/api-token-auth/';

export interface ApiTokenResponse {
  token: string;
}

/**
 * Auth client — DRF token endpoint (v2 path).
 *
 * Verified against the v2 OpenAPI spec on 2026-10-20:
 *   POST `/api/v2/api-token-auth/`
 *     Content-Type: application/x-www-form-urlencoded (or multipart/form-data)
 *     Body: { username: string, password: string }
 *
 * Sending JSON returns 400 / 415 on the live sandbox.
 */
export class AuthApiClient extends BaseApiClient {
  protected readonly basePath = '/api/v2';

  constructor(http: APIRequestContext) {
    super(http);
  }

  async getToken(username: string, password: string): Promise<string> {
    const body = await this.post<ApiTokenResponse>(API_TOKEN_PATH, {
      form: { username, password },
    });
    return body.token;
  }
}
