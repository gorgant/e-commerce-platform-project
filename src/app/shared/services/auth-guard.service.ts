import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AppState } from 'src/app/reducers';
import { Store, select } from '@ngrx/store';
import { isLoggedIn } from 'src/app/core/auth.selectors';

// Provided in shared module to prevent circular dependencies
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private store: Store<AppState>,
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.store
        .pipe(
          select(isLoggedIn),
          tap(loggedIn => {
            if (!loggedIn) {
              console.log('Preserving queryParams', state.url);
              this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
            }
          })
        );
    }

}


