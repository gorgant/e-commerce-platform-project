
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../models/product';
import { ProductActions, ProductActionTypes } from './product.actions';

export interface ProductsState extends EntityState<Product> {

}

export const adapter: EntityAdapter<Product> =
  createEntityAdapter<Product>();

export const initialProductsState: ProductsState = adapter.getInitialState();

export function productsReducer(state = initialProductsState, action: ProductActions): ProductsState {
  switch (action.type) {
    case ProductActionTypes.ProductLoaded:
      // This will add an entity to the state, it takes from payload, adds course to entity state map,
      // and will add ID to the separate id array (the second part of the entity adapter that preserves the order of the courses)
      return adapter.addOne(action.payload.product, state);
    default: {
      return state;
    }
  }
}

