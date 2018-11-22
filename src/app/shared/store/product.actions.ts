import { Action } from '@ngrx/store';
import { Product } from '../models/product';


export enum ProductActionTypes {
  ProductListRequested = '[View Products Pages] Product List Requested',
  ProductListLoaded = '[Products API] Products List Loaded',
  ProductRequested = '[Product Resolver] Product Requested',
  ProductLoaded = '[Products API] Product Loaded'
}

export class ProductListRequested implements Action {
  readonly type = ProductActionTypes.ProductListRequested;

}

export class ProductListLoaded implements Action {
  readonly type = ProductActionTypes.ProductListLoaded;

  constructor(public payload: {products: Product[]}) {}

}

export class ProductRequested implements Action {
  readonly type = ProductActionTypes.ProductRequested;

  constructor(public payload: {productId: string}) {}

}
export class ProductLoaded implements Action {
  readonly type = ProductActionTypes.ProductLoaded;

  constructor(public payload: {product: Product}) {}

}

export type ProductActions = ProductListRequested | ProductListLoaded | ProductRequested | ProductLoaded;
