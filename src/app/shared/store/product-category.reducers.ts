import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProductCategory } from '../models/product-category';
import { ProductCategoryActions, ProductCategoryActionTypes } from './product-category.actions';

export interface ProductCategoryState extends EntityState<ProductCategory> {
  categoriesLoaded: boolean;
}

export const adapter: EntityAdapter<ProductCategory> =
  createEntityAdapter<ProductCategory>();

const initialProductCategoryState = adapter.getInitialState({
  categoriesLoaded: false
});

export function productCategoriesReducer(state = initialProductCategoryState, action: ProductCategoryActions): ProductCategoryState {
  switch (action.type) {

    case ProductCategoryActionTypes.CategoriesLoaded:
      return adapter.addAll(action.payload.categories, {...state, categoriesLoaded: true});

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
