import { createFeatureSelector, MemoizedSelector, createSelector } from '@ngrx/store';
import { State } from './state';
import * as fromShoppingCart from './reducer';
import { ShoppingCartItem } from 'src/app/shared/models/shopping-cart-item';

// This string for the selector defines the property name exposed in the Ngrx devtools, must match StoreModule.forFeature selector in module
export const selectShoppingCartState: MemoizedSelector<object, State>
= createFeatureSelector<State>('shoppingCart');

// These long type definitions might look confusing at first
export const selectAllCartItems: (state: object) => ShoppingCartItem[]  = createSelector(
  selectShoppingCartState,
  fromShoppingCart.selectAll
);

// This selector queries an NgRx entity
export const selectCartItemById: (cartItemId: string) => MemoizedSelector<object, ShoppingCartItem> =
(cartItemId: string) => createSelector(
  selectShoppingCartState,
  // This scans the entity array and returns the cart item if it is there, otherwise undefined
  shoppingCartState => shoppingCartState.entities[cartItemId]
);

export const selectCartItemsLoading: MemoizedSelector<object, boolean> = createSelector(
  selectShoppingCartState,
  shoppingCartState => shoppingCartState.cartItemsLoading
);

export const selectCartItemQuantity: MemoizedSelector<object, number> = createSelector(
  selectShoppingCartState,
  shoppingCartState => shoppingCartState.cartItemQuantity
);

export const selectCartTotalPrice: MemoizedSelector<object, number> = createSelector(
  selectShoppingCartState,
  shoppingCartState => shoppingCartState.cartTotalPrice
);

export const selectShoppingCartError: MemoizedSelector<object, any> = createSelector(
  selectShoppingCartState,
  shoppingCartState => shoppingCartState.error
);
