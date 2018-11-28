import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router, CanActivate } from '@angular/router';
import { UserService } from './user.service';
import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';
import { LoginComplete } from 'src/app/core/auth.actions';

// See: https://firebase.googleblog.com/2018/03/cleanse-your-angular-components.html

@Injectable()
export class LoginRedirectGuardService implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private userService: UserService,
    private store: Store<AppState>
  ) { }

  canActivate() {
    return this.afAuth.auth.getRedirectResult().then( result => {
      const firebaseUser = result.user;
      if (firebaseUser != null) {
        console.log('Storing firebase user in database', firebaseUser);
        this.userService.storeUserData(firebaseUser);
        console.log('Storing firebase user in local storage', firebaseUser);
        localStorage.setItem('user', JSON.stringify(firebaseUser));
        this.userService.retrieveUserData(firebaseUser).subscribe( appUser => {
          console.log('Dispatching login complete');
          this.store.dispatch(new LoginComplete({user: appUser}));
        });

        const returnUrl = localStorage.getItem('returnUrl');
        if (!returnUrl) {
          this.router.navigateByUrl('/');
        } else {
          localStorage.removeItem('returnUrl');
          this.router.navigateByUrl(returnUrl);
        }
        return false;
      }
      return true;
    });
  }
}
