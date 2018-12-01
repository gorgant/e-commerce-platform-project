import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.PRODUCT_LOADED:
      // This will add an entity to the state, it takes from payload, adds course to entity state map,
      // and will add ID to the separate id array (the second part of the entity adapter that preserves the order of the courses)
      return featureAdapter.addOne(
        action.payload.product,
        state
      );

    case ActionTypes.ALL_PRODUCTS_REQUESTED:
      return {
        ...state,
        productsLoading: true
      };

    case ActionTypes.ALL_PRODUCTS_LOADED:
      // Toggle the allCoursesLoaded value when this action is triggered
      return featureAdapter.addAll(
        action.payload.products,
        {
          ...state,
          productsLoading: false
        }
      );

    case ActionTypes.LOAD_ERROR_DETECTED:
      return {
        ...state,
        error: action.payload.error,
        productsLoading: false
      };

    case ActionTypes.UPDATE_PRODUCT_COMPLETE:
      return featureAdapter.updateOne(
        action.payload.product,
        state
      );

    case ActionTypes.ADD_PRODUCT_COMPLETE:
      return featureAdapter.addOne(
        action.payload.product,
        state
      );

    case ActionTypes.DELETE_PRODUCT_COMPLETE:
      return featureAdapter.removeOne(
        action.payload.productId,
        state
      );

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
