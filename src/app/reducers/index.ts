import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';

import { storeFreeze } from 'ngrx-store-freeze';

import { environment } from '../../environments/environment';
import { routerReducer } from '@ngrx/router-store';

// tslint:disable-next-line:no-empty-interface
export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer

};


// metaReducers are applied after all reducer functions have been applied
export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [storeFreeze] : [];
