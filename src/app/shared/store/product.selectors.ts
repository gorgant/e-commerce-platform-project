import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './product.reducers';


export const selectProductsState = createFeatureSelector<ProductsState>('courses');

// This selector queries an NgRx entity
export const selectProductById = (productId: number) => createSelector(
  selectProductsState,
  // This scans the entity array and returns the course if it is there, otherwise undefined
  productsState => productsState.entities[productId]
);
