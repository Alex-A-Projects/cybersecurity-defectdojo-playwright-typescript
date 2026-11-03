/**
 * @deprecated Use `AssetDto` from `./asset.model`. The "product" naming was
 * historically used in this framework; the v2 REST spec calls the same
 * entity an "asset". This file is a thin alias kept for backward compat.
 */
export type {
  AssetDto as ProductDto,
  BusinessCriticality,
  ProductTypeDto,
} from './asset.model';
