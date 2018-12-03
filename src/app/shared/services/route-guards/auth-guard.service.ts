import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { RootStoreState, AuthStoreSelectors } from 'src/app/root-store';

// Provided in shared module to prevent circular dependencies
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private router: Router,
    private store$: Store<RootStoreState.State>
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
      return this.store$.select(AuthStoreSelectors.selectAppUser).pipe(
        map(user => {
          if (user) {
            return true;
          } else {
            console.log('Access denied -- must log in first', state.url);
            this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
          }
        })
      );
    }
}
