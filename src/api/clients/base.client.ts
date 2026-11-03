import type { APIRequestContext, APIResponse } from 'playwright-core';

const MAX_ERROR_BODY_CHARS = 300;

type ApiRequestOptions = {
  data?: unknown;
  /**
   * Form-encoded body. Pass instead of `data` for endpoints that require
   * `application/x-www-form-urlencoded` (e.g. `/api/v2/api-token-auth/`).
   * Playwright serialises to URLSearchParams and sets the Content-Type.
   */
  form?: Record<string, string | number | boolean>;
  params?: Record<string, string | number | boolean>;
  headers?: Record<string, string>;
};

/**
 * Base client for shared API request handling. Each concrete client extends
 * this with a `basePath` and typed methods that return domain DTOs.
 *
 * DefectDojo uses DRF Token auth by default; callers pass `Authorization`
 * per request via the `headers` option, not on the client itself.
 *
 * Path shapes here mirror the v2 OpenAPI spec as of 2026-10-20:
 *   /api/v2/api-token-auth/        form-encoded auth
 *   /api/v2/assets/                products (DefectDojo calls them assets in v2)
 *   /api/v2/engagements/
 *   /api/v2/findings/
 *   /api/v2/users/
 */
export abstract class BaseApiClient {
  protected abstract readonly basePath: string;

  constructor(protected readonly http: APIRequestContext) {}

  protected resolve(path: string): string {
    const base = this.basePath.replace(/\/$/, '');
    const rel = path.replace(/^\//, '');
    return rel ? `${base}/${rel}` : base;
  }

  protected async get<T>(path: string, opts?: ApiRequestOptions): Promise<T> {
    return this.sendRequest<T>('GET', path, opts);
  }

  protected async post<T>(path: string, opts?: ApiRequestOptions): Promise<T> {
    return this.sendRequest<T>('POST', path, opts);
  }

  protected async put<T>(path: string, opts?: ApiRequestOptions): Promise<T> {
    return this.sendRequest<T>('PUT', path, opts);
  }

  protected async patch<T>(path: string, opts?: ApiRequestOptions): Promise<T> {
    return this.sendRequest<T>('PATCH', path, opts);
  }

  protected async delete<T>(path: string, opts?: ApiRequestOptions): Promise<T> {
    return this.sendRequest<T>('DELETE', path, opts);
  }

  private async sendRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    opts?: ApiRequestOptions,
  ): Promise<T> {
    const url = this.resolve(path);
    const response: APIResponse = await this.dispatch(method, url, opts);

    if (!response.ok()) {
      const body = await response.text();
      throw new Error(
        `${method} ${url} → ${response.status()} ${response.statusText()} — ${body.slice(0, MAX_ERROR_BODY_CHARS)}`,
      );
    }

    const text = await response.text();
    if (text === '') return undefined as T;
    return JSON.parse(text) as T;
  }

  private async dispatch(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    opts?: ApiRequestOptions,
  ): Promise<APIResponse> {
    const headers = opts?.headers ?? {};
    const reqOpts = {
      headers,
      data: opts?.data,
      form: opts?.form,
      params: opts?.params,
    } as Parameters<APIRequestContext['get']>[1];
    switch (method) {
      case 'GET':    return this.http.get(url, reqOpts);
      case 'POST':   return this.http.post(url, reqOpts);
      case 'PUT':    return this.http.put(url, reqOpts);
      case 'PATCH':  return this.http.patch(url, reqOpts);
      case 'DELETE': return this.http.delete(url, reqOpts);
    }
  }
}
