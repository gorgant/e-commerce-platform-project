
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../models/product';
import { ProductActions, ProductActionTypes } from './product.actions';

export interface ProductsState extends EntityState<Product> {

}

export const adapter: EntityAdapter<Product> =
  createEntityAdapter<Product>();

export const initialProductsState: ProductsState = adapter.getInitialState();

export function productsReducer(state, action: ProductActions): ProductsState {
  switch (action.type) {
    case ProductActionTypes.ProductLoaded:
      return adapter.addOne(action.payload.product, state);
    default: {
      return state;
    }
  }
}

