import { createSelector } from '@ngrx/store';


// This is known as a feature selector
// These selector functions take a slice of state (better than using map directly on the store observable)
// These selector functions have memory and won't calculate new outputs if they are called with the same input arguments
export const selectAuthState = state => state.auth;

export const isLoggedIn = createSelector(
  selectAuthState,
  auth => auth.loggedIn
);

// export const isLoggedOut = createSelector(
//   isLoggedIn,
//   loggedIn => !loggedIn
// );
