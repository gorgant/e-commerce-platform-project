import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ShoppingCartState } from './shopping-cart.reducers';

import * as fromCart from './shopping-cart.reducers';

// This string for the selector defines the property name exposed in the Ngrx devtools, must match StoreModule.forFeature selector in module
export const selectShoppingCartState = createFeatureSelector<ShoppingCartState>('cartItems');

// This selector queries an NgRx entity
export const selectCartItemById = (cartItemId: string) => createSelector(
  selectShoppingCartState,
  // This scans the entity array and returns the cart item if it is there, otherwise undefined
  shoppingCartState => shoppingCartState.entities[cartItemId]
);

export const selectAllCartItems = createSelector(
  selectShoppingCartState,
  fromCart.selectAll
);

export const selectAllCartItemsLoaded = createSelector(
  selectShoppingCartState,
  shoppingCartState => shoppingCartState.allCartItemsLoaded
);

export const selectCartItemQuantity = createSelector(
  selectShoppingCartState,
  shoppingCartState => shoppingCartState.cartItemQuantity
);

export const selectCartTotalPrice = createSelector(
  selectShoppingCartState,
  shoppingCartState => shoppingCartState.cartTotalPrice
);
