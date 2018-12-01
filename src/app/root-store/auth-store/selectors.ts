import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector
} from '@ngrx/store';

import { State } from './state';
import { AppUser } from 'src/app/shared/models/app-user';

const getError = (state: State): any => state.error;

const getIsLoading = (state: State): boolean => state.isLoading;

const getUser = (state: State): any => state.user;

export const selectAuthState: MemoizedSelector<
  object,
  State
> = createFeatureSelector<State>('auth');

export const selectAuthError: MemoizedSelector<object, any> = createSelector(
  selectAuthState,
  getError
);

export const selectAuthIsLoading: MemoizedSelector<object, boolean> = createSelector(
  selectAuthState,
  getIsLoading
);

export const selectAppUser: MemoizedSelector<object, AppUser> = createSelector(
  selectAuthState,
  getUser
);
