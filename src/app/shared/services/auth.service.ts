import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as firebase from 'firebase';
import { RootStoreState, ShoppingCartStoreActions } from 'src/app/root-store';

// Provided in shared module to prevent circular dependencies
@Injectable()
export class AuthService {

  private currentFirebaseUser$: Observable<firebase.User>;
  private loggedInStatus: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute,
    ) {
      // This is used to set the initial login state in the Store
      this.currentFirebaseUser$ = this.afAuth.authState;
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.loggedInStatus = true;
        } else {
          this.loggedInStatus = false;
        }
      });
    }

  login() {
    // Store return URL (set by auth guard if blocked) if the user request was blocked by login
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);

    // The actions taking place after this completes are in the app component
    const provider = new firebase.auth.GoogleAuthProvider();
    this.afAuth.auth.signInWithRedirect(provider);
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  get isLoggedIn() {
    return this.loggedInStatus;
  }

  get firebaseUser$() {
    return this.currentFirebaseUser$;
  }
}
