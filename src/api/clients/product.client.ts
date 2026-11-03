/**
 * @deprecated Use `AssetApiClient` from `./asset.client` (path was `/products/` historically;
 * the v2 spec uses `/assets/`). This file is a thin alias kept for backward
 * compat with code that imported `ProductApiClient` before the rename.
 */
import { AssetApiClient as ProductApiClient } from './asset.client';
export { ProductApiClient };
export type { AssetListResponse as ProductListResponse } from './asset.client';
