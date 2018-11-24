import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromCourse from './product-category.reducers';
import { ProductCategoryState } from './product-category.reducers';

// This string for the selector defines the property name exposed in the Ngrx devtools, must match StoreModule.forFeature selector in module
export const selectProductCategoryState = createFeatureSelector<ProductCategoryState>('product-categories');

export const selectAllProductCategories = createSelector(
  selectProductCategoryState,
  fromCourse.selectAll
);

export const allProductCategoriesLoaded = createSelector(
  selectProductCategoryState,
  productCategoriesState => productCategoriesState.categoriesLoaded
);
