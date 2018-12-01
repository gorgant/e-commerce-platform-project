import { Actions, ActionTypes } from './actions';
import { initialState, State } from './state';

export function featureReducer(state = initialState, action: Actions): State {
   switch (action.type) {

    case ActionTypes.SAVE_LOGIN_DATA_REQUESTED:
      return {
        ...state,
        error: null,
        isLoading: true
      };

    case ActionTypes.SAVE_LOGIN_DATA_COMPLETED:
      return {
        ...state,
        user: action.payload.user,
        error: null,
        isLoading: false,
      };

    case ActionTypes.SAVE_LOGIN_DATA_FAILED:
      return {
        ...state,
        error: action.payload.error,
        isLoading: false
      };

    case ActionTypes.LOGGED_OUT:
      return {
        ...state,
        user: null
      };

    default: {
        return state;
    }
  }
 }
