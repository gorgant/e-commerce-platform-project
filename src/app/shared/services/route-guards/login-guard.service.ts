import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router, CanActivate } from '@angular/router';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreActions } from 'src/app/root-store';

@Injectable()
export class LoginGuardService implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private store$: Store<RootStoreState.State>
  ) { }

  canActivate() {
    return this.authService.firebaseUser$.
      pipe(map(user => {
        // The firebaseuser determines if user is logged in
        // If logged in, block the route with a redirect
        if (user) {
          // User data saved to store in the nav bar component rather than here
          console.log('User detected', user);
          const returnUrl = localStorage.getItem('returnUrl');
          // Route user to returnUrl, if none, go to profile
          if (returnUrl && returnUrl !== '/') {
            this.router.navigate([returnUrl]);
          } else {
            this.router.navigate(['/auth/profile']);
          }
          return false;
        }
        return true;
      }));
  }
}
