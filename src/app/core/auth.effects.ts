import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Login, AuthActionTypes, Logout } from './auth.actions';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { defer, Observable, of } from 'rxjs';

// Make sure to add the EffectsModule.forRoot to the app.module!
@Injectable()
export class AuthEffects {

  // Dispatch: false indicates no action is produced by this side effect
  @Effect({dispatch: false})
  login$ = this.actions$.pipe(
    // Filters for this specific action type
    ofType<Login>(AuthActionTypes.LoginAction),
    // Do the side effect
    tap(action => localStorage.setItem('user', JSON.stringify(action.payload.user)))
  );

  @Effect({dispatch: false})
  logout$ = this.actions$.pipe(
    ofType<Logout>(AuthActionTypes.LogoutAction),
    tap(() => {
      localStorage.removeItem('user');
    })
  );

  // This init$ is a special observable naming convention that fires whenever the class is created
  // Note that this side effect DOES product a new action (Login or Logout) as a result of logging in or out of the app
  @Effect()
  // Defer is used to wait for someone to subscribe to an observable (or in this case,
  // initializing the class) before creating a separate one
  init$ = defer((): Observable<Login | Logout> => {
    const userData = localStorage.getItem('user');
    if (userData) {
      return of(new Login({user: JSON.parse(userData)}));
    } else {
      return of(new Logout());
    }
  });

  // The action observable emits a new value each time an action is dispatched
  constructor(
    private actions$: Actions,
    private router: Router
    ) {}
}
