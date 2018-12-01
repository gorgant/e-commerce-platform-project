import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Product } from 'src/app/shared/models/product';

export const featureAdapter: EntityAdapter<Product> =
  createEntityAdapter<Product>(
    {
      selectId: (product: Product) => product.productId,
    }
  );

export interface State extends EntityState<Product> {
  productsLoading?: boolean;
  error: string;
}

export const initialState: State = featureAdapter.getInitialState(
  {
    productsLoading: false,
    error: null
  }
);
