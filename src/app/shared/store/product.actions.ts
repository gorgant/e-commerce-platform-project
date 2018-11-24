import { Action } from '@ngrx/store';
import { Product } from '../models/product';
import { Update } from '@ngrx/entity';


export enum ProductActionTypes {
  ProductRequested = '[Product Resolver] Product Requested',
  ProductLoaded = '[Products API] Product Loaded',
  AllProductsRequested = '[Admin Products or Catalogue] Product List Requested',
  AllProductsLoaded = '[Products API] Products List Loaded',
  ProductUpdateRequested = '[Admin Product Form] Product Update Requested',
  ProductUpdated = '[Admin Product Form] Product Updated',
  ProductAdded = '[Admin Product Form] Product Added',
  ProductDeleted = '[Admin Product Form] Product Deleted',
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

export class ProductUpdateRequested implements Action {
  readonly type = ProductActionTypes.ProductUpdateRequested;

  constructor(public payload: {product: Product}) { }
}

export class ProductUpdated implements Action {
  readonly type = ProductActionTypes.ProductUpdated;

  // This Update type is a rxjs specific type
  constructor(public payload: {product: Update<Product>}) {}
}

export class ProductAdded implements Action {
  readonly type = ProductActionTypes.ProductAdded;

  constructor(public payload: {product: Product}) {}
}

export class ProductDeleted implements Action {
  readonly type = ProductActionTypes.ProductDeleted;

  constructor(public payload: {productId: string}) {}
}

export type ProductActions =
  AllProductsRequested |
  AllProductsLoaded |
  ProductRequested |
  ProductLoaded |
  ProductUpdateRequested |
  ProductUpdated |
  ProductAdded |
  ProductDeleted;
