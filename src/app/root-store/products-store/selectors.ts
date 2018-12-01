import { MemoizedSelector, createFeatureSelector, createSelector } from '@ngrx/store';
import { State } from './state';
import * as fromProduct from './reducer';
import { Product } from 'src/app/shared/models/product';

// This string for the selector defines the property name exposed in the Ngrx devtools, must match StoreModule.forFeature selector in module
export const selectProductsState: MemoizedSelector<object, State>
= createFeatureSelector<State>('products');

// These long type definitions might look confusing at first
export const selectAllProducts: (state: object) => Product[] = createSelector(
  selectProductsState,
  fromProduct.selectAll
);

// This selector queries an NgRx entity
export const selectProductById: (productId: string) => MemoizedSelector<object, Product>
= (productId: string) => createSelector(
  selectProductsState,
  // This scans the entity array and returns the product if it is there, otherwise undefined
  productsState => productsState.entities[productId]
);

export const selectProductsLoading: MemoizedSelector<object, boolean> = createSelector(
  selectProductsState,
  productsState => productsState.productsLoading
);

export const selectFilteredProducts: (categoryId: string) => MemoizedSelector<object, Product[]> = (categoryId: string) => createSelector(
  selectAllProducts,
  allProducts => {
    // If no category selected, return all products (which is set in the product-filter component)
    if (categoryId === 'allCategories') {
      return allProducts;
    } else {
      return allProducts
        .filter(product => product.categoryId === categoryId);
    }
  }
);

export const selectProductError: MemoizedSelector<object, any> = createSelector(
  selectProductsState,
  productState => productState.error
);
