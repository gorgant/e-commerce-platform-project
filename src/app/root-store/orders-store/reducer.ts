import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.ORDER_LOADED:
      // This will add an entity to the state, it takes from payload, adds course to entity state map,
      // and will add ID to the separate id array (the second part of the entity adapter that preserves the order of the courses)
      return featureAdapter.addOne(
        action.payload.order,
        state
      );

    case ActionTypes.ALL_ORDERS_REQUESTED:
      return {
        ...state,
        ordersLoading: true
      };

    case ActionTypes.ALL_ORDERS_LOADED:
      return featureAdapter.addAll(
        action.payload.orders,
        {
          ...state,
          ordersLoading: false
        }
      );

    case ActionTypes.CUSTOMER_ORDERS_REQUESTED:
      return {
        ...state,
        ordersLoading: true
      };

    case ActionTypes.CUSTOMER_ORDERS_LOADED:
      return featureAdapter.addAll(
        action.payload.orders,
        {
          ...state,
          ordersLoading: false
        }
      );

    case ActionTypes.LOAD_ERROR_DETECTED:
      return {
        ...state,
        error: action.payload.error,
        ordersLoading: false
      };

    case ActionTypes.UPDATE_ORDER_COMPLETE:
      return featureAdapter.updateOne(
        action.payload.order,
        state
      );

    case ActionTypes.ADD_ORDER_COMPLETE:
      return featureAdapter.addOne(
        action.payload.order,
        state
      );

    case ActionTypes.DELETE_ORDER_COMPLETE:
      return featureAdapter.removeOne(
        action.payload.orderId,
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
