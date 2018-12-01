import { Action } from '@ngrx/store';
import { Product } from 'src/app/shared/models/product';
import { Update } from '@ngrx/entity';

export enum ActionTypes {
  PRODUCT_REQUESTED = '[Product Resolver] Product Requested',
  PRODUCT_LOADED = '[Products API] Product Loaded',
  ALL_PRODUCTS_REQUESTED = '[Nav Bar] All Products Requested',
  ALL_PRODUCTS_LOADED = '[Products API] All Products Loaded',
  LOAD_ERROR_DETECTED = '[Products API] Error loading',
  UPDATE_PRODUCT_REQUESTED = '[Admin Product Form] Product Update Requested',
  UPDATE_PRODUCT_COMPLETE = '[Products API] Product Updated',
  ADD_PRODUCT_REQUESTED = '[Admin Product Form] Product Add Requested',
  ADD_PRODUCT_COMPLETE = '[Products API] Product Added',
  DELETE_PRODUCT_REQUESTED = '[Admin Product Form] Product Delete Requested ',
  DELETE_PRODUCT_COMPLETE = '[Products API] Product Deleted',
}

export class ProductRequested implements Action {
  readonly type = ActionTypes.PRODUCT_REQUESTED;

  constructor(public payload: {productId: string}) {}
}

export class ProductLoaded implements Action {
  readonly type = ActionTypes.PRODUCT_LOADED;

  constructor(public payload: {product: Product}) {}
}

export class AllProductsRequested implements Action {
  readonly type = ActionTypes.ALL_PRODUCTS_REQUESTED;
}

export class AllProductsLoaded implements Action {
  readonly type = ActionTypes.ALL_PRODUCTS_LOADED;

  constructor(public payload: {products: Product[]}) {}
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.LOAD_ERROR_DETECTED;

  constructor(public payload: {error: string}) {}
}

export class UpdateProductRequested implements Action {
  readonly type = ActionTypes.UPDATE_PRODUCT_REQUESTED;

  constructor(public payload: {product: Product}) {}
}

export class UpdateProductComplete implements Action {
  readonly type = ActionTypes.UPDATE_PRODUCT_COMPLETE;

  constructor(public payload: {product: Update<Product>}) {}
}

export class AddProductRequested implements Action {
  readonly type = ActionTypes.ADD_PRODUCT_REQUESTED;

  constructor(public payload: {product: Product}) {}
}

export class AddProductComplete implements Action {
  readonly type = ActionTypes.ADD_PRODUCT_COMPLETE;

  constructor(public payload: {product: Product}) {}
}

export class DeleteProductRequested implements Action {
  readonly type = ActionTypes.DELETE_PRODUCT_REQUESTED;

  constructor(public payload: {productId: string}) {}
}

export class DeleteProductComplete implements Action {
  readonly type = ActionTypes.DELETE_PRODUCT_COMPLETE;

  constructor(public payload: {productId: string}) {}
}

export type Actions =
  AllProductsRequested |
  AllProductsLoaded |
  ProductRequested |
  ProductLoaded |
  LoadErrorDetected |
  UpdateProductRequested |
  UpdateProductComplete |
  AddProductRequested |
  AddProductComplete |
  DeleteProductRequested |
  DeleteProductComplete;
