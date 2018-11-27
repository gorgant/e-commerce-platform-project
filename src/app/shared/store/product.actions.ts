import { Action } from '@ngrx/store';
import { Product } from '../models/product';
import { Update } from '@ngrx/entity';


export enum ProductActionTypes {
  ProductRequested = '[Product Resolver] Product Requested',
  ProductLoaded = '[Products API] Product Loaded',
  AllProductsRequested = '[Admin Products or Catalogue] All Products Requested',
  AllProductsLoaded = '[Products API] All Products Loaded',
  ProductUpdateRequested = '[Admin Product Form] Product Update Requested',
  ProductUpdated = '[Products API] Product Updated',
  ProductAddRequested = '[Admin Product Form] Product Add Requested',
  ProductAdded = '[Products API] Product Added',
  ProductDeleteRequested = '[Admin Product Form] Product Delete Requested ',
  ProductDeleted = '[Products API] Product Deleted',
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

  constructor(public payload: {product: Update<Product>}) {}
}

export class ProductAddRequested implements Action {
  readonly type = ProductActionTypes.ProductAddRequested;

  constructor(public payload: {product: Product}) {}
}

export class ProductAdded implements Action {
  readonly type = ProductActionTypes.ProductAdded;

  constructor(public payload: {product: Product}) {}
}

export class ProductDeleteRequested implements Action {
  readonly type = ProductActionTypes.ProductDeleteRequested;

  constructor(public payload: {productId: string}) {}
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
  ProductAddRequested |
  ProductAdded |
  ProductDeleteRequested |
  ProductDeleted;
