import { Action } from '@ngrx/store';
import { AppUser } from '../shared/models/app-user';

export enum AuthActionTypes {
  LoginAction = '[Login] Login',
  LogoutAction = '[Logout] Logout'
}

export class Login implements Action {
  readonly type = AuthActionTypes.LoginAction;

  constructor(public payload: {user: AppUser}) {

  }
}

export type AuthActions = Login;
