import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthActionTypes, LoginComplete, LogoutComplete } from './auth.actions';
import { tap, mergeMap, map, switchMap } from 'rxjs/operators';
import { defer, Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../reducers';
import { UserService } from '../shared/services/user.service';
import { AuthService } from '../shared/services/auth.service';
import * as firebase from 'firebase';

// Make sure to add the EffectsModule.forRoot to the app.module!
@Injectable()
export class AuthEffects {

  // // Dispatch: false indicates no action is produced by this side effect
  // @Effect({dispatch: false})
  // login$ = this.actions$.pipe(
  //   // Filters for this specific action type
  //   ofType<LoginComplete>(AuthActionTypes.LoginComplete),
  //   // Do the side effect
  //   tap(action => {
  //     return localStorage.setItem('user', JSON.stringify(action.payload.user));
  //   })
  // );

  // // Dispatch: false indicates no action is produced by this side effect
  // @Effect()
  // login$ = this.actions$.pipe(
  //   // Filters for this specific action type
  //   ofType<LoginRequested>(AuthActionTypes.LoginRequested),
  //   mergeMap(action => {
  //     // this.authService.login();
  //     // return firebase.auth().getRedirectResult().then( result => {
  //     //   const firebaseUser = result.user;
  //     //   console.log('Storing firebase user in database', firebaseUser);
  //     //   this.userService.storeUserData(firebaseUser);
  //     //   console.log('Storing firebase user in local storage', firebaseUser);
  //     //   localStorage.setItem('user', JSON.stringify(firebaseUser));
  //     //   return this.userService.retrieveUserData(firebaseUser);
  //     // });
  //     // return this.authService.firebaseUser$.pipe(switchMap(user => {
  //     //   console.log('Storing firebase user in database', user);
  //     //   this.userService.storeUserData(user);
  //     //   console.log('Storing firebase user in local storage', user);
  //     //   localStorage.setItem('user', JSON.stringify(user));
  //     //   return this.userService.retrieveUserData(user);
  //     // }));
  //   }),
  //   switchMap(user => {
  //     return user;
  //   }),
  //   map(user => new LoginComplete({user}))
  // );

  @Effect({dispatch: false})
  logout$ = this.actions$.pipe(
    ofType<LogoutComplete>(AuthActionTypes.LogoutComplete),
    tap(() => {
      console.log('Removing user from local storage');
      localStorage.removeItem('user');
    })
  );

  // // This init$ is a special observable naming convention that fires whenever the class is created
  // // Note that this side effect DOES product a new action (Login or Logout) as a result of logging in or out of the app
  // @Effect()
  // // Defer is used to wait for someone to subscribe to an observable (or in this case,
  // // initializing the class) before creating a separate one
  // init$ = defer((): Observable<LoginComplete | LogoutComplete> => {
  //   const userData = localStorage.getItem('user');
  //   if (userData) {
  //     return of(new LoginComplete({user: JSON.parse(userData)}));
  //   } else {
  //     return of(new LogoutComplete());
  //   }
  // });

  // The action observable emits a new value each time an action is dispatched
  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private userService: UserService,
    private authService: AuthService
    ) {}
}
