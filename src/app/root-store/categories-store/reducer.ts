import { initialState, featureAdapter, State } from './state';
import { ActionTypes, Actions } from './actions';

export function featureReducer(state = initialState, action: Actions): State {
  switch (action.type) {

    case ActionTypes.CATEGORY_LOADED:
      return featureAdapter.addOne(
        action.payload.category,
        state
      );

    case ActionTypes.ALL_CATEGORIES_REQUESTED:
      return {
        ...state,
        categoriesLoading: true
      };

    case ActionTypes.ALL_CATEGORIES_LOADED:
      return featureAdapter.addAll(
        action.payload.categories,
        {
          ...state,
          categoriesLoading: false
        }
      );

    case ActionTypes.LOAD_ERROR_DETECTED:
      return {
        ...state,
        error: action.payload.error,
        categoriesLoading: false
      };

    case ActionTypes.FILTER_CATEGORY_SELECTED:
      return {
        ...state,
        filterCategoryId: action.payload.categoryId
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
