import { Action } from '@ngrx/store';
import { ProductCategory } from '../models/product-category';

export enum CategoryActionTypes {
  CategoryRequested = '[Product Filter] Category Requested',
  CategoryLoaded = '[Categories API] Category Loaded',
  AllCategoriesRequested = '[Admin Product Form] All Categories Requested',
  AllCategoriesLoaded = '[Categories API] All Categories Loaded'
}

export class CategoryRequested implements Action {
  readonly type = CategoryActionTypes.CategoryRequested;

  constructor(public payload: {categoryId: string}) {}
}

export class CategoryLoaded implements Action {
  readonly type = CategoryActionTypes.CategoryLoaded;

  constructor(public payload: {category: ProductCategory}) {}
}

export class AllCategoriesRequested implements Action {
  readonly type = CategoryActionTypes.AllCategoriesRequested;
}

export class AllCategoriesLoaded implements Action {
  readonly type = CategoryActionTypes.AllCategoriesLoaded;

  constructor(public payload: {categories: ProductCategory[]}) { }
}

export type ProductCategoryActions =
CategoryRequested |
CategoryLoaded |
AllCategoriesRequested |
AllCategoriesLoaded;
