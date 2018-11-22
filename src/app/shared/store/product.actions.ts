import { Action } from '@ngrx/store';
import { Product } from '../models/product';


export enum ProductActionTypes {
  ProductRequested = '[Product Resolver] Product Requested',
  ProductLoaded = '[Products API] Product Loaded',
  AllProductsRequested = '[Admin Products or Catalogue] Product List Requested',
  AllProductsLoaded = '[Products API] Products List Loaded',
}

export class ProductRequested implements Action {
  readonly type = ProductActionTypes.ProductRequested;

  constructor(public payload: {productId: string}) {}
}

export class ProductLoaded implements Action {
  readonly type = ProductActionTypes.ProductLoaded;

  constructor(public payload: {product: Product}) {}
}

export class AllProductsRequested implements Action {
  readonly type = ProductActionTypes.AllProductsRequested;
}

export class AllProductsLoaded implements Action {
  readonly type = ProductActionTypes.AllProductsLoaded;

  constructor(public payload: {products: Product[]}) {}
}

export type ProductActions =
  AllProductsRequested |
  AllProductsLoaded |
  ProductRequested |
  ProductLoaded;
