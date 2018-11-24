import { Action } from '@ngrx/store';
import { ProductCategory } from '../models/product-category';

export enum ProductCategoryActionTypes {
  CategoriesRequested = '[Admin Product Form] Categories Requested',
  CategoriesLoaded = '[Categories Service] Categories Loaded'
}

export class CategoriesRequested implements Action {
  readonly type = ProductCategoryActionTypes.CategoriesRequested;
}

export class CategoriesLoaded implements Action {
  readonly type = ProductCategoryActionTypes.CategoriesLoaded;

  constructor(public payload: {categories: ProductCategory[]}) { }
}

export type ProductCategoryActions =
CategoriesRequested |
CategoriesLoaded;
