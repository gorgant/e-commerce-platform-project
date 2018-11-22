import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './product.reducers';

// This string for the selector defines the property name exposed in the Ngrx devtools, must match StoreModule.forFeature selector in module
export const selectProductsState = createFeatureSelector<ProductsState>('products');

// This selector queries an NgRx entity
export const selectProductById = (productId: string) => createSelector(
  selectProductsState,
  // This scans the entity array and returns the product if it is there, otherwise undefined
  productsState => productsState.entities[productId]
);

