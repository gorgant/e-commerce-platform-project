import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProductCategory } from '../models/product-category';
import { ProductCategoryActions, CategoryActionTypes } from './category.actions';

export interface CategoryState extends EntityState<ProductCategory> {
  categoriesLoaded: boolean;
  filterCategoryValue: string;
}

export const adapter: EntityAdapter<ProductCategory> =
  createEntityAdapter<ProductCategory>();

const initialCategoryState = adapter.getInitialState({
  categoriesLoaded: false,
  filterCategoryValue: 'allCategories'
});

export function productCategoriesReducer(state = initialCategoryState, action: ProductCategoryActions): CategoryState {
  switch (action.type) {

    case CategoryActionTypes.CategoryLoaded:
      return adapter.addOne(action.payload.category, state);

    case CategoryActionTypes.AllCategoriesLoaded:
      return adapter.addAll(action.payload.categories, {...state, categoriesLoaded: true});

    case CategoryActionTypes.FilterCategorySelected:
      return {...state, filterCategoryValue: action.payload.categoryId};

    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
