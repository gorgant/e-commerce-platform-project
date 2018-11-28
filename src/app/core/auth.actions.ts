import { Action } from '@ngrx/store';
import { AppUser } from '../shared/models/app-user';

export enum AuthActionTypes {
  LoginRequested = '[Login] Login Requested',
  LoginComplete = '[Auth API] Login Complete',
  LogoutRequested = '[BS Navbar] Logout Requested',
  LogoutComplete = '[Auth API] Logout Complete'
}

export class LoginRequested implements Action {
  readonly type = AuthActionTypes.LoginRequested;
}

export class LoginComplete implements Action {
  readonly type = AuthActionTypes.LoginComplete;

  constructor(public payload: {user: AppUser}) {}
}

export class LogoutRequested implements Action {
  readonly type = AuthActionTypes.LogoutRequested;
}

export class LogoutComplete implements Action {
  readonly type = AuthActionTypes.LogoutComplete;
}

export type AuthActions =
LoginRequested |
LoginComplete |
LogoutRequested |
LogoutComplete;
