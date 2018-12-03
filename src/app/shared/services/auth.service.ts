import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as firebase from 'firebase';

// Provided in shared module to prevent circular dependencies
@Injectable()
export class AuthService {

  firebaseUser$: Observable<firebase.User>;

  constructor(
    private afAuth: AngularFireAuth,
    private route: ActivatedRoute
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
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
