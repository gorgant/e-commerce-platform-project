
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from '../models/product';
import { ProductActions, ProductActionTypes } from './product.actions';

export interface ProductsState extends EntityState<Product> {
  // This is a custom addition to the EntityState that also needs to be initialized below
  allProductsLoaded: boolean;
}

export const adapter: EntityAdapter<Product> =
  createEntityAdapter<Product>({
    selectId: (product: Product) => product.productId,
  });

export const initialProductsState: ProductsState = adapter.getInitialState({
  allProductsLoaded: false
});

export function productsReducer(state = initialProductsState, action: ProductActions): ProductsState {
  switch (action.type) {

    case ProductActionTypes.ProductLoaded:
      // This will add an entity to the state, it takes from payload, adds course to entity state map,
      // and will add ID to the separate id array (the second part of the entity adapter that preserves the order of the courses)
      return adapter.addOne(action.payload.product, state);

    case ProductActionTypes.AllProductsLoaded:
      // Toggle the allCoursesLoaded value when this action is triggered
      return adapter.addAll(action.payload.products, {...state, allProductsLoaded: true});

    case ProductActionTypes.ProductUpdated:
      return adapter.updateOne(action.payload.product, state);

    default: {
      return state;
    }
  }
}

// Ngrx style convention encourages entity selectors in the reducer file

// Exporting a variety of selectors in the form of a object from the entity adapter
export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
