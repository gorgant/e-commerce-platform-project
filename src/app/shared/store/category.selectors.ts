import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromCategory from './category.reducers';
import { CategoryState } from './category.reducers';

// This string for the selector defines the property name exposed in the Ngrx devtools, must match StoreModule.forFeature selector in module
export const selectCategoryState = createFeatureSelector<CategoryState>('categories');

// This selector queries an NgRx entity
export const selectCategoryById = (categoryId: string) => createSelector(
  selectCategoryState,
  // This scans the entity array and returns the product if it is there, otherwise undefined
  categoryState => categoryState.entities[categoryId]
);

export const selectAllCategories = createSelector(
  selectCategoryState,
  fromCategory.selectAll
);

export const allCategoriesLoaded = createSelector(
  selectCategoryState,
  categoriesState => categoriesState.categoriesLoaded
);

export const selectFilterCategoryValue = createSelector(
  selectCategoryState,
  categoriesState => categoriesState.filterCategoryId
);
