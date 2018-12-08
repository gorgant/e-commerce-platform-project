import { Action } from '@ngrx/store';
import { ProductCategory } from 'src/app/shared/models/product-category';

export enum ActionTypes {
  ALL_CATEGORIES_REQUESTED = '[Nav Bar] All Categories Requested',
  ALL_CATEGORIES_LOADED = '[Categories API] All Categories Loaded',
  LOAD_ERROR_DETECTED = '[Categories API] Error Loading Categories',
  FILTER_CATEGORY_SELECTED = '[Product Filter] Filter Category Selected'
}

export class AllCategoriesRequested implements Action {
  readonly type = ActionTypes.ALL_CATEGORIES_REQUESTED;
}

export class AllCategoriesLoaded implements Action {
  readonly type = ActionTypes.ALL_CATEGORIES_LOADED;

  constructor(public payload: {categories: ProductCategory[]}) { }
}

export class LoadErrorDetected implements Action {
  readonly type = ActionTypes.LOAD_ERROR_DETECTED;

  constructor(public payload: {error: string}) {}
}

export class FilterCategorySelected implements Action {
  readonly type = ActionTypes.FILTER_CATEGORY_SELECTED;

  constructor(public payload: {categoryId: string}) { }
}

export type Actions =
AllCategoriesRequested |
AllCategoriesLoaded |
LoadErrorDetected |
FilterCategorySelected;
