import { initialState, State, featureAdapter } from './state';
import { Actions, ActionTypes } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.ALL_ORDER_STATUSES_REQUESTED:
      return {
        ...state,
        orderStatusesLoading: true
      };

    case ActionTypes.ALL_ORDER_STATUSES_LOADED:
      return featureAdapter.addAll(
        action.payload.orderStatuses,
        {
          ...state,
          orderStatusesLoading: false
        }
      );

    case ActionTypes.LOAD_ERROR_DETECTED:
      return {
        ...state,
        error: action.payload.error,
        orderStatusesLoading: false
      };

    case ActionTypes.ORDER_STATUS_SELECTED:
      return {
        ...state,
        filterOrderStatusId: action.payload.orderStatusId
      };

    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = featureAdapter.getSelectors();
