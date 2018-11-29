import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';
import * as fromAuth from './auth.reducer';


// This is known as a feature selector
// These selector functions take a slice of state (better than using map directly on the store observable)
// These selector functions have memory and won't calculate new outputs if they are called with the same input arguments
export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const isLoggedIn = createSelector(
  selectAuthState,
  auth => auth.loggedIn
);

// export const isLoggedOut = createSelector(
//   isLoggedIn,
//   loggedIn => !loggedIn
// );
