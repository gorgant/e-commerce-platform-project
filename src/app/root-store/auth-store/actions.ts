import { Action } from '@ngrx/store';
import { AppUser } from 'src/app/shared/models/app-user';

export enum ActionTypes {
  SAVE_LOGIN_DATA_REQUESTED = '[Login Guard] Login Requested',
  SAVE_LOGIN_DATA_FAILED = '[Auth Effects] Login Failed',
  SAVE_LOGIN_DATA_COMPLETED = '[Auth Effects] Login Completed',
  LOGGED_OUT = '[Profile Page] Logged Out'
}

export class SaveLoginDataRequestedAction implements Action {
  readonly type = ActionTypes.SAVE_LOGIN_DATA_REQUESTED;
  constructor(public payload: { user: firebase.User }) {}
}

export class SaveLoginDataFailedAction implements Action {
  readonly type = ActionTypes.SAVE_LOGIN_DATA_FAILED;
  constructor(public payload: { error: string }) {}
}

export class SaveLoginDataCompletedAction implements Action {
  readonly type = ActionTypes.SAVE_LOGIN_DATA_COMPLETED;
  constructor(public payload: { user: AppUser }) {}
}

export class LoggedOut implements Action {
  readonly type = ActionTypes.LOGGED_OUT;
}

export type Actions =
SaveLoginDataRequestedAction |
SaveLoginDataFailedAction |
SaveLoginDataCompletedAction |
LoggedOut;
