
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { CartActionTypes, CartItemActions } from './shopping-cart.actions';

export interface ShoppingCartState extends EntityState<ShoppingCartItem> {
  // This is a custom addition to the EntityState that also needs to be initialized below
  allCartItemsLoaded: boolean;
  cartItemQuantity: number;
  cartTotalPrice: number;
}

export const adapter: EntityAdapter<ShoppingCartItem> =
  createEntityAdapter<ShoppingCartItem>({
    selectId: (cartItem: ShoppingCartItem) => cartItem.cartItemId,
  });

export const initialShoppingCartState: ShoppingCartState = adapter.getInitialState({
  allCartItemsLoaded: false,
  cartItemQuantity: 0,
  cartTotalPrice: 0,
});

export function cartItemsReducer(state = initialShoppingCartState, action: CartItemActions): ShoppingCartState {
  switch (action.type) {

    case CartActionTypes.CartItemLoaded:
      // This will add an entity to the state, it takes from payload, adds course to entity state map,
      // and will add ID to the separate id array (the second part of the entity adapter that preserves the order of the courses)
      return adapter.addOne(action.payload.cartItem, state);

    case CartActionTypes.AllCartItemsRequested:
      // Toggle the allCoursesLoaded value when this action is triggered
      return {...state, allCartItemsLoaded: false};

    case CartActionTypes.AllCartItemsLoaded:
    // Toggle the allCoursesLoaded value when this action is triggered
    return adapter.addAll(action.payload.cartItems, {...state, allCartItemsLoaded: true});

    case CartActionTypes.UpdateCartItemProductComplete:
      return adapter.updateOne(action.payload.cartItem, state);

    case CartActionTypes.IncrementCartItemComplete:
      return adapter.updateOne(action.payload.cartItem, state);

    case CartActionTypes.DecrementCartItemComplete:
      return adapter.updateOne(action.payload.cartItem, state);

    case CartActionTypes.AddCartItemComplete:
      return adapter.addOne(action.payload.cartItem, state);

    case CartActionTypes.DeleteCartItemComplete:
      return adapter.removeOne(action.payload.cartItemId, state);

    case CartActionTypes.EmptyCartComplete:
      return adapter.removeAll(state);

    case CartActionTypes.CartQuantitySet:
      return {...state, cartItemQuantity: action.payload.cartItemQuantity};

    case CartActionTypes.CartTotalPriceSet:
      return {...state, cartTotalPrice: action.payload.cartTotalPrice};

    case CartActionTypes.UpsertOfflineCartItemsComplete:
      return adapter.upsertMany(action.payload.offlineCartItems, state);

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
