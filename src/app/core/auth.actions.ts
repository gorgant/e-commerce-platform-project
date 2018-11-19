import { Action } from '@ngrx/store';
import { AppUser } from '../shared/models/app-user';

export enum AuthActionTypes {
  LoginAction = '[Login] Login',
  LogoutAction = '[BS Navbar] Logout'
}

export class Login implements Action {
  readonly type = AuthActionTypes.LoginAction;

  constructor(public payload: {user: AppUser}) {

  }
}

export class Logout implements Action {
  readonly type = AuthActionTypes.LogoutAction;
}

export type AuthActions = Login | Logout;
