import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, tap, map } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { isLoggedIn } from 'src/app/core/auth.selectors';

// Provided in shared module to prevent circular dependencies
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
    private store: Store<AppState>,
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      // return this.auth.appUser$.pipe(
      //   take(1),
      //   map(user => !!user),
      //   tap(loggedIn => {
      //     if (!loggedIn) {
      //       console.log('access denied');
      //       this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      //     }
      //   })
      // );
      return this.store
        .pipe(
          select(isLoggedIn),
          tap(loggedIn => {
            if (!loggedIn) {
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            }
          })
        );
    }

}


