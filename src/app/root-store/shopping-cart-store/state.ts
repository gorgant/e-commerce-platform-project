import { EntityAdapter, createEntityAdapter, EntityState } from '@ngrx/entity';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';

export const featureAdapter: EntityAdapter<ShoppingCartItem> =
  createEntityAdapter<ShoppingCartItem>(
    {
      selectId: (cartItem: ShoppingCartItem) => cartItem.cartItemId,
    }
  );

export interface State extends EntityState<ShoppingCartItem> {
  cartItemsLoading?: boolean;
  cartItemQuantity: number;
  cartTotalPrice: number;
  error: string;
}



export const initialState: State = featureAdapter.getInitialState(
  {
    cartItemsLoading: false,
    cartItemQuantity: 0,
    cartTotalPrice: 0,
    error: null
  }
);
