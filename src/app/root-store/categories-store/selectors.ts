import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';
import { State } from './state';
import * as fromCategory from './reducer';
import { ProductCategory } from 'src/app/shared/models/product-category';

// This string for the selector defines the property name exposed in the Ngrx devtools, must match StoreModule.forFeature selector in module
export const selectCategoryState: MemoizedSelector<object, State>
= createFeatureSelector<State>('categories');

export const selectAllCategories: (state: object) => ProductCategory[] = createSelector(
  selectCategoryState,
  fromCategory.selectAll
);

// This selector queries an NgRx entity
export const selectCategoryById: (productId: string) => MemoizedSelector<object, ProductCategory>
= (categoryId: string) => createSelector(
  selectCategoryState,
  // This scans the entity array and returns the product if it is there, otherwise undefined
  categoryState => categoryState.entities[categoryId]
);

export const selectCategoriesLoading: MemoizedSelector<object, boolean> = createSelector(
  selectCategoryState,
  categoriesState => categoriesState.categoriesLoading
);

export const selectFilterCategoryValue: MemoizedSelector<object, string> = createSelector(
  selectCategoryState,
  categoriesState => categoriesState.filterCategoryId
);

export const selectCategoryError: MemoizedSelector<object, any> = createSelector(
  selectCategoryState,
  categoriesState => categoriesState.error
);
