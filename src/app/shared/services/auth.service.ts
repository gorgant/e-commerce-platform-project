import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { switchMap, take, map, tap} from 'rxjs/operators';
import { auth } from 'firebase';
import { SharedModule } from '../shared.module';
import { UserService, User } from './user.service';


@Injectable({
  providedIn: SharedModule
})
export class AuthService {

  user$: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService
    ) {

      //// Get auth data, then get firestore user document || null
      this.user$ = this.afAuth.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.userService.retrieveUserData(user);
          } else {
            return of(null);
          }
        })
      );
    }

  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credentials) => {
        this.userService.storeUserData(credentials.user);
      });
  }

  signOut() {
    this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['/']);
      });
  }
}
