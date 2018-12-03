import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as featureActions from './actions';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Injectable()
export class AuthStoreEffects {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private actions$: Actions,
    private router: Router,
    ) {}

  @Effect()
  saveLoginDataRequestedEffect$: Observable<Action> = this.actions$.pipe(
    // This is fired in the login-guard after redirect is complete
    ofType<featureActions.SaveLoginDataRequestedAction>(
      featureActions.ActionTypes.SAVE_LOGIN_DATA_REQUESTED
    ),
    switchMap(action => {
      console.log('Submitting request to user service');
      // This submits data to Firestore and returns the user from Firestore
      return this.userService.altStoreUserData(action.payload.user).pipe(
            map(
              user => {
                console.log('Dispatching Login Success', user);
                return new featureActions.SaveLoginDataCompletedAction({user});
              }
            ),
              catchError(error =>
                observableOf(new featureActions.SaveLoginDataFailedAction({ error }))
              )
          );
    })
  );

  @Effect({dispatch: false})
  logOutEffect$: Observable<Action> = this.actions$.pipe(
    ofType<featureActions.LoggedOut>(
      featureActions.ActionTypes.LOGGED_OUT
    ),
    tap(action => {
      console.log('Submitting logout request to auth service');
      this.authService.logout();
      this.router.navigate(['']);
    })
  );

}
