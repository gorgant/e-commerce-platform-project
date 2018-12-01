import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { auth } from 'firebase';
import { UserService } from './user.service';
import { AppUser } from '../models/app-user';
import { ActivatedRoute } from '@angular/router';
import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';
import { LoginComplete } from 'src/app/core/auth.actions';
import * as firebase from 'firebase';

// Provided in shared module to prevent circular dependencies
@Injectable()
export class AuthService {

  firebaseUser$: Observable<firebase.User>;
  // appUser$: Observable<AppUser>;

  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private route: ActivatedRoute,
    private store: Store<AppState>

    ) {
      // This is used to set the initial login state in the Store
      this.firebaseUser$ = this.afAuth.authState;
    }

  login() {
    // Store return URL (set by auth guard if blocked) if the user request was blocked by login
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    // The actions taking place after this completes are in the app component
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithRedirect(provider);

    // // Wait for redirect results, then dispatch login to store
    // this.afAuth.auth.getRedirectResult().then( result => {
    //   const firebaseUser = result.user;
    //   console.log('Storing firebase user in database', firebaseUser);
    //   this.userService.storeUserData(firebaseUser);
    //   console.log('Storing firebase user in local storage', firebaseUser);
    //   localStorage.setItem('user', JSON.stringify(firebaseUser));
    //   this.userService.retrieveUserData(firebaseUser).subscribe( appUser => {
    //     console.log('Dispatching login complete');
    //     this.store.dispatch(new LoginComplete({user: appUser}));
    //   });
    // });
  }


  // get appUser$(): Observable<AppUser> {
  //   // Retreive user data from Firebase
  //   return this.afAuth.authState.pipe(
  //     switchMap(user => {
  //       if (user) {
  //         return this.userService.retrieveUserData(user);
  //       } else {
  //         return of(null);
  //       }
  //     })
  //   );
  // }

  // signOut() {
  //   this.afAuth.auth.signOut();
  // }

  logout() {
    this.afAuth.auth.signOut();
  }
}
