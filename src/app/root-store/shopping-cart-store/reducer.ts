import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.ALL_CART_ITEMS_REQUESTED:
      // Toggle the allCoursesLoaded value when this action is triggered
      return {
        ...state,
        cartItemsLoading: true
      };

    case ActionTypes.ALL_CART_ITEMS_LOADED:
      // Toggle the allCoursesLoaded value when this action is triggered
      return featureAdapter.addAll(
        action.payload.cartItems,
        {
          ...state,
          cartItemsLoading: false
        }
      );

    case ActionTypes.INCREMENT_CART_ITEM_COMPLETE:
      return featureAdapter.updateOne(
        action.payload.cartItem,
        state
      );

    case ActionTypes.DECREMENT_CART_ITEM_COMPLETE:
      return featureAdapter.updateOne(
        action.payload.cartItem,
        state
      );

    case ActionTypes.ADD_CART_ITEM_COMPLETE:
      return featureAdapter.addOne(
        action.payload.cartItem,
        state
      );

    case ActionTypes.DELETE_CART_ITEM_COMPLETE:
      return featureAdapter.removeOne(
        action.payload.cartItemId,
        state
      );

    case ActionTypes.EMPTY_CART_COMPLETE:
      return featureAdapter.removeAll(
        state
      );

    case ActionTypes.CART_QUANTITY_SET:
      return {
        ...state,
        cartItemQuantity: action.payload.cartItemQuantity
      };

    case ActionTypes.CART_TOTAL_PRICE_SET:
      return {
        ...state,
        cartTotalPrice: action.payload.cartTotalPrice
      };

    case ActionTypes.LOAD_ERROR_DETECTED:
      return {
        ...state,
        error: action.payload.error,
        cartItemsLoading: false
      };

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
} = featureAdapter.getSelectors();
